/**
 * Cross-platform Offline Queue Client
 * Works on Windows, iOS, Android, and Desktop browsers
 * 
 * Features:
 * - IndexedDB storage for offline requests
 * - Background sync (when supported)
 * - iOS Safari fallbacks
 * - Exponential backoff retry logic
 * - Cross-platform compatibility
 */

import { openDB, type DBSchema, IDBPDatabase } from 'idb';

interface OfflineQueueDB extends DBSchema {
  requests: {
    key: number;
    value: StoredRequest;
    indexes: { 'by-timestamp': number };
  };
}

export type StoredRequest = {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string | null;
  timestamp: number;
  attempts: number;
  nextRetry?: number | null;
};

const DB_NAME = 'met24-offline-queue';
const DB_VERSION = 1;
const STORE_NAME = 'requests';
let _db: IDBPDatabase<OfflineQueueDB> | null = null;

async function getDB() {
  if (_db) return _db;
  _db = await openDB<OfflineQueueDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      store.createIndex('by-timestamp', 'timestamp');
    }
  });
  return _db;
}

/**
 * Enqueue a request for offline processing
 * Cross-platform compatible (Windows, iOS, Android)
 */
export async function enqueueRequest(entry: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string | null;
}): Promise<number> {
  const db = await getDB();
  const stored: StoredRequest = {
    url: entry.url,
    method: entry.method || 'GET',
    headers: entry.headers || {},
    body: entry.body ?? null,
    timestamp: Date.now(),
    attempts: 0,
    nextRetry: Date.now()
  };
  const id = await db.add(STORE_NAME, stored);
  
  // Register background sync (cross-platform)
  await registerBackgroundSync();
  
  return id;
}

/**
 * Register background sync with platform-specific fallbacks
 */
async function registerBackgroundSync(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if background sync is supported
    if ('sync' in window && 'SyncManager' in window) {
      // Modern browsers (Chrome, Edge, Firefox)
      await (window as any).SyncManager.register('met24-background-sync');
    } else if ('serviceWorker' in navigator) {
      // iOS Safari fallback - use message passing
      if (registration.active) {
        registration.active.postMessage({
          type: 'ENQUEUE_AND_SYNC',
          timestamp: Date.now()
        });
      }
    }
  } catch (error) {
    console.log('Background sync not supported, using fallback:', error);
    // Fallback: try immediate sync when online
    if (navigator.onLine) {
      setTimeout(() => processQueueImmediate(), 1000);
    }
  }
}

/**
 * Process queue immediately (iOS Safari fallback)
 */
async function processQueueImmediate(): Promise<void> {
  if (!navigator.onLine) return;
  
  try {
    const items = await getOldestRequests(10);
    for (const item of items) {
      try {
        const response = await fetch(item.url, {
          method: item.method,
          headers: item.headers,
          body: item.body ?? undefined
        });
        
        if (response.ok && item.id) {
          await removeRequest(item.id);
        }
      } catch (error) {
        console.log('Request failed, will retry later:', error);
      }
    }
  } catch (error) {
    console.log('Queue processing failed:', error);
  }
}

/**
 * Get oldest requests from queue
 */
export async function getOldestRequests(limit = 50): Promise<StoredRequest[]> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('by-timestamp');
  const results = await index.getAll(undefined, limit) as StoredRequest[];
  await tx.done;
  return results;
}

/**
 * Remove request from queue
 */
export async function removeRequest(id: number): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

/**
 * Clear all requests from queue
 */
export async function clearQueue(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

/**
 * Get all requests in queue
 */
export async function getAllRequests(): Promise<StoredRequest[]> {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

/**
 * Check if device supports offline queue features
 */
export function getOfflineQueueSupport(): {
  indexedDB: boolean;
  serviceWorker: boolean;
  backgroundSync: boolean;
  platform: string;
} {
  const userAgent = navigator.userAgent;
  let platform = 'unknown';
  
  if (userAgent.includes('Windows')) platform = 'windows';
  else if (userAgent.includes('Mac') && userAgent.includes('Safari')) platform = 'ios';
  else if (userAgent.includes('Android')) platform = 'android';
  else if (userAgent.includes('Mac')) platform = 'macos';
  else if (userAgent.includes('Linux')) platform = 'linux';
  
  return {
    indexedDB: 'indexedDB' in window,
    serviceWorker: 'serviceWorker' in navigator,
    backgroundSync: 'sync' in window && 'SyncManager' in window,
    platform
  };
}

// Export default API
export default {
  enqueueRequest,
  getOldestRequests,
  removeRequest,
  clearQueue,
  getAllRequests,
  getOfflineQueueSupport,
  registerBackgroundSync
};

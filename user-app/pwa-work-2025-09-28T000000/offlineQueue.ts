import { openDB, type DBSchema, IDBPDatabase } from 'idb';

/**
 * Simple IndexedDB-backed offline request queue helper using `idb`.
 * Usage (client):
 *  - await enqueue({ url, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
 *  - The service worker should call `processQueue(sendFn)` on `sync` event.
 *
 * This module keeps the queue logic generic: it stores requests as serializable
 * objects (url, method, headers, body) and exposes helpers to enqueue and
 * process/dequeue with a provided sender function.
 */

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

const DB_NAME = 'pwa-offline-queue';
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

export async function enqueue(entry: {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string | null;
}) {
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
  return id;
}

export async function getAll() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function getOldest(limit = 50) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const index = tx.store.index('by-timestamp');
  // Use getAll on the index which is supported by fake-indexeddb
  const results = await index.getAll(undefined, limit) as StoredRequest[];
  await tx.done;
  return results;
}

export async function remove(id: number) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clear() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}

/**
 * Attempt to process queued requests using a provided sender function.
 * sendFn must accept a StoredRequest and return a Promise resolving to a Response-like object
 * with a boolean `ok` property (like Fetch Response). Example sendFn uses fetch(
 *   new Request(r.url, { method: r.method, headers: r.headers, body: r.body })
 * )
 */
const MAX_ATTEMPTS = 5;
const BACKOFF_BASE_MS = 1000; // base for exponential backoff

function computeBackoff(attempts: number) {
  // exponential backoff with jitter
  const exp = Math.pow(2, attempts);
  const jitter = Math.floor(Math.random() * 1000);
  return Math.min(60 * 60 * 1000, exp * BACKOFF_BASE_MS + jitter);
}

export async function processQueue(sendFn: (r: StoredRequest) => Promise<{ ok: boolean }>) {
  const items = await getOldest(100);
  const now = Date.now();
  for (const item of items) {
    // skip until nextRetry
    if (item.nextRetry && item.nextRetry > now) {
      continue;
    }

    // if already exceeded max attempts, remove and skip
    if (item.attempts >= MAX_ATTEMPTS) {
      if (item.id) await remove(item.id);
      continue;
    }

    try {
      const result = await sendFn(item);
      if (result && result.ok) {
        if (item.id) await remove(item.id);
      } else {
        // increment attempts and schedule nextRetry
        if (item.id) await incrementAttempts(item.id);
      }
    } catch (err) {
      // network error — increment attempts and set nextRetry
      if (item.id) await incrementAttempts(item.id);
    }
  }
}

export async function incrementAttempts(id: number) {
  const db = await getDB();
  const rec = await db.get(STORE_NAME, id);
  if (!rec) return;
  rec.attempts = (rec.attempts || 0) + 1;
  rec.timestamp = Date.now();
  const backoff = computeBackoff(rec.attempts);
  rec.nextRetry = Date.now() + backoff;
  // If we've exceeded attempts, leave nextRetry null so processing can remove it
  if (rec.attempts >= MAX_ATTEMPTS) {
    rec.nextRetry = null;
  }
  await db.put(STORE_NAME, rec);
}

/**
 * Helper to create a Request object from StoredRequest (useful inside service worker)
 */
export function toRequest(stored: StoredRequest) {
  const init: RequestInit = {
    method: stored.method,
    headers: stored.headers,
    body: stored.body ?? undefined
  };
  return new Request(stored.url, init);
}

// Export default small API
export default {
  enqueue,
  getAll,
  clear,
  remove,
  processQueue,
  incrementAttempts,
  toRequest
};

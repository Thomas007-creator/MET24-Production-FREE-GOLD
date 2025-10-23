/**
 * React Hook for Offline Queue Management
 * Cross-platform compatible (Windows, iOS, Android, Desktop)
 */

import { useState, useEffect, useCallback } from 'react';
import offlineQueueClient, { type StoredRequest } from '../lib/offlineQueueClient';

export interface OfflineQueueStatus {
  isOnline: boolean;
  queuedRequests: number;
  support: {
    indexedDB: boolean;
    serviceWorker: boolean;
    backgroundSync: boolean;
    platform: string;
  };
  lastSync: Date | null;
}

export function useOfflineQueue() {
  const [status, setStatus] = useState<OfflineQueueStatus>({
    isOnline: navigator.onLine,
    queuedRequests: 0,
    support: offlineQueueClient.getOfflineQueueSupport(),
    lastSync: null
  });

  // Update online status
  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update queue count
  const updateQueueCount = useCallback(async () => {
    try {
      const requests = await offlineQueueClient.getAllRequests();
      setStatus(prev => ({ ...prev, queuedRequests: requests.length }));
    } catch (error) {
      console.error('Failed to get queue count:', error);
    }
  }, []);

  // Enqueue a request
  const enqueueRequest = useCallback(async (request: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string | null;
  }) => {
    try {
      const id = await offlineQueueClient.enqueueRequest(request);
      await updateQueueCount();
      return id;
    } catch (error) {
      console.error('Failed to enqueue request:', error);
      throw error;
    }
  }, [updateQueueCount]);

  // Clear queue
  const clearQueue = useCallback(async () => {
    try {
      await offlineQueueClient.clearQueue();
      await updateQueueCount();
    } catch (error) {
      console.error('Failed to clear queue:', error);
    }
  }, [updateQueueCount]);

  // Get queued requests
  const getQueuedRequests = useCallback(async (): Promise<StoredRequest[]> => {
    try {
      return await offlineQueueClient.getAllRequests();
    } catch (error) {
      console.error('Failed to get queued requests:', error);
      return [];
    }
  }, []);

  // Manual sync (for iOS Safari fallback)
  const manualSync = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          registration.active.postMessage({
            type: 'ENQUEUE_AND_SYNC',
            timestamp: Date.now()
          });
        }
      }
      setStatus(prev => ({ ...prev, lastSync: new Date() }));
    } catch (error) {
      console.error('Failed to trigger manual sync:', error);
    }
  }, []);

  // Update queue count on mount and when coming online
  useEffect(() => {
    updateQueueCount();
    
    if (status.isOnline) {
      // Trigger sync when coming back online
      setTimeout(() => {
        manualSync();
      }, 1000);
    }
  }, [status.isOnline, updateQueueCount, manualSync]);

  return {
    status,
    enqueueRequest,
    clearQueue,
    getQueuedRequests,
    manualSync,
    updateQueueCount
  };
}

/**
 * Hook for making offline-aware API calls
 */
export function useOfflineAPI() {
  const { enqueueRequest, status } = useOfflineQueue();

  const makeRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // If online, try direct request first
    if (status.isOnline) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
        // If request failed, fall through to offline queue
      } catch (error) {
        console.log('Direct request failed, queuing for offline:', error);
      }
    }

    // Queue request for offline processing
    const requestId = await enqueueRequest({
      url,
      method: options.method || 'GET',
      headers: options.headers as Record<string, string> || {},
      body: options.body ? JSON.stringify(options.body) : null
    });

    // Return a mock response for offline requests
    return new Response(JSON.stringify({
      success: false,
      offline: true,
      queued: true,
      requestId,
      message: 'Request queued for offline processing'
    }), {
      status: 202,
      headers: { 'Content-Type': 'application/json' }
    });
  }, [enqueueRequest, status.isOnline]);

  return {
    makeRequest,
    isOnline: status.isOnline,
    queuedRequests: status.queuedRequests
  };
}

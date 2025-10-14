/**
 * Service Worker with Cross-Platform Offline Queue Support
 * Compatible with Windows, iOS Safari, Android, and Desktop browsers
 */

const CACHE_NAME = 'met24-offline-queue-v1';
const DB_NAME = 'met24-offline-queue';
const STORE_NAME = 'requests';

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Background sync event - process offline queue
self.addEventListener('sync', (event) => {
  console.log('Background sync event:', event.tag);
  
  if (event.tag === 'met24-background-sync' || event.tag.startsWith('retry-')) {
    event.waitUntil(processOfflineQueue());
  }
});

// Message event - handle iOS Safari fallbacks
self.addEventListener('message', (event) => {
  if (!event.data) return;
  
  if (event.data.type === 'ENQUEUE_AND_SYNC') {
    console.log('Received enqueue message, processing queue...');
    event.waitUntil(processOfflineQueue());
  }
  
  if (event.data.type === 'GET_QUEUE_STATUS') {
    event.waitUntil(getQueueStatus().then(status => {
      event.ports[0].postMessage(status);
    }));
  }
});

// Process offline queue with cross-platform compatibility
async function processOfflineQueue() {
  try {
    console.log('Processing offline queue...');
    
    // Open IndexedDB
    const db = await openIndexedDB();
    const tx = db.transaction([STORE_NAME], 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('by-timestamp');
    
    // Get oldest requests
    const requests = await index.getAll(undefined, 20);
    console.log(`Found ${requests.length} queued requests`);
    
    for (const request of requests) {
      try {
        // Create fetch request
        const fetchRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body ?? undefined
        });
        
        // Attempt to send request
        const response = await fetch(fetchRequest);
        
        if (response.ok) {
          // Success - remove from queue
          await store.delete(request.id);
          console.log(`Successfully sent request to ${request.url}`);
        } else {
          // Failed - increment attempts
          await incrementAttempts(store, request);
          console.log(`Request to ${request.url} failed with status ${response.status}`);
        }
      } catch (error) {
        // Network error - increment attempts
        await incrementAttempts(store, request);
        console.log(`Network error for ${request.url}:`, error);
      }
    }
    
    await tx.done;
    console.log('Queue processing completed');
    
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
}

// Increment attempt count with exponential backoff
async function incrementAttempts(store, request) {
  const MAX_ATTEMPTS = 5;
  const BACKOFF_BASE_MS = 1000;
  
  request.attempts = (request.attempts || 0) + 1;
  request.timestamp = Date.now();
  
  if (request.attempts >= MAX_ATTEMPTS) {
    // Max attempts reached - remove from queue
    await store.delete(request.id);
    console.log(`Request ${request.id} exceeded max attempts, removing`);
  } else {
    // Calculate backoff delay
    const backoff = Math.min(60 * 60 * 1000, Math.pow(2, request.attempts) * BACKOFF_BASE_MS);
    request.nextRetry = Date.now() + backoff;
    
    // Update request
    await store.put(request);
    console.log(`Request ${request.id} will retry in ${backoff}ms`);
  }
}

// Open IndexedDB with cross-platform compatibility
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-timestamp', 'timestamp');
      }
    };
  });
}

// Get queue status for debugging
async function getQueueStatus() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction([STORE_NAME], 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const count = await store.count();
    
    return {
      queuedRequests: count,
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      queuedRequests: 0,
      error: error.message,
      timestamp: Date.now()
    };
  }
}

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests for caching
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Serve from cache when offline
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            // Return offline page if available
            return caches.match('/offline.html');
          });
      })
  );
});

console.log('Service Worker with Offline Queue loaded');

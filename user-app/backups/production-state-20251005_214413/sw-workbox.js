/**
 * Workbox Service Worker for MET24 PWA
 * Advanced caching strategies with offline queue integration
 */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

// Precache and route all build assets
precacheAndRoute(self.__WB_MANIFEST);

// Clean up outdated caches
cleanupOutdatedCaches();

// Background sync for offline queue
const bgSyncPlugin = new BackgroundSyncPlugin('met24-offline-queue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

// API calls - Network First with background sync
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
    plugins: [
      bgSyncPlugin,
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60 // 5 minutes
      })
    ]
  })
);

// Supabase API calls - Network First
registerRoute(
  ({ url }) => url.hostname.includes('supabase.co'),
  new NetworkFirst({
    cacheName: 'supabase-cache',
    networkTimeoutSeconds: 15,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 10 * 60 // 10 minutes
      })
    ]
  })
);

// Images - Stale While Revalidate
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
      })
    ]
  })
);

// Static assets - Cache First
registerRoute(
  ({ request }) => 
    request.destination === 'script' || 
    request.destination === 'style' ||
    request.destination === 'font',
  new CacheFirst({
    cacheName: 'static-assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
      })
    ]
  })
);

// HTML pages - Network First
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'html-cache',
    networkTimeoutSeconds: 5,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60 // 24 hours
      })
    ]
  })
);

// Google Fonts - Cache First
registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
      })
    ]
  })
);

// Handle offline queue processing
self.addEventListener('sync', (event) => {
  if (event.tag === 'met24-offline-queue') {
    event.waitUntil(processOfflineQueue());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received:', event);
  
  if (event.data) {
    const payload = event.data.json();
    console.log('📱 Push payload:', payload);
    
    const options = {
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/badge-72x72.png',
      tag: payload.tag || 'met24-notification',
      data: payload.data || {},
      actions: payload.actions || [],
      requireInteraction: payload.requireInteraction || false,
      silent: payload.silent || false,
      timestamp: payload.timestamp || Date.now()
    };
    
    event.waitUntil(
      self.registration.showNotification(payload.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event);
  
  event.notification.close();
  
  // Handle different notification types
  const data = event.notification.data || {};
  const action = event.action;
  
  let url = '/';
  
  if (action) {
    // Handle action button clicks
    switch (action) {
      case 'view':
        url = data.url || '/';
        break;
      case 'dismiss':
        return; // Just close the notification
      default:
        url = '/';
    }
  } else {
    // Handle notification body click
    switch (data.type) {
      case 'action_plan':
        url = '/action-plans';
        break;
      case 'wellness_check':
        url = '/wellness';
        break;
      case 'therapy_session':
        url = '/therapy';
        break;
      case 'goal_achievement':
        url = '/goals';
        break;
      default:
        url = '/';
    }
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        
        // Open new window if app is not open
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
  
  // Notify main thread about notification click
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NOTIFICATION_CLICK',
        payload: { data, action, url }
      });
    });
  });
});

// Process offline queue from IndexedDB
async function processOfflineQueue() {
  try {
    console.log('Processing offline queue...');
    
    // Open IndexedDB
    const db = await openIndexedDB();
    const tx = db.transaction(['requests'], 'readwrite');
    const store = tx.objectStore('requests');
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

// Open IndexedDB
async function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('met24-offline-queue', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('requests')) {
        const store = db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
        store.createIndex('by-timestamp', 'timestamp');
      }
    };
  });
}

// Handle messages from main thread
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

// Get queue status for debugging
async function getQueueStatus() {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(['requests'], 'readonly');
    const store = tx.objectStore('requests');
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

console.log('Workbox Service Worker with Offline Queue loaded');

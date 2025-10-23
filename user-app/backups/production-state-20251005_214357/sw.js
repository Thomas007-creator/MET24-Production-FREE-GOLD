// Service Worker voor MainView PWA
// AI Achtergrond Processing & Push Notifications

const CACHE_NAME = 'mainview-pwa-v1.0.2';
const STATIC_CACHE = 'mainview-static-v1.0.2';
const DYNAMIC_CACHE = 'mainview-dynamic-v1.0.2';

// AI Background Processing Types
const AI_TASKS = {
  AI_1: 'mbti_analysis',
  AI_2: 'wellness_assessment',
  AI_3: 'action_plan_generation',
  AI_4: 'context_analysis',
  AI_5: 'notification_processing'
};

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('🤖 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching static assets');
        // Precache only stable, hash-agnostic assets. Avoid dev-only bundle paths.
        return cache.addAll([
          '/',
          '/manifest.json'
        ]);
      })
      .then(() => {
        console.log('✅ Service Worker: Installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed:', error);
      })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🤖 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - Serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Always prefer network for JS to avoid stale dev bundles
  if (
    request.destination === 'script' ||
    request.headers.get('accept')?.includes('text/javascript') ||
    request.url.includes('/static/js/')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Handle API requests differently
  if (request.url.includes('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          console.log('📦 Serving from cache:', request.url);
          return response;
        }
        
        console.log('🌐 Fetching from network:', request.url);
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          });
      })
      .catch(() => {
        // Fallback for offline
        console.log('📱 Offline fallback for:', request.url);
        return caches.match('/');
      })
  );
});

// Handle API requests with background sync
function handleApiRequest(request) {
  return fetch(request)
    .then((response) => {
      if (!response.ok) {
        throw new Error('API request failed');
      }
      return response;
    })
    .catch((error) => {
      console.log('🔄 Queueing failed API request for background sync');
      // Queue for background sync
      return queueForBackgroundSync(request);
    });
}

// Background Sync for failed requests
function queueForBackgroundSync(request) {
  return new Promise((resolve) => {
    // Store failed request in IndexedDB for later retry
    const failedRequest = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB (simplified)
    console.log('💾 Queued request for background sync:', failedRequest);
    
    // Return a placeholder response
    resolve(new Response(JSON.stringify({ 
      status: 'queued', 
      message: 'Request queued for background sync' 
    }), {
      headers: { 'Content-Type': 'application/json' }
    }));
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nieuwe AI inzichten beschikbaar!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Bekijk inzichten',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Sluiten',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MainView AI Coach', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app to show AI insights
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  } else if (event.tag.startsWith('ai-task-')) {
    event.waitUntil(performAITask(event.tag));
  }
});

// Perform background sync
async function performBackgroundSync() {
  console.log('🔄 Performing background sync...');
  
  try {
    // Get queued requests from IndexedDB
    const queuedRequests = await getQueuedRequests();
    
    for (const request of queuedRequests) {
      try {
        await fetch(request.url, {
          method: request.method,
          headers: request.headers
        });
        console.log('✅ Synced request:', request.url);
      } catch (error) {
        console.error('❌ Failed to sync request:', request.url, error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Perform AI background tasks
async function performAITask(taskTag) {
  console.log('🤖 Performing AI task:', taskTag);
  
  const taskType = taskTag.replace('ai-task-', '');
  
  try {
    switch (taskType) {
      case AI_TASKS.AI_1:
        await performMBTIAnalysis();
        break;
      case AI_TASKS.AI_2:
        await performWellnessAssessment();
        break;
      case AI_TASKS.AI_3:
        await performActionPlanGeneration();
        break;
      case AI_TASKS.AI_4:
        await performContextAnalysis();
        break;
      case AI_TASKS.AI_5:
        await performNotificationProcessing();
        break;
      default:
        console.log('❌ Unknown AI task:', taskType);
    }
  } catch (error) {
    console.error('❌ AI task failed:', taskType, error);
  }
}

// AI Task 1: MBTI Analysis
async function performMBTIAnalysis() {
  console.log('🧠 AI Task 1: Performing MBTI analysis...');
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Send notification when complete
  await self.registration.showNotification('MainView AI Coach', {
    body: 'MBTI analyse voltooid! Bekijk je nieuwe inzichten.',
    icon: '/icon-192x192.png',
    tag: 'mbti-analysis-complete'
  });
}

// AI Task 2: Wellness Assessment
async function performWellnessAssessment() {
  console.log('💚 AI Task 2: Performing wellness assessment...');
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Send notification when complete
  await self.registration.showNotification('MainView AI Coach', {
    body: 'Welzijnsassessment voltooid! Nieuwe aanbevelingen beschikbaar.',
    icon: '/icon-192x192.png',
    tag: 'wellness-assessment-complete'
  });
}

// AI Task 3: Action Plan Generation
async function performActionPlanGeneration() {
  console.log('📋 AI Task 3: Generating action plan...');
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Send notification when complete
  await self.registration.showNotification('MainView AI Coach', {
    body: 'Persoonlijk actieplan gegenereerd! Klaar voor implementatie.',
    icon: '/icon-192x192.png',
    tag: 'action-plan-complete'
  });
}

// AI Task 4: Context Analysis
async function performContextAnalysis() {
  console.log('🔍 AI Task 4: Analyzing context...');
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Send notification when complete
  await self.registration.showNotification('MainView AI Coach', {
    body: 'Context analyse voltooid! Nieuwe inzichten beschikbaar.',
    icon: '/icon-192x192.png',
    tag: 'context-analysis-complete'
  });
}

// AI Task 5: Notification Processing
async function performNotificationProcessing() {
  console.log('🔔 AI Task 5: Processing notifications...');
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Send notification when complete
  await self.registration.showNotification('MainView AI Coach', {
    body: 'Notificaties verwerkt! Persoonlijke updates beschikbaar.',
    icon: '/icon-192x192.png',
    tag: 'notification-processing-complete'
  });
}

// Helper function to get queued requests (simplified)
async function getQueuedRequests() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker received message:', event.data);
  
  const { type, data } = event.data;
  
  switch (type) {
    case 'START_AI_TASK':
      startAITask(data.taskType);
      break;
    case 'REQUEST_NOTIFICATION_PERMISSION':
      requestNotificationPermission();
      break;
    case 'REGISTER_BACKGROUND_SYNC':
      registerBackgroundSync();
      break;
    default:
      console.log('❌ Unknown message type:', type);
  }
});

// Start AI task
async function startAITask(taskType) {
  console.log('🤖 Starting AI task:', taskType);
  
  if ('sync' in self.registration) {
    try {
      await self.registration.sync.register(`ai-task-${taskType}`);
      console.log('✅ AI task registered for background sync');
    } catch (error) {
      console.error('❌ Failed to register AI task:', error);
    }
  } else {
    console.log('⚠️ Background sync not supported, running task immediately');
    await performAITask(`ai-task-${taskType}`);
  }
}

// Request notification permission
async function requestNotificationPermission() {
  console.log('🔔 Requesting notification permission...');
  
  try {
    const permission = await Notification.requestPermission();
    console.log('📱 Notification permission:', permission);
  } catch (error) {
    console.error('❌ Failed to request notification permission:', error);
  }
}

// Register background sync
async function registerBackgroundSync() {
  console.log('🔄 Registering background sync...');
  
  if ('sync' in self.registration) {
    try {
      await self.registration.sync.register('background-sync');
      console.log('✅ Background sync registered');
    } catch (error) {
      console.error('❌ Failed to register background sync:', error);
    }
  } else {
    console.log('⚠️ Background sync not supported');
  }
}

console.log('🤖 Service Worker: Loaded successfully');

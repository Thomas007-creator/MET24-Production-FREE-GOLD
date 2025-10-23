/**
 * Workbox Configuration for MET24 PWA
 * Advanced caching strategies for optimal performance
 */

const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  // Workbox configuration
  workbox: {
    // Service worker generation
    swDest: 'sw-workbox.js',
    
    // Precache configuration
    precache: {
      // Precache all build assets
      globPatterns: [
        '**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff,woff2,ttf,eot}',
        'manifest.json'
      ],
      // Exclude source maps and dev files
      globIgnores: [
        '**/*.map',
        '**/node_modules/**',
        '**/src/**',
        '**/public/**'
      ],
      // Maximum file size to precache (5MB)
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
    },

    // Runtime caching strategies
    runtimeCaching: [
      // API calls - Network First (always try network first)
      {
        urlPattern: /^https:\/\/.*\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
          cacheableResponse: {
            statuses: [0, 200]
          },
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 5 * 60 // 5 minutes
          }
        }
      },

      // Supabase API calls - Network First
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-cache',
          networkTimeoutSeconds: 15,
          cacheableResponse: {
            statuses: [0, 200]
          },
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 10 * 60 // 10 minutes
          }
        }
      },

      // Images - Stale While Revalidate (serve from cache, update in background)
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          }
        }
      },

      // Static assets - Cache First (serve from cache, only network if not cached)
      {
        urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'static-assets-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
          }
        }
      },

      // HTML pages - Network First with fallback
      {
        urlPattern: /\.html$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
          networkTimeoutSeconds: 5,
          cacheableResponse: {
            statuses: [0, 200]
          },
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 24 * 60 * 60 // 24 hours
          }
        }
      },

      // External fonts - Cache First
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
          }
        }
      },

      // External font files - Cache First
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-files-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year
          }
        }
      }
    ],

    // Skip waiting and claim clients immediately
    skipWaiting: true,
    clientsClaim: true,

    // Clean up old caches
    cleanupOutdatedCaches: true,

    // Navigation preload (faster navigation)
    navigationPreload: true,

    // Offline fallback
    offlineGoogleAnalytics: false,

    // Custom service worker template
    template: `
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

      // Register background sync for failed requests
      registerRoute(
        ({ request }) => request.method === 'POST' || request.method === 'PUT',
        new NetworkFirst({
          plugins: [bgSyncPlugin]
        })
      );

      // Handle offline queue processing
      self.addEventListener('sync', (event) => {
        if (event.tag === 'met24-offline-queue') {
          event.waitUntil(processOfflineQueue());
        }
      });

      async function processOfflineQueue() {
        // Process queued requests from IndexedDB
        console.log('Processing offline queue...');
        // Implementation will be handled by our custom offline queue logic
      }
    `
  }
};

/**
 * Workbox Client for MET24 PWA
 * Advanced caching and offline queue integration
 */

interface QueueStatus {
  queuedRequests: number;
  timestamp: number;
  error?: string;
}

class WorkboxClient {
  private registration: ServiceWorkerRegistration | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Initialize Workbox client
   */
  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.ready;
      console.log('✅ Workbox client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Workbox client:', error);
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Back online - processing queue...');
      this.processQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Gone offline - requests will be queued');
    });

    // Service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event);
      });
    }
  }

  /**
   * Handle messages from service worker
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    if (!event.data) return;

    switch (event.data.type) {
      case 'CACHE_UPDATED':
        console.log('🔄 Cache updated:', event.data.payload);
        break;
      case 'OFFLINE_QUEUE_PROCESSED':
        console.log('📤 Offline queue processed:', event.data.payload);
        break;
      case 'CACHE_ERROR':
        console.error('❌ Cache error:', event.data.payload);
        break;
    }
  }

  /**
   * Process offline queue
   */
  async processQueue(): Promise<void> {
    if (!this.registration?.active) {
      console.warn('No active service worker');
      return;
    }

    try {
      this.registration.active.postMessage({
        type: 'ENQUEUE_AND_SYNC'
      });
      console.log('📤 Triggered queue processing');
    } catch (error) {
      console.error('❌ Failed to process queue:', error);
    }
  }

  /**
   * Get queue status
   */
  async getQueueStatus(): Promise<QueueStatus> {
    if (!this.registration?.active) {
      return {
        queuedRequests: 0,
        timestamp: Date.now(),
        error: 'No active service worker'
      };
    }

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      this.registration!.active!.postMessage({
        type: 'GET_QUEUE_STATUS'
      }, [messageChannel.port2]);
    });
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    if (!this.registration) {
      console.warn('No service worker registration');
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('🗑️ All caches cleared');
    } catch (error) {
      console.error('❌ Failed to clear caches:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    
    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
      }
    } catch (error) {
      console.error('❌ Failed to get cache stats:', error);
    }

    return stats;
  }

  /**
   * Preload critical resources
   */
  async preloadCriticalResources(urls: string[]): Promise<void> {
    if (!this.isOnline) {
      console.log('📴 Offline - skipping preload');
      return;
    }

    try {
      const cache = await caches.open('critical-resources-cache');
      
      await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
              console.log(`✅ Preloaded: ${url}`);
            }
          } catch (error) {
            console.warn(`⚠️ Failed to preload: ${url}`, error);
          }
        })
      );
    } catch (error) {
      console.error('❌ Failed to preload critical resources:', error);
    }
  }

  /**
   * Check if resource is cached
   */
  async isResourceCached(url: string): Promise<boolean> {
    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const response = await cache.match(url);
        if (response) {
          return true;
        }
      }
    } catch (error) {
      console.error('❌ Failed to check cache:', error);
    }

    return false;
  }

  /**
   * Get offline status
   */
  isOffline(): boolean {
    return !this.isOnline;
  }

  /**
   * Get service worker registration
   */
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }
}

// Export singleton instance
export const workboxClient = new WorkboxClient();

// Export class for testing
export { WorkboxClient };
export type { QueueStatus };

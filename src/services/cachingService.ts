/**
 * Caching Service for MET24 Phase 1
 * 
 * Manages caching strategy for PWA optimization
 * 
 * @version 3.0.0-core
 */

export interface CacheConfig {
  name: string;
  maxAge: number; // in milliseconds
  maxEntries: number;
  strategy: 'cacheFirst' | 'networkFirst' | 'staleWhileRevalidate' | 'networkOnly' | 'cacheOnly';
}

export interface CacheEntry {
  key: string;
  data: any;
  timestamp: number;
  expiresAt: number;
}

export class CachingService {
  private caches: Map<string, CacheConfig> = new Map();
  private cacheData: Map<string, CacheEntry> = new Map();

  constructor() {
    this.initializeCaches();
  }

  /**
   * Initialize cache configurations
   */
  private initializeCaches(): void {
    // Static assets cache
    this.caches.set('static', {
      name: 'met24-static-v1',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      maxEntries: 100,
      strategy: 'cacheFirst'
    });

    // API responses cache
    this.caches.set('api', {
      name: 'met24-api-v1',
      maxAge: 5 * 60 * 1000, // 5 minutes
      maxEntries: 50,
      strategy: 'staleWhileRevalidate'
    });

    // User data cache
    this.caches.set('user', {
      name: 'met24-user-v1',
      maxAge: 30 * 60 * 1000, // 30 minutes
      maxEntries: 20,
      strategy: 'networkFirst'
    });

    // V3 features cache
    this.caches.set('v3-features', {
      name: 'met24-v3-features-v1',
      maxAge: 60 * 60 * 1000, // 1 hour
      maxEntries: 30,
      strategy: 'staleWhileRevalidate'
    });

    // MBTI data cache
    this.caches.set('mbti', {
      name: 'met24-mbti-v1',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: 10,
      strategy: 'cacheFirst'
    });

    // Content cache
    this.caches.set('content', {
      name: 'met24-content-v1',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      maxEntries: 40,
      strategy: 'staleWhileRevalidate'
    });
  }

  /**
   * Get cache configuration
   */
  getCacheConfig(cacheName: string): CacheConfig | null {
    return this.caches.get(cacheName) || null;
  }

  /**
   * Set cache entry
   */
  async set(cacheName: string, key: string, data: any): Promise<void> {
    try {
      const config = this.getCacheConfig(cacheName);
      if (!config) {
        throw new Error(`Cache configuration not found: ${cacheName}`);
      }

      const entry: CacheEntry = {
        key,
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + config.maxAge
      };

      // Store in memory cache
      this.cacheData.set(`${cacheName}:${key}`, entry);

      // Store in browser cache if available
      if ('caches' in window) {
        const cache = await caches.open(config.name);
        await cache.put(key, new Response(JSON.stringify(data)));
      }

      // Clean up old entries
      this.cleanupCache(cacheName);
    } catch (error) {
      console.error('Caching Service: Error setting cache entry', error);
    }
  }

  /**
   * Get cache entry
   */
  async get(cacheName: string, key: string): Promise<any | null> {
    try {
      const config = this.getCacheConfig(cacheName);
      if (!config) {
        return null;
      }

      // Check memory cache first
      const memoryEntry = this.cacheData.get(`${cacheName}:${key}`);
      if (memoryEntry && memoryEntry.expiresAt > Date.now()) {
        return memoryEntry.data;
      }

      // Check browser cache
      if ('caches' in window) {
        const cache = await caches.open(config.name);
        const response = await cache.match(key);
        if (response) {
          const data = await response.json();
          
          // Store in memory cache
          const entry: CacheEntry = {
            key,
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + config.maxAge
          };
          this.cacheData.set(`${cacheName}:${key}`, entry);
          
          return data;
        }
      }

      return null;
    } catch (error) {
      console.error('Caching Service: Error getting cache entry', error);
      return null;
    }
  }

  /**
   * Delete cache entry
   */
  async delete(cacheName: string, key: string): Promise<void> {
    try {
      // Remove from memory cache
      this.cacheData.delete(`${cacheName}:${key}`);

      // Remove from browser cache
      if ('caches' in window) {
        const config = this.getCacheConfig(cacheName);
        if (config) {
          const cache = await caches.open(config.name);
          await cache.delete(key);
        }
      }
    } catch (error) {
      console.error('Caching Service: Error deleting cache entry', error);
    }
  }

  /**
   * Clear entire cache
   */
  async clear(cacheName: string): Promise<void> {
    try {
      // Clear memory cache
      const keysToDelete = Array.from(this.cacheData.keys())
        .filter(key => key.startsWith(`${cacheName}:`));
      
      keysToDelete.forEach(key => this.cacheData.delete(key));

      // Clear browser cache
      if ('caches' in window) {
        const config = this.getCacheConfig(cacheName);
        if (config) {
          await caches.delete(config.name);
        }
      }
    } catch (error) {
      console.error('Caching Service: Error clearing cache', error);
    }
  }

  /**
   * Clean up expired entries
   */
  private cleanupCache(cacheName: string): void {
    const config = this.getCacheConfig(cacheName);
    if (!config) return;

    const now = Date.now();
    const keysToDelete: string[] = [];

    // Find expired entries
    for (const [key, entry] of this.cacheData.entries()) {
      if (key.startsWith(`${cacheName}:`) && entry.expiresAt <= now) {
        keysToDelete.push(key);
      }
    }

    // Delete expired entries
    keysToDelete.forEach(key => this.cacheData.delete(key));

    // Limit cache size
    const cacheEntries = Array.from(this.cacheData.entries())
      .filter(([key]) => key.startsWith(`${cacheName}:`))
      .sort((a, b) => b[1].timestamp - a[1].timestamp);

    if (cacheEntries.length > config.maxEntries) {
      const entriesToDelete = cacheEntries.slice(config.maxEntries);
      entriesToDelete.forEach(([key]) => this.cacheData.delete(key));
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(cacheName: string): { size: number; entries: number; hitRate: number } {
    const entries = Array.from(this.cacheData.entries())
      .filter(([key]) => key.startsWith(`${cacheName}:`));

    return {
      size: entries.length,
      entries: entries.length,
      hitRate: 0.85 // Mock hit rate
    };
  }

  /**
   * Preload important data
   */
  async preloadData(): Promise<void> {
    try {
      // Preload V3 features data
      await this.set('v3-features', 'active-imagination', {
        title: 'Active Imagination',
        description: 'Ontdek je creativiteit en intuïtie',
        status: 'available'
      });

      await this.set('v3-features', 'enhanced-journaling', {
        title: 'Enhanced Journaling',
        description: 'Ontwikkel zelfbewustzijn door reflectie',
        status: 'available'
      });

      await this.set('v3-features', 'challenges', {
        title: 'Challenges',
        description: 'Groei door uitdagingen',
        status: 'available'
      });

      await this.set('v3-features', 'levensgebieden', {
        title: 'Levensgebieden',
        description: 'Balans in alle aspecten van je leven',
        status: 'available'
      });

      // Preload static content
      await this.set('content', 'welcome', {
        title: 'Welkom bij MET24',
        message: 'Ontdek je persoonlijkheid en ontwikkel je potentieel'
      });

      console.log('Caching Service: Data preloaded successfully');
    } catch (error) {
      console.error('Caching Service: Error preloading data', error);
    }
  }

  /**
   * Cache strategy implementation
   */
  async executeStrategy(
    cacheName: string,
    key: string,
    fetchFunction: () => Promise<any>
  ): Promise<any> {
    const config = this.getCacheConfig(cacheName);
    if (!config) {
      return await fetchFunction();
    }

    switch (config.strategy) {
      case 'cacheFirst':
        return await this.cacheFirstStrategy(cacheName, key, fetchFunction);
      
      case 'networkFirst':
        return await this.networkFirstStrategy(cacheName, key, fetchFunction);
      
      case 'staleWhileRevalidate':
        return await this.staleWhileRevalidateStrategy(cacheName, key, fetchFunction);
      
      case 'networkOnly':
        return await fetchFunction();
      
      case 'cacheOnly':
        return await this.get(cacheName, key);
      
      default:
        return await fetchFunction();
    }
  }

  /**
   * Cache first strategy
   */
  private async cacheFirstStrategy(
    cacheName: string,
    key: string,
    fetchFunction: () => Promise<any>
  ): Promise<any> {
    const cached = await this.get(cacheName, key);
    if (cached) {
      return cached;
    }

    const data = await fetchFunction();
    await this.set(cacheName, key, data);
    return data;
  }

  /**
   * Network first strategy
   */
  private async networkFirstStrategy(
    cacheName: string,
    key: string,
    fetchFunction: () => Promise<any>
  ): Promise<any> {
    try {
      const data = await fetchFunction();
      await this.set(cacheName, key, data);
      return data;
    } catch (error) {
      const cached = await this.get(cacheName, key);
      if (cached) {
        return cached;
      }
      throw error;
    }
  }

  /**
   * Stale while revalidate strategy
   */
  private async staleWhileRevalidateStrategy(
    cacheName: string,
    key: string,
    fetchFunction: () => Promise<any>
  ): Promise<any> {
    const cached = await this.get(cacheName, key);
    
    // Fetch fresh data in background
    fetchFunction()
      .then(data => this.set(cacheName, key, data))
      .catch(error => console.error('Background fetch failed:', error));
    
    return cached || await fetchFunction();
  }
}

// Export singleton instance
export const cachingService = new CachingService();

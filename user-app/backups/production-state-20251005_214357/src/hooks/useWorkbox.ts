/**
 * React Hook for Workbox Integration
 * Provides easy access to Workbox functionality in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { workboxClient, QueueStatus } from '../lib/workboxClient';

interface WorkboxState {
  isOnline: boolean;
  queueStatus: QueueStatus | null;
  cacheStats: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

export const useWorkbox = () => {
  const [state, setState] = useState<WorkboxState>({
    isOnline: navigator.onLine,
    queueStatus: null,
    cacheStats: {},
    isLoading: false,
    error: null
  });

  /**
   * Initialize Workbox client
   */
  const initialize = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await workboxClient.initialize();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, []);

  /**
   * Process offline queue
   */
  const processQueue = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await workboxClient.processQueue();
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to process queue'
      }));
    }
  }, []);

  /**
   * Get queue status
   */
  const getQueueStatus = useCallback(async () => {
    try {
      const status = await workboxClient.getQueueStatus();
      setState(prev => ({ ...prev, queueStatus: status }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to get queue status'
      }));
    }
  }, []);

  /**
   * Get cache statistics
   */
  const getCacheStats = useCallback(async () => {
    try {
      const stats = await workboxClient.getCacheStats();
      setState(prev => ({ ...prev, cacheStats: stats }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to get cache stats'
      }));
    }
  }, []);

  /**
   * Clear all caches
   */
  const clearCaches = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await workboxClient.clearCaches();
      await getCacheStats(); // Refresh stats
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to clear caches'
      }));
    }
  }, [getCacheStats]);

  /**
   * Preload critical resources
   */
  const preloadResources = useCallback(async (urls: string[]) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await workboxClient.preloadCriticalResources(urls);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to preload resources'
      }));
    }
  }, []);

  /**
   * Check if resource is cached
   */
  const isResourceCached = useCallback(async (url: string): Promise<boolean> => {
    try {
      return await workboxClient.isResourceCached(url);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to check cache'
      }));
      return false;
    }
  }, []);

  /**
   * Setup event listeners
   */
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      processQueue(); // Auto-process queue when back online
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [processQueue]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Auto-refresh queue status when online
   */
  useEffect(() => {
    if (state.isOnline) {
      const interval = setInterval(() => {
        getQueueStatus();
        getCacheStats();
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [state.isOnline, getQueueStatus, getCacheStats]);

  return {
    // State
    isOnline: state.isOnline,
    queueStatus: state.queueStatus,
    cacheStats: state.cacheStats,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    initialize,
    processQueue,
    getQueueStatus,
    getCacheStats,
    clearCaches,
    preloadResources,
    isResourceCached,

    // Utilities
    isOffline: () => workboxClient.isOffline(),
    getRegistration: () => workboxClient.getRegistration()
  };
};

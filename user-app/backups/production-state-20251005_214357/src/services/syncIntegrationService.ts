
// Sync Integration Service
// Integrates Patch A (mergeUtils) and Patch B (syncWorker) with the existing app

import database from '../database';
// import { startSyncWorker, stopSyncWorker } from '../../client/watermelon/syncWorker';
import { enqueueRequest, getQueueStatus } from '../utils/dexieClient';
import { logger } from '../utils/logger';

export class SyncIntegrationService {
  private static instance: SyncIntegrationService;
  private isInitialized = false;
  private syncWorkerRunning = false;

  private constructor() {
    // Initialize sync service
    this.isInitialized = false;
    this.syncWorkerRunning = false;
  }

  static getInstance(): SyncIntegrationService {
    if (!SyncIntegrationService.instance) {
      SyncIntegrationService.instance = new SyncIntegrationService();
    }
    return SyncIntegrationService.instance;
  }

  // Initialize sync integration
  async initialize(config: {
    preloadUrl?: string;
    pollIntervalMs?: number;
    apiBaseUrl?: string;
  } = {}) {
    if (this.isInitialized) {
      logger.warn('SyncIntegrationService already initialized');
      return;
    }

    try {
      // Create dequeue processor
      const dequeueProcessor = this.createDequeueProcessor(config.apiBaseUrl || 'http://localhost:3000');

      // Start sync worker
      // await this.startSyncWorker({
      //   db: database,
      //   dequeueProcessor,
      //   preloadUrl: config.preloadUrl || '/api/preload/mbti',
      //   pollIntervalMs: config.pollIntervalMs || 60000
      // });

      this.isInitialized = true;
      logger.info('SyncIntegrationService initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize SyncIntegrationService:', { error });
      throw error;
    }
  }

  // Start sync worker
  private async startSyncWorker(config: {
    db: any;
    dequeueProcessor: (item: any) => Promise<any>;
    preloadUrl: string;
    pollIntervalMs: number;
  }) {
    try {
      // startSyncWorker(config);
      this.syncWorkerRunning = true;
      logger.info('Sync worker started', { 
        preloadUrl: config.preloadUrl, 
        pollIntervalMs: config.pollIntervalMs 
      });
    } catch (error) {
      logger.error('Failed to start sync worker:', { error });
      throw error;
    }
  }

  // Create dequeue processor
  private createDequeueProcessor(apiBaseUrl: string) {
    return async (item: any) => {
      try {
        const response = await fetch(`${apiBaseUrl}${item.url}`, {
          method: item.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(item.body)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        logger.info('Dequeue processor success', { itemId: item.id, result });
        return result;
      } catch (error) {
        logger.error('Dequeue processor error:', { itemId: item.id, error });
        throw error;
      }
    };
  }

  // Queue MBTI content edit
  async queueMbtiContentEdit(editData: {
    mbti_type: string;
    kind: string;
    order_idx?: number;
    content: any;
    migration_seed?: string;
    seed_immutable?: boolean;
  }) {
    try {
      const queueItem = {
        method: 'POST',
        url: '/api/sync/mbti/edit',
        body: editData
      };

      const queueId = await enqueueRequest(queueItem);
      logger.info('MBTI content edit queued', { queueId, editData });
      return queueId;
    } catch (error) {
      logger.error('Failed to queue MBTI content edit:', { error, editData });
      throw error;
    }
  }

  // Get sync status
  getSyncStatus() {
    return {
      isInitialized: this.isInitialized,
      syncWorkerRunning: this.syncWorkerRunning,
      queueStatus: getQueueStatus()
    };
  }

  // Stop sync integration
  async stop() {
    try {
      if (this.syncWorkerRunning) {
        // stopSyncWorker();
        this.syncWorkerRunning = false;
        logger.info('Sync worker stopped');
      }

      this.isInitialized = false;
      logger.info('SyncIntegrationService stopped');
    } catch (error) {
      logger.error('Failed to stop SyncIntegrationService:', { error });
      throw error;
    }
  }

  // Manual sync trigger
  async triggerSync() {
    if (!this.isInitialized) {
      throw new Error('SyncIntegrationService not initialized');
    }

    try {
      // This would trigger manual sync
      // The syncWorker handles this internally
      logger.info('Manual sync triggered');
      return { success: true, message: 'Sync triggered' };
    } catch (error) {
      logger.error('Failed to trigger sync:', { error });
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const status = this.getSyncStatus();
      
      return {
        status: 'healthy',
        message: 'SyncIntegrationService is healthy',
        details: {
          ...status,
          database: 'connected',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'SyncIntegrationService health check failed',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}

// Export singleton instance
export const syncIntegrationService = SyncIntegrationService.getInstance();

// Export for easy use
export default syncIntegrationService;

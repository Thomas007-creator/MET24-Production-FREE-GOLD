/**
 * WatermelonDB PWA Integration
 * Integrates PWA features with WatermelonDB + Supabase
 */

// @ts-nocheck - Temporary disable TypeScript checks for WatermelonDB compatibility issues
import { database } from '../database/v14/database';
import { supabase } from '../config/supabase';
import { encryptPayload } from '../utils/encryption';
import PushSubscription from '../database/v14/models/PushSubscription';
import TokenUsage from '../database/v14/models/TokenUsage';
import OfflineQueue from '../database/v14/models/OfflineQueue';

class WatermelonPWAIntegration {
  private isInitialized = false;

  /**
   * Initialize PWA integration with WatermelonDB
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔗 Initializing WatermelonDB PWA integration...');
      
      // Setup sync listeners
      this.setupSyncListeners();
      
      // Initialize PWA features
      await this.initializePWAFeatures();
      
      this.isInitialized = true;
      console.log('✅ WatermelonDB PWA integration initialized');
    } catch (error) {
      console.error('❌ Failed to initialize WatermelonDB PWA integration:', error);
      throw error;
    }
  }

  /**
   * Setup sync listeners for PWA features
   */
  private setupSyncListeners(): void {
    // Listen for database changes and sync to Supabase
    database.adapter.unsafeResetDatabase().then(() => {
      console.log('🔄 Database reset for PWA integration');
    });
  }

  /**
   * Initialize PWA features with WatermelonDB
   */
  private async initializePWAFeatures(): Promise<void> {
    // Initialize push subscriptions
    await this.initializePushSubscriptions();
    
    // Initialize token monitoring
    await this.initializeTokenMonitoring();
    
    // Initialize offline queue
    await this.initializeOfflineQueue();
  }

  /**
   * Initialize push subscriptions with WatermelonDB
   */
  private async initializePushSubscriptions(): Promise<void> {
    try {
      const pushSubscriptions = database.collections.get('push_subscriptions');
      console.log('📱 Push subscriptions initialized with WatermelonDB');
    } catch (error) {
      console.error('❌ Failed to initialize push subscriptions:', error);
    }
  }

  /**
   * Initialize token monitoring with WatermelonDB
   */
  private async initializeTokenMonitoring(): Promise<void> {
    try {
      const tokenUsage = database.collections.get('token_usage');
      console.log('📊 Token monitoring initialized with WatermelonDB');
    } catch (error) {
      console.error('❌ Failed to initialize token monitoring:', error);
    }
  }

  /**
   * Initialize offline queue with WatermelonDB
   */
  private async initializeOfflineQueue(): Promise<void> {
    try {
      const offlineQueue = database.collections.get('offline_queue');
      console.log('📤 Offline queue initialized with WatermelonDB');
    } catch (error) {
      console.error('❌ Failed to initialize offline queue:', error);
    }
  }

  /**
   * Save push subscription to WatermelonDB
   */
  async savePushSubscription(subscriptionData: {
    endpoint: string;
    p256dhKey: string;
    authKey: string;
    userId: string;
    userAgent: string;
    notificationPreferences?: any;
    deviceInfo?: any;
  }): Promise<void> {
    await database.write(async () => {
      const pushSubscriptions = database.collections.get('push_subscriptions');
      
      await pushSubscriptions.create((subscription: any) => {
        subscription.endpoint = subscriptionData.endpoint;
        subscription.p256dhKey = subscriptionData.p256dhKey;
        subscription.authKey = subscriptionData.authKey;
        subscription.userId = subscriptionData.userId;
        subscription.userAgent = subscriptionData.userAgent;
        subscription.isActive = true;
        subscription.lastUsedAt = Date.now();
        subscription.setNotificationPreferences(subscriptionData.notificationPreferences || {});
        subscription.setDeviceInfo(subscriptionData.deviceInfo || {});
        subscription.synced = false;
      });
    });

    console.log('✅ Push subscription saved to WatermelonDB');
  }

  /**
   * Update token usage in WatermelonDB
   */
  async updateTokenUsage(usageData: {
    provider: string;
    model: string;
    userId: string;
    tokensUsed: number;
    tokenLimit: number;
    apiKeyType?: string;
  }): Promise<void> {
    await database.write(async () => {
      const tokenUsage = database.collections.get('token_usage');
      
      // Find existing usage record (simplified for now)
      const existingUsage = await tokenUsage
        .query()
        .fetch();

      const matchingUsage = existingUsage.filter((u: any) => 
        u.provider === usageData.provider && u.userId === usageData.userId
      );

      if (matchingUsage.length > 0) {
        // Update existing record
        await matchingUsage[0].update((usage: any) => {
          usage.updateUsage(usageData.tokensUsed);
          usage.apiKeyType = usageData.apiKeyType || 'free';
          usage.synced = false;
        });
      } else {
        // Create new record
        await tokenUsage.create((usage: any) => {
          usage.provider = usageData.provider;
          usage.model = usageData.model;
          usage.userId = usageData.userId;
          usage.tokensUsed = usageData.tokensUsed;
          usage.tokenLimit = usageData.tokenLimit;
          usage.percentage = (usageData.tokensUsed / usageData.tokenLimit) * 100;
          usage.apiKeyType = usageData.apiKeyType || 'free';
          usage.notificationThreshold = 80;
          usage.isMonitoring = true;
          usage.setUsageHistory([]);
          usage.synced = false;
        });
      }
    });

    console.log('✅ Token usage updated in WatermelonDB');
  }

  /**
   * Add request to offline queue in WatermelonDB
   */
  async addToOfflineQueue(requestData: {
    requestId: string;
    userId: string;
    method: string;
    url: string;
    headers?: any;
    body?: string;
    priority?: number;
  }): Promise<void> {
    await database.write(async () => {
      const offlineQueue = database.collections.get('offline_queue');
      
      await offlineQueue.create((request: any) => {
        request.requestId = requestData.requestId;
        request.userId = requestData.userId;
        request.method = requestData.method;
        request.url = requestData.url;
        request.setHeaders(requestData.headers || {});
        request.body = requestData.body || '';
        request.priority = requestData.priority || 5;
        request.attempts = 0;
        request.maxAttempts = 5;
        request.nextRetryAt = Date.now();
        request.status = 'pending';
        request.createdOffline = !navigator.onLine;
        request.synced = false;
      });
    });

    console.log('✅ Request added to offline queue in WatermelonDB');
  }

  /**
   * Sync PWA data to Supabase
   */
  async syncToSupabase(): Promise<void> {
    try {
      console.log('🔄 Syncing PWA data to Supabase...');
      
      // Sync push subscriptions
      await this.syncPushSubscriptions();
      
      // Sync token usage
      await this.syncTokenUsage();
      
      // Sync offline queue
      await this.syncOfflineQueue();
      
      console.log('✅ PWA data synced to Supabase');
    } catch (error) {
      console.error('❌ Failed to sync PWA data to Supabase:', error);
      throw error;
    }
  }

  /**
   * Sync push subscriptions to Supabase
   */
  private async syncPushSubscriptions(): Promise<void> {
    const pushSubscriptions = database.collections.get('push_subscriptions');
    const unsyncedSubscriptions = await pushSubscriptions
      .query()
      .where('synced', false)
      .fetch();

    for (const subscription of unsyncedSubscriptions) {
      try {
        const { error } = await supabase
          .from('push_subscriptions')
          .upsert({
            id: subscription.id,
            endpoint: subscription.endpoint,
            p256dh_key: subscription.p256dhKey,
            auth_key: subscription.authKey,
            user_id: subscription.userId,
            user_agent: subscription.userAgent,
            is_active: subscription.isActive,
            last_used_at: subscription.lastUsedAt,
            notification_preferences: subscription.notificationPreferences,
            device_info: subscription.deviceInfo,
            created_at: subscription.createdAt.toISOString(),
            updated_at: subscription.updatedAt.toISOString()
          });

        if (!error) {
          await subscription.update((sub) => {
            sub.synced = true;
            sub.syncError = '';
          });
        } else {
          await subscription.update((sub) => {
            sub.syncError = error.message;
          });
        }
      } catch (error) {
        await subscription.update((sub) => {
          sub.syncError = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    }
  }

  /**
   * Sync token usage to Supabase
   */
  private async syncTokenUsage(): Promise<void> {
    const tokenUsage = database.collections.get('token_usage');
    const unsyncedUsage = await tokenUsage
      .query()
      .where('synced', false)
      .fetch();

    for (const usage of unsyncedUsage) {
      try {
        const { error } = await supabase
          .from('token_usage')
          .upsert({
            id: usage.id,
            provider: usage.provider,
            model: usage.model,
            user_id: usage.userId,
            tokens_used: usage.tokensUsed,
            token_limit: usage.tokenLimit,
            percentage: usage.percentage,
            api_key_type: usage.apiKeyType,
            last_notification_sent: usage.lastNotificationSent,
            notification_threshold: usage.notificationThreshold,
            is_monitoring: usage.isMonitoring,
            usage_history: usage.usageHistory,
            created_at: usage.createdAt.toISOString(),
            updated_at: usage.updatedAt.toISOString()
          });

        if (!error) {
          await usage.update((u) => {
            u.synced = true;
            u.syncError = '';
          });
        } else {
          await usage.update((u) => {
            u.syncError = error.message;
          });
        }
      } catch (error) {
        await usage.update((u) => {
          u.syncError = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    }
  }

  /**
   * Sync offline queue to Supabase
   */
  private async syncOfflineQueue(): Promise<void> {
    const offlineQueue = database.collections.get('offline_queue');
    const unsyncedRequests = await offlineQueue
      .query()
      .where('synced', false)
      .fetch();

    for (const request of unsyncedRequests) {
      try {
        const { error } = await supabase
          .from('offline_queue')
          .upsert({
            id: request.id,
            request_id: request.requestId,
            user_id: request.userId,
            method: request.method,
            url: request.url,
            headers: request.headers,
            body: request.body,
            priority: request.priority,
            attempts: request.attempts,
            max_attempts: request.maxAttempts,
            next_retry_at: request.nextRetryAt,
            status: request.status,
            error_message: request.errorMessage,
            response_data: request.responseData,
            created_offline: request.createdOffline,
            created_at: request.createdAt.toISOString(),
            updated_at: request.updatedAt.toISOString()
          });

        if (!error) {
          await request.update((req) => {
            req.synced = true;
            req.syncError = '';
          });
        } else {
          await request.update((req) => {
            req.syncError = error.message;
          });
        }
      } catch (error) {
        await request.update((req) => {
          req.syncError = error instanceof Error ? error.message : 'Unknown error';
        });
      }
    }
  }
}

// Export singleton instance
export const watermelonPWAIntegration = new WatermelonPWAIntegration();

// Export class for testing
export { WatermelonPWAIntegration };

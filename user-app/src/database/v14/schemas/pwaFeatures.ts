/**
 * PWA Features Schema for WatermelonDB V14
 * 
 * Schema voor nieuwe PWA features:
 * - Push Notifications
 * - Token Monitoring  
 * - Offline Queue
 * 
 * @version 14.0.0
 */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

// Export individual table schemas for use in main database
export const pwaFeaturesTables = [
  // Push Subscriptions Table
  tableSchema({
    name: 'push_subscriptions',
    columns: [
      { name: 'endpoint', type: 'string' },
      { name: 'p256dh_key', type: 'string' },
      { name: 'auth_key', type: 'string' },
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'user_agent', type: 'string' },
      { name: 'is_active', type: 'boolean' },
      { name: 'last_used_at', type: 'number' },
      { name: 'notification_preferences', type: 'string' }, // JSON
      { name: 'device_info', type: 'string' }, // JSON
      { name: 'synced', type: 'boolean' },
      { name: 'sync_error', type: 'string' },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ]
  }),

  // Token Usage Table
  tableSchema({
    name: 'token_usage',
    columns: [
      { name: 'provider', type: 'string', isIndexed: true },
      { name: 'model', type: 'string' },
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'tokens_used', type: 'number' },
      { name: 'token_limit', type: 'number' },
      { name: 'percentage', type: 'number' },
      { name: 'api_key_type', type: 'string' }, // 'free', 'user-provided', 'premium'
      { name: 'last_notification_sent', type: 'number' },
      { name: 'notification_threshold', type: 'number' },
      { name: 'is_monitoring', type: 'boolean' },
      { name: 'usage_history', type: 'string' }, // JSON
      { name: 'synced', type: 'boolean' },
      { name: 'sync_error', type: 'string' },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ]
  }),

  // Offline Queue Table
  tableSchema({
    name: 'offline_queue',
    columns: [
      { name: 'request_id', type: 'string', isIndexed: true },
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'method', type: 'string' },
      { name: 'url', type: 'string' },
      { name: 'headers', type: 'string' }, // JSON
      { name: 'body', type: 'string' },
      { name: 'priority', type: 'number' },
      { name: 'attempts', type: 'number' },
      { name: 'max_attempts', type: 'number' },
      { name: 'next_retry_at', type: 'number' },
      { name: 'status', type: 'string', isIndexed: true },
      { name: 'error_message', type: 'string' },
      { name: 'response_data', type: 'string' }, // JSON
      { name: 'created_offline', type: 'boolean' },
      { name: 'synced', type: 'boolean' },
      { name: 'sync_error', type: 'string' },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ]
  }),

  // Service Worker Cache Table
  tableSchema({
    name: 'service_worker_cache',
    columns: [
      { name: 'cache_name', type: 'string', isIndexed: true },
      { name: 'url', type: 'string', isIndexed: true },
      { name: 'response_data', type: 'string' }, // JSON
      { name: 'cache_strategy', type: 'string' }, // 'cache-first', 'network-first', etc.
      { name: 'expires_at', type: 'number' },
      { name: 'last_accessed', type: 'number' },
      { name: 'access_count', type: 'number' },
      { name: 'file_size', type: 'number' },
      { name: 'content_type', type: 'string' },
      { name: 'synced', type: 'boolean' },
      { name: 'sync_error', type: 'string' },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ]
  }),

  // PWA Settings Table
  tableSchema({
    name: 'pwa_settings',
    columns: [
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'setting_key', type: 'string', isIndexed: true },
      { name: 'setting_value', type: 'string' }, // JSON
      { name: 'setting_type', type: 'string' }, // 'boolean', 'string', 'number', 'object'
      { name: 'category', type: 'string' }, // 'notifications', 'caching', 'offline', etc.
      { name: 'is_sensitive', type: 'boolean' }, // For encryption
      { name: 'synced', type: 'boolean' },
      { name: 'sync_error', type: 'string' },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
    ]
  })
];

// Also export as appSchema for backward compatibility
export const pwaFeaturesSchema = appSchema({
  version: 14,
  tables: pwaFeaturesTables
});
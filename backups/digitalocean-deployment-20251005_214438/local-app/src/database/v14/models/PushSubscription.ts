/**
 * Push Subscription Model for WatermelonDB
 * Integrates push notifications with WatermelonDB + Supabase
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class PushSubscription extends Model {
  static table = 'push_subscriptions';

  @field('endpoint') endpoint!: string;
  @field('p256dh_key') p256dhKey!: string;
  @field('auth_key') authKey!: string;
  @field('user_id') userId!: string;
  @field('user_agent') userAgent!: string;
  @field('is_active') isActive!: boolean;
  @field('last_used_at') lastUsedAt!: number;
  @field('notification_preferences') notificationPreferences!: string; // JSON string
  @field('device_info') deviceInfo!: string; // JSON string
  @field('synced') synced!: boolean;
  @field('sync_error') syncError!: string;
  
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Helper methods
  getNotificationPreferences() {
    try {
      return JSON.parse(this.notificationPreferences || '{}');
    } catch {
      return {};
    }
  }

  setNotificationPreferences(preferences: any) {
    this.notificationPreferences = JSON.stringify(preferences);
  }

  getDeviceInfo() {
    try {
      return JSON.parse(this.deviceInfo || '{}');
    } catch {
      return {};
    }
  }

  setDeviceInfo(info: any) {
    this.deviceInfo = JSON.stringify(info);
  }

  isExpired(): boolean {
    // Consider subscription expired if not used for 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    return this.lastUsedAt < thirtyDaysAgo;
  }
}

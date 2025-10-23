/**
 * Token Usage Model for WatermelonDB
 * Integrates token monitoring with WatermelonDB + Supabase
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class TokenUsage extends Model {
  static table = 'token_usage';

  @field('provider') provider!: string; // 'grok-3', 'gpt-4', 'claude-4', etc.
  @field('model') model!: string;
  @field('user_id') userId!: string;
  @field('tokens_used') tokensUsed!: number;
  @field('token_limit') tokenLimit!: number;
  @field('percentage') percentage!: number;
  @field('api_key_type') apiKeyType!: string; // 'free', 'user-provided', 'premium'
  @field('last_notification_sent') lastNotificationSent!: number;
  @field('notification_threshold') notificationThreshold!: number; // 80, 95, etc.
  @field('is_monitoring') isMonitoring!: boolean;
  @field('usage_history') usageHistory!: string; // JSON string of historical data
  @field('synced') synced!: boolean;
  @field('sync_error') syncError!: string;
  
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Helper methods
  getUsageHistory() {
    try {
      return JSON.parse(this.usageHistory || '[]');
    } catch {
      return [];
    }
  }

  setUsageHistory(history: any[]) {
    this.usageHistory = JSON.stringify(history);
  }

  addUsageEntry(tokensUsed: number, timestamp: number = Date.now()) {
    const history = this.getUsageHistory();
    history.push({ tokensUsed, timestamp, percentage: (tokensUsed / this.tokenLimit) * 100 });
    
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    this.setUsageHistory(history);
  }

  getStatus(): 'ok' | 'warning' | 'critical' {
    if (this.percentage >= 95) return 'critical';
    if (this.percentage >= 80) return 'warning';
    return 'ok';
  }

  shouldSendNotification(): boolean {
    if (!this.isMonitoring) return false;
    
    const now = Date.now();
    const lastNotification = this.lastNotificationSent;
    
    // Don't send if sent within last 24 hours
    if (lastNotification && (now - lastNotification) < 24 * 60 * 60 * 1000) {
      return false;
    }
    
    return this.percentage >= this.notificationThreshold;
  }

  updateUsage(tokensUsed: number) {
    this.tokensUsed = tokensUsed;
    this.percentage = (tokensUsed / this.tokenLimit) * 100;
    this.addUsageEntry(tokensUsed);
  }
}

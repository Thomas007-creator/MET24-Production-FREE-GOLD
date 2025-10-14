/**
 * Offline Queue Model for WatermelonDB
 * Integrates offline queue with WatermelonDB + Supabase
 */

import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class OfflineQueue extends Model {
  static table = 'offline_queue';

  @field('request_id') requestId!: string; // Unique identifier for the request
  @field('user_id') userId!: string;
  @field('method') method!: string; // GET, POST, PUT, DELETE
  @field('url') url!: string;
  @field('headers') headers!: string; // JSON string
  @field('body') body!: string; // Request body
  @field('priority') priority!: number; // 1-10, higher = more important
  @field('attempts') attempts!: number;
  @field('max_attempts') maxAttempts!: number;
  @field('next_retry_at') nextRetryAt!: number;
  @field('status') status!: string; // 'pending', 'processing', 'completed', 'failed'
  @field('error_message') errorMessage!: string;
  @field('response_data') responseData!: string; // JSON string of response
  @field('created_offline') createdOffline!: boolean;
  @field('synced') synced!: boolean;
  @field('sync_error') syncError!: string;
  
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  // Helper methods
  getHeaders() {
    try {
      return JSON.parse(this.headers || '{}');
    } catch {
      return {};
    }
  }

  setHeaders(headers: any) {
    this.headers = JSON.stringify(headers);
  }

  getResponseData() {
    try {
      return JSON.parse(this.responseData || '{}');
    } catch {
      return {};
    }
  }

  setResponseData(data: any) {
    this.responseData = JSON.stringify(data);
  }

  isExpired(): boolean {
    // Consider request expired if older than 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return this.createdAt.getTime() < sevenDaysAgo;
  }

  canRetry(): boolean {
    return this.attempts < this.maxAttempts && 
           this.status === 'failed' && 
           Date.now() >= this.nextRetryAt;
  }

  calculateNextRetry(): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, 60s (max)
    const baseDelay = 1000; // 1 second
    const maxDelay = 60000; // 60 seconds
    const delay = Math.min(baseDelay * Math.pow(2, this.attempts), maxDelay);
    return Date.now() + delay;
  }

  incrementAttempt() {
    this.attempts += 1;
    this.nextRetryAt = this.calculateNextRetry();
    
    if (this.attempts >= this.maxAttempts) {
      this.status = 'failed';
    }
  }

  markAsCompleted(responseData?: any) {
    this.status = 'completed';
    if (responseData) {
      this.setResponseData(responseData);
    }
  }

  markAsFailed(errorMessage: string) {
    this.status = 'failed';
    this.errorMessage = errorMessage;
    this.incrementAttempt();
  }
}

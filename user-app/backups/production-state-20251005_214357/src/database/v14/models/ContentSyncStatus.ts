/**
 * ContentSyncStatus Model - WatermelonDB V14
 * 
 * Model class voor content_sync_status tabel
 * Bevat sync status informatie voor content
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class ContentSync extends Model {
  static table = "content_sync_status";

  // Sync informatie
  @field("content_type") contentType!: string;
  @field("content_id") contentId!: string;
  @field("status") status!: string; // 'pending', 'syncing', 'synced', 'error'
  @field("last_sync_at") lastSyncAt?: number;
  @field("sync_error") syncError?: string;
  @field("retry_count") retryCount!: number;
  
  // Metadata
  @field("metadata") metadata?: string;
  
  // Auditing
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("created_by") createdBy!: string;

  // Helper methods
  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isSyncing(): boolean {
    return this.status === 'syncing';
  }

  get isSynced(): boolean {
    return this.status === 'synced';
  }

  get hasError(): boolean {
    return this.status === 'error';
  }

  get canRetry(): boolean {
    return this.hasError && this.retryCount < 3;
  }

  get parsedMetadata(): any {
    try {
      return this.metadata ? JSON.parse(this.metadata) : {};
    } catch {
      return {};
    }
  }

  // Update methods
  async updateSyncStatus(status: string, error?: string): Promise<void> {
    await this.update((contentSync: any) => {
      contentSync.status = status;
      if (error) {
        contentSync.syncError = error;
        contentSync.retryCount = (contentSync.retryCount || 0) + 1;
      } else {
        contentSync.syncError = null;
        contentSync.lastSyncAt = Date.now();
      }
      contentSync.updatedAt = Date.now();
    });
  }

  async markAsSynced(): Promise<void> {
    await this.updateSyncStatus('synced');
  }

  async markAsError(error: string): Promise<void> {
    await this.updateSyncStatus('error', error);
  }

  async markAsPending(): Promise<void> {
    await this.updateSyncStatus('pending');
  }

  async markAsSyncing(): Promise<void> {
    await this.updateSyncStatus('syncing');
  }
}
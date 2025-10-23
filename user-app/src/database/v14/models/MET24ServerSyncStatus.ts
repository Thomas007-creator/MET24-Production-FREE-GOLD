/**
 * MET24ServerSyncStatus Model - WatermelonDB V14
 * 
 * Model class voor met24_server_sync_status tabel
 * Bevat sync status informatie voor MET24 server
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class MET24ServerSyncStatus extends Model {
  static table = "met24_server_sync_status";

  // Sync informatie
  @field("sync_type") syncType!: string; // 'full', 'incremental', 'manual'
  @field("status") status!: string; // 'pending', 'syncing', 'synced', 'error'
  @field("last_sync_at") lastSyncAt?: number;
  @field("sync_error") syncError?: string;
  @field("retry_count") retryCount!: number;
  @field("sync_duration") syncDuration?: number; // in milliseconds
  
  // Server informatie
  @field("server_url") serverUrl?: string;
  @field("server_version") serverVersion?: string;
  @field("sync_token") syncToken?: string;
  
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
    return this.hasError && this.retryCount < 5;
  }

  get isFullSync(): boolean {
    return this.syncType === 'full';
  }

  get isIncrementalSync(): boolean {
    return this.syncType === 'incremental';
  }

  get isManualSync(): boolean {
    return this.syncType === 'manual';
  }

  get parsedMetadata(): any {
    try {
      return this.metadata ? JSON.parse(this.metadata) : {};
    } catch {
      return {};
    }
  }

  get syncDurationDisplay(): string {
    if (!this.syncDuration) return 'N/A';
    const seconds = Math.floor(this.syncDuration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  // Update methods
  async updateSyncStatus(status: string, error?: string, duration?: number): Promise<void> {
    await this.update((serverSyncStatus: any) => {
      serverSyncStatus.status = status;
      if (error) {
        serverSyncStatus.syncError = error;
        serverSyncStatus.retryCount = (serverSyncStatus.retryCount || 0) + 1;
      } else {
        serverSyncStatus.syncError = null;
        serverSyncStatus.lastSyncAt = Date.now();
        if (duration) {
          serverSyncStatus.syncDuration = duration;
        }
      }
      serverSyncStatus.updatedAt = Date.now();
    });
  }

  async markAsSynced(duration?: number): Promise<void> {
    await this.updateSyncStatus('synced', undefined, duration);
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

  async updateServerInfo(serverUrl: string, serverVersion: string, syncToken?: string): Promise<void> {
    await this.update((serverSyncStatus: any) => {
      serverSyncStatus.serverUrl = serverUrl;
      serverSyncStatus.serverVersion = serverVersion;
      if (syncToken) {
        serverSyncStatus.syncToken = syncToken;
      }
      serverSyncStatus.updatedAt = Date.now();
    });
  }
}
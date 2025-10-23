import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class SyncStatus extends Model {
  static table = 'sync_status';

  @field('sync_type') syncType!: string;
  @field('status') status!: string;
  @field('last_sync') lastSync!: string | null; // ISO date string
  @field('error_count') errorCount!: number;
  @field('last_error') lastError!: string | null;
  @field('sync_data') syncData!: string | null; // JSON string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}


















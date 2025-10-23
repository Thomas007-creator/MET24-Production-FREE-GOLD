import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MET24SyncQueue extends Model {
  static table = 'met24_sync_queue';

  @field('sync_type') syncType!: string;
  @field('sync_data') syncData!: string; // JSON string
  @field('status') status!: string;
  @field('retry_count') retryCount!: number;
  @field('last_attempt') lastAttempt!: string | null; // ISO date string
  @field('error_message') errorMessage!: string | null;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
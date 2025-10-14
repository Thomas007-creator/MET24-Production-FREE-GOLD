import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ContentSource extends Model {
  static table = 'content_sources';

  @field('source_name') sourceName!: string;
  @field('source_type') sourceType!: string;
  @field('source_url') sourceUrl!: string | null;
  @field('is_active') isActive!: boolean;
  @field('last_sync') lastSync!: string | null; // ISO date string
  @field('sync_status') syncStatusField!: string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
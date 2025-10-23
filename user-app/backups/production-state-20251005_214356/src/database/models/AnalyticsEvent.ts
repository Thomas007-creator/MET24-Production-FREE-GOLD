import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AnalyticsEvent extends Model {
  static table = 'analytics_events';

  @field('event_name') eventName!: string;
  @field('properties') properties!: string | null; // JSON string
  @field('session_id') sessionId!: string | null;
  @field('synced') synced!: boolean | null;
  @field('synced_at') syncedAt!: string | null; // ISO date string
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}

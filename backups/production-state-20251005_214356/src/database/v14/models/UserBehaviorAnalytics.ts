import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class UserBehaviorAnalytics extends Model {
  static table = 'user_behavior_analytics';

  @field('user_id') userId!: string;
  @field('event_type') eventType!: string;
  @field('event_data') eventData!: string; // JSON string
  @field('session_id') sessionId!: string | null;
  @field('timestamp') timestamp!: string; // ISO date string
  @field('device_info') deviceInfo!: string | null; // JSON string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
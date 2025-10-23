import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class UpgradeFlowEvent extends Model {
  static table = 'upgrade_flow_events';

  @field('user_id') userId!: string;
  @field('event_type') eventType!: string;
  @field('event_data') eventData!: string; // JSON string
  @field('session_id') sessionId!: string | null;
  @field('timestamp') timestamp!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class InteractiveAISession extends Model {
  static table = 'interactive_ai_sessions';

  @field('user_id') userId!: string;
  @field('session_type') sessionType!: string;
  @field('session_data') sessionData!: string; // JSON string
  @field('is_active') isActive!: boolean;
  @field('started_at') startedAt!: string; // ISO date string
  @field('ended_at') endedAt!: string | null; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
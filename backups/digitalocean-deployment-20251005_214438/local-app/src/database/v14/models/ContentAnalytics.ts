import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ContentAnalytics extends Model {
  static table = 'content_analytics';

  @field('content_id') contentId!: string;
  @field('user_id') userId!: string;
  @field('interaction_type') interactionType!: string;
  @field('interaction_data') interactionData!: string; // JSON string
  @field('session_id') sessionId!: string | null;
  @field('timestamp') timestamp!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
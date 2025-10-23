import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ContentRecommendation extends Model {
  static table = 'content_recommendations';

  @field('user_id') userId!: string;
  @field('content_id') contentId!: string;
  @field('recommendation_score') recommendationScore!: number;
  @field('recommendation_reason') recommendationReason!: string;
  @field('is_viewed') isViewed!: boolean;
  @field('viewed_at') viewedAt!: string | null; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
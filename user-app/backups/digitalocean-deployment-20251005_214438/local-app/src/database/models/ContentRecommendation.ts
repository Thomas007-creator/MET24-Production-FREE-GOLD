import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class ContentRecommendation extends Model {
  static table = 'content_recommendations';

  @field('user_id') userId!: string;
  @field('item_id') itemId!: string;
  @field('score') score!: number; // 0-100 relevance score
  @field('reason') reason!: string; // Human-readable reason
  @field('mbti_alignment') mbtiAlignment!: string; // JSON object met MBTI alignment details
  @field('recommendation_type') recommendationType!: string; // 'mbti_based', 'trending', 'similar', 'completion'
  @field('is_viewed') isViewed!: boolean;
  @field('created_at') createdAt!: number;
  @field('updated_at') updatedAt!: number;

  // Helper getters
  get mbtiAlignmentObject(): any {
    try {
      return JSON.parse(this.mbtiAlignment || '{}');
    } catch {
      return {};
    }
  }

  get scorePercentage(): number {
    return Math.max(0, Math.min(100, this.score));
  }

  get isHighRelevance(): boolean {
    return this.score >= 80;
  }

  get isMediumRelevance(): boolean {
    return this.score >= 60 && this.score < 80;
  }

  get isLowRelevance(): boolean {
    return this.score < 60;
  }
}

export default ContentRecommendation;

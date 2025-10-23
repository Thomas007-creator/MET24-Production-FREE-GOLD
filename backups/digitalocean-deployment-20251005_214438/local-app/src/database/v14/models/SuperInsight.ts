import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class SuperInsight extends Model {
  static table = 'super_insights';

  @field('user_id') userId!: string;
  @field('insight_type') insightType!: string; // 'personality', 'behavior', 'pattern', 'growth'
  @field('title') title!: string;
  @field('content') content!: string; // JSON string
  @field('confidence_score') confidenceScore!: number | null;
  @field('is_premium') isPremium!: boolean | null;
  @field('generated_at') generatedAt!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
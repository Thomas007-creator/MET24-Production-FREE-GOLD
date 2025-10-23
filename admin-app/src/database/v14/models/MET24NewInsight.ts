import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MET24NewInsight extends Model {
  static table = 'met24_new_insights';

  @field('user_id') userId!: string;
  @field('insight_type') insightType!: string;
  @field('insight_data') insightData!: string; // JSON string
  @field('confidence_score') confidenceScore!: number;
  @field('is_processed') isProcessed!: boolean;
  @field('processed_at') processedAt!: string | null; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
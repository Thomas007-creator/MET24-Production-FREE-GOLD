import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MediaIntelligence extends Model {
  static table = 'media_intelligence';

  @field('media_id') mediaId!: string;
  @field('intelligence_data') intelligenceData!: string; // JSON string
  @field('analysis_type') analysisType!: string;
  @field('confidence_score') confidenceScore!: number;
  @field('is_processed') isProcessed!: boolean;
  @field('processed_at') processedAt!: string | null; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
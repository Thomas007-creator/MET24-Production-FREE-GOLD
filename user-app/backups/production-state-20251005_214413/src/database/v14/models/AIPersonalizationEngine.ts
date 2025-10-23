import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AIPersonalizationEngine extends Model {
  static table = 'ai_personalization_engines';

  @field('user_id') userId!: string;
  @field('engine_type') engineType!: string;
  @field('personalization_data') personalizationData!: string; // JSON string
  @field('is_active') isActive!: boolean;
  @field('last_updated') lastUpdated!: string; // ISO date string
  @field('accuracy_score') accuracyScore!: number | null;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
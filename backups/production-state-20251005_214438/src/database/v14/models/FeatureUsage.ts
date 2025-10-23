import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class FeatureUsage extends Model {
  static table = 'feature_usage';

  @field('user_id') userId!: string;
  @field('feature_name') featureName!: string;
  @field('usage_count') usageCount!: number;
  @field('last_used') lastUsed!: string; // ISO date string
  @field('usage_data') usageData!: string | null; // JSON string
  @field('session_id') sessionId!: string | null;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class FeatureUsage extends Model {
  static table = 'feature_usage';

  @field('user_id') userId!: string;
  @field('feature_name') featureName!: string; // 'ai_action_plans', 'journal_entries', 'super_insights', 'rewinds'
  @field('usage_count') usageCount!: number;
  @field('reset_date') resetDate!: string; // ISO date string for monthly reset
  @field('period') period!: string | null; // 'month', 'week', 'day'
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}

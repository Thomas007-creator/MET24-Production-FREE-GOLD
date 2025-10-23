import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MET24UserProgress extends Model {
  static table = 'met24_user_progress';

  @field('user_id') userId!: string;
  @field('progress_type') progressType!: string;
  @field('progress_data') progressData!: string; // JSON string
  @field('completion_percentage') completionPercentage!: number;
  @field('last_updated') lastUpdated!: string; // ISO date string
  @field('milestones') milestones!: string; // JSON string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
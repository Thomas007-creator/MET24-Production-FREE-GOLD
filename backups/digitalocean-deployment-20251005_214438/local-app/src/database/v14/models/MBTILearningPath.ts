import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MBTILearningPath extends Model {
  static table = 'mbti_learning_paths';

  @field('mbti_type') mbtiType!: string;
  @field('path_name') pathName!: string;
  @field('path_data') pathData!: string; // JSON string
  @field('is_active') isActive!: boolean;
  @field('completion_percentage') completionPercentage!: number;
  @field('last_updated') lastUpdated!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
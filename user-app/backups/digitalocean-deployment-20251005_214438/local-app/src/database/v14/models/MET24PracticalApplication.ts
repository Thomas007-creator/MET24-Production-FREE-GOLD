import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MET24PracticalApplication extends Model {
  static table = 'met24_practical_applications';

  @field('user_id') userId!: string;
  @field('application_type') applicationType!: string;
  @field('application_data') applicationData!: string; // JSON string
  @field('effectiveness_score') effectivenessScore!: number;
  @field('is_completed') isCompleted!: boolean;
  @field('completed_at') completedAt!: string | null; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
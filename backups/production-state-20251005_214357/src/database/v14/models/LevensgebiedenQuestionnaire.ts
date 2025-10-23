import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class LevensgebiedenQuestionnaire extends Model {
  static table = 'levensgebieden_questionnaires';

  @field('user_id') userId!: string;
  @field('questionnaire_data') questionnaireData!: string; // JSON string
  @field('completion_percentage') completionPercentage!: number;
  @field('is_completed') isCompleted!: boolean;
  @field('completed_at') completedAt!: string | null; // ISO date string
  @field('last_updated') lastUpdated!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AiActionPlan extends Model {
  static table = 'ai_action_plans';

  @field('user_id') userId!: string;
  @field('title') title!: string;
  @field('content') content!: string; // JSON string
  @field('is_premium') isPremium!: boolean | null;
  @field('generated_at') generatedAt!: string; // ISO date string
  @field('completed') completed!: boolean | null;
  @field('completed_at') completedAt!: string | null; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
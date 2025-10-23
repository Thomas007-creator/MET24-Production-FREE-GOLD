import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class RewindSession extends Model {
  static table = 'rewind_sessions';

  @field('user_id') userId!: string;
  @field('session_title') sessionTitle!: string;
  @field('session_data') sessionData!: string; // JSON string
  @field('is_premium') isPremium!: boolean | null;
  @field('session_date') sessionDate!: string; // ISO date string
  @field('duration_minutes') durationMinutes!: number | null;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}

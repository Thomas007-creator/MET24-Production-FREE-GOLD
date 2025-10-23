/**
 * Daily Goal Model - WatermelonDB V14
 * 
 * Model voor daily goals met V3 planning features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class DailyGoal extends Model {
  static table = "daily_goals";

  // Relaties
  @field("user_id") userId!: string;
  @field("journal_entry_id") journalEntryId?: string;

  // Goal data
  @field("goal_text") goalText!: string;
  @field("goal_emoji") goalEmoji?: string;
  @field("goal_category") goalCategory?: string;

  // Status
  @field("is_completed") isCompleted!: boolean;
  @field("completed_at") completedAt?: number;
  @field("completion_notes") completionNotes?: string;

  // Planning
  @field("target_date") targetDate!: number;
  @field("priority") priority?: number;
  @field("estimated_duration") estimatedDuration?: number;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}

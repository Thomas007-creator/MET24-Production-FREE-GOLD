/**
 * Planning Session Model - WatermelonDB V14
 * 
 * Model voor planning sessions met V3 planning features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class PlanningSession extends Model {
  static table = "planning_sessions";

  // Relaties
  @field("user_id") userId!: string;

  // Session data
  @field("session_title") sessionTitle!: string;
  @field("session_type") sessionType!: string;
  @field("session_date") sessionDate!: number;

  // Planning content
  @field("tomorrow_focus") tomorrowFocus?: string;
  @field("weekly_goals") weeklyGoals?: string; // JSON
  @field("monthly_goals") monthlyGoals?: string; // JSON
  @field("long_term_goals") longTermGoals?: string; // JSON

  // AI Integration
  @field("ai_suggestions") aiSuggestions?: string; // JSON
  @field("ai_coaching_notes") aiCoachingNotes?: string;

  // Progress tracking
  @field("goals_completed") goalsCompleted?: number;
  @field("goals_total") goalsTotal?: number;
  @field("completion_rate") completionRate?: number;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}

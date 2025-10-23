/**
 * Mood Tracking Model - WatermelonDB V14
 * 
 * Model voor mood tracking met V3 analytics
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class MoodTracking extends Model {
  static table = "mood_tracking";

  // Relaties
  @field("user_id") userId!: string;
  @field("journal_entry_id") journalEntryId?: string;

  // Mood data
  @field("mood_rating") moodRating!: number;
  @field("mood_emoji") moodEmoji!: string;
  @field("mood_description") moodDescription?: string;

  // Context
  @field("context") context?: string;
  @field("triggers") triggers?: string; // JSON
  @field("activities") activities?: string; // JSON

  // Analytics
  @field("trend_direction") trendDirection?: string;
  @field("weekly_average") weeklyAverage?: number;
  @field("monthly_average") monthlyAverage?: number;

  // Timestamps
  @field("timestamp") timestamp!: number;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}

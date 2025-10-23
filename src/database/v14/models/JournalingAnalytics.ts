/**
 * Journaling Analytics Model - WatermelonDB V14
 * 
 * Model voor journaling analytics met V3 insights
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class JournalingAnalytics extends Model {
  static table = "journaling_analytics";

  // Relaties
  @field("user_id") userId!: string;

  // Analytics data
  @field("analytics_date") analyticsDate!: number;
  @field("analytics_period") analyticsPeriod!: string;

  // Entry statistics
  @field("total_entries") totalEntries!: number;
  @field("total_words") totalWords!: number;
  @field("average_words_per_entry") averageWordsPerEntry!: number;
  @field("total_reading_time") totalReadingTime!: number;

  // Mood analytics
  @field("average_mood") averageMood!: number;
  @field("mood_trend") moodTrend!: string;
  @field("mood_volatility") moodVolatility!: number;

  // Goal analytics
  @field("goals_set") goalsSet!: number;
  @field("goals_completed") goalsCompleted!: number;
  @field("completion_rate") completionRate!: number;

  // MBTI insights
  @field("mbti_insights") mbtiInsights?: string; // JSON
  @field("personality_trends") personalityTrends?: string; // JSON

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}

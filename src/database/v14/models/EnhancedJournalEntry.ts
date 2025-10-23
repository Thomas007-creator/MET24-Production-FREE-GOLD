/**
 * Enhanced Journal Entry Model - WatermelonDB V14
 * 
 * Model voor enhanced journal entries met V3 features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class EnhancedJournalEntry extends Model {
  static table = "enhanced_journal_entries";

  // Relaties
  @field("user_id") userId!: string;

  // Entry data
  @field("title") title!: string;
  @field("content") content!: string;
  @field("gratitude_content") gratitudeContent?: string;

  // V3 Mood Tracking
  @field("mood_rating") moodRating?: number;
  @field("mood_emoji") moodEmoji?: string;
  @field("mood_description") moodDescription?: string;

  // V3 Planning Features
  @field("tomorrow_focus") tomorrowFocus?: string;
  @field("weekly_goals") weeklyGoals?: string; // JSON
  @field("daily_goals_completed") dailyGoalsCompleted?: string; // JSON

  // V3 Tags System
  @field("tags") tags?: string; // JSON
  @field("primary_tag") primaryTag?: string;
  @field("secondary_tags") secondaryTags?: string; // JSON

  // V3 Categorisatie
  @field("category") category?: string;
  @field("levensgebied") levensgebied?: string;
  @field("mbti_type") mbtiType?: string;

  // V3 AI Integration
  @field("ai_insights") aiInsights?: string;
  @field("ai_coaching_response") aiCoachingResponse?: string;
  @field("sentiment_score") sentimentScore?: number;
  @field("vector_embedding_id") vectorEmbeddingId?: string;

  // V3 Analytics
  @field("word_count") wordCount?: number;
  @field("reading_time_minutes") readingTimeMinutes?: number;
  @field("engagement_score") engagementScore?: number;

  // V3 Privacy & Sharing
  @field("is_private") isPrivate?: boolean;
  @field("is_public") isPublic?: boolean;
  @field("share_with_ai") shareWithAi?: boolean;

  // Timestamps
  @field("date") date!: number;
  @field("last_edited") lastEdited?: number;

  // Auditing
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("created_by") createdBy!: string;

  // V3 Metadata
  @field("metadata") metadata?: string; // JSON
}

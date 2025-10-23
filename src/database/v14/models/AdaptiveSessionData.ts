import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AdaptiveSessionData extends Model {
  static table = 'adaptive_session_data';

  @field('session_id') sessionId!: string;
  @field('user_id') userId!: string;
  @field('mbti_type') mbtiType!: string;

  // Engagement tracking
  @field('engagement_score') engagementScore!: number; // 0-10 scale
  @field('interaction_count') interactionCount!: number;
  @field('average_response_time') averageResponseTime!: number; // in seconds

  // Mood detection
  @field('detected_mood') detectedMood!: string; // happy, neutral, frustrated, overwhelmed, etc.
  @field('mood_confidence') moodConfidence!: number; // 0-1 scale

  // Session adaptation
  @field('current_complexity') currentComplexity!: number; // 1-5 scale
  @field('session_pace') sessionPace!: string; // slow, normal, fast
  @field('adaptation_triggers') adaptationTriggers!: string; // JSON string of triggers

  // Learning data
  @field('user_preferences') userPreferences!: string; // JSON string
  @field('effective_patterns') effectivePatterns!: string; // JSON string - What worked well
  @field('ineffective_patterns') ineffectivePatterns!: string; // JSON string - What didn't work

  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
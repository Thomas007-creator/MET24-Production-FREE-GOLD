/**
 * Enhanced Journaling Schema - WatermelonDB V14
 * 
 * V3 Journaling & Planning features uitbreiding:
 * - Enhanced journal_entries met mood tracking, gratitude, planning
 * - daily_goals: Dagelijkse doelen tracking
 * - mood_tracking: Mood trends en analytics
 * - planning_sessions: Planning sessies
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const enhancedJournalingSchema = [
  // Enhanced Journal Entries Table - V3 features
  tableSchema({
    name: "enhanced_journal_entries",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Entry data (uitbreiding van bestaande journal_entries)
      { name: "title", type: "string" },
      { name: "content", type: "string" },
      { name: "gratitude_content", type: "string", isOptional: true }, // V3 Gratitude section
      
      // V3 Mood Tracking (1-10 scale, was 1-5)
      { name: "mood_rating", type: "number", isOptional: true }, // 1-10 scale
      { name: "mood_emoji", type: "string", isOptional: true }, // 😢, 😕, 😐, 🙂, 😊, 🤩
      { name: "mood_description", type: "string", isOptional: true },
      
      // V3 Planning Features
      { name: "tomorrow_focus", type: "string", isOptional: true }, // Tomorrow's focus
      { name: "weekly_goals", type: "string", isOptional: true }, // JSON array
      { name: "daily_goals_completed", type: "string", isOptional: true }, // JSON array
      
      // V3 Tags System
      { name: "tags", type: "string", isOptional: true }, // JSON array
      { name: "primary_tag", type: "string", isOptional: true },
      { name: "secondary_tags", type: "string", isOptional: true }, // JSON array
      
      // V3 Categorisatie
      { name: "category", type: "string", isOptional: true },
      { name: "levensgebied", type: "string", isOptional: true }, // Koppeling met levensgebieden
      { name: "mbti_type", type: "string", isOptional: true },
      
      // V3 AI Integration
      { name: "ai_insights", type: "string", isOptional: true },
      { name: "ai_coaching_response", type: "string", isOptional: true }, // AI2 coaching
      { name: "sentiment_score", type: "number", isOptional: true },
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // V3 Analytics
      { name: "word_count", type: "number", isOptional: true },
      { name: "reading_time_minutes", type: "number", isOptional: true },
      { name: "engagement_score", type: "number", isOptional: true }, // 1-10
      
      // V3 Privacy & Sharing
      { name: "is_private", type: "boolean", isOptional: true },
      { name: "is_public", type: "boolean", isOptional: true },
      { name: "share_with_ai", type: "boolean", isOptional: true }, // Voor AI coaching
      
      // Timestamps
      { name: "date", type: "number" },
      { name: "last_edited", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // V3 Metadata
      { name: "metadata", type: "string", isOptional: true }, // JSON
    ],
  }),

  // Daily Goals Table - V3 Planning Features
  tableSchema({
    name: "daily_goals",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "journal_entry_id", type: "string", isIndexed: true, isOptional: true },
      
      // Goal data
      { name: "goal_text", type: "string" },
      { name: "goal_emoji", type: "string", isOptional: true }, // 🏃‍♂️, 📚, 🧘‍♀️, 💼, 👥
      { name: "goal_category", type: "string", isOptional: true }, // 'bewegen', 'leren', 'meditatie', 'werk', 'sociaal'
      
      // Status
      { name: "is_completed", type: "boolean" },
      { name: "completed_at", type: "number", isOptional: true },
      { name: "completion_notes", type: "string", isOptional: true },
      
      // Planning
      { name: "target_date", type: "number" },
      { name: "priority", type: "number", isOptional: true }, // 1-5
      { name: "estimated_duration", type: "number", isOptional: true }, // minutes
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Mood Tracking Table - V3 Analytics
  tableSchema({
    name: "mood_tracking",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "journal_entry_id", type: "string", isIndexed: true, isOptional: true },
      
      // Mood data
      { name: "mood_rating", type: "number" }, // 1-10
      { name: "mood_emoji", type: "string" }, // 😢, 😕, 😐, 🙂, 😊, 🤩
      { name: "mood_description", type: "string", isOptional: true },
      
      // Context
      { name: "context", type: "string", isOptional: true }, // 'morning', 'afternoon', 'evening'
      { name: "triggers", type: "string", isOptional: true }, // JSON array
      { name: "activities", type: "string", isOptional: true }, // JSON array
      
      // Analytics
      { name: "trend_direction", type: "string", isOptional: true }, // 'improving', 'stable', 'declining'
      { name: "weekly_average", type: "number", isOptional: true },
      { name: "monthly_average", type: "number", isOptional: true },
      
      // Timestamps
      { name: "timestamp", type: "number" },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Planning Sessions Table - V3 Planning Features
  tableSchema({
    name: "planning_sessions",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Session data
      { name: "session_title", type: "string" },
      { name: "session_type", type: "string" }, // 'daily', 'weekly', 'monthly', 'goal_setting'
      { name: "session_date", type: "number" },
      
      // Planning content
      { name: "tomorrow_focus", type: "string", isOptional: true },
      { name: "weekly_goals", type: "string", isOptional: true }, // JSON array
      { name: "monthly_goals", type: "string", isOptional: true }, // JSON array
      { name: "long_term_goals", type: "string", isOptional: true }, // JSON array
      
      // AI Integration
      { name: "ai_suggestions", type: "string", isOptional: true }, // JSON array
      { name: "ai_coaching_notes", type: "string", isOptional: true },
      
      // Progress tracking
      { name: "goals_completed", type: "number", isOptional: true },
      { name: "goals_total", type: "number", isOptional: true },
      { name: "completion_rate", type: "number", isOptional: true }, // percentage
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Journaling Analytics Table - V3 Insights
  tableSchema({
    name: "journaling_analytics",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Analytics data
      { name: "analytics_date", type: "number" },
      { name: "analytics_period", type: "string" }, // 'daily', 'weekly', 'monthly'
      
      // Entry statistics
      { name: "total_entries", type: "number" },
      { name: "total_words", type: "number" },
      { name: "average_words_per_entry", type: "number" },
      { name: "total_reading_time", type: "number" }, // minutes
      
      // Mood analytics
      { name: "average_mood", type: "number" },
      { name: "mood_trend", type: "string" }, // 'improving', 'stable', 'declining'
      { name: "mood_volatility", type: "number" }, // standard deviation
      
      // Goal analytics
      { name: "goals_set", type: "number" },
      { name: "goals_completed", type: "number" },
      { name: "completion_rate", type: "number" },
      
      // MBTI insights
      { name: "mbti_insights", type: "string", isOptional: true }, // JSON
      { name: "personality_trends", type: "string", isOptional: true }, // JSON
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),
];

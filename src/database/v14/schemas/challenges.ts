/**
 * Challenges Schema - WatermelonDB V14
 * 
 * V3 Challenges features uitbreiding:
 * - challenges: Challenge management en tracking
 * - challenge_milestones: Milestone tracking per challenge
 * - challenge_rewards: Reward system en achievements
 * - challenge_participants: Community participation tracking
 * - challenge_analytics: Analytics en insights
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const challengesSchema = [
  // Challenges Table - V3 features
  tableSchema({
    name: "challenges",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Challenge data
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "string" }, // levensgebied
      { name: "difficulty", type: "string" }, // easy, medium, hard
      { name: "type", type: "string" }, // community, personal
      { name: "status", type: "string" }, // active, completed, failed, paused
      
      // V3 Progress Tracking
      { name: "progress", type: "number" }, // 0-100
      { name: "current_streak", type: "number" },
      { name: "max_streak", type: "number" },
      { name: "total_points", type: "number" },
      { name: "completion_rate", type: "number" },
      
      // V3 MBTI Integration
      { name: "mbti_relevance", type: "string", isOptional: true }, // JSON array
      { name: "mbti_optimized", type: "boolean", isOptional: true },
      { name: "ai_generated", type: "boolean", isOptional: true },
      
      // V3 Community Features
      { name: "participants_count", type: "number", isOptional: true },
      { name: "is_public", type: "boolean", isOptional: true },
      { name: "community_rating", type: "number", isOptional: true },
      { name: "likes_count", type: "number", isOptional: true },
      { name: "comments_count", type: "number", isOptional: true },
      
      // V3 Gamification
      { name: "xp_reward", type: "number", isOptional: true },
      { name: "badge_reward", type: "string", isOptional: true },
      { name: "level_requirement", type: "number", isOptional: true },
      
      // V3 Tags & Metadata
      { name: "tags", type: "string", isOptional: true }, // JSON array
      { name: "primary_tag", type: "string", isOptional: true },
      { name: "estimated_time", type: "number", isOptional: true }, // minutes
      { name: "frequency", type: "string", isOptional: true }, // daily, weekly, monthly
      
      // V3 AI Integration
      { name: "ai_insights", type: "string", isOptional: true },
      { name: "ai_recommendation_score", type: "number", isOptional: true },
      { name: "ai_confidence", type: "number", isOptional: true },
      
      // V3 Analytics
      { name: "engagement_score", type: "number", isOptional: true },
      { name: "difficulty_rating", type: "number", isOptional: true }, // user feedback
      { name: "satisfaction_rating", type: "number", isOptional: true },
      
      // V3 Integration
      { name: "journaling_integration", type: "boolean", isOptional: true },
      { name: "planning_integration", type: "boolean", isOptional: true },
      { name: "wellness_integration", type: "boolean", isOptional: true },
      
      // Dates
      { name: "start_date", type: "number" },
      { name: "end_date", type: "number", isOptional: true },
      { name: "last_activity", type: "number", isOptional: true },
      
      // Author info
      { name: "author", type: "string", isOptional: true },
      { name: "author_avatar", type: "string", isOptional: true },
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ]
  }),

  // Challenge Milestones Table
  tableSchema({
    name: "challenge_milestones",
    columns: [
      // Relaties
      { name: "challenge_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true },
      
      // Milestone data
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "target_value", type: "number" },
      { name: "current_value", type: "number" },
      { name: "is_completed", type: "boolean" },
      
      // V3 Rewards
      { name: "reward_points", type: "number", isOptional: true },
      { name: "reward_badge", type: "string", isOptional: true },
      { name: "reward_unlocked", type: "boolean", isOptional: true },
      
      // V3 Progress
      { name: "progress_percentage", type: "number", isOptional: true },
      { name: "completion_date", type: "number", isOptional: true },
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ]
  }),

  // Challenge Rewards Table
  tableSchema({
    name: "challenge_rewards",
    columns: [
      // Relaties
      { name: "challenge_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true },
      
      // Reward data
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "icon", type: "string" },
      { name: "points", type: "number" },
      { name: "is_unlocked", type: "boolean" },
      
      // V3 Reward Types
      { name: "reward_type", type: "string" }, // badge, xp, achievement, unlock
      { name: "rarity", type: "string", isOptional: true }, // common, rare, epic, legendary
      { name: "category", type: "string", isOptional: true },
      
      // V3 Unlock Conditions
      { name: "unlock_condition", type: "string", isOptional: true }, // JSON
      { name: "unlock_date", type: "number", isOptional: true },
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ]
  }),

  // Challenge Participants Table (Community Features)
  tableSchema({
    name: "challenge_participants",
    columns: [
      // Relaties
      { name: "challenge_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true },
      
      // Participation data
      { name: "joined_at", type: "number" },
      { name: "status", type: "string" }, // active, completed, dropped
      { name: "progress", type: "number" },
      { name: "current_streak", type: "number" },
      
      // V3 Community Features
      { name: "is_public", type: "boolean", isOptional: true },
      { name: "share_progress", type: "boolean", isOptional: true },
      { name: "last_activity", type: "number", isOptional: true },
      
      // V3 Social Features
      { name: "likes_given", type: "number", isOptional: true },
      { name: "comments_made", type: "number", isOptional: true },
      { name: "shares_made", type: "number", isOptional: true },
      
      // V3 Analytics
      { name: "engagement_score", type: "number", isOptional: true },
      { name: "completion_prediction", type: "number", isOptional: true },
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ]
  }),

  // Challenge Analytics Table
  tableSchema({
    name: "challenge_analytics",
    columns: [
      // Relaties
      { name: "challenge_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true },
      
      // V3 Analytics Data
      { name: "completion_rate", type: "number" },
      { name: "average_progress", type: "number" },
      { name: "engagement_score", type: "number" },
      { name: "satisfaction_rating", type: "number", isOptional: true },
      
      // V3 MBTI Analytics
      { name: "mbti_type", type: "string", isOptional: true },
      { name: "mbti_success_rate", type: "number", isOptional: true },
      { name: "mbti_engagement", type: "number", isOptional: true },
      
      // V3 Community Analytics
      { name: "community_rank", type: "number", isOptional: true },
      { name: "social_engagement", type: "number", isOptional: true },
      { name: "influence_score", type: "number", isOptional: true },
      
      // V3 Time Analytics
      { name: "time_spent_minutes", type: "number", isOptional: true },
      { name: "sessions_count", type: "number", isOptional: true },
      { name: "average_session_time", type: "number", isOptional: true },
      
      // V3 Progress Analytics
      { name: "progress_velocity", type: "number", isOptional: true },
      { name: "consistency_score", type: "number", isOptional: true },
      { name: "momentum_score", type: "number", isOptional: true },
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ]
  }),

  // User Challenge Stats Table
  tableSchema({
    name: "user_challenge_stats",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // V3 User Statistics
      { name: "total_challenges", type: "number" },
      { name: "completed_challenges", type: "number" },
      { name: "active_challenges", type: "number" },
      { name: "current_streak", type: "number" },
      { name: "max_streak", type: "number" },
      { name: "total_points", type: "number" },
      { name: "current_level", type: "number" },
      { name: "total_xp", type: "number" },
      
      // V3 Achievement Stats
      { name: "badges_earned", type: "number" },
      { name: "achievements_unlocked", type: "number" },
      { name: "rare_achievements", type: "number" },
      
      // V3 Community Stats
      { name: "community_rank", type: "number", isOptional: true },
      { name: "influence_score", type: "number", isOptional: true },
      { name: "helpfulness_rating", type: "number", isOptional: true },
      
      // V3 MBTI Stats
      { name: "mbti_type", type: "string", isOptional: true },
      { name: "mbti_success_rate", type: "number", isOptional: true },
      { name: "preferred_difficulty", type: "string", isOptional: true },
      { name: "preferred_categories", type: "string", isOptional: true }, // JSON
      
      // V3 Time Stats
      { name: "total_time_spent", type: "number", isOptional: true }, // minutes
      { name: "average_session_time", type: "number", isOptional: true },
      { name: "most_active_hour", type: "number", isOptional: true },
      
      // Timestamps
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" }
    ]
  })
];

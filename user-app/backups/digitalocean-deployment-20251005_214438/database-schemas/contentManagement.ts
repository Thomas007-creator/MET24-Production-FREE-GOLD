/**
 * Content Management Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor content management:
 * - content_items: Geconsolideerde content items (geen duplicates)
 * - content_chunks: Geconsolideerde content chunks (geen duplicates)
 * - content_pointers: User-specific content tracking
 * - offline_packs: Pre-downloaded content packs
 * - content_recommendations: MBTI-based recommendations
 * - content_sources: Content source management
 * - mbti_learning_paths: Predefined learning paths per MBTI
 * - content_analytics: User interaction analytics
 * - media_intelligence: Trending topics and MBTI relevance
 * - content_sync_status: Offline sync tracking
 * 
 * OPGELOST: Duplicate CONTENT_ITEMS en CONTENT_CHUNKS tabellen geconsolideerd
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const contentManagementSchema = [
  // Content Items Table - Geconsolideerde content items (geen duplicates)
  tableSchema({
    name: "content_items",
    columns: [
      // Basis identificatie
      { name: "content_id", type: "string", isIndexed: true },
      { name: "title", type: "string" },
      { name: "description", type: "string", isOptional: true },
      
      // Content type en classificatie
      { name: "content_type", type: "string", isIndexed: true }, // 'video', 'article', 'podcast', 'course', 'exercise'
      { name: "category", type: "string", isOptional: true }, // 'self_development', 'relationships', 'career', 'health'
      { name: "subcategory", type: "string", isOptional: true },
      
      // Content data
      { name: "url", type: "string", isOptional: true },
      { name: "summary", type: "string", isOptional: true },
      { name: "content_encrypted", type: "string", isOptional: true }, // encryptPayload(content)
      { name: "content_encrypted_key_id", type: "string", isOptional: true },
      
      // Metadata
      { name: "duration_minutes", type: "number", isOptional: true },
      { name: "difficulty_level", type: "number", isOptional: true }, // 1-10
      { name: "tags", type: "string", isOptional: true }, // JSON array
      { name: "mbti_relevance", type: "string", isOptional: true }, // JSON object per MBTI type
      
      // AI integratie
      { name: "embedding_data", type: "string", isOptional: true }, // Base64 encoded vector
      { name: "vector_embedding_id", type: "string", isOptional: true },
      { name: "ai_summary", type: "string", isOptional: true },
      { name: "ai_tags", type: "string", isOptional: true }, // JSON array
      
      // Source en sync
      { name: "source_id", type: "string", isOptional: true },
      { name: "source_type", type: "string", isOptional: true }, // 'youtube', 'podcast', 'blog', 'course', 'article'
      { name: "external_id", type: "string", isOptional: true },
      
      // Status
      { name: "is_active", type: "boolean" },
      { name: "is_premium", type: "boolean", isOptional: true },
      { name: "is_featured", type: "boolean", isOptional: true },
      { name: "is_offline_available", type: "boolean", isOptional: true },
      
      // Quality en ratings
      { name: "quality_score", type: "number", isOptional: true }, // 0-100
      { name: "user_rating", type: "number", isOptional: true }, // 1-5
      { name: "rating_count", type: "number", isOptional: true },
      
      // Usage statistics
      { name: "view_count", type: "number", isOptional: true },
      { name: "completion_rate", type: "number", isOptional: true }, // 0-100
      { name: "last_accessed", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Content Chunks Table - Geconsolideerde content chunks (geen duplicates)
  tableSchema({
    name: "content_chunks",
    columns: [
      // Relaties
      { name: "content_id", type: "string", isIndexed: true },
      { name: "chunk_id", type: "string", isIndexed: true },
      
      // Chunk data
      { name: "chunk_order", type: "number" },
      { name: "chunk_title", type: "string", isOptional: true },
      { name: "chunk_content", type: "string" },
      { name: "chunk_type", type: "string" }, // 'text', 'video', 'audio', 'image', 'exercise'
      
      // Metadata
      { name: "duration_seconds", type: "number", isOptional: true },
      { name: "word_count", type: "number", isOptional: true },
      { name: "metadata", type: "string", isOptional: true }, // JSON metadata
      
      // AI integratie
      { name: "ai_summary", type: "string", isOptional: true },
      { name: "vector_embedding_id", type: "string", isOptional: true },
      { name: "sentiment_score", type: "number", isOptional: true },
      
      // Status
      { name: "is_required", type: "boolean", isOptional: true },
      { name: "is_interactive", type: "boolean", isOptional: true },
      { name: "difficulty_level", type: "number", isOptional: true }, // 1-10
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Content Pointers Table - User-specific content tracking
  tableSchema({
    name: "content_pointers",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "content_id", type: "string", isIndexed: true },
      { name: "pointer_id", type: "string", isIndexed: true },
      
      // User interaction
      { name: "downloaded_at", type: "number", isOptional: true },
      { name: "last_viewed_at", type: "number", isOptional: true },
      { name: "is_favorite", type: "boolean" },
      { name: "is_bookmarked", type: "boolean", isOptional: true },
      
      // Progress tracking
      { name: "progress", type: "number" }, // 0-100 percentage
      { name: "current_chunk", type: "number", isOptional: true },
      { name: "total_time_spent", type: "number", isOptional: true }, // in seconds
      { name: "completion_percentage", type: "number", isOptional: true },
      
      // User feedback
      { name: "rating", type: "number", isOptional: true }, // 1-5 stars
      { name: "notes", type: "string", isOptional: true },
      { name: "feedback", type: "string", isOptional: true },
      
      // Recommendations
      { name: "recommended_by", type: "string", isOptional: true }, // 'ai', 'mbti', 'similar_users', 'trending'
      { name: "recommendation_score", type: "number", isOptional: true },
      { name: "recommendation_reason", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Offline Packs Table - Pre-downloaded content packs
  tableSchema({
    name: "offline_packs",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "pack_id", type: "string", isIndexed: true },
      
      // Pack data
      { name: "pack_name", type: "string" },
      { name: "pack_type", type: "string" }, // 'mbti_specific', 'topic_based', 'curated', 'personalized'
      { name: "mbti_type", type: "string", isOptional: true },
      
      // Content
      { name: "item_ids", type: "string" }, // JSON array van content item IDs
      { name: "pack_size", type: "number" }, // bytes
      { name: "estimated_duration", type: "number", isOptional: true }, // in minutes
      
      // Download status
      { name: "download_status", type: "string" }, // 'pending', 'downloading', 'completed', 'failed'
      { name: "download_progress", type: "number", isOptional: true }, // 0-100
      { name: "download_speed", type: "number", isOptional: true }, // bytes per second
      
      // Timestamps
      { name: "downloaded_at", type: "number", isOptional: true },
      { name: "last_accessed", type: "number", isOptional: true },
      { name: "expires_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Content Recommendations Table - MBTI-based recommendations
  tableSchema({
    name: "content_recommendations",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "content_id", type: "string", isIndexed: true },
      { name: "recommendation_id", type: "string", isIndexed: true },
      
      // Recommendation data
      { name: "score", type: "number" }, // 0-100 relevance score
      { name: "reason", type: "string" }, // Human-readable reason
      { name: "recommendation_type", type: "string" }, // 'mbti_based', 'trending', 'similar', 'completion', 'ai_personalized'
      
      // MBTI alignment
      { name: "mbti_alignment", type: "string" }, // JSON object met MBTI alignment details
      { name: "mbti_type", type: "string", isOptional: true },
      { name: "personality_traits", type: "string", isOptional: true }, // JSON array
      
      // User interaction
      { name: "is_viewed", type: "boolean" },
      { name: "is_clicked", type: "boolean", isOptional: true },
      { name: "is_dismissed", type: "boolean", isOptional: true },
      { name: "viewed_at", type: "number", isOptional: true },
      
      // AI integratie
      { name: "ai_confidence", type: "number", isOptional: true }, // 0-100
      { name: "ai_model", type: "string", isOptional: true },
      { name: "ai_factors", type: "string", isOptional: true }, // JSON array van factoren
      
      // Timestamps
      { name: "recommended_at", type: "number" },
      { name: "expires_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Content Sources Table - Content source management
  tableSchema({
    name: "content_sources",
    columns: [
      // Basis identificatie
      { name: "source_id", type: "string", isIndexed: true },
      { name: "name", type: "string" },
      { name: "type", type: "string" }, // 'youtube', 'podcast', 'blog', 'course', 'article', 'api'
      { name: "url", type: "string" },
      
      // API configuratie
      { name: "api_endpoint", type: "string", isOptional: true },
      { name: "auth_config", type: "string", isOptional: true }, // JSON auth config
      { name: "api_key", type: "string", isOptional: true },
      
      // Sync configuratie
      { name: "sync_frequency", type: "string" }, // 'daily', 'weekly', 'monthly', 'manual'
      { name: "last_synced", type: "number", isOptional: true },
      { name: "next_sync", type: "number", isOptional: true },
      { name: "sync_status", type: "string", isOptional: true }, // 'active', 'paused', 'error', 'disabled'
      
      // Content statistieken
      { name: "content_count", type: "number" },
      { name: "new_content_count", type: "number", isOptional: true },
      { name: "last_content_update", type: "number", isOptional: true },
      
      // Status
      { name: "is_active", type: "boolean" },
      { name: "is_verified", type: "boolean", isOptional: true },
      { name: "quality_score", type: "number", isOptional: true }, // 0-100
      
      // Error handling
      { name: "last_error", type: "string", isOptional: true },
      { name: "error_count", type: "number", isOptional: true },
      { name: "retry_count", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // MBTI Learning Paths Table - Predefined learning paths per MBTI
  tableSchema({
    name: "mbti_learning_paths",
    columns: [
      // Basis identificatie
      { name: "path_id", type: "string", isIndexed: true },
      { name: "mbti_type", type: "string", isIndexed: true },
      { name: "path_name", type: "string" },
      { name: "description", type: "string" },
      
      // Path data
      { name: "content_items", type: "string" }, // JSON array van content item IDs
      { name: "difficulty_progression", type: "string" }, // JSON array met difficulty levels
      { name: "estimated_duration", type: "number" }, // total hours
      { name: "learning_objectives", type: "string" }, // JSON array van objectives
      
      // Categorisatie
      { name: "category", type: "string", isOptional: true }, // 'personal_development', 'career', 'relationships', 'health'
      { name: "tags", type: "string", isOptional: true }, // JSON array
      { name: "target_audience", type: "string", isOptional: true }, // 'beginner', 'intermediate', 'advanced'
      
      // Status
      { name: "is_active", type: "boolean" },
      { name: "is_featured", type: "boolean", isOptional: true },
      { name: "is_premium", type: "boolean", isOptional: true },
      
      // Statistieken
      { name: "completion_rate", type: "number", isOptional: true }, // 0-100
      { name: "user_count", type: "number", isOptional: true },
      { name: "average_rating", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Content Analytics Table - User interaction analytics
  tableSchema({
    name: "content_analytics",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "content_id", type: "string", isIndexed: true },
      { name: "analytics_id", type: "string", isIndexed: true },
      
      // Interaction data
      { name: "action_type", type: "string" }, // 'view', 'download', 'complete', 'share', 'rate', 'bookmark'
      { name: "duration", type: "number", isOptional: true }, // seconds spent
      { name: "completion_percentage", type: "number", isOptional: true },
      { name: "interaction_data", type: "string", isOptional: true }, // JSON additional data
      
      // Context
      { name: "session_id", type: "string", isOptional: true },
      { name: "device_info", type: "string", isOptional: true }, // JSON device info
      { name: "location", type: "string", isOptional: true },
      { name: "referrer", type: "string", isOptional: true },
      
      // User context
      { name: "mbti_type", type: "string", isOptional: true },
      { name: "user_segment", type: "string", isOptional: true },
      { name: "subscription_tier", type: "string", isOptional: true },
      
      // Timestamps
      { name: "action_timestamp", type: "number" },
      { name: "session_start", type: "number", isOptional: true },
      { name: "session_end", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Media Intelligence Table - Trending topics and MBTI relevance
  tableSchema({
    name: "media_intelligence",
    columns: [
      // Basis identificatie
      { name: "intelligence_id", type: "string", isIndexed: true },
      { name: "topic", type: "string", isIndexed: true },
      { name: "category", type: "string", isOptional: true },
      
      // Trending data
      { name: "trend_score", type: "number" }, // 0-100 trending score
      { name: "trend_direction", type: "string", isOptional: true }, // 'up', 'down', 'stable'
      { name: "trend_velocity", type: "number", isOptional: true }, // rate of change
      
      // MBTI relevance
      { name: "mbti_relevance", type: "string" }, // JSON object per MBTI type
      { name: "personality_insights", type: "string", isOptional: true }, // JSON insights
      { name: "content_sources", type: "string" }, // JSON array van source IDs
      
      // Content data
      { name: "keywords", type: "string" }, // JSON array van keywords
      { name: "sentiment", type: "string" }, // 'positive', 'negative', 'neutral'
      { name: "sentiment_score", type: "number", isOptional: true }, // -1 to 1
      
      // Source tracking
      { name: "source_count", type: "number", isOptional: true },
      { name: "content_count", type: "number", isOptional: true },
      { name: "engagement_score", type: "number", isOptional: true }, // 0-100
      
      // Timestamps
      { name: "last_updated", type: "number" },
      { name: "trend_start", type: "number", isOptional: true },
      { name: "trend_end", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Content Sync Status Table - Offline sync tracking
  tableSchema({
    name: "content_sync_status",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "sync_id", type: "string", isIndexed: true },
      
      // Sync data
      { name: "sync_type", type: "string" }, // 'content_pack', 'recommendations', 'analytics', 'full_sync'
      { name: "sync_status", type: "string" }, // 'pending', 'syncing', 'completed', 'failed', 'paused'
      { name: "sync_progress", type: "number", isOptional: true }, // 0-100
      
      // Sync details
      { name: "items_synced", type: "number" },
      { name: "items_total", type: "number", isOptional: true },
      { name: "sync_duration", type: "number", isOptional: true }, // in seconds
      { name: "sync_size", type: "number", isOptional: true }, // in bytes
      
      // Error handling
      { name: "error_message", type: "string", isOptional: true },
      { name: "error_count", type: "number", isOptional: true },
      { name: "retry_count", type: "number", isOptional: true },
      
      // Timestamps
      { name: "last_sync", type: "number" },
      { name: "next_sync", type: "number", isOptional: true },
      { name: "started_at", type: "number", isOptional: true },
      { name: "completed_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),
];

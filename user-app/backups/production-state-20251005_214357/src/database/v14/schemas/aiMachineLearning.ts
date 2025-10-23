/**
 * AI & Machine Learning Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor AI en machine learning:
 * - ai_interactions: AI interacties
 * - vector_embeddings: Vector embeddings
 * - ai_action_plans: AI actieplannen
 * - super_insights: Super inzichten
 * - rewind_sessions: Rewind sessies
 * - ai_learning_pipeline: AI learning
 * - ai_personalization_engine: Personalization
 * - offline_ai_models: Offline AI modellen
 * - user_behavior_analytics: Gedrag analytics
 * - external_ai_services: Externe AI services
 * - interactive_ai_sessions: Interactieve AI sessies
 * - dynamic_content_creation: Dynamische content
 * - ai_service_health_monitoring: AI service health
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const aiMachineLearningSchema = [
  // AI Artifacts Table - AI-gegenereerde content uit Supabase
  tableSchema({
    name: "ai_artifacts",
    columns: [
      // Basis identificatie
      { name: "job_id", type: "string", isIndexed: true },
      { name: "origin", type: "string" },
      { name: "agent", type: "string", isIndexed: true },
      { name: "model", type: "string" },
      { name: "model_version", type: "string" },
      { name: "prompt_hash", type: "string" },

      // Content data
      { name: "content", type: "string" }, // JSON string van content object
      { name: "provenance", type: "string" }, // JSON string van provenance object
      { name: "moderation_status", type: "string", isIndexed: true },

      // Metadata
      { name: "mbti_type", type: "string", isIndexed: true, isOptional: true },
      { name: "user_id", type: "string", isIndexed: true, isOptional: true },
      { name: "session_id", type: "string", isOptional: true },
      { name: "quality_score", type: "number", isOptional: true },
      { name: "tokens_used", type: "number", isOptional: true },

      // Sync en status
      { name: "sync_status", type: "string", isIndexed: true },
      { name: "last_synced_at", type: "number", isOptional: true },
      { name: "sync_error", type: "string", isOptional: true },

      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),

  // AI Interactions Table - AI interacties
  tableSchema({
    name: "ai_interactions",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Interaction data
      { name: "prompt", type: "string" },
      { name: "response", type: "string" },
      { name: "context_type", type: "string" },
      { name: "mbti_type", type: "string" },
      { name: "session_id", type: "string", isOptional: true },
      { name: "ai_model", type: "string", isOptional: true },
      { name: "tokens_used", type: "number", isOptional: true },
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Vector Embeddings Table - Vector embeddings
  tableSchema({
    name: "vector_embeddings",
    columns: [
      // Basis identificatie
      { name: "vector_id", type: "string", isIndexed: true },
      { name: "content", type: "string" },
      { name: "metadata", type: "string" },
      { name: "embedding_data", type: "string" }, // Base64 encoded vector
      { name: "embedding_dimension", type: "number" },
      
      // Source tracking
      { name: "source_table", type: "string" },
      { name: "source_record_id", type: "string" },
      { name: "user_id", type: "string", isIndexed: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // AI Action Plans Table - AI actieplannen
  tableSchema({
    name: "ai_action_plans",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Plan data
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "goals", type: "string" }, // JSON array
      { name: "steps", type: "string" }, // JSON array
      { name: "timeline", type: "string" },
      { name: "progress", type: "number" }, // 0-100
      { name: "status", type: "string" },
      { name: "mbti_context", type: "string", isOptional: true },
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Super Insights Table - Super inzichten
  tableSchema({
    name: "super_insights",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Insight data
      { name: "insight_type", type: "string" },
      { name: "title", type: "string" },
      { name: "content", type: "string" },
      { name: "data_sources", type: "string" }, // JSON array
      { name: "confidence_score", type: "number" }, // 0-100
      { name: "actionable_items", type: "string" }, // JSON array
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Rewind Sessions Table - Rewind sessies
  tableSchema({
    name: "rewind_sessions",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Session data
      { name: "session_type", type: "string" },
      { name: "session_data", type: "string" }, // JSON object
      { name: "ai_analysis", type: "string" },
      { name: "insights", type: "string" }, // JSON array
      { name: "recommendations", type: "string" }, // JSON array
      { name: "duration", type: "number" }, // in seconds
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // AI Learning Pipeline Table - AI learning
  tableSchema({
    name: "ai_learning_pipelines",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Pipeline data (matching AILearningPipeline model)
      { name: "pipeline_name", type: "string" },
      { name: "pipeline_config", type: "string" }, // JSON string
      { name: "status", type: "string" },
      { name: "last_run", type: "string", isOptional: true }, // ISO date string
      { name: "performance_metrics", type: "string", isOptional: true }, // JSON string
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // AI Personalization Engine Table - Personalization
  tableSchema({
    name: "ai_personalization_engine",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Personalization data
      { name: "behavior_patterns", type: "string" }, // JSON object
      { name: "content_preferences", type: "string" }, // JSON object
      { name: "interaction_history", type: "string" }, // JSON object
      { name: "personalization_rules", type: "string" }, // JSON object
      { name: "content_adaptations", type: "string" }, // JSON object
      { name: "user_segments", type: "string" }, // JSON array
      { name: "personalization_score", type: "number" }, // 0-100
      { name: "last_analysis", type: "number" },
      { name: "analysis_frequency", type: "string" },
      { name: "is_active", type: "boolean" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Offline AI Models Table - Offline AI modellen
  tableSchema({
    name: "offline_ai_models",
    columns: [
      // Basis identificatie
      { name: "model_id", type: "string", isIndexed: true },
      { name: "model_type", type: "string" },
      { name: "model_version", type: "string" },
      { name: "model_data", type: "string" }, // JSON object
      { name: "training_data", type: "string" }, // JSON object
      { name: "performance_metrics", type: "string" }, // JSON object
      { name: "last_trained", type: "number" },
      { name: "training_status", type: "string" },
      { name: "is_active", type: "boolean" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // User Behavior Analytics Table - Gedrag analytics
  tableSchema({
    name: "user_behavior_analytics",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Analytics data
      { name: "session_data", type: "string" }, // JSON object
      { name: "interaction_patterns", type: "string" }, // JSON object
      { name: "preference_insights", type: "string" }, // JSON object
      { name: "learning_style", type: "string" },
      { name: "engagement_metrics", type: "string" }, // JSON object
      { name: "content_affinity", type: "string" }, // JSON object
      { name: "behavioral_trends", type: "string" }, // JSON object
      { name: "last_analyzed", type: "number" },
      { name: "analysis_confidence", type: "number" }, // 0-100
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // External AI Services Table - Externe AI services
  tableSchema({
    name: "external_ai_services",
    columns: [
      // Basis identificatie
      { name: "service_id", type: "string", isIndexed: true },
      { name: "service_type", type: "string" },
      { name: "service_endpoint", type: "string" },
      { name: "authentication_data", type: "string" }, // JSON object
      { name: "service_model", type: "string" },
      { name: "service_configuration", type: "string" }, // JSON object
      { name: "service_limits", type: "string" }, // JSON object
      { name: "usage_statistics", type: "string" }, // JSON object
      { name: "cost_information", type: "string" }, // JSON object
      { name: "service_status", type: "string" },
      { name: "last_accessed", type: "number" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Interactive AI Sessions Table - Interactieve AI sessies
  tableSchema({
    name: "interactive_ai_sessions",
    columns: [
      // Basis identificatie
      { name: "session_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true },
      
      // Session data
      { name: "session_mode", type: "string" },
      { name: "ai_service_identifier", type: "string" },
      { name: "session_settings", type: "string" }, // JSON object
      { name: "session_data_stream", type: "string" }, // JSON object
      { name: "ai_interactions", type: "string" }, // JSON array
      { name: "session_performance", type: "string" }, // JSON object
      { name: "connection_state", type: "string" },
      { name: "session_length", type: "number" }, // in seconds
      { name: "session_state", type: "string" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Dynamic Content Creation Table - Dynamische content
  tableSchema({
    name: "dynamic_content_creation",
    columns: [
      // Basis identificatie
      { name: "creation_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true },
      
      // Creation data
      { name: "content_category", type: "string" },
      { name: "creation_input", type: "string" }, // JSON object
      { name: "created_content", type: "string" },
      { name: "creation_service", type: "string" },
      { name: "creation_settings", type: "string" }, // JSON object
      { name: "content_quality", type: "string" }, // JSON object
      { name: "user_evaluation", type: "string" }, // JSON object
      { name: "creation_expense", type: "number" },
      { name: "approval_status", type: "string" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // AI Service Health Monitoring Table - AI service health
  tableSchema({
    name: "ai_service_health_monitoring",
    columns: [
      // Basis identificatie
      { name: "service_id", type: "string", isIndexed: true },
      { name: "service_name", type: "string" },
      
      // Health data
      { name: "service_status", type: "string" },
      { name: "response_time", type: "number" }, // in milliseconds
      { name: "error_rate", type: "number" }, // 0-100
      { name: "uptime_percentage", type: "number" }, // 0-100
      { name: "last_health_check", type: "number" },
      { name: "health_metrics", type: "string" }, // JSON object
      { name: "alert_thresholds", type: "string" }, // JSON object
      { name: "is_monitored", type: "boolean" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),
];

/**
 * User Management Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor user management:
 * - users: Basis user data
 * - mbti_profiles: MBTI profielen en insights
 * - settings: User instellingen
 * - life_areas_progress: Progress tracking voor levensgebieden
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const userManagementSchema = [
  // Users Table - Basis user data
  tableSchema({
    name: "users",
    columns: [
      // Basis informatie
      { name: "name", type: "string" },
      { name: "email", type: "string", isIndexed: true },
      { name: "avatar_url", type: "string", isOptional: true },
      
      // MBTI informatie
      { name: "mbti_type", type: "string", isIndexed: true },
      
      // Premium status
      { name: "premium_status", type: "boolean" },
      { name: "subscription_tier", type: "string", isOptional: true },
      { name: "subscription_expires_at", type: "number", isOptional: true },
      { name: "subscription_status", type: "string", isOptional: true },
      
      // App voorkeuren
      { name: "dark_mode", type: "boolean" },
      { name: "voice_enabled", type: "boolean" },
      { name: "language", type: "string", isOptional: true },
      { name: "timezone", type: "string", isOptional: true },
      
      // Profiel informatie
      { name: "bio", type: "string", isOptional: true },
      { name: "location", type: "string", isOptional: true },
      { name: "website", type: "string", isOptional: true },
      { name: "privacy_level", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true }, // JSON voor toekomstige velden
    ],
  }),

  // MBTI Profiles Table - Uitgebreide MBTI data
  tableSchema({
    name: "mbti_profiles",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // MBTI basis
      { name: "mbti_type", type: "string", isIndexed: true },
      { name: "confidence_score", type: "number", isOptional: true },
      { name: "test_version", type: "string", isOptional: true },
      
      // Profiel data
      { name: "profile_data", type: "string" }, // JSON string met complete MBTI data
      { name: "strengths", type: "string", isOptional: true }, // JSON array
      { name: "weaknesses", type: "string", isOptional: true }, // JSON array
      { name: "growth_areas", type: "string", isOptional: true }, // JSON array
      
      // Career en relaties
      { name: "career_paths", type: "string", isOptional: true }, // JSON array
      { name: "relationship_insights", type: "string", isOptional: true }, // JSON object
      { name: "communication_style", type: "string", isOptional: true },
      
      // Stress en coping
      { name: "stress_triggers", type: "string", isOptional: true }, // JSON array
      { name: "coping_strategies", type: "string", isOptional: true }, // JSON array
      
      // AI integratie
      { name: "vector_embedding_id", type: "string", isOptional: true },
      { name: "ai_insights", type: "string", isOptional: true }, // JSON object
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Settings Table - User instellingen
  tableSchema({
    name: "settings",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Setting data
      { name: "key", type: "string", isIndexed: true },
      { name: "value", type: "string" },
      { name: "category", type: "string", isOptional: true }, // 'notifications', 'privacy', 'app', etc.
      { name: "data_type", type: "string", isOptional: true }, // 'boolean', 'string', 'number', 'json'
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Life Areas Progress Table - Progress tracking
  tableSchema({
    name: "life_areas_progress",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Progress data
      { name: "area_name", type: "string", isIndexed: true },
      { name: "progress_level", type: "number" }, // 0-100
      { name: "notes", type: "string", isOptional: true },
      
      // Goals en achievements
      { name: "goals", type: "string", isOptional: true }, // JSON array
      { name: "achievements", type: "string", isOptional: true }, // JSON array
      { name: "milestones", type: "string", isOptional: true }, // JSON array
      
      // Tracking
      { name: "last_updated", type: "number", isOptional: true },
      { name: "update_frequency", type: "string", isOptional: true }, // 'daily', 'weekly', 'monthly'
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),
];

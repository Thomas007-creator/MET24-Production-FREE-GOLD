/**
 * Onboarding Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor onboarding:
 * - onboarding_states: Onboarding progress
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const onboardingSchema = [
  // Onboarding States Table - Onboarding progress
  tableSchema({
    name: "onboarding_states",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Onboarding data
      { name: "current_step", type: "string" },
      { name: "step_completed_flags", type: "string" }, // JSON object
      { name: "user_data", type: "string", isOptional: true }, // JSON object
      { name: "mbti_data", type: "string", isOptional: true }, // JSON object
      { name: "interests", type: "string", isOptional: true }, // JSON array
      { name: "context_data", type: "string", isOptional: true }, // JSON object
      { name: "wellness_data", type: "string", isOptional: true }, // JSON object
      { name: "notification_preferences", type: "string", isOptional: true }, // JSON object
      { name: "verification_status", type: "string", isOptional: true },
      { name: "onboarded_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Wellness Assessments Table - Wellness tracking
  tableSchema({
    name: "wellness_assessments",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "assessment_id", type: "string", isIndexed: true },
      { name: "session_id", type: "string", isOptional: true },
      { name: "program_id", type: "string", isOptional: true },
      
      // Assessment data
      { name: "time_point", type: "string" }, // T0, T1, T2, T3, T4...
      { name: "answers_encrypted", type: "string" }, // Encrypted raw answers
      { name: "scores_json", type: "string" }, // JSON: {energy_index, stress_index, social_support_score, self_compassion_score}
      { name: "mbti_type", type: "string" }, // User's MBTI type at time of assessment
      { name: "assessment_type", type: "string" }, // 'onboarding', 'therapy_session', 'follow_up'
      { name: "completed_at", type: "number" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),
];

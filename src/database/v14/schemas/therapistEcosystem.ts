/**
 * Therapist Ecosystem Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor het complete therapeut ecosystem:
 * - therapists: Therapeuten met eigen bookingsysteem
 * - zoomspace_coaches: ZoomSpace coaches met geïntegreerd booking
 * - appointments: Afspraken voor beide types
 * - session_notes: Sessie notities (encrypted)
 * - wellness_scores: Holistische welzijn scores (encrypted)
 * - push_notifications: Push berichten voor sessie management
 * - therapist_reviews: Reviews voor therapeuten en coaches
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const therapistEcosystemSchema = [
  // Therapists Table - Therapeuten met eigen bookingsysteem
  tableSchema({
    name: "therapists",
    columns: [
      // Basis informatie
      { name: "name", type: "string" },
      { name: "email", type: "string", isIndexed: true },
      { name: "phone", type: "string", isOptional: true },
      { name: "avatar_url", type: "string", isOptional: true },
      
      // Professional informatie
      { name: "specialty", type: "string" },
      { name: "mbti_specialization", type: "string" }, // JSON array
      { name: "rating", type: "number" },
      { name: "experience_years", type: "number" },
      { name: "consultation_fee", type: "number" },
      
      // Locatie en beschikbaarheid
      { name: "location", type: "string", isIndexed: true },
      { name: "region", type: "string", isIndexed: true },
      { name: "availability", type: "string" }, // JSON object
      
      // Eigen bookingsysteem
      { name: "external_booking_url", type: "string", isOptional: true },
      { name: "booking_system_type", type: "string", isOptional: true }, // 'calendly', 'acuity', 'custom'
      { name: "booking_instructions", type: "string", isOptional: true },
      
      // Professional details
      { name: "bio", type: "string" },
      { name: "languages", type: "string" }, // JSON array
      { name: "certifications", type: "string", isOptional: true }, // JSON array
      { name: "is_active", type: "boolean" },
      { name: "is_existing_practice", type: "boolean" },
      { name: "website_url", type: "string", isOptional: true },
      
      // Sync informatie
      { name: "last_synced", type: "number" },
      { name: "sync_region", type: "string", isIndexed: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),

  // ZoomSpace Coaches Table - Coaches met geïntegreerd booking
  tableSchema({
    name: "zoomspace_coaches",
    columns: [
      // Basis informatie
      { name: "name", type: "string" },
      { name: "email", type: "string", isIndexed: true },
      { name: "phone", type: "string", isOptional: true },
      { name: "avatar_url", type: "string", isOptional: true },
      
      // Professional informatie
      { name: "specialty", type: "string" },
      { name: "mbti_specialization", type: "string" }, // JSON array
      { name: "rating", type: "number" },
      { name: "experience_years", type: "number" },
      { name: "consultation_fee", type: "number" }, // 0 voor gratis coaches
      
      // ZoomSpace specifiek
      { name: "zoomspace_id", type: "string", isIndexed: true },
      { name: "zoomspace_profile_url", type: "string", isOptional: true },
      { name: "zoom_meeting_room", type: "string", isOptional: true },
      
      // Professional details
      { name: "bio", type: "string" },
      { name: "languages", type: "string" }, // JSON array
      { name: "certifications", type: "string", isOptional: true }, // JSON array
      { name: "is_active", type: "boolean" },
      
      // Sync informatie
      { name: "last_synced", type: "number" },
      { name: "sync_region", type: "string", isIndexed: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),

  // Appointments Table - Afspraken voor beide types
  tableSchema({
    name: "appointments",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "therapist_id", type: "string", isOptional: true },
      { name: "coach_id", type: "string", isOptional: true },
      { name: "appointment_type", type: "string" }, // 'therapist', 'coach'
      
      // Afspraak details
      { name: "session_type", type: "string" }, // 'live', 'zoom', 'hybrid'
      { name: "scheduled_at", type: "number" },
      { name: "duration_minutes", type: "number" },
      { name: "status", type: "string" }, // 'scheduled', 'completed', 'cancelled', 'no_show'
      { name: "consultation_fee", type: "number" },
      
      // Zoom details
      { name: "zoom_meeting_url", type: "string", isOptional: true },
      { name: "zoom_meeting_id", type: "string", isOptional: true },
      { name: "zoom_meeting_password", type: "string", isOptional: true },
      
      // Voorbereiding
      { name: "pre_session_questions", type: "string", isOptional: true },
      { name: "goals", type: "string", isOptional: true }, // JSON array
      { name: "session_focus", type: "string", isOptional: true },
      
      // Payment (alleen voor therapeuten)
      { name: "payment_required", type: "boolean" },
      { name: "payment_status", type: "string", isOptional: true }, // 'pending', 'paid', 'failed'
      { name: "payment_method", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Session Notes Table - Sessie notities (encrypted)
  tableSchema({
    name: "session_notes",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "appointment_id", type: "string", isIndexed: true },
      { name: "therapist_id", type: "string", isOptional: true },
      { name: "coach_id", type: "string", isOptional: true },
      
      // Notities (encrypted)
      { name: "notes_encrypted", type: "string" },
      { name: "session_date", type: "number" },
      { name: "session_duration", type: "number" },
      { name: "session_type", type: "string" }, // 'therapist', 'coach'
      
      // Follow-up
      { name: "homework_assigned", type: "string", isOptional: true },
      { name: "next_session_goals", type: "string", isOptional: true },
      { name: "progress_notes", type: "string", isOptional: true },
      
      // Privacy
      { name: "is_encrypted", type: "boolean" },
      { name: "sync_to_server", type: "boolean" },
      { name: "encryption_key_id", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Holistic Wellness Score Table - Welzijn scores (encrypted)
  // Note: This extends the existing wellness_assessments table from onboarding schema
  tableSchema({
    name: "wellness_scores",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "session_id", type: "string", isOptional: true },
      { name: "appointment_id", type: "string", isOptional: true }, // Link to therapy sessions
      
      // Wellness scores (encrypted) - matches existing wellness_assessments structure
      { name: "overall_score", type: "number" }, // 1-10
      { name: "physical_wellness", type: "number" }, // 1-10
      { name: "mental_wellness", type: "number" }, // 1-10
      { name: "emotional_wellness", type: "number" }, // 1-10
      { name: "social_wellness", type: "number" }, // 1-10
      { name: "spiritual_wellness", type: "number" }, // 1-10
      
      // Detailed scores (encrypted JSON) - compatible with existing scores_json
      { name: "detailed_scores_encrypted", type: "string" },
      { name: "wellness_notes_encrypted", type: "string", isOptional: true },
      
      // Tracking - matches existing wellness_assessments structure
      { name: "assessment_date", type: "number" },
      { name: "assessment_type", type: "string" }, // 'pre_session', 'post_session', 'weekly', 'monthly', 'therapy_session'
      { name: "time_point", type: "string", isOptional: true }, // T0, T1, T2, T3, T4... (matches existing)
      { name: "trend_direction", type: "string", isOptional: true }, // 'improving', 'stable', 'declining'
      
      // Privacy
      { name: "is_encrypted", type: "boolean" },
      { name: "sync_to_server", type: "boolean" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Push Notifications Table - Push berichten voor sessie management
  tableSchema({
    name: "push_notifications",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "appointment_id", type: "string", isOptional: true },
      
      // Notification details
      { name: "title", type: "string" },
      { name: "message", type: "string" },
      { name: "type", type: "string" }, // 'appointment_reminder', 'session_prep', 'wellness_check', 'homework_reminder'
      { name: "scheduled_for", type: "number" },
      { name: "sent_at", type: "number", isOptional: true },
      { name: "is_sent", type: "boolean" },
      { name: "is_read", type: "boolean" },
      
      // Action data
      { name: "action_url", type: "string", isOptional: true },
      { name: "action_data", type: "string", isOptional: true }, // JSON
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Therapist Reviews Table - Reviews voor therapeuten en coaches
  tableSchema({
    name: "therapist_reviews",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "therapist_id", type: "string", isOptional: true },
      { name: "coach_id", type: "string", isOptional: true },
      { name: "appointment_id", type: "string", isIndexed: true },
      
      // Review details
      { name: "rating", type: "number" }, // 1-5
      { name: "review_text", type: "string", isOptional: true },
      { name: "is_anonymous", type: "boolean" },
      
      // Privacy
      { name: "is_public", type: "boolean" },
      { name: "sync_to_server", type: "boolean" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),
];

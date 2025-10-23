/**
 * Chat & Journal Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor chat en journaling:
 * - chat_messages: Chat berichten
 * - journal_entries: Journal entries
 * - contacts: Chat contacts
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const chatJournalSchema = [
  // Chat Messages Table - Chat berichten
  tableSchema({
    name: "chat_messages",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "contact_id", type: "string", isIndexed: true, isOptional: true },
      { name: "session_id", type: "string", isIndexed: true, isOptional: true },
      
      // Message data
      { name: "message", type: "string" },
      { name: "response", type: "string", isOptional: true },
      { name: "is_user", type: "boolean" },
      { name: "message_type", type: "string", isOptional: true }, // 'text', 'image', 'voice', 'file'
      
      // Context
      { name: "mbti_context", type: "string", isOptional: true },
      { name: "context_type", type: "string", isOptional: true }, // 'imagination', 'chat', 'journal', 'coaching'
      
      // AI integratie
      { name: "ai_model", type: "string", isOptional: true },
      { name: "tokens_used", type: "number", isOptional: true },
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // Status
      { name: "is_read", type: "boolean", isOptional: true },
      { name: "is_edited", type: "boolean", isOptional: true },
      { name: "edit_count", type: "number", isOptional: true },
      
      // Timestamps
      { name: "timestamp", type: "number" },
      { name: "read_at", type: "number", isOptional: true },
      { name: "edited_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Journal Entries Table - Journal entries
  tableSchema({
    name: "journal_entries",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Entry data
      { name: "title", type: "string" },
      { name: "content", type: "string" },
      { name: "mood_rating", type: "number", isOptional: true }, // 1-5
      { name: "tags", type: "string", isOptional: true }, // JSON array
      
      // Categorisatie
      { name: "category", type: "string", isOptional: true }, // 'self-awareness', 'relationships', 'growth', 'creativity', 'values'
      { name: "prompt_id", type: "string", isOptional: true },
      { name: "mbti_type", type: "string", isOptional: true },
      
      // AI integratie
      { name: "ai_insights", type: "string", isOptional: true }, // AI analysis
      { name: "vector_embedding_id", type: "string", isOptional: true },
      { name: "sentiment_score", type: "number", isOptional: true },
      
      // Content reflecties
      { name: "content_reflections", type: "string", isOptional: true }, // JSON array
      { name: "insights", type: "string", isOptional: true }, // JSON array
      
      // Timestamps
      { name: "date", type: "number" },
      { name: "last_edited", type: "number", isOptional: true },
      
      // Status
      { name: "is_private", type: "boolean", isOptional: true },
      { name: "is_favorite", type: "boolean", isOptional: true },
      { name: "word_count", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Contacts Table - Chat contacts
  tableSchema({
    name: "contacts",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "contact_id", type: "string", isIndexed: true },
      
      // Contact data
      { name: "name", type: "string" },
      { name: "avatar", type: "string", isOptional: true },
      { name: "mbti_type", type: "string", isOptional: true },
      
      // Contact type
      { name: "is_ai", type: "boolean" },
      { name: "contact_type", type: "string", isOptional: true }, // 'human', 'ai_coach', 'ai_assistant', 'ai_therapist'
      
      // Status
      { name: "is_online", type: "boolean" },
      { name: "is_blocked", type: "boolean", isOptional: true },
      { name: "is_favorite", type: "boolean", isOptional: true },
      
      // Last interaction
      { name: "last_message", type: "string", isOptional: true },
      { name: "last_message_time", type: "number", isOptional: true },
      { name: "unread_count", type: "number" },
      
      // AI specifiek
      { name: "ai_model", type: "string", isOptional: true },
      { name: "ai_personality", type: "string", isOptional: true },
      { name: "ai_specialization", type: "string", isOptional: true },
      
      // Contact info
      { name: "email", type: "string", isOptional: true },
      { name: "phone", type: "string", isOptional: true },
      { name: "notes", type: "string", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),
];

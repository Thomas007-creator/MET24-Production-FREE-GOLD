/**
 * Active Imagination Schema - WatermelonDB V14
 * 
 * Bevat alle tabellen voor Actieve Imaginatie functionaliteiten:
 * - imagination_sessions: Imagination session tracking
 * - inspirations: Inspirations management systeem
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const activeImaginationSchema = [
  // Imagination Sessions Table - Session tracking voor Actieve Imaginatie
  tableSchema({
    name: "imagination_sessions",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      
      // Session data (uitbreiding van bestaande MET24ImaginationSession)
      { name: "session_title", type: "string" },
      { name: "session_description", type: "string" },
      { name: "levensgebied", type: "string" },
      { name: "step", type: "number" },
      { name: "response", type: "string", isOptional: true },
      { name: "ai_query", type: "string", isOptional: true },
      { name: "ai_response", type: "string", isOptional: true },
      { name: "session_data", type: "string", isOptional: true }, // JSON
      
      // AI integratie
      { name: "session_embedding", type: "string", isOptional: true }, // JSON array
      { name: "mcp_processed", type: "boolean" },
      { name: "mcp_insights", type: "string", isOptional: true }, // JSON
      
      // Status
      { name: "is_active", type: "boolean" },
      { name: "version", type: "number" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),

  // Inspirations Table - V3 inspirations management systeem
  tableSchema({
    name: "inspirations",
    columns: [
      // Relaties
      { name: "user_id", type: "string", isIndexed: true },
      { name: "imagination_session_id", type: "string", isIndexed: true, isOptional: true },
      
      // Inspiration data
      { name: "title", type: "string" },
      { name: "summary", type: "string" },
      { name: "source", type: "string" }, // 'Actieve Imaginatie - Stap 1'
      { name: "content", type: "string", isOptional: true },
      
      // Status
      { name: "status", type: "string" }, // 'active', 'archived', 'transferred'
      { name: "is_transferred_to_journal", type: "boolean" },
      { name: "journal_entry_id", type: "string", isOptional: true },
      
      // AI integratie
      { name: "ai_insights", type: "string", isOptional: true },
      { name: "sentiment_score", type: "number", isOptional: true },
      { name: "vector_embedding_id", type: "string", isOptional: true },
      
      // Timestamps
      { name: "timestamp", type: "number" },
      { name: "archived_at", type: "number", isOptional: true },
      { name: "transferred_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
    ],
  }),
];

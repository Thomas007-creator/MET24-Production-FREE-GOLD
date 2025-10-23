/**
 * Inspiration Model - WatermelonDB V14
 * 
 * Model voor inspirations in Actieve Imaginatie
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class Inspiration extends Model {
  static table = "inspirations";

  // Relaties
  @field("user_id") userId!: string;
  @field("imagination_session_id") imaginationSessionId?: string;

  // Inspiration data
  @field("title") title!: string;
  @field("summary") summary!: string;
  @field("source") source!: string; // 'Actieve Imaginatie - Stap 1'
  @field("content") content?: string;

  // Status
  @field("status") status!: string; // 'active', 'archived', 'transferred'
  @field("is_transferred_to_journal") isTransferredToJournal!: boolean;
  @field("journal_entry_id") journalEntryId?: string;

  // AI integratie
  @field("ai_insights") aiInsights?: string;
  @field("sentiment_score") sentimentScore?: number;
  @field("vector_embedding_id") vectorEmbeddingId?: string;

  // Timestamps
  @field("timestamp") timestamp!: number;
  @field("archived_at") archivedAt?: number;
  @field("transferred_at") transferredAt?: number;

  // Auditing
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}

/**
 * ImaginationSession Model - WatermelonDB V14
 * 
 * Model voor imagination sessions in Actieve Imaginatie
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class ImaginationSession extends Model {
  static table = "imagination_sessions";

  // Relaties
  @field("user_id") userId!: string;

  // Session data
  @field("session_title") sessionTitle!: string;
  @field("session_description") sessionDescription!: string;
  @field("levensgebied") levensgebied!: string;
  @field("step") step!: number;
  @field("response") response?: string;
  @field("ai_query") aiQuery?: string;
  @field("ai_response") aiResponse?: string;
  @field("session_data") sessionData?: string; // JSON

  // AI integratie
  @field("session_embedding") sessionEmbedding?: string; // JSON array
  @field("mcp_processed") mcpProcessed!: boolean;
  @field("mcp_insights") mcpInsights?: string; // JSON

  // Status
  @field("is_active") isActive!: boolean;
  @field("version") version!: number;

  // Auditing
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
}

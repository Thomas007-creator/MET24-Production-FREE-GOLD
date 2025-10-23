/**
 * Extensions Schema - WatermelonDB V14
 * 
 * Bevat tabellen voor toekomstige uitbreidingen:
 * - future_extensions: Algemene extensie tabel voor nieuwe features
 * 
 * Deze categorie maakt het mogelijk om nieuwe functionaliteiten toe te voegen
 * zonder het hoofd-schema te wijzigen.
 * 
 * @version 14.0.0
 */

import { tableSchema } from "@nozbe/watermelondb";

export const extensionsSchema = [
  // Future Extensions Table - Voor toekomstige features
  tableSchema({
    name: "future_extensions",
    columns: [
      // Basis identificatie
      { name: "extension_id", type: "string", isIndexed: true },
      { name: "extension_type", type: "string", isIndexed: true }, // 'ai_feature', 'content_type', 'integration', 'plugin'
      { name: "extension_name", type: "string" },
      { name: "version", type: "string", isOptional: true },
      
      // Relaties
      { name: "user_id", type: "string", isIndexed: true, isOptional: true },
      { name: "parent_extension_id", type: "string", isIndexed: true, isOptional: true },
      
      // Extension data
      { name: "data_json", type: "string" }, // JSON data voor de extensie
      { name: "configuration", type: "string", isOptional: true }, // JSON configuratie
      { name: "permissions", type: "string", isOptional: true }, // JSON permissions
      
      // Status en lifecycle
      { name: "status", type: "string", isOptional: true }, // 'active', 'inactive', 'deprecated', 'beta'
      { name: "is_enabled", type: "boolean" },
      { name: "is_public", type: "boolean", isOptional: true },
      { name: "is_premium", type: "boolean", isOptional: true },
      
      // Metadata
      { name: "description", type: "string", isOptional: true },
      { name: "author", type: "string", isOptional: true },
      { name: "category", type: "string", isOptional: true },
      { name: "tags", type: "string", isOptional: true }, // JSON array
      
      // Performance en usage
      { name: "usage_count", type: "number", isOptional: true },
      { name: "last_used", type: "number", isOptional: true },
      { name: "performance_metrics", type: "string", isOptional: true }, // JSON metrics
      
      // Dependencies
      { name: "dependencies", type: "string", isOptional: true }, // JSON array van extension_ids
      { name: "compatibility_version", type: "string", isOptional: true },
      
      // Timestamps
      { name: "installed_at", type: "number", isOptional: true },
      { name: "last_updated", type: "number", isOptional: true },
      { name: "expires_at", type: "number", isOptional: true },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Extension Events Table - Voor tracking van extensie events
  tableSchema({
    name: "extension_events",
    columns: [
      // Relaties
      { name: "extension_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true, isOptional: true },
      
      // Event data
      { name: "event_type", type: "string", isIndexed: true }, // 'install', 'uninstall', 'enable', 'disable', 'error', 'usage'
      { name: "event_data", type: "string", isOptional: true }, // JSON event data
      { name: "severity", type: "string", isOptional: true }, // 'info', 'warning', 'error', 'critical'
      
      // Context
      { name: "session_id", type: "string", isOptional: true },
      { name: "device_info", type: "string", isOptional: true }, // JSON device info
      { name: "app_version", type: "string", isOptional: true },
      
      // Timestamps
      { name: "event_timestamp", type: "number" },
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),

  // Extension Settings Table - Voor extensie-specifieke instellingen
  tableSchema({
    name: "extension_settings",
    columns: [
      // Relaties
      { name: "extension_id", type: "string", isIndexed: true },
      { name: "user_id", type: "string", isIndexed: true, isOptional: true },
      
      // Setting data
      { name: "setting_key", type: "string", isIndexed: true },
      { name: "setting_value", type: "string" },
      { name: "setting_type", type: "string", isOptional: true }, // 'string', 'number', 'boolean', 'json'
      { name: "is_encrypted", type: "boolean", isOptional: true },
      
      // Metadata
      { name: "description", type: "string", isOptional: true },
      { name: "default_value", type: "string", isOptional: true },
      { name: "validation_rules", type: "string", isOptional: true }, // JSON validation rules
      
      // Auditing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true },
    ],
  }),
];

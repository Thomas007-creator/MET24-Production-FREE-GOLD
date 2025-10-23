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

  // Audit Events Table - Voor ChatLLM privacy compliance audit trail
  tableSchema({
    name: "audit_events",
    columns: [
      // Core audit identifiers - Compatible met Supabase schema
      { name: "audit_id", type: "string", isIndexed: true }, // UUID primary key
      { name: "trace_id", type: "string", isIndexed: true }, // Request tracking
      { name: "user_id", type: "string", isIndexed: true },
      { name: "session_id", type: "string", isIndexed: true, isOptional: true },
      
      // Event details
      { name: "event_type", type: "string", isIndexed: true }, // 'chat_llm_process', 'data_sanitization', 'fallback_triggered', etc.
      { name: "action", type: "string", isIndexed: true }, // 'process_text', 'sanitize_data', 'emergency_block', etc.
      { name: "resource_type", type: "string", isOptional: true }, // 'chat_message', 'user_data', 'system_prompt'
      { name: "resource_id", type: "string", isOptional: true }, // ID van het resource dat verwerkt werd
      
      // Privacy & compliance
      { name: "data_sensitivity_level", type: "string", isIndexed: true }, // 'PUBLIC', 'PERSONAL', 'SENSITIVE', 'CONFIDENTIAL'
      { name: "processing_method", type: "string" }, // 'webgpu_local', 'cpu_fallback', 'pattern_fallback', 'emergency_block'
      { name: "sanitization_applied", type: "boolean" },
      { name: "external_api_used", type: "boolean" }, // ALTIJD false voor privacy-first
      { name: "compliance_flags", type: "string", isOptional: true }, // JSON array: ['eu_ai_act', 'gdpr', 'privacy_by_design']
      
      // Request/response data (sanitized)
      { name: "input_hash", type: "string", isOptional: true }, // SHA-256 hash van originele input
      { name: "output_hash", type: "string", isOptional: true }, // SHA-256 hash van output
      { name: "input_length", type: "number", isOptional: true }, // Character count original
      { name: "output_length", type: "number", isOptional: true }, // Character count sanitized
      { name: "sanitized_snippets", type: "string", isOptional: true }, // JSON van gesanitiseerde delen (geen PII)
      
      // Performance & system metrics
      { name: "processing_time_ms", type: "number", isOptional: true },
      { name: "model_used", type: "string", isOptional: true }, // 'llama_3_2_1b', 'phi_3_mini', 'pattern_filter'
      { name: "tokens_processed", type: "number", isOptional: true },
      { name: "memory_usage_mb", type: "number", isOptional: true },
      { name: "gpu_utilization", type: "number", isOptional: true },
      
      // Error handling & fallbacks
      { name: "status", type: "string", isIndexed: true }, // 'success', 'warning', 'error', 'blocked'
      { name: "error_type", type: "string", isOptional: true }, // 'webgpu_fail', 'memory_limit', 'safety_block'
      { name: "error_message", type: "string", isOptional: true }, // Sanitized error message
      { name: "fallback_triggered", type: "boolean" },
      { name: "fallback_reason", type: "string", isOptional: true },
      
      // Chain integrity - Voor hash chain validation
      { name: "previous_hash", type: "string", isOptional: true }, // Hash van vorige audit event
      { name: "event_hash", type: "string" }, // Hash van dit event (integrity check)
      { name: "chain_position", type: "number", isOptional: true }, // Positie in hash chain
      
      // Context & metadata
      { name: "user_agent", type: "string", isOptional: true },
      { name: "ip_address_hash", type: "string", isOptional: true }, // Gehashed IP voor privacy
      { name: "app_version", type: "string", isOptional: true },
      { name: "platform", type: "string", isOptional: true }, // 'web', 'mobile', 'desktop'
      { name: "locale", type: "string", isOptional: true },
      
      // Supabase sync status
      { name: "sync_status", type: "string", isIndexed: true }, // 'pending', 'synced', 'failed', 'local_only'
      { name: "last_synced_at", type: "number", isOptional: true },
      { name: "sync_attempts", type: "number", isOptional: true },
      { name: "sync_error", type: "string", isOptional: true },
      
      // Timestamps
      { name: "event_timestamp", type: "number" }, // Exact moment van processing
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
      
      // Toekomstige uitbreidingen
      { name: "metadata", type: "string", isOptional: true }, // JSON voor extra audit data
    ],
  }),
];

/**
 * AuditEvent Model - WatermelonDB V14
 * 
 * Model voor audit events compatibel met Supabase audit_events table
 * Voor ChatLLM privacy compliance en EU AI Act compliance
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AuditEvent extends Model {
  static table = 'audit_events';

  // Core audit identifiers
  @field('audit_id') auditId!: string;
  @field('trace_id') traceId!: string;
  @field('user_id') userId!: string;
  @field('session_id') sessionId!: string | null;
  
  // Event details
  @field('event_type') eventType!: string;
  @field('action') action!: string;
  @field('resource_type') resourceType!: string | null;
  @field('resource_id') resourceId!: string | null;
  
  // Privacy & compliance
  @field('data_sensitivity_level') dataSensitivityLevel!: string;
  @field('processing_method') processingMethod!: string;
  @field('sanitization_applied') sanitizationApplied!: boolean;
  @field('external_api_used') externalApiUsed!: boolean;
  @field('compliance_flags') complianceFlags!: string | null; // JSON array
  
  // Request/response data (sanitized)
  @field('input_hash') inputHash!: string | null;
  @field('output_hash') outputHash!: string | null;
  @field('input_length') inputLength!: number | null;
  @field('output_length') outputLength!: number | null;
  @field('sanitized_snippets') sanitizedSnippets!: string | null; // JSON
  
  // Performance & system metrics
  @field('processing_time_ms') processingTimeMs!: number | null;
  @field('model_used') modelUsed!: string | null;
  @field('tokens_processed') tokensProcessed!: number | null;
  @field('memory_usage_mb') memoryUsageMb!: number | null;
  @field('gpu_utilization') gpuUtilization!: number | null;
  
  // Error handling & fallbacks
  @field('status') status!: string;
  @field('error_type') errorType!: string | null;
  @field('error_message') errorMessage!: string | null;
  @field('fallback_triggered') fallbackTriggered!: boolean;
  @field('fallback_reason') fallbackReason!: string | null;
  
  // Chain integrity
  @field('previous_hash') previousHash!: string | null;
  @field('event_hash') eventHash!: string;
  @field('chain_position') chainPosition!: number | null;
  
  // Context & metadata
  @field('user_agent') userAgent!: string | null;
  @field('ip_address_hash') ipAddressHash!: string | null;
  @field('app_version') appVersion!: string | null;
  @field('platform') platform!: string | null;
  @field('locale') locale!: string | null;
  
  // Supabase sync status
  @field('sync_status') syncState!: string;
  @field('last_synced_at') lastSyncedAt!: number | null;
  @field('sync_attempts') syncAttempts!: number | null;
  @field('sync_error') syncError!: string | null;
  
  // Timestamps
  @field('event_timestamp') eventTimestamp!: number;
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
  @field('created_by') createdBy!: string;
  
  // Extensions
  @field('metadata') metadata!: string | null; // JSON

  /**
   * Converteer naar Supabase formaat voor sync
   */
  toSupabaseFormat() {
    return {
      audit_id: this.auditId,
      trace_id: this.traceId,
      user_id: this.userId,
      session_id: this.sessionId,
      event_type: this.eventType,
      action: this.action,
      resource_type: this.resourceType,
      resource_id: this.resourceId,
      data_sensitivity_level: this.dataSensitivityLevel,
      processing_method: this.processingMethod,
      sanitization_applied: this.sanitizationApplied,
      external_api_used: this.externalApiUsed,
      compliance_flags: this.complianceFlags ? JSON.parse(this.complianceFlags) : null,
      input_hash: this.inputHash,
      output_hash: this.outputHash,
      input_length: this.inputLength,
      output_length: this.outputLength,
      sanitized_snippets: this.sanitizedSnippets ? JSON.parse(this.sanitizedSnippets) : null,
      processing_time_ms: this.processingTimeMs,
      model_used: this.modelUsed,
      tokens_processed: this.tokensProcessed,
      memory_usage_mb: this.memoryUsageMb,
      gpu_utilization: this.gpuUtilization,
      status: this.status,
      error_type: this.errorType,
      error_message: this.errorMessage,
      fallback_triggered: this.fallbackTriggered,
      fallback_reason: this.fallbackReason,
      previous_hash: this.previousHash,
      event_hash: this.eventHash,
      chain_position: this.chainPosition,
      user_agent: this.userAgent,
      ip_address_hash: this.ipAddressHash,
      app_version: this.appVersion,
      platform: this.platform,
      locale: this.locale,
      event_timestamp: new Date(this.eventTimestamp).toISOString(),
      created_at: new Date(this.createdAt).toISOString(),
      updated_at: new Date(this.updatedAt).toISOString(),
      created_by: this.createdBy,
      metadata: this.metadata ? JSON.parse(this.metadata) : null
    };
  }

  /**
   * Create from Supabase data
   */
  static fromSupabaseData(data: any) {
    return {
      audit_id: data.audit_id,
      trace_id: data.trace_id,
      user_id: data.user_id,
      session_id: data.session_id,
      event_type: data.event_type,
      action: data.action,
      resource_type: data.resource_type,
      resource_id: data.resource_id,
      data_sensitivity_level: data.data_sensitivity_level,
      processing_method: data.processing_method,
      sanitization_applied: data.sanitization_applied,
      external_api_used: data.external_api_used,
      compliance_flags: data.compliance_flags ? JSON.stringify(data.compliance_flags) : null,
      input_hash: data.input_hash,
      output_hash: data.output_hash,
      input_length: data.input_length,
      output_length: data.output_length,
      sanitized_snippets: data.sanitized_snippets ? JSON.stringify(data.sanitized_snippets) : null,
      processing_time_ms: data.processing_time_ms,
      model_used: data.model_used,
      tokens_processed: data.tokens_processed,
      memory_usage_mb: data.memory_usage_mb,
      gpu_utilization: data.gpu_utilization,
      status: data.status,
      error_type: data.error_type,
      error_message: data.error_message,
      fallback_triggered: data.fallback_triggered,
      fallback_reason: data.fallback_reason,
      previous_hash: data.previous_hash,
      event_hash: data.event_hash,
      chain_position: data.chain_position,
      user_agent: data.user_agent,
      ip_address_hash: data.ip_address_hash,
      app_version: data.app_version,
      platform: data.platform,
      locale: data.locale,
      sync_state: 'synced',
      last_synced_at: Date.now(),
      sync_attempts: 1,
      sync_error: null,
      event_timestamp: new Date(data.event_timestamp).getTime(),
      created_at: new Date(data.created_at).getTime(),
      updated_at: new Date(data.updated_at).getTime(),
      created_by: data.created_by,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null
    };
  }
}
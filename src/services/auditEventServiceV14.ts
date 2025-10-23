/**
 * Audit Event Service - WatermelonDB V14 (UPDATED)
 * 
 * Service voor audit events - lokale backup en sync met Supabase V14 functions
 * Voor ChatLLM privacy compliance en EU AI Act compliance
 * Compatible met ULTRA SAFE Supabase deployment
 * 
 * @version 14.1.0
 * @author Thomas
 */

import database from '../database/v14/database';
import AuditEvent from '../database/v14/models/AuditEvent';
import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { Q } from '@nozbe/watermelondb';

// Types
export interface AuditEventData {
  traceId: string;
  userId: string;
  sessionId?: string;
  eventType: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  dataSensitivityLevel: 'PUBLIC' | 'PERSONAL' | 'SENSITIVE' | 'CONFIDENTIAL';
  processingMethod: 'webgpu_local' | 'cpu_fallback' | 'pattern_fallback' | 'emergency_block';
  sanitizationApplied: boolean;
  externalApiUsed: boolean;
  complianceFlags?: string[];
  inputHash?: string;
  outputHash?: string;
  inputLength?: number;
  outputLength?: number;
  sanitizedSnippets?: any;
  processingTimeMs?: number;
  modelUsed?: string;
  tokensProcessed?: number;
  memoryUsageMb?: number;
  gpuUtilization?: number;
  status: 'success' | 'warning' | 'error' | 'blocked';
  errorType?: string;
  errorMessage?: string;
  fallbackTriggered: boolean;
  fallbackReason?: string;
  previousHash?: string;
  chainPosition?: number;
  userAgent?: string;
  ipAddressHash?: string;
  appVersion?: string;
  platform?: string;
  locale?: string;
  metadata?: any;
}

// Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

export class AuditEventService {
  private static instance: AuditEventService;
  private hashChain: string[] = [];

  private constructor() {
    this.initializeHashChain();
  }

  static getInstance(): AuditEventService {
    if (!AuditEventService.instance) {
      AuditEventService.instance = new AuditEventService();
    }
    return AuditEventService.instance;
  }

  /**
   * Initialize hash chain from laatste audit event
   */
  private async initializeHashChain(): Promise<void> {
    try {
      const lastEventCollection = database.get('audit_events');
      const lastEvent = await lastEventCollection.query(
        Q.sortBy('chain_position', Q.desc),
        Q.take(1)
      ).fetch();

      if (lastEvent.length > 0) {
        const event = lastEvent[0] as AuditEvent;
        this.hashChain.push(event.eventHash);
      }
    } catch (error) {
      logger.warn('Failed to initialize hash chain, starting fresh', undefined, error);
    }
  }

  /**
   * Create audit event - lokaal opslaan en queue voor sync
   */
  async createAuditEvent(data: AuditEventData): Promise<AuditEvent> {
    try {
      const auditId = crypto.randomUUID();
      const eventTimestamp = Date.now();
      const eventHash = await this.generateEventHash(data, eventTimestamp);
      const previousHash = this.hashChain.length > 0 ? this.hashChain[this.hashChain.length - 1] : null;
      const chainPosition = this.hashChain.length + 1;

      // Create audit event in WatermelonDB
      const auditEvent = await database.write(async () => {
        const auditCollection = database.get('audit_events');
        return await auditCollection.create((event: any) => {
          event._raw.audit_id = auditId;
          event._raw.trace_id = data.traceId;
          event._raw.user_id = data.userId;
          event._raw.session_id = data.sessionId || null;
          event._raw.event_type = data.eventType;
          event._raw.action = data.action;
          event._raw.resource_type = data.resourceType || null;
          event._raw.resource_id = data.resourceId || null;
          event._raw.data_sensitivity_level = data.dataSensitivityLevel;
          event._raw.processing_method = data.processingMethod;
          event._raw.sanitization_applied = data.sanitizationApplied;
          event._raw.external_api_used = data.externalApiUsed;
          event._raw.compliance_flags = data.complianceFlags ? JSON.stringify(data.complianceFlags) : null;
          event._raw.input_hash = data.inputHash || null;
          event._raw.output_hash = data.outputHash || null;
          event._raw.input_length = data.inputLength || null;
          event._raw.output_length = data.outputLength || null;
          event._raw.sanitized_snippets = data.sanitizedSnippets ? JSON.stringify(data.sanitizedSnippets) : null;
          event._raw.processing_time_ms = data.processingTimeMs || null;
          event._raw.model_used = data.modelUsed || null;
          event._raw.tokens_processed = data.tokensProcessed || null;
          event._raw.memory_usage_mb = data.memoryUsageMb || null;
          event._raw.gpu_utilization = data.gpuUtilization || null;
          event._raw.status = data.status;
          event._raw.error_type = data.errorType || null;
          event._raw.error_message = data.errorMessage || null;
          event._raw.fallback_triggered = data.fallbackTriggered;
          event._raw.fallback_reason = data.fallbackReason || null;
          event._raw.previous_hash = previousHash;
          event._raw.event_hash = eventHash;
          event._raw.chain_position = chainPosition;
          event._raw.user_agent = data.userAgent || null;
          event._raw.ip_address_hash = data.ipAddressHash || null;
          event._raw.app_version = data.appVersion || null;
          event._raw.platform = data.platform || null;
          event._raw.locale = data.locale || null;
          event._raw.sync_status = 'pending';
          event._raw.last_synced_at = null;
          event._raw.sync_attempts = 0;
          event._raw.sync_error = null;
          event._raw.supabase_audit_id = null;
          event._raw.event_timestamp = eventTimestamp;
        });
      });

      // Update hash chain
      this.hashChain.push(eventHash);

      // Queue voor background sync naar Supabase
      this.queueForSync(auditEvent as AuditEvent);

      logger.info(`Audit event created locally: ${auditId}`);
      return auditEvent as AuditEvent;

    } catch (error) {
      logger.error('Failed to create audit event', undefined, error);
      throw error;
    }
  }

  /**
   * Queue audit event voor background sync naar Supabase
   */
  private async queueForSync(auditEvent: AuditEvent): Promise<void> {
    try {
      // Background sync - fire and forget
      setTimeout(async () => {
        await this.syncToSupabaseV14(auditEvent);
      }, 100);
    } catch (error) {
      logger.warn('Failed to queue audit event for sync', undefined, error);
    }
  }

  /**
   * Sync audit event naar Supabase met V14 ULTRA SAFE functions
   */
  private async syncToSupabaseV14(auditEvent: AuditEvent): Promise<void> {
    try {
      // Build metadata voor advanced function
      const metadata = this.buildMetadataFromAuditEvent(auditEvent);
      
      // Use new V14 Supabase advanced function
      const { data: supabaseAuditId, error } = await supabase.rpc('create_v14_audit_event_advanced', {
        trace_id_param: auditEvent.traceId,
        user_id_param: auditEvent.userId,
        event_type_param: auditEvent.eventType,
        action_param: auditEvent.action,
        metadata_param: metadata
      });

      if (error) {
        throw error;
      }

      // Update sync status met returned audit ID
      await database.write(async () => {
        await auditEvent.update((event: any) => {
          event._raw.sync_status = 'synced';
          event._raw.last_synced_at = Date.now();
          event._raw.sync_attempts = (event._raw.sync_attempts || 0) + 1;
          event._raw.sync_error = null;
          event._raw.supabase_audit_id = supabaseAuditId; // Link to Supabase audit ID
        });
      });

      logger.info(`Audit event synced via V14 function: ${auditEvent.auditId} -> ${supabaseAuditId}`);

    } catch (error) {
      // Update sync error status
      await database.write(async () => {
        await auditEvent.update((event: any) => {
          event._raw.sync_status = 'failed';
          event._raw.sync_attempts = (event._raw.sync_attempts || 0) + 1;
          event._raw.sync_error = error instanceof Error ? error.message : 'Unknown sync error';
        });
      });

      // Retry logic voor failed syncs
      const retryAttempts = (auditEvent as any)._raw.sync_attempts || 0;
      if (retryAttempts < 3) {
        // Exponential backoff retry
        setTimeout(() => {
          this.syncToSupabaseV14(auditEvent);
        }, Math.pow(2, retryAttempts) * 1000);
      }

      logger.error(`Failed to sync audit event: ${auditEvent.auditId}`, undefined, error);
    }
  }

  /**
   * Build metadata object voor Supabase advanced function
   */
  private buildMetadataFromAuditEvent(auditEvent: AuditEvent): any {
    return {
      data_sensitivity_level: auditEvent.dataSensitivityLevel,
      processing_method: auditEvent.processingMethod,
      processing_time_ms: auditEvent.processingTimeMs,
      tokens_processed: auditEvent.tokensProcessed,
      memory_usage_mb: auditEvent.memoryUsageMb,
      gpu_utilization: auditEvent.gpuUtilization,
      fallback_triggered: auditEvent.fallbackTriggered,
      status: auditEvent.status,
      sanitization_applied: auditEvent.sanitizationApplied,
      external_api_used: auditEvent.externalApiUsed,
      compliance_flags: auditEvent.complianceFlags ? JSON.parse(auditEvent.complianceFlags) : null,
      input_hash: auditEvent.inputHash,
      output_hash: auditEvent.outputHash,
      input_length: auditEvent.inputLength,
      output_length: auditEvent.outputLength,
      sanitized_snippets: auditEvent.sanitizedSnippets ? JSON.parse(auditEvent.sanitizedSnippets) : null,
      model_used: auditEvent.modelUsed,
      error_type: auditEvent.errorType,
      error_message: auditEvent.errorMessage,
      fallback_reason: auditEvent.fallbackReason,
      user_agent: auditEvent.userAgent,
      ip_address_hash: auditEvent.ipAddressHash,
      app_version: auditEvent.appVersion,
      platform: auditEvent.platform,
      locale: auditEvent.locale,
      // Additional metadata
      local_audit_id: auditEvent.auditId,
      local_chain_position: auditEvent.chainPosition,
      sync_metadata: {
        synced_from: 'watermelondb_v14',
        sync_timestamp: Date.now(),
        local_id: auditEvent.id
      }
    };
  }

  /**
   * Retry failed audit event syncs
   */
  async retryFailedSyncs(): Promise<void> {
    try {
      const auditCollection = database.get('audit_events');
      const failedEvents = await auditCollection.query(
        Q.where('sync_status', 'failed'),
        Q.where('sync_attempts', Q.lt(3))
      ).fetch();

      for (const event of failedEvents) {
        await this.syncToSupabaseV14(event as AuditEvent);
      }

      logger.info(`Retried ${failedEvents.length} failed audit event syncs`);

    } catch (error) {
      logger.error('Failed to retry audit event syncs', undefined, error);
    }
  }

  /**
   * Generate event hash voor chain integrity
   */
  private async generateEventHash(data: AuditEventData, timestamp: number): Promise<string> {
    const canonicalString = `${data.traceId}|${data.eventType}|${data.action}|${timestamp}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(canonicalString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate hash chain integrity
   */
  async validateHashChain(traceId?: string): Promise<{
    isValid: boolean;
    errors: string[];
    chainLength: number;
  }> {
    try {
      const auditCollection = database.get('audit_events');
      const query = traceId 
        ? auditCollection.query(Q.where('trace_id', traceId), Q.sortBy('chain_position', Q.asc))
        : auditCollection.query(Q.sortBy('chain_position', Q.asc));
      
      const events = await query.fetch();
      const errors: string[] = [];
      let previousHash: string | null = null;

      for (const event of events) {
        const auditEvent = event as AuditEvent;
        
        // Check if previous hash matches
        if (auditEvent.previousHash !== previousHash) {
          errors.push(`Hash chain broken at position ${auditEvent.chainPosition}: expected ${previousHash}, got ${auditEvent.previousHash}`);
        }
        
        previousHash = auditEvent.eventHash;
      }

      return {
        isValid: errors.length === 0,
        errors,
        chainLength: events.length
      };

    } catch (error) {
      logger.error('Failed to validate hash chain', undefined, error);
      return {
        isValid: false,
        errors: ['Failed to validate hash chain: ' + (error instanceof Error ? error.message : 'Unknown error')],
        chainLength: 0
      };
    }
  }

  /**
   * Get audit events voor monitoring
   */
  async getAuditEvents(filters: {
    traceId?: string;
    userId?: string;
    eventType?: string;
    limit?: number;
  } = {}): Promise<AuditEvent[]> {
    try {
      const auditCollection = database.get('audit_events');
      
      // Build query conditions
      const conditions: any[] = [Q.sortBy('event_timestamp', Q.desc)];
      
      if (filters.traceId) conditions.push(Q.where('trace_id', filters.traceId));
      if (filters.userId) conditions.push(Q.where('user_id', filters.userId));
      if (filters.eventType) conditions.push(Q.where('event_type', filters.eventType));
      if (filters.limit) conditions.push(Q.take(filters.limit));

      const events = await auditCollection.query(...conditions).fetch();
      return events as AuditEvent[];

    } catch (error) {
      logger.error('Failed to get audit events', undefined, error);
      return [];
    }
  }

  /**
   * Get sync status statistics
   */
  async getSyncStatus(): Promise<{
    total: number;
    synced: number;
    pending: number;
    failed: number;
    syncSuccessRate: number;
  }> {
    try {
      const auditCollection = database.get('audit_events');
      const allEvents = await auditCollection.query().fetch();
      
      const total = allEvents.length;
      const synced = allEvents.filter(e => (e as any)._raw.sync_status === 'synced').length;
      const pending = allEvents.filter(e => (e as any)._raw.sync_status === 'pending').length;
      const failed = allEvents.filter(e => (e as any)._raw.sync_status === 'failed').length;
      
      const syncSuccessRate = total > 0 ? (synced / total) * 100 : 100;

      return { total, synced, pending, failed, syncSuccessRate };

    } catch (error) {
      logger.error('Failed to get sync status', undefined, error);
      return { total: 0, synced: 0, pending: 0, failed: 0, syncSuccessRate: 0 };
    }
  }

  async logEvent(eventData: any): Promise<void> {
    try {
      logger.info('Audit event logged', { event_type: eventData.event_type });
      // Stub implementation for compatibility
    } catch (error) {
      logger.error('Failed to log audit event', { error });
    }
  }
}

// Export singleton instance
export default AuditEventService.getInstance();
/**
 * Audit Event Service - WatermelonDB V14
 * 
 * Service voor audit events - lokale backup en sync met Supabase
 * Voor ChatLLM privacy compliance en EU AI Act compliance
 * 
 * @version 14.0.0
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
          event._raw.event_timestamp = eventTimestamp;
          event._raw.created_by = data.userId;
          event._raw.metadata = data.metadata ? JSON.stringify(data.metadata) : null;
        });
      });

      // Update hash chain
      this.hashChain.push(eventHash);

      // Queue for background sync
      this.queueForSync(auditEvent as AuditEvent);

      logger.info(`✅ Audit event created: ${data.eventType}/${data.action}`, {
        auditId,
        traceId: data.traceId,
        processingMethod: data.processingMethod,
        status: data.status
      });

      return auditEvent as AuditEvent;

    } catch (error) {
      logger.error('❌ Failed to create audit event', undefined, error);
      throw error;
    }
  }

  /**
   * Generate event hash voor integrity
   */
  private async generateEventHash(data: AuditEventData, timestamp: number): Promise<string> {
    const hashInput = [
      data.traceId,
      data.userId,
      data.eventType,
      data.action,
      data.processingMethod,
      data.dataSensitivityLevel,
      timestamp.toString(),
      data.inputHash || '',
      data.outputHash || ''
    ].join('|');

    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Queue audit event voor background sync naar Supabase
   */
  private async queueForSync(auditEvent: AuditEvent): Promise<void> {
    try {
      // Background sync - fire and forget
      setTimeout(async () => {
        await this.syncToSupabase(auditEvent);
      }, 100);
    } catch (error) {
      logger.warn('Failed to queue audit event for sync', undefined, error);
    }
  }

  /**
   * Sync audit event naar Supabase met nieuwe V14 functions
   */
  private async syncToSupabase(auditEvent: AuditEvent): Promise<void> {
    try {
      // Use new V14 Supabase function voor consistency en hash chain integrity
      const metadata = this.buildMetadataFromAuditEvent(auditEvent);
      
      const { data: auditId, error } = await supabase.rpc('create_v14_audit_event_advanced', {
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
          event._raw.supabase_audit_id = auditId; // Link to Supabase audit ID
        });
      });

      logger.info(`🔄 Audit event synced via V14 function: ${auditEvent.auditId} -> ${auditId}`);

    } catch (error) {
      // Update sync error status
      await database.write(async () => {
        await auditEvent.update((event: any) => {
          event._raw.sync_status = 'failed';
          event._raw.sync_attempts = (event._raw.sync_attempts || 0) + 1;
          event._raw.sync_error = error instanceof Error ? error.message : 'Unknown sync error';
        });
      });

      // Retry logic for failed syncs
      const retryAttempts = (auditEvent._raw as any).sync_attempts || 0;
      if (retryAttempts < 3) {
        // Exponential backoff retry
        setTimeout(() => {
          this.syncToSupabase(auditEvent);
        }, Math.pow(2, retryAttempts) * 1000);
      }

      logger.error(`❌ Failed to sync audit event: ${auditEvent.auditId}`, undefined, error);
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

  /**
   * Retry failed syncs
   */
  async retryFailedSyncs(): Promise<void> {
    try {
      const auditCollection = database.get('audit_events');
      const failedEvents = await auditCollection.query(
        Q.where('sync_status', 'failed'),
        Q.where('sync_attempts', Q.lt(3)) // Max 3 attempts
      ).fetch();

      for (const event of failedEvents) {
        await this.syncToSupabase(event as AuditEvent);
      }

      logger.info(`🔄 Retried ${failedEvents.length} failed audit event syncs`);

    } catch (error) {
      logger.error('❌ Failed to retry audit event syncs', undefined, error);
    }
  }

  /**
   * Get audit events voor monitoring
   */
  async getAuditEvents(filters?: {
    userId?: string;
    eventType?: string;
    status?: string;
    limit?: number;
  }): Promise<AuditEvent[]> {
    try {
      const auditCollection = database.get('audit_events');
      const queries: any[] = [];

      if (filters?.userId) {
        queries.push(Q.where('user_id', filters.userId));
      }
      if (filters?.eventType) {
        queries.push(Q.where('event_type', filters.eventType));
      }
      if (filters?.status) {
        queries.push(Q.where('status', filters.status));
      }

      queries.push(Q.sortBy('event_timestamp', Q.desc));

      if (filters?.limit) {
        queries.push(Q.take(filters.limit));
      }

      return await auditCollection.query(...queries).fetch() as AuditEvent[];

    } catch (error) {
      logger.error('❌ Failed to get audit events', undefined, error);
      return [];
    }
  }

  /**
   * Validate hash chain integrity
   */
  async validateHashChain(): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const auditCollection = database.get('audit_events');
      const events = await auditCollection.query(
        Q.sortBy('chain_position', Q.asc)
      ).fetch() as AuditEvent[];

      const errors: string[] = [];
      let previousHash: string | null = null;

      for (const event of events) {
        if (event.previousHash !== previousHash) {
          errors.push(`Hash chain broken at position ${event.chainPosition}: expected ${previousHash}, got ${event.previousHash}`);
        }
        previousHash = event.eventHash;
      }

      return {
        valid: errors.length === 0,
        errors
      };

    } catch (error) {
      logger.error('❌ Failed to validate hash chain', undefined, error);
      return {
        valid: false,
        errors: ['Failed to validate hash chain']
      };
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
export const auditEventService = AuditEventService.getInstance();
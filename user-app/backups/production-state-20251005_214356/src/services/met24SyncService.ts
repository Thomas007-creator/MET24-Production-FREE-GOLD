
// @ts-nocheck - Temporary disable TypeScript checks for WatermelonDB compatibility

import { Q } from '@nozbe/watermelondb';
import { logger } from '../utils/logger';
import { dbHelpers, database } from '../database';

// Types voor MET2.4 data synchronisatie
export interface MET24Domain {
  domain_id: string;
  domain_number: number;
  domain_name: string;
  domain_description?: string;
  philosophical_level: string;
  practical_applications?: string[];
  theoretical_framework?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24DomainRelation {
  relation_id: string;
  source_domain_id: string;
  target_domain_id: string;
  relation_type: string;
  relation_strength: number;
  relation_description?: string;
  bidirectional: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24Insight {
  insight_id: string;
  domain_id: string;
  insight_title: string;
  insight_description?: string;
  insight_type: string;
  evidence_level: number;
  source_reference?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24Application {
  application_id: string;
  domain_id: string;
  application_name: string;
  application_description?: string;
  application_type: string;
  difficulty_level: number;
  estimated_duration_minutes?: number;
  materials_needed?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MET24UserProgress {
  user_id: string;
  domain_id: string;
  progress_percentage: number;
  completed_insights?: string[];
  completed_applications?: string[];
  current_insight_id?: string;
  current_application_id?: string;
  learning_path?: any[];
  achievements?: any[];
  notes?: string;
  last_accessed_at?: number;
  created_at: number;
  updated_at: number;
}

export interface SyncResponse {
  success: boolean;
  data?: any;
  error?: string;
  conflicts?: any[];
}

export interface SyncStatus {
  last_full_sync?: number;
  last_incremental_sync?: number;
  sync_frequency: string;
  auto_sync_enabled: boolean;
  sync_conflicts?: any[];
  server_version?: string;
  client_version?: string;
}

class MET24SyncService {
  private baseUrl: string;
  private apiKey: string;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // In productie: gebruik environment variables
    this.baseUrl = process.env.REACT_APP_MET24_API_URL || 'https://api.met24.com';
    this.apiKey = process.env.REACT_APP_MET24_API_KEY || '';
    
    // Listen voor online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processPendingSyncs();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // ===== DOMAIN SYNCHRONISATIE =====

  async syncDomains(): Promise<SyncResponse> {
    try {
      if (!this.isOnline) {
        return { success: false, error: 'Offline - sync wordt later uitgevoerd' };
      }

      logger.info('Starting MET2.4 domains sync', { timestamp: Date.now() });

      // Haal domains op van server
      const response = await fetch(`${this.baseUrl}/api/met24/domains`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const domains: MET24Domain[] = await response.json();
      
      // Sla domains lokaal op in WatermelonDB
      await this.saveDomainsLocally(domains);
      
      // Update sync status
      await this.updateSyncStatus('domains', Date.now());
      
      logger.info('MET2.4 domains sync completed', { 
        count: domains.length,
        timestamp: Date.now() 
      });

      return { success: true, data: domains };
    } catch (error) {
      logger.error('MET2.4 domains sync failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async saveDomainsLocally(domains: MET24Domain[]): Promise<void> {
    const domainsCollection = database.get('met24_domains');

    await database.write(async () => {
      for (const domain of domains) {
        // Check of domain al bestaat
        const existing = await domainsCollection
          .query(Q.where('domain_id', domain.domain_id))
          .fetch();

        if (existing.length > 0) {
          // Update bestaande domain
          await existing[0].update((record: any) => {
            record.domainNumber = domain.domain_number;
            record.domainName = domain.domain_name;
            record.domainDescription = domain.domain_description || '';
            record.philosophicalLevel = domain.philosophical_level;
            record.practicalApplications = JSON.stringify(domain.practical_applications || []);
            record.theoreticalFramework = domain.theoretical_framework || '';
            record.metadata = JSON.stringify(domain.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.updatedAt = Date.now();
          });
        } else {
          // Maak nieuwe domain
          await domainsCollection.create((record: any) => {
            record.domainId = domain.domain_id;
            record.domainNumber = domain.domain_number;
            record.domainName = domain.domain_name;
            record.domainDescription = domain.domain_description || '';
            record.philosophicalLevel = domain.philosophical_level;
            record.practicalApplications = JSON.stringify(domain.practical_applications || []);
            record.theoreticalFramework = domain.theoretical_framework || '';
            record.metadata = JSON.stringify(domain.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
          });
        }
      }
    });
  }

  // ===== DOMAIN RELATIONS SYNCHRONISATIE =====

  async syncDomainRelations(): Promise<SyncResponse> {
    try {
      if (!this.isOnline) {
        return { success: false, error: 'Offline - sync wordt later uitgevoerd' };
      }

      logger.info('Starting MET2.4 domain relations sync', { timestamp: Date.now() });

      const response = await fetch(`${this.baseUrl}/api/met24/domain-relations`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const relations: MET24DomainRelation[] = await response.json();
      await this.saveDomainRelationsLocally(relations);
      await this.updateSyncStatus('domain_relations', Date.now());
      
      logger.info('MET2.4 domain relations sync completed', { 
        count: relations.length,
        timestamp: Date.now() 
      });

      return { success: true, data: relations };
    } catch (error) {
      logger.error('MET2.4 domain relations sync failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async saveDomainRelationsLocally(relations: MET24DomainRelation[]): Promise<void> {
    const relationsCollection = database.get('met24_domain_relations');

    await database.write(async () => {
      for (const relation of relations) {
        const existing = await relationsCollection
          .query(Q.where('relation_id', relation.relation_id))
          .fetch();

        if (existing.length > 0) {
          await existing[0].update((record: any) => {
            record.sourceDomainId = relation.source_domain_id;
            record.targetDomainId = relation.target_domain_id;
            record.relationType = relation.relation_type;
            record.relationStrength = relation.relation_strength;
            record.relationDescription = relation.relation_description || '';
            record.bidirectional = relation.bidirectional;
            record.metadata = JSON.stringify(relation.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.updatedAt = Date.now();
          });
        } else {
          await relationsCollection.create((record: any) => {
            record.relationId = relation.relation_id;
            record.sourceDomainId = relation.source_domain_id;
            record.targetDomainId = relation.target_domain_id;
            record.relationType = relation.relation_type;
            record.relationStrength = relation.relation_strength;
            record.relationDescription = relation.relation_description || '';
            record.bidirectional = relation.bidirectional;
            record.metadata = JSON.stringify(relation.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
          });
        }
      }
    });
  }

  // ===== INSIGHTS SYNCHRONISATIE =====

  async syncInsights(): Promise<SyncResponse> {
    try {
      if (!this.isOnline) {
        return { success: false, error: 'Offline - sync wordt later uitgevoerd' };
      }

      logger.info('Starting MET2.4 insights sync', { timestamp: Date.now() });

      const response = await fetch(`${this.baseUrl}/api/met24/insights`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const insights: MET24Insight[] = await response.json();
      await this.saveInsightsLocally(insights);
      await this.updateSyncStatus('insights', Date.now());
      
      logger.info('MET2.4 insights sync completed', { 
        count: insights.length,
        timestamp: Date.now() 
      });

      return { success: true, data: insights };
    } catch (error) {
      logger.error('MET2.4 insights sync failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async saveInsightsLocally(insights: MET24Insight[]): Promise<void> {
    const insightsCollection = database.get('met24_new_insights');

    await database.write(async () => {
      for (const insight of insights) {
        const existing = await insightsCollection
          .query(Q.where('insight_id', insight.insight_id))
          .fetch();

        if (existing.length > 0) {
          await existing[0].update((record: any) => {
            record.domainId = insight.domain_id;
            record.insightTitle = insight.insight_title;
            record.insightDescription = insight.insight_description || '';
            record.insightType = insight.insight_type;
            record.evidenceLevel = insight.evidence_level;
            record.sourceReference = insight.source_reference || '';
            record.metadata = JSON.stringify(insight.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.updatedAt = Date.now();
          });
        } else {
          await insightsCollection.create((record: any) => {
            record.insightId = insight.insight_id;
            record.domainId = insight.domain_id;
            record.insightTitle = insight.insight_title;
            record.insightDescription = insight.insight_description || '';
            record.insightType = insight.insight_type;
            record.evidenceLevel = insight.evidence_level;
            record.sourceReference = insight.source_reference || '';
            record.metadata = JSON.stringify(insight.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
          });
        }
      }
    });
  }

  // ===== APPLICATIONS SYNCHRONISATIE =====

  async syncApplications(): Promise<SyncResponse> {
    try {
      if (!this.isOnline) {
        return { success: false, error: 'Offline - sync wordt later uitgevoerd' };
      }

      logger.info('Starting MET2.4 applications sync', { timestamp: Date.now() });

      const response = await fetch(`${this.baseUrl}/api/met24/applications`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const applications: MET24Application[] = await response.json();
      await this.saveApplicationsLocally(applications);
      await this.updateSyncStatus('applications', Date.now());
      
      logger.info('MET2.4 applications sync completed', { 
        count: applications.length,
        timestamp: Date.now() 
      });

      return { success: true, data: applications };
    } catch (error) {
      logger.error('MET2.4 applications sync failed', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async saveApplicationsLocally(applications: MET24Application[]): Promise<void> {
    const applicationsCollection = database.get('met24_practical_applications');

    await database.write(async () => {
      for (const application of applications) {
        const existing = await applicationsCollection
          .query(Q.where('application_id', application.application_id))
          .fetch();

        if (existing.length > 0) {
          await existing[0].update((record: any) => {
            record.domainId = application.domain_id;
            record.applicationName = application.application_name;
            record.applicationDescription = application.application_description || '';
            record.applicationType = application.application_type;
            record.difficultyLevel = application.difficulty_level;
            record.estimatedDurationMinutes = application.estimated_duration_minutes || 0;
            record.materialsNeeded = JSON.stringify(application.materials_needed || []);
            record.metadata = JSON.stringify(application.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.updatedAt = Date.now();
          });
        } else {
          await applicationsCollection.create((record: any) => {
            record.applicationId = application.application_id;
            record.domainId = application.domain_id;
            record.applicationName = application.application_name;
            record.applicationDescription = application.application_description || '';
            record.applicationType = application.application_type;
            record.difficultyLevel = application.difficulty_level;
            record.estimatedDurationMinutes = application.estimated_duration_minutes || 0;
            record.materialsNeeded = JSON.stringify(application.materials_needed || []);
            record.metadata = JSON.stringify(application.metadata || {});
            record.lastSyncedAt = Date.now();
            record.syncStatus = 'synced';
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
          });
        }
      }
    });
  }

  // ===== USER PROGRESS SYNCHRONISATIE =====

  async syncUserProgress(userId: string): Promise<SyncResponse> {
    try {
      if (!this.isOnline) {
        return { success: false, error: 'Offline - sync wordt later uitgevoerd' };
      }

      logger.info('Starting MET2.4 user progress sync', { userId, timestamp: Date.now() });

      const response = await fetch(`${this.baseUrl}/api/met24/user-progress/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const progress: MET24UserProgress[] = await response.json();
      await this.saveUserProgressLocally(progress);
      await this.updateSyncStatus('user_progress', Date.now());
      
      logger.info('MET2.4 user progress sync completed', { 
        userId,
        count: progress.length,
        timestamp: Date.now() 
      });

      return { success: true, data: progress };
    } catch (error) {
      logger.error('MET2.4 user progress sync failed', { 
        userId,
        error: error instanceof Error ? error.message : String(error) 
      });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private async saveUserProgressLocally(progress: MET24UserProgress[]): Promise<void> {
    const progressCollection = database.get('met24_user_progress');

    await database.write(async () => {
      for (const prog of progress) {
        const existing = await progressCollection
          .query(
            Q.where('user_id', prog.user_id),
            Q.where('domain_id', prog.domain_id)
          )
          .fetch();

        if (existing.length > 0) {
          await existing[0].update((record: any) => {
            record.progressPercentage = prog.progress_percentage;
            record.completedInsights = JSON.stringify(prog.completed_insights || []);
            record.completedApplications = JSON.stringify(prog.completed_applications || []);
            record.currentInsightId = prog.current_insight_id || '';
            record.currentApplicationId = prog.current_application_id || '';
            record.learningPath = JSON.stringify(prog.learning_path || []);
            record.achievements = JSON.stringify(prog.achievements || []);
            record.notes = prog.notes || '';
            record.lastAccessedAt = prog.last_accessed_at || Date.now();
            record.updatedAt = Date.now();
          });
        } else {
          await progressCollection.create((record: any) => {
            record.userId = prog.user_id;
            record.domainId = prog.domain_id;
            record.progressPercentage = prog.progress_percentage;
            record.completedInsights = JSON.stringify(prog.completed_insights || []);
            record.completedApplications = JSON.stringify(prog.completed_applications || []);
            record.currentInsightId = prog.current_insight_id || '';
            record.currentApplicationId = prog.current_application_id || '';
            record.learningPath = JSON.stringify(prog.learning_path || []);
            record.achievements = JSON.stringify(prog.achievements || []);
            record.notes = prog.notes || '';
            record.lastAccessedAt = prog.last_accessed_at || Date.now();
            record.createdAt = Date.now();
            record.updatedAt = Date.now();
          });
        }
      }
    });
  }

  // ===== FULL SYNC =====

  async performFullSync(userId: string): Promise<SyncResponse> {
    try {
      logger.info('Starting MET2.4 full sync', { userId, timestamp: Date.now() });

      const results = await Promise.allSettled([
        this.syncDomains(),
        this.syncDomainRelations(),
        this.syncInsights(),
        this.syncApplications(),
        this.syncUserProgress(userId),
      ]);

      const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      const failed = results.filter(r => r.status === 'rejected' || !r.value.success).length;

      logger.info('MET2.4 full sync completed', { 
        userId,
        successful,
        failed,
        timestamp: Date.now() 
      });

      return { 
        success: failed === 0, 
        data: { successful, failed, results } 
      };
    } catch (error) {
      logger.error('MET2.4 full sync failed', { 
        userId,
        error: error instanceof Error ? error.message : String(error) 
      });
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  // ===== SYNC STATUS MANAGEMENT =====

  private async updateSyncStatus(tableName: string, timestamp: number): Promise<void> {
    const syncStatusCollection = database.get('met24_server_sync_status');
    const currentUser = await dbHelpers.getCurrentUser();

    if (!currentUser) return;

    await database.write(async () => {
      const existing = await syncStatusCollection
        .query(Q.where('user_id', currentUser.id))
        .fetch();

      if (existing.length > 0) {
        await existing[0].update((record: any) => {
          if (tableName === 'domains' || tableName === 'domain_relations' || 
              tableName === 'insights' || tableName === 'applications') {
            record.lastFullSync = timestamp;
          } else {
            record.lastIncrementalSync = timestamp;
          }
          record.updatedAt = Date.now();
        });
      } else {
        await syncStatusCollection.create((record: any) => {
          record.userId = currentUser.id;
          record.syncFrequency = 'daily';
          record.autoSyncEnabled = true;
          record.clientVersion = '1.0.0';
          if (tableName === 'domains' || tableName === 'domain_relations' || 
              tableName === 'insights' || tableName === 'applications') {
            record.lastFullSync = timestamp;
          } else {
            record.lastIncrementalSync = timestamp;
          }
          record.createdAt = Date.now();
          record.updatedAt = Date.now();
        });
      }
    });
  }

  // ===== PENDING SYNC PROCESSING =====

  async processPendingSyncs(): Promise<void> {
    if (!this.isOnline) return;
    const syncQueueCollection = database.get('met24_sync_queue');

    const pendingSyncs = await syncQueueCollection
      .query(Q.where('status', 'pending'))
      .fetch();

    for (const sync of pendingSyncs) {
      try {
        await this.processSyncItem(sync);
      } catch (error) {
        logger.error('Failed to process sync item', { 
          syncId: sync.id,
          error: error instanceof Error ? error.message : String(error) 
        });
      }
    }
  }

  private async processSyncItem(sync: any): Promise<void> {
    const syncQueueCollection = database.get('met24_sync_queue');

    await database.write(async () => {
      await sync.update((record: any) => {
        record.status = 'syncing';
        record.lastAttemptAt = Date.now();
        record.retryCount = (record.retryCount || 0) + 1;
      });
    });

    try {
      // Implementeer specifieke sync logica per table
      const response = await fetch(`${this.baseUrl}/api/met24/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: sync.tableName,
          record_id: sync.recordId,
          operation: sync.operation,
          data: JSON.parse(sync.data),
        }),
      });

      if (response.ok) {
        await database.write(async () => {
          await sync.update((record: any) => {
            record.status = 'completed';
            record.updatedAt = Date.now();
          });
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      await database.write(async () => {
        await sync.update((record: any) => {
          record.status = 'failed';
          record.errorMessage = error instanceof Error ? error.message : String(error);
          record.updatedAt = Date.now();
        });
      });
    }
  }

  // ===== UTILITY METHODS =====

  async getSyncStatus(): Promise<SyncStatus | null> {
    const syncStatusCollection = database.get('met24_server_sync_status');
    const currentUser = await dbHelpers.getCurrentUser();

    if (!currentUser) return null;

    const status = await syncStatusCollection
      .query(Q.where('user_id', currentUser.id))
      .fetch();

    if (status.length === 0) return null;

    const record = status[0] as any;
    return {
      last_full_sync: record.lastFullSync,
      last_incremental_sync: record.lastIncrementalSync,
      sync_frequency: record.syncFrequency,
      auto_sync_enabled: record.autoSyncEnabled,
      sync_conflicts: record.syncConflicts ? JSON.parse(record.syncConflicts) : [],
      server_version: record.serverVersion,
      client_version: record.clientVersion,
    };
  }

  async enableAutoSync(): Promise<void> {
    const syncStatusCollection = database.get('met24_server_sync_status');
    const currentUser = await dbHelpers.getCurrentUser();

    if (!currentUser) return;

    await database.write(async () => {
      const existing = await syncStatusCollection
        .query(Q.where('user_id', currentUser.id))
        .fetch();

      if (existing.length > 0) {
        await existing[0].update((record: any) => {
          record.autoSyncEnabled = true;
          record.updatedAt = Date.now();
        });
      }
    });
  }

  async disableAutoSync(): Promise<void> {
    const syncStatusCollection = database.get('met24_server_sync_status');
    const currentUser = await dbHelpers.getCurrentUser();

    if (!currentUser) return;

    await database.write(async () => {
      const existing = await syncStatusCollection
        .query(Q.where('user_id', currentUser.id))
        .fetch();

      if (existing.length > 0) {
        await existing[0].update((record: any) => {
          record.autoSyncEnabled = false;
          record.updatedAt = Date.now();
        });
      }
    });
  }
}

// Export singleton instance
export const met24SyncService = new MET24SyncService();
export default met24SyncService;

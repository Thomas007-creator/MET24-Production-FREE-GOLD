/**
 * Supabase Sync Provider - WatermelonDB V14
 * 
 * Handelt sync tussen WatermelonDB en Supabase af
 * Ondersteunt offline-first met conflict resolution
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from "@nozbe/watermelondb";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../../../utils/logger";
import { VPNPipelineManager } from "../../../services/vpnPipelineManager";
// import { encryptPayload } from "../../../utils/encryption"; // TODO: Implement encryption for sensitive data

export interface SyncConfig {
  supabaseUrl: string;
  supabaseKey: string;
  syncInterval: number; // milliseconds
  batchSize: number;
  retryAttempts: number;
  retryDelay: number; // milliseconds
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: number | null;
  nextSync: number | null;
  errorCount: number;
  lastError: string | null;
  recordsSynced: number;
  recordsTotal: number;
}

export class SupabaseSyncProvider {
  private database: Database;
  private supabase: SupabaseClient;
  private config: SyncConfig;
  private syncStatus: SyncStatus;
  private syncInterval: NodeJS.Timeout | null = null;
  private vpnManager: VPNPipelineManager | null = null;

  constructor(database: Database, config: SyncConfig, vpnManager?: VPNPipelineManager) {
    this.database = database;
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    this.vpnManager = vpnManager || null;
    
    this.syncStatus = {
      isSyncing: false,
      lastSync: null,
      nextSync: null,
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      recordsTotal: 0
    };
  }

  /**
   * Start automatische sync
   */
  startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      this.sync().catch(error => {
        logger.error("Auto sync failed:", { error });
      });
    }, this.config.syncInterval);

    logger.info("🔄 Auto sync started");
  }

  /**
   * Stop automatische sync
   */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    logger.info("⏹️ Auto sync stopped");
  }

  /**
   * Voer volledige sync uit
   */
  async sync(): Promise<void> {
    if (this.syncStatus.isSyncing) {
      logger.warn("Sync already in progress, skipping...");
      return;
    }

    // VPN validatie toevoegen
    if (this.vpnManager) {
      await this.vpnManager.validateVPNForOperation('sync');
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.recordsSynced = 0;
    this.syncStatus.recordsTotal = 0;

    try {
      logger.info("🔄 Starting sync...");

      // 1. Sync users
      await this.syncTable("users");

      // 2. Sync MBTI profiles
      await this.syncTable("mbti_profiles");

      // 3. Sync settings
      await this.syncTable("settings");

      // 4. Sync life areas progress
      await this.syncTable("life_areas_progress");

      // 5. Sync onboarding states
      await this.syncTable("onboarding_states");

      // 6. Sync chat messages
      await this.syncTable("chat_messages");

      // 7. Sync journal entries
      await this.syncTable("journal_entries");

      // 8. Sync contacts
      await this.syncTable("contacts");

      // 9. Sync AI interactions
      await this.syncTable("ai_interactions");

      // 10. Sync AI artifacts
      await this.syncTable("ai_artifacts");

      // 11. Sync vector embeddings
      await this.syncTable("vector_embeddings");

      // 12. Sync AI action plans
      await this.syncTable("ai_action_plans");

      // 13. Sync super insights
      await this.syncTable("super_insights");

      // 14. Sync rewind sessions
      await this.syncTable("rewind_sessions");

      // 15. Sync content items
      await this.syncTable("content_items");

      // 16. Sync content chunks
      await this.syncTable("content_chunks");

      // 17. Sync content pointers
      await this.syncTable("content_pointers");

      // 18. Sync offline packs
      await this.syncTable("offline_packs");

      // 19. Sync content recommendations
      await this.syncTable("content_recommendations");

      // 20. Sync content sources
      await this.syncTable("content_sources");

      // 21. Sync MBTI learning paths
      await this.syncTable("mbti_learning_paths");

      // 22. Sync content analytics
      await this.syncTable("content_analytics");

      // 23. Sync media intelligence
      await this.syncTable("media_intelligence");

      // 24. Sync content sync status
      await this.syncTable("content_sync_status");

      // 25. Sync subscription plans
      await this.syncTable("subscription_plans");

      // 26. Sync user subscriptions
      await this.syncTable("user_subscriptions");

      // 27. Sync payment transactions
      await this.syncTable("payment_transactions");

      // 28. Sync upgrade flow events
      await this.syncTable("upgrade_flow_events");

      // 29. Sync MET2.4 domains
      await this.syncTable("met24_domains");

      // 30. Sync MET2.4 domain relations
      await this.syncTable("met24_domain_relations");

      // 31. Sync MET2.4 new insights
      await this.syncTable("met24_new_insights");

      // 32. Sync MET2.4 practical applications
      await this.syncTable("met24_practical_applications");

      // 33. Sync MET2.4 user progress
      await this.syncTable("met24_user_progress");

      // 34. Sync MET2.4 sync queue
      await this.syncTable("met24_sync_queue");

      // 35. Sync MET2.4 server sync status
      await this.syncTable("met24_server_sync_status");

      // 36. Sync levensgebieden questionnaires
      await this.syncTable("levensgebieden_questionnaires");

      // 37. Sync tasks
      await this.syncTable("tasks");

      // 38. Sync sync status
      await this.syncTable("sync_status");

      // 39. Sync feature usage
      await this.syncTable("feature_usage");

      // 40. Sync MBTI contents
      await this.syncTable("mbti_contents");

      // 41. Sync future extensions
      await this.syncTable("future_extensions");

      // Update sync status
      this.syncStatus.lastSync = Date.now();
      this.syncStatus.nextSync = Date.now() + this.config.syncInterval;
      this.syncStatus.errorCount = 0;
      this.syncStatus.lastError = null;

      logger.info(`✅ Sync completed successfully! Synced ${this.syncStatus.recordsSynced} records`);

    } catch (error) {
      this.syncStatus.errorCount++;
      this.syncStatus.lastError = error instanceof Error ? error.message : String(error);
      
      logger.error("❌ Sync failed:", undefined, error);
      throw error;
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  /**
   * Sync een specifieke tabel
   */
  private async syncTable(tableName: string): Promise<void> {
    try {
      logger.info(`🔄 Syncing table: ${tableName}`);

      const collection = this.database.get(tableName);
      const records = await collection.query().fetch();

      this.syncStatus.recordsTotal += records.length;

      // Process records in batches
      for (let i = 0; i < records.length; i += this.config.batchSize) {
        const batch = records.slice(i, i + this.config.batchSize);
        await this.syncBatch(tableName, batch);
      }

      logger.info(`✅ Synced ${records.length} records from ${tableName}`);

    } catch (error) {
      logger.error(`❌ Failed to sync table ${tableName}:`, undefined, error);
      throw error;
    }
  }

  /**
   * Sync een batch van records
   */
  private async syncBatch(tableName: string, records: any[]): Promise<void> {
    try {
      // Convert WatermelonDB records to Supabase format
      const supabaseRecords = records.map(record => this.convertRecordForSupabase(record));

      // Upsert records to Supabase
      const { error } = await this.supabase
        .from(tableName)
        .upsert(supabaseRecords, { onConflict: 'id' });

      if (error) {
        throw new Error(`Supabase upsert error: ${error.message}`);
      }

      this.syncStatus.recordsSynced += records.length;

    } catch (error) {
      logger.error(`❌ Failed to sync batch for ${tableName}:`, undefined, error);
      throw error;
    }
  }

  /**
   * Converteer WatermelonDB record naar Supabase formaat
   */
  private convertRecordForSupabase(record: any): any {
    const raw = record._raw;
    const converted: any = {};

    // Convert all fields
    for (const [key, value] of Object.entries(raw)) {
      if (key === 'id') {
        converted.id = value;
      } else if (key === 'created_at' || key === 'updated_at') {
        // Convert BIGINT timestamps to timestamptz
        converted[key] = new Date(Number(value)).toISOString();
      } else if (key.endsWith('_at') && typeof value === 'number') {
        // Convert other timestamp fields
        converted[key] = new Date(Number(value)).toISOString();
      } else if (key.endsWith('_json') && typeof value === 'string') {
        // Parse JSON fields
        try {
          converted[key] = JSON.parse(value);
        } catch {
          converted[key] = value;
        }
      } else if (key.endsWith('_encrypted') && typeof value === 'string') {
        // Keep encrypted fields as is
        converted[key] = value;
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }

  /**
   * Haal sync status op
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Reset sync status
   */
  resetSyncStatus(): void {
    this.syncStatus = {
      isSyncing: false,
      lastSync: null,
      nextSync: null,
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      recordsTotal: 0
    };
  }

  /**
   * Test connectie met Supabase
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      logger.info("✅ Supabase connection test successful");
      return true;
    } catch (error) {
      logger.error("❌ Supabase connection test failed:", undefined, error);
      return false;
    }
  }

  /**
   * Sync specifieke record
   */
  async syncRecord(tableName: string, recordId: string): Promise<void> {
    try {
      const collection = this.database.get(tableName);
      const record = await collection.find(recordId);
      
      if (record) {
        await this.syncBatch(tableName, [record]);
        logger.info(`✅ Synced record ${recordId} from ${tableName}`);
      }
    } catch (error) {
      logger.error(`❌ Failed to sync record ${recordId} from ${tableName}:`, undefined, error);
      throw error;
    }
  }

  /**
   * Sync specifieke tabel
   */
  async syncTableOnly(tableName: string): Promise<void> {
    try {
      await this.syncTable(tableName);
      logger.info(`✅ Synced table ${tableName} only`);
    } catch (error) {
      logger.error(`❌ Failed to sync table ${tableName}:`, undefined, error);
      throw error;
    }
  }
}

/**
 * Factory functie voor SupabaseSyncProvider
 */
export function createSupabaseSyncProvider(
  database: Database,
  config: Partial<SyncConfig> = {},
  vpnManager?: VPNPipelineManager
): SupabaseSyncProvider {
  const defaultConfig: SyncConfig = {
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    syncInterval: 5 * 60 * 1000, // 5 minutes
    batchSize: 50,
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    ...config
  };

  return new SupabaseSyncProvider(database, defaultConfig, vpnManager);
}

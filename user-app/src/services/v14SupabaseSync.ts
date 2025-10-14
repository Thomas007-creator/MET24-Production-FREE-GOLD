/**
 * V14 Supabase Sync Service
 * 
 * Handelt sync tussen WatermelonDB V14 en Supabase af
 * Ondersteunt alle V14 tabellen en features
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import database from "../database"; // V14 database
import { logger } from "../utils/logger";

// Supabase client
const supabase: SupabaseClient = createClient(
  process.env.REACT_APP_SUPABASE_URL || '',
  process.env.REACT_APP_SUPABASE_ANON_KEY || ''
);

export interface SyncConfig {
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: number | null;
  errorCount: number;
  lastError: string | null;
  recordsSynced: number;
  recordsTotal: number;
}

class V14SupabaseSyncService {
  private config: SyncConfig;
  private syncStatus: SyncStatus;

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = {
      batchSize: 50,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };

    this.syncStatus = {
      isSyncing: false,
      lastSync: null,
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      recordsTotal: 0
    };
  }

  /**
   * Sync alle V14 tabellen met Supabase
   */
  async syncWithSupabase(): Promise<void> {
    if (this.syncStatus.isSyncing) {
      logger.warn("Sync already in progress, skipping...");
      return;
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.recordsSynced = 0;
    this.syncStatus.recordsTotal = 0;

    try {
      logger.info("🔄 Starting V14 Supabase sync...");

      // Sync V14 nieuwe tabellen
      await this.syncTable('tasks');
      await this.syncTable('contacts');
      await this.syncTable('future_extensions');
      await this.syncTable('audit_events'); // ✅ NIEUWE AUDIT EVENTS SYNC

      // Sync bestaande tabellen
      await this.syncTable('users');
      await this.syncTable('chat_messages');
      await this.syncTable('journal_entries');
      await this.syncTable('ai_interactions');
      await this.syncTable('settings');
      await this.syncTable('mbti_profiles');
      await this.syncTable('life_areas_progress');
      await this.syncTable('onboarding_states');
      await this.syncTable('levensgebieden_questionnaires');

      // Update sync status
      this.syncStatus.lastSync = Date.now();
      this.syncStatus.errorCount = 0;
      this.syncStatus.lastError = null;

      logger.info(`✅ V14 Supabase sync completed! Synced ${this.syncStatus.recordsSynced} records`);

    } catch (error) {
      this.syncStatus.errorCount++;
      this.syncStatus.lastError = error instanceof Error ? error.message : String(error);
      
      logger.error("❌ V14 Supabase sync failed:", undefined, error);
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

      // 1. Haal data op uit Supabase
      const { data: supabaseData, error: fetchError } = await supabase
        .from(tableName)
        .select('*');

      if (fetchError) {
        throw new Error(`Failed to fetch from Supabase: ${fetchError.message}`);
      }

      if (!supabaseData || supabaseData.length === 0) {
        logger.info(`📭 No data found in Supabase for ${tableName}`);
        return;
      }

      this.syncStatus.recordsTotal += supabaseData.length;

      // 2. Schrijf naar WatermelonDB V14
      await database.write(async () => {
        const collection = database.get(tableName);
        
        for (const record of supabaseData) {
          try {
            // Converteer Supabase record naar WatermelonDB formaat
            const watermelondbRecord = this.convertSupabaseToWatermelonDB(record);
            
            // Upsert record
            await collection.create((newRecord: any) => {
              Object.assign(newRecord, watermelondbRecord);
            });
            
            this.syncStatus.recordsSynced++;
          } catch (error) {
            logger.warn(`Failed to sync record ${record.id} from ${tableName}:`, undefined, error);
          }
        }
      });

      logger.info(`✅ Synced ${supabaseData.length} records from ${tableName}`);

    } catch (error) {
      logger.error(`❌ Failed to sync table ${tableName}:`, undefined, error);
      throw error;
    }
  }

  /**
   * Converteer Supabase record naar WatermelonDB formaat
   */
  private convertSupabaseToWatermelonDB(record: any): any {
    const converted: any = {};

    // Converteer alle velden
    for (const [key, value] of Object.entries(record)) {
      if (key === 'id') {
        converted.id = value;
      } else if (key.endsWith('_at') && typeof value === 'string') {
        // Converteer timestamptz naar BIGINT
        converted[key] = new Date(value).getTime();
      } else if (key.endsWith('_json') && typeof value === 'object') {
        // Converteer JSON object naar string
        converted[key] = JSON.stringify(value);
      } else if (key.endsWith('_encrypted') && typeof value === 'string') {
        // Behoud encrypted velden
        converted[key] = value;
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }

  /**
   * Push lokale wijzigingen naar Supabase
   */
  async pushToSupabase(tableName: string, records: any[]): Promise<void> {
    try {
      logger.info(`📤 Pushing ${records.length} records to Supabase ${tableName}`);

      // Converteer WatermelonDB records naar Supabase formaat
      const supabaseRecords = records.map(record => 
        this.convertWatermelonDBToSupabase(record)
      );

      // Upsert naar Supabase
      const { error } = await supabase
        .from(tableName)
        .upsert(supabaseRecords, { onConflict: 'id' });

      if (error) {
        throw new Error(`Supabase upsert error: ${error.message}`);
      }

      logger.info(`✅ Pushed ${records.length} records to Supabase ${tableName}`);

    } catch (error) {
      logger.error(`❌ Failed to push to Supabase ${tableName}:`, undefined, error);
      throw error;
    }
  }

  /**
   * Converteer WatermelonDB record naar Supabase formaat
   */
  private convertWatermelonDBToSupabase(record: any): any {
    const converted: any = {};

    // Converteer alle velden
    for (const [key, value] of Object.entries(record)) {
      if (key === 'id') {
        converted.id = value;
      } else if (key.endsWith('_at') && typeof value === 'number') {
        // Converteer BIGINT naar timestamptz
        converted[key] = new Date(value).toISOString();
      } else if (key.endsWith('_json') && typeof value === 'string') {
        // Parse JSON string naar object
        try {
          converted[key] = JSON.parse(value);
        } catch {
          converted[key] = value;
        }
      } else if (key.endsWith('_encrypted') && typeof value === 'string') {
        // Behoud encrypted velden
        converted[key] = value;
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }

  /**
   * Sync specifieke tabel (publieke methode)
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

  /**
   * Haal sync status op
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Test connectie met Supabase
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
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
   * Reset sync status
   */
  resetSyncStatus(): void {
    this.syncStatus = {
      isSyncing: false,
      lastSync: null,
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      recordsTotal: 0
    };
  }
}

// Export singleton instance
export const v14SupabaseSync = new V14SupabaseSyncService();

// Export convenience functions
export async function syncWithSupabase(): Promise<void> {
  return v14SupabaseSync.syncWithSupabase();
}

export async function syncTableWithSupabase(tableName: string): Promise<void> {
  return v14SupabaseSync.syncTableOnly(tableName);
}

export async function pushToSupabase(tableName: string, records: any[]): Promise<void> {
  return v14SupabaseSync.pushToSupabase(tableName, records);
}

export function getSupabaseSyncStatus(): SyncStatus {
  return v14SupabaseSync.getSyncStatus();
}

export async function testSupabaseConnection(): Promise<boolean> {
  return v14SupabaseSync.testConnection();
}

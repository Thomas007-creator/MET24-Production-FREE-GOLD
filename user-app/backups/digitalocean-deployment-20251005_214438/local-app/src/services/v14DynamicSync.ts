/**
 * V14 Dynamic Sync Service
 * 
 * Automatische detectie en sync van nieuwe tabellen
 * Future-proof sync systeem voor V14 en toekomstige versies
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

export interface DynamicSyncConfig {
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
  autoDetectTables: boolean;
  excludeTables: string[];
  includeTables: string[];
}

export interface TableInfo {
  name: string;
  schema: string;
  recordCount: number;
  lastSync: number | null;
  syncStatus: 'pending' | 'syncing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface DynamicSyncStatus {
  isSyncing: boolean;
  lastSync: number | null;
  errorCount: number;
  lastError: string | null;
  recordsSynced: number;
  recordsTotal: number;
  tablesDetected: TableInfo[];
  newTablesFound: string[];
}

class V14DynamicSyncService {
  private config: DynamicSyncConfig;
  private syncStatus: DynamicSyncStatus;

  constructor(config: Partial<DynamicSyncConfig> = {}) {
    this.config = {
      batchSize: 50,
      retryAttempts: 3,
      retryDelay: 1000,
      autoDetectTables: true,
      excludeTables: ['migrations', 'schema_migrations', 'system_tables'],
      includeTables: [], // Leeg = alle tabellen
      ...config
    };

    this.syncStatus = {
      isSyncing: false,
      lastSync: null,
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      recordsTotal: 0,
      tablesDetected: [],
      newTablesFound: []
    };
  }

  /**
   * Detecteer alle beschikbare tabellen in Supabase
   */
  async detectTables(): Promise<TableInfo[]> {
    try {
      logger.info("🔍 Detecting tables in Supabase...");

      // Haal alle tabellen op uit information_schema
      const { data: tables, error } = await supabase
        .rpc('get_table_info', {
          schema_names: ['users', 'onboarding', 'mbti_ai', 'chat_journal', 'analytics', 'subscriptions', 'content', 'met24', 'sync_status', 'settings', 'other']
        });

      if (error) {
        // Fallback: probeer handmatig tabellen te detecteren
        return await this.detectTablesFallback();
      }

      const tableInfos: TableInfo[] = tables.map((table: any) => ({
        name: table.table_name,
        schema: table.table_schema,
        recordCount: table.record_count || 0,
        lastSync: null,
        syncStatus: 'pending' as const
      }));

      // Filter tabellen op basis van configuratie
      const filteredTables = this.filterTables(tableInfos);
      
      this.syncStatus.tablesDetected = filteredTables;
      logger.info(`✅ Detected ${filteredTables.length} tables for sync`);

      return filteredTables;

    } catch (error) {
      logger.error("❌ Failed to detect tables:", { error });
      return await this.detectTablesFallback();
    }
  }

  /**
   * Fallback methode voor tabel detectie
   */
  private async detectTablesFallback(): Promise<TableInfo[]> {
    logger.info("🔄 Using fallback table detection...");

    // Bekende V14 tabellen
    const knownTables = [
      // V14 nieuwe tabellen
      { name: 'tasks', schema: 'other' },
      { name: 'contacts', schema: 'other' },
      { name: 'future_extensions', schema: 'other' },
      { name: 'extension_events', schema: 'other' },
      { name: 'extension_settings', schema: 'other' },
      
      // Bestaande tabellen
      { name: 'users', schema: 'users' },
      { name: 'chat_messages', schema: 'chat_journal' },
      { name: 'journal_entries', schema: 'chat_journal' },
      { name: 'ai_interactions', schema: 'mbti_ai' },
      { name: 'settings', schema: 'settings' },
      { name: 'mbti_profiles', schema: 'onboarding' },
      { name: 'life_areas_progress', schema: 'analytics' },
      { name: 'onboarding_states', schema: 'onboarding' },
      { name: 'levensgebieden_questionnaires', schema: 'onboarding' },
      
      // MET24 tabellen
      { name: 'met24_domains', schema: 'met24' },
      { name: 'met24_domain_relations', schema: 'met24' },
      { name: 'met24_new_insights', schema: 'met24' },
      { name: 'met24_practical_applications', schema: 'met24' },
      
      // Content tabellen
      { name: 'content_items', schema: 'content' },
      { name: 'content_chunks', schema: 'content' },
      { name: 'content_pointers', schema: 'content' },
      
      // Subscription tabellen
      { name: 'subscription_plans', schema: 'subscriptions' },
      { name: 'payment_transactions', schema: 'subscriptions' },
    ];

    const tableInfos: TableInfo[] = knownTables.map(table => ({
      name: table.name,
      schema: table.schema,
      recordCount: 0,
      lastSync: null,
      syncStatus: 'pending' as const
    }));

    this.syncStatus.tablesDetected = tableInfos;
    return tableInfos;
  }

  /**
   * Filter tabellen op basis van configuratie
   */
  private filterTables(tables: TableInfo[]): TableInfo[] {
    let filtered = tables;

    // Exclude tabellen
    if (this.config.excludeTables.length > 0) {
      filtered = filtered.filter(table => 
        !this.config.excludeTables.includes(table.name)
      );
    }

    // Include specifieke tabellen (als opgegeven)
    if (this.config.includeTables.length > 0) {
      filtered = filtered.filter(table => 
        this.config.includeTables.includes(table.name)
      );
    }

    return filtered;
  }

  /**
   * Detecteer nieuwe tabellen (niet in WatermelonDB)
   */
  async detectNewTables(): Promise<string[]> {
    try {
      const supabaseTables = await this.detectTables();
      const watermelondbTables = Object.keys(database.collections);
      
      const newTables = supabaseTables
        .filter(table => !watermelondbTables.includes(table.name))
        .map(table => table.name);

      this.syncStatus.newTablesFound = newTables;
      
      if (newTables.length > 0) {
        logger.info(`🆕 Found ${newTables.length} new tables: ${newTables.join(', ')}`);
      } else {
        logger.info("✅ No new tables detected");
      }

      return newTables;

    } catch (error) {
      logger.error("❌ Failed to detect new tables:", { error });
      return [];
    }
  }

  /**
   * Sync alle gedetecteerde tabellen
   */
  async syncAllTables(): Promise<void> {
    if (this.syncStatus.isSyncing) {
      logger.warn("Sync already in progress, skipping...");
      return;
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.recordsSynced = 0;
    this.syncStatus.recordsTotal = 0;

    try {
      logger.info("🔄 Starting dynamic V14 sync...");

      // Detecteer tabellen
      const tables = await this.detectTables();
      
      // Sync elke tabel
      for (const table of tables) {
        try {
          await this.syncTable(table.name);
          table.syncStatus = 'completed';
        } catch (error) {
          table.syncStatus = 'error';
          table.errorMessage = error instanceof Error ? error.message : String(error);
          logger.error(`❌ Failed to sync table ${table.name}:`, { error });
        }
      }

      // Update sync status
      this.syncStatus.lastSync = Date.now();
      this.syncStatus.errorCount = 0;
      this.syncStatus.lastError = null;

      logger.info(`✅ Dynamic sync completed! Synced ${this.syncStatus.recordsSynced} records from ${tables.length} tables`);

    } catch (error) {
      this.syncStatus.errorCount++;
      this.syncStatus.lastError = error instanceof Error ? error.message : String(error);
      
      logger.error("❌ Dynamic sync failed:", { error });
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
            logger.warn(`Failed to sync record ${record.id} from ${tableName}:`, { error: error instanceof Error ? error.message : String(error) });
          }
        }
      });

      logger.info(`✅ Synced ${supabaseData.length} records from ${tableName}`);

    } catch (error) {
      logger.error(`❌ Failed to sync table ${tableName}:`, { error });
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
   * Haal sync status op
   */
  getSyncStatus(): DynamicSyncStatus {
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
      logger.error("❌ Supabase connection test failed:", { error });
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
      recordsTotal: 0,
      tablesDetected: [],
      newTablesFound: []
    };
  }
}

// Export singleton instance
export const v14DynamicSync = new V14DynamicSyncService();

// Export convenience functions
export async function detectNewTables(): Promise<string[]> {
  return v14DynamicSync.detectNewTables();
}

export async function syncAllTables(): Promise<void> {
  return v14DynamicSync.syncAllTables();
}

export function getDynamicSyncStatus(): DynamicSyncStatus {
  return v14DynamicSync.getSyncStatus();
}

export async function testSupabaseConnection(): Promise<boolean> {
  return v14DynamicSync.testConnection();
}

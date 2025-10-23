/**
import { Q } from '@nozbe/watermelondb';
 * MET2.4 V14 App Sync Service - User & Development App Integration
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - User App (localhost:3000) sync integratie
 * - Development App (localhost:3002) sync integratie
 * - V14 database sync met Supabase
 * - Real-time data synchronisatie
 * - Cross-app data consistency
 * - Environment-specific configuratie
 * 
 * @author Thomas
 * @version 2.4.2
 */

import database from '../database/v14/database';
import { logger } from '../utils/logger';
import { syncDataToBridge, syncAllV14Tables, testMCPBridgeConnection } from './syncService';
import { getCurrentAppConfig, V14_DATABASE_CONFIG, MCP_BRIDGE_CONFIG } from '../config/v14AppConfig';

// Get current app configuration
function getCurrentAppEnv() {
  return getCurrentAppConfig();
}

// Sync status tracking
const syncStatus = {
  isActive: false,
  lastSync: null as Date | null,
  errorCount: 0,
  successCount: 0,
  currentApp: getCurrentAppEnv()
};

/**
 * V14 App Sync Service Class
 */
class V14AppSyncService {
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  /**
   * Initialize sync service for current app
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const appEnv = getCurrentAppEnv();
    logger.info(`🚀 Initializing V14 sync for ${appEnv.name} (port ${appEnv.port})`);

    try {
      // Test MCP-Bridge connection
      const isConnected = await testMCPBridgeConnection();
      if (!isConnected) {
        logger.warn(`⚠️ MCP-Bridge not connected for ${appEnv.name}`);
      }

      // Start periodic sync
      this.startPeriodicSync();
      
      this.isInitialized = true;
      logger.info(`✅ V14 sync initialized for ${appEnv.name}`);
    } catch (error) {
      logger.error(`❌ Failed to initialize V14 sync for ${appEnv.name}:`, undefined, error);
      throw error;
    }
  }

  /**
   * Start periodic sync based on app environment
   */
  private startPeriodicSync(): void {
    const appEnv = getCurrentAppEnv();
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      try {
        await this.performSync();
      } catch (error) {
        logger.error(`Periodic sync failed for ${appEnv.name}:`, undefined, error);
      }
    }, appEnv.syncInterval);

    logger.info(`🔄 Periodic sync started for ${appEnv.name} (${appEnv.syncInterval}ms interval)`);
  }

  /**
   * Perform sync operation
   */
  async performSync(): Promise<void> {
    if (syncStatus.isActive) {
      logger.debug('Sync already in progress, skipping...');
      return;
    }

    const appEnv = getCurrentAppEnv();
    syncStatus.isActive = true;

    try {
      logger.info(`🔄 Starting sync for ${appEnv.name}`);

      // Sync all V14 tables using configured sync tables
      const results = await syncAllV14Tables({
        batchSize: appEnv.batchSize,
        includeMBTIContext: true
      });

      // Update sync status
      const successfulTables = results.filter(r => r.success).length;
      const totalSynced = results.reduce((sum, r) => sum + r.syncedCount, 0);

      syncStatus.lastSync = new Date();
      syncStatus.successCount++;
      syncStatus.errorCount = 0;

      logger.info(`✅ Sync completed for ${appEnv.name}: ${successfulTables}/${results.length} tables, ${totalSynced} records`);

    } catch (error) {
      syncStatus.errorCount++;
      logger.error(`❌ Sync failed for ${appEnv.name}:`, undefined, error);
    } finally {
      syncStatus.isActive = false;
    }
  }

  /**
   * Sync specific table
   */
  async syncTable(tableName: string): Promise<void> {
    const appEnv = getCurrentAppEnv();
    
    try {
      logger.info(`🔄 Syncing table ${tableName} for ${appEnv.name}`);
      
      const result = await syncDataToBridge(tableName, {
        batchSize: appEnv.batchSize,
        includeMBTIContext: true
      });

      if (result.success) {
        logger.info(`✅ Table ${tableName} synced successfully: ${result.syncedCount} records`);
      } else {
        logger.error(`❌ Table ${tableName} sync failed:`, result.errors);
      }
    } catch (error) {
      logger.error(`❌ Failed to sync table ${tableName} for ${appEnv.name}:`, undefined, error);
    }
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      ...syncStatus,
      currentApp: getCurrentAppEnv(),
      isInitialized: this.isInitialized
    };
  }

  /**
   * Force sync all data
   */
  async forceSyncAll(): Promise<void> {
    const appEnv = getCurrentAppEnv();
    logger.info(`🔄 Force sync requested for ${appEnv.name}`);
    
    await this.performSync();
  }

  /**
   * Stop sync service
   */
  stop(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    const appEnv = getCurrentAppEnv();
    logger.info(`🛑 Sync service stopped for ${appEnv.name}`);
  }

  /**
   * Get app-specific configuration
   */
  getAppConfig() {
    return getCurrentAppEnv();
  }
}

// Create singleton instance
const v14AppSyncService = new V14AppSyncService();

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Only initialize in browser environment
  v14AppSyncService.initialize().catch(error => {
    logger.error('Failed to auto-initialize V14 app sync service:', { error });
  });
}

export default v14AppSyncService;
export { V14AppSyncService };

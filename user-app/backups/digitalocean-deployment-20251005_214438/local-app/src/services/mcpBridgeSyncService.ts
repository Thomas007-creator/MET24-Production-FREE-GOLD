/**
 * MCP Bridge Sync Service
 * 
 * Handelt communicatie tussen User App en MCP-Bridge af
 * Ondersteunt V14 tabellen en MBTI context
 * 
 * @version 14.0.0
 * @author Thomas
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import database from '../database'; // V14 database
import { logger } from '../utils/logger';
import { useAppStore } from '../store/useAppStore';
import { VPNPipelineManager } from './vpnPipelineManager';

// MCP Bridge configuration
const MCP_BRIDGE_URL = process.env.REACT_APP_MCP_BRIDGE_URL || 'http://localhost:3001';
const MCP_BRIDGE_TIMEOUT = 10000; // 10 seconds

export interface MBTIContext {
  type: string;
  sessionId: string;
  userId?: string;
  preferences?: any;
  lastSync?: number;
}

export interface SyncRequest {
  data: any[];
  table: string;
  mbtiContext: MBTIContext;
  syncType: 'push' | 'pull' | 'bidirectional';
  timestamp: number;
}

export interface SyncResponse {
  success: boolean;
  syncedRecords: number;
  conflicts?: any[];
  errors?: string[];
  mbtiInsights?: any;
  nextSync?: number;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: number | null;
  errorCount: number;
  lastError: string | null;
  recordsSynced: number;
  tablesSynced: string[];
}

export class MCPBridgeSyncService {
  private axiosInstance: AxiosInstance;
  private syncStatus: SyncStatus;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;
  private vpnManager: VPNPipelineManager | null = null;
  private isOnline: boolean = true;
  private connectionRetryTimer: NodeJS.Timeout | null = null;
  private offlineQueue: any[] = [];

  constructor(vpnManager?: VPNPipelineManager) {
    this.vpnManager = vpnManager || null;
    this.axiosInstance = axios.create({
      baseURL: MCP_BRIDGE_URL,
      timeout: MCP_BRIDGE_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'X-Service': 'UserApp-V14',
        'X-Version': '2.4.1',
      },
    });

    this.syncStatus = {
      isSyncing: false,
      lastSync: null,
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      tablesSynced: [],
    };

    // Setup request/response interceptors
    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for logging and error handling with graceful fallbacks
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        logger.info(`🔄 MCP Bridge Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('❌ MCP Bridge Request Error:', { error });
        this.handleConnectionError();
        return Promise.reject(error);
      }
    );

    // Response interceptor with enhanced error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.info(`✅ MCP Bridge Response: ${response.status} ${response.config.url}`);
        this.handleConnectionSuccess();
        return response;
      },
      (error) => {
        logger.error('❌ MCP Bridge Response Error:', { error });
        this.handleConnectionError();
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handle connection success - reset error state
   */
  private handleConnectionSuccess(): void {
    if (!this.isOnline) {
      this.isOnline = true;
      logger.info('🟢 MCP Bridge connection restored');
      this.processOfflineQueue();
    }
    this.syncStatus.errorCount = 0;
    this.syncStatus.lastError = null;
  }

  /**
   * Handle connection error - implement graceful fallback
   */
  private handleConnectionError(): void {
    if (this.isOnline) {
      this.isOnline = false;
      logger.warn('🔴 MCP Bridge connection lost - switching to offline mode');
    }
    this.syncStatus.errorCount++;
    this.syncStatus.lastError = 'Connection to MCP Bridge lost';
    
    // Start retry timer if not already running
    if (!this.connectionRetryTimer) {
      this.startConnectionRetry();
    }
  }

  /**
   * Start automatic connection retry
   */
  private startConnectionRetry(): void {
    this.connectionRetryTimer = setInterval(async () => {
      try {
        const isConnected = await this.testConnection();
        if (isConnected) {
          this.handleConnectionSuccess();
          this.stopConnectionRetry();
        }
      } catch (error) {
        logger.warn('🔄 MCP Bridge retry failed, will try again...');
      }
    }, this.retryDelay * 1000);
  }

  /**
   * Stop connection retry timer
   */
  private stopConnectionRetry(): void {
    if (this.connectionRetryTimer) {
      clearInterval(this.connectionRetryTimer);
      this.connectionRetryTimer = null;
    }
  }

  /**
   * Process queued operations when connection is restored
   */
  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return;
    
    logger.info(`📤 Processing ${this.offlineQueue.length} queued operations`);
    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    
    for (const operation of queue) {
      try {
        await operation();
      } catch (error) {
        logger.error('❌ Failed to process queued operation:', { error });
        // Re-queue failed operations
        this.offlineQueue.push(operation);
      }
    }
  }

  /**
   * Get MBTI context from app store
   */
  private getMBTIContext(): MBTIContext {
    const { userData } = useAppStore.getState();
    
    return {
      type: userData?.mbtiType || 'UNKNOWN',
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: userData?.id || undefined,
      preferences: (userData as any)?.preferences || {},
      lastSync: this.syncStatus.lastSync || undefined,
    };
  }

  /**
   * Sync data to MCP Bridge with offline mode support
   */
  async syncDataToBridge(tableName: string, syncType: 'push' | 'pull' | 'bidirectional' = 'push'): Promise<SyncResponse> {
    if (this.syncStatus.isSyncing) {
      logger.warn('Sync already in progress, skipping...');
      throw new Error('Sync already in progress');
    }

    // VPN validatie toevoegen
    if (this.vpnManager) {
      await this.vpnManager.validateVPNForOperation(`sync-${tableName}`);
    }

    this.syncStatus.isSyncing = true;
    this.syncStatus.recordsSynced = 0;

    try {
      logger.info(`🔄 Starting sync for table: ${tableName}`);

      // Check if we're online
      if (!this.isOnline) {
        logger.warn(`📴 Offline mode - queuing sync for ${tableName}`);
        return this.handleOfflineSync(tableName, syncType);
      }

      // Get MBTI context
      const mbtiContext = this.getMBTIContext();

      // Prepare sync request
      const syncRequest: SyncRequest = {
        data: [],
        table: tableName,
        mbtiContext,
        syncType,
        timestamp: Date.now(),
      };

      if (syncType === 'push' || syncType === 'bidirectional') {
        // Get unsynced data from WatermelonDB
        const unsynced = await this.getUnsyncedData(tableName);
        syncRequest.data = unsynced;
      }

      // Send to MCP Bridge
      const response: AxiosResponse<SyncResponse> = await this.axiosInstance.post('/api/sync', syncRequest);

      if (response.data.success) {
        // Mark as synced in WatermelonDB
        await this.markAsSynced(tableName, response.data.syncedRecords);
        
        // Update sync status
        this.syncStatus.lastSync = Date.now();
        this.syncStatus.errorCount = 0;
        this.syncStatus.lastError = null;
        this.syncStatus.recordsSynced += response.data.syncedRecords;
        this.syncStatus.tablesSynced.push(tableName);

        logger.info(`✅ Sync successful for ${tableName}: ${response.data.syncedRecords} records`);
      }

      return response.data;

    } catch (error) {
      this.syncStatus.errorCount++;
      this.syncStatus.lastError = error instanceof Error ? error.message : String(error);
      
      logger.error(`❌ Sync failed for ${tableName}:`, { error });
      
      // If it's a connection error, queue for later
      if (this.isConnectionError(error)) {
        logger.warn(`📴 Connection error - queuing sync for ${tableName}`);
        return this.handleOfflineSync(tableName, syncType);
      }
      
      throw error;
    } finally {
      this.syncStatus.isSyncing = false;
    }
  }

  /**
   * Handle offline sync - queue operation and return local response
   */
  private async handleOfflineSync(tableName: string, syncType: 'push' | 'pull' | 'bidirectional'): Promise<SyncResponse> {
    // Queue the operation for when connection is restored
    this.offlineQueue.push(() => this.syncDataToBridge(tableName, syncType));
    
    // Return a local response indicating offline mode
    return {
      success: true,
      syncedRecords: 0,
      errors: [`Queued for sync when connection restored`],
      mbtiInsights: null,
      nextSync: Date.now() + (this.retryDelay * 1000)
    };
  }

  /**
   * Check if error is a connection error
   */
  private isConnectionError(error: any): boolean {
    if (!error.response) return true; // Network error
    if (error.code === 'ECONNREFUSED') return true;
    if (error.code === 'ENOTFOUND') return true;
    if (error.code === 'ETIMEDOUT') return true;
    return false;
  }

  /**
   * Get unsynced data from WatermelonDB
   */
  private async getUnsyncedData(tableName: string): Promise<any[]> {
    try {
      const collection = database.get(tableName);
      
      // Query for unsynced records (assuming there's a 'synced' field)
      const allRecords = await collection
        .query()
        .fetch();
      const unsynced = allRecords.filter((record: any) => !record.synced);

      return unsynced.map((record: any) => record._raw);
    } catch (error) {
      logger.error(`Failed to get unsynced data for ${tableName}:`, undefined, error);
      return [];
    }
  }

  /**
   * Mark records as synced in WatermelonDB
   */
  private async markAsSynced(tableName: string, recordCount: number): Promise<void> {
    try {
      const collection = database.get(tableName);
      
      await database.write(async () => {
        const allRecords = await collection
          .query()
          .fetch();
        const unsynced = allRecords.filter((record: any) => !record.synced);

        // Mark first N records as synced
        const recordsToMark = unsynced.slice(0, recordCount);
        
        for (const record of recordsToMark) {
          await record.update((record: any) => {
            record.synced = true;
            record.syncedAt = Date.now();
          });
        }
      });
    } catch (error) {
      logger.error(`Failed to mark records as synced for ${tableName}:`, undefined, error);
    }
  }

  /**
   * Sync specific V14 tables
   */
  async syncV14Tables(): Promise<void> {
    const v14Tables = [
      'tasks',
      'contacts', 
      'future_extensions',
      'extension_events',
      'extension_settings',
      'users',
      'chat_messages',
      'journal_entries',
      'ai_interactions',
      'settings',
      'mbti_profiles',
      'life_areas_progress',
      'onboarding_states',
      'levensgebieden_questionnaires',
    ];

    logger.info(`🔄 Starting V14 tables sync: ${v14Tables.length} tables`);

    for (const table of v14Tables) {
      try {
        await this.syncDataToBridge(table, 'bidirectional');
        // Small delay between table syncs
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        logger.error(`Failed to sync table ${table}:`, undefined, error);
        // Continue with other tables
      }
    }

    logger.info('✅ V14 tables sync completed');
  }

  /**
   * Test MCP Bridge connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/api/health');
      logger.info('✅ MCP Bridge connection test successful');
      return response.status === 200;
    } catch (error) {
      logger.error('❌ MCP Bridge connection test failed:', undefined, error);
      return false;
    }
  }

  /**
   * Get sync status
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
      errorCount: 0,
      lastError: null,
      recordsSynced: 0,
      tablesSynced: [],
    };
  }

  /**
   * Retry failed sync with exponential backoff
   */
  async retrySync(tableName: string, maxAttempts: number = this.retryAttempts): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await this.syncDataToBridge(tableName);
        logger.info(`✅ Retry successful for ${tableName} on attempt ${attempt}`);
        return;
      } catch (error) {
        if (attempt === maxAttempts) {
          logger.error(`❌ All retry attempts failed for ${tableName}`);
          throw error;
        }
        
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        logger.warn(`⏳ Retry attempt ${attempt} failed, waiting ${delay}ms before next attempt`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

// Export singleton instance
export const mcpBridgeSync = new MCPBridgeSyncService();

// Export convenience functions
export async function syncDataToBridge(tableName: string, syncType: 'push' | 'pull' | 'bidirectional' = 'push'): Promise<SyncResponse> {
  return mcpBridgeSync.syncDataToBridge(tableName, syncType);
}

// Export function to set VPN manager
export function setVPNManager(vpnManager: VPNPipelineManager): void {
  mcpBridgeSync['vpnManager'] = vpnManager;
}

export async function syncV14Tables(): Promise<void> {
  return mcpBridgeSync.syncV14Tables();
}

export async function testMCPBridgeConnection(): Promise<boolean> {
  return mcpBridgeSync.testConnection();
}

export function getMCPBridgeSyncStatus(): SyncStatus {
  return mcpBridgeSync.getSyncStatus();
}

export async function retrySync(tableName: string, maxAttempts?: number): Promise<void> {
  return mcpBridgeSync.retrySync(tableName, maxAttempts);
}

/**
 * MET2.4 V14 Sync Service - MCP-Bridge Integration
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - WatermelonDB V14 integratie
 * - MCP-Bridge sync functionaliteit
 * - MBTI context tracking
 * - Retry logic en error handling
 * - Batch sync operations
 * - Real-time sync status
 * 
 * @author Thomas
 * @version 2.4.2
 */

import { Q } from '@nozbe/watermelondb';
import axios, { AxiosResponse } from 'axios';
import database from '../database/v14/database';
import { logger } from '../utils/logger';

// Types
interface MBTIContext {
  type: string;
  sessionId: string;
  userId?: string;
  timestamp?: string;
}

interface SyncResponse {
  success: boolean;
  syncedCount: number;
  errors?: string[];
  timestamp: string;
}

interface SyncOptions {
  batchSize?: number;
  retryAttempts?: number;
  retryDelay?: number;
  includeMBTIContext?: boolean;
}

// Configuration
const MCP_BRIDGE_URL = process.env.REACT_APP_MCP_BRIDGE_URL || 'http://localhost:3001';
const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

// Sync status tracking
let syncInProgress = false;
const syncStatus = new Map<string, 'pending' | 'syncing' | 'completed' | 'failed'>();

/**
 * Get MBTI context for sync operations
 */
async function getMBTIContext(): Promise<MBTIContext> {
  try {
    // Get user's MBTI profile
    const mbtiProfiles = await database.get('mbti_profiles').query().fetch();
    const currentProfile = mbtiProfiles[0];
    
    // Get current session info
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      type: (currentProfile as any)?.mbtiType || 'UNKNOWN',
      sessionId,
      userId: (currentProfile as any)?.userId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error getting MBTI context:', undefined, error);
    return {
      type: 'UNKNOWN',
      sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Get unsynced records from WatermelonDB
 */
async function getUnsyncedRecords(tableName: string, batchSize: number = DEFAULT_BATCH_SIZE) {
  try {
    const collection = database.get(tableName);
    
    // Query for unsynced records (assuming 'synced' field exists)
    const unsynced = await collection
      .query(
        Q.where('synced', Q.notEq(true)),
        Q.take(batchSize)
      )
      .fetch();
    
    logger.info(`Found ${unsynced.length} unsynced records in ${tableName}`);
    return unsynced;
  } catch (error) {
    logger.error(`Error getting unsynced records from ${tableName}:`, undefined, error);
    throw error;
  }
}

/**
 * Mark records as synced in WatermelonDB
 */
async function markRecordsAsSynced(records: any[]) {
  try {
    await database.write(async () => {
      for (const record of records) {
        await record.update(() => {
          record.synced = true;
          record.syncedAt = new Date().toISOString();
        });
      }
    });
    
    logger.info(`Marked ${records.length} records as synced`);
  } catch (error) {
    logger.error('Error marking records as synced:', undefined, error);
    throw error;
  }
}

/**
 * Retry mechanism for failed sync operations
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  attempts: number = DEFAULT_RETRY_ATTEMPTS,
  delay: number = DEFAULT_RETRY_DELAY
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${i + 1} failed:`, undefined, error);
      
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
      }
    }
  }
  
  throw lastError!;
}

/**
 * Sync data to MCP-Bridge
 */
async function syncDataToBridge(
  tableName: string,
  options: SyncOptions = {}
): Promise<SyncResponse> {
  const {
    batchSize = DEFAULT_BATCH_SIZE,
    retryAttempts = DEFAULT_RETRY_ATTEMPTS,
    retryDelay = DEFAULT_RETRY_DELAY,
    includeMBTIContext = true
  } = options;

  // Check if sync is already in progress
  if (syncInProgress) {
    throw new Error('Sync operation already in progress');
  }

  syncInProgress = true;
  syncStatus.set(tableName, 'syncing');

  try {
    logger.info(`Starting sync for table: ${tableName}`);

    // Get unsynced records
    const unsyncedRecords = await getUnsyncedRecords(tableName, batchSize);
    
    if (unsyncedRecords.length === 0) {
      logger.info(`No unsynced records found for ${tableName}`);
      syncStatus.set(tableName, 'completed');
      return {
        success: true,
        syncedCount: 0,
        timestamp: new Date().toISOString()
      };
    }

    // Get MBTI context if requested
    const mbtiContext = includeMBTIContext ? await getMBTIContext() : undefined;

    // Prepare sync payload
    const syncPayload = {
      data: unsyncedRecords.map(record => record._raw),
      table: tableName,
      mbtiContext,
      batchInfo: {
        batchSize,
        totalRecords: unsyncedRecords.length,
        timestamp: new Date().toISOString()
      }
    };

    // Send to MCP-Bridge with retry logic
    const response: AxiosResponse = await retryOperation(
      () => axios.post(`${MCP_BRIDGE_URL}/sync`, syncPayload, {
        timeout: 30000, // 30 second timeout
        headers: {
          'Content-Type': 'application/json',
          'X-Sync-Source': 'MET24-V14-UserApp'
        }
      }),
      retryAttempts,
      retryDelay
    );

    if (response.status === 200) {
      // Mark records as synced
      await markRecordsAsSynced(unsyncedRecords);
      
      syncStatus.set(tableName, 'completed');
      logger.info(`Sync successful for ${tableName}: ${unsyncedRecords.length} records`);
      
      return {
        success: true,
        syncedCount: unsyncedRecords.length,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

  } catch (error) {
    syncStatus.set(tableName, 'failed');
    logger.error(`Sync failed for ${tableName}:`, undefined, error);
    
    return {
      success: false,
      syncedCount: 0,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
      timestamp: new Date().toISOString()
    };
  } finally {
    syncInProgress = false;
  }
}

/**
 * Sync all V14 tables
 */
async function syncAllV14Tables(options: SyncOptions = {}): Promise<SyncResponse[]> {
  const v14Tables = [
    'users', 'mbti_profiles', 'settings', 'life_areas_progress',
    'onboarding_states', 'chat_messages', 'journal_entries', 'contacts',
    'ai_interactions', 'vector_embeddings', 'ai_action_plans', 'super_insights',
    'rewind_sessions', 'ai_learning_pipeline', 'ai_personalization_engine',
    'offline_ai_models', 'user_behavior_analytics', 'external_ai_services',
    'interactive_ai_sessions', 'dynamic_content_creation', 'ai_service_health_monitoring',
    'content_items', 'content_chunks', 'content_pointers', 'offline_packs',
    'content_recommendations', 'content_sources', 'mbti_learning_paths',
    'content_analytics', 'media_intelligence', 'content_sync_status',
    'subscription_plans', 'user_subscriptions', 'payment_transactions',
    'upgrade_flow_events', 'met24_domains', 'met24_domain_relations',
    'met24_new_insights', 'met24_practical_applications', 'met24_user_progress',
    'met24_sync_queue', 'met24_server_sync_status', 'levensgebieden_questionnaires',
    'tasks', 'sync_status', 'feature_usage', 'mbti_contents', 'future_extensions'
  ];

  logger.info(`Starting sync for all ${v14Tables.length} V14 tables`);

  const results: SyncResponse[] = [];
  
  for (const tableName of v14Tables) {
    try {
      const result = await syncDataToBridge(tableName, options);
      results.push(result);
      
      // Small delay between table syncs to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      logger.error(`Failed to sync table ${tableName}:`, undefined, error);
      results.push({
        success: false,
        syncedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        timestamp: new Date().toISOString()
      });
    }
  }

  const totalSynced = results.reduce((sum, result) => sum + result.syncedCount, 0);
  const successfulTables = results.filter(result => result.success).length;
  
  logger.info(`Sync completed: ${successfulTables}/${v14Tables.length} tables successful, ${totalSynced} total records synced`);

  return results;
}

/**
 * Test MCP-Bridge connection
 */
async function testMCPBridgeConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${MCP_BRIDGE_URL}/health`, {
      timeout: 5000
    });
    
    return response.status === 200;
  } catch (error) {
    logger.error('MCP-Bridge connection test failed:', undefined, error);
    return false;
  }
}

/**
 * Get detailed MCP-Bridge health status
 */
async function getMCPBridgeHealthStatus(): Promise<any> {
  try {
    const response = await axios.get(`${MCP_BRIDGE_URL}/health`, {
      timeout: 5000
    });
    
    return {
      connected: true,
      status: response.data,
      responseTime: response.headers['x-response-time'] || 'N/A'
    };
  } catch (error) {
    logger.error('MCP-Bridge health check failed:', undefined, error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: null
    };
  }
}

/**
 * Get sync status for all tables
 */
function getSyncStatus(): Map<string, string> {
  return new Map(syncStatus);
}

/**
 * Clear sync status
 */
function clearSyncStatus(): void {
  syncStatus.clear();
}

/**
 * Check if sync is in progress
 */
function isSyncInProgress(): boolean {
  return syncInProgress;
}

// Export functions
export {
  syncDataToBridge,
  syncAllV14Tables,
  testMCPBridgeConnection,
  getMCPBridgeHealthStatus,
  getSyncStatus,
  clearSyncStatus,
  isSyncInProgress,
  getMBTIContext,
  getUnsyncedRecords,
  markRecordsAsSynced
};

// Export types
export type {
  MBTIContext,
  SyncResponse,
  SyncOptions
};

// Default export
export default {
  syncDataToBridge,
  syncAllV14Tables,
  testMCPBridgeConnection,
  getMCPBridgeHealthStatus,
  getSyncStatus,
  clearSyncStatus,
  isSyncInProgress
};

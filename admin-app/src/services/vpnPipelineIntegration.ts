/**
 * VPN Pipeline Integration - MET2.4 V14
 * 
 * Hoofd integratie bestand voor VPN Pipeline met alle bestaande services
 * Initialiseert en configureert alle VPN-gerelateerde services
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { createVPNPipelineManager, VPNPipelineManager } from './vpnPipelineManager';
import { createVPNProtectedSyncManager, VPNProtectedSyncManager } from './vpnProtectedSyncManager';
import { createHybridTestingManager, HybridTestingManager } from './hybridTestingManager';
import { createSupabaseSyncProvider, SupabaseSyncProvider } from '../database/v14/sync/SupabaseSyncProvider';
import { MCPBridgeSyncService, setVPNManager } from './mcpBridgeSyncService';
import { supabase } from '../config/supabase';
import database from '../database';
import { logger } from '../utils/logger';

// Export classes for external use
export { VPNPipelineManager, VPNProtectedSyncManager, HybridTestingManager };

export interface VPNPipelineConfig {
  enabled: boolean;
  required: boolean;
  tailscaleEnabled: boolean;
  wireguardEnabled: boolean;
  syncEnabled: boolean;
  testingEnabled: boolean;
}

export class VPNPipelineIntegration {
  private config: VPNPipelineConfig;
  private vpnManager: VPNPipelineManager;
  private vpnSyncManager: VPNProtectedSyncManager;
  private testingManager: HybridTestingManager;
  private supabaseSyncProvider: SupabaseSyncProvider;
  private mcpBridgeSyncService: MCPBridgeSyncService;
  private isInitialized: boolean = false;

  constructor(config: VPNPipelineConfig) {
    this.config = config;
    
    // Initialize services
    this.vpnManager = createVPNPipelineManager({}, supabase);
    this.supabaseSyncProvider = createSupabaseSyncProvider(database, {}, this.vpnManager);
    this.mcpBridgeSyncService = new MCPBridgeSyncService(this.vpnManager);
    this.vpnSyncManager = createVPNProtectedSyncManager(
      {},
      this.vpnManager,
      this.supabaseSyncProvider,
      this.mcpBridgeSyncService
    );
    this.testingManager = createHybridTestingManager(
      {},
      this.vpnManager,
      this.vpnSyncManager
    );
  }

  /**
   * Initialiseer VPN Pipeline Integration
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.warn('VPN Pipeline Integration already initialized');
      return;
    }

    if (!this.config.enabled) {
      logger.info('🔓 VPN Pipeline Integration disabled - proceeding without VPN features');
      return;
    }

    try {
      logger.info('🔐 Initializing VPN Pipeline Integration...');

      // 1. Initialize VPN Manager
      await this.vpnManager.initialize();

      // 2. Set VPN Manager in MCP Bridge Sync Service
      setVPNManager(this.vpnManager);

      // 3. Initialize VPN Protected Sync Manager
      if (this.config.syncEnabled) {
        await this.vpnSyncManager.initialize();
      }

      // 4. Initialize Hybrid Testing Manager
      if (this.config.testingEnabled) {
        await this.testingManager.initialize();
      }

      this.isInitialized = true;
      logger.info('✅ VPN Pipeline Integration initialized successfully');
    } catch (error) {
      logger.error('❌ VPN Pipeline Integration initialization failed:', { error });
      if (this.config.required) {
        throw error;
      }
    }
  }

  /**
   * Get VPN Manager
   */
  getVPNManager(): VPNPipelineManager {
    return this.vpnManager;
  }

  /**
   * Get VPN Sync Manager
   */
  getVPNSyncManager(): VPNProtectedSyncManager {
    return this.vpnSyncManager;
  }

  /**
   * Get Testing Manager
   */
  getTestingManager(): HybridTestingManager {
    return this.testingManager;
  }

  /**
   * Get Supabase Sync Provider
   */
  getSupabaseSyncProvider(): SupabaseSyncProvider {
    return this.supabaseSyncProvider;
  }

  /**
   * Get MCP Bridge Sync Service
   */
  getMCPBridgeSyncService(): MCPBridgeSyncService {
    return this.mcpBridgeSyncService;
  }

  /**
   * Check if VPN Pipeline is initialized
   */
  isVPNPipelineInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get VPN Pipeline status
   */
  async getVPNPipelineStatus(): Promise<{
    initialized: boolean;
    vpnStatus: any;
    syncStatus: any;
    testingStatus: any;
  }> {
    return {
      initialized: this.isInitialized,
      vpnStatus: this.vpnManager.getVPNStatus(),
      syncStatus: this.vpnSyncManager.getSyncQueueStatus(),
      testingStatus: this.testingManager.getTestSummary()
    };
  }

  /**
   * Shutdown VPN Pipeline Integration
   */
  async shutdown(): Promise<void> {
    try {
      logger.info('🔓 Shutting down VPN Pipeline Integration...');

      // Shutdown testing manager
      if (this.testingManager) {
        this.testingManager.stopTesting();
      }

      // Shutdown VPN manager
      if (this.vpnManager) {
        await this.vpnManager.shutdown();
      }

      this.isInitialized = false;
      logger.info('✅ VPN Pipeline Integration shutdown complete');
    } catch (error) {
      logger.error('❌ VPN Pipeline Integration shutdown failed:', { error });
    }
  }
}

/**
 * Factory function voor VPNPipelineIntegration
 */
export function createVPNPipelineIntegration(
  config: Partial<VPNPipelineConfig> = {}
): VPNPipelineIntegration {
  const defaultConfig: VPNPipelineConfig = {
    enabled: process.env.VPN_ENABLED === 'true',
    required: process.env.VPN_REQUIRED === 'true',
    tailscaleEnabled: process.env.TAILSCALE_ENABLED === 'true',
    wireguardEnabled: process.env.WIREGUARD_ENABLED === 'true',
    syncEnabled: process.env.VPN_PROTECTED_SYNC_ENABLED === 'true',
    testingEnabled: process.env.TESTING_ENABLED === 'true',
    ...config
  };

  return new VPNPipelineIntegration(defaultConfig);
}

/**
 * Global VPN Pipeline Integration instance
 */
let globalVPNPipelineIntegration: VPNPipelineIntegration | null = null;

/**
 * Get global VPN Pipeline Integration instance
 */
export function getGlobalVPNPipelineIntegration(): VPNPipelineIntegration | null {
  return globalVPNPipelineIntegration;
}

/**
 * Set global VPN Pipeline Integration instance
 */
export function setGlobalVPNPipelineIntegration(integration: VPNPipelineIntegration): void {
  globalVPNPipelineIntegration = integration;
}

/**
 * Initialize global VPN Pipeline Integration
 */
export async function initializeGlobalVPNPipelineIntegration(
  config?: Partial<VPNPipelineConfig>
): Promise<VPNPipelineIntegration> {
  if (globalVPNPipelineIntegration) {
    return globalVPNPipelineIntegration;
  }

  const integration = createVPNPipelineIntegration(config);
  await integration.initialize();
  setGlobalVPNPipelineIntegration(integration);
  
  return integration;
}

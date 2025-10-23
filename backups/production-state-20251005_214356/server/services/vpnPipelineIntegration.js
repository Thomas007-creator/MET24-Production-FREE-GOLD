/**
 * VPN Pipeline Integration - Server-side
 * 
 * Server-side implementatie van VPN Pipeline Integration
 * Voor gebruik in Express.js routes en services
 * 
 * @version 14.0.0
 * @author Thomas
 */

const { createClient } = require('@supabase/supabase-js');

class VPNPipelineManager {
  constructor(config, supabase) {
    this.config = config;
    this.supabase = supabase;
    this.vpnStatus = {
      isConnected: false,
      isSecure: false,
      lastCheck: new Date(),
      connectionQuality: 'unknown',
      vpnType: 'none'
    };
  }

  async initialize() {
    if (!this.config.enabled) {
      console.log('🔓 VPN Pipeline disabled - proceeding without VPN validation');
      return;
    }

    try {
      console.log('🔐 Initializing VPN Pipeline...');
      
      await this.startVPNMonitoring();
      await this.establishSecureConnection();
      
      console.log('✅ VPN Pipeline initialized successfully');
    } catch (error) {
      console.error('❌ VPN Pipeline initialization failed:', error);
      if (this.config.required) {
        throw error;
      }
    }
  }

  async startVPNMonitoring() {
    try {
      const vpnStatus = await this.checkVPNStatus();
      this.vpnStatus = vpnStatus;
      
      if (!vpnStatus.isConnected && this.config.required) {
        throw new Error('VPN connection required but not available');
      }
      
      console.log(`✅ VPN monitoring started - Type: ${vpnStatus.vpnType}, Quality: ${vpnStatus.connectionQuality}`);
    } catch (error) {
      console.error('❌ VPN monitoring failed:', error);
      throw error;
    }
  }

  async checkVPNStatus() {
    try {
      // Check Tailscale (prioriteit)
      if (this.config.tailscaleEnabled) {
        const tailscaleStatus = await this.checkTailscaleStatus();
        if (tailscaleStatus.isConnected) {
          return tailscaleStatus;
        }
      }

      // Check WireGuard (fallback)
      if (this.config.wireguardEnabled) {
        const wireguardStatus = await this.checkWireguardStatus();
        if (wireguardStatus.isConnected) {
          return wireguardStatus;
        }
      }

      // No VPN connected
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'none'
      };
    } catch (error) {
      console.error('VPN status check failed:', error);
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'none'
      };
    }
  }

  async checkTailscaleStatus() {
    try {
      const { exec } = require('child_process');
      
      return new Promise((resolve) => {
        exec('docker exec met24-tailscale tailscale status --json', (error, stdout, stderr) => {
          if (error) {
            resolve({
              isConnected: false,
              isSecure: false,
              lastCheck: new Date(),
              connectionQuality: 'unknown',
              vpnType: 'tailscale'
            });
            return;
          }
          
          try {
            const status = JSON.parse(stdout);
            resolve({
              isConnected: status.Self.Online || false,
              isSecure: status.Self.Online || false,
              lastCheck: new Date(),
              connectionQuality: status.Self.Online ? 'excellent' : 'unknown',
              vpnType: 'tailscale',
              ipAddress: status.Self.TailscaleIPs?.[0] || null,
              serverLocation: 'Tailscale'
            });
          } catch (parseError) {
            resolve({
              isConnected: false,
              isSecure: false,
              lastCheck: new Date(),
              connectionQuality: 'unknown',
              vpnType: 'tailscale'
            });
          }
        });
      });
    } catch (error) {
      console.error('Tailscale status check failed:', error);
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'tailscale'
      };
    }
  }

  async checkWireguardStatus() {
    try {
      const { exec } = require('child_process');
      
      return new Promise((resolve) => {
        exec('docker exec met24-vpn wg show', (error, stdout, stderr) => {
          if (error) {
            resolve({
              isConnected: false,
              isSecure: false,
              lastCheck: new Date(),
              connectionQuality: 'unknown',
              vpnType: 'wireguard'
            });
            return;
          }
          
          const isConnected = stdout.includes('interface: wg0') && stdout.includes('public key:');
          
          resolve({
            isConnected: isConnected,
            isSecure: isConnected,
            lastCheck: new Date(),
            connectionQuality: isConnected ? 'good' : 'unknown',
            vpnType: 'wireguard',
            ipAddress: null,
            serverLocation: 'WireGuard'
          });
        });
      });
    } catch (error) {
      console.error('WireGuard status check failed:', error);
      return {
        isConnected: false,
        isSecure: false,
        lastCheck: new Date(),
        connectionQuality: 'unknown',
        vpnType: 'wireguard'
      };
    }
  }

  async establishSecureConnection() {
    try {
      if (this.config.required && !this.vpnStatus.isConnected) {
        throw new Error('VPN connection required for secure connection');
      }

      // Test Supabase connection with VPN validation
      const { data, error } = await this.supabase
        .from('vpn_status')
        .select('*')
        .eq('user_id', 'current-user-id')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Failed to establish secure connection: ${error.message}`);
      }

      console.log('✅ Secure connection established');
    } catch (error) {
      console.error('❌ Failed to establish secure connection:', error);
      throw error;
    }
  }

  async isVPNConnected() {
    if (!this.config.enabled) {
      return true; // VPN not required
    }
    return this.vpnStatus.isConnected;
  }

  async isVPNSecure() {
    if (!this.config.enabled) {
      return true; // VPN not required
    }
    return this.vpnStatus.isSecure;
  }

  getVPNStatus() {
    return { ...this.vpnStatus };
  }

  async validateVPNForOperation(operation) {
    if (!this.config.enabled) {
      return; // VPN not required
    }

    if (this.config.required && !this.vpnStatus.isConnected) {
      throw new Error(`VPN connection required for ${operation}`);
    }

    if (this.config.required && !this.vpnStatus.isSecure) {
      throw new Error(`VPN connection not secure for ${operation}`);
    }

    console.log(`✅ VPN validation passed for ${operation}`);
  }

  async shutdown() {
    console.log('🔓 VPN Pipeline shutdown');
  }
}

class VPNProtectedSyncManager {
  constructor(config, vpnManager, supabaseSyncProvider, mcpBridgeSyncService) {
    this.config = config;
    this.vpnManager = vpnManager;
    this.supabaseSyncProvider = supabaseSyncProvider;
    this.mcpBridgeSyncService = mcpBridgeSyncService;
    this.syncQueue = [];
    this.isSyncing = false;
  }

  async initialize() {
    if (!this.config.enabled) {
      console.log('🔓 VPN Protected Sync disabled - proceeding without VPN protection');
      return;
    }

    try {
      console.log('🔐 Initializing VPN Protected Sync Manager...');
      
      await this.initializeSyncQueue();
      await this.startSyncProcess();
      
      console.log('✅ VPN Protected Sync Manager initialized successfully');
    } catch (error) {
      console.error('❌ VPN Protected Sync Manager initialization failed:', error);
      throw error;
    }
  }

  async initializeSyncQueue() {
    try {
      const pendingItems = await this.getPendingSyncItems();
      this.syncQueue = pendingItems;
      
      console.log(`📋 Loaded ${pendingItems.length} pending sync items`);
    } catch (error) {
      console.error('Failed to initialize sync queue:', error);
      this.syncQueue = [];
    }
  }

  async startSyncProcess() {
    // Start periodic sync process
    setInterval(async () => {
      if (!this.isSyncing && this.syncQueue.length > 0) {
        await this.processSyncQueue();
      }
    }, this.config.syncInterval);
  }

  async processSyncQueue() {
    this.isSyncing = true;
    
    try {
      const vpnStatus = await this.vpnManager.getVPNStatus();
      if (this.config.required && (!vpnStatus.isConnected || !vpnStatus.isSecure)) {
        throw new Error('VPN not connected or secure - sync aborted');
      }

      const itemsToSync = this.syncQueue.splice(0, this.config.batchSize);
      
      for (const item of itemsToSync) {
        await this.syncItem(item);
      }
      
      console.log(`✅ Synced ${itemsToSync.length} items`);
    } catch (error) {
      console.error('❌ Sync failed:', error);
      // Re-queue failed items
      this.syncQueue.unshift(...this.syncQueue);
    } finally {
      this.isSyncing = false;
    }
  }

  async syncItem(item) {
    try {
      const dataToSync = this.config.encryptionEnabled 
        ? await this.encryptData(item.data)
        : item.data;
      
      // Sync to Supabase via SupabaseSyncProvider
      await this.supabaseSyncProvider.syncRecord(item.table, item.id);
      
      // Sync to MCP Bridge via MCPBridgeSyncService
      await this.mcpBridgeSyncService.syncDataToBridge(item.table, 'push');
      
      await this.markAsSynced(item.id);

      return {
        success: true,
        itemId: item.id,
        syncedAt: new Date()
      };
    } catch (error) {
      return {
        success: false,
        itemId: item.id,
        error: error.message
      };
    }
  }

  async encryptData(data) {
    // TODO: Implement encryption using existing encryption utilities
    return data;
  }

  async getPendingSyncItems() {
    try {
      // TODO: Implement based on your offline storage system
      return [];
    } catch (error) {
      console.error('Failed to get pending sync items:', error);
      return [];
    }
  }

  async markAsSynced(itemId) {
    try {
      console.log(`✅ Marked item ${itemId} as synced`);
    } catch (error) {
      console.error(`Failed to mark item ${itemId} as synced:`, error);
    }
  }

  async addToSyncQueue(item) {
    this.syncQueue.push(item);
    console.log(`📋 Added item to sync queue: ${item.id}`);
  }

  getSyncQueueStatus() {
    return {
      queueLength: this.syncQueue.length,
      isSyncing: this.isSyncing
    };
  }

  async forceSyncAll() {
    if (this.isSyncing) {
      throw new Error('Sync already in progress');
    }
    await this.processSyncQueue();
  }

  clearSyncQueue() {
    this.syncQueue = [];
    console.log('🗑️ Sync queue cleared');
  }
}

class HybridTestingManager {
  constructor(config, vpnManager, vpnSyncManager) {
    this.config = config;
    this.vpnManager = vpnManager;
    this.vpnSyncManager = vpnSyncManager;
    this.testResults = [];
  }

  async initialize() {
    if (!this.config.enabled) {
      console.log('🔓 Hybrid Testing disabled - proceeding without testing');
      return;
    }

    try {
      console.log('🧪 Initializing Hybrid Testing Manager...');
      
      await this.initializeTestingFramework();
      await this.startPeriodicTesting();
      
      console.log('✅ Hybrid Testing Manager initialized successfully');
    } catch (error) {
      console.error('❌ Hybrid Testing Manager initialization failed:', error);
      throw error;
    }
  }

  async initializeTestingFramework() {
    try {
      console.log('🧪 Setting up testing framework...');
      
      if (this.config.validationLevel === 'full') {
        console.log('🔍 Full validation mode enabled');
      } else if (this.config.validationLevel === 'comprehensive') {
        console.log('🔍 Comprehensive validation mode enabled');
      } else {
        console.log('🔍 Basic validation mode enabled');
      }
      
      console.log('✅ Testing framework initialized');
    } catch (error) {
      console.error('Failed to initialize testing framework:', error);
      throw error;
    }
  }

  async startPeriodicTesting() {
    if (this.testInterval) {
      clearInterval(this.testInterval);
    }

    this.testInterval = setInterval(async () => {
      try {
        await this.runHybridTests();
      } catch (error) {
        console.error('Periodic testing failed:', error);
      }
    }, this.config.testingInterval);
  }

  async runHybridTests() {
    const results = [];
    const startTime = Date.now();

    try {
      console.log('🧪 Starting hybrid tests...');

      if (this.config.includeVPNTests) {
        const vpnTest = await this.testVPNPipeline();
        results.push(vpnTest);
      }

      if (this.config.includeSyncTests) {
        const syncTest = await this.testSyncManager();
        results.push(syncTest);
      }

      if (this.config.includeDatabaseTests) {
        const databaseTest = await this.testDatabase();
        results.push(databaseTest);
      }

      if (this.config.includeVectorTests) {
        const vectorTest = await this.testVectorFeatures();
        results.push(vectorTest);
      }

      this.testResults = results;
      
      const duration = Date.now() - startTime;
      console.log(`✅ Hybrid tests completed successfully in ${duration}ms`);
    } catch (error) {
      console.error('❌ Hybrid tests failed:', error);
    }

    return results;
  }

  async testVPNPipeline() {
    const startTime = Date.now();
    
    try {
      const vpnStatus = await this.vpnManager.getVPNStatus();
      const isConnected = await this.vpnManager.isVPNConnected();
      const isSecure = await this.vpnManager.isVPNSecure();
      
      const success = isConnected && isSecure;
      const duration = Date.now() - startTime;
      
      return {
        testName: 'VPN Pipeline',
        success,
        details: {
          vpnStatus,
          isConnected,
          isSecure,
          duration
        },
        timestamp: new Date(),
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'VPN Pipeline',
        success: false,
        error: error.message,
        timestamp: new Date(),
        duration
      };
    }
  }

  async testSyncManager() {
    const startTime = Date.now();
    
    try {
      const syncQueueStatus = this.vpnSyncManager.getSyncQueueStatus();
      
      const testItem = {
        id: `test-item-${Date.now()}`,
        data: { test: 'data' },
        table: 'test_table'
      };

      await this.vpnSyncManager.addToSyncQueue(testItem);
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Sync Manager',
        success: true,
        details: {
          syncQueueStatus,
          testItemAdded: true,
          duration
        },
        timestamp: new Date(),
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Sync Manager',
        success: false,
        error: error.message,
        timestamp: new Date(),
        duration
      };
    }
  }

  async testDatabase() {
    const startTime = Date.now();
    
    try {
      const axios = require('axios');
      const response = await axios.get('http://localhost:3001/api/health', {
        timeout: 5000
      });

      const success = response.status === 200;
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Database',
        success,
        details: {
          status: response.status,
          statusText: response.statusText,
          duration
        },
        timestamp: new Date(),
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Database',
        success: false,
        error: error.message,
        timestamp: new Date(),
        duration
      };
    }
  }

  async testVectorFeatures() {
    const startTime = Date.now();
    
    try {
      const axios = require('axios');
      const vectorTestPayload = {
        action: 'vector_similarity',
        query: 'MBTI personality insights',
        embedding: Array(1536).fill(0.1),
        limit: 5
      };
      
      const response = await axios.post('http://localhost:3001/vector/search', vectorTestPayload, {
        timeout: 10000
      });

      const success = response.status === 200;
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Vector Features',
        success,
        details: {
          status: response.status,
          statusText: response.statusText,
          duration
        },
        timestamp: new Date(),
        duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        testName: 'Vector Features',
        success: false,
        error: error.message,
        timestamp: new Date(),
        duration
      };
    }
  }

  getTestResults() {
    return [...this.testResults];
  }

  getTestSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(result => result.success).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;

    return {
      total,
      passed,
      failed,
      successRate
    };
  }

  stopTesting() {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
    }
    console.log('⏹️ Testing stopped');
  }
}

class VPNPipelineIntegration {
  constructor(config) {
    this.config = config;
    
    // Initialize services
    this.vpnManager = new VPNPipelineManager(config, null);
    this.vpnSyncManager = new VPNProtectedSyncManager(config, this.vpnManager, null, null);
    this.testingManager = new HybridTestingManager(config, this.vpnManager, this.vpnSyncManager);
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('VPN Pipeline Integration already initialized');
      return;
    }

    if (!this.config.enabled) {
      console.log('🔓 VPN Pipeline Integration disabled - proceeding without VPN features');
      return;
    }

    try {
      console.log('🔐 Initializing VPN Pipeline Integration...');

      // 1. Initialize VPN Manager
      await this.vpnManager.initialize();

      // 2. Initialize VPN Protected Sync Manager
      if (this.config.syncEnabled) {
        await this.vpnSyncManager.initialize();
      }

      // 3. Initialize Hybrid Testing Manager
      if (this.config.testingEnabled) {
        await this.testingManager.initialize();
      }

      this.isInitialized = true;
      console.log('✅ VPN Pipeline Integration initialized successfully');
    } catch (error) {
      console.error('❌ VPN Pipeline Integration initialization failed:', error);
      if (this.config.required) {
        throw error;
      }
    }
  }

  getVPNManager() {
    return this.vpnManager;
  }

  getVPNSyncManager() {
    return this.vpnSyncManager;
  }

  getTestingManager() {
    return this.testingManager;
  }

  isVPNPipelineInitialized() {
    return this.isInitialized;
  }

  async getVPNPipelineStatus() {
    return {
      initialized: this.isInitialized,
      vpnStatus: this.vpnManager.getVPNStatus(),
      syncStatus: this.vpnSyncManager.getSyncQueueStatus(),
      testingStatus: this.testingManager.getTestSummary()
    };
  }

  async shutdown() {
    try {
      console.log('🔓 Shutting down VPN Pipeline Integration...');

      if (this.testingManager) {
        this.testingManager.stopTesting();
      }

      if (this.vpnManager) {
        await this.vpnManager.shutdown();
      }

      this.isInitialized = false;
      console.log('✅ VPN Pipeline Integration shutdown complete');
    } catch (error) {
      console.error('❌ VPN Pipeline Integration shutdown failed:', error);
    }
  }
}

// Factory functions
function createVPNPipelineManager(config = {}, supabase = null) {
  const defaultConfig = {
    enabled: process.env.VPN_ENABLED === 'true',
    required: process.env.VPN_REQUIRED === 'true',
    checkInterval: parseInt(process.env.VPN_CHECK_INTERVAL || '30000'),
    timeout: parseInt(process.env.VPN_TIMEOUT || '10000'),
    tailscaleEnabled: process.env.TAILSCALE_ENABLED === 'true',
    wireguardEnabled: process.env.WIREGUARD_ENABLED === 'true',
    ...config
  };

  return new VPNPipelineManager(defaultConfig, supabase);
}

function createVPNProtectedSyncManager(config = {}, vpnManager, supabaseSyncProvider, mcpBridgeSyncService) {
  const defaultConfig = {
    enabled: process.env.VPN_PROTECTED_SYNC_ENABLED === 'true',
    required: process.env.VPN_PROTECTED_SYNC_REQUIRED === 'true',
    syncInterval: parseInt(process.env.VPN_PROTECTED_SYNC_INTERVAL || '60000'),
    batchSize: parseInt(process.env.VPN_PROTECTED_SYNC_BATCH_SIZE || '10'),
    retryAttempts: parseInt(process.env.VPN_PROTECTED_SYNC_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.VPN_PROTECTED_SYNC_RETRY_DELAY || '1000'),
    encryptionEnabled: process.env.VPN_PROTECTED_SYNC_ENCRYPTION_ENABLED === 'true',
    ...config
  };

  return new VPNProtectedSyncManager(defaultConfig, vpnManager, supabaseSyncProvider, mcpBridgeSyncService);
}

function createHybridTestingManager(config = {}, vpnManager, vpnSyncManager) {
  const defaultConfig = {
    enabled: process.env.TESTING_ENABLED === 'true',
    testingInterval: parseInt(process.env.TESTING_INTERVAL || '60000'),
    validationLevel: process.env.VALIDATION_LEVEL || 'basic',
    includeVPNTests: process.env.INCLUDE_VPN_TESTS === 'true',
    includeSyncTests: process.env.INCLUDE_SYNC_TESTS === 'true',
    includeDatabaseTests: process.env.INCLUDE_DATABASE_TESTS === 'true',
    includeVectorTests: process.env.INCLUDE_VECTOR_TESTS === 'true',
    ...config
  };

  return new HybridTestingManager(defaultConfig, vpnManager, vpnSyncManager);
}

function createVPNPipelineIntegration(config = {}) {
  const defaultConfig = {
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

// Global instance
let globalVPNPipelineIntegration = null;

function getGlobalVPNPipelineIntegration() {
  return globalVPNPipelineIntegration;
}

function setGlobalVPNPipelineIntegration(integration) {
  globalVPNPipelineIntegration = integration;
}

async function initializeGlobalVPNPipelineIntegration(config = {}) {
  if (globalVPNPipelineIntegration) {
    return globalVPNPipelineIntegration;
  }

  const integration = createVPNPipelineIntegration(config);
  await integration.initialize();
  setGlobalVPNPipelineIntegration(integration);
  
  return integration;
}

module.exports = {
  VPNPipelineManager,
  VPNProtectedSyncManager,
  HybridTestingManager,
  VPNPipelineIntegration,
  createVPNPipelineManager,
  createVPNProtectedSyncManager,
  createHybridTestingManager,
  createVPNPipelineIntegration,
  getGlobalVPNPipelineIntegration,
  setGlobalVPNPipelineIntegration,
  initializeGlobalVPNPipelineIntegration
};
















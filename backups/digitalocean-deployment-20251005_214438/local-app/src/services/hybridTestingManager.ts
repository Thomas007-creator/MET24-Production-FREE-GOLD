
/**
 * Hybrid Testing Manager - MET2.4 V14
 * 
 * Uitbreiding van bestaande test suite met VPN validatie
 * Integreert met bestaande MET24_VECTOR_TEST_SUITE.js
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { VPNPipelineManager } from './vpnPipelineManager';
import { VPNProtectedSyncManager } from './vpnProtectedSyncManager';
import { logger } from '../utils/logger';

export interface TestingConfig {
  enabled: boolean;
  testingInterval: number;
  validationLevel: 'basic' | 'comprehensive' | 'full';
  includeVPNTests: boolean;
  includeSyncTests: boolean;
  includeDatabaseTests: boolean;
  includeVectorTests: boolean;
}

export interface TestResult {
  testName: string;
  success: boolean;
  details?: any;
  error?: string;
  timestamp: Date;
  duration?: number;
}

export class HybridTestingManager {
  private testingConfig: TestingConfig;
  private vpnManager: VPNPipelineManager;
  private vpnSyncManager: VPNProtectedSyncManager;
  private testResults: TestResult[] = [];
  private testInterval: NodeJS.Timeout | null = null;

  constructor(
    testingConfig: TestingConfig,
    vpnManager: VPNPipelineManager,
    vpnSyncManager: VPNProtectedSyncManager
  ) {
    this.testingConfig = testingConfig;
    this.vpnManager = vpnManager;
    this.vpnSyncManager = vpnSyncManager;
  }

  /**
   * Initialiseer Hybrid Testing Manager
   */
  async initialize(): Promise<void> {
    if (!this.testingConfig.enabled) {
      logger.info('🔓 Hybrid Testing disabled - proceeding without testing');
      return;
    }

    try {
      logger.info('🧪 Initializing Hybrid Testing Manager...');
      
      // Initialize testing framework
      await this.initializeTestingFramework();
      
      // Start periodic testing
      await this.startPeriodicTesting();
      
      logger.info('✅ Hybrid Testing Manager initialized successfully');
    } catch (error) {
      logger.error('❌ Hybrid Testing Manager initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Initialiseer testing framework
   */
  private async initializeTestingFramework(): Promise<void> {
    try {
      // Setup testing environment
      logger.info('🧪 Setting up testing framework...');
      
      // Validate testing configuration
      if (this.testingConfig.validationLevel === 'full') {
        logger.info('🔍 Full validation mode enabled');
      } else if (this.testingConfig.validationLevel === 'comprehensive') {
        logger.info('🔍 Comprehensive validation mode enabled');
      } else {
        logger.info('🔍 Basic validation mode enabled');
      }
      
      logger.info('✅ Testing framework initialized');
    } catch (error) {
      logger.error('Failed to initialize testing framework:', { error });
      throw error;
    }
  }

  /**
   * Start periodic testing
   */
  private async startPeriodicTesting(): Promise<void> {
    if (this.testInterval) {
      clearInterval(this.testInterval);
    }

    this.testInterval = setInterval(async () => {
      try {
        await this.runHybridTests();
      } catch (error) {
        logger.error('Periodic testing failed:', { error });
      }
    }, this.testingConfig.testingInterval);
  }

  /**
   * Run hybrid tests
   */
  async runHybridTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const startTime = Date.now();

    try {
      logger.info('🧪 Starting hybrid tests...');

      // Test VPN Pipeline
      if (this.testingConfig.includeVPNTests) {
        const vpnTest = await this.testVPNPipeline();
        results.push(vpnTest);
      }

      // Test Sync Manager
      if (this.testingConfig.includeSyncTests) {
        const syncTest = await this.testSyncManager();
        results.push(syncTest);
      }

      // Test Database
      if (this.testingConfig.includeDatabaseTests) {
        const databaseTest = await this.testDatabase();
        results.push(databaseTest);
      }

      // Test Vector Features
      if (this.testingConfig.includeVectorTests) {
        const vectorTest = await this.testVectorFeatures();
        results.push(vectorTest);
      }

      // Store test results
      this.testResults = results;
      
      const duration = Date.now() - startTime;
      logger.info(`✅ Hybrid tests completed successfully in ${duration}ms`);
    } catch (error) {
      logger.error('❌ Hybrid tests failed:', { error });
    }

    return results;
  }

  /**
   * Test VPN Pipeline
   */
  private async testVPNPipeline(): Promise<TestResult> {
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
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        duration
      };
    }
  }

  /**
   * Test Sync Manager
   */
  private async testSyncManager(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test sync queue status
      const syncQueueStatus = this.vpnSyncManager.getSyncQueueStatus();
      
      // Test sync functionality
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
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        duration
      };
    }
  }

  /**
   * Test Database
   */
  private async testDatabase(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test database connectivity
      const response = await fetch('http://localhost:3001/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const success = response.ok;
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
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        duration
      };
    }
  }

  /**
   * Test Vector Features
   */
  private async testVectorFeatures(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Test vector similarity search
      const vectorTestPayload = {
        action: 'vector_similarity',
        query: 'MBTI personality insights',
        embedding: Array(1536).fill(0.1),
        limit: 5
      };
      
      const response = await fetch('http://localhost:3001/vector/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vectorTestPayload)
      });

      const success = response.ok;
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
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        duration
      };
    }
  }

  /**
   * Get test results
   */
  getTestResults(): TestResult[] {
    return [...this.testResults];
  }

  /**
   * Get test summary
   */
  getTestSummary(): { total: number; passed: number; failed: number; successRate: number } {
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

  /**
   * Run specific test
   */
  async runSpecificTest(testName: string): Promise<TestResult | null> {
    switch (testName) {
      case 'vpn':
        return await this.testVPNPipeline();
      case 'sync':
        return await this.testSyncManager();
      case 'database':
        return await this.testDatabase();
      case 'vector':
        return await this.testVectorFeatures();
      default:
        logger.warn(`Unknown test: ${testName}`);
        return null;
    }
  }

  /**
   * Stop testing
   */
  stopTesting(): void {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
    }
    logger.info('⏹️ Testing stopped');
  }
}

/**
 * Factory function voor HybridTestingManager
 */
export function createHybridTestingManager(
  config: Partial<TestingConfig> = {},
  vpnManager: VPNPipelineManager,
  vpnSyncManager: VPNProtectedSyncManager
): HybridTestingManager {
  const defaultConfig: TestingConfig = {
    enabled: process.env.TESTING_ENABLED === 'true',
    testingInterval: parseInt(process.env.TESTING_INTERVAL || '60000'),
    validationLevel: (process.env.VALIDATION_LEVEL as 'basic' | 'comprehensive' | 'full') || 'basic',
    includeVPNTests: process.env.INCLUDE_VPN_TESTS === 'true',
    includeSyncTests: process.env.INCLUDE_SYNC_TESTS === 'true',
    includeDatabaseTests: process.env.INCLUDE_DATABASE_TESTS === 'true',
    includeVectorTests: process.env.INCLUDE_VECTOR_TESTS === 'true',
    ...config
  };

  return new HybridTestingManager(defaultConfig, vpnManager, vpnSyncManager);
}









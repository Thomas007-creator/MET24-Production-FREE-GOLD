/**
 * VPN Pipeline Integration - Development App (localhost:3002)
 * 
 * Development app specifieke VPN Pipeline integratie
 * Handelt VPN status monitoring en sync voor development
 * 
 * @version 14.0.0
 * @author Thomas
 */

const express = require('express');
const { initializeGlobalVPNPipelineIntegration } = require('../services/vpnPipelineIntegration');

class DevelopmentVPNPipelineIntegration {
  constructor() {
    this.app = express();
    this.vpnPipelineIntegration = null;
    this.isInitialized = false;
    this.port = 3002;
  }

  /**
   * Initialiseer Development VPN Pipeline Integration
   */
  async initialize() {
    try {
      console.log('🔐 Initializing Development VPN Pipeline Integration...');

      // Initialize VPN Pipeline Integration
      this.vpnPipelineIntegration = await initializeGlobalVPNPipelineIntegration({
        enabled: true,
        required: true,
        syncEnabled: true,
        testingEnabled: true
      });

      // Setup middleware
      this.setupMiddleware();

      // Setup routes
      this.setupRoutes();

      // Setup periodic monitoring
      this.setupPeriodicMonitoring();

      this.isInitialized = true;
      console.log('✅ Development VPN Pipeline Integration initialized');
    } catch (error) {
      console.error('❌ Development VPN Pipeline Integration initialization failed:', error);
      throw error;
    }
  }

  /**
   * Setup middleware
   */
  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    // VPN validation middleware
    this.app.use('/api/development', this.validateVPNForDevelopment.bind(this));
  }

  /**
   * Setup routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'Development VPN Pipeline Integration',
        timestamp: new Date().toISOString(),
        vpnInitialized: this.isInitialized
      });
    });

    // VPN status for development
    this.app.get('/api/development/vpn-status', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const vpnManager = this.vpnPipelineIntegration.getVPNManager();
        const vpnStatus = vpnManager.getVPNStatus();
        
        res.json({
          success: true,
          data: vpnStatus,
          service: 'Development App',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Development VPN status error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Development sync status
    this.app.get('/api/development/sync-status', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const vpnSyncManager = this.vpnPipelineIntegration.getVPNSyncManager();
        const syncStatus = vpnSyncManager.getSyncQueueStatus();
        
        res.json({
          success: true,
          data: syncStatus,
          service: 'Development App',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Development sync status error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Development testing status
    this.app.get('/api/development/testing-status', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const testingManager = this.vpnPipelineIntegration.getTestingManager();
        const testResults = testingManager.getTestResults();
        const testSummary = testingManager.getTestSummary();
        
        res.json({
          success: true,
          data: {
            results: testResults,
            summary: testSummary
          },
          service: 'Development App',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Development testing status error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Force sync for development
    this.app.post('/api/development/force-sync', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const vpnSyncManager = this.vpnPipelineIntegration.getVPNSyncManager();
        await vpnSyncManager.forceSyncAll();
        
        res.json({
          success: true,
          message: 'Development sync completed',
          service: 'Development App',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Development force sync error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Run tests for development
    this.app.post('/api/development/run-tests', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const testingManager = this.vpnPipelineIntegration.getTestingManager();
        const testResults = await testingManager.runHybridTests();
        
        res.json({
          success: true,
          data: testResults,
          service: 'Development App',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Development run tests error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Development dashboard
    this.app.get('/api/development/dashboard', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const vpnManager = this.vpnPipelineIntegration.getVPNManager();
        const vpnSyncManager = this.vpnPipelineIntegration.getVPNSyncManager();
        const testingManager = this.vpnPipelineIntegration.getTestingManager();

        const vpnStatus = vpnManager.getVPNStatus();
        const syncStatus = vpnSyncManager.getSyncQueueStatus();
        const testResults = testingManager.getTestResults();
        const testSummary = testingManager.getTestSummary();

        res.json({
          success: true,
          data: {
            vpn: vpnStatus,
            sync: syncStatus,
            testing: {
              results: testResults,
              summary: testSummary
            }
          },
          service: 'Development App',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Development dashboard error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Validate VPN for development operations
   */
  async validateVPNForDevelopment(req, res, next) {
    try {
      if (!this.vpnPipelineIntegration) {
        return res.status(503).json({
          success: false,
          error: 'VPN Pipeline not initialized'
        });
      }

      const vpnManager = this.vpnPipelineIntegration.getVPNManager();
      const vpnStatus = vpnManager.getVPNStatus();
      
      // For development, we're more lenient with VPN requirements
      if (!vpnStatus.isConnected) {
        console.warn('⚠️ Development operation without VPN connection');
        // Continue but log warning
      }
      
      // Add VPN status to request
      req.vpnStatus = vpnStatus;
      next();
    } catch (error) {
      console.error('Development VPN validation error:', error);
      res.status(500).json({
        success: false,
        error: 'VPN validation failed'
      });
    }
  }

  /**
   * Setup periodic monitoring
   */
  setupPeriodicMonitoring() {
    // Monitor VPN status every 30 seconds
    setInterval(async () => {
      try {
        if (this.vpnPipelineIntegration) {
          const vpnManager = this.vpnPipelineIntegration.getVPNManager();
          const vpnStatus = vpnManager.getVPNStatus();
          
          if (!vpnStatus.isConnected) {
            console.warn('⚠️ Development App: VPN connection lost');
          }
        }
      } catch (error) {
        console.error('Development VPN monitoring error:', error);
      }
    }, 30000);

    // Monitor sync status every 60 seconds
    setInterval(async () => {
      try {
        if (this.vpnPipelineIntegration) {
          const vpnSyncManager = this.vpnPipelineIntegration.getVPNSyncManager();
          const syncStatus = vpnSyncManager.getSyncQueueStatus();
          
          if (syncStatus.queueLength > 10) {
            console.warn(`⚠️ Development App: Sync queue has ${syncStatus.queueLength} items`);
          }
        }
      } catch (error) {
        console.error('Development sync monitoring error:', error);
      }
    }, 60000);
  }

  /**
   * Start development server
   */
  async start() {
    try {
      await this.initialize();
      
      this.app.listen(this.port, () => {
        console.log(`🚀 Development VPN Pipeline Integration running on port ${this.port}`);
        console.log(`📊 Dashboard: http://localhost:${this.port}/api/development/dashboard`);
        console.log(`🔐 VPN Status: http://localhost:${this.port}/api/development/vpn-status`);
        console.log(`🔄 Sync Status: http://localhost:${this.port}/api/development/sync-status`);
        console.log(`🧪 Testing Status: http://localhost:${this.port}/api/development/testing-status`);
      });
    } catch (error) {
      console.error('❌ Failed to start Development VPN Pipeline Integration:', error);
      throw error;
    }
  }

  /**
   * Stop development server
   */
  async stop() {
    try {
      if (this.vpnPipelineIntegration) {
        await this.vpnPipelineIntegration.shutdown();
      }
      console.log('🔓 Development VPN Pipeline Integration stopped');
    } catch (error) {
      console.error('❌ Failed to stop Development VPN Pipeline Integration:', error);
    }
  }
}

// Export for use in other modules
module.exports = DevelopmentVPNPipelineIntegration;

// Start server if run directly
if (require.main === module) {
  const developmentVPNPipeline = new DevelopmentVPNPipelineIntegration();
  developmentVPNPipeline.start().catch(console.error);
}
















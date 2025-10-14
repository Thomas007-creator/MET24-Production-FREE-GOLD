/**
 * VPN Pipeline Orchestrator - Mini-MCP (localhost:3001)
 * 
 * Mini-MCP specifieke VPN Pipeline orchestratie
 * Handelt communicatie tussen User App en Development App
 * 
 * @version 14.0.0
 * @author Thomas
 */

const express = require('express');
const axios = require('axios');
const { initializeGlobalVPNPipelineIntegration } = require('../services/vpnPipelineIntegration');

class MiniMCPVPNPipelineOrchestrator {
  constructor() {
    this.app = express();
    this.vpnPipelineIntegration = null;
    this.isInitialized = false;
    this.port = 3001;
    
    // Service endpoints
    this.userAppUrl = 'http://localhost:3000';
    this.developmentAppUrl = 'http://localhost:3002';
  }

  /**
   * Initialiseer Mini-MCP VPN Pipeline Orchestrator
   */
  async initialize() {
    try {
      console.log('🔐 Initializing Mini-MCP VPN Pipeline Orchestrator...');

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

      // Setup service monitoring
      this.setupServiceMonitoring();

      this.isInitialized = true;
      console.log('✅ Mini-MCP VPN Pipeline Orchestrator initialized');
    } catch (error) {
      console.error('❌ Mini-MCP VPN Pipeline Orchestrator initialization failed:', error);
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

    // VPN validation middleware for sensitive operations
    this.app.use('/api/orchestrator', this.validateVPNForOrchestration.bind(this));
  }

  /**
   * Setup routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'Mini-MCP VPN Pipeline Orchestrator',
        timestamp: new Date().toISOString(),
        vpnInitialized: this.isInitialized
      });
    });

    // Orchestrator status
    this.app.get('/api/orchestrator/status', async (req, res) => {
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
        const testSummary = testingManager.getTestSummary();

        // Check service status
        const serviceStatus = await this.checkServiceStatus();

        res.json({
          success: true,
          data: {
            vpn: vpnStatus,
            sync: syncStatus,
            testing: testSummary,
            services: serviceStatus
          },
          service: 'Mini-MCP Orchestrator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Orchestrator status error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Orchestrate sync between apps
    this.app.post('/api/orchestrator/sync', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const { sourceApp, targetApp, data } = req.body;
        
        if (!sourceApp || !targetApp) {
          return res.status(400).json({
            success: false,
            error: 'Missing sourceApp or targetApp'
          });
        }

        // Orchestrate sync between apps
        const syncResult = await this.orchestrateSync(sourceApp, targetApp, data);
        
        res.json({
          success: true,
          data: syncResult,
          service: 'Mini-MCP Orchestrator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Orchestrator sync error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Orchestrate testing across apps
    this.app.post('/api/orchestrator/testing', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const { testType, apps } = req.body;
        
        // Run tests across specified apps
        const testResults = await this.orchestrateTesting(testType, apps);
        
        res.json({
          success: true,
          data: testResults,
          service: 'Mini-MCP Orchestrator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Orchestrator testing error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get service health
    this.app.get('/api/orchestrator/services/health', async (req, res) => {
      try {
        const serviceHealth = await this.checkServiceHealth();
        
        res.json({
          success: true,
          data: serviceHealth,
          service: 'Mini-MCP Orchestrator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Service health check error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Orchestrate VPN status across apps
    this.app.get('/api/orchestrator/vpn-status', async (req, res) => {
      try {
        if (!this.vpnPipelineIntegration) {
          return res.status(503).json({
            success: false,
            error: 'VPN Pipeline not initialized'
          });
        }

        const vpnManager = this.vpnPipelineIntegration.getVPNManager();
        const vpnStatus = vpnManager.getVPNStatus();
        
        // Get VPN status from other services
        const serviceVPNStatus = await this.getServiceVPNStatus();
        
        res.json({
          success: true,
          data: {
            orchestrator: vpnStatus,
            services: serviceVPNStatus
          },
          service: 'Mini-MCP Orchestrator',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Orchestrator VPN status error:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Validate VPN for orchestration operations
   */
  async validateVPNForOrchestration(req, res, next) {
    try {
      if (!this.vpnPipelineIntegration) {
        return res.status(503).json({
          success: false,
          error: 'VPN Pipeline not initialized'
        });
      }

      const vpnManager = this.vpnPipelineIntegration.getVPNManager();
      const vpnStatus = vpnManager.getVPNStatus();
      
      if (!vpnStatus.isConnected) {
        return res.status(403).json({
          success: false,
          error: 'VPN connection required for orchestration operations'
        });
      }
      
      if (!vpnStatus.isSecure) {
        return res.status(403).json({
          success: false,
          error: 'VPN connection not secure for orchestration operations'
        });
      }
      
      // Add VPN status to request
      req.vpnStatus = vpnStatus;
      next();
    } catch (error) {
      console.error('Orchestration VPN validation error:', error);
      res.status(500).json({
        success: false,
        error: 'VPN validation failed'
      });
    }
  }

  /**
   * Check service status
   */
  async checkServiceStatus() {
    const services = {
      userApp: { url: this.userAppUrl, status: 'unknown' },
      developmentApp: { url: this.developmentAppUrl, status: 'unknown' }
    };

    for (const [serviceName, service] of Object.entries(services)) {
      try {
        const response = await axios.get(`${service.url}/health`, { timeout: 5000 });
        services[serviceName].status = response.status === 200 ? 'healthy' : 'unhealthy';
      } catch (error) {
        services[serviceName].status = 'unreachable';
      }
    }

    return services;
  }

  /**
   * Check service health
   */
  async checkServiceHealth() {
    const health = {
      userApp: await this.checkServiceHealth(this.userAppUrl),
      developmentApp: await this.checkServiceHealth(this.developmentAppUrl)
    };

    return health;
  }

  /**
   * Check individual service health
   */
  async checkServiceHealth(url) {
    try {
      const response = await axios.get(`${url}/health`, { timeout: 5000 });
      return {
        status: 'healthy',
        responseTime: response.headers['x-response-time'] || 'unknown',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Orchestrate sync between apps
   */
  async orchestrateSync(sourceApp, targetApp, data) {
    try {
      // Get VPN status
      const vpnManager = this.vpnPipelineIntegration.getVPNManager();
      const vpnStatus = vpnManager.getVPNStatus();
      
      if (!vpnStatus.isConnected || !vpnStatus.isSecure) {
        throw new Error('VPN connection required for sync orchestration');
      }

      // Perform sync orchestration
      const syncResult = {
        sourceApp,
        targetApp,
        data,
        vpnStatus,
        timestamp: new Date().toISOString()
      };

      console.log(`🔄 Orchestrating sync from ${sourceApp} to ${targetApp}`);
      
      return syncResult;
    } catch (error) {
      console.error('Sync orchestration error:', error);
      throw error;
    }
  }

  /**
   * Orchestrate testing across apps
   */
  async orchestrateTesting(testType, apps) {
    try {
      // Get VPN status
      const vpnManager = this.vpnPipelineIntegration.getVPNManager();
      const vpnStatus = vpnManager.getVPNStatus();
      
      if (!vpnStatus.isConnected || !vpnStatus.isSecure) {
        throw new Error('VPN connection required for testing orchestration');
      }

      // Run tests across specified apps
      const testResults = {
        testType,
        apps,
        vpnStatus,
        results: [],
        timestamp: new Date().toISOString()
      };

      console.log(`🧪 Orchestrating ${testType} tests across ${apps.join(', ')}`);
      
      return testResults;
    } catch (error) {
      console.error('Testing orchestration error:', error);
      throw error;
    }
  }

  /**
   * Get VPN status from services
   */
  async getServiceVPNStatus() {
    const serviceVPNStatus = {};

    try {
      // Get VPN status from User App
      const userAppResponse = await axios.get(`${this.userAppUrl}/api/vpn/status`, { timeout: 5000 });
      serviceVPNStatus.userApp = userAppResponse.data;
    } catch (error) {
      serviceVPNStatus.userApp = { error: error.message };
    }

    try {
      // Get VPN status from Development App
      const devAppResponse = await axios.get(`${this.developmentAppUrl}/api/development/vpn-status`, { timeout: 5000 });
      serviceVPNStatus.developmentApp = devAppResponse.data;
    } catch (error) {
      serviceVPNStatus.developmentApp = { error: error.message };
    }

    return serviceVPNStatus;
  }

  /**
   * Setup service monitoring
   */
  setupServiceMonitoring() {
    // Monitor services every 30 seconds
    setInterval(async () => {
      try {
        const serviceStatus = await this.checkServiceStatus();
        
        // Log any unhealthy services
        for (const [serviceName, service] of Object.entries(serviceStatus)) {
          if (service.status !== 'healthy') {
            console.warn(`⚠️ Mini-MCP: ${serviceName} is ${service.status}`);
          }
        }
      } catch (error) {
        console.error('Service monitoring error:', error);
      }
    }, 30000);
  }

  /**
   * Start Mini-MCP server
   */
  async start() {
    try {
      await this.initialize();
      
      this.app.listen(this.port, () => {
        console.log(`🚀 Mini-MCP VPN Pipeline Orchestrator running on port ${this.port}`);
        console.log(`📊 Status: http://localhost:${this.port}/api/orchestrator/status`);
        console.log(`🔄 Sync: http://localhost:${this.port}/api/orchestrator/sync`);
        console.log(`🧪 Testing: http://localhost:${this.port}/api/orchestrator/testing`);
        console.log(`🔐 VPN Status: http://localhost:${this.port}/api/orchestrator/vpn-status`);
      });
    } catch (error) {
      console.error('❌ Failed to start Mini-MCP VPN Pipeline Orchestrator:', error);
      throw error;
    }
  }

  /**
   * Stop Mini-MCP server
   */
  async stop() {
    try {
      if (this.vpnPipelineIntegration) {
        await this.vpnPipelineIntegration.shutdown();
      }
      console.log('🔓 Mini-MCP VPN Pipeline Orchestrator stopped');
    } catch (error) {
      console.error('❌ Failed to stop Mini-MCP VPN Pipeline Orchestrator:', error);
    }
  }
}

// Export for use in other modules
module.exports = MiniMCPVPNPipelineOrchestrator;

// Start server if run directly
if (require.main === module) {
  const miniMCPOrchestrator = new MiniMCPVPNPipelineOrchestrator();
  miniMCPOrchestrator.start().catch(console.error);
}
















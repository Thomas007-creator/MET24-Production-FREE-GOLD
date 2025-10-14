/**
 * VPN Routes - MET2.4 V14
 * 
 * Express routes voor VPN Pipeline API endpoints
 * Handelt VPN status, sync, en testing requests af
 * 
 * @version 14.0.0
 * @author Thomas
 */

const express = require('express');
const router = express.Router();

// VPN Pipeline services (will be imported when available)
let vpnPipelineIntegration = null;

// Initialize VPN Pipeline Integration
const initializeVPNPipeline = async () => {
  try {
    const { initializeGlobalVPNPipelineIntegration } = require('../services/vpnPipelineIntegration');
    vpnPipelineIntegration = await initializeGlobalVPNPipelineIntegration({
      enabled: true,
      required: true,
      syncEnabled: true,
      testingEnabled: true
    });
    console.log('✅ VPN Pipeline Integration initialized in routes');
  } catch (error) {
    console.error('❌ Failed to initialize VPN Pipeline Integration:', error);
  }
};

// Initialize on startup
initializeVPNPipeline();

/**
 * GET /api/vpn/status
 * Get VPN status
 */
router.get('/status', async (req, res) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const vpnManager = vpnPipelineIntegration.getVPNManager();
    const vpnStatus = vpnManager.getVPNStatus();
    
    res.json({
      success: true,
      data: vpnStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('VPN status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vpn/status
 * Update VPN status
 */
router.post('/status', async (req, res) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const { checkTailscale, checkWireguard } = req.body;
    
    const vpnManager = vpnPipelineIntegration.getVPNManager();
    
    // Force VPN status check
    if (checkTailscale || checkWireguard) {
      // This would trigger a manual VPN check
      // Implementation depends on your VPN setup
    }
    
    const vpnStatus = vpnManager.getVPNStatus();
    
    res.json({
      success: true,
      data: vpnStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('VPN status update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vpn/tailscale-status
 * Get Tailscale status
 */
router.get('/tailscale-status', async (req, res) => {
  try {
    // Check if Tailscale container is running
    const { exec } = require('child_process');
    
    exec('docker exec met24-tailscale tailscale status --json', (error, stdout, stderr) => {
      if (error) {
        return res.json({
          success: false,
          connected: false,
          error: error.message
        });
      }
      
      try {
        const status = JSON.parse(stdout);
        res.json({
          success: true,
          connected: status.Self.Online || false,
          secure: status.Self.Online || false,
          quality: status.Self.Online ? 'excellent' : 'unknown',
          ipAddress: status.Self.TailscaleIPs?.[0] || null,
          serverLocation: 'Tailscale'
        });
      } catch (parseError) {
        res.json({
          success: false,
          connected: false,
          error: 'Failed to parse Tailscale status'
        });
      }
    });
  } catch (error) {
    console.error('Tailscale status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vpn/wireguard-status
 * Get WireGuard status
 */
router.get('/wireguard-status', async (req, res) => {
  try {
    // Check if WireGuard container is running
    const { exec } = require('child_process');
    
    exec('docker exec met24-vpn wg show', (error, stdout, stderr) => {
      if (error) {
        return res.json({
          success: false,
          connected: false,
          error: error.message
        });
      }
      
      const isConnected = stdout.includes('interface: wg0') && stdout.includes('public key:');
      
      res.json({
        success: true,
        connected: isConnected,
        secure: isConnected,
        quality: isConnected ? 'good' : 'unknown',
        ipAddress: null,
        serverLocation: 'WireGuard'
      });
    });
  } catch (error) {
    console.error('WireGuard status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vpn/sync-status
 * Get VPN sync status
 */
router.get('/sync-status', async (req, res) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const vpnSyncManager = vpnPipelineIntegration.getVPNSyncManager();
    const syncStatus = vpnSyncManager.getSyncQueueStatus();
    
    res.json({
      success: true,
      data: syncStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('VPN sync status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vpn/sync/force
 * Force VPN protected sync
 */
router.post('/sync/force', async (req, res) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const vpnSyncManager = vpnPipelineIntegration.getVPNSyncManager();
    await vpnSyncManager.forceSyncAll();
    
    res.json({
      success: true,
      message: 'VPN protected sync completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('VPN sync force error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vpn/testing-status
 * Get VPN testing status
 */
router.get('/testing-status', async (req, res) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const testingManager = vpnPipelineIntegration.getTestingManager();
    const testResults = testingManager.getTestResults();
    const testSummary = testingManager.getTestSummary();
    
    res.json({
      success: true,
      data: {
        results: testResults,
        summary: testSummary
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('VPN testing status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vpn/testing/run
 * Run VPN tests
 */
router.post('/testing/run', async (req, res) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const testingManager = vpnPipelineIntegration.getTestingManager();
    const testResults = await testingManager.runHybridTests();
    
    res.json({
      success: true,
      data: testResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('VPN testing run error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/vpn/containers/:containerName/status
 * Get container status
 */
router.get('/containers/:containerName/status', async (req, res) => {
  try {
    const { containerName } = req.params;
    const { exec } = require('child_process');
    
    exec(`docker ps --filter name=${containerName} --format "{{.Status}}"`, (error, stdout, stderr) => {
      if (error) {
        return res.json({
          success: false,
          running: false,
          error: error.message
        });
      }
      
      const isRunning = stdout.includes('Up');
      
      res.json({
        success: true,
        running: isRunning,
        status: stdout.trim()
      });
    });
  } catch (error) {
    console.error('Container status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
















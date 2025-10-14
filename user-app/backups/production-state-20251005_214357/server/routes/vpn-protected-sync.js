/**
 * VPN Protected Sync Routes - MET2.4 V14
 * 
 * Express routes voor VPN beschermde sync operaties
 * Handelt sync requests af met VPN validatie
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
    console.log('✅ VPN Pipeline Integration initialized in sync routes');
  } catch (error) {
    console.error('❌ Failed to initialize VPN Pipeline Integration:', error);
  }
};

// Initialize on startup
initializeVPNPipeline();

/**
 * Middleware to validate VPN connection
 */
const validateVPNConnection = async (req, res, next) => {
  try {
    if (!vpnPipelineIntegration) {
      return res.status(503).json({
        success: false,
        error: 'VPN Pipeline not initialized'
      });
    }

    const vpnManager = vpnPipelineIntegration.getVPNManager();
    const vpnStatus = vpnManager.getVPNStatus();
    
    if (!vpnStatus.isConnected) {
      return res.status(403).json({
        success: false,
        error: 'VPN connection required for sync operations'
      });
    }
    
    if (!vpnStatus.isSecure) {
      return res.status(403).json({
        success: false,
        error: 'VPN connection not secure'
      });
    }
    
    // Add VPN status to request
    req.vpnStatus = vpnStatus;
    next();
  } catch (error) {
    console.error('VPN validation error:', error);
    res.status(500).json({
      success: false,
      error: 'VPN validation failed'
    });
  }
};

/**
 * POST /api/sync/vpn-protected
 * VPN protected sync endpoint
 */
router.post('/vpn-protected', validateVPNConnection, async (req, res) => {
  try {
    const { action, table, data } = req.body;
    
    if (!action || !table) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: action, table'
      });
    }
    
    const vpnSyncManager = vpnPipelineIntegration.getVPNSyncManager();
    
    switch (action) {
      case 'vpn_protected_sync':
        // Add item to sync queue
        const syncItem = {
          id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          table,
          data: data || {},
          timestamp: Date.now()
        };
        
        await vpnSyncManager.addToSyncQueue(syncItem);
        
        res.json({
          success: true,
          message: 'Item added to VPN protected sync queue',
          itemId: syncItem.id,
          vpnStatus: req.vpnStatus
        });
        break;
        
      case 'force_sync':
        await vpnSyncManager.forceSyncAll();
        
        res.json({
          success: true,
          message: 'VPN protected sync completed',
          vpnStatus: req.vpnStatus
        });
        break;
        
      default:
        res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }
  } catch (error) {
    console.error('VPN protected sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sync/queue-status
 * Get sync queue status
 */
router.get('/queue-status', validateVPNConnection, async (req, res) => {
  try {
    const vpnSyncManager = vpnPipelineIntegration.getVPNSyncManager();
    const syncStatus = vpnSyncManager.getSyncQueueStatus();
    
    res.json({
      success: true,
      data: syncStatus,
      vpnStatus: req.vpnStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sync queue status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sync/clear-queue
 * Clear sync queue
 */
router.post('/clear-queue', validateVPNConnection, async (req, res) => {
  try {
    const vpnSyncManager = vpnPipelineIntegration.getVPNSyncManager();
    vpnSyncManager.clearSyncQueue();
    
    res.json({
      success: true,
      message: 'Sync queue cleared',
      vpnStatus: req.vpnStatus
    });
  } catch (error) {
    console.error('Clear sync queue error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/sync/encrypt-data
 * Encrypt data for sync
 */
router.post('/encrypt-data', validateVPNConnection, async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Missing data field'
      });
    }
    
    // TODO: Implement encryption using existing encryption utilities
    // For now, return data as-is
    const encryptedData = data;
    
    res.json({
      success: true,
      data: encryptedData,
      vpnStatus: req.vpnStatus
    });
  } catch (error) {
    console.error('Encrypt data error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/sync/history
 * Get sync history
 */
router.get('/history', validateVPNConnection, async (req, res) => {
  try {
    // TODO: Implement sync history tracking
    const history = [];
    
    res.json({
      success: true,
      data: history,
      vpnStatus: req.vpnStatus
    });
  } catch (error) {
    console.error('Sync history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
















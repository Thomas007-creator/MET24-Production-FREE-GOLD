
/**
 * MET2.4 V14 MCP-Bridge Server
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - Express server voor MCP-Bridge
 * - Health check endpoints
 * - Sync API endpoints
 * - CORS support
 * - Error handling
 * - Docker compatible
 * 
 * @author Thomas
 * @version 2.4.2
 */

import express from 'express';
import cors from 'cors';
import { logger } from '../utils/logger';
import { 
  createHealthEndpoint, 
  createSimpleHealthEndpoint,
  getHealthStatus 
} from './health';
import { syncDataToBridge, syncAllV14Tables } from '../services/syncService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoints
app.get('/health', createHealthEndpoint());
app.get('/healthz', createSimpleHealthEndpoint()); // Docker health check

// Sync endpoints
app.post('/sync', async (req, res) => {
  try {
    const { data, table, mbtiContext, batchInfo } = req.body;
    
    if (!data || !table) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: data, table'
      });
    }
    
    logger.info(`Sync request received for table: ${table}`, {
      recordCount: data.length,
      mbtiContext: mbtiContext?.type,
      batchInfo
    });
    
    // Process sync data (here you would implement your sync logic)
    const result = {
      success: true,
      syncedCount: data.length,
      table,
      timestamp: new Date().toISOString(),
      mbtiContext: mbtiContext?.type || 'UNKNOWN'
    };
    
    res.json(result);
    
  } catch (error) {
    logger.error('Sync endpoint error:', undefined, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Batch sync endpoint
app.post('/sync/batch', async (req, res) => {
  try {
    const { tables, options } = req.body;
    
    if (!tables || !Array.isArray(tables)) {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid tables array'
      });
    }
    
    logger.info(`Batch sync request received for ${tables.length} tables`);
    
    const results = [];
    for (const table of tables) {
      try {
        const result = await syncDataToBridge(table, options);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          syncedCount: 0,
          table,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    res.json({
      success: true,
      results,
      totalTables: tables.length,
      successfulTables: results.filter(r => r.success).length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Batch sync endpoint error:', undefined, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Sync all V14 tables endpoint
app.post('/sync/all', async (req, res) => {
  try {
    const { options } = req.body;
    
    logger.info('Sync all V14 tables request received');
    
    const results = await syncAllV14Tables(options);
    
    const totalSynced = results.reduce((sum, result) => sum + result.syncedCount, 0);
    const successfulTables = results.filter(result => result.success).length;
    
    res.json({
      success: true,
      results,
      totalTables: results.length,
      successfulTables,
      totalSynced,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Sync all endpoint error:', undefined, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Status endpoint
app.get('/status', async (req, res) => {
  try {
    const health = await getHealthStatus();
    res.json(health);
  } catch (error) {
    logger.error('Status endpoint error:', undefined, error);
    res.status(500).json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'MET2.4 V14 MCP-Bridge',
    version: '2.4.2',
    description: 'MCP-Bridge service for MET2.4 V14 sync operations',
    endpoints: {
      health: '/health',
      healthz: '/healthz',
      sync: '/sync',
      batchSync: '/sync/batch',
      syncAll: '/sync/all',
      status: '/status',
      info: '/api/info'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  logger.error('Unhandled error:', { error });
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 MCP-Bridge server started on port ${PORT}`);
    logger.info(`📊 Health check: http://localhost:${PORT}/health`);
    logger.info(`🔧 API info: http://localhost:${PORT}/api/info`);
  });
}

export default app;

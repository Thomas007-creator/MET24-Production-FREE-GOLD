/**
 * MET2.4 V14 Health Check API
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - Health check endpoint voor MCP-Bridge
 * - Database connectivity check
 * - Service status monitoring
 * - Performance metrics
 * - Docker health check compatible
 * 
 * @author Thomas
 * @version 2.4.2
 */

import database from '../database/v14/database';
import { logger } from '../utils/logger';

// Health check response interface
interface HealthResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  services: {
    database: {
      status: 'connected' | 'disconnected' | 'error';
      responseTime?: number;
      error?: string;
    };
    sync: {
      status: 'active' | 'inactive' | 'error';
      lastSync?: string;
      error?: string;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
  };
  uptime: number;
  environment: string;
}

// Start time for uptime calculation
const startTime = Date.now();

/**
 * Check database connectivity
 */
async function checkDatabaseHealth(): Promise<{
  status: 'connected' | 'disconnected' | 'error';
  responseTime?: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    // Test database connection with a simple query
    const users = await database.get('users').query().fetchCount();
    const responseTime = Date.now() - startTime;
    
    logger.info(`Database health check: ${users} users found, ${responseTime}ms response time`);
    
    return {
      status: 'connected',
      responseTime
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
    
    logger.error('Database health check failed:', undefined, error);
    
    return {
      status: 'error',
      responseTime,
      error: errorMessage
    };
  }
}

/**
 * Check sync service status
 */
async function checkSyncHealth(): Promise<{
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  error?: string;
}> {
  try {
    // Check if sync service is available
    const syncStatus = await database.get('sync_status').query().fetch();
    
    if (syncStatus.length > 0) {
      const lastSync = (syncStatus[0] as any).lastSyncAt;
      return {
        status: 'active',
        lastSync: lastSync || 'Never'
      };
    } else {
      return {
        status: 'inactive',
        lastSync: 'Never'
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
    
    logger.error('Sync health check failed:', undefined, error);
    
    return {
      status: 'error',
      error: errorMessage
    };
  }
}

/**
 * Get memory usage information
 */
function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memoryUsage = process.memoryUsage();
    const used = Math.round(memoryUsage.heapUsed / 1024 / 1024); // MB
    const total = Math.round(memoryUsage.heapTotal / 1024 / 1024); // MB
    const percentage = Math.round((used / total) * 100);
    
    return { used, total, percentage };
  }
  
  // Fallback for browser environment
  return { used: 0, total: 0, percentage: 0 };
}

/**
 * Main health check function
 */
export async function getHealthStatus(): Promise<HealthResponse> {
  const timestamp = new Date().toISOString();
  const uptime = Date.now() - startTime;
  const environment = process.env.NODE_ENV || 'development';
  
  try {
    // Run health checks in parallel
    const [databaseHealth, syncHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkSyncHealth()
    ]);
    
    const memoryUsage = getMemoryUsage();
    
    // Determine overall status
    let overallStatus: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    
    if (databaseHealth.status === 'error' || syncHealth.status === 'error') {
      overallStatus = 'unhealthy';
    } else if (databaseHealth.status === 'disconnected' || syncHealth.status === 'inactive') {
      overallStatus = 'degraded';
    }
    
    const healthResponse: HealthResponse = {
      status: overallStatus,
      timestamp,
      version: '2.4.2',
      services: {
        database: databaseHealth,
        sync: syncHealth,
        memory: memoryUsage
      },
      uptime,
      environment
    };
    
    logger.info(`Health check completed: ${overallStatus}`, {
      database: databaseHealth.status,
      sync: syncHealth.status,
      memory: `${memoryUsage.percentage}%`
    });
    
    return healthResponse;
    
  } catch (error) {
    logger.error('Health check failed:', undefined, error);
    
    return {
      status: 'unhealthy',
      timestamp,
      version: '2.4.2',
      services: {
        database: { status: 'error', error: 'Health check failed' },
        sync: { status: 'error', error: 'Health check failed' },
        memory: { used: 0, total: 0, percentage: 0 }
      },
      uptime,
      environment
    };
  }
}

/**
 * Simple health check for Docker (returns 200 or 500)
 */
export async function getSimpleHealthCheck(): Promise<{ status: number; message: string }> {
  try {
    const health = await getHealthStatus();
    
    if (health.status === 'healthy') {
      return { status: 200, message: 'OK' };
    } else if (health.status === 'degraded') {
      return { status: 200, message: 'DEGRADED' };
    } else {
      return { status: 500, message: 'UNHEALTHY' };
    }
  } catch (error) {
    logger.error('Simple health check failed:', undefined, error);
    return { status: 500, message: 'ERROR' };
  }
}

/**
 * Health check endpoint handler for Express/Node.js
 */
export function createHealthEndpoint() {
  return async (req: any, res: any) => {
    try {
      const health = await getHealthStatus();
      
      // Set appropriate HTTP status code
      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'degraded' ? 200 : 500;
      
      res.status(statusCode).json(health);
    } catch (error) {
      logger.error('Health endpoint error:', undefined, error);
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  };
}

/**
 * Simple health endpoint for Docker health checks
 */
export function createSimpleHealthEndpoint() {
  return async (req: any, res: any) => {
    try {
      const { status, message } = await getSimpleHealthCheck();
      res.status(status).send(message);
    } catch (error) {
      logger.error('Simple health endpoint error:', undefined, error);
      res.status(500).send('ERROR');
    }
  };
}

// Export types
export type { HealthResponse };

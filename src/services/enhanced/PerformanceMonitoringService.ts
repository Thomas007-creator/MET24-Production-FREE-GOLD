/**
 * 📊 Performance Monitoring Integration Service
 * Integrates Claude's performance enhancements with Mary's coaching improvements
 * 
 * @version 1.0.0
 * @author Claude (CTO) + Mary (BMAD Master)
 */

import { logger } from "../../utils/logger";
import ClaudePerformanceService from "./ClaudePerformanceService";
import MaryCoachingImprovement from "./MaryCoachingImprovement";

// Monitoring configuration
interface MonitoringConfig {
  performanceThresholds: {
    maxResponseTime: number;
    minCacheHitRate: number;
    maxMemoryUsage: number;
  };
  alerting: {
    enabled: boolean;
    channels: string[];
  };
  optimization: {
    autoOptimization: boolean;
    adaptiveThresholds: boolean;
  };
}

interface SystemHealth {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  components: {
    coaching: 'healthy' | 'degraded' | 'failing';
    caching: 'healthy' | 'degraded' | 'failing';
    database: 'healthy' | 'degraded' | 'failing';
  };
  metrics: {
    averageResponseTime: number;
    cacheHitRate: number;
    memoryUsage: number;
    activeUsers: number;
  };
  recommendations: string[];
}

export class PerformanceMonitoringService {
  private claudeService: ClaudePerformanceService;
  private maryService: MaryCoachingImprovement;
  private config: MonitoringConfig;
  
  // Real-time monitoring state
  private isMonitoring: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private alertHistory: Array<{ timestamp: number, level: string, message: string }> = [];

  constructor(database: any) {
    this.claudeService = new ClaudePerformanceService(database);
    this.maryService = new MaryCoachingImprovement(database);
    
    this.config = {
      performanceThresholds: {
        maxResponseTime: 100, // 100ms
        minCacheHitRate: 0.80, // 80%
        maxMemoryUsage: 100 * 1024 * 1024 // 100MB
      },
      alerting: {
        enabled: true,
        channels: ['console', 'logger']
      },
      optimization: {
        autoOptimization: true,
        adaptiveThresholds: true
      }
    };
  }

  /**
   * 🚀 Start Integrated Performance Monitoring
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      logger.warn('⚠️ Performance monitoring already running');
      return;
    }

    this.isMonitoring = true;
    logger.info('📊 Starting integrated performance monitoring...');

    // Monitor every 2 minutes
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 2 * 60 * 1000);

    // Initial health check
    await this.performHealthCheck();
  }

  /**
   * 🛑 Stop Performance Monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    logger.info('📊 Performance monitoring stopped');
  }

  /**
   * 🏥 Comprehensive System Health Check
   */
  async performHealthCheck(): Promise<SystemHealth> {
    try {
      // Get performance stats from Claude's service
      const performanceStats = await this.claudeService.getPerformanceStats();
      
      // Analyze Mary's coaching improvements status
      const coachingAnalysis = await this.maryService.analyzeCurrentCoachingSystem();
      
      // Calculate overall health
      const health = this.calculateSystemHealth(performanceStats, coachingAnalysis);
      
      // Check thresholds and trigger alerts if needed
      await this.checkThresholdsAndAlert(health);
      
      // Auto-optimization if enabled
      if (this.config.optimization.autoOptimization) {
        await this.performAutoOptimization(health);
      }

      logger.debug('📊 System health check completed', {
        overall: health.overall,
        cacheHitRate: health.metrics.cacheHitRate,
        responseTime: health.metrics.averageResponseTime
      });

      return health;

    } catch (error) {
      logger.error('❌ Health check failed', { error });
      return this.getEmergencyHealthStatus();
    }
  }

  /**
   * 🧠 Calculate System Health Score
   */
  private calculateSystemHealth(performanceStats: any, coachingAnalysis: any): SystemHealth {
    const { cacheStats, performanceMetrics } = performanceStats;
    
    // Evaluate cache performance
    const cacheHealth = cacheStats.hitRate > 0.8 ? 'healthy' : 
                       cacheStats.hitRate > 0.6 ? 'degraded' : 'failing';
    
    // Evaluate response times
    const responseHealth = performanceMetrics.averageResponseTime < 100 ? 'healthy' :
                          performanceMetrics.averageResponseTime < 250 ? 'degraded' : 'failing';
    
    // Evaluate coaching system
    const coachingHealth = coachingAnalysis.implementationPriority === 'high' ? 'healthy' : 'degraded';
    
    // Overall system health
    const healthScores = [cacheHealth, responseHealth, coachingHealth];
    const healthyCount = healthScores.filter(h => h === 'healthy').length;
    const degradedCount = healthScores.filter(h => h === 'degraded').length;
    
    let overall: SystemHealth['overall'];
    if (healthyCount === 3) overall = 'excellent';
    else if (healthyCount >= 2) overall = 'good';
    else if (degradedCount >= 2) overall = 'warning';
    else overall = 'critical';

    // Generate recommendations
    const recommendations = this.generateRecommendations(cacheStats, performanceMetrics, coachingAnalysis);

    return {
      overall,
      components: {
        coaching: coachingHealth as any,
        caching: cacheHealth as any,
        database: responseHealth as any
      },
      metrics: {
        averageResponseTime: performanceMetrics.averageResponseTime,
        cacheHitRate: cacheStats.hitRate,
        memoryUsage: cacheStats.memoryUsage,
        activeUsers: 0 // Would be calculated from actual user sessions
      },
      recommendations
    };
  }

  /**
   * 🔔 Threshold Monitoring and Alerting
   */
  private async checkThresholdsAndAlert(health: SystemHealth): Promise<void> {
    const alerts: string[] = [];

    // Check response time threshold
    if (health.metrics.averageResponseTime > this.config.performanceThresholds.maxResponseTime) {
      alerts.push(`High response time: ${health.metrics.averageResponseTime.toFixed(2)}ms (threshold: ${this.config.performanceThresholds.maxResponseTime}ms)`);
    }

    // Check cache hit rate threshold
    if (health.metrics.cacheHitRate < this.config.performanceThresholds.minCacheHitRate) {
      alerts.push(`Low cache hit rate: ${(health.metrics.cacheHitRate * 100).toFixed(1)}% (threshold: ${(this.config.performanceThresholds.minCacheHitRate * 100)}%)`);
    }

    // Check memory usage threshold
    if (health.metrics.memoryUsage > this.config.performanceThresholds.maxMemoryUsage) {
      alerts.push(`High memory usage: ${(health.metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB (threshold: ${(this.config.performanceThresholds.maxMemoryUsage / 1024 / 1024)}MB)`);
    }

    // Send alerts if any
    if (alerts.length > 0 && this.config.alerting.enabled) {
      await this.sendAlerts(alerts, health.overall);
    }
  }

  /**
   * 🚨 Alert System
   */
  private async sendAlerts(alerts: string[], severity: string): Promise<void> {
    const alertMessage = `🚨 Performance Alert [${severity.toUpperCase()}]: ${alerts.join(', ')}`;
    
    // Store in alert history
    this.alertHistory.push({
      timestamp: Date.now(),
      level: severity,
      message: alertMessage
    });

    // Send to configured channels
    if (this.config.alerting.channels.includes('console')) {
      console.warn(alertMessage);
    }
    
    if (this.config.alerting.channels.includes('logger')) {
      logger.warn(alertMessage, { alerts, severity });
    }

    // Clean old alerts (keep last 100)
    if (this.alertHistory.length > 100) {
      this.alertHistory = this.alertHistory.slice(-100);
    }
  }

  /**
   * ⚡ Auto-Optimization System
   */
  private async performAutoOptimization(health: SystemHealth): Promise<void> {
    if (health.overall === 'excellent') return;

    logger.info('🔧 Performing auto-optimization...', { healthStatus: health.overall });

    // Optimize based on specific issues
    if (health.metrics.cacheHitRate < 0.7) {
      await this.optimizeCaching();
    }

    if (health.metrics.averageResponseTime > 150) {
      await this.optimizeResponseTimes();
    }

    if (health.components.coaching === 'degraded') {
      await this.optimizeCoachingSystem();
    }
  }

  private async optimizeCaching(): Promise<void> {
    logger.info('🎯 Optimizing caching strategy...');
    // Implementation would include cache warming, TTL adjustments, etc.
  }

  private async optimizeResponseTimes(): Promise<void> {
    logger.info('⚡ Optimizing response times...');
    // Implementation would include query optimization, prefetching, etc.
  }

  private async optimizeCoachingSystem(): Promise<void> {
    logger.info('🧙‍♀️ Optimizing coaching system...');
    // Implementation would trigger Mary's optimization routines
    await this.maryService.implementCoachingImprovements();
  }

  /**
   * 💡 Generate Performance Recommendations
   */
  private generateRecommendations(cacheStats: any, performanceMetrics: any, coachingAnalysis: any): string[] {
    const recommendations: string[] = [];

    if (cacheStats.hitRate < 0.8) {
      recommendations.push('Consider increasing cache TTL or warming frequently accessed data');
    }

    if (performanceMetrics.averageResponseTime > 100) {
      recommendations.push('Optimize database queries and consider adding more caching layers');
    }

    if (cacheStats.memoryUsage > 50 * 1024 * 1024) { // 50MB
      recommendations.push('Monitor memory usage - consider reducing cache size limits');
    }

    if (coachingAnalysis.identifiedGaps.length > 3) {
      recommendations.push('Prioritize implementing remaining coaching improvements for better user experience');
    }

    if (performanceMetrics.successRate < 0.95) {
      recommendations.push('Investigate and resolve errors causing operation failures');
    }

    return recommendations;
  }

  /**
   * 🆘 Emergency Health Status
   */
  private getEmergencyHealthStatus(): SystemHealth {
    return {
      overall: 'critical',
      components: {
        coaching: 'failing',
        caching: 'failing',
        database: 'failing'
      },
      metrics: {
        averageResponseTime: 999,
        cacheHitRate: 0,
        memoryUsage: 0,
        activeUsers: 0
      },
      recommendations: ['System experiencing critical issues - immediate attention required']
    };
  }

  /**
   * 📈 Get Performance Dashboard Data
   */
  async getPerformanceDashboard(): Promise<{
    health: SystemHealth,
    recentAlerts: any,
    trends: any
  }> {
    const health = await this.performHealthCheck();
    const recentAlerts = this.alertHistory.slice(-10); // Last 10 alerts

    return {
      health,
      recentAlerts,
      trends: {
        // Would include trend analysis over time
        improving: health.overall === 'excellent' || health.overall === 'good',
        stable: health.overall === 'good',
        degrading: health.overall === 'warning' || health.overall === 'critical'
      }
    };
  }
}

export default PerformanceMonitoringService;
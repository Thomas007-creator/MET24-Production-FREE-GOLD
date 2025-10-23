/**
 * Token Usage Monitor for MET24 PWA
 * Monitors AI provider token usage and triggers notifications
 */

interface TokenUsage {
  provider: string;
  model: string;
  tokensUsed: number;
  tokenLimit: number;
  percentage: number;
  lastUpdated: Date;
}

interface TokenThreshold {
  provider: string;
  warningThreshold: number; // 80%
  criticalThreshold: number; // 95%
  lastNotificationSent: Date | null;
}

class TokenMonitor {
  private usage: Map<string, TokenUsage> = new Map();
  private thresholds: Map<string, TokenThreshold> = new Map();
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeThresholds();
  }

  /**
   * Initialize default thresholds for AI providers
   */
  private initializeThresholds(): void {
    const providers = [
      { provider: 'grok-3', warningThreshold: 80, criticalThreshold: 95 },
      { provider: 'gpt-4', warningThreshold: 80, criticalThreshold: 95 },
      { provider: 'claude-4', warningThreshold: 80, criticalThreshold: 95 },
      { provider: 'anthropic', warningThreshold: 80, criticalThreshold: 95 }
    ];

    providers.forEach(({ provider, warningThreshold, criticalThreshold }) => {
      this.thresholds.set(provider, {
        provider,
        warningThreshold,
        criticalThreshold,
        lastNotificationSent: null
      });
    });
  }

  /**
   * Start monitoring token usage
   */
  startMonitoring(intervalMs: number = 300000): void { // 5 minutes default
    if (this.isMonitoring) {
      console.log('⚠️ Token monitoring already active');
      return;
    }

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.checkTokenUsage();
    }, intervalMs);

    console.log('🔍 Token usage monitoring started');
  }

  /**
   * Stop monitoring token usage
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('⏹️ Token usage monitoring stopped');
  }

  /**
   * Update token usage for a provider
   */
  updateTokenUsage(
    provider: string, 
    model: string, 
    tokensUsed: number, 
    tokenLimit: number
  ): void {
    const percentage = (tokensUsed / tokenLimit) * 100;
    
    const usage: TokenUsage = {
      provider,
      model,
      tokensUsed,
      tokenLimit,
      percentage,
      lastUpdated: new Date()
    };

    this.usage.set(provider, usage);
    console.log(`📊 Token usage updated for ${provider}: ${percentage.toFixed(1)}%`);

    // Check if threshold is reached
    this.checkThreshold(provider, percentage);
  }

  /**
   * Check if token usage threshold is reached
   */
  private checkThreshold(provider: string, percentage: number): void {
    const threshold = this.thresholds.get(provider);
    if (!threshold) return;

    const now = new Date();
    const lastNotification = threshold.lastNotificationSent;
    
    // Don't send notification if sent within last 24 hours
    if (lastNotification && (now.getTime() - lastNotification.getTime()) < 24 * 60 * 60 * 1000) {
      return;
    }

    let shouldNotify = false;
    let notificationType: 'warning' | 'critical' = 'warning';

    if (percentage >= threshold.criticalThreshold) {
      shouldNotify = true;
      notificationType = 'critical';
    } else if (percentage >= threshold.warningThreshold) {
      shouldNotify = true;
      notificationType = 'warning';
    }

    if (shouldNotify) {
      this.sendTokenLimitNotification(provider, percentage, notificationType);
      threshold.lastNotificationSent = now;
    }
  }

  /**
   * Send token limit notification
   */
  private async sendTokenLimitNotification(
    provider: string, 
    percentage: number, 
    type: 'warning' | 'critical'
  ): Promise<void> {
    try {
      const isGrok3 = provider === 'grok-3';
      const isCritical = type === 'critical';
      
      let title = '';
      let body = '';
      let actions = [];

      if (isGrok3) {
        if (isCritical) {
          title = '🚨 Grok-3 Tokens Bijna Op!';
          body = `Je hebt ${percentage.toFixed(0)}% van je gratis Grok-3 tokens gebruikt. Voeg je eigen API key toe om door te gaan!`;
          actions = [
            { action: 'setup-api', title: 'API Key Toevoegen' },
            { action: 'learn-more', title: 'Meer Info' }
          ];
        } else {
          title = '⚠️ Grok-3 Tokens Waarschuwing';
          body = `Je hebt ${percentage.toFixed(0)}% van je gratis Grok-3 tokens gebruikt. Overweeg je eigen API key toe te voegen.`;
          actions = [
            { action: 'setup-api', title: 'API Key Toevoegen' },
            { action: 'dismiss', title: 'Later' }
          ];
        }
      } else {
        title = `⚠️ ${provider.toUpperCase()} Token Waarschuwing`;
        body = `Je hebt ${percentage.toFixed(0)}% van je ${provider} tokens gebruikt.`;
        actions = [
          { action: 'view-usage', title: 'Gebruik Bekijken' },
          { action: 'dismiss', title: 'Later' }
        ];
      }

      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          body,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: `token-limit-${provider}`,
          data: {
            type: 'token_limit',
            provider,
            percentage,
            severity: type,
            timestamp: Date.now()
          },
          actions,
          requireInteraction: isCritical,
          silent: false
        })
      });

      if (response.ok) {
        console.log(`✅ Token limit notification sent for ${provider} (${type})`);
      } else {
        console.error(`❌ Failed to send token limit notification for ${provider}`);
      }

    } catch (error) {
      console.error('❌ Error sending token limit notification:', error);
    }
  }

  /**
   * Check current token usage (called by monitoring interval)
   */
  private async checkTokenUsage(): Promise<void> {
    try {
      // This would typically call your AI provider APIs to get current usage
      // For now, we'll simulate checking stored usage data
      
      for (const [provider, usage] of Array.from(this.usage.entries())) {
        // In a real implementation, you'd fetch current usage from the provider
        // For demo purposes, we'll use the stored usage
        this.checkThreshold(provider, usage.percentage);
      }

    } catch (error) {
      console.error('❌ Error checking token usage:', error);
    }
  }

  /**
   * Get current token usage for a provider
   */
  getTokenUsage(provider: string): TokenUsage | null {
    return this.usage.get(provider) || null;
  }

  /**
   * Get all token usage
   */
  getAllTokenUsage(): TokenUsage[] {
    return Array.from(this.usage.values());
  }

  /**
   * Get token usage summary
   */
  getTokenUsageSummary(): {
    totalProviders: number;
    providersNearLimit: number;
    providersAtLimit: number;
    summary: Array<{
      provider: string;
      percentage: number;
      status: 'ok' | 'warning' | 'critical';
    }>;
  } {
    const allUsage = this.getAllTokenUsage();
    const summary = allUsage.map(usage => {
      const threshold = this.thresholds.get(usage.provider);
      let status: 'ok' | 'warning' | 'critical' = 'ok';
      
      if (threshold) {
        if (usage.percentage >= threshold.criticalThreshold) {
          status = 'critical';
        } else if (usage.percentage >= threshold.warningThreshold) {
          status = 'warning';
        }
      }

      return {
        provider: usage.provider,
        percentage: usage.percentage,
        status
      };
    });

    return {
      totalProviders: allUsage.length,
      providersNearLimit: summary.filter(s => s.status === 'warning').length,
      providersAtLimit: summary.filter(s => s.status === 'critical').length,
      summary
    };
  }

  /**
   * Simulate token usage for testing
   */
  simulateTokenUsage(provider: string, percentage: number): void {
    const tokenLimit = 100000; // Example limit
    const tokensUsed = (percentage / 100) * tokenLimit;
    
    this.updateTokenUsage(provider, 'grok-3', tokensUsed, tokenLimit);
  }

  /**
   * Check if monitoring is active
   */
  isActive(): boolean {
    return this.isMonitoring;
  }
}

// Export singleton instance
export const tokenMonitor = new TokenMonitor();

// Export class for testing
export { TokenMonitor };
export type { TokenUsage, TokenThreshold };

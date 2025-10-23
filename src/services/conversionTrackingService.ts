/**
 * Conversion Tracking Service
 * Tracks user behavior and upgrade interest during beta and production
 */

export interface ConversionEvent {
  eventType: string;
  timestamp: number;
  version: string;
  userTier: 'beta' | 'free' | 'gold' | 'platinum';
  metadata: Record<string, any>;
}

export interface ConversionMetrics {
  totalSessions: number;
  upgradeAttempts: number;
  upgradesCompleted: number;
  conversionRate: number;
  featureUsage: Record<string, number>;
  planInterest: Record<string, number>;
}

class ConversionTrackingService {
  private events: ConversionEvent[] = [];
  private readonly STORAGE_KEY = 'met24_conversion_events';
  private readonly MAX_EVENTS = 1000; // Prevent localStorage overflow

  constructor() {
    this.loadEvents();
  }

  /**
   * Track when user starts a session
   */
  trackSessionStarted(userTier: string = 'beta'): void {
    this.addEvent({
      eventType: 'session_started',
      timestamp: Date.now(),
      version: process.env.REACT_APP_BUILD_VERSION || '0.0.1-beta.1',
      userTier: userTier as any,
      metadata: {
        userAgent: navigator.userAgent,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        referrer: document.referrer,
      },
    });
  }

  /**
   * Track when user uses a specific feature
   */
  trackFeatureUsage(featureName: string, data: Record<string, any> = {}): void {
    this.addEvent({
      eventType: 'feature_used',
      timestamp: Date.now(),
      version: process.env.REACT_APP_BUILD_VERSION || '0.0.1-beta.1',
      userTier: 'beta',
      metadata: {
        featureName,
        ...data,
      },
    });
  }

  /**
   * Track when user clicks upgrade button
   */
  trackUpgradeInitiated(tier: string, sourceFeature: string): void {
    this.addEvent({
      eventType: 'upgrade_initiated',
      timestamp: Date.now(),
      version: process.env.REACT_APP_BUILD_VERSION || '0.0.1-beta.1',
      userTier: 'beta',
      metadata: {
        targetTier: tier,
        sourceFeature,
        upgradePath: 'free_to_gold', // or 'gold_to_platinum'
      },
    });
  }

  /**
   * Track when user completes payment (production only)
   */
  trackUpgradeCompleted(tier: string, paymentMethod: string = 'stripe'): void {
    this.addEvent({
      eventType: 'upgrade_completed',
      timestamp: Date.now(),
      version: process.env.REACT_APP_BUILD_VERSION || '1.0.0',
      userTier: tier as any,
      metadata: {
        paymentMethod,
        upgradePath: tier === 'gold' ? 'free_to_gold' : 'gold_to_platinum',
      },
    });
  }

  /**
   * Track when user ends session
   */
  trackSessionEnded(): void {
    this.addEvent({
      eventType: 'session_ended',
      timestamp: Date.now(),
      version: process.env.REACT_APP_BUILD_VERSION || '0.0.1-beta.1',
      userTier: 'beta',
      metadata: {
        sessionDuration: this.calculateSessionDuration(),
      },
    });
  }

  /**
   * Get conversion metrics
   */
  getConversionMetrics(): ConversionMetrics {
    const sessions = this.events.filter(e => e.eventType === 'session_started').length;
    const upgradeAttempts = this.events.filter(e => e.eventType === 'upgrade_initiated').length;
    const upgradesCompleted = this.events.filter(e => e.eventType === 'upgrade_completed').length;
    
    const featureUsage: Record<string, number> = {};
    const planInterest: Record<string, number> = {};

    // Count feature usage
    this.events
      .filter(e => e.eventType === 'feature_used')
      .forEach(e => {
        const feature = e.metadata.featureName;
        featureUsage[feature] = (featureUsage[feature] || 0) + 1;
      });

    // Count plan interest
    this.events
      .filter(e => e.eventType === 'upgrade_initiated')
      .forEach(e => {
        const plan = e.metadata.targetTier;
        planInterest[plan] = (planInterest[plan] || 0) + 1;
      });

    return {
      totalSessions: sessions,
      upgradeAttempts,
      upgradesCompleted,
      conversionRate: sessions > 0 ? (upgradeAttempts / sessions) * 100 : 0,
      featureUsage,
      planInterest,
    };
  }

  /**
   * Get all stored events (for debugging)
   */
  getStoredEvents(): ConversionEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events (for testing)
   */
  clearEvents(): void {
    this.events = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Export events as JSON (for analysis)
   */
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  private addEvent(event: ConversionEvent): void {
    this.events.push(event);
    
    // Keep only recent events to prevent localStorage overflow
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }
    
    this.saveEvents();
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Conversion Tracking]', event);
    }
  }

  private loadEvents(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('[Conversion Tracking] Failed to load events:', error);
      this.events = [];
    }
  }

  private saveEvents(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.events));
    } catch (error) {
      console.warn('[Conversion Tracking] Failed to save events:', error);
    }
  }

  private calculateSessionDuration(): number {
    const sessionStart = this.events
      .filter(e => e.eventType === 'session_started')
      .pop()?.timestamp;
    
    if (sessionStart) {
      return Date.now() - sessionStart;
    }
    
    return 0;
  }
}

// Export singleton instance
export const conversionTracking = new ConversionTrackingService();

// Helper functions for easy usage
export const trackUpgradeInitiated = (tier: string, sourceFeature: string) => {
  conversionTracking.trackUpgradeInitiated(tier, sourceFeature);
};

export const trackUpgradeCompleted = (tier: string, paymentMethod?: string) => {
  conversionTracking.trackUpgradeCompleted(tier, paymentMethod);
};

export const trackFeatureUsage = (featureName: string, data?: Record<string, any>) => {
  conversionTracking.trackFeatureUsage(featureName, data);
};

export const getConversionMetrics = () => {
  return conversionTracking.getConversionMetrics();
};

export const getStoredEvents = () => {
  return conversionTracking.getStoredEvents();
};

export default conversionTracking;
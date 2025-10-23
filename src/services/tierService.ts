/**
 * Tier Service
 * Manages user tier and feature access
 */

import { hasFeature, UserTier, TIER_DESCRIPTIONS } from '../config/tierFeatures';
import { isBetaBuild } from '../config/buildConfig';

class TierService {
  private currentTier: UserTier = 'beta'; // Default to beta for testing

  constructor() {
    this.loadUserTier();
  }

  /**
   * Get current user tier
   */
  getCurrentTier(): UserTier {
    return this.currentTier;
  }

  /**
   * Set user tier (for testing or after payment)
   */
  setUserTier(tier: UserTier): void {
    this.currentTier = tier;
    this.saveUserTier();
  }

  /**
   * Check if user has access to a feature
   */
  hasFeatureAccess(feature: keyof import('../config/tierFeatures').TierFeatures): boolean {
    // In beta mode, all features are accessible
    if (isBetaBuild()) {
      return true;
    }

    return hasFeature(feature, this.currentTier);
  }

  /**
   * Check if user can upgrade to a specific tier
   */
  canUpgradeTo(targetTier: UserTier): boolean {
    const tierHierarchy: UserTier[] = ['free', 'gold', 'platinum'];
    const currentIndex = tierHierarchy.indexOf(this.currentTier);
    const targetIndex = tierHierarchy.indexOf(targetTier);
    
    return targetIndex > currentIndex;
  }

  /**
   * Get upgrade path for current user
   */
  getUpgradePath(): UserTier[] {
    const tierHierarchy: UserTier[] = ['free', 'gold', 'platinum'];
    const currentIndex = tierHierarchy.indexOf(this.currentTier);
    
    return tierHierarchy.slice(currentIndex + 1);
  }

  /**
   * Get tier description
   */
  getTierDescription(tier?: UserTier) {
    const targetTier = tier || this.currentTier;
    return TIER_DESCRIPTIONS[targetTier];
  }

  /**
   * Check if user is in beta mode
   */
  isBetaMode(): boolean {
    return isBetaBuild() || this.currentTier === 'beta';
  }

  /**
   * Get features available to current user
   */
  getAvailableFeatures(): string[] {
    const features: string[] = [];
    
    // Check each feature
    const allFeatures = [
      'journaling', 'mood_tracking', 'mbti_analysis', 'community_forum',
      'conversational_ai', 'sentiment_analysis', 'advanced_insights',
      'export_pdf', 'export_json', 'email_reports',
      'priority_support', 'ad_free', 'custom_themes',
      'ai_orchestration', 'custom_workflows', 'team_collaboration',
      'api_access', 'white_label', 'analytics_dashboard'
    ];

    allFeatures.forEach(feature => {
      if (this.hasFeatureAccess(feature as any)) {
        features.push(feature);
      }
    });

    return features;
  }

  /**
   * Get features that require upgrade
   */
  getLockedFeatures(): string[] {
    const allFeatures = [
      'conversational_ai', 'sentiment_analysis', 'advanced_insights',
      'export_pdf', 'export_json', 'email_reports',
      'priority_support', 'ad_free', 'custom_themes',
      'ai_orchestration', 'custom_workflows', 'team_collaboration',
      'api_access', 'white_label', 'analytics_dashboard'
    ];

    return allFeatures.filter(feature => !this.hasFeatureAccess(feature as any));
  }

  /**
   * Simulate upgrade (for testing)
   */
  simulateUpgrade(targetTier: UserTier): void {
    if (this.canUpgradeTo(targetTier)) {
      this.setUserTier(targetTier);
      console.log(`[Tier Service] Upgraded to ${targetTier}`);
    } else {
      console.warn(`[Tier Service] Cannot upgrade from ${this.currentTier} to ${targetTier}`);
    }
  }

  /**
   * Reset to free tier (for testing)
   */
  resetToFree(): void {
    this.setUserTier('free');
    console.log('[Tier Service] Reset to free tier');
  }

  private loadUserTier(): void {
    try {
      const stored = localStorage.getItem('met24_user_tier');
      if (stored) {
        this.currentTier = stored as UserTier;
      }
    } catch (error) {
      console.warn('[Tier Service] Failed to load user tier:', error);
      this.currentTier = 'beta';
    }
  }

  private saveUserTier(): void {
    try {
      localStorage.setItem('met24_user_tier', this.currentTier);
    } catch (error) {
      console.warn('[Tier Service] Failed to save user tier:', error);
    }
  }
}

// Export singleton instance
export const tierService = new TierService();

// Helper functions for easy usage
export const getCurrentTier = () => tierService.getCurrentTier();
export const hasFeatureAccess = (feature: string) => tierService.hasFeatureAccess(feature as any);
export const canUpgradeTo = (targetTier: UserTier) => tierService.canUpgradeTo(targetTier);
export const isBetaMode = () => tierService.isBetaMode();
export const getAvailableFeatures = () => tierService.getAvailableFeatures();
export const getLockedFeatures = () => tierService.getLockedFeatures();

export default tierService;
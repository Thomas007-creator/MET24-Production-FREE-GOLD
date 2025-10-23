/**
 * Build Configuration - Versioning & Feature Flags
 * Dynamically set based on build target (beta vs production)
 */

export type BuildEnvironment = 'beta' | 'production';

export interface BuildConfig {
  VERSION: string;
  BUILD_ENV: BuildEnvironment;
  TRACK_CONVERSIONS: boolean;
  ENABLE_DEBUG: boolean;
  ENABLE_DEV_CONSOLE: boolean;
  FEATURE_FLAGS: FeatureFlags;
}

export interface FeatureFlags {
  // Core features
  journaling: boolean;
  moodTracking: boolean;
  aiCoaching: boolean;
  challenges: boolean;
  wellnessTracking: boolean;
  
  // Gold tier features
  advancedAnalytics: boolean;
  therapistAccess: boolean;
  customPlans: boolean;
  
  // Platinum tier features
  enterpriseFeatures: boolean;
  regionalTherapists: boolean;
  customIntegrations: boolean;
}

// Beta Configuration - Accept 95-98% code quality, track conversions
const BETA_CONFIG: BuildConfig = {
  VERSION: '0.0.1-beta.1',
  BUILD_ENV: 'beta',
  TRACK_CONVERSIONS: true,
  ENABLE_DEBUG: true,
  ENABLE_DEV_CONSOLE: true,
  FEATURE_FLAGS: {
    // All core features enabled for beta testing
    journaling: true,
    moodTracking: true,
    aiCoaching: true,
    challenges: true,
    wellnessTracking: true,
    // Gold features - track adoption
    advancedAnalytics: true,
    therapistAccess: true,
    customPlans: true,
    // Platinum features - disabled in beta
    enterpriseFeatures: false,
    regionalTherapists: false,
    customIntegrations: false,
  },
};

// Production Configuration - 100% clean TypeScript, feature gating
const PRODUCTION_CONFIG: BuildConfig = {
  VERSION: '1.0.0',
  BUILD_ENV: 'production',
  TRACK_CONVERSIONS: true,
  ENABLE_DEBUG: false,
  ENABLE_DEV_CONSOLE: false,
  FEATURE_FLAGS: {
    // Free tier
    journaling: true,
    moodTracking: true,
    aiCoaching: false, // Gated to Gold
    challenges: true,
    wellnessTracking: false, // Gated to Gold
    // Gold tier
    advancedAnalytics: false, // Gated to Gold
    therapistAccess: false, // Gated to Gold
    customPlans: false, // Gated to Gold
    // Platinum tier
    enterpriseFeatures: false, // Gated to Platinum
    regionalTherapists: false, // Gated to Platinum
    customIntegrations: false, // Gated to Platinum
  },
};

/**
 * Get build configuration based on environment variable
 * Set via: npm run build:beta or npm run build:production
 */
function getBuildConfig(): BuildConfig {
  const buildTarget = process.env.REACT_APP_BUILD_TARGET || 'production';
  
  if (buildTarget === 'beta') {
    return BETA_CONFIG;
  }
  
  return PRODUCTION_CONFIG;
}

// Export active config
export const BUILD_CONFIG = getBuildConfig();

// Helper to check if feature is enabled
export const isFeatureEnabled = (featureName: keyof FeatureFlags): boolean => {
  return BUILD_CONFIG.FEATURE_FLAGS[featureName] ?? false;
};

// Helper to check if we're in beta
export const isBetaBuild = (): boolean => {
  return BUILD_CONFIG.BUILD_ENV === 'beta';
};

// Helper to check if conversion tracking is enabled
export const isConversionTrackingEnabled = (): boolean => {
  return BUILD_CONFIG.TRACK_CONVERSIONS;
};

export default BUILD_CONFIG;

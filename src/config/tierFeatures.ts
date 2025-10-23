/**
 * TIER_FEATURES.ts
 * Feature matrix for Free, Gold, and Platinum tiers
 * Single codebase, multiple feature sets per tier
 * 
 * Usage: 
 * import { hasFeature } from './tierFeatures';
 * if (hasFeature('conversational_ai', userTier)) { ... }
 */

export type UserTier = 'beta' | 'free' | 'gold' | 'platinum';

export interface TierFeatures {
  // Core journaling
  journaling: boolean;
  mood_tracking: boolean;
  mbti_analysis: boolean;
  community_forum: boolean;

  // AI features
  conversational_ai: boolean;
  sentiment_analysis: boolean;
  advanced_insights: boolean;

  // Export & integrations
  export_pdf: boolean;
  export_json: boolean;
  email_reports: boolean;

  // Support & admin
  priority_support: boolean;
  ad_free: boolean;
  custom_themes: boolean;

  // Advanced (Platinum only)
  ai_orchestration: boolean;        // Claude + GPT + Grok routing
  custom_workflows: boolean;        // Visual workflow builder
  team_collaboration: boolean;      // Multi-user teams
  api_access: boolean;              // REST API for developers
  white_label: boolean;             // Custom branding
  analytics_dashboard: boolean;     // Business intelligence
}

/**
 * TIER FEATURE MATRIX
 * 
 * BETA: All features visible (testing phase)
 * FREE: Core journaling, basic AI (no advanced features)
 * GOLD: All Free + Conversational AI + Advanced analytics
 * PLATINUM: Everything + Enterprise features
 */
export const TIER_FEATURES: Record<UserTier, TierFeatures> = {
  // 🧪 BETA TIER: All features visible for testing
  beta: {
    // Core
    journaling: true,
    mood_tracking: true,
    mbti_analysis: true,
    community_forum: true,
    // AI
    conversational_ai: true,
    sentiment_analysis: true,
    advanced_insights: true,
    // Export
    export_pdf: true,
    export_json: true,
    email_reports: true,
    // Support
    priority_support: true,
    ad_free: true,
    custom_themes: true,
    // Advanced
    ai_orchestration: true,
    custom_workflows: true,
    team_collaboration: true,
    api_access: true,
    white_label: true,
    analytics_dashboard: true,
  },

  // 💰 FREE TIER: Limited features (entry point)
  free: {
    // Core
    journaling: true,
    mood_tracking: true,
    mbti_analysis: true,
    community_forum: true,
    // AI: Limited
    conversational_ai: false,        // 👈 Upgrade to Gold
    sentiment_analysis: false,       // 👈 Upgrade to Gold
    advanced_insights: false,        // 👈 Upgrade to Gold
    // Export: None
    export_pdf: false,
    export_json: false,
    email_reports: false,
    // Support
    priority_support: false,
    ad_free: false,                  // 👈 Shows ads (revenue)
    custom_themes: false,
    // Advanced: None
    ai_orchestration: false,
    custom_workflows: false,
    team_collaboration: false,
    api_access: false,
    white_label: false,
    analytics_dashboard: false,
  },

  // ✨ GOLD TIER: Full feature set (most users)
  gold: {
    // Core
    journaling: true,
    mood_tracking: true,
    mbti_analysis: true,
    community_forum: true,
    // AI: Full
    conversational_ai: true,         // 👈 Premium AI coaching
    sentiment_analysis: true,        // 👈 Mood predictions
    advanced_insights: true,         // 👈 Personality insights
    // Export: Full
    export_pdf: true,                // 👈 Professional reports
    export_json: true,               // 👈 Data portability
    email_reports: true,             // 👈 Weekly summaries
    // Support
    priority_support: true,          // 👈 24h response time
    ad_free: true,                   // 👈 No ads
    custom_themes: true,             // 👈 UI customization
    // Advanced: None yet
    ai_orchestration: false,         // 👈 Upgrade to Platinum
    custom_workflows: false,         // 👈 Upgrade to Platinum
    team_collaboration: false,       // 👈 Upgrade to Platinum
    api_access: false,               // 👈 Upgrade to Platinum
    white_label: false,              // 👈 Upgrade to Platinum
    analytics_dashboard: false,      // 👈 Upgrade to Platinum
  },

  // 👑 PLATINUM TIER: Enterprise features (premium users)
  platinum: {
    // Core
    journaling: true,
    mood_tracking: true,
    mbti_analysis: true,
    community_forum: true,
    // AI: Advanced orchestration
    conversational_ai: true,
    sentiment_analysis: true,
    advanced_insights: true,
    // Export
    export_pdf: true,
    export_json: true,
    email_reports: true,
    // Support
    priority_support: true,
    ad_free: true,
    custom_themes: true,
    // Advanced: All enterprise features
    ai_orchestration: true,          // 👈 Multi-LLM routing
    custom_workflows: true,          // 👈 Visual workflow builder
    team_collaboration: true,        // 👈 Team management
    api_access: true,                // 👈 REST API
    white_label: true,               // 👈 Custom branding
    analytics_dashboard: true,       // 👈 Business BI
  },
};

/**
 * Check if a feature is available for a specific tier
 * @param feature Feature name (e.g., 'conversational_ai')
 * @param tier User tier (beta, free, gold, platinum)
 * @returns true if feature is available
 * 
 * Usage:
 * if (hasFeature('conversational_ai', userTier)) {
 *   return <ConversationalAI />;
 * }
 */
export function hasFeature(feature: keyof TierFeatures, tier: UserTier): boolean {
  return TIER_FEATURES[tier][feature];
}

/**
 * Get all available features for a tier
 * @param tier User tier
 * @returns Array of feature names
 */
export function getFeaturesForTier(tier: UserTier): (keyof TierFeatures)[] {
  return (Object.keys(TIER_FEATURES[tier]) as (keyof TierFeatures)[]).filter(
    (feature) => TIER_FEATURES[tier][feature]
  );
}

/**
 * Feature upgrade paths
 * What features unlock at each tier upgrade?
 */
export const FEATURE_UPGRADES = {
  // Free → Gold
  free_to_gold: [
    'conversational_ai',
    'sentiment_analysis',
    'advanced_insights',
    'export_pdf',
    'export_json',
    'email_reports',
    'priority_support',
    'ad_free',
    'custom_themes',
  ],

  // Gold → Platinum
  gold_to_platinum: [
    'ai_orchestration',
    'custom_workflows',
    'team_collaboration',
    'api_access',
    'white_label',
    'analytics_dashboard',
  ],
};

/**
 * Tier descriptions for UI
 */
export const TIER_DESCRIPTIONS = {
  free: {
    name: 'Free Edition',
    price: '$0/month',
    description: 'Core journaling and mood tracking. Perfect to get started.',
  },
  gold: {
    name: 'Gold Edition',
    price: '$4.99/month',
    description: 'Full AI coaching and unlimited features. Most popular.',
  },
  platinum: {
    name: 'Platinum Edition',
    price: '$19.99/month',
    description: 'Enterprise features, AI orchestration, and team collaboration.',
  },
  beta: {
    name: 'Beta Testing',
    price: 'Free',
    description: 'All features enabled for testing and feedback collection.',
  },
};

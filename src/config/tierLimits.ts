/**
 * TIER_LIMITS.ts
 * Usage quotas and limits per tier
 * 
 * FREE: Limited conversations, no export
 * GOLD: Unlimited usage
 * PLATINUM: Unlimited + team collaboration
 */

export type UserTier = 'beta' | 'free' | 'gold' | 'platinum';

export interface TierLimits {
  // Conversation limits
  conversations_per_month: number;  // -1 = unlimited
  messages_per_conversation: number;
  ai_requests_per_month: number;

  // Export limits
  exports_per_month: number;
  max_export_size_mb: number;

  // Team features
  team_members: number;
  projects: number;

  // API limits
  api_calls_per_month: number;
  api_rate_limit_per_hour: number;

  // Storage
  storage_gb: number;

  // Support
  support_channel: 'community' | 'email' | 'priority';  // Priority = 24h response
}

/**
 * USAGE LIMITS BY TIER
 */
export const TIER_LIMITS: Record<UserTier, TierLimits> = {
  // 🧪 BETA: Unlimited testing
  beta: {
    conversations_per_month: -1,     // Unlimited
    messages_per_conversation: -1,
    ai_requests_per_month: -1,
    exports_per_month: -1,
    max_export_size_mb: 1000,
    team_members: 100,
    projects: 100,
    api_calls_per_month: -1,
    api_rate_limit_per_hour: 10000,
    storage_gb: 100,
    support_channel: 'priority',
  },

  // 💰 FREE: Limited entry point
  free: {
    conversations_per_month: 5,      // 👈 MAX 5 CONVOS/MONTH
    messages_per_conversation: 10,
    ai_requests_per_month: 50,       // 👈 50 AI requests/month
    exports_per_month: 0,            // 👈 NO EXPORTS
    max_export_size_mb: 0,
    team_members: 1,                 // 👈 Solo only
    projects: 1,
    api_calls_per_month: 0,          // 👈 NO API
    api_rate_limit_per_hour: 0,
    storage_gb: 1,                   // 👈 1GB storage
    support_channel: 'community',    // 👈 Community forum only
  },

  // ✨ GOLD: Full access
  gold: {
    conversations_per_month: -1,     // UNLIMITED ✨
    messages_per_conversation: -1,
    ai_requests_per_month: -1,       // UNLIMITED ✨
    exports_per_month: -1,           // UNLIMITED ✨
    max_export_size_mb: 500,
    team_members: 1,                 // Solo (no teams in Gold)
    projects: -1,
    api_calls_per_month: 0,          // No API (Platinum feature)
    api_rate_limit_per_hour: 0,
    storage_gb: 20,                  // 👈 20GB storage
    support_channel: 'priority',     // 👈 24h email support
  },

  // 👑 PLATINUM: Enterprise limits
  platinum: {
    conversations_per_month: -1,     // UNLIMITED
    messages_per_conversation: -1,
    ai_requests_per_month: -1,
    exports_per_month: -1,
    max_export_size_mb: 1000,
    team_members: -1,                // UNLIMITED TEAMS ✨
    projects: -1,
    api_calls_per_month: 1000000,    // 1M API calls/month ✨
    api_rate_limit_per_hour: 10000,
    storage_gb: 500,
    support_channel: 'priority',
  },
};

/**
 * Check if user has reached a limit
 * @param limit Limit type
 * @param tier User tier
 * @param current Current usage
 * @returns true if limit reached
 */
export function hasReachedLimit(
  limit: keyof TierLimits,
  tier: UserTier,
  current: number
): boolean {
  const tierLimit = TIER_LIMITS[tier][limit] as number;
  
  // -1 = unlimited
  if (tierLimit === -1) return false;
  
  // Check if reached
  return current >= tierLimit;
}

/**
 * Get remaining quota
 * @param limit Limit type
 * @param tier User tier
 * @param current Current usage
 * @returns Remaining quota (-1 = unlimited)
 */
export function getRemainingQuota(
  limit: keyof TierLimits,
  tier: UserTier,
  current: number
): number {
  const tierLimit = TIER_LIMITS[tier][limit] as number;
  
  // -1 = unlimited
  if (tierLimit === -1) return -1;
  
  return Math.max(0, tierLimit - current);
}

/**
 * Tier comparison for UI
 */
export const TIER_COMPARISON = {
  title: 'Choose Your Plan',
  tiers: [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get started with core features',
      highlights: [
        '5 conversations/month',
        '50 AI requests/month',
        '1 GB storage',
        'Community support',
        'Basic MBTI analysis',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Gold',
      price: '$4.99',
      period: '/month',
      description: 'Unlimited AI coaching',
      highlights: [
        '✨ Unlimited conversations',
        '✨ Unlimited AI requests',
        '✨ Unlimited exports',
        '✨ Priority email support (24h)',
        '✨ Advanced mood predictions',
        '✨ Ad-free experience',
        '20 GB storage',
      ],
      cta: 'Upgrade to Gold',
      popular: true,  // Most popular tier
      savings: '50% off first month',
    },
    {
      name: 'Platinum',
      price: '$19.99',
      period: '/month',
      description: 'Enterprise AI orchestration',
      highlights: [
        '✨ Everything in Gold',
        '👑 Multi-LLM AI routing',
        '👑 Custom workflow builder',
        '👑 Team collaboration',
        '👑 REST API access',
        '👑 White-label options',
        '500 GB storage',
      ],
      cta: 'Start Platinum Trial',
      popular: false,
      badge: 'Coming Soon',
    },
  ],
};

/**
 * What's included in Free vs Gold
 */
export const UPGRADE_BENEFITS = {
  free_to_gold: [
    {
      feature: 'Conversations',
      free: '5/month',
      gold: 'Unlimited',
      icon: '💬',
    },
    {
      feature: 'AI Coaching',
      free: 'Limited',
      gold: 'Full conversational AI',
      icon: '🤖',
    },
    {
      feature: 'Mood Predictions',
      free: 'Basic',
      gold: 'Advanced with insights',
      icon: '📊',
    },
    {
      feature: 'Exports',
      free: 'None',
      gold: 'PDF, JSON, Email Reports',
      icon: '📄',
    },
    {
      feature: 'Storage',
      free: '1 GB',
      gold: '20 GB',
      icon: '💾',
    },
    {
      feature: 'Support',
      free: 'Community forum',
      gold: 'Priority email (24h)',
      icon: '📧',
    },
    {
      feature: 'Ads',
      free: 'Yes (supports us)',
      gold: 'Ad-free',
      icon: '✨',
    },
  ],

  gold_to_platinum: [
    {
      feature: 'Multi-LLM AI',
      gold: 'WebLLM only',
      platinum: 'Claude + GPT + Grok routing',
      icon: '🧠',
    },
    {
      feature: 'Workflows',
      gold: 'None',
      platinum: 'Visual workflow builder',
      icon: '🔄',
    },
    {
      feature: 'Teams',
      gold: 'Solo only',
      platinum: 'Unlimited team members',
      icon: '👥',
    },
    {
      feature: 'API Access',
      gold: 'None',
      platinum: '1M calls/month',
      icon: '⚙️',
    },
    {
      feature: 'White-Label',
      gold: 'No',
      platinum: 'Full white-label',
      icon: '🎨',
    },
    {
      feature: 'Analytics',
      gold: 'Personal only',
      platinum: 'Business intelligence',
      icon: '📈',
    },
  ],
};

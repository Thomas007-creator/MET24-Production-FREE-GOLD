import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';

/**
 * Performance-optimized hook for safe user data access
 * Prevents runtime errors by providing safe defaults for all user fields
 */
export const useSafeUserData = () => {
  const { userData } = useAppStore();

  const safeUserData = useMemo(() => {
    // Safe defaults to prevent runtime errors
    const defaults = {
      id: null,
      userId: null,
      name: 'Gebruiker',
      email: '',
      mbtiType: 'INFP',
      authMethod: 'anonymous',
      privacyAccepted: false,
      interests: [],
      context: {},
      wellness: {},
      notifications: {},
      birthDate: null,
      verified: false,
      verificationCompletedAt: null,
      aiActionPlan: null,
      bio: '',
      location: '',
      website: '',
      avatar: null,
      privacy: 'public' as const,
      joinDate: null,
      lastActive: null,
      totalPoints: 0,
      level: 1,
      achievements: [],
      // Database fields with safe defaults
      premiumStatus: false,
      darkMode: true,
      voiceEnabled: false,
      subscriptionTier: 'free',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: null
    };

    // Merge user data with safe defaults
    const merged = { ...defaults, ...userData };

    // Additional computed properties
    const computed = {
      ...merged,
      isUserPremium: merged.premiumStatus || merged.subscriptionTier === 'gold' || merged.subscriptionTier === 'developer',
      isDeveloper: merged.subscriptionTier === 'developer',
      isGold: merged.subscriptionTier === 'gold',
      isFree: merged.subscriptionTier === 'free',
      subscriptionIsActive: merged.subscriptionStatus === 'active' && 
        (!merged.subscriptionExpiresAt || merged.subscriptionExpiresAt > Date.now()),
      displayName: merged.name || 'Gebruiker',
      hasAvatar: !!merged.avatar,
      isVerified: merged.verified || false,
      hasInterests: merged.interests && merged.interests.length > 0,
      hasContext: merged.context && Object.keys(merged.context).length > 0,
      hasWellness: merged.wellness && Object.keys(merged.wellness).length > 0,
      hasAiActionPlan: !!merged.aiActionPlan,
      mbtiInfo: {
        type: merged.mbtiType,
        description: getMbtiDescription(merged.mbtiType)
      }
    };

    return computed;
  }, [userData]);

  // Log performance metrics
  useMemo(() => {
    logger.debug('Safe user data computed', {
      hasUserData: !!userData.id,
      fieldsCount: Object.keys(safeUserData).length,
      computedFields: Object.keys(safeUserData).filter(key => 
        !Object.prototype.hasOwnProperty.call(userData, key)
      ).length
    });
  }, [userData, safeUserData]);

  return safeUserData;
};

/**
 * Get MBTI description with fallback
 */
function getMbtiDescription(mbtiType: string): string {
  const descriptions = {
    'INTJ': 'The Architect - Strategic and innovative thinkers',
    'INTP': 'The Thinker - Flexible and charming',
    'ENTJ': 'The Commander - Bold and imaginative leaders',
    'ENTP': 'The Debater - Smart and curious thinkers',
    'INFJ': 'The Advocate - Creative and insightful',
    'INFP': 'The Mediator - Poetic and kind souls',
    'ENFJ': 'The Protagonist - Charismatic and inspiring leaders', 
    'ENFP': 'The Campaigner - Enthusiastic and creative',
    'ISTJ': 'The Logistician - Practical and fact-minded',
    'ISFJ': 'The Protector - Warm-hearted and dedicated',
    'ESTJ': 'The Executive - Excellent administrators',
    'ESFJ': 'The Consul - Extraordinarily caring and social',
    'ISTP': 'The Virtuoso - Bold and practical experimenters',
    'ISFP': 'The Adventurer - Flexible and charming artists',
    'ESTP': 'The Entrepreneur - Smart and energetic',
    'ESFP': 'The Entertainer - Spontaneous and enthusiastic'
  };
  
  return descriptions[mbtiType as keyof typeof descriptions] || 'Unknown type';
}

export default useSafeUserData;

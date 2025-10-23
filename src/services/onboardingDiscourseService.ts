/**
 * Onboarding-Based Discourse Service
 * 
 * Service die onboarding data gebruikt om MBTI-specifieke Discourse communities te bepalen
 * Gebaseerd op bestaande onboarding content preferences
 * 
 * @version 14.0.0
 */

import { logger } from '../utils/logger';

// Onboarding data uit o-ContentPreferences.tsx
export interface OnboardingPreferences {
  contentTypes: string[];
  topics: string[];
}

// MBTI preferences uit onboarding
export const MBTI_ONBOARDING_PREFERENCES: Record<string, OnboardingPreferences> = {
  'INTJ': { contentTypes: ['article', 'course'], topics: ['personality', 'leadership', 'creativity'] },
  'INTP': { contentTypes: ['article', 'interactive'], topics: ['personality', 'creativity', 'communication'] },
  'ENTJ': { contentTypes: ['video', 'course'], topics: ['leadership', 'career', 'communication'] },
  'ENTP': { contentTypes: ['podcast', 'interactive'], topics: ['creativity', 'communication', 'personality'] },
  'INFJ': { contentTypes: ['meditation', 'article'], topics: ['wellness', 'relationships', 'mindfulness'] },
  'INFP': { contentTypes: ['meditation', 'article'], topics: ['creativity', 'wellness', 'relationships'] },
  'ENFJ': { contentTypes: ['video', 'course'], topics: ['relationships', 'leadership', 'communication'] },
  'ENFP': { contentTypes: ['podcast', 'interactive'], topics: ['creativity', 'relationships', 'wellness'] },
  'ISTJ': { contentTypes: ['article', 'course'], topics: ['career', 'personality', 'communication'] },
  'ISFJ': { contentTypes: ['article', 'meditation'], topics: ['relationships', 'wellness', 'personality'] },
  'ESTJ': { contentTypes: ['video', 'course'], topics: ['leadership', 'career', 'communication'] },
  'ESFJ': { contentTypes: ['video', 'meditation'], topics: ['relationships', 'wellness', 'communication'] },
  'ISTP': { contentTypes: ['interactive', 'article'], topics: ['creativity', 'personality', 'career'] },
  'ISFP': { contentTypes: ['meditation', 'interactive'], topics: ['creativity', 'wellness', 'relationships'] },
  'ESTP': { contentTypes: ['video', 'interactive'], topics: ['career', 'communication', 'creativity'] },
  'ESFP': { contentTypes: ['video', 'meditation'], topics: ['relationships', 'wellness', 'creativity'] }
};

// Topic naar Discourse community mapping
export const TOPIC_TO_DISCOURSE_MAPPING: Record<string, string[]> = {
  'personality': [
    'personality-development',
    'theoretical-personality', 
    'structured-personality',
    'supportive-personality',
    'practical-personality'
  ],
  'leadership': [
    'strategic-leadership',
    'executive-leadership',
    'inspirational-leadership',
    'management-leadership',
    'supportive-leadership'
  ],
  'creativity': [
    'creative-strategy',
    'creative-problem-solving',
    'creative-innovation',
    'artistic-creativity',
    'hands-on-creativity',
    'action-creativity',
    'performance-creativity'
  ],
  'communication': [
    'analytical-communication',
    'strategic-communication',
    'dynamic-communication',
    'clear-communication',
    'direct-communication',
    'harmonious-communication'
  ],
  'wellness': [
    'holistic-wellness',
    'emotional-wellness',
    'gentle-wellness',
    'energetic-wellness',
    'nature-wellness',
    'community-wellness'
  ],
  'relationships': [
    'deep-relationships',
    'authentic-relationships',
    'caring-relationships',
    'social-relationships',
    'meaningful-connections'
  ],
  'mindfulness': [
    'mindful-living',
    'spiritual-development',
    'creative-healing',
    'values-alignment'
  ],
  'career': [
    'career-strategy',
    'systematic-career',
    'business-career',
    'technical-career',
    'entrepreneurial-career'
  ]
};

// Levensgebied naar topic mapping
export const LEVENSGEBIED_TO_TOPICS: Record<string, string[]> = {
  'psychischeGezondheid': ['wellness', 'mindfulness', 'personality'],
  'lichamelijkeGezondheid': ['wellness', 'creativity', 'personality'],
  'financieen': ['leadership', 'career', 'personality'],
  'werkSamenleving': ['leadership', 'career', 'communication'],
  'creativiteitHobbys': ['creativity', 'personality', 'wellness'],
  'actieveImaginatie': ['mindfulness', 'creativity', 'wellness'],
  'professioneleOntwikkeling': ['leadership', 'career', 'personality'],
  'socialeLiefdesrelaties': ['relationships', 'communication', 'wellness'],
  'basisBehoeften': ['personality', 'wellness', 'creativity']
};

export interface DiscourseCommunity {
  title: string;
  hashtag: string;
  url: string;
  memberCount: number;
  lastActivity: string;
  isLive: boolean;
  source: 'onboarding' | 'mbti' | 'levensgebied';
  topics: string[];
  contentTypes: string[];
}

export class OnboardingDiscourseService {
  private static instance: OnboardingDiscourseService;

  private constructor() {}

  public static getInstance(): OnboardingDiscourseService {
    if (!OnboardingDiscourseService.instance) {
      OnboardingDiscourseService.instance = new OnboardingDiscourseService();
    }
    return OnboardingDiscourseService.instance;
  }

  /**
   * Haalt onboarding preferences op voor een MBTI type
   */
  getOnboardingPreferences(mbtiType: string): OnboardingPreferences {
    const preferences = MBTI_ONBOARDING_PREFERENCES[mbtiType];
    if (!preferences) {
      logger.warn(`No onboarding preferences found for MBTI type: ${mbtiType}`);
      return { contentTypes: ['article', 'video'], topics: ['personality', 'wellness'] };
    }
    return preferences;
  }

  /**
   * Genereert Discourse communities gebaseerd op onboarding data
   */
  generateDiscourseCommunities(
    mbtiType: string, 
    levensgebied: string, 
    limit: number = 3
  ): DiscourseCommunity[] {
    const onboardingPrefs = this.getOnboardingPreferences(mbtiType);
    const levensgebiedTopics = LEVENSGEBIED_TO_TOPICS[levensgebied] || [];
    
    // Combineer onboarding topics met levensgebied topics
    const relevantTopics = [...new Set([...onboardingPrefs.topics, ...levensgebiedTopics])];
    
    const communities: DiscourseCommunity[] = [];
    
    // Genereer communities voor elke relevante topic
    relevantTopics.forEach(topic => {
      const discourseCommunities = TOPIC_TO_DISCOURSE_MAPPING[topic] || [];
      
      discourseCommunities.slice(0, 1).forEach(communitySlug => {
        communities.push({
          title: this.formatCommunityTitle(communitySlug),
          hashtag: `#${topic.charAt(0).toUpperCase() + topic.slice(1)}`,
          url: `https://www.community.your-future-self.nl/${communitySlug}`,
          memberCount: this.generateMemberCount(mbtiType, topic),
          lastActivity: this.generateLastActivity(),
          isLive: true,
          source: 'onboarding',
          topics: [topic],
          contentTypes: onboardingPrefs.contentTypes
        });
      });
    });
    
    // Sorteer op relevantie en neem de top communities
    return communities
      .sort((a, b) => this.calculateRelevanceScore(b, mbtiType, levensgebied) - this.calculateRelevanceScore(a, mbtiType, levensgebied))
      .slice(0, limit);
  }

  /**
   * Berekent relevantie score voor community matching
   */
  private calculateRelevanceScore(
    community: DiscourseCommunity, 
    mbtiType: string, 
    levensgebied: string
  ): number {
    const onboardingPrefs = this.getOnboardingPreferences(mbtiType);
    const levensgebiedTopics = LEVENSGEBIED_TO_TOPICS[levensgebied] || [];
    
    let score = 0;
    
    // Score gebaseerd op onboarding topics
    community.topics.forEach(topic => {
      if (onboardingPrefs.topics.includes(topic)) score += 3;
      if (levensgebiedTopics.includes(topic)) score += 2;
    });
    
    // Score gebaseerd op MBTI type (extra punten voor specifieke types)
    const mbtiBonus = this.getMBTIBonus(mbtiType, community);
    score += mbtiBonus;
    
    return score;
  }

  /**
   * MBTI-specifieke bonus voor community matching
   */
  private getMBTIBonus(mbtiType: string, community: DiscourseCommunity): number {
    const bonuses: Record<string, Record<string, number>> = {
      'INTJ': { 'strategic': 2, 'leadership': 2, 'analytical': 1 },
      'INTP': { 'theoretical': 2, 'analytical': 2, 'research': 1 },
      'ENTJ': { 'executive': 2, 'leadership': 2, 'business': 1 },
      'ENTP': { 'creative': 2, 'dynamic': 2, 'entrepreneurial': 1 },
      'INFJ': { 'holistic': 2, 'spiritual': 2, 'mindful': 1 },
      'INFP': { 'artistic': 2, 'authentic': 2, 'creative': 1 },
      'ENFJ': { 'inspirational': 2, 'community': 2, 'empathic': 1 },
      'ENFP': { 'creative': 2, 'inspiration': 2, 'adventure': 1 },
      'ISTJ': { 'systematic': 2, 'structured': 2, 'reliable': 1 },
      'ISFJ': { 'caring': 2, 'supportive': 2, 'gentle': 1 },
      'ESTJ': { 'management': 2, 'organizational': 2, 'direct': 1 },
      'ESFJ': { 'social': 2, 'harmonious': 2, 'community': 1 },
      'ISTP': { 'hands-on': 2, 'practical': 2, 'technical': 1 },
      'ISFP': { 'artistic': 2, 'nature': 2, 'sensory': 1 },
      'ESTP': { 'action': 2, 'entrepreneurial': 2, 'competitive': 1 },
      'ESFP': { 'social': 2, 'energetic': 2, 'performance': 1 }
    };
    
    const mbtiBonuses = bonuses[mbtiType] || {};
    let bonus = 0;
    
    Object.keys(mbtiBonuses).forEach(keyword => {
      if (community.title.toLowerCase().includes(keyword) || 
          community.url.toLowerCase().includes(keyword)) {
        bonus += mbtiBonuses[keyword];
      }
    });
    
    return bonus;
  }

  /**
   * Formatteert community title
   */
  private formatCommunityTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Genereert realistische member count gebaseerd op MBTI type en topic
   */
  private generateMemberCount(mbtiType: string, topic: string): number {
    const baseCounts: Record<string, number> = {
      'personality': 1200,
      'leadership': 800,
      'creativity': 1500,
      'communication': 1000,
      'wellness': 2000,
      'relationships': 1800,
      'mindfulness': 1600,
      'career': 900
    };
    
    const baseCount = baseCounts[topic] || 1000;
    
    // MBTI type modifier
    const mbtiModifiers: Record<string, number> = {
      'INTJ': 0.8, 'INTP': 0.6, 'ENTJ': 1.2, 'ENTP': 1.0,
      'INFJ': 1.1, 'INFP': 1.3, 'ENFJ': 1.4, 'ENFP': 1.5,
      'ISTJ': 0.9, 'ISFJ': 1.2, 'ESTJ': 1.1, 'ESFJ': 1.3,
      'ISTP': 0.7, 'ISFP': 1.0, 'ESTP': 1.1, 'ESFP': 1.4
    };
    
    const modifier = mbtiModifiers[mbtiType] || 1.0;
    return Math.round(baseCount * modifier);
  }

  /**
   * Genereert realistische last activity
   */
  private generateLastActivity(): string {
    const activities = [
      '2 hours ago', '5 hours ago', '1 day ago', '2 days ago', 
      '3 days ago', '1 week ago', '2 weeks ago'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  }

  /**
   * Haalt alle relevante communities op voor een gebruiker
   */
  getAllRelevantCommunities(mbtiType: string): DiscourseCommunity[] {
    const onboardingPrefs = this.getOnboardingPreferences(mbtiType);
    const allCommunities: DiscourseCommunity[] = [];
    
    // Genereer communities voor alle levensgebieden
    Object.keys(LEVENSGEBIED_TO_TOPICS).forEach(levensgebied => {
      const communities = this.generateDiscourseCommunities(mbtiType, levensgebied, 2);
      allCommunities.push(...communities);
    });
    
    // Sorteer op relevantie en neem top communities
    return allCommunities
      .sort((a, b) => this.calculateRelevanceScore(b, mbtiType, '') - this.calculateRelevanceScore(a, mbtiType, ''))
      .slice(0, 10);
  }

  /**
   * Haalt community analytics op
   */
  getCommunityAnalytics(mbtiType: string): {
    totalCommunities: number;
    totalMembers: number;
    topTopics: string[];
    averageActivity: string;
  } {
    const communities = this.getAllRelevantCommunities(mbtiType);
    const totalMembers = communities.reduce((sum, community) => sum + community.memberCount, 0);
    const topTopics = [...new Set(communities.flatMap(c => c.topics))].slice(0, 5);
    
    return {
      totalCommunities: communities.length,
      totalMembers,
      topTopics,
      averageActivity: '2 days ago'
    };
  }
}

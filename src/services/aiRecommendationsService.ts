/**
 * AI-Powered Recommendations Service for MET24 Phase 2
 * 
 * Handles AI-powered recommendations using text embeddings and sentiment analysis
 * 
 * @version 3.0.0-light-ai
 */

import { textEmbeddingsService } from './textEmbeddingsService';
import { sentimentAnalysisService } from './sentimentAnalysisService';
import { contentCurationService } from './contentCurationService';

export interface RecommendationRequest {
  userId: string;
  context: {
    currentActivity?: string;
    mood?: number;
    goals?: string[];
    preferences?: string[];
    mbtiType?: string;
  };
  type: 'content' | 'activity' | 'goal' | 'challenge' | 'wellness';
  limit: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  confidence: number;
  relevance: number;
  reasoning: string;
  metadata: {
    duration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    mbtiType?: string;
  };
  timestamp: Date;
}

export interface RecommendationResult {
  recommendations: Recommendation[];
  totalFound: number;
  personalization: {
    mbtiMatch: boolean;
    moodMatch: boolean;
    goalMatch: boolean;
    preferenceMatch: boolean;
  };
  insights: string[];
  timestamp: Date;
}

export interface UserProfile {
  userId: string;
  mbtiType?: string;
  preferences: {
    contentTypes: string[];
    categories: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    maxDuration: number;
  };
  goals: string[];
  moodHistory: number[];
  activityHistory: string[];
  feedback: Array<{
    itemId: string;
    rating: number;
    timestamp: Date;
  }>;
}

export class AIRecommendationsService {
  private userProfiles: Map<string, UserProfile> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.initializeDefaultProfiles();
  }

  /**
   * Initialize AI recommendations service
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('AI Recommendations Service: Initializing...');

      // Initialize AI services
      await Promise.all([
        textEmbeddingsService.initialize(),
        sentimentAnalysisService.initialize(),
        contentCurationService.initialize()
      ]);

      this.isInitialized = true;
      console.log('AI Recommendations Service: Initialized successfully');
    } catch (error) {
      console.error('AI Recommendations Service: Error initializing', error);
      throw error;
    }
  }

  /**
   * Initialize default user profiles
   */
  private initializeDefaultProfiles(): void {
    // Mock user profiles for testing
    const defaultProfiles: UserProfile[] = [
      {
        userId: 'user1',
        mbtiType: 'INTJ',
        preferences: {
          contentTypes: ['article', 'video'],
          categories: ['career', 'personal-growth'],
          difficulty: 'intermediate',
          maxDuration: 30
        },
        goals: ['career development', 'productivity improvement'],
        moodHistory: [7, 8, 6, 7, 8],
        activityHistory: ['journaling', 'meditation', 'reading'],
        feedback: []
      },
      {
        userId: 'user2',
        mbtiType: 'ENFP',
        preferences: {
          contentTypes: ['video', 'podcast'],
          categories: ['creativity', 'relationships'],
          difficulty: 'beginner',
          maxDuration: 20
        },
        goals: ['creative expression', 'social connection'],
        moodHistory: [8, 7, 9, 8, 7],
        activityHistory: ['creative exercises', 'social activities'],
        feedback: []
      }
    ];

    defaultProfiles.forEach(profile => {
      this.userProfiles.set(profile.userId, profile);
    });
  }

  /**
   * Get recommendations
   */
  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get or create user profile
      const userProfile = this.getUserProfile(request.userId);

      // Generate recommendations based on type
      let recommendations: Recommendation[] = [];
      
      switch (request.type) {
        case 'content':
          recommendations = await this.getContentRecommendations(request, userProfile);
          break;
        case 'activity':
          recommendations = await this.getActivityRecommendations(request, userProfile);
          break;
        case 'goal':
          recommendations = await this.getGoalRecommendations(request, userProfile);
          break;
        case 'challenge':
          recommendations = await this.getChallengeRecommendations(request, userProfile);
          break;
        case 'wellness':
          recommendations = await this.getWellnessRecommendations(request, userProfile);
          break;
        default:
          recommendations = await this.getContentRecommendations(request, userProfile);
      }

      // Apply personalization
      const personalizedRecommendations = this.applyPersonalization(recommendations, userProfile);

      // Sort by relevance and confidence
      const sortedRecommendations = this.sortRecommendations(personalizedRecommendations);

      // Limit results
      const limitedRecommendations = sortedRecommendations.slice(0, request.limit);

      // Calculate personalization metrics
      const personalization = this.calculatePersonalization(limitedRecommendations, userProfile);

      // Generate insights
      const insights = this.generateInsights(limitedRecommendations, userProfile);

      return {
        recommendations: limitedRecommendations,
        totalFound: recommendations.length,
        personalization,
        insights,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('AI Recommendations Service: Error getting recommendations', error);
      throw error;
    }
  }

  /**
   * Get content recommendations
   */
  private async getContentRecommendations(
    request: RecommendationRequest,
    userProfile: UserProfile
  ): Promise<Recommendation[]> {
    try {
      // Use content curation service
      const curationRequest = {
        userId: request.userId,
        query: request.context.currentActivity || 'general content',
        preferences: userProfile.preferences,
        mbtiType: userProfile.mbtiType,
        limit: request.limit * 2 // Get more to allow for filtering
      };

      const curationResult = await contentCurationService.curateContent(curationRequest);

      // Convert to recommendations
      const recommendations: Recommendation[] = curationResult.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.content,
        type: 'content',
        category: item.category,
        confidence: 0.8,
        relevance: this.calculateRelevance(item, userProfile),
        reasoning: this.generateReasoning(item, userProfile),
        metadata: {
          duration: item.duration,
          difficulty: item.difficulty,
          tags: item.tags,
          mbtiType: item.mbtiType
        },
        timestamp: new Date()
      }));

      return recommendations;
    } catch (error) {
      console.error('AI Recommendations Service: Error getting content recommendations', error);
      return [];
    }
  }

  /**
   * Get activity recommendations
   */
  private async getActivityRecommendations(
    request: RecommendationRequest,
    userProfile: UserProfile
  ): Promise<Recommendation[]> {
    const activities: Recommendation[] = [
      {
        id: 'meditation',
        title: 'Mindfulness Meditatie',
        description: 'Een korte meditatie sessie om je geest te kalmeren en te focussen.',
        type: 'activity',
        category: 'wellness',
        confidence: 0.9,
        relevance: 0.8,
        reasoning: 'Gebaseerd op je interesse in wellness en mindfulness',
        metadata: {
          duration: 15,
          difficulty: 'beginner',
          tags: ['meditation', 'mindfulness', 'relaxation']
        },
        timestamp: new Date()
      },
      {
        id: 'journaling',
        title: 'Reflectief Journalen',
        description: 'Schrijf over je dag en reflecteer op je ervaringen en gevoelens.',
        type: 'activity',
        category: 'personal-growth',
        confidence: 0.8,
        relevance: 0.7,
        reasoning: 'Past bij je interesse in persoonlijke groei',
        metadata: {
          duration: 20,
          difficulty: 'beginner',
          tags: ['journaling', 'reflection', 'writing']
        },
        timestamp: new Date()
      },
      {
        id: 'creative-exercise',
        title: 'Creatieve Oefening',
        description: 'Een oefening om je creativiteit te stimuleren en nieuwe ideeën te ontwikkelen.',
        type: 'activity',
        category: 'creativity',
        confidence: 0.7,
        relevance: 0.6,
        reasoning: 'Gebaseerd op je interesse in creativiteit',
        metadata: {
          duration: 25,
          difficulty: 'intermediate',
          tags: ['creativity', 'brainstorming', 'innovation']
        },
        timestamp: new Date()
      }
    ];

    return activities;
  }

  /**
   * Get goal recommendations
   */
  private async getGoalRecommendations(
    request: RecommendationRequest,
    userProfile: UserProfile
  ): Promise<Recommendation[]> {
    const goals: Recommendation[] = [
      {
        id: 'daily-meditation',
        title: 'Dagelijkse Meditatie',
        description: 'Mediteer elke dag 10 minuten om je geest te kalmeren en te focussen.',
        type: 'goal',
        category: 'wellness',
        confidence: 0.8,
        relevance: 0.7,
        reasoning: 'Gebaseerd op je interesse in wellness en mindfulness',
        metadata: {
          duration: 10,
          difficulty: 'beginner',
          tags: ['meditation', 'daily', 'wellness']
        },
        timestamp: new Date()
      },
      {
        id: 'weekly-reflection',
        title: 'Wekelijkse Reflectie',
        description: 'Reflecteer elke week op je doelen en vooruitgang.',
        type: 'goal',
        category: 'personal-growth',
        confidence: 0.7,
        relevance: 0.6,
        reasoning: 'Past bij je interesse in persoonlijke groei',
        metadata: {
          duration: 30,
          difficulty: 'intermediate',
          tags: ['reflection', 'goals', 'progress']
        },
        timestamp: new Date()
      }
    ];

    return goals;
  }

  /**
   * Get challenge recommendations
   */
  private async getChallengeRecommendations(
    request: RecommendationRequest,
    userProfile: UserProfile
  ): Promise<Recommendation[]> {
    const challenges: Recommendation[] = [
      {
        id: 'mindfulness-challenge',
        title: '30 Dagen Mindfulness',
        description: 'Mediteer 30 dagen lang elke dag om mindfulness te ontwikkelen.',
        type: 'challenge',
        category: 'wellness',
        confidence: 0.8,
        relevance: 0.7,
        reasoning: 'Gebaseerd op je interesse in wellness en mindfulness',
        metadata: {
          duration: 30,
          difficulty: 'intermediate',
          tags: ['mindfulness', 'meditation', 'challenge']
        },
        timestamp: new Date()
      },
      {
        id: 'creativity-challenge',
        title: 'Creativiteit Uitdaging',
        description: 'Doe elke dag een creatieve oefening om je creativiteit te stimuleren.',
        type: 'challenge',
        category: 'creativity',
        confidence: 0.7,
        relevance: 0.6,
        reasoning: 'Gebaseerd op je interesse in creativiteit',
        metadata: {
          duration: 21,
          difficulty: 'intermediate',
          tags: ['creativity', 'daily', 'challenge']
        },
        timestamp: new Date()
      }
    ];

    return challenges;
  }

  /**
   * Get wellness recommendations
   */
  private async getWellnessRecommendations(
    request: RecommendationRequest,
    userProfile: UserProfile
  ): Promise<Recommendation[]> {
    const wellness: Recommendation[] = [
      {
        id: 'stress-relief',
        title: 'Stress Verlichting',
        description: 'Technieken om stress te verminderen en te beheersen.',
        type: 'wellness',
        category: 'wellness',
        confidence: 0.9,
        relevance: 0.8,
        reasoning: 'Gebaseerd op je interesse in wellness',
        metadata: {
          duration: 20,
          difficulty: 'beginner',
          tags: ['stress', 'relief', 'wellness']
        },
        timestamp: new Date()
      },
      {
        id: 'sleep-improvement',
        title: 'Slaap Verbetering',
        description: 'Tips en technieken om je slaapkwaliteit te verbeteren.',
        type: 'wellness',
        category: 'wellness',
        confidence: 0.8,
        relevance: 0.7,
        reasoning: 'Gebaseerd op je interesse in wellness',
        metadata: {
          duration: 15,
          difficulty: 'beginner',
          tags: ['sleep', 'wellness', 'health']
        },
        timestamp: new Date()
      }
    ];

    return wellness;
  }

  /**
   * Apply personalization to recommendations
   */
  private applyPersonalization(
    recommendations: Recommendation[],
    userProfile: UserProfile
  ): Recommendation[] {
    return recommendations.map(recommendation => {
      let personalizedRecommendation = { ...recommendation };

      // Adjust confidence based on MBTI match
      if (userProfile.mbtiType && recommendation.metadata.mbtiType === userProfile.mbtiType) {
        personalizedRecommendation.confidence += 0.1;
      }

      // Adjust relevance based on preferences
      if (userProfile.preferences.contentTypes.includes(recommendation.type)) {
        personalizedRecommendation.relevance += 0.1;
      }

      // Adjust based on difficulty preference
      if (recommendation.metadata.difficulty === userProfile.preferences.difficulty) {
        personalizedRecommendation.relevance += 0.1;
      }

      // Adjust based on duration preference
      if (recommendation.metadata.duration && 
          recommendation.metadata.duration <= userProfile.preferences.maxDuration) {
        personalizedRecommendation.relevance += 0.1;
      }

      // Cap values
      personalizedRecommendation.confidence = Math.min(1.0, personalizedRecommendation.confidence);
      personalizedRecommendation.relevance = Math.min(1.0, personalizedRecommendation.relevance);

      return personalizedRecommendation;
    });
  }

  /**
   * Sort recommendations by relevance and confidence
   */
  private sortRecommendations(recommendations: Recommendation[]): Recommendation[] {
    return recommendations.sort((a, b) => {
      const scoreA = a.relevance * 0.7 + a.confidence * 0.3;
      const scoreB = b.relevance * 0.7 + b.confidence * 0.3;
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate relevance for content item
   */
  private calculateRelevance(item: any, userProfile: UserProfile): number {
    let relevance = 0.5; // Base relevance

    // MBTI match
    if (userProfile.mbtiType && item.mbtiType === userProfile.mbtiType) {
      relevance += 0.2;
    }

    // Category match
    if (userProfile.preferences.categories.includes(item.category)) {
      relevance += 0.2;
    }

    // Difficulty match
    if (item.difficulty === userProfile.preferences.difficulty) {
      relevance += 0.1;
    }

    // Duration match
    if (item.duration <= userProfile.preferences.maxDuration) {
      relevance += 0.1;
    }

    return Math.min(1.0, relevance);
  }

  /**
   * Generate reasoning for recommendation
   */
  private generateReasoning(item: any, userProfile: UserProfile): string {
    const reasons: string[] = [];

    if (userProfile.mbtiType && item.mbtiType === userProfile.mbtiType) {
      reasons.push(`Specifiek voor ${userProfile.mbtiType} type`);
    }

    if (userProfile.preferences.categories.includes(item.category)) {
      reasons.push(`Past bij je interesse in ${item.category}`);
    }

    if (item.difficulty === userProfile.preferences.difficulty) {
      reasons.push(`Geschikt voor je niveau`);
    }

    if (item.duration <= userProfile.preferences.maxDuration) {
      reasons.push(`Past binnen je tijdslimiet`);
    }

    return reasons.join(', ') || 'Aanbevolen content';
  }

  /**
   * Calculate personalization metrics
   */
  private calculatePersonalization(
    recommendations: Recommendation[],
    userProfile: UserProfile
  ): { mbtiMatch: boolean; moodMatch: boolean; goalMatch: boolean; preferenceMatch: boolean } {
    const mbtiMatch = recommendations.some(r => r.metadata.mbtiType === userProfile.mbtiType);
    const moodMatch = true; // Mock implementation
    const goalMatch = recommendations.some(r => 
      userProfile.goals.some(goal => r.description.toLowerCase().includes(goal.toLowerCase()))
    );
    const preferenceMatch = recommendations.some(r => 
      userProfile.preferences.contentTypes.includes(r.type)
    );

    return { mbtiMatch, moodMatch, goalMatch, preferenceMatch };
  }

  /**
   * Generate insights about recommendations
   */
  private generateInsights(recommendations: Recommendation[], userProfile: UserProfile): string[] {
    const insights: string[] = [];

    if (recommendations.length === 0) {
      insights.push('Geen aanbevelingen gevonden die aansluiten bij je profiel');
      return insights;
    }

    // Category distribution
    const categoryCounts: { [key: string]: number } = {};
    recommendations.forEach(rec => {
      categoryCounts[rec.category] = (categoryCounts[rec.category] || 0) + 1;
    });

    const mostCommonCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (mostCommonCategory) {
      insights.push(`Meest aanbevolen categorie: ${mostCommonCategory[0]}`);
    }

    // Average confidence
    const avgConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length;
    insights.push(`Gemiddelde betrouwbaarheid: ${(avgConfidence * 100).toFixed(0)}%`);

    // MBTI personalization
    if (userProfile.mbtiType) {
      const mbtiRecommendations = recommendations.filter(r => r.metadata.mbtiType === userProfile.mbtiType);
      if (mbtiRecommendations.length > 0) {
        insights.push(`${mbtiRecommendations.length} aanbevelingen specifiek voor ${userProfile.mbtiType}`);
      }
    }

    return insights;
  }

  /**
   * Get or create user profile
   */
  private getUserProfile(userId: string): UserProfile {
    if (!this.userProfiles.has(userId)) {
      // Create default profile
      const defaultProfile: UserProfile = {
        userId,
        preferences: {
          contentTypes: ['article', 'video', 'podcast'],
          categories: ['wellness', 'personal-growth', 'creativity'],
          difficulty: 'beginner',
          maxDuration: 30
        },
        goals: ['personal development', 'wellness'],
        moodHistory: [5, 5, 5, 5, 5],
        activityHistory: [],
        feedback: []
      };
      this.userProfiles.set(userId, defaultProfile);
    }

    return this.userProfiles.get(userId)!;
  }

  /**
   * Update user profile
   */
  updateUserProfile(userId: string, updates: Partial<UserProfile>): void {
    const profile = this.getUserProfile(userId);
    const updatedProfile = { ...profile, ...updates };
    this.userProfiles.set(userId, updatedProfile);
  }

  /**
   * Add user feedback
   */
  addUserFeedback(userId: string, itemId: string, rating: number): void {
    const profile = this.getUserProfile(userId);
    profile.feedback.push({
      itemId,
      rating,
      timestamp: new Date()
    });
    this.userProfiles.set(userId, profile);
  }

  /**
   * Get user profile
   */
  getUserProfileData(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    totalProfiles: number;
    ready: boolean;
  } {
    return {
      initialized: this.isInitialized,
      totalProfiles: this.userProfiles.size,
      ready: this.isInitialized
    };
  }
}

// Export singleton instance
export const aiRecommendationsService = new AIRecommendationsService();

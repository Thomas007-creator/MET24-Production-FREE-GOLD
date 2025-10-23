/**
 * Personal MBTI Coach Service - Q4 2025 Implementation
 * 
 * Implementeert de eerste fase van de Integrated Vision:
 * - Persoonlijke AI-coaches voor elke MBTI-type
 * - Agent Executor integratie
 * - MBTI-geoptimaliseerde tool selection
 * - Daily coaching plans
 * 
 * @version 1.0.0
 * @author Thomas (Integrated Vision Implementation)
 */

import { Database } from "@nozbe/watermelondb";
import { Q } from "@nozbe/watermelondb";
import { supabase } from "../lib/supabaseClient";
import { logger } from "../utils/logger";
import User from "../database/v14/models/User";
import ChatMessage from "../database/v14/models/ChatMessage";
import Setting from "../database/v14/models/Setting";

// Types
interface MBTICoachingProfile {
  mbtiType: string;
  preferredTools: string[];
  coachingStyle: 'directive' | 'collaborative' | 'supportive' | 'challenging';
  focusAreas: string[];
  communicationPreferences: string[];
  optimalSessionLength: number; // in minutes
  autonomyLevel: 'low' | 'medium' | 'high';
}

interface DailyCoachingPlan {
  date: string;
  mbtiType: string;
  primaryGoal: string;
  tasks: CoachingTask[];
  estimatedDuration: number;
  personalizedInsights: string[];
  nextSteps: string[];
}

interface CoachingTask {
  id: string;
  title: string;
  description: string;
  toolsUsed: string[];
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  mbtiRelevance: string;
  expectedOutcome: string;
}

// MBTI Coaching Profiles - Complete set of 16 types optimized per personality
const MBTI_COACHING_PROFILES: Record<string, MBTICoachingProfile> = {
  'INTJ': {
    mbtiType: 'INTJ',
    preferredTools: ['analyzeText', 'generateInsights', 'scheduleReminder', 'strategicPlanning'],
    coachingStyle: 'directive',
    focusAreas: ['strategic_planning', 'system_optimization', 'long_term_vision', 'efficiency'],
    communicationPreferences: ['direct', 'logical', 'structured', 'future_focused'],
    optimalSessionLength: 45,
    autonomyLevel: 'high'
  },
  'INTP': {
    mbtiType: 'INTP',
    preferredTools: ['analyzeText', 'generateInsights', 'brainstormIdeas', 'logicalAnalysis'],
    coachingStyle: 'directive',
    focusAreas: ['theoretical_understanding', 'problem_solving', 'innovation', 'independence'],
    communicationPreferences: ['precise', 'logical', 'questioning', 'conceptual'],
    optimalSessionLength: 40,
    autonomyLevel: 'high'
  },
  'ENTJ': {
    mbtiType: 'ENTJ',
    preferredTools: ['strategicPlanning', 'analyzeText', 'scheduleReminder', 'leadershipDevelopment'],
    coachingStyle: 'directive',
    focusAreas: ['leadership', 'strategic_execution', 'goal_achievement', 'organizational_change'],
    communicationPreferences: ['commanding', 'strategic', 'results_oriented', 'decisive'],
    optimalSessionLength: 50,
    autonomyLevel: 'high'
  },
  'ENTP': {
    mbtiType: 'ENTP',
    preferredTools: ['brainstormIdeas', 'analyzeText', 'generateInsights', 'debateAnalysis'],
    coachingStyle: 'challenging',
    focusAreas: ['innovation', 'debate', 'possibilities', 'intellectual_stimulation'],
    communicationPreferences: ['dynamic', 'conceptual', 'challenging', 'open_ended'],
    optimalSessionLength: 35,
    autonomyLevel: 'high'
  },
  'INFJ': {
    mbtiType: 'INFJ',
    preferredTools: ['generateInsights', 'empathyMapping', 'analyzeText', 'valueAlignment'],
    coachingStyle: 'supportive',
    focusAreas: ['personal_growth', 'meaning', 'helping_others', 'vision_realization'],
    communicationPreferences: ['insightful', 'empathetic', 'visionary', 'harmonious'],
    optimalSessionLength: 55,
    autonomyLevel: 'medium'
  },
  'INFP': {
    mbtiType: 'INFP',
    preferredTools: ['generateInsights', 'creativeExpression', 'valueAlignment', 'analyzeText'],
    coachingStyle: 'supportive',
    focusAreas: ['authenticity', 'values', 'creativity', 'personal_meaning'],
    communicationPreferences: ['gentle', 'idealistic', 'deep', 'understanding'],
    optimalSessionLength: 45,
    autonomyLevel: 'medium'
  },
  'ENFJ': {
    mbtiType: 'ENFJ',
    preferredTools: ['socialConnection', 'empathyMapping', 'leadershipDevelopment', 'harmonyAnalysis'],
    coachingStyle: 'collaborative',
    focusAreas: ['leadership', 'relationships', 'inspiration', 'community_building'],
    communicationPreferences: ['encouraging', 'visionary', 'empathetic', 'motivational'],
    optimalSessionLength: 50,
    autonomyLevel: 'medium'
  },
  'ENFP': {
    mbtiType: 'ENFP',
    preferredTools: ['generateInsights', 'brainstormIdeas', 'analyzeText', 'socialConnection'],
    coachingStyle: 'collaborative',
    focusAreas: ['creativity', 'relationships', 'possibility_exploration', 'inspiration'],
    communicationPreferences: ['enthusiastic', 'exploratory', 'people_focused', 'flexible'],
    optimalSessionLength: 30,
    autonomyLevel: 'medium'
  },
  'ISTJ': {
    mbtiType: 'ISTJ',
    preferredTools: ['scheduleReminder', 'taskPlanning', 'analyzeText', 'processOptimization'],
    coachingStyle: 'supportive',
    focusAreas: ['organization', 'responsibility', 'tradition', 'stability'],
    communicationPreferences: ['structured', 'practical', 'step_by_step', 'proven_methods'],
    optimalSessionLength: 60,
    autonomyLevel: 'medium'
  },
  'ISFJ': {
    mbtiType: 'ISFJ',
    preferredTools: ['scheduleReminder', 'empathyMapping', 'harmonyAnalysis', 'taskPlanning'],
    coachingStyle: 'supportive',
    focusAreas: ['harmony', 'helping_others', 'responsibility', 'stability'],
    communicationPreferences: ['gentle', 'practical', 'caring', 'detail_oriented'],
    optimalSessionLength: 55,
    autonomyLevel: 'low'
  },
  'ESTJ': {
    mbtiType: 'ESTJ',
    preferredTools: ['scheduleReminder', 'taskPlanning', 'processOptimization', 'leadershipDevelopment'],
    coachingStyle: 'directive',
    focusAreas: ['organization', 'leadership', 'efficiency', 'goal_achievement'],
    communicationPreferences: ['direct', 'practical', 'results_oriented', 'structured'],
    optimalSessionLength: 45,
    autonomyLevel: 'medium'
  },
  'ESFJ': {
    mbtiType: 'ESFJ',
    preferredTools: ['socialConnection', 'empathyMapping', 'scheduleReminder', 'harmonyAnalysis'],
    coachingStyle: 'supportive',
    focusAreas: ['harmony', 'helping_others', 'community', 'emotional_support'],
    communicationPreferences: ['warm', 'personal', 'encouraging', 'harmony_focused'],
    optimalSessionLength: 40,
    autonomyLevel: 'low'
  },
  'ISTP': {
    mbtiType: 'ISTP',
    preferredTools: ['analyzeText', 'processOptimization', 'generateInsights', 'taskPlanning'],
    coachingStyle: 'directive',
    focusAreas: ['practical_skills', 'problem_solving', 'independence', 'efficiency'],
    communicationPreferences: ['concise', 'practical', 'action_oriented', 'logical'],
    optimalSessionLength: 35,
    autonomyLevel: 'high'
  },
  'ISFP': {
    mbtiType: 'ISFP',
    preferredTools: ['generateInsights', 'creativeExpression', 'analyzeText', 'valueAlignment'],
    coachingStyle: 'supportive',
    focusAreas: ['authenticity', 'values', 'creativity', 'personal_growth'],
    communicationPreferences: ['gentle', 'personal', 'values_based', 'non_judgmental'],
    optimalSessionLength: 50,
    autonomyLevel: 'low'
  },
  'ESTP': {
    mbtiType: 'ESTP',
    preferredTools: ['taskPlanning', 'analyzeText', 'generateInsights', 'socialConnection'],
    coachingStyle: 'challenging',
    focusAreas: ['action', 'practical_solutions', 'social_dynamics', 'opportunity_seizing'],
    communicationPreferences: ['direct', 'energetic', 'practical', 'spontaneous'],
    optimalSessionLength: 30,
    autonomyLevel: 'medium'
  },
  'ESFP': {
    mbtiType: 'ESFP',
    preferredTools: ['socialConnection', 'generateInsights', 'creativeExpression', 'empathyMapping'],
    coachingStyle: 'collaborative',
    focusAreas: ['enjoyment', 'relationships', 'creativity', 'living_in_the_moment'],
    communicationPreferences: ['warm', 'fun', 'engaging', 'people_oriented'],
    optimalSessionLength: 35,
    autonomyLevel: 'low'
  }
};

// Personal MBTI Coach Service
export class PersonalMBTICoachService {
  private database: Database;
  private userId: string;

  constructor(database: Database, userId: string) {
    this.database = database;
    this.userId = userId;
  }

  /**
   * Generate personalized daily coaching plan
   */
  async generateDailyCoaching(mbtiType: string, userGoals?: string[]): Promise<DailyCoachingPlan> {
    try {
      logger.info('Generating daily coaching plan', { mbtiType, userId: this.userId });

      const profile = this.getMBTIProfile(mbtiType);
      const userContext = await this.getUserContext();

      // Call Agent Executor voor coaching plan
      const response = await this.callAgentExecutor({
        goal: `Generate personalized daily coaching plan for ${mbtiType}`,
        userId: this.userId,
        mbtiType: mbtiType,
        maxDuration: 2, // 2 hours max
        supervisionLevel: 'checkpoints',
        allowedTools: profile.preferredTools,
        context: {
          profile,
          userGoals: userGoals || [],
          userContext,
          sessionLength: profile.optimalSessionLength
        }
      });

      if (response.status === 'completed') {
        const plan = this.parseCoachingPlan(response.results, mbtiType);
        await this.storeCoachingPlan(plan);
        return plan;
      } else {
        throw new Error(`Coaching plan generation failed: ${response.error || 'Unknown error'}`);
      }

    } catch (error) {
      logger.error('Failed to generate daily coaching plan', { 
        error: error instanceof Error ? error.message : String(error),
        mbtiType,
        userId: this.userId
      });
      
      // Fallback: Simple coaching plan
      return this.generateFallbackPlan(mbtiType);
    }
  }

  /**
   * Get MBTI-specific coaching recommendations
   */
  async getMBTISpecificRecommendations(mbtiType: string, currentMood?: string): Promise<string[]> {
    const profile = this.getMBTIProfile(mbtiType);
    
    try {
      const response = await this.callAgentExecutor({
        goal: `Generate MBTI-specific recommendations for ${mbtiType}${currentMood ? ` feeling ${currentMood}` : ''}`,
        userId: this.userId,
        mbtiType: mbtiType,
        maxDuration: 0.5, // 30 minutes
        allowedTools: ['generateInsights', 'analyzeText'],
        context: {
          profile,
          currentMood,
          focusAreas: profile.focusAreas
        }
      });

      if (response.status === 'completed') {
        return this.extractRecommendations(response.results);
      }

    } catch (error) {
      logger.error('Failed to get MBTI recommendations', { error, mbtiType });
    }

    // Fallback recommendations
    return this.getFallbackRecommendations(mbtiType);
  }

  /**
   * Execute autonomous coaching session
   */
  async executeAutonomousCoaching(
    goal: string, 
    duration: number = 4,
    supervisionLevel: 'none' | 'checkpoints' | 'realtime' = 'checkpoints'
  ): Promise<any> {
    
    const userMBTI = await this.getUserMBTI();
    if (!userMBTI) {
      throw new Error('User MBTI type required for autonomous coaching');
    }

    const profile = this.getMBTIProfile(userMBTI);
    
    logger.info('Starting autonomous coaching session', {
      goal,
      duration,
      mbtiType: userMBTI,
      userId: this.userId
    });

    return await this.callAgentExecutor({
      goal: `Autonomous coaching session: ${goal}`,
      userId: this.userId,
      mbtiType: userMBTI,
      maxDuration: duration,
      supervisionLevel: supervisionLevel,
      allowedTools: profile.preferredTools,
      context: {
        profile,
        coachingStyle: profile.coachingStyle,
        autonomyLevel: profile.autonomyLevel
      }
    });
  }

  /**
   * Get optimal tools for MBTI type
   */
  getOptimalToolsForType(mbtiType: string): string[] {
    const profile = this.getMBTIProfile(mbtiType);
    return profile.preferredTools;
  }

  /**
   * Analyze coaching progress
   */
  async analyzeCoachingProgress(timeframe: 'week' | 'month' | 'quarter' = 'week'): Promise<any> {
    try {
      // Get historical coaching data from V14 database
      const historicalData = await this.getHistoricalCoachingData(timeframe);
      const userMBTI = await this.getUserMBTI();

      if (!userMBTI) {
        throw new Error('User MBTI required for progress analysis');
      }

      const response = await this.callAgentExecutor({
        goal: `Analyze coaching progress over ${timeframe}`,
        userId: this.userId,
        mbtiType: userMBTI,
        maxDuration: 1,
        allowedTools: ['analyzeText', 'generateInsights'],
        context: {
          historicalData,
          timeframe,
          mbtiProfile: this.getMBTIProfile(userMBTI)
        }
      });

      return response;

    } catch (error) {
      logger.error('Failed to analyze coaching progress', { error });
      throw error;
    }
  }

  // Private helper methods

  private getMBTIProfile(mbtiType: string): MBTICoachingProfile {
    const profile = MBTI_COACHING_PROFILES[mbtiType];
    
    if (!profile) {
      logger.warn(`No coaching profile found for MBTI type: ${mbtiType}`);
      // Return generic profile
      return {
        mbtiType: mbtiType,
        preferredTools: ['generateInsights', 'analyzeText', 'scheduleReminder'],
        coachingStyle: 'collaborative',
        focusAreas: ['personal_growth', 'self_awareness'],
        communicationPreferences: ['supportive', 'personalized'],
        optimalSessionLength: 45,
        autonomyLevel: 'medium'
      };
    }

    return profile;
  }

  private async getUserContext(): Promise<any> {
    try {
      // Get user context from V14 database
      const users = this.database.collections.get<User>('users');
      const user = await users.find(this.userId);
      
      return {
        name: user.name,
        mbtiType: user.mbtiType,
        premiumStatus: user.premiumStatus,
        recentActivity: await this.getRecentActivity(),
        preferences: await this.getUserPreferences()
      };
    } catch (error) {
      logger.error('Failed to get user context', { error });
      return {};
    }
  }

  private async getUserMBTI(): Promise<string | null> {
    try {
      const users = this.database.collections.get<User>('users');
      const user = await users.find(this.userId);
      return user.mbtiType;
    } catch (error) {
      logger.error('Failed to get user MBTI', { error });
      return null;
    }
  }

  private async callAgentExecutor(request: any): Promise<any> {
    try {
      const response = await fetch('/api/agent-executor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'execute',
          ...request
        })
      });

      if (!response.ok) {
        throw new Error(`Agent executor failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      logger.error('Agent executor call failed', { error });
      throw error;
    }
  }

  private parseCoachingPlan(agentResults: any, mbtiType: string): DailyCoachingPlan {
    // Parse agent executor results into structured coaching plan
    try {
      const today = new Date().toISOString().split('T')[0];
      
      return {
        date: today,
        mbtiType: mbtiType,
        primaryGoal: agentResults.primaryGoal || 'Personal development',
        tasks: agentResults.tasks || [],
        estimatedDuration: agentResults.totalDuration || 60,
        personalizedInsights: agentResults.insights || [],
        nextSteps: agentResults.nextSteps || []
      };
    } catch (error) {
      logger.error('Failed to parse coaching plan', { error });
      return this.generateFallbackPlan(mbtiType);
    }
  }

  private generateFallbackPlan(mbtiType: string): DailyCoachingPlan {
    const profile = this.getMBTIProfile(mbtiType);
    const today = new Date().toISOString().split('T')[0];

    return {
      date: today,
      mbtiType: mbtiType,
      primaryGoal: `${mbtiType} personal development`,
      tasks: [
        {
          id: 'fallback_task_1',
          title: `${mbtiType} Reflection`,
          description: `Spend time reflecting on your ${mbtiType} strengths`,
          toolsUsed: ['generateInsights'],
          priority: 'medium',
          estimatedMinutes: 15,
          mbtiRelevance: `Aligned with ${mbtiType} introspective needs`,
          expectedOutcome: 'Increased self-awareness'
        }
      ],
      estimatedDuration: profile.optimalSessionLength,
      personalizedInsights: [`As an ${mbtiType}, focus on your natural strengths today`],
      nextSteps: ['Continue exploring your MBTI development']
    };
  }

  private async storeCoachingPlan(plan: DailyCoachingPlan): Promise<void> {
    try {
      // Store in V14 database for future analysis
      const coachingPlans = this.database.collections.get('coaching_plans');
      
      await this.database.write(async () => {
        await coachingPlans.create((coachingPlan: any) => {
          coachingPlan.userId = this.userId;
          coachingPlan.date = plan.date;
          coachingPlan.mbtiType = plan.mbtiType;
          coachingPlan.planData = JSON.stringify(plan);
          coachingPlan.createdAt = Date.now();
        });
      });

      logger.info('Coaching plan stored successfully', { 
        date: plan.date, 
        mbtiType: plan.mbtiType 
      });

    } catch (error) {
      logger.error('Failed to store coaching plan', { error });
    }
  }

  private extractRecommendations(agentResults: any): string[] {
    try {
      if (agentResults.recommendations) return agentResults.recommendations;
      if (agentResults.insights) return agentResults.insights;
      
      // Extract from text results
      const text = agentResults.finalOutputs?.join(' ') || '';
      return text.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 5);
      
    } catch (error) {
      logger.error('Failed to extract recommendations', { error });
      return [];
    }
  }

  private getFallbackRecommendations(mbtiType: string): string[] {
    const profile = this.getMBTIProfile(mbtiType);
    
    return [
      `Focus on your ${mbtiType} strengths today`,
      `Consider activities that align with ${profile.focusAreas[0]}`,
      `Take time for ${profile.coachingStyle} self-reflection`,
      `Use your natural ${mbtiType} approach to problem-solving`,
      `Connect with others who appreciate your ${mbtiType} perspective`
    ];
  }

  private async getRecentActivity(): Promise<any> {
    // Get recent user activity from database
    try {
      const chatMessages = this.database.collections.get<ChatMessage>('chat_messages');
      const recentChats = await chatMessages
        .query(Q.where('user_id', this.userId), Q.take(5));
      
      return {
        recentChats: recentChats.length,
        lastActiveDate: Date.now()
      };
    } catch (error) {
      return { recentChats: 0, lastActiveDate: Date.now() };
    }
  }

  private async getUserPreferences(): Promise<any> {
    try {
      const settings = this.database.collections.get<Setting>('settings');
      const userSettings = await settings
        .query(Q.where('user_id', this.userId));
      
      return userSettings.reduce((prefs: any, setting: Setting) => {
        prefs[setting.key] = setting.value;
        return prefs;
      }, {});
    } catch (error) {
      return {};
    }
  }

  private async getHistoricalCoachingData(timeframe: string): Promise<any> {
    try {
      const days = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 90;
      const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

      const coachingPlans = this.database.collections.get('coaching_plans');
      const historicalPlans = await coachingPlans
        .query(
          Q.where('user_id', this.userId),
          Q.where('created_at', Q.gte(cutoffDate))
        );

      return {
        totalSessions: historicalPlans.length,
        timeframe: timeframe,
        plans: historicalPlans.map((plan: any) => ({
          date: plan.date,
          mbtiType: plan.mbtiType,
          planData: JSON.parse(plan.planData || '{}')
        }))
      };
    } catch (error) {
      logger.error('Failed to get historical coaching data', { error });
      return { totalSessions: 0, timeframe, plans: [] };
    }
  }

  /**
   * 🌊 Adaptive Session Management - Mary's Enhancement
   */
  async startAdaptiveSession(
    sessionId: string,
    mbtiType: string,
    initialComplexity: number = 3
  ): Promise<{ sessionId: string, initialSetup: any }> {
    try {
      logger.info('Starting adaptive coaching session', { sessionId, mbtiType });

      const profile = this.getMBTIProfile(mbtiType);
      const adaptiveSetup = {
        sessionId,
        mbtiType,
        currentComplexity: initialComplexity,
        engagementScore: 5, // Starting neutral
        moodState: 'neutral',
        sessionPace: this.determineOptimalPace(mbtiType),
        adaptationHistory: [],
        startTime: new Date().toISOString()
      };

      // Store initial adaptive data
      await this.storeAdaptiveSessionData(adaptiveSetup);

      return {
        sessionId,
        initialSetup: adaptiveSetup
      };

    } catch (error) {
      logger.error('Failed to start adaptive session', { error, sessionId });
      throw error;
    }
  }

  /**
   * 📊 Update Session Adaptation Based on User Response
   */
  async updateSessionAdaptation(
    sessionId: string,
    userResponse: string,
    responseTime: number,
    engagementIndicators: any
  ): Promise<{ adaptations: string[], newComplexity: number, shouldContinue: boolean }> {
    try {
      const currentData = await this.getAdaptiveSessionData(sessionId);
      if (!currentData) {
        throw new Error('Session data not found');
      }

      // Analyze user response for adaptation triggers
      const analysis = await this.analyzeUserResponse(userResponse, responseTime, engagementIndicators);

      // Determine adaptations needed
      const adaptations = this.determineAdaptations(analysis, currentData);

      // Calculate new complexity level
      const newComplexity = this.calculateNewComplexity(currentData.currentComplexity, analysis);

      // Update session data
      await this.updateAdaptiveSessionData(sessionId, {
        ...currentData,
        currentComplexity: newComplexity,
        engagementScore: analysis.engagementScore,
        detectedMood: analysis.detectedMood,
        adaptationHistory: [...(currentData.adaptationHistory || []), {
          timestamp: new Date().toISOString(),
          trigger: analysis.trigger,
          adaptation: adaptations,
          complexityChange: newComplexity - currentData.currentComplexity
        }]
      });

      // Determine if session should continue
      const shouldContinue = this.shouldContinueSession(analysis, currentData);

      return {
        adaptations,
        newComplexity,
        shouldContinue
      };

    } catch (error) {
      logger.error('Failed to update session adaptation', { error, sessionId });
      return {
        adaptations: [],
        newComplexity: 3,
        shouldContinue: true
      };
    }
  }

  /**
   * 🎯 Determine Optimal Session Pace for MBTI Type
   */
  private determineOptimalPace(mbtiType: string): string {
    const paceMap: Record<string, string> = {
      'INTJ': 'fast',     // Quick, efficient
      'INTP': 'fast',     // Logical, concise
      'ENTJ': 'fast',     // Results-oriented
      'ENTP': 'normal',   // Dynamic but needs processing time
      'INFJ': 'normal',   // Deep, thoughtful
      'INFP': 'slow',     // Values-based, needs time to process
      'ENFJ': 'normal',   // People-focused, balanced
      'ENFP': 'normal',   // Enthusiastic but can be scattered
      'ISTJ': 'normal',   // Methodical, steady
      'ISFJ': 'slow',     // Careful, detail-oriented
      'ESTJ': 'normal',   // Practical, direct
      'ESFJ': 'slow',     // Warm, relationship-focused
      'ISTP': 'fast',     // Action-oriented, concise
      'ISFP': 'slow',     // Gentle, personal
      'ESTP': 'fast',     // Energetic, direct
      'ESFP': 'normal'    // Fun, engaging
    };

    return paceMap[mbtiType] || 'normal';
  }

  /**
   * 🔍 Analyze User Response for Adaptation Triggers
   */
  private async analyzeUserResponse(
    response: string,
    responseTime: number,
    engagementIndicators: any
  ): Promise<{
    engagementScore: number,
    detectedMood: string,
    trigger: string,
    needsAdaptation: boolean
  }> {
    // Simple analysis - in production this would use ML/NLP
    const responseLength = response.length;
    const hasQuestions = response.includes('?');
    const hasPositiveWords = /\b(good|great|excellent|yes|sure|okay)\b/i.test(response);
    const hasNegativeWords = /\b(confused|lost|overwhelmed|tired|difficult|hard)\b/i.test(response);

    let engagementScore = 5; // Base score
    let detectedMood = 'neutral';
    let trigger = 'none';

    // Adjust based on response time
    if (responseTime < 5) engagementScore += 1; // Quick response = engaged
    if (responseTime > 30) engagementScore -= 1; // Slow response = disengaged

    // Adjust based on content
    if (hasPositiveWords) {
      engagementScore += 1;
      detectedMood = 'positive';
    }
    if (hasNegativeWords) {
      engagementScore -= 1;
      detectedMood = 'frustrated';
      trigger = 'overwhelm_detected';
    }
    if (responseLength < 10) {
      engagementScore -= 0.5; // Very short responses might indicate disengagement
    }
    if (hasQuestions) {
      engagementScore += 0.5; // Questions show engagement
    }

    // Clamp score between 1-10
    engagementScore = Math.max(1, Math.min(10, engagementScore));

    return {
      engagementScore,
      detectedMood,
      trigger,
      needsAdaptation: trigger !== 'none' || engagementScore < 4 || engagementScore > 8
    };
  }

  /**
   * 🔄 Determine Required Adaptations
   */
  private determineAdaptations(
    analysis: any,
    sessionData: any
  ): string[] {
    const adaptations: string[] = [];

    if (analysis.trigger === 'overwhelm_detected') {
      adaptations.push('reduce_complexity');
      adaptations.push('break_into_smaller_steps');
      adaptations.push('provide_more_examples');
    }

    if (analysis.engagementScore < 4) {
      adaptations.push('increase_engagement');
      adaptations.push('switch_to_more_interactive_style');
      adaptations.push('ask_direct_questions');
    }

    if (analysis.engagementScore > 8) {
      adaptations.push('maintain_high_engagement');
      adaptations.push('introduce_challenge');
    }

    if (analysis.detectedMood === 'frustrated') {
      adaptations.push('provide_encouragement');
      adaptations.push('simplify_explanation');
    }

    return adaptations;
  }

  /**
   * 📈 Calculate New Complexity Level
   */
  private calculateNewComplexity(currentComplexity: number, analysis: any): number {
    let newComplexity = currentComplexity;

    if (analysis.trigger === 'overwhelm_detected') {
      newComplexity = Math.max(1, currentComplexity - 1);
    } else if (analysis.engagementScore > 7) {
      newComplexity = Math.min(5, currentComplexity + 0.5);
    } else if (analysis.engagementScore < 4) {
      newComplexity = Math.max(1, currentComplexity - 0.5);
    }

    return Math.round(newComplexity * 10) / 10; // Round to 1 decimal
  }

  /**
   * ✅ Determine if Session Should Continue
   */
  private shouldContinueSession(analysis: any, sessionData: any): boolean {
    // Continue if engagement is reasonable and no severe issues
    return analysis.engagementScore >= 3 && analysis.trigger !== 'severe_overwhelm';
  }

  /**
   * 💾 Store Adaptive Session Data
   */
  private async storeAdaptiveSessionData(data: any): Promise<void> {
    // In production, this would store in the AdaptiveSessionData model
    // For now, we'll use local storage or session storage
    logger.info('Storing adaptive session data', { sessionId: data.sessionId });
  }

  /**
   * 📖 Get Adaptive Session Data
   */
  private async getAdaptiveSessionData(sessionId: string): Promise<any> {
    // In production, this would query the AdaptiveSessionData model
    // For now, return mock data
    return {
      sessionId,
      currentComplexity: 3,
      engagementScore: 5,
      adaptationHistory: []
    };
  }

  /**
   * 🔄 Update Adaptive Session Data
   */
  private async updateAdaptiveSessionData(sessionId: string, data: any): Promise<void> {
    // In production, this would update the AdaptiveSessionData model
    logger.info('Updating adaptive session data', { sessionId });
  }
}

// Export singleton factory
export const createPersonalMBTICoach = (database: Database, userId: string) => {
  return new PersonalMBTICoachService(database, userId);
};

export default PersonalMBTICoachService;
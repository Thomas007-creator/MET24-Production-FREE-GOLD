/**
 * Active Imagination AI Service for MET24 Phase 2
 * 
 * Handles AI-powered active imagination using text embeddings and sentiment analysis
 * 
 * @version 3.0.0-light-ai
 */

import { textEmbeddingsService } from './textEmbeddingsService';
import { sentimentAnalysisService } from './sentimentAnalysisService';

export interface ImaginationPrompt {
  id: string;
  text: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mbtiType?: string;
  tags: string[];
}

export interface ImaginationSession {
  id: string;
  userId: string;
  title: string;
  prompts: ImaginationPrompt[];
  responses: string[];
  insights: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  emotions: string[];
  createdAt: Date;
  completedAt?: Date;
}

export interface ImaginationInsight {
  type: 'pattern' | 'emotion' | 'theme' | 'suggestion';
  content: string;
  confidence: number;
  source: string;
}

export class ActiveImaginationAIService {
  private prompts: ImaginationPrompt[] = [];
  private sessions: Map<string, ImaginationSession> = new Map();

  constructor() {
    this.initializePrompts();
  }

  /**
   * Initialize imagination prompts
   */
  private initializePrompts(): void {
    this.prompts = [
      {
        id: 'nature-walk',
        text: 'Stel je voor dat je door een rustig bos loopt. Wat zie je om je heen? Welke geluiden hoor je?',
        category: 'nature',
        difficulty: 'beginner',
        tags: ['nature', 'peace', 'mindfulness']
      },
      {
        id: 'childhood-memory',
        text: 'Denk terug aan een gelukkige herinnering uit je kindertijd. Waar was je? Wat deed je?',
        category: 'memory',
        difficulty: 'beginner',
        tags: ['memory', 'happiness', 'nostalgia']
      },
      {
        id: 'future-self',
        text: 'Stel je voor dat je je toekomstige zelf ontmoet. Wat zou je willen vragen? Wat zou je willen weten?',
        category: 'future',
        difficulty: 'intermediate',
        tags: ['future', 'self-reflection', 'goals']
      },
      {
        id: 'creative-space',
        text: 'Creëer in je geest een ruimte waar je je volledig creatief kunt uiten. Hoe ziet deze ruimte eruit?',
        category: 'creativity',
        difficulty: 'intermediate',
        tags: ['creativity', 'expression', 'art']
      },
      {
        id: 'inner-wisdom',
        text: 'Stel je voor dat je je innerlijke wijsheid kunt raadplegen. Wat zou het je vertellen?',
        category: 'wisdom',
        difficulty: 'advanced',
        tags: ['wisdom', 'intuition', 'guidance']
      }
    ];
  }

  /**
   * Start a new imagination session
   */
  async startSession(userId: string, title: string, mbtiType?: string): Promise<ImaginationSession> {
    try {
      const session: ImaginationSession = {
        id: this.generateId(),
        userId,
        title,
        prompts: this.getPersonalizedPrompts(mbtiType),
        responses: [],
        insights: [],
        sentiment: 'neutral',
        emotions: [],
        createdAt: new Date()
      };

      this.sessions.set(session.id, session);
      return session;
    } catch (error) {
      console.error('Active Imagination AI Service: Error starting session', error);
      throw error;
    }
  }

  /**
   * Add response to session
   */
  async addResponse(sessionId: string, response: string): Promise<ImaginationSession> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.responses.push(response);

      // Analyze response with AI
      const insights = await this.analyzeResponse(response);
      session.insights.push(...insights);

      // Update sentiment and emotions
      const sentimentResult = await sentimentAnalysisService.analyzeSentiment(response);
      const emotionResult = await sentimentAnalysisService.analyzeEmotions(response);

      session.sentiment = sentimentResult.sentiment;
      session.emotions = Object.entries(emotionResult.emotions)
        .filter(([_, score]) => score > 0.3)
        .map(([emotion, _]) => emotion);

      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      console.error('Active Imagination AI Service: Error adding response', error);
      throw error;
    }
  }

  /**
   * Complete session
   */
  async completeSession(sessionId: string): Promise<ImaginationSession> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      session.completedAt = new Date();

      // Generate final insights
      const finalInsights = await this.generateFinalInsights(session);
      session.insights.push(...finalInsights);

      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      console.error('Active Imagination AI Service: Error completing session', error);
      throw error;
    }
  }

  /**
   * Get personalized prompts based on MBTI type
   */
  private getPersonalizedPrompts(mbtiType?: string): ImaginationPrompt[] {
    let selectedPrompts = [...this.prompts];

    if (mbtiType) {
      // Filter prompts based on MBTI type preferences
      switch (mbtiType) {
        case 'INTJ':
        case 'INTP':
          selectedPrompts = this.prompts.filter(p => 
            p.category === 'future' || p.category === 'wisdom'
          );
          break;
        case 'ENFP':
        case 'ENFJ':
          selectedPrompts = this.prompts.filter(p => 
            p.category === 'creativity' || p.category === 'memory'
          );
          break;
        case 'ISFJ':
        case 'ISFP':
          selectedPrompts = this.prompts.filter(p => 
            p.category === 'nature' || p.category === 'memory'
          );
          break;
        default:
          selectedPrompts = this.prompts.slice(0, 3);
      }
    }

    return selectedPrompts.slice(0, 3);
  }

  /**
   * Analyze response with AI
   */
  private async analyzeResponse(response: string): Promise<string[]> {
    try {
      const insights: string[] = [];

      // Analyze sentiment
      const sentimentResult = await sentimentAnalysisService.analyzeSentiment(response);
      if (sentimentResult.confidence > 0.7) {
        insights.push(`Je toont een ${sentimentResult.sentiment} sentiment in deze reflectie.`);
      }

      // Analyze emotions
      const emotionResult = await sentimentAnalysisService.analyzeEmotions(response);
      if (emotionResult.confidence > 0.6) {
        insights.push(`De dominante emotie in je reflectie is ${emotionResult.dominantEmotion}.`);
      }

      // Analyze themes
      const themes = this.extractThemes(response);
      if (themes.length > 0) {
        insights.push(`Je reflectie bevat thema's zoals: ${themes.join(', ')}.`);
      }

      return insights;
    } catch (error) {
      console.error('Active Imagination AI Service: Error analyzing response', error);
      return [];
    }
  }

  /**
   * Generate final insights for session
   */
  private async generateFinalInsights(session: ImaginationSession): Promise<string[]> {
    try {
      const insights: string[] = [];

      // Analyze overall sentiment trend
      const sentimentTrend = await this.analyzeSentimentTrend(session);
      insights.push(sentimentTrend);

      // Analyze emotional journey
      const emotionalJourney = this.analyzeEmotionalJourney(session);
      insights.push(emotionalJourney);

      // Generate recommendations
      const recommendations = this.generateRecommendations(session);
      insights.push(...recommendations);

      return insights;
    } catch (error) {
      console.error('Active Imagination AI Service: Error generating final insights', error);
      return [];
    }
  }

  /**
   * Analyze sentiment trend
   */
  private async analyzeSentimentTrend(session: ImaginationSession): Promise<string> {
    try {
      if (session.responses.length < 2) {
        return 'Je hebt nog niet genoeg reflecties om een trend te analyseren.';
      }

      const sentiments = await sentimentAnalysisService.analyzeSentiments(session.responses);
      const positiveCount = sentiments.filter(s => s.sentiment === 'positive').length;
      const negativeCount = sentiments.filter(s => s.sentiment === 'negative').length;

      if (positiveCount > negativeCount) {
        return 'Je toont een positieve trend in je reflecties, wat wijst op een optimistische mindset.';
      } else if (negativeCount > positiveCount) {
        return 'Je reflecties tonen een meer kritische benadering, wat kan wijzen op diep nadenken.';
      } else {
        return 'Je reflecties tonen een gebalanceerde benadering met zowel positieve als kritische elementen.';
      }
    } catch (error) {
      console.error('Active Imagination AI Service: Error analyzing sentiment trend', error);
      return 'Er was een probleem bij het analyseren van je sentiment trend.';
    }
  }

  /**
   * Analyze emotional journey
   */
  private analyzeEmotionalJourney(session: ImaginationSession): string {
    const uniqueEmotions = Array.from(new Set(session.emotions));
    
    if (uniqueEmotions.length === 0) {
      return 'Je emotionele reis is nog aan het ontwikkelen.';
    }

    if (uniqueEmotions.length === 1) {
      return `Je emotionele reis is gefocust op ${uniqueEmotions[0]}.`;
    }

    return `Je emotionele reis toont een rijke verscheidenheid: ${uniqueEmotions.join(', ')}.`;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(session: ImaginationSession): string[] {
    const recommendations: string[] = [];

    // Based on sentiment
    if (session.sentiment === 'negative') {
      recommendations.push('Overweeg om meer positieve visualisaties te oefenen.');
    }

    // Based on emotions
    if (session.emotions.includes('fear')) {
      recommendations.push('Je kunt werken aan het verminderen van angst door ontspanningsoefeningen.');
    }

    if (session.emotions.includes('joy')) {
      recommendations.push('Je toont natuurlijke vreugde - bouw hierop voort!');
    }

    // Based on response length
    const avgResponseLength = session.responses.reduce((sum, r) => sum + r.length, 0) / session.responses.length;
    if (avgResponseLength < 50) {
      recommendations.push('Probeer meer detail toe te voegen aan je reflecties voor diepere inzichten.');
    }

    return recommendations;
  }

  /**
   * Extract themes from text
   */
  private extractThemes(text: string): string[] {
    const themes: string[] = [];
    const lowerText = text.toLowerCase();

    const themeKeywords = {
      'natuur': ['boom', 'bos', 'water', 'lucht', 'zon', 'maan', 'sterren'],
      'familie': ['moeder', 'vader', 'broer', 'zus', 'familie', 'thuis'],
      'werk': ['werk', 'baan', 'carrière', 'project', 'collega'],
      'creativiteit': ['kunst', 'muziek', 'schrijven', 'schilderen', 'creatief'],
      'spiritualiteit': ['god', 'gebed', 'meditatie', 'ziel', 'spiritueel']
    };

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        themes.push(theme);
      }
    });

    return themes;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ImaginationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get sessions by user
   */
  getSessionsByUser(userId: string): ImaginationSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get all prompts
   */
  getAllPrompts(): ImaginationPrompt[] {
    return [...this.prompts];
  }

  /**
   * Get prompts by category
   */
  getPromptsByCategory(category: string): ImaginationPrompt[] {
    return this.prompts.filter(prompt => prompt.category === category);
  }

  /**
   * Get prompts by difficulty
   */
  getPromptsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): ImaginationPrompt[] {
    return this.prompts.filter(prompt => prompt.difficulty === difficulty);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `imagination_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service status
   */
  getStatus(): {
    promptsCount: number;
    activeSessions: number;
    totalSessions: number;
    ready: boolean;
  } {
    return {
      promptsCount: this.prompts.length,
      activeSessions: Array.from(this.sessions.values()).filter(s => !s.completedAt).length,
      totalSessions: this.sessions.size,
      ready: true
    };
  }
}

// Export singleton instance
export const activeImaginationAIService = new ActiveImaginationAIService();

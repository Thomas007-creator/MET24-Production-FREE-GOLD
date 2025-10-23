/**
 * Enhanced ChatLLM Service for MET24 Phase 2
 * 
 * Handles enhanced ChatLLM functionality with AI processing
 * 
 * @version 3.0.0-light-ai
 */

import { textEmbeddingsService } from './textEmbeddingsService';
import { sentimentAnalysisService } from './sentimentAnalysisService';

export interface EnhancedChatResponse {
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  emotions: string[];
  confidence: number;
  suggestions: string[];
  timestamp: Date;
}

export interface ChatCoachingSession {
  id: string;
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sentiment?: 'positive' | 'negative' | 'neutral';
    emotions?: string[];
  }>;
  coachingType: 'wellness' | 'career' | 'relationships' | 'personal-growth';
  insights: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WellnessAnalysis {
  overallMood: number;
  stressLevel: number;
  energyLevel: number;
  sleepQuality: number;
  socialConnection: number;
  recommendations: string[];
  insights: string[];
}

export class ChatLLMEnhancedService {
  private sessions: Map<string, ChatCoachingSession> = new Map();
  private isInitialized: boolean = false;

  /**
   * Initialize enhanced ChatLLM service
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('Enhanced ChatLLM Service: Initializing...');

      // Initialize AI services
      await Promise.all([
        textEmbeddingsService.initialize(),
        sentimentAnalysisService.initialize()
      ]);

      this.isInitialized = true;
      console.log('Enhanced ChatLLM Service: Initialized successfully');
    } catch (error) {
      console.error('Enhanced ChatLLM Service: Error initializing', error);
      throw error;
    }
  }

  /**
   * Start a coaching session
   */
  async startCoachingSession(
    userId: string,
    coachingType: 'wellness' | 'career' | 'relationships' | 'personal-growth'
  ): Promise<ChatCoachingSession> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const session: ChatCoachingSession = {
        id: this.generateId(),
        userId,
        messages: [],
        coachingType,
        insights: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.sessions.set(session.id, session);
      return session;
    } catch (error) {
      console.error('Enhanced ChatLLM Service: Error starting coaching session', error);
      throw error;
    }
  }

  /**
   * Send message to coaching session
   */
  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<EnhancedChatResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const session = this.sessions.get(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Analyze user message
      const sentimentResult = await sentimentAnalysisService.analyzeSentiment(message);
      const emotionResult = await sentimentAnalysisService.analyzeEmotions(message);

      // Add user message to session
      session.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
        sentiment: sentimentResult.sentiment,
        emotions: Object.entries(emotionResult.emotions)
          .filter(([_, score]) => score > 0.3)
          .map(([emotion, _]) => emotion)
      });

      // Generate enhanced response
      const response = await this.generateEnhancedResponse(session, message);

      // Add assistant response to session
      session.messages.push({
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        sentiment: response.sentiment,
        emotions: response.emotions
      });

      // Update session
      session.updatedAt = new Date();
      this.sessions.set(sessionId, session);

      return response;
    } catch (error) {
      console.error('Enhanced ChatLLM Service: Error sending message', error);
      throw error;
    }
  }

  /**
   * Generate enhanced response
   */
  private async generateEnhancedResponse(
    session: ChatCoachingSession,
    userMessage: string
  ): Promise<EnhancedChatResponse> {
    try {
      // Analyze conversation context
      const context = this.analyzeConversationContext(session);
      
      // Generate base response based on coaching type
      const baseResponse = this.generateBaseResponse(session.coachingType, userMessage, context);
      
      // Enhance response with AI insights
      const enhancedResponse = await this.enhanceResponseWithAI(baseResponse, userMessage, context);
      
      // Generate suggestions
      const suggestions = this.generateSuggestions(session.coachingType, context);
      
      return {
        content: enhancedResponse,
        sentiment: 'positive', // Default to positive for coaching
        emotions: ['supportive', 'encouraging'],
        confidence: 0.8,
        suggestions,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Enhanced ChatLLM Service: Error generating enhanced response', error);
      return {
        content: 'Ik begrijp je vraag. Laten we samen kijken hoe ik je kan helpen.',
        sentiment: 'neutral',
        emotions: ['supportive'],
        confidence: 0.5,
        suggestions: ['Kun je meer details geven?', 'Wat voel je hierbij?'],
        timestamp: new Date()
      };
    }
  }

  /**
   * Analyze conversation context
   */
  private analyzeConversationContext(session: ChatCoachingSession): any {
    const recentMessages = session.messages.slice(-5);
    const userMessages = recentMessages.filter(m => m.role === 'user');
    
    return {
      messageCount: userMessages.length,
      averageSentiment: this.calculateAverageSentiment(userMessages),
      dominantEmotions: this.getDominantEmotions(userMessages),
      conversationLength: session.messages.length,
      sessionDuration: Date.now() - session.createdAt.getTime()
    };
  }

  /**
   * Generate base response
   */
  private generateBaseResponse(
    coachingType: string,
    userMessage: string,
    context: any
  ): string {
    const responses: { [key: string]: string[] } = {
      'wellness': [
        'Ik hoor dat je bezig bent met je welzijn. Dat is een belangrijke stap.',
        'Laten we kijken naar wat je kan helpen om je beter te voelen.',
        'Je welzijn is de basis van alles. Hoe kan ik je ondersteunen?'
      ],
      'career': [
        'Je carrière is een belangrijk onderdeel van je leven. Laten we dit samen verkennen.',
        'Ik help je graag met je professionele ontwikkeling.',
        'Wat zijn je doelen op carrièregebied?'
      ],
      'relationships': [
        'Relaties zijn fundamenteel voor ons welzijn. Laten we hier samen naar kijken.',
        'Ik begrijp dat relaties complex kunnen zijn. Hoe kan ik je helpen?',
        'Wat is er aan de hand in je relaties?'
      ],
      'personal-growth': [
        'Persoonlijke groei is een mooie reis. Laten we samen kijken naar je ontwikkeling.',
        'Ik help je graag bij je persoonlijke groei.',
        'Wat wil je ontwikkelen in jezelf?'
      ]
    };

    const typeResponses = responses[coachingType] || responses['personal-growth'];
    return typeResponses[Math.floor(Math.random() * typeResponses.length)];
  }

  /**
   * Enhance response with AI
   */
  private async enhanceResponseWithAI(
    baseResponse: string,
    userMessage: string,
    context: any
  ): Promise<string> {
    try {
      // Use text embeddings to find similar responses
      const similarResponses = await textEmbeddingsService.findMostSimilar(
        userMessage,
        [baseResponse],
        1
      );

      if (similarResponses.length > 0 && similarResponses[0].similarity > 0.7) {
        return baseResponse;
      }

      // Enhance based on sentiment
      const sentimentResult = await sentimentAnalysisService.analyzeSentiment(userMessage);
      
      if (sentimentResult.sentiment === 'negative') {
        return `${baseResponse} Ik merk dat je misschien wat moeite hebt. Laten we samen kijken hoe we dit kunnen aanpakken.`;
      } else if (sentimentResult.sentiment === 'positive') {
        return `${baseResponse} Het is geweldig om te horen dat je positief bent! Laten we bouwen op deze energie.`;
      }

      return baseResponse;
    } catch (error) {
      console.error('Enhanced ChatLLM Service: Error enhancing response with AI', error);
      return baseResponse;
    }
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(
    coachingType: string,
    context: any
  ): string[] {
    const suggestions: { [key: string]: string[] } = {
      'wellness': [
        'Probeer een ontspanningsoefening',
        'Plan wat tijd voor jezelf in',
        'Beweeg regelmatig',
        'Zorg voor voldoende slaap'
      ],
      'career': [
        'Stel concrete doelen op',
        'Netwerk met collega\'s',
        'Volg een cursus',
        'Vraag om feedback'
      ],
      'relationships': [
        'Communiceer open en eerlijk',
        'Luister actief naar de ander',
        'Toon waardering',
        'Los conflicten samen op'
      ],
      'personal-growth': [
        'Reflecteer dagelijks',
        'Stel jezelf uitdagingen',
        'Leer nieuwe vaardigheden',
        'Omring je met positieve mensen'
      ]
    };

    const typeSuggestions = suggestions[coachingType] || suggestions['personal-growth'];
    return typeSuggestions.slice(0, 3);
  }

  /**
   * Perform wellness analysis
   */
  async performWellnessAnalysis(userId: string): Promise<WellnessAnalysis> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get user's recent messages
      const userSessions = Array.from(this.sessions.values())
        .filter(session => session.userId === userId && session.coachingType === 'wellness')
        .slice(0, 5);

      const recentMessages = userSessions
        .flatMap(session => session.messages)
        .filter(message => message.role === 'user')
        .slice(0, 20);

      if (recentMessages.length === 0) {
        return {
          overallMood: 5,
          stressLevel: 5,
          energyLevel: 5,
          sleepQuality: 5,
          socialConnection: 5,
          recommendations: ['Begin met dagelijkse reflectie'],
          insights: ['Nog geen voldoende data voor analyse']
        };
      }

      // Analyze sentiment and emotions
      const sentiments = await sentimentAnalysisService.analyzeSentiments(
        recentMessages.map(m => m.content)
      );

      const emotions = await sentimentAnalysisService.analyzeEmotionsBatch(
        recentMessages.map(m => m.content)
      );

      // Calculate wellness metrics
      const overallMood = this.calculateOverallMood(sentiments);
      const stressLevel = this.calculateStressLevel(emotions);
      const energyLevel = this.calculateEnergyLevel(emotions);
      const sleepQuality = this.calculateSleepQuality(recentMessages);
      const socialConnection = this.calculateSocialConnection(recentMessages);

      // Generate recommendations
      const recommendations = this.generateWellnessRecommendations({
        overallMood,
        stressLevel,
        energyLevel,
        sleepQuality,
        socialConnection
      });

      // Generate insights
      const insights = this.generateWellnessInsights(sentiments, emotions);

      return {
        overallMood,
        stressLevel,
        energyLevel,
        sleepQuality,
        socialConnection,
        recommendations,
        insights
      };
    } catch (error) {
      console.error('Enhanced ChatLLM Service: Error performing wellness analysis', error);
      throw error;
    }
  }

  /**
   * Calculate overall mood
   */
  private calculateOverallMood(sentiments: any[]): number {
    const positiveCount = sentiments.filter(s => s.sentiment === 'positive').length;
    const negativeCount = sentiments.filter(s => s.sentiment === 'negative').length;
    const total = sentiments.length;
    
    if (total === 0) return 5;
    
    const moodScore = (positiveCount - negativeCount) / total;
    return Math.max(1, Math.min(10, 5 + moodScore * 5));
  }

  /**
   * Calculate stress level
   */
  private calculateStressLevel(emotions: any[]): number {
    const stressEmotions = ['fear', 'anger', 'sadness'];
    let stressScore = 0;
    
    emotions.forEach(emotion => {
      stressEmotions.forEach(stressEmotion => {
        if (emotion.emotions[stressEmotion] > 0.3) {
          stressScore += emotion.emotions[stressEmotion];
        }
      });
    });
    
    return Math.max(1, Math.min(10, stressScore * 10));
  }

  /**
   * Calculate energy level
   */
  private calculateEnergyLevel(emotions: any[]): number {
    const energyEmotions = ['joy', 'surprise'];
    let energyScore = 0;
    
    emotions.forEach(emotion => {
      energyEmotions.forEach(energyEmotion => {
        if (emotion.emotions[energyEmotion] > 0.3) {
          energyScore += emotion.emotions[energyEmotion];
        }
      });
    });
    
    return Math.max(1, Math.min(10, energyScore * 10));
  }

  /**
   * Calculate sleep quality
   */
  private calculateSleepQuality(messages: any[]): number {
    const sleepKeywords = ['slaap', 'moe', 'uitgerust', 'wakker', 'droom'];
    let sleepScore = 5;
    
    messages.forEach(message => {
      const content = message.content.toLowerCase();
      sleepKeywords.forEach(keyword => {
        if (content.includes(keyword)) {
          if (keyword === 'uitgerust' || keyword === 'wakker') {
            sleepScore += 1;
          } else if (keyword === 'moe' || keyword === 'slaap') {
            sleepScore -= 1;
          }
        }
      });
    });
    
    return Math.max(1, Math.min(10, sleepScore));
  }

  /**
   * Calculate social connection
   */
  private calculateSocialConnection(messages: any[]): number {
    const socialKeywords = ['vriend', 'familie', 'sociaal', 'alleen', 'eenzaam'];
    let socialScore = 5;
    
    messages.forEach(message => {
      const content = message.content.toLowerCase();
      socialKeywords.forEach(keyword => {
        if (content.includes(keyword)) {
          if (keyword === 'vriend' || keyword === 'familie' || keyword === 'sociaal') {
            socialScore += 1;
          } else if (keyword === 'alleen' || keyword === 'eenzaam') {
            socialScore -= 1;
          }
        }
      });
    });
    
    return Math.max(1, Math.min(10, socialScore));
  }

  /**
   * Generate wellness recommendations
   */
  private generateWellnessRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    
    if (metrics.overallMood < 4) {
      recommendations.push('Focus op positieve activiteiten');
    }
    
    if (metrics.stressLevel > 7) {
      recommendations.push('Probeer ontspanningsoefeningen');
    }
    
    if (metrics.energyLevel < 4) {
      recommendations.push('Zorg voor voldoende beweging');
    }
    
    if (metrics.sleepQuality < 4) {
      recommendations.push('Verbeter je slaaproutine');
    }
    
    if (metrics.socialConnection < 4) {
      recommendations.push('Investeer in sociale contacten');
    }
    
    return recommendations.length > 0 ? recommendations : ['Blijf doorgaan met je huidige aanpak'];
  }

  /**
   * Generate wellness insights
   */
  private generateWellnessInsights(sentiments: any[], emotions: any[]): string[] {
    const insights: string[] = [];
    
    const positiveSentiments = sentiments.filter(s => s.sentiment === 'positive').length;
    const totalSentiments = sentiments.length;
    
    if (positiveSentiments / totalSentiments > 0.7) {
      insights.push('Je toont een overwegend positieve mindset');
    } else if (positiveSentiments / totalSentiments < 0.3) {
      insights.push('Je zou kunnen profiteren van meer positieve focus');
    }
    
    const dominantEmotions = emotions.map(e => e.dominantEmotion);
    const uniqueEmotions = [...new Set(dominantEmotions)];
    
    if (uniqueEmotions.length > 3) {
      insights.push('Je ervaart een rijke verscheidenheid aan emoties');
    }
    
    return insights.length > 0 ? insights : ['Je welzijn ontwikkelt zich geleidelijk'];
  }

  /**
   * Calculate average sentiment
   */
  private calculateAverageSentiment(messages: any[]): number {
    if (messages.length === 0) return 0;
    
    const sentimentScores = messages.map(m => {
      switch (m.sentiment) {
        case 'positive': return 1;
        case 'negative': return -1;
        default: return 0;
      }
    });
    
    return (sentimentScores as any[]).reduce((sum: number, score: any) => sum + score, 0) / messages.length;
  }

  /**
   * Get dominant emotions
   */
  private getDominantEmotions(messages: any[]): string[] {
    const allEmotions = messages.flatMap(m => m.emotions || []);
    const emotionCounts: { [key: string]: number } = {};
    
    allEmotions.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    return Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([emotion, _]) => emotion);
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): ChatCoachingSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get sessions by user
   */
  getSessionsByUser(userId: string): ChatCoachingSession[] {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `chat_enhanced_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    activeSessions: number;
    totalSessions: number;
    ready: boolean;
  } {
    return {
      initialized: this.isInitialized,
      activeSessions: this.sessions.size,
      totalSessions: this.sessions.size,
      ready: this.isInitialized
    };
  }
}

// Export singleton instance
export const chatLLMEnhancedService = new ChatLLMEnhancedService();

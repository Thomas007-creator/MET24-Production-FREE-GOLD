/**
 * ChatLLM RAG (Retrieval-Augmented Generation) Service
 * Kennisbank-gedreven AI responses met MET24-V14-Production-Supabase Stack
 * 
 * Features:
 * - User Profile Retrieval (MBTI, waarden, mood, goals)
 * - Journal Context Integration (trends, themes, patterns)
 * - Community Data Augmentation (Discourse topics, MBTI patterns)
 * - Content Library Access (artikelen, videos, oefeningen)
 * - Lokale Embedding Search (WatermelonDB + Supabase pgvector)
 * 
 * @version 1.0.0 - MET2.4-V14-Production-Ready
 * @author Thomas - MET24 Production Team
 */

import database from '../database/v14/database';
import { Q } from '@nozbe/watermelondb';
import { chatLLMService } from './chatLLMService';
import { aiOrchestrationService, OrchestrationRequest } from './aiOrchestrationService';
import { supabase } from '../lib/supabaseClient';

// RAG Types & Interfaces
export interface RAGContext {
  userProfile: UserRAGProfile;
  journalContext: JournalRAGContext;
  communityData: CommunityRAGContext;
  contentLibrary: ContentRAGContext;
  relevanceScore: number;
  retrievalTimestamp: string;
}

export interface UserRAGProfile {
  userId: string;
  mbtiType: string;
  coreValues: string[];
  currentMood: string;
  primaryGoals: string[];
  recentInteractions: string[];
  personalityInsights: any;
  preferredContentTypes: string[];
}

export interface JournalRAGContext {
  recentEntries: JournalRAGEntry[];
  thematicPatterns: string[];
  emotionalTrends: any[];
  growthIndicators: string[];
  triggerTopics: string[];
  journalingFrequency: string;
}

export interface JournalRAGEntry {
  id: string;
  content: string;
  mood: string;
  themes: string[];
  date: string;
  insights: string[];
  sanitizedContent: string;
}

export interface CommunityRAGContext {
  relevantDiscourseTopics: DiscourseRAGTopic[];
  mbtiCommunityTrends: MBTICommunityTrend[];
  popularContent: PopularContentRAG[];
  communityInsights: string[];
  engagementPatterns: any;
}

export interface DiscourseRAGTopic {
  id: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  mbtiRelevance: string[];
  topicTags: string[];
  sentiment: string;
}

export interface MBTICommunityTrend {
  mbtiType: string;
  trendingTopics: string[];
  commonChallenges: string[];
  successfulStrategies: string[];
  communitySize: number;
  engagementRate: number;
}

export interface ContentRAGContext {
  relevantArticles: ContentRAGItem[];
  matchingExercises: ContentRAGItem[];
  videoContent: ContentRAGItem[];
  practicalTools: ContentRAGItem[];
  personalizedRecommendations: string[];
}

export interface ContentRAGItem {
  id: string;
  type: 'article' | 'exercise' | 'video' | 'tool';
  title: string;
  description: string;
  content: string;
  mbtiRelevance: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  popularity: number;
  effectivenessScore: number;
}

export interface PopularContentRAG {
  contentId: string;
  title: string;
  type: string;
  popularity: number;
  mbtiEngagement: Record<string, number>;
}

// RAG Query Types
export interface RAGQuery {
  userId: string;
  queryType: 'ai_coaching' | 'journal_analysis' | 'content_discovery' | 'community_engagement' | 'wellness_check' | 'goal_setting';
  userInput: string;
  contextDepth: 'shallow' | 'medium' | 'deep';
  mbtiOptimization: boolean;
  includeJournalHistory: boolean;
  includeCommunityTrends: boolean;
  includeContentLibrary: boolean;
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  specificDomains?: string[];
}

export interface RAGResponse {
  success: boolean;
  ragContext: RAGContext;
  augmentedPrompt: string;
  llmResponse: any;
  contextSources: string[];
  relevanceMetrics: any;
  retrievalMetadata: any;
  processingTimeMs: number;
}

// Main RAG Service Class
class ChatLLMRAGService {

  /**
   * 🧠 Primary RAG Pipeline - Complete knowledge retrieval + augmentation
   */
  async processRAGQuery(query: RAGQuery): Promise<RAGResponse> {
    const startTime = performance.now();
    
    try {
      console.log(`🔍 RAG Query Processing: ${query.queryType} for user ${query.userId}`);

      // Step 1: Retrieve User Profile Context
      const userProfile = await this.retrieveUserProfile(query.userId);
      
      // Step 2: Retrieve Journal Context (if requested)
      const journalContext = query.includeJournalHistory 
        ? await this.retrieveJournalContext(query.userId, query.timeRange || 'month')
        : this.getEmptyJournalContext();

      // Step 3: Retrieve Community Data (if requested)
      const communityData = query.includeCommunityTrends
        ? await this.retrieveCommunityContext(userProfile.mbtiType, query.queryType)
        : this.getEmptyCommunityContext();

      // Step 4: Retrieve Content Library (if requested)
      const contentLibrary = query.includeContentLibrary
        ? await this.retrieveContentLibrary(userProfile, query.userInput, query.queryType)
        : this.getEmptyContentContext();

      // Step 5: Calculate Relevance Score
      const relevanceScore = this.calculateContextRelevance(userProfile, journalContext, communityData, contentLibrary, query);

      // Step 6: Build Complete RAG Context
      const ragContext: RAGContext = {
        userProfile,
        journalContext,
        communityData,
        contentLibrary,
        relevanceScore,
        retrievalTimestamp: new Date().toISOString()
      };

      // Step 7: Generate Augmented Prompt
      const augmentedPrompt = this.generateAugmentedPrompt(query, ragContext);

      // Step 8: Process with ChatLLM + AI Orchestration
      const llmResponse = await this.processWithAugmentedContext(query, augmentedPrompt, ragContext);

      const processingTime = performance.now() - startTime;

      return {
        success: true,
        ragContext,
        augmentedPrompt,
        llmResponse,
        contextSources: this.extractContextSources(ragContext),
        relevanceMetrics: {
          overallRelevance: relevanceScore,
          userProfileWeight: 0.4,
          journalContextWeight: query.includeJournalHistory ? 0.3 : 0,
          communityDataWeight: query.includeCommunityTrends ? 0.2 : 0,
          contentLibraryWeight: query.includeContentLibrary ? 0.1 : 0
        },
        retrievalMetadata: {
          userDataPoints: this.countUserDataPoints(userProfile),
          journalEntries: journalContext.recentEntries.length,
          communityTopics: communityData.relevantDiscourseTopics.length,
          contentItems: this.countContentItems(contentLibrary)
        },
        processingTimeMs: processingTime
      };

    } catch (error) {
      console.error('RAG Query Processing failed:', error);
      
      return {
        success: false,
        ragContext: this.getEmptyRAGContext(),
        augmentedPrompt: '',
        llmResponse: null,
        contextSources: [],
        relevanceMetrics: {},
        retrievalMetadata: {},
        processingTimeMs: performance.now() - startTime
      };
    }
  }

  /**
   * 👤 Retrieve User Profile Context from V14 Database
   */
  private async retrieveUserProfile(userId: string): Promise<UserRAGProfile> {
    try {
      // Get user from WatermelonDB V14
      const usersCollection = database.collections.get('users');
      const user = await usersCollection.find(userId);

      // Get recent interactions and preferences
      const interactionsCollection = database.collections.get('user_interactions');
      const recentInteractions = await interactionsCollection
        .query(Q.where('user_id', userId), Q.take(10), Q.sortBy('created_at', Q.desc))
        .fetch();

      // Get user goals
      const goalsCollection = database.collections.get('goals_v14');
      const userGoals = await goalsCollection
        .query(Q.where('user_id', userId), Q.where('is_active', true))
        .fetch();

      // Get personality insights from Supabase
      let personalityInsights = {};
      try {
        const { data: insights } = await supabase
          .from('personality_insights')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        personalityInsights = insights?.[0] || {};
      } catch (error) {
        console.warn('Could not fetch personality insights:', error);
      }

      return {
        userId,
        mbtiType: (user as any).mbtiType || 'ENFP',
        coreValues: (user as any).coreValues ? JSON.parse((user as any).coreValues) : [],
        currentMood: (user as any).currentMood || 'neutral',
        primaryGoals: userGoals.map(goal => (goal as any).title),
        recentInteractions: recentInteractions.map(interaction => (interaction as any).action_type),
        personalityInsights,
        preferredContentTypes: (user as any).preferredContentTypes ? JSON.parse((user as any).preferredContentTypes) : ['article', 'exercise']
      };

    } catch (error) {
      console.error('User profile retrieval failed:', error);
      
      return {
        userId,
        mbtiType: 'ENFP',
        coreValues: [],
        currentMood: 'neutral',
        primaryGoals: [],
        recentInteractions: [],
        personalityInsights: {},
        preferredContentTypes: ['article', 'exercise']
      };
    }
  }

  /**
   * 📔 Retrieve Journal Context from V14 Database
   */
  private async retrieveJournalContext(userId: string, timeRange: string = 'month'): Promise<JournalRAGContext> {
    try {
      // Calculate date range
      const now = new Date();
      const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : timeRange === 'quarter' ? 90 : 365;
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

      // Get journal entries from WatermelonDB V14
      const journalCollection = database.collections.get('journal_entries_v14');
      const journalEntries = await journalCollection
        .query(
          Q.where('user_id', userId),
          Q.where('created_at', Q.gte(startDate.getTime())),
          Q.sortBy('created_at', Q.desc),
          Q.take(20)
        )
        .fetch();

      // Convert to RAG format
      const recentEntries: JournalRAGEntry[] = journalEntries.map(entry => ({
        id: entry.id,
        content: (entry as any).content,
        mood: (entry as any).mood || 'neutral',
        themes: (entry as any).themes ? JSON.parse((entry as any).themes) : [],
        date: (entry as any).createdAt?.toISOString() || new Date().toISOString(),
        insights: (entry as any).insights ? JSON.parse((entry as any).insights) : [],
        sanitizedContent: (entry as any).sanitizedContent || (entry as any).content
      }));

      // Extract thematic patterns
      const allThemes = recentEntries.flatMap(entry => entry.themes);
      const thematicPatterns = Array.from(new Set(allThemes)).slice(0, 10);

      // Analyze emotional trends
      const emotionalTrends = this.analyzeEmotionalTrends(recentEntries);

      // Extract growth indicators
      const growthIndicators = this.extractGrowthIndicators(recentEntries);

      return {
        recentEntries,
        thematicPatterns,
        emotionalTrends,
        growthIndicators,
        triggerTopics: thematicPatterns.slice(0, 5),
        journalingFrequency: this.calculateJournalingFrequency(recentEntries, daysBack)
      };

    } catch (error) {
      console.error('Journal context retrieval failed:', error);
      return this.getEmptyJournalContext();
    }
  }

  /**
   * 🌐 Retrieve Community Context from Discourse + V14 Database
   */
  private async retrieveCommunityContext(mbtiType: string, queryType: string): Promise<CommunityRAGContext> {
    try {
      // Get relevant Discourse topics from Supabase
      const { data: discourseTopics } = await supabase
        .from('discourse_topics')
        .select('*')
        .contains('mbti_relevance', [mbtiType])
        .order('likes', { ascending: false })
        .limit(10);

      // Get MBTI community trends
      const { data: communityTrends } = await supabase
        .from('mbti_community_trends')
        .select('*')
        .eq('mbti_type', mbtiType)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Get popular content for this MBTI type
      const { data: popularContent } = await supabase
        .from('popular_content')
        .select('*')
        .order('popularity', { ascending: false })
        .limit(10);

      // Convert to RAG format
      const relevantDiscourseTopics: DiscourseRAGTopic[] = (discourseTopics || []).map((topic: any) => ({
        id: topic.id,
        title: topic.title,
        content: topic.content,
        likes: topic.likes,
        replies: topic.replies,
        mbtiRelevance: topic.mbti_relevance || [],
        topicTags: topic.tags || [],
        sentiment: topic.sentiment || 'neutral'
      }));

      const mbtiCommunityTrends: MBTICommunityTrend[] = (communityTrends || []).map((trend: any) => ({
        mbtiType: trend.mbti_type,
        trendingTopics: trend.trending_topics || [],
        commonChallenges: trend.common_challenges || [],
        successfulStrategies: trend.successful_strategies || [],
        communitySize: trend.community_size || 0,
        engagementRate: trend.engagement_rate || 0
      }));

      const popularContentRAG: PopularContentRAG[] = (popularContent || []).map((content: any) => ({
        contentId: content.id,
        title: content.title,
        type: content.type,
        popularity: content.popularity,
        mbtiEngagement: content.mbti_engagement || {}
      }));

      return {
        relevantDiscourseTopics,
        mbtiCommunityTrends,
        popularContent: popularContentRAG,
        communityInsights: this.generateCommunityInsights(mbtiCommunityTrends),
        engagementPatterns: this.analyzeCommunityEngagement(relevantDiscourseTopics)
      };

    } catch (error) {
      console.error('Community context retrieval failed:', error);
      return this.getEmptyCommunityContext();
    }
  }

  /**
   * 📚 Retrieve Content Library Context
   */
  private async retrieveContentLibrary(userProfile: UserRAGProfile, userInput: string, queryType: string): Promise<ContentRAGContext> {
    try {
      // Search content based on user input and MBTI type
      const { data: contentResults } = await supabase
        .from('content_library')
        .select('*')
        .or(`title.ilike.%${userInput}%,description.ilike.%${userInput}%,tags.cs.{${userInput}}`)
        .contains('mbti_relevance', [userProfile.mbtiType])
        .order('effectiveness_score', { ascending: false })
        .limit(15);

      // Categorize content by type
      const allContent = contentResults || [];
      
      const relevantArticles = allContent
        .filter(item => item.type === 'article')
        .map(this.convertToContentRAGItem);

      const matchingExercises = allContent
        .filter(item => item.type === 'exercise')
        .map(this.convertToContentRAGItem);

      const videoContent = allContent
        .filter(item => item.type === 'video')
        .map(this.convertToContentRAGItem);

      const practicalTools = allContent
        .filter(item => item.type === 'tool')
        .map(this.convertToContentRAGItem);

      // Generate personalized recommendations
      const personalizedRecommendations = this.generatePersonalizedRecommendations(
        userProfile,
        allContent,
        queryType
      );

      return {
        relevantArticles,
        matchingExercises,
        videoContent,
        practicalTools,
        personalizedRecommendations
      };

    } catch (error) {
      console.error('Content library retrieval failed:', error);
      return this.getEmptyContentContext();
    }
  }

  /**
   * 🎯 Generate Augmented Prompt with RAG Context
   */
  private generateAugmentedPrompt(query: RAGQuery, ragContext: RAGContext): string {
    const { userProfile, journalContext, communityData, contentLibrary } = ragContext;

    return `🧠 **ChatLLM RAG-Enhanced Query Processing**

**Query Type**: ${query.queryType}
**User Input**: "${query.userInput}"
**Context Depth**: ${query.contextDepth}

**🔹 USER PROFILE CONTEXT**:
- **MBTI Type**: ${userProfile.mbtiType}
- **Core Values**: ${userProfile.coreValues.join(', ')}
- **Current Mood**: ${userProfile.currentMood}
- **Primary Goals**: ${userProfile.primaryGoals.join(', ')}
- **Recent Activity**: ${userProfile.recentInteractions.slice(0, 3).join(', ')}
- **Content Preferences**: ${userProfile.preferredContentTypes.join(', ')}

**🔹 JOURNAL CONTEXT** (${journalContext.recentEntries.length} recent entries):
- **Key Themes**: ${journalContext.thematicPatterns.slice(0, 5).join(', ')}
- **Emotional Trends**: ${JSON.stringify(journalContext.emotionalTrends).slice(0, 200)}
- **Growth Indicators**: ${journalContext.growthIndicators.join(', ')}
- **Journaling Frequency**: ${journalContext.journalingFrequency}
- **Recent Entry Example**: "${journalContext.recentEntries[0]?.sanitizedContent?.slice(0, 150) || 'None'}..."

**🔹 COMMUNITY CONTEXT**:
- **MBTI Community Trends**: ${communityData.mbtiCommunityTrends[0]?.trendingTopics?.slice(0, 3).join(', ') || 'None'}
- **Common ${userProfile.mbtiType} Challenges**: ${communityData.mbtiCommunityTrends[0]?.commonChallenges?.slice(0, 3).join(', ') || 'None'}
- **Successful Strategies**: ${communityData.mbtiCommunityTrends[0]?.successfulStrategies?.slice(0, 3).join(', ') || 'None'}
- **Popular Community Topics**: ${communityData.relevantDiscourseTopics.slice(0, 3).map(t => t.title).join(', ')}

**🔹 CONTENT LIBRARY CONTEXT**:
- **Recommended Articles**: ${contentLibrary.relevantArticles.slice(0, 3).map(a => a.title).join(', ')}
- **Matching Exercises**: ${contentLibrary.matchingExercises.slice(0, 3).map(e => e.title).join(', ')}
- **Personalized Tools**: ${contentLibrary.practicalTools.slice(0, 2).map(t => t.title).join(', ')}
- **AI Recommendations**: ${contentLibrary.personalizedRecommendations.slice(0, 3).join(', ')}

**📊 RAG METRICS**:
- **Context Relevance Score**: ${ragContext.relevanceScore}/100
- **Data Sources**: User Profile, ${journalContext.recentEntries.length > 0 ? 'Journal History, ' : ''}${communityData.relevantDiscourseTopics.length > 0 ? 'Community Data, ' : ''}Content Library

**🎯 GENERATION INSTRUCTIONS**:
Based on this comprehensive RAG context, provide a ${query.queryType} response that:
1. **Leverages MBTI-specific insights** from user profile and community trends
2. **References relevant journal patterns** if available
3. **Incorporates community wisdom** and successful strategies
4. **Suggests specific content** from the library when appropriate
5. **Maintains personalization** based on user's goals and preferences
6. **Provides actionable next steps** aligned with their growth trajectory

**Response should be practical, personalized, and directly address the user's query while utilizing the rich contextual knowledge available.**`;
  }

  /**
   * 🚀 Process with Augmented Context via AI Orchestration
   */
  private async processWithAugmentedContext(query: RAGQuery, augmentedPrompt: string, ragContext: RAGContext): Promise<any> {
    try {
      // Use AI Orchestration for RAG-enhanced processing
      const orchestrationRequest: OrchestrationRequest = {
        userId: query.userId,
        mbtiType: ragContext.userProfile.mbtiType,
        sessionType: this.mapQueryTypeToSessionType(query.queryType),
        userInput: augmentedPrompt,
        context: {
          feature: `rag_${query.queryType}`,
          contextDepth: query.contextDepth,
          ragMetrics: {
            relevanceScore: ragContext.relevanceScore,
            dataSourceCount: this.countDataSources(ragContext),
            journalEntries: ragContext.journalContext.recentEntries.length,
            communityTopics: ragContext.communityData.relevantDiscourseTopics.length
          },
          userProfile: ragContext.userProfile,
          ragEnabled: true
        }
      };

      const result = await aiOrchestrationService.orchestrateAIResponse(orchestrationRequest);
      
      return {
        ragEnhanced: true,
        response: result.coordinatedResponse,
        orchestrationMode: result.mode,
        confidence: result.overallConfidence,
        contextUtilization: this.analyzeContextUtilization(ragContext),
        recommendations: this.extractRecommendations(result.coordinatedResponse)
      };

    } catch (error) {
      console.error('RAG-enhanced processing failed:', error);
      
      // Fallback to basic ChatLLM processing
      return {
        ragEnhanced: false,
        response: `Based on your ${query.queryType} request as a ${ragContext.userProfile.mbtiType}, here's a personalized response...`,
        error: String(error),
        fallbackUsed: true
      };
    }
  }

  // Utility Methods
  private mapQueryTypeToSessionType(queryType: string): 'content_discovery' | 'coaching' | 'wellness' | 'imagination' | 'action_planning' {
    const mapping: Record<string, any> = {
      'ai_coaching': 'coaching',
      'journal_analysis': 'wellness',
      'content_discovery': 'content_discovery',
      'community_engagement': 'content_discovery',
      'wellness_check': 'wellness',
      'goal_setting': 'action_planning'
    };
    return mapping[queryType] || 'content_discovery';
  }

  private calculateContextRelevance(userProfile: UserRAGProfile, journalContext: JournalRAGContext, communityData: CommunityRAGContext, contentLibrary: ContentRAGContext, query: RAGQuery): number {
    let score = 0;
    
    // User profile relevance (40%)
    score += userProfile.mbtiType ? 25 : 0;
    score += userProfile.primaryGoals.length > 0 ? 15 : 0;
    
    // Journal context relevance (30%)
    if (query.includeJournalHistory) {
      score += journalContext.recentEntries.length > 0 ? 20 : 0;
      score += journalContext.thematicPatterns.length > 0 ? 10 : 0;
    }
    
    // Community data relevance (20%)
    if (query.includeCommunityTrends) {
      score += communityData.relevantDiscourseTopics.length > 0 ? 15 : 0;
      score += communityData.mbtiCommunityTrends.length > 0 ? 5 : 0;
    }
    
    // Content library relevance (10%)
    if (query.includeContentLibrary) {
      score += contentLibrary.relevantArticles.length > 0 ? 5 : 0;
      score += contentLibrary.matchingExercises.length > 0 ? 5 : 0;
    }
    
    return Math.min(score, 100);
  }

  private analyzeEmotionalTrends(entries: JournalRAGEntry[]): any[] {
    // Simple emotional trend analysis
    const moods = entries.map(entry => entry.mood);
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      frequency: count,
      percentage: Math.round((count / entries.length) * 100)
    }));
  }

  private extractGrowthIndicators(entries: JournalRAGEntry[]): string[] {
    // Extract growth-related keywords from journal entries
    const growthKeywords = ['learned', 'growth', 'improved', 'better', 'progress', 'achieved', 'overcame', 'developed'];
    const indicators: string[] = [];
    
    entries.forEach(entry => {
      growthKeywords.forEach(keyword => {
        if (entry.content.toLowerCase().includes(keyword)) {
          indicators.push(`${keyword} (from ${entry.date.split('T')[0]})`);
        }
      });
    });
    
    return [...new Set(indicators)].slice(0, 10);
  }

  private calculateJournalingFrequency(entries: JournalRAGEntry[], daysBack: number): string {
    const frequency = entries.length / daysBack;
    if (frequency >= 0.8) return 'daily';
    if (frequency >= 0.4) return 'frequent';
    if (frequency >= 0.15) return 'weekly';
    return 'occasional';
  }

  private generateCommunityInsights(trends: MBTICommunityTrend[]): string[] {
    return trends.flatMap(trend => [
      `${trend.mbtiType} community focuses on: ${trend.trendingTopics.slice(0, 2).join(', ')}`,
      `Common ${trend.mbtiType} strategies: ${trend.successfulStrategies.slice(0, 2).join(', ')}`
    ]).slice(0, 5);
  }

  private analyzeCommunityEngagement(topics: DiscourseRAGTopic[]): any {
    const totalLikes = topics.reduce((sum, topic) => sum + topic.likes, 0);
    const totalReplies = topics.reduce((sum, topic) => sum + topic.replies, 0);
    
    return {
      averageLikes: topics.length > 0 ? Math.round(totalLikes / topics.length) : 0,
      averageReplies: topics.length > 0 ? Math.round(totalReplies / topics.length) : 0,
      mostPopularTopic: topics[0]?.title || 'None',
      engagementScore: Math.min(Math.round((totalLikes + totalReplies) / topics.length), 100)
    };
  }

  private convertToContentRAGItem = (item: any): ContentRAGItem => ({
    id: item.id,
    type: item.type,
    title: item.title,
    description: item.description,
    content: item.content,
    mbtiRelevance: item.mbti_relevance || [],
    difficulty: item.difficulty || 'intermediate',
    tags: item.tags || [],
    popularity: item.popularity || 0,
    effectivenessScore: item.effectiveness_score || 50
  });

  private generatePersonalizedRecommendations(userProfile: UserRAGProfile, content: any[], queryType: string): string[] {
    // Simple recommendation logic based on MBTI and goals
    const recommendations: string[] = [];
    
    if (userProfile.mbtiType.includes('N')) {
      recommendations.push('Explore conceptual frameworks and future possibilities');
    }
    if (userProfile.mbtiType.includes('F')) {
      recommendations.push('Focus on values-based decision making');
    }
    if (userProfile.mbtiType.includes('P')) {
      recommendations.push('Embrace flexible, adaptive approaches');
    }
    
    return recommendations.slice(0, 5);
  }

  private extractContextSources(ragContext: RAGContext): string[] {
    const sources: string[] = ['User Profile'];
    
    if (ragContext.journalContext.recentEntries.length > 0) {
      sources.push(`Journal History (${ragContext.journalContext.recentEntries.length} entries)`);
    }
    if (ragContext.communityData.relevantDiscourseTopics.length > 0) {
      sources.push(`Community Data (${ragContext.communityData.relevantDiscourseTopics.length} topics)`);
    }
    if (ragContext.contentLibrary.relevantArticles.length > 0) {
      sources.push(`Content Library (${this.countContentItems(ragContext.contentLibrary)} items)`);
    }
    
    return sources;
  }

  private countUserDataPoints(userProfile: UserRAGProfile): number {
    return [
      userProfile.mbtiType,
      ...userProfile.coreValues,
      ...userProfile.primaryGoals,
      ...userProfile.recentInteractions
    ].filter(Boolean).length;
  }

  private countContentItems(contentLibrary: ContentRAGContext): number {
    return contentLibrary.relevantArticles.length + 
           contentLibrary.matchingExercises.length + 
           contentLibrary.videoContent.length + 
           contentLibrary.practicalTools.length;
  }

  private countDataSources(ragContext: RAGContext): number {
    let count = 1; // User profile always counted
    if (ragContext.journalContext.recentEntries.length > 0) count++;
    if (ragContext.communityData.relevantDiscourseTopics.length > 0) count++;
    if (this.countContentItems(ragContext.contentLibrary) > 0) count++;
    return count;
  }

  private analyzeContextUtilization(ragContext: RAGContext): any {
    return {
      userProfileUtilized: true,
      journalContextUtilized: ragContext.journalContext.recentEntries.length > 0,
      communityDataUtilized: ragContext.communityData.relevantDiscourseTopics.length > 0,
      contentLibraryUtilized: this.countContentItems(ragContext.contentLibrary) > 0,
      overallUtilization: ragContext.relevanceScore
    };
  }

  private extractRecommendations(response: any): string[] {
    // Simple extraction of recommendations from AI response
    const text = typeof response === 'string' ? response : JSON.stringify(response);
    const lines = text.split('\n');
    
    return lines
      .filter(line => line.includes('recommend') || line.includes('suggest') || line.includes('try'))
      .slice(0, 5)
      .map(line => line.trim());
  }

  // Empty Context Generators
  private getEmptyRAGContext(): RAGContext {
    return {
      userProfile: {
        userId: '',
        mbtiType: 'ENFP',
        coreValues: [],
        currentMood: 'neutral',
        primaryGoals: [],
        recentInteractions: [],
        personalityInsights: {},
        preferredContentTypes: []
      },
      journalContext: this.getEmptyJournalContext(),
      communityData: this.getEmptyCommunityContext(),
      contentLibrary: this.getEmptyContentContext(),
      relevanceScore: 0,
      retrievalTimestamp: new Date().toISOString()
    };
  }

  private getEmptyJournalContext(): JournalRAGContext {
    return {
      recentEntries: [],
      thematicPatterns: [],
      emotionalTrends: [],
      growthIndicators: [],
      triggerTopics: [],
      journalingFrequency: 'none'
    };
  }

  private getEmptyCommunityContext(): CommunityRAGContext {
    return {
      relevantDiscourseTopics: [],
      mbtiCommunityTrends: [],
      popularContent: [],
      communityInsights: [],
      engagementPatterns: {}
    };
  }

  private getEmptyContentContext(): ContentRAGContext {
    return {
      relevantArticles: [],
      matchingExercises: [],
      videoContent: [],
      practicalTools: [],
      personalizedRecommendations: []
    };
  }
}

// Singleton export
export const chatLLMRAGService = new ChatLLMRAGService();
export default ChatLLMRAGService;
/**
 * Smart Content Curation Service for MET24 Phase 2
 * 
 * Handles AI-powered content curation using text embeddings and similarity matching
 * 
 * @version 3.0.0-light-ai
 */

import { textEmbeddingsService } from './textEmbeddingsService';
import { sentimentAnalysisService } from './sentimentAnalysisService';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'podcast' | 'exercise' | 'meditation';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  tags: string[];
  mbtiType?: string;
  embedding?: number[];
  createdAt: Date;
}

export interface CurationRequest {
  userId: string;
  query: string;
  preferences: {
    contentTypes: string[];
    categories: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    maxDuration: number;
  };
  mbtiType?: string;
  limit: number;
}

export interface CurationResult {
  items: ContentItem[];
  totalFound: number;
  relevance: number;
  personalization: {
    mbtiMatch: boolean;
    preferenceMatch: boolean;
    sentimentMatch: boolean;
  };
  insights: string[];
  timestamp: Date;
}

export interface ContentRecommendation {
  item: ContentItem;
  reason: string;
  confidence: number;
  relevance: number;
}

export class ContentCurationService {
  private contentItems: Map<string, ContentItem> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.initializeContent();
  }

  /**
   * Initialize content curation service
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('Content Curation Service: Initializing...');

      // Initialize AI services
      await Promise.all([
        textEmbeddingsService.initialize(),
        sentimentAnalysisService.initialize()
      ]);

      // Generate embeddings for existing content
      await this.generateContentEmbeddings();

      this.isInitialized = true;
      console.log('Content Curation Service: Initialized successfully');
    } catch (error) {
      console.error('Content Curation Service: Error initializing', error);
      throw error;
    }
  }

  /**
   * Initialize content items
   */
  private initializeContent(): void {
    const contentItems: ContentItem[] = [
      {
        id: 'stress-management-article',
        title: 'Stress Management: 10 Effectieve Technieken',
        content: 'Stress is een natuurlijke reactie op uitdagingen. Leer hoe je stress kunt beheersen met deze bewezen technieken.',
        type: 'article',
        category: 'wellness',
        difficulty: 'beginner',
        duration: 10,
        tags: ['stress', 'management', 'wellness', 'techniques'],
        createdAt: new Date()
      },
      {
        id: 'mindfulness-meditation',
        title: 'Mindfulness Meditatie voor Beginners',
        content: 'Leer de basis van mindfulness meditatie. Een eenvoudige gids om te beginnen met mediteren.',
        type: 'meditation',
        category: 'mindfulness',
        difficulty: 'beginner',
        duration: 15,
        tags: ['mindfulness', 'meditation', 'beginner', 'relaxation'],
        createdAt: new Date()
      },
      {
        id: 'career-planning-video',
        title: 'Carrière Planning: Stap voor Stap',
        content: 'Ontdek hoe je een effectief carrièreplan kunt maken. Van doelen stellen tot actie ondernemen.',
        type: 'video',
        category: 'career',
        difficulty: 'intermediate',
        duration: 25,
        tags: ['career', 'planning', 'goals', 'development'],
        createdAt: new Date()
      },
      {
        id: 'relationship-communication',
        title: 'Effectieve Communicatie in Relaties',
        content: 'Leer hoe je beter kunt communiceren in je relaties. Praktische tips voor open en eerlijke communicatie.',
        type: 'article',
        category: 'relationships',
        difficulty: 'intermediate',
        duration: 12,
        tags: ['communication', 'relationships', 'tips', 'connection'],
        createdAt: new Date()
      },
      {
        id: 'creative-exercise',
        title: 'Creativiteit Ontwikkelen: 5 Oefeningen',
        content: 'Ontdek je creatieve potentieel met deze praktische oefeningen. Van brainstormen tot visualisatie.',
        type: 'exercise',
        category: 'creativity',
        difficulty: 'beginner',
        duration: 20,
        tags: ['creativity', 'exercises', 'brainstorming', 'visualization'],
        createdAt: new Date()
      },
      {
        id: 'advanced-meditation',
        title: 'Geavanceerde Meditatie Technieken',
        content: 'Voor degenen die verder willen gaan met meditatie. Geavanceerde technieken voor diepere ervaringen.',
        type: 'meditation',
        category: 'mindfulness',
        difficulty: 'advanced',
        duration: 30,
        tags: ['meditation', 'advanced', 'techniques', 'deep'],
        createdAt: new Date()
      },
      {
        id: 'leadership-podcast',
        title: 'Leiderschap in de 21e Eeuw',
        content: 'Een podcast over modern leiderschap. Hoe leid je effectief in een veranderende wereld?',
        type: 'podcast',
        category: 'leadership',
        difficulty: 'intermediate',
        duration: 45,
        tags: ['leadership', 'modern', 'management', 'skills'],
        createdAt: new Date()
      },
      {
        id: 'personal-growth-guide',
        title: 'Persoonlijke Groei: Een Complete Gids',
        content: 'Een uitgebreide gids voor persoonlijke ontwikkeling. Van zelfbewustzijn tot doelstellingen.',
        type: 'article',
        category: 'personal-growth',
        difficulty: 'intermediate',
        duration: 18,
        tags: ['personal-growth', 'development', 'self-awareness', 'goals'],
        createdAt: new Date()
      }
    ];

    contentItems.forEach(item => {
      this.contentItems.set(item.id, item);
    });
  }

  /**
   * Generate embeddings for content items
   */
  private async generateContentEmbeddings(): Promise<void> {
    try {
      const items = Array.from(this.contentItems.values());
      
      for (const item of items) {
        if (!item.embedding) {
          const embedding = await textEmbeddingsService.generateEmbedding(
            `${item.title} ${item.content}`
          );
          item.embedding = embedding.embedding;
          this.contentItems.set(item.id, item);
        }
      }
    } catch (error) {
      console.error('Content Curation Service: Error generating content embeddings', error);
    }
  }

  /**
   * Curate content based on request
   */
  async curateContent(request: CurationRequest): Promise<CurationResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Generate query embedding
      const queryEmbedding = await textEmbeddingsService.generateEmbedding(request.query);

      // Find similar content
      const similarItems = await this.findSimilarContent(queryEmbedding, request);

      // Apply personalization
      const personalizedItems = this.applyPersonalization(similarItems, request);

      // Sort by relevance
      const sortedItems = this.sortByRelevance(personalizedItems, request.query);

      // Limit results
      const limitedItems = sortedItems.slice(0, request.limit);

      // Generate insights
      const insights = this.generateInsights(limitedItems, request);

      // Calculate personalization metrics
      const personalization = this.calculatePersonalization(limitedItems, request);

      return {
        items: limitedItems,
        totalFound: similarItems.length,
        relevance: this.calculateOverallRelevance(limitedItems),
        personalization,
        insights,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Content Curation Service: Error curating content', error);
      throw error;
    }
  }

  /**
   * Find similar content using embeddings
   */
  private async findSimilarContent(
    queryEmbedding: any,
    request: CurationRequest
  ): Promise<ContentItem[]> {
    try {
      const items = Array.from(this.contentItems.values());
      const similarities: Array<{ item: ContentItem; similarity: number }> = [];

      for (const item of items) {
        if (item.embedding) {
          const similarity = textEmbeddingsService.calculateCosineSimilarity(
            queryEmbedding.embedding,
            item.embedding
          );

          if (similarity > 0.3) { // Threshold for relevance
            similarities.push({ item, similarity });
          }
        }
      }

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .map(s => s.item);
    } catch (error) {
      console.error('Content Curation Service: Error finding similar content', error);
      return [];
    }
  }

  /**
   * Apply personalization to content
   */
  private applyPersonalization(
    items: ContentItem[],
    request: CurationRequest
  ): ContentItem[] {
    return items.filter(item => {
      // Filter by content type
      if (request.preferences.contentTypes.length > 0) {
        if (!request.preferences.contentTypes.includes(item.type)) {
          return false;
        }
      }

      // Filter by category
      if (request.preferences.categories.length > 0) {
        if (!request.preferences.categories.includes(item.category)) {
          return false;
        }
      }

      // Filter by difficulty
      if (request.preferences.difficulty !== 'beginner') {
        if (item.difficulty === 'beginner' && request.preferences.difficulty === 'advanced') {
          return false;
        }
      }

      // Filter by duration
      if (item.duration > request.preferences.maxDuration) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort content by relevance
   */
  private sortByRelevance(items: ContentItem[], query: string): ContentItem[] {
    return items.sort((a, b) => {
      // Calculate relevance score
      const scoreA = this.calculateRelevanceScore(a, query);
      const scoreB = this.calculateRelevanceScore(b, query);
      
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate relevance score for content item
   */
  private calculateRelevanceScore(item: ContentItem, query: string): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerTitle = item.title.toLowerCase();
    const lowerContent = item.content.toLowerCase();

    // Title match
    if (lowerTitle.includes(lowerQuery)) {
      score += 10;
    }

    // Content match
    if (lowerContent.includes(lowerQuery)) {
      score += 5;
    }

    // Tag match
    item.tags.forEach(tag => {
      if (lowerQuery.includes(tag.toLowerCase())) {
        score += 3;
      }
    });

    // Category match
    if (lowerQuery.includes(item.category.toLowerCase())) {
      score += 2;
    }

    return score;
  }

  /**
   * Generate insights about curated content
   */
  private generateInsights(items: ContentItem[], request: CurationRequest): string[] {
    const insights: string[] = [];

    if (items.length === 0) {
      insights.push('Geen content gevonden die aansluit bij je zoekopdracht');
      return insights;
    }

    // Content type distribution
    const typeCounts: { [key: string]: number } = {};
    items.forEach(item => {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    });

    const mostCommonType = Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (mostCommonType) {
      insights.push(`Meest voorkomende content type: ${mostCommonType[0]} (${mostCommonType[1]} items)`);
    }

    // Difficulty distribution
    const difficultyCounts: { [key: string]: number } = {};
    items.forEach(item => {
      difficultyCounts[item.difficulty] = (difficultyCounts[item.difficulty] || 0) + 1;
    });

    const mostCommonDifficulty = Object.entries(difficultyCounts)
      .sort((a, b) => b[1] - a[1])[0];

    if (mostCommonDifficulty) {
      insights.push(`Meest voorkomende moeilijkheidsgraad: ${mostCommonDifficulty[0]}`);
    }

    // Average duration
    const avgDuration = items.reduce((sum, item) => sum + item.duration, 0) / items.length;
    insights.push(`Gemiddelde duur: ${Math.round(avgDuration)} minuten`);

    // MBTI personalization
    if (request.mbtiType) {
      const mbtiItems = items.filter(item => item.mbtiType === request.mbtiType);
      if (mbtiItems.length > 0) {
        insights.push(`${mbtiItems.length} items specifiek voor ${request.mbtiType} type`);
      }
    }

    return insights;
  }

  /**
   * Calculate personalization metrics
   */
  private calculatePersonalization(
    items: ContentItem[],
    request: CurationRequest
  ): { mbtiMatch: boolean; preferenceMatch: boolean; sentimentMatch: boolean } {
    const mbtiMatch = request.mbtiType 
      ? items.some(item => item.mbtiType === request.mbtiType)
      : false;

    const preferenceMatch = items.some(item => 
      request.preferences.contentTypes.includes(item.type) &&
      request.preferences.categories.includes(item.category)
    );

    const sentimentMatch = true; // Mock implementation

    return { mbtiMatch, preferenceMatch, sentimentMatch };
  }

  /**
   * Calculate overall relevance
   */
  private calculateOverallRelevance(items: ContentItem[]): number {
    if (items.length === 0) return 0;
    
    // Mock implementation - in real app, this would be more sophisticated
    return Math.min(1.0, items.length / 10);
  }

  /**
   * Get content recommendations
   */
  async getContentRecommendations(
    userId: string,
    mbtiType?: string,
    limit: number = 5
  ): Promise<ContentRecommendation[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const items = Array.from(this.contentItems.values());
      const recommendations: ContentRecommendation[] = [];

      // Filter by MBTI type if provided
      const filteredItems = mbtiType 
        ? items.filter(item => !item.mbtiType || item.mbtiType === mbtiType)
        : items;

      // Generate recommendations
      for (const item of filteredItems.slice(0, limit)) {
        const recommendation: ContentRecommendation = {
          item,
          reason: this.generateRecommendationReason(item, mbtiType),
          confidence: 0.8,
          relevance: 0.7
        };
        recommendations.push(recommendation);
      }

      return recommendations;
    } catch (error) {
      console.error('Content Curation Service: Error getting content recommendations', error);
      return [];
    }
  }

  /**
   * Generate recommendation reason
   */
  private generateRecommendationReason(item: ContentItem, mbtiType?: string): string {
    const reasons: string[] = [];

    if (mbtiType) {
      reasons.push(`Specifiek voor ${mbtiType} type`);
    }

    if (item.difficulty === 'beginner') {
      reasons.push('Geschikt voor beginners');
    } else if (item.difficulty === 'advanced') {
      reasons.push('Voor gevorderden');
    }

    if (item.duration < 15) {
      reasons.push('Korte sessie');
    } else if (item.duration > 30) {
      reasons.push('Uitgebreide sessie');
    }

    return reasons.join(', ') || 'Aanbevolen content';
  }

  /**
   * Add new content item
   */
  async addContentItem(item: Omit<ContentItem, 'id' | 'createdAt' | 'embedding'>): Promise<ContentItem> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const newItem: ContentItem = {
        ...item,
        id: this.generateId(),
        createdAt: new Date()
      };

      // Generate embedding
      const embedding = await textEmbeddingsService.generateEmbedding(
        `${newItem.title} ${newItem.content}`
      );
      newItem.embedding = embedding.embedding;

      this.contentItems.set(newItem.id, newItem);
      return newItem;
    } catch (error) {
      console.error('Content Curation Service: Error adding content item', error);
      throw error;
    }
  }

  /**
   * Get content item by ID
   */
  getContentItem(itemId: string): ContentItem | null {
    return this.contentItems.get(itemId) || null;
  }

  /**
   * Get all content items
   */
  getAllContentItems(): ContentItem[] {
    return Array.from(this.contentItems.values());
  }

  /**
   * Search content by query
   */
  async searchContent(query: string, limit: number = 10): Promise<ContentItem[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const request: CurationRequest = {
        userId: 'search',
        query,
        preferences: {
          contentTypes: ['article', 'video', 'podcast', 'exercise', 'meditation'],
          categories: ['wellness', 'mindfulness', 'career', 'relationships', 'creativity', 'personal-growth', 'leadership'],
          difficulty: 'beginner',
          maxDuration: 60
        },
        limit
      };

      const result = await this.curateContent(request);
      return result.items;
    } catch (error) {
      console.error('Content Curation Service: Error searching content', error);
      return [];
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    totalContentItems: number;
    ready: boolean;
  } {
    return {
      initialized: this.isInitialized,
      totalContentItems: this.contentItems.size,
      ready: this.isInitialized
    };
  }
}

// Export singleton instance
export const contentCurationService = new ContentCurationService();

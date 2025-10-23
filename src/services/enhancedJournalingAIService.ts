/**
 * Enhanced Journaling AI Service for MET24 Phase 2
 * 
 * Handles AI-powered journaling insights using text embeddings and sentiment analysis
 * 
 * @version 3.0.0-light-ai
 */

import { textEmbeddingsService } from './textEmbeddingsService';
import { sentimentAnalysisService } from './sentimentAnalysisService';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: number; // 1-10 scale
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalInsight {
  type: 'pattern' | 'emotion' | 'theme' | 'suggestion' | 'trend';
  content: string;
  confidence: number;
  category: string;
  timestamp: Date;
}

export interface JournalAnalytics {
  totalEntries: number;
  averageMood: number;
  moodTrend: 'improving' | 'declining' | 'stable';
  topEmotions: Array<{ emotion: string; count: number }>;
  topThemes: Array<{ theme: string; count: number }>;
  writingStreak: number;
  lastEntry: Date | null;
}

export interface JournalRecommendation {
  type: 'prompt' | 'exercise' | 'reflection' | 'goal';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export class EnhancedJournalingAIService {
  private entries: Map<string, JournalEntry> = new Map();
  private insights: Map<string, JournalInsight[]> = new Map();
  private recommendations: Map<string, JournalRecommendation[]> = new Map();

  /**
   * Create a new journal entry
   */
  async createEntry(
    userId: string,
    title: string,
    content: string,
    mood: number,
    tags: string[] = []
  ): Promise<JournalEntry> {
    try {
      const entry: JournalEntry = {
        id: this.generateId(),
        userId,
        title,
        content,
        mood,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.entries.set(entry.id, entry);

      // Generate AI insights
      const insights = await this.generateInsights(entry);
      this.insights.set(entry.id, insights);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(userId, entry);
      this.recommendations.set(entry.id, recommendations);

      return entry;
    } catch (error) {
      console.error('Enhanced Journaling AI Service: Error creating entry', error);
      throw error;
    }
  }

  /**
   * Update journal entry
   */
  async updateEntry(
    entryId: string,
    updates: Partial<Pick<JournalEntry, 'title' | 'content' | 'mood' | 'tags'>>
  ): Promise<JournalEntry> {
    try {
      const entry = this.entries.get(entryId);
      if (!entry) {
        throw new Error('Entry not found');
      }

      const updatedEntry = {
        ...entry,
        ...updates,
        updatedAt: new Date()
      };

      this.entries.set(entryId, updatedEntry);

      // Regenerate insights
      const insights = await this.generateInsights(updatedEntry);
      this.insights.set(entryId, insights);

      return updatedEntry;
    } catch (error) {
      console.error('Enhanced Journaling AI Service: Error updating entry', error);
      throw error;
    }
  }

  /**
   * Get journal entry
   */
  getEntry(entryId: string): JournalEntry | null {
    return this.entries.get(entryId) || null;
  }

  /**
   * Get entries by user
   */
  getEntriesByUser(userId: string, limit: number = 50): JournalEntry[] {
    return Array.from(this.entries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get insights for entry
   */
  getInsights(entryId: string): JournalInsight[] {
    return this.insights.get(entryId) || [];
  }

  /**
   * Get recommendations for entry
   */
  getRecommendations(entryId: string): JournalRecommendation[] {
    return this.recommendations.get(entryId) || [];
  }

  /**
   * Generate AI insights for journal entry
   */
  private async generateInsights(entry: JournalEntry): Promise<JournalInsight[]> {
    try {
      const insights: JournalInsight[] = [];

      // Analyze sentiment
      const sentimentResult = await sentimentAnalysisService.analyzeSentiment(entry.content);
      if (sentimentResult.confidence > 0.7) {
        insights.push({
          type: 'emotion',
          content: `Je toont een ${sentimentResult.sentiment} sentiment in deze entry.`,
          confidence: sentimentResult.confidence,
          category: 'sentiment',
          timestamp: new Date()
        });
      }

      // Analyze emotions
      const emotionResult = await sentimentAnalysisService.analyzeEmotions(entry.content);
      if (emotionResult.confidence > 0.6) {
        insights.push({
          type: 'emotion',
          content: `De dominante emotie in je entry is ${emotionResult.dominantEmotion}.`,
          confidence: emotionResult.confidence,
          category: 'emotion',
          timestamp: new Date()
        });
      }

      // Analyze themes
      const themes = this.extractThemes(entry.content);
      if (themes.length > 0) {
        insights.push({
          type: 'theme',
          content: `Je entry bevat thema's zoals: ${themes.join(', ')}.`,
          confidence: 0.8,
          category: 'themes',
          timestamp: new Date()
        });
      }

      // Analyze mood vs content
      const moodInsight = await this.analyzeMoodContent(entry);
      if (moodInsight) {
        insights.push(moodInsight);
      }

      // Analyze writing patterns
      const patternInsight = this.analyzeWritingPatterns(entry);
      if (patternInsight) {
        insights.push(patternInsight);
      }

      return insights;
    } catch (error) {
      console.error('Enhanced Journaling AI Service: Error generating insights', error);
      return [];
    }
  }

  /**
   * Generate recommendations based on entry
   */
  private async generateRecommendations(
    userId: string,
    entry: JournalEntry
  ): Promise<JournalRecommendation[]> {
    try {
      const recommendations: JournalRecommendation[] = [];

      // Get user's recent entries for context
      const recentEntries = this.getEntriesByUser(userId, 10);
      const analytics = this.calculateAnalytics(userId, recentEntries);

      // Mood-based recommendations
      if (entry.mood < 4) {
        recommendations.push({
          type: 'exercise',
          title: 'Positieve Reflectie Oefening',
          description: 'Probeer een oefening waarbij je 3 dingen opschrijft waar je dankbaar voor bent.',
          priority: 'high',
          category: 'mood'
        });
      }

      // Emotion-based recommendations
      const emotionResult = await sentimentAnalysisService.analyzeEmotions(entry.content);
      if (emotionResult.emotions.fear > 0.5) {
        recommendations.push({
          type: 'exercise',
          title: 'Angst Management',
          description: 'Overweeg om ademhalingsoefeningen te doen om angst te verminderen.',
          priority: 'medium',
          category: 'emotion'
        });
      }

      // Writing pattern recommendations
      if (entry.content.length < 100) {
        recommendations.push({
          type: 'prompt',
          title: 'Uitgebreide Reflectie',
          description: 'Probeer meer detail toe te voegen aan je reflecties voor diepere inzichten.',
          priority: 'low',
          category: 'writing'
        });
      }

      // Trend-based recommendations
      if (analytics.moodTrend === 'declining') {
        recommendations.push({
          type: 'reflection',
          title: 'Mood Trend Analyse',
          description: 'Je mood lijkt te dalen. Overweeg om te reflecteren op wat je kan helpen.',
          priority: 'high',
          category: 'trend'
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Enhanced Journaling AI Service: Error generating recommendations', error);
      return [];
    }
  }

  /**
   * Calculate analytics for user
   */
  calculateAnalytics(userId: string, entries: JournalEntry[]): JournalAnalytics {
    const userEntries = entries.filter(entry => entry.userId === userId);
    
    if (userEntries.length === 0) {
      return {
        totalEntries: 0,
        averageMood: 5,
        moodTrend: 'stable',
        topEmotions: [],
        topThemes: [],
        writingStreak: 0,
        lastEntry: null
      };
    }

    const totalEntries = userEntries.length;
    const averageMood = userEntries.reduce((sum, entry) => sum + entry.mood, 0) / totalEntries;
    
    // Calculate mood trend
    const recentEntries = userEntries.slice(0, Math.min(5, totalEntries));
    const olderEntries = userEntries.slice(Math.min(5, totalEntries));
    
    const recentAvgMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    const olderAvgMood = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.mood, 0) / olderEntries.length 
      : recentAvgMood;
    
    let moodTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentAvgMood > olderAvgMood + 0.5) {
      moodTrend = 'improving';
    } else if (recentAvgMood < olderAvgMood - 0.5) {
      moodTrend = 'declining';
    }

    // Calculate writing streak
    const writingStreak = this.calculateWritingStreak(userEntries);

    return {
      totalEntries,
      averageMood,
      moodTrend,
      topEmotions: [], // Would be calculated from emotion analysis
      topThemes: [], // Would be calculated from theme analysis
      writingStreak,
      lastEntry: userEntries[0]?.createdAt || null
    };
  }

  /**
   * Calculate writing streak
   */
  private calculateWritingStreak(entries: JournalEntry[]): number {
    if (entries.length === 0) return 0;

    const sortedEntries = entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.createdAt);
      entryDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
        currentDate = entryDate;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  }

  /**
   * Analyze mood vs content
   */
  private async analyzeMoodContent(entry: JournalEntry): Promise<JournalInsight | null> {
    const sentimentResult = await sentimentAnalysisService.analyzeSentiment(entry.content);
    
    // Check if mood matches sentiment
    const expectedMood = sentimentResult.sentiment === 'positive' ? 7 : 
                        sentimentResult.sentiment === 'negative' ? 3 : 5;
    
    const moodDifference = Math.abs(entry.mood - expectedMood);
    
    if (moodDifference > 2) {
      return {
        type: 'pattern',
        content: `Er is een verschil tussen je gemelde mood (${entry.mood}) en de sentiment van je tekst.`,
        confidence: 0.7,
        category: 'mood',
        timestamp: new Date()
      };
    }

    return null;
  }

  /**
   * Analyze writing patterns
   */
  private analyzeWritingPatterns(entry: JournalEntry): JournalInsight | null {
    const wordCount = entry.content.split(' ').length;
    const sentenceCount = entry.content.split('.').length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    if (avgWordsPerSentence > 20) {
      return {
        type: 'pattern',
        content: 'Je schrijft in lange, complexe zinnen. Dit kan wijzen op diep nadenken.',
        confidence: 0.6,
        category: 'writing',
        timestamp: new Date()
      };
    } else if (avgWordsPerSentence < 8) {
      return {
        type: 'pattern',
        content: 'Je schrijft in korte, directe zinnen. Dit kan wijzen op een praktische benadering.',
        confidence: 0.6,
        category: 'writing',
        timestamp: new Date()
      };
    }

    return null;
  }

  /**
   * Extract themes from text
   */
  private extractThemes(text: string): string[] {
    const themes: string[] = [];
    const lowerText = text.toLowerCase();

    const themeKeywords = {
      'werk': ['werk', 'baan', 'carrière', 'project', 'collega', 'kantoor'],
      'relaties': ['vriend', 'familie', 'partner', 'relatie', 'liefde', 'vriendschap'],
      'gezondheid': ['gezond', 'ziek', 'dokter', 'medicijn', 'fitness', 'sport'],
      'hobby': ['hobby', 'vrije tijd', 'ontspanning', 'vakantie', 'reizen'],
      'studie': ['studie', 'school', 'universiteit', 'leren', 'examen', 'cursus'],
      'spiritualiteit': ['geloof', 'meditatie', 'mindfulness', 'spiritueel', 'gebed']
    };

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        themes.push(theme);
      }
    });

    return themes;
  }

  /**
   * Search entries
   */
  async searchEntries(userId: string, query: string): Promise<JournalEntry[]> {
    try {
      const userEntries = this.getEntriesByUser(userId);
      
      // Use text embeddings for semantic search
      const queryEmbedding = await textEmbeddingsService.generateEmbedding(query);
      const entryEmbeddings = await textEmbeddingsService.generateEmbeddings(
        userEntries.map(entry => entry.content)
      );

      const similarities = entryEmbeddings.map((embedding, index) => ({
        entry: userEntries[index],
        similarity: textEmbeddingsService.calculateCosineSimilarity(
          queryEmbedding.embedding,
          embedding.embedding
        )
      }));

      return similarities
        .filter(item => item.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .map(item => item.entry);
    } catch (error) {
      console.error('Enhanced Journaling AI Service: Error searching entries', error);
      return [];
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get service status
   */
  getStatus(): {
    totalEntries: number;
    totalInsights: number;
    totalRecommendations: number;
    ready: boolean;
  } {
    return {
      totalEntries: this.entries.size,
      totalInsights: Array.from(this.insights.values()).flat().length,
      totalRecommendations: Array.from(this.recommendations.values()).flat().length,
      ready: true
    };
  }
}

// Export singleton instance
export const enhancedJournalingAIService = new EnhancedJournalingAIService();

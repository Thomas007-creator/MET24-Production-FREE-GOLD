// @ts-nocheck
/**
 * Sentiment Analysis Service for MET24 Phase 2
 * 
 * Handles sentiment analysis using @xenova/transformers
 * 
 * @version 3.0.0-light-ai
 */

import { pipeline, Pipeline } from '@xenova/transformers';

export interface SentimentResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  scores: {
    positive: number;
    negative: number;
    neutral: number;
  };
  timestamp: Date;
}

export interface EmotionResult {
  text: string;
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
  dominantEmotion: string;
  confidence: number;
  timestamp: Date;
}

export interface SentimentConfig {
  model: string;
  maxLength: number;
  batchSize: number;
  cacheSize: number;
}

export class SentimentAnalysisService {
  private sentimentPipeline: Pipeline | null = null;
  private emotionPipeline: Pipeline | null = null;
  private config: SentimentConfig = {
    model: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
    maxLength: 512,
    batchSize: 16,
    cacheSize: 500
  };
  private sentimentCache: Map<string, SentimentResult> = new Map();
  private emotionCache: Map<string, EmotionResult> = new Map();
  private isInitialized: boolean = false;

  /**
   * Initialize the sentiment analysis pipelines
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('Sentiment Analysis Service: Initializing pipelines...');
      
      // Initialize sentiment analysis pipeline
      this.sentimentPipeline = await pipeline(
        'text-classification',
        this.config.model,
        {
          quantized: true,
          progress_callback: (progress: any) => {
            console.log('Sentiment Analysis Service: Loading sentiment model', progress);
          }
        }
      );

      // Initialize emotion analysis pipeline
      this.emotionPipeline = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-emotion',
        {
          quantized: true,
          progress_callback: (progress: any) => {
            console.log('Sentiment Analysis Service: Loading emotion model', progress);
          }
        }
      );

      this.isInitialized = true;
      console.log('Sentiment Analysis Service: Pipelines initialized successfully');
    } catch (error) {
      console.error('Sentiment Analysis Service: Error initializing pipelines', error);
      throw error;
    }
  }

  /**
   * Analyze sentiment of text
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.sentimentPipeline) {
        throw new Error('Sentiment pipeline not initialized');
      }

      // Check cache first
      const cacheKey = this.getCacheKey(text);
      const cached = this.sentimentCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Truncate text if too long
      const truncatedText = text.length > this.config.maxLength 
        ? text.substring(0, this.config.maxLength) 
        : text;

      console.log('Sentiment Analysis Service: Analyzing sentiment');
      
      const result = await this.sentimentPipeline(truncatedText);
      
      // Process result
      const sentiment = this.processSentimentResult(result);
      
      const sentimentResult: SentimentResult = {
        text: truncatedText,
        sentiment: sentiment.sentiment,
        confidence: sentiment.confidence,
        scores: sentiment.scores,
        timestamp: new Date()
      };

      // Cache the result
      this.cacheSentiment(cacheKey, sentimentResult);

      return sentimentResult;
    } catch (error) {
      console.error('Sentiment Analysis Service: Error analyzing sentiment', error);
      throw error;
    }
  }

  /**
   * Analyze emotions in text
   */
  async analyzeEmotions(text: string): Promise<EmotionResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.emotionPipeline) {
        throw new Error('Emotion pipeline not initialized');
      }

      // Check cache first
      const cacheKey = this.getCacheKey(text);
      const cached = this.emotionCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Truncate text if too long
      const truncatedText = text.length > this.config.maxLength 
        ? text.substring(0, this.config.maxLength) 
        : text;

      console.log('Sentiment Analysis Service: Analyzing emotions');
      
      const result = await this.emotionPipeline(truncatedText);
      
      // Process result
      const emotions = this.processEmotionResult(result);
      
      const emotionResult: EmotionResult = {
        text: truncatedText,
        emotions: emotions.emotions,
        dominantEmotion: emotions.dominantEmotion,
        confidence: emotions.confidence,
        timestamp: new Date()
      };

      // Cache the result
      this.cacheEmotion(cacheKey, emotionResult);

      return emotionResult;
    } catch (error) {
      console.error('Sentiment Analysis Service: Error analyzing emotions', error);
      throw error;
    }
  }

  /**
   * Analyze sentiment for multiple texts
   */
  async analyzeSentiments(texts: string[]): Promise<SentimentResult[]> {
    try {
      const results: SentimentResult[] = [];
      
      // Process in batches
      for (let i = 0; i < texts.length; i += this.config.batchSize) {
        const batch = texts.slice(i, i + this.config.batchSize);
        const batchPromises = batch.map(text => this.analyzeSentiment(text));
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      return results;
    } catch (error) {
      console.error('Sentiment Analysis Service: Error analyzing sentiments', error);
      throw error;
    }
  }

  /**
   * Analyze emotions for multiple texts
   */
  async analyzeEmotionsBatch(texts: string[]): Promise<EmotionResult[]> {
    try {
      const results: EmotionResult[] = [];
      
      // Process in batches
      for (let i = 0; i < texts.length; i += this.config.batchSize) {
        const batch = texts.slice(i, i + this.config.batchSize);
        const batchPromises = batch.map(text => this.analyzeEmotions(text));
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      return results;
    } catch (error) {
      console.error('Sentiment Analysis Service: Error analyzing emotions batch', error);
      throw error;
    }
  }

  /**
   * Get sentiment trend over time
   */
  async getSentimentTrend(
    texts: string[],
    timestamps: Date[]
  ): Promise<{
    trend: 'improving' | 'declining' | 'stable';
    averageSentiment: number;
    dataPoints: Array<{ timestamp: Date; sentiment: number; text: string }>;
  }> {
    try {
      const sentiments = await this.analyzeSentiments(texts);
      
      const dataPoints = sentiments.map((sentiment, index) => ({
        timestamp: timestamps[index],
        sentiment: this.sentimentToNumber(sentiment.sentiment),
        text: sentiment.text
      }));

      const averageSentiment = dataPoints.reduce((sum, point) => sum + point.sentiment, 0) / dataPoints.length;
      
      // Calculate trend
      const firstHalf = dataPoints.slice(0, Math.floor(dataPoints.length / 2));
      const secondHalf = dataPoints.slice(Math.floor(dataPoints.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((sum, point) => sum + point.sentiment, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, point) => sum + point.sentiment, 0) / secondHalf.length;
      
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      const difference = secondHalfAvg - firstHalfAvg;
      
      if (difference > 0.1) {
        trend = 'improving';
      } else if (difference < -0.1) {
        trend = 'declining';
      }

      return {
        trend,
        averageSentiment,
        dataPoints
      };
    } catch (error) {
      console.error('Sentiment Analysis Service: Error getting sentiment trend', error);
      throw error;
    }
  }

  /**
   * Process sentiment result
   */
  private processSentimentResult(result: any): {
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
    scores: { positive: number; negative: number; neutral: number };
  } {
    const scores = { positive: 0, negative: 0, neutral: 0 };
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let confidence = 0;

    if (Array.isArray(result)) {
      result.forEach((item: any) => {
        const label = item.label.toLowerCase();
        const score = item.score;
        
        if (label.includes('positive')) {
          scores.positive = score;
        } else if (label.includes('negative')) {
          scores.negative = score;
        } else if (label.includes('neutral')) {
          scores.neutral = score;
        }
      });

      // Determine dominant sentiment
      const maxScore = Math.max(scores.positive, scores.negative, scores.neutral);
      confidence = maxScore;

      if (scores.positive === maxScore) {
        sentiment = 'positive';
      } else if (scores.negative === maxScore) {
        sentiment = 'negative';
      } else {
        sentiment = 'neutral';
      }
    }

    return { sentiment, confidence, scores };
  }

  /**
   * Process emotion result
   */
  private processEmotionResult(result: any): {
    emotions: {
      joy: number;
      sadness: number;
      anger: number;
      fear: number;
      surprise: number;
      disgust: number;
    };
    dominantEmotion: string;
    confidence: number;
  } {
    const emotions = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      disgust: 0
    };

    let dominantEmotion = 'neutral';
    let confidence = 0;

    if (Array.isArray(result)) {
      result.forEach((item: any) => {
        const label = item.label.toLowerCase();
        const score = item.score;
        
        switch (label) {
          case 'joy':
            emotions.joy = score;
            break;
          case 'sadness':
            emotions.sadness = score;
            break;
          case 'anger':
            emotions.anger = score;
            break;
          case 'fear':
            emotions.fear = score;
            break;
          case 'surprise':
            emotions.surprise = score;
            break;
          case 'disgust':
            emotions.disgust = score;
            break;
        }
      });

      // Find dominant emotion
      const emotionEntries = Object.entries(emotions);
      const maxEntry = emotionEntries.reduce((max, current) => 
        current[1] > max[1] ? current : max
      );
      
      dominantEmotion = maxEntry[0];
      confidence = maxEntry[1];
    }

    return { emotions, dominantEmotion, confidence };
  }

  /**
   * Convert sentiment to number
   */
  private sentimentToNumber(sentiment: 'positive' | 'negative' | 'neutral'): number {
    switch (sentiment) {
      case 'positive': return 1;
      case 'negative': return -1;
      case 'neutral': return 0;
      default: return 0;
    }
  }

  /**
   * Cache sentiment result
   */
  private cacheSentiment(key: string, result: SentimentResult): void {
    if (this.sentimentCache.size >= this.config.cacheSize) {
      const oldestKey = this.sentimentCache.keys().next().value;
      this.sentimentCache.delete(oldestKey);
    }
    this.sentimentCache.set(key, result);
  }

  /**
   * Cache emotion result
   */
  private cacheEmotion(key: string, result: EmotionResult): void {
    if (this.emotionCache.size >= this.config.cacheSize) {
      const oldestKey = this.emotionCache.keys().next().value;
      this.emotionCache.delete(oldestKey);
    }
    this.emotionCache.set(key, result);
  }

  /**
   * Get cache key for text
   */
  private getCacheKey(text: string): string {
    return text.substring(0, 100);
  }

  /**
   * Clear caches
   */
  clearCaches(): void {
    this.sentimentCache.clear();
    this.emotionCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    sentimentCacheSize: number;
    emotionCacheSize: number;
    maxCacheSize: number;
  } {
    return {
      sentimentCacheSize: this.sentimentCache.size,
      emotionCacheSize: this.emotionCache.size,
      maxCacheSize: this.config.cacheSize
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SentimentConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): SentimentConfig {
    return { ...this.config };
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.sentimentPipeline !== null && this.emotionPipeline !== null;
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    sentimentModel: string;
    emotionModel: string;
    ready: boolean;
  } {
    return {
      initialized: this.isInitialized,
      sentimentModel: this.config.model,
      emotionModel: 'Xenova/distilbert-base-uncased-emotion',
      ready: this.isReady()
    };
  }
}

// Export singleton instance
export const sentimentAnalysisService = new SentimentAnalysisService();

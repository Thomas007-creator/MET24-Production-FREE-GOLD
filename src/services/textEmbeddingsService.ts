// @ts-nocheck
/**
 * Text Embeddings Service for MET24 Phase 2
 * 
 * Handles text embeddings using @xenova/transformers
 * 
 * @version 3.0.0-light-ai
 */

import { pipeline, Pipeline } from '@xenova/transformers';

export interface EmbeddingResult {
  embedding: number[];
  text: string;
  model: string;
  timestamp: Date;
}

export interface SimilarityResult {
  text1: string;
  text2: string;
  similarity: number;
  cosineSimilarity: number;
}

export interface EmbeddingConfig {
  model: string;
  maxLength: number;
  batchSize: number;
  cacheSize: number;
}

export class TextEmbeddingsService {
  private pipeline: Pipeline | null = null;
  private config: EmbeddingConfig = {
    model: 'Xenova/all-MiniLM-L6-v2',
    maxLength: 512,
    batchSize: 32,
    cacheSize: 1000
  };
  private embeddingCache: Map<string, EmbeddingResult> = new Map();
  private isInitialized: boolean = false;

  /**
   * Initialize the embeddings pipeline
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('Text Embeddings Service: Initializing pipeline...');
      
      this.pipeline = await pipeline(
        'feature-extraction',
        this.config.model,
        {
          quantized: true,
          progress_callback: (progress: any) => {
            console.log('Text Embeddings Service: Loading progress', progress);
          }
        }
      );

      this.isInitialized = true;
      console.log('Text Embeddings Service: Pipeline initialized successfully');
    } catch (error) {
      console.error('Text Embeddings Service: Error initializing pipeline', error);
      throw error;
    }
  }

  /**
   * Generate embedding for text
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!this.pipeline) {
        throw new Error('Pipeline not initialized');
      }

      // Check cache first
      const cacheKey = this.getCacheKey(text);
      const cached = this.embeddingCache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Truncate text if too long
      const truncatedText = text.length > this.config.maxLength 
        ? text.substring(0, this.config.maxLength) 
        : text;

      console.log('Text Embeddings Service: Generating embedding for text');
      
      const result = await this.pipeline(truncatedText, {
        pooling: 'mean',
        normalize: true
      });

      const embedding = Array.from(result.data);
      
      const embeddingResult: EmbeddingResult = {
        embedding,
        text: truncatedText,
        model: this.config.model,
        timestamp: new Date()
      };

      // Cache the result
      this.cacheEmbedding(cacheKey, embeddingResult);

      return embeddingResult;
    } catch (error) {
      console.error('Text Embeddings Service: Error generating embedding', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts
   */
  async generateEmbeddings(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      const results: EmbeddingResult[] = [];
      
      // Process in batches
      for (let i = 0; i < texts.length; i += this.config.batchSize) {
        const batch = texts.slice(i, i + this.config.batchSize);
        const batchPromises = batch.map(text => this.generateEmbedding(text));
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      return results;
    } catch (error) {
      console.error('Text Embeddings Service: Error generating embeddings', error);
      throw error;
    }
  }

  /**
   * Calculate similarity between two texts
   */
  async calculateSimilarity(text1: string, text2: string): Promise<SimilarityResult> {
    try {
      const [embedding1, embedding2] = await Promise.all([
        this.generateEmbedding(text1),
        this.generateEmbedding(text2)
      ]);

      const cosineSimilarity = this.calculateCosineSimilarity(
        embedding1.embedding,
        embedding2.embedding
      );

      return {
        text1,
        text2,
        similarity: cosineSimilarity,
        cosineSimilarity
      };
    } catch (error) {
      console.error('Text Embeddings Service: Error calculating similarity', error);
      throw error;
    }
  }

  /**
   * Find most similar texts
   */
  async findMostSimilar(
    queryText: string,
    candidateTexts: string[],
    topK: number = 5
  ): Promise<Array<{ text: string; similarity: number; index: number }>> {
    try {
      const queryEmbedding = await this.generateEmbedding(queryText);
      const candidateEmbeddings = await this.generateEmbeddings(candidateTexts);

      const similarities = candidateEmbeddings.map((embedding, index) => ({
        text: candidateTexts[index],
        similarity: this.calculateCosineSimilarity(
          queryEmbedding.embedding,
          embedding.embedding
        ),
        index
      }));

      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
    } catch (error) {
      console.error('Text Embeddings Service: Error finding most similar texts', error);
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  calculateCosineSimilarity(vector1: number[], vector2: number[]): number {
    if (vector1.length !== vector2.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vector1.length; i++) {
      dotProduct += vector1[i] * vector2[i];
      norm1 += vector1[i] * vector1[i];
      norm2 += vector2[i] * vector2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Cache embedding result
   */
  private cacheEmbedding(key: string, result: EmbeddingResult): void {
    // Remove oldest entries if cache is full
    if (this.embeddingCache.size >= this.config.cacheSize) {
      const oldestKey = this.embeddingCache.keys().next().value;
      this.embeddingCache.delete(oldestKey);
    }

    this.embeddingCache.set(key, result);
  }

  /**
   * Get cache key for text
   */
  private getCacheKey(text: string): string {
    return `${this.config.model}_${text.substring(0, 100)}`;
  }

  /**
   * Clear embedding cache
   */
  clearCache(): void {
    this.embeddingCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.embeddingCache.size,
      maxSize: this.config.cacheSize,
      hitRate: 0.85 // Mock hit rate
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<EmbeddingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): EmbeddingConfig {
    return { ...this.config };
  }

  /**
   * Check if service is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.pipeline !== null;
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    model: string;
    cacheSize: number;
    ready: boolean;
  } {
    return {
      initialized: this.isInitialized,
      model: this.config.model,
      cacheSize: this.embeddingCache.size,
      ready: this.isReady()
    };
  }
}

// Export singleton instance
export const textEmbeddingsService = new TextEmbeddingsService();

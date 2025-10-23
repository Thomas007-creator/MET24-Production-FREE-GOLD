/**
 * Model Loading and Text Processing Service for MET24 Phase 2
 * 
 * Handles model loading and text processing with @xenova/transformers
 * 
 * @version 3.0.0-light-ai
 */

import { pipeline, Pipeline } from '@xenova/transformers';

export interface ModelConfig {
  name: string;
  type: 'text-classification' | 'feature-extraction' | 'text-generation';
  quantized: boolean;
  cacheDir: string;
  maxLength: number;
}

export interface TextProcessingResult {
  input: string;
  output: any;
  model: string;
  processingTime: number;
  confidence?: number;
  timestamp: Date;
}

export interface ModelStatus {
  name: string;
  loaded: boolean;
  loading: boolean;
  error?: string;
  lastUsed: Date | null;
  usageCount: number;
}

export class ModelLoadingService {
  private models: Map<string, Pipeline> = new Map();
  private modelStatuses: Map<string, ModelStatus> = new Map();
  private modelConfigs: ModelConfig[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initializeModelConfigs();
  }

  /**
   * Initialize model configurations
   */
  private initializeModelConfigs(): void {
    this.modelConfigs = [
      {
        name: 'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        type: 'text-classification',
        quantized: true,
        cacheDir: '/models/sentiment',
        maxLength: 512
      },
      {
        name: 'Xenova/all-MiniLM-L6-v2',
        type: 'feature-extraction',
        quantized: true,
        cacheDir: '/models/embeddings',
        maxLength: 512
      },
      {
        name: 'Xenova/distilbert-base-uncased-emotion',
        type: 'text-classification',
        quantized: true,
        cacheDir: '/models/emotion',
        maxLength: 512
      },
      {
        name: 'Xenova/gpt2',
        type: 'text-generation',
        quantized: true,
        cacheDir: '/models/generation',
        maxLength: 1024
      }
    ];

    // Initialize model statuses
    this.modelConfigs.forEach(config => {
      this.modelStatuses.set(config.name, {
        name: config.name,
        loaded: false,
        loading: false,
        lastUsed: null,
        usageCount: 0
      });
    });
  }

  /**
   * Initialize model loading service
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        return;
      }

      console.log('Model Loading Service: Initializing...');

      // Pre-load essential models
      await this.preloadEssentialModels();

      this.isInitialized = true;
      console.log('Model Loading Service: Initialized successfully');
    } catch (error) {
      console.error('Model Loading Service: Error initializing', error);
      throw error;
    }
  }

  /**
   * Pre-load essential models
   */
  private async preloadEssentialModels(): Promise<void> {
    const essentialModels = [
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      'Xenova/all-MiniLM-L6-v2'
    ];

    for (const modelName of essentialModels) {
      try {
        await this.loadModel(modelName);
        console.log(`Model Loading Service: Pre-loaded ${modelName}`);
      } catch (error) {
        console.error(`Model Loading Service: Error pre-loading ${modelName}`, error);
      }
    }
  }

  /**
   * Load model
   */
  async loadModel(modelName: string): Promise<Pipeline> {
    try {
      // Check if model is already loaded
      if (this.models.has(modelName)) {
        const status = this.modelStatuses.get(modelName);
        if (status) {
          status.lastUsed = new Date();
          status.usageCount++;
        }
        return this.models.get(modelName)!;
      }

      // Check if model is currently loading
      const status = this.modelStatuses.get(modelName);
      if (status && status.loading) {
        // Wait for loading to complete
        while (status.loading) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        return this.models.get(modelName)!;
      }

      // Get model configuration
      const config = this.modelConfigs.find(c => c.name === modelName);
      if (!config) {
        throw new Error(`Model configuration not found: ${modelName}`);
      }

      // Update status
      if (status) {
        status.loading = true;
        status.error = undefined;
      }

      console.log(`Model Loading Service: Loading ${modelName}...`);

      // Load the model
      const pipelineInstance = await pipeline(
        config.type,
        modelName,
        {
          quantized: config.quantized,
          progress_callback: (progress: any) => {
            console.log(`Model Loading Service: Loading ${modelName} progress`, progress);
          }
        }
      );

      // Store the model
      this.models.set(modelName, pipelineInstance as any);

      // Update status
      if (status) {
        status.loaded = true;
        status.loading = false;
        status.lastUsed = new Date();
        status.usageCount = 1;
      }

      console.log(`Model Loading Service: Successfully loaded ${modelName}`);
      return pipelineInstance as any;
    } catch (error) {
      // Update status with error
      const status = this.modelStatuses.get(modelName);
      if (status) {
        status.loading = false;
        status.error = error instanceof Error ? error.message : 'Unknown error';
      }

      console.error(`Model Loading Service: Error loading ${modelName}`, error);
      throw error;
    }
  }

  /**
   * Process text with model
   */
  async processText(
    modelName: string,
    text: string,
    options: any = {}
  ): Promise<TextProcessingResult> {
    try {
      const startTime = Date.now();

      // Load model if not already loaded
      const pipeline = await this.loadModel(modelName);

      // Truncate text if too long
      const config = this.modelConfigs.find(c => c.name === modelName);
      const maxLength = config?.maxLength || 512;
      const truncatedText = text.length > maxLength 
        ? text.substring(0, maxLength) 
        : text;

      // Process text
      const result = await pipeline(truncatedText, options);

      const processingTime = Date.now() - startTime;

      // Update model usage
      const status = this.modelStatuses.get(modelName);
      if (status) {
        status.lastUsed = new Date();
        status.usageCount++;
      }

      return {
        input: truncatedText,
        output: result,
        model: modelName,
        processingTime,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Model Loading Service: Error processing text with ${modelName}`, error);
      throw error;
    }
  }

  /**
   * Classify text sentiment
   */
  async classifySentiment(text: string): Promise<TextProcessingResult> {
    try {
      const modelName = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
      return await this.processText(modelName, text);
    } catch (error) {
      console.error('Model Loading Service: Error classifying sentiment', error);
      throw error;
    }
  }

  /**
   * Generate text embeddings
   */
  async generateEmbeddings(text: string): Promise<TextProcessingResult> {
    try {
      const modelName = 'Xenova/all-MiniLM-L6-v2';
      return await this.processText(modelName, text, {
        pooling: 'mean',
        normalize: true
      });
    } catch (error) {
      console.error('Model Loading Service: Error generating embeddings', error);
      throw error;
    }
  }

  /**
   * Classify emotions
   */
  async classifyEmotions(text: string): Promise<TextProcessingResult> {
    try {
      const modelName = 'Xenova/distilbert-base-uncased-emotion';
      return await this.processText(modelName, text);
    } catch (error) {
      console.error('Model Loading Service: Error classifying emotions', error);
      throw error;
    }
  }

  /**
   * Generate text
   */
  async generateText(prompt: string, maxLength: number = 100): Promise<TextProcessingResult> {
    try {
      const modelName = 'Xenova/gpt2';
      return await this.processText(modelName, prompt, {
        max_length: maxLength,
        do_sample: true,
        temperature: 0.7
      });
    } catch (error) {
      console.error('Model Loading Service: Error generating text', error);
      throw error;
    }
  }

  /**
   * Batch process texts
   */
  async batchProcessTexts(
    modelName: string,
    texts: string[],
    options: any = {}
  ): Promise<TextProcessingResult[]> {
    try {
      const results: TextProcessingResult[] = [];
      
      // Process in batches to avoid memory issues
      const batchSize = 5;
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const batchPromises = batch.map(text => this.processText(modelName, text, options));
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      return results;
    } catch (error) {
      console.error(`Model Loading Service: Error batch processing texts with ${modelName}`, error);
      throw error;
    }
  }

  /**
   * Unload model
   */
  async unloadModel(modelName: string): Promise<void> {
    try {
      if (this.models.has(modelName)) {
        // Note: @xenova/transformers doesn't have explicit unload method
        // We just remove from our cache
        this.models.delete(modelName);
        
        const status = this.modelStatuses.get(modelName);
        if (status) {
          status.loaded = false;
        }
        
        console.log(`Model Loading Service: Unloaded ${modelName}`);
      }
    } catch (error) {
      console.error(`Model Loading Service: Error unloading ${modelName}`, error);
      throw error;
    }
  }

  /**
   * Unload all models
   */
  async unloadAllModels(): Promise<void> {
    try {
      const modelNames = Array.from(this.models.keys());
      await Promise.all(modelNames.map(name => this.unloadModel(name)));
      console.log('Model Loading Service: Unloaded all models');
    } catch (error) {
      console.error('Model Loading Service: Error unloading all models', error);
      throw error;
    }
  }

  /**
   * Get model status
   */
  getModelStatus(modelName: string): ModelStatus | null {
    return this.modelStatuses.get(modelName) || null;
  }

  /**
   * Get all model statuses
   */
  getAllModelStatuses(): ModelStatus[] {
    return Array.from(this.modelStatuses.values());
  }

  /**
   * Get loaded models
   */
  getLoadedModels(): string[] {
    return Array.from(this.models.keys());
  }

  /**
   * Get available models
   */
  getAvailableModels(): ModelConfig[] {
    return [...this.modelConfigs];
  }

  /**
   * Check if model is loaded
   */
  isModelLoaded(modelName: string): boolean {
    return this.models.has(modelName);
  }

  /**
   * Get model memory usage
   */
  getModelMemoryUsage(): {
    totalModels: number;
    loadedModels: number;
    estimatedMemory: number; // in MB
  } {
    const totalModels = this.modelConfigs.length;
    const loadedModels = this.models.size;
    
    // Rough estimation of memory usage per model
    const estimatedMemoryPerModel = 50; // MB
    const estimatedMemory = loadedModels * estimatedMemoryPerModel;

    return {
      totalModels,
      loadedModels,
      estimatedMemory
    };
  }

  /**
   * Optimize model loading
   */
  async optimizeModelLoading(): Promise<void> {
    try {
      // Unload unused models
      const now = Date.now();
      const unusedThreshold = 30 * 60 * 1000; // 30 minutes

      for (const [modelName, status] of this.modelStatuses) {
        if (status.loaded && status.lastUsed) {
          const timeSinceLastUse = now - status.lastUsed.getTime();
          if (timeSinceLastUse > unusedThreshold) {
            await this.unloadModel(modelName);
            console.log(`Model Loading Service: Unloaded unused model ${modelName}`);
          }
        }
      }
    } catch (error) {
      console.error('Model Loading Service: Error optimizing model loading', error);
    }
  }

  /**
   * Get service status
   */
  getStatus(): {
    initialized: boolean;
    totalModels: number;
    loadedModels: number;
    ready: boolean;
  } {
    return {
      initialized: this.isInitialized,
      totalModels: this.modelConfigs.length,
      loadedModels: this.models.size,
      ready: this.isInitialized
    };
  }
}

// Export singleton instance
export const modelLoadingService = new ModelLoadingService();

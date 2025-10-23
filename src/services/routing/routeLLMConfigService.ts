/**
 * RouteLLM Configuration Service
 * 
 * Manages RouteLLM settings from user preferences:
 * - Optimization level (aggressive/balanced/quality_first)
 * - Fallback to local model preference
 * - Provider priorities
 * 
 * Settings are stored in localStorage and synced with RouteLLM service
 */

import { routeLLMService } from './routeLLMService';
import type { OptimizationLevel } from './routeLLMService';
import { logger } from '../../utils/logger';

const STORAGE_KEY = 'met24_routellm_config';

export interface RouteLLMConfig {
  optimizationLevel: OptimizationLevel;
  fallbackToLocal: boolean;
  lastUpdated: string;
}

const DEFAULT_CONFIG: RouteLLMConfig = {
  optimizationLevel: 'balanced',
  fallbackToLocal: true,
  lastUpdated: new Date().toISOString()
};

class RouteLLMConfigService {
  private config: RouteLLMConfig = DEFAULT_CONFIG;
  private initialized = false;

  /**
   * Initialize config from localStorage
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (stored) {
        this.config = JSON.parse(stored);
        logger.info('[RouteLLM Config] Loaded from localStorage', this.config);
      } else {
        logger.info('[RouteLLM Config] Using defaults', DEFAULT_CONFIG);
        this.config = { ...DEFAULT_CONFIG };
      }

      // Apply to RouteLLM service
      this.applyToService();
      this.initialized = true;

    } catch (error) {
      logger.error('[RouteLLM Config] Error loading config', { error });
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  /**
   * Get current config
   */
  getConfig(): RouteLLMConfig {
    if (!this.initialized) {
      // Initialize synchronously if not done yet
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          this.config = JSON.parse(stored);
        } catch {
          this.config = { ...DEFAULT_CONFIG };
        }
      }
      this.initialized = true;
    }
    return { ...this.config };
  }

  /**
   * Update optimization level
   */
  async setOptimizationLevel(level: OptimizationLevel): Promise<void> {
    this.config.optimizationLevel = level;
    this.config.lastUpdated = new Date().toISOString();
    await this.save();
    this.applyToService();
    
    logger.info('[RouteLLM Config] Optimization level updated', { level });
  }

  /**
   * Update fallback to local preference
   */
  async setFallbackToLocal(enabled: boolean): Promise<void> {
    this.config.fallbackToLocal = enabled;
    this.config.lastUpdated = new Date().toISOString();
    await this.save();
    this.applyToService();
    
    logger.info('[RouteLLM Config] Fallback to local updated', { enabled });
  }

  /**
   * Update entire config
   */
  async updateConfig(updates: Partial<RouteLLMConfig>): Promise<void> {
    this.config = {
      ...this.config,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    await this.save();
    this.applyToService();
    
    logger.info('[RouteLLM Config] Config updated', this.config);
  }

  /**
   * Save config to localStorage
   */
  private async save(): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      logger.error('[RouteLLM Config] Error saving config', { error });
    }
  }

  /**
   * Apply config to RouteLLM service
   */
  private applyToService(): void {
    routeLLMService.setOptimizationLevel(this.config.optimizationLevel);
    routeLLMService.setFallbackToLocal(this.config.fallbackToLocal);
  }

  /**
   * Reset to defaults
   */
  async reset(): Promise<void> {
    this.config = { ...DEFAULT_CONFIG };
    await this.save();
    this.applyToService();
    
    logger.info('[RouteLLM Config] Reset to defaults');
  }
}

export const routeLLMConfigService = new RouteLLMConfigService();

// Auto-initialize on import
routeLLMConfigService.initialize().catch((error) => {
  logger.error('[RouteLLM Config] Auto-initialization failed', { error });
});

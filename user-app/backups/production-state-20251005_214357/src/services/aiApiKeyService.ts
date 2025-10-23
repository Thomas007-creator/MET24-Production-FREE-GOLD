/**
 * AI API Key Management Service
 * 
 * Manages user AI API keys using existing WatermelonDB schema:
 * - settings table for encrypted API keys
 * - external_ai_services table for service configuration
 * 
 * Supported providers: XAI, OpenAI, Anthropic, UltimateAI
 */

import { databaseService } from './databaseService';
import { logger } from '../utils/logger';
import { encryptPayload } from '../utils/encryption';

export interface AIProviderConfig {
  provider: 'xai' | 'openai' | 'anthropic' | 'ultimateai';
  apiKey: string;
  userId: string;
  serviceLimits?: {
    dailyLimit?: number;
    monthlyLimit?: number;
    tokensPerRequest?: number;
  };
}

export interface AIUsageStats {
  requestsToday: number;
  tokensUsed: number;
  lastUsed: number;
  dailyLimit: number;
  monthlyLimit: number;
}

class AIApiKeyService {
  
  /**
   * Save AI API key to settings table (encrypted)
   */
  async saveApiKey(config: AIProviderConfig): Promise<void> {
    try {
      const encryptedKey = encryptPayload(config.apiKey);
      
      await databaseService.write(async () => {
        // Save to settings table
        await databaseService.createOrUpdateSetting({
          user_id: config.userId,
          key: `${config.provider}_api_key`,
          value: encryptedKey,
          category: 'ai_services',
          data_type: 'encrypted_string'
        });

        // Save to external_ai_services table
        await databaseService.createOrUpdateExternalAIService({
          service_id: `${config.userId}_${config.provider}`,
          service_type: config.provider,
          service_endpoint: this.getServiceEndpoint(config.provider),
          authentication_data: JSON.stringify({
            api_key: encryptedKey,
            user_id: config.userId
          }),
          service_model: this.getDefaultModel(config.provider),
          service_configuration: JSON.stringify({
            provider: config.provider,
            user_id: config.userId
          }),
          service_limits: JSON.stringify(config.serviceLimits || {}),
          usage_statistics: JSON.stringify({
            requests_today: 0,
            tokens_used: 0,
            last_used: Date.now()
          }),
          service_status: 'active',
          last_accessed: Date.now()
        });
      });

      logger.info(`AI API key saved for ${config.provider}`, { userId: config.userId });
    } catch (error) {
      logger.error('Error saving AI API key:', { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }

  /**
   * Get AI API key from settings table (decrypted)
   */
  async getApiKey(userId: string, provider: string): Promise<string | null> {
    try {
      const setting = await databaseService.getSetting(userId, `${provider}_api_key`);
      if (!setting) return null;

      // Decrypt the API key
      return this.decryptApiKey(setting.value);
    } catch (error) {
      logger.error('Error getting AI API key:', { error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  /**
   * Get AI usage statistics
   */
  async getUsageStats(userId: string, provider: string): Promise<AIUsageStats | null> {
    try {
      const service = await databaseService.getExternalAIService(`${userId}_${provider}`);
      if (!service) return null;

      const usageStats = JSON.parse(service.usage_statistics || '{}');
      const serviceLimits = JSON.parse(service.service_limits || '{}');

      return {
        requestsToday: usageStats.requests_today || 0,
        tokensUsed: usageStats.tokens_used || 0,
        lastUsed: usageStats.last_used || 0,
        dailyLimit: serviceLimits.dailyLimit || 50,
        monthlyLimit: serviceLimits.monthlyLimit || 1000
      };
    } catch (error) {
      logger.error('Error getting AI usage stats:', { error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  /**
   * Update usage statistics after API call
   */
  async updateUsageStats(userId: string, provider: string, tokensUsed: number): Promise<void> {
    try {
      const service = await databaseService.getExternalAIService(`${userId}_${provider}`);
      if (!service) return;

      const currentStats = JSON.parse(service.usage_statistics || '{}');
      const newStats = {
        requests_today: (currentStats.requests_today || 0) + 1,
        tokens_used: (currentStats.tokens_used || 0) + tokensUsed,
        last_used: Date.now()
      };

      await databaseService.write(async () => {
        await databaseService.updateExternalAIService(`${userId}_${provider}`, {
          usage_statistics: JSON.stringify(newStats),
          last_accessed: Date.now()
        });
      });

      logger.info(`Usage stats updated for ${provider}`, { userId, tokensUsed });
    } catch (error) {
      logger.error('Error updating usage stats:', { error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * Check if user has reached daily limit
   */
  async hasReachedDailyLimit(userId: string, provider: string): Promise<boolean> {
    const stats = await this.getUsageStats(userId, provider);
    if (!stats) return false;

    return stats.requestsToday >= stats.dailyLimit;
  }

  /**
   * Get all AI providers for user
   */
  async getUserAIProviders(userId: string): Promise<string[]> {
    try {
      const providers = await databaseService.getUserSettingsByCategory(userId, 'ai_services');
      return providers
        .filter(setting => setting.key.endsWith('_api_key'))
        .map(setting => setting.key.replace('_api_key', ''));
    } catch (error) {
      logger.error('Error getting user AI providers:', { error: error instanceof Error ? error.message : String(error) });
      return [];
    }
  }

  // Helper methods
  private getServiceEndpoint(provider: string): string {
    const endpoints: Record<string, string> = {
      'xai': 'https://api.x.ai/v1',
      'openai': 'https://api.openai.com/v1',
      'anthropic': 'https://api.anthropic.com/v1',
      'ultimateai': 'https://chat.obsidianaitools.com/v1'
    };
    return endpoints[provider] || '';
  }

  private getDefaultModel(provider: string): string {
    const models: Record<string, string> = {
      'xai': 'grok-3-mini',
      'openai': 'gpt-4',
      'anthropic': 'claude-3-sonnet',
      'ultimateai': 'grok-4'
    };
    return models[provider] || '';
  }

  private decryptApiKey(encryptedKey: string): string {
    // TODO: Implement decryption using decryptPayload
    // For now, return as-is (should be decrypted)
    return encryptedKey;
  }
}

export const aiApiKeyService = new AIApiKeyService();

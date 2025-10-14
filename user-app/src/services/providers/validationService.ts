/**
 * API Key Validation Service
 *
 * Validates API keys for various AI providers
 */

import { OpenAIProvider } from './openaiProvider';
import { AnthropicProvider } from './anthropicProvider';
import { XAIProvider } from './xaiProvider';
import { GoogleProvider } from './googleProvider';
import { AbacusProvider } from './abacusProvider';
import type { ProviderConfig } from './types';

export async function validateAPIKey(provider: string, apiKey: string): Promise<boolean> {
  if (!apiKey || apiKey.trim() === '') {
    return false;
  }

  const config: ProviderConfig = { apiKey };

  try {
    switch (provider) {
      case 'openai':
        return await new OpenAIProvider(config).validateKey();

      case 'anthropic':
        return await new AnthropicProvider(config).validateKey();

      case 'xai':
        return await new XAIProvider(config).validateKey();

      case 'google':
        return await new GoogleProvider(config).validateKey();

      case 'abacus':
        // Abacus.AI uses unified API - validate with simple request
        return await new AbacusProvider(config).chat({
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5
        }).then(r => r.success);

      default:
        return false;
    }
  } catch (error) {
    console.error(`Error validating ${provider} API key:`, error);
    return false;
  }
}

export function maskAPIKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return '*'.repeat(apiKey.length);
  }

  const prefix = apiKey.slice(0, 4);
  const suffix = apiKey.slice(-4);
  const masked = '*'.repeat(apiKey.length - 8);

  return `${prefix}${masked}${suffix}`;
}

export function getProviderDisplayName(provider: string): string {
  const names: Record<string, string> = {
    'anthropic': 'Anthropic (Claude)',
    'xai': 'xAI (Grok-3)',
    'openai': 'OpenAI (GPT)',
    'google': 'Google (Gemini)',
    'abacus': 'Abacus.AI (Unified API)'
  };

  return names[provider] || provider;
}

export function getProviderDescription(provider: string): string {
  const descriptions: Record<string, string> = {
    'anthropic': 'Recommended for MBTI & Personality Coaching',
    'xai': 'Good value for mid-range tasks',
    'openai': 'Premium quality for complex reasoning',
    'google': 'Budget-friendly with good performance',
    'abacus': 'Access to Grok-4, Claude 4.1, GPT-5, Gemini 2.5, Qwen-2.5'
  };

  return descriptions[provider] || '';
}

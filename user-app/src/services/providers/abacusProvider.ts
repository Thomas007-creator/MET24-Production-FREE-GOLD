/**
 * Abacus.AI Provider Service
 * 
 * Unified API access to multiple premium models:
 * - Grok-4 (xAI)
 * - Claude 4.1 Opus (Anthropic)
 * - GPT-5 (OpenAI)
 * - Gemini 2.5 Pro (Google)
 * - Qwen-2.5-Coder-32b (Alibaba)
 * 
 * Provides BYOK (Bring Your Own Key) support for cost-effective AI access
 */

import type { ChatRequest, ChatResponse, UsageMetrics, ProviderConfig } from './types';

export const ABACUS_PRICING = {
  'grok-4': {
    input: 10.0,   // $10 per million input tokens
    output: 30.0   // $30 per million output tokens
  },
  'claude-4.1-opus': {
    input: 15.0,   // $15 per million input tokens
    output: 75.0   // $75 per million output tokens
  },
  'gpt-5': {
    input: 12.0,   // $12 per million input tokens
    output: 36.0   // $36 per million output tokens
  },
  'gemini-2.5-pro': {
    input: 7.0,    // $7 per million input tokens
    output: 21.0   // $21 per million output tokens
  },
  'gemini-2.5-flash': {
    input: 0.35,   // $0.35 per million input tokens
    output: 1.05   // $1.05 per million output tokens
  },
  'qwen-2.5-coder-32b': {
    input: 0.5,    // $0.50 per million input tokens
    output: 1.5    // $1.50 per million output tokens
  }
};

export class AbacusProvider {
  private apiKey: string;
  private baseUrl = 'https://api.abacus.ai/v1';
  
  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    if (config.endpoint) {
      this.baseUrl = config.endpoint;
    }
  }

  /**
   * Send chat request to Abacus.AI
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const model = request.model || 'grok-4';

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 4096,
          stream: false
        })
      });

      if (!response.ok) {
        const error = await response.text();
        return {
          success: false,
          error: `Abacus.AI API error (${response.status}): ${error}`
        };
      }

      const data = await response.json();

      return {
        success: true,
        content: data.choices[0]?.message?.content || '',
        usage: {
          prompt_tokens: data.usage?.prompt_tokens || 0,
          completion_tokens: data.usage?.completion_tokens || 0,
          total_tokens: data.usage?.total_tokens || 0
        },
        model: data.model
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Calculate cost for Abacus.AI models
   */
  static calculateCost(model: string, usage: UsageMetrics): number {
    const pricing = ABACUS_PRICING[model as keyof typeof ABACUS_PRICING] || ABACUS_PRICING['grok-4'];
    const inputCost = (usage.promptTokens / 1_000_000) * pricing.input;
    const outputCost = (usage.completionTokens / 1_000_000) * pricing.output;
    return inputCost + outputCost;
  }

  /**
   * Get available models
   */
  static getAvailableModels(): string[] {
    return Object.keys(ABACUS_PRICING);
  }

  /**
   * Check if model is supported
   */
  static isModelSupported(model: string): boolean {
    return model in ABACUS_PRICING;
  }
}

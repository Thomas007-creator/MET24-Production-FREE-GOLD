/**
 * xAI Grok-3 Provider Service
 *
 * Integrates with xAI's Grok-3 API for BYOK (Bring Your Own Key) support
 * Uses OpenAI-compatible API format
 */

import type { ChatRequest, ChatResponse, UsageMetrics, ProviderConfig } from './types';

export const GROK_PRICING = {
  'grok-3': {
    input: 3.0,   // $3 per million input tokens
    output: 15.0  // $15 per million output tokens
  },
  'grok-3-mini': {
    input: 1.0,   // Estimated: $1 per million input tokens
    output: 5.0   // Estimated: $5 per million output tokens
  }
};

export class XAIProvider {
  private apiKey: string;
  private baseUrl = 'https://api.x.ai/v1';

  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    if (config.endpoint) {
      this.baseUrl = config.endpoint;
    }
  }

  /**
   * Send chat request to Grok-3
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const model = request.model || 'grok-3';

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
          max_tokens: request.max_tokens || 2000,
          stream: request.stream || false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
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
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Calculate cost for a request
   */
  calculateCost(usage: UsageMetrics, model: string = 'grok-3'): number {
    const pricing = GROK_PRICING[model as keyof typeof GROK_PRICING] || GROK_PRICING['grok-3'];

    const inputCost = (usage.promptTokens / 1_000_000) * pricing.input;
    const outputCost = (usage.completionTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
  }

  /**
   * Validate API key
   */
  async validateKey(): Promise<boolean> {
    try {
      const response = await this.chat({
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      });
      return response.success;
    } catch {
      return false;
    }
  }
}

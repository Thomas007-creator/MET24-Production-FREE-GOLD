/**
 * OpenAI Provider Service
 * 
 * Integrates with OpenAI's GPT API for BYOK (Bring Your Own Key) support
 */

import type { ChatRequest, ChatResponse, UsageMetrics, ProviderConfig } from './types';

export const OPENAI_PRICING = {
  'gpt-4': {
    input: 30.0,   // $30 per million input tokens
    output: 60.0   // $60 per million output tokens
  },
  'gpt-4o': {
    input: 5.0,    // $5 per million input tokens
    output: 15.0   // $15 per million output tokens
  },
  'gpt-4o-mini': {
    input: 0.15,   // $0.15 per million input tokens
    output: 0.6    // $0.60 per million output tokens
  },
  'gpt-3.5-turbo': {
    input: 0.5,    // $0.50 per million input tokens
    output: 1.5    // $1.50 per million output tokens
  }
};

export class OpenAIProvider {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';
  
  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    if (config.endpoint) {
      this.baseUrl = config.endpoint;
    }
  }

  /**
   * Send chat request to GPT
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const model = request.model || 'gpt-4o';
      
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
  calculateCost(usage: UsageMetrics, model: string = 'gpt-4o'): number {
    const pricing = OPENAI_PRICING[model as keyof typeof OPENAI_PRICING] || OPENAI_PRICING['gpt-4o'];
    
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

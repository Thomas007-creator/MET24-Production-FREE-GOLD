/**
 * Anthropic Claude Provider Service
 * 
 * Integrates with Anthropic's Claude API for BYOK (Bring Your Own Key) support
 * Recommended for MBTI and personality coaching
 */

import type { ChatRequest, ChatResponse, UsageMetrics, ProviderConfig } from './types';

export const ANTHROPIC_PRICING = {
  'claude-3-opus-20240229': {
    input: 15.0,   // $15 per million input tokens
    output: 75.0   // $75 per million output tokens
  },
  'claude-3-sonnet-20240229': {
    input: 3.0,    // $3 per million input tokens
    output: 15.0   // $15 per million output tokens
  },
  'claude-3-haiku-20240307': {
    input: 0.25,   // $0.25 per million input tokens
    output: 1.25   // $1.25 per million output tokens
  }
};

export class AnthropicProvider {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1';
  private apiVersion = '2023-06-01';
  
  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    if (config.endpoint) {
      this.baseUrl = config.endpoint;
    }
  }

  /**
   * Send chat request to Claude
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const model = request.model || 'claude-3-sonnet-20240229';
      
      // Extract system message if present
      const systemMessage = request.messages.find(msg => msg.role === 'system');
      const messages = request.messages.filter(msg => msg.role !== 'system');
      
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.apiVersion
        },
        body: JSON.stringify({
          model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          system: systemMessage?.content,
          max_tokens: request.max_tokens || 2000,
          temperature: request.temperature || 0.7,
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
        content: data.content[0]?.text || '',
        usage: {
          prompt_tokens: data.usage?.input_tokens || 0,
          completion_tokens: data.usage?.output_tokens || 0,
          total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
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
  calculateCost(usage: UsageMetrics, model: string = 'claude-3-sonnet-20240229'): number {
    const pricing = ANTHROPIC_PRICING[model as keyof typeof ANTHROPIC_PRICING] || ANTHROPIC_PRICING['claude-3-sonnet-20240229'];
    
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

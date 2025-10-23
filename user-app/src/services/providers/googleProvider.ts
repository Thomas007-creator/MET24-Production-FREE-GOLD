/**
 * Google Gemini Provider Service
 * 
 * Integrates with Google's Gemini API for BYOK (Bring Your Own Key) support
 */

import type { ChatRequest, ChatResponse, UsageMetrics, ProviderConfig } from './types';

export const GEMINI_PRICING = {
  'gemini-pro': {
    input: 0.5,   // $0.50 per million input tokens
    output: 1.5   // $1.50 per million output tokens
  },
  'gemini-ultra': {
    input: 15.0,  // $15 per million input tokens
    output: 45.0  // $45 per million output tokens
  }
};

export class GoogleProvider {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1';
  
  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    if (config.endpoint) {
      this.baseUrl = config.endpoint;
    }
  }

  /**
   * Send chat request to Gemini
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const model = request.model || 'gemini-pro';
      
      // Convert messages to Gemini format
      const contents = request.messages
        .filter(msg => msg.role !== 'system') // Gemini doesn't support system messages directly
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const response = await fetch(
        `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: request.temperature || 0.7,
              maxOutputTokens: request.max_tokens || 2000
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        success: true,
        content,
        usage: {
          prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
          completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: data.usageMetadata?.totalTokenCount || 0
        },
        model: data.modelVersion || model
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
  calculateCost(usage: UsageMetrics, model: string = 'gemini-pro'): number {
    const pricing = GEMINI_PRICING[model as keyof typeof GEMINI_PRICING] || GEMINI_PRICING['gemini-pro'];
    
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

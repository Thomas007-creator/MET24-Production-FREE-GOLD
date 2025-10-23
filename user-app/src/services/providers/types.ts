/**
 * Common types for AI Provider services
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
}

export interface UsageMetrics {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

export interface ProviderConfig {
  apiKey: string;
  endpoint?: string;
  model?: string;
  timeout?: number;
}

export type AIProvider = 'anthropic' | 'xai' | 'openai' | 'google' | 'local';

export interface ModelInfo {
  id: string;
  name: string;
  provider: AIProvider;
  contextWindow: number;
  pricing: {
    input: number;  // per million tokens
    output: number; // per million tokens
  };
}

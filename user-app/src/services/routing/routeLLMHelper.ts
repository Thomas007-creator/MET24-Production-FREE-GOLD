/**
 * RouteLLM Integration Helper
 * 
 * Provides easy integration between RouteLLM and existing AI services
 * Can be used as a drop-in replacement for direct provider calls
 */

import { routeLLMService } from './routeLLMService';
import type { RouteLLMQuery, RoutingResult } from './routeLLMService';
import type { ChatRequest } from '../providers/types';
import { logger } from '../../utils/logger';

/**
 * Execute a chat request with intelligent routing
 * 
 * @example
 * const result = await routeLLMChat({
 *   query: "What is the meaning of life?",
 *   feature: "chat_coaching",
 *   privacyLevel: "PUBLIC"
 * });
 * 
 * if (result.response.success) {
 *   console.log(result.response.content);
 *   console.log('Cost:', result.actualCost);
 * }
 */
export async function routeLLMChat(
  query: RouteLLMQuery,
  additionalMessages?: ChatRequest['messages']
): Promise<RoutingResult> {
  const startTime = Date.now();

  try {
    // Step 1: Select optimal route
    const route = await routeLLMService.selectOptimalRoute(query);
    
    logger.info('[RouteLLM Helper] Route selected', {
      provider: route.provider,
      model: route.model,
      complexity: route.complexityScore
    });

    // Step 2: Build messages
    const messages: ChatRequest['messages'] = [
      ...(additionalMessages || []),
      { role: 'user', content: query.query }
    ];

    // Step 3: Execute with fallback
    const result = await routeLLMService.executeWithFallback(route, messages);

    logger.info('[RouteLLM Helper] Execution complete', {
      success: result.response.success,
      cost: result.actualCost,
      providers: result.providersAttempted,
      timeMs: Date.now() - startTime
    });

    return result;

  } catch (error) {
    logger.error('[RouteLLM Helper] Fatal error', { error });
    
    return {
      route: {
        provider: 'local',
        model: 'error',
        estimatedCost: 0,
        complexityScore: 0,
        reasoning: 'Error in routing',
        fallbackChain: []
      },
      response: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      actualCost: 0,
      providersAttempted: [],
      totalTime: Date.now() - startTime
    };
  }
}

/**
 * Simple wrapper for quick one-off queries
 * 
 * @example
 * const response = await quickRoute("Tell me a joke", "creative_generation");
 * console.log(response);
 */
export async function quickRoute(
  query: string,
  feature: RouteLLMQuery['feature'] = 'chat_coaching',
  privacyLevel: RouteLLMQuery['privacyLevel'] = 'PUBLIC'
): Promise<string> {
  const result = await routeLLMChat({
    query,
    feature,
    privacyLevel
  });

  if (result.response.success) {
    return result.response.content || 'No response';
  } else {
    throw new Error(result.response.error || 'Routing failed');
  }
}

/**
 * Get cost estimate for a query without executing it
 */
export async function estimateRouteCost(
  query: RouteLLMQuery
): Promise<{ estimatedCost: number; provider: string; model: string }> {
  const route = await routeLLMService.selectOptimalRoute(query);
  
  return {
    estimatedCost: route.estimatedCost,
    provider: route.provider,
    model: route.model
  };
}

/**
 * For AI Orchestration: Select best model for a specific AI system role
 * 
 * This allows AI Orchestration to still use AI-1, AI-2, AI-3 pattern
 * but with intelligent model selection via RouteLLM
 */
export async function selectModelForRole(
  role: 'aesthetic' | 'cognitive' | 'ethical',
  query: RouteLLMQuery
): Promise<{ provider: string; model: string }> {
  const route = await routeLLMService.selectOptimalRoute(query);
  
  // Map to preferred providers for each role if available
  const rolePreferences = {
    aesthetic: ['openai', 'xai'],      // OpenAI best for creativity
    cognitive: ['anthropic', 'openai'], // Claude best for reasoning
    ethical: ['google', 'anthropic']    // Gemini good for ethics
  };

  const preferred = rolePreferences[role];
  
  // If selected provider matches role preference, use it
  if (preferred.includes(route.provider)) {
    return { provider: route.provider, model: route.model };
  }

  // Otherwise find next best from preferred list
  for (const prov of preferred) {
    const fallback = route.fallbackChain.find(f => f.provider === prov);
    if (fallback) {
      return fallback;
    }
  }

  // Fall back to selected route
  return { provider: route.provider, model: route.model };
}

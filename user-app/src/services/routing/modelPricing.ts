// user-app/src/services/routing/modelPricing.ts

/**
 * Model Pricing Database
 * Used by RouteLLM for cost optimization
 * Updated: 2025-01-07 (Added xAI Grok-3, Abacus.AI unified API)
 */

export interface ModelPricing {
  provider: 'openai' | 'anthropic' | 'google' | 'xai' | 'abacus' | 'local';
  model: string;
  inputCostPerMillionTokens: number;
  outputCostPerMillionTokens: number;
  tier: 'free' | 'cheap' | 'medium' | 'premium' | 'expert';
  qualityScore: number; // 0-100
  speedScore: number; // 0-100 (lower latency = higher score)
  specialties: string[]; // e.g. ['mbti', 'creative', 'code']
}

export const MODEL_PRICING: ModelPricing[] = [
  // ==================== LOCAL (FREE) ====================
  {
    provider: 'local',
    model: 'phi-2',
    inputCostPerMillionTokens: 0,
    outputCostPerMillionTokens: 0,
    tier: 'free',
    qualityScore: 60,
    speedScore: 95,
    specialties: ['basic', 'offline', 'privacy']
  },
  
  // ==================== XAI (GROK) ====================
  {
    provider: 'xai',
    model: 'grok-3',
    inputCostPerMillionTokens: 3.00,
    outputCostPerMillionTokens: 15.00,
    tier: 'medium',
    qualityScore: 85, // Competitive with GPT-4
    speedScore: 80,
    specialties: ['realtime', 'x-data', 'general']
  },
  {
    provider: 'xai',
    model: 'grok-3-mini',
    inputCostPerMillionTokens: 1.00, // Estimated
    outputCostPerMillionTokens: 5.00, // Estimated
    tier: 'cheap',
    qualityScore: 75,
    speedScore: 90,
    specialties: ['fast', 'cheap', 'general']
  },
  
  // ==================== ANTHROPIC (CLAUDE) ====================
  {
    provider: 'anthropic',
    model: 'claude-3-opus',
    inputCostPerMillionTokens: 15.00,
    outputCostPerMillionTokens: 75.00,
    tier: 'expert',
    qualityScore: 95,
    speedScore: 70,
    specialties: ['mbti', 'coaching', 'reasoning', 'personality']
  },
  {
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    inputCostPerMillionTokens: 3.00,
    outputCostPerMillionTokens: 15.00,
    tier: 'medium',
    qualityScore: 85,
    speedScore: 80,
    specialties: ['balanced', 'general']
  },
  {
    provider: 'anthropic',
    model: 'claude-3-haiku',
    inputCostPerMillionTokens: 0.25,
    outputCostPerMillionTokens: 1.25,
    tier: 'cheap',
    qualityScore: 75,
    speedScore: 90,
    specialties: ['fast', 'cheap', 'simple']
  },
  
  // ==================== OPENAI (GPT) ====================
  {
    provider: 'openai',
    model: 'gpt-4',
    inputCostPerMillionTokens: 30.00,
    outputCostPerMillionTokens: 60.00,
    tier: 'expert',
    qualityScore: 95,
    speedScore: 65,
    specialties: ['reasoning', 'code', 'complex']
  },
  {
    provider: 'openai',
    model: 'gpt-4o',
    inputCostPerMillionTokens: 5.00,
    outputCostPerMillionTokens: 15.00,
    tier: 'medium',
    qualityScore: 90,
    speedScore: 85,
    specialties: ['multimodal', 'fast', 'general']
  },
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    inputCostPerMillionTokens: 0.15,
    outputCostPerMillionTokens: 0.60,
    tier: 'cheap',
    qualityScore: 78,
    speedScore: 92,
    specialties: ['fast', 'cheap', 'simple']
  },
  {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    inputCostPerMillionTokens: 0.50,
    outputCostPerMillionTokens: 1.50,
    tier: 'cheap',
    qualityScore: 70,
    speedScore: 95,
    specialties: ['fast', 'cheap', 'basic']
  },
  
  // ==================== GOOGLE (GEMINI) ====================
  {
    provider: 'google',
    model: 'gemini-pro',
    inputCostPerMillionTokens: 0.50,
    outputCostPerMillionTokens: 1.50,
    tier: 'cheap',
    qualityScore: 75,
    speedScore: 88,
    specialties: ['multimodal', 'search', 'general']
  },
  {
    provider: 'google',
    model: 'gemini-ultra',
    inputCostPerMillionTokens: 15.00,
    outputCostPerMillionTokens: 45.00,
    tier: 'premium',
    qualityScore: 92,
    speedScore: 75,
    specialties: ['reasoning', 'complex', 'multimodal']
  },

  // ==================== ABACUS.AI (UNIFIED API) ====================
  {
    provider: 'abacus',
    model: 'grok-4',
    inputCostPerMillionTokens: 10.00,
    outputCostPerMillionTokens: 30.00,
    tier: 'premium',
    qualityScore: 90,
    speedScore: 82,
    specialties: ['realtime', 'reasoning', 'x-data', 'general']
  },
  {
    provider: 'abacus',
    model: 'claude-4.1-opus',
    inputCostPerMillionTokens: 15.00,
    outputCostPerMillionTokens: 75.00,
    tier: 'expert',
    qualityScore: 96,
    speedScore: 70,
    specialties: ['mbti', 'coaching', 'reasoning', 'personality', 'complex']
  },
  {
    provider: 'abacus',
    model: 'gpt-5',
    inputCostPerMillionTokens: 12.00,
    outputCostPerMillionTokens: 36.00,
    tier: 'premium',
    qualityScore: 92,
    speedScore: 75,
    specialties: ['reasoning', 'code', 'complex', 'general']
  },
  {
    provider: 'abacus',
    model: 'gemini-2.5-pro',
    inputCostPerMillionTokens: 7.00,
    outputCostPerMillionTokens: 21.00,
    tier: 'medium',
    qualityScore: 88,
    speedScore: 80,
    specialties: ['multimodal', 'reasoning', 'general']
  },
  {
    provider: 'abacus',
    model: 'gemini-2.5-flash',
    inputCostPerMillionTokens: 0.35,
    outputCostPerMillionTokens: 1.05,
    tier: 'cheap',
    qualityScore: 78,
    speedScore: 92,
    specialties: ['fast', 'cheap', 'multimodal', 'general']
  },
  {
    provider: 'abacus',
    model: 'qwen-2.5-coder-32b',
    inputCostPerMillionTokens: 0.50,
    outputCostPerMillionTokens: 1.50,
    tier: 'cheap',
    qualityScore: 82,
    speedScore: 90,
    specialties: ['code', 'programming', 'cheap', 'technical']
  }
];

/**
 * Get pricing info for a specific model
 */
export function getModelPricing(provider: string, model: string): ModelPricing | null {
  return MODEL_PRICING.find(p => p.provider === provider && p.model === model) || null;
}

/**
 * Get all models in a specific tier
 */
export function getModelsByTier(tier: string): ModelPricing[] {
  return MODEL_PRICING.filter(p => p.tier === tier);
}

/**
 * Get models with specific specialty
 */
export function getModelsBySpecialty(specialty: string): ModelPricing[] {
  return MODEL_PRICING.filter(p => p.specialties.indexOf(specialty) !== -1);
}

/**
 * Calculate estimated cost for a request
 */
export function calculateEstimatedCost(
  provider: string,
  model: string,
  estimatedInputTokens: number,
  estimatedOutputTokens: number
): number {
  const pricing = getModelPricing(provider, model);
  if (!pricing) return 0;
  
  const inputCost = (estimatedInputTokens / 1_000_000) * pricing.inputCostPerMillionTokens;
  const outputCost = (estimatedOutputTokens / 1_000_000) * pricing.outputCostPerMillionTokens;
  
  return inputCost + outputCost;
}

/**
 * Compare costs across providers for same complexity
 */
export function compareCosts(
  estimatedInputTokens: number,
  estimatedOutputTokens: number,
  tier: string
): Array<{ provider: string; model: string; cost: number }> {
  const models = getModelsByTier(tier);
  
  return models.map(model => ({
    provider: model.provider,
    model: model.model,
    cost: calculateEstimatedCost(
      model.provider,
      model.model,
      estimatedInputTokens,
      estimatedOutputTokens
    )
  })).sort((a, b) => a.cost - b.cost); // Sort by cost (cheapest first)
}

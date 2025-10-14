/**
 * 🎯 Shared Types for Phase 2 Core Integration
 * Complete type definitions for UserContextAggregator and RecommendationEngine
 * 
 * @version 2.0.0
 * @author Riley (Lead) + Mary (Intelligence) + Claude (Performance)
 */

// =============================================================================
// WELLNESS FEATURE TYPES
// =============================================================================

export interface WellnessTrend {
  metric: 'mood' | 'energy' | 'sleep' | 'stress' | 'overall';
  timeframe: '7d' | '30d' | '90d';
  direction: 'improving' | 'stable' | 'declining';
  changeAmount: number;
  significantEvents: string[];
  correlatedActivities: string[];
}

export interface WellnessInsight {
  id: string;
  type: 'pattern' | 'achievement' | 'concern' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  suggestions: string[];
  mbtiRelevance: boolean;
  discovered: Date;
  metrics: string[];
}

export interface WellnessGoal {
  id: string;
  category: 'mood' | 'energy' | 'sleep' | 'stress' | 'habit' | 'mindfulness';
  description: string;
  targetValue: number;
  currentValue: number;
  deadline: Date;
  progress: number; // 0-1
  strategy: string;
  mbtiOptimized: boolean;
}

export interface FeatureCorrelation {
  targetFeature: string;
  correlationType: 'positive' | 'negative' | 'causal' | 'neutral';
  strength: number; // 0-1
  description: string;
  examples: string[];
  actionable: boolean;
}

// =============================================================================
// JOURNALING FEATURE TYPES
// =============================================================================

export interface EmotionalPattern {
  emotion: string;
  frequency: number;
  intensity: number; // 1-10
  triggers: string[];
  coping_strategies: string[];
  mbti_alignment: number;
  recent_trend: 'increasing' | 'stable' | 'decreasing';
  time_of_day_pattern: string[];
}

export interface JournalInsight {
  id: string;
  type: 'emotional' | 'growth' | 'pattern' | 'breakthrough' | 'concern';
  content: string;
  confidence: number;
  keywords: string[];
  themes: string[];
  suggested_actions: string[];
  mbti_connection: string;
  discovered_date: Date;
  related_entries: string[];
}

// =============================================================================
// ACTION PLANS FEATURE TYPES  
// =============================================================================

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'learning' | 'relationships';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  progress: number; // 0-1
  created: Date;
  deadline: Date;
  steps: ActionStep[];
  dependencies: string[];
  resources_needed: string[];
  mbti_optimized: boolean;
  success_metrics: SuccessMetric[];
}

export interface ActionStep {
  id: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  estimated_time: number; // minutes
  actual_time?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  requires_focus: boolean;
  best_time_of_day?: string;
  energy_required: 'low' | 'medium' | 'high';
  completed_date?: Date;
}

export interface SuccessMetric {
  name: string;
  type: 'quantitative' | 'qualitative';
  target_value: string | number;
  current_value?: string | number;
  measurement_method: string;
  tracking_frequency: 'daily' | 'weekly' | 'monthly';
}

export interface PlanIntegration {
  connected_feature: 'coaching' | 'wellness' | 'journaling' | 'content';
  integration_type: 'supports' | 'depends_on' | 'enhanced_by' | 'blocks';
  description: string;
  strength: number; // 0-1
  examples: string[];
  optimization_opportunities: string[];
}

// =============================================================================
// CONTENT DISCOVERY FEATURE TYPES
// =============================================================================

export interface ContentPattern {
  type: 'consumption_time' | 'content_type' | 'topic_preference' | 'engagement_style';
  pattern_description: string;
  frequency: number;
  strength: number; // 0-1
  mbti_alignment: number;
  examples: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface ContentPreference {
  category: 'format' | 'topic' | 'difficulty' | 'length' | 'style';
  value: string;
  confidence: number; // 0-1
  learned_from: 'explicit' | 'implicit' | 'mbti_inference';
  last_updated: Date;
  supporting_evidence: string[];
}

export interface ContentEffectiveness {
  content_id: string;
  content_type: 'article' | 'video' | 'podcast' | 'book' | 'course' | 'tool';
  effectiveness_score: number; // 0-1
  engagement_metrics: {
    time_spent: number;
    completion_rate: number;
    return_visits: number;
    action_taken: boolean;
  };
  learning_outcomes: string[];
  mbti_match_score: number;
  recommended_to_others: boolean;
}

export interface ContentJourney {
  session_id: string;
  start_time: Date;
  end_time: Date;
  content_items: ContentItem[];
  journey_type: 'exploration' | 'focused_learning' | 'problem_solving' | 'inspiration';
  satisfaction_score: number; // 1-10
  outcomes: string[];
  next_recommended_content: string[];
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'podcast' | 'book' | 'course' | 'tool';
  source: string;
  time_spent: number;
  engagement_actions: string[];
  rating?: number; // 1-5
  notes?: string;
}

export interface EngagementMetric {
  metric_name: string;
  value: number;
  unit: string;
  timeframe: '7d' | '30d' | '90d' | 'all_time';
  trend: 'improving' | 'stable' | 'declining';
  benchmark_comparison: 'above_average' | 'average' | 'below_average';
  mbti_context: string;
}

// =============================================================================
// CROSS-FEATURE INTEGRATION TYPES
// =============================================================================

export interface IntegrationOpportunity {
  id: string;
  name: string;
  description: string;
  involved_features: string[];
  opportunity_type: 'efficiency' | 'effectiveness' | 'insight' | 'automation';
  potential_impact: 'low' | 'medium' | 'high';
  implementation_complexity: 'simple' | 'moderate' | 'complex';
  estimated_time_savings: number; // minutes per week
  mbti_personalization_potential: boolean;
  prerequisites: string[];
  success_indicators: string[];
}

export interface DataSyncStatus {
  feature: string;
  last_sync: Date;
  sync_quality: number; // 0-1
  pending_updates: number;
  errors: string[];
  next_sync_scheduled: Date;
}

// =============================================================================
// RECOMMENDATION ENGINE TYPES
// =============================================================================

export interface RecommendationContext {
  user_id: string;
  mbti_profile: any; // MBTIProfile from UserContextAggregator
  current_session: SessionContext;
  recent_activity: RecentActivity[];
  goals: UnifiedGoal[];
  preferences: UserPreferences;
  constraints: UserConstraints;
}

export interface SessionContext {
  current_feature: string;
  session_start: Date;
  current_activity: string;
  mood_indicators: string[];
  energy_level: 'low' | 'medium' | 'high';
  available_time: number; // minutes
  focus_quality: 'poor' | 'good' | 'excellent';
}

export interface RecentActivity {
  feature: string;
  activity_type: string;
  timestamp: Date;
  outcome: 'positive' | 'neutral' | 'negative';
  engagement_score: number; // 0-1
  time_spent: number;
  context: Record<string, any>;
}

export interface UnifiedGoal {
  id: string;
  title: string;
  category: 'health' | 'productivity' | 'learning' | 'relationships' | 'personal_growth';
  priority: number; // 1-10
  deadline?: Date;
  progress: number; // 0-1
  blocking_factors: string[];
  supporting_features: string[];
}

export interface UserPreferences {
  communication_style: 'direct' | 'encouraging' | 'analytical' | 'creative';
  timing_preferences: TimingPreference[];
  complexity_tolerance: 'simple' | 'moderate' | 'complex';
  feedback_frequency: 'minimal' | 'regular' | 'frequent';
  privacy_level: 'open' | 'selective' | 'private';
  gamification_level: 'none' | 'light' | 'moderate' | 'heavy';
}

export interface TimingPreference {
  activity_type: string;
  preferred_times: string[]; // e.g., ["09:00", "14:00", "20:00"]
  avoid_times: string[];
  optimal_duration: number; // minutes
  buffer_time: number; // minutes between activities
}

export interface UserConstraints {
  time_availability: TimeAvailability[];
  energy_patterns: EnergyPattern[];
  focus_limitations: string[];
  technical_limitations: string[];
  access_restrictions: string[];
}

export interface TimeAvailability {
  day_of_week: string;
  available_windows: TimeWindow[];
  total_minutes: number;
  quality_rating: number; // 0-1, how good this time is for focused work
}

export interface TimeWindow {
  start: string; // HH:MM format
  end: string;
  context: string; // e.g., "morning_routine", "lunch_break", "evening_wind_down"
}

export interface EnergyPattern {
  time_of_day: string;
  typical_energy: 'low' | 'medium' | 'high';
  variability: 'consistent' | 'variable' | 'unpredictable';
  influencing_factors: string[];
}

// =============================================================================
// ADVANCED ANALYTICS TYPES
// =============================================================================

export interface ProgressAnalytics {
  overall_trajectory: 'accelerating' | 'steady' | 'plateauing' | 'declining';
  feature_performance: FeaturePerformance[];
  cross_feature_synergies: FeatureSynergy[];
  optimization_opportunities: OptimizationOpportunity[];
  predicted_outcomes: PredictedOutcome[];
  risk_factors: RiskFactor[];
}

export interface FeaturePerformance {
  feature_name: string;
  usage_frequency: number; // sessions per week
  engagement_quality: number; // 0-1
  outcome_effectiveness: number; // 0-1
  user_satisfaction: number; // 1-10
  trend: 'improving' | 'stable' | 'declining';
  key_strengths: string[];
  improvement_areas: string[];
}

export interface FeatureSynergy {
  feature_combination: string[];
  synergy_type: 'multiplicative' | 'additive' | 'complementary';
  strength: number; // 0-1
  examples: string[];
  optimization_potential: number; // 0-1
  current_utilization: number; // 0-1
}

export interface OptimizationOpportunity {
  id: string;
  area: 'timing' | 'sequencing' | 'integration' | 'personalization' | 'automation';
  description: string;
  potential_improvement: number; // 0-1
  implementation_effort: 'low' | 'medium' | 'high';
  confidence: number; // 0-1
  prerequisites: string[];
  success_metrics: string[];
}

export interface PredictedOutcome {
  timeframe: '1w' | '1m' | '3m' | '6m' | '1y';
  outcome_type: 'goal_achievement' | 'habit_formation' | 'skill_development' | 'wellbeing_improvement';
  probability: number; // 0-1
  confidence_interval: [number, number];
  key_assumptions: string[];
  influencing_factors: string[];
}

export interface RiskFactor {
  type: 'burnout' | 'disengagement' | 'goal_conflict' | 'technical_issue' | 'life_change';
  probability: number; // 0-1
  potential_impact: 'low' | 'medium' | 'high';
  early_warning_signs: string[];
  mitigation_strategies: string[];
  monitoring_metrics: string[];
}

// =============================================================================
// UTILITY FUNCTIONS FOR TYPE VALIDATION
// =============================================================================

/**
 * 🔍 Type Validation Utilities
 * Comprehensive validation functions for all shared types
 */

class SharedTypeValidator {
  static validateProgressAnalytics(data: any): data is ProgressAnalytics {
    return data && 
           typeof data.overall_trajectory === 'string' &&
           Array.isArray(data.feature_performance) &&
           Array.isArray(data.cross_feature_synergies);
  }

  static validateRecommendationContext(data: any): data is RecommendationContext {
    return data && 
           typeof data.user_id === 'string' &&
           data.mbti_profile &&
           data.current_session;
  }

  static validateUnifiedGoal(data: any): data is UnifiedGoal {
    return data && 
           typeof data.id === 'string' &&
           typeof data.title === 'string' &&
           typeof data.progress === 'number' &&
           data.progress >= 0 && data.progress <= 1;
  }

  static validateIntegrationOpportunity(data: any): data is IntegrationOpportunity {
    return data && 
           typeof data.id === 'string' &&
           Array.isArray(data.involved_features) &&
           typeof data.potential_impact === 'string';
  }

  static validateOptimizationOpportunity(data: any): data is OptimizationOpportunity {
    return data && 
           typeof data.id === 'string' &&
           typeof data.potential_improvement === 'number' &&
           data.potential_improvement >= 0 && data.potential_improvement <= 1;
  }
}

/**
 * 🏗️ Type Factory Functions
 * Factory functions for creating properly typed objects
 */

class SharedTypeFactory {
  static createEmptyProgressAnalytics(): ProgressAnalytics {
    return {
      overall_trajectory: 'steady',
      feature_performance: [],
      cross_feature_synergies: [],
      optimization_opportunities: [],
      predicted_outcomes: [],
      risk_factors: []
    };
  }

  static createDefaultRecommendationContext(userId: string): Partial<RecommendationContext> {
    return {
      user_id: userId,
      recent_activity: [],
      goals: [],
      preferences: {
        communication_style: 'encouraging',
        timing_preferences: [],
        complexity_tolerance: 'moderate',
        feedback_frequency: 'regular',
        privacy_level: 'selective',
        gamification_level: 'light'
      },
      constraints: {
        time_availability: [],
        energy_patterns: [],
        focus_limitations: [],
        technical_limitations: [],
        access_restrictions: []
      }
    };
  }

  static createEmptyIntegrationOpportunity(id: string): IntegrationOpportunity {
    return {
      id,
      name: '',
      description: '',
      involved_features: [],
      opportunity_type: 'efficiency',
      potential_impact: 'medium',
      implementation_complexity: 'moderate',
      estimated_time_savings: 0,
      mbti_personalization_potential: false,
      prerequisites: [],
      success_indicators: []
    };
  }
}

/**
 * 🎯 Type Conversion Utilities
 * Utilities for converting between related types
 */

class SharedTypeConverter {
  static featureNameToString(feature: string): string {
    return feature.toString();
  }

  static stringToFeatureName(str: string): string | null {
    const validFeatures = [
      'coaching', 'wellness', 'journaling', 'action_plans', 'content_discovery', 'therapeut_coaching'
    ];
    return validFeatures.indexOf(str) !== -1 ? str : null;
  }

  static eventTypeToCategory(eventType: string): 'progress' | 'user_state' | 'feature' | 'system' | 'integration' {
    if (eventType.indexOf('goal') !== -1 || eventType.indexOf('milestone') !== -1 || eventType.indexOf('achievement') !== -1) {
      return 'progress';
    }
    if (eventType.indexOf('energy') !== -1 || eventType.indexOf('mood') !== -1 || eventType.indexOf('stress') !== -1) {
      return 'user_state';
    }
    if (eventType.indexOf('session') !== -1 || eventType.indexOf('feature') !== -1 || eventType.indexOf('recommendation') !== -1) {
      return 'feature';
    }
    if (eventType.indexOf('correlation') !== -1 || eventType.indexOf('pattern') !== -1 || eventType.indexOf('optimization') !== -1) {
      return 'system';
    }
    return 'integration';
  }

  static priorityToNumber(priority: 'low' | 'medium' | 'high' | 'critical'): number {
    const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorityMap[priority];
  }

  static numberToPriority(num: number): 'low' | 'medium' | 'high' | 'critical' {
    if (num <= 1) return 'low';
    if (num <= 2) return 'medium';
    if (num <= 3) return 'high';
    return 'critical';
  }
}

/**
 * 🧮 Statistical Utilities for Analytics
 * Mathematical functions for progress and analytics calculations
 */

class SharedAnalyticsUtils {
  static calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    if (values.length < 2) return 'stable';
    
    const first = values[0];
    const last = values[values.length - 1];
    const diff = last - first;
    const threshold = Math.abs(first) * 0.05; // 5% threshold
    
    if (diff > threshold) return 'improving';
    if (diff < -threshold) return 'declining';
    return 'stable';
  }

  static calculateCorrelation(values1: number[], values2: number[]): number {
    if (values1.length !== values2.length || values1.length === 0) return 0;
    
    const n = values1.length;
    const sum1 = values1.reduce((a, b) => a + b, 0);
    const sum2 = values2.reduce((a, b) => a + b, 0);
    const sum1Sq = values1.reduce((a, b) => a + b * b, 0);
    const sum2Sq = values2.reduce((a, b) => a + b * b, 0);
    const pSum = values1.reduce((acc, val, i) => acc + val * values2[i], 0);
    
    const num = pSum - (sum1 * sum2 / n);
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
    
    return den === 0 ? 0 : num / den;
  }

  static calculateConfidenceInterval(values: number[], confidence: number = 0.95): [number, number] {
    if (values.length === 0) return [0, 0];
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
    const z = confidence === 0.95 ? 1.96 : confidence === 0.99 ? 2.58 : 1.64;
    const margin = z * stdDev / Math.sqrt(values.length);
    
    return [mean - margin, mean + margin];
  }

  static normalizeScore(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }
}

/**
 * 🎨 MBTI Utility Functions
 * Specialized utilities for MBTI type handling and analysis
 */

class SharedMBTIUtils {
  static readonly MBTI_TYPES = [
    'INTJ', 'INTP', 'ENTJ', 'ENTP',
    'INFJ', 'INFP', 'ENFJ', 'ENFP', 
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
    'ISTP', 'ISFP', 'ESTP', 'ESFP'
  ];

  static isValidMBTIType(type: string): boolean {
    return this.MBTI_TYPES.indexOf(type.toUpperCase()) !== -1;
  }

  static getMBTIDimensions(type: string): {E_I: string, S_N: string, T_F: string, J_P: string} {
    const upperType = type.toUpperCase();
    return {
      E_I: upperType[0], // Extraversion/Introversion
      S_N: upperType[1], // Sensing/Intuition  
      T_F: upperType[2], // Thinking/Feeling
      J_P: upperType[3]  // Judging/Perceiving
    };
  }

  static calculateMBTICompatibility(type1: string, type2: string): number {
    if (!this.isValidMBTIType(type1) || !this.isValidMBTIType(type2)) return 0;
    
    const dims1 = this.getMBTIDimensions(type1);
    const dims2 = this.getMBTIDimensions(type2);
    
    let compatibility = 0;
    if (dims1.E_I === dims2.E_I) compatibility += 0.25;
    if (dims1.S_N === dims2.S_N) compatibility += 0.25;
    if (dims1.T_F === dims2.T_F) compatibility += 0.25;
    if (dims1.J_P === dims2.J_P) compatibility += 0.25;
    
    return compatibility;
  }

  static getCognitiveFunctions(type: string): string[] {
    const functionMap: Record<string, string[]> = {
      'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
      'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
      'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
      'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
      'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
      'INFP': ['Fi', 'Ne', 'Si', 'Te'],
      'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
      'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
      'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
      'ISFJ': ['Si', 'Fe', 'Ti', 'Ne'],
      'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
      'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
      'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
      'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
      'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
      'ESFP': ['Se', 'Fi', 'Te', 'Ni']
    };
    
    return functionMap[type.toUpperCase()] || [];
  }
}

// Export utility classes
export { 
  SharedTypeValidator as TypeValidator,
  SharedTypeFactory as TypeFactory,
  SharedTypeConverter as TypeConverter,
  SharedAnalyticsUtils as AnalyticsUtils,
  SharedMBTIUtils as MBTIUtils
};
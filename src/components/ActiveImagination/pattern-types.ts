// Types for Pattern Recognition functionality
export interface PatternInsight {
  type: 'emotional' | 'behavioral' | 'creative' | 'growth';
  description: string;
  frequency: number;
  timeframe: string;
  actionable: string[];
}

export interface PatternState {
  patterns: PatternInsight[];
  timeframe: 'week' | 'month' | 'quarter';
  isAnalyzing: boolean;
  lastAnalysis: Date | null;
}

export interface PatternActions {
  analyzePatterns: () => Promise<void>;
  setTimeframe: (timeframe: 'week' | 'month' | 'quarter') => void;
  refreshPatterns: () => Promise<void>;
}

export interface PatternContextType extends PatternState, PatternActions {}
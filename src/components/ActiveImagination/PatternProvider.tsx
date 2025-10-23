import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { activeImaginationChatLLMService } from '../../services/activeImaginationChatLLM';
import type {
  PatternInsight,
  PatternState,
  PatternActions,
  PatternContextType
} from './pattern-types';

const PatternContext = createContext<PatternContextType | null>(null);

export const usePatterns = () => {
  const context = useContext(PatternContext);
  if (!context) {
    throw new Error('usePatterns must be used within PatternProvider');
  }
  return context;
};

interface PatternProviderProps {
  children: React.ReactNode;
}

export const PatternProvider: React.FC<PatternProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [patterns, setPatterns] = useState<PatternInsight[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);

  // Analyze patterns for current timeframe
  const analyzePatterns = useCallback(async () => {
    if (!userData?.id) return;

    try {
      setIsAnalyzing(true);

      const recognizedPatterns = await activeImaginationChatLLMService.recognizePatterns(
        userData.id,
        timeframe
      );

      const formattedPatterns: PatternInsight[] = recognizedPatterns.map(pattern => ({
        type: pattern.type as any,
        description: pattern.description,
        frequency: pattern.frequency,
        timeframe: pattern.timeframe,
        actionable: ['Reflecteer op triggers', 'Ontwikkel coping strategieën']
      }));

      setPatterns(formattedPatterns);
      setLastAnalysis(new Date());

    } catch (error) {
      console.error('Error analyzing patterns:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userData, timeframe]);

  // Refresh patterns (force re-analysis)
  const refreshPatterns = useCallback(async () => {
    await analyzePatterns();
  }, [analyzePatterns]);

  const contextValue: PatternContextType = {
    // State
    patterns,
    timeframe,
    isAnalyzing,
    lastAnalysis,

    // Actions
    analyzePatterns,
    setTimeframe,
    refreshPatterns
  };

  return (
    <PatternContext.Provider value={contextValue}>
      {children}
    </PatternContext.Provider>
  );
};
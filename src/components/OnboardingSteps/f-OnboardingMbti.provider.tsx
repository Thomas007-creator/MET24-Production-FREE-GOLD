import React, { createContext, useContext, useState, useCallback } from 'react';
import { logger } from '../../utils/logger';

interface OnboardingMbtiContextType {
  // UI States
  showMbtiInput: boolean;
  showExternalPaste: boolean;
  showAIRecommendation: boolean;
  setShowMbtiInput: (show: boolean) => void;
  setShowExternalPaste: (show: boolean) => void;
  setShowAIRecommendation: (show: boolean) => void;

  // Form State
  mbtiCode: string;
  setMbtiCode: (code: string) => void;
  errors: { mbtiCode?: string };
  setErrors: (errors: { mbtiCode?: string }) => void;

  // AI Recommendation State
  aiRecommendation: any | null;
  isAnalyzing: boolean;

  // Actions
  handleMbtiChoice: (choice: 'known' | 'quick' | 'full' | 'ai') => Promise<void>;
  handleMbtiSubmit: (source: 'user_input' | 'external' | 'ai_recommendation') => Promise<void>;
  handleAIRecommendationAccept: () => Promise<void>;
  handleFullTest: () => void;
  resetStates: () => void;
}

const OnboardingMbtiContext = createContext<OnboardingMbtiContextType | undefined>(undefined);

interface OnboardingMbtiProviderProps {
  onMbtiKnown: (mbtiData: {
    letters: string;
    percentages: { [key: string]: number } | null;
    confidence: number;
    source: 'user_input' | 'external' | 'ai_recommendation';
    aiInsights?: any;
    cognitiveFunctions?: string[];
    developmentPath?: any;
  }) => void;
  onQuickTest: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

export const OnboardingMbtiProvider: React.FC<OnboardingMbtiProviderProps> = ({
  onMbtiKnown,
  onQuickTest,
  onBack,
  children,
}) => {
  // UI States
  const [showMbtiInput, setShowMbtiInput] = useState(false);
  const [showExternalPaste, setShowExternalPaste] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);

  // Form State
  const [mbtiCode, setMbtiCode] = useState('');
  const [errors, setErrors] = useState<{ mbtiCode?: string }>({});

  // AI Recommendation State
  const [aiRecommendation, setAiRecommendation] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Business Logic Functions
  const generateAIRecommendation = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simple recommendation logic
      const recommendation = {
        mbtiType: 'INTJ',
        confidence: 0.85,
        reasoning: 'Based on your interaction patterns, you show preferences for analytical thinking and structured approaches.',
        cognitiveFunctions: ['Ni', 'Te', 'Fi', 'Se'],
        developmentPath: {
          nextMilestone: 'Develop your auxiliary Te function for better execution'
        },
        aiSystem: 'ai1'
      };

      setAiRecommendation(recommendation);
      setShowAIRecommendation(true);

      logger.info('AI MBTI recommendation generated:', recommendation);
    } catch (error) {
      logger.error('Error generating AI recommendation:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleMbtiChoice = useCallback(async (choice: 'known' | 'quick' | 'full' | 'ai') => {
    logger.info(`MBTI choice selected: ${choice}`);

    try {
      switch (choice) {
        case 'known':
          setShowMbtiInput(true);
          break;
        case 'quick':
          onQuickTest();
          break;
        case 'full':
          handleFullTest();
          break;
        case 'ai':
          await generateAIRecommendation();
          break;
      }
    } catch (error) {
      console.error('Error in handleMbtiChoice:', error);
    }
  }, [onQuickTest, generateAIRecommendation]);

  const handleFullTest = useCallback(() => {
    // Open external MBTI test in new tab
    const externalUrl = 'https://www.16personalities.com/free-personality-test';
    window.open(externalUrl, '_blank');

    // Show instructions for returning
    alert(
      'De volledige MBTI test is geopend in een nieuw tabblad. Kopieer je 4-letter resultaat en plak het hier wanneer je klaar bent.'
    );

    // Show paste field for external result
    setShowExternalPaste(true);
  }, []);

  const validateMbtiCode = useCallback((code: string): boolean => {
    const validTypes = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
    ];
    return validTypes.includes(code.toUpperCase());
  }, []);

  const handleMbtiSubmit = useCallback(async (
    source: 'user_input' | 'external' | 'ai_recommendation' = 'user_input'
  ) => {
    const code = mbtiCode.trim().toUpperCase();

    if (!code) {
      setErrors({ mbtiCode: 'Voer je MBTI type in' });
      return;
    }

    if (!validateMbtiCode(code)) {
      setErrors({
        mbtiCode: 'Voer een geldig MBTI type in (bijv. INTJ, ENFP)',
      });
      return;
    }

    console.log('MBTI code submitted:', code, 'Source:', source);

    try {
      // Simple cognitive functions mapping
      const cognitiveFunctions = ['Ni', 'Te', 'Fi', 'Se']; // Placeholder
      const developmentPath = {
        nextMilestone: 'Continue developing your dominant function'
      };

      // Simple AI insights
      const aiInsights = {
        responseStyle: 'analytical',
        coachingApproach: 'structured'
      };

      console.log('Creating MBTI profile:', {
        letters: code,
        source: source,
        confidence: 100,
        percentages: null, // TODO: Implement percentage tracking
        cognitiveFunctions,
        developmentPath,
        aiInsights
      });

      // Pass MBTI data to parent component with AI insights
      const mbtiData = {
        letters: code,
        percentages: null, // TODO: Implement percentage tracking
        confidence: 100,
        source: source,
        aiInsights,
        cognitiveFunctions,
        developmentPath
      };

      console.log('📤 Passing MBTI data to parent:', mbtiData);
      onMbtiKnown(mbtiData);

      // Reset states
      resetStates();
    } catch (error) {
      console.error('❌ Error in handleMbtiSubmit:', error);
    }
  }, [mbtiCode, onMbtiKnown, validateMbtiCode]);

  const handleAIRecommendationAccept = useCallback(async () => {
    if (aiRecommendation) {
      setMbtiCode(aiRecommendation.mbtiType as string);
      await handleMbtiSubmit('ai_recommendation');
    }
  }, [aiRecommendation, handleMbtiSubmit]);

  const resetStates = useCallback(() => {
    setShowMbtiInput(false);
    setShowExternalPaste(false);
    setShowAIRecommendation(false);
    setMbtiCode('');
    setAiRecommendation(null);
  }, []);

  const contextValue: OnboardingMbtiContextType = {
    // UI States
    showMbtiInput,
    showExternalPaste,
    showAIRecommendation,
    setShowMbtiInput,
    setShowExternalPaste,
    setShowAIRecommendation,

    // Form State
    mbtiCode,
    setMbtiCode,
    errors,
    setErrors,

    // AI Recommendation State
    aiRecommendation,
    isAnalyzing,

    // Actions
    handleMbtiChoice,
    handleMbtiSubmit,
    handleAIRecommendationAccept,
    handleFullTest,
    resetStates,
  };

  return (
    <OnboardingMbtiContext.Provider value={contextValue}>
      {children}
    </OnboardingMbtiContext.Provider>
  );
};

export const useOnboardingMbti = () => {
  const context = useContext(OnboardingMbtiContext);
  if (context === undefined) {
    throw new Error('useOnboardingMbti must be used within an OnboardingMbtiProvider');
  }
  return context;
};
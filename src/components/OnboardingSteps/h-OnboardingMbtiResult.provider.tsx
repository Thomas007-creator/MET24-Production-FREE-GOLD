import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface MbtiResult {
  letters: string;
  percentages: {
    [key: string]: {
      percentage: number;
      confidence: number;
      letter: string;
    };
  };
  confidence: number;
}

interface OnboardingMbtiResultContextType {
  // State
  isSaving: boolean;
  bmadColors: any;

  // Data
  result: MbtiResult;

  // Actions
  handleSave: () => Promise<void>;
  handleEdit: () => void;
  handleBack: () => void;
  handleUseExternal?: () => void;

  // Helpers
  getDichotomyColor: (dichotomy: string) => string;
  getDichotomyLabel: (dichotomy: string) => string;
  getConfidenceColor: (confidence: number) => string;
  getConfidenceLabel: (confidence: number) => string;
}

const OnboardingMbtiResultContext = createContext<OnboardingMbtiResultContextType | undefined>(undefined);

interface OnboardingMbtiResultProviderProps {
  children: ReactNode;
  result: MbtiResult;
  onSave: () => void;
  onEdit: () => void;
  onBack: () => void;
  onUseExternal?: () => void;
  hasExternalResult?: boolean;
}

export const OnboardingMbtiResultProvider: React.FC<OnboardingMbtiResultProviderProps> = ({
  children,
  result,
  onSave,
  onEdit,
  onBack,
  onUseExternal,
  hasExternalResult = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  // Create component-specific logger
  const log = logger.component('OnboardingMbtiResult');

  // Get vibrant, achievement-focused color scheme for MBTI results
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('extraverted_vibrant');

  // Debug: Log what we receive
  useEffect(() => {
    log.debug('Received result', {
      letters: result.letters,
      percentages: result.percentages,
      confidence: result.confidence
    });
  }, [result, log]);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      log.info('Saving MBTI result', {
        letters: result.letters,
        confidence: result.confidence
      });

      // Track analytics event
      logger.info('onboarding_mbti_result_saved', {
        letters: result.letters,
        confidence: result.confidence,
        step: 'mbti_result',
      });

      // WatermelonDB write already handled in quicktest step
      // If editing, update mbti_profiles record
      await databaseService.write(async () => {
        log.debug('Updating MBTI profile in database', {
          letters: result.letters,
          confidence: result.confidence,
          percentages: result.percentages,
        });

        // Update onboarding state to mark result as saved
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'mbti_result',
          step_completed_flags: JSON.stringify({
            welcome: true,
            auth: true,
            privacy: true,
            basic_profile: true,
            account_created: true,
            mbti_choice: true,
            mbti_quicktest: true,
            mbti_result: true,
          }),
        });
      });

      log.info('MBTI result saved to database successfully');

      // Proceed to next step
      onSave();
    } catch (error) {
      log.error('Error in handleSave', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const getDichotomyColor = (dichotomy: string): string => {
    const colors: { [key: string]: string } = {
      'I/E': 'bg-blue-600/40 border-blue-500/40',
      'S/N': 'bg-green-600/40 border-green-500/40',
      'T/F': 'bg-purple-600/40 border-purple-500/40',
      'J/P': 'bg-orange-600/40 border-orange-500/40',
    };
    return colors[dichotomy] || 'bg-white/10 border-white/20';
  };

  const getDichotomyLabel = (dichotomy: string): string => {
    const labels: { [key: string]: string } = {
      'I/E': 'Introvert/Extravert',
      'S/N': 'Sensing/Intuition',
      'T/F': 'Thinking/Feeling',
      'J/P': 'Judging/Perceiving',
    };
    return labels[dichotomy] || dichotomy;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return '#51cf66'; // Green
    if (confidence >= 60) return '#ffd43b'; // Yellow
    return '#ff6b6b'; // Red
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 80) return 'Hoog';
    if (confidence >= 60) return 'Gemiddeld';
    return 'Laag';
  };

  // Track that result page is shown
  useEffect(() => {
    const trackResultShown = async () => {
      try {
        logger.info('onboarding_mbti_result_shown', {
          step: 'mbti_result',
          action: 'shown',
          letters: result.letters,
          confidence: result.confidence,
        });
        log.debug('MBTI result page shown event tracked');
      } catch (error) {
        log.error('Error tracking result shown event', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackResultShown();
  }, [result.letters, result.confidence, result.percentages, log]);

  const value: OnboardingMbtiResultContextType = {
    isSaving,
    bmadColors,
    result,
    handleSave,
    handleEdit: onEdit,
    handleBack: onBack,
    handleUseExternal: hasExternalResult ? onUseExternal : undefined,
    getDichotomyColor,
    getDichotomyLabel,
    getConfidenceColor,
    getConfidenceLabel,
  };

  return (
    <OnboardingMbtiResultContext.Provider value={value}>
      {children}
    </OnboardingMbtiResultContext.Provider>
  );
};

export const useOnboardingMbtiResult = (): OnboardingMbtiResultContextType => {
  const context = useContext(OnboardingMbtiResultContext);
  if (context === undefined) {
    throw new Error('useOnboardingMbtiResult must be used within an OnboardingMbtiResultProvider');
  }
  return context;
};
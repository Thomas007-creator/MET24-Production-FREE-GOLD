import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { logger } from '../../utils/logger';
import { usePWAEngagement } from '../../hooks/usePWAEngagement';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface OnboardingCompleteContextType {
  // State
  isGeneratingActionPlan: boolean;
  actionPlan: any | null;
  isSubmitting: boolean;
  summaryData: {
    mbtiType: string;
    topInterests: string[];
    wellnessScore: number;
    wellnessStatus: string;
  };
  bmadColors: any;

  // Actions
  handleComplete: () => Promise<void>;
}

const OnboardingCompleteContext = createContext<OnboardingCompleteContextType | undefined>(undefined);

interface OnboardingCompleteProviderProps {
  children: ReactNode;
  onComplete: (userData: any) => void;
  userData: any;
}

export const OnboardingCompleteProvider: React.FC<OnboardingCompleteProviderProps> = ({
  children,
  onComplete,
  userData,
}) => {
  const { setUserData } = useAppStore();
  const [isGeneratingActionPlan, setIsGeneratingActionPlan] = useState(false);
  const [actionPlan, setActionPlan] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track PWA engagement when onboarding is completed
  usePWAEngagement('onboarding_complete');

  // Calculate summary data
  const summaryData = {
    mbtiType: userData?.mbtiType || 'Niet ingevuld',
    topInterests: (userData?.interests as string[])?.slice(0, 3) || [],
    wellnessScore: (userData?.wellness as any)?.scores?.energy_index || 0,
    wellnessStatus:
      (userData?.wellness as any)?.scores?.energy_index > 70
        ? 'Hoog'
        : (userData?.wellness as any)?.scores?.energy_index > 50
        ? 'Gemiddeld'
        : 'Laag',
  };

  // Get vibrant, celebratory color scheme for onboarding completion
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('extraverted_vibrant');

  // Generate action plan on mount
  useEffect(() => {
    const generateActionPlan = async () => {
      setIsGeneratingActionPlan(true);

      try {
        logger.info('🤖 Stap 14: Generating action plan...');

        // Prepare input data for local AI
        // Mock action plan generation

        // Generate action plan using local AI with prompt
        // Mock localAIService call
        logger.info('Mock localAIService.generateActionPlanWithPrompt called');
        const generatedPlan = {
          steps: [
            {
              title: 'Reflecteer op je MBTI-type',
              description: 'Neem 10 minuten om te lezen over je persoonlijkheidstype en hoe dit je leven beïnvloedt.',
              estimatedTime: '10 min'
            },
            {
              title: 'Stel je eerste doel',
              description: 'Kies één interessegebied en stel een klein, haalbaar doel voor de komende week.',
              estimatedTime: '5 min'
            }
          ],
          summary: 'Dit actieplan helpt je om je inzichten uit de onboarding direct toe te passen in je dagelijks leven.',
          generatedAt: new Date().toISOString(),
          source: 'mock'
        };
        setActionPlan(generatedPlan);

        logger.info('✅ Stap 14: Action plan generated:', generatedPlan);
      } catch (error) {
        logger.error('❌ Stap 14: Error generating action plan:', { error: error instanceof Error ? error.message : String(error) });
      } finally {
        setIsGeneratingActionPlan(false);
      }
    };

    generateActionPlan();
  }, [(userData?.context as any)?.communicationStyles, (userData?.context as any)?.situation, (userData?.context as any)?.stressLevel, userData?.interests, userData?.mbtiType, (userData?.wellness as any)?.scores]);

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      logger.info('🎉 Stap 14: Completing onboarding...');

      // Track analytics event
      logger.info('onboarding_complete', {
        used_mbti: !!userData?.mbtiType,
        interest_count: (userData?.interests as string[])?.length || 0,
        action_plan_generated: !!actionPlan,
        steps_count: (actionPlan?.steps as any[])?.length || 0,
        step: 'complete',
      });

      // Mock database call - skip actual database operations
      logger.info('💾 Stap 14: Mock database update');
      logger.info('📝 Mock setting users.onboarded_at = now');

      // Mock database call completed

      // Store action plan locally
      if (actionPlan) {
        localStorage.setItem('localAIActionPlan', JSON.stringify(actionPlan));
        localStorage.setItem(
          'lastActionPlanGenerated',
          new Date().toISOString()
        );
      }

      // Mark onboarding as completed
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('onboardingCompletedAt', new Date().toISOString());

      // Update store with final user data
      setUserData({
        ...userData,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      } as any);

      logger.info('✅ Stap 14: Onboarding completed successfully');
      logger.info('🔍 Final userData for MainView:', userData);

      // Complete onboarding and go to MainView
      onComplete(userData);
    } catch (error) {
      logger.error('❌ Stap 14: Error completing onboarding:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: OnboardingCompleteContextType = {
    isGeneratingActionPlan,
    actionPlan,
    isSubmitting,
    summaryData,
    bmadColors,
    handleComplete,
  };

  return (
    <OnboardingCompleteContext.Provider value={value}>
      {children}
    </OnboardingCompleteContext.Provider>
  );
};

export const useOnboardingComplete = (): OnboardingCompleteContextType => {
  const context = useContext(OnboardingCompleteContext);
  if (context === undefined) {
    throw new Error('useOnboardingComplete must be used within an OnboardingCompleteProvider');
  }
  return context;
};
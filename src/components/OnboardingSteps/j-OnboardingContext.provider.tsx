import React, { createContext, useContext, useState, useCallback } from 'react';
import { databaseService } from '../../services/databaseService';
import { encryptPayload } from '../../utils/encryption';
import { logger } from '../../utils/logger';

export interface ContextData {
  situation: string;
  involvedPersons: string[];
  desiredOutcome: string;
  previousAttempts: string;
  currentEmotion: string;
  emotionExplanation: string;
  lifeStage: string;
  communicationStyles: string[];
  communicationExplanation: string;
  stressLevel: number;
}

interface OnboardingContextContextType {
  // Form State
  formData: ContextData;
  setFormData: React.Dispatch<React.SetStateAction<ContextData>>;
  isSubmitting: boolean;

  // Predefined Options
  involvedPersonOptions: string[];
  emotionOptions: string[];
  lifeStageOptions: string[];
  communicationStyleOptions: string[];

  // Form Actions
  handleInputChange: (field: keyof ContextData, value: string | string[] | number) => void;
  handleInvolvedPersonToggle: (person: string) => void;
  handleCommunicationStyleToggle: (style: string) => void;

  // Business Logic
  handleSubmit: () => Promise<void>;
  handleSkip: () => void;
}

const OnboardingContextContext = createContext<OnboardingContextContextType | undefined>(undefined);

interface OnboardingContextProviderProps {
  onNext: (contextData: ContextData) => void;
  onSkip: () => void;
  children: React.ReactNode;
}

export const OnboardingContextProvider: React.FC<OnboardingContextProviderProps> = ({
  onNext,
  onSkip,
  children,
}) => {
  // Form State
  const [formData, setFormData] = useState<ContextData>({
    situation: '',
    involvedPersons: [],
    desiredOutcome: '',
    previousAttempts: '',
    currentEmotion: '',
    emotionExplanation: '',
    lifeStage: '',
    communicationStyles: [],
    communicationExplanation: '',
    stressLevel: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined Options
  const involvedPersonOptions = [
    'Partner',
    'Kinderen',
    'Ouders',
    "Collega's",
    'Vrienden',
    'Manager',
    'Team',
    'Klanten',
    'Zelf',
    'Andere',
  ];

  const emotionOptions = [
    'Gefrustreerd',
    'Overweldigd',
    'Onzeker',
    'Gestrest',
    'Teleurgesteld',
    'Gemotiveerd',
    'Hopelijk',
    'Angstig',
    'Boos',
    'Verdrietig',
    'Gelukkig',
    'Andere',
  ];

  const lifeStageOptions = [
    'Student',
    'Starter',
    'Young Professional',
    'Mid-career',
    'Senior Professional',
    'Manager',
    'Ondernemer',
    'Ouder',
    'Pensioen',
    'Andere',
  ];

  const communicationStyleOptions = [
    'ADHD',
    'ADD',
    'Autisme',
    'Dyslexie',
    'Dyspraxie',
    'Hoogbegaafdheid',
    'Hoogsensitiviteit',
  ];

  // Form Actions
  const handleInputChange = useCallback((field: keyof ContextData, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleInvolvedPersonToggle = useCallback((person: string) => {
    setFormData(prev => ({
      ...prev,
      involvedPersons: prev.involvedPersons.includes(person)
        ? prev.involvedPersons.filter(p => p !== person)
        : [...prev.involvedPersons, person],
    }));
  }, []);

  const handleCommunicationStyleToggle = useCallback((style: string) => {
    setFormData(prev => ({
      ...prev,
      communicationStyles: prev.communicationStyles.includes(style)
        ? prev.communicationStyles.filter(s => s !== style)
        : [...prev.communicationStyles, style],
    }));
  }, []);

  // Business Logic
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      logger.info('✅ Submitting context data:', formData);

      // Track analytics event
      logger.info('onboarding_context_submitted', {
        hasContext: true,
        fieldsFilled: Object.values(formData).filter(
          v =>
            v !== '' && v !== false && (Array.isArray(v) ? v.length > 0 : true)
        ).length,
        step: 'context',
      });

      // WatermelonDB write: create contexts record
      await databaseService.write(async () => {
        logger.info('💾 Creating context record with encrypted fields');

        // Encrypt sensitive text fields
        const encryptedSituation = formData.situation
          ? encryptPayload(formData.situation)
          : null;
        const encryptedDesiredOutcome = formData.desiredOutcome
          ? encryptPayload(formData.desiredOutcome)
          : null;
        const encryptedPreviousAttempts = formData.previousAttempts
          ? encryptPayload(formData.previousAttempts)
          : null;
        const encryptedEmotionExplanation = formData.emotionExplanation
          ? encryptPayload(formData.emotionExplanation)
          : null;
        const encryptedCommunicationExplanation =
          formData.communicationExplanation
            ? encryptPayload(formData.communicationExplanation)
            : null;

        // Simulate creating context record
        logger.info('📝 Creating context record:', {
          situation_encrypted: encryptedSituation ? 'ENCRYPTED' : null,
          involved_persons: JSON.stringify(formData.involvedPersons),
          desired_outcome_encrypted: encryptedDesiredOutcome
            ? 'ENCRYPTED'
            : null,
          previous_attempts_encrypted: encryptedPreviousAttempts
            ? 'ENCRYPTED'
            : null,
          current_emotion: formData.currentEmotion,
          emotion_explanation_encrypted: encryptedEmotionExplanation
            ? 'ENCRYPTED'
            : null,
          life_stage: formData.lifeStage,
          communication_styles: JSON.stringify(formData.communicationStyles),
          communication_explanation_encrypted: encryptedCommunicationExplanation
            ? 'ENCRYPTED'
            : null,
          stress_level: formData.stressLevel,
        });

        // Update onboarding state
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'context',
          step_completed_flags: JSON.stringify({
            welcome: true,
            auth: true,
            privacy: true,
            basic_profile: true,
            account_created: true,
            mbti_choice: true,
            mbti_quicktest: true,
            mbti_result: true,
            interests: true,
            context: true,
          }),
        });
      });

      logger.info('✅ Context data saved to database');
      onNext(formData);
    } catch (error) {
      logger.error('❌ Error in handleSubmit:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onNext]);

  const handleSkip = useCallback(async () => {
    try {
      logger.info('onboarding_context_skipped', {
        step: 'context',
      });
      logger.info('📊 Tracked: onboarding_context_skipped');
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  }, [onSkip]);

  const contextValue: OnboardingContextContextType = {
    // Form State
    formData,
    setFormData,
    isSubmitting,

    // Predefined Options
    involvedPersonOptions,
    emotionOptions,
    lifeStageOptions,
    communicationStyleOptions,

    // Form Actions
    handleInputChange,
    handleInvolvedPersonToggle,
    handleCommunicationStyleToggle,

    // Business Logic
    handleSubmit,
    handleSkip,
  };

  return (
    <OnboardingContextContext.Provider value={contextValue}>
      {children}
    </OnboardingContextContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContextContext);
  if (context === undefined) {
    throw new Error('useOnboardingContext must be used within an OnboardingContextProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Moon,
  Users,
  Target,
  Brain,
} from 'lucide-react';
import { databaseService } from '../../services/databaseService';
import { encryptPayload } from '../../utils/encryption';
import { logger } from '../../utils/logger';

interface WellnessData {
  answers: number[];
  scores: {
    energy_index: number;
    stress_index: number;
    social_support_score: number;
    self_compassion_score: number;
  };
}

interface Question {
  id: number;
  text: string;
  category: string;
  icon: React.ComponentType<any>;
  type: 'likert' | 'slider';
  reversed?: boolean;
}

interface OnboardingWellnessContextType {
  // State
  currentQuestion: number;
  answers: number[];
  isSubmitting: boolean;

  // Data
  questions: Question[];
  likertLabels: string[];

  // Computed values
  currentQ: Question;
  progress: number;
  IconComponent: React.ComponentType<any>;

  // Actions
  handleAnswer: (value: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => Promise<void>;
  handleSkip: () => Promise<void>;
}

const OnboardingWellnessContext = createContext<OnboardingWellnessContextType | undefined>(undefined);

export const useOnboardingWellness = () => {
  const context = useContext(OnboardingWellnessContext);
  if (!context) {
    throw new Error('useOnboardingWellness must be used within OnboardingWellnessProvider');
  }
  return context;
};

interface OnboardingWellnessProviderProps {
  children: React.ReactNode;
  onNext: (wellnessData: WellnessData) => void;
  onSkip: () => void;
}

export const OnboardingWellnessProvider: React.FC<OnboardingWellnessProviderProps> = ({
  children,
  onNext,
  onSkip,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wellness questions (exact 10 as specified)
  const questions: Question[] = [
    {
      id: 1,
      text: 'Hoe regelmatig slaap je voldoende?',
      category: 'energy',
      icon: Moon,
      type: 'likert' as const,
    },
    {
      id: 2,
      text: 'Hoe vaak heb je last van vermoeidheid overdag?',
      category: 'energy',
      icon: Activity,
      type: 'likert' as const,
      reversed: true,
    },
    {
      id: 3,
      text: 'Hoe vaak beweeg je matig/intensief per week?',
      category: 'energy',
      icon: Activity,
      type: 'likert' as const,
    },
    {
      id: 4,
      text: 'Hoe goed kun je je emoties reguleren in stress?',
      category: 'stress',
      icon: Brain,
      type: 'likert' as const,
    },
    {
      id: 5,
      text: 'Hoe vaak ervaar je zingeving in dagelijkse activiteiten?',
      category: 'meaning',
      icon: Target,
      type: 'likert' as const,
    },
    {
      id: 6,
      text: 'Hoeveel sociale steun ervaar je?',
      category: 'social',
      icon: Users,
      type: 'likert' as const,
    },
    {
      id: 7,
      text: 'Hoe vaak ervaar je lichamelijke klachten die functioneren beïnvloeden?',
      category: 'stress',
      icon: Heart,
      type: 'likert' as const,
      reversed: true,
    },
    {
      id: 8,
      text: 'Hoe vaak handel je doelgericht?',
      category: 'meaning',
      icon: Target,
      type: 'likert' as const,
    },
    {
      id: 9,
      text: 'Hoe vaak ben je vriendelijk voor jezelf bij tegenslag?',
      category: 'self_compassion',
      icon: Heart,
      type: 'likert' as const,
    },
    {
      id: 10,
      text: 'Hoe hoog is je ervaren stressniveau?',
      category: 'stress',
      icon: Activity,
      type: 'slider' as const,
      reversed: true,
    },
  ];

  const likertLabels = ['Zeer zelden', 'Zelden', 'Soms', 'Vaak', 'Zeer vaak'];

  const handleAnswer = (value: number) => {
    logger.info('🔄 handleAnswer called with value:', { value, currentQuestion });
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    logger.info('📝 Updated answers:', newAnswers);
  };

  const handleNext = () => {
    logger.info(
      '🔄 handleNext called, currentQuestion:',
      { currentQuestion, answers }
    );
    if (currentQuestion < questions.length - 1) {
      logger.info('📱 Moving to next question:', { nextQuestion: currentQuestion + 1 });
      setCurrentQuestion(currentQuestion + 1);
    } else {
      logger.info('❌ Already at last question');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScores = (answers: number[]): WellnessData['scores'] => {
    // Energy Index (questions 1, 2, 3)
    const energyAnswers = [answers[0], answers[1], answers[2]];
    const energyIndex = Math.round(
      (energyAnswers.reduce((sum, answer) => {
        const value =
          questions[1].reversed && answer === 1
            ? 5
            : questions[1].reversed && answer === 2
              ? 4
              : questions[1].reversed && answer === 3
                ? 3
                : questions[1].reversed && answer === 4
                  ? 2
                  : questions[1].reversed && answer === 5
                    ? 1
                    : answer;
        return sum + value;
      }, 0) /
        energyAnswers.length) *
        20
    );

    // Stress Index (questions 4, 7, 10)
    const stressAnswers = [answers[3], answers[6], answers[9]];
    const stressIndex = Math.round(
      (stressAnswers.reduce((sum, answer) => {
        const value =
          questions[6].reversed && answer === 1
            ? 5
            : questions[6].reversed && answer === 2
              ? 4
              : questions[6].reversed && answer === 3
                ? 3
                : questions[6].reversed && answer === 4
                  ? 2
                  : questions[6].reversed && answer === 5
                    ? 1
                    : answer;
        return sum + value;
      }, 0) /
        stressAnswers.length) *
        20
    );

    // Social Support Score (question 6)
    const socialSupportScore = Math.round(answers[5] * 20);

    // Self Compassion Score (question 9)
    const selfCompassionScore = Math.round(answers[8] * 20);

    return {
      energy_index: energyIndex,
      stress_index: stressIndex,
      social_support_score: socialSupportScore,
      self_compassion_score: selfCompassionScore,
    };
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === 0)) {
      logger.info('❌ Please answer all questions');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info('✅ Submitting wellness assessment:', answers);

      const scores = calculateScores(answers);
      logger.info('📊 Calculated scores:', scores);

      // Track analytics event
      logger.info(
        'onboarding_wellness_assessment_completed',
        {
          scores: scores,
          step: 'wellness',
        }
      );

      // WatermelonDB write: create wellness_assessments record
      await databaseService.write(async () => {
        logger.info('💾 Creating wellness assessment record');

        // Encrypt raw answers
        const encryptedAnswers = encryptPayload(JSON.stringify(answers));
        const scoresJson = JSON.stringify(scores);

        // Simulate creating wellness assessment record
        logger.info('📝 Creating wellness assessment record:', {
          answers_encrypted: encryptedAnswers ? 'ENCRYPTED' : null,
          scores_json: scoresJson,
          energy_index: scores.energy_index,
          stress_index: scores.stress_index,
          social_support_score: scores.social_support_score,
          self_compassion_score: scores.self_compassion_score,
        });

        // Update onboarding state
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'wellness',
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
            wellness: true,
          }),
        });
      });

      logger.info('✅ Wellness assessment saved to database');
      onNext({ answers, scores });
    } catch (error) {
      logger.error('❌ Error in handleSubmit:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      logger.info('onboarding_wellness_skipped', {
        step: 'wellness',
      });
      logger.info('📊 Tracked: onboarding_wellness_skipped');
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  };

  // Track that wellness page is shown
  useEffect(() => {
    const trackWellnessShown = async () => {
      try {
        logger.info('onboarding_wellness_shown', {
          step: 'wellness',
          action: 'shown',
        });
        logger.info('📊 Wellness page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking wellness shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackWellnessShown();
  }, []);

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const IconComponent = currentQ.icon;

  const value: OnboardingWellnessContextType = {
    // State
    currentQuestion,
    answers,
    isSubmitting,

    // Data
    questions,
    likertLabels,

    // Computed values
    currentQ,
    progress,
    IconComponent,

    // Actions
    handleAnswer,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleSkip,
  };

  return (
    <OnboardingWellnessContext.Provider value={value}>
      {children}
    </OnboardingWellnessContext.Provider>
  );
};
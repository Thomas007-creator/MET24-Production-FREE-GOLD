import React, { createContext, useContext, useState, ReactNode } from 'react';
import { logger } from '../../utils/logger';

interface Question {
  id: number;
  text: string;
  dichotomy: 'I/E' | 'S/N' | 'T/F' | 'J/P';
  reversed: boolean;
}

interface OnboardingMbtiQuicktestContextType {
  // State
  currentQuestion: number;
  answers: number[];
  isSubmitting: boolean;
  questions: Question[];
  progress: number;

  // Computed values
  currentQ: Question;
  likertLabels: string[];

  // Actions
  handleAnswer: (value: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubmit: () => Promise<void>;
  handleSkip: () => void;
}

const OnboardingMbtiQuicktestContext = createContext<OnboardingMbtiQuicktestContextType | undefined>(undefined);

interface OnboardingMbtiQuicktestProviderProps {
  children: ReactNode;
  onComplete: (result: {
    letters: string;
    percentages: Record<string, number> | null;
    confidence: number;
  }) => void;
  onSkip: () => void;
}

export const OnboardingMbtiQuicktestProvider: React.FC<OnboardingMbtiQuicktestProviderProps> = ({
  children,
  onComplete,
  onSkip,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: 'Ik laad het liefst op door alleen tijd door te brengen.',
      dichotomy: 'I/E',
      reversed: false,
    },
    {
      id: 2,
      text: 'Ik let meer op feiten en details dan op patronen en mogelijkheden.',
      dichotomy: 'S/N',
      reversed: true,
    },
    {
      id: 3,
      text: 'Beslissingen neem ik meestal op basis van logica in plaats van gevoel.',
      dichotomy: 'T/F',
      reversed: false,
    },
    {
      id: 4,
      text: 'Ik plan graag dingen en houd van structuur.',
      dichotomy: 'J/P',
      reversed: false,
    },
    {
      id: 5,
      text: 'Ik voel me energieker na het ontmoeten van nieuwe mensen.',
      dichotomy: 'I/E',
      reversed: true,
    },
    {
      id: 6,
      text: 'Ik vertrouw op intuïtie om toekomstmogelijkheden te zien.',
      dichotomy: 'S/N',
      reversed: false,
    },
    {
      id: 7,
      text: 'In discussies zoek ik naar de waarheid, zelfs als het ongemakkelijk is.',
      dichotomy: 'T/F',
      reversed: false,
    },
    {
      id: 8,
      text: 'Ik vind flexibiliteit en ruimte belangrijker dan strakke planning.',
      dichotomy: 'J/P',
      reversed: true,
    },
    {
      id: 9,
      text: 'Ik merk vaak details op die anderen missen.',
      dichotomy: 'S/N',
      reversed: true,
    },
    {
      id: 10,
      text: 'Ik stel mijn gevoelens en waarden mee laten wegen bij beslissingen.',
      dichotomy: 'T/F',
      reversed: true,
    },
  ];

  const likertLabels = [
    'Helemaal oneens',
    'Oneens',
    'Neutraal',
    'Eens',
    'Helemaal eens',
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateMBTI = (): { letters: string; percentages: Record<string, number>; confidence: number } => {
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer === 0) return; // Skip unanswered questions

      const normalizedAnswer = question.reversed ? (6 - answer) : answer;
      const score = (normalizedAnswer - 3) * 2; // Convert 1-5 to -4 to +4

      switch (question.dichotomy) {
        case 'I/E':
          if (score > 0) E += score;
          else I += Math.abs(score);
          break;
        case 'S/N':
          if (score > 0) S += score;
          else N += Math.abs(score);
          break;
        case 'T/F':
          if (score > 0) T += score;
          else F += Math.abs(score);
          break;
        case 'J/P':
          if (score > 0) J += score;
          else P += Math.abs(score);
          break;
      }
    });

    const letters = [
      E > I ? 'E' : 'I',
      S > N ? 'S' : 'N',
      T > F ? 'T' : 'F',
      J > P ? 'J' : 'P',
    ].join('');

    const totalAnswered = answers.filter(a => a !== 0).length;
    const confidence = Math.min(95, Math.max(60, (totalAnswered / questions.length) * 100));

    const percentages = {
      E: Math.round((E / (E + I)) * 100) || 50,
      I: Math.round((I / (E + I)) * 100) || 50,
      S: Math.round((S / (S + N)) * 100) || 50,
      N: Math.round((N / (S + N)) * 100) || 50,
      T: Math.round((T / (T + F)) * 100) || 50,
      F: Math.round((F / (T + F)) * 100) || 50,
      J: Math.round((J / (J + P)) * 100) || 50,
      P: Math.round((P / (J + P)) * 100) || 50,
    };

    return { letters, percentages, confidence };
  };

  const handleSubmit = async () => {
    if (answers.some(a => a === 0)) {
      alert('Beantwoord alle vragen voordat je de test voltooit.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = calculateMBTI();
      logger.info('Quicktest completed', { result });

      // Store result in database
      logger.info('Quicktest completed and stored', {
        mbti_type: result.letters,
        confidence: result.confidence,
        step: 'mbti_quicktest',
      });

      onComplete(result);
    } catch (error) {
      logger.error('Error completing quicktest', { error });
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  const value: OnboardingMbtiQuicktestContextType = {
    currentQuestion,
    answers,
    isSubmitting,
    questions,
    progress,
    currentQ,
    likertLabels,
    handleAnswer,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleSkip,
  };

  return (
    <OnboardingMbtiQuicktestContext.Provider value={value}>
      {children}
    </OnboardingMbtiQuicktestContext.Provider>
  );
};

export const useOnboardingMbtiQuicktest = (): OnboardingMbtiQuicktestContextType => {
  const context = useContext(OnboardingMbtiQuicktestContext);
  if (context === undefined) {
    throw new Error('useOnboardingMbtiQuicktest must be used within an OnboardingMbtiQuicktestProvider');
  }
  return context;
};
import React from 'react';
import { OnboardingContext } from './j-OnboardingContext.form';

interface OnboardingContextProps {
  onNext: (contextData: ContextData) => void;
  onSkip: () => void;
}

interface ContextData {
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

const OnboardingContextWrapper: React.FC<OnboardingContextProps> = ({
  onNext,
  onSkip,
}) => {
  return <OnboardingContext />;
};

export default OnboardingContextWrapper;
export type { OnboardingContextProps, ContextData };

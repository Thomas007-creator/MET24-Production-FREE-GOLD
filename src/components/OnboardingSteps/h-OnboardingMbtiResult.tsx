import React from 'react';
import { OnboardingMbtiResultProvider } from './h-OnboardingMbtiResult.provider';
import { OnboardingMbtiResultForm } from './h-OnboardingMbtiResult.form';

interface OnboardingMbtiResultProps {
  result: {
    letters: string;
    percentages: {
      [key: string]: {
        percentage: number;
        confidence: number;
        letter: string;
      };
    };
    confidence: number;
  };
  onSave: () => void;
  onEdit: () => void;
  onBack: () => void;
  onUseExternal?: () => void;
  hasExternalResult?: boolean;
}

const OnboardingMbtiResult: React.FC<OnboardingMbtiResultProps> = ({
  result,
  onSave,
  onEdit,
  onBack,
  onUseExternal,
  hasExternalResult = false,
}) => {
  return (
    <OnboardingMbtiResultProvider
      result={result}
      onSave={onSave}
      onEdit={onEdit}
      onBack={onBack}
      onUseExternal={onUseExternal}
      hasExternalResult={hasExternalResult}
    >
      <OnboardingMbtiResultForm />
    </OnboardingMbtiResultProvider>
  );
};

export default OnboardingMbtiResult;

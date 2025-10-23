import React from 'react';
import { OnboardingMbtiQuicktestProvider } from './g-OnboardingMbtiQuicktest.provider';
import { OnboardingMbtiQuicktestForm } from './g-OnboardingMbtiQuicktest.form';

interface OnboardingMbtiQuicktestProps {
  onComplete: (result: {
    letters: string;
    percentages: Record<string, number> | null;
    confidence: number;
  }) => void;
  onSkip: () => void;
}

const OnboardingMbtiQuicktest: React.FC<OnboardingMbtiQuicktestProps> = ({
  onComplete,
  onSkip,
}) => {
  return (
    <OnboardingMbtiQuicktestProvider onComplete={onComplete} onSkip={onSkip}>
      <OnboardingMbtiQuicktestForm />
    </OnboardingMbtiQuicktestProvider>
  );
};

export default OnboardingMbtiQuicktest;

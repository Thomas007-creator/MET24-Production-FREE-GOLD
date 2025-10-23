import React from 'react';
import { OnboardingInterestsProvider } from './i-OnboardingInterests.provider';
import { OnboardingInterestsForm } from './i-OnboardingInterests.form';

interface OnboardingInterestsProps {
  onNext: (interests: string[]) => void;
  onSkip: () => void;
}

const OnboardingInterests: React.FC<OnboardingInterestsProps> = ({
  onNext,
  onSkip,
}) => {
  return (
    <OnboardingInterestsProvider onNext={onNext} onSkip={onSkip}>
      <OnboardingInterestsForm />
    </OnboardingInterestsProvider>
  );
};

export default OnboardingInterests;

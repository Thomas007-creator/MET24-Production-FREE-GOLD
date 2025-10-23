import React from 'react';
import { OnboardingProfileProvider } from './d-OnboardingProfile.provider';
import { OnboardingProfileForm } from './d-OnboardingProfile.form';

interface OnboardingProfileProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingProfile: React.FC<OnboardingProfileProps> = ({
  onNext,
  onSkip,
}) => {
  return (
    <OnboardingProfileProvider onNext={onNext} onSkip={onSkip}>
      <OnboardingProfileForm />
    </OnboardingProfileProvider>
  );
};

export default OnboardingProfile;

import React from 'react';
import { OnboardingCompleteProvider } from './n-OnboardingComplete.provider';
import { OnboardingCompleteForm } from './n-OnboardingComplete.form';

interface OnboardingCompleteProps {
  onComplete: (userData: any) => void;
  userData: any;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onComplete,
  userData,
}) => {
  return (
    <OnboardingCompleteProvider onComplete={onComplete} userData={userData}>
      <OnboardingCompleteForm />
    </OnboardingCompleteProvider>
  );
};

export default OnboardingComplete;

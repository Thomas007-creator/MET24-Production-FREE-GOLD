import React from 'react';
import { OnboardingAuthProvider } from './b-OnboardingAuth.provider';
import { OnboardingAuthForm } from './b-OnboardingAuth.form';

interface OnboardingAuthProps {
  onNext: () => void;
}

const OnboardingAuth: React.FC<OnboardingAuthProps> = ({ onNext }) => {
  return (
    <OnboardingAuthProvider onNext={onNext}>
      <OnboardingAuthForm />
    </OnboardingAuthProvider>
  );
};

export default OnboardingAuth;

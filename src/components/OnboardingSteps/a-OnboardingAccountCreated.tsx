import React from 'react';
import { OnboardingAccountCreatedProvider } from './a-OnboardingAccountCreated.provider';
import { OnboardingAccountCreatedForm } from './a-OnboardingAccountCreated.form';

interface OnboardingAccountCreatedProps {
  onNext: () => void;
  onIntro: () => void;
  onLogin: () => void;
}

const OnboardingAccountCreated: React.FC<OnboardingAccountCreatedProps> = ({
  onNext,
  onIntro,
  onLogin,
}) => {
  return (
    <OnboardingAccountCreatedProvider
      onNext={onNext}
      onIntro={onIntro}
      onLogin={onLogin}
    >
      <OnboardingAccountCreatedForm />
    </OnboardingAccountCreatedProvider>
  );
};

export default OnboardingAccountCreated;

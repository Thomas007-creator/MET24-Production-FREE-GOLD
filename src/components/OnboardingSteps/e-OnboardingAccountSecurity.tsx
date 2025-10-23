import React from 'react';
import { OnboardingAccountSecurityProvider } from './e-OnboardingAccountSecurity.provider';
import { OnboardingAccountSecurityForm } from './e-OnboardingAccountSecurity.form';

interface OnboardingAccountSecurityProps {
  onNext: () => void;
  onBack: () => void;
}

const OnboardingAccountSecurity: React.FC<OnboardingAccountSecurityProps> = ({
  onNext,
  onBack: _onBack,
}) => {
  return (
    <OnboardingAccountSecurityProvider onNext={onNext}>
      <OnboardingAccountSecurityForm />
    </OnboardingAccountSecurityProvider>
  );
};

export default OnboardingAccountSecurity;

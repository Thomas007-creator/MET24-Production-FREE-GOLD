import React from 'react';
import { OnboardingPrivacyProvider } from './c-OnboardingPrivacy.provider';
import { OnboardingPrivacyForm } from './c-OnboardingPrivacy.form';

interface OnboardingPrivacyProps {
  onAccept: () => void;
  onMoreInfo: () => void;
}

const OnboardingPrivacy: React.FC<OnboardingPrivacyProps> = ({
  onAccept,
  onMoreInfo,
}) => {
  return (
    <OnboardingPrivacyProvider
      onAccept={onAccept}
      onMoreInfo={onMoreInfo}
    >
      <OnboardingPrivacyForm />
    </OnboardingPrivacyProvider>
  );
};

export default OnboardingPrivacy;

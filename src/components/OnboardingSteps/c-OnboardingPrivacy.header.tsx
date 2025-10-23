import React from 'react';
import { useOnboardingPrivacy } from './c-OnboardingPrivacy.provider';

export const OnboardingPrivacyHeader: React.FC = () => {
  const { privacyColorScheme, glassmorphismClasses, animationClasses } = useOnboardingPrivacy();

  return (
    <div className="mb-8">
      <div className={`w-24 h-24 ${glassmorphismClasses} rounded-full flex items-center justify-center mx-auto mb-6 ${animationClasses}`}>
        <span className="text-4xl">🔒</span>
      </div>
      <h1 className={`text-3xl font-bold bg-gradient-to-r ${privacyColorScheme.gradient} bg-clip-text text-transparent mb-4`}>
        Privacy‑first
      </h1>
    </div>
  );
};
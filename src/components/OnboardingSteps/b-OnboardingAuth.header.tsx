import React from 'react';
import { useOnboardingAuth } from './b-OnboardingAuth.provider';

export const OnboardingAuthHeader: React.FC = () => {
  const { authColorScheme, glassmorphismClasses, animationClasses } = useOnboardingAuth();

  return (
    <div className="mb-8">
      <div className={`w-24 h-24 ${glassmorphismClasses} rounded-full flex items-center justify-center mx-auto mb-6 ${animationClasses}`}>
        <span className="text-4xl">🔐</span>
      </div>
      <h1 className={`text-3xl font-bold bg-gradient-to-r ${authColorScheme.gradient} bg-clip-text text-transparent mb-4`}>
        Hoe wil je starten?
      </h1>
    </div>
  );
};
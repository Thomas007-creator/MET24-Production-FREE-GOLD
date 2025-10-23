import React from 'react';
import { useOnboardingAccountCreated } from './a-OnboardingAccountCreated.provider';

export const OnboardingAccountCreatedHeader: React.FC = () => {
  const { authColorScheme, glassmorphismClasses, animationClasses } = useOnboardingAccountCreated();

  return (
    <div className="mb-8">
      <div className={`w-24 h-24 ${glassmorphismClasses} rounded-full flex items-center justify-center mx-auto mb-6 ${animationClasses}`}>
        <span className="text-4xl">🎯</span>
      </div>
      <h1 className={`text-3xl font-bold bg-gradient-to-r ${authColorScheme.gradient} bg-clip-text text-transparent mb-4`}>
        Welkom bij Your Future Self
      </h1>
    </div>
  );
};
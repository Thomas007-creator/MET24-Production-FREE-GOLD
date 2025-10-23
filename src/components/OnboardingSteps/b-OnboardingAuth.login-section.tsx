import React from 'react';
import { useOnboardingAuth } from './b-OnboardingAuth.provider';

export const OnboardingAuthLoginSection: React.FC = () => {
  const { handleLogin } = useOnboardingAuth();

  return (
    <div className="text-center mb-6">
      <p className="text-sm opacity-80 mb-2">Heb je al een account?</p>
      <button
        onClick={handleLogin}
        className="text-white underline hover:text-blue-200 transition-colors"
      >
        Inloggen
      </button>
    </div>
  );
};
import React from 'react';
import { useOnboardingAccountCreated } from './a-OnboardingAccountCreated.provider';

export const OnboardingAccountCreatedLoginSection: React.FC = () => {
  const { handleLogin } = useOnboardingAccountCreated();

  return (
    <div className="text-center">
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
import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingAuth } from './b-OnboardingAuth.provider';
import BMADColorSystem from '../../lib/bmadColorSystem';

export const OnboardingAuthButtons: React.FC = () => {
  const { handleAppleAuth, handleXAuth, handleManualSignup } = useOnboardingAuth();

  return (
    <div className="space-y-4 mb-8">
      <Button
        color="primary"
        size="lg"
        onClick={handleAppleAuth}
        className={`w-full ${BMADColorSystem.getButtonColorFromGradient('from-teal-500 to-cyan-500')} text-white font-semibold shadow-lg`}
      >
        🍎 Doorgaan met Apple
      </Button>

      <Button
        color="primary"
        size="lg"
        onClick={handleXAuth}
        className="w-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors"
      >
        🐦 Maak slim met X
      </Button>

      <Button
        color="primary"
        size="lg"
        onClick={handleManualSignup}
        className="w-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors"
      >
        ✏️ Account aanmaken
      </Button>
    </div>
  );
};
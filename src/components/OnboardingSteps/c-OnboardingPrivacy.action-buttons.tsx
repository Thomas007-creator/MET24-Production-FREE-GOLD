import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingPrivacy } from './c-OnboardingPrivacy.provider';
import BMADColorSystem from '../../lib/bmadColorSystem';

export const OnboardingPrivacyActionButtons: React.FC = () => {
  const { isChecked, handleAccept, handleMoreInfo } = useOnboardingPrivacy();

  return (
    <div className="space-y-4">
      <Button
        onClick={handleAccept}
        disabled={!isChecked}
        className={`w-full text-white font-semibold ${BMADColorSystem.getButtonColorFromGradient('from-teal-500 to-cyan-500')} shadow-lg`}
        size="lg"
      >
        Akkoord & Doorgaan
      </Button>

      <Button
        variant="ghost"
        onClick={handleMoreInfo}
        className="w-full text-white border-white/30 hover:bg-white/10"
        size="lg"
      >
        Meer informatie
      </Button>
    </div>
  );
};
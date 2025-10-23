import React from 'react';
import { useOnboardingPrivacy } from './c-OnboardingPrivacy.provider';

export const OnboardingPrivacyInfoSection: React.FC = () => {
  const { showInfo, glassmorphismClasses } = useOnboardingPrivacy();

  if (!showInfo) {
    return null;
  }

  return (
    <div className={`mt-6 p-4 ${glassmorphismClasses} rounded-lg text-left`}>
      <h3 className="font-semibold mb-2 text-cyan-300">Privacy details:</h3>
      <ul className="text-sm text-white/80 space-y-1">
        <li>• Alle data wordt lokaal op je apparaat opgeslagen</li>
        <li>• Geen tracking zonder expliciete toestemming</li>
        <li>• Je kunt je data op elk moment exporteren of verwijderen</li>
        <li>• AI-analyse gebeurt lokaal, niet op onze servers</li>
      </ul>
    </div>
  );
};
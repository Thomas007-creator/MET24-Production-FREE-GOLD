import React from 'react';
import { useOnboardingProfile } from './d-OnboardingProfile.provider';

export const OnboardingProfileValidationSummary: React.FC = () => {
  const { errors, isValid } = useOnboardingProfile();

  if (isValid || (!errors.name && !errors.age)) {
    return null;
  }

  return (
    <div className="bg-red-900/80 backdrop-blur-xl border border-red-800/60 rounded-xl p-4 mb-6">
      <h3 className="text-red-200 font-semibold mb-3 text-left">
        Controleer je invoer:
      </h3>
      <ul className="space-y-2 text-left">
        {errors.name && (
          <li className="text-red-300 text-sm flex items-start">
            <span className="text-red-400 mr-2">•</span>
            {errors.name}
          </li>
        )}
        {errors.age && (
          <li className="text-red-300 text-sm flex items-start">
            <span className="text-red-400 mr-2">•</span>
            {errors.age}
          </li>
        )}
      </ul>
    </div>
  );
};
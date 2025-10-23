import React from 'react';
import { OnboardingProfileFormFields } from './d-OnboardingProfile.form-fields';
import { OnboardingProfileActionButtons } from './d-OnboardingProfile.action-buttons';
import { OnboardingProfileValidationSummary } from './d-OnboardingProfile.validation-summary';
import { useOnboardingProfile } from './d-OnboardingProfile.provider';

export const OnboardingProfileForm: React.FC = () => {
  const { glassmorphismClasses, animationClasses } = useOnboardingProfile();

  return (
    <div className={`min-h-screen ${glassmorphismClasses} ${animationClasses}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Vertel ons iets over jezelf
        </h1>
        <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
          Jouw naam en leeftijd helpen ons om gepersonaliseerde adviezen te geven
          die passen bij jouw levensfase.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto">
        {/* Validation Summary */}
        <OnboardingProfileValidationSummary />

        {/* Form Fields */}
        <OnboardingProfileFormFields />

        {/* Action Buttons */}
        <OnboardingProfileActionButtons />
      </div>

      {/* Info Box */}
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm leading-relaxed text-center">
            <span className="font-semibold text-white/90">Privacy eerst:</span>{' '}
            Jouw gegevens worden veilig opgeslagen en alleen gebruikt voor
            gepersonaliseerde adviezen. Je kunt dit altijd aanpassen in je
            instellingen.
          </p>
        </div>
      </div>
    </div>
  );
};
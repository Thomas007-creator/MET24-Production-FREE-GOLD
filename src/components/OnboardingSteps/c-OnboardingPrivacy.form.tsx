import React from 'react';
import { OnboardingPrivacyHeader } from './c-OnboardingPrivacy.header';
import { OnboardingPrivacyContent } from './c-OnboardingPrivacy.content';
import { OnboardingPrivacyCheckbox } from './c-OnboardingPrivacy.checkbox';
import { OnboardingPrivacyActionButtons } from './c-OnboardingPrivacy.action-buttons';
import { OnboardingPrivacyInfoSection } from './c-OnboardingPrivacy.info-section';
import { useOnboardingPrivacy } from './c-OnboardingPrivacy.provider';

export const OnboardingPrivacyForm: React.FC = () => {
  const { privacyColorScheme, glassmorphismClasses } = useOnboardingPrivacy();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${privacyColorScheme.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className="text-center max-w-md">
        {/* Header */}
        <OnboardingPrivacyHeader />

        {/* Content */}
        <OnboardingPrivacyContent />

        {/* Database status indicator */}
        <div className={`mb-4 p-3 ${glassmorphismClasses} rounded-lg`}>
          <p className="text-sm text-white/80">
            Database: {'🔗 WatermelonDB'} |
            Version: {'2.0.0'} | Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Privacy Checkbox */}
        <OnboardingPrivacyCheckbox />

        {/* Action Buttons */}
        <OnboardingPrivacyActionButtons />

        {/* Info Section */}
        <OnboardingPrivacyInfoSection />
      </div>
    </div>
  );
};
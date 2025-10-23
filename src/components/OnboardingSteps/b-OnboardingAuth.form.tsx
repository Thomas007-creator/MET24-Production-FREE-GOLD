import React from 'react';
import { OnboardingAuthHeader } from './b-OnboardingAuth.header';
import { OnboardingAuthContent } from './b-OnboardingAuth.content';
import { OnboardingAuthButtons } from './b-OnboardingAuth.buttons';
import { OnboardingAuthLoginSection } from './b-OnboardingAuth.login-section';
import { OnboardingAuthTermsFooter } from './b-OnboardingAuth.terms-footer';
import { useOnboardingAuth } from './b-OnboardingAuth.provider';

export const OnboardingAuthForm: React.FC = () => {
  const { authColorScheme, glassmorphismClasses } = useOnboardingAuth();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${authColorScheme.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className="text-center max-w-md">
        {/* Header */}
        <OnboardingAuthHeader />

        {/* Content */}
        <OnboardingAuthContent />

        {/* Database status indicator */}
        <div className={`mb-4 p-3 ${glassmorphismClasses} rounded-lg`}>
          <p className="text-sm text-white/80">
            Database: {'🔗 WatermelonDB'} |
            Version: {'2.0.0'} | Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Auth Buttons */}
        <OnboardingAuthButtons />

        {/* Login Section */}
        <OnboardingAuthLoginSection />

        {/* Terms Footer */}
        <OnboardingAuthTermsFooter />
      </div>
    </div>
  );
};
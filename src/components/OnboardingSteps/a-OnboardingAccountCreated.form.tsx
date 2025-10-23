import React from 'react';
import { OnboardingAccountCreatedHeader } from './a-OnboardingAccountCreated.header';
import { OnboardingAccountCreatedContent } from './a-OnboardingAccountCreated.content';
import { OnboardingAccountCreatedActionButtons } from './a-OnboardingAccountCreated.action-buttons';
import { OnboardingAccountCreatedLoginSection } from './a-OnboardingAccountCreated.login-section';
import { useOnboardingAccountCreated } from './a-OnboardingAccountCreated.provider';

export const OnboardingAccountCreatedForm: React.FC = () => {
  const { authColorScheme } = useOnboardingAccountCreated();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${authColorScheme.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className="text-center max-w-md">
        {/* Header */}
        <OnboardingAccountCreatedHeader />

        {/* Content */}
        <OnboardingAccountCreatedContent />

        {/* Database status indicator */}
        <div className="mb-4 p-2 bg-white/10 rounded-lg">
          <p className="text-xs">
            Database: 🔗 WatermelonDB | Status: ✅ Connected
          </p>
        </div>

        {/* Action Buttons */}
        <OnboardingAccountCreatedActionButtons />

        {/* Login Section */}
        <OnboardingAccountCreatedLoginSection />
      </div>
    </div>
  );
};
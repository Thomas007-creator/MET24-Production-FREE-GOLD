import React from 'react';
import { OnboardingMbtiQuicktestProgressIndicator } from './g-OnboardingMbtiQuicktest.progress-indicator';
import { OnboardingMbtiQuicktestQuestionScreen } from './g-OnboardingMbtiQuicktest.question-screen';
import { OnboardingMbtiQuicktestNavigationButtons } from './g-OnboardingMbtiQuicktest.navigation-buttons';

export const OnboardingMbtiQuicktestForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <OnboardingMbtiQuicktestProgressIndicator />
        <OnboardingMbtiQuicktestQuestionScreen />
        <OnboardingMbtiQuicktestNavigationButtons />
      </div>
    </div>
  );
};
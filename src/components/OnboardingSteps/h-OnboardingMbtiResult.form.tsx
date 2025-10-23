import React from 'react';
import { useOnboardingMbtiResult } from './h-OnboardingMbtiResult.provider';
import { OnboardingMbtiResultHeader } from './h-OnboardingMbtiResult.header';
import { OnboardingMbtiResultDichotomyBreakdown } from './h-OnboardingMbtiResult.dichotomy-breakdown';
import { OnboardingMbtiResultActionButtons } from './h-OnboardingMbtiResult.action-buttons';

export const OnboardingMbtiResultForm: React.FC = () => {
  const { bmadColors } = useOnboardingMbtiResult();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className="text-center max-w-2xl">
        <OnboardingMbtiResultHeader />

        {/* Result Display */}
        <div className="mb-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
          <OnboardingMbtiResultDichotomyBreakdown />
        </div>

        <OnboardingMbtiResultActionButtons />

        {/* Info Box */}
        <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-600/40 rounded-2xl p-6">
          <p className="text-sm opacity-80 leading-relaxed">
            💡 <strong>Tip:</strong> Deze inschatting helpt de AI-coach om
            persoonlijker advies te geven. Je kunt altijd later je MBTI type
            aanpassen in de instellingen.
          </p>
        </div>
      </div>
    </div>
  );
};
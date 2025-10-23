import React from 'react';
import { useOnboardingMbtiQuicktest } from './g-OnboardingMbtiQuicktest.provider';

export const OnboardingMbtiQuicktestProgressIndicator: React.FC = () => {
  const { progress, currentQuestion, questions } = useOnboardingMbtiQuicktest();

  return (
    <div className="text-center text-white mb-8">
      <h1 className="text-3xl font-bold mb-4">MBTI Quicktest</h1>
      <p className="text-lg opacity-90 mb-6">
        10 korte stellingen, ~2–3 minuten. Resultaat = inschatting + confidence.
      </p>

      {/* Database status indicator */}
      <div className="mb-4 p-2 bg-gray-900 rounded-lg">
        <p className="text-xs">
          Database: 🔗 WatermelonDB | Status: ✅ Connected
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm opacity-80">
        Vraag {currentQuestion + 1} van {questions.length}
      </p>
    </div>
  );
};
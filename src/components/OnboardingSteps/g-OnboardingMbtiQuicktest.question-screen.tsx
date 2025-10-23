import React from 'react';
import { useOnboardingMbtiQuicktest } from './g-OnboardingMbtiQuicktest.provider';

export const OnboardingMbtiQuicktestQuestionScreen: React.FC = () => {
  const { currentQ, answers, currentQuestion, likertLabels, handleAnswer } = useOnboardingMbtiQuicktest();

  return (
    <div className="mb-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
      <h2 className="text-xl font-semibold mb-6 leading-relaxed">
        {currentQ.text}
      </h2>

      {/* Likert Scale */}
      <div className="space-y-3">
        {likertLabels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index + 1)}
            className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
              answers[currentQuestion] === index + 1
                ? 'bg-blue-500/30 border-2 border-blue-400 shadow-lg'
                : 'bg-yellow-800/40 border border-white/30 hover:bg-yellow-700/50'
            }`}
          >
            <span className="text-lg">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
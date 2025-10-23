import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingMbtiQuicktest } from './g-OnboardingMbtiQuicktest.provider';

export const OnboardingMbtiQuicktestNavigationButtons: React.FC = () => {
  const {
    currentQuestion,
    questions,
    answers,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleSkip,
  } = useOnboardingMbtiQuicktest();

  return (
    <div className="flex gap-4 justify-between">
      {/* Previous/Skip */}
      <Button
        color="primary"
        size="lg"
        onClick={currentQuestion === 0 ? handleSkip : handlePrevious}
        className="bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors"
      >
        {currentQuestion === 0 ? '⏭️ Overslaan' : '← Vorige'}
      </Button>

      {/* Next/Complete */}
      {currentQuestion === questions.length - 1 ? (
        // On last question, show complete button
        <Button
          color="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`font-semibold transition-colors ${
            !isSubmitting
              ? 'bg-white text-blue-600 hover:bg-gray-100'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '⏳ Verwerken...' : '✅ Test voltooien'}
        </Button>
      ) : (
        // On other questions, show next button
        <Button
          color="primary"
          size="lg"
          onClick={handleNext}
          disabled={answers[currentQuestion] === 0 || isSubmitting}
          className={`font-semibold transition-colors ${
            answers[currentQuestion] !== 0 && !isSubmitting
              ? 'bg-white text-blue-600 hover:bg-gray-100'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          Volgende →
        </Button>
      )}
    </div>
  );
};
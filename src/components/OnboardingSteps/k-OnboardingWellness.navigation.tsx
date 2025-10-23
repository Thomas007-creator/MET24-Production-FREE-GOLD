import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingWellness } from './k-OnboardingWellness.provider';

export const OnboardingWellnessNavigation: React.FC = () => {
  const {
    currentQuestion,
    answers,
    questions,
    isSubmitting,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleSkip,
  } = useOnboardingWellness();

  return (
    <div className='flex gap-4 justify-between'>
      {/* Previous/Skip */}
      <Button
        color='primary'
        size='lg'
        onClick={currentQuestion === 0 ? handleSkip : handlePrevious}
        className='bg-amber-400/10 text-white border border-amber-400/30 hover:bg-amber-400/20 transition-colors'
      >
        {currentQuestion === 0 ? '⏭️ Overslaan' : '← Vorige'}
      </Button>

      {/* Next/Complete */}
      {currentQuestion === questions.length - 1 ? (
        // On last question, show complete button
        <Button
          color='primary'
          size='lg'
          onClick={handleSubmit}
          disabled={answers[currentQuestion] === 0 || isSubmitting}
          className={`font-semibold transition-colors ${
            answers[currentQuestion] !== 0 && !isSubmitting
              ? 'bg-white text-teal-600 hover:bg-gray-100'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '⏳ Verwerken...' : '✅ Resultaat bekijken'}
        </Button>
      ) : (
        // On other questions, show next button
        <Button
          color='primary'
          size='lg'
          onClick={handleNext}
          disabled={answers[currentQuestion] === 0 || isSubmitting}
          className={`font-semibold transition-colors ${
            answers[currentQuestion] !== 0 && !isSubmitting
              ? 'bg-white text-teal-600 hover:bg-gray-100'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {answers[currentQuestion] === 0
            ? 'Antwoord vereist'
            : 'Volgende →'}
        </Button>
      )}
    </div>
  );
};
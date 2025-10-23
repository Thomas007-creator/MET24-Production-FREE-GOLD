import React from 'react';
import { useOnboardingWellness } from './k-OnboardingWellness.provider';

export const OnboardingWellnessProgress: React.FC = () => {
  const { progress, currentQuestion, questions } = useOnboardingWellness();

  return (
    <div className='mb-8'>
      <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4'>
        <div
          className='h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className='text-sm opacity-80 text-center'>
        Vraag {currentQuestion + 1} van {questions.length}
      </p>
    </div>
  );
};
import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingInterests } from './i-OnboardingInterests.provider';

export const OnboardingInterestsActions: React.FC = () => {
  const { selectedTags, isSubmitting, handleSubmit, handleSkip } = useOnboardingInterests();

  return (
    <div className='space-y-4'>
      <Button
        color='primary'
        size='lg'
        onClick={handleSubmit}
        disabled={selectedTags.length === 0 || isSubmitting}
        className='w-full max-w-md bg-white text-green-600 hover:bg-gray-100 transition-colors font-semibold'
      >
        {isSubmitting
          ? '⏳ Opslaan...'
          : `✅ Gereed (${selectedTags.length}/10)`}
      </Button>

      <Button
        color='primary'
        size='lg'
        onClick={handleSkip}
        className='w-full max-w-md bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors'
      >
        ⏭️ Overslaan
      </Button>
    </div>
  );
};
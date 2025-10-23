import React from 'react';
import { Chip } from '@nextui-org/react';
import { useOnboardingInterests } from './i-OnboardingInterests.provider';

export const OnboardingInterestsSelectedTags: React.FC = () => {
  const { selectedTags, handleTagRemove } = useOnboardingInterests();

  if (selectedTags.length === 0) return null;

  return (
    <div className='mb-8'>
      <h3 className='text-lg font-semibold mb-4'>
        Geselecteerde interesses ({selectedTags.length}/10)
      </h3>
      <div className='flex flex-wrap gap-2 justify-center'>
        {selectedTags.map((tag, index) => (
          <Chip
            key={index}
            color='primary'
            variant='solid'
            onClose={() => handleTagRemove(tag)}
            className='bg-white/20 backdrop-blur-xl border border-white/30 text-white'
          >
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { Chip } from '@nextui-org/react';
import { useOnboardingInterests } from './i-OnboardingInterests.provider';

export const OnboardingInterestsCloud: React.FC = () => {
  const { filteredTags, selectedTags, handleTagSelect } = useOnboardingInterests();

  return (
    <div className='mb-8'>
      <div className='flex flex-wrap gap-3 justify-center max-h-96 overflow-y-auto p-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl'>
        {filteredTags.map((tag, index) => (
          <Chip
            key={index}
            variant='bordered'
            onClick={() => handleTagSelect(tag)}
            className={`
              cursor-pointer transition-all duration-200 hover:scale-105
              bg-white/10 backdrop-blur-xl border border-white/30 text-white
              hover:bg-white/20 hover:border-white/50
              ${selectedTags.includes(tag) ? 'bg-white/30 border-white/60' : ''}
            `}
            style={{
              fontSize: `${Math.max(14, 16 - Math.floor(index / 10))}px`,
              opacity: selectedTags.includes(tag) ? 0.6 : 1,
            }}
          >
            {tag}
          </Chip>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { Textarea, Tooltip } from '@nextui-org/react';
import { Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextSituationSection: React.FC = () => {
  const { formData, handleInputChange } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Info className='w-5 h-5 text-blue-300' />
        <h3 className='text-lg font-semibold'>Situatie</h3>
        <Tooltip content='Beschrijf je huidige uitdaging of situatie. Dit helpt de AI om relevante adviezen te geven.'>
          <Info className='w-4 h-4 text-white/70 cursor-help' />
        </Tooltip>
      </div>
      <Textarea
        placeholder='Beschrijf je huidige situatie of uitdaging...'
        value={formData.situation}
        onChange={e => handleInputChange('situation', e.target.value)}
        maxLength={300}
        className='bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white placeholder-white/70'
        classNames={{
          input: 'text-white',
          inputWrapper: 'bg-transparent border-blue-300/30',
        }}
      />
      <p className='text-xs opacity-70 mt-2 text-right'>
        {formData.situation.length}/300 tekens
      </p>
    </div>
  );
};
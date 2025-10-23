import React from 'react';
import { Slider, Tooltip } from '@nextui-org/react';
import { Activity, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextStressSection: React.FC = () => {
  const { formData, handleInputChange } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Activity className='w-5 h-5 text-pink-300' />
        <h3 className='text-lg font-semibold'>Stressniveau</h3>
        <Tooltip content='Hoe gestrest voel je je op dit moment? Dit helpt de AI om stress-gerelateerde adviezen te geven.'>
          <Info className='w-4 h-4 text-white/70 cursor-help' />
        </Tooltip>
      </div>
      <div className='space-y-4'>
        <Slider
          size='lg'
          step={1}
          color='primary'
          showSteps={true}
          maxValue={10}
          minValue={0}
          value={formData.stressLevel}
          onChange={value => handleInputChange('stressLevel', Array.isArray(value) ? value[0] : value)}
          className='max-w-md'
          classNames={{
            track: 'bg-white/20',
            filler: 'bg-gradient-to-r from-green-400 to-red-500',
            thumb: 'bg-white border-white/30',
          }}
        />
        <div className='flex justify-between text-sm opacity-80'>
          <span>0 - Ontspannen</span>
          <span className='font-semibold'>{formData.stressLevel}/10</span>
          <span>10 - Overweldigd</span>
        </div>
      </div>
    </div>
  );
};
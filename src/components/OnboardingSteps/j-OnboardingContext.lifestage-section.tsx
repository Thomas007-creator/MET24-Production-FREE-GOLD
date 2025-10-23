import React from 'react';
import { Select, SelectItem, Tooltip } from '@nextui-org/react';
import { LifeBuoy, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextLifestageSection: React.FC = () => {
  const { formData, lifeStageOptions, handleInputChange } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <LifeBuoy className='w-5 h-5 text-cyan-300' />
        <h3 className='text-lg font-semibold'>Levensfase</h3>
        <Tooltip content='In welke levensfase ben je? Dit helpt de AI om leeftijdsgerelateerde adviezen te geven.'>
          <Info className='w-4 h-4 text-white/70 cursor-help' />
        </Tooltip>
      </div>
      <Select
        placeholder='Selecteer je levensfase'
        value={formData.lifeStage}
        onChange={e => handleInputChange('lifeStage', e.target.value)}
        className='bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white'
        classNames={{
          trigger: 'bg-transparent border-blue-300/30',
          value: 'text-white',
          listbox: 'bg-blue-500/10 backdrop-blur-xl border border-blue-300/30',
        }}
      >
        {lifeStageOptions.map(stage => (
          <SelectItem key={stage} value={stage} className='text-white'>
            {stage}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};
import React from 'react';
import { Chip, Tooltip } from '@nextui-org/react';
import { Users, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextPersonsSection: React.FC = () => {
  const { formData, involvedPersonOptions, handleInvolvedPersonToggle } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Users className='w-5 h-5 text-green-300' />
        <h3 className='text-lg font-semibold'>Betrokken personen</h3>
        <Tooltip content='Selecteer wie er betrokken zijn bij deze situatie. Dit helpt de AI om relatie-dynamieken te begrijpen.'>
          <Info className='w-4 h-4 text-white/70 cursor-help' />
        </Tooltip>
      </div>
      <div className='flex flex-wrap gap-2'>
        {involvedPersonOptions.map(person => (
          <Chip
            key={person}
            variant={
              formData.involvedPersons.includes(person)
                ? 'solid'
                : 'bordered'
            }
            onClick={() => handleInvolvedPersonToggle(person)}
            className={`
              cursor-pointer transition-all duration-200
              ${
                formData.involvedPersons.includes(person)
                  ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
                  : 'bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/20'
              }
            `}
          >
            {person}
          </Chip>
        ))}
      </div>
    </div>
  );
};
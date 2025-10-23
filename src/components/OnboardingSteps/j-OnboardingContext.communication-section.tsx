import React from 'react';
import { Chip, Textarea, Tooltip } from '@nextui-org/react';
import { Brain, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextCommunicationSection: React.FC = () => {
  const { formData, communicationStyleOptions, handleCommunicationStyleToggle, handleInputChange } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Brain className='w-5 h-5 text-purple-300' />
        <h3 className='text-lg font-semibold'>
          Specifieke communicatiestijl
        </h3>
        <Tooltip content='Heb je een specifieke communicatiestijl? Dit helpt de AI om gepaste adviezen te geven.'>
          <Info className='w-4 h-4 text-white/70 cursor-help' />
        </Tooltip>
      </div>
      <div className='flex flex-wrap gap-2 mb-4'>
        {communicationStyleOptions.map(style => (
          <Chip
            key={style}
            variant={
              formData.communicationStyles.includes(style)
                ? 'solid'
                : 'bordered'
            }
            onClick={() => handleCommunicationStyleToggle(style)}
            className={`
              cursor-pointer transition-all duration-200
              ${
                formData.communicationStyles.includes(style)
                  ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
                  : 'bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/20'
              }
            `}
          >
            {style}
          </Chip>
        ))}
      </div>
      {formData.communicationStyles.length > 0 && (
        <div className='mt-4'>
          <Textarea
            placeholder='Toelichting (optioneel)'
            value={formData.communicationExplanation}
            onChange={e =>
              handleInputChange(
                'communicationExplanation',
                e.target.value
              )
            }
            className='bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white placeholder-white/70'
            classNames={{
              input: 'text-white',
              inputWrapper: 'bg-transparent border-blue-300/30',
            }}
          />
        </div>
      )}
    </div>
  );
};
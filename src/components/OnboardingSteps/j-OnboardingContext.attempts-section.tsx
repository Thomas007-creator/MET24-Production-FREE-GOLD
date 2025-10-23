import React from 'react';
import { Textarea, Tooltip } from '@nextui-org/react';
import { Clock, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextAttemptsSection: React.FC = () => {
  const { formData, handleInputChange } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Clock className='w-5 h-5 text-orange-300' />
        <h3 className='text-lg font-semibold'>Eerdere pogingen</h3>
        <Tooltip content='Wat heb je al geprobeerd? Dit helpt de AI om nieuwe perspectieven te bieden.'>
          <Info className='w-4 h-4 text-white/70 cursor-help' />
        </Tooltip>
      </div>
      <Textarea
        placeholder='Wat heb je al geprobeerd?'
        value={formData.previousAttempts}
        onChange={e =>
          handleInputChange('previousAttempts', e.target.value)
        }
        maxLength={200}
        className='bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white placeholder-white/70'
        classNames={{
          input: 'text-white',
          inputWrapper: 'bg-transparent border-blue-300/30',
        }}
      />
      <p className='text-xs opacity-70 mt-2 text-right'>
        {formData.previousAttempts.length}/200 tekens
      </p>
    </div>
  );
};
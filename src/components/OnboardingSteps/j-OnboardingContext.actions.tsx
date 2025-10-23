import React from 'react';
import { Button, Tooltip } from '@nextui-org/react';
import { Send, SkipForward, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextActions: React.FC = () => {
  const { handleSubmit, handleSkip, isSubmitting } = useOnboardingContext();

  return (
    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-6'>
      <Tooltip content='Verstuur je context om gepersonaliseerde AI coaching te ontvangen'>
        <Button
          size='lg'
          color='primary'
          variant='solid'
          startContent={<Send className='w-4 h-4' />}
          onClick={handleSubmit}
          isLoading={isSubmitting}
          className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
        >
          {isSubmitting ? 'Verzenden...' : 'Context Versturen'}
        </Button>
      </Tooltip>

      <Tooltip content='Sla deze stap over en ga verder met de basis onboarding'>
        <Button
          size='lg'
          color='default'
          variant='ghost'
          startContent={<SkipForward className='w-4 h-4' />}
          onClick={handleSkip}
          disabled={isSubmitting}
          className='text-white/70 hover:text-white hover:bg-white/10 border border-white/20 rounded-full px-6 py-3 transition-all duration-300'
        >
          Overslaan
        </Button>
      </Tooltip>

      <div className='flex items-center gap-2 text-sm text-white/60'>
        <Info className='w-4 h-4' />
        <span>Alle velden zijn optioneel</span>
      </div>
    </div>
  );
};
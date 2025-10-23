import React from 'react';
import { Button } from '@nextui-org/react';
import { ArrowRight } from 'lucide-react';
import { useOnboardingComplete } from './n-OnboardingComplete.provider';

export const OnboardingCompleteButton: React.FC = () => {
  const { isSubmitting, isGeneratingActionPlan, handleComplete } = useOnboardingComplete();

  return (
    <div className='text-center'>
      <Button
        color='primary'
        size='lg'
        onClick={handleComplete}
        disabled={isSubmitting || isGeneratingActionPlan}
        className='bg-white text-purple-700 hover:bg-purple-200 font-semibold px-8'
      >
        {isSubmitting ? (
          <div className='flex items-center gap-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
            <span>Naar Dashboard...</span>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <span>Naar Dashboard</span>
            <ArrowRight className='w-4 h-4' />
          </div>
        )}
      </Button>
    </div>
  );
};
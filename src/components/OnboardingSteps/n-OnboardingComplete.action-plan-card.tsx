import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Target } from 'lucide-react';
import { useOnboardingComplete } from './n-OnboardingComplete.provider';

export const OnboardingCompleteActionPlanCard: React.FC = () => {
  const { isGeneratingActionPlan, actionPlan } = useOnboardingComplete();

  return (
    <Card className='bg-purple-500/10 backdrop-blur-xl border border-white/20 mb-6'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <Target className='w-6 h-6 text-green-300' />
          <h2 className='text-xl font-semibold text-white'>
            Jouw Eerste Stap - Persoonlijk Actieplan
          </h2>
        </div>
      </CardHeader>
      <CardBody>
        {isGeneratingActionPlan ? (
          <div className='flex items-center gap-3'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
            <p className='text-white'>
              AI genereert je persoonlijke actieplan...
            </p>
          </div>
        ) : actionPlan ? (
          <div className='space-y-4'>
            <div className='space-y-3'>
              {(actionPlan.steps as any[]).map((step: any, index: number) => (
                <div key={index} className='bg-purple-600/10 rounded-lg p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-sm font-semibold text-white'>
                      Stap {index + 1}:
                    </span>
                    <span className='text-sm text-white'>{(step as any).title}</span>
                    <span className='text-xs text-white/70'>
                      ({(step as any).estimatedTime})
                    </span>
                  </div>
                  <p className='text-sm text-white/90'>
                    {(step as any).description}
                  </p>
                </div>
              ))}
            </div>
            <div className='p-3 bg-purple-600/10 rounded-lg'>
              <p className='text-sm italic text-white/80'>
                {actionPlan.summary as string}
              </p>
            </div>
          </div>
        ) : (
          <p className='text-white/80'>Actieplan wordt voorbereid...</p>
        )}
      </CardBody>
    </Card>
  );
};
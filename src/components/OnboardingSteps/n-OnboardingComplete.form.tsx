import React from 'react';
import { CheckCircle } from 'lucide-react';
import { OnboardingCompleteSummaryCard } from './n-OnboardingComplete.summary-card';
import { OnboardingCompleteActionPlanCard } from './n-OnboardingComplete.action-plan-card';
import { OnboardingCompleteButton } from './n-OnboardingComplete.button';
import { useOnboardingComplete } from './n-OnboardingComplete.provider';

export const OnboardingCompleteForm: React.FC = () => {
  const { bmadColors } = useOnboardingComplete();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex items-center justify-center p-4`}>
      <div className='max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <CheckCircle className='w-12 h-12 text-emerald-400' />
            <h1 className={`text-4xl font-bold bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
              Klaar — Hier is jouw eerste stap
            </h1>
          </div>
          <p className='text-xl text-white/90'>
            Kort overzicht van wat we hebben opgeslagen (lokale weergave)
          </p>
        </div>

        <OnboardingCompleteSummaryCard />
        <OnboardingCompleteActionPlanCard />
        <OnboardingCompleteButton />

        {/* Info Text */}
        <div className='text-center mt-6'>
          <p className='text-sm text-white/60'>
            Je onboarding is compleet! Je kunt nu je persoonlijke dashboard
            verkennen.
          </p>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Brain, Sparkles } from 'lucide-react';
import { OnboardingContextProvider } from './j-OnboardingContext.provider';
import { OnboardingContextSituationSection } from './j-OnboardingContext.situation-section';
import { OnboardingContextPersonsSection } from './j-OnboardingContext.persons-section';
import { OnboardingContextOutcomeSection } from './j-OnboardingContext.outcome-section';
import { OnboardingContextAttemptsSection } from './j-OnboardingContext.attempts-section';
import { OnboardingContextEmotionSection } from './j-OnboardingContext.emotion-section';
import { OnboardingContextLifestageSection } from './j-OnboardingContext.lifestage-section';
import { OnboardingContextCommunicationSection } from './j-OnboardingContext.communication-section';
import { OnboardingContextStressSection } from './j-OnboardingContext.stress-section';
import { OnboardingContextActions } from './j-OnboardingContext.actions';

const OnboardingContextForm: React.FC = () => {
  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <Brain className='w-8 h-8 text-blue-400' />
          <Sparkles className='w-6 h-6 text-purple-400' />
        </div>
        <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent'>
          Persoonlijke Context
        </h2>
        <p className='text-white/70 max-w-2xl mx-auto'>
          Help de AI om je beter te begrijpen door wat context te delen over je huidige situatie.
          Dit helpt bij het geven van meer relevante en gepersonaliseerde coaching.
        </p>
      </div>

      {/* Form Sections */}
      <div className='space-y-4'>
        <OnboardingContextSituationSection />
        <OnboardingContextPersonsSection />
        <OnboardingContextOutcomeSection />
        <OnboardingContextAttemptsSection />
        <OnboardingContextEmotionSection />
        <OnboardingContextLifestageSection />
        <OnboardingContextCommunicationSection />
        <OnboardingContextStressSection />
      </div>

      {/* Actions */}
      <OnboardingContextActions />
    </div>
  );
};

export const OnboardingContext: React.FC = () => {
  const handleNext = (contextData: any) => {
    // Handle context data submission
    console.log('Context data:', contextData);
  };

  const handleSkip = () => {
    // Handle skip
    console.log('Skipped context step');
  };

  return (
    <OnboardingContextProvider onNext={handleNext} onSkip={handleSkip}>
      <Card className='bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl'>
        <CardBody className='p-8'>
          <OnboardingContextForm />
        </CardBody>
      </Card>
    </OnboardingContextProvider>
  );
};
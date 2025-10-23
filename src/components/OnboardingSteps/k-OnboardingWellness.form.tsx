import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { Heart, Sparkles } from 'lucide-react';
import { OnboardingWellnessProvider } from './k-OnboardingWellness.provider';
import { OnboardingWellnessProgress } from './k-OnboardingWellness.progress';
import { OnboardingWellnessQuestion } from './k-OnboardingWellness.question';
import { OnboardingWellnessNavigation } from './k-OnboardingWellness.navigation';

const OnboardingWellnessForm: React.FC = () => {
  return (
    <div className='max-w-2xl mx-auto space-y-6'>
      {/* Header */}
      <div className='text-center space-y-4'>
        <div className='flex items-center justify-center gap-3'>
          <Heart className='w-8 h-8 text-teal-400' />
          <Sparkles className='w-6 h-6 text-emerald-400' />
        </div>
        <h2 className='text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-600 bg-clip-text text-transparent'>
          Korte welzijnsscan
        </h2>
        <p className='text-white/70 max-w-xl mx-auto'>
          Deze vragen helpen je energie, slaap, coping en zingeving in kaart te brengen.
          Duurt ~3–4 minuten.
        </p>
      </div>

      {/* Database status indicator */}
      <div className='p-2 bg-gray-900/10 rounded-lg text-center'>
        <p className='text-xs'>
          Database: 🔗 WatermelonDB | Version: 2.0.0 | Status: ✅ Connected
        </p>
      </div>

      {/* Progress */}
      <OnboardingWellnessProgress />

      {/* Question */}
      <OnboardingWellnessQuestion />

      {/* Navigation */}
      <OnboardingWellnessNavigation />

      {/* Info Box */}
      <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
        <p className='text-sm opacity-80 leading-relaxed'>
          💡 <strong>Tip:</strong> Deze scan geeft je inzicht in je welzijn op
          verschillende gebieden. De resultaten helpen de AI-coach om
          gepersonaliseerde adviezen te geven.
        </p>
      </div>
    </div>
  );
};

export const OnboardingWellness: React.FC = () => {
  return (
    <OnboardingWellnessProvider
      onNext={(data) => {
        // This will be handled by the parent component
        console.log('Wellness data:', data);
      }}
      onSkip={() => {
        // This will be handled by the parent component
        console.log('Wellness skipped');
      }}
    >
      <Card className='bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 shadow-2xl'>
        <CardBody className='p-8'>
          <OnboardingWellnessForm />
        </CardBody>
      </Card>
    </OnboardingWellnessProvider>
  );
};
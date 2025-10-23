import React from 'react';
import { OnboardingInterestsSelectedTags } from './i-OnboardingInterests.selected-tags';
import { OnboardingInterestsSearchInput } from './i-OnboardingInterests.search-input';
import { OnboardingInterestsCloud } from './i-OnboardingInterests.cloud';
import { OnboardingInterestsActions } from './i-OnboardingInterests.actions';
import { useOnboardingInterests } from './i-OnboardingInterests.provider';

export const OnboardingInterestsForm: React.FC = () => {
  const { bmadColors } = useOnboardingInterests();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className='text-center max-w-4xl w-full'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
            Wat interesseert jou het meest?
          </h1>
          <p className='text-xl text-white/80 mb-6'>
            Kies tot 10 onderwerpen waar je graag advies over wilt.
          </p>
        </div>

        {/* Database status indicator */}
        <div className='mb-6 p-2 bg-black/20 backdrop-blur-lg rounded-lg border border-white/20'>
          <p className='text-xs text-white/60'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        <OnboardingInterestsSelectedTags />
        <OnboardingInterestsSearchInput />
        <OnboardingInterestsCloud />
        <OnboardingInterestsActions />

        {/* Info Box */}
        <div className='mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
          <p className='text-sm opacity-80 leading-relaxed'>
            💡 <strong>Tip:</strong> Deze interesses helpen de AI-coach om
            relevante adviezen en content voor jou te selecteren. Je kunt altijd
            later je interesses aanpassen in de instellingen.
          </p>
        </div>
      </div>
    </div>
  );
};
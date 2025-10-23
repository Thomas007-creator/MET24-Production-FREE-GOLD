import React from 'react';
import { Card, Progress } from '@nextui-org/react';
import { BMADColorSystem } from '../../lib/bmadColorSystem';
import { useOnboardingMbti } from './f-OnboardingMbti.provider';

interface OnboardingMbtiChoiceScreenProps {
  onBack: () => void;
}

export const OnboardingMbtiChoiceScreen: React.FC<OnboardingMbtiChoiceScreenProps> = ({
  onBack,
}) => {
  const { handleMbtiChoice, isAnalyzing } = useOnboardingMbti();

  // Get calm, introspective color scheme for MBTI discovery
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('introverted_calm');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className={`max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20`}>
        <h1 className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
          🧠 MBTI Persoonlijkheidstype
        </h1>

        <p className={`text-xl text-center mb-12 text-white/80`}>
          We willen je MBTI type kennen om je een gepersonaliseerde ervaring te bieden.
          Kies de methode die het beste bij je past:
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* AI Recommendation */}
          <Card
            className={`bg-white/15 backdrop-blur-xl p-6 cursor-pointer hover:scale-105 transition-transform border border-white/30`}
            isPressable
            onPress={() => handleMbtiChoice('ai')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>🤖</div>
              <h3 className='text-xl font-bold mb-3'>AI Aanbeveling</h3>
              <p className='text-sm opacity-80'>
                Laat AI je MBTI type voorspellen op basis van je gedrag
              </p>
              {isAnalyzing && (
                <div className='mt-3'>
                  <Progress size='sm' color='secondary' className='w-full' />
                  <p className='text-xs mt-1'>Analyseert...</p>
                </div>
              )}
            </div>
          </Card>

          {/* Known MBTI */}
          <Card
            className='bg-gradient-to-br from-blue-700/20 to-cyan-500/20 backdrop-blur-lg p-6 cursor-pointer hover:scale-105 transition-transform'
            isPressable
            onPress={() => handleMbtiChoice('known')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>📝</div>
              <h3 className='text-xl font-bold mb-3'>Ik weet mijn Type</h3>
              <p className='text-sm opacity-80'>
                Voer direct je 4-letter MBTI type in
              </p>
            </div>
          </Card>

          {/* Quick Test */}
          <Card
            className='bg-gradient-to-br from-green-700/20 to-emerald-500/20 backdrop-blur-lg p-6 cursor-pointer hover:scale-105 transition-transform'
            isPressable
            onPress={() => handleMbtiChoice('quick')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>⚡</div>
              <h3 className='text-xl font-bold mb-3'>Snelle Test</h3>
              <p className='text-sm opacity-80'>
                Doe een korte test van 10 vragen
              </p>
            </div>
          </Card>

          {/* Full Test */}
          <Card
            className='bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg p-6 cursor-pointer hover:scale-105 transition-transform'
            isPressable
            onPress={() => handleMbtiChoice('full')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>🔬</div>
              <h3 className='text-xl font-bold mb-3'>Volledige Test</h3>
              <p className='text-sm opacity-80'>
                Doe een uitgebreide test van 60+ vragen
              </p>
            </div>
          </Card>
        </div>

        <div className='text-center'>
          <button
            onClick={onBack}
            className='px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-lg border border-white/30 transition-colors text-white font-bold'
          >
            ← Terug
          </button>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-sm opacity-70'>
            💡 <strong>Tip:</strong> De AI aanbeveling is gebaseerd op je interactiepatronen
            en geeft je een goed startpunt voor je MBTI reis!
          </p>
        </div>
      </div>
    </div>
  );
};
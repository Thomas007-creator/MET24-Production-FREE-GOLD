import React from 'react';
import { Input, Button } from '@nextui-org/react';
import { useOnboardingMbti } from './f-OnboardingMbti.provider';

export const OnboardingMbtiExternalPaste: React.FC = () => {
  const {
    mbtiCode,
    setMbtiCode,
    errors,
    handleMbtiSubmit,
    setShowExternalPaste,
  } = useOnboardingMbti();

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          📋 Plak je MBTI Resultaat
        </h1>

        <div className='mb-6'>
          <Input
            label='MBTI Resultaat'
            placeholder='Plak hier je 4-letter resultaat (bijv. INTJ)'
            value={mbtiCode}
            onChange={(e) => setMbtiCode(e.target.value)}
            className='mb-4'
            errorMessage={errors.mbtiCode}
            isInvalid={!!errors.mbtiCode}
          />

          <div className='flex gap-4 mb-6'>
            <Button
              color='primary'
              onClick={() => handleMbtiSubmit('external')}
              className='flex-1'
              size='lg'
            >
              ✅ Bevestig Resultaat
            </Button>

            <Button
              color='default'
              onClick={() => setShowExternalPaste(false)}
              variant='bordered'
              className='flex-1'
              size='lg'
            >
              ← Terug
            </Button>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-sm opacity-80'>
            Heb je de test nog niet gedaan? Ga terug en kies &quot;Volledige Test&quot;
          </p>
        </div>
      </div>
    </div>
  );
};
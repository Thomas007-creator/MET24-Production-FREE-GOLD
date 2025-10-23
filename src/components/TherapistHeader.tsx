import React from 'react';
import { Button } from '@nextui-org/react';
import { ArrowLeft, Home } from 'lucide-react';
import { useTherapistPage } from './TherapistPage.provider';

export const TherapistHeader: React.FC = () => {
  const { mbtiType } = useTherapistPage();

  const handleBackToMain = () => {
    window.history.back();
  };

  const userName = 'Gebruiker'; // This would come from user data in a real implementation

  return (
    <div className='flex items-center justify-between mb-8'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>
          👨‍⚕️ Therapeut & Coach Ecosystem
        </h1>
        <p className='text-gray-300'>
          Welkom {userName}! Ontdek gepersonaliseerde therapie en coaching voor jouw {mbtiType} persoonlijkheidstype
        </p>
        {/* Ecosystem status would be shown here if available */}
      </div>
      <div className='flex gap-3'>
        <Button
          color='secondary'
          variant='bordered'
          startContent={<ArrowLeft />}
          onClick={handleBackToMain}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Terug
        </Button>
        <Button
          color='primary'
          variant='bordered'
          startContent={<Home />}
          onClick={() => window.location.href = '/'}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Hoofdmenu
        </Button>
      </div>
    </div>
  );
};
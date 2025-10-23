/**
 * BackToBasics Header Component
 *
 * Header section for Back to Basics page with navigation and MBTI overview
 *
 * @version 14.0.0
 */

import React from 'react';
import { Button } from '@nextui-org/react';
import { ArrowLeft, Home } from 'lucide-react';
import { useBackToBasics } from './BackToBasicsPage.provider';

interface BackToBasicsHeaderProps {
  onBackToMain: () => void;
  onHomeClick: () => void;
}

export const BackToBasicsHeader: React.FC<BackToBasicsHeaderProps> = ({
  onBackToMain,
  onHomeClick
}) => {
  const { userName, mbtiType } = useBackToBasics();

  return (
    <div className='p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              💪 Back to Basics - 9 Levensgebieden
            </h1>
            <p className='text-gray-300'>
              Welkom {userName}! Ontdek gepersonaliseerde content voor jouw {mbtiType} persoonlijkheidstype
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              color='secondary'
              variant='bordered'
              startContent={<ArrowLeft />}
              onClick={onBackToMain}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Terug
            </Button>
            <Button
              color='primary'
              variant='bordered'
              startContent={<Home />}
              onClick={onHomeClick}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Hoofdmenu
            </Button>
          </div>
        </div>

        {/* MBTI Overview */}
        <div className='glass rounded-xl p-6 mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-white mb-2'>
                🧠 Jouw {mbtiType} Persoonlijkheid
              </h2>
              <p className='text-gray-300'>
                Gepersonaliseerde levensgebied focus gebaseerd op je MBTI type
              </p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-purple-400'>{mbtiType}</div>
              <div className='text-sm text-gray-400'>Persoonlijkheidstype</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
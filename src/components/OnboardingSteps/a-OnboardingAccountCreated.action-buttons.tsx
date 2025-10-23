import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingAccountCreated } from './a-OnboardingAccountCreated.provider';

export const OnboardingAccountCreatedActionButtons: React.FC = () => {
  const { handleStart, handleIntro, handleLater } = useOnboardingAccountCreated();

  return (
    <div className="space-y-4 mb-8">
      <Button
        color="primary"
        size="lg"
        onClick={handleStart}
        className="w-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors"
      >
        🚀 Aan de slag
      </Button>

      <div className="backdrop-blur-xl border rounded-2xl p-1 shadow-lg" style={{ backgroundColor: 'rgba(214,127,99,0.2)', borderColor: 'rgba(214,127,99,0.3)', boxShadow: '0 4px 24px 0 rgba(214,127,99,0.10)' }}>
        <Button
          color="primary"
          size="lg"
          onClick={handleIntro}
          className="w-full backdrop-blur-lg text-white border-0 hover:scale-[1.02] transition-all duration-300 rounded-xl shadow-inner"
          style={{ backgroundColor: 'rgba(214,127,99,0.5)' }}
        >
          📋 Korte intro
        </Button>
      </div>

      <div className="backdrop-blur-xl border rounded-2xl p-1 shadow-lg" style={{ backgroundColor: 'rgba(214,127,99,0.2)', borderColor: 'rgba(214,127,99,0.3)', boxShadow: '0 4px 24px 0 rgba(214,127,99,0.10)' }}>
        <Button
          color="primary"
          size="lg"
          onClick={handleLater}
          className="w-full backdrop-blur-lg text-white border-0 hover:scale-[1.02] transition-all duration-300 rounded-xl shadow-inner"
          style={{ backgroundColor: 'rgba(214,127,99,0.5)' }}
        >
          ⏰ Later doen
        </Button>
      </div>
    </div>
  );
};
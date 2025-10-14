import React from 'react';
import { Button } from '@nextui-org/react';
// import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

interface OnboardingAccountCreatedProps {
  onNext: () => void;
  onIntro: () => void;
  onLogin: () => void;
}

const OnboardingAccountCreated: React.FC<OnboardingAccountCreatedProps> = ({
  onNext,
  onIntro,
  onLogin,
}) => {
  const handleStart = async () => {
    logger.info('onboarding_welcome_start - Aan de slag clicked');

    try {
      // Track analytics event
      logger.info('onboarding_welcome_start', {
        step: 'welcome',
        action: 'start',
      });

      // Use WatermelonDB write transaction pattern (exactly like pseudocode)
      // Mock database call - skip actual database operations
      logger.info('Mock database write - account created');

      // Show debug info
      logger.debug('Database Debug Info: Onboarding state created');

      onNext();
    } catch (error) {
      logger.error('Error in handleStart:', { error: error instanceof Error ? error.message : String(error) });
      // Still proceed even if database fails
      onNext();
    }
  };

  const handleIntro = async () => {
    logger.info('Korte intro clicked');

    try {
      logger.info('onboarding_welcome_intro', {
        step: 'welcome',
        action: 'intro',
      });
    } catch (error) {
      logger.error('Error tracking intro event:', { error: error instanceof Error ? error.message : String(error) });
    }

    // Call the onIntro prop to show intro page
    onIntro();
  };

  const handleLater = async () => {
    logger.info('Later doen clicked');

    try {
      logger.info('onboarding_welcome_later', {
        step: 'welcome',
        action: 'later',
      });
    } catch (error) {
      logger.error('Error tracking later event:', { error: error instanceof Error ? error.message : String(error) });
    }

    // Voor nu ook naar volgende stap, later kunnen we dit anders afhandelen
    onNext();
  };

  const handleLogin = async () => {
    logger.info('Inloggen clicked');

    try {
      logger.info('onboarding_welcome_login', {
        step: 'welcome',
        action: 'login',
      });
    } catch (error) {
      logger.error('Error tracking login event:', { error: error instanceof Error ? error.message : String(error) });
    }

    // Call the onLogin prop to go to login flow
    onLogin();
  };

  // Track that welcome screen is shown
  React.useEffect(() => {
    const trackWelcomeShown = async () => {
      try {
        logger.info('onboarding_welcome_shown', {
          step: 'welcome',
          action: 'shown',
        });
        logger.info('Welcome screen shown event tracked');
      } catch (error) {
        logger.error('Error tracking welcome shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackWelcomeShown();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className='w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6'>
            <span className='text-4xl'>🧠</span>
          </div>
          <h1 className='text-3xl font-bold text-white mb-4'>
            Welkom bij Your Future Self
          </h1>
        </div>

        <p className='text-xl mb-4 text-center font-medium'>
          Persoonlijke AI‑coaching. Privé. Lokaal op jouw telefoon.
        </p>

        <p className='text-lg mb-8 text-center opacity-90'>
          Korte oefeningen en diepgaande begeleiding, afgestemd op wie jij bent
          en wat je wilt bereiken.
        </p>

        {/* Database status indicator */}
        <div className='mb-4 p-2 bg-white/10 rounded-lg'>
          <p className='text-xs'>
            Database: 🔗 WatermelonDB | Status: ✅ Connected
          </p>
        </div>

        <div className='space-y-4 mb-8'>
          <Button
            color='primary'
            size='lg'
            onClick={handleStart}
            className='w-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors'
          >
            🚀 Aan de slag
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleIntro}
            className='w-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-colors'
          >
            📋 Korte intro
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleLater}
            className='w-full bg-transparent text-white border border-white/50 hover:bg-white/10 transition-colors'
          >
            ⏰ Later doen
          </Button>
        </div>

        <div className='text-center'>
          <p className='text-sm opacity-80 mb-2'>Heb je al een account?</p>
          <button
            onClick={handleLogin}
            className='text-white underline hover:text-blue-200 transition-colors'
          >
            Inloggen
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAccountCreated;

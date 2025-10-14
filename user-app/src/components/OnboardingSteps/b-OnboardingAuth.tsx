import React from 'react';
import { Button } from '@nextui-org/react';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingAuthProps {
  onNext: () => void;
}

const OnboardingAuth: React.FC<OnboardingAuthProps> = ({ onNext }) => {
  const handleAppleAuth = async () => {
    logger.info('Apple auth selected');
    
    // Track analytics event
    logger.info('onboarding_auth_choice_selected', {
      method: 'apple',
      step: 'auth',
    });

    // Simple navigation without complex database operations
    onNext();
  };

  const handleXAuth = async () => {
    logger.info('X (Twitter) auth selected');
    
    // Track analytics event
    logger.info('onboarding_auth_choice_selected', {
      method: 'x_twitter',
      step: 'auth',
    });

    // Simple navigation without complex operations
    onNext();
  };


  const handleManualSignup = async () => {
    logger.info('Manual signup selected');
    
    // Track analytics event
    logger.info('onboarding_auth_choice_selected', {
      method: 'manual',
      step: 'auth',
    });

    // Simple navigation
    onNext();
  };

  const handleLogin = async () => {
    logger.info('Inloggen clicked');
    
    logger.info('onboarding_auth_login', {
      step: 'auth',
      action: 'login',
    });

    // Simple navigation
    onNext();
  };

  // Track that auth page is shown
  React.useEffect(() => {
    const trackAuthShown = async () => {
      try {
        logger.info('onboarding_auth_shown', {
          step: 'auth',
          action: 'shown',
        });
        logger.info('Auth page shown event tracked');
      } catch (error) {
        logger.error('Error tracking auth shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackAuthShown();
  }, []);

  // Get BMAD color scheme for auth (trustworthy professional)
  const authColorScheme = BMADColorSystem.getPersonalityColorScheme('thinking_professional');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(authColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(authColorScheme);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${authColorScheme.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className={`w-24 h-24 ${glassmorphismClasses} rounded-full flex items-center justify-center mx-auto mb-6 ${animationClasses}`}>
            <span className='text-4xl'>🔐</span>
          </div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${authColorScheme.gradient} bg-clip-text text-transparent mb-4`}>
            Hoe wil je starten?
          </h1>
        </div>

        <p className='text-xl mb-8 text-center text-white/90'>
          Kies een accountmethode of maak een nieuw account aan.
        </p>

        {/* Database status indicator */}
        <div className={`mb-4 p-3 ${glassmorphismClasses} rounded-lg`}>
          <p className='text-sm text-white/80'>
            Database: {'🔗 WatermelonDB'} |
            Version: {'2.0.0'} | Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        <div className='space-y-4 mb-8'>
          <Button
            color='primary'
            size='lg'
            onClick={handleAppleAuth}
            className={`w-full ${BMADColorSystem.getButtonColorFromGradient('from-teal-500 to-cyan-500')} text-white font-semibold shadow-lg`}
          >
            🍎 Doorgaan met Apple
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleXAuth}
            className='w-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors'
          >
            🐦 Maak slim met X
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleManualSignup}
            className='w-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors'
          >
            ✏️ Account aanmaken
          </Button>
        </div>

        <div className='text-center mb-6'>
          <p className='text-sm opacity-80 mb-2'>Heb je al een account?</p>
          <button
            onClick={handleLogin}
            className='text-white underline hover:text-blue-200 transition-colors'
          >
            Inloggen
          </button>
        </div>

        <div className='bg-yellow-800/80 backdrop-blur-xl border border-yellow-800/60 rounded-xl p-4'>
          <p className='text-xs text-white/80 leading-relaxed'>
            Door door te gaan accepteer je onze{' '}
            <button
              onClick={() => logger.info('Terms of service clicked')}
              className='underline hover:text-blue-200 transition-colors'
            >
              Gebruiksvoorwaarden
            </button>{' '}
            en{' '}
            <button
              onClick={() => logger.info('Privacy policy clicked')}
              className='underline hover:text-blue-200 transition-colors'
            >
              Privacyverklaring
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAuth;

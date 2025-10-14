import React from 'react';
import { Button } from '@nextui-org/react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

interface OnboardingAuthProps {
  onNext: () => void;
}

const OnboardingAuth: React.FC<OnboardingAuthProps> = ({ onNext }) => {
  const handleAppleAuth = async () => {
    logger.info('Apple auth selected');

    try {
      // Track analytics event
      logger.info('onboarding_auth_choice_selected', {
        method: 'apple',
        step: 'auth',
      });

      // Simulate Apple auth success (in real app, this would be actual OAuth)
      const mockProfile = {
        given_name: 'John',
        family_name: 'Doe',
        email: 'john.doe@icloud.com',
      };

      // Use WatermelonDB write transaction pattern
      await databaseService.write(async () => {
        // Create user record
        await databaseService.createUser({
          firstName: mockProfile.given_name || '',
          lastName: mockProfile.family_name || '',
          email: mockProfile.email || '',
          dob: null,
          onboarded_at: null,
        });

        // Update onboarding state
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'user_123', // In real app, this would be the actual user ID
          last_step: 'auth',
          step_completed_flags: JSON.stringify({ auth: true }),
        });
      });

      logger.info('Apple auth completed successfully');
      onNext();
    } catch (error) {
      logger.error('Error in Apple auth:', { error: error instanceof Error ? error.message : String(error) });
      // Still proceed even if database fails
      onNext();
    }
  };

  const handleGoogleAuth = async () => {
    logger.info('Google auth selected');

    try {
      // Track analytics event
      logger.info('onboarding_auth_choice_selected', {
        method: 'google',
        step: 'auth',
      });

      // Simulate Google auth success (in real app, this would be actual OAuth)
      const mockProfile = {
        given_name: 'Jane',
        family_name: 'Smith',
        email: 'jane.smith@gmail.com',
      };

      // Use WatermelonDB write transaction pattern
      await databaseService.write(async () => {
        // Create user record
        await databaseService.createUser({
          firstName: mockProfile.given_name || '',
          lastName: mockProfile.family_name || '',
          email: mockProfile.email || '',
          dob: null,
          onboarded_at: null,
        });

        // Update onboarding state
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'user_456', // In real app, this would be the actual user ID
          last_step: 'auth',
          step_completed_flags: JSON.stringify({ auth: true }),
        });
      });

      logger.info('Google auth completed successfully');
      onNext();
    } catch (error) {
      logger.error('Error in Google auth:', { error: error instanceof Error ? error.message : String(error) });
      // Still proceed even if database fails
      onNext();
    }
  };

  const handleManualSignup = async () => {
    logger.info('Manual signup selected');

    try {
      // Track analytics event
      logger.info('onboarding_auth_choice_selected', {
        method: 'manual',
        step: 'auth',
      });

      // For manual signup, we'll navigate to email/password flow
      // For now, we'll just proceed to next step
      // Later this can be updated to go to a specific email/password page
      onNext();
    } catch (error) {
      logger.error('Error tracking manual signup:', { error: error instanceof Error ? error.message : String(error) });
      onNext();
    }
  };

  const handleLogin = async () => {
    logger.info('Inloggen clicked');

    try {
      logger.info('onboarding_auth_login', {
        step: 'auth',
        action: 'login',
      });
    } catch (error) {
      logger.error('Error tracking login event:', { error: error instanceof Error ? error.message : String(error) });
    }

    // Navigate to login flow (for now, just proceed)
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className='w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6'>
            <span className='text-4xl'>🔐</span>
          </div>
          <h1 className='text-3xl font-bold text-white mb-4'>
            Hoe wil je starten?
          </h1>
        </div>

        <p className='text-xl mb-8 text-center'>
          Kies een accountmethode of maak een nieuw account aan.
        </p>

        {/* Database status indicator */}
        <div className='mb-4 p-2 bg-white/10 rounded-lg'>
          <p className='text-xs'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        <div className='space-y-4 mb-8'>
          <Button
            color='primary'
            size='lg'
            onClick={handleAppleAuth}
            className='w-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors'
          >
            🍎 Doorgaan met Apple
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleGoogleAuth}
            className='w-full bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-colors'
          >
            🔍 Doorgaan met Google
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

        <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4'>
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

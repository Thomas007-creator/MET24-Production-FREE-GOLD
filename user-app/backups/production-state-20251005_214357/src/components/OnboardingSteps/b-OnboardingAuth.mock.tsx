/**
 * Mock Onboarding Auth Component for Testing
 * 
 * This simulates the X OAuth onboarding flow without real API calls
 * Perfect for testing before deployment
 */

import React from 'react';
import { Button } from '@nextui-org/react';
import { logger } from '../../utils/logger';
import { connectToGrokMock, saveXAuthToDatabaseMock } from '../../config/xOAuthConfig.mock';

interface OnboardingAuthMockProps {
  onNext: () => void;
}

const OnboardingAuthMock: React.FC<OnboardingAuthMockProps> = ({ onNext }) => {
  const handleXAuthMock = async () => {
    logger.info('Mock X (Twitter) auth selected');

    try {
      // Track analytics event
      logger.info('onboarding_auth_choice_selected', {
        method: 'x_twitter_mock',
        step: 'auth',
      });

      console.log('🧪 MOCK: Starting X OAuth flow...');
      
      // Mock X OAuth implementation
      const accessToken = await connectToGrokMock();

      // Mock user profile
      const mockProfile = {
        given_name: 'X',
        family_name: 'User',
        email: 'user@x.com',
        x_username: 'x_user',
      };

      const userId = 'user_x_mock_123';

      console.log('🧪 MOCK: Creating user profile...');
      console.log('  - Name:', mockProfile.given_name, mockProfile.family_name);
      console.log('  - Email:', mockProfile.email);
      console.log('  - X Username:', mockProfile.x_username);

      // Simulate database operations
      console.log('🧪 MOCK: Saving to WatermelonDB...');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ MOCK: User created in database');

      // Save X OAuth data to database
      if (accessToken) {
        await saveXAuthToDatabaseMock(userId, accessToken, accessToken);
      }

      logger.info('Mock X auth completed successfully');
      console.log('🎉 MOCK: X OAuth onboarding completed!');
      onNext();
    } catch (error) {
      logger.error('Error in Mock X auth:', { error: error instanceof Error ? error.message : String(error) });
      console.error('❌ MOCK: X OAuth failed:', error);
      // Still proceed for testing
      onNext();
    }
  };

  const handleAppleAuthMock = async () => {
    console.log('🧪 MOCK: Apple auth selected');
    logger.info('Mock Apple auth selected');
    onNext();
  };

  const handleManualSignupMock = async () => {
    console.log('🧪 MOCK: Manual signup selected');
    logger.info('Mock Manual signup selected');
    onNext();
  };

  const handleLoginMock = async () => {
    console.log('🧪 MOCK: Login selected');
    logger.info('Mock Login selected');
    onNext();
  };

  // Track that mock auth page is shown
  React.useEffect(() => {
    const trackMockAuthShown = async () => {
      try {
        logger.info('onboarding_auth_shown', {
          step: 'auth_mock',
          action: 'shown',
        });
        console.log('🧪 MOCK: Auth page shown event tracked');
      } catch (error) {
        logger.error('Error tracking mock auth shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackMockAuthShown();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className='w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6'>
            <span className='text-4xl'>🧪</span>
          </div>
          <h1 className='text-3xl font-bold text-white mb-4'>
            Mock Test - Hoe wil je starten?
          </h1>
        </div>

        <p className='text-xl mb-8 text-center'>
          🧪 Mock test voor X OAuth integratie
        </p>

        {/* Mock status indicator */}
        <div className='mb-4 p-2 bg-white/10 rounded-lg'>
          <p className='text-xs'>
            🧪 Mock Mode | Database: {'🔗 WatermelonDB'} | Version: {'2.0.0'} | Status: {'✅ Connected'}
          </p>
        </div>

        <div className='space-y-4 mb-8'>
          <Button
            color='primary'
            size='lg'
            onClick={handleAppleAuthMock}
            className='w-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors'
          >
            🍎 Mock Apple Auth
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleXAuthMock}
            className='w-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors'
          >
            🐦 Mock X OAuth Test
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleManualSignupMock}
            className='w-full bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-colors'
          >
            ✏️ Mock Account Aanmaken
          </Button>
        </div>

        <div className='text-center mb-6'>
          <p className='text-sm opacity-80 mb-2'>Mock test mode</p>
          <button
            onClick={handleLoginMock}
            className='text-white underline hover:text-blue-200 transition-colors'
          >
            Mock Inloggen
          </button>
        </div>

        <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4'>
          <p className='text-xs text-white/80 leading-relaxed'>
            🧪 <strong>Mock Test Mode:</strong> Dit simuleert de X OAuth flow zonder echte API calls.
            Perfect voor testing voordat we deployen naar DigitalOcean.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAuthMock;

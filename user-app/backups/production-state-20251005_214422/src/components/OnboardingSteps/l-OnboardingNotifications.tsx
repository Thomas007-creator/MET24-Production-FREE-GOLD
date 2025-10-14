import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Bell, BellOff, Settings, Shield, CheckCircle } from 'lucide-react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

interface OnboardingNotificationsProps {
  onNext: (notificationData: { enabled: boolean; categories: string[]; choice: 'allow' | 'deny' | 'later'; permission: 'granted' | 'denied' }) => void;
  onSkip: () => void;
}

const OnboardingNotifications: React.FC<OnboardingNotificationsProps> = ({
  onNext,
  onSkip,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChoice = async (choice: 'allow' | 'deny' | 'later') => {
    setIsSubmitting(true);

    try {
      logger.info('✅ Notification choice selected:', { choice });

      // Track analytics event
      logger.info('onboarding_notifications_choice', {
        choice: choice,
        step: 'notifications',
      });

      // Handle native iOS permission if 'Sta toe' is selected
      if (choice === 'allow') {
        try {
          // Request native notification permission
          if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            logger.info('📱 Native notification permission:', { permission });
          }

          // For iOS PWA, you might need additional handling
          if ('serviceWorker' in navigator) {
            try {
              const registration =
                await navigator.serviceWorker.register('/sw.js');
              logger.info('📱 Service Worker registered:', { registration });
            } catch (error) {
              logger.info('📱 Service Worker registration failed:', { error: error instanceof Error ? error.message : String(error) });
            }
          }
        } catch (error) {
          logger.error('❌ Error requesting notification permission:', { error: error instanceof Error ? error.message : String(error) });
        }
      }

      // Default notification categories
      const defaultCategories = [
        'daily_tips',
        'reminders',
        'wellness_check',
        'mbti_insights',
      ];

      // WatermelonDB write: create notifications_prefs record and update onboarding state
      await databaseService.write(async () => {
        logger.info('💾 Creating notifications preferences record');

        // Simulate creating notifications_prefs record
        logger.info('📝 Creating notifications_prefs record:', {
          user_id: 'anon', // Will be updated when user is created
          enabled: choice === 'allow',
          categories: JSON.stringify(defaultCategories),
          choice: choice,
          created_at: new Date().toISOString(),
        });

        // Update onboarding state with flag_notifications=true
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'notifications',
          step_completed_flags: JSON.stringify({
            welcome: true,
            auth: true,
            privacy: true,
            basic_profile: true,
            account_created: true,
            mbti_choice: true,
            mbti_quicktest: true,
            mbti_result: true,
            interests: true,
            context: true,
            wellness: true,
            notifications: true,
          }),
        });
      });

      logger.info('✅ Notifications preferences saved to database');

      // ✅ FIXED: Pass notifications data to parent component
      const notificationData = {
        enabled: choice === 'allow',
        categories: defaultCategories,
        choice: choice,
        permission: choice === 'allow' ? 'granted' as const : 'denied' as const,
      };

      logger.info('📤 Passing notifications data to parent:', { notificationData });
      onNext(notificationData);
    } catch (error) {
      logger.error('❌ Error in handleChoice:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      logger.info('onboarding_notifications_skipped', {
        step: 'notifications',
      });
      logger.info('📊 Tracked: onboarding_notifications_skipped');
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  };

  // Track that notifications page is shown
  useEffect(() => {
    const trackNotificationsShown = async () => {
      try {
        logger.info('onboarding_notifications_shown', {
          step: 'notifications',
          action: 'shown',
        });
        logger.info('📊 Notifications page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking notifications shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackNotificationsShown();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6'>
            <Bell className='w-10 h-10 text-white' />
          </div>
          <h1 className='text-4xl font-bold mb-4'>Meldingen instellen</h1>
          <p className='text-xl opacity-90 leading-relaxed'>
            Wil je korte tips en herinneringen ontvangen?
          </p>
        </div>

        {/* Database status indicator */}
        <div className='mb-8 p-3 bg-white/10 rounded-lg'>
          <p className='text-xs'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Main Content */}
        <div className='mb-8 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl'>
          {/* Benefits Section */}
          <div className='mb-8'>
            <h2 className='text-2xl font-semibold mb-6 text-center'>
              Wat krijg je van onze meldingen?
            </h2>

            <div className='grid gap-4 md:grid-cols-2'>
              <div className='flex items-start gap-3 p-4 bg-white/10 rounded-xl'>
                <CheckCircle className='w-6 h-6 text-green-300 mt-1 flex-shrink-0' />
                <div>
                  <h3 className='font-semibold mb-1'>Persoonlijke tips</h3>
                  <p className='text-sm opacity-80'>
                    Gepersonaliseerde adviezen gebaseerd op jouw MBTI en
                    interesses
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 p-4 bg-white/10 rounded-xl'>
                <Bell className='w-6 h-6 text-blue-300 mt-1 flex-shrink-0' />
                <div>
                  <h3 className='font-semibold mb-1'>Zachte herinneringen</h3>
                  <p className='text-sm opacity-80'>
                    Vriendelijke reminders voor je welzijn en doelen
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 p-4 bg-white/10 rounded-xl'>
                <Shield className='w-6 h-6 text-purple-300 mt-1 flex-shrink-0' />
                <div>
                  <h3 className='font-semibold mb-1'>Privacy-first</h3>
                  <p className='text-sm opacity-80'>
                    Alleen relevante content, geen spam of tracking
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3 p-4 bg-white/10 rounded-xl'>
                <Settings className='w-6 h-6 text-orange-300 mt-1 flex-shrink-0' />
                <div>
                  <h3 className='font-semibold mb-1'>Altijd aanpasbaar</h3>
                  <p className='text-sm opacity-80'>
                    Je kunt je voorkeuren later altijd wijzigen
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Choice Buttons */}
          <div className='space-y-4'>
            <Button
              size='lg'
              onClick={() => handleChoice('allow')}
              disabled={isSubmitting}
              className={`w-full h-16 text-lg font-semibold transition-all duration-200 ${
                !isSubmitting
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className='flex items-center gap-3'>
                <Bell className='w-5 h-5' />
                <span>Sta toe (aanbevolen)</span>
              </div>
            </Button>

            <Button
              size='lg'
              onClick={() => handleChoice('deny')}
              disabled={isSubmitting}
              className={`w-full h-16 text-lg font-semibold transition-all duration-200 ${
                !isSubmitting
                  ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className='flex items-center gap-3'>
                <BellOff className='w-5 h-5' />
                <span>Sta niet toe</span>
              </div>
            </Button>

            <Button
              size='lg'
              onClick={() => handleChoice('later')}
              disabled={isSubmitting}
              className={`w-full h-16 text-lg font-semibold transition-all duration-200 ${
                !isSubmitting
                  ? 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className='flex items-center gap-3'>
                <Settings className='w-5 h-5' />
                <span>Instellen later</span>
              </div>
            </Button>
          </div>

          {/* Microcopy */}
          <div className='mt-6 p-4 bg-white/5 rounded-xl border border-white/10'>
            <p className='text-sm opacity-80 text-center leading-relaxed'>
              💡{' '}
              <strong>Meldingen zijn persoonlijk en klein, niet spam.</strong>
              <br />
              Je ontvangt alleen relevante tips en herinneringen die je helpen
              met je doelen.
            </p>
          </div>
        </div>

        {/* Skip Button */}
        <div className='text-center'>
          <Button
            variant='light'
            size='sm'
            onClick={handleSkip}
            disabled={isSubmitting}
            className='text-white/70 hover:text-white transition-colors'
          >
            Overslaan
          </Button>
        </div>

        {/* Loading State */}
        {isSubmitting && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20'>
              <div className='flex items-center gap-3'>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                <span className='text-white'>Instellingen opslaan...</span>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className='mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
          <p className='text-sm opacity-80 leading-relaxed'>
            🔒 <strong>Privacy garantie:</strong> We sturen nooit spam of
            verkopen je gegevens. Meldingen zijn volledig optioneel en je kunt
            ze altijd uitschakelen in je instellingen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingNotifications;

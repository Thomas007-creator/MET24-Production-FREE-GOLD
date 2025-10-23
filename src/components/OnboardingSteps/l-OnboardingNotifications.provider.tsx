import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

interface OnboardingNotificationsContextType {
  // State
  isSubmitting: boolean;

  // Actions
  handleChoice: (choice: 'allow' | 'deny' | 'later') => Promise<void>;
  handleSkip: () => Promise<void>;
}

const OnboardingNotificationsContext = createContext<OnboardingNotificationsContextType | undefined>(undefined);

interface OnboardingNotificationsProviderProps {
  children: ReactNode;
  onNext: (notificationData: { enabled: boolean; categories: string[]; choice: 'allow' | 'deny' | 'later'; permission: 'granted' | 'denied' }) => void;
  onSkip: () => void;
}

export const OnboardingNotificationsProvider: React.FC<OnboardingNotificationsProviderProps> = ({
  children,
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

  const value: OnboardingNotificationsContextType = {
    isSubmitting,
    handleChoice,
    handleSkip,
  };

  return (
    <OnboardingNotificationsContext.Provider value={value}>
      {children}
    </OnboardingNotificationsContext.Provider>
  );
};

export const useOnboardingNotifications = (): OnboardingNotificationsContextType => {
  const context = useContext(OnboardingNotificationsContext);
  if (context === undefined) {
    throw new Error('useOnboardingNotifications must be used within an OnboardingNotificationsProvider');
  }
  return context;
};
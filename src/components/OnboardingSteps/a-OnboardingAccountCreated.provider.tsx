import React, { createContext, useContext, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingAccountCreatedContextType {
  // Computed
  authColorScheme: any;
  glassmorphismClasses: string;
  animationClasses: string;

  // Actions
  handleStart: () => Promise<void>;
  handleIntro: () => Promise<void>;
  handleLater: () => Promise<void>;
  handleLogin: () => Promise<void>;
}

const OnboardingAccountCreatedContext = createContext<OnboardingAccountCreatedContextType | undefined>(undefined);

interface OnboardingAccountCreatedProviderProps {
  children: ReactNode;
  onNext: () => void;
  onIntro: () => void;
  onLogin: () => void;
}

export const OnboardingAccountCreatedProvider: React.FC<OnboardingAccountCreatedProviderProps> = ({
  children,
  onNext,
  onIntro,
  onLogin,
}) => {
  // Get BMAD color scheme for account created (trustworthy professional)
  const authColorScheme = BMADColorSystem.getPersonalityColorScheme('thinking_professional');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(authColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(authColorScheme);

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

  const value: OnboardingAccountCreatedContextType = {
    authColorScheme,
    glassmorphismClasses,
    animationClasses,
    handleStart,
    handleIntro,
    handleLater,
    handleLogin,
  };

  return (
    <OnboardingAccountCreatedContext.Provider value={value}>
      {children}
    </OnboardingAccountCreatedContext.Provider>
  );
};

export const useOnboardingAccountCreated = (): OnboardingAccountCreatedContextType => {
  const context = useContext(OnboardingAccountCreatedContext);
  if (context === undefined) {
    throw new Error('useOnboardingAccountCreated must be used within an OnboardingAccountCreatedProvider');
  }
  return context;
};
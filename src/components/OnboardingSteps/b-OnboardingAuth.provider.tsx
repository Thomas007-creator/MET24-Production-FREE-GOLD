import React, { createContext, useContext, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingAuthContextType {
  // Computed
  authColorScheme: any;
  glassmorphismClasses: string;
  animationClasses: string;

  // Actions
  handleAppleAuth: () => Promise<void>;
  handleXAuth: () => Promise<void>;
  handleManualSignup: () => Promise<void>;
  handleLogin: () => Promise<void>;
}

const OnboardingAuthContext = createContext<OnboardingAuthContextType | undefined>(undefined);

interface OnboardingAuthProviderProps {
  children: ReactNode;
  onNext: () => void;
}

export const OnboardingAuthProvider: React.FC<OnboardingAuthProviderProps> = ({
  children,
  onNext,
}) => {
  // Get BMAD color scheme for auth (trustworthy professional)
  const authColorScheme = BMADColorSystem.getPersonalityColorScheme('thinking_professional');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(authColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(authColorScheme);

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

  const value: OnboardingAuthContextType = {
    authColorScheme,
    glassmorphismClasses,
    animationClasses,
    handleAppleAuth,
    handleXAuth,
    handleManualSignup,
    handleLogin,
  };

  return (
    <OnboardingAuthContext.Provider value={value}>
      {children}
    </OnboardingAuthContext.Provider>
  );
};

export const useOnboardingAuth = (): OnboardingAuthContextType => {
  const context = useContext(OnboardingAuthContext);
  if (context === undefined) {
    throw new Error('useOnboardingAuth must be used within an OnboardingAuthProvider');
  }
  return context;
};
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingPrivacyContextType {
  // State
  isChecked: boolean;
  showInfo: boolean;

  // Computed
  privacyColorScheme: any;
  glassmorphismClasses: string;
  animationClasses: string;

  // Actions
  setIsChecked: (checked: boolean) => void;
  handleAccept: () => Promise<void>;
  handleMoreInfo: () => void;
}

const OnboardingPrivacyContext = createContext<OnboardingPrivacyContextType | undefined>(undefined);

interface OnboardingPrivacyProviderProps {
  children: ReactNode;
  onAccept: () => void;
  onMoreInfo: () => void;
}

export const OnboardingPrivacyProvider: React.FC<OnboardingPrivacyProviderProps> = ({
  children,
  onAccept,
  onMoreInfo,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Get BMAD color scheme for privacy (trustworthy professional)
  const privacyColorScheme = BMADColorSystem.getPersonalityColorScheme('thinking_professional');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(privacyColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(privacyColorScheme);

  const handleAccept = async () => {
    if (!isChecked) {
      logger.warn('Checkbox must be checked to proceed');
      return;
    }

    console.log('Privacy accepted - saving to database');

    try {
      // Update onboarding state with privacy consent
      await databaseService.createOrUpdateOnboardingState({
        user_id: 'anon',
        last_step: 'privacy',
        step_completed_flags: JSON.stringify({
          welcome: true,
          auth: true,
          privacy: true,
        }),
        consent_time: new Date().toISOString(),
      });

      console.log('Privacy consent saved to database - proceeding to next step');
      onAccept();
    } catch (error) {
      console.error('Database save failed, but continuing:', error);
      onAccept();
    }
  };

  const handleMoreInfo = () => {
    setShowInfo(!showInfo);
    onMoreInfo(); // Call the prop function, which currently just logs
  };

  // Track that privacy page is shown
  React.useEffect(() => {
    const trackPrivacyShown = async () => {
      try {
        logger.info('onboarding_privacy_shown', {
          step: 'privacy',
          action: 'shown',
        });
        logger.info('Privacy page shown event tracked');
      } catch (error) {
        logger.error('Error tracking privacy shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackPrivacyShown();
  }, []);

  const value: OnboardingPrivacyContextType = {
    isChecked,
    showInfo,
    privacyColorScheme,
    glassmorphismClasses,
    animationClasses,
    setIsChecked,
    handleAccept,
    handleMoreInfo,
  };

  return (
    <OnboardingPrivacyContext.Provider value={value}>
      {children}
    </OnboardingPrivacyContext.Provider>
  );
};

export const useOnboardingPrivacy = (): OnboardingPrivacyContextType => {
  const context = useContext(OnboardingPrivacyContext);
  if (context === undefined) {
    throw new Error('useOnboardingPrivacy must be used within an OnboardingPrivacyProvider');
  }
  return context;
};
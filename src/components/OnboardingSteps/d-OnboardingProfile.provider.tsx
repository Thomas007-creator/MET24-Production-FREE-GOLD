import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingProfileContextType {
  // State
  name: string;
  dob: string;
  errors: { name?: string; age?: string };
  isSubmitting: boolean;

  // Computed
  isValid: boolean;
  profileColorScheme: any;
  glassmorphismClasses: string;
  animationClasses: string;

  // Actions
  setName: (name: string) => void;
  setDob: (dob: string) => void;
  handleSubmit: () => Promise<void>;
  handleSkip: () => void;

  // Helpers
  calculateAge: (birthDate: string) => number;
  validateForm: () => boolean;
}

const OnboardingProfileContext = createContext<OnboardingProfileContextType | undefined>(undefined);

interface OnboardingProfileProviderProps {
  children: ReactNode;
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingProfileProvider: React.FC<OnboardingProfileProviderProps> = ({
  children,
  onNext,
  onSkip,
}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get BMAD color scheme for profile (creative expression)
  const profileColorScheme = BMADColorSystem.getFunctionalColorScheme('profile');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(profileColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(profileColorScheme);

  // Validation
  const isValid = name.trim().length >= 1 && !errors.name && !errors.age;

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; age?: string } = {};

    // Validate name (>= 1 character)
    if (!name.trim() || name.trim().length < 1) {
      newErrors.name = 'Naam is verplicht (minimaal 1 karakter)';
    }

    // Validate age (>= 16 years)
    if (dob) {
      const age = calculateAge(dob);
      if (age < 16) {
        newErrors.age = 'Je moet minimaal 16 jaar oud zijn';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      logger.info('❌ Form validation failed:', errors);
      return;
    }

    setIsSubmitting(true);
    logger.info('✅ Profile form submitted');

    try {
      const age = dob ? calculateAge(dob) : 0;

      // Track analytics event
      logger.info('onboarding_profile_basic_submitted', {
        age,
        has_name: !!name.trim(),
        has_dob: !!dob,
      });

      // Update onboarding state with profile data
      await databaseService.createOrUpdateOnboardingState({
        user_id: 'anon',
        last_step: 'basic_profile',
        user_data: JSON.stringify({
          name: name.trim(),
          dob: dob ? new Date(dob).toISOString() : null,
        }),
        step_completed_flags: JSON.stringify({
          welcome: true,
          auth: true,
          privacy: true,
          basic_profile: true,
        }),
      });

      console.log('Profile data saved to database:', { name: name.trim(), dob });
      logger.info('✅ Profile data saved to database');
      onNext();
    } catch (error) {
      logger.error('❌ Error in profile submission:', { error: error instanceof Error ? error.message : String(error) });
      // Still proceed even if database fails
      onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    logger.info('⏭️ Profile step skipped');

    try {
      logger.info('onboarding_profile_skipped', {
        step: 'basic_profile',
        action: 'skip',
      });
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }

    onSkip();
  };

  // Track that profile page is shown
  useEffect(() => {
    const trackProfileShown = async () => {
      try {
        logger.info('onboarding_profile_shown', {
          step: 'basic_profile',
          action: 'shown',
        });
        logger.info('📊 Profile page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking profile shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackProfileShown();
  }, []);

  const value: OnboardingProfileContextType = {
    name,
    dob,
    errors,
    isSubmitting,
    isValid,
    profileColorScheme,
    glassmorphismClasses,
    animationClasses,
    setName,
    setDob,
    handleSubmit,
    handleSkip,
    calculateAge,
    validateForm,
  };

  return (
    <OnboardingProfileContext.Provider value={value}>
      {children}
    </OnboardingProfileContext.Provider>
  );
};

export const useOnboardingProfile = (): OnboardingProfileContextType => {
  const context = useContext(OnboardingProfileContext);
  if (context === undefined) {
    throw new Error('useOnboardingProfile must be used within an OnboardingProfileProvider');
  }
  return context;
};
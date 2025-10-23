import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

interface OnboardingVerificationContextType {
  // State
  verificationCode: string;
  isSubmitting: boolean;
  isResending: boolean;
  resendTimer: number;
  verificationMethod: 'email' | 'sms';
  userEmail: string;

  // Computed
  maskedEmail: string;
  maskedPhone: string;
  isCodeValid: boolean;
  canResend: boolean;

  // Actions
  setVerificationCode: (code: string) => void;
  setVerificationMethod: (method: 'email' | 'sms') => void;
  handleSubmit: () => Promise<void>;
  handleResendCode: () => Promise<void>;
  handleSkip: () => Promise<void>;
  handleSkipVerification: () => Promise<void>;
}

const OnboardingVerificationContext = createContext<OnboardingVerificationContextType | undefined>(undefined);

export const useOnboardingVerification = () => {
  const context = useContext(OnboardingVerificationContext);
  if (!context) {
    throw new Error('useOnboardingVerification must be used within OnboardingVerificationProvider');
  }
  return context;
};

interface OnboardingVerificationProviderProps {
  children: React.ReactNode;
  onNext: () => void;
  onSkip: () => void;
}

export const OnboardingVerificationProvider: React.FC<OnboardingVerificationProviderProps> = ({
  children,
  onNext,
  onSkip,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'sms'>('email');
  const [userEmail] = useState('test@example.com'); // Mock email

  // Mock verification code for demo
  const mockVerificationCode = '123456';

  // Timer for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Auto-fill verification code for demo purposes
  useEffect(() => {
    // Simulate auto-fill after 2 seconds
    const timer = setTimeout(() => {
      setVerificationCode(mockVerificationCode);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Track that verification page is shown
  useEffect(() => {
    const trackVerificationShown = async () => {
      try {
        logger.info('onboarding_verification_shown', {
          step: 'verification',
          action: 'shown'
        });
        logger.info('Verification page shown event tracked');
      } catch (error) {
        logger.error('Error tracking verification shown event', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackVerificationShown();
  }, []);

  const handleCodeChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length <= 6) {
      setVerificationCode(digitsOnly);
    }
  };

  const handleSubmit = async () => {
    if (verificationCode.length !== 6) {
      logger.warn('Verification code must be 6 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info('Submitting verification code', { code: verificationCode });

      // Simulate validation with auth service
      const isValid = verificationCode === mockVerificationCode;

      if (!isValid) {
        logger.warn('Invalid verification code');
        setIsSubmitting(false);
        return;
      }

      // Track analytics event
      logger.info('onboarding_verification_completed', {
        method: verificationMethod,
        step: 'verification'
      });

      // WatermelonDB write: update user verification status and onboarding state
      await databaseService.write(async () => {
        logger.info('Updating user verification status');

        // Simulate updating user verification status
        logger.info('User verification update', {
          user_id: 'anon',
          verified: true,
          verification_method: verificationMethod,
          verified_at: new Date().toISOString()
        });

        // Update onboarding state with onboarded_at timestamp
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'verification',
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
            verification: true
          })
        });

        // Simulate setting users.verified = true
        logger.info('Setting users.verified = true');
        logger.info('Setting onboarding_states.onboarded_at = now');
      });

      logger.info('Verification completed successfully');
      onNext();
    } catch (error) {
      logger.error('Error in handleSubmit', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendTimer(60); // 60 second cooldown

    try {
      logger.info('Resending verification code via', { method: verificationMethod });

      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000));

      logger.info('Verification code resent successfully');
    } catch (error) {
      logger.error('Error resending code', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsResending(false);
    }
  };

  const handleSkip = async () => {
    try {
      logger.info('onboarding_verification_skipped', {
        step: 'verification'
      });
      logger.info('Tracked: onboarding_verification_skipped');
    } catch (error) {
      logger.error('Error tracking skip event', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  };

  // Computed values
  const maskedEmail = userEmail.replace(/(.{1,2}).*@/, '$1***@');
  const maskedPhone = '+31 6 *** *** 12';
  const isCodeValid = verificationCode.length === 6;
  const canResend = resendTimer === 0 && !isResending;

  const value: OnboardingVerificationContextType = {
    // State
    verificationCode,
    isSubmitting,
    isResending,
    resendTimer,
    verificationMethod,
    userEmail,

    // Computed
    maskedEmail,
    maskedPhone,
    isCodeValid,
    canResend,

    // Actions
    setVerificationCode: handleCodeChange,
    setVerificationMethod,
    handleSubmit,
    handleResendCode,
    handleSkip,
    handleSkipVerification: handleSkip,
  };

  return (
    <OnboardingVerificationContext.Provider value={value}>
      {children}
    </OnboardingVerificationContext.Provider>
  );
};
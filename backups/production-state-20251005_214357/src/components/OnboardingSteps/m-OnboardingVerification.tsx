import React, { useState, useEffect } from 'react';
import { Button, Input, Chip } from '@nextui-org/react';
import { Mail, Smartphone, Shield, CheckCircle, RefreshCw } from 'lucide-react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

interface OnboardingVerificationProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingVerification: React.FC<OnboardingVerificationProps> = ({
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

  const handleSwitchToSMS = () => {
    setVerificationMethod('sms');
    setVerificationCode('');
          logger.info('Switched to SMS verification');
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

  // Mask email for display
  const maskedEmail = userEmail.replace(/(.{1,2}).*@/, '$1***@');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col justify-center items-center text-white font-sans p-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Bevestig je account
          </h1>
          <p className="text-xl opacity-90 leading-relaxed">
            We hebben een 6‑cijferige code naar je {verificationMethod === 'email' ? 'e‑mail' : 'SMS'} gestuurd
          </p>
          <p className="text-lg opacity-80 mt-2">
            {verificationMethod === 'email' ? maskedEmail : '+31 6 *** *** 12'}
          </p>
        </div>

        {/* Database status indicator */}
        <div className="mb-8 p-3 bg-white/10 rounded-lg">
          <p className="text-xs">
            Database: {'🔗 WatermelonDB'} 
            | Version: {'2.0.0'}
            | Status: {'✅ Connected'}
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-8 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
          {/* Verification Method Toggle */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center">
              <Chip
                variant={verificationMethod === 'email' ? "solid" : "bordered"}
                onClick={() => setVerificationMethod('email')}
                className={`cursor-pointer transition-all duration-200 ${
                  verificationMethod === 'email'
                    ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
                    : 'bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                E-mail
              </Chip>
              <Chip
                variant={verificationMethod === 'sms' ? "solid" : "bordered"}
                onClick={handleSwitchToSMS}
                className={`cursor-pointer transition-all duration-200 ${
                  verificationMethod === 'sms'
                    ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
                    : 'bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20'
                }`}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                SMS
              </Chip>
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="mb-6">
            <label htmlFor="verification-code" className="block text-sm font-medium mb-3">
              6‑cijferige verificatiecode
            </label>
            <Input
              id="verification-code"
              type="text"
              value={verificationCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
              classNames={{
                input: "text-center text-2xl font-mono tracking-widest bg-white/10 border-white/30 text-white placeholder-white/50",
                inputWrapper: "bg-white/10 backdrop-blur-xl border border-white/30"
              }}
              autoComplete="one-time-code"
            />
            <p className="text-sm opacity-70 mt-2 text-center">
              Code wordt automatisch ingevuld
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={verificationCode.length !== 6 || isSubmitting}
              className={`w-full h-16 text-lg font-semibold transition-all duration-200 ${
                verificationCode.length === 6 && !isSubmitting
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <span>{isSubmitting ? 'Verifiëren...' : 'Verstuur code'}</span>
              </div>
            </Button>

            <Button
              size="lg"
              onClick={handleResendCode}
              disabled={resendTimer > 0 || isResending}
              className={`w-full h-14 text-base font-medium transition-all duration-200 ${
                resendTimer === 0 && !isResending
                  ? 'bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {isResending 
                    ? 'Versturen...' 
                    : resendTimer > 0 
                      ? `Code opnieuw verzenden (${resendTimer}s)` 
                      : 'Code opnieuw verzenden'
                  }
                </span>
              </div>
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-sm opacity-80 text-center leading-relaxed">
              🔒 <strong>Veiligheid:</strong> Deze code is 15 minuten geldig en kan alleen door jou worden gebruikt.
            </p>
          </div>
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <Button
            variant="light"
            size="sm"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="text-white/70 hover:text-white transition-colors"
          >
            Overslaan
          </Button>
        </div>

        {/* Loading State */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-white">Account verifiëren...</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <p className="text-sm opacity-80 leading-relaxed">
            💡 <strong>Demo:</strong> De verificatiecode wordt automatisch ingevuld (123456). 
            In productie wordt deze code naar je e-mail/SMS gestuurd.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingVerification;

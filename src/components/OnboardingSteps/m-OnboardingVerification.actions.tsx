import React from 'react';
import { Button } from '@nextui-org/react';
import { Check, RotateCcw, SkipForward } from 'lucide-react';
import { useOnboardingVerification } from './m-OnboardingVerification.provider';

export const OnboardingVerificationActions: React.FC = () => {
  const {
    verificationCode,
    isSubmitting,
    canResend,
    resendTimer,
    handleSubmit,
    handleResendCode,
    handleSkipVerification
  } = useOnboardingVerification();

  const isCodeComplete = verificationCode.length === 6;

  return (
    <div className="space-y-4">
      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        isDisabled={!isCodeComplete || isSubmitting}
        isLoading={isSubmitting}
        className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
          isCodeComplete && !isSubmitting
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
        }`}
      >
        {!isSubmitting && <Check className="w-5 h-5 mr-2" />}
        {isSubmitting ? 'Verificatie...' : 'Verifiëren'}
      </Button>

      {/* Resend Code Button */}
      <Button
        onClick={handleResendCode}
        isDisabled={!canResend || isSubmitting}
        variant="ghost"
        className={`w-full h-10 text-sm transition-all duration-200 ${
          canResend && !isSubmitting
            ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
            : 'text-gray-500 cursor-not-allowed'
        }`}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        {canResend ? 'Nieuwe code versturen' : `Nieuwe code over ${resendTimer}s`}
      </Button>

      {/* Skip Verification Button */}
      <Button
        onClick={handleSkipVerification}
        isDisabled={isSubmitting}
        variant="ghost"
        className={`w-full h-10 text-sm transition-all duration-200 ${
          !isSubmitting
            ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10'
            : 'text-gray-500 cursor-not-allowed'
        }`}
      >
        <SkipForward className="w-4 h-4 mr-2" />
        Overslaan (niet aanbevolen)
      </Button>
    </div>
  );
};
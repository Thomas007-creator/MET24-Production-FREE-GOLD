import React from 'react';
import { Button } from '@nextui-org/react';
import { useOnboardingAccountSecurity } from './e-OnboardingAccountSecurity.provider';

export const OnboardingAccountSecurityActionButtons: React.FC = () => {
  const { isSubmitting, errors, handleSubmit } = useOnboardingAccountSecurity();

  return (
    <div className="space-y-4">
      {errors.general && (
        <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          {errors.general}
        </div>
      )}

      <Button
        onClick={handleSubmit}
        isLoading={isSubmitting}
        disabled={isSubmitting}
        size="lg"
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? 'Account aanmaken...' : 'Account aanmaken'}
      </Button>
    </div>
  );
};
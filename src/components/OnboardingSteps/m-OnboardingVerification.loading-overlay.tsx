import React from 'react';
import { Spinner } from '@nextui-org/react';
import { Shield } from 'lucide-react';
import { useOnboardingVerification } from './m-OnboardingVerification.provider';

export const OnboardingVerificationLoadingOverlay: React.FC = () => {
  const { isSubmitting, verificationMethod } = useOnboardingVerification();

  if (!isSubmitting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-sm mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <Spinner size="lg" color="white" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          Account verificatie
        </h3>

        <p className="text-white/70 text-sm mb-4">
          Bezig met verifiëren van je {verificationMethod === 'email' ? 'e-mailadres' : 'telefoonnummer'}...
        </p>

        <div className="w-full bg-white/20 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Card } from '@nextui-org/react';
import { OnboardingVerificationMethodSelector } from './m-OnboardingVerification.method-selector';
import { OnboardingVerificationCodeInput } from './m-OnboardingVerification.code-input';
import { OnboardingVerificationActions } from './m-OnboardingVerification.actions';
import { OnboardingVerificationLoadingOverlay } from './m-OnboardingVerification.loading-overlay';

export const OnboardingVerificationForm: React.FC = () => {
  return (
    <>
      <Card className="max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Account Verificatie
            </h2>
            <p className="text-white/70">
              Beveilig je account met verificatie
            </p>
          </div>

          <OnboardingVerificationMethodSelector />
          <OnboardingVerificationCodeInput />
          <OnboardingVerificationActions />
        </div>
      </Card>

      <OnboardingVerificationLoadingOverlay />
    </>
  );
};
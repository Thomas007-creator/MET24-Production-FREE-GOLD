import React from 'react';
import { Button } from '@nextui-org/react';
import { Shield } from 'lucide-react';
import { OnboardingVerificationProvider } from './m-OnboardingVerification.provider';
import { OnboardingVerificationForm } from './m-OnboardingVerification.form';

interface OnboardingVerificationProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingVerification: React.FC<OnboardingVerificationProps> = ({
  onNext,
  onSkip,
}) => {
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
            We hebben een 6‑cijferige code naar je account gestuurd
          </p>
        </div>

        {/* Database status indicator */}
        <div className="mb-8 p-3 bg-gray-800/10 rounded-lg">
          <p className="text-xs">
            Database: {'🔗 WatermelonDB'}
            | Version: {'2.0.0'}
            | Status: {'✅ Connected'}
          </p>
        </div>

        <OnboardingVerificationProvider onNext={onNext} onSkip={onSkip}>
          <OnboardingVerificationForm />
        </OnboardingVerificationProvider>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <Button
            variant="light"
            size="sm"
            onClick={onSkip}
            className="text-white/70 hover:text-white transition-colors"
          >
            Overslaan
          </Button>
        </div>

        {/* Demo Info */}
        <div className="mt-8 bg-blue-900/10 backdrop-blur-xl border border-blue/20 rounded-2xl p-6">
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

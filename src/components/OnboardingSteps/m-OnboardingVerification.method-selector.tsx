import React from 'react';
import { Chip } from '@nextui-org/react';
import { Mail, Smartphone } from 'lucide-react';
import { useOnboardingVerification } from './m-OnboardingVerification.provider';

export const OnboardingVerificationMethodSelector: React.FC = () => {
  const { verificationMethod, setVerificationMethod } = useOnboardingVerification();

  const handleSwitchToSMS = () => {
    setVerificationMethod('sms');
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2 justify-center">
        <Chip
          variant={verificationMethod === 'email' ? "solid" : "bordered"}
          onClick={() => setVerificationMethod('email')}
          className={`cursor-pointer transition-all duration-200 ${
            verificationMethod === 'email'
              ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
              : 'bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/20'
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
              : 'bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white hover:bg-blue-500/20'
          }`}
        >
          <Smartphone className="w-4 h-4 mr-2" />
          SMS
        </Chip>
      </div>
    </div>
  );
};
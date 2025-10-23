import React from 'react';
import { Shield } from 'lucide-react';
import { OnboardingAccountSecurityFormFields } from './e-OnboardingAccountSecurity.form-fields';
import { OnboardingAccountSecurityPasswordStrength } from './e-OnboardingAccountSecurity.password-strength';
import { OnboardingAccountSecurityRememberMe } from './e-OnboardingAccountSecurity.remember-me';
import { OnboardingAccountSecurityActionButtons } from './e-OnboardingAccountSecurity.action-buttons';
import { OnboardingAccountSecuritySecurityNote } from './e-OnboardingAccountSecurity.security-note';

export const OnboardingAccountSecurityForm: React.FC = () => {
  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Shield className="text-blue-400" size={32} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Account beveiliging
          </h2>
          <p className="text-white/70">
            Stel je account veilig in met een sterk wachtwoord
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        <OnboardingAccountSecurityFormFields />
        <OnboardingAccountSecurityPasswordStrength />
        <OnboardingAccountSecurityRememberMe />
        <OnboardingAccountSecurityActionButtons />
        <OnboardingAccountSecuritySecurityNote />
      </div>
    </div>
  );
};
import React from 'react';
import { Checkbox } from '@nextui-org/react';
import { useOnboardingAccountSecurity } from './e-OnboardingAccountSecurity.provider';

export const OnboardingAccountSecurityRememberMe: React.FC = () => {
  const { rememberMe, setRememberMe } = useOnboardingAccountSecurity();

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        isSelected={rememberMe}
        onValueChange={setRememberMe}
        size="md"
        classNames={{
          wrapper: "bg-white/10 border-white/20 hover:bg-white/15",
          icon: "text-white",
        }}
      />
      <span className="text-sm text-white/80">
        Onthoud mijn inloggegevens
      </span>
    </div>
  );
};
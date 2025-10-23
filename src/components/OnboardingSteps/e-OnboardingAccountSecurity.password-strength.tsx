import React from 'react';
import { Progress } from '@nextui-org/react';
import { useOnboardingAccountSecurity } from './e-OnboardingAccountSecurity.provider';

export const OnboardingAccountSecurityPasswordStrength: React.FC = () => {
  const { password, passwordStrength } = useOnboardingAccountSecurity();

  if (!password) return null;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStrengthText = (strength: string) => {
    switch (strength) {
      case 'weak': return 'Zwak';
      case 'medium': return 'Gemiddeld';
      case 'strong': return 'Sterk';
      default: return 'Onbekend';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/80">Wachtwoord sterkte</span>
        <span className={`text-sm font-medium ${getStrengthColor(passwordStrength.strength).replace('bg-', 'text-')}`}>
          {getStrengthText(passwordStrength.strength)}
        </span>
      </div>

      <Progress
        value={(passwordStrength.score / 5) * 100}
        size="sm"
        classNames={{
          track: "bg-white/20",
          indicator: getStrengthColor(passwordStrength.strength),
        }}
      />

      <div className="text-xs text-white/60 space-y-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-white/20'}`} />
          <span>Minimaal 8 karakters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-white/20'}`} />
          <span>Minimaal 1 hoofdletter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(password) ? 'bg-green-500' : 'bg-white/20'}`} />
          <span>Minimaal 1 kleine letter</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-white/20'}`} />
          <span>Minimaal 1 cijfer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-white/20'}`} />
          <span>Minimaal 1 speciaal karakter</span>
        </div>
      </div>
    </div>
  );
};
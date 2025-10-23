import React from 'react';
import { Input } from '@nextui-org/react';
import { Eye, EyeOff } from 'lucide-react';
import { useOnboardingAccountSecurity } from './e-OnboardingAccountSecurity.provider';

export const OnboardingAccountSecurityFormFields: React.FC = () => {
  const {
    email,
    password,
    showPassword,
    errors,
    setEmail,
    setPassword,
    setShowPassword,
  } = useOnboardingAccountSecurity();

  return (
    <div className="space-y-4">
      <Input
        type="email"
        label="E-mail adres"
        placeholder="jouw@email.nl"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isInvalid={!!errors.email}
        errorMessage={errors.email}
        size="lg"
        variant="bordered"
        classNames={{
          input: "text-white",
          label: "text-white",
          inputWrapper: "bg-white/10 border-white/20 hover:bg-white/15 focus-within:bg-white/15",
        }}
      />

      <Input
        type={showPassword ? "text" : "password"}
        label="Wachtwoord"
        placeholder="Minimaal 8 karakters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isInvalid={!!errors.password}
        errorMessage={errors.password}
        size="lg"
        variant="bordered"
        endContent={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
        classNames={{
          input: "text-white",
          label: "text-white",
          inputWrapper: "bg-white/10 border-white/20 hover:bg-white/15 focus-within:bg-white/15",
        }}
      />
    </div>
  );
};
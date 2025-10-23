import React, { useRef, useEffect } from 'react';
import { Input } from '@nextui-org/react';
import { useOnboardingVerification } from './m-OnboardingVerification.provider';

export const OnboardingVerificationCodeInput: React.FC = () => {
  const { verificationCode, setVerificationCode, isSubmitting } = useOnboardingVerification();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCodeChange = (value: string) => {
    // Only allow numeric characters and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && verificationCode.length === 6) {
      e.preventDefault();
      // Trigger submit through context
      const submitEvent = new CustomEvent('verification-submit');
      window.dispatchEvent(submitEvent);
    }
  };

  return (
    <div className="mb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Verificatiecode invoeren
        </h3>
        <p className="text-white/70 text-sm">
          Voer de 6-cijferige code in die je hebt ontvangen
        </p>
      </div>

      <div className="flex justify-center">
        <Input
          ref={inputRef}
          value={verificationCode}
          onValueChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          placeholder="000000"
          maxLength={6}
          isDisabled={isSubmitting}
          className="w-48"
          classNames={{
            input: [
              "text-center text-2xl font-mono tracking-widest",
              "bg-white/10 backdrop-blur-xl border border-white/20",
              "text-white placeholder:text-white/50",
              "focus:bg-white/20 focus:border-white/40",
              "transition-all duration-200"
            ].join(" "),
            inputWrapper: [
              "bg-white/5 backdrop-blur-xl border border-white/20",
              "hover:bg-white/10 hover:border-white/30",
              "focus-within:bg-white/10 focus-within:border-white/40",
              "transition-all duration-200"
            ].join(" ")
          }}
        />
      </div>

      <div className="text-center mt-2">
        <p className="text-white/60 text-xs">
          {verificationCode.length}/6 cijfers
        </p>
      </div>
    </div>
  );
};
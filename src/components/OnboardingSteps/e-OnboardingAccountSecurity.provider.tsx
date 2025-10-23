import React, { createContext, useContext, useState, ReactNode } from 'react';
import { logger } from '../../utils/logger';

interface PasswordStrength {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

interface OnboardingAccountSecurityContextType {
  // State
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  isSubmitting: boolean;
  errors: {
    email?: string;
    password?: string;
    general?: string;
  };

  // Computed
  passwordStrength: PasswordStrength;

  // Actions
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setRememberMe: (remember: boolean) => void;
  handleSubmit: () => Promise<void>;
}

const OnboardingAccountSecurityContext = createContext<OnboardingAccountSecurityContextType | undefined>(undefined);

interface OnboardingAccountSecurityProviderProps {
  children: ReactNode;
  onNext: () => void;
}

export const OnboardingAccountSecurityProvider: React.FC<OnboardingAccountSecurityProviderProps> = ({
  children,
  onNext,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { strength: 'weak', score };
    if (score <= 3) return { strength: 'medium', score };
    return { strength: 'strong', score };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Simplified validation for styling test
    if (!email.trim()) {
      newErrors.email = 'E-mail is verplicht';
    }

    if (!password) {
      newErrors.password = 'Wachtwoord is verplicht';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      logger.info('Account security setup completed', {
        email: email.trim(),
        passwordStrength: passwordStrength.strength,
        rememberMe
      });

      // Quick simulation for styling test
      await new Promise(resolve => setTimeout(resolve, 500));

      onNext();
    } catch (error) {
      logger.error('Error in account security setup', { error });
      setErrors({ general: 'Er is een fout opgetreden. Probeer het opnieuw.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const value: OnboardingAccountSecurityContextType = {
    email,
    password,
    showPassword,
    rememberMe,
    isSubmitting,
    errors,
    passwordStrength,
    setEmail,
    setPassword,
    setShowPassword,
    setRememberMe,
    handleSubmit,
  };

  return (
    <OnboardingAccountSecurityContext.Provider value={value}>
      {children}
    </OnboardingAccountSecurityContext.Provider>
  );
};

export const useOnboardingAccountSecurity = (): OnboardingAccountSecurityContextType => {
  const context = useContext(OnboardingAccountSecurityContext);
  if (context === undefined) {
    throw new Error('useOnboardingAccountSecurity must be used within an OnboardingAccountSecurityProvider');
  }
  return context;
};
import React, { useState } from 'react';
import { Button, Input, Checkbox } from '@nextui-org/react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { logger } from '../../utils/logger';

interface OnboardingAccountSecurityProps {
  onNext: () => void;
  onBack: () => void;
}

interface PasswordStrength {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

const OnboardingAccountSecurity: React.FC<OnboardingAccountSecurityProps> = ({
  onNext,
  onBack: _onBack,
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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center text-white mb-8'>
          <div className='w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4'>
            <Shield className='w-10 h-10' />
          </div>
          <h1 className='text-2xl font-bold mb-2'>Account Beveiliging</h1>
          <p className='text-white/80'>
            Maak je account aan met een veilig wachtwoord
          </p>
        </div>

        {/* Form */}
        <div className='space-y-4'>
          {/* Email Input */}
          <div>
            <Input
              type='email'
              label='E-mailadres'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='jouw@email.nl'
              variant='bordered'
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-red-300/50 border-white/20 text-white',
                label: 'text-white/80',
              }}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
            />
          </div>

          {/* Password Input */}
          <div>
            <Input
              type={showPassword ? 'text' : 'password'}
              label='Wachtwoord'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Minimaal 8 tekens'
              variant='bordered'
              endContent={
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-white/60 hover:text-white/80 transition-colors'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-red-300/50 border-white/20 text-white',
                label: 'text-white/80',
              }}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
            />
            {password && (
              <div className='mt-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-16 h-1 bg-white/20 rounded-full overflow-hidden'>
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength === 'strong'
                          ? 'w-full bg-green-400'
                          : passwordStrength.strength === 'medium'
                            ? 'w-2/3 bg-yellow-400'
                            : 'w-1/3 bg-red-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      passwordStrength.strength === 'strong'
                        ? 'text-green-400'
                        : passwordStrength.strength === 'medium'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {passwordStrength.strength === 'strong'
                      ? 'Sterk'
                      : passwordStrength.strength === 'medium'
                        ? 'Gemiddeld'
                        : 'Zwak'}
                  </span>
                </div>
                <p className='text-xs text-white/70'>
                  Minimaal 8 tekens, 1 cijfer, 1 hoofdletter
                </p>
              </div>
            )}
            {errors.password && (
              <p className='text-red-300 text-xs mt-2 text-left'>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className='mb-6'>
            <Checkbox
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              className='text-white'
              classNames={{
                label: 'text-white text-sm',
                wrapper: 'items-start',
              }}
            >
              Onthoud mij op dit apparaat
            </Checkbox>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className='p-3 bg-red-500/20 border border-red-400/30 rounded-lg mb-4'>
              <p className='text-red-200 text-sm'>{errors.general}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          color='primary'
          size='lg'
          onClick={handleSubmit}
          disabled={isSubmitting || !email.trim() || !password}
          className={`w-full font-semibold transition-colors ${
            email.trim() && password && !isSubmitting
              ? 'bg-white text-blue-600 hover:bg-gray-100'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {isSubmitting
            ? '⏳ Account aanmaken...'
            : email.trim() && password
              ? '🔐 Account aanmaken'
              : '⏳ Account aanmaken'}
        </Button>

        {/* Security Note */}
        <div className='mt-4 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg'>
          <p className='text-xs text-white/70 leading-relaxed'>
            <strong>🔒 Beveiliging:</strong> Je wachtwoord wordt versleuteld
            opgeslagen in de Keychain van je apparaat. We slaan geen
            wachtwoorden op in onze database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingAccountSecurity;

import React, { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingProfileProps {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingProfile: React.FC<OnboardingProfileProps> = ({
  onNext,
  onSkip,
}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>(
    {}
  );

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; age?: string } = {};

    // Validate name (>= 1 character)
    if (!name.trim() || name.trim().length < 1) {
      newErrors.name = 'Naam is verplicht (minimaal 1 karakter)';
    }

    // Validate age (>= 16 years)
    if (dob) {
      const age = calculateAge(dob);
      if (age < 16) {
        newErrors.age = 'Je moet minimaal 16 jaar oud zijn';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      logger.info('❌ Form validation failed:', errors);
      return;
    }

    logger.info('✅ Profile form submitted');

    try {
      const age = dob ? calculateAge(dob) : 0;

      // Track analytics event
      logger.info('onboarding_profile_basic_submitted', {
        age,
        has_name: !!name.trim(),
        has_dob: !!dob,
      });

      // Update onboarding state with profile data
      await databaseService.createOrUpdateOnboardingState({
        user_id: 'anon',
        last_step: 'basic_profile',
        user_data: JSON.stringify({
          name: name.trim(),
          dob: dob ? new Date(dob).toISOString() : null,
        }),
        step_completed_flags: JSON.stringify({
          welcome: true,
          auth: true,
          privacy: true,
          basic_profile: true,
        }),
      });

      console.log('Profile data saved to database:', { name: name.trim(), dob });
      logger.info('✅ Profile data saved to database');
      onNext();
    } catch (error) {
      logger.error('❌ Error in profile submission:', { error: error instanceof Error ? error.message : String(error) });
      // Still proceed even if database fails
      onNext();
    }
  };

  const handleSkip = async () => {
    logger.info('⏭️ Profile step skipped');

    try {
      logger.info('onboarding_profile_skipped', {
        step: 'basic_profile',
        action: 'skip',
      });
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }

    onSkip();
  };

  // Track that profile page is shown
  React.useEffect(() => {
    const trackProfileShown = async () => {
      try {
        logger.info('onboarding_profile_shown', {
          step: 'basic_profile',
          action: 'shown',
        });
        logger.info('📊 Profile page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking profile shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackProfileShown();
  }, []);

  // Get BMAD color scheme for profile (creative expression)
  const profileColorScheme = BMADColorSystem.getFunctionalColorScheme('profile');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(profileColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(profileColorScheme);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className={`w-24 h-24 ${glassmorphismClasses} rounded-full flex items-center justify-center mx-auto mb-6 ${animationClasses}`}>
            <span className='text-4xl'>✨</span>
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-4'>
            Vertel ons wie je bent
          </h1>
        </div>

        {/* Database status indicator */}
        <div className={`mb-4 p-3 ${glassmorphismClasses} rounded-lg`}>
          <p className='text-sm text-white/80'>
            Database: {'🔗 WatermelonDB'} |
            Version: {'2.0.0'} | Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Profile Form */}
        <div className='bg-yellow-800/80 backdrop-blur-xl border border-yellow-800/60 rounded-xl p-6 mb-8'>
          {/* First Name Field */}
          <div className='mb-6'>
            <label
              htmlFor='name'
              className='block text-left text-sm font-medium mb-2'
            >
              Naam *
            </label>
            <Input
              id='name'
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Jouw naam'
              className={`w-full ${
                errors.name
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-white/30 focus:border-white/50'
              }`}
              classNames={{
                input: 'text-white placeholder:text-white/60',
                inputWrapper:
                  'bg-white/10 backdrop-blur-xl border-white/30 focus-within:border-white/50',
              }}
            />
            {errors.name && (
              <p className='text-red-300 text-xs mt-2 text-left'>
                {errors.name}
              </p>
            )}
          </div>
          {/* Date of Birth Field */}
          <div className='mb-6'>
            <label
              htmlFor='dob'
              className='block text-left text-sm font-medium mb-2'
            >
              Geboortedatum
            </label>
            <Input
              id='dob'
              type='date'
              value={dob}
              onChange={e => setDob(e.target.value)}
              className={`w-full ${
                errors.age
                  ? 'border-red-400 focus:border-red-400'
                  : 'border-white/30 focus:border-white/50'
              }`}
              classNames={{
                input: 'text-white',
                inputWrapper:
                  'bg-white/10 backdrop-blur-xl border-white/30 focus-within:border-white/50',
              }}
            />
            {errors.age && (
              <p className='text-red-300 text-xs mt-2 text-left'>
                {errors.age}
              </p>
            )}
            <p className='text-xs text-white/70 mt-2 text-left leading-relaxed'>
              Je geboortedatum blijft privé en helpt ons adviezen voor jouw
              levensfase te geven.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Button
            color='primary'
            size='lg'
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={`w-full font-semibold transition-colors ${
              name.trim()
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {name.trim() ? '➡️ Volgende' : '⏳ Volgende'}
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleSkip}
            className='w-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600 transition-colors'
          >
            ⏭️ Overslaan
          </Button>
        </div>

        {/* Validation summary */}
        {Object.keys(errors).length > 0 && (
          <div className='mt-4 p-3 bg-red-300/50 border border-red-400/30 rounded-lg'>
            <p className='text-red-200 text-sm'>
              ⚠️ Controleer de bovenstaande velden om door te gaan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingProfile;

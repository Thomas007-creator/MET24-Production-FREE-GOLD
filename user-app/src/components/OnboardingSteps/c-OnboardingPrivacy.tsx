import React, { useState } from 'react';
import { Button, Checkbox } from '@nextui-org/react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface OnboardingPrivacyProps {
  onAccept: () => void;
  onMoreInfo: () => void;
}

const OnboardingPrivacy: React.FC<OnboardingPrivacyProps> = ({
  onAccept,
  onMoreInfo,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  const handleAccept = async () => {
    if (!isChecked) {
      logger.warn('Checkbox must be checked to proceed');
      return;
    }

    console.log('Privacy accepted - saving to database');
    
    try {
      // Update onboarding state with privacy consent
      await databaseService.createOrUpdateOnboardingState({
        user_id: 'anon',
        last_step: 'privacy',
        step_completed_flags: JSON.stringify({
          welcome: true,
          auth: true,
          privacy: true,
        }),
        consent_time: new Date().toISOString(),
      });

      console.log('Privacy consent saved to database - proceeding to next step');
      onAccept();
    } catch (error) {
      console.error('Database save failed, but continuing:', error);
      onAccept();
    }
  };

  const handleMoreInfo = () => {
    setShowInfo(!showInfo);
    onMoreInfo(); // Call the prop function, which currently just logs
  };

  // Track that privacy page is shown
  React.useEffect(() => {
    const trackPrivacyShown = async () => {
      try {
        logger.info('onboarding_privacy_shown', {
          step: 'privacy',
          action: 'shown',
        });
        logger.info('Privacy page shown event tracked');
      } catch (error) {
                  logger.error('Error tracking privacy shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackPrivacyShown();
  }, []);

  // Get BMAD color scheme for privacy (trustworthy professional)
  const privacyColorScheme = BMADColorSystem.getPersonalityColorScheme('thinking_professional');
  const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(privacyColorScheme);
  const animationClasses = BMADColorSystem.getAnimationClasses(privacyColorScheme);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${privacyColorScheme.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className={`w-24 h-24 ${glassmorphismClasses} rounded-full flex items-center justify-center mx-auto mb-6 ${animationClasses}`}>
            <span className='text-4xl'>🔒</span>
          </div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${privacyColorScheme.gradient} bg-clip-text text-transparent mb-4`}>Privacy‑first</h1>
        </div>

        <p className='text-xl mb-4 text-center font-medium text-white/90'>
          Jouw data, jouw potentieel.
        </p>

        <p className='text-lg mb-8 text-center text-white/80'>
          Standaard vindt analyse lokaal plaats op jouw apparaat. We slaan geen
          persoonlijke profilinggegevens op servers op zonder jouw expliciete
          toestemming.
        </p>

        {/* Database status indicator */}
        <div className={`mb-4 p-3 ${glassmorphismClasses} rounded-lg`}>
          <p className='text-sm text-white/80'>
            Database: {'🔗 WatermelonDB'} |
            Version: {'2.0.0'} | Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Privacy Checkbox */}
        <div className='mb-8'>
          <Checkbox
            isSelected={isChecked}
            onValueChange={handleCheckboxChange}
            className='text-white'
            classNames={{
              label: 'text-white text-sm leading-relaxed',
              wrapper: 'items-start',
            }}
          >
            <div className='text-left'>
              <span>Ik begrijp en ga akkoord met de </span>
              <button
                className='underline hover:text-cyan-200 transition-colors'
                onClick={() => logger.info('Privacyverklaring clicked')}
              >
                Privacyverklaring
              </button>
              <span> en </span>
              <button
                className='underline hover:text-cyan-200 transition-colors'
                onClick={() => logger.info('Gebruiksvoorwaarden clicked')}
              >
                Gebruiksvoorwaarden
              </button>
              <span>.</span>
            </div>
          </Checkbox>
        </div>

        <div className='space-y-4'>
          <Button
            onClick={handleAccept}
            disabled={!isChecked}
            className={`w-full text-white font-semibold ${BMADColorSystem.getButtonColorFromGradient('from-teal-500 to-cyan-500')} shadow-lg`}
            size='lg'
          >
            Akkoord & Doorgaan
          </Button>

          <Button
            variant='ghost'
            onClick={handleMoreInfo}
            className='w-full text-white border-white/30 hover:bg-white/10'
            size='lg'
          >
            Meer informatie
          </Button>
        </div>

        {showInfo && (
          <div className={`mt-6 p-4 ${glassmorphismClasses} rounded-lg text-left`}>
            <h3 className='font-semibold mb-2 text-cyan-300'>Privacy details:</h3>
            <ul className='text-sm text-white/80 space-y-1'>
              <li>• Alle data wordt lokaal op je apparaat opgeslagen</li>
              <li>• Geen tracking zonder expliciete toestemming</li>
              <li>• Je kunt je data op elk moment exporteren of verwijderen</li>
              <li>• AI-analyse gebeurt lokaal, niet op onze servers</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPrivacy;

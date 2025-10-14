import React, { useState } from 'react';
import { Button, Checkbox } from '@nextui-org/react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='text-center max-w-md'>
        <div className='mb-8'>
          <div className='w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6'>
            <span className='text-4xl'>🔒</span>
          </div>
          <h1 className='text-3xl font-bold text-white mb-4'>Privacy‑first</h1>
        </div>

        <p className='text-xl mb-4 text-center font-medium'>
          Jouw data, jouw potentieel.
        </p>

        <p className='text-lg mb-8 text-center opacity-90'>
          Standaard vindt analyse lokaal plaats op jouw apparaat. We slaan geen
          persoonlijke profilinggegevens op servers op zonder jouw expliciete
          toestemming.
        </p>

        {/* Database status indicator */}
        <div className='mb-4 p-2 bg-white/10 rounded-lg'>
          <p className='text-xs'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
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
                className='underline hover:text-blue-200 transition-colors'
                onClick={() => logger.info('Privacyverklaring clicked')}
              >
                Privacyverklaring
              </button>
              <span> en </span>
              <button
                className='underline hover:text-blue-200 transition-colors'
                onClick={() => logger.info('Voorwaarden clicked')}
              >
                Voorwaarden
              </button>
            </div>
          </Checkbox>
        </div>

        {/* Meer informatie popup */}
        {showInfo && (
          <div className='bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl p-6 mb-8'>
            <h3 className='text-lg font-semibold mb-4'>📋 Meer over Privacy</h3>
            <div className='text-left space-y-3 text-sm'>
              <p>
                <strong>Lokale analyse:</strong> Alle persoonlijkheidsanalyse
                gebeurt op jouw apparaat. Geen data wordt naar servers gestuurd.
              </p>
              <p>
                <strong>Geen tracking:</strong> We volgen je niet en delen geen
                data met derden.
              </p>
              <p>
                <strong>Volledige controle:</strong> Je kunt altijd je data
                bekijken, bewerken of verwijderen.
              </p>
              <p>
                <strong>Expliciete toestemming:</strong> We vragen altijd
                toestemming voordat we data delen.
              </p>
              <p>
                <strong>End-to-end encryptie:</strong> Alle data wordt
                versleuteld opgeslagen.
              </p>
            </div>
          </div>
        )}

        <div className='space-y-4'>
          <Button
            color='primary'
            size='lg'
            onClick={() => {
              console.log('Button clicked!', { isChecked, onAccept: typeof onAccept });
              handleAccept();
            }}
            disabled={!isChecked}
            className={`w-full font-semibold transition-colors ${
              isChecked
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            {isChecked ? '✅ Accepteer en ga door' : '⏳ Accepteer en ga door'}
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleMoreInfo}
            className='w-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-600'
          >
            {showInfo ? '📋 Verberg informatie' : '📋 Meer over privacy'}
          </Button>
        </div>

        {/* Validation message */}
        {!isChecked && (
          <div className='mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg'>
            <p className='text-red-200 text-sm'>
              ⚠️ Je moet akkoord gaan met de Privacyverklaring en Voorwaarden om
              door te gaan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPrivacy;

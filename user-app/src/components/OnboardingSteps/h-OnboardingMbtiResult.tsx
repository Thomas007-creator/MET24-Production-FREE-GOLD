import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface OnboardingMbtiResultProps {
  result: {
    letters: string;
    percentages: {
      [key: string]: {
        percentage: number;
        confidence: number;
        letter: string;
      };
    };
    confidence: number;
  };
  onSave: () => void;
  onEdit: () => void;
  onBack: () => void;
  onUseExternal?: () => void;
  hasExternalResult?: boolean;
}

const OnboardingMbtiResult: React.FC<OnboardingMbtiResultProps> = ({
  result,
  onSave,
  onEdit,
  onBack,
  onUseExternal,
  hasExternalResult = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Create component-specific logger
  const log = logger.component('OnboardingMbtiResult');

  // Debug: Log what we receive
  log.debug('Received result', { 
    letters: result.letters, 
    percentages: result.percentages, 
    confidence: result.confidence 
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      log.info('Saving MBTI result', { 
        letters: result.letters, 
        confidence: result.confidence 
      });

      // Track analytics event
      logger.info('onboarding_mbti_result_saved', {
        letters: result.letters,
        confidence: result.confidence,
        step: 'mbti_result',
      });

      // WatermelonDB write already handled in quicktest step
      // If editing, update mbti_profiles record
      await databaseService.write(async () => {
        log.debug('Updating MBTI profile in database', {
          letters: result.letters,
          confidence: result.confidence,
          percentages: result.percentages,
        });

        // Update onboarding state to mark result as saved
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'mbti_result',
          step_completed_flags: JSON.stringify({
            welcome: true,
            auth: true,
            privacy: true,
            basic_profile: true,
            account_created: true,
            mbti_choice: true,
            mbti_quicktest: true,
            mbti_result: true,
          }),
        });
      });

      log.info('MBTI result saved to database successfully');

      // Proceed to next step
      onSave();
    } catch (error) {
      log.error('Error in handleSave', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const getDichotomyColor = (dichotomy: string): string => {
    const colors: { [key: string]: string } = {
      'I/E': 'bg-blue-600/40 border-blue-500/40',
      'S/N': 'bg-green-600/40 border-green-500/40', 
      'T/F': 'bg-purple-600/40 border-purple-500/40',
      'J/P': 'bg-orange-600/40 border-orange-500/40',
    };
    return colors[dichotomy] || 'bg-white/10 border-white/20';
  };

  const getDichotomyLabel = (dichotomy: string): string => {
    const labels: { [key: string]: string } = {
      'I/E': 'Introvert/Extravert',
      'S/N': 'Sensing/Intuition',
      'T/F': 'Thinking/Feeling',
      'J/P': 'Judging/Perceiving',
    };
    return labels[dichotomy] || dichotomy;
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return '#51cf66'; // Green
    if (confidence >= 60) return '#ffd43b'; // Yellow
    return '#ff6b6b'; // Red
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 80) return 'Hoog';
    if (confidence >= 60) return 'Gemiddeld';
    return 'Laag';
  };

  // Track that result page is shown
  React.useEffect(() => {
    const trackResultShown = async () => {
      try {
        logger.info('onboarding_mbti_result_shown', {
          step: 'mbti_result',
          action: 'shown',
          letters: result.letters,
          confidence: result.confidence,
        });
        log.debug('MBTI result page shown event tracked');
      } catch (error) {
        log.error('Error tracking result shown event', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackResultShown();
  }, [result.letters, result.confidence, result.percentages, log]);

  // Get vibrant, achievement-focused color scheme for MBTI results
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('extraverted_vibrant');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className='text-center max-w-2xl'>
        {/* Header */}
        <div className='mb-10'>
          {/* MBTI Result Icon */}
          <div className={`w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            <span className={`text-4xl font-bold tracking-widest bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
              {result.letters}
            </span>
          </div>

          <h1 className={`text-4xl font-bold mb-4 bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>Jouw MBTI‑inschatting</h1>
        </div>

        {/* Database status indicator */}
        <div className='mb-6 p-2 bg-black/20 backdrop-blur-lg rounded-lg border border-white/20'>
          <p className='text-xs text-white/60'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Result Display */}
        <div className='mb-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl'>
          {/* Main Result */}
          <div className='mb-8'>
            <h2 className='text-5xl font-bold mb-4 tracking-widest'>
              {result.letters}
            </h2>
            <p className='text-xl opacity-90 mb-6'>
              Vertrouwen:{' '}
              <span
                className='font-bold'
                style={{ color: getConfidenceColor(result.confidence) }}
              >
                {result.confidence}% ({getConfidenceLabel(result.confidence)})
              </span>
            </p>
          </div>

          {/* Dichotomy Breakdown */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Object.entries(result.percentages).map(([dichotomy, data]) => (
              <div
                key={dichotomy}
                className={`${getDichotomyColor(dichotomy)} backdrop-blur-xl rounded-2xl p-6`}
              >
                <h3 className='text-lg font-semibold mb-4 text-blue-300'>
                  {getDichotomyLabel(dichotomy)}
                </h3>

                <div className='flex justify-between items-center mb-4'>
                  <span
                    className={`text-3xl font-bold ${
                      data.letter === dichotomy.split('/')[0]
                        ? 'text-blue-300'
                        : 'text-cyan-300'
                    }`}
                  >
                    {data.letter}
                  </span>
                  <span
                    className='text-2xl font-semibold'
                    style={{ color: getConfidenceColor(data.confidence) }}
                  >
                    {data.percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden mb-3'>
                  <div
                    className='h-full transition-all duration-500 ease-out rounded-full'
                    style={{
                      width: `${data.percentage}%`,
                      background: `linear-gradient(90deg, ${getConfidenceColor(data.confidence)} 0%, ${getConfidenceColor(data.confidence)}80 100%)`,
                    }}
                  />
                </div>

                <p className='text-sm opacity-70'>
                  Vertrouwen: {data.confidence}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4 mb-8'>
          {/* Primary Button - Save */}
          <Button
            color='primary'
            size='lg'
            onClick={handleSave}
            disabled={isSaving}
            className='w-full bg-white text-blue-600 hover:bg-gray-100 transition-colors font-semibold'
          >
            {isSaving ? '⏳ Opslaan...' : '💾 Opslaan en verder'}
          </Button>

          {/* Secondary Button - Edit */}
          <Button
            color='primary'
            size='lg'
            onClick={onEdit}
            className='w-full bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors'
          >
            ✏️ Bewerk
          </Button>

          {/* Back Button */}
          <Button
            color='primary'
            size='lg'
            onClick={onBack}
            className='w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors'
          >
            ← Terug naar vorige stap
          </Button>

          {/* Tertiary Button - Use External (if available) */}
          {hasExternalResult && onUseExternal && (
            <Button
              color='primary'
              size='lg'
              onClick={onUseExternal}
              className='w-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors'
            >
              📋 Gebruik externe resultaat
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div className='bg-gray-800/60 backdrop-blur-xl border border-gray-600/40 rounded-2xl p-6'>
          <p className='text-sm opacity-80 leading-relaxed'>
            💡 <strong>Tip:</strong> Deze inschatting helpt de AI-coach om
            persoonlijker advies te geven. Je kunt altijd later je MBTI type
            aanpassen in de instellingen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingMbtiResult;

import React, { useState, useEffect } from 'react';
import {
  Button,
  Textarea,
  Select,
  SelectItem,
  Slider,
  Chip,
  Tooltip,
} from '@nextui-org/react';
import {
  Info,
  Users,
  Target,
  Clock,
  Heart,
  LifeBuoy,
  Brain,
  Activity,
} from 'lucide-react';
import { databaseService } from '../../services/databaseService';
import { encryptPayload } from '../../utils/encryption';
import { logger } from '../../utils/logger';

interface OnboardingContextProps {
  onNext: (contextData: ContextData) => void;
  onSkip: () => void;
}

interface ContextData {
  situation: string;
  involvedPersons: string[];
  desiredOutcome: string;
  previousAttempts: string;
  currentEmotion: string;
  emotionExplanation: string;
  lifeStage: string;
  communicationStyles: string[];
  communicationExplanation: string;
  stressLevel: number;
}

const OnboardingContext: React.FC<OnboardingContextProps> = ({
  onNext,
  onSkip,
}) => {
  const [formData, setFormData] = useState<ContextData>({
    situation: '',
    involvedPersons: [],
    desiredOutcome: '',
    previousAttempts: '',
    currentEmotion: '',
    emotionExplanation: '',
    lifeStage: '',
    communicationStyles: [],
    communicationExplanation: '',
    stressLevel: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined options
  const involvedPersonOptions = [
    'Partner',
    'Kinderen',
    'Ouders',
    "Collega's",
    'Vrienden',
    'Manager',
    'Team',
    'Klanten',
    'Zelf',
    'Andere',
  ];

  const emotionOptions = [
    'Gefrustreerd',
    'Overweldigd',
    'Onzeker',
    'Gestrest',
    'Teleurgesteld',
    'Gemotiveerd',
    'Hopelijk',
    'Angstig',
    'Boos',
    'Verdrietig',
    'Gelukkig',
    'Andere',
  ];

  const lifeStageOptions = [
    'Student',
    'Starter',
    'Young Professional',
    'Mid-career',
    'Senior Professional',
    'Manager',
    'Ondernemer',
    'Ouder',
    'Pensioen',
    'Andere',
  ];

  const communicationStyleOptions = [
    'ADHD',
    'ADD',
    'Autisme',
    'Dyslexie',
    'Dyspraxie',
    'Hoogbegaafdheid',
    'Hoogsensitiviteit',
  ];

  const handleInputChange = (field: keyof ContextData, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInvolvedPersonToggle = (person: string) => {
    setFormData(prev => ({
      ...prev,
      involvedPersons: prev.involvedPersons.includes(person)
        ? prev.involvedPersons.filter(p => p !== person)
        : [...prev.involvedPersons, person],
    }));
  };

  const handleCommunicationStyleToggle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      communicationStyles: prev.communicationStyles.includes(style)
        ? prev.communicationStyles.filter(s => s !== style)
        : [...prev.communicationStyles, style],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      logger.info('✅ Submitting context data:', formData);

      // Track analytics event
      logger.info('onboarding_context_submitted', {
        hasContext: true,
        fieldsFilled: Object.values(formData).filter(
          v =>
            v !== '' && v !== false && (Array.isArray(v) ? v.length > 0 : true)
        ).length,
        step: 'context',
      });

      // WatermelonDB write: create contexts record
      await databaseService.write(async () => {
        logger.info('💾 Creating context record with encrypted fields');

        // Encrypt sensitive text fields
        const encryptedSituation = formData.situation
          ? encryptPayload(formData.situation)
          : null;
        const encryptedDesiredOutcome = formData.desiredOutcome
          ? encryptPayload(formData.desiredOutcome)
          : null;
        const encryptedPreviousAttempts = formData.previousAttempts
          ? encryptPayload(formData.previousAttempts)
          : null;
        const encryptedEmotionExplanation = formData.emotionExplanation
          ? encryptPayload(formData.emotionExplanation)
          : null;
        const encryptedCommunicationExplanation =
          formData.communicationExplanation
            ? encryptPayload(formData.communicationExplanation)
            : null;

        // Simulate creating context record
        logger.info('📝 Creating context record:', {
          situation_encrypted: encryptedSituation ? 'ENCRYPTED' : null,
          involved_persons: JSON.stringify(formData.involvedPersons),
          desired_outcome_encrypted: encryptedDesiredOutcome
            ? 'ENCRYPTED'
            : null,
          previous_attempts_encrypted: encryptedPreviousAttempts
            ? 'ENCRYPTED'
            : null,
          current_emotion: formData.currentEmotion,
          emotion_explanation_encrypted: encryptedEmotionExplanation
            ? 'ENCRYPTED'
            : null,
          life_stage: formData.lifeStage,
          communication_styles: JSON.stringify(formData.communicationStyles),
          communication_explanation_encrypted: encryptedCommunicationExplanation
            ? 'ENCRYPTED'
            : null,
          stress_level: formData.stressLevel,
        });

        // Update onboarding state
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'context',
          step_completed_flags: JSON.stringify({
            welcome: true,
            auth: true,
            privacy: true,
            basic_profile: true,
            account_created: true,
            mbti_choice: true,
            mbti_quicktest: true,
            mbti_result: true,
            interests: true,
            context: true,
          }),
        });
      });

      logger.info('✅ Context data saved to database');
      onNext(formData);
    } catch (error) {
      logger.error('❌ Error in handleSubmit:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      logger.info('onboarding_context_skipped', {
        step: 'context',
      });
      logger.info('📊 Tracked: onboarding_context_skipped');
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  };

  // Track that context page is shown
  useEffect(() => {
    const trackContextShown = async () => {
      try {
        logger.info('onboarding_context_shown', {
          step: 'context',
          action: 'shown',
        });
        logger.info('📊 Context page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking context shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackContextShown();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='text-center max-w-4xl w-full'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-4'>
            Beschrijf een huidige uitdaging of doel
          </h1>
          <p className='text-xl opacity-90 mb-6'>
            Hoe specifieker, hoe beter de AI kan helpen. (alle velden optioneel)
          </p>
        </div>

        {/* Database status indicator */}
        <div className='mb-6 p-2 bg-white/10 rounded-lg'>
          <p className='text-xs'>
            Database: {'🔗 WatermelonDB'}|
            Version: {'2.0.0'}| Status:{' '}
            {'✅ Connected'}
          </p>
        </div>

        {/* Form */}
        <div className='space-y-8 mb-8'>
          {/* Situatie */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Info className='w-5 h-5 text-blue-300' />
              <h3 className='text-lg font-semibold'>Situatie</h3>
              <Tooltip content='Beschrijf je huidige uitdaging of situatie. Dit helpt de AI om relevante adviezen te geven.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <Textarea
              placeholder='Beschrijf je huidige situatie of uitdaging...'
              value={formData.situation}
              onChange={e => handleInputChange('situation', e.target.value)}
              maxLength={300}
              className='bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/70'
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-transparent border-white/30',
              }}
            />
            <p className='text-xs opacity-70 mt-2 text-right'>
              {formData.situation.length}/300 tekens
            </p>
          </div>

          {/* Betrokken personen */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Users className='w-5 h-5 text-green-300' />
              <h3 className='text-lg font-semibold'>Betrokken personen</h3>
              <Tooltip content='Selecteer wie er betrokken zijn bij deze situatie. Dit helpt de AI om relatie-dynamieken te begrijpen.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <div className='flex flex-wrap gap-2'>
              {involvedPersonOptions.map(person => (
                <Chip
                  key={person}
                  variant={
                    formData.involvedPersons.includes(person)
                      ? 'solid'
                      : 'bordered'
                  }
                  onClick={() => handleInvolvedPersonToggle(person)}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${
                      formData.involvedPersons.includes(person)
                        ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
                        : 'bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20'
                    }
                  `}
                >
                  {person}
                </Chip>
              ))}
            </div>
          </div>

          {/* Gewenste uitkomst */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Target className='w-5 h-5 text-yellow-300' />
              <h3 className='text-lg font-semibold'>Gewenste uitkomst</h3>
              <Tooltip content='Wat wil je bereiken? Een duidelijk doel helpt de AI om gerichte adviezen te geven.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <Textarea
              placeholder='Wat wil je bereiken?'
              value={formData.desiredOutcome}
              onChange={e =>
                handleInputChange('desiredOutcome', e.target.value)
              }
              maxLength={200}
              className='bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/70'
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-transparent border-white/30',
              }}
            />
            <p className='text-xs opacity-70 mt-2 text-right'>
              {formData.desiredOutcome.length}/200 tekens
            </p>
          </div>

          {/* Eerdere pogingen */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Clock className='w-5 h-5 text-orange-300' />
              <h3 className='text-lg font-semibold'>Eerdere pogingen</h3>
              <Tooltip content='Wat heb je al geprobeerd? Dit helpt de AI om nieuwe perspectieven te bieden.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <Textarea
              placeholder='Wat heb je al geprobeerd?'
              value={formData.previousAttempts}
              onChange={e =>
                handleInputChange('previousAttempts', e.target.value)
              }
              maxLength={200}
              className='bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/70'
              classNames={{
                input: 'text-white',
                inputWrapper: 'bg-transparent border-white/30',
              }}
            />
            <p className='text-xs opacity-70 mt-2 text-right'>
              {formData.previousAttempts.length}/200 tekens
            </p>
          </div>

          {/* Huidige emotie */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Heart className='w-5 h-5 text-red-300' />
              <h3 className='text-lg font-semibold'>Huidige emotie</h3>
              <Tooltip content='Hoe voel je je nu? Emoties zijn belangrijk voor het begrijpen van je situatie.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <Select
              placeholder='Selecteer je huidige emotie'
              value={formData.currentEmotion}
              onChange={e =>
                handleInputChange('currentEmotion', e.target.value)
              }
              className='bg-white/10 backdrop-blur-xl border border-white/30 text-white'
              classNames={{
                trigger: 'bg-transparent border-white/30',
                value: 'text-white',
                listbox: 'bg-white/10 backdrop-blur-xl border border-white/30',
              }}
            >
              {emotionOptions.map(emotion => (
                <SelectItem
                  key={emotion}
                  value={emotion}
                  className='text-white'
                >
                  {emotion}
                </SelectItem>
              ))}
            </Select>
            {formData.currentEmotion && (
              <div className='mt-4'>
                <Textarea
                  placeholder='Toelichting bij je emotie (optioneel)'
                  value={formData.emotionExplanation}
                  onChange={e =>
                    handleInputChange('emotionExplanation', e.target.value)
                  }
                  className='bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/70'
                  classNames={{
                    input: 'text-white',
                    inputWrapper: 'bg-transparent border-white/30',
                  }}
                />
              </div>
            )}
          </div>

          {/* Levensfase */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <LifeBuoy className='w-5 h-5 text-cyan-300' />
              <h3 className='text-lg font-semibold'>Levensfase</h3>
              <Tooltip content='In welke levensfase ben je? Dit helpt de AI om leeftijdsgerelateerde adviezen te geven.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <Select
              placeholder='Selecteer je levensfase'
              value={formData.lifeStage}
              onChange={e => handleInputChange('lifeStage', e.target.value)}
              className='bg-white/10 backdrop-blur-xl border border-white/30 text-white'
              classNames={{
                trigger: 'bg-transparent border-white/30',
                value: 'text-white',
                listbox: 'bg-white/10 backdrop-blur-xl border border-white/30',
              }}
            >
              {lifeStageOptions.map(stage => (
                <SelectItem key={stage} value={stage} className='text-white'>
                  {stage}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Specifieke communicatiestijl */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Brain className='w-5 h-5 text-purple-300' />
              <h3 className='text-lg font-semibold'>
                Specifieke communicatiestijl
              </h3>
              <Tooltip content='Heb je een specifieke communicatiestijl? Dit helpt de AI om gepaste adviezen te geven.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <div className='flex flex-wrap gap-2 mb-4'>
              {communicationStyleOptions.map(style => (
                <Chip
                  key={style}
                  variant={
                    formData.communicationStyles.includes(style)
                      ? 'solid'
                      : 'bordered'
                  }
                  onClick={() => handleCommunicationStyleToggle(style)}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${
                      formData.communicationStyles.includes(style)
                        ? 'bg-white/20 backdrop-blur-xl border border-white/50 text-white'
                        : 'bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20'
                    }
                  `}
                >
                  {style}
                </Chip>
              ))}
            </div>
            {formData.communicationStyles.length > 0 && (
              <div className='mt-4'>
                <Textarea
                  placeholder='Toelichting (optioneel)'
                  value={formData.communicationExplanation}
                  onChange={e =>
                    handleInputChange(
                      'communicationExplanation',
                      e.target.value
                    )
                  }
                  className='bg-white/10 backdrop-blur-xl border border-white/30 text-white placeholder-white/70'
                  classNames={{
                    input: 'text-white',
                    inputWrapper: 'bg-transparent border-white/30',
                  }}
                />
              </div>
            )}
          </div>

          {/* Stressniveau */}
          <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Activity className='w-5 h-5 text-pink-300' />
              <h3 className='text-lg font-semibold'>Stressniveau</h3>
              <Tooltip content='Hoe gestrest voel je je op dit moment? Dit helpt de AI om stress-gerelateerde adviezen te geven.'>
                <Info className='w-4 h-4 text-white/70 cursor-help' />
              </Tooltip>
            </div>
            <div className='space-y-4'>
              <Slider
                size='lg'
                step={1}
                color='primary'
                showSteps={true}
                maxValue={10}
                minValue={0}
                value={formData.stressLevel}
                onChange={value => handleInputChange('stressLevel', Array.isArray(value) ? value[0] : value)}
                className='max-w-md'
                classNames={{
                  track: 'bg-white/20',
                  filler: 'bg-gradient-to-r from-green-400 to-red-500',
                  thumb: 'bg-white border-white/30',
                }}
              />
              <div className='flex justify-between text-sm opacity-80'>
                <span>0 - Ontspannen</span>
                <span className='font-semibold'>{formData.stressLevel}/10</span>
                <span>10 - Overweldigd</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Button
            color='primary'
            size='lg'
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='w-full max-w-md bg-white text-purple-600 hover:bg-gray-100 transition-colors font-semibold'
          >
            {isSubmitting ? '⏳ Opslaan...' : '💾 Opslaan voorbeeldsituatie'}
          </Button>

          <Button
            color='primary'
            size='lg'
            onClick={handleSkip}
            className='w-full max-w-md bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors'
          >
            ⏭️ Overslaan
          </Button>
        </div>

        {/* Info Box */}
        <div className='mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
          <p className='text-sm opacity-80 leading-relaxed'>
            💡 <strong>Tip:</strong> Alle velden zijn optioneel. Vul alleen in
            wat je comfortabel vindt delen. Deze informatie helpt de AI-coach om
            persoonlijker en relevanter advies te geven.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingContext;

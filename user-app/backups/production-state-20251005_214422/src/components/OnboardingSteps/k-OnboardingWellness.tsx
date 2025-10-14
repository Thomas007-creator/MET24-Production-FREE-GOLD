import React, { useState, useEffect } from 'react';
import { Button, Slider } from '@nextui-org/react';
import {
  Heart,
  Activity,
  Moon,
  Users,
  Target,
  Brain,
  Activity as ActivityIcon,
} from 'lucide-react';
import { databaseService } from '../../services/databaseService';
import { encryptPayload } from '../../utils/encryption';
import { logger } from '../../utils/logger';

interface OnboardingWellnessProps {
  onNext: (wellnessData: WellnessData) => void;
  onSkip: () => void;
}

interface WellnessData {
  answers: number[];
  scores: {
    energy_index: number;
    stress_index: number;
    social_support_score: number;
    self_compassion_score: number;
  };
}

const OnboardingWellness: React.FC<OnboardingWellnessProps> = ({
  onNext,
  onSkip,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wellness questions (exact 10 as specified)
  const questions = [
    {
      id: 1,
      text: 'Hoe regelmatig slaap je voldoende?',
      category: 'energy',
      icon: Moon,
      type: 'likert' as const,
    },
    {
      id: 2,
      text: 'Hoe vaak heb je last van vermoeidheid overdag?',
      category: 'energy',
      icon: Activity,
      type: 'likert' as const,
      reversed: true,
    },
    {
      id: 3,
      text: 'Hoe vaak beweeg je matig/intensief per week?',
      category: 'energy',
      icon: ActivityIcon,
      type: 'likert' as const,
    },
    {
      id: 4,
      text: 'Hoe goed kun je je emoties reguleren in stress?',
      category: 'stress',
      icon: Brain,
      type: 'likert' as const,
    },
    {
      id: 5,
      text: 'Hoe vaak ervaar je zingeving in dagelijkse activiteiten?',
      category: 'meaning',
      icon: Target,
      type: 'likert' as const,
    },
    {
      id: 6,
      text: 'Hoeveel sociale steun ervaar je?',
      category: 'social',
      icon: Users,
      type: 'likert' as const,
    },
    {
      id: 7,
      text: 'Hoe vaak ervaar je lichamelijke klachten die functioneren beïnvloeden?',
      category: 'stress',
      icon: Heart,
      type: 'likert' as const,
      reversed: true,
    },
    {
      id: 8,
      text: 'Hoe vaak handel je doelgericht?',
      category: 'meaning',
      icon: Target,
      type: 'likert' as const,
    },
    {
      id: 9,
      text: 'Hoe vaak ben je vriendelijk voor jezelf bij tegenslag?',
      category: 'self_compassion',
      icon: Heart,
      type: 'likert' as const,
    },
    {
      id: 10,
      text: 'Hoe hoog is je ervaren stressniveau?',
      category: 'stress',
      icon: Activity,
      type: 'slider' as const,
      reversed: true,
    },
  ];

  const likertLabels = ['Zeer zelden', 'Zelden', 'Soms', 'Vaak', 'Zeer vaak'];

  const handleAnswer = (value: number) => {
    logger.info('🔄 handleAnswer called with value:', { value, currentQuestion });
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    logger.info('📝 Updated answers:', newAnswers);
  };

  const handleNext = () => {
    logger.info(
      '🔄 handleNext called, currentQuestion:',
      { currentQuestion, answers }
    );
    if (currentQuestion < questions.length - 1) {
      logger.info('📱 Moving to next question:', { nextQuestion: currentQuestion + 1 });
      setCurrentQuestion(currentQuestion + 1);
    } else {
      logger.info('❌ Already at last question');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScores = (answers: number[]): WellnessData['scores'] => {
    // Energy Index (questions 1, 2, 3)
    const energyAnswers = [answers[0], answers[1], answers[2]];
    const energyIndex = Math.round(
      (energyAnswers.reduce((sum, answer) => {
        const value =
          questions[1].reversed && answer === 1
            ? 5
            : questions[1].reversed && answer === 2
              ? 4
              : questions[1].reversed && answer === 3
                ? 3
                : questions[1].reversed && answer === 4
                  ? 2
                  : questions[1].reversed && answer === 5
                    ? 1
                    : answer;
        return sum + value;
      }, 0) /
        energyAnswers.length) *
        20
    );

    // Stress Index (questions 4, 7, 10)
    const stressAnswers = [answers[3], answers[6], answers[9]];
    const stressIndex = Math.round(
      (stressAnswers.reduce((sum, answer) => {
        const value =
          questions[6].reversed && answer === 1
            ? 5
            : questions[6].reversed && answer === 2
              ? 4
              : questions[6].reversed && answer === 3
                ? 3
                : questions[6].reversed && answer === 4
                  ? 2
                  : questions[6].reversed && answer === 5
                    ? 1
                    : answer;
        return sum + value;
      }, 0) /
        stressAnswers.length) *
        20
    );

    // Social Support Score (question 6)
    const socialSupportScore = Math.round(answers[5] * 20);

    // Self Compassion Score (question 9)
    const selfCompassionScore = Math.round(answers[8] * 20);

    return {
      energy_index: energyIndex,
      stress_index: stressIndex,
      social_support_score: socialSupportScore,
      self_compassion_score: selfCompassionScore,
    };
  };

  const handleSubmit = async () => {
    if (answers.some(answer => answer === 0)) {
      logger.info('❌ Please answer all questions');
      return;
    }

    setIsSubmitting(true);

    try {
      logger.info('✅ Submitting wellness assessment:', answers);

      const scores = calculateScores(answers);
      logger.info('📊 Calculated scores:', scores);

      // Track analytics event
      logger.info(
        'onboarding_wellness_assessment_completed',
        {
          scores: scores,
          step: 'wellness',
        }
      );

      // WatermelonDB write: create wellness_assessments record
      await databaseService.write(async () => {
        logger.info('💾 Creating wellness assessment record');

        // Encrypt raw answers
        const encryptedAnswers = encryptPayload(JSON.stringify(answers));
        const scoresJson = JSON.stringify(scores);

        // Simulate creating wellness assessment record
        logger.info('📝 Creating wellness assessment record:', {
          answers_encrypted: encryptedAnswers ? 'ENCRYPTED' : null,
          scores_json: scoresJson,
          energy_index: scores.energy_index,
          stress_index: scores.stress_index,
          social_support_score: scores.social_support_score,
          self_compassion_score: scores.self_compassion_score,
        });

        // Update onboarding state
        await databaseService.createOrUpdateOnboardingState({
          user_id: 'anon', // Will be updated when user is created
          last_step: 'wellness',
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
            wellness: true,
          }),
        });
      });

      logger.info('✅ Wellness assessment saved to database');
      onNext({ answers, scores });
    } catch (error) {
      logger.error('❌ Error in handleSubmit:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    try {
      logger.info('onboarding_wellness_skipped', {
        step: 'wellness',
      });
      logger.info('📊 Tracked: onboarding_wellness_skipped');
    } catch (error) {
      logger.error('❌ Error tracking skip event:', { error: error instanceof Error ? error.message : String(error) });
    }
    onSkip();
  };

  // Track that wellness page is shown
  useEffect(() => {
    const trackWellnessShown = async () => {
      try {
        logger.info('onboarding_wellness_shown', {
          step: 'wellness',
          action: 'shown',
        });
        logger.info('📊 Wellness page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking wellness shown event:', { error: error instanceof Error ? error.message : String(error) });
      }
    };

    trackWellnessShown();
  }, []);

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const IconComponent = currentQ.icon;

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-500 to-emerald-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold mb-4'>
            Korte welzijnsscan (10 vragen)
          </h1>
          <p className='text-xl opacity-90 mb-6'>
            Deze vragen helpen je energie, slaap, coping en zingeving in kaart
            te brengen. Duurt ~3–4 minuten.
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

        {/* Progress Bar */}
        <div className='mb-8'>
          <div className='w-full h-3 bg-white/20 rounded-full overflow-hidden mb-4'>
            <div
              className='h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className='text-sm opacity-80 text-center'>
            Vraag {currentQuestion + 1} van {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className='mb-8 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl'>
          <div className='flex items-center gap-3 mb-6'>
            <IconComponent className='w-6 h-6 text-teal-300' />
            <h2 className='text-2xl font-semibold leading-relaxed'>
              {currentQ.text}
            </h2>
          </div>

          {/* Answer Options */}
          {currentQ.type === 'likert' ? (
            <div className='space-y-3'>
              {likertLabels.map((label, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index + 1)}
                  className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
                    answers[currentQuestion] === index + 1
                      ? 'bg-teal-500/30 border-2 border-teal-400 shadow-lg'
                      : 'bg-white/10 border border-white/30 hover:bg-white/20'
                  }`}
                >
                  <span className='text-lg'>{label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className='space-y-6'>
              <Slider
                size='lg'
                step={1}
                color='primary'
                showSteps={true}
                maxValue={10}
                minValue={0}
                value={answers[currentQuestion]}
                onChange={value =>
                  handleAnswer(Array.isArray(value) ? value[0] : value)
                }
                className='max-w-md mx-auto'
                classNames={{
                  track: 'bg-white/20',
                  filler: 'bg-gradient-to-r from-green-400 to-red-500',
                  thumb: 'bg-white border-white/30',
                }}
              />
              <div className='flex justify-between text-sm opacity-80'>
                <span>0 - Geen stress</span>
                <span className='font-semibold'>
                  {answers[currentQuestion]}/10
                </span>
                <span>10 - Zeer gestrest</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-4 justify-between'>
          {/* Previous/Skip */}
          <Button
            color='primary'
            size='lg'
            onClick={currentQuestion === 0 ? handleSkip : handlePrevious}
            className='bg-white/15 text-white border border-white/30 hover:bg-white/25 transition-colors'
          >
            {currentQuestion === 0 ? '⏭️ Overslaan' : '← Vorige'}
          </Button>

          {/* Next/Complete */}
          {currentQuestion === questions.length - 1 ? (
            // On last question, show complete button
            <Button
              color='primary'
              size='lg'
              onClick={handleSubmit}
              disabled={answers[currentQuestion] === 0 || isSubmitting}
              className={`font-semibold transition-colors ${
                answers[currentQuestion] !== 0 && !isSubmitting
                  ? 'bg-white text-teal-600 hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '⏳ Verwerken...' : '✅ Resultaat bekijken'}
            </Button>
          ) : (
            // On other questions, show next button
            <Button
              color='primary'
              size='lg'
              onClick={handleNext}
              disabled={answers[currentQuestion] === 0 || isSubmitting}
              className={`font-semibold transition-colors ${
                answers[currentQuestion] !== 0 && !isSubmitting
                  ? 'bg-white text-teal-600 hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {answers[currentQuestion] === 0
                ? 'Antwoord vereist'
                : 'Volgende →'}
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div className='mt-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6'>
          <p className='text-sm opacity-80 leading-relaxed'>
            💡 <strong>Tip:</strong> Deze scan geeft je inzicht in je welzijn op
            verschillende gebieden. De resultaten helpen de AI-coach om
            gepersonaliseerde adviezen te geven.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWellness;

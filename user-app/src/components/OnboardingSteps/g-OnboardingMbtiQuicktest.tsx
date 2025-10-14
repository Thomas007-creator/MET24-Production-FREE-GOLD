import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { logger } from '../../utils/logger';

interface OnboardingMbtiQuicktestProps {
  onComplete: (result: {
    letters: string;
    percentages: Record<string, number> | null;
    confidence: number;
  }) => void;
  onSkip: () => void;
}

interface Question {
  id: number;
  text: string;
  dichotomy: 'I/E' | 'S/N' | 'T/F' | 'J/P';
  reversed: boolean;
}

const OnboardingMbtiQuicktest: React.FC<OnboardingMbtiQuicktestProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      text: 'Ik laad het liefst op door alleen tijd door te brengen.',
      dichotomy: 'I/E',
      reversed: false,
    },
    {
      id: 2,
      text: 'Ik let meer op feiten en details dan op patronen en mogelijkheden.',
      dichotomy: 'S/N',
      reversed: true,
    },
    {
      id: 3,
      text: 'Beslissingen neem ik meestal op basis van logica in plaats van gevoel.',
      dichotomy: 'T/F',
      reversed: false,
    },
    {
      id: 4,
      text: 'Ik plan graag dingen en houd van structuur.',
      dichotomy: 'J/P',
      reversed: false,
    },
    {
      id: 5,
      text: 'Ik voel me energieker na het ontmoeten van nieuwe mensen.',
      dichotomy: 'I/E',
      reversed: true,
    },
    {
      id: 6,
      text: 'Ik vertrouw op intuïtie om toekomstmogelijkheden te zien.',
      dichotomy: 'S/N',
      reversed: false,
    },
    {
      id: 7,
      text: 'In discussies zoek ik naar de waarheid, zelfs als het ongemakkelijk is.',
      dichotomy: 'T/F',
      reversed: false,
    },
    {
      id: 8,
      text: 'Ik vind flexibiliteit en ruimte belangrijker dan strakke planning.',
      dichotomy: 'J/P',
      reversed: true,
    },
    {
      id: 9,
      text: 'Ik merk vaak details op die anderen missen.',
      dichotomy: 'S/N',
      reversed: true,
    },
    {
      id: 10,
      text: 'Ik stel mijn gevoelens en waarden mee laten wegen bij beslissingen.',
      dichotomy: 'T/F',
      reversed: true,
    },
  ];

  const likertLabels = [
    'Helemaal oneens',
    'Oneens',
    'Neutraal',
    'Eens',
    'Helemaal eens',
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateMBTI = (): { letters: string; percentages: Record<string, number>; confidence: number } => {
    let E = 0, I = 0, S = 0, N = 0, T = 0, F = 0, J = 0, P = 0;

    questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer === 0) return; // Skip unanswered questions

      const normalizedAnswer = question.reversed ? (6 - answer) : answer;
      const score = (normalizedAnswer - 3) * 2; // Convert 1-5 to -4 to +4

      switch (question.dichotomy) {
        case 'I/E':
          if (score > 0) E += score;
          else I += Math.abs(score);
          break;
        case 'S/N':
          if (score > 0) S += score;
          else N += Math.abs(score);
          break;
        case 'T/F':
          if (score > 0) T += score;
          else F += Math.abs(score);
          break;
        case 'J/P':
          if (score > 0) J += score;
          else P += Math.abs(score);
          break;
      }
    });

    const letters = [
      E > I ? 'E' : 'I',
      S > N ? 'S' : 'N',
      T > F ? 'T' : 'F',
      J > P ? 'J' : 'P',
    ].join('');

    const totalAnswered = answers.filter(a => a !== 0).length;
    const confidence = Math.min(95, Math.max(60, (totalAnswered / questions.length) * 100));

    const percentages = {
      E: Math.round((E / (E + I)) * 100) || 50,
      I: Math.round((I / (E + I)) * 100) || 50,
      S: Math.round((S / (S + N)) * 100) || 50,
      N: Math.round((N / (S + N)) * 100) || 50,
      T: Math.round((T / (T + F)) * 100) || 50,
      F: Math.round((F / (T + F)) * 100) || 50,
      J: Math.round((J / (J + P)) * 100) || 50,
      P: Math.round((P / (J + P)) * 100) || 50,
    };

    return { letters, percentages, confidence };
  };

  const handleSubmit = async () => {
    if (answers.some(a => a === 0)) {
      alert('Beantwoord alle vragen voordat je de test voltooit.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = calculateMBTI();
      logger.info('Quicktest completed', { result });

      // Store result in database
      logger.info('Quicktest completed and stored', {
        mbti_type: result.letters,
        confidence: result.confidence,
        step: 'mbti_quicktest',
      });

      onComplete(result);
    } catch (error) {
      logger.error('Error completing quicktest', { error });
      alert('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        {/* Header */}
        <div className='text-center text-white mb-8'>
          <h1 className='text-3xl font-bold mb-4'>MBTI Quicktest</h1>
          <p className='text-lg opacity-90 mb-6'>
            10 korte stellingen, ~2–3 minuten. Resultaat = inschatting +
            confidence.
          </p>

          {/* Database status indicator */}
          <div className='mb-4 p-2 bg-gray-900 rounded-lg'>
            <p className='text-xs'>
              Database: 🔗 WatermelonDB | Status: ✅ Connected
            </p>
          </div>

          {/* Progress Bar */}
          <div className='w-full h-2 bg-white/20 rounded-full overflow-hidden mb-4'>
            <div
              className='h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 ease-out'
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className='text-sm opacity-80'>
            Vraag {currentQuestion + 1} van {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className='mb-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl'>
          <h2 className='text-xl font-semibold mb-6 leading-relaxed'>
            {currentQ.text}
          </h2>

          {/* Likert Scale */}
          <div className='space-y-3'>
            {likertLabels.map((label, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
                  answers[currentQuestion] === index + 1
                    ? 'bg-blue-500/30 border-2 border-blue-400 shadow-lg'
                    : 'bg-yellow-800/40 border border-white/30 hover:bg-yellow-700/50'
                }`}
              >
                <span className='text-lg'>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className='flex gap-4 justify-between'>
          {/* Previous/Skip */}
          <Button
            color='primary'
            size='lg'
            onClick={currentQuestion === 0 ? onSkip : handlePrevious}
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
              disabled={isSubmitting}
              className={`font-semibold transition-colors ${
                !isSubmitting
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? '⏳ Verwerken...' : '✅ Test voltooien'}
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
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              Volgende →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingMbtiQuicktest;

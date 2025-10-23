import React from 'react';
import { Slider } from '@nextui-org/react';
import { useOnboardingWellness } from './k-OnboardingWellness.provider';

export const OnboardingWellnessQuestion: React.FC = () => {
  const {
    currentQ,
    answers,
    currentQuestion,
    handleAnswer,
    IconComponent,
    likertLabels,
  } = useOnboardingWellness();

  return (
    <div className='mb-8 p-8 bg-amber-500/60 backdrop-blur-xl border border-amber/20 rounded-3xl'>
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
                  : 'bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20'
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
              thumb: 'bg-white border-amber-400/30',
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
  );
};
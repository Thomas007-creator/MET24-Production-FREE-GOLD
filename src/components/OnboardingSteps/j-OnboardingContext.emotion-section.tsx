import React from 'react';
import { Select, SelectItem, Textarea, Tooltip } from '@nextui-org/react';
import { Heart, Info } from 'lucide-react';
import { useOnboardingContext } from './j-OnboardingContext.provider';

export const OnboardingContextEmotionSection: React.FC = () => {
  const { formData, emotionOptions, handleInputChange } = useOnboardingContext();

  return (
    <div className='bg-blue-900/10 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6'>
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
        className='bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white'
        classNames={{
          trigger: 'bg-transparent border-blue-300/30',
          value: 'text-white',
          listbox: 'bg-blue-500/10 backdrop-blur-xl border border-blue-300/30',
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
            className='bg-blue-500/10 backdrop-blur-xl border border-blue-300/30 text-white placeholder-white/70'
            classNames={{
              input: 'text-white',
              inputWrapper: 'bg-transparent border-blue-300/30',
            }}
          />
        </div>
      )}
    </div>
  );
};
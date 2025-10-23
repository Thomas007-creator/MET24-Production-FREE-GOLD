/**
 * BackToBasics Info Section Component
 *
 * Information section about Back to Basics features and MBTI-specific content
 *
 * @version 14.0.0
 */

import React from 'react';
import {
  BookOpen,
  Play,
  BarChart3,
  Users,
  TrendingUp,
  Bot,
  Brain,
  Target,
  Star
} from 'lucide-react';
import { useBackToBasics } from './BackToBasicsPage.provider';

export const BackToBasicsInfoSection: React.FC = () => {
  const { mbtiType } = useBackToBasics();

  return (
    <div className='mt-12 glass rounded-xl p-6'>
      <h2 className='text-2xl font-bold mb-4 text-white'>
        Over Back to Basics
      </h2>
      <p className='text-gray-300 mb-6'>
        Elk levensgebied bevat uitgebreide functionaliteiten voor
        persoonlijke ontwikkeling, afgestemd op jouw {mbtiType} persoonlijkheidstype:
      </p>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
            <BookOpen className='w-4 h-4 text-blue-400' />
          </div>
          <span className='text-white'>Overzicht & Inleiding</span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
            <Play className='w-4 h-4 text-green-400' />
          </div>
          <span className='text-white'>Praktische Oefeningen</span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
            <BarChart3 className='w-4 h-4 text-purple-400' />
          </div>
          <span className='text-white'>Vragenlijsten & Tracking</span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
            <Users className='w-4 h-4 text-orange-400' />
          </div>
          <span className='text-white'>Community & Events</span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
            <TrendingUp className='w-4 h-4 text-red-400' />
          </div>
          <span className='text-white'>Progressie Monitoring</span>
        </div>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
            <Bot className='w-4 h-4 text-indigo-400' />
          </div>
          <span className='text-white'>AI Coaching</span>
        </div>
      </div>

      {/* MBTI-specific features */}
      <div className='mt-8 p-4 bg-white/5 rounded-lg'>
        <h3 className='text-lg font-semibold text-white mb-3'>
          🧠 {mbtiType} Specifieke Features
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='flex items-center gap-3'>
            <Brain className='w-5 h-5 text-purple-400' />
            <span className='text-gray-300'>Gepersonaliseerde content aanbevelingen</span>
          </div>
          <div className='flex items-center gap-3'>
            <Target className='w-5 h-5 text-purple-400' />
            <span className='text-gray-300'>MBTI-gebaseerde leerpaden</span>
          </div>
          <div className='flex items-center gap-3'>
            <Star className='w-5 h-5 text-purple-400' />
            <span className='text-gray-300'>Persoonlijkheidsspecifieke inzichten</span>
          </div>
          <div className='flex items-center gap-3'>
            <Bot className='w-5 h-5 text-purple-400' />
            <span className='text-gray-300'>AI coaching afgestemd op je type</span>
          </div>
        </div>
      </div>
    </div>
  );
};
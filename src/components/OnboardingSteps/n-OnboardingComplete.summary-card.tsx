import React from 'react';
import { Card, CardBody, CardHeader, Progress, Chip } from '@nextui-org/react';
import { Shield, Brain, Target, Heart } from 'lucide-react';
import { useOnboardingComplete } from './n-OnboardingComplete.provider';

export const OnboardingCompleteSummaryCard: React.FC = () => {
  const { summaryData } = useOnboardingComplete();

  return (
    <Card className='bg-white/15 backdrop-blur-xl border border-white/30 mb-6'>
      <CardHeader>
        <div className='flex items-center gap-3'>
          <Shield className='w-6 h-6 text-blue-300' />
          <h2 className='text-xl font-semibold text-white'>
            Privacy & Data Samenvatting
          </h2>
        </div>
      </CardHeader>
      <CardBody className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* MBTI Profile */}
          <div className='bg-violet-950/10 rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Brain className='w-5 h-5 text-purple-300' />
              <span className='font-semibold text-white'>MBTI Profiel</span>
            </div>
            <p className='text-white/90'>{summaryData.mbtiType}</p>
          </div>

          {/* Top Interests */}
          <div className='bg-violet-900/10 rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Target className='w-5 h-5 text-green-300' />
              <span className='font-semibold text-white'>
                Top 3 Interesses
              </span>
            </div>
            <div className='flex flex-wrap gap-1'>
              {summaryData.topInterests.map((interest, index) => (
                <Chip
                  key={index}
                  size='sm'
                  className='bg-white/20 text-white'
                >
                  {interest}
                </Chip>
              ))}
            </div>
          </div>

          {/* Wellness Index */}
          <div className='bg-violet-700/10 rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Heart className='w-5 h-5 text-red-300' />
              <span className='font-semibold text-white'>
                Holistisch Welzijn
              </span>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-white/80'>Energie Index</span>
                <span className='text-white font-semibold'>
                  {summaryData.wellnessScore}%
                </span>
              </div>
              <Progress
                value={summaryData.wellnessScore}
                className='w-full'
                color={
                  summaryData.wellnessScore > 70
                    ? 'success'
                    : summaryData.wellnessScore > 50
                      ? 'warning'
                      : 'danger'
                }
              />
              <p className='text-xs text-white/70'>
                Status: {summaryData.wellnessStatus}
              </p>
            </div>
          </div>

          {/* Data Storage */}
          <div className='bg-violet-600/10 rounded-lg p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Shield className='w-5 h-5 text-blue-300' />
              <span className='font-semibold text-white'>Data Opslag</span>
            </div>
            <p className='text-sm text-white/80'>
              Alle data wordt lokaal opgeslagen op je apparaat. Geen data
              wordt naar externe servers verzonden.
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
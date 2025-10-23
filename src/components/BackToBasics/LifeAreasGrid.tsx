/**
 * Life Areas Grid Component
 *
 * Grid display of life areas with progress tracking and MBTI insights
 *
 * @version 14.0.0
 */

import React from 'react';
import { Card, CardBody, Progress, Button, Chip } from '@nextui-org/react';
import { Target, Star } from 'lucide-react';
import { useBackToBasics } from './BackToBasicsPage.provider';
import BMADColorSystem from '../../lib/bmadColorSystem';

interface LifeAreasGridProps {
  onLifeAreaClick: (areaId: string) => void;
}

export const LifeAreasGrid: React.FC<LifeAreasGridProps> = ({ onLifeAreaClick }) => {
  const {
    lifeAreas,
    lifeAreaProgress,
    mbtiInsights,
    getButtonColorFromGradient,
    getProgressColorFromGradient
  } = useBackToBasics();

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {lifeAreas.map(area => {
          const areaColorScheme = BMADColorSystem.getFunctionalColorScheme('backToBasics');
          const animationClasses = BMADColorSystem.getAnimationClasses(areaColorScheme);
          const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(areaColorScheme);

          return (
            <Card
              key={area.id}
              className={`bg-gradient-to-br ${area.color} ${glassmorphismClasses} ${animationClasses} cursor-pointer shadow-lg hover:shadow-xl`}
              onClick={() => onLifeAreaClick(area.id)}
            >
              <CardBody className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-white mb-2'>{area.displayName}</h3>
                    <p className='text-gray-100 text-sm mb-2 font-medium'>{area.description}</p>
                    <p className='text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full'>
                      💡 {area.mbtiFocus}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='text-lg font-bold text-white bg-white/20 px-3 py-1 rounded-full'>
                      {area.contentCount}
                    </div>
                    <div className='text-xs text-gray-200 mt-1'>content items</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mb-4'>
                  <div className='flex justify-between text-sm text-gray-100 mb-2'>
                    <span className='font-medium'>Voortgang</span>
                    <span className='font-bold'>{lifeAreaProgress[area.id] || 0}%</span>
                  </div>
                  <Progress
                    value={lifeAreaProgress[area.id] || 0}
                    color={getProgressColorFromGradient(area.color) as any}
                    className='mb-2'
                    classNames={{
                      track: "bg-white/20 backdrop-blur-sm",
                      indicator: "bg-white/90 shadow-lg"
                    }}
                  />
                </div>

                {/* Tags */}
                <div className='flex items-center justify-between mb-4'>
                  <Chip
                    size='sm'
                    variant='flat'
                    className='bg-white/30 backdrop-blur-sm border border-white/40 text-white font-bold shadow-md'
                  >
                    {area.difficulty}
                  </Chip>
                  <div className='flex items-center text-sm text-gray-100 bg-white/10 px-2 py-1 rounded-full'>
                    <Star className='w-4 h-4 mr-1' />
                    <span className='font-medium'>{mbtiInsights[area.id]?.length || 0} inzichten</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  size='sm'
                  className={`w-full text-white font-medium shadow-lg ${getButtonColorFromGradient(area.color)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onLifeAreaClick(area.id);
                  }}
                >
                  <Target className='w-4 h-4 mr-2' />
                  Verken Levensgebied
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
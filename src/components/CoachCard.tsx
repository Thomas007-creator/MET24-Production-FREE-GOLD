import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Star, Video, Globe, Zap } from 'lucide-react';
import { ZoomSpaceCoach } from '../services/therapistEcosystem/TherapistEcosystemService';

interface CoachCardProps {
  coach: ZoomSpaceCoach;
  onBookCoach: (coach: ZoomSpaceCoach) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach, onBookCoach }) => {
  return (
    <Card className='glass border border-white/10 hover:bg-white/10 transition-all'>
      <CardBody className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='text-3xl'>🎯</div>
            <div>
              <h3 className='font-semibold text-white'>{coach.name}</h3>
              <p className='text-sm text-gray-300'>{coach.specialty}</p>
            </div>
          </div>
          <div className='text-right'>
            <div className='flex items-center text-yellow-400'>
              <Star className='w-4 h-4 mr-1' />
              {coach.rating}
            </div>
            <div className='text-sm text-gray-400'>{coach.experienceYears} jaar</div>
          </div>
        </div>

        <p className='text-sm text-gray-300 mb-4'>{coach.bio}</p>

        <div className='space-y-2 mb-4'>
          <div className='flex items-center text-sm text-gray-400'>
            <Video className='w-4 h-4 mr-2' />
            ZoomSpace ID: {coach.zoomspaceId}
          </div>
          <div className='flex items-center text-sm text-gray-400'>
            <Globe className='w-4 h-4 mr-2' />
            {coach.languages.join(', ')}
          </div>
          <div className='flex items-center text-sm text-green-400'>
            <Zap className='w-4 h-4 mr-2' />
            Gratis sessies
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-lg font-bold text-green-400'>Gratis</div>
          <Button
            color='success'
            variant='solid'
            size='sm'
            className='bg-green-600 hover:bg-green-700'
            onClick={() => onBookCoach(coach)}
          >
            Boek Gratis Sessie
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
import React from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Star, MapPin, Clock, Globe, Shield, ExternalLink } from 'lucide-react';
import { Therapist } from '../services/therapistEcosystem/TherapistEcosystemService';

interface TherapistCardProps {
  therapist: Therapist;
  onBookTherapist: (therapist: Therapist) => void;
}

export const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onBookTherapist }) => {
  return (
    <Card className='glass border border-white/10 hover:bg-white/10 transition-all'>
      <CardBody className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center space-x-3'>
            <div className='text-3xl'>👨‍⚕️</div>
            <div>
              <h3 className='font-semibold text-white'>{therapist.name}</h3>
              <p className='text-sm text-gray-300'>{therapist.specialty}</p>
            </div>
          </div>
          <div className='text-right'>
            <div className='flex items-center text-yellow-400'>
              <Star className='w-4 h-4 mr-1' />
              {therapist.rating}
            </div>
            <div className='text-sm text-gray-400'>{therapist.experienceYears} jaar</div>
          </div>
        </div>

        <p className='text-sm text-gray-300 mb-4'>{therapist.bio}</p>

        <div className='space-y-2 mb-4'>
          <div className='flex items-center text-sm text-gray-400'>
            <MapPin className='w-4 h-4 mr-2' />
            {therapist.location}
          </div>
          <div className='flex items-center text-sm text-gray-400'>
            <Clock className='w-4 h-4 mr-2' />
            Flexibel
          </div>
          <div className='flex items-center text-sm text-gray-400'>
            <Globe className='w-4 h-4 mr-2' />
            {therapist.languages.join(', ')}
          </div>
          {therapist.isExistingPractice && (
            <div className='flex items-center text-sm text-green-400'>
              <Shield className='w-4 h-4 mr-2' />
              Erkende praktijk
            </div>
          )}
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-lg font-bold text-white'>€{therapist.consultationFee}/uur</div>
          <Button
            color='primary'
            variant='solid'
            size='sm'
            className='bg-purple-600 hover:bg-purple-700'
            onClick={() => onBookTherapist(therapist)}
            endContent={<ExternalLink className='w-4 h-4' />}
          >
            Boek Sessie
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
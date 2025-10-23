import React from 'react';
import { Card, CardBody, Button, Input } from '@nextui-org/react';
import { Search, Filter, Star, MapPin, Clock, Globe, Shield, ExternalLink } from 'lucide-react';
import { useTherapistPage } from './TherapistPage.provider';

export const FindTherapistView: React.FC = () => {
  const { searchQuery, setSearchQuery, therapists, handleBookTherapist } = useTherapistPage();

  const filteredTherapists = therapists.filter(therapist =>
    therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    therapist.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      {/* Search and Filters */}
      <div className='glass rounded-xl p-6'>
        <div className='flex flex-col md:flex-row gap-4 mb-4'>
          <Input
            placeholder='Zoek therapeuten...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startContent={<Search className='w-4 h-4' />}
            className='flex-1'
          />
          <Button
            color='primary'
            variant='bordered'
            startContent={<Filter className='w-4 h-4' />}
            className='border-purple-400 text-purple-400'
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Therapists List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredTherapists.map((therapist) => (
          <Card key={therapist.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
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
                  onClick={() => handleBookTherapist(therapist)}
                  endContent={<ExternalLink className='w-4 h-4' />}
                >
                  Boek Sessie
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
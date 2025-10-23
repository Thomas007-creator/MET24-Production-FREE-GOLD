import React from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { useMainView } from './MainView.provider';

const HolisticWellnessCard: React.FC = () => {
  const { handleFeatureClick } = useMainView();

  return (
    <Card 
      className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-teal-500 focus-within:ring-offset-2' 
      role='article' 
      aria-labelledby='holistic-wellness-title'
    >
      <CardHeader>
        <h3 id='holistic-wellness-title' className='text-xl font-bold'>
          🌿 Holistische Wellness
        </h3>
      </CardHeader>
      <CardBody>
        <p className='mb-4'>
          Uitgebreide wellness analyse met AI inzichten en gepersonaliseerde aanbevelingen
        </p>
        <Button 
          color='primary' 
          variant='solid' 
          onClick={() => handleFeatureClick('holistic-wellness')} 
          className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2' 
          aria-label='Start holistische wellness analyse'
        >
          Start Wellness Analyse
        </Button>
      </CardBody>
    </Card>
  );
};

export default HolisticWellnessCard;

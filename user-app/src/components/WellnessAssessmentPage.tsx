import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

const WellnessAssessmentPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-5'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white'>
            💚 Wellness Assessment
          </h1>
          <p className='text-white/70'>
            Analyseer je welzijn en krijg gepersonaliseerde aanbevelingen
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white mb-6'>
          <CardHeader className='text-center'>
            <h2 className='text-2xl font-bold'>🚧 In Ontwikkeling</h2>
          </CardHeader>
          <CardBody className='text-center'>
            <div className='text-6xl mb-4'>💚</div>
            <p className='text-lg mb-4'>
              De Wellness Assessment functionaliteit wordt momenteel ontwikkeld.
            </p>
            <p className='text-white/70 mb-6'>
              Hier kun je straks je welzijn analyseren en gepersonaliseerde
              aanbevelingen krijgen.
            </p>
          </CardBody>
        </Card>

        {/* Feature Preview */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                ❤️ Fysiek Welzijn
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Analyse van slaap, voeding, beweging en energie niveaus.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                🧠 Mentale Gezondheid
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Stress management, emotionele balans en cognitieve functies.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                🏃‍♂️ Sociale Verbinding
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Relaties, communicatie en sociale ondersteuning.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📈 Persoonlijke Groei
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Doelen, passies en levensdoel identificatie.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WellnessAssessmentPage;

import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

const CommunityPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-5'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-white'>👥 Community</h1>
          <p className='text-white/70'>
            Verbind met andere gebruikers en deel je ervaringen
          </p>
        </div>

        {/* Coming Soon Card */}
        <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white mb-6'>
          <CardHeader className='text-center'>
            <h2 className='text-2xl font-bold'>🚧 In Ontwikkeling</h2>
          </CardHeader>
          <CardBody className='text-center'>
            <div className='text-6xl mb-4'>👥</div>
            <p className='text-lg mb-4'>
              De Community functionaliteit wordt momenteel ontwikkeld.
            </p>
            <p className='text-white/70 mb-6'>
              Hier kun je straks verbinden met andere gebruikers en je
              ervaringen delen.
            </p>
          </CardBody>
        </Card>

        {/* Community Features Preview */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                🌟 Groepen
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Sluit je aan bij thematische groepen en ontmoet gelijkgestemden.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📝 Forums
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Deel je vragen en ervaringen in openbare discussies.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                🎯 Events
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Neem deel aan online en offline community events.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                🤝 Mentoring
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Vind een mentor of word mentor voor andere gebruikers.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📊 Leaderboards
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Vergelijk je prestaties en vier successen samen.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                🎁 Beloningen
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Verdien badges en beloningen voor community deelname.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

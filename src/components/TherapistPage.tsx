import React from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@nextui-org/react';
import { TherapistPageProvider, useTherapistPage } from './TherapistPage.provider';
import { TherapistHeader } from './TherapistHeader';
import { MBTITherapyFocus } from './MBTITherapyFocus';
import { TherapistNavigation } from './TherapistNavigation';
import { TherapistQuickActions } from './TherapistQuickActions';
import { AITherapyView } from './AITherapyView';
import { FindTherapistView } from './FindTherapistView';
import { CoachesView } from './CoachesView';
import { TherapySessionsView } from './TherapySessionsView';

const TherapistPageContent: React.FC = () => {
  const { currentView, loading } = useTherapistPage();

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-slate-900/20 p-6 flex items-center justify-center'>
        <div className='text-center'>
          <Spinner size='lg' color='primary' />
          <p className='text-white mt-4'>Laden van therapeut ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-slate-900/20 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <TherapistHeader />

        {/* MBTI Therapy Focus */}
        <MBTITherapyFocus />

        {/* Navigation Tabs */}
        <TherapistNavigation />

        {/* Main Content Area */}
        {currentView === 'overview' && (
          <div className='space-y-6'>
            {/* Quick Actions */}
            <TherapistQuickActions />

            {/* MBTI-Specific Therapy Recommendations */}
            <div className='glass rounded-xl p-6'>
              <h2 className='text-2xl font-semibold text-white mb-4'>
                🎯 Aanbevolen therapieën
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Emotionele Expressie</h3>
                  <p className='text-sm text-gray-300'>Leer je gevoelens creatief te uiten en te verwerken.</p>
                </div>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Grenzen Stellen</h3>
                  <p className='text-sm text-gray-300'>Ontwikkel gezonde grenzen zonder je authenticiteit te verliezen.</p>
                </div>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Creativiteit & Zelfexpressie</h3>
                  <p className='text-sm text-gray-300'>Verbind je innerlijke wereld met creatieve uitdrukking.</p>
                </div>
                <div className='p-4 bg-white/5 rounded-lg'>
                  <h3 className='font-medium text-white mb-2'>Waarden & Authenticiteit</h3>
                  <p className='text-sm text-gray-300'>Verken je kernwaarden en leef authentiek.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Therapy View */}
        {currentView === 'ai-therapy' && <AITherapyView />}

        {/* Find Therapist View */}
        {currentView === 'find-therapist' && <FindTherapistView />}

        {/* Coaches View */}
        {currentView === 'coaches' && <CoachesView />}

        {/* Sessions View */}
        {currentView === 'sessions' && <TherapySessionsView />}

        {/* Service Types Preview */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                👤 Psychotherapie
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Professionele therapie voor mentale gezondheid en welzijn.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                💬 Life Coaching
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Persoonlijke begeleiding voor doelen en persoonlijke groei.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📅 Online Sessies
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Flexibele online begeleiding vanuit je eigen omgeving.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                ⭐ MBTI Specialisten
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Coaches gespecialiseerd in persoonlijkheidstype ontwikkeling.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                📍 Lokale Praktijken
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Therapeuten en coaches in jouw buurt.
              </p>
            </CardBody>
          </Card>

          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 text-white'>
            <CardHeader>
              <h3 className='text-xl font-bold flex items-center gap-2'>
                ❤️ Wellness Coaches
              </h3>
            </CardHeader>
            <CardBody>
              <p className='text-white/80'>
                Specialisten in holistische gezondheid en welzijn.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TherapistPage: React.FC = () => {
  return (
    <TherapistPageProvider>
      <TherapistPageContent />
    </TherapistPageProvider>
  );
};

export default TherapistPage;
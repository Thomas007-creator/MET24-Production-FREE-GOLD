import React from 'react';
import { Card, CardBody, Button, Chip } from '@nextui-org/react';
import { useTherapistPage } from './TherapistPage.provider';

export const TherapySessionsView: React.FC = () => {
  const { therapySessions, mbtiType, handleStartTherapySession } = useTherapistPage();

  const filteredSessions = therapySessions.filter(session =>
    session.mbtiFocus.includes(mbtiType) ||
    session.mbtiFocus.includes('ALL')
  );

  return (
    <div className='space-y-6'>
      <div className='glass rounded-xl p-6'>
        <h2 className='text-2xl font-semibold text-white mb-4'>
          📅 Therapie Sessies
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredSessions.map((session) => (
            <Card key={session.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
              <CardBody className='p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <h3 className='font-semibold text-white'>{session.title}</h3>
                    <p className='text-sm text-gray-300'>{session.description}</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm text-gray-400'>{session.duration} min</div>
                    <Chip
                      size='sm'
                      variant='flat'
                      className='bg-white/10 text-white'
                    >
                      {session.difficulty}
                    </Chip>
                  </div>
                </div>
                <Button
                  color='primary'
                  variant='solid'
                  size='sm'
                  className='w-full bg-purple-600 hover:bg-purple-700'
                  onClick={() => handleStartTherapySession(session)}
                >
                  Start Sessie
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
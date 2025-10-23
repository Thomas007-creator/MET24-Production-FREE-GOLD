import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { useTherapistPage } from './TherapistPage.provider';

export const TherapistQuickActions: React.FC = () => {
  const { setCurrentView } = useTherapistPage();

  const quickActions = [
    {
      id: 'ai-therapy',
      icon: '🤖',
      title: 'AI Therapie',
      description: 'Directe AI-coaching sessies'
    },
    {
      id: 'find-therapist',
      icon: '👨‍⚕️',
      title: 'Therapeuten',
      description: 'Professionele begeleiding'
    },
    {
      id: 'coaches',
      icon: '🎯',
      title: 'Coaches',
      description: 'Gratis online begeleiding'
    },
    {
      id: 'sessions',
      icon: '📅',
      title: 'Sessies',
      description: 'Geplande afspraken'
    },
    {
      id: 'resources',
      icon: '📚',
      title: 'Resources',
      description: 'Therapie materialen'
    }
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {quickActions.map((action) => (
        <Card
          key={action.id}
          className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer'
          onClick={() => action.id !== 'resources' && setCurrentView(action.id as any)}
        >
          <CardBody className='p-6 text-center'>
            <div className='text-4xl mb-3'>{action.icon}</div>
            <h3 className='font-semibold text-white mb-2'>{action.title}</h3>
            <p className='text-sm text-gray-300'>{action.description}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};
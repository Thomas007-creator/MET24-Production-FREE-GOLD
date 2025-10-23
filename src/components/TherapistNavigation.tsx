import React from 'react';
import { Button } from '@nextui-org/react';
import { useTherapistPage } from './TherapistPage.provider';

export const TherapistNavigation: React.FC = () => {
  const { currentView, setCurrentView } = useTherapistPage();

  const tabs = [
    { id: 'overview', label: 'Overzicht', icon: '🏠' },
    { id: 'ai-therapy', label: 'AI Therapie', icon: '🤖' },
    { id: 'find-therapist', label: 'Therapeuten', icon: '👨‍⚕️' },
    { id: 'coaches', label: 'Coaches', icon: '🎯' },
    { id: 'sessions', label: 'Sessies', icon: '📅' }
  ] as const;

  return (
    <div className='flex justify-center mb-8'>
      <div className='glass rounded-xl p-2'>
        <div className='flex space-x-2'>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentView === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className='mr-2'>{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
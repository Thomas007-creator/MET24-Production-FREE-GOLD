import React from 'react';
import { Button } from '@nextui-org/react';
import { useCommunities } from './CommunitiesPage.provider';

export const CommunitiesNavigation: React.FC = () => {
  const { currentView, setCurrentView } = useCommunities();

  const tabs = [
    { id: 'communities', label: 'Community\'s', icon: '👥' },
    { id: 'posts', label: 'Posts', icon: '📝' },
    { id: 'trending', label: 'Trending', icon: '🔥' }
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
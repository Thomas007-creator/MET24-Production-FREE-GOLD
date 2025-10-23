import React from 'react';
import { Button } from '@nextui-org/react';
import { MessageCircle, Users, TrendingUp } from 'lucide-react';
import { useCommunities } from './CommunitiesPage.provider';

export const DiscourseLiveCommunity: React.FC = () => {
  const {
    navigateToDiscourseChat,
    navigateToDiscourseCommunities,
    navigateToDiscourseChallenges,
    mbtiType
  } = useCommunities();

  return (
    <div className='glass rounded-xl p-6 mb-8 border-2 border-purple-500/50'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center space-x-4'>
          <div className='text-4xl'>🌐</div>
          <div>
            <h2 className='text-2xl font-bold text-white mb-2'>
              🚀 Live Community Platform
            </h2>
            <p className='text-gray-300'>
              Chat, deel en leer van de volledige MET24 community via ons Discourse platform
            </p>
          </div>
        </div>
        <div className='text-center'>
          <div className='text-green-400 text-sm font-semibold mb-1'>● LIVE</div>
          <div className='text-gray-400 text-xs'>Real-time chat</div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Button
          color='primary'
          variant='solid'
          size='lg'
          startContent={<MessageCircle />}
          onClick={navigateToDiscourseChat}
          className='bg-purple-600 hover:bg-purple-700 text-white font-semibold'
        >
          💬 {mbtiType} Chat
        </Button>

        <Button
          color='success'
          variant='solid'
          size='lg'
          startContent={<Users />}
          onClick={navigateToDiscourseCommunities}
          className='bg-green-600 hover:bg-green-700 text-white font-semibold'
        >
          👥 Communities
        </Button>

        <Button
          color='warning'
          variant='solid'
          size='lg'
          startContent={<TrendingUp />}
          onClick={navigateToDiscourseChallenges}
          className='bg-orange-600 hover:bg-orange-700 text-white font-semibold'
        >
          🎯 Challenges
        </Button>
      </div>

      <div className='mt-4 p-3 bg-white/5 rounded-lg'>
        <p className='text-sm text-gray-300 text-center'>
          🔗 <strong>Naadloos geïntegreerd:</strong> Je MET24 profiel en voortgang zijn automatisch gekoppeld
        </p>
      </div>
    </div>
  );
};
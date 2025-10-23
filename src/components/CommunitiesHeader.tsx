import React from 'react';
import { Button } from '@nextui-org/react';
import { ArrowLeft, Home, MessageCircle } from 'lucide-react';
import { useCommunities } from './CommunitiesPage.provider';

export const CommunitiesHeader: React.FC = () => {
  const { userName, mbtiType } = useCommunities();

  const handleBackToMain = () => {
    window.history.back();
  };

  return (
    <div className='flex items-center justify-between mb-8'>
      <div>
        <h1 className='text-3xl font-bold text-white mb-2'>
          👥 MBTI Community's
        </h1>
        <p className='text-gray-300'>
          Welkom {userName}! Verbind met andere {mbtiType} types en deel je inzichten
        </p>
      </div>
      <div className='flex gap-3'>
        <Button
          color='secondary'
          variant='bordered'
          startContent={<ArrowLeft />}
          onClick={handleBackToMain}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Terug
        </Button>
        <Button
          color='primary'
          variant='bordered'
          startContent={<Home />}
          onClick={() => window.location.href = '/'}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Hoofdmenu
        </Button>
        <Button
          color='primary'
          variant='bordered'
          startContent={<MessageCircle />}
          onClick={() => window.location.href = '/chat'}
          className='bg-white/10 border-white/20 text-white hover:bg-white/20'
        >
          Persoonlijke Chats
        </Button>
      </div>
    </div>
  );
};
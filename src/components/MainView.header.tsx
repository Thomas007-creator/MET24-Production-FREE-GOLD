import React from 'react';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useMainView } from './MainView.provider';
import { useI18n } from '../hooks/useI18n';

export const MainViewHeader: React.FC = () => {
  const navigate = useNavigate();
  const { userName, mbtiType } = useMainView();
  const { t } = useI18n();

  return (
    <header className='text-center mb-8'>
      <h1
        id='mainview-title'
        className='text-4xl font-bold text-white mb-3'
      >
        🏠 MainView
      </h1>
      <p className='text-lg text-[#e0e0e0]'>
        {t('common.welcome', { userName })} ({mbtiType})
      </p>

      {/* Streamlined Version Switch */}
      <div className='mt-4'>
        <Button
          onClick={() => navigate('/streamlined')}
          className='bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm'
          size='sm'
        >
          ✨ Try Streamlined MainView (Perfect Balance)
        </Button>
      </div>
    </header>
  );
};
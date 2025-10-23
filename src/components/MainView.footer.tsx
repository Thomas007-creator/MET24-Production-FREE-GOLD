import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainView } from './MainView.provider';
import { FooterButton } from './FooterButton';

const FooterInfo: React.FC = () => {
  const { userData } = useMainView();

  return (
    <div className='text-center py-4'>
      <div className='text-xs text-gray-400 mb-1'>
        {userData?.mbtiType ? `Welkom ${userData.mbtiType}` : 'Welkom bij MET24'}
      </div>
      <div className='text-xs text-gray-500'>
        Ontdek je potentieel • Groei samen • Transformeer je leven
      </div>
    </div>
  );
};

// Main Footer Component
export const MainViewFooter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer
      role='contentinfo'
      aria-labelledby='footer-navigation-title'
      className='bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border-t border-[rgba(100,223,223,0.2)] rounded-t-2xl p-4'
    >
      <h2 id='footer-navigation-title' className='sr-only'>
        Footer navigatie
      </h2>

      <div className='flex gap-3 mb-4'>
        <FooterButton
          onClick={() => navigate('/community')}
          icon="👥"
          label="Community"
          ariaLabel="Ga naar community"
        />
        <FooterButton
          onClick={() => navigate('/challenges')}
          icon="🏆"
          label="Challenges"
          ariaLabel="Bekijk challenges"
        />
      </div>

      <FooterInfo />
    </footer>
  );
};
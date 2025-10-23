import React from 'react';
import { MainViewProvider } from './MainView.provider';
import { MainViewHeader } from './MainView.header';
import { MainViewNavigation } from './MainView.navigation';
import { MainViewFeatureCards } from './MainView.feature-cards';
import { MainViewContentDiscovery } from './MainView.content-discovery';
import { MainViewBackgroundServices } from './MainView.background-services';
import { MainViewFooter } from './MainView.footer';

const MainViewContent: React.FC = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      {/* Skip to main content link for accessibility */}
      <a
        href='#main-content'
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50'
      >
        Ga naar hoofdinhoud
      </a>

      <div className='container mx-auto px-4 py-6 max-w-7xl'>
        {/* Main content anchor for skip link */}
        <div id='main-content' />

        {/* Header Section */}
        <MainViewHeader />

        {/* Navigation Section */}
        <MainViewNavigation />

        {/* Feature Cards Grid */}
        <MainViewFeatureCards />

        {/* Content Discovery & AI Coaching */}
        <MainViewContentDiscovery />

        {/* Background Services Status */}
        <MainViewBackgroundServices />

        {/* Footer */}
        <MainViewFooter />
      </div>
    </div>
  );
};

const MainView: React.FC = () => {
  return (
    <MainViewProvider>
      <MainViewContent />
    </MainViewProvider>
  );
};

export default MainView;

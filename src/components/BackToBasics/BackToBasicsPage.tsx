/**
 * BackToBasics Page - BMAD Composition Root
 *
 * Composition root for Back to Basics features using BMAD architecture
 *
 * @version 14.0.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackToBasicsProvider, useBackToBasics } from './BackToBasicsPage.provider';
import { BackToBasicsHeader } from './BackToBasicsHeader';
import { ContentDiscoveryProvider } from './ContentDiscoveryCarousel.provider';
import { ContentDiscoveryCarousel } from './ContentDiscoveryCarousel';
import { LifeAreasGrid } from './LifeAreasGrid';
import { BackToBasicsInfoSection } from './BackToBasicsInfoSection';

const BackToBasicsContent: React.FC = () => {
  const navigate = useNavigate();
  const { mbtiType, handleLifeAreaClick } = useBackToBasics();

  const handleBackToMain = () => {
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLifeAreaNavigation = (areaId: string) => {
    navigate(`/levensgebied/${areaId}`);
  };

  const handleContentClick = (content: any) => {
    console.log('Content clicked:', content.title);
    // TODO: Navigate to content detail page
  };

  return (
    <div className='min-h-screen'>
      <BackToBasicsHeader
        onBackToMain={handleBackToMain}
        onHomeClick={handleHomeClick}
      />

      {/* Content Discovery Carousel */}
      <div className='max-w-7xl mx-auto p-6'>
        <ContentDiscoveryProvider
          mbtiType={mbtiType}
          onContentClick={handleContentClick}
        >
          <div className='glass rounded-xl p-6 mb-8'>
            <ContentDiscoveryCarousel
              mbtiType={mbtiType}
              onContentClick={handleContentClick}
            />
          </div>
        </ContentDiscoveryProvider>
      </div>

      {/* Life Areas Grid */}
      <LifeAreasGrid onLifeAreaClick={handleLifeAreaNavigation} />

      {/* Info Section */}
      <div className='max-w-7xl mx-auto p-6'>
        <BackToBasicsInfoSection />
      </div>
    </div>
  );
};

const BackToBasicsPage: React.FC = () => {
  return (
    <BackToBasicsProvider>
      <BackToBasicsContent />
    </BackToBasicsProvider>
  );
};

export default BackToBasicsPage;

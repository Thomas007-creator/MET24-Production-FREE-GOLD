import React from 'react';
import { useMainView } from './MainView.provider';
import { FeatureCard } from './FeatureCard';
import { AICoachingCard } from './MainView.feature-cards';

const ContentDiscoveryCard: React.FC = () => {
  const { handleFeatureClick } = useMainView();

  const discoveryContent = (
    <div className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xl' aria-hidden='true'>
          📚
        </span>
        <span className='font-bold text-sm'>
          AI Aanbevolen Content
        </span>
      </div>

      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
          <span>MBTI Insights</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
          <span>Groeioefeningen</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-green-400 rounded-full'></div>
          <span>Community Posts</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-orange-400 rounded-full'></div>
          <span>Persoonlijke Tips</span>
        </div>
      </div>
    </div>
  );

  return (
    <FeatureCard
      title="Content Discovery"
      description="Ontdek gepersonaliseerde content gebaseerd op je MBTI type en interesses"
      icon="🔍"
      buttonText="Ontdek Content"
      onClick={() => handleFeatureClick('content-discovery')}
      variant="primary"
      extraContent={discoveryContent}
      ariaLabel="Ontdek gepersonaliseerde content"
    />
  );
};

// Main Content Discovery Component
export const MainViewContentDiscovery: React.FC = () => {
  return (
    <section
      aria-labelledby='content-discovery-section-title'
      className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'
    >
      <h2 id='content-discovery-section-title' className='sr-only'>
        Content Discovery & AI Coaching
      </h2>

      <ContentDiscoveryCard />
      <AICoachingCard variant="grid" />
    </section>
  );
};
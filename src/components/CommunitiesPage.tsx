import React from 'react';
import { CommunitiesProvider, useCommunities } from './CommunitiesPage.provider';
import { CommunitiesHeader } from './CommunitiesHeader';
import { MBTICommunityFocus } from './MBTICommunityFocus';
import { DiscourseLiveCommunity } from './DiscourseLiveCommunity';
import { CommunitiesNavigation } from './CommunitiesNavigation';
import { CommunitiesGrid } from './CommunitiesGrid';
import { CommunityPosts } from './CommunityPosts';
import { TrendingTopics } from './TrendingTopics';

const CommunitiesPageContent: React.FC = () => {
  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-7xl mx-auto'>
        <CommunitiesHeader />

        <MBTICommunityFocus />

        <DiscourseLiveCommunity />

        <CommunitiesNavigation />

        {/* Main Content Area */}
        <MainContent />
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentView } = useCommunities();

  return (
    <>
      {currentView === 'communities' && <CommunitiesGrid />}
      {currentView === 'posts' && <CommunityPosts />}
      {currentView === 'trending' && <TrendingTopics />}
    </>
  );
};

export const CommunitiesPage: React.FC = () => {
  return (
    <CommunitiesProvider>
      <CommunitiesPageContent />
    </CommunitiesProvider>
  );
};

export default CommunitiesPage;

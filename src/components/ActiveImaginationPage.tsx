/**
 * Active Imagination Page - BMAD Composition Root
 *
 * Composition root for Active Imagination features using BMAD architecture
 *
 * @version 14.0.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveImaginationProvider } from './ActiveImaginationPage.provider';
import { ImaginationHeader } from './ImaginationHeader';
import { SessionManager } from './SessionManager';
import { ImaginationVideo } from './ImaginationVideo';
import { ImaginationPrompt } from './ImaginationPrompt';
import { AI1Support } from './AI1Support';
import { ImaginationTextarea } from './ImaginationTextarea';
import { AIResponseDisplay } from './AIResponseDisplay';
import { InspirationsOverview } from './InspirationsOverview';
import { DeveloperTools } from './DeveloperTools';
import { NavigationActions } from './NavigationActions';
import { StatisticsModal } from './StatisticsModal';

interface ActiveImaginationPageProps {
  userName?: string;
  mbtiType?: string;
  onBackToMain?: () => void;
}

export const ActiveImaginationPage: React.FC<ActiveImaginationPageProps> = ({
  userName = 'Gebruiker',
  mbtiType = 'INFP',
  onBackToMain
}) => {
  const navigate = useNavigate();
  const handleBackToMain = onBackToMain || (() => navigate('/'));
  return (
    <ActiveImaginationProvider mbtiType={mbtiType}>
      <div
        className="active-imagination-page"
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          minHeight: '100vh',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
        }}
      >
        {/* 1. Header & Navigatie Component */}
        <ImaginationHeader
          userName={userName}
          mbtiType={mbtiType}
          onBackToMain={handleBackToMain}
        />

        {/* Active Session Content */}
        <ImaginationVideo />
        <ImaginationPrompt mbtiType={mbtiType} />
        <ImaginationTextarea mbtiType={mbtiType} />
        <AIResponseDisplay />
        <AI1Support mbtiType={mbtiType} />

        {/* Session Management */}
        <SessionManager mbtiType={mbtiType} />

        {/* Additional Features */}
        <InspirationsOverview />
        <DeveloperTools />

        {/* Navigation Actions */}
        <NavigationActions onBackToMain={handleBackToMain} />

        {/* Statistics Modal */}
        <StatisticsModal />
      </div>
    </ActiveImaginationProvider>
  );
};

export default ActiveImaginationPage;

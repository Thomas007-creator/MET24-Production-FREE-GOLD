import React from 'react';
import { EnhancedLevensgebiedDetailPageProvider, useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';
import { EnhancedLevensgebiedDetailPageHeader } from './EnhancedLevensgebiedDetailPage.header';
import { EnhancedLevensgebiedDetailPageTabs } from './EnhancedLevensgebiedDetailPage.tabs';

const EnhancedLevensgebiedDetailPageContent: React.FC = () => {
  const { area, navigateBack } = useEnhancedLevensgebiedDetailPage();

  // Handle area not found
  if (!area) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Levensgebied niet gevonden</h1>
          <button
            onClick={navigateBack}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
          >
            Terug naar Overzicht
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <EnhancedLevensgebiedDetailPageHeader />
      <EnhancedLevensgebiedDetailPageTabs />
    </div>
  );
};

const EnhancedLevensgebiedDetailPage: React.FC = () => {
  return (
    <EnhancedLevensgebiedDetailPageProvider>
      <EnhancedLevensgebiedDetailPageContent />
    </EnhancedLevensgebiedDetailPageProvider>
  );
};

export default EnhancedLevensgebiedDetailPage;

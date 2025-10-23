/**
 * Levensgebied Detail Page - BMAD Composition Root
 *
 * Composition root for Levensgebied Detail features using BMAD architecture
 *
 * @version 14.0.0
 */

import React from 'react';
import { LevensgebiedDetailProvider, useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';
import { LevensgebiedDetailHeader } from './LevensgebiedDetailHeader';
import { LevensgebiedDetailTabs } from './LevensgebiedDetailTabs';

const LevensgebiedDetailContent: React.FC = () => {
  const { areaData, handleBackToBasics } = useLevensgebiedDetail();

  if (!areaData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Levensgebied niet gevonden
          </h1>
          <p className="text-gray-300 mb-6">
            Het opgevraagde levensgebied kon niet worden gevonden.
          </p>
          <button
            onClick={handleBackToBasics}
            className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Terug naar Basics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <LevensgebiedDetailHeader />
      <LevensgebiedDetailTabs />
    </div>
  );
};

const LevensgebiedDetailPage: React.FC = () => {
  return (
    <LevensgebiedDetailProvider>
      <LevensgebiedDetailContent />
    </LevensgebiedDetailProvider>
  );
};

export default LevensgebiedDetailPage;

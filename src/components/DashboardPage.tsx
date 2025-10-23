import React from 'react';
import { DashboardProvider } from './DashboardPage.provider';
import { DashboardHeader } from './DashboardHeader';
import { DashboardStats } from './DashboardStats';
import { DashboardLifeAreas } from './DashboardLifeAreas';
import { DashboardRecentActivity } from './DashboardRecentActivity';

const DashboardPageContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        <DashboardStats />
        <DashboardLifeAreas />
        <DashboardRecentActivity />
      </div>
    </div>
  );
};

export const DashboardPage: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardPageContent />
    </DashboardProvider>
  );
};

export default DashboardPage;
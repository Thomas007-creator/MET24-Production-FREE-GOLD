import React from 'react';
import { EnhancedJournalingProvider } from './EnhancedJournalingPage.provider';
import { JournalingHeader } from './JournalingHeader';
import { QuickActions } from './QuickActions';
import { MoodTracker } from './MoodTracker';
import { RecentEntries } from './RecentEntries';
import { DailyGoals } from './DailyGoals';
import { JournalingAnalytics } from './JournalingAnalytics';
import { EntryModal } from './EntryModal';
import { GoalModal } from './GoalModal';

const EnhancedJournalingPageContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <JournalingHeader />

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MoodTracker />
            <RecentEntries />
          </div>

          <div className="space-y-6">
            <DailyGoals />
            <JournalingAnalytics />
          </div>
        </div>

        <EntryModal />
        <GoalModal />
      </div>
    </div>
  );
};

export const EnhancedJournalingPage: React.FC = () => {
  return (
    <EnhancedJournalingProvider>
      <EnhancedJournalingPageContent />
    </EnhancedJournalingProvider>
  );
};

export default EnhancedJournalingPage;

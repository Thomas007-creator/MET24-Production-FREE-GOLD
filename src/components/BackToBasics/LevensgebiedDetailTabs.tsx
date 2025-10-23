/**
 * Levensgebied Detail Tabs Component
 *
 * Main tabs component that combines all tab content
 *
 * @version 14.0.0
 */

import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import {
  BarChart3,
  BookOpen,
  Users,
  MessageCircle,
  Bot
} from 'lucide-react';
import { useLevensgebiedDetail } from './LevensgebiedDetailPage.provider';
import { LevensgebiedDetailOverviewTab } from './LevensgebiedDetailOverviewTab';
import { LevensgebiedDetailQuestionnaireTab } from './LevensgebiedDetailQuestionnaireTab';
import { LevensgebiedDetailExercisesTab } from './LevensgebiedDetailExercisesTab';
import { LevensgebiedDetailCommunityTab } from './LevensgebiedDetailCommunityTab';
import { LevensgebiedDetailAICoachingTab } from './LevensgebiedDetailAICoachingTab';

export const LevensgebiedDetailTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useLevensgebiedDetail();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="w-full"
        color="primary"
        variant="underlined"
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overzicht
            </div>
          }
        >
          <LevensgebiedDetailOverviewTab />
        </Tab>

        <Tab
          key="questionnaire"
          title={
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Vragenlijst
            </div>
          }
        >
          <LevensgebiedDetailQuestionnaireTab />
        </Tab>

        <Tab
          key="exercises"
          title={
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Oefeningen
            </div>
          }
        >
          <LevensgebiedDetailExercisesTab />
        </Tab>

        <Tab
          key="community"
          title={
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Community
            </div>
          }
        >
          <LevensgebiedDetailCommunityTab />
        </Tab>

        <Tab
          key="ai-coaching"
          title={
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Coaching
            </div>
          }
        >
          <LevensgebiedDetailAICoachingTab />
        </Tab>
      </Tabs>
    </div>
  );
};
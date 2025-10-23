import React from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import { useEnhancedLevensgebiedDetailPage } from './EnhancedLevensgebiedDetailPage.provider';
import { EnhancedLevensgebiedDetailPageOverviewTab } from './EnhancedLevensgebiedDetailPage.overview-tab';
import { EnhancedLevensgebiedDetailPageQuestionnaireTab } from './EnhancedLevensgebiedDetailPage.questionnaire-tab';
import { EnhancedLevensgebiedDetailPageResourcesTab } from './EnhancedLevensgebiedDetailPage.resources-tab';
import { EnhancedLevensgebiedDetailPageCommunityTab } from './EnhancedLevensgebiedDetailPage.community-tab';

export const EnhancedLevensgebiedDetailPageTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useEnhancedLevensgebiedDetailPage();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <EnhancedLevensgebiedDetailPageOverviewTab />;
      case 'questionnaire':
        return <EnhancedLevensgebiedDetailPageQuestionnaireTab />;
      case 'resources':
        return <EnhancedLevensgebiedDetailPageResourcesTab />;
      case 'community':
        return <EnhancedLevensgebiedDetailPageCommunityTab />;
      default:
        return <EnhancedLevensgebiedDetailPageOverviewTab />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mb-6"
        classNames={{
          tabList: "bg-white/10 backdrop-blur-xl",
          tab: "text-white data-[selected=true]:text-white",
          cursor: "bg-purple-600",
        }}
      >
        <Tab key="overview" title="Overzicht" />
        <Tab key="questionnaire" title="Vragenlijst" />
        <Tab key="resources" title="Resources" />
        <Tab key="community" title="Community" />
      </Tabs>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};
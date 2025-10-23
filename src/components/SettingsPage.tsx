import React from 'react';
import { SettingsPageProvider } from './SettingsPage.provider';
import { SettingsPageHeader } from './SettingsPage.header';
import { SettingsPageTabsNavigation } from './SettingsPage.tabs-navigation';
import { SettingsPageNotificationsTab } from './SettingsPage.notifications-tab';
import { SettingsPagePrivacyTab } from './SettingsPage.privacy-tab';
import { SettingsPageAppTab } from './SettingsPage.app-tab';
import { SettingsPageSecurityTab } from './SettingsPage.security-tab';
import { SettingsPageDataTab } from './SettingsPage.data-tab';
import { SettingsPageAIServicesTab } from './SettingsPage.ai-services-tab';
import { SettingsPageModals } from './SettingsPage.modals';
import { useSettingsPage } from './SettingsPage.provider';

const SettingsPageContent: React.FC = () => {
  const { activeTab } = useSettingsPage();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'notifications':
        return <SettingsPageNotificationsTab />;
      case 'privacy':
        return <SettingsPagePrivacyTab />;
      case 'app':
        return <SettingsPageAppTab />;
      case 'security':
        return <SettingsPageSecurityTab />;
      case 'data':
        return <SettingsPageDataTab />;
      case 'ai_services':
        return <SettingsPageAIServicesTab />;
      default:
        return <SettingsPageNotificationsTab />;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <SettingsPageHeader />
        <SettingsPageTabsNavigation />
        {renderActiveTab()}
        <SettingsPageModals />
      </div>
    </div>
  );
};

export const SettingsPage: React.FC = () => {
  return (
    <SettingsPageProvider>
      <SettingsPageContent />
    </SettingsPageProvider>
  );
};

export default SettingsPage;
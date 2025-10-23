import React from 'react';
import { Button } from '@nextui-org/react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageTabsNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useSettingsPage();

  const tabs = [
    { id: 'notifications', label: 'Notificaties', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'app', label: 'App', icon: '⚙️' },
    { id: 'security', label: 'Beveiliging', icon: '🛡️' },
    { id: 'data', label: 'Data', icon: '💾' },
    { id: 'ai_services', label: 'AI Services', icon: '🤖' }
  ];

  return (
    <div className="flex justify-center mb-6">
      <div className="glass rounded-xl p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
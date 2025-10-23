import React from 'react';
import { Card, CardHeader, CardBody, Switch, Divider } from '@nextui-org/react';
import { Bell } from 'lucide-react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageNotificationsTab: React.FC = () => {
  const { notifications, updateNotifications } = useSettingsPage();

  return (
    <div className="space-y-6">
      <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificatie Instellingen
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notificaties</p>
              <p className="text-sm text-gray-400">Ontvang notificaties op je apparaat</p>
            </div>
            <Switch
              isSelected={notifications.pushNotifications}
              onValueChange={(value) => updateNotifications({ pushNotifications: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notificaties</p>
              <p className="text-sm text-gray-400">Ontvang updates via email</p>
            </div>
            <Switch
              isSelected={notifications.emailNotifications}
              onValueChange={(value) => updateNotifications({ emailNotifications: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Challenge Herinneringen</p>
              <p className="text-sm text-gray-400">Herinneringen voor actieve challenges</p>
            </div>
            <Switch
              isSelected={notifications.challengeReminders}
              onValueChange={(value) => updateNotifications({ challengeReminders: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Journaling Herinneringen</p>
              <p className="text-sm text-gray-400">Dagelijkse herinneringen om te journalen</p>
            </div>
            <Switch
              isSelected={notifications.journalingReminders}
              onValueChange={(value) => updateNotifications({ journalingReminders: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Community Updates</p>
              <p className="text-sm text-gray-400">Updates van je communities</p>
            </div>
            <Switch
              isSelected={notifications.communityUpdates}
              onValueChange={(value) => updateNotifications({ communityUpdates: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Wekelijkse Rapporten</p>
              <p className="text-sm text-gray-400">Wekelijkse samenvatting van je voortgang</p>
            </div>
            <Switch
              isSelected={notifications.weeklyReports}
              onValueChange={(value) => updateNotifications({ weeklyReports: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Geluid</p>
              <p className="text-sm text-gray-400">Geluid voor notificaties</p>
            </div>
            <Switch
              isSelected={notifications.soundEnabled}
              onValueChange={(value) => updateNotifications({ soundEnabled: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Trilling</p>
              <p className="text-sm text-gray-400">Trilling voor notificaties</p>
            </div>
            <Switch
              isSelected={notifications.vibrationEnabled}
              onValueChange={(value) => updateNotifications({ vibrationEnabled: value })}
              color="primary"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
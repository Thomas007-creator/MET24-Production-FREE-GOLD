import React from 'react';
import { Card, CardHeader, CardBody, Switch, Select, SelectItem, Divider } from '@nextui-org/react';
import { Shield } from 'lucide-react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPagePrivacyTab: React.FC = () => {
  const { privacy, updatePrivacy } = useSettingsPage();

  return (
    <div className="space-y-6">
      <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy Instellingen
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Profiel Zichtbaarheid</p>
              <p className="text-sm text-gray-400">Wie kan je profiel zien</p>
            </div>
            <Select
              value={privacy.profileVisibility}
              onChange={(e) => updatePrivacy({ profileVisibility: e.target.value as any })}
              className="w-32"
            >
              <SelectItem key="public" value="public">Openbaar</SelectItem>
              <SelectItem key="private" value="private">Privé</SelectItem>
              <SelectItem key="friends" value="friends">Vrienden</SelectItem>
            </Select>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">MBTI Type Tonen</p>
              <p className="text-sm text-gray-400">Toon je persoonlijkheidstype</p>
            </div>
            <Switch
              isSelected={privacy.showMBTIType}
              onValueChange={(value) => updatePrivacy({ showMBTIType: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Activiteit Tonen</p>
              <p className="text-sm text-gray-400">Toon je dagelijkse activiteit</p>
            </div>
            <Switch
              isSelected={privacy.showActivity}
              onValueChange={(value) => updatePrivacy({ showActivity: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Prestaties Tonen</p>
              <p className="text-sm text-gray-400">Toon je badges en achievements</p>
            </div>
            <Switch
              isSelected={privacy.showAchievements}
              onValueChange={(value) => updatePrivacy({ showAchievements: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Gegevensverzameling</p>
              <p className="text-sm text-gray-400">Sta analyse en verbetering toe</p>
            </div>
            <Switch
              isSelected={privacy.allowDataCollection}
              onValueChange={(value) => updatePrivacy({ allowDataCollection: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Analytics</p>
              <p className="text-sm text-gray-400">Sta gebruiksanalyse toe</p>
            </div>
            <Switch
              isSelected={privacy.allowAnalytics}
              onValueChange={(value) => updatePrivacy({ allowAnalytics: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Personalisatie</p>
              <p className="text-sm text-gray-400">Sta gepersonaliseerde content toe</p>
            </div>
            <Switch
              isSelected={privacy.allowPersonalization}
              onValueChange={(value) => updatePrivacy({ allowPersonalization: value })}
              color="primary"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
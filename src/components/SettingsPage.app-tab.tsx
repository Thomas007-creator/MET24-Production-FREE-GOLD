import React from 'react';
import { Card, CardHeader, CardBody, Switch, Select, SelectItem, Slider, Divider } from '@nextui-org/react';
import { Palette } from 'lucide-react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageAppTab: React.FC = () => {
  const { app, updateApp } = useSettingsPage();

  return (
    <div className="space-y-6">
      <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            App Instellingen
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Thema</p>
              <p className="text-sm text-gray-400">Kies je voorkeurs thema</p>
            </div>
            <Select
              value={app.theme}
              onChange={(e) => updateApp({ theme: e.target.value as any })}
              className="w-32"
            >
              <SelectItem key="light" value="light">Licht</SelectItem>
              <SelectItem key="dark" value="dark">Donker</SelectItem>
              <SelectItem key="auto" value="auto">Auto</SelectItem>
            </Select>
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Taal</p>
              <p className="text-sm text-gray-400">Kies je taal</p>
            </div>
            <Select
              value={app.language}
              onChange={(e) => updateApp({ language: e.target.value as any })}
              className="w-32"
            >
              <SelectItem key="nl" value="nl">Nederlands</SelectItem>
              <SelectItem key="en" value="en">English</SelectItem>
            </Select>
          </div>
          <Divider />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Lettergrootte</p>
                <p className="text-sm text-gray-400">Pas de tekstgrootte aan</p>
              </div>
              <span className="text-white text-sm">{app.fontSize}px</span>
            </div>
            <Slider
              value={app.fontSize}
              onChange={(value) => updateApp({ fontSize: value as number })}
              minValue={12}
              maxValue={24}
              step={1}
              className="max-w-md"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto-opslaan</p>
              <p className="text-sm text-gray-400">Automatisch opslaan van wijzigingen</p>
            </div>
            <Switch
              isSelected={app.autoSave}
              onValueChange={(value) => updateApp({ autoSave: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Offline Modus</p>
              <p className="text-sm text-gray-400">Werk offline met lokale data</p>
            </div>
            <Switch
              isSelected={app.offlineMode}
              onValueChange={(value) => updateApp({ offlineMode: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Sync Frequentie</p>
              <p className="text-sm text-gray-400">Hoe vaak synchroniseren</p>
            </div>
            <Select
              value={app.syncFrequency}
              onChange={(e) => updateApp({ syncFrequency: e.target.value as any })}
              className="w-32"
            >
              <SelectItem key="realtime" value="realtime">Realtime</SelectItem>
              <SelectItem key="hourly" value="hourly">Elk uur</SelectItem>
              <SelectItem key="daily" value="daily">Dagelijks</SelectItem>
            </Select>
          </div>
          <Divider />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Cache Grootte</p>
                <p className="text-sm text-gray-400">Maximale cache grootte (MB)</p>
              </div>
              <span className="text-white text-sm">{app.cacheSize}MB</span>
            </div>
            <Slider
              value={app.cacheSize}
              onChange={(value) => updateApp({ cacheSize: value as number })}
              minValue={50}
              maxValue={500}
              step={25}
              className="max-w-md"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Animaties</p>
              <p className="text-sm text-gray-400">Gebruik animaties in de app</p>
            </div>
            <Switch
              isSelected={app.animations}
              onValueChange={(value) => updateApp({ animations: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Haptische Feedback</p>
              <p className="text-sm text-gray-400">Trillingen voor feedback</p>
            </div>
            <Switch
              isSelected={app.hapticFeedback}
              onValueChange={(value) => updateApp({ hapticFeedback: value })}
              color="primary"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
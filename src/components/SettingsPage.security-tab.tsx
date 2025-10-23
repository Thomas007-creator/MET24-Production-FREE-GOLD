import React from 'react';
import { Card, CardHeader, CardBody, Switch, Slider, Button, Divider } from '@nextui-org/react';
import { Lock } from 'lucide-react';
import { useSettingsPage } from './SettingsPage.provider';

export const SettingsPageSecurityTab: React.FC = () => {
  const { security, updateSecurity } = useSettingsPage();

  return (
    <div className="space-y-6">
      <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
        <CardHeader>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Beveiligings Instellingen
          </h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Tweestaps Authenticatie</p>
              <p className="text-sm text-gray-400">Extra beveiliging voor je account</p>
            </div>
            <Switch
              isSelected={security.twoFactorAuth}
              onValueChange={(value) => updateSecurity({ twoFactorAuth: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Biometrische Authenticatie</p>
              <p className="text-sm text-gray-400">Gebruik vingerafdruk of gezicht</p>
            </div>
            <Switch
              isSelected={security.biometricAuth}
              onValueChange={(value) => updateSecurity({ biometricAuth: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Sessie Time-out</p>
                <p className="text-sm text-gray-400">Automatisch uitloggen na inactiviteit</p>
              </div>
              <span className="text-white text-sm">{security.sessionTimeout} min</span>
            </div>
            <Slider
              value={security.sessionTimeout}
              onChange={(value) => updateSecurity({ sessionTimeout: value as number })}
              minValue={5}
              maxValue={120}
              step={5}
              className="max-w-md"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Login Notificaties</p>
              <p className="text-sm text-gray-400">Meldingen bij nieuwe logins</p>
            </div>
            <Switch
              isSelected={security.loginNotifications}
              onValueChange={(value) => updateSecurity({ loginNotifications: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Data Encryptie</p>
              <p className="text-sm text-gray-400">Versleutel al je data</p>
            </div>
            <Switch
              isSelected={security.dataEncryption}
              onValueChange={(value) => updateSecurity({ dataEncryption: value })}
              color="primary"
            />
          </div>
          <Divider />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Automatische Backups</p>
              <p className="text-sm text-gray-400">Dagelijkse backups van je data</p>
            </div>
            <Switch
              isSelected={security.backupEnabled}
              onValueChange={(value) => updateSecurity({ backupEnabled: value })}
              color="primary"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
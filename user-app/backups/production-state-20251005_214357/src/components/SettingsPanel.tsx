import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Switch,
  Slider,
  Button,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  User,
  Moon,
  Sun,
  Volume2,
  Save,
  RotateCcw,
} from 'lucide-react';

interface SettingsPanelProps {
  onClose?: () => void;
}

interface SettingsState {
  notifications: {
    push: boolean;
    email: boolean;
    sound: boolean;
    vibration: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    location: boolean;
    biometric: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    contrast: number;
    animations: boolean;
  };
  audio: {
    volume: number;
    notifications: number;
    coaching: number;
  };
  account: {
    autoSave: boolean;
    syncInterval: number;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
  };
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose: _onClose }) => {
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      push: true,
      email: false,
      sound: true,
      vibration: true,
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      location: false,
      biometric: true,
    },
    appearance: {
      theme: 'auto',
      fontSize: 16,
      contrast: 100,
      animations: true,
    },
    audio: {
      volume: 75,
      notifications: 60,
      coaching: 80,
    },
    account: {
      autoSave: true,
      syncInterval: 30,
      backupFrequency: 'weekly',
    },
  });

  const [activeTab, setActiveTab] = useState('notifications');

  const handleSettingChange = (
    category: keyof SettingsState,
    setting: string,
    value: unknown
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('app-settings', JSON.stringify(settings));
    // Settings saved successfully
  };

  const handleReset = () => {
    // Reset to default settings
    const defaultSettings: SettingsState = {
      notifications: {
        push: true,
        email: false,
        sound: true,
        vibration: true,
      },
      privacy: {
        dataSharing: false,
        analytics: true,
        location: false,
        biometric: true,
      },
      appearance: {
        theme: 'auto',
        fontSize: 16,
        contrast: 100,
        animations: true,
      },
      audio: {
        volume: 75,
        notifications: 60,
        coaching: 80,
      },
      account: {
        autoSave: true,
        syncInterval: 30,
        backupFrequency: 'weekly',
      },
    };
    setSettings(defaultSettings);
  };

  const tabs = [
    { id: 'notifications', label: 'Notificaties', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Uiterlijk', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] p-4 text-[#e0e0e0]'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 mb-6 shadow-lg'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg flex items-center justify-center'>
                <Settings size={24} className='text-[#64dfdf]' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-white'>Instellingen</h1>
                <p className='text-sm text-[#e0e0e0]/80'>
                  Beheer je app voorkeuren en privacy
                </p>
              </div>
            </div>
            <div className='flex gap-2'>
              <Button
                className='bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-[#64dfdf] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
                size='sm'
                onClick={handleReset}
                startContent={<RotateCcw size={16} />}
              >
                Reset
              </Button>
              <Button
                className='bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 hover:border-[#64dfdf] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
                size='sm'
                onClick={handleSave}
                startContent={<Save size={16} />}
              >
                Opslaan
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 mb-6 shadow-lg'>
          <div className='flex gap-1 overflow-x-auto'>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 whitespace-nowrap
                    ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-[#64dfdf] shadow-[0_0_20px_rgba(100,223,223,0.3)]'
                        : 'text-[#e0e0e0] hover:bg-white/10'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className='font-medium'>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg'>
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Notificatie Instellingen
              </h2>

              <div className='grid gap-4 md:grid-cols-2'>
                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Push Notificaties
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Ontvang meldingen op je apparaat
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.notifications.push}
                        onValueChange={value =>
                          handleSettingChange('notifications', 'push', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          E-mail Notificaties
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Ontvang updates via e-mail
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.notifications.email}
                        onValueChange={value =>
                          handleSettingChange('notifications', 'email', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>Geluid</h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Speel geluid af bij notificaties
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.notifications.sound}
                        onValueChange={value =>
                          handleSettingChange('notifications', 'sound', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Trillingen
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Tril bij notificaties
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.notifications.vibration}
                        onValueChange={value =>
                          handleSettingChange(
                            'notifications',
                            'vibration',
                            value
                          )
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Privacy & Beveiliging
              </h2>

              <div className='grid gap-4 md:grid-cols-2'>
                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Data Delen
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Deel anonieme gebruikersdata
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.privacy.dataSharing}
                        onValueChange={value =>
                          handleSettingChange('privacy', 'dataSharing', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Analytics
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Verzamel gebruikersstatistieken
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.privacy.analytics}
                        onValueChange={value =>
                          handleSettingChange('privacy', 'analytics', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>Locatie</h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Toegang tot locatiegegevens
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.privacy.location}
                        onValueChange={value =>
                          handleSettingChange('privacy', 'location', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Biometrische Login
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Gebruik vingerafdruk of gezicht
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.privacy.biometric}
                        onValueChange={value =>
                          handleSettingChange('privacy', 'biometric', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Uiterlijk & Thema
              </h2>

              <div className='grid gap-6'>
                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>Thema</h3>
                    <div className='flex gap-3'>
                      {[
                        { value: 'light', label: 'Licht', icon: Sun },
                        { value: 'dark', label: 'Donker', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Settings },
                      ].map(theme => {
                        const Icon = theme.icon;
                        return (
                          <button
                            key={theme.value}
                            onClick={() =>
                              handleSettingChange(
                                'appearance',
                                'theme',
                                theme.value
                              )
                            }
                            className={`
                              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                              ${
                                settings.appearance.theme === theme.value
                                  ? 'bg-white/20 text-[#64dfdf] shadow-[0_0_20px_rgba(100,223,223,0.3)]'
                                  : 'text-[#e0e0e0] hover:bg-white/10'
                              }
                            `}
                          >
                            <Icon size={16} />
                            <span>{theme.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>
                      Lettergrootte
                    </h3>
                    <Slider
                      size='sm'
                      step={1}
                      color='primary'
                      showSteps={true}
                      maxValue={24}
                      minValue={12}
                      value={settings.appearance.fontSize}
                      onChange={value =>
                        handleSettingChange('appearance', 'fontSize', value)
                      }
                      className='max-w-md'
                    />
                    <p className='text-sm text-[#e0e0e0]/70 mt-2'>
                      Huidige grootte: {settings.appearance.fontSize}px
                    </p>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>Contrast</h3>
                    <Slider
                      size='sm'
                      step={10}
                      color='primary'
                      showSteps={true}
                      maxValue={200}
                      minValue={50}
                      value={settings.appearance.contrast}
                      onChange={value =>
                        handleSettingChange('appearance', 'contrast', value)
                      }
                      className='max-w-md'
                    />
                    <p className='text-sm text-[#e0e0e0]/70 mt-2'>
                      Contrast: {settings.appearance.contrast}%
                    </p>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Animaties
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Toon interface animaties
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.appearance.animations}
                        onValueChange={value =>
                          handleSettingChange('appearance', 'animations', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* Audio Tab */}
          {activeTab === 'audio' && (
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Audio Instellingen
              </h2>

              <div className='grid gap-6'>
                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>
                      Algemene Volume
                    </h3>
                    <Slider
                      size='sm'
                      step={5}
                      color='primary'
                      showSteps={true}
                      maxValue={100}
                      minValue={0}
                      value={settings.audio.volume}
                      onChange={value =>
                        handleSettingChange('audio', 'volume', value)
                      }
                      className='max-w-md'
                    />
                    <p className='text-sm text-[#e0e0e0]/70 mt-2'>
                      Volume: {settings.audio.volume}%
                    </p>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>
                      Notificatie Volume
                    </h3>
                    <Slider
                      size='sm'
                      step={5}
                      color='primary'
                      showSteps={true}
                      maxValue={100}
                      minValue={0}
                      value={settings.audio.notifications}
                      onChange={value =>
                        handleSettingChange('audio', 'notifications', value)
                      }
                      className='max-w-md'
                    />
                    <p className='text-sm text-[#e0e0e0]/70 mt-2'>
                      Notificaties: {settings.audio.notifications}%
                    </p>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>
                      Coaching Audio
                    </h3>
                    <Slider
                      size='sm'
                      step={5}
                      color='primary'
                      showSteps={true}
                      maxValue={100}
                      minValue={0}
                      value={settings.audio.coaching}
                      onChange={value =>
                        handleSettingChange('audio', 'coaching', value)
                      }
                      className='max-w-md'
                    />
                    <p className='text-sm text-[#e0e0e0]/70 mt-2'>
                      Coaching: {settings.audio.coaching}%
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className='space-y-6'>
              <h2 className='text-xl font-semibold mb-4 text-white'>
                Account Instellingen
              </h2>

              <div className='grid gap-6'>
                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <h3 className='font-medium mb-1 text-white'>
                          Auto Opslaan
                        </h3>
                        <p className='text-sm text-[#e0e0e0]/70'>
                          Sla wijzigingen automatisch op
                        </p>
                      </div>
                      <Switch
                        isSelected={settings.account.autoSave}
                        onValueChange={value =>
                          handleSettingChange('account', 'autoSave', value)
                        }
                        color='primary'
                      />
                    </div>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>
                      Sync Interval
                    </h3>
                    <Slider
                      size='sm'
                      step={5}
                      color='primary'
                      showSteps={true}
                      maxValue={60}
                      minValue={5}
                      value={settings.account.syncInterval}
                      onChange={value =>
                        handleSettingChange('account', 'syncInterval', value)
                      }
                      className='max-w-md'
                    />
                    <p className='text-sm text-[#e0e0e0]/70 mt-2'>
                      Sync elke {settings.account.syncInterval} minuten
                    </p>
                  </CardBody>
                </Card>

                <Card className='bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg'>
                  <CardBody className='p-4'>
                    <h3 className='font-medium mb-3 text-white'>
                      Backup Frequentie
                    </h3>
                    <Select
                      selectedKeys={[settings.account.backupFrequency]}
                      onSelectionChange={keys => {
                        const value = Array.from(keys)[0] as string;
                        handleSettingChange(
                          'account',
                          'backupFrequency',
                          value
                        );
                      }}
                      className='max-w-md'
                    >
                      <SelectItem key='daily' value='daily'>
                        Dagelijks
                      </SelectItem>
                      <SelectItem key='weekly' value='weekly'>
                        Wekelijks
                      </SelectItem>
                      <SelectItem key='monthly' value='monthly'>
                        Maandelijks
                      </SelectItem>
                    </Select>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

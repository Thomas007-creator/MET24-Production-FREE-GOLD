import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Switch,
  Input,
  Select,
  SelectItem,
  Slider,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  Chip,
  Progress,
} from '@nextui-org/react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Home,
  User,
  Database,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Key,
  Mail,
  Smartphone as Phone,
  Calendar,
  Clock,
  Languages,
  HelpCircle,
  FileText,
  Shield as Security,
  Users,
  Heart,
  Brain,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import { useI18n } from '../hooks/useI18n';

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  challengeReminders: boolean;
  journalingReminders: boolean;
  communityUpdates: boolean;
  weeklyReports: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showMBTIType: boolean;
  showActivity: boolean;
  showAchievements: boolean;
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowPersonalization: boolean;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: 'nl' | 'en';
  fontSize: number;
  autoSave: boolean;
  offlineMode: boolean;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  cacheSize: number;
  animations: boolean;
  hapticFeedback: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  biometricAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  dataEncryption: boolean;
  backupEnabled: boolean;
  deleteAccount: boolean;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData, updateUserData } = useAppStore();
  const { t, changeLanguage, getCurrentLanguage, getSupportedLanguages, getLanguageLabel } = useI18n();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    challengeReminders: true,
    journalingReminders: true,
    communityUpdates: false,
    weeklyReports: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showMBTIType: true,
    showActivity: true,
    showAchievements: true,
    allowDataCollection: true,
    allowAnalytics: true,
    allowPersonalization: true,
  });

  const [app, setApp] = useState<AppSettings>({
    theme: 'dark',
    language: 'nl',
    fontSize: 16,
    autoSave: true,
    offlineMode: true,
    syncFrequency: 'hourly',
    cacheSize: 100,
    animations: true,
    hapticFeedback: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    biometricAuth: true,
    sessionTimeout: 30,
    loginNotifications: true,
    dataEncryption: true,
    backupEnabled: true,
    deleteAccount: false,
  });

  const [syncStatus, setSyncStatus] = useState({
    lastSync: new Date().toISOString(),
    status: 'synced' as 'synced' | 'syncing' | 'error',
    progress: 100,
  });

  const handleSaveSettings = () => {
    // Save settings to store or API
    logger.info('Settings saved', { 
      notifications, 
      privacy, 
      app, 
      security 
    });
    
    // Show success feedback
    setSyncStatus({
      lastSync: new Date().toISOString(),
      status: 'synced',
      progress: 100,
    });
  };

  const handleExportData = () => {
    // Export user data
    const exportData = {
      userData,
      settings: { notifications, privacy, app, security },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `met24-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    setIsExportModalOpen(false);
    logger.info('Data exported');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // Import data logic here
          logger.info('Data imported', { fileName: file.name });
          setIsImportModalOpen(false);
        } catch (error) {
          logger.error('Import failed', { error: String(error) });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteAccount = () => {
    // Delete account logic
    logger.warn('Account deletion requested');
    setIsDeleteModalOpen(false);
    // Navigate to login or show confirmation
  };

  const getSyncStatusColor = () => {
    switch (syncStatus.status) {
      case 'synced': return 'success';
      case 'syncing': return 'primary';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus.status) {
      case 'synced': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              color="secondary"
              variant="bordered"
              startContent={<ArrowLeft />}
              onClick={() => navigate(-1)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t('common.back')}
            </Button>
            <Button
              color="primary"
              variant="bordered"
              startContent={<Home />}
              onClick={() => navigate('/')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t('common.home')}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              color="success"
              variant="bordered"
              startContent={<User />}
              onClick={() => navigate('/profile')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {t('navigation.profile')}
            </Button>
            <Button
              color="primary"
              onClick={handleSaveSettings}
              startContent={<Save />}
            >
              {t('common.save')}
            </Button>
          </div>
        </div>

        {/* Sync Status */}
        <Card className="bg-[rgba(27,38,59,0.8)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] mb-6">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getSyncStatusIcon()}
                <div>
                  <p className="text-white font-medium">Sync Status</p>
                  <p className="text-sm text-gray-400">
                    Laatste sync: {new Date(syncStatus.lastSync).toLocaleString('nl-NL')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={syncStatus.progress}
                  className="w-24"
                  color={getSyncStatusColor()}
                  size="sm"
                />
                <Chip
                  color={getSyncStatusColor()}
                  size="sm"
                  variant="flat"
                >
                  {syncStatus.status}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="glass rounded-xl p-2">
            <div className="flex space-x-2">
              {[
                { id: 'notifications', label: 'Notificaties', icon: '🔔' },
                { id: 'privacy', label: 'Privacy', icon: '🔒' },
                { id: 'app', label: 'App', icon: '⚙️' },
                { id: 'security', label: 'Beveiliging', icon: '🛡️' },
                { id: 'data', label: 'Data', icon: '💾' }
              ].map((tab) => (
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

        {/* Tab Content */}
        {activeTab === 'notifications' && (
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
                    onValueChange={(value) => setNotifications({...notifications, pushNotifications: value})}
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
                    onValueChange={(value) => setNotifications({...notifications, emailNotifications: value})}
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
                    onValueChange={(value) => setNotifications({...notifications, challengeReminders: value})}
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
                    onValueChange={(value) => setNotifications({...notifications, journalingReminders: value})}
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
                    onValueChange={(value) => setNotifications({...notifications, communityUpdates: value})}
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
                    onValueChange={(value) => setNotifications({...notifications, weeklyReports: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Geluid</p>
                    <p className="text-sm text-gray-400">Geluidseffecten voor notificaties</p>
                  </div>
                  <Switch
                    isSelected={notifications.soundEnabled}
                    onValueChange={(value) => setNotifications({...notifications, soundEnabled: value})}
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
                    onValueChange={(value) => setNotifications({...notifications, vibrationEnabled: value})}
                    color="primary"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Instellingen
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-white font-medium mb-2">Profiel Zichtbaarheid</p>
                  <Select
                    selectedKeys={[privacy.profileVisibility]}
                    onSelectionChange={(keys) => setPrivacy({...privacy, profileVisibility: Array.from(keys)[0] as any})}
                    className="max-w-xs"
                  >
                    <SelectItem key="public" value="public">Openbaar</SelectItem>
                    <SelectItem key="private" value="private">Privé</SelectItem>
                    <SelectItem key="friends" value="friends">Alleen Vrienden</SelectItem>
                  </Select>
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">MBTI Type Tonen</p>
                    <p className="text-sm text-gray-400">Toon je MBTI type op je profiel</p>
                  </div>
                  <Switch
                    isSelected={privacy.showMBTIType}
                    onValueChange={(value) => setPrivacy({...privacy, showMBTIType: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Activiteit Tonen</p>
                    <p className="text-sm text-gray-400">Toon je recente activiteit</p>
                  </div>
                  <Switch
                    isSelected={privacy.showActivity}
                    onValueChange={(value) => setPrivacy({...privacy, showActivity: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Prestaties Tonen</p>
                    <p className="text-sm text-gray-400">Toon je achievements en badges</p>
                  </div>
                  <Switch
                    isSelected={privacy.showAchievements}
                    onValueChange={(value) => setPrivacy({...privacy, showAchievements: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Data Verzameling</p>
                    <p className="text-sm text-gray-400">Sta toe dat we anonieme data verzamelen</p>
                  </div>
                  <Switch
                    isSelected={privacy.allowDataCollection}
                    onValueChange={(value) => setPrivacy({...privacy, allowDataCollection: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Analytics</p>
                    <p className="text-sm text-gray-400">Help ons de app te verbeteren</p>
                  </div>
                  <Switch
                    isSelected={privacy.allowAnalytics}
                    onValueChange={(value) => setPrivacy({...privacy, allowAnalytics: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Personalisatie</p>
                    <p className="text-sm text-gray-400">Gepersonaliseerde content en aanbevelingen</p>
                  </div>
                  <Switch
                    isSelected={privacy.allowPersonalization}
                    onValueChange={(value) => setPrivacy({...privacy, allowPersonalization: value})}
                    color="primary"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'app' && (
          <div className="space-y-6">
            <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  App Instellingen
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div>
                  <p className="text-white font-medium mb-2">Thema</p>
                  <Select
                    selectedKeys={[app.theme]}
                    onSelectionChange={(keys) => setApp({...app, theme: Array.from(keys)[0] as any})}
                    className="max-w-xs"
                  >
                    <SelectItem key="light" value="light">Licht</SelectItem>
                    <SelectItem key="dark" value="dark">Donker</SelectItem>
                    <SelectItem key="auto" value="auto">Automatisch</SelectItem>
                  </Select>
                </div>
                <Divider />
                <div>
                  <p className="text-white font-medium mb-2">{t('settings.language')}</p>
                  <Select
                    selectedKeys={[getCurrentLanguage()]}
                    onSelectionChange={(keys) => {
                      const newLang = Array.from(keys)[0] as string;
                      changeLanguage(newLang);
                      setApp({...app, language: newLang as any});
                    }}
                    className="max-w-xs"
                  >
                    {getSupportedLanguages().map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {getLanguageLabel(lang)}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <Divider />
                <div>
                  <p className="text-white font-medium mb-2">Lettergrootte: {app.fontSize}px</p>
                  <Slider
                    value={app.fontSize}
                    onChange={(value) => setApp({...app, fontSize: value as number})}
                    minValue={12}
                    maxValue={24}
                    step={1}
                    className="max-w-md"
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Auto-save</p>
                    <p className="text-sm text-gray-400">Automatisch opslaan van wijzigingen</p>
                  </div>
                  <Switch
                    isSelected={app.autoSave}
                    onValueChange={(value) => setApp({...app, autoSave: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Offline Modus</p>
                    <p className="text-sm text-gray-400">Werk offline en sync later</p>
                  </div>
                  <Switch
                    isSelected={app.offlineMode}
                    onValueChange={(value) => setApp({...app, offlineMode: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div>
                  <p className="text-white font-medium mb-2">Sync Frequentie</p>
                  <Select
                    selectedKeys={[app.syncFrequency]}
                    onSelectionChange={(keys) => setApp({...app, syncFrequency: Array.from(keys)[0] as any})}
                    className="max-w-xs"
                  >
                    <SelectItem key="realtime" value="realtime">Real-time</SelectItem>
                    <SelectItem key="hourly" value="hourly">Elk uur</SelectItem>
                    <SelectItem key="daily" value="daily">Dagelijks</SelectItem>
                  </Select>
                </div>
                <Divider />
                <div>
                  <p className="text-white font-medium mb-2">Cache Grootte: {app.cacheSize}MB</p>
                  <Slider
                    value={app.cacheSize}
                    onChange={(value) => setApp({...app, cacheSize: value as number})}
                    minValue={50}
                    maxValue={500}
                    step={25}
                    className="max-w-md"
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Animaties</p>
                    <p className="text-sm text-gray-400">UI animaties en overgangen</p>
                  </div>
                  <Switch
                    isSelected={app.animations}
                    onValueChange={(value) => setApp({...app, animations: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Haptische Feedback</p>
                    <p className="text-sm text-gray-400">Trilling bij interacties</p>
                  </div>
                  <Switch
                    isSelected={app.hapticFeedback}
                    onValueChange={(value) => setApp({...app, hapticFeedback: value})}
                    color="primary"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Security className="w-5 h-5" />
                  Beveiliging
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Twee-Factor Authenticatie</p>
                    <p className="text-sm text-gray-400">Extra beveiliging voor je account</p>
                  </div>
                  <Switch
                    isSelected={security.twoFactorAuth}
                    onValueChange={(value) => setSecurity({...security, twoFactorAuth: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Biometrische Authenticatie</p>
                    <p className="text-sm text-gray-400">Login met vingerafdruk of gezicht</p>
                  </div>
                  <Switch
                    isSelected={security.biometricAuth}
                    onValueChange={(value) => setSecurity({...security, biometricAuth: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div>
                  <p className="text-white font-medium mb-2">Sessie Timeout: {security.sessionTimeout} minuten</p>
                  <Slider
                    value={security.sessionTimeout}
                    onChange={(value) => setSecurity({...security, sessionTimeout: value as number})}
                    minValue={5}
                    maxValue={120}
                    step={5}
                    className="max-w-md"
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Login Notificaties</p>
                    <p className="text-sm text-gray-400">Notificaties bij nieuwe logins</p>
                  </div>
                  <Switch
                    isSelected={security.loginNotifications}
                    onValueChange={(value) => setSecurity({...security, loginNotifications: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Data Encryptie</p>
                    <p className="text-sm text-gray-400">Versleutel alle persoonlijke data</p>
                  </div>
                  <Switch
                    isSelected={security.dataEncryption}
                    onValueChange={(value) => setSecurity({...security, dataEncryption: value})}
                    color="primary"
                  />
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Automatische Backup</p>
                    <p className="text-sm text-gray-400">Automatisch backuppen van je data</p>
                  </div>
                  <Switch
                    isSelected={security.backupEnabled}
                    onValueChange={(value) => setSecurity({...security, backupEnabled: value})}
                    color="primary"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            <Card className="bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Management
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    color="primary"
                    variant="bordered"
                    startContent={<Download />}
                    onClick={() => setIsExportModalOpen(true)}
                    className="h-16"
                  >
                    <div className="text-left">
                      <p className="font-medium">Data Exporteren</p>
                      <p className="text-sm opacity-70">Download je data als JSON</p>
                    </div>
                  </Button>
                  <Button
                    color="secondary"
                    variant="bordered"
                    startContent={<Upload />}
                    onClick={() => setIsImportModalOpen(true)}
                    className="h-16"
                  >
                    <div className="text-left">
                      <p className="font-medium">Data Importeren</p>
                      <p className="text-sm opacity-70">Upload backup data</p>
                    </div>
                  </Button>
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Cache Wissen</p>
                    <p className="text-sm text-gray-400">Verwijder alle opgeslagen cache data</p>
                  </div>
                  <Button
                    color="warning"
                    variant="bordered"
                    size="sm"
                  >
                    Wissen
                  </Button>
                </div>
                <Divider />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Alle Data Verwijderen</p>
                    <p className="text-sm text-gray-400">Permanent verwijderen van alle data</p>
                  </div>
                  <Button
                    color="danger"
                    variant="bordered"
                    size="sm"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    Verwijderen
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Export Modal */}
        <Modal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          size="md"
          className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-xl font-semibold text-white">Data Exporteren</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-300">
                Je data wordt geëxporteerd als een JSON bestand. Dit bevat al je journal entries, 
                challenges, instellingen en andere persoonlijke data.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={() => setIsExportModalOpen(false)}
              >
                Annuleren
              </Button>
              <Button
                color="primary"
                onClick={handleExportData}
                startContent={<Download />}
              >
                Exporteren
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Import Modal */}
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          size="md"
          className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-xl font-semibold text-white">Data Importeren</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-300 mb-4">
                Selecteer een JSON backup bestand om je data te herstellen.
              </p>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={() => setIsImportModalOpen(false)}
              >
                Annuleren
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          size="md"
          className="bg-[rgba(27,38,59,0.95)] backdrop-blur-xl"
        >
          <ModalContent>
            <ModalHeader>
              <h2 className="text-xl font-semibold text-white text-red-400">Account Verwijderen</h2>
            </ModalHeader>
            <ModalBody>
              <p className="text-gray-300">
                <strong className="text-red-400">Waarschuwing:</strong> Dit zal permanent al je data verwijderen, 
                inclusief journal entries, challenges, en instellingen. Deze actie kan niet ongedaan worden gemaakt.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Annuleren
              </Button>
              <Button
                color="danger"
                onClick={handleDeleteAccount}
                startContent={<Trash2 />}
              >
                Permanent Verwijderen
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default SettingsPage;
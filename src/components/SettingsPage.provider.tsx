import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import { useI18n } from '../hooks/useI18n';
import { validateAPIKey, getProviderDisplayName, getProviderDescription, maskAPIKey } from '../services/providers/validationService';
import { aiApiKeyService } from '../services/aiApiKeyService';
import { routeLLMConfigService } from '../services/routing/routeLLMConfigService';

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

interface AIProvider {
  enabled: boolean;
  apiKey: string;
  models: string[];
}

interface AIProviders {
  anthropic: AIProvider;
  xai: AIProvider;
  openai: AIProvider;
  google: AIProvider;
  abacus: AIProvider;
}

interface RouteLLMConfig {
  optimizationLevel: 'aggressive' | 'balanced' | 'quality_first';
  fallbackToLocal: boolean;
}

interface SyncStatus {
  lastSync: string;
  status: 'synced' | 'syncing' | 'error';
  progress: number;
}

interface SettingsPageContextType {
  // State
  activeTab: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  app: AppSettings;
  security: SecuritySettings;
  aiProviders: AIProviders;
  routeLLMConfig: RouteLLMConfig;
  syncStatus: SyncStatus;
  isDeleteModalOpen: boolean;
  isExportModalOpen: boolean;
  isImportModalOpen: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  updateApp: (settings: Partial<AppSettings>) => void;
  updateSecurity: (settings: Partial<SecuritySettings>) => void;
  updateAIProvider: (provider: keyof AIProviders, settings: Partial<AIProvider>) => void;
  updateRouteLLMConfig: (config: Partial<RouteLLMConfig>) => void;
  handleSaveSettings: () => void;
  handleExportData: () => void;
  handleImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAccount: () => void;
  setIsDeleteModalOpen: (open: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;
  setIsImportModalOpen: (open: boolean) => void;

  // AI Provider actions
  validateAndSaveAPIKey: (provider: keyof AIProviders) => Promise<boolean>;
  handleOptimizationLevelChange: (level: RouteLLMConfig['optimizationLevel']) => Promise<void>;
  handleFallbackToLocalChange: (enabled: boolean) => Promise<void>;
}

const SettingsPageContext = createContext<SettingsPageContextType | undefined>(undefined);

export const useSettingsPage = () => {
  const context = useContext(SettingsPageContext);
  if (!context) {
    throw new Error('useSettingsPage must be used within a SettingsPageProvider');
  }
  return context;
};

interface SettingsPageProviderProps {
  children: ReactNode;
}

export const SettingsPageProvider: React.FC<SettingsPageProviderProps> = ({ children }) => {
  const { userData, updateUserData } = useAppStore();
  const { t } = useI18n();

  // Tab state
  const [activeTab, setActiveTab] = useState('notifications');

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

  // AI Services state
  const [aiProviders, setAIProviders] = useState<AIProviders>({
    anthropic: { enabled: false, apiKey: '', models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'] },
    xai: { enabled: false, apiKey: '', models: ['grok-3', 'grok-3-mini'] },
    openai: { enabled: false, apiKey: '', models: ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'] },
    google: { enabled: false, apiKey: '', models: ['gemini-pro', 'gemini-ultra'] },
    abacus: { enabled: false, apiKey: '', models: ['grok-4', 'claude-4.1-opus', 'gpt-5', 'gemini-2.5-pro', 'gemini-2.5-flash', 'qwen-2.5-coder-32b'] }
  });

  const [routeLLMConfig, setRouteLLMConfig] = useState<RouteLLMConfig>({
    optimizationLevel: 'balanced',
    fallbackToLocal: true
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: new Date().toISOString(),
    status: 'synced',
    progress: 100,
  });

  // Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Load RouteLLM config from service on mount
  useEffect(() => {
    const loadRouteLLMConfig = async () => {
      try {
        const config = await routeLLMConfigService.getConfig();
        setRouteLLMConfig({
          optimizationLevel: config.optimizationLevel,
          fallbackToLocal: config.fallbackToLocal
        });
        logger.info('[SettingsPageProvider] RouteLLM config loaded', config);
      } catch (err) {
        logger.error('[SettingsPageProvider] Failed to load RouteLLM config', {
          error: err instanceof Error ? err.message : String(err)
        });
      }
    };

    loadRouteLLMConfig();
  }, []);

  // Update handlers
  const updateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...settings }));
  };

  const updatePrivacy = (settings: Partial<PrivacySettings>) => {
    setPrivacy(prev => ({ ...prev, ...settings }));
  };

  const updateApp = (settings: Partial<AppSettings>) => {
    setApp(prev => ({ ...prev, ...settings }));
  };

  const updateSecurity = (settings: Partial<SecuritySettings>) => {
    setSecurity(prev => ({ ...prev, ...settings }));
  };

  const updateAIProvider = (provider: keyof AIProviders, settings: Partial<AIProvider>) => {
    setAIProviders(prev => ({
      ...prev,
      [provider]: { ...prev[provider], ...settings }
    }));
  };

  const updateRouteLLMConfig = (config: Partial<RouteLLMConfig>) => {
    setRouteLLMConfig(prev => ({ ...prev, ...config }));
  };

  // RouteLLM handlers
  const handleOptimizationLevelChange = async (level: RouteLLMConfig['optimizationLevel']) => {
    updateRouteLLMConfig({ optimizationLevel: level });
    try {
      await routeLLMConfigService.setOptimizationLevel(level);
      logger.info('[SettingsPageProvider] Optimization level updated', { level });
    } catch (err) {
      logger.error('[SettingsPageProvider] Failed to update optimization level', {
        error: err instanceof Error ? err.message : String(err)
      });
    }
  };

  const handleFallbackToLocalChange = async (enabled: boolean) => {
    updateRouteLLMConfig({ fallbackToLocal: enabled });
    try {
      await routeLLMConfigService.setFallbackToLocal(enabled);
      logger.info('[SettingsPageProvider] Fallback to local updated', { enabled });
    } catch (err) {
      logger.error('[SettingsPageProvider] Failed to update fallbackToLocal', {
        error: err instanceof Error ? err.message : String(err)
      });
    }
  };

  // AI Provider validation
  const validateAndSaveAPIKey = async (provider: keyof AIProviders): Promise<boolean> => {
    const providerData = aiProviders[provider];
    try {
      const isValid = await validateAPIKey(provider, providerData.apiKey);
      if (isValid) {
        await aiApiKeyService.saveApiKey({
          provider,
          apiKey: providerData.apiKey,
          userId: userData?.id || 'default'
        });
        logger.info(`[SettingsPageProvider] API key validated and saved for ${provider}`);
        return true;
      } else {
        logger.warn(`[SettingsPageProvider] Invalid API key for ${provider}`);
        return false;
      }
    } catch (err) {
      logger.error(`[SettingsPageProvider] Failed to validate/save API key for ${provider}`, {
        error: err instanceof Error ? err.message : String(err)
      });
      return false;
    }
  };

  // Settings actions
  const handleSaveSettings = () => {
    logger.info('Settings saved', {
      notifications,
      privacy,
      app,
      security
    });

    setSyncStatus({
      lastSync: new Date().toISOString(),
      status: 'synced',
      progress: 100,
    });
  };

  const handleExportData = () => {
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
    logger.warn('Account deletion requested');
    setIsDeleteModalOpen(false);
  };

  const contextValue: SettingsPageContextType = {
    // State
    activeTab,
    notifications,
    privacy,
    app,
    security,
    aiProviders,
    routeLLMConfig,
    syncStatus,
    isDeleteModalOpen,
    isExportModalOpen,
    isImportModalOpen,

    // Actions
    setActiveTab,
    updateNotifications,
    updatePrivacy,
    updateApp,
    updateSecurity,
    updateAIProvider,
    updateRouteLLMConfig,
    handleSaveSettings,
    handleExportData,
    handleImportData,
    handleDeleteAccount,
    setIsDeleteModalOpen,
    setIsExportModalOpen,
    setIsImportModalOpen,

    // AI Provider actions
    validateAndSaveAPIKey,
    handleOptimizationLevelChange,
    handleFallbackToLocalChange,
  };

  return (
    <SettingsPageContext.Provider value={contextValue}>
      {children}
    </SettingsPageContext.Provider>
  );
};
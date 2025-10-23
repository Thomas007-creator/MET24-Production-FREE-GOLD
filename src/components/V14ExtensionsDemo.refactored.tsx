/**
 * V14 Extensions Demo Component - BMAD Refactored
 * 
 * Demonstratie van hoe je de nieuwe V14 Future Extensions kunt gebruiken
 * Refactored using BMAD composition patterns to eliminate boolean props
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Badge } from '@nextui-org/react';
import { Plus, Settings, Zap, Brain, Heart, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import database from '../database';
import FutureExtension from '../database/v14/models/FutureExtension';

// ================================================
// BMAD Composition Types
// ================================================

interface ExtensionData {
  extensionId: string;
  extensionType: 'ai_feature' | 'analytics' | 'wellness';
  extensionName: string;
  dataJson: string;
  status: 'enabled' | 'disabled' | 'installing' | 'error';
}

interface ExtensionContextType {
  extensions: FutureExtension[];
  isLoading: boolean;
  loadExtensions: () => Promise<void>;
  createExtension: (data: ExtensionData) => Promise<void>;
  toggleExtension: (extensionId: string) => Promise<void>;
}

// ================================================
// BMAD Extension Context & Provider
// ================================================

const ExtensionContext = createContext<ExtensionContextType | null>(null);

interface ExtensionProviderProps {
  children: React.ReactNode;
}

const ExtensionProvider: React.FC<ExtensionProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [extensions, setExtensions] = useState<FutureExtension[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadExtensions = async () => {
    if (!userData?.id) return;
    
    setIsLoading(true);
    try {
      const extensionsCollection = database.get('future_extensions');
      const allExtensions = await extensionsCollection.query().fetch();
      const userExtensions = allExtensions.filter((ext: any) => ext.userId === userData.id);
      setExtensions(userExtensions as any);
    } catch (error) {
      console.error('Failed to load extensions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createExtension = async (extensionData: ExtensionData) => {
    if (!userData?.id) return;

    try {
      const extensionsCollection = database.get('future_extensions');
      await database.write(async () => {
        await extensionsCollection.create((extension: any) => {
          extension.extensionId = extensionData.extensionId;
          extension.extensionType = extensionData.extensionType;
          extension.extensionName = extensionData.extensionName;
          extension.userId = userData.id;
          extension.dataJson = extensionData.dataJson;
          extension.isEnabled = extensionData.status === 'enabled';
          extension.isPublic = false;
          extension.isPremium = false;
          extension.createdAt = Date.now();
          extension.updatedAt = Date.now();
          extension.createdBy = userData.id;
        });
      });
      
      await loadExtensions();
    } catch (error) {
      console.error('Failed to create extension:', error);
    }
  };

  const toggleExtension = async (extensionId: string) => {
    try {
      const extensionsCollection = database.get('future_extensions');
      const extension = await extensionsCollection.find(extensionId);
      
      await database.write(async () => {
        await extension.update((ext: any) => {
          ext.isEnabled = !ext.isEnabled;
          ext.updatedAt = Date.now();
        });
      });
      
      await loadExtensions();
    } catch (error) {
      console.error('Failed to toggle extension:', error);
    }
  };

  useEffect(() => {
    if (userData?.id) {
      loadExtensions();
    }
  }, [userData?.id]);

  const contextValue: ExtensionContextType = {
    extensions,
    isLoading,
    loadExtensions,
    createExtension,
    toggleExtension
  };

  return (
    <ExtensionContext.Provider value={contextValue}>
      {children}
    </ExtensionContext.Provider>
  );
};

// ================================================
// BMAD Extension Hook
// ================================================

const useExtensions = (): ExtensionContextType => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error('useExtensions must be used within ExtensionProvider');
  }
  return context;
};

// ================================================
// BMAD Extension Icon Component
// ================================================

interface ExtensionIconProps {
  type: 'ai_feature' | 'analytics' | 'wellness';
  className?: string;
}

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ type, className = "w-5 h-5" }) => {
  const iconProps = { className };
  
  switch (type) {
    case 'ai_feature':
      return <Brain {...iconProps} className={`${className} text-blue-500`} />;
    case 'analytics':
      return <Zap {...iconProps} className={`${className} text-yellow-500`} />;
    case 'wellness':
      return <Heart {...iconProps} className={`${className} text-red-500`} />;
    default:
      return <Settings {...iconProps} className={`${className} text-gray-500`} />;
  }
};

// ================================================
// BMAD Extension Status Component
// ================================================

interface ExtensionStatusProps {
  status: 'enabled' | 'disabled' | 'installing' | 'error';
}

const ExtensionStatus: React.FC<ExtensionStatusProps> = ({ status }) => {
  switch (status) {
    case 'enabled':
      return (
        <Chip size="sm" color="success" startContent={<CheckCircle className="w-3 h-3" />}>
          Enabled
        </Chip>
      );
    case 'disabled':
      return (
        <Chip size="sm" color="default" startContent={<XCircle className="w-3 h-3" />}>
          Disabled
        </Chip>
      );
    case 'installing':
      return (
        <Chip size="sm" color="warning">
          Installing...
        </Chip>
      );
    case 'error':
      return (
        <Chip size="sm" color="danger">
          Error
        </Chip>
      );
    default:
      return null;
  }
};

// ================================================
// BMAD Extension Actions Component
// ================================================

interface ExtensionActionsProps {
  status: 'enabled' | 'disabled' | 'installing' | 'error';
  onToggle: () => void;
  onSettings: () => void;
}

const ExtensionActions: React.FC<ExtensionActionsProps> = ({ status, onToggle, onSettings }) => {
  if (status === 'installing') {
    return (
      <Button size="sm" color="warning" variant="flat" disabled>
        Installing...
      </Button>
    );
  }

  if (status === 'error') {
    return (
      <Button size="sm" color="danger" variant="flat" onPress={onToggle}>
        Retry
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        color={status === 'enabled' ? 'default' : 'primary'}
        variant="flat"
        onPress={onToggle}
      >
        {status === 'enabled' ? 'Disable' : 'Enable'}
      </Button>
      <Button
        size="sm"
        color="default"
        variant="flat"
        startContent={<Settings className="w-4 h-4" />}
        onPress={onSettings}
      >
        Settings
      </Button>
    </div>
  );
};

// ================================================
// BMAD Extension Card Component
// ================================================

interface ExtensionCardProps {
  extension: FutureExtension;
  onToggle: () => void;
  onSettings: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, onToggle, onSettings }) => {
  const status = extension.isEnabled ? 'enabled' : 'disabled';
  const extensionData = JSON.parse(extension.dataJson);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ExtensionIcon type={(extension.extensionType as 'ai_feature' | 'analytics' | 'wellness') || 'ai_feature'} />
            <h3 className="font-semibold">{extension.extensionName}</h3>
          </div>
          <ExtensionStatus status={status} />
        </div>
        
        <ExtensionActions 
          status={status} 
          onToggle={onToggle} 
          onSettings={onSettings} 
        />
      </div>
      
      <p className="text-sm text-gray-600 mt-2">
        {extensionData.description}
      </p>
    </Card>
  );
};

// ================================================
// BMAD Available Extension Card Component
// ================================================

interface AvailableExtensionCardProps {
  extension: ExtensionData;
  onInstall: () => void;
}

const AvailableExtensionCard: React.FC<AvailableExtensionCardProps> = ({ extension, onInstall }) => {
  const extensionData = JSON.parse(extension.dataJson);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ExtensionIcon type={(extension.extensionType as 'ai_feature' | 'analytics' | 'wellness') || 'ai_feature'} />
          <h3 className="font-semibold">{extension.extensionName}</h3>
        </div>
        <Chip 
          size="sm" 
          color={extension.extensionType === 'ai_feature' ? 'primary' : extension.extensionType === 'analytics' ? 'warning' : 'danger'}
        >
          {extension.extensionType}
        </Chip>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        {extensionData.description}
      </p>
      
      <Button
        size="sm"
        color="primary"
        variant="flat"
        onPress={onInstall}
        startContent={<Plus className="w-4 h-4" />}
      >
        Install
      </Button>
    </Card>
  );
};

// ================================================
// BMAD Main Component
// ================================================

const V14ExtensionsDemoContent: React.FC = () => {
  const { extensions, isLoading, createExtension, toggleExtension } = useExtensions();

  const defaultExtensions: ExtensionData[] = [
    {
      extensionId: 'ai_coaching_v2',
      extensionType: 'ai_feature',
      extensionName: 'AI Coaching V2',
      dataJson: JSON.stringify({
        description: 'Enhanced AI coaching with advanced personalization',
        features: ['voice_coaching', 'emotion_detection', 'personalized_insights'],
        status: 'beta'
      }),
      status: 'disabled',
    },
    {
      extensionId: 'advanced_analytics',
      extensionType: 'analytics',
      extensionName: 'Advanced Analytics',
      dataJson: JSON.stringify({
        description: 'Advanced user behavior analytics and insights',
        features: ['behavior_tracking', 'pattern_analysis', 'predictive_insights'],
        status: 'development'
      }),
      status: 'disabled',
    },
    {
      extensionId: 'mood_tracking',
      extensionType: 'wellness',
      extensionName: 'Mood Tracking',
      dataJson: JSON.stringify({
        description: 'Advanced mood tracking with MBTI correlation',
        features: ['daily_mood', 'mbti_correlation', 'insights'],
        status: 'stable'
      }),
      status: 'disabled',
    },
  ];

  const handleInstall = (extension: ExtensionData) => {
    createExtension(extension);
  };

  const handleToggle = (extensionId: string) => {
    toggleExtension(extensionId);
  };

  const handleSettings = (extensionId: string) => {
    console.log('Settings for extension:', extensionId);
    // TODO: Implement settings modal
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">V14 Future Extensions</h1>
        <p className="text-gray-600">
          Demonstratie van de nieuwe V14 Future Extensions functionaliteit
        </p>
      </div>

      {/* Available Extensions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Available Extensions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultExtensions.map((extension) => (
              <AvailableExtensionCard
                key={extension.extensionId}
                extension={extension}
                onInstall={() => handleInstall(extension)}
              />
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Installed Extensions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Installed Extensions</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="text-gray-500 text-center py-8">Loading extensions...</p>
          ) : extensions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No extensions installed yet. Install some extensions above to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {extensions.map((extension) => (
                <ExtensionCard
                  key={extension.id}
                  extension={extension}
                  onToggle={() => handleToggle(extension.id)}
                  onSettings={() => handleSettings(extension.id)}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

// ================================================
// BMAD Main Component with Provider
// ================================================

const V14ExtensionsDemo: React.FC = () => {
  return (
    <ExtensionProvider>
      <V14ExtensionsDemoContent />
    </ExtensionProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const V14Extensions = {
  Provider: ExtensionProvider,
  Demo: V14ExtensionsDemo,
  Card: ExtensionCard,
  AvailableCard: AvailableExtensionCard,
  Status: ExtensionStatus,
  Actions: ExtensionActions,
  Icon: ExtensionIcon,
  useExtensions
};

export default V14ExtensionsDemo;

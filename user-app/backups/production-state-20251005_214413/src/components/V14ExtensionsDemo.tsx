/**
 * V14 Extensions Demo Component
 * 
 * Demonstratie van hoe je de nieuwe V14 Future Extensions kunt gebruiken
 * 
 * @version 14.0.0
 * @author Thomas
 */

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Badge } from '@nextui-org/react';
import { Plus, Settings, Zap, Brain, Heart } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import database from '../database'; // Nu V14
import FutureExtension from '../database/v14/models/FutureExtension'; // Nieuwe V14 FutureExtension model

const V14ExtensionsDemo: React.FC = () => {
  const { userData } = useAppStore();
  const [extensions, setExtensions] = useState<FutureExtension[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // V14: Load extensions from database
  const loadExtensions = async () => {
    try {
      const extensionsCollection = database.get('future_extensions');
      const allExtensions = await extensionsCollection.query().fetch();
      const userExtensions = allExtensions.filter((ext: any) => ext.userId === (userData?.id || ''));
      
      setExtensions(userExtensions as any);
    } catch (error) {
      console.error('Failed to load extensions:', error);
    }
  };

  // V14: Create new extension
  const createExtension = async (extensionData: {
    extensionId: string;
    extensionType: string;
    extensionName: string;
    dataJson: string;
    isEnabled: boolean;
  }) => {
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
          extension.isEnabled = extensionData.isEnabled;
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

  // V14: Toggle extension
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

  const defaultExtensions = [
    {
      extensionId: 'ai_coaching_v2',
      extensionType: 'ai_feature',
      extensionName: 'AI Coaching V2',
      dataJson: JSON.stringify({
        description: 'Enhanced AI coaching with advanced personalization',
        features: ['voice_coaching', 'emotion_detection', 'personalized_insights'],
        status: 'beta'
      }),
      isEnabled: false,
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
      isEnabled: false,
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
      isEnabled: false,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">V14 Future Extensions</h1>
        <p className="text-gray-600">
          Demonstratie van de nieuwe V14 Future Extensions functionaliteit
        </p>
      </div>

      {/* Default Extensions */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Available Extensions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultExtensions.map((ext) => (
              <Card key={ext.extensionId} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {ext.extensionType === 'ai_feature' && <Brain className="w-5 h-5 text-blue-500" />}
                    {ext.extensionType === 'analytics' && <Zap className="w-5 h-5 text-yellow-500" />}
                    {ext.extensionType === 'wellness' && <Heart className="w-5 h-5 text-red-500" />}
                    <h3 className="font-semibold">{ext.extensionName}</h3>
                  </div>
                  <Chip size="sm" color={ext.extensionType === 'ai_feature' ? 'primary' : ext.extensionType === 'analytics' ? 'warning' : 'danger'}>
                    {ext.extensionType}
                  </Chip>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {JSON.parse(ext.dataJson).description}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onPress={() => createExtension(ext)}
                    startContent={<Plus className="w-4 h-4" />}
                  >
                    Install
                  </Button>
                </div>
              </Card>
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
          {extensions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No extensions installed yet. Install some extensions above to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {extensions.map((extension) => (
                <Card key={extension.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {extension.extensionType === 'ai_feature' && <Brain className="w-5 h-5 text-blue-500" />}
                        {extension.extensionType === 'analytics' && <Zap className="w-5 h-5 text-yellow-500" />}
                        {extension.extensionType === 'wellness' && <Heart className="w-5 h-5 text-red-500" />}
                        <h3 className="font-semibold">{extension.extensionName}</h3>
                      </div>
                      <Chip size="sm" color={extension.isEnabled ? 'success' : 'default'}>
                        {extension.isEnabled ? 'Enabled' : 'Disabled'}
                      </Chip>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color={extension.isEnabled ? 'default' : 'primary'}
                        variant="flat"
                        onPress={() => toggleExtension(extension.id)}
                      >
                        {extension.isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size="sm"
                        color="default"
                        variant="flat"
                        startContent={<Settings className="w-4 h-4" />}
                      >
                        Settings
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {JSON.parse(extension.dataJson).description}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default V14ExtensionsDemo;

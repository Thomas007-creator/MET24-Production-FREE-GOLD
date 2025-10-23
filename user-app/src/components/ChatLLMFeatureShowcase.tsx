/**
 * ChatLLM Feature Showcase - Test All Features
 * 
 * Comprehensive test interface voor alle 10 ChatLLM features
 * Privacy-first demonstratie met real-time audit trail
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Input, 
  Textarea, 
  Select, 
  SelectItem,
  Chip,
  Progress,
  Tabs,
  Tab
} from '@nextui-org/react';
import { 
  Brain, 
  MessageCircle, 
  Heart, 
  BookOpen, 
  Shield, 
  Search, 
  Palette, 
  Target, 
  FileText, 
  Bell,
  Activity,
  Lock,
  CheckCircle,
  AlertTriangle,
  Cpu,
  Database
} from 'lucide-react';
import chatLLMService from '../services/chatLLMService';
import { useAppStore } from '../store/useAppStore';

interface FeatureTest {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: 'coaching' | 'analysis' | 'content' | 'safety';
  inputs: FeatureInput[];
  example: any;
}

interface FeatureInput {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface TestResult {
  featureId: string;
  success: boolean;
  result?: any;
  error?: string;
  metadata: any;
  auditId: string;
  timestamp: number;
}

const ChatLLMFeatureShowcase: React.FC = () => {
  const { userData } = useAppStore();
  const [selectedFeature, setSelectedFeature] = useState<string>('chat_coaching');
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [modelInfo, setModelInfo] = useState<any>(null);

  // Feature definitions
  const features: FeatureTest[] = [
    {
      id: 'chat_coaching',
      name: '💬 Chat & Coaching',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'MBTI-gebaseerde life coaching en gespreksbegeleiding',
      category: 'coaching',
      inputs: [
        { key: 'message', label: 'Je vraag of situatie', type: 'textarea', placeholder: 'Ik heb moeite met...', required: true },
        { key: 'context', label: 'Extra context', type: 'textarea', placeholder: 'Achtergrond informatie...' }
      ],
      example: {
        message: 'Ik heb moeite met beslissingen nemen op het werk. Ik twijfel altijd of ik de juiste keuze maak.',
        context: 'Nieuwe baan, veel verantwoordelijkheid, team verwacht snelle beslissingen.'
      }
    },
    {
      id: 'wellness_analysis',
      name: '📊 Wellness Analysis',
      icon: <Heart className="w-5 h-5" />,
      description: 'Holistische analyse van je 9 levensgebieden met AI inzichten',
      category: 'analysis',
      inputs: [
        { key: 'challenges', label: 'Huidige uitdagingen', type: 'textarea', placeholder: 'Waar loop je tegenaan?', required: true }
      ],
      example: {
        challenges: 'Ik voel me overweldigd door werk-privé balans. Fitness gaat slecht, relaties hebben aandacht nodig.'
      }
    },
    {
      id: 'content_curation',
      name: '📖 Content Curation',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Gepersonaliseerde content aanbevelingen op basis van je MBTI en interesses',
      category: 'content',
      inputs: [
        { key: 'interests', label: 'Interessegebieden', type: 'text', placeholder: 'Persoonlijke groei, productiviteit, relaties', required: true },
        { key: 'level', label: 'Kennis niveau', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'], required: true },
        { key: 'timeAvailable', label: 'Beschikbare tijd', type: 'select', options: ['15 minuten', '30 minuten', '1 uur', '2+ uur'], required: true }
      ],
      example: {
        interests: 'Persoonlijke groei, mindfulness, productiviteit',
        level: 'Intermediate',
        timeAvailable: '30 minuten'
      }
    },
    {
      id: 'community_moderation',
      name: '🛡️ Community Moderation',
      icon: <Shield className="w-5 h-5" />,
      description: 'Automatische content moderation voor veilige community',
      category: 'safety',
      inputs: [
        { key: 'content', label: 'Content om te beoordelen', type: 'textarea', placeholder: 'Community post of comment...', required: true },
        { key: 'contentType', label: 'Content type', type: 'select', options: ['post', 'comment', 'message'], required: true }
      ],
      example: {
        content: 'Geweldige discussie! Ik ben het niet eens met je standpunt maar respecteer je mening. Laten we hierover doorpraten.',
        contentType: 'comment'
      }
    },
    {
      id: 'pattern_recognition',
      name: '🔍 Pattern Recognition',
      icon: <Search className="w-5 h-5" />,
      description: 'Herkenning van gedragspatronen en trends in je data',
      category: 'analysis',
      inputs: [
        { key: 'timeframe', label: 'Tijdsperiode', type: 'select', options: ['Afgelopen week', 'Afgelopen maand', 'Afgelopen 3 maanden'], required: true }
      ],
      example: {
        timeframe: 'Afgelopen maand'
      }
    },
    {
      id: 'creative_generation',
      name: '🎨 Creative Generation',
      icon: <Palette className="w-5 h-5" />,
      description: 'AI-ondersteunde creatieve content generatie',
      category: 'content',
      inputs: [
        { key: 'task', label: 'Creatieve taak', type: 'textarea', placeholder: 'Wat wil je creëren?', required: true },
        { key: 'style', label: 'Stijl voorkeur', type: 'select', options: ['Professioneel', 'Casual', 'Inspirerend', 'Humoristisch'], required: true },
        { key: 'audience', label: 'Doelgroep', type: 'select', options: ['Algemeen', 'Professionals', 'Jongeren', 'MBTI Community'], required: true }
      ],
      example: {
        task: 'Schrijf een motiverende tekst over persoonlijke groei voor mijn LinkedIn profiel',
        style: 'Inspirerend',
        audience: 'Professionals'
      }
    },
    {
      id: 'goal_setting',
      name: '🎯 Goal Setting',
      icon: <Target className="w-5 h-5" />,
      description: 'SMART goal setting met MBTI-geoptimaliseerde planning',
      category: 'coaching',
      inputs: [
        { key: 'goal', label: 'Je doel', type: 'textarea', placeholder: 'Wat wil je bereiken?', required: true },
        { key: 'situation', label: 'Huidige situatie', type: 'textarea', placeholder: 'Waar sta je nu?', required: true },
        { key: 'timeframe', label: 'Tijdsframe', type: 'select', options: ['1 maand', '3 maanden', '6 maanden', '1 jaar'], required: true }
      ],
      example: {
        goal: 'Ik wil een gezondere werk-privé balans creëren',
        situation: 'Ik werk momenteel 50+ uur per week en heb weinig tijd voor mezelf',
        timeframe: '3 maanden'
      }
    },
    {
      id: 'journal_analysis',
      name: '📝 Journal Analysis',
      icon: <FileText className="w-5 h-5" />,
      description: 'Analyse van journal entries voor zelfinzicht',
      category: 'analysis',
      inputs: [
        { key: 'journalText', label: 'Journal entry', type: 'textarea', placeholder: 'Wat heb je vandaag ervaren?', required: true },
        { key: 'moodRating', label: 'Stemming (1-10)', type: 'number', required: true }
      ],
      example: {
        journalText: 'Vandaag was een uitdagende dag. Ik had een belangrijk gesprek met mijn manager over mijn carrière pad. Ik voel me hoopvol maar ook een beetje onzeker over de toekomst.',
        moodRating: 7
      }
    },
    {
      id: 'notification_intelligence',
      name: '🔔 Notification Intelligence',
      icon: <Bell className="w-5 h-5" />,
      description: 'Slimme notificatie timing en content optimalisatie',
      category: 'coaching',
      inputs: [],
      example: {}
    },
    {
      id: 'behavioral_insights',
      name: '🧠 Behavioral Insights',
      icon: <Activity className="w-5 h-5" />,
      description: 'Gedragsinzichten op basis van app usage patronen',
      category: 'analysis',
      inputs: [],
      example: {}
    }
  ];

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      const info = await chatLLMService.getModelInfo();
      setModelInfo(info);
    } catch (error) {
      console.error('Failed to load model info:', error);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setInputValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const loadExample = () => {
    const feature = features.find(f => f.id === selectedFeature);
    if (feature) {
      setInputValues(feature.example);
    }
  };

  const runFeatureTest = async () => {
    const feature = features.find(f => f.id === selectedFeature);
    if (!feature) return;

    setIsProcessing(true);

    try {
      let result;
      const mbtiType = userData?.mbtiType || 'ENFP';

      switch (selectedFeature) {
        case 'chat_coaching':
          result = await chatLLMService.processChatCoaching(
            inputValues.message || '',
            mbtiType,
            inputValues.context
          );
          break;

        case 'wellness_analysis':
          result = await chatLLMService.processWellnessAnalysis(
            { /* mock scores */ },
            mbtiType,
            inputValues.challenges ? [inputValues.challenges] : []
          );
          break;

        case 'content_curation':
          result = await chatLLMService.processContentCuration(
            inputValues.interests ? inputValues.interests.split(',').map((s: string) => s.trim()) : [],
            inputValues.level || 'Beginner',
            inputValues.timeAvailable || '30 minuten',
            mbtiType
          );
          break;

        case 'community_moderation':
          result = await chatLLMService.processCommunityModeration(
            inputValues.content || '',
            inputValues.contentType || 'post',
            { /* mock rules */ }
          );
          break;

        case 'pattern_recognition':
          result = await chatLLMService.processPatternRecognition(
            { /* mock behavior data */ },
            inputValues.timeframe || 'Afgelopen week',
            mbtiType
          );
          break;

        case 'creative_generation':
          result = await chatLLMService.processCreativeGeneration(
            inputValues.task || '',
            inputValues.style || 'Professioneel',
            inputValues.audience || 'Algemeen',
            mbtiType
          );
          break;

        case 'goal_setting':
          result = await chatLLMService.processGoalSetting(
            inputValues.goal || '',
            inputValues.situation || '',
            inputValues.timeframe || '3 maanden',
            {},
            mbtiType
          );
          break;

        case 'journal_analysis':
          result = await chatLLMService.processJournalAnalysis(
            inputValues.journalText || '',
            parseInt(inputValues.moodRating) || 5,
            'vandaag',
            mbtiType
          );
          break;

        case 'notification_intelligence':
          result = await chatLLMService.processNotificationIntelligence(
            { /* mock activity */ },
            { /* mock context */ },
            { /* mock notifications */ },
            mbtiType
          );
          break;

        case 'behavioral_insights':
          result = await chatLLMService.processBehavioralInsights(
            { /* mock patterns */ },
            { /* mock triggers */ },
            { /* mock outcomes */ },
            mbtiType
          );
          break;

        default:
          throw new Error(`Unknown feature: ${selectedFeature}`);
      }

      const testResult: TestResult = {
        featureId: selectedFeature,
        success: result.success,
        result: result.result,
        error: result.error,
        metadata: result.metadata,
        auditId: result.auditId,
        timestamp: Date.now()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 results

    } catch (error) {
      const testResult: TestResult = {
        featureId: selectedFeature,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {},
        auditId: 'error',
        timestamp: Date.now()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFeatureData = features.find(f => f.id === selectedFeature);
  const categoryFeatures = features.filter(f => selectedFeatureData ? f.category === selectedFeatureData.category : false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Brain className="w-8 h-8" />
                  ChatLLM Feature Showcase
                </h1>
                <p className="text-gray-300 mt-2">
                  Test alle ChatLLM features met privacy-first processing en real-time audit trail
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Chip 
                  color={modelInfo?.available ? 'success' : 'danger'} 
                  variant="flat"
                  startContent={<Lock className="w-4 h-4" />}
                >
                  {modelInfo?.available ? 'WebLLM Ready' : 'Offline Mode'}
                </Chip>
                <Chip color="primary" variant="flat">
                  MBTI: {userData?.mbtiType || 'ENFP'}
                </Chip>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Feature Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white">🚀 Select Feature</h2>
              </CardHeader>
              <CardBody>
                <Tabs 
                  selectedKey={selectedFeature}
                  onSelectionChange={(key) => setSelectedFeature(key as string)}
                  className="w-full"
                  variant="underlined"
                >
                  {features.map((feature) => (
                    <Tab
                      key={feature.id}
                      title={
                        <div className="flex items-center gap-2 text-left">
                          {feature.icon}
                          <div>
                            <div className="font-medium">{feature.name}</div>
                            <div className="text-xs opacity-70">{feature.description}</div>
                          </div>
                        </div>
                      }
                    />
                  ))}
                </Tabs>
              </CardBody>
            </Card>

            {/* Model Info */}
            <Card className="mt-4 bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  System Status
                </h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">WebLLM Available:</span>
                  <Chip color={modelInfo?.available ? 'success' : 'danger'} size="sm">
                    {modelInfo?.available ? 'Yes' : 'No'}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">GPU Acceleration:</span>
                  <Chip color={modelInfo?.gpuAcceleration ? 'success' : 'warning'} size="sm">
                    {modelInfo?.gpuAcceleration ? 'WebGPU' : 'CPU Only'}
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Privacy Mode:</span>
                  <Chip color="success" size="sm">100% Local</Chip>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Feature Input & Testing */}
          <div className="lg:col-span-2">
            {selectedFeatureData && (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {selectedFeatureData.icon}
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {selectedFeatureData.name}
                        </h2>
                        <p className="text-gray-300">{selectedFeatureData.description}</p>
                      </div>
                    </div>
                    <Button
                      color="secondary"
                      variant="flat"
                      size="sm"
                      onClick={loadExample}
                    >
                      Load Example
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="space-y-4">
                  {/* Feature Inputs */}
                  {selectedFeatureData.inputs.map((input) => {
                    if (input.type === 'textarea') {
                      return (
                        <Textarea
                          key={input.key}
                          label={input.label}
                          placeholder={input.placeholder}
                          value={inputValues[input.key] || ''}
                          onChange={(e) => handleInputChange(input.key, e.target.value)}
                          required={input.required}
                          className="text-white"
                        />
                      );
                    }
                    
                    if (input.type === 'select') {
                      return (
                        <Select
                          key={input.key}
                          label={input.label}
                          placeholder={`Select ${input.label.toLowerCase()}`}
                          selectedKeys={inputValues[input.key] ? [inputValues[input.key]] : []}
                          onSelectionChange={(keys) => {
                            const value = Array.from(keys)[0];
                            handleInputChange(input.key, value);
                          }}
                          className="text-white"
                        >
                          {(input.options || []).map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </Select>
                      );
                    }

                    if (input.type === 'number') {
                      return (
                        <Input
                          key={input.key}
                          type="number"
                          label={input.label}
                          placeholder={input.placeholder}
                          value={inputValues[input.key] || ''}
                          onChange={(e) => handleInputChange(input.key, e.target.value)}
                          required={input.required}
                          className="text-white"
                        />
                      );
                    }

                    return (
                      <Input
                        key={input.key}
                        label={input.label}
                        placeholder={input.placeholder}
                        value={inputValues[input.key] || ''}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        required={input.required}
                        className="text-white"
                      />
                    );
                  })}

                  {/* Test Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      color="primary"
                      size="lg"
                      onClick={runFeatureTest}
                      isLoading={isProcessing}
                      disabled={isProcessing}
                      className="flex-1"
                      startContent={!isProcessing ? <Brain className="w-5 h-5" /> : null}
                    >
                      {isProcessing ? 'Processing with WebLLM...' : 'Test Feature'}
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <Progress 
                        isIndeterminate 
                        color="primary" 
                        className="w-full"
                        label="AI Processing..."
                      />
                      <p className="text-gray-300 text-sm text-center">
                        🛡️ Processing locally for maximum privacy - zero external API calls
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Test Results */}
            {testResults.length > 0 && (
              <Card className="mt-6 bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Test Results & Audit Trail
                  </h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  {testResults.map((result, index) => (
                    <Card key={index} className="bg-white/5 border border-white/10">
                      <CardBody>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                            )}
                            <span className="font-semibold text-white">
                              {features.find(f => f.id === result.featureId)?.name}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </div>
                        </div>

                        {result.success ? (
                          <div className="space-y-2">
                            <div className="bg-green-900/20 p-3 rounded-lg">
                              <p className="text-green-100 text-sm">{result.result}</p>
                            </div>
                            <div className="flex gap-2 text-xs text-gray-400">
                              <Chip size="sm" color="success" variant="flat">
                                {result.metadata.processingTimeMs}ms
                              </Chip>
                              <Chip size="sm" color="primary" variant="flat">
                                {result.metadata.modelUsed}
                              </Chip>
                              <Chip size="sm" color="secondary" variant="flat">
                                Audit: {result.auditId.slice(0, 8)}...
                              </Chip>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-red-900/20 p-3 rounded-lg">
                            <p className="text-red-100 text-sm">{result.error}</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  ))}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatLLMFeatureShowcase;
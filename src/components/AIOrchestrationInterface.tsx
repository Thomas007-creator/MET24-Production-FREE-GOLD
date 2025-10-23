import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Input, 
  Chip, 
  Progress, 
  Divider,
  Tabs,
  Tab,
  Badge,
  Spinner,
  Avatar
} from '@nextui-org/react';
import { 
  Brain, 
  Palette, 
  Heart, 
  Zap, 
  MessageCircle, 
  Settings, 
  Eye,
  Target,
  BookOpen,
  Layers,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import aiOrchestrationService, { OrchestrationResult, AISystemResponse } from '../services/aiOrchestrationService';

/**
 * 🤖 AI Orchestration Interface - Priority #6 Implementation
 * 
 * Advanced AI orchestration dashboard that coordinates AI-1, AI-2, and AI-3
 * within the PWA AI ecosystem. Features AI-2 as the central cognitive coordinator
 * for wisdom and narrative therapy integration.
 * 
 * Visual representation of:
 * - AI-1: Esthetische AI (Beauty & Creative Expression) 🎨
 * - AI-2: Cognitieve AI (Wisdom & Narrative Therapy) 🧠 [COORDINATOR]
 * - AI-3: Ethische AI (Ethics & Rhythmic Synchronization) ⚖️
 */

interface AIOrchestrationProps {
  className?: string;
}

export const AIOrchestrationInterface: React.FC<AIOrchestrationProps> = ({ 
  className = "" 
}) => {
  const { userData } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('orchestration');
  const [userInput, setUserInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<OrchestrationResult | null>(null);
  const [orchestrationHistory, setOrchestrationHistory] = useState<OrchestrationResult[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<string>('full_orchestration');

  const mbtiType = userData?.mbtiType || 'INFP';
  const userId = userData?.id || 'user-placeholder';

  // Session types for orchestration
  const sessionTypes = [
    { id: 'coaching', name: 'AI Coaching', icon: MessageCircle, color: 'primary' as const },
    { id: 'wellness', name: 'Wellness Analysis', icon: Heart, color: 'success' as const },
    { id: 'imagination', name: 'Active Imagination', icon: Eye, color: 'secondary' as const },
    { id: 'action_planning', name: 'Action Plans', icon: Target, color: 'warning' as const },
    { id: 'content_discovery', name: 'Content Discovery', icon: BookOpen, color: 'default' as const },
    { id: 'full_orchestration', name: 'Full Orchestration', icon: Layers, color: 'danger' as const }
  ];

  // AI Systems configuration
  const aiSystems = [
    {
      id: 'ai1_aesthetic',
      name: 'AI-1: Esthetische AI',
      role: 'Schoonheid & Creatieve Expressie',
      icon: '🎨',
      color: 'primary' as const,
      isCoordinator: false,
      status: 'active'
    },
    {
      id: 'ai2_cognitive',
      name: 'AI-2: Cognitieve AI',
      role: 'Wijsheid & Narratieve Therapieën',
      icon: '🧠',
      color: 'success' as const,
      isCoordinator: true,
      status: 'active'
    },
    {
      id: 'ai3_ethical',
      name: 'AI-3: Ethische AI',
      role: 'Het Goede & Ritmische Synchronisatie',
      icon: '⚖️',
      color: 'warning' as const,
      isCoordinator: false,
      status: 'active'
    }
  ];

  useEffect(() => {
    // Load any existing orchestration history
    loadOrchestrationHistory();
  }, []);

  const loadOrchestrationHistory = async () => {
    // In real implementation, would load from database
    setOrchestrationHistory([]);
  };

  const handleOrchestration = async () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    try {
      let result: OrchestrationResult;

      switch (selectedSessionType) {
        case 'coaching':
          result = await aiOrchestrationService.orchestrateCoaching(userId, mbtiType, userInput);
          break;
        case 'wellness':
          result = await aiOrchestrationService.orchestrateWellness(userId, mbtiType, userInput);
          break;
        case 'imagination':
          result = await aiOrchestrationService.orchestrateImagination(userId, mbtiType, userInput);
          break;
        case 'action_planning':
          result = await aiOrchestrationService.orchestrateActionPlanning(userId, mbtiType, userInput);
          break;
        case 'content_discovery':
          result = await aiOrchestrationService.orchestrateContentDiscovery(userId, mbtiType, userInput);
          break;
        default:
          result = await aiOrchestrationService.orchestrateFull(userId, mbtiType, userInput);
      }

      setCurrentResult(result);
      setOrchestrationHistory(prev => [result, ...prev]);
      setUserInput('');
    } catch (error) {
      console.error('Error during AI orchestration:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSessionTypeInfo = (type: string) => {
    return sessionTypes.find(st => st.id === type) || sessionTypes[5];
  };

  const renderAISystemCard = (system: any, response?: AISystemResponse) => (
    <Card 
      key={system.id}
      className={`bg-white/5 backdrop-blur-md border border-white/10 ${system.isCoordinator ? 'ring-2 ring-success/50' : ''}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{system.icon}</div>
            <div>
              <h3 className="font-semibold text-white text-sm">
                {system.name}
                {system.isCoordinator && (
                  <Badge size="sm" color="success" variant="flat" className="ml-2">
                    COORDINATOR
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-gray-300">{system.role}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {response && (
              <div className="text-right">
                <div className="text-xs text-gray-400">Confidence</div>
                <div className="text-sm font-semibold text-white">
                  {response.confidence}%
                </div>
              </div>
            )}
            <Activity 
              className={`w-4 h-4 ${system.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}
            />
          </div>
        </div>
      </CardHeader>
      
      {response && (
        <CardBody className="pt-0">
          <div className="space-y-2">
            <Progress 
              value={response.confidence} 
              color={system.color}
              size="sm"
              classNames={{
                track: "bg-white/10",
                indicator: `bg-gradient-to-r from-${system.color}-500 to-${system.color}-600`
              }}
            />
            
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Response</div>
              <div className="text-sm text-gray-300 line-clamp-3">
                {typeof response.response === 'object' 
                  ? JSON.stringify(response.response, null, 2).slice(0, 100) + '...'
                  : response.response.toString().slice(0, 100) + '...'
                }
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>Processing: {response.processingTime}ms</span>
              <span>System: {system.id}</span>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  );

  const renderOrchestrationResult = (result: OrchestrationResult) => (
    <div className="space-y-6">
      
      {/* Coordinated Response */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-success-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">
                AI-2 Gecoördineerde Synthese
              </h3>
              <p className="text-sm text-gray-300">
                Centrale coördinatie door Cognitieve AI
              </p>
            </div>
            <Badge color="success" variant="flat">
              Confidence: {result.overallConfidence}%
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          {result.coordinatedResponse?.synthesizedGuidance && (
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-white mb-2">
                Gesynthetiseerde Begeleiding
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {result.coordinatedResponse.synthesizedGuidance}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.coordinatedResponse?.cognitiveIntegration && (
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-white mb-2">
                  Cognitieve Integratie
                </h4>
                <p className="text-xs text-gray-400">
                  {result.coordinatedResponse.cognitiveIntegration.integrationPattern || 'Pattern processing...'}
                </p>
              </div>
            )}
            
            {result.coordinatedResponse?.narrativeSynthesis && (
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-white mb-2">
                  Narratieve Synthese
                </h4>
                <p className="text-xs text-gray-400">
                  {result.coordinatedResponse.narrativeSynthesis.storyArc || 'Narrative processing...'}
                </p>
              </div>
            )}
            
            {result.coordinatedResponse?.wisdomDistillation && (
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-white mb-2">
                  Wijsheid Distillatie
                </h4>
                <p className="text-xs text-gray-400">
                  {result.coordinatedResponse.wisdomDistillation.practicalWisdom || 'Wisdom processing...'}
                </p>
              </div>
            )}
            
            {result.coordinatedResponse?.therapeuticApproach && (
              <div className="bg-white/5 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-white mb-2">
                  Therapeutische Benadering
                </h4>
                <p className="text-xs text-gray-400">
                  {result.coordinatedResponse.therapeuticApproach.therapeuticApproach || 'Therapy processing...'}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Individual AI System Responses */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Individuele AI Systeem Responsen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiSystems.map(system => {
            const response = result.individualResponses.find(r => r.systemId === system.id);
            return renderAISystemCard(system, response);
          })}
        </div>
      </div>

      {/* Synthesis Information */}
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader>
          <h3 className="text-lg font-semibold text-white">
            Orchestratie Metadata
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Sessie ID:</span>
              <span className="text-white ml-2">{result.sessionId}</span>
            </div>
            <div>
              <span className="text-gray-400">Gegenereerd:</span>
              <span className="text-white ml-2">
                {result.generatedAt.toLocaleString()}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-400">Synthese Redenering:</span>
              <p className="text-white text-xs mt-1 leading-relaxed">
                {result.synthesisReasoning}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    AI Orchestration Center
                  </h1>
                  <p className="text-gray-300 text-sm">
                    Gecoördineerde AI-systemen voor {mbtiType} - AI-2 als centrale coördinator
                  </p>
                </div>
              </div>
              <Badge color="danger" variant="flat">
                Priority #6
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* AI Systems Overview */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">
              AI Systeem Status
            </h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiSystems.map(system => renderAISystemCard(system))}
            </div>
          </CardBody>
        </Card>

        {/* Orchestration Interface */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">
              AI Orchestratie Interface
            </h2>
          </CardHeader>
          <CardBody>
            
            {/* Session Type Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Selecteer Sessie Type
              </label>
              <div className="flex flex-wrap gap-2">
                {sessionTypes.map(type => (
                  <Chip
                    key={type.id}
                    variant={selectedSessionType === type.id ? "solid" : "bordered"}
                    color={selectedSessionType === type.id ? type.color : "default"}
                    className={`cursor-pointer ${selectedSessionType === type.id ? '' : 'border-white/20 text-white/70 hover:bg-white/10'}`}
                    onClick={() => setSelectedSessionType(type.id)}
                    startContent={<type.icon className="w-3 h-3" />}
                  >
                    {type.name}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Input Interface */}
            <div className="space-y-4">
              <Input
                placeholder="Beschrijf je vraag of situatie voor AI orchestratie..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleOrchestration()}
                size="lg"
                classNames={{
                  input: "bg-transparent text-white placeholder:text-gray-400",
                  inputWrapper: "bg-white/5 border border-white/10"
                }}
                endContent={
                  <Button
                    color="primary"
                    onClick={handleOrchestration}
                    isLoading={isProcessing}
                    isDisabled={!userInput.trim() || isProcessing}
                    className="h-8"
                  >
                    {isProcessing ? <Spinner size="sm" /> : <Zap className="w-4 h-4" />}
                  </Button>
                }
              />
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>
                  Geselecteerd: {getSessionTypeInfo(selectedSessionType).name}
                </span>
                <span>
                  AI-2 coördineert alle systemen
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Results */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)}
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          <Tab 
            key="orchestration" 
            title={
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Huidige Orchestratie</span>
                {currentResult && <CheckCircle2 className="w-4 h-4 text-success" />}
              </div>
            }
          >
            <div className="mt-6">
              {isProcessing ? (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardBody className="flex items-center justify-center py-12">
                    <Spinner size="lg" color="primary" />
                    <p className="text-white mt-4">
                      AI systemen orchestreren voor {mbtiType}...
                    </p>
                    <p className="text-gray-300 text-sm mt-2">
                      AI-2 coördineert alle responsen
                    </p>
                  </CardBody>
                </Card>
              ) : currentResult ? (
                renderOrchestrationResult(currentResult)
              ) : (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardBody className="text-center py-12">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white">
                      Geen actieve orchestratie
                    </p>
                    <p className="text-gray-300 text-sm">
                      Gebruik het interface hierboven om een AI orchestratie te starten
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab 
            key="history" 
            title={
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4" />
                <span>Orchestratie Geschiedenis</span>
                {orchestrationHistory.length > 0 && (
                  <Badge size="sm" color="primary" variant="flat">
                    {orchestrationHistory.length}
                  </Badge>
                )}
              </div>
            }
          >
            <div className="mt-6 space-y-4">
              {orchestrationHistory.length > 0 ? (
                orchestrationHistory.map((result, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-md border border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            Sessie {result.sessionId}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {result.generatedAt.toLocaleString()}
                          </p>
                        </div>
                        <Badge color="success" variant="flat" size="sm">
                          {result.overallConfidence}% Confidence
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {result.synthesisReasoning}
                      </p>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardBody className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-white">
                      Geen orchestratie geschiedenis
                    </p>
                    <p className="text-gray-300 text-sm">
                      Start een orchestratie om geschiedenis op te bouwen
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab 
            key="settings" 
            title={
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Orchestratie Instellingen</span>
              </div>
            }
          >
            <div className="mt-6">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-white">
                    AI Orchestratie Configuratie
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">
                        Coördinator Instelling
                      </h4>
                      <p className="text-xs text-gray-400 mb-3">
                        AI-2 (Cognitieve AI) is ingesteld als centrale coördinator
                      </p>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <div className="text-xl">🧠</div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              AI-2: Cognitieve AI Coördinator
                            </div>
                            <div className="text-xs text-gray-400">
                              Wijsheid & Narratieve Therapieën
                            </div>
                          </div>
                          <Badge color="success" variant="flat" size="sm">
                            ACTIEF
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Divider className="bg-white/10" />

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">
                        Systeem Status
                      </h4>
                      <div className="space-y-2">
                        {aiSystems.map(system => (
                          <div key={system.id} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                            <div className="flex items-center space-x-2">
                              <span>{system.icon}</span>
                              <span className="text-sm text-white">{system.name}</span>
                              {system.isCoordinator && (
                                <Badge size="sm" color="success" variant="flat">
                                  COORDINATOR
                                </Badge>
                              )}
                            </div>
                            <Badge size="sm" color="success" variant="flat">
                              Online
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default AIOrchestrationInterface;
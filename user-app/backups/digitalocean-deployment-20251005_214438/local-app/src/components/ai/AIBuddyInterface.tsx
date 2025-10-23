/**
 * AI Buddy Interface Component
 * 
 * Echte AI Buddy functionaliteit met memory context, refusal logic, en proactieve coaching
 * Gebouwd op de uitgebreide SmartFilteringService
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Textarea, 
  Chip, 
  Progress, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Divider,
  Badge,
  Tooltip
} from '@nextui-org/react';
import { 
  Brain, 
  Heart, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  MessageCircle, 
  User, 
  Settings,
  History,
  TrendingUp,
  Lightbulb,
  Target
} from 'lucide-react';
import { 
  SmartFilteringService, 
  FilteringConfig, 
  FilteringResult, 
  UserMemoryContext, 
  ConversationContext, 
  EmotionalState,
  RefusalResult,
  AuditLogEntry
} from '../../services/smartFilteringService';
import { useAppStore } from '../../store/useAppStore';
import { logger } from '../../utils/logger';
import { aiApiKeyService } from '../../services/aiApiKeyService';

interface AIBuddyInterfaceProps {
  userId: string;
  mbtiType: string;
  onMemoryUpdate?: (memory: UserMemoryContext) => void;
  onTrustChange?: (trustLevel: number) => void;
}

const AIBuddyInterface: React.FC<AIBuddyInterfaceProps> = ({
  userId,
  mbtiType,
  onMemoryUpdate,
  onTrustChange
}) => {
  const { userData } = useAppStore();
  const [userMessage, setUserMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filteringResult, setFilteringResult] = useState<FilteringResult | null>(null);
  const [userMemory, setUserMemory] = useState<UserMemoryContext | null>(null);
  const [conversationContext, setConversationContext] = useState<ConversationContext | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [showMemoryPanel, setShowMemoryPanel] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [refusalModalOpen, setRefusalModalOpen] = useState(false);
  const [currentRefusal, setCurrentRefusal] = useState<RefusalResult | null>(null);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('grok-3');
  const [apiKeyStatus, setApiKeyStatus] = useState<Record<string, boolean>>({});
  const [freeTierUsage, setFreeTierUsage] = useState<Record<string, number>>({});

  const filteringService = SmartFilteringService.getInstance();
  const messageHistoryRef = useRef<HTMLDivElement>(null);

  // Initialize AI Buddy
  useEffect(() => {
    initializeAIBuddy();
  }, [userId, mbtiType]);

  const initializeAIBuddy = async () => {
    try {
      // Check available AI providers and API key status
      await checkAIProviderStatus();

      // Load or create user memory using existing database integration
      let memory = filteringService.getUserMemory(userId);
      if (!memory) {
        // Try to load from existing database tables first
        memory = await filteringService.loadUserMemoryFromDatabase(userId, mbtiType);
      }
      setUserMemory(memory);

      // Initialize conversation context
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setConversationContext({
        sessionId,
        messageHistory: [],
        currentTopic: 'general',
        conversationDepth: 0,
        userEngagement: 0.5
      });

      // Initialize emotional state
      setEmotionalState({
        primary: 'neutral',
        intensity: 0.5,
        stability: 0.7,
        triggers: [],
        copingStrategies: []
      });

      // Load recent audit logs
      const logs = filteringService.getAuditLogs(userId, 20);
      setAuditLogs(logs);

      logger.info('AI Buddy initialized', { userId, mbtiType, trustLevel: memory.trustLevel });
    } catch (error) {
      logger.error('Failed to initialize AI Buddy', { error, userId });
    }
  };

  const checkAIProviderStatus = async () => {
    try {
      // Get available providers for user
      const providers = await aiApiKeyService.getUserAIProviders(userId);
      setAvailableProviders(providers);

      // Check API key status for each provider
      const status: Record<string, boolean> = {};
      const usage: Record<string, number> = {};

      for (const provider of ['grok-3', 'openai', 'claude', 'ultimateai']) {
        const hasApiKey = await aiApiKeyService.getApiKey(userId, provider);
        status[provider] = !!hasApiKey;

        if (!hasApiKey) {
          // Check free tier usage
          const usageStats = await aiApiKeyService.getUsageStats(userId, provider);
          usage[provider] = usageStats?.requestsToday || 0;
        }
      }

      setApiKeyStatus(status);
      setFreeTierUsage(usage);

      // Set default provider (prefer user's API key, fallback to free tier)
      if (status['grok-3']) {
        setSelectedProvider('grok-3');
      } else if (status['openai']) {
        setSelectedProvider('openai');
      } else if (status['claude']) {
        setSelectedProvider('claude');
      } else if (status['ultimateai']) {
        setSelectedProvider('ultimateai');
      } else {
        setSelectedProvider('grok-3'); // Default to free tier
      }

      logger.info('AI provider status checked', { 
        userId, 
        providers, 
        status, 
        selectedProvider: selectedProvider 
      });
    } catch (error) {
      logger.error('Failed to check AI provider status', { error, userId });
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim() || !userMemory || !conversationContext || !emotionalState) return;

    setIsProcessing(true);
    setFilteringResult(null);

    try {
      // Check if user has reached free tier limits
      if (!apiKeyStatus[selectedProvider]) {
        const dailyLimit = 50; // Default free tier limit
        const currentUsage = freeTierUsage[selectedProvider] || 0;
        
        if (currentUsage >= dailyLimit) {
          setFilteringResult({
            allowed: false,
            filteredPrompt: '',
            safetyScore: 0,
            warnings: [`Daily free tier limit reached (${dailyLimit} requests). Please add your own API key for unlimited access.`],
            fallbackUsed: true,
            refusalResult: {
              shouldRefuse: true,
              refusalReason: 'safety',
              refusalMessage: `Daily free tier limit reached (${dailyLimit} requests). Please add your own ${selectedProvider} API key in settings for unlimited access.`,
              alternativeSuggestion: 'You can add your own API key in the settings to continue using AI Buddy without limits.',
              escalationLevel: 'user',
              userCanOverride: false
            }
          });
          setIsProcessing(false);
          return;
        }
      }

      // Create filtering config with AI Buddy context
      const config: FilteringConfig = {
        safetyLevel: 'medium',
        aiProvider: selectedProvider as any,
        mbtiType,
        context: 'coaching',
        allowCreative: true,
        allowControversial: false,
        maxResponseLength: 1000,
        // AI Buddy Extensions
        userMemory,
        conversationContext,
        emotionalState,
        enableRefusalLogic: true,
        enableMemoryIntegration: true,
        enableProactiveCoaching: true
      };

      // Process message through AI Buddy filtering
      const result = await filteringService.filterPrompt(userMessage, config);

      setFilteringResult(result);

      // Handle refusal
      if (result.refusalResult?.shouldRefuse) {
        setCurrentRefusal(result.refusalResult);
        setRefusalModalOpen(true);
        return;
      }

      // Update conversation context
      const updatedContext = {
        ...conversationContext,
        messageHistory: [
          ...conversationContext.messageHistory,
          {
            role: 'user' as const,
            content: userMessage,
            timestamp: new Date(),
            emotionalTone: emotionalState.primary
          }
        ],
        conversationDepth: conversationContext.conversationDepth + 1,
        userEngagement: Math.min(1, conversationContext.userEngagement + 0.1)
      };
      setConversationContext(updatedContext);

      // Update user memory
      const updatedMemory = {
        ...userMemory,
        recentInteractions: [
          ...userMemory.recentInteractions.slice(-9), // Keep last 10
          userMessage
        ],
        lastInteraction: new Date()
      };

      // Apply trust adjustment
      if (result.trustAdjustment) {
        updatedMemory.trustLevel = Math.max(0, Math.min(1, 
          updatedMemory.trustLevel + result.trustAdjustment
        ));
        onTrustChange?.(updatedMemory.trustLevel);
      }

      // Save to existing database tables
      await filteringService.saveUserMemoryToDatabase(updatedMemory);
      filteringService.setUserMemory(updatedMemory);
      setUserMemory(updatedMemory);
      onMemoryUpdate?.(updatedMemory);

      // Clear message
      setUserMessage('');

      // Update audit logs
      const logs = filteringService.getAuditLogs(userId, 20);
      setAuditLogs(logs);

      logger.info('AI Buddy message processed', {
        userId,
        allowed: result.allowed,
        trustLevel: updatedMemory.trustLevel,
        memoryInsights: result.memoryInsights?.length || 0
      });

    } catch (error) {
      logger.error('AI Buddy message processing failed', { error, userId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefusalOverride = () => {
    setRefusalModalOpen(false);
    setCurrentRefusal(null);
    // Continue with original message (user override)
  };

  const getTrustLevelColor = (trustLevel: number): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    if (trustLevel < 0.3) return 'danger';
    if (trustLevel < 0.7) return 'warning';
    return 'success';
  };

  const getEmotionalStateColor = (state: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    const colors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
      happy: 'success',
      sad: 'danger',
      anxious: 'warning',
      excited: 'primary',
      neutral: 'default',
      overwhelmed: 'danger'
    };
    return colors[state] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* AI Provider Status Panel */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-purple-500" />
            <div>
              <h3 className="text-lg font-semibold">AI Buddy Status</h3>
              <p className="text-sm text-gray-500">Memory-enabled AI companion</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="bordered"
              startContent={<History className="w-4 h-4" />}
              onPress={() => setShowAuditLogs(true)}
            >
              Audit Logs
            </Button>
            <Button
              size="sm"
              variant="bordered"
              startContent={<User className="w-4 h-4" />}
              onPress={() => setShowMemoryPanel(true)}
            >
              Memory
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {/* AI Provider Selection */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">AI Provider</h4>
            <div className="flex flex-wrap gap-2">
              {['grok', 'openai', 'claude', 'ultimateai'].map((provider) => (
                <Tooltip
                  key={provider}
                  content={
                    apiKeyStatus[provider] 
                      ? `Using your ${provider} API key` 
                      : `Free tier: ${freeTierUsage[provider] || 0}/50 requests today`
                  }
                >
                  <Chip
                    color={selectedProvider === provider ? 'primary' : 'default'}
                    variant={selectedProvider === provider ? 'solid' : 'flat'}
                    startContent={
                      apiKeyStatus[provider] ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedProvider(provider)}
                  >
                    {provider}
                    {!apiKeyStatus[provider] && (
                      <span className="ml-1 text-xs">(Free)</span>
                    )}
                  </Chip>
                </Tooltip>
              ))}
            </div>
            {!apiKeyStatus[selectedProvider] && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Free Tier:</strong> {freeTierUsage[selectedProvider] || 0}/50 requests today
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Add your own API key in settings for unlimited access
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Trust Level */}
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Trust Level</span>
                  <span>{userMemory ? Math.round(userMemory.trustLevel * 100) : 0}%</span>
                </div>
                <Progress
                  value={userMemory ? userMemory.trustLevel * 100 : 0}
                  color={getTrustLevelColor(userMemory?.trustLevel || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Emotional State */}
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Emotional State</span>
                  <Chip
                    size="sm"
                    color={getEmotionalStateColor(emotionalState?.primary || 'neutral')}
                    variant="flat"
                  >
                    {emotionalState?.primary || 'neutral'}
                  </Chip>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Intensity: {emotionalState ? Math.round(emotionalState.intensity * 100) : 0}%
                </div>
              </div>
            </div>

            {/* Conversation Depth */}
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Conversation</span>
                  <span>{conversationContext?.conversationDepth || 0} messages</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Engagement: {conversationContext ? Math.round(conversationContext.userEngagement * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* AI Buddy Insights */}
      {filteringResult && (
        <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold">AI Buddy Insights</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Memory Insights */}
            {filteringResult.memoryInsights && filteringResult.memoryInsights.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Memory Insights</h4>
                <div className="space-y-1">
                  {filteringResult.memoryInsights.map((insight, index) => (
                    <Chip key={index} size="sm" variant="flat" color="primary">
                      {insight}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Emotional Guidance */}
            {filteringResult.emotionalGuidance && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Emotional Guidance</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  {filteringResult.emotionalGuidance}
                </p>
              </div>
            )}

            {/* Proactive Suggestions */}
            {filteringResult.proactiveSuggestions && filteringResult.proactiveSuggestions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Proactive Suggestions</h4>
                <div className="space-y-2">
                  {filteringResult.proactiveSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Adjustment */}
            {filteringResult.trustAdjustment && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  Trust {filteringResult.trustAdjustment > 0 ? 'increased' : 'decreased'} by{' '}
                  {Math.abs(Math.round(filteringResult.trustAdjustment * 100))}%
                </span>
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Chat with AI Buddy</h3>
            {userMemory && (
              <Badge content={userMemory.recentInteractions.length} color="primary">
                <Settings className="w-4 h-4" />
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Message History */}
            <div 
              ref={messageHistoryRef}
              className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 space-y-2"
            >
              {conversationContext?.messageHistory.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border text-gray-800'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {conversationContext?.messageHistory.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start a conversation with your AI Buddy</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message to AI Buddy..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                minRows={2}
                maxRows={4}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                color="primary"
                onPress={handleSendMessage}
                isLoading={isProcessing}
                isDisabled={!userMessage.trim()}
                className="px-6"
              >
                Send
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Refusal Modal */}
      <Modal isOpen={refusalModalOpen} onClose={() => setRefusalModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Request Blocked</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {currentRefusal && (
              <div className="space-y-4">
                <p className="text-gray-700">{currentRefusal.refusalMessage}</p>
                {currentRefusal.alternativeSuggestion && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Suggestion:</strong> {currentRefusal.alternativeSuggestion}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Reason: {currentRefusal.refusalReason}</span>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setRefusalModalOpen(false)}>
              Cancel
            </Button>
            {currentRefusal?.userCanOverride && (
              <Button color="warning" onPress={handleRefusalOverride}>
                Override
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Memory Panel Modal */}
      <Modal isOpen={showMemoryPanel} onClose={() => setShowMemoryPanel(false)} size="2xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span>AI Buddy Memory</span>
            </div>
          </ModalHeader>
          <ModalBody>
            {userMemory && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">MBTI Type</h4>
                    <p className="text-sm text-gray-600">{userMemory.mbtiType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Trust Level</h4>
                    <p className="text-sm text-gray-600">{Math.round(userMemory.trustLevel * 100)}%</p>
                  </div>
                </div>
                
                <Divider />
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Current Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {userMemory.currentGoals.map((goal, index) => (
                      <Chip key={index} size="sm" color="primary" variant="flat">
                        {goal}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Active Challenges</h4>
                  <div className="flex flex-wrap gap-2">
                    {userMemory.activeChallenges.map((challenge, index) => (
                      <Chip key={index} size="sm" color="warning" variant="flat">
                        {challenge}
                      </Chip>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Recent Interactions</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {userMemory.recentInteractions.map((interaction, index) => (
                      <p key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {interaction}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Audit Logs Modal */}
      <Modal isOpen={showAuditLogs} onClose={() => setShowAuditLogs(false)} size="4xl">
        <ModalContent>
          <ModalHeader>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-500" />
              <span>Audit Logs</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Chip
                        size="sm"
                        color={log.action === 'allowed' ? 'success' : 'danger'}
                        variant="flat"
                      >
                        {log.action}
                      </Chip>
                      <span className="text-sm text-gray-600">
                        {log.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Risk: {Math.round(log.riskScore * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{log.prompt}</p>
                  <p className="text-xs text-gray-500">{log.reasoning}</p>
                </div>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AIBuddyInterface;

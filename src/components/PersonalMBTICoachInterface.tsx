/**
 * Personal MBTI Coach Interface - Q4 2025 Implementation
 * 
 * React component die de Personal MBTI Coach Service integreert
 * met de bestaande NextUI design system
 * 
 * Features:
 * - Daily coaching plans per MBTI type
 * - Autonomous coaching sessions
 * - Progress tracking
 * - MBTI-optimized recommendations
 * 
 * @version 1.0.0
 * @author Thomas (Integrated Vision Implementation)
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  Badge,
  Spinner,
  Switch
} from '@nextui-org/react';
import {
  Brain,
  Target,
  Clock,
  TrendingUp,
  User,
  Settings,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Calendar,
  BarChart3
} from 'lucide-react';

import { useAppStore } from '../store/useAppStore';
import database from '../database/v14/database';
import { PersonalMBTICoachService } from '../services/personalMBTICoachService';
import { logger } from '../utils/logger';

// Types
interface CoachingSession {
  id: string;
  status: 'idle' | 'running' | 'completed' | 'paused' | 'failed';
  goal: string;
  startTime: Date;
  estimatedDuration: number;
  progress: number;
  currentTask?: string;
  results?: any;
}

interface DailyPlan {
  date: string;
  mbtiType: string;
  primaryGoal: string;
  tasks: any[];
  estimatedDuration: number;
  personalizedInsights: string[];
  completed: boolean;
}

// MBTI Type avatars and colors
const MBTI_STYLES = {
  'INTJ': { color: 'purple', emoji: '🎯', title: 'The Architect' },
  'INTP': { color: 'indigo', emoji: '🔬', title: 'The Thinker' },
  'ENTJ': { color: 'red', emoji: '👑', title: 'The Commander' },
  'ENTP': { color: 'orange', emoji: '💡', title: 'The Debater' },
  'INFJ': { color: 'green', emoji: '🌟', title: 'The Advocate' },
  'INFP': { color: 'blue', emoji: '🎨', title: 'The Mediator' },
  'ENFJ': { color: 'emerald', emoji: '🤝', title: 'The Protagonist' },
  'ENFP': { color: 'pink', emoji: '🌈', title: 'The Campaigner' },
  'ISTJ': { color: 'slate', emoji: '📋', title: 'The Logistician' },
  'ISFJ': { color: 'teal', emoji: '🛡️', title: 'The Protector' },
  'ESTJ': { color: 'amber', emoji: '⚖️', title: 'The Executive' },
  'ESFJ': { color: 'rose', emoji: '💝', title: 'The Consul' },
  'ISTP': { color: 'stone', emoji: '🔧', title: 'The Virtuoso' },
  'ISFP': { color: 'cyan', emoji: '🎭', title: 'The Adventurer' },
  'ESTP': { color: 'yellow', emoji: '⚡', title: 'The Entrepreneur' },
  'ESFP': { color: 'lime', emoji: '🎉', title: 'The Entertainer' }
};

export const PersonalMBTICoachInterface: React.FC = () => {
  // State
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionGoal, setSessionGoal] = useState('');
  const [sessionDuration, setSessionDuration] = useState(2);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [progressHistory, setProgressHistory] = useState<any[]>([]);

  // Store
  const { userData } = useAppStore();
  const mbtiType = userData?.mbtiType || 'INTJ';
  const userId = userData?.id || 'user_1';

  // Service
  const [coachService, setCoachService] = useState<PersonalMBTICoachService | null>(null);

  // Initialize service
  useEffect(() => {
    if (userId) {
      const service = new PersonalMBTICoachService(database, userId);
      setCoachService(service);
    }
  }, [userId]);

  // Load daily plan on mount
  useEffect(() => {
    if (coachService && !dailyPlan) {
      loadDailyPlan();
    }
  }, [coachService]);

  // Auto-refresh recommendations
  useEffect(() => {
    if (coachService) {
      loadRecommendations();
    }
  }, [coachService, mbtiType]);

  // Load daily coaching plan
  const loadDailyPlan = async () => {
    if (!coachService) return;

    try {
      setIsGenerating(true);
      logger.info('Loading daily coaching plan', { mbtiType });

      const plan = await coachService.generateDailyCoaching(mbtiType);
      setDailyPlan({
        ...plan,
        completed: false
      });

      logger.info('Daily plan loaded successfully', { plan });
    } catch (error) {
      logger.error('Failed to load daily plan', { error });
    } finally {
      setIsGenerating(false);
    }
  };

  // Load MBTI recommendations
  const loadRecommendations = async () => {
    if (!coachService) return;

    try {
      const recs = await coachService.getMBTISpecificRecommendations(mbtiType);
      setRecommendations(recs);
    } catch (error) {
      logger.error('Failed to load recommendations', { error });
    }
  };

  // Start autonomous coaching session
  const startAutonomousSession = async () => {
    if (!coachService || !sessionGoal.trim()) return;

    try {
      const session: CoachingSession = {
        id: `session_${Date.now()}`,
        status: 'running',
        goal: sessionGoal,
        startTime: new Date(),
        estimatedDuration: sessionDuration * 60, // Convert to minutes
        progress: 0
      };

      setCurrentSession(session);
      setShowSessionModal(false);

      logger.info('Starting autonomous coaching session', { session });

      // Call autonomous coaching
      const result = await coachService.executeAutonomousCoaching(
        sessionGoal,
        sessionDuration,
        autonomousMode ? 'none' : 'checkpoints'
      );

      // Update session with results
      setCurrentSession(prev => prev ? {
        ...prev,
        status: result.status === 'completed' ? 'completed' : 'failed',
        progress: 100,
        results: result
      } : null);

      logger.info('Autonomous session completed', { result });

    } catch (error) {
      logger.error('Autonomous session failed', { error });
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'failed'
      } : null);
    }
  };

  // Stop current session
  const stopSession = () => {
    setCurrentSession(prev => prev ? {
      ...prev,
      status: 'paused'
    } : null);
  };

  // Load progress history
  const loadProgressHistory = async () => {
    if (!coachService) return;

    try {
      const progress = await coachService.analyzeCoachingProgress('month');
      setProgressHistory(progress.results || []);
    } catch (error) {
      logger.error('Failed to load progress history', { error });
    }
  };

  // Get MBTI styling
  const getMBTIStyle = (type: string) => {
    return MBTI_STYLES[type as keyof typeof MBTI_STYLES] || MBTI_STYLES.INTJ;
  };

  const mbtiStyle = getMBTIStyle(mbtiType);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="p-6">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                className={`bg-${mbtiStyle.color}-500`}
                fallback={mbtiStyle.emoji}
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white">
                  Personal AI Coach
                </h1>
                <p className="text-white/80">
                  {mbtiType} - {mbtiStyle.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Chip 
                  color={mbtiStyle.color as any} 
                  variant="flat"
                  startContent={<Brain className="w-4 h-4" />}
                >
                  AI Powered
                </Chip>
                {currentSession?.status === 'running' && (
                  <Chip 
                    color="success" 
                    variant="flat"
                    startContent={<Play className="w-4 h-4" />}
                  >
                    Active Session
                  </Chip>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Active Session Monitor */}
        {currentSession && (
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-white">
                  Active Coaching Session
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    color={
                      currentSession.status === 'running' ? 'success' :
                      currentSession.status === 'completed' ? 'primary' :
                      currentSession.status === 'failed' ? 'danger' : 'warning'
                    }
                  >
                    {currentSession.status}
                  </Badge>
                  {currentSession.status === 'running' && (
                    <Button
                      size="sm"
                      color="warning"
                      variant="flat"
                      onPress={stopSession}
                      startContent={<Pause className="w-4 h-4" />}
                    >
                      Pause
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <p className="text-white/90 mb-2">Goal: {currentSession.goal}</p>
                  <Progress
                    value={currentSession.progress}
                    color="success"
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Progress: {currentSession.progress}%</span>
                    <span>
                      Duration: {Math.floor(currentSession.estimatedDuration / 60)}h {currentSession.estimatedDuration % 60}m
                    </span>
                  </div>
                </div>
                {currentSession.currentTask && (
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-white/90 text-sm">
                      Current Task: {currentSession.currentTask}
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Main Interface */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody className="p-0">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={setActiveTab as any}
              color={mbtiStyle.color as any}
              variant="underlined"
              classNames={{
                tabList: "p-4 pb-0",
                tab: "text-white/70 data-[selected=true]:text-white",
                cursor: "bg-current"
              }}
            >
              <Tab key="daily" title={
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Daily Plan
                </div>
              }>
                <div className="p-6">
                  {/* Daily Coaching Plan */}
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-12">
                      <Spinner color={mbtiStyle.color as any} size="lg" />
                      <span className="ml-3 text-white">Generating your personalized plan...</span>
                    </div>
                  ) : dailyPlan ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">
                          Today's Coaching Plan
                        </h3>
                        <Button
                          size="sm"
                          color={mbtiStyle.color as any}
                          variant="flat"
                          onPress={loadDailyPlan}
                        >
                          Refresh Plan
                        </Button>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">Primary Goal</h4>
                        <p className="text-white/80">{dailyPlan.primaryGoal}</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-white">Tasks</h4>
                        {dailyPlan.tasks.map((task: any, index: number) => (
                          <Card key={index} className="bg-white/5">
                            <CardBody className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-white">{task.title}</h5>
                                  <p className="text-white/70 text-sm mt-1">{task.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <Chip size="sm" variant="flat" color="primary">
                                      {task.estimatedMinutes}min
                                    </Chip>
                                    <Chip size="sm" variant="flat" color={mbtiStyle.color as any}>
                                      {task.priority}
                                    </Chip>
                                  </div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>

                      {dailyPlan.personalizedInsights.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-white">Personalized Insights</h4>
                          {dailyPlan.personalizedInsights.map((insight: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                              <p className="text-white/80 text-sm">{insight}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <p className="text-white/70 mb-4">No daily plan generated yet</p>
                      <Button
                        color={mbtiStyle.color as any}
                        onPress={loadDailyPlan}
                        startContent={<Target className="w-4 h-4" />}
                      >
                        Generate Daily Plan
                      </Button>
                    </div>
                  )}
                </div>
              </Tab>

              <Tab key="autonomous" title={
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Autonomous
                </div>
              }>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        Autonomous Coaching
                      </h3>
                      <Button
                        color={mbtiStyle.color as any}
                        onPress={() => setShowSessionModal(true)}
                        startContent={<Play className="w-4 h-4" />}
                        isDisabled={currentSession?.status === 'running'}
                      >
                        Start Session
                      </Button>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-2">About Autonomous Coaching</h4>
                      <p className="text-white/80 text-sm">
                        Let your AI coach work independently on your goals for 2-6 hours, 
                        using tools optimized for your {mbtiType} personality type.
                      </p>
                    </div>

                    {recommendations.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-white">MBTI-Specific Recommendations</h4>
                        {recommendations.map((rec: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                            <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                            <p className="text-white/80 text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Tab>

              <Tab key="progress" title={
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Progress
                </div>
              }>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">
                        Coaching Progress
                      </h3>
                      <Button
                        size="sm"
                        color={mbtiStyle.color as any}
                        variant="flat"
                        onPress={loadProgressHistory}
                      >
                        Refresh
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-white/5">
                        <CardBody className="p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <h4 className="font-medium text-white">Sessions</h4>
                          <p className="text-2xl font-bold text-white">12</p>
                        </CardBody>
                      </Card>
                      
                      <Card className="bg-white/5">
                        <CardBody className="p-4 text-center">
                          <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <h4 className="font-medium text-white">Total Time</h4>
                          <p className="text-2xl font-bold text-white">24h</p>
                        </CardBody>
                      </Card>
                      
                      <Card className="bg-white/5">
                        <CardBody className="p-4 text-center">
                          <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <h4 className="font-medium text-white">Goals Met</h4>
                          <p className="text-2xl font-bold text-white">8/10</p>
                        </CardBody>
                      </Card>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="font-medium text-white mb-4">Recent Sessions</h4>
                      {/* Add progress history display */}
                      <p className="text-white/70 text-sm">Progress analysis will appear here</p>
                    </div>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>

        {/* Start Session Modal */}
        <Modal
          isOpen={showSessionModal}
          onClose={() => setShowSessionModal(false)}
          size="lg"
          className="bg-white/10 backdrop-blur-xl"
        >
          <ModalContent>
            <ModalHeader className="text-white">
              Start Autonomous Coaching Session
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Session Goal"
                  placeholder="What would you like to work on?"
                  value={sessionGoal}
                  onValueChange={setSessionGoal}
                  className="text-white"
                />
                
                <Select
                  label="Duration (hours)"
                  selectedKeys={[sessionDuration.toString()]}
                  onSelectionChange={(keys) => setSessionDuration(Number(Array.from(keys)[0]))}
                >
                  <SelectItem key="1" value="1">1 hour</SelectItem>
                  <SelectItem key="2" value="2">2 hours</SelectItem>
                  <SelectItem key="4" value="4">4 hours</SelectItem>
                  <SelectItem key="6" value="6">6 hours</SelectItem>
                </Select>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Fully Autonomous</p>
                    <p className="text-white/70 text-sm">No human checkpoints</p>
                  </div>
                  <Switch
                    isSelected={autonomousMode}
                    onValueChange={setAutonomousMode}
                    color={mbtiStyle.color as any}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="flat"
                onPress={() => setShowSessionModal(false)}
              >
                Cancel
              </Button>
              <Button
                color={mbtiStyle.color as any}
                onPress={startAutonomousSession}
                isDisabled={!sessionGoal.trim()}
                startContent={<Play className="w-4 h-4" />}
              >
                Start Session
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default PersonalMBTICoachInterface;
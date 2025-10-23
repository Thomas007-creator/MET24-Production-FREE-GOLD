import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import analytics from '../services/analytics';
import { logger } from '../utils/logger';
import { mcpBridgeSync } from '../services/mcpBridgeSyncService';
import discourseConnector from '../services/discourseConnector';

// Types
interface AITaskStatus {
  [key: string]: boolean;
}

interface LocalAIActionPlan {
  id: string;
  title: string;
  description: string;
  summary: string;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    completed: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface MCPBridgeStatus {
  isOnline: boolean;
  lastSync: number | null;
  errorCount: number;
  lastError: string | null;
}

interface BackgroundServices {
  contentSync: boolean;
  aiProcessing: boolean;
  analytics: boolean;
  notifications: boolean;
  lastUpdate: number;
}

interface MainViewContextType {
  // State
  aiTaskStatus: AITaskStatus;
  localAIActionPlan: LocalAIActionPlan | null;
  mcpBridgeStatus: MCPBridgeStatus;
  backgroundServices: BackgroundServices;
  userData: any;
  userName: string;
  mbtiType: string;

  // Handlers
  handleButtonClick: (action: string) => Promise<void>;
  handleQuickActionClick: (action: string) => Promise<void>;
  handleFeatureClick: (feature: string) => Promise<void>;
}

const MainViewContext = createContext<MainViewContextType | null>(null);

export const useMainView = () => {
  const context = useContext(MainViewContext);
  if (!context) {
    throw new Error('useMainView must be used within MainViewProvider');
  }
  return context;
};

interface MainViewProviderProps {
  children: ReactNode;
}

export const MainViewProvider: React.FC<MainViewProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { userData, setUserData } = useAppStore();

  // State management
  const [aiTaskStatus, setAiTaskStatus] = useState<AITaskStatus>({
    mbti_analysis: false,
    wellness_assessment: false,
    action_plan_generation: false,
    context_analysis: false,
    notification_processing: false,
  });

  const [localAIActionPlan, setLocalAIActionPlan] = useState<LocalAIActionPlan | null>(null);

  const [mcpBridgeStatus, setMcpBridgeStatus] = useState<MCPBridgeStatus>({
    isOnline: true,
    lastSync: null,
    errorCount: 0,
    lastError: null,
  });

  const [backgroundServices, setBackgroundServices] = useState<BackgroundServices>({
    contentSync: false,
    aiProcessing: false,
    analytics: false,
    notifications: false,
    lastUpdate: Date.now(),
  });

  // Derived state
  const userName = userData?.name || 'Gebruiker';
  const mbtiType = userData?.mbtiType || 'INTJ';

  // MCP Bridge monitoring
  useEffect(() => {
    const checkMCPBridgeStatus = () => {
      const syncStatus = mcpBridgeSync.getSyncStatus();
      setMcpBridgeStatus({
        isOnline: syncStatus.errorCount === 0,
        lastSync: syncStatus.lastSync,
        errorCount: syncStatus.errorCount,
        lastError: syncStatus.lastError,
      });
    };

    checkMCPBridgeStatus();
    const statusInterval = setInterval(checkMCPBridgeStatus, 5000);
    return () => clearInterval(statusInterval);
  }, []);

  // Background services monitoring
  useEffect(() => {
    const startBackgroundServices = () => {
      logger.info('🚀 Starting background services...');

      setBackgroundServices(prev => ({
        ...prev,
        contentSync: true,
        aiProcessing: true,
        analytics: true,
        notifications: true,
        lastUpdate: Date.now(),
      }));

      const updateInterval = setInterval(() => {
        setBackgroundServices(prev => ({
          ...prev,
          lastUpdate: Date.now(),
        }));
      }, 30000);

      return () => clearInterval(updateInterval);
    };

    const cleanup = startBackgroundServices();
    return cleanup;
  }, []);

  // Load userData from localStorage
  useEffect(() => {
    const loadUserDataFromStorage = () => {
      try {
        const savedUserData = localStorage.getItem('onboarding_user_data');
        if (savedUserData) {
          const parsedData = JSON.parse(savedUserData);
          logger.info('📱 Loading userData from localStorage:', { parsedData });
          setUserData(parsedData);
        }

        const savedActionPlan = localStorage.getItem('localAIActionPlan');
        if (savedActionPlan) {
          const parsedActionPlan = JSON.parse(savedActionPlan);
          logger.info('📋 Loading action plan from localStorage:', { parsedActionPlan });
          setLocalAIActionPlan(parsedActionPlan);
        }
      } catch (error) {
        logger.error('❌ Error loading userData from localStorage:', { error });
      }
    };

    loadUserDataFromStorage();
  }, [setUserData]);

  // AI background processing
  const startAIBackgroundProcessing = useCallback(async () => {
    try {
      logger.info('🤖 Starting AI background processing after onboarding...');
      logger.info('AI Background Service mock - skipping analysis');
      logger.info('✅ AI background processing completed successfully (mock)');
    } catch (error) {
      logger.error('❌ Error starting AI background processing:', { error });
    }
  }, []);

  // Start AI processing after onboarding completion
  useEffect(() => {
    const hasAllOnboardingData =
      userData?.mbtiType &&
      (userData?.interests?.length || 0) > 0 &&
      (userData?.wellness?.scores as any)?.overallWellness &&
      userData?.context?.situation &&
      userData?.notifications?.preferences &&
      userData?.privacyAccepted &&
      userData?.verified;

    if (hasAllOnboardingData) {
      startAIBackgroundProcessing();
    }
  }, [userData, startAIBackgroundProcessing]);

  // AI task completion listeners
  useEffect(() => {
    const handleAITaskCompleted = (event: CustomEvent) => {
      const { taskType } = event.detail;
      logger.info('✅ AI task completed:', { taskType });

      setAiTaskStatus(prev => ({
        ...prev,
        [taskType]: false,
      }));
    };

    const handleActionPlanGenerated = (event: CustomEvent) => {
      const actionPlan = event.detail;
      logger.info('✅ Action plan generated:', { actionPlan });
      setLocalAIActionPlan(actionPlan);
    };

    window.addEventListener('aiTaskCompleted', handleAITaskCompleted as EventListener);
    window.addEventListener('actionPlanGenerated', handleActionPlanGenerated as EventListener);

    return () => {
      window.removeEventListener('aiTaskCompleted', handleAITaskCompleted as EventListener);
      window.removeEventListener('actionPlanGenerated', handleActionPlanGenerated as EventListener);
    };
  }, []);

  // Load existing action plan
  useEffect(() => {
    const savedActionPlan = localStorage.getItem('localAIActionPlan');
    if (savedActionPlan) {
      try {
        const actionPlan = JSON.parse(savedActionPlan);
        setLocalAIActionPlan(actionPlan);
      } catch (error) {
        logger.error('❌ Error loading saved action plan:', { error });
      }
    }
  }, []);

  // Navigation handlers
  const handleButtonClick = useCallback(async (action: string) => {
    logger.info('🔘 Button clicked:', { action });

    try {
      await analytics.trackMainViewNavigation(action);
      await analytics.trackButtonClick(action, 'mainview');
    } catch (error) {
      logger.error('Analytics tracking error in handleButtonClick:', { error });
    }

    switch (action) {
      case 'chat':
        logger.info('🎯 Navigating to Discourse Chat', { mbtiType });
        discourseConnector.navigateToChat(mbtiType);
        return;

      case 'challenges':
        logger.info('🎯 Navigating to Discourse Challenges');
        discourseConnector.navigateToChallenges();
        return;

      case 'community':
        logger.info('🎯 Navigating to Discourse Communities', { mbtiType });
        discourseConnector.navigateToCommunities(mbtiType);
        return;

      default:
        navigate(`/${action}`);
    }
  }, [mbtiType, navigate]);

  const handleQuickActionClick = useCallback(async (action: string) => {
    logger.info('🔘 Quick action clicked:', { action });

    try {
      await analytics.trackButtonClick(action, 'quick_actions');
    } catch (error) {
      logger.error('Analytics tracking error in handleQuickActionClick:', { error });
    }

    switch (action) {
      case 'communities':
        logger.info('🎯 Quick Action: Navigating to Discourse Communities', { mbtiType });
        discourseConnector.navigateToCommunities(mbtiType);
        return;

      default:
        navigate(`/${action}`);
    }
  }, [mbtiType, navigate]);

  const handleFeatureClick = useCallback(async (feature: string) => {
    logger.info('🔘 Feature clicked:', { feature });

    try {
      await analytics.trackFeatureUsage(feature);
      await analytics.trackButtonClick(feature, 'feature_cards');
    } catch (error) {
      logger.error('Analytics tracking error in handleFeatureClick:', { error });
    }

    switch (feature) {
      case 'wellness-assessment':
      case 'holistic-wellness':
        logger.info('🎯 Feature: Navigating to Discourse Wellness');
        discourseConnector.navigateToWellness();
        return;

      case 'ai-coaching':
      case 'ai-action-plan':
        logger.info('🎯 Feature: Navigating to Discourse AI Insights');
        discourseConnector.navigateToAIInsights();
        return;

      case 'analytics':
        logger.info('🎯 Feature: Navigating to Discourse Success Stories');
        discourseConnector.navigateToSuccessStories();
        return;

      default:
        navigate(`/${feature}`);
    }
  }, [navigate]);

  const contextValue: MainViewContextType = {
    aiTaskStatus,
    localAIActionPlan,
    mcpBridgeStatus,
    backgroundServices,
    userData,
    userName,
    mbtiType,
    handleButtonClick,
    handleQuickActionClick,
    handleFeatureClick,
  };

  return (
    <MainViewContext.Provider value={contextValue}>
      {children}
    </MainViewContext.Provider>
  );
};
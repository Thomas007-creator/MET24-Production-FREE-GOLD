import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import analytics from '../services/analytics';
import { logger } from '../utils/logger';
// Removed ContentRecommendationCarousel and MBTIContentFeed - replaced by advanced Content Discovery
import AICoachingWithContext from './AICoachingWithContext';
import HolisticWellnessCard from './HolisticWellnessCard';
import ContentDiscoveryPanel from './ContentDiscoveryPanel';
import HogerZelfAIPanel from './ai/HogerZelfAIPanel';
import { mcpBridgeSync } from '../services/mcpBridgeSyncService';
import { usePWAEngagement, usePWAVisitTracking } from '../hooks/usePWAEngagement';
import discourseConnector from '../services/discourseConnector';
import { useI18n } from '../hooks/useI18n';

// import aiBackgroundService from '../services/aiBackgroundService';
// import localAIService from '../services/localAIService';

const MainView: React.FC = memo(() => {
  const navigate = useNavigate();
  const { userData, setUserData } = useAppStore();
  const { t } = useI18n();

  // Track PWA engagement
  usePWAVisitTracking();

  // Track PWA engagement
  usePWAEngagement('mainview_loaded');

  const [aiTaskStatus, setAiTaskStatus] = useState<{ [key: string]: boolean }>({
    mbti_analysis: false,
    wellness_assessment: false,
    action_plan_generation: false,
    context_analysis: false,
    notification_processing: false,
  });
  const [localAIActionPlan, setLocalAIActionPlan] = useState<{
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
  } | null>(null);

  // MCP Bridge connection status
  const [mcpBridgeStatus, setMcpBridgeStatus] = useState<{
    isOnline: boolean;
    lastSync: number | null;
    errorCount: number;
    lastError: string | null;
  }>({
    isOnline: true,
    lastSync: null,
    errorCount: 0,
    lastError: null,
  });

  // Background services status
  const [backgroundServices, setBackgroundServices] = useState<{
    contentSync: boolean;
    aiProcessing: boolean;
    analytics: boolean;
    notifications: boolean;
    lastUpdate: number;
  }>({
    contentSync: false,
    aiProcessing: false,
    analytics: false,
    notifications: false,
    lastUpdate: Date.now(),
  });

  // Monitor MCP Bridge connection status
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

    // Check status immediately
    checkMCPBridgeStatus();

    // Check status every 5 seconds
    const statusInterval = setInterval(checkMCPBridgeStatus, 5000);

    return () => clearInterval(statusInterval);
  }, []);

  // Background services monitoring
  useEffect(() => {
    const startBackgroundServices = () => {
      logger.info('🚀 Starting background services...');
      
      // Simulate background services starting
      setBackgroundServices(prev => ({
        ...prev,
        contentSync: true,
        aiProcessing: true,
        analytics: true,
        notifications: true,
        lastUpdate: Date.now(),
      }));

      // Simulate periodic updates
      const updateInterval = setInterval(() => {
        setBackgroundServices(prev => ({
          ...prev,
          lastUpdate: Date.now(),
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(updateInterval);
    };

    const cleanup = startBackgroundServices();
    return cleanup;
  }, []);

  // Load userData from localStorage when MainView mounts
  useEffect(() => {
    const loadUserDataFromStorage = () => {
      try {
        const savedUserData = localStorage.getItem('onboarding_user_data');
        if (savedUserData) {
          const parsedData = JSON.parse(savedUserData);
          logger.info('📱 Loading userData from localStorage:', { parsedData });
          setUserData(parsedData);
        }
        
        // Also load action plan if available
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

  // Debug logging
  logger.info('🔍 MainView userData:', { userData });

  const userName = userData?.name || 'Gebruiker';
  const mbtiType = userData?.mbtiType || 'INTJ';

  // Render onboarding overview when all data is available (after step 13 completion)
  // Start AI background processing
  const startAIBackgroundProcessing = useCallback(async () => {
    try {
      logger.info('🤖 Starting AI background processing after onboarding...');

      // Mock AI Background Service check
      logger.info('AI Background Service mock - skipping analysis');
      logger.info('✅ AI background processing completed successfully (mock)');
      return;
    } catch (error) {
      logger.error('❌ Error starting AI background processing:', { error });
    }
  }, [userData]);

  useEffect(() => {
    // Check if all onboarding steps are completed (step 1-13)
    const hasAllOnboardingData =
      userData?.mbtiType &&
      (userData?.interests?.length || 0) > 0 &&
      (userData?.wellness?.scores as any)?.overallWellness &&
      userData?.context?.situation &&
      userData?.notifications?.preferences &&
      userData?.privacyAccepted &&
      userData?.verified;

    // Start AI background processing after onboarding completion
    if (hasAllOnboardingData) {
      startAIBackgroundProcessing();
    }
  }, [userData, startAIBackgroundProcessing]);

  // Listen for AI task completion events
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

    window.addEventListener(
      'aiTaskCompleted',
      handleAITaskCompleted as EventListener
    );
    window.addEventListener(
      'actionPlanGenerated',
      handleActionPlanGenerated as EventListener
    );

    return () => {
      window.removeEventListener(
        'aiTaskCompleted',
        handleAITaskCompleted as EventListener
      );
      window.removeEventListener(
        'actionPlanGenerated',
        handleActionPlanGenerated as EventListener
      );
    };
  }, []);

  // Load existing action plan on mount
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

  logger.info('🔍 MainView userName:', { userName });
  logger.info('🔍 MainView mbtiType:', { mbtiType });

  const handleButtonClick = async (action: string) => {
    logger.info('🔘 Button clicked:', { action });
    
    try {
      await analytics.trackMainViewNavigation(action);
      await analytics.trackButtonClick(action, 'mainview');
    } catch (error) {
      logger.error('Analytics tracking error in handleButtonClick:', { error });
    }

    // 🚀 DISCOURSE DIRECTE CONNECTIE
    const mbtiType = userData?.mbtiType;
    
    switch (action) {
      case 'chat':
        // Direct naar Discourse chat met MBTI context
        logger.info('🎯 Navigating to Discourse Chat', { mbtiType });
        discourseConnector.navigateToChat(mbtiType);
        return;
        
      case 'challenges':
        // Direct naar Discourse challenges community
        logger.info('🎯 Navigating to Discourse Challenges');
        discourseConnector.navigateToChallenges();
        return;
        
      case 'community':
        // Direct naar Discourse communities met MBTI focus
        logger.info('🎯 Navigating to Discourse Communities', { mbtiType });
        discourseConnector.navigateToCommunities(mbtiType);
        return;
        
      default:
        // Voor andere acties, gebruik normale navigatie
        navigate(`/${action}`);
    }
  };

  const handleQuickActionClick = async (action: string) => {
    logger.info('🔘 Quick action clicked:', { action });
    
    try {
      await analytics.trackButtonClick(action, 'quick_actions');
    } catch (error) {
      logger.error('Analytics tracking error in handleQuickActionClick:', { error });
    }

    // 🚀 DISCOURSE DIRECTE CONNECTIE VOOR QUICK ACTIONS
    const mbtiType = userData?.mbtiType;
    
    switch (action) {
      case 'communities':
        // Direct naar Discourse communities
        logger.info('🎯 Quick Action: Navigating to Discourse Communities', { mbtiType });
        discourseConnector.navigateToCommunities(mbtiType);
        return;
        
      default:
        // Voor andere quick actions, gebruik normale navigatie
        navigate(`/${action}`);
    }
  };

  const handleFeatureClick = async (feature: string) => {
    logger.info('🔘 Feature clicked:', { feature });
    
    try {
      await analytics.trackFeatureUsage(feature);
      await analytics.trackButtonClick(feature, 'feature_cards');
    } catch (error) {
      logger.error('Analytics tracking error in handleFeatureClick:', { error });
    }

    // 🚀 DISCOURSE DIRECTE CONNECTIE VOOR FEATURES
    switch (feature) {
      case 'wellness-assessment':
      case 'holistic-wellness':
        // Direct naar Discourse wellness community
        logger.info('🎯 Feature: Navigating to Discourse Wellness');
        discourseConnector.navigateToWellness();
        return;
        
      case 'ai-coaching':
      case 'ai-action-plan':
        // Direct naar Discourse AI insights community
        logger.info('🎯 Feature: Navigating to Discourse AI Insights');
        discourseConnector.navigateToAIInsights();
        return;
        
      case 'analytics':
        // Direct naar Discourse success stories
        logger.info('🎯 Feature: Navigating to Discourse Success Stories');
        discourseConnector.navigateToSuccessStories();
        return;
        
      default:
        // Voor andere features, gebruik normale navigatie
        navigate(`/${feature}`);
    }
  };

  return (
    <div
      className='min-h-screen text-white relative overflow-hidden'
      role='main'
      aria-labelledby='mainview-title'
    >
      {/* Content container */}
      <div className='relative z-10 p-5 max-w-7xl mx-auto'>
        {/* Subtle MCP Bridge Status - Only show when offline */}
        {!mcpBridgeStatus.isOnline && (
          <div className='fixed top-4 right-4 z-50 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg px-3 py-2 text-xs text-yellow-200'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-yellow-400 rounded-full animate-pulse'></div>
              <span>Offline mode</span>
            </div>
          </div>
        )}

        {/* Background Services Status - Subtle indicator */}
        <div className='fixed bottom-4 left-4 z-50 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg px-3 py-2 text-xs text-green-200'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
            <span>Background services active</span>
          </div>
        </div>

        {/* Skip to main content link for screen readers */}
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-black text-white px-3 py-2 rounded z-50'
        >
          Skip to main content
        </a>

        {/* Header */}
        <header className='text-center mb-8'>
          <h1
            id='mainview-title'
            className='text-4xl font-bold text-white mb-3'
          >
            🏠 MainView
          </h1>
          <p className='text-lg text-[#e0e0e0]'>
            {t('common.welcome', { userName })} ({mbtiType})
          </p>
          
          {/* Streamlined Version Switch */}
          <div className='mt-4'>
            <Button
              onClick={() => navigate('/streamlined')}
              className='bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm'
              size='sm'
            >
              ✨ Try Streamlined MainView (Perfect Balance)
            </Button>
          </div>
        </header>

        {/* Navigation Buttons */}
        <section className='mb-8'>
          <nav
            aria-label='Navigation'
            className='flex gap-3 flex-wrap justify-center'
          >
            <Button
              color='primary'
              variant='bordered'
              onClick={() => handleQuickActionClick('profile')}
              size='sm'
              aria-label='Ga naar profiel pagina'
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              👤 Profiel
            </Button>
            <Button
              color='primary'
              variant='bordered'
              onClick={() => handleQuickActionClick('settings')}
              size='sm'
              aria-label='Ga naar instellingen pagina'
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              ⚙️ Instellingen
            </Button>
            <Button
              color='warning'
              variant='solid'
              onClick={() => handleQuickActionClick('upgrade-gold')}
              size='sm'
              className='bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold border-2 border-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
              aria-label='Upgrade naar Gold abonnement'
            >
              ⭐ Upgrade Gold
            </Button>
            <Button
              color='secondary'
              variant='solid'
              onClick={() => handleQuickActionClick('upgrade-platinum')}
              size='sm'
              className='bg-gradient-to-r from-purple-400 to-indigo-500 text-white font-bold border-2 border-indigo-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
              aria-label='Upgrade naar Platinum abonnement'
            >
              👑 Upgrade Platinum
            </Button>
          </nav>
        </section>

        {/* 🎯 Hoofdnavigatie Cards */}
        <section
          aria-labelledby='main-navigation-title'
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
        >
          <h2 id='main-navigation-title' className='sr-only'>
            Hoofdnavigatie
          </h2>

          {/* 1. Actieve Imaginatie */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2'
            role='article'
            aria-labelledby='imagination-title'
          >
            <CardHeader>
              <h3 id='imagination-title' className='text-xl font-bold'>
                🧘 Actieve Imaginatie
              </h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4'>
                Creatieve visualisatie technieken voor persoonlijke groei
              </p>
              <Button
                color='primary'
                variant='solid'
                onClick={() => navigate('/active-imagination')}
                className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Start actieve imaginatie sessie'
              >
                Start Imaginatie
              </Button>
            </CardBody>
          </Card>

          {/* Universele Levensboom */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(34,197,94,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2'
            role='article'
          >
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white text-lg'>🌳</span>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-white'>Universele Levensboom</h3>
                  <p className='text-sm text-gray-300'>DeepSeek AI raadpleging</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='pt-0'>
              <p className='text-gray-300 text-sm mb-4'>
                Raadpleeg DeepSeek AI voor inzichten in je universele levensdomein en persoonlijke groei.
              </p>
              <Button
                color='primary'
                variant='solid'
                onClick={() => navigate('/universele-levensboom')}
                className='bg-[rgba(34,197,94,0.2)] text-white border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.3)] hover:border-[rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Open Universele Levensboom'
              >
                🌳 Open Levensboom
              </Button>
            </CardBody>
          </Card>

          {/* Back to Basics - 9 Levensgebieden */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(34,197,94,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2'
            role='article'
          >
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center'>
                  <span className='text-white font-bold text-lg'>B</span>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-white'>Back to Basics</h3>
                  <p className='text-sm text-gray-300'>9 levensgebieden</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='pt-0'>
              <p className='text-gray-300 text-sm mb-4'>
                Verken de 9 kerngebieden van je leven en ontdek waar je kunt groeien en ontwikkelen.
              </p>
              <Button
                color='primary'
                variant='solid'
                onClick={() => navigate('/back-to-basics')}
                className='bg-[rgba(34,197,94,0.2)] text-white border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.3)] hover:border-[rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Bekijk 9 levensgebieden'
              >
                Bekijk Levensgebieden
              </Button>
            </CardBody>
          </Card>

          {/* 2. AI-2: Wellness Assessment */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2'
            role='article'
            aria-labelledby='wellness-title'
          >
            <CardHeader>
              <h3 id='wellness-title' className='text-xl font-bold'>
                💚 AI-2: Wellness Assessment
              </h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4'>
                Holistische welzijnsanalyse en gepersonaliseerde aanbevelingen
              </p>

              {/* Wellness Scores Display */}
              {userData?.wellness?.scores ? (
                <div
                  className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'
                  role='status'
                  aria-live='polite'
                  aria-label='Wellness scores beschikbaar'
                >
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl' aria-hidden='true'>
                      📊
                    </span>
                    <span className='font-bold text-sm'>
                      Jouw Wellness Scores
                    </span>
                    {aiTaskStatus['wellness_assessment'] && (
                      <div className='flex items-center gap-1'>
                        <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white'></div>
                        <span className='text-xs'>AI analyseert...</span>
                      </div>
                    )}
                  </div>

                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
                      <span>
                        Energie: {(userData.wellness.scores as any).energy_index || 0}%
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-red-400 rounded-full'></div>
                      <span>
                        Stress: {(userData.wellness.scores as any).stress_index || 0}%
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                      <span>
                        Sociale steun:{' '}
                        {(userData.wellness.scores as any).social_support_score || 0}%
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                      <span>
                        Zelfcompassie:{' '}
                        {(userData.wellness.scores as any).self_compassion_score || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='bg-white bg-opacity-10 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
                  <p className='text-sm opacity-80'>
                    Wellness assessment wordt geanalyseerd...
                  </p>
                </div>
              )}

              <Button
                color='primary'
                variant='solid'
                onClick={() => handleFeatureClick('wellness-assessment')}
                className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Start wellness assessment'
              >
                Bekijk Wellness Analyse
              </Button>
            </CardBody>
          </Card>

          {/* 3. AI-3: Local AI Action Plan */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2'
            role='article'
            aria-labelledby='ai-action-plan-title'
          >
            <CardHeader>
              <h3 id='ai-action-plan-title' className='text-xl font-bold'>
                🤖 AI-3: Persoonlijk Actieplan
              </h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4'>
                Gepersonaliseerd 3-stappen actieplan gegenereerd door lokale AI
              </p>

              {/* Local AI Action Plan */}
              {localAIActionPlan ? (
                <div
                  className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'
                  role='status'
                  aria-live='polite'
                  aria-label='Lokaal AI actieplan beschikbaar'
                >
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl' aria-hidden='true'>
                      🎯
                    </span>
                    <span className='font-bold text-sm'>
                      Jouw Persoonlijke Actieplan
                    </span>
                  </div>

                  <div className='space-y-3'>
                    {localAIActionPlan.steps.map((step, index: number) => (
                      <div
                        key={index}
                        className='bg-white bg-opacity-10 rounded-lg p-3'
                      >
                        <div className='flex items-center gap-2 mb-2'>
                          <span className='text-sm font-semibold'>
                            Stap {index + 1}:
                          </span>
                          <span className='text-sm'>{step.title}</span>
                          <span className='text-xs opacity-80'>
                            ({step.estimatedTime})
                          </span>
                        </div>
                        <p className='text-sm opacity-90'>{step.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className='mt-4 p-3 bg-white bg-opacity-10 rounded-lg'>
                    <p className='text-sm italic'>
                      {localAIActionPlan.summary}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='bg-white bg-opacity-10 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
                  <p className='text-sm opacity-80'>
                    Klik om je persoonlijke actieplan te genereren
                  </p>
                </div>
              )}

              <Button
                color='primary'
                variant='solid'
                onClick={() => handleFeatureClick('ai-action-plan')}
                disabled={false}
                className='bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50'
                aria-label='Bekijk AI actieplan'
              >
                {'Bekijk Actieplan'}
              </Button>
            </CardBody>
          </Card>

          {/* 4. Journaling & Planning */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2'
            role='article'
            aria-labelledby='journaling-title'
          >
            <CardHeader>
              <h3 id='journaling-title' className='text-xl font-bold'>
                📝 Journaling & Planning
              </h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4'>
                Dagelijkse reflectie en AI-geanalyseerde inzichten
              </p>

              {/* AI Action Plan - First Message */}
              {userData?.aiActionPlan && (
                <div
                  className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'
                  role='status'
                  aria-live='polite'
                  aria-label='AI Action Plan beschikbaar'
                >
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl' aria-hidden='true'>
                      🤖
                    </span>
                    <span className='font-bold text-sm'>
                      AI Action Plan Beschikbaar
                    </span>
                  </div>
                  <p className='text-sm mb-3'>
                    Je hebt een gepersonaliseerd actieplan van je AI coach
                  </p>
                  <Button
                    color='primary'
                    variant='solid'
                    onClick={() => handleFeatureClick('journaling')}
                    size='sm'
                    className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                    aria-label='Bekijk AI action plan'
                  >
                    Bekijk Plan
                  </Button>
                </div>
              )}

              <Button
                color='primary'
                variant='solid'
                onClick={() => handleFeatureClick('journaling')}
                className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Start journaling en planning sessie'
              >
                Start Journaling
              </Button>
            </CardBody>
          </Card>

          {/* 3. AI Coaching */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2'
            role='article'
            aria-labelledby='ai-coaching-title'
          >
            <CardHeader>
              <h3 id='ai-coaching-title' className='text-xl font-bold'>
                🤖 AI Coaching
              </h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4'>
                Persoonlijke AI coach voor MBTI-specifieke begeleiding
              </p>
              <Button
                color='primary'
                variant='solid'
                onClick={() => handleFeatureClick('ai-coaching')}
                className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Start AI coaching sessie'
              >
                Start Coaching
              </Button>
            </CardBody>
          </Card>
          {/* 5. Holistisch Welzijn Dashboard */}
          <HolisticWellnessCard />

          {/* 6. Therapeuten & Coaches */}
          <Card
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2'
            role='article'
            aria-labelledby='therapist-title'
          >
            <CardHeader>
              <h3 id='therapist-title' className='text-xl font-bold'>
                👨‍⚕️ Therapeuten & Coaches
              </h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4'>
                Professionele begeleiding en therapie opties
              </p>
              <Button
                color='primary'
                variant='solid'
                onClick={() => handleFeatureClick('therapist')}
                className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
                aria-label='Zoek therapeuten en coaches'
              >
                Zoek Begeleiding
              </Button>
            </CardBody>
          </Card>
        </section>

        {/* 🎯 Content Features Section - Direct to Advanced Content Discovery */}
        <section aria-labelledby='content-features-title' className='mb-8'>
          <h2 id='content-features-title' className='sr-only'>
            Content Features
          </h2>
          
          {/* Direct to Advanced Content Discovery */}
          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(34,197,94,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] hover:-translate-y-1 transition-all duration-300'>
            <CardHeader className='pb-2'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center'>
                  <span className='text-white font-bold text-xl'>🎯</span>
                </div>
                <div>
                  <h3 className='text-xl font-semibold text-white'>Geavanceerde Content Discovery</h3>
                  <p className='text-sm text-gray-300'>Intelligente, gepersonaliseerde content op basis van je MBTI-type</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className='pt-0'>
              <p className='text-gray-300 text-sm mb-4'>
                Ontdek content die perfect aansluit bij jouw {mbtiType}-persoonlijkheid met geavanceerde filtering, moeilijkheidsgraden en AI-aanbevelingen.
              </p>
              <Button
                color='primary'
                variant='solid'
                onClick={() => navigate('/back-to-basics')}
                className='bg-[rgba(34,197,94,0.2)] text-white border border-[rgba(34,197,94,0.3)] hover:bg-[rgba(34,197,94,0.3)] hover:border-[rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-0.5 transition-all duration-300'
                aria-label='Open Content Discovery'
              >
                🚀 Ontdek Gepersonaliseerde Content
              </Button>
            </CardBody>
          </Card>

          {/* AI Coaching Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
            {/* Hogere Zelf AI Panel */}
            <HogerZelfAIPanel 
              mbtiType={mbtiType}
              userName={userName}
              onActivate={() => {
                logger.info('Hogere Zelf AI activated in MainView', { mbtiType, userName });
                analytics.track('hoger_zelf_ai_activated', { mbtiType });
              }}
            />
            
            <AICoachingWithContext
              userId={userData?.userId || 'temp_user'}
              mbtiType={mbtiType}
            />
          </div>
        </section>

        {/* 🎯 Content Discovery Section - Advanced Features */}
        <section aria-labelledby='content-discovery-title' className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold'>🔍</span>
            </div>
            <h2 id='content-discovery-title' className='text-xl font-semibold text-white'>
              Live Content Discovery
            </h2>
          </div>
          <ContentDiscoveryPanel
            userId={userData?.userId || 'temp_user'}
            mbtiType={mbtiType}
            maxItems={6}
            showFilters={true}
            compact={false}
          />
        </section>

        {/* 🔧 Background Services Status Panel */}
        <section aria-labelledby='background-services-title' className='mb-8'>
          <Card className='bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] shadow-lg'>
            <CardHeader>
              <h2 id='background-services-title' className='text-lg font-semibold text-white flex items-center gap-2'>
                <span>⚙️</span>
                Achtergrond Services
              </h2>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='flex items-center gap-2'>
                  <div className={`w-3 h-3 rounded-full ${backgroundServices.contentSync ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className='text-sm text-gray-300'>Content Sync</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className={`w-3 h-3 rounded-full ${backgroundServices.aiProcessing ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className='text-sm text-gray-300'>AI Processing</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className={`w-3 h-3 rounded-full ${backgroundServices.analytics ? 'bg-purple-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className='text-sm text-gray-300'>Analytics</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className={`w-3 h-3 rounded-full ${backgroundServices.notifications ? 'bg-orange-400 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className='text-sm text-gray-300'>Notifications</span>
                </div>
              </div>
              <div className='mt-3 text-xs text-gray-400'>
                Laatste update: {new Date(backgroundServices.lastUpdate).toLocaleTimeString()}
              </div>
            </CardBody>
          </Card>
        </section>

        {/* 🔧 Develop Data Button - Discreet */}
        <div className='text-center mt-8 mb-4'>
          <Button
            size='sm'
            color='default'
            variant='bordered'
            onClick={() => handleButtonClick('develop-data')}
            className='text-xs opacity-60 hover:opacity-100 transition-opacity'
            aria-label='Development data en debug tools'
          >
            🔧 Develop Data
          </Button>
        </div>

        {/* 🏆 Community & Challenges Section */}
        <section aria-labelledby='community-title' className='mb-8'>
          <div className='flex gap-3 flex-wrap justify-center'>
            <Button
              color='success'
              variant='bordered'
              onClick={() => handleButtonClick('challenges')}
              size='sm'
              aria-label='Bekijk uitdagingen'
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            >
              🎯 {t('navigation.challenges')}
            </Button>
            <Button
              color='primary'
              variant='bordered'
              onClick={() => handleButtonClick('chat')}
              size='sm'
              aria-label='Ga naar chat'
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              💬 {t('navigation.chat')}
            </Button>
            <Button
              color='primary'
              variant='bordered'
              onClick={() => handleQuickActionClick('communities')}
              size='lg'
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            >
              👥 {t('navigation.communities')}
            </Button>
            <Button
              color='secondary'
              variant='bordered'
              onClick={() => handleFeatureClick('analytics')}
              size='lg'
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            >
              📊 {t('navigation.analytics')} Dashboard
            </Button>
          </div>
        </section>

        {/* Main content anchor for skip link */}
        <div id='main-content' className='sr-only' />
      </div>{' '}
      {/* Sluit content container */}
    </div>
  );
});

MainView.displayName = 'MainView';

export default MainView;

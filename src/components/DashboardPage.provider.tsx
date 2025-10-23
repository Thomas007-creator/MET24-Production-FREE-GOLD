import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Target, Award, Bell, Activity } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import analytics from '../services/analytics';
import { databaseService } from '../services/databaseService';
import logger from '../utils/logger';
import discourseConnector from '../services/discourseConnector';

interface LifeArea {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  progress: number;
  challenges: number;
  lastActivity: string;
}

interface RecentActivity {
  id: string;
  type: 'task' | 'goal' | 'achievement' | 'reminder';
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'overdue';
}

interface WellnessScores {
  energy_index: number;
  stress_index: number;
  social_support_score: number;
  self_compassion_score: number;
}

interface DashboardContextType {
  userData: any;
  userName: string;
  mbtiType: string;
  lifeAreas: LifeArea[];
  stats: {
    wellnessScore: number;
    completedTasks: number;
    totalTasks: number;
    streakDays: number;
    weeklyProgress: number;
  };
  recentActivities: RecentActivity[];
  handleButtonClick: (action: string) => Promise<void>;
  handleQuickActionClick: (action: string) => Promise<void>;
  handleFeatureClick: (feature: string) => Promise<void>;
  getStatusColor: (status: string) => 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined;
  getStatusIcon: (status: string) => React.JSX.Element;
  getTypeIcon: (type: string) => React.JSX.Element;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { userData } = useAppStore();
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);

  const userName = userData?.name || 'Gebruiker';
  const mbtiType = userData?.mbtiType || 'INTJ';

  // Load wellness data from database
  const loadWellnessData = useCallback(async () => {
    try {
      const wellnessData = await databaseService.getWellnessAssessment();

      if (wellnessData && wellnessData.scores) {
        const calculatedLifeAreas = calculateLifeAreaScores(
          wellnessData.scores as WellnessScores
        );
        setLifeAreas(calculatedLifeAreas);
        logger.info('Loaded real wellness data:', wellnessData.scores);
      } else {
        logger.warn('No wellness data found - user must complete onboarding first');
        setLifeAreas([]);
      }
    } catch (error) {
      logger.error('Error loading wellness data:', { error: error instanceof Error ? error.message : String(error) });
      setLifeAreas([]);
    }
  }, []);

  useEffect(() => {
    loadWellnessData();
  }, [loadWellnessData]);

  // Calculate life area scores based on onboarding wellness answers
  const calculateLifeAreaScores = (scores: WellnessScores): LifeArea[] => {
    const energyScore = scores.energy_index || 50;
    const stressScore = scores.stress_index || 50;
    const socialScore = scores.social_support_score || 50;
    const compassionScore = scores.self_compassion_score || 50;

    const psychischeGezondheid = Math.round(
      (compassionScore + (100 - stressScore) + socialScore) / 3
    );
    const lichamelijkeGezondheid = Math.round(energyScore);
    const financieen = 50;
    const werkSamenleving = Math.round(
      (socialScore + compassionScore + (100 - stressScore)) / 3
    );
    const hobbyPassies = Math.round(compassionScore);
    const actieveImaginatie = 50;
    const professioneleOntwikkeling = Math.round(
      (compassionScore + (100 - stressScore)) / 2
    );
    const socialeRelaties = Math.round((socialScore + (100 - stressScore)) / 2);
    const thuisOmgeving = Math.round((energyScore + (100 - stressScore)) / 2);

    return [
      {
        id: 'psychischeGezondheid',
        name: 'Psychische Gezondheid',
        icon: '🧠',
        color: 'from-blue-500 to-purple-600',
        description: 'Mental health en emotionele balans',
        progress: psychischeGezondheid,
        challenges: 3,
        lastActivity: '2 dagen geleden',
      },
      {
        id: 'lichamelijkeGezondheid',
        name: 'Lichamelijke Gezondheid',
        icon: '💪',
        color: 'from-green-500 to-teal-600',
        description: 'Fysieke vitaliteit en welzijn',
        progress: lichamelijkeGezondheid,
        challenges: 2,
        lastActivity: '1 dag geleden',
      },
      {
        id: 'financieen',
        name: 'Financiën',
        icon: '💰',
        color: 'from-yellow-500 to-orange-600',
        description: 'Financiële vrijheid en planning',
        progress: financieen,
        challenges: 1,
        lastActivity: '3 dagen geleden',
      },
      {
        id: 'werkSamenleving',
        name: 'Werk & Samenleving',
        icon: '💼',
        color: 'from-red-500 to-pink-600',
        description: 'Carrière en maatschappelijke bijdrage',
        progress: werkSamenleving,
        challenges: 4,
        lastActivity: 'Vandaag',
      },
      {
        id: 'hobbyPassies',
        name: 'Hobby&apos;s & Passies',
        icon: '🎨',
        color: 'from-pink-500 to-rose-600',
        description: 'Creativiteit en persoonlijke expressie',
        progress: hobbyPassies,
        challenges: 2,
        lastActivity: '1 dag geleden',
      },
      {
        id: 'actieveImaginatie',
        name: 'Actieve Imaginatie',
        icon: '🧘',
        color: 'from-indigo-500 to-blue-600',
        description: 'Spirituele groei en innerlijke ontwikkeling',
        progress: actieveImaginatie,
        challenges: 1,
        lastActivity: '5 dagen geleden',
      },
      {
        id: 'professioneleOntwikkeling',
        name: 'Professionele Ontwikkeling',
        icon: '📈',
        color: 'from-emerald-500 to-green-600',
        description: 'Digitale vaardigheden en carrière groei',
        progress: professioneleOntwikkeling,
        challenges: 3,
        lastActivity: '2 dagen geleden',
      },
      {
        id: 'socialeRelaties',
        name: 'Sociale Relaties',
        icon: '❤️',
        color: 'from-rose-500 to-pink-600',
        description: 'Communicatie en relatie vaardigheden',
        progress: socialeRelaties,
        challenges: 2,
        lastActivity: 'Vandaag',
      },
      {
        id: 'thuisOmgeving',
        name: 'Thuis & Omgeving',
        icon: '🏡',
        color: 'from-cyan-500 to-blue-600',
        description: 'Duurzaam leven en woonomgeving',
        progress: thuisOmgeving,
        challenges: 1,
        lastActivity: '1 week geleden',
      },
    ];
  };

  // Calculate overall wellness score from life areas
  const calculateOverallWellnessScore = (): number => {
    if (lifeAreas.length === 0) return 0;
    const totalScore = lifeAreas.reduce((sum: number, area: LifeArea) => sum + area.progress, 0);
    return Math.round(totalScore / lifeAreas.length);
  };

  const stats = {
    wellnessScore: calculateOverallWellnessScore(),
    completedTasks: 12,
    totalTasks: 15,
    streakDays: 7,
    weeklyProgress: 85,
  };

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'task',
      title: 'Dagelijkse meditatie voltooid',
      description: '10 minuten mindfulness sessie',
      time: '2 uur geleden',
      status: 'completed',
    },
    {
      id: '2',
      type: 'goal',
      title: 'Nieuw doel ingesteld',
      description: 'Fysieke activiteit verhogen',
      time: '4 uur geleden',
      status: 'pending',
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Weekstreak behaald!',
      description: '7 dagen consistent geweest',
      time: '1 dag geleden',
      status: 'completed',
    },
    {
      id: '4',
      type: 'reminder',
      title: 'Herinnering: Journaling',
      description: 'Dagelijkse reflectie nog niet gedaan',
      time: 'Nu',
      status: 'overdue',
    },
  ];

  const handleButtonClick = async (action: string) => {
    logger.debug('Button clicked:', { action });
    try {
      await analytics.trackMainViewNavigation(action);
      await analytics.trackButtonClick(action, 'mainview');
    } catch (error) {
      logger.error('Analytics tracking error:', { error: error instanceof Error ? error.message : String(error) });
    }

    const mbtiType = userData?.mbtiType;
    switch (action) {
      case 'community':
        logger.info('🎯 Dashboard: Navigating to Discourse Communities', { mbtiType });
        discourseConnector.navigateToCommunities(mbtiType);
        return;
      case 'challenges':
        logger.info('🎯 Dashboard: Navigating to Discourse Challenges');
        discourseConnector.navigateToChallenges();
        return;
      default:
        navigate(`/${action}`);
    }
  };

  const handleQuickActionClick = async (action: string) => {
    logger.debug('Quick action clicked:', { action });
    try {
      await analytics.trackButtonClick(action, 'quick_actions');
    } catch (error) {
      logger.error('Analytics tracking error:', { error: error instanceof Error ? error.message : String(error) });
    }
    navigate(`/${action}`);
  };

  const handleFeatureClick = async (feature: string) => {
    logger.debug('Feature clicked:', { feature });
    try {
      await analytics.trackFeatureUsage(feature);
      await analytics.trackButtonClick(feature, 'feature_cards');
    } catch (error) {
      logger.error('Analytics tracking error:', { error: error instanceof Error ? error.message : String(error) });
    }
    navigate(`/${feature}`);
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'overdue':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle size={16} />;
      case 'goal':
        return <Target size={16} />;
      case 'achievement':
        return <Award size={16} />;
      case 'reminder':
        return <Bell size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const value: DashboardContextType = {
    userData,
    userName,
    mbtiType,
    lifeAreas,
    stats,
    recentActivities,
    handleButtonClick,
    handleQuickActionClick,
    handleFeatureClick,
    getStatusColor,
    getStatusIcon,
    getTypeIcon,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
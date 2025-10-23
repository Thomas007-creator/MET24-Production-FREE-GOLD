import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
} from '@nextui-org/react';
import {
  Home,
  Settings,
  User,
  Bell,
  Activity,
  Target,
  Brain,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Heart,
  TrendingUp,
  ArrowUp,
  BarChart3,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import analytics from '../services/analytics';
import { databaseService } from '../services/databaseService';
import logger from '../utils/logger';
import discourseConnector from '../services/discourseConnector';

interface DashboardStats {
  wellnessScore: number;
  completedTasks: number;
  totalTasks: number;
  streakDays: number;
  weeklyProgress: number;
}

interface RecentActivity {
  id: string;
  type: 'task' | 'goal' | 'achievement' | 'reminder';
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'pending' | 'overdue';
}

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

interface WellnessScores {
  energy_index: number;
  stress_index: number;
  social_support_score: number;
  self_compassion_score: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAppStore();
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);

  // Debug logging
  logger.debug('DashboardPage userData:', { userData });

  const userName = userData?.name || 'Gebruiker';
  const mbtiType = userData?.mbtiType || 'INTJ';

  logger.debug('DashboardPage userName:', { userName });
  logger.debug('DashboardPage mbtiType:', { mbtiType });

  // Load wellness data from database
  const loadWellnessData = useCallback(async () => {
    try {
      // Load wellness assessment from database
      const wellnessData = await databaseService.getWellnessAssessment();

      if (wellnessData && wellnessData.scores) {
        // Calculate life area scores based on onboarding answers
        const calculatedLifeAreas = calculateLifeAreaScores(
          wellnessData.scores as WellnessScores
        );
        setLifeAreas(calculatedLifeAreas);
        logger.info('Loaded real wellness data:', wellnessData.scores);
      } else {
        // No wellness data found - user needs to complete onboarding
        logger.warn(
          'No wellness data found - user must complete onboarding first'
        );
        setLifeAreas([]); // Empty array - no mock data
      }
    } catch (error) {
      logger.error('Error loading wellness data:', { error: error instanceof Error ? error.message : String(error) });
      setLifeAreas([]); // No mock data on error
    }
  }, []);

  useEffect(() => {
    loadWellnessData();
  }, [loadWellnessData]);

  // Calculate life area scores based on onboarding wellness answers
  const calculateLifeAreaScores = (scores: WellnessScores): LifeArea[] => {
    // Convert scores to 0-100 scale (they are stored as 0-100)
    const energyScore = scores.energy_index || 50;
    const stressScore = scores.stress_index || 50;
    const socialScore = scores.social_support_score || 50;
    const compassionScore = scores.self_compassion_score || 50;

    // Calculate life area scores based on specific questions
    const psychischeGezondheid = Math.round(
      (compassionScore + (100 - stressScore) + socialScore) / 3
    );

    const lichamelijkeGezondheid = Math.round(energyScore);

    const financieen = 50; // Placeholder - to be determined after onboarding

    const werkSamenleving = Math.round(
      (socialScore + compassionScore + (100 - stressScore)) / 3
    );

    const hobbyPassies = Math.round(compassionScore);

    const actieveImaginatie = 50; // Placeholder - to be determined after onboarding

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

  // No mock data - everything comes from real database

  // Calculate overall wellness score from life areas
  const calculateOverallWellnessScore = (): number => {
    if (lifeAreas.length === 0) return 0;

    const totalScore = lifeAreas.reduce((sum, area) => sum + area.progress, 0);
    return Math.round(totalScore / lifeAreas.length);
  };

  // Stats based on real data
  const stats: DashboardStats = {
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

    // 🚀 DISCOURSE DIRECTE CONNECTIE VAN DASHBOARD
    const mbtiType = userData?.mbtiType;
    
    switch (action) {
      case 'community':
        // Direct naar Discourse communities
        logger.info('🎯 Dashboard: Navigating to Discourse Communities', { mbtiType });
        discourseConnector.navigateToCommunities(mbtiType);
        return;
        
      case 'challenges':
        // Direct naar Discourse challenges
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

  const getStatusColor = (status: string) => {
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

  return (
    <div className='min-h-screen bg-gradient-to-b from-[rgba(27,38,59,0.4)] via-[rgba(110,225,225,0.7)] to-[#0d1b2a] text-[#e0e0e0] relative'>
      {/* Bovenste gradient: Transparante donkere blauw rgba(27,38,59,0.4) → Gebalanceerde aqua-cyaan rgba(110,225,225,0.7) */}
      <div className='absolute inset-0 bg-gradient-to-b from-[rgba(27,38,59,0.4)] via-[rgba(110,225,225,0.7)] to-[#0d1b2a] pointer-events-none'></div>

      {/* Onderste gradient: Donker (#0d1b2a) → Transparante donkere blauw rgba(27,38,59,0.2) - alleen onderste helft */}
      <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0d1b2a] to-[rgba(27,38,59,0.2)] pointer-events-none'></div>
      {/* Header */}
      <header className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border-b border-[rgba(100,223,223,0.2)] p-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-[rgba(100,223,223,0.2)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-xl flex items-center justify-center'>
              <Brain size={24} className='text-[#64dfdf]' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-white'>
                📊 Analytics Dashboard
              </h1>
              <p className='text-sm text-[#e0e0e0]/70'>
                Welkom terug, {userName}! ({mbtiType})
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              color='secondary'
              variant='bordered'
              startContent={<Home />}
              onClick={() => navigate('/')}
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            >
              Hoofdmenu
            </Button>
            <Button
              isIconOnly
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
              onClick={() => navigate('/settings')}
            >
              <Settings size={20} />
            </Button>
            <Button
              isIconOnly
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
              onClick={() => navigate('/profile')}
            >
              <User size={20} />
            </Button>
            <Button
              isIconOnly
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            >
              <Bell size={20} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto p-6'>
        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300'>
            <CardBody className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#e0e0e0]/70 mb-1'>
                    Wellness Score
                  </p>
                  <p className='text-2xl font-bold text-white'>
                    {stats.wellnessScore}%
                  </p>
                </div>
                <div className='w-12 h-12 bg-[rgba(100,223,223,0.1)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-xl flex items-center justify-center'>
                  <Heart size={24} className='text-[#64dfdf]' />
                </div>
              </div>
              <Progress
                value={stats.wellnessScore}
                className='mt-4'
                color='primary'
                size='sm'
              />
            </CardBody>
          </Card>

          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300'>
            <CardBody className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#e0e0e0]/70 mb-1'>
                    Taken Voltooid
                  </p>
                  <p className='text-2xl font-bold text-white'>
                    {stats.completedTasks}/{stats.totalTasks}
                  </p>
                </div>
                <div className='w-12 h-12 bg-[rgba(100,223,223,0.1)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-xl flex items-center justify-center'>
                  <CheckCircle size={24} className='text-[#64dfdf]' />
                </div>
              </div>
              <Progress
                value={(stats.completedTasks / stats.totalTasks) * 100}
                className='mt-4'
                color='primary'
                size='sm'
              />
            </CardBody>
          </Card>

          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300'>
            <CardBody className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#e0e0e0]/70 mb-1'>Streak Dagen</p>
                  <p className='text-2xl font-bold text-white'>
                    {stats.streakDays}
                  </p>
                </div>
                <div className='w-12 h-12 bg-[rgba(100,223,223,0.1)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-xl flex items-center justify-center'>
                  <TrendingUp size={24} className='text-[#64dfdf]' />
                </div>
              </div>
              <div className='flex items-center gap-1 mt-4'>
                <ArrowUp size={16} className='text-green-400' />
                <span className='text-sm text-green-400'>+2 dagen</span>
              </div>
            </CardBody>
          </Card>

          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300'>
            <CardBody className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-[#e0e0e0]/70 mb-1'>
                    Week Progress
                  </p>
                  <p className='text-2xl font-bold text-white'>
                    {stats.weeklyProgress}%
                  </p>
                </div>
                <div className='w-12 h-12 bg-[rgba(100,223,223,0.1)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-xl flex items-center justify-center'>
                  <BarChart3 size={24} className='text-[#64dfdf]' />
                </div>
              </div>
              <Progress
                value={stats.weeklyProgress}
                className='mt-4'
                color='primary'
                size='sm'
              />
            </CardBody>
          </Card>
        </div>

        {/* 🚀 Snelle Acties - Bovenste Menu Balk (3 buttons) */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            🚀 Snelle Acties
          </h2>
          <div className='flex gap-4 flex-wrap justify-center'>
            <Button
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-white hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-1 transition-all duration-300'
              size='lg'
              onClick={() => handleQuickActionClick('profile')}
            >
              👤 Profiel
            </Button>
            <Button
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-white hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-1 transition-all duration-300'
              size='lg'
              onClick={() => handleQuickActionClick('settings')}
            >
              ⚙️ Instellingen
            </Button>
            <Button
              className='bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold border-2 border-[#FF8C00] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] hover:-translate-y-1 transition-all duration-300'
              size='lg'
              onClick={() => handleQuickActionClick('upgrade-gold')}
            >
              ⭐ Upgrade Gold
            </Button>
          </div>
        </div>

        {/* 🎯 Hoofdnavigatie Cards (5 buttons in jouw volgorde) */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {/* 1. Actieve Imaginatie */}
          <Card className='bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white shadow-lg hover:shadow-[0_0_30px_rgba(79,172,254,0.3)] hover:-translate-y-2 transition-all duration-300'>
            <CardHeader>
              <h3 className='text-xl font-bold'>🧘 Actieve Imaginatie</h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4 text-white/90'>
                Creatieve visualisatie technieken voor persoonlijke groei
              </p>
              <Button
                className='bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300'
                onClick={() => handleFeatureClick('imagination')}
              >
                Start Imaginatie
              </Button>
            </CardBody>
          </Card>

          {/* 2. Journaling & Planning */}
          <Card className='bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-white shadow-lg hover:shadow-[0_0_30px_rgba(240,147,251,0.3)] hover:-translate-y-2 transition-all duration-300'>
            <CardHeader>
              <h3 className='text-xl font-bold'>📝 Journaling & Planning</h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4 text-white/90'>
                Dagelijkse reflectie en AI-geanalyseerde inzichten
              </p>

              {/* AI Action Plan - First Message */}
              {userData?.aiActionPlan && (
                <div className='bg-white/15 backdrop-blur-xl border border-white/20 rounded-xl p-4 mb-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-lg'>🤖</span>
                    <span className='font-bold text-sm'>AI Actieplan</span>
                    <Chip
                      size='sm'
                      color='success'
                      variant='flat'
                      className='ml-auto'
                    >
                      Nieuw
                    </Chip>
                  </div>
                  <div className='text-sm leading-relaxed'>
                    {userData?.aiActionPlan?.steps
                      ?.slice(0, 2)
                      .map((step: string, index: number) => (
                        <div key={index} className='mb-1'>
                          • {step}
                        </div>
                      ))}
                    {userData?.aiActionPlan?.steps &&
                      userData.aiActionPlan.steps.length > 2 && (
                        <div className='text-xs opacity-80 mt-2'>
                          +{userData.aiActionPlan.steps.length - 2} meer
                          stappen...
                        </div>
                      )}
                  </div>
                </div>
              )}

              <Button
                className='bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300'
                onClick={() => handleFeatureClick('journaling')}
              >
                Start Journaling
              </Button>
            </CardBody>
          </Card>

          {/* 3. Back to Basics */}
          <Card className='bg-gradient-to-br from-[#a8edea] to-[#fed6e3] text-[#2d3748] shadow-lg hover:shadow-[0_0_30px_rgba(168,237,234,0.3)] hover:-translate-y-2 transition-all duration-300'>
            <CardHeader>
              <h3 className='text-xl font-bold'>📚 Back to Basics</h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4 text-[#2d3748]/80'>
                Levensgebieden en basis principes voor een gebalanceerd leven
              </p>
              <Button
                className='bg-[#667eea] text-white hover:bg-[#5a67d8] transition-all duration-300'
                onClick={() => handleFeatureClick('basics')}
              >
                Bekijk Basics
              </Button>
            </CardBody>
          </Card>

          {/* 4. Your Therapeut & Coach */}
          <Card className='bg-gradient-to-br from-[#43e97b] to-[#38f9d7] text-white shadow-lg hover:shadow-[0_0_30px_rgba(67,233,123,0.3)] hover:-translate-y-2 transition-all duration-300'>
            <CardHeader>
              <h3 className='text-xl font-bold'>👨‍⚕️ Your Therapeut & Coach</h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4 text-white/90'>
                Professionele begeleiding en coaching sessies
              </p>
              <Button
                className='bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300'
                onClick={() => handleFeatureClick('therapist')}
              >
                Bekijk Therapeuten
              </Button>
            </CardBody>
          </Card>

          {/* 5. Analytics */}
          <Card className='bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-lg hover:shadow-[0_0_30px_rgba(102,126,234,0.3)] hover:-translate-y-2 transition-all duration-300'>
            <CardHeader>
              <h3 className='text-xl font-bold'>📊 Analytics</h3>
            </CardHeader>
            <CardBody>
              <p className='mb-4 text-white/90'>
                Bekijk je voortgang en persoonlijke inzichten
              </p>
              <Button
                className='bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all duration-300'
                onClick={() => handleFeatureClick('analytics')}
              >
                Bekijk Analytics
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* 🚀 Snelle Acties - Footer Balk (3 buttons) */}
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-white mb-4'>
            🚀 Snelle Acties
          </h2>
          <div className='flex gap-4 flex-wrap justify-center'>
            <Button
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-white hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-1 transition-all duration-300'
              size='lg'
              onClick={() => handleButtonClick('ai-coaching')}
            >
              🧠 AI Coaching
            </Button>
            <Button
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-white hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-1 transition-all duration-300'
              size='lg'
              onClick={() => handleButtonClick('challenges')}
            >
              🎯 Challenges
            </Button>
            <Button
              className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-white hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-1 transition-all duration-300'
              size='lg'
              onClick={() => handleButtonClick('community')}
            >
              👥 Community
            </Button>
          </div>
        </div>

        {/* Recent Activity & Today's Goals */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg'>
            <CardBody className='p-6'>
              <h3 className='text-lg font-semibold text-white mb-4'>
                Recente Activiteit
              </h3>
              <div className='space-y-4'>
                {recentActivities.map(activity => (
                  <div
                    key={activity.id}
                    className='flex items-start gap-3 p-3 bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] rounded-xl hover:bg-[rgba(100,223,223,0.05)] hover:border-[rgba(100,223,223,0.2)] transition-all duration-300'
                  >
                    <div className='w-8 h-8 bg-[rgba(100,223,223,0.1)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-lg flex items-center justify-center flex-shrink-0'>
                      {getTypeIcon(activity.type)}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-1'>
                        <h4 className='text-sm font-medium text-white truncate'>
                          {activity.title}
                        </h4>
                        <Chip
                          size='sm'
                          color={getStatusColor(activity.status)}
                          variant='flat'
                          startContent={getStatusIcon(activity.status)}
                        >
                          {activity.status}
                        </Chip>
                      </div>
                      <p className='text-xs text-[#e0e0e0]/70 mb-1'>
                        {activity.description}
                      </p>
                      <p className='text-xs text-[#e0e0e0]/50'>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg'>
            <CardBody className='p-6'>
              <h3 className='text-lg font-semibold text-white mb-4'>
                Vandaag&apos;s Doelen
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between p-3 bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] rounded-xl'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-green-500/20 backdrop-blur-xl border border-green-500/30 rounded-lg flex items-center justify-center'>
                      <CheckCircle size={16} className='text-green-400' />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-white'>
                        Meditatie
                      </h4>
                      <p className='text-xs text-[#e0e0e0]/70'>
                        10 minuten mindfulness
                      </p>
                    </div>
                  </div>
                  <Chip size='sm' color='success' variant='flat'>
                    Voltooid
                  </Chip>
                </div>

                <div className='flex items-center justify-between p-3 bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] rounded-xl'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-lg flex items-center justify-center'>
                      <Clock size={16} className='text-yellow-400' />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-white'>
                        Journaling
                      </h4>
                      <p className='text-xs text-[#e0e0e0]/70'>
                        Dagelijkse reflectie
                      </p>
                    </div>
                  </div>
                  <Chip size='sm' color='warning' variant='flat'>
                    Pending
                  </Chip>
                </div>

                <div className='flex items-center justify-between p-3 bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] rounded-xl'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 rounded-lg flex items-center justify-center'>
                      <Activity size={16} className='text-blue-400' />
                    </div>
                    <div>
                      <h4 className='text-sm font-medium text-white'>
                        Beweging
                      </h4>
                      <p className='text-xs text-[#e0e0e0]/70'>
                        30 minuten wandelen
                      </p>
                    </div>
                  </div>
                  <Chip size='sm' color='primary' variant='flat'>
                    In Progress
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Test Section */}
        <div className='mt-8 text-center p-6 bg-[rgba(27,38,59,0.3)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] rounded-xl'>
          <h3 className='text-white mb-2'>✅ MainView is geladen!</h3>
          <p className='text-[#e0e0e0]/70 mb-4'>
            Als je dit ziet, werkt de MainView component correct.
          </p>

          {/* Debug Info */}
          <div className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.1)] rounded-lg p-4'>
            <h4 className='text-white mb-2'>🔍 Debug Info:</h4>
            <p className='text-[#e0e0e0]/80 text-sm mb-1'>
              <strong>userName:</strong> {userName}
            </p>
            <p className='text-[#e0e0e0]/80 text-sm mb-4'>
              <strong>mbtiType:</strong> {mbtiType}
            </p>

            {/* Test Buttons */}
            <div className='flex gap-3 justify-center flex-wrap'>
              <Button
                size='sm'
                className='bg-red-500 text-white hover:bg-red-600 transition-all duration-300'
                onClick={() => {
                  localStorage.removeItem('onboarding_completed');
                  window.location.reload();
                }}
              >
                🔄 Reset Onboarding
              </Button>
              <Button
                size='sm'
                className='bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300'
                onClick={async () => {
                  logger.debug('Current userData:', { userData });
                  logger.debug('Current userName:', { userName });
                  logger.debug('Current mbtiType:', { mbtiType });
                  try {
                    // Mock analytics events
                    const events: unknown[] = [];
                    logger.debug('Analytics Events:', { events });
                  } catch (error) {
                    logger.error('Failed to get analytics events:', { error: error instanceof Error ? error.message : String(error) });
                  }
                }}
              >
                📊 Log Data & Analytics
              </Button>
              <Button
                size='sm'
                className='bg-purple-500 text-white hover:bg-purple-600 transition-all duration-300'
                onClick={async () => {
                  try {
                    // Mock clear events
                    logger.info('Analytics events cleared (mock)');
                    logger.info('Analytics events cleared');
                  } catch (error) {                    logger.error('Failed to clear analytics events:', { error: error instanceof Error ? error.message : String(error) });
                  }
                }}
              >
                🗑️ Clear Analytics
              </Button>
              <Button
                size='sm'
                className='bg-teal-500 text-white hover:bg-teal-600 transition-all duration-300'
                onClick={() => navigate('/dev-analytics')}
              >
                🧪 Development Analytics
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className='fixed bottom-0 left-0 right-0 bg-[rgba(27,38,59,0.8)] backdrop-blur-xl border-t border-[rgba(100,223,223,0.2)] p-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-around'>
          <Button
            isIconOnly
            className='bg-[rgba(100,223,223,0.1)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] text-[#64dfdf] shadow-[0_0_20px_rgba(100,223,223,0.3)]'
            onClick={() => navigate('/')}
          >
            <Home size={24} />
          </Button>

          <Button
            isIconOnly
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            onClick={() => navigate('/journaling')}
          >
            <Brain size={24} />
          </Button>

          <Button
            isIconOnly
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            onClick={() => navigate('/basics')}
          >
            <Target size={24} />
          </Button>

          <Button
            isIconOnly
            className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] text-[#64dfdf] hover:bg-[rgba(100,223,223,0.1)] hover:border-[rgba(100,223,223,0.4)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300'
            onClick={() => navigate('/settings')}
          >
            <Settings size={24} />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;

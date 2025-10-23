import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  Textarea,
  Tabs,
  Tab,
} from '@nextui-org/react';
import {
  Target,
  Users,
  Calendar,
  Flame,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ChallengesService, CreateChallengeData, ChallengeFilters } from '../services/challengesService';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'community' | 'personal';
  status: 'active' | 'completed' | 'failed';
  participants?: number;
  startDate: string;
  endDate: string;
  progress: number;
  tags: string[];
  mbtiRelevance: string[];
  points: number;
  streak: number;
  isBookmarked: boolean;
  isLiked: boolean;
  likes: number;
  author: string;
  authorAvatar: string;
  estimatedTime: number; // in minutes
  completionRate: number;
  isJoined: boolean;
  milestones: Milestone[];
  rewards: Reward[];
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  reward: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  isUnlocked: boolean;
}

interface UserStats {
  totalChallenges: number;
  completedChallenges: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LifeArea {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAppStore();

  // V3 Challenges Service
  const challengesService = ChallengesService.getInstance();

  // State voor challenges
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('community');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery] = useState('');
  const [selectedDifficulty] = useState<string>('all');
  const [selectedMBTI] = useState<string>('all');
  const [userStats, setUserStats] = useState<UserStats>({
    totalChallenges: 0,
    completedChallenges: 0,
    currentStreak: 0,
    totalPoints: 0,
    level: 1,
    achievements: []
  });
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '',
    description: '',
    category: '',
    difficulty: 'medium',
    type: 'personal',
    tags: [],
    mbtiRelevance: [],
    points: 100,
    estimatedTime: 30,
  });

  const userName = userData?.name || 'Gebruiker';

  // Levensgebieden data
  const lifeAreas: LifeArea[] = [
    {
      id: 'psychischeGezondheid',
      name: 'Psychische Gezondheid',
      icon: '🧠',
      color: 'from-blue-500 to-purple-600',
    },
    {
      id: 'lichamelijkeGezondheid',
      name: 'Lichamelijke Gezondheid',
      icon: '💪',
      color: 'from-green-500 to-teal-600',
    },
    {
      id: 'financieen',
      name: 'Financiën',
      icon: '💰',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      id: 'werkSamenleving',
      name: 'Werk & Samenleving',
      icon: '💼',
      color: 'from-red-500 to-pink-600',
    },
    {
      id: 'hobbyPassies',
      name: "Hobby's & Passies",
      icon: '🎨',
      color: 'from-pink-500 to-rose-600',
    },
    {
      id: 'actieveImaginatie',
      name: 'Actieve Imaginatie',
      icon: '🧘',
      color: 'from-indigo-500 to-blue-600',
    },
    {
      id: 'professioneleOntwikkeling',
      name: 'Professionele Ontwikkeling',
      icon: '📈',
      color: 'from-emerald-500 to-green-600',
    },
    {
      id: 'socialeRelaties',
      name: 'Sociale Relaties',
      icon: '❤️',
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'thuisOmgeving',
      name: 'Thuis & Omgeving',
      icon: '🏡',
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  // Mock challenges data - geïntegreerd met bestaande Journaling & Planning
  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: '30 Dagen Journaling Challenge',
      description:
        'Dagelijks journaling met MBTI-specifieke prompts voor persoonlijke groei en zelfreflectie',
      category: 'psychischeGezondheid',
      difficulty: 'easy',
      type: 'community',
      status: 'active',
      participants: 67,
      startDate: '2024-01-01',
      endDate: '2024-01-30',
      progress: 65,
      tags: ['journaling', 'MBTI', 'zelfreflectie', 'persoonlijke-groei'],
      mbtiRelevance: ['INFP', 'INFJ', 'ENFP', 'ENFJ', 'ISFP', 'ISFJ'],
      points: 500,
      streak: 15,
      isBookmarked: true,
      isLiked: false,
      likes: 23,
      author: 'Dr. Sarah van der Berg',
      authorAvatar: '👩‍⚕️',
      estimatedTime: 10,
      completionRate: 78,
      isJoined: true,
      milestones: [
        {
          id: '1-1',
          title: 'Week 1 Voltooid',
          description: '7 dagen journaling',
          targetValue: 7,
          currentValue: 7,
          isCompleted: true,
          reward: '50 punten'
        },
        {
          id: '1-2',
          title: 'Week 2 Voltooid',
          description: '14 dagen journaling',
          targetValue: 14,
          currentValue: 15,
          isCompleted: true,
          reward: '100 punten'
        }
      ],
      rewards: [
        {
          id: '1-1',
          title: 'Journaling Badge',
          description: 'Eerste week voltooid',
          icon: '📖',
          points: 50,
          isUnlocked: true
        }
      ]
    },
    {
      id: '2',
      title: 'Week Planning Challenge',
      description: 'Dagelijks plannen en bijhouden van taken voor betere productiviteit en MBTI-gebaseerde planning',
      category: 'professioneleOntwikkeling',
      difficulty: 'medium',
      type: 'personal',
      status: 'active',
      participants: 1,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      progress: 42,
      tags: ['planning', 'productiviteit', 'taken', 'MBTI-planning'],
      mbtiRelevance: ['INTJ', 'ENTJ', 'ISTJ', 'ESTJ', 'INFJ', 'ENFJ'],
      points: 300,
      streak: 8,
      isBookmarked: false,
      isLiked: true,
      likes: 0,
      author: 'Planning Coach',
      authorAvatar: '📅',
      estimatedTime: 5,
      completionRate: 45,
      isJoined: true,
      milestones: [
        {
          id: '2-1',
          title: 'Week 1 Voltooid',
          description: '7 dagen planning',
          targetValue: 7,
          currentValue: 8,
          isCompleted: true,
          reward: '75 punten'
        }
      ],
      rewards: [
        {
          id: '2-1',
          title: 'Planning Badge',
          description: 'Eerste week voltooid',
          icon: '📋',
          points: 75,
          isUnlocked: true
        }
      ]
    },
    {
      id: '3',
      title: 'Budget Tracking Challenge',
      description: 'Alle uitgaven bijhouden en budget doelen behalen',
      category: 'financieen',
      difficulty: 'hard',
      type: 'community',
      status: 'active',
      participants: 23,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      progress: 28,
      tags: ['budget', 'sparen', 'financiën'],
      mbtiRelevance: ['ISTJ', 'ESTJ', 'ISFJ', 'ESFJ'],
      points: 400,
      streak: 5,
      isBookmarked: false,
      isLiked: false,
      likes: 8,
      author: 'Financial Coach',
      authorAvatar: '💰',
      estimatedTime: 20,
      completionRate: 35,
      isJoined: false,
      milestones: [],
      rewards: []
    },
    {
      id: '4',
      title: 'Persoonlijke Leerdoel',
      description: 'Nieuwe programmeertaal leren in 3 maanden',
      category: 'professioneleOntwikkeling',
      difficulty: 'hard',
      type: 'personal',
      status: 'active',
      participants: 1,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      progress: 35,
      tags: ['programmeren', 'leren', 'carrière'],
      mbtiRelevance: ['INTJ', 'ENTJ', 'INTP', 'ENTP'],
      points: 600,
      streak: 12,
      isBookmarked: true,
      isLiked: true,
      likes: 0,
      author: userName,
      authorAvatar: '👨‍💻',
      estimatedTime: 60,
      completionRate: 40,
      isJoined: true,
      milestones: [],
      rewards: []
    },
    {
      id: '5',
      title: 'Sociale Verbindingen',
      description:
        'Elke week een nieuwe persoon ontmoeten of oude vriendschap versterken',
      category: 'socialeRelaties',
      difficulty: 'medium',
      type: 'personal',
      status: 'active',
      participants: 1,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      progress: 12,
      tags: ['sociale vaardigheden', 'vriendschappen', 'netwerken'],
      mbtiRelevance: ['ENFP', 'ESFP', 'ENFJ', 'ESFJ'],
      points: 300,
      streak: 3,
      isBookmarked: false,
      isLiked: false,
      likes: 0,
      author: userName,
      authorAvatar: '👥',
      estimatedTime: 30,
      completionRate: 15,
      isJoined: true,
      milestones: [],
      rewards: []
    },
  ];

  useEffect(() => {
    const initializeChallenges = async () => {
      try {
        setLoading(true);
        
        // Get user ID from userData
        const userId = userData?.id || 'default-user';
        
        // Load challenges from database
        const filters: ChallengeFilters = {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          type: activeTab,
          limit: 50
        };
        
        const dbChallenges = await challengesService.getChallenges(filters, userId);
        
        // Convert database challenges to UI format
        const uiChallenges = await Promise.all(dbChallenges.map(async (dbChallenge) => {
          const milestones = Array.isArray(dbChallenge.milestones) ? dbChallenge.milestones : [];
          const rewards = Array.isArray(dbChallenge.rewards) ? dbChallenge.rewards : [];
          
          return {
            id: dbChallenge.id,
            title: dbChallenge.title,
            description: dbChallenge.description,
            category: dbChallenge.category,
            difficulty: dbChallenge.difficultyLevel,
            type: (dbChallenge.isCommunity ? 'community' : 'personal') as 'community' | 'personal',
            status: (dbChallenge.isActive ? 'active' : dbChallenge.isCompleted ? 'completed' : 'failed') as 'active' | 'completed' | 'failed',
            participants: dbChallenge.participantsCount || 0,
            startDate: new Date(dbChallenge.startDate).toISOString().split('T')[0],
            endDate: dbChallenge.endDate ? new Date(dbChallenge.endDate).toISOString().split('T')[0] : '',
            progress: dbChallenge.progressPercentage,
            tags: dbChallenge.tagsArray,
            mbtiRelevance: dbChallenge.mbtiRelevanceArray,
            points: dbChallenge.totalPoints || 0,
            streak: dbChallenge.currentStreak,
            isBookmarked: false,
            isLiked: false,
            likes: dbChallenge.likesCount || 0,
            author: dbChallenge.author || 'User',
            authorAvatar: dbChallenge.authorAvatar || '👤',
            estimatedTime: dbChallenge.estimatedTime || 30,
            completionRate: dbChallenge.completionRate,
            isJoined: true,
            milestones: milestones.map((m: any) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              targetValue: m.targetValue,
              currentValue: m.currentValue,
              isCompleted: m.isCompleted,
              reward: m.rewardPoints ? `${m.rewardPoints} punten` : 'Geen beloning'
            })),
            rewards: rewards.map((r: any) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              icon: r.icon,
              points: r.points,
              isUnlocked: r.isUnlocked
            }))
          };
        }));
        
        setChallenges(uiChallenges);
        
        // Load user stats
        const stats = await challengesService.getUserStats(userId);
        if (stats) {
          setUserStats({
            totalChallenges: stats.totalChallenges,
            completedChallenges: stats.completedChallenges,
            currentStreak: stats.currentStreak,
            totalPoints: stats.totalPoints,
            level: stats.currentLevel,
            achievements: []
          });
        }
        
        // Load AI recommendations
        if (userData?.mbtiType) {
          const recommendations = await challengesService.getAIRecommendations(
            userId, 
            userData.mbtiType, 
            selectedCategory !== 'all' ? selectedCategory : undefined
          );
          setAiRecommendations(recommendations);
        }
        
      } catch (error) {
        console.error('Error loading challenges:', error);
        // Fallback to mock data if database fails
        setChallenges(mockChallenges);
      } finally {
        setLoading(false);
      }
    };

    initializeChallenges();

    // Check for navigation state
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, selectedCategory, activeTab, userData]);

  const handleCreateChallenge = async () => {
    if (
      newChallenge.title &&
      newChallenge.description &&
      newChallenge.category
    ) {
      try {
        const userId = userData?.id || 'default-user';
        
        const challengeData: CreateChallengeData = {
          title: newChallenge.title!,
          description: newChallenge.description!,
          category: newChallenge.category!,
          difficulty: newChallenge.difficulty as 'easy' | 'medium' | 'hard',
          type: 'personal',
          tags: newChallenge.tags || [],
          mbtiRelevance: newChallenge.mbtiRelevance || [],
          estimatedTime: newChallenge.estimatedTime || 30,
          xpReward: newChallenge.points || 100,
          journalingIntegration: newChallenge.tags?.includes('journaling') || false,
          planningIntegration: newChallenge.tags?.includes('planning') || false,
          wellnessIntegration: newChallenge.tags?.includes('wellness') || false
        };

        const createdChallenge = await challengesService.createChallenge(challengeData, userId);
        
        // Convert to UI format and add to state
        const uiChallenge: Challenge = {
          id: createdChallenge.id,
          title: createdChallenge.title,
          description: createdChallenge.description,
          category: createdChallenge.category,
          difficulty: createdChallenge.difficultyLevel,
          type: 'personal',
          status: 'active',
          participants: 1,
          startDate: new Date(createdChallenge.startDate).toISOString().split('T')[0],
          endDate: createdChallenge.endDate ? new Date(createdChallenge.endDate).toISOString().split('T')[0] : '',
          progress: 0,
          tags: createdChallenge.tagsArray,
          mbtiRelevance: createdChallenge.mbtiRelevanceArray,
          points: createdChallenge.totalPoints || 0,
          streak: 0,
          isBookmarked: false,
          isLiked: false,
          likes: 0,
          author: userName,
          authorAvatar: '👤',
          estimatedTime: createdChallenge.estimatedTime || 30,
          completionRate: 0,
          isJoined: true,
          milestones: [],
          rewards: []
        };

        setChallenges(prev => [...prev, uiChallenge]);
        setIsCreateModalOpen(false);
        setNewChallenge({
          title: '',
          description: '',
          category: '',
          difficulty: 'medium',
          type: 'personal',
          tags: [],
        });

        // Update user stats
        await challengesService.updateUserStats(userId);
        
        console.log('Challenge created successfully:', createdChallenge.id);
      } catch (error) {
        console.error('Error creating challenge:', error);
        // Show error message to user
        alert('Er is een fout opgetreden bij het aanmaken van de challenge. Probeer het opnieuw.');
      }
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const userId = userData?.id || 'default-user';
      await challengesService.joinChallenge(challengeId, userId);
      
      // Update local state
      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, participants: (challenge.participants || 0) + 1, isJoined: true }
            : challenge
        )
      );
      
      console.log('Joined challenge successfully:', challengeId);
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Er is een fout opgetreden bij het deelnemen aan de challenge. Probeer het opnieuw.');
    }
  };

  const handleUpdateProgress = async (challengeId: string, newProgress: number) => {
    try {
      const userId = userData?.id || 'default-user';
      await challengesService.updateChallengeProgress(challengeId, newProgress, userId);
      
      // Update local state
      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, progress: Math.min(100, Math.max(0, newProgress)) }
            : challenge
        )
      );
      
      console.log('Challenge progress updated:', challengeId, newProgress);
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      alert('Er is een fout opgetreden bij het bijwerken van de voortgang. Probeer het opnieuw.');
    }
  };

  // Navigatie naar bestaande functionaliteiten
  const handleGoToJournaling = () => {
    navigate('/journaling');
  };

  const handleGoToPlanning = () => {
    navigate('/journaling'); // JournalingPage heeft ook planning features
  };

  const handleChallengeAction = (challenge: Challenge, action: string) => {
    if (action === 'journaling' && challenge.tags.includes('journaling')) {
      handleGoToJournaling();
    } else if (action === 'planning' && challenge.tags.includes('planning')) {
      handleGoToPlanning();
    } else if (action === 'join') {
      handleJoinChallenge(challenge.id);
    } else if (action === 'complete') {
      handleUpdateProgress(challenge.id, 100);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const categoryMatch =
      selectedCategory === 'all' || challenge.category === selectedCategory;
    const typeMatch =
      activeTab === 'community'
        ? challenge.type === 'community'
        : challenge.type === 'personal';
    return categoryMatch && typeMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'failed':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0d1b2a] via-[#1b263b] to-[#0d1b2a] text-[#e0e0e0]'>
      {/* Header */}
      <header className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border-b border-[rgba(100,223,223,0.2)] p-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-[rgba(100,223,223,0.2)] backdrop-blur-xl border border-[rgba(100,223,223,0.3)] rounded-xl flex items-center justify-center'>
              <Target size={24} className='text-[#64dfdf]' />
            </div>
            <div>
              <h1 className='text-xl font-bold text-white'>
                🎯 Advanced Challenges
              </h1>
              <p className='text-sm text-[#e0e0e0]/70'>
                Community & Persoonlijke Uitdagingen
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              color='primary'
              variant='bordered'
              startContent={<Plus className='w-4 h-4' />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Nieuwe Challenge
            </Button>
            <Button
              color='secondary'
              variant='bordered'
              onClick={() => navigate('/')}
            >
              Terug naar Hoofdmenu
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className='max-w-7xl mx-auto p-6'>
        {/* Category Filter */}
        <div className='mb-6'>
          <div className='flex flex-wrap gap-2'>
            <Button
              color={selectedCategory === 'all' ? 'primary' : 'default'}
              variant={selectedCategory === 'all' ? 'solid' : 'bordered'}
              size='sm'
              onClick={() => setSelectedCategory('all')}
            >
              Alle Gebieden
            </Button>
            {lifeAreas.map(area => (
              <Button
                key={area.id}
                color={selectedCategory === area.id ? 'primary' : 'default'}
                variant={selectedCategory === area.id ? 'solid' : 'bordered'}
                size='sm'
                onClick={() => setSelectedCategory(area.id)}
              >
                {area.icon} {area.name}
              </Button>
            ))}
          </div>
        </div>

        {/* AI Recommendations Section */}
        {aiRecommendations.length > 0 && (
          <div className='mb-6'>
            <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center'>
                    🤖
                  </div>
                  <div>
                    <h3 className='text-lg font-bold text-white'>AI Aanbevelingen</h3>
                    <p className='text-sm text-[#e0e0e0]/70'>
                      Gepersonaliseerde challenges op basis van je MBTI type
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {aiRecommendations.slice(0, 4).map((rec, index) => (
                    <Card key={index} className='bg-[rgba(27,38,59,0.3)] border border-[rgba(100,223,223,0.1)]'>
                      <CardBody className='p-4'>
                        <div className='flex items-start justify-between mb-2'>
                          <h4 className='font-semibold text-white text-sm'>{rec.title}</h4>
                          <Chip size='sm' color='primary' variant='flat'>
                            {Math.round(rec.confidence * 100)}%
                          </Chip>
                        </div>
                        <p className='text-xs text-[#e0e0e0]/70 mb-3'>{rec.description}</p>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <span className='text-xs text-[#e0e0e0]/50'>Success Rate:</span>
                            <span className='text-xs text-green-400'>{Math.round(rec.estimatedSuccessRate * 100)}%</span>
                          </div>
                          <Button size='sm' color='primary' variant='bordered'>
                            Starten
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={key => setActiveTab(key as string)}
          className='mb-6'
          color='primary'
          variant='bordered'
        >
          <Tab
            key='community'
            title={
              <div className='flex items-center gap-2'>
                <Users className='w-4 h-4' />
                Community Challenges
              </div>
            }
          >
            <div className='space-y-4'>
              {loading ? (
                <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'>
                  <CardBody className='text-center py-12'>
                    <div className='animate-spin w-8 h-8 border-2 border-[#64dfdf] border-t-transparent rounded-full mx-auto mb-4'></div>
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Challenges laden...
                    </h3>
                    <p className='text-[#e0e0e0]/70'>
                      Even geduld, we laden je challenges op.
                    </p>
                  </CardBody>
                </Card>
              ) : filteredChallenges.length === 0 ? (
                <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'>
                  <CardBody className='text-center py-12'>
                    <Users className='w-16 h-16 text-[#64dfdf]/50 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Geen Community Challenges
                    </h3>
                    <p className='text-[#e0e0e0]/70'>
                      Er zijn momenteel geen community challenges beschikbaar
                      voor dit levensgebied.
                    </p>
                  </CardBody>
                </Card>
              ) : (
                filteredChallenges.map(challenge => (
                  <Card
                    key={challenge.id}
                    className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'
                  >
                    <CardHeader className='pb-2'>
                      <div className='flex items-start justify-between w-full'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl'>
                            🎯
                          </div>
                          <div>
                            <h3 className='font-bold text-lg text-white'>
                              {challenge.title}
                            </h3>
                            <p className='text-sm text-[#e0e0e0]/70'>
                              {challenge.description}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Chip
                            color={getDifficultyColor(challenge.difficulty)}
                            variant='flat'
                            size='sm'
                          >
                            {challenge.difficulty === 'easy'
                              ? 'Makkelijk'
                              : challenge.difficulty === 'medium'
                                ? 'Gemiddeld'
                                : 'Moeilijk'}
                          </Chip>
                          <Chip
                            color={getStatusColor(challenge.status)}
                            variant='flat'
                            size='sm'
                            startContent={getStatusIcon(challenge.status)}
                          >
                            {challenge.status === 'active'
                              ? 'Actief'
                              : challenge.status === 'completed'
                                ? 'Voltooid'
                                : 'Mislukt'}
                          </Chip>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className='pt-0'>
                      {/* Progress */}
                      <div className='mb-4'>
                        <div className='flex justify-between text-sm text-[#e0e0e0]/70 mb-1'>
                          <span>Voortgang</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className='w-full bg-[rgba(100,223,223,0.1)] rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-[#64dfdf] to-[#64dfdf]/70 h-2 rounded-full transition-all duration-300'
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Challenge Details */}
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm'>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Users className='w-4 h-4' />
                          <span>{challenge.participants} deelnemers</span>
                        </div>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Calendar className='w-4 h-4' />
                          <span>{challenge.startDate}</span>
                        </div>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Target className='w-4 h-4' />
                          <span>{challenge.endDate}</span>
                        </div>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Flame className='w-4 h-4' />
                          <span>{challenge.tags.join(', ')}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex items-center gap-3 flex-wrap'>
                        {/* Journaling Challenge Action */}
                        {challenge.tags.includes('journaling') && (
                          <Button
                            color='success'
                            size='sm'
                            variant='bordered'
                            startContent={<BookOpen className='w-4 h-4' />}
                            onClick={() => handleChallengeAction(challenge, 'journaling')}
                          >
                            Start Journaling
                          </Button>
                        )}
                        
                        {/* Planning Challenge Action */}
                        {challenge.tags.includes('planning') && (
                          <Button
                            color='warning'
                            size='sm'
                            variant='bordered'
                            startContent={<Calendar className='w-4 h-4' />}
                            onClick={() => handleChallengeAction(challenge, 'planning')}
                          >
                            Open Planning
                          </Button>
                        )}
                        
                        {/* Standard Actions */}
                        <Button
                          color='primary'
                          size='sm'
                          onClick={() => handleJoinChallenge(challenge.id)}
                          disabled={challenge.status !== 'active'}
                        >
                          Deelnemen
                        </Button>
                        <Button
                          color='secondary'
                          size='sm'
                          variant='bordered'
                          onClick={() =>
                            handleUpdateProgress(
                              challenge.id,
                              challenge.progress + 10
                            )
                          }
                          disabled={challenge.status !== 'active'}
                        >
                          Voortgang Bijwerken
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>

          <Tab
            key='personal'
            title={
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4' />
                Persoonlijke Challenges
              </div>
            }
          >
            <div className='space-y-4'>
              {filteredChallenges.length === 0 ? (
                <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'>
                  <CardBody className='text-center py-12'>
                    <Target className='w-16 h-16 text-[#64dfdf]/50 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-white mb-2'>
                      Geen Persoonlijke Challenges
                    </h3>
                    <p className='text-[#e0e0e0]/70'>
                      Maak je eerste persoonlijke challenge aan om te beginnen!
                    </p>
                    <Button
                      color='primary'
                      className='mt-4'
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      Eerste Challenge Aanmaken
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                filteredChallenges.map(challenge => (
                  <Card
                    key={challenge.id}
                    className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'
                  >
                    <CardHeader className='pb-2'>
                      <div className='flex items-start justify-between w-full'>
                        <div className='flex items-center gap-3'>
                          <div className='w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xl'>
                            🎯
                          </div>
                          <div>
                            <h3 className='font-bold text-lg text-white'>
                              {challenge.title}
                            </h3>
                            <p className='text-sm text-[#e0e0e0]/70'>
                              {challenge.description}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Chip
                            color={getDifficultyColor(challenge.difficulty)}
                            variant='flat'
                            size='sm'
                          >
                            {challenge.difficulty === 'easy'
                              ? 'Makkelijk'
                              : challenge.difficulty === 'medium'
                                ? 'Gemiddeld'
                                : 'Moeilijk'}
                          </Chip>
                          <Chip
                            color={getStatusColor(challenge.status)}
                            variant='flat'
                            size='sm'
                            startContent={getStatusIcon(challenge.status)}
                          >
                            {challenge.status === 'active'
                              ? 'Actief'
                              : challenge.status === 'completed'
                                ? 'Voltooid'
                                : 'Mislukt'}
                          </Chip>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className='pt-0'>
                      {/* Progress */}
                      <div className='mb-4'>
                        <div className='flex justify-between text-sm text-[#e0e0e0]/70 mb-1'>
                          <span>Voortgang</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className='w-full bg-[rgba(100,223,223,0.1)] rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-[#64dfdf] to-[#64dfdf]/70 h-2 rounded-full transition-all duration-300'
                            style={{ width: `${challenge.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Challenge Details */}
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm'>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Calendar className='w-4 h-4' />
                          <span>{challenge.startDate}</span>
                        </div>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Target className='w-4 h-4' />
                          <span>{challenge.endDate}</span>
                        </div>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <Flame className='w-4 h-4' />
                          <span>{challenge.tags.join(', ')}</span>
                        </div>
                        <div className='flex items-center gap-2 text-[#e0e0e0]/70'>
                          <TrendingUp className='w-4 h-4' />
                          <span>Persoonlijk</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className='flex items-center gap-3'>
                        {/* Journaling Challenge Action */}
                        {challenge.tags.includes('journaling') && (
                          <Button
                            color='success'
                            size='sm'
                            variant='bordered'
                            startContent={<BookOpen className='w-4 h-4' />}
                            onClick={() => handleChallengeAction(challenge, 'journaling')}
                          >
                            Start Journaling
                          </Button>
                        )}
                        
                        {/* Planning Challenge Action */}
                        {challenge.tags.includes('planning') && (
                          <Button
                            color='warning'
                            size='sm'
                            variant='bordered'
                            startContent={<Calendar className='w-4 h-4' />}
                            onClick={() => handleChallengeAction(challenge, 'planning')}
                          >
                            Open Planning
                          </Button>
                        )}
                        
                        <Button
                          color='primary'
                          size='sm'
                          onClick={() =>
                            handleUpdateProgress(
                              challenge.id,
                              challenge.progress + 10
                            )
                          }
                          disabled={challenge.status !== 'active'}
                        >
                          Voortgang Bijwerken
                        </Button>
                        <Button
                          color='secondary'
                          size='sm'
                          variant='bordered'
                          startContent={<Edit className='w-4 h-4' />}
                        >
                          Bewerken
                        </Button>
                        <Button
                          color='danger'
                          size='sm'
                          variant='bordered'
                          startContent={<Trash2 className='w-4 h-4' />}
                        >
                          Verwijderen
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </Tab>
        </Tabs>
      </div>

      {/* Create Challenge Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        size='2xl'
        backdrop='blur'
      >
        <ModalContent className='bg-[rgba(27,38,59,0.95)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'>
          <ModalHeader className='text-white'>
            Nieuwe Persoonlijke Challenge
          </ModalHeader>
          <ModalBody>
            <div className='space-y-4'>
              <Input
                label='Titel'
                placeholder='Geef je challenge een naam'
                value={newChallenge.title}
                onChange={e =>
                  setNewChallenge(prev => ({ ...prev, title: e.target.value }))
                }
                className='text-white'
              />

              <Textarea
                label='Beschrijving'
                placeholder='Beschrijf wat je wilt bereiken'
                value={newChallenge.description}
                onChange={e =>
                  setNewChallenge(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className='text-white'
              />

              <Select
                label='Levensgebied'
                placeholder='Selecteer een levensgebied'
                value={newChallenge.category}
                onChange={e =>
                  setNewChallenge(prev => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className='text-white'
              >
                {lifeAreas.map(area => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.icon} {area.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label='Moeilijkheidsgraad'
                placeholder='Selecteer moeilijkheidsgraad'
                value={newChallenge.difficulty}
                onChange={e =>
                  setNewChallenge(prev => ({
                    ...prev,
                    difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                  }))
                }
                className='text-white'
              >
                <SelectItem key='easy' value='easy'>
                  Makkelijk
                </SelectItem>
                <SelectItem key='medium' value='medium'>
                  Gemiddeld
                </SelectItem>
                <SelectItem key='hard' value='hard'>
                  Moeilijk
                </SelectItem>
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color='danger'
              variant='light'
              onPress={() => setIsCreateModalOpen(false)}
            >
              Annuleren
            </Button>
            <Button color='primary' onPress={handleCreateChallenge}>
              Challenge Aanmaken
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChallengesPage;

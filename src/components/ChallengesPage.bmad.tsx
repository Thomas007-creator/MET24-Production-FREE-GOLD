/**
 * Challenges Page - BMAD Refactored
 * 
 * React component voor challenges management
 * Refactored using BMAD composition patterns to eliminate monolithic structure
 * 
 * @version 14.1.0
 * @author BMAD Team - Mary (Master) | Jordan (Architecture) | Riley (Implementation)
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
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

// ================================================
// BMAD Types
// ================================================

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
  estimatedTime: number;
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

interface ChallengesContextType {
  challenges: Challenge[];
  selectedCategory: string;
  activeTab: string;
  userStats: UserStats;
  loading: boolean;
  aiRecommendations: any[];
  newChallenge: Partial<Challenge>;
  setSelectedCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;
  setNewChallenge: (challenge: Partial<Challenge>) => void;
  handleCreateChallenge: () => Promise<void>;
  handleJoinChallenge: (challengeId: string) => Promise<void>;
  handleLeaveChallenge: (challengeId: string) => Promise<void>;
  handleToggleBookmark: (challengeId: string) => void;
  handleToggleLike: (challengeId: string) => void;
}

// ================================================
// BMAD Challenges Context & Provider
// ================================================

const ChallengesContext = createContext<ChallengesContextType | null>(null);

interface ChallengesProviderProps {
  children: React.ReactNode;
}

const ChallengesProvider: React.FC<ChallengesProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData } = useAppStore();
  const challengesService = ChallengesService.getInstance();

  // State management
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('community');
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

  // Life areas data
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

  // Mock challenges data
  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: '30 Dagen Journaling Challenge',
      description: 'Dagelijks journaling met MBTI-specifieke prompts voor persoonlijke groei en zelfreflectie',
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
      milestones: [],
      rewards: []
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
      milestones: [],
      rewards: []
    }
  ];

  // Initialize challenges
  useEffect(() => {
    const initializeChallenges = async () => {
      try {
        setLoading(true);
        
        const userId = userData?.id || 'default-user';
        
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
        setChallenges(mockChallenges);
      } finally {
        setLoading(false);
      }
    };

    initializeChallenges();

    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, selectedCategory, activeTab, userData]);

  // Challenge actions
  const handleCreateChallenge = async () => {
    if (newChallenge.title && newChallenge.description && newChallenge.category) {
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
        setNewChallenge({
          title: '',
          description: '',
          category: '',
          difficulty: 'medium',
          type: 'personal',
          tags: [],
        });

        await challengesService.updateUserStats(userId);
        console.log('Challenge created successfully:', createdChallenge.id);
      } catch (error) {
        console.error('Error creating challenge:', error);
        alert('Er is een fout opgetreden bij het aanmaken van de challenge. Probeer het opnieuw.');
      }
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const userId = userData?.id || 'default-user';
      await challengesService.joinChallenge(challengeId, userId);
      
      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, participants: (challenge.participants || 0) + 1, isJoined: true }
            : challenge
        )
      );
      
      await challengesService.updateUserStats(userId);
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const handleLeaveChallenge = async (challengeId: string) => {
    try {
      const userId = userData?.id || 'default-user';
      await challengesService.leaveChallenge(challengeId, userId);
      
      setChallenges(prev =>
        prev.map(challenge =>
          challenge.id === challengeId
            ? { ...challenge, participants: Math.max(0, (challenge.participants || 0) - 1), isJoined: false }
            : challenge
        )
      );
      
      await challengesService.updateUserStats(userId);
    } catch (error) {
      console.error('Error leaving challenge:', error);
    }
  };

  const handleToggleBookmark = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, isBookmarked: !challenge.isBookmarked }
          : challenge
      )
    );
  };

  const handleToggleLike = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(challenge =>
        challenge.id === challengeId
          ? { 
              ...challenge, 
              isLiked: !challenge.isLiked,
              likes: challenge.isLiked ? challenge.likes - 1 : challenge.likes + 1
            }
          : challenge
      )
    );
  };

  const contextValue: ChallengesContextType = {
    challenges,
    selectedCategory,
    activeTab,
    userStats,
    loading,
    aiRecommendations,
    newChallenge,
    setSelectedCategory,
    setActiveTab,
    setNewChallenge,
    handleCreateChallenge,
    handleJoinChallenge,
    handleLeaveChallenge,
    handleToggleBookmark,
    handleToggleLike
  };

  return (
    <ChallengesContext.Provider value={contextValue}>
      {children}
    </ChallengesContext.Provider>
  );
};

// ================================================
// BMAD Challenges Hook
// ================================================

const useChallenges = (): ChallengesContextType => {
  const context = useContext(ChallengesContext);
  if (!context) {
    throw new Error('useChallenges must be used within ChallengesProvider');
  }
  return context;
};

// ================================================
// BMAD Challenge Card Component
// ================================================

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: () => void;
  onLeave: () => void;
  onBookmark: () => void;
  onLike: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onJoin, 
  onLeave, 
  onBookmark, 
  onLike 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{challenge.title}</h3>
          <p className="text-sm text-gray-600">{challenge.description}</p>
        </div>
        <div className="flex gap-2">
          <Chip color={getDifficultyColor(challenge.difficulty)} size="sm">
            {challenge.difficulty}
          </Chip>
          <Chip color={getStatusColor(challenge.status)} size="sm">
            {challenge.status}
          </Chip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">{challenge.participants || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span className="text-sm">{challenge.points} punten</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{challenge.estimatedTime} min</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={onBookmark}
              startContent={challenge.isBookmarked ? '🔖' : '📖'}
            >
              {challenge.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button
              size="sm"
              variant="flat"
              onPress={onLike}
              startContent={challenge.isLiked ? '❤️' : '🤍'}
            >
              {challenge.likes}
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {challenge.isJoined ? (
              <Button
                size="sm"
                color="danger"
                variant="flat"
                onPress={onLeave}
                startContent={<Trash2 className="w-4 h-4" />}
              >
                Leave
              </Button>
            ) : (
              <Button
                size="sm"
                color="primary"
                onPress={onJoin}
                startContent={<Plus className="w-4 h-4" />}
              >
                Join
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {challenge.progress}% complete
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

// ================================================
// BMAD Challenge List Component
// ================================================

const ChallengeList: React.FC = () => {
  const { challenges, handleJoinChallenge, handleLeaveChallenge, handleToggleBookmark, handleToggleLike } = useChallenges();

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No challenges found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <ChallengeCard
          key={challenge.id}
          challenge={challenge}
          onJoin={() => handleJoinChallenge(challenge.id)}
          onLeave={() => handleLeaveChallenge(challenge.id)}
          onBookmark={() => handleToggleBookmark(challenge.id)}
          onLike={() => handleToggleLike(challenge.id)}
        />
      ))}
    </div>
  );
};

// ================================================
// BMAD Challenge Filters Component
// ================================================

const ChallengeFilters: React.FC = () => {
  const { selectedCategory, setSelectedCategory, activeTab, setActiveTab } = useChallenges();

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'psychischeGezondheid', label: 'Psychische Gezondheid' },
    { key: 'lichamelijkeGezondheid', label: 'Lichamelijke Gezondheid' },
    { key: 'financieen', label: 'Financiën' },
    { key: 'werkSamenleving', label: 'Werk & Samenleving' },
    { key: 'hobbyPassies', label: "Hobby's & Passies" },
    { key: 'actieveImaginatie', label: 'Actieve Imaginatie' },
    { key: 'professioneleOntwikkeling', label: 'Professionele Ontwikkeling' },
    { key: 'socialeRelaties', label: 'Sociale Relaties' },
    { key: 'thuisOmgeving', label: 'Thuis & Omgeving' },
  ];

  return (
    <div className="mb-6">
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        className="mb-4"
      >
        <Tab key="community" title="Community" />
        <Tab key="personal" title="Personal" />
      </Tabs>
      
      <Select
        label="Category"
        selectedKeys={[selectedCategory]}
        onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
        className="max-w-xs"
      >
        {categories.map((category) => (
          <SelectItem key={category.key} value={category.key}>
            {category.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

// ================================================
// BMAD Challenge Create Modal Component
// ================================================

interface ChallengeCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeCreateModal: React.FC<ChallengeCreateModalProps> = ({ isOpen, onClose }) => {
  const { newChallenge, setNewChallenge, handleCreateChallenge } = useChallenges();

  const categories = [
    { key: 'psychischeGezondheid', label: 'Psychische Gezondheid' },
    { key: 'lichamelijkeGezondheid', label: 'Lichamelijke Gezondheid' },
    { key: 'financieen', label: 'Financiën' },
    { key: 'werkSamenleving', label: 'Werk & Samenleving' },
    { key: 'hobbyPassies', label: "Hobby's & Passies" },
    { key: 'actieveImaginatie', label: 'Actieve Imaginatie' },
    { key: 'professioneleOntwikkeling', label: 'Professionele Ontwikkeling' },
    { key: 'socialeRelaties', label: 'Sociale Relaties' },
    { key: 'thuisOmgeving', label: 'Thuis & Omgeving' },
  ];

  const difficulties = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ];

  const handleSubmit = async () => {
    await handleCreateChallenge();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Create New Challenge</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <Input
                  label="Title"
                  value={newChallenge.title || ''}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  placeholder="Enter challenge title"
                />
                
                <Textarea
                  label="Description"
                  value={newChallenge.description || ''}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  placeholder="Enter challenge description"
                  rows={3}
                />
                
                <Select
                  label="Category"
                  selectedKeys={newChallenge.category ? [newChallenge.category] : []}
                  onSelectionChange={(keys) => setNewChallenge({ ...newChallenge, category: Array.from(keys)[0] as string })}
                >
                  {categories.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <Select
                  label="Difficulty"
                  selectedKeys={newChallenge.difficulty ? [newChallenge.difficulty] : []}
                  onSelectionChange={(keys) => setNewChallenge({ ...newChallenge, difficulty: Array.from(keys)[0] as 'easy' | 'medium' | 'hard' })}
                >
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty.key} value={difficulty.key}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </Select>
                
                <Input
                  label="Points"
                  type="number"
                  value={newChallenge.points?.toString() || ''}
                  onChange={(e) => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value) || 0 })}
                  placeholder="Enter points reward"
                />
                
                <Input
                  label="Estimated Time (minutes)"
                  type="number"
                  value={newChallenge.estimatedTime?.toString() || ''}
                  onChange={(e) => setNewChallenge({ ...newChallenge, estimatedTime: parseInt(e.target.value) || 0 })}
                  placeholder="Enter estimated time"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Create Challenge
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

// ================================================
// BMAD Challenge Stats Component
// ================================================

const ChallengeStats: React.FC = () => {
  const { userStats } = useChallenges();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardBody className="text-center">
          <div className="text-2xl font-bold text-blue-600">{userStats.totalChallenges}</div>
          <div className="text-sm text-gray-600">Total Challenges</div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="text-center">
          <div className="text-2xl font-bold text-green-600">{userStats.completedChallenges}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="text-center">
          <div className="text-2xl font-bold text-orange-600">{userStats.currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="text-center">
          <div className="text-2xl font-bold text-purple-600">{userStats.totalPoints}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </CardBody>
      </Card>
    </div>
  );
};

// ================================================
// BMAD Main Challenges Page Component
// ================================================

const ChallengesPageContent: React.FC = () => {
  const { loading } = useChallenges();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <Button
          color="primary"
          onPress={() => setIsCreateModalOpen(true)}
          startContent={<Plus className="w-4 h-4" />}
        >
          Create Challenge
        </Button>
      </div>

      <ChallengeStats />
      <ChallengeFilters />
      <ChallengeList />
      
      <ChallengeCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

// ================================================
// BMAD Main Challenges Page Component with Provider
// ================================================

const ChallengesPage: React.FC = () => {
  return (
    <ChallengesProvider>
      <ChallengesPageContent />
    </ChallengesProvider>
  );
};

// ================================================
// BMAD Compound Components Export
// ================================================

export const ChallengesComponents = {
  Provider: ChallengesProvider,
  Page: ChallengesPage,
  List: ChallengeList,
  Card: ChallengeCard,
  Filters: ChallengeFilters,
  CreateModal: ChallengeCreateModal,
  Stats: ChallengeStats,
  useChallenges
};

export default ChallengesPage;

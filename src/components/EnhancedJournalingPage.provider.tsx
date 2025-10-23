import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { EnhancedJournalingService, EnhancedJournalEntry, DailyGoal, MoodTracking, PlanningSession, JournalingAnalytics } from '../services/enhancedJournalingService';
import { logger } from '../utils/logger';

interface JournalingFormData {
  title: string;
  content: string;
  gratitudeContent: string;
  moodRating: number;
  moodEmoji: string;
  moodDescription: string;
  tomorrowFocus: string;
  weeklyGoals: string[];
  tags: string[];
  primaryTag: string;
  category: string;
  levensgebied: string;
}

interface GoalFormData {
  goalText: string;
  goalEmoji: string;
  goalCategory: string;
  priority: number;
  estimatedDuration: number;
}

interface EnhancedJournalingContextType {
  // State
  currentView: 'journaling' | 'planning' | 'analytics';
  journalEntries: EnhancedJournalEntry[];
  dailyGoals: DailyGoal[];
  moodTracking: MoodTracking[];
  analytics: JournalingAnalytics | null;
  isLoading: boolean;

  // Form data
  newEntry: JournalingFormData;
  newGoal: GoalFormData;

  // Modal states
  isEntryModalOpen: boolean;
  isGoalModalOpen: boolean;
  setIsEntryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGoalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Constants
  moodEmojis: Array<{ emoji: string; rating: number; label: string }>;
  goalEmojis: Array<{ emoji: string; category: string; label: string }>;
  availableTags: string[];
  categories: Array<{ key: string; label: string }>;
  levensgebieden: Array<{ key: string; label: string }>;

  // Actions
  setCurrentView: (view: 'journaling' | 'planning' | 'analytics') => void;
  setNewEntry: React.Dispatch<React.SetStateAction<JournalingFormData>>;
  setNewGoal: React.Dispatch<React.SetStateAction<GoalFormData>>;
  onEntryModalOpen: () => void;
  onEntryModalClose: () => void;
  onGoalModalOpen: () => void;
  onGoalModalClose: () => void;

  // Business logic
  handleCreateEntry: () => Promise<void>;
  handleCreateGoal: () => Promise<void>;
  handleCompleteGoal: (goalId: string) => Promise<void>;
  handleGoalToggle: (goalId: string) => Promise<void>;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addWeeklyGoal: () => void;
  removeWeeklyGoal: (index: number) => void;
  getMoodTrendIcon: (trend: string) => React.ReactElement;
  getCompletionRateColor: (rate: number) => string;
}

const EnhancedJournalingContext = createContext<EnhancedJournalingContextType | undefined>(undefined);

export const useEnhancedJournaling = () => {
  const context = useContext(EnhancedJournalingContext);
  if (!context) {
    throw new Error('useEnhancedJournaling must be used within an EnhancedJournalingProvider');
  }
  return context;
};

export const EnhancedJournalingProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { userData } = useAppStore();

  // State management
  const [currentView, setCurrentView] = useState<'journaling' | 'planning' | 'analytics'>('journaling');
  const [journalEntries, setJournalEntries] = useState<EnhancedJournalEntry[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [moodTracking, setMoodTracking] = useState<MoodTracking[]>([]);
  const [analytics, setAnalytics] = useState<JournalingAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [newEntry, setNewEntry] = useState<JournalingFormData>({
    title: '',
    content: '',
    gratitudeContent: '',
    moodRating: 5,
    moodEmoji: '😐',
    moodDescription: '',
    tomorrowFocus: '',
    weeklyGoals: [],
    tags: [],
    primaryTag: '',
    category: 'self-awareness',
    levensgebied: 'persoonlijke-groei'
  });

  const [newGoal, setNewGoal] = useState<GoalFormData>({
    goalText: '',
    goalEmoji: '🎯',
    goalCategory: 'persoonlijk',
    priority: 3,
    estimatedDuration: 30
  });

  // Modal states
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Constants
  const moodEmojis = [
    { emoji: '😢', rating: 1, label: 'Zeer slecht' },
    { emoji: '😕', rating: 2, label: 'Slecht' },
    { emoji: '😐', rating: 3, label: 'Neutraal' },
    { emoji: '🙂', rating: 4, label: 'Goed' },
    { emoji: '😊', rating: 5, label: 'Zeer goed' },
    { emoji: '🤩', rating: 6, label: 'Fantastisch' }
  ];

  const goalEmojis = [
    { emoji: '🏃‍♂️', category: 'bewegen', label: 'Bewegen' },
    { emoji: '📚', category: 'leren', label: 'Leren' },
    { emoji: '🧘‍♀️', category: 'meditatie', label: 'Meditatie' },
    { emoji: '💼', category: 'werk', label: 'Werk' },
    { emoji: '👥', category: 'sociaal', label: 'Sociaal' },
    { emoji: '🎯', category: 'persoonlijk', label: 'Persoonlijk' }
  ];

  const availableTags = [
    'gratitude', 'reflection', 'growth', 'challenge', 'success',
    'relationship', 'work', 'health', 'creativity', 'learning',
    'mindfulness', 'goals', 'emotions', 'insights', 'planning'
  ];

  const categories = [
    { key: 'self-awareness', label: 'Zelfbewustzijn' },
    { key: 'relationships', label: 'Relaties' },
    { key: 'growth', label: 'Persoonlijke Groei' },
    { key: 'creativity', label: 'Creativiteit' },
    { key: 'values', label: 'Waarden & Doelen' },
    { key: 'challenges', label: 'Uitdagingen' },
    { key: 'gratitude', label: 'Dankbaarheid' }
  ];

  const levensgebieden = [
    { key: 'persoonlijke-groei', label: 'Persoonlijke Groei' },
    { key: 'relaties', label: 'Relaties' },
    { key: 'werk-carriere', label: 'Werk & Carrière' },
    { key: 'gezondheid', label: 'Gezondheid' },
    { key: 'financien', label: 'Financiën' },
    { key: 'spiritualiteit', label: 'Spiritualiteit' },
    { key: 'hobby-interesses', label: 'Hobby & Interesses' }
  ];

  // Load data
  const loadData = useCallback(async () => {
    if (!userData?.userId) return;

    setIsLoading(true);
    try {
      const service = EnhancedJournalingService.getInstance();

      // Load journal entries
      const entries = await service.getJournalEntries(userData.userId, 20);
      setJournalEntries(entries);

      // Load daily goals
      const goals = await service.getDailyGoals(userData.userId);
      setDailyGoals(goals);

      // Load mood tracking
      const moods = await service.getMoodTracking(userData.userId, 30);
      setMoodTracking(moods);

      // Load analytics
      const analyticsData = await service.getJournalingAnalytics(userData.userId, 'daily');
      setAnalytics(analyticsData);

      logger.info('✅ Enhanced journaling data loaded');
    } catch (error) {
      logger.error('❌ Failed to load enhanced journaling data:', { error });
    } finally {
      setIsLoading(false);
    }
  }, [userData?.userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Modal handlers
  const onEntryModalOpen = () => setIsEntryModalOpen(true);
  const onEntryModalClose = () => setIsEntryModalOpen(false);
  const onGoalModalOpen = () => setIsGoalModalOpen(true);
  const onGoalModalClose = () => setIsGoalModalOpen(false);

  // Create journal entry
  const handleCreateEntry = async () => {
    if (!userData?.userId || !newEntry.title || !newEntry.content) return;

    try {
      const service = EnhancedJournalingService.getInstance();

      const entry: EnhancedJournalEntry = {
        userId: userData.userId,
        title: newEntry.title,
        content: newEntry.content,
        gratitudeContent: newEntry.gratitudeContent,
        moodRating: newEntry.moodRating,
        moodEmoji: newEntry.moodEmoji,
        moodDescription: newEntry.moodDescription,
        tomorrowFocus: newEntry.tomorrowFocus,
        weeklyGoals: newEntry.weeklyGoals,
        tags: newEntry.tags,
        primaryTag: newEntry.primaryTag,
        category: newEntry.category,
        levensgebied: newEntry.levensgebied,
        mbtiType: userData.mbtiType,
        shareWithAi: true,
        date: Date.now(),
        createdBy: userData.userId
      };

      await service.createJournalEntry(entry);

      // Track mood if provided
      if (newEntry.moodRating && newEntry.moodEmoji) {
        await service.trackMood({
          userId: userData.userId,
          moodRating: newEntry.moodRating,
          moodEmoji: newEntry.moodEmoji,
          moodDescription: newEntry.moodDescription,
          context: 'journaling',
          timestamp: Date.now()
        });
      }

      // Reset form
      setNewEntry({
        title: '',
        content: '',
        gratitudeContent: '',
        moodRating: 5,
        moodEmoji: '😐',
        moodDescription: '',
        tomorrowFocus: '',
        weeklyGoals: [],
        tags: [],
        primaryTag: '',
        category: 'self-awareness',
        levensgebied: 'persoonlijke-groei'
      });

      onEntryModalClose();
      await loadData();

      logger.info('✅ Journal entry created successfully');
    } catch (error) {
      logger.error('❌ Failed to create journal entry:', { error });
    }
  };

  // Create daily goal
  const handleCreateGoal = async () => {
    if (!userData?.userId || !newGoal.goalText) return;

    try {
      const service = EnhancedJournalingService.getInstance();

      const goal: DailyGoal = {
        userId: userData.userId,
        goalText: newGoal.goalText,
        goalEmoji: newGoal.goalEmoji,
        goalCategory: newGoal.goalCategory,
        isCompleted: false,
        targetDate: Date.now(),
        priority: newGoal.priority,
        estimatedDuration: newGoal.estimatedDuration
      };

      await service.createDailyGoal(goal);

      // Reset form
      setNewGoal({
        goalText: '',
        goalEmoji: '🎯',
        goalCategory: 'persoonlijk',
        priority: 3,
        estimatedDuration: 30
      });

      onGoalModalClose();
      await loadData();

      logger.info('✅ Daily goal created successfully');
    } catch (error) {
      logger.error('❌ Failed to create daily goal:', { error });
    }
  };

  // Complete daily goal
  const handleCompleteGoal = async (goalId: string) => {
    try {
      const service = EnhancedJournalingService.getInstance();
      await service.completeDailyGoal(goalId, 'Voltooid via journaling interface');
      await loadData();
      logger.info('✅ Daily goal completed');
    } catch (error) {
      logger.error('❌ Failed to complete daily goal:', { error });
    }
  };

  const handleGoalToggle = async (goalId: string) => {
    try {
      const goal = dailyGoals.find(g => g.id === goalId);
      if (!goal) return;
      
      if ((goal as any).completed || goal.isCompleted) {
        // Reopen goal
        setDailyGoals(prev => prev.map(g => 
          g.id === goalId ? { ...g, isCompleted: false } : g
        ));
      } else {
        // Complete goal
        await handleCompleteGoal(goalId);
      }
    } catch (error) {
      logger.error('❌ Failed to toggle goal:', { error });
    }
  };

  const addTag = (tag: string) => {
    if (!newEntry.tags.includes(tag)) {
      setNewEntry((prev: JournalingFormData) => ({
        ...prev,
        tags: [...prev.tags, tag],
        primaryTag: prev.primaryTag || tag
      }));
    }
  };

  const removeTag = (tag: string) => {
    setNewEntry((prev: JournalingFormData) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag),
      primaryTag: prev.primaryTag === tag ? prev.tags.find((t: string) => t !== tag) || '' : prev.primaryTag
    }));
  };

  // Weekly goals management
  const addWeeklyGoal = () => {
    const goal = prompt('Voeg een wekelijkse doel toe:');
    if (goal && goal.trim()) {
      setNewEntry((prev: JournalingFormData) => ({
        ...prev,
        weeklyGoals: [...prev.weeklyGoals, goal.trim()]
      }));
    }
  };

  const removeWeeklyGoal = (index: number) => {
    setNewEntry((prev: JournalingFormData) => ({
      ...prev,
      weeklyGoals: prev.weeklyGoals.filter((_: string, i: number) => i !== index)
    }));
  };

  // Utility functions
  const getMoodTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  };

  const value: EnhancedJournalingContextType = {
    // State
    currentView,
    journalEntries,
    dailyGoals,
    moodTracking,
    analytics,
    isLoading,

    // Form data
    newEntry,
    newGoal,

    // Modal states
    isEntryModalOpen,
    isGoalModalOpen,
    setIsEntryModalOpen,
    setIsGoalModalOpen,

    // Constants
    moodEmojis,
    goalEmojis,
    availableTags,
    categories,
    levensgebieden,

    // Actions
    setCurrentView,
    setNewEntry,
    setNewGoal,
    onEntryModalOpen,
    onEntryModalClose,
    onGoalModalOpen,
    onGoalModalClose,

    // Business logic
    handleCreateEntry,
    handleCreateGoal,
    handleCompleteGoal,
    handleGoalToggle,
    addTag,
    removeTag,
    addWeeklyGoal,
    removeWeeklyGoal,
    getMoodTrendIcon,
    getCompletionRateColor,
  };

  return (
    <EnhancedJournalingContext.Provider value={value}>
      {children}
    </EnhancedJournalingContext.Provider>
  );
};
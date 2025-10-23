import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import discourseConnector from '../services/discourseConnector';

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  mbtiTypes: string[];
  category: 'discussion' | 'support' | 'learning' | 'creative' | 'professional';
  isJoined: boolean;
  lastActivity: string;
  trending: boolean;
  icon: string;
  color: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  author: {
    name: string;
    avatar: string;
    mbtiType: string;
  };
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  tags: string[];
  type: 'discussion' | 'question' | 'insight' | 'resource';
}

export interface TrendingTopic {
  topic: string;
  posts: number;
  trend: 'up' | 'down' | 'stable';
}

interface CommunitiesContextType {
  // State
  currentView: 'communities' | 'posts' | 'trending';
  selectedCommunity: Community | null;
  communities: Community[];
  posts: CommunityPost[];
  trendingTopics: TrendingTopic[];
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;

  // User data
  mbtiType: string;
  userName: string;

  // Actions
  setCurrentView: (view: 'communities' | 'posts' | 'trending') => void;
  setSelectedCommunity: (community: Community | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;

  // Community actions
  handleJoinCommunity: (communityId: string) => void;
  handleLikePost: (postId: string) => void;
  handleBookmarkPost: (postId: string) => void;

  // Discourse integration
  navigateToDiscourseChat: () => void;
  navigateToDiscourseCommunities: () => void;
  navigateToDiscourseChallenges: () => void;

  // Utility functions
  getCategoryColor: (category: string) => string;
  getTypeIcon: (type: string) => string;
}

const CommunitiesContext = createContext<CommunitiesContextType | undefined>(undefined);

export const useCommunities = () => {
  const context = useContext(CommunitiesContext);
  if (!context) {
    throw new Error('useCommunities must be used within a CommunitiesProvider');
  }
  return context;
};

export const CommunitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userData } = useAppStore();

  // State
  const [currentView, setCurrentView] = useState<'communities' | 'posts' | 'trending'>('communities');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // User data
  const mbtiType = userData?.mbtiType || 'INFP';
  const userName = userData?.name || 'Gebruiker';

  // Load communities data
  const loadCommunities = useCallback(async () => {
    try {
      setIsLoading(true);

      // In a real app, this would come from an API
      const mockCommunities: Community[] = [
        {
          id: '1',
          name: 'INFP Creatieve Expressie',
          description: 'Een veilige ruimte voor INFPs om hun creativiteit te delen en te ontwikkelen',
          memberCount: 1247,
          mbtiTypes: ['INFP', 'ENFP', 'ISFP'],
          category: 'creative',
          isJoined: true,
          lastActivity: '2 minuten geleden',
          trending: true,
          icon: '🎨',
          color: 'purple'
        },
        {
          id: '2',
          name: 'MBTI Persoonlijke Groei',
          description: 'Discussies over persoonlijke ontwikkeling en MBTI inzichten',
          memberCount: 3421,
          mbtiTypes: ['ALL'],
          category: 'learning',
          isJoined: true,
          lastActivity: '15 minuten geleden',
          trending: true,
          icon: '🌱',
          color: 'green'
        },
        {
          id: '3',
          name: 'Introverte Denkers',
          description: 'Voor introverte denkers om diepgaande gesprekken te voeren',
          memberCount: 892,
          mbtiTypes: ['INTJ', 'INTP', 'INFJ', 'INFP'],
          category: 'discussion',
          isJoined: false,
          lastActivity: '1 uur geleden',
          trending: false,
          icon: '🤔',
          color: 'blue'
        },
        {
          id: '4',
          name: 'Emotionele Intelligentie',
          description: 'Ontwikkel je emotionele vaardigheden en empathie',
          memberCount: 2156,
          mbtiTypes: ['ENFJ', 'INFJ', 'ENFP', 'INFP'],
          category: 'support',
          isJoined: false,
          lastActivity: '30 minuten geleden',
          trending: false,
          icon: '❤️',
          color: 'pink'
        },
        {
          id: '5',
          name: 'MBTI Professionals',
          description: 'Netwerken en carrière ontwikkeling voor MBTI professionals',
          memberCount: 1876,
          mbtiTypes: ['ALL'],
          category: 'professional',
          isJoined: true,
          lastActivity: '45 minuten geleden',
          trending: false,
          icon: '💼',
          color: 'indigo'
        }
      ];

      setCommunities(mockCommunities);

      // Load trending topics
      const mockTrending: TrendingTopic[] = [
        { topic: 'INFP Creativiteit', posts: 45, trend: 'up' },
        { topic: 'MBTI Relaties', posts: 32, trend: 'up' },
        { topic: 'Persoonlijke Groei', posts: 28, trend: 'up' },
        { topic: 'Emotionele Intelligentie', posts: 23, trend: 'up' },
        { topic: 'Introverte Kracht', posts: 19, trend: 'up' },
        { topic: 'MBTI Carrière', posts: 16, trend: 'up' }
      ];

      setTrendingTopics(mockTrending);

      logger.info('✅ Communities data loaded');
    } catch (error) {
      logger.error('❌ Failed to load communities data:', { error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load posts for selected community
  const loadPosts = useCallback(async (community: Community) => {
    try {
      setIsLoading(true);

      // In a real app, this would come from an API
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          communityId: community.id,
          author: {
            name: 'Sarah M.',
            avatar: '👩‍🎨',
            mbtiType: 'INFP'
          },
          title: 'Mijn creatieve proces als INFP',
          content: 'Ik wil graag delen hoe ik mijn creativiteit ontwikkel en wat me inspireert...',
          timestamp: '2 uur geleden',
          likes: 24,
          comments: 8,
          isLiked: true,
          isBookmarked: false,
          tags: ['creativiteit', 'INFP', 'inspiratie'],
          type: 'insight'
        },
        {
          id: '2',
          communityId: community.id,
          author: {
            name: 'Alex K.',
            avatar: '👨‍💻',
            mbtiType: 'ENFP'
          },
          title: 'Hoe ga je om met perfectionisme?',
          content: 'Ik merk dat ik vaak vastloop in perfectionisme. Hoe doen jullie dat?',
          timestamp: '4 uur geleden',
          likes: 18,
          comments: 12,
          isLiked: false,
          isBookmarked: true,
          tags: ['perfectionisme', 'uitdaging', 'hulp'],
          type: 'question'
        },
        {
          id: '3',
          communityId: community.id,
          author: {
            name: 'Lisa T.',
            avatar: '👩‍🎓',
            mbtiType: 'INFJ'
          },
          title: 'Geweldige resource: MBTI en relaties',
          content: 'Ik heb deze geweldige podcast gevonden over MBTI en relaties. Zeer de moeite waard!',
          timestamp: '6 uur geleden',
          likes: 31,
          comments: 5,
          isLiked: true,
          isBookmarked: false,
          tags: ['podcast', 'relaties', 'resource'],
          type: 'resource'
        }
      ];

      setPosts(mockPosts);
      logger.info('✅ Community posts loaded');
    } catch (error) {
      logger.error('❌ Failed to load community posts:', { error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  // Load posts when community changes
  useEffect(() => {
    if (selectedCommunity) {
      loadPosts(selectedCommunity);
    } else {
      setPosts([]);
    }
  }, [selectedCommunity, loadPosts]);

  // Community actions
  const handleJoinCommunity = useCallback((communityId: string) => {
    setCommunities(prev =>
      prev.map(community =>
        community.id === communityId
          ? {
              ...community,
              isJoined: !community.isJoined,
              memberCount: community.isJoined
                ? community.memberCount - 1
                : community.memberCount + 1
            }
          : community
      )
    );
  }, []);

  const handleLikePost = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  }, []);

  const handleBookmarkPost = useCallback((postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  }, []);

  // Discourse integration
  const navigateToDiscourseChat = useCallback(() => {
    discourseConnector.navigateToChat(mbtiType);
  }, [mbtiType]);

  const navigateToDiscourseCommunities = useCallback(() => {
    discourseConnector.navigateToCommunities(mbtiType);
  }, [mbtiType]);

  const navigateToDiscourseChallenges = useCallback(() => {
    discourseConnector.navigateToChallenges();
  }, []);

  // Utility functions
  const getCategoryColor = useCallback((category: string) => {
    const colors: { [key: string]: string } = {
      'discussion': 'bg-blue-500/20 text-blue-300',
      'support': 'bg-pink-500/20 text-pink-300',
      'learning': 'bg-green-500/20 text-green-300',
      'creative': 'bg-purple-500/20 text-purple-300',
      'professional': 'bg-indigo-500/20 text-indigo-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    const icons: { [key: string]: string } = {
      'discussion': '💬',
      'question': '❓',
      'insight': '💡',
      'resource': '📚'
    };
    return icons[type] || '💬';
  }, []);

  const value: CommunitiesContextType = {
    // State
    currentView,
    selectedCommunity,
    communities,
    posts,
    trendingTopics,
    searchQuery,
    selectedCategory,
    isLoading,

    // User data
    mbtiType,
    userName,

    // Actions
    setCurrentView,
    setSelectedCommunity,
    setSearchQuery,
    setSelectedCategory,

    // Community actions
    handleJoinCommunity,
    handleLikePost,
    handleBookmarkPost,

    // Discourse integration
    navigateToDiscourseChat,
    navigateToDiscourseCommunities,
    navigateToDiscourseChallenges,

    // Utility functions
    getCategoryColor,
    getTypeIcon
  };

  return (
    <CommunitiesContext.Provider value={value}>
      {children}
    </CommunitiesContext.Provider>
  );
};
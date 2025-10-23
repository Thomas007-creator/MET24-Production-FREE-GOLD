import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Avatar, Chip, Badge, Progress } from '@nextui-org/react';
import { 
  ArrowLeft, 
  Home, 
  Search, 
  Users, 
  MessageCircle, 
  Star, 
  TrendingUp,
  Filter,
  Plus,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Eye
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import discourseConnector from '../services/discourseConnector';

interface Community {
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

interface CommunityPost {
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

const CommunitiesPage: React.FC = () => {
  const { userData } = useAppStore();
  const [currentView, setCurrentView] = useState<'communities' | 'posts' | 'trending'>('communities');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const mbtiType = userData?.mbtiType || 'INFP';
  const userName = userData?.name || 'Gebruiker';

  // Load mock data
  useEffect(() => {
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
  }, []);

  // Load posts for selected community
  useEffect(() => {
    if (selectedCommunity) {
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          communityId: selectedCommunity.id,
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
          communityId: selectedCommunity.id,
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
          communityId: selectedCommunity.id,
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
    }
  }, [selectedCommunity]);

  const handleBackToMain = () => {
    window.history.back();
  };

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prev => 
      prev.map(community => 
        community.id === communityId 
          ? { ...community, isJoined: !community.isJoined, memberCount: community.isJoined ? community.memberCount - 1 : community.memberCount + 1 }
          : community
      )
    );
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post
      )
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'discussion': 'bg-blue-500/20 text-blue-300',
      'support': 'bg-pink-500/20 text-pink-300',
      'learning': 'bg-green-500/20 text-green-300',
      'creative': 'bg-purple-500/20 text-purple-300',
      'professional': 'bg-indigo-500/20 text-indigo-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'discussion': '💬',
      'question': '❓',
      'insight': '💡',
      'resource': '📚'
    };
    return icons[type] || '💬';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              👥 MBTI Community's
            </h1>
            <p className='text-gray-300'>
              Welkom {userName}! Verbind met andere {mbtiType} types en deel je inzichten
            </p>
          </div>
          <div className='flex gap-3'>
            <Button
              color='secondary'
              variant='bordered'
              startContent={<ArrowLeft />}
              onClick={handleBackToMain}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Terug
            </Button>
            <Button
              color='primary'
              variant='bordered'
              startContent={<Home />}
              onClick={() => window.location.href = '/'}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Hoofdmenu
            </Button>
            <Button
              color='primary'
              variant='bordered'
              startContent={<MessageCircle />}
              onClick={() => window.location.href = '/chat'}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Persoonlijke Chats
            </Button>
          </div>
        </div>

        {/* MBTI Community Focus */}
        <div className='glass rounded-xl p-6 mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-white mb-2'>
                🎯 Jouw {mbtiType} Community Focus
              </h2>
              <p className='text-gray-300'>
                Verbind met gelijkgestemden en deel je unieke perspectief
              </p>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-purple-400'>{mbtiType}</div>
              <div className='text-sm text-gray-400'>Jouw Type</div>
            </div>
          </div>
        </div>

        {/* 🚀 DISCOURSE LIVE COMMUNITY - DIRECTE TOEGANG */}
        <div className='glass rounded-xl p-6 mb-8 border-2 border-purple-500/50'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-4'>
              <div className='text-4xl'>🌐</div>
              <div>
                <h2 className='text-2xl font-bold text-white mb-2'>
                  🚀 Live Community Platform
                </h2>
                <p className='text-gray-300'>
                  Chat, deel en leer van de volledige MET24 community via ons Discourse platform
                </p>
              </div>
            </div>
            <div className='text-center'>
              <div className='text-green-400 text-sm font-semibold mb-1'>● LIVE</div>
              <div className='text-gray-400 text-xs'>Real-time chat</div>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Button
              color='primary'
              variant='solid'
              size='lg'
              startContent={<MessageCircle />}
              onClick={() => discourseConnector.navigateToChat(mbtiType)}
              className='bg-purple-600 hover:bg-purple-700 text-white font-semibold'
            >
              💬 {mbtiType} Chat
            </Button>
            
            <Button
              color='success'
              variant='solid'
              size='lg'
              startContent={<Users />}
              onClick={() => discourseConnector.navigateToCommunities(mbtiType)}
              className='bg-green-600 hover:bg-green-700 text-white font-semibold'
            >
              👥 Communities
            </Button>
            
            <Button
              color='warning'
              variant='solid'
              size='lg'
              startContent={<TrendingUp />}
              onClick={() => discourseConnector.navigateToChallenges()}
              className='bg-orange-600 hover:bg-orange-700 text-white font-semibold'
            >
              🎯 Challenges
            </Button>
          </div>
          
          <div className='mt-4 p-3 bg-white/5 rounded-lg'>
            <p className='text-sm text-gray-300 text-center'>
              🔗 <strong>Naadloos geïntegreerd:</strong> Je MET24 profiel en voortgang zijn automatisch gekoppeld
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='flex justify-center mb-8'>
          <div className='glass rounded-xl p-2'>
            <div className='flex space-x-2'>
              {[
                { id: 'communities', label: 'Community\'s', icon: '👥' },
                { id: 'posts', label: 'Posts', icon: '📝' },
                { id: 'trending', label: 'Trending', icon: '🔥' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentView === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span className='mr-2'>{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {currentView === 'communities' && (
          <div className='space-y-6'>
            {/* Search and Filters */}
            <div className='glass rounded-xl p-6'>
              <div className='flex flex-col md:flex-row gap-4 mb-4'>
                <Input
                  placeholder="Zoek community's..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  startContent={<Search className='w-4 h-4' />}
                  className='flex-1'
                />
                <Button
                  color='primary'
                  variant='bordered'
                  startContent={<Filter className='w-4 h-4' />}
                  className='border-purple-400 text-purple-400'
                >
                  Filters
                </Button>
                <Button
                  color='primary'
                  variant='solid'
                  startContent={<Plus className='w-4 h-4' />}
                  className='bg-purple-600 hover:bg-purple-700'
                >
                  Nieuwe Community
                </Button>
              </div>
            </div>

            {/* Communities Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {communities
                .filter(community => 
                  community.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  (selectedCategory === 'all' || community.category === selectedCategory)
                )
                .map((community) => (
                <Card key={community.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
                  <CardBody className='p-6'>
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex items-center space-x-3'>
                        <div className='text-3xl'>{community.icon}</div>
                        <div>
                          <h3 className='font-semibold text-white'>{community.name}</h3>
                          <p className='text-sm text-gray-300'>{community.description}</p>
                        </div>
                      </div>
                      {community.trending && (
                        <Badge content='🔥' color='warning' size='sm'>
                          <div></div>
                        </Badge>
                      )}
                    </div>
                    
                    <div className='space-y-3 mb-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>Leden</span>
                        <span className='text-white'>{community.memberCount.toLocaleString()}</span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>Laatste activiteit</span>
                        <span className='text-white'>{community.lastActivity}</span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-400'>MBTI Types</span>
                        <div className='flex space-x-1'>
                          {community.mbtiTypes.slice(0, 3).map((type) => (
                            <Chip
                              key={type}
                              size='sm'
                              variant='flat'
                              className='bg-white/10 text-white text-xs'
                            >
                              {type}
                            </Chip>
                          ))}
                          {community.mbtiTypes.length > 3 && (
                            <span className='text-xs text-gray-400'>+{community.mbtiTypes.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <Chip
                        size='sm'
                        variant='flat'
                        className={getCategoryColor(community.category)}
                      >
                        {community.category}
                      </Chip>
                      <Button
                        color={community.isJoined ? 'secondary' : 'primary'}
                        variant={community.isJoined ? 'bordered' : 'solid'}
                        size='sm'
                        onClick={() => handleJoinCommunity(community.id)}
                        className={community.isJoined ? 'border-white/20 text-white' : 'bg-purple-600 hover:bg-purple-700'}
                      >
                        {community.isJoined ? 'Verlaten' : 'Lid Worden'}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Posts View */}
        {currentView === 'posts' && selectedCommunity && (
          <div className='space-y-6'>
            {/* Community Header */}
            <div className='glass rounded-xl p-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='text-4xl'>{selectedCommunity.icon}</div>
                  <div>
                    <h2 className='text-2xl font-semibold text-white'>{selectedCommunity.name}</h2>
                    <p className='text-gray-300'>{selectedCommunity.description}</p>
                  </div>
                </div>
                <Button
                  color='secondary'
                  variant='light'
                  onClick={() => setSelectedCommunity(null)}
                  className='text-white'
                >
                  Terug naar Community's
                </Button>
              </div>
            </div>

            {/* Posts List */}
            <div className='space-y-4'>
              {posts.map((post) => (
                <Card key={post.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
                  <CardBody className='p-6'>
                    <div className='flex items-start space-x-4 mb-4'>
                      <Avatar
                        src={post.author.avatar}
                        className='w-12 h-12'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <h3 className='font-semibold text-white'>{post.author.name}</h3>
                          <Chip
                            size='sm'
                            variant='flat'
                            className='bg-white/10 text-white text-xs'
                          >
                            {post.author.mbtiType}
                          </Chip>
                          <span className='text-sm text-gray-400'>{post.timestamp}</span>
                        </div>
                        <h4 className='text-lg font-semibold text-white mb-2'>{post.title}</h4>
                        <p className='text-gray-300 mb-4'>{post.content}</p>
                        <div className='flex flex-wrap gap-2 mb-4'>
                          {post.tags.map((tag) => (
                            <Chip
                              key={tag}
                              size='sm'
                              variant='flat'
                              className='bg-white/5 text-gray-300 text-xs'
                            >
                              #{tag}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-4'>
                        <Button
                          color='secondary'
                          variant='light'
                          startContent={<Heart className='w-4 h-4' />}
                          onClick={() => handleLikePost(post.id)}
                          className={`text-white ${post.isLiked ? 'text-red-400' : ''}`}
                        >
                          {post.likes}
                        </Button>
                        <Button
                          color='secondary'
                          variant='light'
                          startContent={<MessageCircle className='w-4 h-4' />}
                          className='text-white'
                        >
                          {post.comments}
                        </Button>
                        <Button
                          color='secondary'
                          variant='light'
                          startContent={<Share2 className='w-4 h-4' />}
                          className='text-white'
                        >
                          Delen
                        </Button>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Button
                          color='secondary'
                          variant='light'
                          startContent={<Bookmark className='w-4 h-4' />}
                          onClick={() => handleBookmarkPost(post.id)}
                          className={`text-white ${post.isBookmarked ? 'text-yellow-400' : ''}`}
                        >
                          {post.isBookmarked ? 'Opgeslagen' : 'Opslaan'}
                        </Button>
                        <Chip
                          size='sm'
                          variant='flat'
                          className='bg-white/10 text-white text-xs'
                        >
                          {getTypeIcon(post.type)} {post.type}
                        </Chip>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Trending View */}
        {currentView === 'trending' && (
          <div className='space-y-6'>
            <div className='glass rounded-xl p-6'>
              <h2 className='text-2xl font-semibold text-white mb-4'>
                🔥 Trending Topics
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {[
                  { topic: 'INFP Creativiteit', posts: 45, trend: 'up' },
                  { topic: 'MBTI Relaties', posts: 32, trend: 'up' },
                  { topic: 'Persoonlijke Groei', posts: 28, trend: 'up' },
                  { topic: 'Emotionele Intelligentie', posts: 23, trend: 'up' },
                  { topic: 'Introverte Kracht', posts: 19, trend: 'up' },
                  { topic: 'MBTI Carrière', posts: 16, trend: 'up' }
                ].map((item, index) => (
                  <Card key={index} className='glass border border-white/10 hover:bg-white/10 transition-all'>
                    <CardBody className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-semibold text-white'>{item.topic}</h3>
                          <p className='text-sm text-gray-400'>{item.posts} posts</p>
                        </div>
                        <div className='text-green-400'>
                          <TrendingUp className='w-5 h-5' />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;
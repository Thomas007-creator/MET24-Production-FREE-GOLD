import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Chip, Badge, Progress } from '@nextui-org/react';
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  Bookmark, 
  Heart, 
  Share2, 
  Clock, 
  Star,
  Eye,
  TrendingUp,
  BookOpen,
  Video,
  Headphones,
  FileText,
  ArrowRight,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import ContentCard from './ContentCard';

interface ContentItem {
  id: string;
  type: 'article' | 'video' | 'podcast' | 'course';
  title: string;
  description: string;
  author: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mbtiRelevance: string[];
  tags: string[];
  thumbnail?: string;
  url: string;
  isDownloaded: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
  progress: number;
  rating: number;
  views: number;
  publishedAt: string;
  source: string;
}

interface ContentDiscoveryPanelProps {
  userId?: string;
  mbtiType?: string;
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
}

const ContentDiscoveryPanel: React.FC<ContentDiscoveryPanelProps> = ({
  userId = 'temp_user',
  mbtiType = 'INFP',
  maxItems = 6,
  showFilters = true,
  compact = false
}) => {
  const { userData } = useAppStore();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedMBTI, setSelectedMBTI] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const currentMBTI = mbtiType || userData?.mbtiType || 'INFP';

  // Load mock content data
  useEffect(() => {
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'video',
        title: 'INFP: Emotionele Expressie en Creativiteit',
        description: 'Leer hoe je als INFP je gevoelens creatief kunt uiten en verwerken.',
        author: 'Dr. Sarah van der Berg',
        duration: 25,
        difficulty: 'beginner',
        mbtiRelevance: ['INFP', 'ENFP', 'ISFP'],
        tags: ['emoties', 'creativiteit', 'zelfexpressie'],
        thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=INFP+Video',
        url: '/content/1',
        isDownloaded: false,
        isBookmarked: true,
        isLiked: false,
        progress: 0,
        rating: 4.8,
        views: 1250,
        publishedAt: '2024-01-15',
        source: 'MBTI Academy'
      },
      {
        id: '2',
        type: 'article',
        title: 'Grenzen Stellen voor Gevoelige Types',
        description: 'Praktische tips voor INFPs om gezonde grenzen te stellen zonder authenticiteit te verliezen.',
        author: 'Lisa Chen',
        duration: 8,
        difficulty: 'intermediate',
        mbtiRelevance: ['INFP', 'ISFP', 'ENFP', 'ESFP'],
        tags: ['grenzen', 'zelfzorg', 'relaties'],
        thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Grenzen+Artikel',
        url: '/content/2',
        isDownloaded: true,
        isBookmarked: false,
        isLiked: true,
        progress: 75,
        rating: 4.6,
        views: 890,
        publishedAt: '2024-01-12',
        source: 'Wellness Blog'
      },
      {
        id: '3',
        type: 'podcast',
        title: 'MBTI en Persoonlijke Groei',
        description: 'Een diepgaand gesprek over hoe je MBTI type je persoonlijke ontwikkeling kan beïnvloeden.',
        author: 'Mark de Vries',
        duration: 45,
        difficulty: 'intermediate',
        mbtiRelevance: ['ALL'],
        tags: ['persoonlijke groei', 'MBTI', 'ontwikkeling'],
        thumbnail: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=MBTI+Podcast',
        url: '/content/3',
        isDownloaded: false,
        isBookmarked: false,
        isLiked: false,
        progress: 0,
        rating: 4.7,
        views: 2100,
        publishedAt: '2024-01-10',
        source: 'Growth Podcast'
      },
      {
        id: '4',
        type: 'course',
        title: 'Mindfulness voor Introverte Types',
        description: 'Een complete cursus over mindfulness technieken speciaal afgestemd op introverte persoonlijkheden.',
        author: 'Dr. Emma Wilson',
        duration: 120,
        difficulty: 'beginner',
        mbtiRelevance: ['INFP', 'INFJ', 'ISFP', 'ISFJ'],
        tags: ['mindfulness', 'introvert', 'meditatie'],
        thumbnail: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Mindfulness+Course',
        url: '/content/4',
        isDownloaded: false,
        isBookmarked: true,
        isLiked: false,
        progress: 0,
        rating: 4.9,
        views: 3400,
        publishedAt: '2024-01-08',
        source: 'Mindfulness Institute'
      },
      {
        id: '5',
        type: 'video',
        title: 'Creatieve Journaling Technieken',
        description: 'Ontdek verschillende manieren om je innerlijke wereld creatief te verkennen en uit te drukken.',
        author: 'Anna van der Meer',
        duration: 18,
        difficulty: 'beginner',
        mbtiRelevance: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
        tags: ['journaling', 'creativiteit', 'zelfreflectie'],
        thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Journaling+Video',
        url: '/content/5',
        isDownloaded: true,
        isBookmarked: false,
        isLiked: true,
        progress: 100,
        rating: 4.5,
        views: 1560,
        publishedAt: '2024-01-05',
        source: 'Creative Hub'
      },
      {
        id: '6',
        type: 'article',
        title: 'Waarden en Authenticiteit in Werk',
        description: 'Hoe je als INFP werk kunt vinden dat past bij je kernwaarden en authenticiteit.',
        author: 'Tom de Jong',
        duration: 12,
        difficulty: 'advanced',
        mbtiRelevance: ['INFP', 'ENFP', 'INFJ', 'ENFJ'],
        tags: ['carrière', 'waarden', 'authenticiteit'],
        thumbnail: 'https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Carrière+Artikel',
        url: '/content/6',
        isDownloaded: false,
        isBookmarked: false,
        isLiked: false,
        progress: 0,
        rating: 4.4,
        views: 980,
        publishedAt: '2024-01-03',
        source: 'Career Guide'
      }
    ];

    setContentItems(mockContent);
    setFilteredContent(mockContent.slice(0, maxItems));
  }, [maxItems]);

  // Filter content based on search and filters
  useEffect(() => {
    let filtered = contentItems;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }

    // MBTI filter
    if (selectedMBTI !== 'all') {
      filtered = filtered.filter(item => 
        item.mbtiRelevance.includes(selectedMBTI) || 
        item.mbtiRelevance.includes('ALL')
      );
    }

    setFilteredContent(filtered.slice(0, maxItems));
  }, [searchQuery, selectedType, selectedDifficulty, selectedMBTI, contentItems, maxItems]);

  const handlePlay = (content: ContentItem) => {
    console.log('Playing content:', content.title);
    // Implement play logic
  };

  const handleDownload = (content: ContentItem) => {
    console.log('Downloading content:', content.title);
    // Implement download logic
  };

  const handleBookmark = (content: ContentItem) => {
    console.log('Bookmarking content:', content.title);
    // Implement bookmark logic
  };

  const handleLike = (content: ContentItem) => {
    console.log('Liking content:', content.title);
    // Implement like logic
  };

  const handleShare = (content: ContentItem) => {
    console.log('Sharing content:', content.title);
    // Implement share logic
  };

  const handleViewDetails = (content: ContentItem) => {
    console.log('Viewing details for:', content.title);
    // Implement view details logic
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'podcast': return <Headphones className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500/20 text-red-300';
      case 'podcast': return 'bg-purple-500/20 text-purple-300';
      case 'course': return 'bg-blue-500/20 text-blue-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (compact) {
    return (
      <div className='space-y-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-white'>
            🎯 Content Discovery
          </h3>
          <Button
            color='secondary'
            variant='light'
            size='sm'
            className='text-white'
          >
            <ArrowRight className='w-4 h-4' />
          </Button>
        </div>

        {/* Top 3 Content Items */}
        <div className='space-y-3'>
          {filteredContent.slice(0, 3).map((content) => (
            <div key={content.id} className='flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer' onClick={() => handleViewDetails(content)}>
              <div className='flex-shrink-0'>
                {content.thumbnail ? (
                  <img 
                    src={content.thumbnail} 
                    alt={content.title}
                    className='w-12 h-12 rounded-lg object-cover'
                  />
                ) : (
                  <div className='w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center'>
                    {getTypeIcon(content.type)}
                  </div>
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <h4 className='font-medium text-white truncate'>{content.title}</h4>
                <p className='text-sm text-gray-300 truncate'>{content.author}</p>
                <div className='flex items-center space-x-2 mt-1'>
                  <Chip
                    size='sm'
                    variant='flat'
                    className={getTypeColor(content.type)}
                  >
                    {getTypeIcon(content.type)}
                    <span className='ml-1'>{content.type}</span>
                  </Chip>
                  <span className='text-xs text-gray-400'>{content.duration}m</span>
                </div>
              </div>
              <div className='flex-shrink-0'>
                <Button
                  color='primary'
                  variant='light'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(content);
                  }}
                  className='text-white'
                >
                  <Play className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-white mb-2'>
            🎯 Content Discovery
          </h2>
          <p className='text-gray-300'>
            Ontdek gepersonaliseerde content voor jouw {currentMBTI} type
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            color='secondary'
            variant='light'
            size='sm'
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className='text-white'
          >
            {viewMode === 'grid' ? <List className='w-4 h-4' /> : <Grid className='w-4 h-4' />}
          </Button>
          <Button
            color='secondary'
            variant='light'
            size='sm'
            className='text-white'
          >
            <RefreshCw className='w-4 h-4' />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className='glass rounded-xl p-6'>
          <div className='flex flex-col md:flex-row gap-4 mb-4'>
            <Input
              placeholder='Zoek content...'
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
          </div>

          {/* Filter Chips */}
          <div className='flex flex-wrap gap-2'>
            {/* Type Filter */}
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-300'>Type:</span>
              {['all', 'video', 'article', 'podcast', 'course'].map((type) => (
                <Chip
                  key={type}
                  size='sm'
                  variant={selectedType === type ? 'solid' : 'flat'}
                  onClick={() => setSelectedType(type)}
                  className={selectedType === type ? 'bg-purple-600' : 'bg-white/10 text-white'}
                >
                  {type === 'all' ? 'Alles' : type}
                </Chip>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className='flex items-center space-x-2 ml-4'>
              <span className='text-sm text-gray-300'>Niveau:</span>
              {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
                <Chip
                  key={difficulty}
                  size='sm'
                  variant={selectedDifficulty === difficulty ? 'solid' : 'flat'}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={selectedDifficulty === difficulty ? 'bg-purple-600' : 'bg-white/10 text-white'}
                >
                  {difficulty === 'all' ? 'Alles' : difficulty}
                </Chip>
              ))}
            </div>

            {/* MBTI Filter */}
            <div className='flex items-center space-x-2 ml-4'>
              <span className='text-sm text-gray-300'>MBTI:</span>
              {['all', currentMBTI, 'ALL'].map((mbti) => (
                <Chip
                  key={mbti}
                  size='sm'
                  variant={selectedMBTI === mbti ? 'solid' : 'flat'}
                  onClick={() => setSelectedMBTI(mbti)}
                  className={selectedMBTI === mbti ? 'bg-purple-600' : 'bg-white/10 text-white'}
                >
                  {mbti === 'all' ? 'Alles' : mbti}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredContent.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onPlay={handlePlay}
            onDownload={handleDownload}
            onBookmark={handleBookmark}
            onLike={handleLike}
            onShare={handleShare}
            onViewDetails={handleViewDetails}
            showProgress={true}
            compact={viewMode === 'list'}
          />
        ))}
      </div>

      {/* Load More Button */}
      {filteredContent.length >= maxItems && (
        <div className='text-center'>
          <Button
            color='primary'
            variant='bordered'
            className='border-purple-400 text-purple-400'
          >
            Meer Content Laden
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContentDiscoveryPanel;

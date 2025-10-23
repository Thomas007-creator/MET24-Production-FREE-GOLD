import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Badge, Progress } from '@nextui-org/react';
import { 
  Play, 
  Pause, 
  Download, 
  Bookmark, 
  Share2, 
  Heart, 
  Clock, 
  Star,
  Eye,
  BookOpen,
  Video,
  Headphones,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'article' | 'video' | 'podcast' | 'course';
  title: string;
  description: string;
  author: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mbtiRelevance: string[];
  tags: string[];
  thumbnail?: string;
  url: string;
  isDownloaded: boolean;
  isBookmarked: boolean;
  isLiked: boolean;
  progress: number; // 0-100
  rating: number; // 1-5
  views: number;
  publishedAt: string;
  source: string;
}

interface ContentCardProps {
  content: ContentItem;
  onPlay?: (content: ContentItem) => void;
  onDownload?: (content: ContentItem) => void;
  onBookmark?: (content: ContentItem) => void;
  onLike?: (content: ContentItem) => void;
  onShare?: (content: ContentItem) => void;
  onViewDetails?: (content: ContentItem) => void;
  showProgress?: boolean;
  compact?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onPlay,
  onDownload,
  onBookmark,
  onLike,
  onShare,
  onViewDetails,
  showProgress = true,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay?.(content);
  };

  const handleDownload = () => {
    onDownload?.(content);
  };

  const handleBookmark = () => {
    onBookmark?.(content);
  };

  const handleLike = () => {
    onLike?.(content);
  };

  const handleShare = () => {
    onShare?.(content);
  };

  const handleViewDetails = () => {
    onViewDetails?.(content);
  };

  if (compact) {
    return (
      <Card className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer' onClick={handleViewDetails}>
        <CardBody className='p-4'>
          <div className='flex items-center space-x-3'>
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
              <h3 className='font-semibold text-white truncate'>{content.title}</h3>
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
                <span className='text-xs text-gray-400'>{formatDuration(content.duration)}</span>
              </div>
            </div>
            <div className='flex-shrink-0'>
              <Button
                color='primary'
                variant='light'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay();
                }}
                className='text-white'
              >
                {isPlaying ? <Pause className='w-4 h-4' /> : <Play className='w-4 h-4' />}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className='glass border border-white/10 hover:bg-white/10 transition-all'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between w-full'>
          <div className='flex items-center space-x-3'>
            <div className='flex-shrink-0'>
              {content.thumbnail ? (
                <img 
                  src={content.thumbnail} 
                  alt={content.title}
                  className='w-16 h-16 rounded-lg object-cover'
                />
              ) : (
                <div className='w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center'>
                  {getTypeIcon(content.type)}
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-semibold text-white mb-1'>{content.title}</h3>
              <p className='text-sm text-gray-300 mb-2'>{content.description}</p>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-400'>door {content.author}</span>
                <span className='text-xs text-gray-500'>•</span>
                <span className='text-sm text-gray-400'>{content.source}</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {content.isDownloaded && (
              <Badge content='✓' color='success' size='sm'>
                <div></div>
              </Badge>
            )}
            <Button
              color='secondary'
              variant='light'
              size='sm'
              onClick={handleBookmark}
              className={`text-white ${content.isBookmarked ? 'text-yellow-400' : ''}`}
            >
              <Bookmark className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {/* Progress Bar */}
        {showProgress && content.progress > 0 && (
          <div className='mb-4'>
            <div className='flex justify-between text-sm text-gray-300 mb-1'>
              <span>Voortgang</span>
              <span>{content.progress}%</span>
            </div>
            <Progress
              value={content.progress}
              color='primary'
              className='mb-2'
            />
          </div>
        )}

        {/* Tags and MBTI Relevance */}
        <div className='mb-4'>
          <div className='flex flex-wrap gap-2 mb-2'>
            {content.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                size='sm'
                variant='flat'
                className='bg-white/5 text-gray-300 text-xs'
              >
                #{tag}
              </Chip>
            ))}
            {content.tags.length > 3 && (
              <Chip
                size='sm'
                variant='flat'
                className='bg-white/5 text-gray-300 text-xs'
              >
                +{content.tags.length - 3}
              </Chip>
            )}
          </div>
          <div className='flex flex-wrap gap-1'>
            {content.mbtiRelevance.slice(0, 2).map((mbti) => (
              <Chip
                key={mbti}
                size='sm'
                variant='flat'
                className='bg-purple-500/20 text-purple-300 text-xs'
              >
                {mbti}
              </Chip>
            ))}
            {content.mbtiRelevance.length > 2 && (
              <Chip
                size='sm'
                variant='flat'
                className='bg-purple-500/20 text-purple-300 text-xs'
              >
                +{content.mbtiRelevance.length - 2}
              </Chip>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-4 text-sm text-gray-400'>
            <div className='flex items-center space-x-1'>
              <Clock className='w-4 h-4' />
              <span>{formatDuration(content.duration)}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Eye className='w-4 h-4' />
              <span>{formatViews(content.views)}</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Star className='w-4 h-4' />
              <span>{content.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Chip
              size='sm'
              variant='flat'
              color={getDifficultyColor(content.difficulty) as any}
            >
              {content.difficulty}
            </Chip>
            <Chip
              size='sm'
              variant='flat'
              className={getTypeColor(content.type)}
            >
              {getTypeIcon(content.type)}
              <span className='ml-1'>{content.type}</span>
            </Chip>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Button
              color='primary'
              variant='solid'
              size='sm'
              onClick={handlePlay}
              className='bg-purple-600 hover:bg-purple-700'
            >
              {isPlaying ? <Pause className='w-4 h-4 mr-2' /> : <Play className='w-4 h-4 mr-2' />}
              {isPlaying ? 'Pauzeren' : 'Afspelen'}
            </Button>
            <Button
              color='secondary'
              variant='bordered'
              size='sm'
              onClick={handleDownload}
              className='border-white/20 text-white'
            >
              <Download className='w-4 h-4' />
            </Button>
            <Button
              color='secondary'
              variant='bordered'
              size='sm'
              onClick={handleLike}
              className={`border-white/20 ${content.isLiked ? 'text-red-400' : 'text-white'}`}
            >
              <Heart className='w-4 h-4' />
            </Button>
            <Button
              color='secondary'
              variant='bordered'
              size='sm'
              onClick={handleShare}
              className='border-white/20 text-white'
            >
              <Share2 className='w-4 h-4' />
            </Button>
          </div>
          <Button
            color='secondary'
            variant='light'
            size='sm'
            onClick={handleViewDetails}
            className='text-white'
          >
            <ExternalLink className='w-4 h-4 mr-2' />
            Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ContentCard;

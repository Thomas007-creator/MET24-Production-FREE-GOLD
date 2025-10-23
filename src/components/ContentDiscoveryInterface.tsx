import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button, 
  Input, 
  Chip, 
  Avatar, 
  Divider,
  Tabs,
  Tab,
  Progress,
  Badge,
  Spinner
} from '@nextui-org/react';
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Star, 
  ExternalLink,
  Filter,
  Bookmark,
  Heart,
  Share
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import contentDiscoveryChatLLMService, { ContentItem, PersonalizedContentFeed } from '../services/contentDiscoveryChatLLM';

/**
 * 📖 Content Discovery Interface - Priority #5 Implementation
 * 
 * MBTI-optimized personalized content discovery component that provides:
 * - Daily/weekly personalized content feeds based on MBTI type
 * - AI-powered content curation via ChatLLM integration
 * - External source integration (Coursera, edX, Medium, YouTube)
 * - Levensgebieden-based content organization
 * - Quality scoring and relevance ranking
 * - Trending content discovery for MBTI types
 * 
 * This feeds the "Hogere Zelf" background feature through targeted learning
 * based on user's MBTI preferences and community interests.
 */

interface ContentDiscoveryProps {
  className?: string;
}

export const ContentDiscoveryInterface: React.FC<ContentDiscoveryProps> = ({ 
  className = "" 
}) => {
  const { userData } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('daily');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentFeed, setCurrentFeed] = useState<PersonalizedContentFeed | null>(null);
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [selectedLevensgebieden, setSelectedLevensgebieden] = useState<string[]>([]);
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());

  const mbtiType = userData?.mbtiType || 'INFP';
  const userId = userData?.id || 'user-placeholder';

  // Available levensgebieden for filtering
  const availableLevensgebieden = [
    'werk', 'relaties', 'gezondheid', 'hobby', 
    'spiritualiteit', 'persoonlijke_groei', 'creativiteit', 'studie'
  ];

  // Load initial content feeds
  useEffect(() => {
    loadContentFeed();
  }, [activeTab, mbtiType]);

  const loadContentFeed = async () => {
    setIsLoading(true);
    try {
      let feed: PersonalizedContentFeed;

      switch (activeTab) {
        case 'daily':
          feed = await contentDiscoveryChatLLMService.getDailyFeed(userId, mbtiType);
          break;
        case 'weekly':
          feed = await contentDiscoveryChatLLMService.getWeeklyDiscoveryFeed(userId, mbtiType);
          break;
        case 'trending':
          feed = await contentDiscoveryChatLLMService.getTrendingContent(mbtiType);
          break;
        default:
          feed = await contentDiscoveryChatLLMService.getDailyFeed(userId, mbtiType);
      }

      setCurrentFeed(feed);
    } catch (error) {
      console.error('Error loading content feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await contentDiscoveryChatLLMService.searchContentByTopic(
        searchQuery,
        mbtiType,
        { contentTypes: ['article', 'course', 'video', 'podcast'] }
      );
      setSearchResults(results);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (itemId: string) => {
    const newBookmarks = new Set(bookmarkedItems);
    if (newBookmarks.has(itemId)) {
      newBookmarks.delete(itemId);
    } else {
      newBookmarks.add(itemId);
    }
    setBookmarkedItems(newBookmarks);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return '🎓';
      case 'video': return '📹';
      case 'article': return '📄';
      case 'podcast': return '🎧';
      case 'book': return '📚';
      case 'research': return '🔬';
      default: return '📖';
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'primary';
      case 'video': return 'secondary';
      case 'article': return 'success';
      case 'podcast': return 'warning';
      case 'book': return 'danger';
      case 'research': return 'default';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      case 'expert': return 'secondary';
      default: return 'default';
    }
  };

  const renderContentItem = (item: ContentItem, index: number) => (
    <Card key={item.id} className="mb-4 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-start space-x-3 flex-1">
            <div className="text-2xl">{getContentTypeIcon(item.contentType)}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white line-clamp-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-300 mt-1">
                {item.source} • {item.estimatedReadTime} min read
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              color={getContentTypeColor(item.contentType)} 
              variant="flat" 
              size="sm"
            >
              {item.contentType}
            </Badge>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color={bookmarkedItems.has(item.id) ? "warning" : "default"}
              onClick={() => toggleBookmark(item.id)}
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedItems.has(item.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="pt-0">
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
          {item.description}
        </p>
        
        {/* MBTI Relevance & Quality Metrics */}
        <div className="flex items-center space-x-4 mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">
              {item.qualityScore}/100
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">
              {item.mbtiRelevance.relevanceScore}% MBTI match
            </span>
          </div>
          <Chip 
            size="sm" 
            color={getDifficultyColor(item.difficulty)}
            variant="flat"
          >
            {item.difficulty}
          </Chip>
        </div>

        {/* Levensgebieden Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.levensgebiedCategories.slice(0, 3).map((category, idx) => (
            <Chip 
              key={idx}
              size="sm" 
              variant="bordered" 
              className="text-xs border-white/20 text-white/70"
            >
              {category.category}
            </Chip>
          ))}
          {item.levensgebiedCategories.length > 3 && (
            <Chip 
              size="sm" 
              variant="bordered" 
              className="text-xs border-white/20 text-white/50"
            >
              +{item.levensgebiedCategories.length - 3}
            </Chip>
          )}
        </div>

        {/* MBTI Reasoning */}
        {item.mbtiRelevance.reasoning && (
          <div className="bg-white/5 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-400 mb-1">
              Why this fits {mbtiType}:
            </p>
            <p className="text-sm text-gray-300">
              {item.mbtiRelevance.reasoning}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            as="a"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
            variant="flat"
            size="sm"
            endContent={<ExternalLink className="w-4 h-4" />}
          >
            View Content
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="default"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Content Discovery
                  </h1>
                  <p className="text-gray-300 text-sm">
                    MBTI-optimized content curation for {mbtiType} types
                  </p>
                </div>
              </div>
              <Badge color="primary" variant="flat">
                Priority #5
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Search Bar */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody>
            <div className="flex items-center space-x-3">
              <Input
                placeholder="Search for content topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="flex-1"
                classNames={{
                  input: "bg-transparent text-white placeholder:text-gray-400",
                  inputWrapper: "bg-white/5 border border-white/10"
                }}
              />
              <Button 
                color="primary" 
                onClick={handleSearch}
                isLoading={isLoading && activeTab === 'search'}
              >
                Search
              </Button>
              <Button
                isIconOnly
                variant="bordered"
                color="default"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Content Tabs */}
        <Card className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20">
          <CardBody>
            <Tabs 
              selectedKey={activeTab} 
              onSelectionChange={(key) => setActiveTab(key as string)}
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
            >
              <Tab 
                key="daily" 
                title={
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Daily Feed</span>
                  </div>
                }
              />
              <Tab 
                key="weekly" 
                title={
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Weekly Discovery</span>
                  </div>
                }
              />
              <Tab 
                key="trending" 
                title={
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending</span>
                  </div>
                }
              />
              <Tab 
                key="search" 
                title={
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search Results</span>
                  </div>
                }
              />
            </Tabs>
          </CardBody>
        </Card>

        {/* Content Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardBody className="flex items-center justify-center py-12">
                  <Spinner size="lg" color="primary" />
                  <p className="text-white mt-4">
                    Discovering personalized content for {mbtiType}...
                  </p>
                </CardBody>
              </Card>
            ) : (
              <>
                {/* Feed Header */}
                {currentFeed && activeTab !== 'search' && (
                  <Card className="mb-4 bg-white/10 backdrop-blur-xl border border-white/20">
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-white capitalize">
                            {currentFeed.feedType} Content Feed
                          </h2>
                          <p className="text-sm text-gray-300">
                            {currentFeed.totalItems} items curated for you
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Generated: {currentFeed.generatedAt.toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            Next update: {currentFeed.nextUpdateTime.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {currentFeed.curationReasoning && (
                        <div className="mt-3 p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-gray-300">
                            {currentFeed.curationReasoning}
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* Content Items */}
                {activeTab === 'search' ? (
                  <div>
                    {searchResults.length > 0 ? (
                      <>
                        <div className="mb-4">
                          <h2 className="text-lg font-semibold text-white">
                            Search Results ({searchResults.length})
                          </h2>
                          <p className="text-sm text-gray-300">
                            Content matching "{searchQuery}" for {mbtiType}
                          </p>
                        </div>
                        {searchResults.map((item, index) => renderContentItem(item, index))}
                      </>
                    ) : (
                      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                        <CardBody className="text-center py-12">
                          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-white">
                            No search results yet
                          </p>
                          <p className="text-gray-300 text-sm">
                            Use the search bar above to find content
                          </p>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div>
                    {currentFeed?.items.length ? (
                      currentFeed.items.map((item, index) => renderContentItem(item, index))
                    ) : (
                      <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                        <CardBody className="text-center py-12">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-white">
                            No content available
                          </p>
                          <p className="text-gray-300 text-sm">
                            Try refreshing or switching to a different feed
                          </p>
                        </CardBody>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* MBTI Content Preferences */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">
                  {mbtiType} Preferences
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Content Types</p>
                    <div className="flex flex-wrap gap-1">
                      <Chip size="sm" color="primary" variant="flat">Research</Chip>
                      <Chip size="sm" color="secondary" variant="flat">Courses</Chip>
                      <Chip size="sm" color="success" variant="flat">Articles</Chip>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Focus Areas</p>
                    <div className="flex flex-wrap gap-1">
                      <Chip size="sm" variant="bordered" className="border-white/20 text-white/70">Innovation</Chip>
                      <Chip size="sm" variant="bordered" className="border-white/20 text-white/70">Systems</Chip>
                      <Chip size="sm" variant="bordered" className="border-white/20 text-white/70">Strategy</Chip>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Levensgebieden Filter */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">
                  Levensgebieden
                </h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {availableLevensgebieden.map((gebied) => (
                    <Chip
                      key={gebied}
                      size="sm"
                      variant={selectedLevensgebieden.includes(gebied) ? "solid" : "bordered"}
                      color={selectedLevensgebieden.includes(gebied) ? "primary" : "default"}
                      className={selectedLevensgebieden.includes(gebied) ? "" : "border-white/20 text-white/70 hover:bg-white/10"}
                      onClick={() => {
                        setSelectedLevensgebieden(prev => 
                          prev.includes(gebied) 
                            ? prev.filter(g => g !== gebied)
                            : [...prev, gebied]
                        );
                      }}
                    >
                      {gebied}
                    </Chip>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Stats & Insights */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <h3 className="text-lg font-semibold text-white">
                  Discovery Stats
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Content Quality</span>
                      <span className="text-white">87%</span>
                    </div>
                    <Progress 
                      value={87} 
                      color="success" 
                      size="sm"
                      classNames={{
                        track: "bg-white/10",
                        indicator: "bg-gradient-to-r from-green-500 to-blue-500"
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">MBTI Relevance</span>
                      <span className="text-white">92%</span>
                    </div>
                    <Progress 
                      value={92} 
                      color="primary" 
                      size="sm"
                      classNames={{
                        track: "bg-white/10",
                        indicator: "bg-gradient-to-r from-purple-500 to-pink-500"
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Content Diversity</span>
                      <span className="text-white">78%</span>
                    </div>
                    <Progress 
                      value={78} 
                      color="warning" 
                      size="sm"
                      classNames={{
                        track: "bg-white/10",
                        indicator: "bg-gradient-to-r from-yellow-500 to-orange-500"
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDiscoveryInterface;
import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { contentItemsCollection } from '../database';
import { logger } from '../utils/logger';

interface ContentFeedItem {
  id: string;
  title: string;
  summary: string;
  type: 'insight' | 'tip' | 'exercise' | 'quote';
  category: string;
  mbtiRelevance: string[];
  createdAt: string;
  readTime: number;
  isRead: boolean;
}

interface MBTIContentFeedProps {
  mbtiType: string;
  maxItems?: number;
}

const MBTIContentFeed: React.FC<MBTIContentFeedProps> = ({
  mbtiType,
  maxItems = 6
}) => {
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadContentFeed();
  }, [mbtiType, selectedCategory]);

  const loadContentFeed = async () => {
    setIsLoading(true);
    try {
      // Mock data voor MBTI-based content feed
      const mockFeedItems: ContentFeedItem[] = [
        {
          id: 'feed_1',
          title: 'INFP: Je Creatieve Kracht Ontwikkelen',
          summary: 'Ontdek hoe je je natuurlijke creativiteit kunt gebruiken voor persoonlijke groei en zelfexpressie.',
          type: 'insight',
          category: 'creativity',
          mbtiRelevance: ['INFP', 'ENFP', 'ISFP'],
          createdAt: new Date().toISOString(),
          readTime: 3,
          isRead: false
        },
        {
          id: 'feed_2',
          title: 'Dagelijkse Mindfulness voor Intuïtieve Types',
          summary: 'Een eenvoudige 5-minuten oefening die perfect past bij jouw natuurlijke intuïtieve aanleg.',
          type: 'exercise',
          category: 'mindfulness',
          mbtiRelevance: ['INFP', 'INFJ', 'ENFP', 'ENFJ'],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          readTime: 5,
          isRead: false
        },
        {
          id: 'feed_3',
          title: 'Waarom INFP\'s Zich Soms Verkeerd Begrepen Voelen',
          summary: 'Inzicht in de unieke uitdagingen van het INFP persoonlijkheidstype en hoe je ermee om kunt gaan.',
          type: 'insight',
          category: 'self-awareness',
          mbtiRelevance: ['INFP'],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          readTime: 4,
          isRead: true
        },
        {
          id: 'feed_4',
          title: 'Inspirerende Quote van de Dag',
          summary: '"Wees jezelf; alle anderen zijn al bezet." - Oscar Wilde',
          type: 'quote',
          category: 'inspiration',
          mbtiRelevance: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          readTime: 1,
          isRead: false
        },
        {
          id: 'feed_5',
          title: 'Emotionele Grenzen Stellen als INFP',
          summary: 'Praktische tips voor het stellen van gezonde grenzen zonder je authentieke zelf te verliezen.',
          type: 'tip',
          category: 'relationships',
          mbtiRelevance: ['INFP', 'ISFP'],
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          readTime: 6,
          isRead: false
        },
        {
          id: 'feed_6',
          title: 'Creatieve Journaling Oefening',
          summary: 'Een gestructureerde manier om je gedachten en gevoelens creatief te verwerken.',
          type: 'exercise',
          category: 'creativity',
          mbtiRelevance: ['INFP', 'ENFP', 'ISFP', 'ESFP'],
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          readTime: 8,
          isRead: false
        }
      ];

      // Filter op MBTI type en category
      let filteredItems = mockFeedItems.filter(item => 
        item.mbtiRelevance.includes(mbtiType) || item.mbtiRelevance.includes('ALL')
      );

      if (selectedCategory !== 'all') {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
      }

      // Sort by date (newest first)
      filteredItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setFeedItems(filteredItems.slice(0, maxItems));
    } catch (error) {
      logger.error('Error loading MBTI content feed', { error });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      insight: '💡',
      tip: '💡',
      exercise: '💪',
      quote: '💬'
    };
    return icons[type] || '📄';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      creativity: 'bg-pink-500/20 text-pink-300',
      mindfulness: 'bg-green-500/20 text-green-300',
      'self-awareness': 'bg-blue-500/20 text-blue-300',
      inspiration: 'bg-yellow-500/20 text-yellow-300',
      relationships: 'bg-purple-500/20 text-purple-300'
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  };

  const categories = [
    { id: 'all', label: 'Alles', icon: '🌟' },
    { id: 'creativity', label: 'Creativiteit', icon: '🎨' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' },
    { id: 'self-awareness', label: 'Zelfbewustzijn', icon: '🔍' },
    { id: 'inspiration', label: 'Inspiratie', icon: '✨' },
    { id: 'relationships', label: 'Relaties', icon: '💕' }
  ];

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Jouw {mbtiType} Feed</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-300 mt-2">Laden van persoonlijke content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-white">Jouw {mbtiType} Feed</h2>
        <span className="text-sm text-gray-400">
          {feedItems.filter(item => !item.isRead).length} nieuwe items
        </span>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <span className="mr-1">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.length > 0 ? (
          feedItems.map((item) => (
            <Card
              key={item.id}
              className={`bg-white/5 border transition-all hover:bg-white/10 ${
                item.isRead ? 'opacity-60' : 'border-white/20'
              }`}
            >
              <CardBody className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{getTypeIcon(item.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-medium ${item.isRead ? 'text-gray-400' : 'text-white'}`}>
                        {item.title}
                      </h3>
                      {!item.isRead && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{item.summary}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          ⏱️ {item.readTime} min
                        </span>
                        <span className="text-xs text-gray-400">
                          📅 {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        color="primary"
                        variant="ghost"
                        size="sm"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Lees meer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">
              Geen content beschikbaar voor deze categorie.
            </p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {feedItems.length >= maxItems && (
        <div className="text-center mt-6">
          <Button
            color="primary"
            variant="bordered"
            size="sm"
            className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
          >
            Meer laden
          </Button>
        </div>
      )}
    </div>
  );
};

export default MBTIContentFeed;

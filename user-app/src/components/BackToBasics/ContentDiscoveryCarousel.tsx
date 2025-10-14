import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Chip, Badge } from '@nextui-org/react';
import { ChevronLeft, ChevronRight, BookOpen, Video, Headphones, FileText, Star } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'video' | 'audio' | 'guide' | 'exercise';
  levensgebied: string;
  mbtiOptimized: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  rating: number;
  description: string;
  tags: string[];
  featured: boolean;
}

interface ContentDiscoveryCarouselProps {
  mbtiType: string;
  selectedLevensgebied?: string;
  onContentClick?: (content: ContentItem) => void;
}

const ContentDiscoveryCarousel: React.FC<ContentDiscoveryCarouselProps> = ({
  mbtiType,
  selectedLevensgebied,
  onContentClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Mock MBTI-geoptimaliseerde content
    const mockContent: ContentItem[] = [
      {
        id: '1',
        title: 'Mindfulness voor Introverte Types',
        type: 'guide',
        levensgebied: 'psychischeGezondheid',
        mbtiOptimized: ['INFP', 'INFJ', 'INTJ', 'INTP'],
        difficulty: 'beginner',
        duration: '15 min',
        rating: 4.8,
        description: 'Een zachte introductie tot mindfulness speciaal ontwikkeld voor introverte persoonlijkheden.',
        tags: ['mindfulness', 'introvert', 'mental health'],
        featured: true
      },
      {
        id: '2', 
        title: 'Creatieve Beweging voor INFPs',
        type: 'video',
        levensgebied: 'lichamelijkeGezondheid',
        mbtiOptimized: ['INFP', 'ISFP'],
        difficulty: 'beginner',
        duration: '20 min',
        rating: 4.6,
        description: 'Ontdek hoe je beweging kunt combineren met creativiteit en expressie.',
        tags: ['beweging', 'creativiteit', 'dans'],
        featured: false
      },
      {
        id: '3',
        title: 'Financiële Automatisering voor Droomdenkers',
        type: 'article',
        levensgebied: 'financieen',
        mbtiOptimized: ['INFP', 'ENFP', 'INFJ'],
        difficulty: 'intermediate',
        duration: '12 min',
        rating: 4.4,
        description: 'Praktische tips om financiën te automatiseren zodat je meer tijd hebt voor wat echt belangrijk is.',
        tags: ['automatisering', 'budgeting', 'waarden'],
        featured: true
      },
      {
        id: '4',
        title: 'Authentiek Netwerken voor Idealists',
        type: 'audio',
        levensgebied: 'werkSamenleving',
        mbtiOptimized: ['INFP', 'ENFP', 'INFJ', 'ENFJ'],
        difficulty: 'intermediate',
        duration: '25 min',
        rating: 4.7,
        description: 'Leer hoe je op een authentieke manier professionele relaties kunt opbouwen.',
        tags: ['netwerken', 'authenticiteit', 'carrière'],
        featured: false
      },
      {
        id: '5',
        title: 'Kunsttherapie Basics',
        type: 'exercise',
        levensgebied: 'hobbyPassies',
        mbtiOptimized: ['INFP', 'ISFP', 'ENFP', 'ESFP'],
        difficulty: 'beginner',
        duration: '30 min',
        rating: 4.9,
        description: 'Praktische oefeningen om emoties te verwerken door creatieve expressie.',
        tags: ['kunst', 'therapie', 'emoties'],
        featured: true
      },
      {
        id: '6',
        title: 'Dromen & Visualisatie Technieken',
        type: 'guide',
        levensgebied: 'actieveImaginatie',
        mbtiOptimized: ['INFP', 'INFJ', 'ENFP', 'ENFJ'],
        difficulty: 'intermediate',
        duration: '18 min',
        rating: 4.8,
        description: 'Geavanceerde technieken voor lucide dromen en creative visualisatie.',
        tags: ['dromen', 'visualisatie', 'verbeelding'],
        featured: true
      },
      {
        id: '7',
        title: 'Persoonlijke Missie Ontdekken',
        type: 'exercise',
        levensgebied: 'professioneleOntwikkeling',
        mbtiOptimized: ['INFP', 'ENFP', 'INFJ', 'ENFJ'],
        difficulty: 'advanced',
        duration: '45 min',
        rating: 4.6,
        description: 'Diepgaande oefeningen om je echte levensmissie en waarden te ontdekken.',
        tags: ['missie', 'waarden', 'doel'],
        featured: false
      },
      {
        id: '8',
        title: 'Diepgaande Gesprekken Voeren',
        type: 'article',
        levensgebied: 'socialeRelaties',
        mbtiOptimized: ['INFP', 'INFJ', 'ENFP', 'ENFJ'],
        difficulty: 'intermediate',
        duration: '8 min',
        rating: 4.5,
        description: 'Technieken om oppervlakkige gesprekken om te zetten in betekenisvolle verbindingen.',
        tags: ['gesprekken', 'verbinding', 'diepte'],
        featured: false
      },
      {
        id: '9',
        title: 'Inspirerende Ruimte Creëren',
        type: 'video',
        levensgebied: 'thuisOmgeving',
        mbtiOptimized: ['INFP', 'ISFP', 'INFJ', 'ISFJ'],
        difficulty: 'beginner',
        duration: '22 min',
        rating: 4.7,
        description: 'Transform je leefruimte tot een sanctuarium voor creativiteit en rust.',
        tags: ['interieur', 'rust', 'inspiratie'],
        featured: true
      }
    ];

    setContentItems(mockContent);
  }, []);

  useEffect(() => {
    // Filter content gebaseerd op MBTI en levensgebied
    let filtered = contentItems.filter(item => 
      item.mbtiOptimized.includes(mbtiType)
    );

    if (selectedLevensgebied) {
      filtered = filtered.filter(item => 
        item.levensgebied === selectedLevensgebied
      );
    }

    // Sorteer: featured content eerst, dan op rating
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });

    setFilteredContent(filtered);
    setCurrentIndex(0);
  }, [contentItems, mbtiType, selectedLevensgebied]);

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'article': return <FileText size={16} />;
      case 'video': return <Video size={16} />;
      case 'audio': return <Headphones size={16} />;
      case 'guide': return <BookOpen size={16} />;
      case 'exercise': return <Star size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: ContentItem['type']) => {
    switch (type) {
      case 'article': return 'primary';
      case 'video': return 'secondary';
      case 'audio': return 'success';
      case 'guide': return 'warning';
      case 'exercise': return 'danger';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty: ContentItem['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === filteredContent.length - 3 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, filteredContent.length - 3) : prev - 1
    );
  };

  const handleContentClick = (content: ContentItem) => {
    if (onContentClick) {
      onContentClick(content);
    } else {
      // Default behavior - open content
      console.log('Opening content:', content.title);
    }
  };

  if (filteredContent.length === 0) {
    return (
      <Card className="bg-white/5 border border-white/10">
        <CardBody className="text-center py-8">
          <p className="text-gray-400">Geen content beschikbaar voor je MBTI-type en geselecteerde levensgebied.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">🔍 MBTI-Geoptimaliseerde Content</h3>
          <p className="text-gray-300 text-sm">
            Speciaal gecureerd voor {mbtiType} {selectedLevensgebied && `• ${selectedLevensgebied}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="bordered"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="text-white border-white/20"
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            size="sm"
            variant="bordered"
            onClick={nextSlide}
            disabled={currentIndex >= filteredContent.length - 3}
            className="text-white border-white/20"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Content Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / 3)}%)` 
          }}
        >
          {filteredContent.map((content) => (
            <Card 
              key={content.id}
              className="min-w-[calc(33.333%-1rem)] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => handleContentClick(content)}
            >
              <CardBody className="p-4">
                {/* Header met badges */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex gap-2">
                    <Chip
                      size="sm"
                      color={getTypeColor(content.type) as any}
                      startContent={getTypeIcon(content.type)}
                      className="text-xs"
                    >
                      {content.type}
                    </Chip>
                    {content.featured && (
                      <Badge color="warning" size="sm">
                        ⭐
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs">{content.rating}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-white mb-2 line-clamp-2">
                  {content.title}
                </h4>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                  {content.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Chip 
                      size="sm" 
                      color={getDifficultyColor(content.difficulty) as any}
                      className="text-xs"
                    >
                      {content.difficulty}
                    </Chip>
                    <span className="text-xs text-gray-400">{content.duration}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {content.tags.slice(0, 2).map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: Math.max(1, filteredContent.length - 2) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentDiscoveryCarousel;
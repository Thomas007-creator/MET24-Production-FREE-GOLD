/**
 * Content Discovery Carousel Provider - BMAD Architecture
 *
 * State management for content discovery carousel functionality
 *
 * @version 14.0.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ContentItem {
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

interface ContentDiscoveryContextType {
  // State
  currentIndex: number;
  contentItems: ContentItem[];
  filteredContent: ContentItem[];

  // Actions
  setCurrentIndex: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  handleContentClick: (content: ContentItem) => void;
}

const ContentDiscoveryContext = createContext<ContentDiscoveryContextType | undefined>(undefined);

interface ContentDiscoveryProviderProps {
  mbtiType: string;
  selectedLevensgebied?: string;
  onContentClick?: (content: ContentItem) => void;
  children: ReactNode;
}

export const ContentDiscoveryProvider: React.FC<ContentDiscoveryProviderProps> = ({
  mbtiType,
  selectedLevensgebied,
  onContentClick,
  children
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
        title: 'Actieve Imaginatie Basis',
        type: 'exercise',
        levensgebied: 'actieveImaginatie',
        mbtiOptimized: ['INFP', 'INFJ', 'ENFP', 'ENFJ'],
        difficulty: 'intermediate',
        duration: '25 min',
        rating: 4.9,
        description: 'Leer de basis van actieve imaginatie technieken voor persoonlijke groei.',
        tags: ['imagination', 'creativity', 'personal growth'],
        featured: true
      },
      {
        id: '3',
        title: 'Financiële Vrijheid Mindset',
        type: 'article',
        levensgebied: 'financieen',
        mbtiOptimized: ['INTJ', 'ENTJ', 'INTP', 'ENTP'],
        difficulty: 'advanced',
        duration: '10 min',
        rating: 4.6,
        description: 'Ontwikkel een strategische mindset voor financiële onafhankelijkheid.',
        tags: ['finance', 'mindset', 'strategy'],
        featured: false
      },
      {
        id: '4',
        title: 'Diepe Relatieverbindingen',
        type: 'video',
        levensgebied: 'partnerschap',
        mbtiOptimized: ['INFJ', 'ENFJ', 'ISFJ', 'ESFJ'],
        difficulty: 'intermediate',
        duration: '20 min',
        rating: 4.7,
        description: 'Video gids voor het opbouwen van betekenisvolle relatieverbindingen.',
        tags: ['relationships', 'connection', 'communication'],
        featured: true
      },
      {
        id: '5',
        title: 'Professionele Ontwikkeling Roadmap',
        type: 'guide',
        levensgebied: 'professioneleOntwikkeling',
        mbtiOptimized: ['ENTJ', 'INTJ', 'ENFJ', 'INFJ'],
        difficulty: 'advanced',
        duration: '30 min',
        rating: 4.8,
        description: 'Complete roadmap voor carrièreontwikkeling afgestemd op je persoonlijkheid.',
        tags: ['career', 'development', 'planning'],
        featured: false
      },
      {
        id: '6',
        title: 'Basis Behoeften Optimalisatie',
        type: 'exercise',
        levensgebied: 'basisBehoeften',
        mbtiOptimized: ['ISFJ', 'ESFJ', 'ISTJ', 'ESTJ'],
        difficulty: 'beginner',
        duration: '12 min',
        rating: 4.5,
        description: 'Praktische oefeningen om je leefomgeving te optimaliseren.',
        tags: ['environment', 'organization', 'wellness'],
        featured: false
      },
      {
        id: '7',
        title: 'Mentale Gezondheid Tracking',
        type: 'guide',
        levensgebied: 'mentaleGezondheid',
        mbtiOptimized: ['INFP', 'INFJ', 'ISFP', 'INTP'],
        difficulty: 'beginner',
        duration: '18 min',
        rating: 4.7,
        description: 'Leer je mentale gezondheid effectief te monitoren en verbeteren.',
        tags: ['mental health', 'tracking', 'self-care'],
        featured: true
      },
      {
        id: '8',
        title: 'Fysieke Gezondheid Routine',
        type: 'video',
        levensgebied: 'fysiekeGezondheid',
        mbtiOptimized: ['ESTP', 'ESFP', 'ISTP', 'ISFP'],
        difficulty: 'beginner',
        duration: '22 min',
        rating: 4.6,
        description: 'Bouw een duurzame fysieke gezondheidsroutine op.',
        tags: ['physical health', 'routine', 'fitness'],
        featured: false
      }
    ];

    setContentItems(mockContent);
  }, []);

  useEffect(() => {
    // Filter content based on MBTI type and selected levensgebied
    let filtered = contentItems.filter(item =>
      item.mbtiOptimized.includes(mbtiType)
    );

    if (selectedLevensgebied) {
      filtered = filtered.filter(item =>
        item.levensgebied === selectedLevensgebied
      );
    }

    // Prioritize featured content
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });

    setFilteredContent(filtered);
    setCurrentIndex(0); // Reset to first slide when filtering changes
  }, [contentItems, mbtiType, selectedLevensgebied]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === filteredContent.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredContent.length - 1 : prevIndex - 1
    );
  };

  const handleContentClick = (content: ContentItem) => {
    onContentClick?.(content);
  };

  const value: ContentDiscoveryContextType = {
    currentIndex,
    contentItems,
    filteredContent,
    setCurrentIndex,
    nextSlide,
    prevSlide,
    handleContentClick
  };

  return (
    <ContentDiscoveryContext.Provider value={value}>
      {children}
    </ContentDiscoveryContext.Provider>
  );
};

export const useContentDiscovery = () => {
  const context = useContext(ContentDiscoveryContext);
  if (context === undefined) {
    throw new Error('useContentDiscovery must be used within a ContentDiscoveryProvider');
  }
  return context;
};
/**
 * BackToBasics Page Provider - BMAD Architecture
 *
 * Centralized state management and business logic for Back to Basics features
 *
 * @version 14.0.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useFeatureParallax } from '../parallax/FeatureParallaxManager';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import BMADColorSystem, { LevensgebiedenColors } from '../../lib/bmadColorSystem';

export interface LifeArea {
  id: string;
  name: string;
  displayName: string;
  color: string;
  description: string;
  mbtiFocus: string;
  contentCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface BackToBasicsContextType {
  // State
  lifeAreaProgress: {[key: string]: number};
  mbtiInsights: {[key: string]: string[]};
  mbtiType: string;
  userName: string;
  personalityColorScheme: any;

  // Data
  lifeAreas: LifeArea[];

  // Actions
  handleLifeAreaClick: (areaId: string) => void;
  handleBackToMain: () => void;
  getButtonColorFromGradient: (gradient: string) => string;
  getProgressColorFromGradient: (gradient: string) => string;
}

const BackToBasicsContext = createContext<BackToBasicsContextType | undefined>(undefined);

interface BackToBasicsProviderProps {
  children: ReactNode;
}

export const BackToBasicsProvider: React.FC<BackToBasicsProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [lifeAreaProgress, setLifeAreaProgress] = useState<{[key: string]: number}>({});
  const [mbtiInsights, setMbtiInsights] = useState<{[key: string]: string[]}>({});

  const mbtiType = userData?.mbtiType || 'INFP';
  const userName = userData?.name || 'Gebruiker';

  // Set feature parallax voor basics achtergrond
  const { setFeature } = useFeatureParallax();

  // Swipe navigation - bidirectional
  useSwipeNavigation({
    swipeLeft: '/',           // < gesture terug naar mainview
    swipeRight: '/ai-buddy',  // > gesture naar Active Imagination
    enabled: true,
    sensitivity: 100
  });

  useEffect(() => {
    // Set basics achtergrond
    setFeature('back-to-basics');
  }, [setFeature]);

  // Load progress data
  useEffect(() => {
    // Mock progress data - in real app, load from database
    const mockProgress = {
      psychischeGezondheid: 75,
      lichamelijkeGezondheid: 60,
      financieen: 45,
      werkSamenleving: 80,
      hobbyPassies: 90,
      actieveImaginatie: 85,
      professioneleOntwikkeling: 70,
      socialeRelaties: 65,
      thuisOmgeving: 55,
    };
    setLifeAreaProgress(mockProgress);

    // MBTI-specific insights for each life area
    const mockInsights = {
      psychischeGezondheid: [
        'INFP: Focus op emotionele expressie en creativiteit',
        'Mindfulness oefeningen passen goed bij je introverte natuur',
        'Grenzen stellen is cruciaal voor je energie'
      ],
      lichamelijkeGezondheid: [
        'INFP: Combineer beweging met creatieve activiteiten',
        'Yoga en wandelen in de natuur zijn ideaal',
        'Luister naar je lichaam en neem rust wanneer nodig'
      ],
      financieen: [
        'INFP: Automatiseer financiële taken waar mogelijk',
        'Focus op waarden-gebaseerde uitgaven',
        'Stel duidelijke doelen voor financiële vrijheid'
      ]
    };
    setMbtiInsights(mockInsights);
  }, [mbtiType]);

  // Get user's personality-based color scheme
  const personalityColorScheme = BMADColorSystem.getPersonalityColorScheme(mbtiType);

  const lifeAreas: LifeArea[] = [
    {
      id: 'actieveImaginatie',
      name: 'Actieve Imaginatie',
      displayName: LevensgebiedenColors['Actieve Imaginatie'].emoji + ' Actieve Imaginatie',
      color: LevensgebiedenColors['Actieve Imaginatie'].gradient,
      description: 'Imagination coaching en resources',
      mbtiFocus: 'Innerlijke wereld en verbeeldingskracht',
      contentCount: 20,
      difficulty: 'intermediate'
    },
    {
      id: 'werkSamenleving',
      name: 'Werk & Samenleving',
      displayName: LevensgebiedenColors['Werk & Samenleving'].emoji + ' Werk & Samenleving',
      color: LevensgebiedenColors['Werk & Samenleving'].gradient,
      description: 'Career development en balance',
      mbtiFocus: 'Authentieke carrière en betekenisvol werk',
      contentCount: 10,
      difficulty: 'intermediate'
    },
    {
      id: 'professioneleOntwikkeling',
      name: 'Professionele Ontwikkeling',
      displayName: LevensgebiedenColors['Professionele Ontwikkeling'].emoji + ' Professionele Ontwikkeling',
      color: LevensgebiedenColors['Professionele Ontwikkeling'].gradient,
      description: 'Professional growth en skills',
      mbtiFocus: 'Persoonlijke groei en vaardigheden',
      contentCount: 14,
      difficulty: 'advanced'
    },
    {
      id: 'financieen',
      name: 'Financiën',
      displayName: LevensgebiedenColors['Financiën'].emoji + ' Financiën',
      color: LevensgebiedenColors['Financiën'].gradient,
      description: 'Financial planning en security',
      mbtiFocus: 'Waarden-gebaseerde financiële keuzes',
      contentCount: 6,
      difficulty: 'advanced'
    },
    {
      id: 'familie',
      name: 'Familie & Vrienden',
      displayName: LevensgebiedenColors['Familie & Vrienden'].emoji + ' Familie & Vrienden',
      color: LevensgebiedenColors['Familie & Vrienden'].gradient,
      description: 'Relationship coaching en privacy',
      mbtiFocus: 'Diepe verbindingen en empathie',
      contentCount: 9,
      difficulty: 'intermediate'
    },
    {
      id: 'partnerschap',
      name: 'Partnerschap',
      displayName: LevensgebiedenColors['Partnerschap'].emoji + ' Partnerschap',
      color: LevensgebiedenColors['Partnerschap'].gradient,
      description: 'Relationship coaching en intimiteit',
      mbtiFocus: 'Diepe verbindingen en romantiek',
      contentCount: 8,
      difficulty: 'intermediate'
    },
    {
      id: 'basisBehoeften',
      name: 'Basis Behoeften',
      displayName: LevensgebiedenColors['Basis Behoeften'].emoji + ' Basis Behoeften',
      color: LevensgebiedenColors['Basis Behoeften'].gradient,
      description: 'Environment optimization en resources',
      mbtiFocus: 'Inspirerende en rustige omgeving',
      contentCount: 7,
      difficulty: 'beginner'
    },
    {
      id: 'mentaleGezondheid',
      name: 'Mentale Gezondheid',
      displayName: LevensgebiedenColors['Mentale Gezondheid'].emoji + ' Mentale Gezondheid',
      color: LevensgebiedenColors['Mentale Gezondheid'].gradient,
      description: 'Mental health coaching en tracking',
      mbtiFocus: 'Emotionele expressie en creativiteit',
      contentCount: 12,
      difficulty: 'beginner'
    },
    {
      id: 'fysiekeGezondheid',
      name: 'Fysieke Gezondheid',
      displayName: LevensgebiedenColors['Fysieke Gezondheid'].emoji + ' Fysieke Gezondheid',
      color: LevensgebiedenColors['Fysieke Gezondheid'].gradient,
      description: 'Physical health coaching en tracking',
      mbtiFocus: 'Beweging gecombineerd met creativiteit',
      contentCount: 11,
      difficulty: 'beginner'
    }
  ];

  const handleLifeAreaClick = (areaId: string) => {
    // Navigation logic will be handled in the composition root
    console.log('Navigate to life area:', areaId);
  };

  const handleBackToMain = () => {
    // Navigation logic will be handled in the composition root
    console.log('Navigate back to main');
  };

  // Use BMAD color system utilities
  const getButtonColorFromGradient = (gradient: string) => {
    return BMADColorSystem.getButtonColorFromGradient(gradient);
  };

  const getProgressColorFromGradient = (gradient: string) => {
    // Map BMAD gradients to NextUI progress colors based on psychological properties
    if (gradient.includes('green') || gradient.includes('teal')) return 'success';
    if (gradient.includes('yellow') || gradient.includes('orange')) return 'warning';
    if (gradient.includes('red') || gradient.includes('pink')) return 'danger';
    if (gradient.includes('purple') || gradient.includes('indigo')) return 'secondary';
    return 'primary';
  };

  const value: BackToBasicsContextType = {
    lifeAreaProgress,
    mbtiInsights,
    mbtiType,
    userName,
    personalityColorScheme,
    lifeAreas,
    handleLifeAreaClick,
    handleBackToMain,
    getButtonColorFromGradient,
    getProgressColorFromGradient
  };

  return (
    <BackToBasicsContext.Provider value={value}>
      {children}
    </BackToBasicsContext.Provider>
  );
};

export const useBackToBasics = () => {
  const context = useContext(BackToBasicsContext);
  if (context === undefined) {
    throw new Error('useBackToBasics must be used within a BackToBasicsProvider');
  }
  return context;
};
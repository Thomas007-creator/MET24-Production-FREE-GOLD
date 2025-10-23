import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Progress, Button, Chip } from '@nextui-org/react';
import {
  BookOpen,
  Play,
  BarChart3,
  Users,
  TrendingUp,
  Bot,
  ArrowLeft,
  Home,
  Target,
  Star,
  Brain,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useFeatureParallax } from '../parallax/FeatureParallaxManager';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import ContentDiscoveryCarousel from './ContentDiscoveryCarousel';
import BMADColorSystem, { LevensgebiedenColors } from '../../lib/bmadColorSystem';
// import { logger } from '../../utils/logger';

const BackToBasicsPage: React.FC = () => {
  const navigate = useNavigate();
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

  const lifeAreas = [
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
    navigate(`/levensgebied/${areaId}`);
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

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <div className='p-6'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>
                💪 Back to Basics - 9 Levensgebieden
              </h1>
              <p className='text-gray-300'>
                Welkom {userName}! Ontdek gepersonaliseerde content voor jouw {mbtiType} persoonlijkheidstype
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
                onClick={() => navigate('/')}
                className='bg-white/10 border-white/20 text-white hover:bg-white/20'
              >
                Hoofdmenu
              </Button>
            </div>
          </div>

          {/* MBTI Overview */}
          <div className='glass rounded-xl p-6 mb-8'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-white mb-2'>
                  🧠 Jouw {mbtiType} Persoonlijkheid
                </h2>
                <p className='text-gray-300'>
                  Gepersonaliseerde levensgebied focus gebaseerd op je MBTI type
                </p>
              </div>
              <div className='text-right'>
                <div className='text-2xl font-bold text-purple-400'>{mbtiType}</div>
                <div className='text-sm text-gray-400'>Persoonlijkheidstype</div>
              </div>
            </div>
          </div>

          {/* Content Discovery Carousel */}
          <div className='glass rounded-xl p-6 mb-8'>
            <ContentDiscoveryCarousel 
              mbtiType={mbtiType}
              onContentClick={(content) => {
                console.log('Content clicked:', content.title);
                // TODO: Navigate to content detail page
              }}
            />
          </div>
        </div>
      </div>

      {/* Content - BMAD Enhanced Life Areas */}
      <div className='max-w-7xl mx-auto p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {lifeAreas.map(area => {
            const areaColorScheme = BMADColorSystem.getFunctionalColorScheme('backToBasics');
            const animationClasses = BMADColorSystem.getAnimationClasses(areaColorScheme);
            const glassmorphismClasses = BMADColorSystem.getGlassmorphismClasses(areaColorScheme);
            
            return (
              <Card
                key={area.id}
                className={`bg-gradient-to-br ${area.color} ${glassmorphismClasses} ${animationClasses} cursor-pointer shadow-lg hover:shadow-xl`}
                onClick={() => handleLifeAreaClick(area.id)}
              >
                <CardBody className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='text-xl font-bold text-white mb-2'>{area.displayName}</h3>
                      <p className='text-gray-100 text-sm mb-2 font-medium'>{area.description}</p>
                      <p className='text-white/80 text-sm font-medium bg-white/10 px-3 py-1 rounded-full'>
                        💡 {area.mbtiFocus}
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='text-lg font-bold text-white bg-white/20 px-3 py-1 rounded-full'>
                        {area.contentCount}
                      </div>
                      <div className='text-xs text-gray-200 mt-1'>content items</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='mb-4'>
                    <div className='flex justify-between text-sm text-gray-100 mb-2'>
                      <span className='font-medium'>Voortgang</span>
                      <span className='font-bold'>{lifeAreaProgress[area.id] || 0}%</span>
                    </div>
                    <Progress
                      value={lifeAreaProgress[area.id] || 0}
                      color={getProgressColorFromGradient(area.color)}
                      className='mb-2'
                      classNames={{
                        track: "bg-white/20 backdrop-blur-sm",
                        indicator: "bg-white/90 shadow-lg"
                      }}
                    />
                  </div>

                  {/* Tags */}
                  <div className='flex items-center justify-between mb-4'>
                    <Chip
                      size='sm'
                      variant='flat'
                      className='bg-white/30 backdrop-blur-sm border border-white/40 text-white font-bold shadow-md'
                    >
                      {area.difficulty}
                    </Chip>
                    <div className='flex items-center text-sm text-gray-100 bg-white/10 px-2 py-1 rounded-full'>
                      <Star className='w-4 h-4 mr-1' />
                      <span className='font-medium'>{mbtiInsights[area.id]?.length || 0} inzichten</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size='sm'
                    className={`w-full text-white font-medium shadow-lg ${getButtonColorFromGradient(area.color)}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLifeAreaClick(area.id);
                    }}
                  >
                    <Target className='w-4 h-4 mr-2' />
                    Verken Levensgebied
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className='mt-12 glass rounded-xl p-6'>
          <h2 className='text-2xl font-bold mb-4 text-white'>
            Over Back to Basics
          </h2>
          <p className='text-gray-300 mb-6'>
            Elk levensgebied bevat uitgebreide functionaliteiten voor
            persoonlijke ontwikkeling, afgestemd op jouw {mbtiType} persoonlijkheidstype:
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
                <BookOpen className='w-4 h-4 text-blue-400' />
              </div>
              <span className='text-white'>Overzicht & Inleiding</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
                <Play className='w-4 h-4 text-green-400' />
              </div>
              <span className='text-white'>Praktische Oefeningen</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
                <BarChart3 className='w-4 h-4 text-purple-400' />
              </div>
              <span className='text-white'>Vragenlijsten & Tracking</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
                <Users className='w-4 h-4 text-orange-400' />
              </div>
              <span className='text-white'>Community & Events</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
                <TrendingUp className='w-4 h-4 text-red-400' />
              </div>
              <span className='text-white'>Progressie Monitoring</span>
            </div>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center'>
                <Bot className='w-4 h-4 text-indigo-400' />
              </div>
              <span className='text-white'>AI Coaching</span>
            </div>
          </div>

          {/* MBTI-specific features */}
          <div className='mt-8 p-4 bg-white/5 rounded-lg'>
            <h3 className='text-lg font-semibold text-white mb-3'>
              🧠 {mbtiType} Specifieke Features
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3'>
                <Brain className='w-5 h-5 text-purple-400' />
                <span className='text-gray-300'>Gepersonaliseerde content aanbevelingen</span>
              </div>
              <div className='flex items-center gap-3'>
                <Target className='w-5 h-5 text-purple-400' />
                <span className='text-gray-300'>MBTI-gebaseerde leerpaden</span>
              </div>
              <div className='flex items-center gap-3'>
                <Star className='w-5 h-5 text-purple-400' />
                <span className='text-gray-300'>Persoonlijkheidsspecifieke inzichten</span>
              </div>
              <div className='flex items-center gap-3'>
                <Bot className='w-5 h-5 text-purple-400' />
                <span className='text-gray-300'>AI coaching afgestemd op je type</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackToBasicsPage;

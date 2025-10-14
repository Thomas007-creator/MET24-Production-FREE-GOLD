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
// import { logger } from '../../utils/logger';

const BackToBasicsPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAppStore();
  const [lifeAreaProgress, setLifeAreaProgress] = useState<{[key: string]: number}>({});
  const [mbtiInsights, setMbtiInsights] = useState<{[key: string]: string[]}>({});

  const mbtiType = userData?.mbtiType || 'INFP';
  const userName = userData?.name || 'Gebruiker';

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

  const lifeAreas = [
    {
      id: 'psychischeGezondheid',
      name: '🧠 Psychische Gezondheid',
      color: 'from-blue-500 to-purple-600',
      description: 'Mental health coaching en tracking',
      mbtiFocus: 'Emotionele expressie en creativiteit',
      contentCount: 12,
      difficulty: 'beginner'
    },
    {
      id: 'lichamelijkeGezondheid',
      name: '💪 Lichamelijke Gezondheid',
      color: 'from-green-500 to-teal-600',
      description: 'Physical health optimization',
      mbtiFocus: 'Natuurlijke beweging en lichaamsbewustzijn',
      contentCount: 8,
      difficulty: 'intermediate'
    },
    {
      id: 'financieen',
      name: '💰 Financiën',
      color: 'from-purple-500 to-pink-600',
      description: 'Financial planning en security',
      mbtiFocus: 'Waarden-gebaseerde financiële keuzes',
      contentCount: 6,
      difficulty: 'advanced'
    },
    {
      id: 'werkSamenleving',
      name: '💼 Werk & Samenleving',
      color: 'from-orange-500 to-red-600',
      description: 'Career development en balance',
      mbtiFocus: 'Authentieke carrière en betekenisvol werk',
      contentCount: 10,
      difficulty: 'intermediate'
    },
    {
      id: 'hobbyPassies',
      name: "🎨 Hobby's & Passies",
      color: 'from-pink-500 to-rose-600',
      description: 'Creativity coaching en inspiration',
      mbtiFocus: 'Creatieve expressie en artistieke ontwikkeling',
      contentCount: 15,
      difficulty: 'beginner'
    },
    {
      id: 'actieveImaginatie',
      name: '🧘 Actieve Imaginatie',
      color: 'from-indigo-500 to-blue-600',
      description: 'Imagination coaching en resources',
      mbtiFocus: 'Innerlijke wereld en verbeeldingskracht',
      contentCount: 20,
      difficulty: 'intermediate'
    },
    {
      id: 'professioneleOntwikkeling',
      name: '📈 Professionele Ontwikkeling',
      color: 'from-emerald-500 to-green-600',
      description: 'Professional growth en skills',
      mbtiFocus: 'Persoonlijke groei en vaardigheden',
      contentCount: 14,
      difficulty: 'advanced'
    },
    {
      id: 'socialeRelaties',
      name: '❤️ Sociale en Liefdesrelaties',
      color: 'from-red-500 to-pink-600',
      description: 'Relationship coaching en privacy',
      mbtiFocus: 'Diepe verbindingen en empathie',
      contentCount: 9,
      difficulty: 'intermediate'
    },
    {
      id: 'thuisOmgeving',
      name: '🏡 Thuis en Omgeving',
      color: 'from-yellow-500 to-orange-600',
      description: 'Environment optimization en resources',
      mbtiFocus: 'Inspirerende en rustige omgeving',
      contentCount: 7,
      difficulty: 'beginner'
    },
  ];

  const handleLifeAreaClick = (areaId: string) => {
    navigate(`/levensgebied/${areaId}`);
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
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
        </div>
      </div>

      {/* Content */}
      <div className='max-w-7xl mx-auto p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {lifeAreas.map(area => (
            <Card
              key={area.id}
              className='glass border border-white/10 hover:bg-white/10 transition-all cursor-pointer'
              onClick={() => handleLifeAreaClick(area.id)}
            >
              <CardBody className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-white mb-2'>{area.name}</h3>
                    <p className='text-gray-300 text-sm mb-2'>{area.description}</p>
                    <p className='text-purple-300 text-sm font-medium'>{area.mbtiFocus}</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-lg font-bold text-white'>{area.contentCount}</div>
                    <div className='text-xs text-gray-400'>content items</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='mb-4'>
                  <div className='flex justify-between text-sm text-gray-300 mb-1'>
                    <span>Voortgang</span>
                    <span>{lifeAreaProgress[area.id] || 0}%</span>
                  </div>
                  <Progress
                    value={lifeAreaProgress[area.id] || 0}
                    color='primary'
                    className='mb-2'
                  />
                </div>

                {/* Tags */}
                <div className='flex items-center justify-between mb-4'>
                  <Chip
                    size='sm'
                    variant='flat'
                    className='bg-white/10 text-white'
                  >
                    {area.difficulty}
                  </Chip>
                  <div className='flex items-center text-sm text-gray-400'>
                    <Star className='w-4 h-4 mr-1' />
                    {mbtiInsights[area.id]?.length || 0} inzichten
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  color='primary'
                  variant='solid'
                  className='w-full bg-purple-600 hover:bg-purple-700'
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
          ))}
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

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Badge } from '@nextui-org/react';
import { 
  ArrowLeft, 
  Home, 
  TrendingUp, 
  TrendingDown,
  Target,
  Star,
  Brain,
  Heart,
  DollarSign,
  Briefcase,
  Palette,
  Lightbulb,
  GraduationCap,
  Users,
  Home as HomeIcon,
  BarChart3,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';

interface LifeArea {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
  mbtiFocus: string;
  recommendations: string[];
}

interface WellnessScore {
  overall: number;
  physical: number;
  mental: number;
  social: number;
  professional: number;
  spiritual: number;
}

interface HolisticWellnessDashboardProps {
  isEmbedded?: boolean;
}

const HolisticWellnessDashboard: React.FC<HolisticWellnessDashboardProps> = ({ isEmbedded = false }) => {
  const { userData } = useAppStore();
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [wellnessScore, setWellnessScore] = useState<WellnessScore>({
    overall: 0,
    physical: 0,
    mental: 0,
    social: 0,
    professional: 0,
    spiritual: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [showDetailedView, setShowDetailedView] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const mbtiType = userData?.mbtiType || 'INFP';
  const userName = userData?.name || 'Gebruiker';

  // Load life areas data
  useEffect(() => {
    const mockLifeAreas: LifeArea[] = [
      {
        id: 'psychischeGezondheid',
        name: 'Psychische Gezondheid',
        icon: <Brain className="w-5 h-5" />,
        color: 'purple',
        score: 75,
        previousScore: 70,
        trend: 'up',
        description: 'Emotioneel welzijn en mentale gezondheid',
        mbtiFocus: 'INFP: Focus op emotionele expressie en creativiteit',
        recommendations: [
          'Dagelijkse mindfulness oefeningen',
          'Creatieve uitlaatklep vinden',
          'Grenzen stellen voor energiebehoud'
        ]
      },
      {
        id: 'lichamelijkeGezondheid',
        name: 'Lichamelijke Gezondheid',
        icon: <Heart className="w-5 h-5" />,
        color: 'red',
        score: 60,
        previousScore: 65,
        trend: 'down',
        description: 'Fysieke gezondheid en vitaliteit',
        mbtiFocus: 'INFP: Zachte beweging en natuur verbinding',
        recommendations: [
          'Wandelen in de natuur',
          'Yoga of tai chi',
          'Regelmatige slaaproutine'
        ]
      },
      {
        id: 'financieen',
        name: 'Financiën',
        icon: <DollarSign className="w-5 h-5" />,
        color: 'green',
        score: 45,
        previousScore: 40,
        trend: 'up',
        description: 'Financiële stabiliteit en planning',
        mbtiFocus: 'INFP: Automatische spaarplannen en budget apps',
        recommendations: [
          'Automatische spaarrekening opzetten',
          'Budget app gebruiken',
          'Financiële doelen stellen'
        ]
      },
      {
        id: 'werkSamenleving',
        name: 'Werk & Samenleving',
        icon: <Briefcase className="w-5 h-5" />,
        color: 'blue',
        score: 80,
        previousScore: 75,
        trend: 'up',
        description: 'Werktevredenheid en maatschappelijke betrokkenheid',
        mbtiFocus: 'INFP: Zinvol werk dat past bij waarden',
        recommendations: [
          'Werk zoeken dat bij waarden past',
          'Vrijwilligerswerk overwegen',
          'Werk-privé balans verbeteren'
        ]
      },
      {
        id: 'hobbyPassies',
        name: 'Hobby\'s & Passies',
        icon: <Palette className="w-5 h-5" />,
        color: 'pink',
        score: 90,
        previousScore: 85,
        trend: 'up',
        description: 'Creatieve uitdrukking en persoonlijke interesses',
        mbtiFocus: 'INFP: Creatieve hobby\'s en artistieke expressie',
        recommendations: [
          'Nieuwe creatieve hobby proberen',
          'Kunst of muziek maken',
          'Tijd reserveren voor passies'
        ]
      },
      {
        id: 'actieveImaginatie',
        name: 'Actieve Imaginatie',
        icon: <Lightbulb className="w-5 h-5" />,
        color: 'yellow',
        score: 85,
        previousScore: 80,
        trend: 'up',
        description: 'Innerlijke groei en spirituele ontwikkeling',
        mbtiFocus: 'INFP: Meditatie en innerlijke reflectie',
        recommendations: [
          'Dagelijkse meditatie',
          'Journaling voor zelfreflectie',
          'Natuur contemplatie'
        ]
      },
      {
        id: 'professioneleOntwikkeling',
        name: 'Professionele Ontwikkeling',
        icon: <GraduationCap className="w-5 h-5" />,
        color: 'indigo',
        score: 70,
        previousScore: 68,
        trend: 'up',
        description: 'Leer- en groeimogelijkheden',
        mbtiFocus: 'INFP: Persoonlijke groei en vaardigheden',
        recommendations: [
          'Online cursussen volgen',
          'Mentor zoeken',
          'Nieuwe vaardigheden leren'
        ]
      },
      {
        id: 'socialeRelaties',
        name: 'Sociale Relaties',
        icon: <Users className="w-5 h-5" />,
        color: 'teal',
        score: 65,
        previousScore: 70,
        trend: 'down',
        description: 'Vriendschappen en sociale verbindingen',
        mbtiFocus: 'INFP: Diepe, betekenisvolle relaties',
        recommendations: [
          'Kwaliteit boven kwantiteit',
          'Regelmatig contact met vrienden',
          'Nieuwe gelijkgestemden ontmoeten'
        ]
      },
      {
        id: 'thuisOmgeving',
        name: 'Thuis & Omgeving',
        icon: <HomeIcon className="w-5 h-5" />,
        color: 'orange',
        score: 55,
        previousScore: 50,
        trend: 'up',
        description: 'Woonomgeving en fysieke ruimte',
        mbtiFocus: 'INFP: Rustige, inspirerende omgeving',
        recommendations: [
          'Woonruimte personaliseren',
          'Natuur elementen toevoegen',
          'Rustige hoek creëren'
        ]
      }
    ];

    setLifeAreas(mockLifeAreas);

    // Calculate overall wellness score
    const totalScore = mockLifeAreas.reduce((sum, area) => sum + area.score, 0);
    const overallScore = Math.round(totalScore / mockLifeAreas.length);

    // Calculate category scores
    const physicalScore = Math.round((mockLifeAreas[1].score + mockLifeAreas[8].score) / 2); // Lichamelijke + Thuis
    const mentalScore = Math.round((mockLifeAreas[0].score + mockLifeAreas[5].score) / 2); // Psychische + Actieve Imaginatie
    const socialScore = Math.round((mockLifeAreas[3].score + mockLifeAreas[7].score) / 2); // Werk & Samenleving + Sociale Relaties
    const professionalScore = Math.round((mockLifeAreas[2].score + mockLifeAreas[6].score) / 2); // Financiën + Professionele Ontwikkeling
    const spiritualScore = Math.round((mockLifeAreas[4].score + mockLifeAreas[5].score) / 2); // Hobby's + Actieve Imaginatie

    setWellnessScore({
      overall: overallScore,
      physical: physicalScore,
      mental: mentalScore,
      social: socialScore,
      professional: professionalScore,
      spiritual: spiritualScore
    });
  }, []);

  // Draw radar chart
  useEffect(() => {
    if (canvasRef.current && lifeAreas.length > 0) {
      drawRadarChart();
    }
  }, [lifeAreas, selectedTimeframe]);

  const drawRadarChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const numAreas = lifeAreas.length;
    const angleStep = (2 * Math.PI) / numAreas;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < numAreas; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw data points and area
    ctx.beginPath();
    lifeAreas.forEach((area, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const scoreRadius = (radius * area.score) / 100;
      const x = centerX + Math.cos(angle) * scoreRadius;
      const y = centerY + Math.sin(angle) * scoreRadius;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();

    // Fill area
    ctx.fillStyle = 'rgba(147, 51, 234, 0.2)';
    ctx.fill();

    // Draw border
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw data points
    lifeAreas.forEach((area, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const scoreRadius = (radius * area.score) / 100;
      const x = centerX + Math.cos(angle) * scoreRadius;
      const y = centerY + Math.sin(angle) * scoreRadius;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(147, 51, 234, 1)';
      ctx.fill();
    });

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'center';
    lifeAreas.forEach((area, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      ctx.fillText(area.name, x, y);
    });
  };

  const handleBackToMain = () => {
    window.history.back();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    if (score >= 40) return 'default';
    return 'danger';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              📊 Holistisch Welzijn Dashboard
            </h1>
            <p className='text-gray-300'>
              Welkom {userName}! Jouw {mbtiType} welzijn overzicht
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
          </div>
        </div>

        {/* Overall Wellness Score */}
        <div className='glass rounded-xl p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-2xl font-semibold text-white mb-2'>
                🎯 Jouw Holistische Welzijn Score
              </h2>
              <p className='text-gray-300'>
                Gebaseerd op de 9 levensgebieden en MBTI-specifieke inzichten
              </p>
            </div>
            <div className='text-right'>
              <div className={`text-4xl font-bold ${getScoreColor(wellnessScore.overall)}`}>
                {wellnessScore.overall}%
              </div>
              <div className='text-sm text-gray-400'>Totale Score</div>
            </div>
          </div>

          {/* Category Scores */}
          <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            {[
              { label: 'Fysiek', score: wellnessScore.physical, icon: <Heart className="w-4 h-4" /> },
              { label: 'Mentaal', score: wellnessScore.mental, icon: <Brain className="w-4 h-4" /> },
              { label: 'Sociaal', score: wellnessScore.social, icon: <Users className="w-4 h-4" /> },
              { label: 'Professioneel', score: wellnessScore.professional, icon: <Briefcase className="w-4 h-4" /> },
              { label: 'Spiritueel', score: wellnessScore.spiritual, icon: <Lightbulb className="w-4 h-4" /> }
            ].map((category) => (
              <div key={category.label} className='text-center'>
                <div className='flex items-center justify-center mb-2'>
                  {category.icon}
                  <span className='ml-2 text-sm text-gray-300'>{category.label}</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(category.score)}`}>
                  {category.score}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className='glass rounded-xl p-6 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold text-white'>
              📈 Welzijn Radar Chart
            </h2>
            <div className='flex gap-2'>
              {(['week', 'month', 'quarter'] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  size='sm'
                  variant={selectedTimeframe === timeframe ? 'solid' : 'bordered'}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={selectedTimeframe === timeframe ? 'bg-purple-600' : 'border-white/20 text-white'}
                >
                  {timeframe === 'week' ? 'Week' : timeframe === 'month' ? 'Maand' : 'Kwartaal'}
                </Button>
              ))}
            </div>
          </div>
          <div className='flex justify-center'>
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className='max-w-full h-auto'
            />
          </div>
        </div>

        {/* Life Areas Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          {lifeAreas.map((area) => (
            <Card key={area.id} className='glass border border-white/10 hover:bg-white/10 transition-all'>
              <CardBody className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <div className={`p-2 rounded-lg bg-${area.color}-500/20`}>
                      {area.icon}
                    </div>
                    <div>
                      <h3 className='font-semibold text-white'>{area.name}</h3>
                      <p className='text-sm text-gray-300'>{area.description}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className={`text-2xl font-bold ${getScoreColor(area.score)}`}>
                      {area.score}%
                    </div>
                    <div className='flex items-center justify-end mt-1'>
                      {getTrendIcon(area.trend)}
                      <span className='text-xs text-gray-400 ml-1'>
                        {area.trend === 'up' ? '+' : area.trend === 'down' ? '-' : '='}
                        {Math.abs(area.score - area.previousScore)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className='mb-4'>
                  <Progress
                    value={area.score}
                    color={getScoreBadgeColor(area.score) as any}
                    className='mb-2'
                  />
                </div>

                <div className='space-y-2 mb-4'>
                  <p className='text-sm text-purple-300 font-medium'>{area.mbtiFocus}</p>
                  <div className='text-xs text-gray-400'>
                    {area.recommendations.slice(0, 2).map((rec, index) => (
                      <div key={index}>• {rec}</div>
                    ))}
                  </div>
                </div>

                <Button
                  color='primary'
                  variant='solid'
                  size='sm'
                  className='w-full bg-purple-600 hover:bg-purple-700'
                >
                  <Target className='w-4 h-4 mr-2' />
                  Verbeter Dit Gebied
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-center gap-4'>
          <Button
            color='primary'
            variant='solid'
            startContent={<Download className='w-4 h-4' />}
            className='bg-purple-600 hover:bg-purple-700'
          >
            Download Rapport
          </Button>
          <Button
            color='secondary'
            variant='bordered'
            startContent={<Share2 className='w-4 h-4' />}
            className='border-white/20 text-white'
          >
            Deel Resultaten
          </Button>
          <Button
            color='secondary'
            variant='bordered'
            startContent={<RefreshCw className='w-4 h-4' />}
            className='border-white/20 text-white'
          >
            Update Scores
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HolisticWellnessDashboard;

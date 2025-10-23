import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip } from '@nextui-org/react';
import { 
  TrendingUp, 
  TrendingDown,
  Target,
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
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface LifeArea {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  score: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
}

const HolisticWellnessCard: React.FC = () => {
  const { userData } = useAppStore();
  const [lifeAreas, setLifeAreas] = useState<LifeArea[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const mbtiType = userData?.mbtiType || 'INFP';

  // Load life areas data
  useEffect(() => {
    const mockLifeAreas: LifeArea[] = [
      {
        id: 'psychischeGezondheid',
        name: 'Psychisch',
        icon: <Brain className="w-4 h-4" />,
        color: 'purple',
        score: 75,
        previousScore: 70,
        trend: 'up'
      },
      {
        id: 'lichamelijkeGezondheid',
        name: 'Lichamelijk',
        icon: <Heart className="w-4 h-4" />,
        color: 'red',
        score: 60,
        previousScore: 65,
        trend: 'down'
      },
      {
        id: 'financieen',
        name: 'Financiën',
        icon: <DollarSign className="w-4 h-4" />,
        color: 'green',
        score: 45,
        previousScore: 40,
        trend: 'up'
      },
      {
        id: 'werkSamenleving',
        name: 'Werk & Sociaal',
        icon: <Briefcase className="w-4 h-4" />,
        color: 'blue',
        score: 80,
        previousScore: 75,
        trend: 'up'
      },
      {
        id: 'hobbyPassies',
        name: 'Hobby\'s',
        icon: <Palette className="w-4 h-4" />,
        color: 'pink',
        score: 90,
        previousScore: 85,
        trend: 'up'
      },
      {
        id: 'actieveImaginatie',
        name: 'Spiritueel',
        icon: <Lightbulb className="w-4 h-4" />,
        color: 'yellow',
        score: 85,
        previousScore: 80,
        trend: 'up'
      },
      {
        id: 'professioneleOntwikkeling',
        name: 'Ontwikkeling',
        icon: <GraduationCap className="w-4 h-4" />,
        color: 'indigo',
        score: 70,
        previousScore: 68,
        trend: 'up'
      },
      {
        id: 'socialeRelaties',
        name: 'Relaties',
        icon: <Users className="w-4 h-4" />,
        color: 'teal',
        score: 65,
        previousScore: 70,
        trend: 'down'
      },
      {
        id: 'thuisOmgeving',
        name: 'Thuis',
        icon: <HomeIcon className="w-4 h-4" />,
        color: 'orange',
        score: 55,
        previousScore: 50,
        trend: 'up'
      }
    ];

    setLifeAreas(mockLifeAreas);

    // Calculate overall score
    const totalScore = mockLifeAreas.reduce((sum, area) => sum + area.score, 0);
    const overall = Math.round(totalScore / mockLifeAreas.length);
    setOverallScore(overall);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />;
      default: return <div className="w-3 h-3" />;
    }
  };

  return (
    <Card
      className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] shadow-lg hover:shadow-[0_0_30px_rgba(100,223,223,0.2)] hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2'
      role='article'
      aria-labelledby='wellness-title'
    >
      <CardHeader>
        <h3 id='wellness-title' className='text-xl font-bold'>
          📊 Holistisch Welzijn
        </h3>
      </CardHeader>
      <CardBody>
        <p className='mb-4'>
          Jouw {mbtiType} welzijn overzicht gebaseerd op 9 levensgebieden
        </p>

        {/* Overall Score */}
        <div className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
          <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center gap-2'>
              <span className='text-xl' aria-hidden='true'>
                🎯
              </span>
              <span className='font-semibold text-white'>Totale Welzijn Score</span>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
          </div>
          <Progress
            value={overallScore}
            color={overallScore >= 80 ? 'success' : overallScore >= 60 ? 'warning' : 'danger'}
            className='mb-2'
          />
          <p className='text-sm text-gray-300'>
            Gebaseerd op {lifeAreas.length} levensgebieden
          </p>
        </div>

        {/* Top 3 Life Areas */}
        <div className='space-y-3 mb-4'>
          <h4 className='text-sm font-semibold text-white'>Top 3 Gebieden:</h4>
          {lifeAreas
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((area, index) => (
            <div key={area.id} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-400'>#{index + 1}</span>
                {area.icon}
                <span className='text-sm text-white'>{area.name}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className={`text-sm font-semibold ${getScoreColor(area.score)}`}>
                  {area.score}%
                </span>
                {getTrendIcon(area.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom 3 Life Areas */}
        <div className='space-y-3 mb-4'>
          <h4 className='text-sm font-semibold text-white'>Verbetering Nodig:</h4>
          {lifeAreas
            .sort((a, b) => a.score - b.score)
            .slice(0, 3)
            .map((area, index) => (
            <div key={area.id} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-400'>#{index + 1}</span>
                {area.icon}
                <span className='text-sm text-white'>{area.name}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className={`text-sm font-semibold ${getScoreColor(area.score)}`}>
                  {area.score}%
                </span>
                {getTrendIcon(area.trend)}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button
          color='primary'
          variant='solid'
          onClick={() => window.location.href = '/wellness-dashboard'}
          className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
          aria-label='Bekijk volledig welzijn dashboard'
        >
          <BarChart3 className='w-4 h-4 mr-2' />
          Bekijk Volledig Dashboard
          <ArrowRight className='w-4 h-4 ml-2' />
        </Button>
      </CardBody>
    </Card>
  );
};

export default HolisticWellnessCard;

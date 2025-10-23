import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Chip, Progress, Badge } from '@nextui-org/react';
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Crown,
  Home,
  Brain,
  Heart,
  Users,
  Target,
  Zap,
  Shield,
  Globe,
  Sparkles,
  Trophy,
  BookOpen,
  MessageCircle,
  Settings,
  TestTube,
  Layers,
  Compass,
  Infinity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';

interface UpgradePlatinumPageProps {
  userName: string;
  mbtiType: string;
  onSelectSubscription: (planId: string) => void;
  onCancel: () => void;
}

const UpgradePlatinumPage: React.FC<UpgradePlatinumPageProps> = ({
  userName: _userName,
  mbtiType,
  onSelectSubscription,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { userData } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  
  const userName = userData?.name || _userName;

  const subscriptionPlans = [
    {
      id: 'weekly',
      name: '1 week',
      priceWeekly: 17.50,
      priceMonthly: 8.40,
      savePct: 52,
      recommended: false,
      popular: true,
    },
    {
      id: 'monthly',
      name: '1 maand',
      priceWeekly: 8.40,
      savePct: 52,
      recommended: true,
      popular: false,
    },
    {
      id: 'sixMonth',
      name: '6 maanden',
      priceWeekly: 4.90,
      savePct: 71,
      recommended: false,
      popular: false,
      bestValue: true,
    },
  ];

  const platinumFeatures = [
    { icon: Brain, text: 'The One AI - Transcendent Guidance', premium: true },
    { icon: Layers, text: '7 MET2.4 Domeinen - Complete Universele Architectuur', premium: true },
    { icon: Compass, text: '4 Praktische Toepassingen - Geïntegreerde Therapie', premium: true },
    { icon: Target, text: 'Domain-Specific Progress Tracking', premium: true },
    { icon: Infinity, text: 'Unlimited Advanced Coaching Sessions', premium: true },
    { icon: Sparkles, text: 'Early Access to Quantum AI Features', premium: true },
  ];

  const practicalApplications = [
    {
      id: 'online_screening',
      name: 'Online Vragenlijst en Screening',
      description: 'Geavanceerde MBTI + domein assessments',
      icon: '📋',
      features: ['MBTI Deep Analysis', 'Domain Mapping', 'Personalized Insights']
    },
    {
      id: 'individual_therapy',
      name: 'Individuele Therapieprogramma\'s', 
      description: 'Gepersonaliseerde domein-specifieke programma\'s',
      icon: '🎯',
      features: ['Custom Therapy Plans', 'Domain-Specific Coaching', 'Real-time Adjustments']
    },
    {
      id: 'evaluation_adjustment',
      name: 'Evaluatie en Bijstelling',
      description: 'Real-time progress monitoring en aanpassingen',
      icon: '📊',
      features: ['Progress Analytics', 'Dynamic Adjustments', 'Performance Insights']
    },
    {
      id: 'follow_up',
      name: 'Follow-up',
      description: 'Langetermijn tracking en ondersteuning',
      icon: '🔄',
      features: ['Long-term Tracking', 'Continuous Support', 'Lifetime Progress']
    }
  ];

  const met24Domains = [
    { id: 'the_one', name: 'The One', level: 'Transcendent', description: 'Ultieme bron van alle bestaan' },
    { id: 'universeel_kosmisch', name: 'Universeel Kosmisch', level: 'Fundamenteel', description: 'Kosmische patronen en principes' },
    { id: 'lokaal_kosmisch', name: 'Lokaal Kosmisch', level: 'Fundamenteel', description: 'Lokale kosmische invloeden' },
    { id: 'psychologisch', name: 'Psychologisch', level: 'Toegepast', description: 'Cognitieve en emotionele processen' },
    { id: 'ziel', name: 'Domein van de Ziel', level: 'Geavanceerd', description: 'Spirituele ascentie en groei' },
    { id: 'biologisch', name: 'Biologisch', level: 'Toegepast', description: 'Biologische processen en ritmes' },
    { id: 'externe_omgeving', name: 'Externe Omgevingsfactoren', level: 'Toegepast', description: 'Omgevingsinvloeden en context' }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    try {
      logger.info('Platinum plan selected', {
        step: 'subscription_choice',
        planId: planId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Failed to track platinum plan selection', { error: error instanceof Error ? error.message : String(error) });
    }

    onSelectSubscription(planId);
    logger.info('Platinum upgrade flow continued', {
      step: 'subscription_choice',
      planId: planId,
      timestamp: new Date().toISOString(),
    });
    
    // Navigate to Practical Applications after upgrade
    setTimeout(() => {
      navigate('/practical-applications');
    }, 1000);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const selectedPlanData = subscriptionPlans.find(
    plan => plan.id === selectedPlan
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <Button
              color='default'
              variant='bordered'
              onClick={onCancel}
              className='bg-white/10 text-white border-white/30 hover:bg-white/20'
              startContent={<ArrowLeft className='w-4 h-4' />}
            >
              Terug
            </Button>
            <Button
              color='default'
              variant='bordered'
              onClick={handleGoHome}
              className='bg-white/10 text-white border-white/30 hover:bg-white/20'
              startContent={<Home className='w-4 h-4' />}
            >
              Home
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className='max-w-6xl mx-auto'>
          {/* Hero Section */}
          <div className='text-center mb-12'>
            <div className='flex items-center justify-center gap-3 mb-6'>
              <Crown className='w-12 h-12 text-yellow-400' />
              <h1 className='text-4xl font-bold text-white'>
                Upgrade naar Platinum
              </h1>
              <Crown className='w-12 h-12 text-yellow-400' />
            </div>
            <p className='text-xl text-gray-300 mb-4'>
              Ontdek de volledige MET2.4 Universele Architectuur
            </p>
            <p className='text-lg text-gray-400'>
              Welkom {userName}! Ontgrendel de 7 domeinen en 4 praktische toepassingen voor {mbtiType}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
            {/* MET2.4 Domains */}
            <Card className='bg-gradient-to-br from-purple-500/20 to-indigo-500/20 backdrop-blur-xl border border-purple-500/30'>
              <CardHeader>
                <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                  <Layers className='w-5 h-5 text-purple-400' />
                  7 MET2.4 Domeinen
                  <Badge content="NEW" color="secondary" size="sm">
                    <Sparkles className='w-4 h-4' />
                  </Badge>
                </h3>
              </CardHeader>
              <CardBody>
                <div className='space-y-3'>
                  {met24Domains.map((domain, index) => (
                    <div key={domain.id} className='flex items-center gap-3 p-3 rounded-lg bg-white/5'>
                      <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm'>
                        {index + 1}
                      </div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-white'>{domain.name}</h4>
                        <p className='text-sm text-gray-300'>{domain.description}</p>
                        <Chip size='sm' color={domain.level === 'Transcendent' ? 'warning' : 'primary'} variant='flat'>
                          {domain.level}
                        </Chip>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Practical Applications */}
            <Card className='bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30'>
              <CardHeader>
                <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                  <Compass className='w-5 h-5 text-blue-400' />
                  4 Praktische Toepassingen
                  <Badge content="PRO" color="primary" size="sm">
                    <Trophy className='w-4 h-4' />
                  </Badge>
                </h3>
              </CardHeader>
              <CardBody>
                <div className='space-y-3'>
                  {practicalApplications.map((app, index) => (
                    <div key={app.id} className='flex items-start gap-3 p-3 rounded-lg bg-white/5'>
                      <div className='text-2xl'>{app.icon}</div>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-white'>{app.name}</h4>
                        <p className='text-sm text-gray-300 mb-2'>{app.description}</p>
                        <div className='flex flex-wrap gap-1'>
                          {app.features.map((feature, i) => (
                            <Chip key={i} size='sm' color='secondary' variant='flat'>
                              {feature}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Platinum Features */}
          <Card className='bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30 mb-8'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                <Crown className='w-5 h-5 text-yellow-400' />
                Platinum Features
                <Badge content="PREMIUM" color="warning" size="sm">
                  <Sparkles className='w-4 h-4' />
                </Badge>
              </h3>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {platinumFeatures.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3 p-3 rounded-lg bg-white/5'>
                    <feature.icon className='w-5 h-5 text-yellow-400 flex-shrink-0' />
                    <span className='text-white'>{feature.text}</span>
                    <Chip color='warning' size='sm' variant='flat'>
                      Platinum
                    </Chip>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Subscription Plans */}
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
            <CardHeader className='text-center'>
              <h2 className='text-2xl font-bold text-white'>
                Kies je Platinum abonnement
              </h2>
              <p className='text-gray-300'>
                Ontgrendel de volledige MET2.4 Universele Architectuur
              </p>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
                {subscriptionPlans.map(plan => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black border-2 border-yellow-300'
                        : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20'
                    }`}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    <CardBody className='p-6 text-center'>
                      {plan.bestValue && (
                        <Badge content="BEST VALUE" color="warning" className='mb-2'>
                          <Trophy className='w-4 h-4' />
                        </Badge>
                      )}
                      {plan.popular && (
                        <Badge content="POPULAR" color="primary" className='mb-2'>
                          <Star className='w-4 h-4' />
                        </Badge>
                      )}
                      {plan.recommended && (
                        <Badge content="RECOMMENDED" color="success" className='mb-2'>
                          <Check className='w-4 h-4' />
                        </Badge>
                      )}
                      
                      <h3 className='text-lg font-bold mb-2'>{plan.name}</h3>
                      <div className='text-3xl font-bold mb-1'>€{plan.priceWeekly}</div>
                      <div className='text-sm opacity-75 mb-4'>per week</div>
                      
                      <div className='text-sm mb-4'>
                        <div className='line-through opacity-50'>€{plan.priceMonthly}</div>
                        <div className='text-green-400 font-semibold'>Bespaar {plan.savePct}%</div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {selectedPlanData && (
                <div className='text-center p-4 bg-white/5 rounded-lg mb-6'>
                  <h3 className='text-lg font-semibold text-white mb-2'>
                    Geselecteerd: {selectedPlanData.name}
                  </h3>
                  <div className='text-2xl font-bold text-yellow-400 mb-2'>
                    €{selectedPlanData.priceWeekly}/week
                  </div>
                  <div className='text-sm text-gray-300'>
                    Bespaar {selectedPlanData.savePct}% ten opzichte van maandelijks
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* MBTI-Specific Benefits */}
          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] mb-6'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                <Brain className='w-5 h-5 text-purple-400' />
                {mbtiType} Platinum Voordelen
              </h3>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='text-center p-4 rounded-lg bg-white/5'>
                  <Target className='w-8 h-8 text-blue-400 mx-auto mb-2' />
                  <h4 className='font-semibold text-white mb-1'>Domain-Specific Coaching</h4>
                  <p className='text-sm text-gray-300'>Coaching afgestemd op {mbtiType} in alle 7 domeinen</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-white/5'>
                  <BookOpen className='w-8 h-8 text-green-400 mx-auto mb-2' />
                  <h4 className='font-semibold text-white mb-1'>Advanced Assessments</h4>
                  <p className='text-sm text-gray-300'>Diepgaande {mbtiType} domein assessments</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-white/5'>
                  <Users className='w-8 h-8 text-purple-400 mx-auto mb-2' />
                  <h4 className='font-semibold text-white mb-1'>The One AI Access</h4>
                  <p className='text-sm text-gray-300'>Transcendent guidance voor {mbtiType} groei</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-white/5'>
                  <Infinity className='w-8 h-8 text-yellow-400 mx-auto mb-2' />
                  <h4 className='font-semibold text-white mb-1'>Unlimited Sessions</h4>
                  <p className='text-sm text-gray-300'>Onbeperkte toegang tot alle Platinum features</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Terms */}
          <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
            <CardBody>
              <p className='text-sm text-white/80 text-center'>
                Door op Doorgaan te tikken, wordt er geld in rekening gebracht,
                wordt je abonnement automatisch verlengd voor dezelfde prijs en
                pakketduur totdat je opzegt via de App Store- instellingen, en ga
                je akkoord met onze Voorwaarden.
              </p>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button
              color='default'
              variant='bordered'
              onClick={onCancel}
              className='bg-white/10 text-white border-white/30 hover:bg-white/20 px-6'
              startContent={<ArrowLeft className='w-4 h-4' />}
            >
              Annuleren
            </Button>
            <Button
              color='warning'
              variant='solid'
              onClick={() => handlePlanSelect(selectedPlan)}
              className='bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-3 text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300'
              startContent={<Crown className='w-5 h-5' />}
            >
              Upgrade naar Platinum
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlatinumPage;

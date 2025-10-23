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
  TestTube
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import { 
  subscriptionPlansCollection, 
  userSubscriptionsCollection, 
  paymentTransactionsCollection,
  upgradeFlowEventsCollection,
  database 
} from '../database';

interface UpgradeGoldPageProps {
  userName: string;
  mbtiType: string;
  onSelectSubscription: (planId: string) => void;
  onCancel: () => void;
}

const UpgradeGoldPage: React.FC<UpgradeGoldPageProps> = ({
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
      priceWeekly: 14.99,
      priceMonthly: 6.87,
      savePct: 51,
      recommended: false,
      popular: true,
    },
    {
      id: 'monthly',
      name: '1 maand',
      priceWeekly: 6.87,
      savePct: 51,
      recommended: true,
      popular: false,
    },
    {
      id: 'sixMonth',
      name: '6 maanden',
      priceWeekly: 3.42,
      savePct: 76,
      recommended: false,
      popular: false,
      bestValue: true,
    },
  ];

  const features = [
    { icon: Brain, text: 'AI-Powered Coaching & Actieve Imaginatie', premium: true },
    { icon: BookOpen, text: 'Onbeperkte Journaling met MBTI Prompts', premium: true },
    { icon: Target, text: 'Premium Challenges & Achievement System', premium: true },
    { icon: Users, text: 'Exclusive MBTI Communities & Mentorship', premium: true },
    { icon: Heart, text: 'Holistic Wellness Dashboard & Tracking', premium: true },
    { icon: MessageCircle, text: 'Personal Chat & Community Features', premium: true },
    { icon: Globe, text: 'Offline Content Packs & Sync', premium: true },
    { icon: Zap, text: 'Advanced Content Curation & Recommendations', premium: true },
    { icon: Shield, text: 'Priority Support & Data Security', premium: true },
    { icon: Sparkles, text: 'Early Access to New Features', premium: true },
    { icon: TestTube, text: 'Loki AI Filtering Test Suite', premium: true },
  ];

  const currentFeatures = [
    { icon: BookOpen, text: 'Basis Journaling', premium: false },
    { icon: Target, text: 'Basis Challenges', premium: false },
    { icon: Users, text: 'Community Access', premium: false },
    { icon: Heart, text: 'Wellness Tracking', premium: false },
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    // Track upgrade flow event
    try {
      await database.write(async () => {
        await upgradeFlowEventsCollection.create((event: any) => {
          event.userId = userData?.id || 'anonymous';
          event.eventType = 'plan_selected';
          event.planId = planId;
          event.step = 'plan_selection';
          event.metadata = JSON.stringify({
            mbtiType: mbtiType,
            timestamp: new Date().toISOString(),
            sessionId: `upgrade_${Date.now()}`
          });
          event.sessionId = `upgrade_${Date.now()}`;
        });
      });
    } catch (error) {
      logger.error('Failed to track plan selection', { error: error instanceof Error ? error.message : String(error) });
    }

    logger.info('Subscription plan selected', {
      mbtiType: mbtiType,
      planId: planId,
      step: 'plan_selection',
      timestamp: new Date().toISOString(),
    });
  };

  const handleContinue = async () => {
    // Track payment started event
    try {
      await database.write(async () => {
        await upgradeFlowEventsCollection.create((event: any) => {
          event.userId = userData?.id || 'anonymous';
          event.eventType = 'payment_started';
          event.planId = selectedPlan;
          event.step = 'payment';
          event.metadata = JSON.stringify({
            mbtiType: mbtiType,
            timestamp: new Date().toISOString(),
            sessionId: `upgrade_${Date.now()}`
          });
          event.sessionId = `upgrade_${Date.now()}`;
        });
      });
    } catch (error) {
      logger.error('Failed to track payment start', { error: error instanceof Error ? error.message : String(error) });
    }

    onSelectSubscription(selectedPlan);
    logger.info('Upgrade flow continued', {
      step: 'subscription_choice',
      planId: selectedPlan,
      timestamp: new Date().toISOString(),
    });
    
    // Navigate to Smart Filtering Test after upgrade
    setTimeout(() => {
      navigate('/test-filtering');
    }, 1000);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const selectedPlanData = subscriptionPlans.find(
    plan => plan.id === selectedPlan
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Navigation Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <Button
              color='secondary'
              variant='bordered'
              startContent={<ArrowLeft />}
              onClick={onCancel}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Terug
            </Button>
            <Button
              color='primary'
              variant='bordered'
              startContent={<Home />}
              onClick={handleGoHome}
              className='bg-white/10 border-white/20 text-white hover:bg-white/20'
            >
              Hoofdmenu
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Chip color='primary' variant='flat' size='sm'>
              {mbtiType}
            </Chip>
            <span className='text-white/70 text-sm'>Welkom, {userName}</span>
          </div>
        </div>

        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <Crown className='w-16 h-16 text-yellow-400' />
            <h1 className='text-5xl font-bold text-white'>
              Upgrade naar Gold
            </h1>
          </div>
          <p className='text-xl text-white/90 mb-2'>
            Ontgrendel je volledige MBTI potentieel
          </p>
          <p className='text-lg text-yellow-300 font-semibold'>
            MET2.4 MBTI Coach Premium
          </p>
        </div>

        {/* Subscription Plans */}
        <Card className='bg-white/10 backdrop-blur-xl border border-white/20 mb-6'>
          <CardHeader className='text-center'>
            <h2 className='text-2xl font-bold text-white'>
              Kies een abonnement
            </h2>
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
                    {/* Plan Badges */}
                    <div className='flex justify-center gap-2 mb-3'>
                      {plan.popular && (
                        <Chip color='warning' variant='solid' size='sm'>
                          Populair
                        </Chip>
                      )}
                      {plan.bestValue && (
                        <Chip color='success' variant='solid' size='sm'>
                          Voordeligst
                        </Chip>
                      )}
                    </div>

                    {/* Plan Name */}
                    <h3 className='text-xl font-bold mb-2'>{plan.name}</h3>

                    {/* Price */}
                    <div className='mb-3'>
                      <span className='text-3xl font-bold'>
                        €{plan.priceWeekly}
                      </span>
                      <span className='text-sm opacity-80'> p.w.</span>
                    </div>

                    {/* Savings */}
                    {plan.savePct > 0 && (
                      <div className='mb-4'>
                        <Chip color='success' variant='flat' size='sm'>
                          Bespaar {plan.savePct}%
                        </Chip>
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {selectedPlan === plan.id && (
                      <div className='flex justify-center'>
                        <Check className='w-6 h-6' />
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Current vs Premium Features */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          {/* Current Features */}
          <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)]'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                <Check className='w-5 h-5 text-green-400' />
                Huidige Features
              </h3>
            </CardHeader>
            <CardBody>
              <div className='space-y-3'>
                {currentFeatures.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <feature.icon className='w-5 h-5 text-green-400 flex-shrink-0' />
                    <span className='text-white'>{feature.text}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Premium Features */}
          <Card className='bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-500/30'>
            <CardHeader>
              <h3 className='text-xl font-bold text-white flex items-center gap-2'>
                <Crown className='w-5 h-5 text-yellow-400' />
                Premium Features
                <Badge content="NEW" color="warning" size="sm">
                  <Sparkles className='w-4 h-4' />
                </Badge>
              </h3>
            </CardHeader>
            <CardBody>
              <div className='space-y-3'>
                {features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <feature.icon className='w-5 h-5 text-yellow-400 flex-shrink-0' />
                    <span className='text-white'>{feature.text}</span>
                    <Chip color='warning' size='sm' variant='flat'>
                      Premium
                    </Chip>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* MBTI-Specific Benefits */}
        <Card className='bg-[rgba(27,38,59,0.5)] backdrop-blur-xl border border-[rgba(100,223,223,0.2)] mb-6'>
          <CardHeader>
            <h3 className='text-xl font-bold text-white flex items-center gap-2'>
              <Brain className='w-5 h-5 text-purple-400' />
              {mbtiType} Specifieke Voordelen
            </h3>
          </CardHeader>
          <CardBody>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
              <div className='text-center p-4 rounded-lg bg-white/5'>
                <Target className='w-8 h-8 text-blue-400 mx-auto mb-2' />
                <h4 className='font-semibold text-white mb-1'>Gepersonaliseerde Challenges</h4>
                <p className='text-sm text-gray-300'>Challenges afgestemd op je {mbtiType} persoonlijkheid</p>
              </div>
              <div className='text-center p-4 rounded-lg bg-white/5'>
                <BookOpen className='w-8 h-8 text-green-400 mx-auto mb-2' />
                <h4 className='font-semibold text-white mb-1'>MBTI Journaling Prompts</h4>
                <p className='text-sm text-gray-300'>Specifieke prompts voor {mbtiType} groei</p>
              </div>
              <div className='text-center p-4 rounded-lg bg-white/5'>
                <Users className='w-8 h-8 text-purple-400 mx-auto mb-2' />
                <h4 className='font-semibold text-white mb-1'>Type-Specifieke Communities</h4>
                <p className='text-sm text-gray-300'>Connect met andere {mbtiType} types</p>
              </div>
              <div className='text-center p-4 rounded-lg bg-white/5'>
                <TestTube className='w-8 h-8 text-yellow-400 mx-auto mb-2' />
                <h4 className='font-semibold text-white mb-1'>Loki AI Filtering</h4>
                <p className='text-sm text-gray-300'>Test en beteugel "Digitale Loki" in alle AI's voor {mbtiType}</p>
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
            Later
          </Button>

          <Button
            color='warning'
            variant='solid'
            onClick={handleContinue}
            className='bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-8 py-4 text-lg'
            size='lg'
            startContent={<Crown className='w-5 h-5' />}
          >
            Upgrade naar Gold - €{selectedPlanData?.priceWeekly}/week
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className='mt-8 text-center'>
          <div className='flex items-center justify-center gap-6 text-white/60 text-sm'>
            <div className='flex items-center gap-2'>
              <Shield className='w-4 h-4' />
              <span>Veilig & Beveiligd</span>
            </div>
            <div className='flex items-center gap-2'>
              <Zap className='w-4 h-4' />
              <span>Direct Actief</span>
            </div>
            <div className='flex items-center gap-2'>
              <Trophy className='w-4 h-4' />
              <span>30-dagen Geld-terug</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeGoldPage;

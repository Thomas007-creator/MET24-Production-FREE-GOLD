import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Progress,
  Chip,
} from '@nextui-org/react';
import {
  CheckCircle,
  Shield,
  Brain,
  Heart,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
// // import { databaseService } from '../../services/databaseService';
import { logger } from '../../utils/logger';
import { usePWAEngagement } from '../../hooks/usePWAEngagement';
import { BMADColorSystem } from '../../lib/bmadColorSystem';
// import localAIService from '../../services/localAIService';

interface OnboardingCompleteProps {
  onComplete: (userData: any) => void;
  userData: any;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onComplete,
  userData,
}) => {
  const { setUserData } = useAppStore();
  const [isGeneratingActionPlan, setIsGeneratingActionPlan] = useState(false);
  const [actionPlan, setActionPlan] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track PWA engagement when onboarding is completed
  usePWAEngagement('onboarding_complete');

  // Calculate summary data
  const summaryData = {
    mbtiType: userData?.mbtiType || 'Niet ingevuld',
    topInterests: (userData?.interests as string[])?.slice(0, 3) || [],
    wellnessScore: (userData?.wellness as any)?.scores?.energy_index || 0,
    wellnessStatus:
      (userData?.wellness as any)?.scores?.energy_index > 70
        ? 'Hoog'
        : (userData?.wellness as any)?.scores?.energy_index > 50
        ? 'Gemiddeld'
        : 'Laag',
  };

  // Generate action plan on mount
  useEffect(() => {
        const generateActionPlan = async () => {
      setIsGeneratingActionPlan(true);

      try {
        logger.info('🤖 Stap 14: Generating action plan...');

        // Prepare input data for local AI
        // Mock action plan generation

        // Generate action plan using local AI with prompt
        // Mock localAIService call
        logger.info('Mock localAIService.generateActionPlanWithPrompt called');
        const generatedPlan = {
          steps: ['Mock action plan step 1', 'Mock action plan step 2'],
          summary: 'Mock action plan generated',
          generatedAt: new Date().toISOString(),
          source: 'mock'
        };
        setActionPlan(generatedPlan);

        logger.info('✅ Stap 14: Action plan generated:', generatedPlan);
      } catch (error) {
        logger.error('❌ Stap 14: Error generating action plan:', { error: error instanceof Error ? error.message : String(error) });
      } finally {
        setIsGeneratingActionPlan(false);
      }
    };

    generateActionPlan();
  }, [(userData?.context as any)?.communicationStyles, (userData?.context as any)?.situation, (userData?.context as any)?.stressLevel, userData?.interests, userData?.mbtiType, (userData?.wellness as any)?.scores]);

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      logger.info('🎉 Stap 14: Completing onboarding...');

      // Track analytics event
      logger.info('onboarding_complete', {
        used_mbti: !!userData?.mbtiType,
        interest_count: (userData?.interests as string[])?.length || 0,
        action_plan_generated: !!actionPlan,
        steps_count: (actionPlan?.steps as any[])?.length || 0,
        step: 'complete',
      });

      // Mock database call - skip actual database operations
      logger.info('💾 Stap 14: Mock database update');
      logger.info('📝 Mock setting users.onboarded_at = now');

      // Mock database call completed

      // Store action plan locally
      if (actionPlan) {
        localStorage.setItem('localAIActionPlan', JSON.stringify(actionPlan));
        localStorage.setItem(
          'lastActionPlanGenerated',
          new Date().toISOString()
        );
      }

      // Mark onboarding as completed
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('onboardingCompletedAt', new Date().toISOString());

      // Update store with final user data
      setUserData({
        ...userData,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      } as any);

      logger.info('✅ Stap 14: Onboarding completed successfully');
      logger.info('🔍 Final userData for MainView:', userData);

      // Complete onboarding and go to MainView
      onComplete(userData);
    } catch (error) {
      logger.error('❌ Stap 14: Error completing onboarding:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get vibrant, celebratory color scheme for onboarding completion
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('extraverted_vibrant');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex items-center justify-center p-4`}>
      <div className='max-w-2xl w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center gap-3 mb-4'>
            <CheckCircle className='w-12 h-12 text-emerald-400' />
            <h1 className={`text-4xl font-bold bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
              Klaar — Hier is jouw eerste stap
            </h1>
          </div>
          <p className='text-xl text-white/90'>
            Kort overzicht van wat we hebben opgeslagen (lokale weergave)
          </p>
        </div>

        {/* Privacy & Data Summary */}
        <Card className='bg-white/15 backdrop-blur-xl border border-white/30 mb-6'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <Shield className='w-6 h-6 text-blue-300' />
              <h2 className='text-xl font-semibold text-white'>
                Privacy & Data Samenvatting
              </h2>
            </div>
          </CardHeader>
          <CardBody className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* MBTI Profile */}
              <div className='bg-violet-950/10 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Brain className='w-5 h-5 text-purple-300' />
                  <span className='font-semibold text-white'>MBTI Profiel</span>
                </div>
                <p className='text-white/90'>{summaryData.mbtiType as string}</p>
              </div>

              {/* Top Interests */}
              <div className='bg-violet-900/10 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Target className='w-5 h-5 text-green-300' />
                  <span className='font-semibold text-white'>
                    Top 3 Interesses
                  </span>
                </div>
                <div className='flex flex-wrap gap-1'>
                  {summaryData.topInterests.map(
                    (interest: string, index: number) => (
                      <Chip
                        key={index}
                        size='sm'
                        className='bg-white/20 text-white'
                      >
                        {interest}
                      </Chip>
                    )
                  )}
                </div>
              </div>

              {/* Wellness Index */}
              <div className='bg-violet-700/10 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Heart className='w-5 h-5 text-red-300' />
                  <span className='font-semibold text-white'>
                    Holistisch Welzijn
                  </span>
                </div>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-white/80'>Energie Index</span>
                    <span className='text-white font-semibold'>
                      {summaryData.wellnessScore}%
                    </span>
                  </div>
                  <Progress
                    value={summaryData.wellnessScore}
                    className='w-full'
                    color={
                      summaryData.wellnessScore > 70
                        ? 'success'
                        : summaryData.wellnessScore > 50
                          ? 'warning'
                          : 'danger'
                    }
                  />
                  <p className='text-xs text-white/70'>
                    Status: {summaryData.wellnessStatus}
                  </p>
                </div>
              </div>

              {/* Data Storage */}
              <div className='bg-violet-600/10 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <Shield className='w-5 h-5 text-blue-300' />
                  <span className='font-semibold text-white'>Data Opslag</span>
                </div>
                <p className='text-sm text-white/80'>
                  Alle data wordt lokaal opgeslagen op je apparaat. Geen data
                  wordt naar externe servers verzonden.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* First Value - Action Plan */}
        <Card className='bg-purple-500/10 backdrop-blur-xl border border-white/20 mb-6'>
          <CardHeader>
            <div className='flex items-center gap-3'>
              <Target className='w-6 h-6 text-green-300' />
              <h2 className='text-xl font-semibold text-white'>
                Jouw Eerste Stap - Persoonlijk Actieplan
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            {isGeneratingActionPlan ? (
              <div className='flex items-center gap-3'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
                <p className='text-white'>
                  AI genereert je persoonlijke actieplan...
                </p>
              </div>
            ) : actionPlan ? (
              <div className='space-y-4'>
                <div className='space-y-3'>
                  {(actionPlan.steps as any[]).map((step: any, index: number) => (
                    <div key={index} className='bg-purple-600/10 rounded-lg p-4'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-sm font-semibold text-white'>
                          Stap {index + 1}:
                        </span>
                        <span className='text-sm text-white'>{(step as any).title}</span>
                        <span className='text-xs text-white/70'>
                          ({(step as any).estimatedTime})
                        </span>
                      </div>
                      <p className='text-sm text-white/90'>
                        {(step as any).description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className='p-3 bg-purple-600/10 rounded-lg'>
                  <p className='text-sm italic text-white/80'>
                    {actionPlan.summary as string}
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-white/80'>Actieplan wordt voorbereid...</p>
            )}
          </CardBody>
        </Card>

        {/* Action Button */}
        <div className='text-center'>
          <Button
            color='primary'
            size='lg'
            onClick={handleComplete}
            disabled={isSubmitting || isGeneratingActionPlan}
            className='bg-white text-purple-700 hover:bg-purple-200 font-semibold px-8'
          >
            {isSubmitting ? (
              <div className='flex items-center gap-2'>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
                <span>Naar Dashboard...</span>
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <span>Naar Dashboard</span>
                <ArrowRight className='w-4 h-4' />
              </div>
            )}
          </Button>
        </div>

        {/* Info Text */}
        <div className='text-center mt-6'>
          <p className='text-sm text-white/60'>
            Je onboarding is compleet! Je kunt nu je persoonlijke dashboard
            verkennen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;

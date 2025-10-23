import React from 'react';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useMainView } from './MainView.provider';
import { FeatureCard } from './FeatureCard';

// Export individual card components for reuse
export { AICoachingCard };

// Individual Feature Card Components
const ActiveImaginationCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <FeatureCard
      title="Actieve Imaginatie"
      description="Creatieve visualisatie technieken voor persoonlijke groei"
      icon="🧘"
      buttonText="Start Imaginatie"
      onClick={() => navigate('/active-imagination')}
      variant="primary"
      ariaLabel="Start actieve imaginatie sessie"
    />
  );
};

const UniverseleLevensboomCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <FeatureCard
      title="Universele Levensboom"
      description="Raadpleeg DeepSeek AI voor inzichten in je universele levensdomein en persoonlijke groei."
      icon="🌳"
      buttonText="Open Levensboom"
      onClick={() => navigate('/universele-levensboom')}
      variant="success"
      ariaLabel="Open Universele Levensboom"
    />
  );
};

const BackToBasicsCard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <FeatureCard
      title="Back to Basics"
      description="Verken de 9 kerngebieden van je leven en ontdek waar je kunt groeien en ontwikkelen."
      icon="B"
      buttonText="Bekijk Levensgebieden"
      onClick={() => navigate('/back-to-basics')}
      variant="success"
      ariaLabel="Bekijk 9 levensgebieden"
    />
  );
};

const WellnessAssessmentCard: React.FC = () => {
  const { userData, aiTaskStatus, handleFeatureClick } = useMainView();

  const wellnessScoresContent = userData?.wellness?.scores ? (
    <div
      className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'
      role='status'
      aria-live='polite'
      aria-label='Wellness scores beschikbaar'
    >
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xl' aria-hidden='true'>
          📊
        </span>
        <span className='font-bold text-sm'>
          Jouw Wellness Scores
        </span>
        {aiTaskStatus['wellness_assessment'] && (
          <div className='flex items-center gap-1'>
            <div className='animate-spin rounded-full h-3 w-3 border-b-2 border-white'></div>
            <span className='text-xs'>AI analyseert...</span>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
          <span>
            Energie: {(userData.wellness.scores as any).energy_index || 0}%
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-red-400 rounded-full'></div>
          <span>
            Stress: {(userData.wellness.scores as any).stress_index || 0}%
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
          <span>
            Sociale steun:{' '}
            {(userData.wellness.scores as any).social_support_score || 0}%
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
          <span>
            Zelfcompassie:{' '}
            {(userData.wellness.scores as any).self_compassion_score || 0}%
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className='bg-white bg-opacity-10 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
      <p className='text-sm opacity-80'>
        Wellness assessment wordt geanalyseerd...
      </p>
    </div>
  );

  return (
    <FeatureCard
      title="AI-2: Wellness Assessment"
      description="Holistische welzijnsanalyse en gepersonaliseerde aanbevelingen"
      icon="💚"
      buttonText="Bekijk Wellness Analyse"
      onClick={() => handleFeatureClick('wellness-assessment')}
      variant="primary"
      extraContent={wellnessScoresContent}
      ariaLabel="Start wellness assessment"
    />
  );
};

const AIActionPlanCard: React.FC = () => {
  const { localAIActionPlan, handleFeatureClick } = useMainView();

  const actionPlanContent = localAIActionPlan ? (
    <div
      className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'
      role='status'
      aria-live='polite'
      aria-label='Lokaal AI actieplan beschikbaar'
    >
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xl' aria-hidden='true'>
          🎯
        </span>
        <span className='font-bold text-sm'>
          Jouw Persoonlijke Actieplan
        </span>
      </div>

      <div className='space-y-3'>
        {localAIActionPlan.steps.map((step, index: number) => (
          <div
            key={index}
            className='bg-white bg-opacity-10 rounded-lg p-3'
          >
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-sm font-semibold'>
                Stap {index + 1}:
              </span>
              <span className='text-sm'>{step.title}</span>
              <span className='text-xs opacity-80'>
                ({step.estimatedTime})
              </span>
            </div>
            <p className='text-sm opacity-90'>{step.description}</p>
          </div>
        ))}
      </div>

      <div className='mt-4 p-3 bg-white bg-opacity-10 rounded-lg'>
        <p className='text-sm italic'>
          {localAIActionPlan.summary}
        </p>
      </div>
    </div>
  ) : (
    <div className='bg-white bg-opacity-10 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
      <p className='text-sm opacity-80'>
        Klik om je persoonlijke actieplan te genereren
      </p>
    </div>
  );

  return (
    <FeatureCard
      title="AI-3: Persoonlijk Actieplan"
      description="Gepersonaliseerd 3-stappen actieplan gegenereerd door lokale AI"
      icon="🤖"
      buttonText="Bekijk Actieplan"
      onClick={() => handleFeatureClick('ai-action-plan')}
      variant="primary"
      extraContent={actionPlanContent}
      ariaLabel="Bekijk AI actieplan"
    />
  );
};

const JournalingCard: React.FC = () => {
  const { userData, handleFeatureClick } = useMainView();

  const aiActionPlanContent = userData?.aiActionPlan && (
    <div
      className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'
      role='status'
      aria-live='polite'
      aria-label='AI Action Plan beschikbaar'
    >
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xl' aria-hidden='true'>
          🤖
        </span>
        <span className='font-bold text-sm'>
          AI Action Plan Beschikbaar
        </span>
      </div>
      <p className='text-sm mb-3'>
        Je hebt een gepersonaliseerd actieplan van je AI coach
      </p>
      <Button
        color='primary'
        variant='solid'
        onClick={() => handleFeatureClick('journaling')}
        size='sm'
        className='bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2'
        aria-label='Bekijk AI action plan'
      >
        Bekijk Plan
      </Button>
    </div>
  );

  return (
    <FeatureCard
      title="Journaling & Planning"
      description="Dagelijkse reflectie en AI-geanalyseerde inzichten"
      icon="📝"
      buttonText="Start Journaling"
      onClick={() => handleFeatureClick('journaling')}
      variant="primary"
      extraContent={aiActionPlanContent}
      ariaLabel="Start journaling en planning sessie"
    />
  );
};

const AICoachingCard: React.FC<{ variant?: 'basic' | 'grid' }> = ({ variant = 'basic' }) => {
  const { handleFeatureClick } = useMainView();

  const isGridVariant = variant === 'grid';

  const gridContent = isGridVariant && (
    <div className='bg-white bg-opacity-15 rounded-lg p-4 mb-4 border border-white border-opacity-20'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-xl' aria-hidden='true'>
          🎯
        </span>
        <span className='font-bold text-sm'>
          Beschikbare Sessies
        </span>
      </div>

      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-indigo-400 rounded-full'></div>
          <span>MBTI Coaching</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
          <span>Doelstellingen</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-pink-400 rounded-full'></div>
          <span>Relatie Advies</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
          <span>Carrière Guidance</span>
        </div>
      </div>
    </div>
  );

  return (
    <FeatureCard
      title={isGridVariant ? 'AI Coaching Grid' : 'AI Coaching'}
      description={isGridVariant
        ? 'Interactieve AI coaching sessies voor persoonlijke ontwikkeling'
        : 'Persoonlijke AI coach voor MBTI-specifieke begeleiding'
      }
      icon="🤖"
      buttonText={isGridVariant ? 'Start AI Coaching' : 'Start Coaching'}
      onClick={() => handleFeatureClick(isGridVariant ? 'ai-coaching-grid' : 'ai-coaching')}
      variant="primary"
      extraContent={gridContent}
      ariaLabel={`Start ${isGridVariant ? 'AI coaching grid' : 'AI coaching'} sessie`}
    />
  );
};

const HolisticWellnessCard: React.FC = () => {
  const { handleFeatureClick } = useMainView();

  return (
    <FeatureCard
      title="Holistische Wellness"
      description="Uitgebreide wellness analyse met AI inzichten en gepersonaliseerde aanbevelingen"
      icon="🌿"
      buttonText="Start Wellness Analyse"
      onClick={() => handleFeatureClick('holistic-wellness')}
      variant="primary"
      ariaLabel="Start holistische wellness analyse"
    />
  );
};

const TherapistCard: React.FC = () => {
  const { handleFeatureClick } = useMainView();

  return (
    <FeatureCard
      title="Therapeuten & Coaches"
      description="Professionele begeleiding en therapie opties"
      icon="👨‍⚕️"
      buttonText="Zoek Begeleiding"
      onClick={() => handleFeatureClick('therapist')}
      variant="primary"
      ariaLabel="Zoek therapeuten en coaches"
    />
  );
};

// Main Feature Cards Component
export const MainViewFeatureCards: React.FC = () => {
  return (
    <section
      aria-labelledby='main-navigation-title'
      className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'
    >
      <h2 id='main-navigation-title' className='sr-only'>
        Hoofdnavigatie
      </h2>

      <ActiveImaginationCard />
      <UniverseleLevensboomCard />
      <BackToBasicsCard />
      <WellnessAssessmentCard />
      <AIActionPlanCard />
      <JournalingCard />
      <AICoachingCard />
      <HolisticWellnessCard />
      <TherapistCard />
    </section>
  );
};
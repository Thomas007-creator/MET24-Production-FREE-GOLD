import React from 'react';
import { Button, Card, Progress, Chip } from '@nextui-org/react';
import { useOnboardingMbti } from './f-OnboardingMbti.provider';

export const OnboardingMbtiAiRecommendation: React.FC = () => {
  const {
    aiRecommendation,
    handleAIRecommendationAccept,
    setShowAIRecommendation,
  } = useOnboardingMbti();

  if (!aiRecommendation) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
      <div className='max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          🤖 AI MBTI Aanbeveling
        </h1>

        <Card className='bg-white/20 backdrop-blur-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-4 text-center'>
            {aiRecommendation.mbtiType as string}
          </h2>

          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span>Vertrouwen:</span>
              <span className='font-bold'>{Math.round((aiRecommendation.confidence as number) * 100)}%</span>
            </div>
            <Progress
              value={(aiRecommendation.confidence as number) * 100}
              className='w-full'
              color='success'
            />
          </div>

          <p className='text-lg mb-4 text-center'>
            {(aiRecommendation.reasoning as string).replace(/"/g, '&quot;')}
          </p>

          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div>
              <h3 className='font-bold mb-2'>Cognitive Functions:</h3>
              <div className='space-y-1'>
                {(aiRecommendation.cognitiveFunctions as string[]).map((func: string, index: number) => (
                  <Chip key={func} color={index === 0 ? 'primary' : 'default'} variant='flat'>
                    {func}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <h3 className='font-bold mb-2'>AI Systeem:</h3>
              <Chip color='secondary' variant='flat' className='text-lg'>
                {(aiRecommendation.aiSystem as string).toUpperCase()}
              </Chip>
            </div>
          </div>

          <div className='mb-6'>
            <h3 className='font-bold mb-2'>Ontwikkelingspad:</h3>
            <p className='text-sm opacity-90'>{(aiRecommendation.developmentPath as any).nextMilestone}</p>
          </div>

          <div className='flex gap-4 justify-center'>
            <Button
              color='success'
              size='lg'
              onClick={handleAIRecommendationAccept}
              className='font-bold'
            >
              ✅ Accepteer Aanbeveling
            </Button>

            <Button
              color='default'
              size='lg'
              onClick={() => setShowAIRecommendation(false)}
              variant='bordered'
            >
              🔄 Andere Optie
            </Button>
          </div>
        </Card>

        <Button
          color='default'
          onClick={() => setShowAIRecommendation(false)}
          variant='bordered'
          className='w-full'
        >
          ← Terug naar Keuzes
        </Button>
      </div>
    </div>
  );
};
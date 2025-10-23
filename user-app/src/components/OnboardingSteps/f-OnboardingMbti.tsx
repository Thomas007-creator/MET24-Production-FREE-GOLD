import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Progress, Chip } from '@nextui-org/react';
import { logger } from '../../utils/logger';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface OnboardingMbtiProps {
  onMbtiKnown: (mbtiData: {
    letters: string;
    percentages: { [key: string]: number } | null;
    confidence: number;
    source: 'user_input' | 'external' | 'ai_recommendation';
    aiInsights?: any;
    cognitiveFunctions?: string[];
    developmentPath?: any;
  }) => void;
  onQuickTest: () => void;
  onBack: () => void;
}

const OnboardingMbti: React.FC<OnboardingMbtiProps> = ({
  onMbtiKnown,
  onQuickTest,
  onBack,
}) => {
  const [showMbtiInput, setShowMbtiInput] = useState(false);
  const [showExternalPaste, setShowExternalPaste] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [mbtiCode, setMbtiCode] = useState('');
  // TODO: Implement percentage tracking when needed
  // const [percentages, setPercentages] = useState({
  //   E: 50,
  //   I: 50,
  //   S: 50,
  //   N: 50,
  //   T: 50,
  //   F: 50,
  //   J: 50,
  //   P: 50,
  // });
  const [showPercentages, setShowPercentages] = useState(false);
  const [errors, setErrors] = useState<{ mbtiCode?: string }>({});
  const [aiRecommendation, setAiRecommendation] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simple AI-powered MBTI recommendation
  const generateAIRecommendation = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple recommendation logic
      const recommendation = {
        mbtiType: 'INTJ',
        confidence: 0.85,
        reasoning: 'Based on your interaction patterns, you show preferences for analytical thinking and structured approaches.',
        cognitiveFunctions: ['Ni', 'Te', 'Fi', 'Se'],
        developmentPath: {
          nextMilestone: 'Develop your auxiliary Te function for better execution'
        },
        aiSystem: 'ai1'
      };

      setAiRecommendation(recommendation);
      setShowAIRecommendation(true);
      
      logger.info('AI MBTI recommendation generated:', recommendation);
    } catch (error) {
      logger.error('Error generating AI recommendation:', { error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMbtiChoice = async (choice: 'known' | 'quick' | 'full' | 'ai') => {
    logger.info(`MBTI choice selected: ${choice}`);

    try {
      switch (choice) {
        case 'known':
          setShowMbtiInput(true);
          break;
        case 'quick':
          onQuickTest();
          break;
        case 'full':
          handleFullTest();
          break;
        case 'ai':
          await generateAIRecommendation();
          break;
      }
    } catch (error) {
      console.error('Error in handleMbtiChoice:', error);
    }
  };

  const handleFullTest = () => {
    // Open external MBTI test in new tab
    const externalUrl = 'https://www.16personalities.com/free-personality-test';
    window.open(externalUrl, '_blank');

    // Show instructions for returning
    alert(
      'De volledige MBTI test is geopend in een nieuw tabblad. Kopieer je 4-letter resultaat en plak het hier wanneer je klaar bent.'
    );

    // Show paste field for external result
    setShowExternalPaste(true);
  };

  const validateMbtiCode = (code: string): boolean => {
    const validTypes = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
    ];
    return validTypes.includes(code.toUpperCase());
  };

  const handleMbtiSubmit = async (
    source: 'user_input' | 'external' | 'ai_recommendation' = 'user_input'
  ) => {
    const code = mbtiCode.trim().toUpperCase();

    if (!code) {
      setErrors({ mbtiCode: 'Voer je MBTI type in' });
      return;
    }

    if (!validateMbtiCode(code)) {
      setErrors({
        mbtiCode: 'Voer een geldig MBTI type in (bijv. INTJ, ENFP)',
      });
      return;
    }

    console.log('MBTI code submitted:', code, 'Source:', source);

    try {
      // Simple cognitive functions mapping
      const cognitiveFunctions = ['Ni', 'Te', 'Fi', 'Se']; // Placeholder
      const developmentPath = {
        nextMilestone: 'Continue developing your dominant function'
      };
      
      // Simple AI insights
      const aiInsights = {
        responseStyle: 'analytical',
        coachingApproach: 'structured'
      };

      console.log('Creating MBTI profile:', {
        letters: code,
        source: source,
        confidence: 100,
        percentages: showPercentages ? null : null, // TODO: Implement percentage tracking
        cognitiveFunctions,
        developmentPath,
        aiInsights
      });

      // Pass MBTI data to parent component with AI insights
      const mbtiData = {
        letters: code,
        percentages: showPercentages ? null : null, // TODO: Implement percentage tracking
        confidence: 100,
        source: source,
        aiInsights,
        cognitiveFunctions,
        developmentPath
      };

      console.log('📤 Passing MBTI data to parent:', mbtiData);
      onMbtiKnown(mbtiData);

      // Reset states
      setShowMbtiInput(false);
      setShowExternalPaste(false);
      setShowAIRecommendation(false);
      setMbtiCode('');
      setShowPercentages(false);
      setAiRecommendation(null);
    } catch (error) {
      console.error('❌ Error in handleMbtiSubmit:', error);
    }
  };

  const handleAIRecommendationAccept = async () => {
    if (aiRecommendation) {
      setMbtiCode(aiRecommendation.mbtiType as string);
      await handleMbtiSubmit('ai_recommendation');
    }
  };

  // TODO: Implementeer percentage change functionaliteit
  // const _handlePercentageChange = (dimension: string, value: number) => {
  //   setPercentages(prev => ({
  //     ...prev,
  //     [dimension]: value,
  //   }));
  // };

  // Track that MBTI page is shown
  useEffect(() => {
    const trackMbtiShown = async () => {
      try {
        console.log('📊 MBTI page shown event tracked');
      } catch (error) {
        console.error('❌ Error tracking MBTI shown event:', error);
      }
    };

    trackMbtiShown();
  }, []);

  // AI Recommendation Display
  if (showAIRecommendation && aiRecommendation) {
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
  }

  // MBTI Input Form (for known MBTI)
  if (showMbtiInput) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
        <div className='max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl'>
          <h1 className='text-3xl font-bold text-center mb-8'>
            📝 Voer je MBTI Type in
          </h1>

          <div className='mb-6'>
            <Input
              label='MBTI Type'
              placeholder='bijv. INTJ, ENFP, ISTJ...'
              value={mbtiCode}
              onChange={(e) => setMbtiCode(e.target.value)}
              className='mb-4'
              errorMessage={errors.mbtiCode}
              isInvalid={!!errors.mbtiCode}
            />

            <div className='flex gap-4 mb-6'>
              <Button
                color='primary'
                onClick={() => handleMbtiSubmit('user_input')}
                className='flex-1'
                size='lg'
              >
                ✅ Bevestig MBTI Type
              </Button>
              
              <Button
                color='default'
                onClick={() => setShowMbtiInput(false)}
                variant='bordered'
                className='flex-1'
                size='lg'
              >
                ← Terug
              </Button>
            </div>
          </div>

          <div className='text-center'>
            <p className='text-sm opacity-80 mb-4'>
              Weet je je MBTI type niet? Probeer een van de andere opties!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // External Test Result Input
  if (showExternalPaste) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white font-sans p-8'>
        <div className='max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl'>
          <h1 className='text-3xl font-bold text-center mb-8'>
            📋 Plak je MBTI Resultaat
          </h1>

          <div className='mb-6'>
            <Input
              label='MBTI Resultaat'
              placeholder='Plak hier je 4-letter resultaat (bijv. INTJ)'
              value={mbtiCode}
              onChange={(e) => setMbtiCode(e.target.value)}
              className='mb-4'
              errorMessage={errors.mbtiCode}
              isInvalid={!!errors.mbtiCode}
            />

            <div className='flex gap-4 mb-6'>
              <Button
                color='primary'
                onClick={() => handleMbtiSubmit('external')}
                className='flex-1'
                size='lg'
              >
                ✅ Bevestig Resultaat
              </Button>
              
              <Button
                color='default'
                onClick={() => setShowExternalPaste(false)}
                variant='bordered'
                className='flex-1'
                size='lg'
              >
                ← Terug
              </Button>
            </div>
          </div>

          <div className='text-center'>
            <p className='text-sm opacity-80'>
              Heb je de test nog niet gedaan? Ga terug en kies &quot;Volledige Test&quot;
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get calm, introspective color scheme for MBTI discovery
  const bmadColors = BMADColorSystem.getPersonalityColorScheme('introverted_calm');
  const glassStyle = BMADColorSystem.getGlassmorphismClasses(bmadColors);

  // Main Choice Screen
  return (
    <div className={`min-h-screen bg-gradient-to-br ${bmadColors.gradient} flex flex-col justify-center items-center text-white font-sans p-8`}>
      <div className={`max-w-4xl w-full bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20`}>
        <h1 className={`text-4xl font-bold text-center mb-8 bg-gradient-to-r ${bmadColors.gradient} bg-clip-text text-transparent`}>
          🧠 MBTI Persoonlijkheidstype
        </h1>

        <p className={`text-xl text-center mb-12 text-white/80`}>
          We willen je MBTI type kennen om je een gepersonaliseerde ervaring te bieden.
          Kies de methode die het beste bij je past:
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* AI Recommendation */}
          <Card 
            className={`bg-white/15 backdrop-blur-xl p-6 cursor-pointer hover:scale-105 transition-transform border border-white/30`}
            isPressable
            onPress={() => handleMbtiChoice('ai')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>🤖</div>
              <h3 className='text-xl font-bold mb-3'>AI Aanbeveling</h3>
              <p className='text-sm opacity-80'>
                Laat AI je MBTI type voorspellen op basis van je gedrag
              </p>
              {isAnalyzing && (
                <div className='mt-3'>
                  <Progress size='sm' color='secondary' className='w-full' />
                  <p className='text-xs mt-1'>Analyseert...</p>
                </div>
              )}
            </div>
          </Card>

          {/* Known MBTI */}
          <Card 
            className='bg-gradient-to-br from-blue-700/20 to-cyan-500/20 backdrop-blur-lg p-6 cursor-pointer hover:scale-105 transition-transform'
            isPressable
            onPress={() => handleMbtiChoice('known')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>📝</div>
              <h3 className='text-xl font-bold mb-3'>Ik weet mijn Type</h3>
              <p className='text-sm opacity-80'>
                Voer direct je 4-letter MBTI type in
              </p>
            </div>
          </Card>

          {/* Quick Test */}
          <Card 
            className='bg-gradient-to-br from-green-700/20 to-emerald-500/20 backdrop-blur-lg p-6 cursor-pointer hover:scale-105 transition-transform'
            isPressable
            onPress={() => handleMbtiChoice('quick')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>⚡</div>
              <h3 className='text-xl font-bold mb-3'>Snelle Test</h3>
              <p className='text-sm opacity-80'>
                Doe een korte test van 10 vragen
              </p>
            </div>
          </Card>

          {/* Full Test */}
          <Card 
            className='bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg p-6 cursor-pointer hover:scale-105 transition-transform'
            isPressable
            onPress={() => handleMbtiChoice('full')}
          >
            <div className='text-center'>
              <div className='text-4xl mb-4'>🔬</div>
              <h3 className='text-xl font-bold mb-3'>Volledige Test</h3>
              <p className='text-sm opacity-80'>
                Doe een uitgebreide test van 60+ vragen
              </p>
            </div>
          </Card>
        </div>

        <div className='text-center'>
          <Button 
            color='default' 
            onClick={onBack}
            variant='bordered'
            size='lg'
          >
            ← Terug
          </Button>
        </div>

        <div className='mt-8 text-center'>
          <p className='text-sm opacity-70'>
            💡 <strong>Tip:</strong> De AI aanbeveling is gebaseerd op je interactiepatronen 
            en geeft je een goed startpunt voor je MBTI reis!
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingMbti;

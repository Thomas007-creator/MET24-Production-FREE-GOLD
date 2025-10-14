import React from 'react';
import { Button } from '@nextui-org/react';
import { logger } from '../../utils/logger';

interface IntroPageProps {
  onBackToStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onBackToStart }) => {
  const handleBackToStart = async () => {
    logger.info('🔄 Terug naar start clicked');

    try {
      logger.info('intro_back_to_start', {
        step: 'intro',
        action: 'back_to_start',
      });
    } catch (error) {
      logger.error('❌ Error tracking back to start event:', { error });
    }

    onBackToStart();
  };

  // Track that intro page is shown
  React.useEffect(() => {
    const trackIntroShown = async () => {
      try {
        logger.info('intro_page_shown', {
          step: 'intro',
          action: 'shown',
        });
        logger.info('📊 Intro page shown event tracked');
      } catch (error) {
        logger.error('❌ Error tracking intro shown event:', { error });
      }
    };

    trackIntroShown();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white relative flex flex-col justify-center items-center font-sans p-8 overflow-hidden'>
      {/* Animated background elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 animate-pulse'></div>
      
      {/* Floating particles effect */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-ping'></div>
        <div className='absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse'></div>
        <div className='absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-bounce'></div>
      </div>

      {/* Content container with glassmorphism */}
      <div className='relative z-10 text-center max-w-2xl'>
        <div className='glass-strong p-8 rounded-2xl mb-8'>
          <div className='w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-aqua'>
            <span className='text-4xl'>📚</span>
          </div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4'>
            Korte Introductie
          </h1>
        </div>

        <div className='glass p-8 rounded-xl mb-8'>
          <h2 className='text-2xl font-semibold mb-6 bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent'>
            Wat is Your Future Self?
          </h2>

          <div className='space-y-6 text-left'>
            <div className='flex items-start gap-4'>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <span className='text-sm font-bold'>1</span>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  🧠 Persoonlijke AI-Coaching
                </h3>
                <p className='text-white/90 leading-relaxed'>
                  Een intelligente coach die jouw persoonlijkheid, doelen en
                  voorkeuren begrijpt en je helpt om je beste zelf te worden.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <span className='text-sm font-bold'>2</span>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  🔒 100% Privé & Lokaal
                </h3>
                <p className='text-white/90 leading-relaxed'>
                  Al je gegevens blijven op jouw telefoon. Geen servers, geen
                  tracking, volledige controle over jouw data.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <span className='text-sm font-bold'>3</span>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  🎯 Persoonlijke Groei
                </h3>
                <p className='text-white/90 leading-relaxed'>
                  Korte, effectieve oefeningen en diepgaande begeleiding die
                  perfect aansluiten bij wie jij bent en wat je wilt bereiken.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                <span className='text-sm font-bold'>4</span>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>
                  🚀 Wetenschappelijk Onderbouwd
                </h3>
                <p className='text-white/90 leading-relaxed'>
                  Gebaseerd op MBTI persoonlijkheidstheorie, psychologie en
                  bewezen coaching technieken.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8'>
          <h3 className='text-lg font-semibold mb-4'>
            💡 Wat kun je verwachten?
          </h3>
          <ul className='text-left space-y-3'>
            <li className='flex items-center gap-3'>
              <span className='text-green-400'>✅</span>
              <span>Persoonlijkheidsanalyse en inzichten</span>
            </li>
            <li className='flex items-center gap-3'>
              <span className='text-green-400'>✅</span>
              <span>Dagelijkse coaching en reflectie</span>
            </li>
            <li className='flex items-center gap-3'>
              <span className='text-green-400'>✅</span>
              <span>Persoonlijke doelen en actieplannen</span>
            </li>
            <li className='flex items-center gap-3'>
              <span className='text-green-400'>✅</span>
              <span>Progressie tracking en inzichten</span>
            </li>
            <li className='flex items-center gap-3'>
              <span className='text-green-400'>✅</span>
              <span>Community en ondersteuning</span>
            </li>
          </ul>
        </div>

        <Button
          color='primary'
          size='lg'
          onClick={handleBackToStart}
          className='w-full bg-[rgba(100,223,223,0.2)] text-white border border-[rgba(100,223,223,0.3)] hover:bg-[rgba(100,223,223,0.3)] hover:border-[rgba(100,223,223,0.5)] hover:shadow-[0_0_20px_rgba(100,223,223,0.3)] hover:-translate-y-0.5 transition-all duration-300 font-semibold'
        >
          🔄 Keer terug naar start
        </Button>
      </div>
    </div>
  );
};

export default IntroPage;

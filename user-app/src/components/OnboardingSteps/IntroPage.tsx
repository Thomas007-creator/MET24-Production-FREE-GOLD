import React, { useEffect, useRef } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react';
import { logger } from '../../utils/logger';
import { BMADColorSystem } from '../../lib/bmadColorSystem';

interface IntroPageProps {
  onBackToStart: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onBackToStart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  /**
   * BMAD Professional Baseline - Page 1 (IntroPage)
   * 
   * Color Strategy: feeling_warm scheme
   * - Creates welcoming, empathetic first impression
   * - Orange-pink-purple gradient for energy and comfort
   * - Perfect for INFJ users who value warmth and authenticity
   * 
   * Psychological Goals:
   * - Establish trust through warm, inviting colors
   * - Reduce anxiety with comfortable color temperature
   * - Create emotional connection before data collection
   * 
   * MBTI Considerations:
   * - Introverts: Softer, warmer tones to feel safe
   * - Feeling types: Emotional warmth over stark professionalism
   * - Intuitive types: Creative gradients suggest innovation
   */
  const colors = BMADColorSystem.getPersonalityColorScheme('feeling_warm');
  
  // Add advanced parallax and animation effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;
      
      // Apply subtle parallax effect to floating elements
      const particles = containerRef.current.querySelectorAll('.floating-particle');
      particles.forEach((particle, index) => {
        const intensity = (index + 1) * 0.3;
        const element = particle as HTMLElement;
        element.style.transform = `translate(${xPercent * intensity}px, ${yPercent * intensity}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
    <div 
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br ${colors.gradient} text-white relative flex flex-col justify-center items-center font-sans p-4 md:p-8 overflow-hidden`}
    >
      {/* Enhanced animated background with multiple layers - BMAD feeling_warm accents */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientLight} opacity-10 animate-pulse`}></div>
      <div className={`absolute inset-0 bg-gradient-to-tr from-${colors.accent}/5 via-transparent to-${colors.accentLight}/5 animate-pulse`} style={{ animationDelay: '1s' }}></div>
      
      {/* Enhanced floating particles with parallax */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='floating-particle absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400/40 rounded-full animate-ping transition-transform duration-300 ease-out'></div>
        <div className='floating-particle absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400/50 rounded-full animate-pulse transition-transform duration-300 ease-out' style={{ animationDelay: '0.5s' }}></div>
        <div className='floating-particle absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-pink-400/40 rounded-full animate-bounce transition-transform duration-300 ease-out' style={{ animationDelay: '1s' }}></div>
        <div className='floating-particle absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-ping transition-transform duration-300 ease-out' style={{ animationDelay: '1.5s' }}></div>
        <div className='floating-particle absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse transition-transform duration-300 ease-out' style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Enhanced content container with better glassmorphism */}
      <div className='relative z-10 text-center max-w-4xl w-full animate-fade-in-up'>
        {/* Hero Card with advanced glassmorphism */}
        <Card className='mb-8 bg-white/5 backdrop-blur-2xl border-white/10 hover:bg-white/8 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20'>
          <CardBody className='p-8'>
            <div className={`w-20 h-20 bg-gradient-to-br from-${colors.primary}/30 to-${colors.accent}/30 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-${colors.primary}/30`}>
              <span className='text-4xl'>✨</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${colors.gradientLight} bg-clip-text text-transparent mb-4 hover:scale-105 transition-transform duration-300`}>
              Your Future Self
            </h1>
            <p className='text-xl text-white/80 mb-4'>
              Ontdek je potentieel met persoonlijke AI-coaching
            </p>
            <div className={`w-24 h-1 bg-gradient-to-r ${colors.gradientLight} rounded-full mx-auto`}></div>
          </CardBody>
        </Card>

        {/* Enhanced features grid with better visual hierarchy */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {[
            {
              icon: '🧠',
              title: 'Persoonlijke AI-Coaching',
              description: 'Een intelligente coach die jouw persoonlijkheid, doelen en voorkeuren begrijpt en je helpt om je beste zelf te worden.',
              gradient: 'from-cyan-400 to-blue-500'
            },
            {
              icon: '🔒',
              title: '100% Privé & Lokaal',
              description: 'Al je gegevens blijven op jouw telefoon. Geen servers, geen tracking, volledige controle over jouw data.',
              gradient: 'from-purple-400 to-pink-500'
            },
            {
              icon: '🎯',
              title: 'Persoonlijke Groei',
              description: 'Korte, effectieve oefeningen en diepgaande begeleiding die perfect aansluiten bij wie jij bent.',
              gradient: 'from-emerald-400 to-cyan-500'
            },
            {
              icon: '🚀',
              title: 'Wetenschappelijk Onderbouwd',
              description: 'Gebaseerd op MBTI persoonlijkheidstheorie, psychologie en bewezen coaching technieken.',
              gradient: 'from-orange-400 to-red-500'
            }
          ].map((feature, index) => (
            <Card 
              key={index}
              className='bg-white/5 backdrop-blur-xl border-white/10 hover:bg-white/8 transition-all duration-500 hover:scale-105 hover:shadow-lg group'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardBody className='p-6'>
                <div className='flex items-start gap-4'>
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:opacity-30 transition-opacity duration-300`}>
                    <span className='text-2xl'>{feature.icon}</span>
                  </div>
                  <div className='text-left'>
                    <h3 className={`text-lg font-semibold mb-2 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.title}
                    </h3>
                    <p className='text-white/80 text-sm leading-relaxed'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Enhanced expectations card */}
        <Card className='mb-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border-white/20 hover:from-white/8 hover:to-white/15 transition-all duration-500'>
          <CardBody className='p-8'>
            <h3 className='text-2xl font-semibold mb-6 bg-gradient-to-r from-emerald-300 to-cyan-400 bg-clip-text text-transparent'>
              � Wat kun je verwachten?
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {[
                'Persoonlijkheidsanalyse en inzichten',
                'Dagelijkse coaching en reflectie',
                'Persoonlijke doelen en actieplannen',
                'Progressie tracking en inzichten',
                'Community en ondersteuning',
                'Wetenschappelijk onderbouwde methoden'
              ].map((item, index) => (
                <div 
                  key={index}
                  className='flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-300 group'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='w-6 h-6 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
                    <span className='text-white text-xs font-bold'>✓</span>
                  </div>
                  <span className='text-white/90 group-hover:text-white transition-colors duration-300'>{item}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Enhanced CTA button - BMAD feeling_warm styling */}
        <Button
          color='primary'
          size='lg'
          onClick={handleBackToStart}
          className={`w-full md:w-auto px-12 py-4 bg-gradient-to-r ${colors.gradient} text-white font-semibold text-lg rounded-2xl border-0 hover:scale-105 hover:shadow-2xl hover:shadow-${colors.primary}/30 transition-all duration-300 relative overflow-hidden group`}
        >
          <span className='relative z-10 flex items-center gap-3'>
            <span className='group-hover:rotate-180 transition-transform duration-300'>🔄</span>
            Beginnen met de reis
          </span>
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradientLight} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
        </Button>
      </div>
    </div>
  );
};

export default IntroPage;

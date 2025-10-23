/**
 * MET24 Onboarding → Mainview Parallax Manager
 * 
 * Manages één doorlopende visuele achtergrond die evolueert 
 * van onboarding intro door alle 13+ stappen naar mainview dashboard
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ParallaxState {
  currentStep: number;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundScale: number;
  overlayOpacity: number;
  glassmorphismIntensity: number;
}

interface ParallaxContextType {
  parallaxState: ParallaxState;
  updateStep: (step: number, isMainview?: boolean) => void;
  preloadImages: () => void;
}

const ParallaxContext = createContext<ParallaxContextType | null>(null);

// Background evolution mapping - mainview-mobile1.webp voor hele onboarding journey
const ONBOARDING_BACKGROUNDS = {
  intro: {
    image: '/mainview-mobile1.webp', // Hele reis gebruikt deze ene achtergrond
    position: 'center top', // Start bovenaan
    scale: 1.0,
    overlay: 0.4 // Donkerder overlay aan het begin
  },
  steps: {
    // Stap 1-4: Persoonlijke basis - zoom langzaam in
    early: {
      image: '/mainview-mobile1.webp', 
      position: 'center top',
      scale: 1.05, // Subtiele zoom
      overlay: 0.35
    },
    // Stap 5-8: MBTI & Persoonlijkheid - move naar center
    personality: {
      image: '/mainview-mobile1.webp',
      position: 'center center', // Verschuif naar center
      scale: 1.1,
      overlay: 0.25
    },
    // Stap 9-12: Interesses & Welzijn - continue zooming
    wellness: {
      image: '/mainview-mobile1.webp',
      position: 'center center',
      scale: 1.15,
      overlay: 0.2
    },
    // Stap 13-15: Voltooiing - move naar bottom voor mainview reveal
    completion: {
      image: '/mainview-mobile1.webp',
      position: 'center bottom', // Naar bottom voor mainview preview
      scale: 1.2,
      overlay: 0.1
    }
  },
  mainview: {
    image: '/mainview-mobile1.webp', // Eindpunt van de reis
    position: 'center bottom', // Volledig zichtbaar
    scale: 1.25, // Max zoom voor detail
    overlay: 0.05 // Minimale overlay - achtergrond fully visible
  }
};

const getBackgroundForStep = (step: number, isMainview: boolean = false): any => {
  if (isMainview) return ONBOARDING_BACKGROUNDS.mainview;
  if (step === 0) return ONBOARDING_BACKGROUNDS.intro;
  if (step <= 4) return ONBOARDING_BACKGROUNDS.steps.early;
  if (step <= 8) return ONBOARDING_BACKGROUNDS.steps.personality;
  if (step <= 12) return ONBOARDING_BACKGROUNDS.steps.wellness;
  return ONBOARDING_BACKGROUNDS.steps.completion;
};

export const OnboardingParallaxProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const location = useLocation();
  const [parallaxState, setParallaxState] = useState<ParallaxState>({
    currentStep: 0,
    backgroundImage: ONBOARDING_BACKGROUNDS.intro.image,
    backgroundPosition: ONBOARDING_BACKGROUNDS.intro.position,
    backgroundScale: ONBOARDING_BACKGROUNDS.intro.scale,
    overlayOpacity: ONBOARDING_BACKGROUNDS.intro.overlay,
    glassmorphismIntensity: 0.8
  });

  // Detect route changes and update background accordingly
  useEffect(() => {
    const path = location.pathname;
    let step = 0;
    let isMainview = false;

    // Parse step from onboarding route
    if (path.includes('/onboarding/')) {
      const stepMatch = path.match(/\/onboarding\/(\d+)/);
      step = stepMatch ? parseInt(stepMatch[1]) : 0;
    } else if (path === '/dashboard' || path === '/mainview' || path === '/') {
      isMainview = true;
    }

    updateStep(step, isMainview);
  }, [location]);

  const updateStep = (step: number, isMainview: boolean = false) => {
    const bgConfig = getBackgroundForStep(step, isMainview);
    
    setParallaxState(prev => ({
      ...prev,
      currentStep: step,
      backgroundImage: bgConfig.image,
      backgroundPosition: bgConfig.position,
      backgroundScale: bgConfig.scale,
      overlayOpacity: bgConfig.overlay,
      glassmorphismIntensity: isMainview ? 0.6 : 0.8 - (step * 0.02) // Gradually reduce glass effect
    }));
  };

  const preloadImages = () => {
    // Preload de mainview achtergrond (alleen deze ene!)
    const img = new Image();
    img.src = '/mainview-mobile1.webp';
  };

  const contextValue: ParallaxContextType = {
    parallaxState,
    updateStep,
    preloadImages
  };

  return (
    <ParallaxContext.Provider value={contextValue}>
      {children}
    </ParallaxContext.Provider>
  );
};

export const useOnboardingParallax = (): ParallaxContextType => {
  const context = useContext(ParallaxContext);
  if (!context) {
    throw new Error('useOnboardingParallax must be used within OnboardingParallaxProvider');
  }
  return context;
};

/**
 * Parallax Background Component
 * 
 * Renders the continuously evolving background
 */
export const ParallaxBackground: React.FC = () => {
  const { parallaxState } = useOnboardingParallax();

  return (
    <>
      {/* Statische achtergrond laag */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${parallaxState.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: parallaxState.backgroundPosition,
          backgroundAttachment: 'fixed',
          transform: `scale(${parallaxState.backgroundScale})`,
          transformOrigin: 'center center'
        }}
      />
      
      {/* Overlay voor glassmorphism effect */}
      <div 
        className="fixed inset-0 z-[1] transition-opacity duration-1000"
        style={{
          background: `linear-gradient(135deg, 
            rgba(30, 27, 75, ${parallaxState.overlayOpacity}) 0%, 
            rgba(124, 58, 237, ${parallaxState.overlayOpacity * 0.7}) 50%, 
            rgba(190, 24, 93, ${parallaxState.overlayOpacity * 0.5}) 100%)`,
        }}
      />
    </>
  );
};

/**
 * Parallax Content Wrapper
 * 
 * Wraps content met evolving glassmorphism
 */
interface ParallaxContentProps {
  children: React.ReactNode;
  enableSwipeParallax?: boolean;
  className?: string;
}

export const ParallaxContent: React.FC<ParallaxContentProps> = ({ 
  children, 
  enableSwipeParallax = false,
  className = "" 
}) => {
  const { parallaxState } = useOnboardingParallax();
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Enhanced glassmorphism based on journey progress
  const dynamicGlassStyles = {
    background: `rgba(255, 255, 255, ${0.05 + (parallaxState.glassmorphismIntensity * 0.05)})`,
    backdropFilter: `blur(${12 + (parallaxState.glassmorphismIntensity * 8)}px)`,
    border: `1px solid rgba(255, 255, 255, ${0.1 + (parallaxState.glassmorphismIntensity * 0.1)})`,
    borderRadius: '20px',
    boxShadow: `0 8px 32px rgba(0, 0, 0, ${0.1 + (parallaxState.glassmorphismIntensity * 0.1)})`
  };

  return (
    <div 
      className={`relative z-10 min-h-screen transition-all duration-1000 ${className}`}
      style={{
        transform: enableSwipeParallax ? `translateX(${swipeOffset}px)` : 'none',
        ...dynamicGlassStyles
      }}
    >
      {children}
    </div>
  );
};
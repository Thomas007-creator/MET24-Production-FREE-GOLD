/**
 * Feature-Specific Parallax Manager
 * 
 * Handles dedicated backgrounds voor Actieve Imaginatie & Back to Basics
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface FeatureParallaxState {
  currentFeature: 'mainview' | 'active-imagination' | 'back-to-basics' | null;
  backgroundImage: string;
  backgroundPosition: string;
  backgroundScale: number;
  overlayOpacity: number;
  glassmorphismIntensity: number;
}

interface FeatureParallaxContextType {
  parallaxState: FeatureParallaxState;
  setFeature: (feature: 'mainview' | 'active-imagination' | 'back-to-basics') => void;
}

const FeatureParallaxContext = createContext<FeatureParallaxContextType | null>(null);

// Feature-specific backgrounds
const FEATURE_BACKGROUNDS = {
  mainview: {
    image: '/mainview-mobile1.webp',
    position: 'center bottom',
    scale: 1.25,
    overlay: 0.02,
    glassmorphism: 0.6
  },
  'active-imagination': {
    image: '/imagination-mobile1.webp.jpg',
    position: 'center center',
    scale: 1.1,
    overlay: 0.05,
    glassmorphism: 0.8
  },
  'back-to-basics': {
    image: '/basics-mobile1.webp.jpg',
    position: 'center center', 
    scale: 1.0,
    overlay: 0.08,
    glassmorphism: 0.7
  }
};

export const FeatureParallaxProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const location = useLocation();
  const [parallaxState, setParallaxState] = useState<FeatureParallaxState>({
    currentFeature: 'mainview',
    backgroundImage: FEATURE_BACKGROUNDS.mainview.image,
    backgroundPosition: FEATURE_BACKGROUNDS.mainview.position,
    backgroundScale: FEATURE_BACKGROUNDS.mainview.scale,
    overlayOpacity: FEATURE_BACKGROUNDS.mainview.overlay,
    glassmorphismIntensity: FEATURE_BACKGROUNDS.mainview.glassmorphism
  });

  // Detect route changes and update background
  useEffect(() => {
    const path = location.pathname;
    let feature: 'mainview' | 'active-imagination' | 'back-to-basics' = 'mainview';

    if (path.includes('/active-imagination') || path.includes('/ai-buddy')) {
      feature = 'active-imagination';
    } else if (path.includes('/basics') || path.includes('/back-to-basics')) {
      feature = 'back-to-basics';
    } else if (path === '/' || path === '/dashboard' || path === '/mainview') {
      feature = 'mainview';
    }

    setFeature(feature);
  }, [location]);

  const setFeature = (feature: 'mainview' | 'active-imagination' | 'back-to-basics') => {
    const bgConfig = FEATURE_BACKGROUNDS[feature];
    
    setParallaxState({
      currentFeature: feature,
      backgroundImage: bgConfig.image,
      backgroundPosition: bgConfig.position,
      backgroundScale: bgConfig.scale,
      overlayOpacity: bgConfig.overlay,
      glassmorphismIntensity: bgConfig.glassmorphism
    });
  };

  const contextValue: FeatureParallaxContextType = {
    parallaxState,
    setFeature
  };

  return (
    <FeatureParallaxContext.Provider value={contextValue}>
      {children}
    </FeatureParallaxContext.Provider>
  );
};

export const useFeatureParallax = (): FeatureParallaxContextType => {
  const context = useContext(FeatureParallaxContext);
  if (!context) {
    throw new Error('useFeatureParallax must be used within FeatureParallaxProvider');
  }
  return context;
};

/**
 * Feature Background Component
 */
export const FeatureParallaxBackground: React.FC = () => {
  const { parallaxState } = useFeatureParallax();

  return (
    <>
      {/* Feature-specific achtergrond */}
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
      
      {/* Feature-specific overlay - Transparent to show parallax background */}
      <div 
        className="fixed inset-0 z-[1] transition-opacity duration-1000"
        style={{
          background: `linear-gradient(135deg, 
            rgba(30, 27, 75, ${parallaxState.overlayOpacity * 0.1}) 0%, 
            rgba(124, 58, 237, ${parallaxState.overlayOpacity * 0.05}) 50%, 
            rgba(190, 24, 93, ${parallaxState.overlayOpacity * 0.03}) 100%)`,
        }}
      />
    </>
  );
};

/**
 * Feature Content Wrapper
 */
interface FeatureContentProps {
  children: React.ReactNode;
  className?: string;
}

export const FeatureParallaxContent: React.FC<FeatureContentProps> = ({ 
  children, 
  className = "" 
}) => {
  const { parallaxState } = useFeatureParallax();

  // Feature-specific glassmorphism
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
      style={dynamicGlassStyles}
    >
      {children}
    </div>
  );
};
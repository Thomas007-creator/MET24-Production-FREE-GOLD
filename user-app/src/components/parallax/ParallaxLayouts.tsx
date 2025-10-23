/**
 * Enhanced Page Layout voor Onboarding → Mainview visuele verhaal
 * 
 * Integreert met de OnboardingParallaxManager voor doorlopende achtergrond
 */

import React from 'react';
import { 
  OnboardingParallaxProvider, 
  ParallaxBackground, 
  ParallaxContent,
  useOnboardingParallax 
} from './OnboardingParallaxManager';

/**
 * Main Layout Component
 * 
 * Wrap je hele app hierin voor doorlopende achtergrond
 */
export const MET24AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <OnboardingParallaxProvider>
      <div className="relative min-h-screen overflow-hidden">
        {/* Doorlopende achtergrond die evolueert */}
        <ParallaxBackground />
        
        {/* App content met dynamische glassmorphism */}
        <ParallaxContent enableSwipeParallax={true}>
          {children}
        </ParallaxContent>
      </div>
    </OnboardingParallaxProvider>
  );
};

/**
 * Onboarding Step Layout
 * 
 * Voor individuele onboarding stappen
 */
interface OnboardingStepLayoutProps {
  stepNumber: number;
  children: React.ReactNode;
  enableSwipe?: boolean;
}

export const OnboardingStepLayout: React.FC<OnboardingStepLayoutProps> = ({ 
  stepNumber, 
  children,
  enableSwipe = true 
}) => {
  const { updateStep } = useOnboardingParallax();
  
  React.useEffect(() => {
    updateStep(stepNumber);
  }, [stepNumber, updateStep]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Step indicator met glassmorphism */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20">
            <span className="text-white/80 text-sm">Stap {stepNumber} van 15</span>
            <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500"
                style={{ width: `${(stepNumber / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Step content */}
        <div className="glass-strong p-6 rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Mainview Dashboard Layout
 * 
 * Voor de definitieve dashboard view
 */
export const MainviewDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { updateStep } = useOnboardingParallax();
  
  React.useEffect(() => {
    updateStep(15, true); // Indicate we're in mainview
  }, [updateStep]);

  return (
    <div className="min-h-screen p-4">
      {/* Dashboard header met evolved glassmorphism */}
      <div className="mb-6">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 p-4">
          <h1 className="text-2xl font-bold text-white mb-2">
            Welkom in je MET24 Dashboard
          </h1>
          <p className="text-white/80">
            Je reis is compleet - nu kun je je holistische welzijn monitoren
          </p>
        </div>
      </div>
      
      {/* Dashboard content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

/**
 * Hook voor custom onboarding step navigation
 */
export const useOnboardingNavigation = () => {
  const { parallaxState, updateStep } = useOnboardingParallax();
  
  const goToStep = (step: number) => {
    updateStep(step);
    // Add navigation logic here
  };
  
  const nextStep = () => {
    goToStep(parallaxState.currentStep + 1);
  };
  
  const prevStep = () => {
    goToStep(Math.max(0, parallaxState.currentStep - 1));
  };
  
  return {
    currentStep: parallaxState.currentStep,
    goToStep,
    nextStep,
    prevStep
  };
};

/**
 * Background Evolution Preview Component
 * 
 * Voor testing en development
 */
export const BackgroundEvolutionPreview: React.FC = () => {
  const { updateStep, parallaxState } = useOnboardingParallax();
  
  const steps = [
    { step: 0, label: 'Intro' },
    { step: 2, label: 'Vroege stappen' },
    { step: 6, label: 'Persoonlijkheid' },
    { step: 10, label: 'Welzijn' },
    { step: 14, label: 'Voltooiing' },
    { step: 15, label: 'Mainview', isMainview: true }
  ];
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
        <h3 className="text-white text-sm font-semibold mb-3">Background Evolution Test</h3>
        <div className="space-y-2">
          {steps.map(({ step, label, isMainview }) => (
            <button
              key={step}
              onClick={() => updateStep(step, isMainview)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                parallaxState.currentStep === step 
                  ? 'bg-blue-500/30 text-white' 
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-xs text-white/60">
            Current: Step {parallaxState.currentStep}
          </div>
        </div>
      </div>
    </div>
  );
};
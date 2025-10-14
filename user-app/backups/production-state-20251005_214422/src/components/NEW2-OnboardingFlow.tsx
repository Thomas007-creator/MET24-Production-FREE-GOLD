import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
// import DatabaseService from '../services/databaseService';
import { logger } from '../utils/logger';

// Import onboarding steps
import {
  OnboardingAccountCreated,
  OnboardingAuth,
  OnboardingPrivacy,
  OnboardingProfile,
  OnboardingAccountSecurity,
  OnboardingMbti,
  OnboardingMbtiQuicktest,
  OnboardingMbtiResult,
  OnboardingInterests,
  OnboardingContext,
  OnboardingWellness,
  OnboardingNotifications,
  OnboardingVerification,
  OnboardingComplete,
  // Premium features (later toegevoegd als 4 extra vragen)
  // OnboardingContentPreferences,
  // OnboardingOfflineSetup,
  // OnboardingAICoachingIntro,
  // OnboardingContentLibrary,
} from './OnboardingSteps';
import IntroPage from './OnboardingSteps/IntroPage';

// Define proper types for user data
interface UserData {
  mbtiType?: string;
  mbtiPercentages?: Record<string, { percentage: number; confidence: number; letter: string }>;
  mbtiConfidence?: number;
  interests?: string[];
  name?: string;
  email?: string;
  // Premium features data (later toegevoegd)
  // contentPreferences?: any;
  // offlineSetup?: any;
  // aiCoaching?: any;
  // contentLibrary?: any;
  [key: string]: string | number | string[] | Record<string, { percentage: number; confidence: number; letter: string }> | undefined;
}

interface OnboardingFlowProps {
  onComplete: (userData: UserData) => void;
}

// NEW2-OnboardingFlow component - ALLE PROBLEMEN OPGELOST
const NEW2OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const navigate = useNavigate() ;
  // const databaseService = useMemo(() => new DatabaseService(), []);
  const [userData, setUserData] = useState<UserData>(() => {
    // Load user data from localStorage if available
    const saved = localStorage.getItem('onboarding_user_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        logger.error('Error parsing saved user data', { error });
      }
    }
    return {
      name: 'Test User',
      email: 'test@example.com',
    };
  }); 

  // Load mock user data on component mount
  React.useEffect(() => {
    const loadUserData = () => {
      // Mock user data loading - simplified
      logger.info('Loading mock user data');
      updateUserData({
        name: 'Test User',
        email: 'test@example.com',
      });
    };

    loadUserData();
  }, []);
  const [showIntro, setShowIntro] = useState(false);

  // Helper function to update userData and save to localStorage
  const updateUserData = (newData: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      // Save to localStorage for persistence
      localStorage.setItem('onboarding_user_data', JSON.stringify(updated));
      logger.info('User data updated and saved', { updated });
      return updated;
    });
  };

  const handleNext = () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/step-1')) {
      navigate('/onboarding/step-2');
    } else if (currentPath.includes('/step-2')) {
      navigate('/onboarding/step-3');
    } else if (currentPath.includes('/step-3')) {
      navigate('/onboarding/step-4');
    } else if (currentPath.includes('/step-4')) {
      navigate('/onboarding/step-5');
    } else if (currentPath.includes('/step-5')) {
      navigate('/onboarding/step-6');
    } else if (currentPath.includes('/step-6')) {
      navigate('/onboarding/step-7');
    } else if (currentPath.includes('/step-7')) {
      navigate('/onboarding/step-8');
    } else if (currentPath.includes('/step-8')) {
      navigate('/onboarding/step-9');
    } else if (currentPath.includes('/step-9')) {
      navigate('/onboarding/step-10');
    } else if (currentPath.includes('/step-10')) {
      navigate('/onboarding/step-11');
    } else if (currentPath.includes('/step-11')) {
      navigate('/onboarding/step-12');
    } else if (currentPath.includes('/step-12')) {
      navigate('/onboarding/step-13');
    } else if (currentPath.includes('/step-13')) {
      navigate('/onboarding/step-14');
    } else if (currentPath.includes('/step-14')) {
      // Stap 14 = Complete - ga direct naar MainView
      onComplete(userData);
    }
  };

  const handleSkip = () => {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/step-4')) {
      navigate('/onboarding/step-5');
    } else if (currentPath.includes('/step-7')) {
      navigate('/onboarding/step-8');
    } else if (currentPath.includes('/step-9')) {
      navigate('/onboarding/step-10');
    } else if (currentPath.includes('/step-10')) {
      navigate('/onboarding/step-11');
    } else if (currentPath.includes('/step-11')) {
      navigate('/onboarding/step-12');
    } else if (currentPath.includes('/step-12')) {
      navigate('/onboarding/step-13');
    } else if (currentPath.includes('/step-13')) {
      navigate('/onboarding/step-14');
    } else if (currentPath.includes('/step-14')) {
      // Stap 14 = Complete - ga direct naar MainView
      onComplete(userData);
    }
  };

  const handleMbtiKnown = () => {
    // MBTI code was entered, proceed to next step
    handleNext();
  };

  const handleQuickTest = () => {
    navigate('/onboarding/step-7');
  };

  const handleQuicktestComplete = (result: any) => {
    logger.info('Quicktest completed with result', { result });
    // Update user data with MBTI result
    userData.mbtiType = result.letters;
    // Navigate to result page
    navigate('/onboarding/step-8');
  };

  const handleMbtiResultSave = () => {
    logger.info('MBTI result saved, proceeding to interests');
    navigate('/onboarding/step-9');
  };

  const handleMbtiResultEdit = () => {
    navigate('/onboarding/step-7');
  };

  const handleInterestsComplete = (interests: string[]) => {
    logger.info('Interests completed', { interests });
    updateUserData({ interests });
    navigate('/onboarding/step-10');
  };

  const handleContextComplete = () => {
    logger.info('Context completed, proceeding to wellness');
    // Navigate directly to step 11 (wellness)
    navigate('/onboarding/step-11');
  };

  const handleWellnessComplete = () => {
    logger.info('Wellness completed, proceeding to notifications');
    // Navigate directly to step 12 (notifications)
    navigate('/onboarding/step-12');
  };

  const handleNotificationsComplete = () => {
    logger.info('Notifications completed, proceeding to verification');
    // Navigate directly to step 13 (verification)
    navigate('/onboarding/step-13');
  };

  const handleVerificationComplete = () => {
    logger.info('Verification completed, proceeding to step 14');
    // Navigate to step 14
    navigate('/onboarding/step-14');
  };

  // Premium features handlers (later toegevoegd als 4 extra vragen)
  // const handleContentPreferencesComplete = (preferences: any) => { ... };
  // const handleOfflineSetupComplete = (setup: any) => { ... };
  // const handleAICoachingComplete = (coaching: any) => { ... };
  // const handleContentLibraryComplete = (library: any) => { ... };

  const handleIntro = () => {
    setShowIntro(true);
  };

  const handleBackToStart = () => {
    setShowIntro(false);
  };

  const handleLogin = () => {
    navigate('/onboarding/step-5');
  };

  if (showIntro) {
    return <IntroPage onBackToStart={handleBackToStart} />;
  }

  return (
    <Routes>
      <Route
        path='/step-1'
        element={
          <OnboardingAccountCreated
            onNext={handleNext}
            onIntro={handleIntro}
            onLogin={handleLogin}
          />
        }
      />
      <Route path='/step-2' element={<OnboardingAuth onNext={handleNext} />} />
      <Route
        path='/step-3'
        element={
          <OnboardingPrivacy
            onAccept={handleNext}
            onMoreInfo={() => logger.info('More info requested for privacy step')}
          />
        }
      />
      <Route
        path='/step-4'
        element={<OnboardingProfile onNext={handleNext} onSkip={handleSkip} />}
      />
      <Route
        path='/step-5'
        element={<OnboardingAccountSecurity onNext={handleNext} onBack={() => navigate('/onboarding/step-4')} />}
      />
      <Route
        path='/step-6'
        element={
          <OnboardingMbti
            onMbtiKnown={handleMbtiKnown}
            onQuickTest={handleQuickTest}
            onBack={() => navigate('/onboarding/step-5')}
          />
        }
      />
      <Route
        path='/step-7'
        element={
          <OnboardingMbtiQuicktest
            onComplete={handleQuicktestComplete}
            onSkip={handleSkip}
          />
        }
      />
      <Route
        path='/step-8'
        element={
          <>
            {/* Debug info */}
            <div
              style={{
                position: 'fixed',
                top: 10,
                right: 10,
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '12px',
                zIndex: 1000,
              }}
            >
              <strong>DEBUG:</strong>
              <br />
              mbtiType: {userData.mbtiType}
              <br />
              mbtiConfidence: {userData.mbtiConfidence}
              <br />
              mbtiPercentages: {userData.mbtiPercentages ? '✅' : '❌'}
            </div>
            <OnboardingMbtiResult
              result={{
                letters: userData.mbtiType || 'Geen MBTI type',
                percentages: userData.mbtiPercentages || {
                  'I/E': { percentage: 0, confidence: 0, letter: '?' },
                  'S/N': { percentage: 0, confidence: 0, letter: '?' },
                  'T/F': { percentage: 0, confidence: 0, letter: '?' },
                  'J/P': { percentage: 0, confidence: 0, letter: '?' },
                },
                confidence: userData.mbtiConfidence || 0,
              }}
              onSave={handleMbtiResultSave}
              onEdit={handleMbtiResultEdit}
              onBack={() => navigate('/onboarding/step-7')}
            />
          </>
        }
      />
      <Route
        path='/step-9'
        element={
          <OnboardingInterests
            onNext={handleInterestsComplete}
            onSkip={handleSkip}
          />
        }
      />
      <Route
        path='/step-10'
        element={
          <OnboardingContext
            onNext={handleContextComplete}
            onSkip={handleSkip}
          />
        }
      />
      <Route
        path='/step-11'
        element={
          <OnboardingWellness
            onNext={handleWellnessComplete}
            onSkip={handleSkip}
          />
        }
      />
      <Route
        path='/step-12'
        element={
          <OnboardingNotifications
            onNext={handleNotificationsComplete}
            onSkip={handleSkip}
          />
        }
      />
      <Route
        path='/step-13'
        element={
          <OnboardingVerification
            onNext={handleVerificationComplete}
            onSkip={handleSkip}
          />
        }
      />
      <Route
        path='/step-14'
        element={
          <OnboardingComplete onComplete={(data: any) => onComplete(data)} userData={userData as any} />
        }
      />
      {/* Premium features routes (later toegevoegd als 4 extra vragen) */}
      {/* Stappen 15-18 zijn verwijderd uit basis onboarding */}
      <Route path='*' element={<Navigate to='/step-1' replace />} />
    </Routes>
  );
};

export default NEW2OnboardingFlow;
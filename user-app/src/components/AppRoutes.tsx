import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';
import PWAInstallPrompt from './PWAInstallPrompt';

// Import alleen bestaande en werkende componenten
const MainView = React.lazy(() => import('./MainView'));
const NEW2OnboardingFlow = React.lazy(() => import('./NEW2-OnboardingFlow'));
const DashboardPage = React.lazy(() => import('./DashboardPage'));
const TherapistPage = React.lazy(() => import('./TherapistPage'));
const ChatPage = React.lazy(() => import('./ChatPage'));
const CommunitiesPage = React.lazy(() => import('./CommunitiesPage'));
const ChallengesPage = React.lazy(() => import('./ChallengesPage'));
const JournalingPage = React.lazy(() => import('./JournalingPage'));
const ProfilePage = React.lazy(() => import('./ProfilePage'));
const SettingsPage = React.lazy(() => import('./SettingsPage'));
const HolisticWellnessDashboard = React.lazy(() => import('./HolisticWellnessDashboard'));
const OnboardingTest = React.lazy(() => import('./OnboardingTest'));
const ActiveImaginationPage = React.lazy(() => import('./ActiveImaginationPage'));
const MET24DomainsPage = React.lazy(() => import('./MET24DomainsPage'));
const UniverseleLevensboom = React.lazy(() => import('./UniverseleLevensboom'));
const StreamlinedMainView = React.lazy(() => import('./StreamlinedMainView'));
const BackToBasicsPage = React.lazy(() => import('./BackToBasics/BackToBasicsPage'));
const LevensgebiedDetailPage = React.lazy(() => import('./BackToBasics/LevensgebiedDetailPage'));
const WellnessAssessmentPage = React.lazy(() => import('./WellnessAssessmentPage'));
const DevelopDataPage = React.lazy(() => import('./DevelopDataPage'));
const UpgradeGoldPage = React.lazy(() => import('./UpgradeGoldPage'));
const UpgradePlatinumPage = React.lazy(() => import('./UpgradePlatinumPage'));
const PracticalApplicationsHub = React.lazy(() => import('./platinum/PracticalApplicationsHub'));
const IndividualTherapyPrograms = React.lazy(() => import('./platinum/IndividualTherapyPrograms'));
const SmartFilteringTest = React.lazy(() => import('./ai/SmartFilteringTest'));
const AIBuddyInterface = React.lazy(() => import('./ai/AIBuddyInterface'));
const AIBuddyTest = React.lazy(() => import('./ai/AIBuddyTest'));
const PersonalMBTICoachInterface = React.lazy(() => import('./PersonalMBTICoachInterface'));
const DatabaseMigrationTest = React.lazy(() => import('./DatabaseMigrationTest'));
const SyncServiceDemo = React.lazy(() => import('./SyncServiceDemo'));
const V14SyncStatus = React.lazy(() => import('./V14SyncStatus'));
const PreDownloadForm = React.lazy(() => import('./PreDownloadForm'));
const PWATest = React.lazy(() => import('./PWATest'));
const MockTestPage = React.lazy(() => import('./MockTestPage'));
const OnboardingFlowSimulator = React.lazy(() => import('./OnboardingFlowSimulator'));
const V14AuditIntegrationTestPage = React.lazy(() => import('./TestPages/V14AuditIntegrationTestPage'));
const MPNetTestComponent = React.lazy(() => import('./testing/MPNetTestComponent'));
const AICoachingInterface = React.lazy(() => import('./AICoachingInterface'));
const WellnessAnalysisInterface = React.lazy(() => import('./WellnessAnalysisInterface'));
const ActiveImaginationInterface = React.lazy(() => import('./ActiveImaginationInterface'));
const AI3PersonalActionPlansInterface = React.lazy(() => import('./ai3/AI3PersonalActionPlansInterface'));
const ContentDiscoveryInterface = React.lazy(() => import('./ContentDiscoveryInterface'));
const AIOrchestrationInterface = React.lazy(() => import('./AIOrchestrationInterface'));
const DiscourseIntegrationInterface = React.lazy(() => import('./DiscourseIntegrationInterface'));
const ChatLLMRAGInterface = React.lazy(() => import('./ChatLLMRAGInterface'));
const BMADDashboard = React.lazy(() => import('./BMADDashboard'));

// Enhanced Loading component with glassmorphism
const LoadingSpinner: React.FC = () => (
  <div className='min-h-screen flex flex-col justify-center items-center text-white font-sans relative overflow-hidden'>
    {/* Animated background elements */}
    <div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 animate-pulse'></div>
    
    {/* Glass card for loading content */}
    <div className='glass-strong p-8 rounded-2xl text-center relative z-10'>
      <div className='relative'>
        {/* Enhanced spinner with gradient */}
        <div className='animate-spin rounded-full h-24 w-24 border-4 border-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mx-auto mb-6'></div>
        <div className='absolute inset-0 animate-spin rounded-full h-24 w-24 border-4 border-transparent border-t-white/30 mx-auto'></div>
      </div>
      
      <h2 className='text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent'>
        Your Future Self
      </h2>
      <p className='text-lg text-white/80'>Laden van je persoonlijke AI coach...</p>
      
      {/* Progress dots */}
      <div className='flex justify-center space-x-2 mt-4'>
        <div className='w-2 h-2 bg-cyan-400 rounded-full animate-bounce'></div>
        <div className='w-2 h-2 bg-blue-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
        <div className='w-2 h-2 bg-purple-600 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
);

// AppRoutes component with MainView and onboarding
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [onboardingCompleted, setOnboardingCompleted] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Check if onboarding is completed
    const completed = localStorage.getItem('onboarding_completed') === 'true';
    setOnboardingCompleted(completed);
    
    // Load user data from localStorage
    const storedUserData = localStorage.getItem('onboarding_user_data');
    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        logger.error('Failed to parse user data from localStorage', { error });
      }
    }
  }, []);

  const handleOnboardingComplete = (newUserData?: any) => {
    logger.info('Onboarding completed!', { userData: newUserData });
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_user_data', JSON.stringify(newUserData || {}));
    setUserData(newUserData || {});
    setOnboardingCompleted(true);
  };

  {
    /* Upgrade en payment handlers tijdelijk uitgeschakeld
  const handleUpgradeCancel = () => {
    logger.info('Upgrade cancelled, navigating back to main');
    navigate('/');
  };

  const handlePaymentBack = () => {
    logger.info('Payment back, navigating to upgrade-gold');
    navigate('/upgrade-gold');
  };

  const handlePaymentCancel = () => {
    logger.info('Payment cancelled, navigating back to main');
    navigate('/');
  };
  */
  }

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Onboarding routes */}
        {!onboardingCompleted && (
          <>
            <Route
              path='/onboarding/*'
              element={
                <NEW2OnboardingFlow onComplete={handleOnboardingComplete} />
              }
            />
            <Route
              path='*'
              element={<Navigate to='/onboarding/step-1' replace />}
            />
          </>
        )}

                    {/* Test routes (always available) */}
            <Route path='/test-onboarding' element={<OnboardingTest />} />
            <Route path='/test-filtering' element={<SmartFilteringTest />} />
            <Route path='/ai-buddy' element={
              <AIBuddyInterface 
                userId={userData?.id || 'anonymous'} 
                mbtiType={userData?.mbtiType || 'ENFP'} 
              />
            } />
            <Route path='/ai-coaching' element={<AICoachingInterface />} />
            <Route path='/wellness-analysis' element={<WellnessAnalysisInterface />} />
            <Route path='/active-imagination' element={<ActiveImaginationInterface />} />
            <Route path='/ai3-action-plans' element={<AI3PersonalActionPlansInterface />} />
            <Route path='/content-discovery' element={<ContentDiscoveryInterface />} />
            <Route path='/ai-orchestration' element={<AIOrchestrationInterface />} />
            <Route path='/discourse-support' element={<DiscourseIntegrationInterface />} />
            <Route path='/chatllm-rag' element={<ChatLLMRAGInterface />} />
            <Route path='/personal-coach' element={<PersonalMBTICoachInterface />} />
            <Route path='/test-ai-buddy' element={<AIBuddyTest />} />
            <Route path='/test-mpnet' element={<MPNetTestComponent />} />
            <Route path='/test-bmad' element={<BMADDashboard />} />
            <Route path='/test-database' element={<DatabaseMigrationTest />} />
            <Route path='/test-sync' element={<SyncServiceDemo />} />
            <Route path='/test-v14-audit' element={<V14AuditIntegrationTestPage />} />
            <Route path='/v14-sync-status' element={<V14SyncStatus />} />
            <Route path='/pre-download' element={<PreDownloadForm />} />
            <Route path='/pwa-test' element={<PWATest />} />
            <Route path='/practical-applications' element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
                <PracticalApplicationsHub />
              </React.Suspense>
            } />
            <Route path='/individual-therapy-programs' element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
                <IndividualTherapyPrograms />
              </React.Suspense>
            } />

        {/* Main app routes (only when onboarding is completed) */}
        {onboardingCompleted && (
          <>
            <Route path='/' element={<MainView />} />
            <Route path='/streamlined' element={<StreamlinedMainView />} />
            <Route path='/analytics' element={<DashboardPage />} />
            <Route path='/therapist' element={<TherapistPage />} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/communities' element={<CommunitiesPage />} />
            <Route path='/challenges' element={<ChallengesPage />} />
            <Route path='/journaling' element={<JournalingPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='/active-imagination' element={<ActiveImaginationPage />} />
            <Route path='/met24-domains' element={<UniverseleLevensboom />} />
            <Route path='/universele-levensboom' element={<UniverseleLevensboom />} />
            <Route path='/back-to-basics' element={<BackToBasicsPage />} />
            <Route path='/levensgebied/:id' element={<LevensgebiedDetailPage />} />
            <Route path='/holistic-wellness' element={<HolisticWellnessDashboard />} />
            <Route path='/wellness-assessment' element={<WellnessAssessmentPage />} />
            <Route path='/develop-data' element={<DevelopDataPage />} />

            {/* Test routes */}
            <Route path='/mock-test' element={<MockTestPage />} />
            <Route path='/onboarding-simulator' element={<OnboardingFlowSimulator />} />

            {/* Upgrade flow routes */}
            <Route path="/upgrade-platinum" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
                <UpgradePlatinumPage 
                  userName="Gebruiker"
                  mbtiType="INTP"
                  onSelectSubscription={(planId: string) => {
                    logger.info('Platinum plan selected', { planId });
                    // Voor nu direct naar success - later payment integration
                    alert(`🎉 Upgrade naar Platinum ${planId} succesvol! Ontgrendel de MET2.4 domeinen!`);
                    navigate('/met24-domains');
                  }}
                  onCancel={() => navigate('/')}
                />
              </React.Suspense>
            } />
            <Route path="/upgrade-gold" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
                <UpgradeGoldPage 
                  userName="Gebruiker"
                  mbtiType="INTP"
                  onSelectSubscription={(planId: string) => {
                    logger.info('Plan selected', { planId });
                    // Voor nu direct naar success - later payment integration
                    alert(`🎉 Upgrade naar ${planId} succesvol! Veel plezier met Gold.`);
                    navigate('/');
                  }}
                  onCancel={() => navigate('/')}
                />
              </React.Suspense>
            } />

            {/* Payment selection route - tijdelijk uitgeschakeld tot component beschikbaar is
            <Route path="/payment-selection" element={
              <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
                <PaymentSelectionPage 
                  selectedPlan="monthly"
                  onSelectPaymentMethod={(method: string) => {
                    logger.info('Payment method selected:', method);
                    // Hier zou je naar de externe betalingspagina gaan
                    alert('Betaling wordt verwerkt...');
                    navigate('/');
                  }}
                  onBack={handlePaymentBack}
                  onCancel={handlePaymentCancel}
                />
              </React.Suspense>
            } />
            */}

            <Route path='*' element={<Navigate to='/' replace />} />
          </>
        )}
        </Routes>
        
        {/* PWA Install Prompt - Available for all routes */}
        <PWAInstallPrompt />
      </React.Suspense>
    );
  };

  export default AppRoutes;

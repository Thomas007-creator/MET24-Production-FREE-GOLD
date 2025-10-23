import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NEW2OnboardingFlow from './NEW2-OnboardingFlow';

const OnboardingTest: React.FC = () => {
  const [testMode, setTestMode] = useState<'original' | 'revolutionary'>('original');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [completedData, setCompletedData] = useState<any>(null);

  const handleOnboardingComplete = (userData: any) => {
    setCompletedData(userData);
    setIsOnboarding(false);
    console.log('Onboarding completed with data:', userData);
  };

  const startOnboarding = (mode: 'original' | 'revolutionary') => {
    setTestMode(mode);
    setIsOnboarding(true);
    setCompletedData(null);
  };

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-slate-900/20">
        <NEW2OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/20 via-purple-900/20 to-slate-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8 text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-6">
            Onboarding Test Suite
          </h1>
          
          <p className="text-gray-300 mb-8">
            Test beide onboarding flows om te controleren of ze correct werken
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startOnboarding('original')}
              className="p-6 rounded-lg border-2 border-blue-400 bg-blue-400/20 text-white hover:bg-blue-400/30 transition-all"
            >
              <div className="text-2xl mb-3">📋</div>
              <h2 className="text-xl font-semibold mb-2">Originele 14 Stappen</h2>
              <p className="text-sm opacity-75">
                Test de originele onboarding flow zonder content features
              </p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => startOnboarding('revolutionary')}
              className="p-6 rounded-lg border-2 border-purple-400 bg-purple-400/20 text-white hover:bg-purple-400/30 transition-all"
            >
              <div className="text-2xl mb-3">🚀</div>
              <h2 className="text-xl font-semibold mb-2">Revolutionaire 18 Stappen</h2>
              <p className="text-sm opacity-75">
                Test de nieuwe onboarding flow met content features
              </p>
            </motion.button>
          </div>

          {completedData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 text-left"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Onboarding Voltooid ({testMode === 'original' ? '14 stappen' : '18 stappen'})
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-white mb-2">Basisgegevens:</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>Naam: {completedData.name}</li>
                    <li>Email: {completedData.email}</li>
                    <li>MBTI: {completedData.mbtiType || 'Niet ingesteld'}</li>
                    <li>Interesses: {completedData.interests?.length || 0} geselecteerd</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-white mb-2">Content Features:</h4>
                  <ul className="text-gray-300 space-y-1">
                    <li>Content Preferences: {completedData.contentPreferences ? '✅' : '❌'}</li>
                    <li>Offline Setup: {completedData.offlineSetup ? '✅' : '❌'}</li>
                    <li>AI Coaching: {completedData.aiCoaching ? '✅' : '❌'}</li>
                    <li>Content Library: {completedData.contentLibrary ? '✅' : '❌'}</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-white mb-2">Raw Data:</h4>
                <pre className="text-xs text-gray-300 overflow-auto max-h-32">
                  {JSON.stringify(completedData, null, 2)}
                </pre>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCompletedData(null)}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
              >
                Nieuwe Test Starten
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingTest;

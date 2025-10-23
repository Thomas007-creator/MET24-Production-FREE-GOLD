import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardBody, Button, Input, Textarea } from '@nextui-org/react';
import database from '../database/v14/database';
import { useAppStore } from '../store/useAppStore';
import { syncTableWithSupabase } from '../services/v14SupabaseSync';
import { logger } from '../utils/logger';

// ================================================
// SIMPLIFIED 3-STEP ONBOARDING FLOW
// ================================================

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
}

// Step 1: Welcome Screen
const OnboardingStart: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 max-w-md w-full">
        <CardBody className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Future Self
          </h1>
          <p className="text-gray-600 mb-6">
            Let's get you started with a quick 3-step setup to personalize your MBTI coaching experience.
          </p>
          <Button 
            color="primary" 
            size="lg" 
            onPress={onNext}
            className="w-full"
          >
            Get Started
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// Step 2: Profile Setup
const OnboardingProfile: React.FC<{ 
  onNext: (data: { name: string; email: string; preferences: string }) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleNext = () => {
    if (name.trim() && email.trim()) {
      onNext({ name: name.trim(), email: email.trim(), preferences: preferences.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 max-w-md w-full">
        <CardBody className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Tell Us About Yourself
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
            />
            
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
            />
            
            <Textarea
              label="Preferences (Optional)"
              placeholder="Any specific interests or goals?"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              minRows={3}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              variant="ghost" 
              onPress={onBack}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              color="primary" 
              onPress={handleNext}
              className="flex-1"
              isDisabled={!name.trim() || !email.trim()}
            >
              Continue
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

// Step 3: Completion
const OnboardingComplete: React.FC<{ 
  onComplete: (data: any) => void;
  userData: any;
}> = ({ onComplete, userData }) => {
  const { setUserData } = useAppStore();
  const navigate = useNavigate();
  
  const handleComplete = async () => {
    try {
      logger.info('Starting onboarding completion process', { userData });
      
      // 1. Update V14 database
      const usersCollection = database.collections.get('users');
      
      await database.write(async () => {
        // Create or update user record
        const existingUsers = await usersCollection.query().fetch();
        let userRecord;
        
        if (existingUsers.length > 0) {
          // Update existing user
          userRecord = existingUsers[0];
          await userRecord.update((user: any) => {
            user.onboarding_completed = true;
            user.full_name = userData.name;
            user.email = userData.email;
            user.mbti_type = userData.mbti_type || 'INFP'; // Default
            user.preferences = userData.preferences || '';
            user.updated_at = Date.now();
          });
        } else {
          // Create new user
          userRecord = await usersCollection.create((user: any) => {
            user.onboarding_completed = true;
            user.full_name = userData.name;
            user.email = userData.email;
            user.mbti_type = userData.mbti_type || 'INFP'; // Default
            user.preferences = userData.preferences || '';
            user.created_at = Date.now();
            user.updated_at = Date.now();
          });
        }
      });
      
      // 2. Sync to Supabase
      await syncTableWithSupabase('users');
      logger.info('User data synced to Supabase');
      
      // 3. Update Zustand store
      setUserData({
        id: userData.id || 'user-1',
        name: userData.name,
        email: userData.email,
        mbtiType: userData.mbti_type || 'INFP',
        onboardingCompleted: true
      });
      
      // 4. Update localStorage for routing
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      logger.info('Onboarding completed successfully');
      
      // 5. Navigate to main app
      onComplete(userData);
      
    } catch (error) {
      logger.error('Onboarding completion failed', { error });
      console.error('Onboarding completion failed:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 max-w-md w-full">
        <CardBody className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎉 Welcome, {userData.name}!
          </h2>
          <p className="text-gray-600 mb-6">
            Your profile has been set up successfully. You're ready to start your personalized MBTI coaching journey!
          </p>
          
          <div className="bg-white/20 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Your Profile:</h3>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>MBTI Type:</strong> {userData.mbti_type || 'INFP (Default)'}</p>
            {userData.preferences && (
              <p><strong>Preferences:</strong> {userData.preferences}</p>
            )}
          </div>
          
          <Button 
            color="primary" 
            size="lg" 
            onPress={handleComplete}
            className="w-full"
          >
            Complete Setup & Continue
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// Main Onboarding Flow Component
const NEW2OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>({
    name: '',
    email: '',
    preferences: '',
    mbti_type: 'INFP' // Default MBTI type
  });

  const handleProfileComplete = (profileData: { name: string; email: string; preferences: string }) => {
    const updatedData = { ...userData, ...profileData };
    setUserData(updatedData);
    navigate('/onboarding/step-3');
  };

  const handleBack = () => {
    navigate('/onboarding/step-1');
  };

  return (
    <Routes>
      <Route
        path="/step-1"
        element={<OnboardingStart onNext={() => navigate('/onboarding/step-2')} />}
      />
      <Route
        path="/step-2"
        element={
          <OnboardingProfile 
            onNext={handleProfileComplete}
            onBack={handleBack}
          />
        }
      />
      <Route
        path="/step-3"
        element={
          <OnboardingComplete 
            onComplete={onComplete}
            userData={userData}
          />
        }
      />
      <Route path="*" element={<Navigate to="/onboarding/step-1" replace />} />
    </Routes>
  );
};

export default NEW2OnboardingFlow;


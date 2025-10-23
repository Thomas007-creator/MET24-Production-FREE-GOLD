import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type {
  MBTIConfigState,
  MBTIConfigActions,
  MBTIConfigContextType,
  CoachingContext
} from './types';

const MBTIConfigContext = createContext<MBTIConfigContextType | null>(null);

export const useMBTIConfig = () => {
  const context = useContext(MBTIConfigContext);
  if (!context) {
    throw new Error('useMBTIConfig must be used within MBTIConfigProvider');
  }
  return context;
};

interface MBTIConfigProviderProps {
  children: React.ReactNode;
}

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

export const MBTIConfigProvider: React.FC<MBTIConfigProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [selectedMbtiType, setSelectedMbtiType] = useState(userData?.mbtiType || 'INFP');
  const [context, setContext] = useState<CoachingContext>({
    userId: userData?.id || 'demo_user',
    moodRating: 3,
    focusAreas: [],
    activeGoals: [],
    wellnessScores: []
  });

  // Update MBTI type when user data changes
  useEffect(() => {
    if (userData?.mbtiType) {
      setSelectedMbtiType(userData.mbtiType);
    }
  }, [userData?.mbtiType]);

  // Update user ID when user data changes
  useEffect(() => {
    if (userData?.id) {
      setContext(prev => ({ ...prev, userId: userData.id! }));
    }
  }, [userData?.id]);

  const setMbtiType = useCallback((type: string) => {
    setSelectedMbtiType(type);
  }, []);

  const updateContext = useCallback((updates: Partial<CoachingContext>) => {
    setContext(prev => ({ ...prev, ...updates }));
  }, []);

  const resetContext = useCallback(() => {
    setContext({
      userId: userData?.id || 'demo_user',
      moodRating: 3,
      focusAreas: [],
      activeGoals: [],
      wellnessScores: []
    });
  }, [userData?.id]);

  const value: MBTIConfigContextType = {
    selectedMbtiType,
    availableTypes: mbtiTypes,
    context,
    setMbtiType,
    updateContext,
    resetContext
  };

  return (
    <MBTIConfigContext.Provider value={value}>
      {children}
    </MBTIConfigContext.Provider>
  );
};
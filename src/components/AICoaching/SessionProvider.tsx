import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import aiCoachingChatLLM from '../../services/aiCoachingChatLLM';
import type {
  CoachingSession,
  SessionState,
  SessionActions,
  SessionContextType,
  CoachingContext,
  ChatMessage
} from './types';

const SessionContext = createContext<SessionContextType | null>(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<CoachingSession[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateSessionId = useCallback(() => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const startNewSession = useCallback(() => {
    const newSession: CoachingSession = {
      id: generateSessionId(),
      messages: [],
      mbtiType: userData?.mbtiType || 'INFP',
      startTime: Date.now(),
      context: {
        userId: userData?.id || 'demo_user',
        moodRating: 3,
        focusAreas: [],
        activeGoals: [],
        wellnessScores: []
      }
    };

    setCurrentSession(newSession);
  }, [userData, generateSessionId]);

  const endSession = useCallback(() => {
    if (currentSession) {
      setSessionHistory(prev => [...prev, currentSession]);
      setCurrentSession(null);
    }
  }, [currentSession]);

  const rateSession = useCallback(async (rating: number) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      effectiveness: rating
    };

    setCurrentSession(updatedSession);
    setSessionHistory(prev => [...prev, updatedSession]);

    // Save rating to service
    const lastCoachMessage = currentSession.messages
      .filter(m => m.type === 'coach')
      .pop();

    if (lastCoachMessage?.id) {
      await aiCoachingChatLLM.rateSessionEffectiveness(lastCoachMessage.id, rating);
    }
  }, [currentSession]);

  const addToHistory = useCallback((session: CoachingSession) => {
    setSessionHistory(prev => [...prev, session]);
  }, []);

  const value: SessionContextType = {
    currentSession,
    sessionHistory,
    isProcessing,
    startNewSession,
    endSession,
    rateSession,
    addToHistory
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
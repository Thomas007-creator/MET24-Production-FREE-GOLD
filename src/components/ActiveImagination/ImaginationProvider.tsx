import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { activeImaginationChatLLMService } from '../../services/activeImaginationChatLLM';
import type {
  ImaginationSession,
  ImaginationState,
  ImaginationActions,
  ImaginationContextType
} from './imagination-types';

const ImaginationContext = createContext<ImaginationContextType | null>(null);

export const useImagination = () => {
  const context = useContext(ImaginationContext);
  if (!context) {
    throw new Error('useImagination must be used within ImaginationProvider');
  }
  return context;
};

interface ImaginationProviderProps {
  children: React.ReactNode;
}

export const ImaginationProvider: React.FC<ImaginationProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [currentSession, setCurrentSession] = useState<ImaginationSession | null>(null);
  const [sessionType, setSessionType] = useState<'guided' | 'free-form' | 'mbti-specific'>('guided');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isSessionActive = currentSession?.status === 'active';

  // Start new imagination session
  const startSession = useCallback(async () => {
    if (!userData?.id) return;

    try {
      setIsProcessing(true);

      const session = await activeImaginationChatLLMService.startImaginationSession(
        userData.id,
        userData.mbtiType || 'INFP',
        sessionType
      );

      setCurrentSession({
        id: session.id,
        type: session.sessionType,
        prompt: session.prompt,
        responses: [],
        duration: 0,
        status: 'active',
        creativityScore: 0,
        insights: []
      });

    } catch (error) {
      console.error('Error starting imagination session:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [userData, sessionType]);

  // Submit response to current session
  const submitResponse = useCallback(async () => {
    if (!currentSession || !currentResponse.trim()) return;

    try {
      setIsProcessing(true);

      const guidance = await activeImaginationChatLLMService.processImaginationResponse(
        currentSession.id,
        currentResponse,
        userData?.mbtiType || 'INFP'
      );

      setCurrentSession(prev => prev ? {
        ...prev,
        responses: [...prev.responses, {
          timestamp: new Date(),
          content: currentResponse,
          guidance: guidance.guidance
        }]
      } : null);

      setCurrentResponse('');

    } catch (error) {
      console.error('Error processing session response:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [currentSession, currentResponse, userData]);

  // Complete current session
  const completeSession = useCallback(async () => {
    if (!currentSession) return;

    try {
      setIsProcessing(true);

      const insights = await activeImaginationChatLLMService.completeImaginationSession(
        currentSession.id,
        userData?.mbtiType || 'INFP'
      );

      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'completed',
        insights: insights.map(i => i.description)
      } : null);

    } catch (error) {
      console.error('Error completing session:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [currentSession, userData]);

  // Pause session
  const pauseSession = useCallback(() => {
    setCurrentSession(prev => prev ? { ...prev, status: 'paused' } : null);
  }, []);

  // Resume session
  const resumeSession = useCallback(() => {
    setCurrentSession(prev => prev ? { ...prev, status: 'active' } : null);
  }, []);

  // Update response text
  const updateResponse = useCallback((response: string) => {
    setCurrentResponse(response);
  }, []);

  const contextValue: ImaginationContextType = {
    // State
    currentSession,
    sessionType,
    currentResponse,
    isSessionActive,
    isProcessing,

    // Actions
    startSession,
    submitResponse,
    completeSession,
    pauseSession,
    resumeSession,
    setSessionType,
    updateResponse
  };

  return (
    <ImaginationContext.Provider value={contextValue}>
      {children}
    </ImaginationContext.Provider>
  );
};
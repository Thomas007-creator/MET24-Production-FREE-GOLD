/**
 * Active Imagination Page Provider - BMAD Architecture
 *
 * Centralized state management and business logic for Active Imagination features
 *
 * @version 14.0.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { activeImaginationService, ImaginationSession, Inspiration } from '../services/activeImaginationService';
import { logger } from '../utils/logger';

interface ActiveImaginationContextType {
  // State
  currentStep: number;
  sessionId: string | null;
  userResponse: string;
  aiResponse: string;
  inspirations: Inspiration[];
  isLoading: boolean;
  showInspirationsStats: boolean;
  videoUrl: string;
  videoDescription: string;
  ai1Active: boolean;
  aiLoading: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  setUserResponse: (response: string) => void;
  setAiResponse: (response: string) => void;
  setShowInspirationsStats: (show: boolean) => void;
  setAi1Active: (active: boolean) => void;

  // Business Logic
  startSession: (mbtiType: string) => Promise<void>;
  processResponse: (mbtiType: string) => Promise<void>;
  transferToJournaling: (inspirationId: string) => Promise<void>;
  archiveInspiration: (inspirationId: string) => Promise<void>;
  activateAI: (mbtiType: string) => Promise<void>;
  deactivateAI: () => void;
  resetSession: () => void;

  // Utilities
  getMBTIPrompt: (mbtiType: string, step: number) => string;
  loadImaginationVideo: (mbtiType: string, step: number) => void;
}

const ActiveImaginationContext = createContext<ActiveImaginationContextType | undefined>(undefined);

interface ActiveImaginationProviderProps {
  children: ReactNode;
  mbtiType?: string;
}

export const ActiveImaginationProvider: React.FC<ActiveImaginationProviderProps> = ({
  children,
  mbtiType = 'INFP'
}) => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInspirationsStats, setShowInspirationsStats] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [ai1Active, setAi1Active] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Service instance
  const imaginationService = useMemo(() => activeImaginationService, []);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load inspirations
        const userInspirations = await imaginationService.getInspirations('temp_user');
        setInspirations(userInspirations);

        // Load MBTI-specific video
        loadImaginationVideo(mbtiType, currentStep);

        logger.info('✅ Initial data loaded for Active Imagination page');
      } catch (error) {
        logger.error('❌ Failed to load initial data:', error as Error);
      }
    };

    loadInitialData();
  }, [mbtiType, currentStep]);

  // Start session
  const startSession = async (userMbtiType: string) => {
    if (!userMbtiType) return;

    setIsLoading(true);
    try {
      const newSessionId = await imaginationService.startImaginationSession(
        'temp_user',
        userMbtiType,
        `Actieve Imaginatie Sessie - ${new Date().toLocaleDateString()}`,
        '🧘 Actieve Imaginatie'
      );
      setSessionId(newSessionId);
      setCurrentStep(1);
      setAiResponse('');
      setUserResponse('');
      setAi1Active(false);

      logger.info(`✅ Started new imagination session: ${newSessionId}`);
    } catch (error) {
      logger.error('❌ Failed to start session:', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Process response
  const processResponse = async (userMbtiType: string) => {
    if (!sessionId || !userMbtiType || !userResponse.trim()) return;

    setIsLoading(true);
    try {
      const result = await imaginationService.processImaginationResponse(
        sessionId,
        userResponse,
        'temp_user',
        userMbtiType,
        currentStep
      );

      setAiResponse(result.aiResponse);
      if (result.nextStep) {
        setCurrentStep(result.nextStep);
      }
      setUserResponse('');

      // Refresh inspirations
      const newInspirations = await imaginationService.getInspirations('temp_user');
      setInspirations(newInspirations);

      logger.info(`✅ Processed response for step ${currentStep}`);
    } catch (error) {
      logger.error('❌ Failed to process response:', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer inspiration to journaling
  const transferToJournaling = async (inspirationId: string): Promise<void> => {
    try {
      const journalEntryId = await imaginationService.transferToJournaling(inspirationId, 'temp_user');

      // Refresh inspirations
      const newInspirations = await imaginationService.getInspirations('temp_user');
      setInspirations(newInspirations);

      logger.info(`✅ Transferred inspiration ${inspirationId} to journaling`);
    } catch (error) {
      logger.error('❌ Failed to transfer inspiration:', error as Error);
      throw error;
    }
  };

  // Archive inspiration
  const archiveInspiration = async (inspirationId: string) => {
    try {
      await imaginationService.archiveInspiration(inspirationId);

      // Refresh inspirations
      const newInspirations = await imaginationService.getInspirations('temp_user');
      setInspirations(newInspirations);

      logger.info(`✅ Archived inspiration ${inspirationId}`);
    } catch (error) {
      logger.error('❌ Failed to archive inspiration:', error as Error);
      throw error;
    }
  };

  // AI1 activation
  const activateAI = async (userMbtiType: string) => {
    setAiLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAi1Active(true);
        setAiResponse(`🤖 AI 1 geactiveerd voor ${userMbtiType} gebruiker.\n\nContext: Actieve Imaginatie - Zelftranscendentie Visualisatie\n\nIk ben hier om je te begeleiden bij je creatieve visualisatie reis. Wat wil je vandaag verkennen?`);
        setAiLoading(false);
        resolve();
      }, 2000);
    });
  };

  const deactivateAI = () => {
    setAi1Active(false);
    setAiResponse('');
  };

  // Reset session
  const resetSession = () => {
    setSessionId(null);
    setCurrentStep(1);
    setUserResponse('');
    setAiResponse('');
    setAi1Active(false);
  };

  // Load MBTI-specific video
  const loadImaginationVideo = (userMbtiType: string, step: number) => {
    const videoMap: { [key: string]: string } = {
      'INTP': '/videos/intp-imagination.mp4',
      'INTJ': '/videos/intj-imagination.mp4',
      'INFJ': '/videos/infj-imagination.mp4',
      'INFP': '/videos/infp-imagination.mp4'
    };

    const videoUrl = videoMap[userMbtiType] || '/videos/placeholder.mp4';
    setVideoUrl(videoUrl);
    setVideoDescription(`MBTI ${userMbtiType} - Stap ${step} beschrijving`);
  };

  // Get MBTI-specific prompt
  const getMBTIPrompt = (userMbtiType: string, step: number): string => {
    const prompts: { [key: string]: string[] } = {
      'INFP': [
        'Visualiseer je ideale toekomst waar je authentiek kunt zijn.',
        'Stel je voor hoe je creativiteit kan bijdragen aan de wereld.',
        'Verbind met je innerlijke waarden en dromen.',
        'Visualiseer jezelf als de beste versie van jezelf.',
        'Stel je voor hoe je anderen kunt inspireren.'
      ],
      'INFJ': [
        'Visualiseer je visie voor een betere wereld.',
        'Stel je voor hoe je anderen kunt helpen groeien.',
        'Verbind met je intuïtieve wijsheid.',
        'Visualiseer je rol als mentor en gids.',
        'Stel je voor hoe je diepe inzichten kunt delen.'
      ],
      'INTJ': [
        'Visualiseer je strategische plannen voor de toekomst.',
        'Stel je voor hoe je complexe problemen kunt oplossen.',
        'Verbind met je visie voor efficiëntie en vooruitgang.',
        'Visualiseer jezelf als een innovatieve leider.',
        'Stel je voor hoe je systemen kunt verbeteren.'
      ],
      'INTP': [
        'Visualiseer je ideale leeromgeving en onderzoeksprojecten.',
        'Stel je voor hoe je nieuwe concepten kunt ontdekken.',
        'Verbind met je nieuwsgierigheid en analytische geest.',
        'Visualiseer jezelf als een innovatieve denker.',
        'Stel je voor hoe je kennis kunt delen met anderen.'
      ]
    };

    const typePrompts = prompts[userMbtiType] || prompts['INFP'];
    return typePrompts[step - 1] || typePrompts[0];
  };

  const contextValue: ActiveImaginationContextType = {
    // State
    currentStep,
    sessionId,
    userResponse,
    aiResponse,
    inspirations,
    isLoading,
    showInspirationsStats,
    videoUrl,
    videoDescription,
    ai1Active,
    aiLoading,

    // Actions
    setCurrentStep,
    setUserResponse,
    setAiResponse,
    setShowInspirationsStats,
    setAi1Active,

    // Business Logic
    startSession,
    processResponse,
    transferToJournaling,
    archiveInspiration,
    activateAI,
    deactivateAI,
    resetSession,

    // Utilities
    getMBTIPrompt,
    loadImaginationVideo
  };

  return (
    <ActiveImaginationContext.Provider value={contextValue}>
      {children}
    </ActiveImaginationContext.Provider>
  );
};

export const useActiveImagination = (): ActiveImaginationContextType => {
  const context = useContext(ActiveImaginationContext);
  if (context === undefined) {
    throw new Error('useActiveImagination must be used within an ActiveImaginationProvider');
  }
  return context;
};
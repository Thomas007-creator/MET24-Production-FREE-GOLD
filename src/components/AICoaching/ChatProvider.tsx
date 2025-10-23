import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import aiCoachingChatLLM, { CoachingResponse } from '../../services/aiCoachingChatLLM';
import { useSession } from './SessionProvider';
import { useMBTIConfig } from './MBTIConfigProvider';
import { useMood } from './MoodProvider';
import { useFocusAreas } from './FocusAreaProvider';
import type {
  ChatMessage,
  ChatState,
  ChatActions,
  ChatContextType
} from './types';

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const { currentSession, addToHistory } = useSession();
  const { selectedMbtiType, context } = useMBTIConfig();
  const { currentMood } = useMood();
  const { focusAreas } = useFocusAreas();

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const getWelcomeMessage = useCallback((mbtiType: string): string => {
    const welcomeMessages: Record<string, string> = {
      'INFP': 'Hallo! Ik ben hier om je te helpen bij je persoonlijke groei. Als INFP waardeer je authenticiteit en persoonlijke betekenis. Waar zou je graag aan willen werken?',
      'INTJ': 'Welkom! Als INTJ ben je waarschijnlijk gefocust op strategische planning en zelfverbetering. Wat is je huidige doel waar ik je mee kan helpen?',
      'ENFP': 'Hey daar! Geweldig dat je hier bent! Als ENFP heb je vast veel ideeën en mogelijkheden in je hoofd. Wat inspireert je vandaag het meest?',
      'ISTJ': 'Goedemorgen! Ik waardeer je methodische aanpak als ISTJ. Laten we stap voor stap kijken naar waar je aan wilt werken. Wat is je hoofdfocus?'
    };

    return welcomeMessages[mbtiType] ||
      `Hallo! Fijn dat je er bent. Als ${mbtiType} heb je unieke sterke punten. Vertel me waar je graag aan zou willen werken.`;
  }, []);

  // Add welcome message when session starts
  useEffect(() => {
    if (currentSession && currentSession.messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'coach',
        content: getWelcomeMessage(selectedMbtiType),
        timestamp: Date.now(),
        confidence: 1.0,
        mbtiAlignment: 1.0
      };

      // Update session with welcome message (this would be handled by session provider)
      // For now, we'll just log it
      console.log('Welcome message:', welcomeMessage);
    }
  }, [currentSession, selectedMbtiType, generateMessageId, getWelcomeMessage]);

  const sendMessage = useCallback(async () => {
    if (!userInput.trim() || !currentSession || isTyping) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: userInput.trim(),
      timestamp: Date.now()
    };

    // Add user message to session (would be handled by session provider)
    setUserInput('');
    setIsTyping(true);

    try {
      // Get AI coaching response
      const response: CoachingResponse = await aiCoachingChatLLM.providePersonalizedCoaching(
        userMessage.content,
        selectedMbtiType,
        {
          ...context,
          moodRating: currentMood,
          focusAreas,
          previousSessions: [], // TODO: Convert session format
        }
      );

      // Create coach message
      const coachMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'coach',
        content: response.response,
        timestamp: Date.now(),
        insights: response.insights,
        actionSuggestions: response.actionSuggestions,
        followUpQuestions: response.followUpQuestions,
        mbtiAlignment: response.mbtiAlignment,
        confidence: response.confidence
      };

      // Add messages to session (would be handled by session provider)
      // For now, we'll just log them
      console.log('User message:', userMessage);
      console.log('Coach response:', coachMessage);

    } catch (error) {
      console.error('Error getting coaching response:', error);

      // Fallback message
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'coach',
        content: 'Sorry, ik kan momenteel niet antwoorden. Probeer het over een moment opnieuw, of vertel me meer over je situatie zodat ik je beter kan helpen.',
        timestamp: Date.now(),
        confidence: 0.5
      };

      // Add error message to session (would be handled by session provider)
      console.log('Error message:', errorMessage);
    } finally {
      setIsTyping(false);
    }
  }, [userInput, currentSession, isTyping, selectedMbtiType, context, currentMood, focusAreas, generateMessageId]);

  const addMessage = useCallback((message: ChatMessage) => {
    // This would typically update the session messages
    console.log('Adding message:', message);
  }, []);

  const clearMessages = useCallback(() => {
    // This would clear all messages in the current session
    console.log('Clearing messages');
  }, []);

  const value: ChatContextType = {
    userInput,
    messages: currentSession?.messages || [],
    isTyping,
    sendMessage,
    setUserInput,
    addMessage,
    clearMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
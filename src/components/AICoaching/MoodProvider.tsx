import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  MoodState,
  MoodActions,
  MoodContextType
} from './types';

const MoodContext = createContext<MoodContextType | null>(null);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: React.ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [currentMood, setCurrentMood] = useState(3);
  const [moodHistory, setMoodHistory] = useState<Array<{ timestamp: number; mood: number }>>([]);

  const setMood = useCallback((mood: number) => {
    setCurrentMood(mood);
  }, []);

  const addMoodEntry = useCallback((mood: number) => {
    const entry = {
      timestamp: Date.now(),
      mood
    };
    setMoodHistory(prev => [...prev, entry]);
    setCurrentMood(mood);
  }, []);

  const getAverageMood = useCallback(() => {
    if (moodHistory.length === 0) return currentMood;

    const sum = moodHistory.reduce((acc, entry) => acc + entry.mood, 0);
    return Math.round(sum / moodHistory.length);
  }, [moodHistory, currentMood]);

  const value: MoodContextType = {
    currentMood,
    moodHistory,
    setMood,
    addMoodEntry,
    getAverageMood
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};
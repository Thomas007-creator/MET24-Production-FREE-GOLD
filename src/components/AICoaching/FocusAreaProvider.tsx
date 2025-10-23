import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  FocusAreaState,
  FocusAreaActions,
  FocusAreaContextType
} from './types';

const FocusAreaContext = createContext<FocusAreaContextType | null>(null);

export const useFocusAreas = () => {
  const context = useContext(FocusAreaContext);
  if (!context) {
    throw new Error('useFocusAreas must be used within FocusAreaProvider');
  }
  return context;
};

interface FocusAreaProviderProps {
  children: React.ReactNode;
}

export const FocusAreaProvider: React.FC<FocusAreaProviderProps> = ({ children }) => {
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [suggestedAreas, setSuggestedAreas] = useState<string[]>([
    'Persoonlijke groei',
    'Relaties',
    'Carrière',
    'Gezondheid',
    'Creativiteit',
    'Stress management'
  ]);

  const addFocusArea = useCallback((area: string) => {
    if (area && !focusAreas.includes(area)) {
      setFocusAreas(prev => [...prev, area]);
    }
  }, [focusAreas]);

  const removeFocusArea = useCallback((area: string) => {
    setFocusAreas(prev => prev.filter(a => a !== area));
  }, []);

  const setSuggestedAreasList = useCallback((areas: string[]) => {
    setSuggestedAreas(areas);
  }, []);

  const clearFocusAreas = useCallback(() => {
    setFocusAreas([]);
  }, []);

  const value: FocusAreaContextType = {
    focusAreas,
    suggestedAreas,
    addFocusArea,
    removeFocusArea,
    setSuggestedAreas: setSuggestedAreasList,
    clearFocusAreas
  };

  return (
    <FocusAreaContext.Provider value={value}>
      {children}
    </FocusAreaContext.Provider>
  );
};
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { activeImaginationChatLLMService } from '../../services/activeImaginationChatLLM';
import type {
  JournalEntryData,
  JournalingState,
  JournalingActions,
  JournalingContextType
} from './types';

const JournalingContext = createContext<JournalingContextType | null>(null);

export const useJournaling = () => {
  const context = useContext(JournalingContext);
  if (!context) {
    throw new Error('useJournaling must be used within JournalingProvider');
  }
  return context;
};

interface JournalingProviderProps {
  children: React.ReactNode;
}

export const JournalingProvider: React.FC<JournalingProviderProps> = ({ children }) => {
  const { userData } = useAppStore();
  const [entries, setEntries] = useState<JournalEntryData[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [currentEntry, setCurrentEntry] = useState<JournalingState['currentEntry']>({
    title: '',
    content: '',
    mood: 3,
    tags: [],
    entryType: 'free-form'
  });

  // Load journal entries
  const loadEntries = useCallback(async () => {
    if (!userData?.id) return;

    try {
      // TODO: Replace with actual database query
      setEntries([
        {
          id: '1',
          title: 'Reflectie op Persoonlijke Waarden',
          content: 'Vandaag dacht ik na over wat echt belangrijk voor me is. Authenticiteit staat bovenaan mijn lijst...',
          mood: 4,
          tags: ['waarden', 'authenticiteit', 'zelfreflectie'],
          date: new Date().toISOString().split('T')[0],
          entryType: 'mbti-exercise',
          mbtiTechnique: 'waarden-exploratie',
          insights: ['Sterke focus op authenticiteit', 'Behoefte aan autonomie'],
          patterns: ['Waardenconflict', 'Emotionele verwerking']
        }
      ]);
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  }, [userData?.id]);

  // Create new journal entry
  const createEntry = useCallback(async () => {
    if (!currentEntry.content.trim() || !userData?.id) return;

    try {
      setIsAnalyzing(true);

      const newEntry = await activeImaginationChatLLMService.createJournalEntry(
        userData.id,
        currentEntry.content,
        userData.mbtiType || 'INFP',
        currentEntry.entryType
      );

      const formattedEntry: JournalEntryData = {
        id: newEntry.id,
        title: currentEntry.title || newEntry.title,
        content: newEntry.content,
        mood: currentEntry.mood,
        tags: currentEntry.tags,
        date: newEntry.createdAt.toISOString().split('T')[0],
        entryType: newEntry.entryType,
        mbtiTechnique: newEntry.mbtiTechnique,
        insights: [],
        patterns: []
      };

      setEntries(prev => [formattedEntry, ...prev]);
      resetCurrentEntry();

    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentEntry, userData]);

  // Analyze existing entry
  const analyzeEntry = useCallback(async (entry: JournalEntryData) => {
    if (!userData?.id) return;

    try {
      setIsAnalyzing(true);

      const insights = await activeImaginationChatLLMService.analyzeJournalEntry(
        entry.id,
        entry.content,
        userData.mbtiType || 'INFP'
      );

      setEntries(prev => prev.map(e =>
        e.id === entry.id
          ? { ...e, insights: insights.map(i => i.description) }
          : e
      ));

    } catch (error) {
      console.error('Error analyzing entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [userData]);

  // Update entry
  const updateEntry = useCallback(async (entry: JournalEntryData) => {
    setEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
  }, []);

  // Delete entry
  const deleteEntry = useCallback(async (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null);
    }
  }, [selectedEntry]);

  // Select entry
  const selectEntry = useCallback((entry: JournalEntryData | null) => {
    setSelectedEntry(entry);
  }, []);

  // Update current entry
  const updateCurrentEntry = useCallback((updates: Partial<JournalingState['currentEntry']>) => {
    setCurrentEntry(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset current entry
  const resetCurrentEntry = useCallback(() => {
    setCurrentEntry({
      title: '',
      content: '',
      mood: 3,
      tags: [],
      entryType: 'free-form'
    });
  }, []);

  const contextValue: JournalingContextType = {
    // State
    entries,
    currentEntry,
    selectedEntry,
    isAnalyzing,

    // Actions
    createEntry,
    updateEntry,
    deleteEntry,
    analyzeEntry,
    selectEntry,
    updateCurrentEntry,
    resetCurrentEntry
  };

  return (
    <JournalingContext.Provider value={contextValue}>
      {children}
    </JournalingContext.Provider>
  );
};
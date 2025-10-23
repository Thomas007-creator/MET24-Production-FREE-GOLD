// Types for Journaling functionality
export interface JournalEntryData {
  id: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  date: string;
  entryType: 'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise';
  mbtiTechnique: string;
  insights: string[];
  patterns: string[];
}

export interface JournalingState {
  entries: JournalEntryData[];
  currentEntry: {
    title: string;
    content: string;
    mood: number;
    tags: string[];
    entryType: 'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise';
  };
  selectedEntry: JournalEntryData | null;
  isAnalyzing: boolean;
}

export interface JournalingActions {
  createEntry: () => Promise<void>;
  updateEntry: (entry: JournalEntryData) => Promise<void>;
  deleteEntry: (entryId: string) => Promise<void>;
  analyzeEntry: (entry: JournalEntryData) => Promise<void>;
  selectEntry: (entry: JournalEntryData | null) => void;
  updateCurrentEntry: (updates: Partial<JournalingState['currentEntry']>) => void;
  resetCurrentEntry: () => void;
}

export interface JournalingContextType extends JournalingState, JournalingActions {}
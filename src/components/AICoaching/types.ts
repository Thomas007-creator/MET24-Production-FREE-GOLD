// Types for AI Coaching functionality
export interface ChatMessage {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: number;
  insights?: string[];
  actionSuggestions?: string[];
  followUpQuestions?: string[];
  mbtiAlignment?: number;
  confidence?: number;
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  deadline?: number;
}

export interface CoachingSession {
  id: string;
  messages: ChatMessage[];
  mbtiType: string;
  startTime: number;
  context: CoachingContext;
  effectiveness?: number;
}

export interface CoachingContext {
  userId: string;
  moodRating: number;
  focusAreas: string[];
  activeGoals: Goal[];
  wellnessScores: LevensgebiedScore[];
}

export interface LevensgebiedScore {
  area: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: number;
}

// Session Management
export interface SessionState {
  currentSession: CoachingSession | null;
  sessionHistory: CoachingSession[];
  isProcessing: boolean;
}

export interface SessionActions {
  startNewSession: () => void;
  endSession: () => void;
  rateSession: (rating: number) => Promise<void>;
  addToHistory: (session: CoachingSession) => void;
}

export interface SessionContextType extends SessionState, SessionActions {}

// Chat Management
export interface ChatState {
  userInput: string;
  messages: ChatMessage[];
  isTyping: boolean;
}

export interface ChatActions {
  sendMessage: () => Promise<void>;
  setUserInput: (input: string) => void;
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

export interface ChatContextType extends ChatState, ChatActions {}

// MBTI Configuration
export interface MBTIConfigState {
  selectedMbtiType: string;
  availableTypes: string[];
  context: CoachingContext;
}

export interface MBTIConfigActions {
  setMbtiType: (type: string) => void;
  updateContext: (updates: Partial<CoachingContext>) => void;
  resetContext: () => void;
}

export interface MBTIConfigContextType extends MBTIConfigState, MBTIConfigActions {}

// Mood Tracking
export interface MoodState {
  currentMood: number;
  moodHistory: Array<{ timestamp: number; mood: number }>;
}

export interface MoodActions {
  setMood: (mood: number) => void;
  addMoodEntry: (mood: number) => void;
  getAverageMood: () => number;
}

export interface MoodContextType extends MoodState, MoodActions {}

// Focus Areas
export interface FocusAreaState {
  focusAreas: string[];
  suggestedAreas: string[];
}

export interface FocusAreaActions {
  addFocusArea: (area: string) => void;
  removeFocusArea: (area: string) => void;
  setSuggestedAreas: (areas: string[]) => void;
  clearFocusAreas: () => void;
}

export interface FocusAreaContextType extends FocusAreaState, FocusAreaActions {}
// Types for Imagination functionality
export interface ImaginationSession {
  id: string;
  type: 'guided' | 'free-form' | 'mbti-specific';
  prompt: string;
  responses: Array<{
    timestamp: Date;
    content: string;
    guidance?: string;
  }>;
  duration: number;
  status: 'active' | 'paused' | 'completed';
  creativityScore: number;
  insights: string[];
}

export interface ImaginationState {
  currentSession: ImaginationSession | null;
  sessionType: 'guided' | 'free-form' | 'mbti-specific';
  currentResponse: string;
  isSessionActive: boolean;
  isProcessing: boolean;
}

export interface ImaginationActions {
  startSession: () => Promise<void>;
  submitResponse: () => Promise<void>;
  completeSession: () => Promise<void>;
  pauseSession: () => void;
  resumeSession: () => void;
  setSessionType: (type: 'guided' | 'free-form' | 'mbti-specific') => void;
  updateResponse: (response: string) => void;
}

export interface ImaginationContextType extends ImaginationState, ImaginationActions {}
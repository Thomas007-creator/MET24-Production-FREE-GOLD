import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AIMsg = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  sentiment?: { score: number; label: 'positive' | 'neutral' | 'negative' };
};

export type AISessionState = {
  id: string;
  userId: string;
  mbtiType: string;
  createdAt: string;
  updatedAt?: string;
  messages: AIMsg[];
  progress?: number;
};

type State = {
  session: AISessionState | null;
  setSession: (s: AISessionState) => void;
  resetSession: () => void;
  addMessage: (m: AIMsg) => void;
  updateMessage: (id: string, patch: Partial<AIMsg>) => void;
  clearMessages: () => void;
  setProgress: (p: number) => void;
};

const useAiSessionStore = create<State>()(
  persist(
    (set, get) => ({
      session: null,
      setSession: (s: AISessionState) => set({ session: s }),
      resetSession: () => set({ session: null }),
      addMessage: (m: AIMsg) => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, messages: [...s.messages, m], updatedAt: new Date().toISOString() } });
      },
      updateMessage: (id: string, patch: Partial<AIMsg>) => {
        const s = get().session;
        if (!s) return;
        set({
          session: {
            ...s,
            messages: s.messages.map(msg => (msg.id === id ? { ...msg, ...patch } : msg)),
            updatedAt: new Date().toISOString()
          }
        });
      },
      clearMessages: () => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, messages: [] } });
      },
      setProgress: (p: number) => {
        const s = get().session;
        if (!s) return;
        set({ session: { ...s, progress: p } });
      }
    }),
    {
      name: 'ai-session-storage' // localStorage key
    }
  )
);

export default useAiSessionStore;

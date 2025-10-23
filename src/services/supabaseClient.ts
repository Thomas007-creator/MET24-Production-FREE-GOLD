/**
 * Supabase Client for MET24 Phase 1
 * 
 * Handles database connection, authentication, and real-time updates
 * 
 * @version 3.0.0-core
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database tables
export const TABLES = {
  USERS: 'users',
  MBTI_RESULTS: 'mbti_results',
  JOURNAL_ENTRIES: 'journal_entries',
  CHALLENGES: 'challenges',
  CHALLENGE_PARTICIPANTS: 'challenge_participants',
  ACTIVE_IMAGINATION_SESSIONS: 'active_imagination_sessions',
  LEVENSGEBIEDEN_DATA: 'levensgebieden_data',
  ANALYTICS: 'analytics'
} as const;

// User interface
export interface User {
  id: string;
  email: string;
  mbti_type?: string;
  created_at: string;
  updated_at: string;
  preferences?: any;
}

// MBTI Result interface
export interface MBTIResult {
  id: string;
  user_id: string;
  type: string;
  score: any;
  percentage: any;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  created_at: string;
}

// Journal Entry interface
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood_rating?: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Challenge interface
export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Active Imagination Session interface
export interface ActiveImaginationSession {
  id: string;
  user_id: string;
  title: string;
  content: string;
  prompts: string[];
  inspirations: string[];
  created_at: string;
  updated_at: string;
}

// Analytics interface
export interface Analytics {
  id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

/**
 * Database Service Class
 */
export class DatabaseService {
  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Database Service: Error getting user', error);
        return null;
      }
      
      if (!user) {
        return null;
      }
      
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Database Service: Error getting profile', profileError);
        return null;
      }
      
      return profile;
    } catch (error) {
      console.error('Database Service: Error getting current user', error);
      return null;
    }
  }

  /**
   * Create or update user profile
   */
  async upsertUser(user: Partial<User>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .upsert(user)
        .select()
        .single();
      
      if (error) {
        console.error('Database Service: Error upserting user', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database Service: Error upserting user', error);
      return null;
    }
  }

  /**
   * Save MBTI result
   */
  async saveMBTIResult(result: Omit<MBTIResult, 'id' | 'created_at'>): Promise<MBTIResult | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MBTI_RESULTS)
        .insert(result)
        .select()
        .single();
      
      if (error) {
        console.error('Database Service: Error saving MBTI result', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database Service: Error saving MBTI result', error);
      return null;
    }
  }

  /**
   * Get MBTI results for user
   */
  async getMBTIResults(userId: string): Promise<MBTIResult[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.MBTI_RESULTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Database Service: Error getting MBTI results', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database Service: Error getting MBTI results', error);
      return [];
    }
  }

  /**
   * Save journal entry
   */
  async saveJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>): Promise<JournalEntry | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.JOURNAL_ENTRIES)
        .insert(entry)
        .select()
        .single();
      
      if (error) {
        console.error('Database Service: Error saving journal entry', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database Service: Error saving journal entry', error);
      return null;
    }
  }

  /**
   * Get journal entries for user
   */
  async getJournalEntries(userId: string, limit: number = 50): Promise<JournalEntry[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.JOURNAL_ENTRIES)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Database Service: Error getting journal entries', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database Service: Error getting journal entries', error);
      return [];
    }
  }

  /**
   * Get challenges
   */
  async getChallenges(limit: number = 50): Promise<Challenge[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CHALLENGES)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Database Service: Error getting challenges', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database Service: Error getting challenges', error);
      return [];
    }
  }

  /**
   * Save active imagination session
   */
  async saveActiveImaginationSession(session: Omit<ActiveImaginationSession, 'id' | 'created_at' | 'updated_at'>): Promise<ActiveImaginationSession | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ACTIVE_IMAGINATION_SESSIONS)
        .insert(session)
        .select()
        .single();
      
      if (error) {
        console.error('Database Service: Error saving active imagination session', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Database Service: Error saving active imagination session', error);
      return null;
    }
  }

  /**
   * Get active imagination sessions for user
   */
  async getActiveImaginationSessions(userId: string, limit: number = 50): Promise<ActiveImaginationSession[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.ACTIVE_IMAGINATION_SESSIONS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Database Service: Error getting active imagination sessions', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Database Service: Error getting active imagination sessions', error);
      return [];
    }
  }

  /**
   * Track analytics event
   */
  async trackEvent(eventType: string, eventData: any, userId?: string): Promise<void> {
    try {
      const analytics: Omit<Analytics, 'id' | 'created_at'> = {
        user_id: userId || 'anonymous',
        event_type: eventType,
        event_data: eventData
      };
      
      const { error } = await supabase
        .from(TABLES.ANALYTICS)
        .insert(analytics);
      
      if (error) {
        console.error('Database Service: Error tracking event', error);
      }
    } catch (error) {
      console.error('Database Service: Error tracking event', error);
    }
  }

  /**
   * Subscribe to real-time updates
   */
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();
  }

  /**
   * Unsubscribe from real-time updates
   */
  unsubscribe(subscription: any) {
    supabase.removeChannel(subscription);
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

// Export auth helpers
export const auth = {
  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      console.error('Auth: Error signing up', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Auth: Error signing in', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Auth: Error signing out', error);
      throw error;
    }
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth: Error getting session', error);
      return null;
    }
    
    return data.session;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default supabase;

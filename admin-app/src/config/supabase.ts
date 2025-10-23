/**
 * Supabase Client Configuration
 * 
 * Echte Supabase client voor MET2.4 project
 * Ondersteunt alle V14 tabellen en features
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file:\n' +
    '- SUPABASE_URL\n' +
    '- SUPABASE_ANON_KEY'
  );
}

// Create Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'met24-v14-client'
    }
  }
});

// Service role client (for admin operations)
export const supabaseAdmin: SupabaseClient | null = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Database types (will be generated from your schema)
export interface Database {
  public: {
    Tables: {
      // Users schema
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar_url?: string;
          mbti_type: string;
          premium_status: boolean;
          subscription_tier?: string;
          subscription_expires_at?: number;
          subscription_status?: string;
          dark_mode: boolean;
          voice_enabled: boolean;
          language?: string;
          timezone?: string;
          bio?: string;
          location?: string;
          website?: string;
          privacy_level?: string;
          created_by: string;
          metadata?: string;
          synced: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar_url?: string;
          mbti_type: string;
          premium_status?: boolean;
          subscription_tier?: string;
          subscription_expires_at?: number;
          subscription_status?: string;
          dark_mode?: boolean;
          voice_enabled?: boolean;
          language?: string;
          timezone?: string;
          bio?: string;
          location?: string;
          website?: string;
          privacy_level?: string;
          created_by: string;
          metadata?: string;
          synced?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar_url?: string;
          mbti_type?: string;
          premium_status?: boolean;
          subscription_tier?: string;
          subscription_expires_at?: number;
          subscription_status?: string;
          dark_mode?: boolean;
          voice_enabled?: boolean;
          language?: string;
          timezone?: string;
          bio?: string;
          location?: string;
          website?: string;
          privacy_level?: string;
          created_by?: string;
          metadata?: string;
          synced?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other table types as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Typed Supabase client
export const typedSupabase = supabase as SupabaseClient<Database>;

// Helper functions
export const supabaseHelpers = {
  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign up
  async signUp(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }
};

// Export default
export default supabase;
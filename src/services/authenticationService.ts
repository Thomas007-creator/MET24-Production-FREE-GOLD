/**
 * Authentication Service for MET24 Phase 1
 * 
 * Handles user authentication and session management
 * 
 * @version 3.0.0-core
 */

import { supabase, auth } from './supabaseClient';

export interface User {
  id: string;
  email: string;
  mbtiType?: string;
  preferences?: any;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export class AuthenticationService {
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  private listeners: ((state: AuthState) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication
   */
  private async initializeAuth(): Promise<void> {
    try {
      this.setLoading(true);

      // Check for existing session
      const session = await auth.getSession();
      if (session) {
        await this.handleAuthStateChange('SIGNED_IN', session);
      }

      // Listen for auth state changes
      auth.onAuthStateChange((event, session) => {
        this.handleAuthStateChange(event, session);
      });

      this.setLoading(false);
    } catch (error) {
      console.error('Authentication Service: Error initializing auth', error);
      this.setError('Failed to initialize authentication');
      this.setLoading(false);
    }
  }

  /**
   * Handle auth state change
   */
  private async handleAuthStateChange(event: string, session: any): Promise<void> {
    try {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await this.getUserProfile(session.user.id);
        this.setUser(user);
        this.setAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        this.setUser(null);
        this.setAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication Service: Error handling auth state change', error);
      this.setError('Authentication state change failed');
    }
  }

  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      this.setLoading(true);
      this.setError(null);

      // Validate credentials
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Register with Supabase
      const { data, error } = await (auth.signUp as any)(credentials.email, credentials.password);
      
      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error('Registration failed');
      }

      // Create user profile
      const user = await this.createUserProfile(data.user.id, credentials.email);
      
      this.setLoading(false);
      return user;
    } catch (error) {
      console.error('Authentication Service: Error registering user', error);
      this.setError(error instanceof Error ? error.message : 'Registration failed');
      this.setLoading(false);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      this.setLoading(true);
      this.setError(null);

      // Login with Supabase
      const response = await (auth.signIn as any)(credentials.email, credentials.password);
      
      if (response.error) {
        throw response.error;
      }

      if (!response.data?.user) {
        throw new Error('Login failed');
      }

      // Get user profile
      const user = await this.getUserProfile(response.data.user.id);
      
      this.setLoading(false);
      return user;
    } catch (error) {
      console.error('Authentication Service: Error logging in user', error);
      this.setError(error instanceof Error ? error.message : 'Login failed');
      this.setLoading(false);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      this.setLoading(true);
      this.setError(null);

      await auth.signOut();
      
      this.setLoading(false);
    } catch (error) {
      console.error('Authentication Service: Error logging out user', error);
      this.setError('Logout failed');
      this.setLoading(false);
      throw error;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  /**
   * Get auth state
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates: Partial<User>): Promise<User> {
    try {
      if (!this.authState.user) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...this.authState.user, ...updates };
      
      // Update in database
      await this.updateUserInDatabase(updatedUser);
      
      this.setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Authentication Service: Error updating user profile', error);
      this.setError('Failed to update profile');
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      this.setLoading(true);
      this.setError(null);

      // This would typically send a password reset email
      // For now, just log it
      console.log('Authentication Service: Password reset requested for', email);
      
      this.setLoading(false);
    } catch (error) {
      console.error('Authentication Service: Error resetting password', error);
      this.setError('Failed to reset password');
      this.setLoading(false);
      throw error;
    }
  }

  /**
   * Create user profile
   */
  private async createUserProfile(userId: string, email: string): Promise<User> {
    try {
      const user: User = {
        id: userId,
        email,
        mbtiType: undefined,
        preferences: {},
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      // Save to database
      await this.saveUserToDatabase(user);
      
      return user;
    } catch (error) {
      console.error('Authentication Service: Error creating user profile', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  private async getUserProfile(userId: string): Promise<User> {
    try {
      // Try to get from database
      const user = await this.getUserFromDatabase(userId);
      if (user) {
        return user;
      }

      // Create new profile if not found
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser.user) {
        return await this.createUserProfile(userId, authUser.user.email || '');
      }

      throw new Error('User not found');
    } catch (error) {
      console.error('Authentication Service: Error getting user profile', error);
      throw error;
    }
  }

  /**
   * Save user to database
   */
  private async saveUserToDatabase(user: User): Promise<void> {
    try {
      // This would save to your database
      // For now, just log it
      console.log('Authentication Service: Saving user to database', user);
    } catch (error) {
      console.error('Authentication Service: Error saving user to database', error);
      throw error;
    }
  }

  /**
   * Get user from database
   */
  private async getUserFromDatabase(userId: string): Promise<User | null> {
    try {
      // This would fetch from your database
      // For now, return null
      return null;
    } catch (error) {
      console.error('Authentication Service: Error getting user from database', error);
      return null;
    }
  }

  /**
   * Update user in database
   */
  private async updateUserInDatabase(user: User): Promise<void> {
    try {
      // This would update in your database
      // For now, just log it
      console.log('Authentication Service: Updating user in database', user);
    } catch (error) {
      console.error('Authentication Service: Error updating user in database', error);
      throw error;
    }
  }

  /**
   * Set user
   */
  private setUser(user: User | null): void {
    this.authState.user = user;
    this.notifyListeners();
  }

  /**
   * Set authenticated state
   */
  private setAuthenticated(isAuthenticated: boolean): void {
    this.authState.isAuthenticated = isAuthenticated;
    this.notifyListeners();
  }

  /**
   * Set loading state
   */
  private setLoading(isLoading: boolean): void {
    this.authState.isLoading = isLoading;
    this.notifyListeners();
  }

  /**
   * Set error
   */
  private setError(error: string | null): void {
    this.authState.error = error;
    this.notifyListeners();
  }

  /**
   * Notify listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener({ ...this.authState });
      } catch (error) {
        console.error('Authentication Service: Error notifying listener', error);
      }
    });
  }
}

// Export singleton instance
export const authenticationService = new AuthenticationService();

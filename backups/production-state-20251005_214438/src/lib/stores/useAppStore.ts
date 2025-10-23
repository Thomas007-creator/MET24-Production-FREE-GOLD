/**
 * Enhanced Zustand Store for MET24 PWA
 * Updated to support Push Notifications with V14 database integration
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import notification types (create this file if it doesn't exist)
interface NotificationPreferences {
  actionPlans: boolean;
  wellnessChecks: boolean;
  therapySessions: boolean;
  aiInsights: boolean;
  tokenWarnings: boolean;
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'all' | 'important' | 'critical';
}

// Enhanced Push Notification State Interface
interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  preferences: NotificationPreferences | null;
  permission: NotificationPermission;
  lastSync: Date | null;
  isInitialized: boolean;
  initializationError: string | null;
  subscriptionHealth: 'unknown' | 'healthy' | 'unhealthy';
}

// Your existing interfaces (keep these)
interface UserData {
  id: string;
  email: string;
  name: string;
  // ... your existing user properties
}

// Enhanced App State Interface
interface AppState {
  // ========== EXISTING STATE (keep your current state) ==========
  userData: UserData | null;
  isAuthenticated: boolean;
  currentPage: string;
  // ... keep all your existing state properties
  
  // ========== NEW PUSH NOTIFICATION STATE ==========
  pushNotifications: PushNotificationState;
  
  // ========== EXISTING ACTIONS (keep your current actions) ==========
  setUserData: (userData: UserData | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setCurrentPage: (page: string) => void;
  // ... keep all your existing actions
  
  // ========== NEW PUSH NOTIFICATION ACTIONS ==========
  setPushSubscription: (subscription: PushSubscription | null) => void;
  updateNotificationPreferences: (preferences: NotificationPreferences) => void;
  setPushPermission: (permission: NotificationPermission) => void;
  setNotificationSupport: (isSupported: boolean) => void;
  markPushInitialized: () => void;
  setPushInitializationError: (error: string | null) => void;
  updateLastSync: () => void;
  setSubscriptionHealth: (health: 'unknown' | 'healthy' | 'unhealthy') => void;
  resetPushState: () => void;
  
  // ========== COMPUTED GETTERS ==========
  getPushStatus: () => PushStatusSummary;
}

interface PushStatusSummary {
  canUseNotifications: boolean;
  needsPermission: boolean;
  hasActiveSubscription: boolean;
  isFullyConfigured: boolean;
  lastSyncFormatted: string;
  healthStatus: string;
  requiresAction: boolean;
  actionMessage?: string;
}

// Default Push Notification State
const defaultPushState: PushNotificationState = {
  isSupported: false,
  isSubscribed: false,
  subscription: null,
  preferences: {
    actionPlans: true,
    wellnessChecks: true,
    therapySessions: true,
    aiInsights: true,
    tokenWarnings: true,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    },
    frequency: 'all'
  },
  permission: 'default',
  lastSync: null,
  isInitialized: false,
  initializationError: null,
  subscriptionHealth: 'unknown'
};

// Enhanced Zustand Store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ========== EXISTING STATE (keep your current state) ==========
      userData: null,
      isAuthenticated: false,
      currentPage: '/',
      // ... keep all your existing state
      
      // ========== NEW PUSH NOTIFICATION STATE ==========
      pushNotifications: defaultPushState,
      
      // ========== EXISTING ACTIONS (keep your current actions) ==========
      setUserData: (userData) => set({ userData }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      // ... keep all your existing actions
      
      // ========== NEW PUSH NOTIFICATION ACTIONS ==========
      
      /**
       * Update push subscription state with enhanced tracking
       */
      setPushSubscription: (subscription) => {
        console.log('🔄 Updating push subscription in store:', subscription ? 'subscribed' : 'unsubscribed');
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            subscription,
            isSubscribed: subscription !== null,
            lastSync: new Date(),
            subscriptionHealth: subscription ? 'healthy' : 'unknown'
          }
        }));
      },

      /**
       * Update notification preferences with validation
       */
      updateNotificationPreferences: (preferences) => {
        console.log('🔄 Updating notification preferences in store:', preferences);
        
        // Validate preferences
        const validatedPreferences = validateNotificationPreferences(preferences);
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            preferences: validatedPreferences,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Update notification permission status
       */
      setPushPermission: (permission) => {
        console.log('🔄 Updating push permission in store:', permission);
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            permission,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Set push notification support status
       */
      setNotificationSupport: (isSupported) => {
        console.log('🔄 Setting notification support in store:', isSupported);
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            isSupported,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Mark push client as initialized
       */
      markPushInitialized: () => {
        console.log('✅ Marking push client as initialized in store');
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            isInitialized: true,
            initializationError: null,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Set initialization error
       */
      setPushInitializationError: (error) => {
        console.log('❌ Setting push initialization error:', error);
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            initializationError: error,
            isInitialized: error === null,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Update last sync timestamp
       */
      updateLastSync: () => {
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Set subscription health status
       */
      setSubscriptionHealth: (health) => {
        console.log('💓 Setting subscription health:', health);
        
        set((state) => ({
          pushNotifications: {
            ...state.pushNotifications,
            subscriptionHealth: health,
            lastSync: new Date()
          }
        }));
      },

      /**
       * Reset push notification state (logout, errors, etc.)
       */
      resetPushState: () => {
        console.log('🔄 Resetting push notification state');
        
        set((state) => ({
          pushNotifications: {
            ...defaultPushState,
            isSupported: state.pushNotifications.isSupported, // Keep support detection
          }
        }));
      },

      // ========== ENHANCED COMPUTED GETTERS ==========
      
      /**
       * Get comprehensive push notification status
       */
      getPushStatus: (): PushStatusSummary => {
        const { pushNotifications } = get();
        
        const canUseNotifications = pushNotifications.isSupported && pushNotifications.permission === 'granted';
        const needsPermission = pushNotifications.isSupported && pushNotifications.permission === 'default';
        const hasActiveSubscription = pushNotifications.isSubscribed && pushNotifications.subscription !== null;
        const isFullyConfigured = pushNotifications.isInitialized && pushNotifications.preferences !== null;
        
        let requiresAction = false;
        let actionMessage = '';
        
        if (!pushNotifications.isSupported) {
          requiresAction = true;
          actionMessage = 'Browser does not support push notifications';
        } else if (needsPermission) {
          requiresAction = true;
          actionMessage = 'Permission required for notifications';
        } else if (!hasActiveSubscription && pushNotifications.permission === 'granted') {
          requiresAction = true;
          actionMessage = 'Click to enable push notifications';
        } else if (pushNotifications.subscriptionHealth === 'unhealthy') {
          requiresAction = true;
          actionMessage = 'Subscription needs renewal';
        }
        
        return {
          canUseNotifications,
          needsPermission,
          hasActiveSubscription,
          isFullyConfigured,
          lastSyncFormatted: pushNotifications.lastSync?.toLocaleString() || 'Never',
          healthStatus: pushNotifications.subscriptionHealth,
          requiresAction,
          actionMessage
        };
      },
    }),
    {
      name: 'met24-app-store',
      partialize: (state) => ({
        // Persist all state EXCEPT subscription object (security)
        userData: state.userData,
        isAuthenticated: state.isAuthenticated,
        currentPage: state.currentPage,
        // ... persist your other existing state
        pushNotifications: {
          ...state.pushNotifications,
          subscription: null, // Don't persist subscription object
        },
      }),
    }
  )
);

/**
 * Validate notification preferences
 */
function validateNotificationPreferences(preferences: NotificationPreferences): NotificationPreferences {
  return {
    actionPlans: Boolean(preferences.actionPlans),
    wellnessChecks: Boolean(preferences.wellnessChecks),
    therapySessions: Boolean(preferences.therapySessions),
    aiInsights: Boolean(preferences.aiInsights),
    tokenWarnings: Boolean(preferences.tokenWarnings),
    quietHours: preferences.quietHours ? {
      enabled: Boolean(preferences.quietHours.enabled),
      start: preferences.quietHours.start || "22:00",
      end: preferences.quietHours.end || "08:00"
    } : {
      enabled: false,
      start: "22:00",
      end: "08:00"
    },
    frequency: ['all', 'important', 'critical'].includes(preferences.frequency) 
      ? preferences.frequency 
      : 'all'
  };
}

// ========== ENHANCED PUSH NOTIFICATION HOOKS ==========

/**
 * Hook for push notification state with all functionality
 */
export const usePushNotifications = () => {
  const pushNotifications = useAppStore((state) => state.pushNotifications);
  const setPushSubscription = useAppStore((state) => state.setPushSubscription);
  const updateNotificationPreferences = useAppStore((state) => state.updateNotificationPreferences);
  const setPushPermission = useAppStore((state) => state.setPushPermission);
  const setNotificationSupport = useAppStore((state) => state.setNotificationSupport);
  const markPushInitialized = useAppStore((state) => state.markPushInitialized);
  const setPushInitializationError = useAppStore((state) => state.setPushInitializationError);
  const setSubscriptionHealth = useAppStore((state) => state.setSubscriptionHealth);
  const resetPushState = useAppStore((state) => state.resetPushState);
  const getPushStatus = useAppStore((state) => state.getPushStatus);

  return {
    // State
    pushNotifications,
    
    // Actions
    setPushSubscription,
    updateNotificationPreferences,
    setPushPermission,
    setNotificationSupport,
    markPushInitialized,
    setPushInitializationError,
    setSubscriptionHealth,
    resetPushState,
    
    // Computed
    pushStatus: getPushStatus(),
    
    // Convenience getters
    isSupported: pushNotifications.isSupported,
    isSubscribed: pushNotifications.isSubscribed,
    permission: pushNotifications.permission,
    preferences: pushNotifications.preferences,
    isInitialized: pushNotifications.isInitialized,
    lastSync: pushNotifications.lastSync,
    health: pushNotifications.subscriptionHealth,
    error: pushNotifications.initializationError,
  };
};

/**
 * Hook for user data with push integration
 */
export const useUserWithPush = () => {
  const userData = useAppStore((state) => state.userData);
  const pushNotifications = useAppStore((state) => state.pushNotifications);
  const setUserData = useAppStore((state) => state.setUserData);
  const resetPushState = useAppStore((state) => state.resetPushState);

  const setUserDataWithPushReset = (newUserData: UserData | null) => {
    setUserData(newUserData);
    
    // Reset push state on logout
    if (!newUserData) {
      resetPushState();
    }
  };

  return {
    userData,
    pushNotifications,
    setUserData: setUserDataWithPushReset,
    canUsePush: userData?.id && pushNotifications.isSupported,
    pushStatus: useAppStore.getState().getPushStatus(),
  };
};

// Export types for use in components
export type { AppState, PushNotificationState, NotificationPreferences, UserData, PushStatusSummary };

import { create } from 'zustand';
import { logger } from '../utils/logger';

interface UserData {
  id?: string | null;
  userId?: string | null;
  name?: string;
  email?: string;
  mbtiType?: string;
  authMethod?: string;
  privacyAccepted?: boolean;
  interests?: string[];
  context?: any;
  wellness?: any;
  notifications?: any;
  birthDate?: string | null;
  verified?: boolean;
  verificationCompletedAt?: string | null;
  aiActionPlan?: {
    steps: string[];
    generatedAt: string;
    source: string;
  } | null;
  // Profile fields
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string | null;
  privacy?: 'public' | 'private' | 'friends';
  // Additional profile data
  joinDate?: string | null;
  lastActive?: string | null;
  totalPoints?: number;
  level?: number;
  achievements?: any[];
  // Database fields
  premiumStatus?: boolean;
  darkMode?: boolean;
  voiceEnabled?: boolean;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  subscriptionExpiresAt?: number | null;
}

interface AppStore {
  // User Data
  userData: UserData;
  setUserData: (data: Partial<UserData>) => void;
  updateUserData: (data: Partial<UserData>) => void;
  loadUserData: () => Promise<void>;

  // Navigation & Views
  currentView: string;
  setCurrentView: (view: string) => void;

  // User Info
  userName: string;
  setUserName: (name: string) => void;
  mbtiType: string;
  setMbtiType: (type: string) => void;

  // Upgrade Flow
  selectedSubscriptionPlan: string | null;
  setSelectedSubscriptionPlan: (plan: string | null) => void;
  paymentMethod: string | null;
  setPaymentMethod: (method: string | null) => void;
  upgradeStatus: 'idle' | 'processing' | 'success' | 'failed';
  setUpgradeStatus: (
    status: 'idle' | 'processing' | 'success' | 'failed'
  ) => void;

  // Button Handlers
  handleButtonClick: (action: string) => void;
  handleFeatureClick: (feature: string) => void;

  // Navigation
  navigate: (path: string) => void;
  setNavigate: (navigateFn: (path: string) => void) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // User Data
  userData: {},
  setUserData: data => {
    logger.info('🔍 Store setUserData called with:', { data });
    set(state => {
      const newUserData = { ...state.userData, ...data };
      logger.info('🔍 Store new userData:', { userData: newUserData });
      return { userData: newUserData };
    });
  },
  updateUserData: (data) =>
    set(state => ({
      userData: { ...state.userData, ...data },
    })),

  // Performance-optimized user data loading
  loadUserData: async () => {
    try {
      logger.info('Loading user data from database...');
      // Import dbHelpers here to avoid circular dependency
      const { dbHelpers } = await import('../database');
      const user = await dbHelpers.getCurrentUser();
      const safeUserData = dbHelpers.getSafeUserData(user);
      
      set(state => ({
        userData: {
          ...state.userData,
          ...safeUserData,
          // Preserve additional fields that might not be in database
          email: state.userData.email,
          authMethod: state.userData.authMethod,
          privacyAccepted: state.userData.privacyAccepted,
          interests: state.userData.interests,
          context: state.userData.context,
          wellness: state.userData.wellness,
          notifications: state.userData.notifications,
          birthDate: state.userData.birthDate,
          verified: state.userData.verified,
          verificationCompletedAt: state.userData.verificationCompletedAt,
          aiActionPlan: state.userData.aiActionPlan,
          bio: state.userData.bio,
          location: state.userData.location,
          website: state.userData.website,
          avatar: state.userData.avatar,
          privacy: state.userData.privacy,
          joinDate: state.userData.joinDate,
          lastActive: state.userData.lastActive,
          totalPoints: state.userData.totalPoints,
          level: state.userData.level,
          achievements: state.userData.achievements
        },
        userName: safeUserData.name || 'Gebruiker',
        mbtiType: safeUserData.mbtiType || 'INFP'
      }));
      
      logger.info('User data loaded successfully', { 
        userId: safeUserData.id || 'unknown',
        name: safeUserData.name,
        mbtiType: safeUserData.mbtiType 
      });
    } catch (error) {
      logger.error('Failed to load user data', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      // Fallback to default data
      set(state => ({
        userData: {
          ...state.userData,
          name: 'Gebruiker',
          mbtiType: 'INFP',
          premiumStatus: false,
          darkMode: true,
          voiceEnabled: false,
          subscriptionTier: 'free',
          subscriptionStatus: 'active',
          subscriptionExpiresAt: null
        },
        userName: 'Gebruiker',
        mbtiType: 'INFP'
      }));
    }
  },

  // Navigation & Views
  currentView: 'main',
  setCurrentView: view => set({ currentView: view }),

  // User Info
  userName: 'Gebruiker',
  setUserName: name => set({ userName: name }),
  mbtiType: 'INTP',
  setMbtiType: type => set({ mbtiType: type }),

  // Upgrade Flow
  selectedSubscriptionPlan: null,
  setSelectedSubscriptionPlan: plan => set({ selectedSubscriptionPlan: plan }),
  paymentMethod: null,
  setPaymentMethod: method => set({ paymentMethod: method }),
  upgradeStatus: 'idle',
  setUpgradeStatus: status => set({ upgradeStatus: status }),

  // Button Handlers
  handleButtonClick: action => {
    logger.info('🔘 Button clicked:', { action });
    // Handle different button actions
    switch (action) {
      case 'upgrade-gold':
        get().setCurrentView('upgrade-gold');
        break;
      case 'profile':
        get().setCurrentView('profile');
        break;
      case 'settings':
        // Navigate to settings page
        if (get().navigate) {
          get().navigate('/settings');
        }
        break;
      case 'develop-data':
        // Navigate to develop data page
        if (get().navigate) {
          get().navigate('/develop-data');
        }
        break;
      default:
        logger.info('Unknown button action:', { action });
    }
  },

  // Navigation function (will be set by AppRoutes)
  navigate: (path: string) => {
    // This will be set by AppRoutes component
    logger.info('Navigate to:', { path });
  },
  setNavigate: navigateFn => set({ navigate: navigateFn }),

  handleFeatureClick: feature => {
    logger.info('🔘 Feature clicked:', { feature });
    // Handle feature clicks
    switch (feature) {
      case 'imagination':
        get().setCurrentView('imagination');
        break;
      case 'wellness-assessment':
        get().setCurrentView('wellness-assessment');
        break;
      case 'ai-action-plan':
        get().setCurrentView('ai-action-plan');
        break;
      case 'journaling':
        get().setCurrentView('journaling');
        break;
      case 'ai-coaching':
        get().setCurrentView('ai-coaching');
        break;
      case 'basics':
        get().setCurrentView('basics');
        break;
      case 'therapist':
        get().setCurrentView('therapist');
        break;
      default:
        logger.info('Unknown feature:', { feature });
    }
  },
}));

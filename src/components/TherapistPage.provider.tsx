import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppStore } from '../store/useAppStore';
import { logger } from '../utils/logger';
import { TherapistEcosystemService, Therapist, ZoomSpaceCoach } from '../services/therapistEcosystem/TherapistEcosystemService';
import { RegionalTherapistDataService } from '../services/therapistEcosystem/RegionalTherapistData';

interface TherapySession {
  id: string;
  type: 'ai' | 'human';
  title: string;
  description: string;
  duration: number;
  mbtiFocus: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'therapy' | 'coaching' | 'wellness' | 'specialized';
}

type TherapistView = 'overview' | 'ai-therapy' | 'find-therapist' | 'sessions' | 'coaches';

interface TherapistPageContextType {
  // State
  currentView: TherapistView;
  searchQuery: string;
  selectedSpecialty: string;
  therapists: Therapist[];
  coaches: ZoomSpaceCoach[];
  therapySessions: TherapySession[];
  loading: boolean;
  error: string | null;

  // User data
  mbtiType: string;

  // Actions
  setCurrentView: (view: TherapistView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedSpecialty: (specialty: string) => void;
  handleBookTherapist: (therapist: Therapist) => void;
  handleBookCoach: (coach: ZoomSpaceCoach) => void;
  handleStartTherapySession: (session: TherapySession) => void;
  refreshData: () => Promise<void>;
}

const TherapistPageContext = createContext<TherapistPageContextType | undefined>(undefined);

export const useTherapistPage = () => {
  const context = useContext(TherapistPageContext);
  if (!context) {
    throw new Error('useTherapistPage must be used within a TherapistPageProvider');
  }
  return context;
};

interface TherapistPageProviderProps {
  children: ReactNode;
}

export const TherapistPageProvider: React.FC<TherapistPageProviderProps> = ({ children }) => {
  const { userData } = useAppStore();

  // State management
  const [currentView, setCurrentView] = useState<TherapistView>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [coaches, setCoaches] = useState<ZoomSpaceCoach[]>([]);
  const [therapySessions, setTherapySessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const mbtiType = userData?.mbtiType || 'ENFP';

  // Data fetching
  const loadTherapists = async () => {
    try {
      setLoading(true);
      setError(null);

      const therapistService = TherapistEcosystemService.getInstance();
      const regionalDataService = RegionalTherapistDataService.getInstance();

      // Load regional therapists and coaches into database if not already loaded
      await regionalDataService.loadRegionalTherapists();
      await regionalDataService.loadZoomSpaceCoaches();

      // Get recommended therapists based on user's MBTI and location
      const recommendedTherapists = await therapistService.getRecommendedTherapists(
        userData?.userId || 'temp_user',
        mbtiType,
        userData?.location || 'Nederland'
      );

      setTherapists(recommendedTherapists);
    } catch (err) {
      logger.error('❌ Failed to load therapist ecosystem data:', undefined, err);
      setError('Kon therapeuten niet laden. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const loadCoaches = async () => {
    try {
      const therapistService = TherapistEcosystemService.getInstance();

      // Get ZoomSpace coaches
      const recommendedCoaches = await therapistService.getZoomSpaceCoaches(
        userData?.userId || 'temp_user',
        mbtiType
      );

      setCoaches(recommendedCoaches);
    } catch (err) {
      logger.error('❌ Failed to load coaches:', undefined, err);
    }
  };

  const loadTherapySessions = async () => {
    try {
      // Mock therapy sessions data - in real implementation this would come from a service
      const sessions: TherapySession[] = [
        {
          id: '1',
          type: 'ai',
          title: 'MBTI Zelfreflectie Sessie',
          description: 'Ontdek je persoonlijkheidstype dieper door middel van AI-begeleiding',
          duration: 45,
          mbtiFocus: ['ALL'],
          difficulty: 'beginner',
          category: 'therapy'
        },
        {
          id: '2',
          type: 'human',
          title: 'Introvert Communicatie Training',
          description: 'Leer effectiever communiceren als introvert persoon',
          duration: 60,
          mbtiFocus: ['ISFJ', 'ISTJ', 'ISFP', 'ISTP'],
          difficulty: 'intermediate',
          category: 'coaching'
        },
        {
          id: '3',
          type: 'human',
          title: 'Extravert Energie Management',
          description: 'Leer je energie beter te managen als extravert',
          duration: 60,
          mbtiFocus: ['ENFJ', 'ENTJ', 'ENFP', 'ENTP'],
          difficulty: 'intermediate',
          category: 'coaching'
        },
        {
          id: '4',
          type: 'ai',
          title: 'Stress Management Workshop',
          description: 'AI-begeleide sessie voor stressvermindering en ontspanning',
          duration: 30,
          mbtiFocus: ['ALL'],
          difficulty: 'beginner',
          category: 'wellness'
        },
        {
          id: '5',
          type: 'human',
          title: 'Relatie Dynamiek Analyse',
          description: 'Ontdek hoe je MBTI-type invloed heeft op je relaties',
          duration: 75,
          mbtiFocus: ['ALL'],
          difficulty: 'advanced',
          category: 'specialized'
        }
      ];

      setTherapySessions(sessions);
    } catch (err) {
      logger.error('❌ Failed to load therapy sessions:', undefined, err);
    }
  };

  // Business logic functions
  const handleBookTherapist = async (therapist: Therapist) => {
    try {
      logger.info('Booking therapist:', { therapist: therapist.name });
    } catch (err) {
      logger.error('Failed to book therapist:', undefined, err);
      alert('Er is een fout opgetreden bij het boeken. Probeer het opnieuw.');
    }
  };

  const handleBookCoach = async (coach: ZoomSpaceCoach) => {
    try {
      logger.info('Booking coach:', { coach: coach.name });

      // In a real implementation, this would integrate with ZoomSpace API
      // For now, we'll just log and show a success message
      alert(`Gratis sessie geboekt met ${coach.name} via ZoomSpace. Controleer je email voor de uitnodiging.`);

      // Could trigger a refresh of coach availability
      await refreshData();
    } catch (err) {
      logger.error('Failed to book coach:', undefined, err);
      alert('Er is een fout opgetreden bij het boeken. Probeer het opnieuw.');
    }
  };

  const handleStartTherapySession = async (session: TherapySession) => {
    try {
      logger.info('Starting therapy session:', { session: session.title });

      // Navigate to the appropriate session based on type
      if (session.type === 'ai') {
        setCurrentView('ai-therapy');
      } else {
        // For human-led sessions, this would typically open a booking flow
        alert(`Sessie "${session.title}" gestart. Een therapeut neemt binnenkort contact met je op.`);
      }
    } catch (err) {
      logger.error('Failed to start therapy session:', undefined, err);
      alert('Er is een fout opgetreden bij het starten van de sessie. Probeer het opnieuw.');
    }
  };

  const refreshData = async () => {
    await Promise.all([
      loadTherapists(),
      loadCoaches(),
      loadTherapySessions()
    ]);
  };

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, [mbtiType]);

  const value: TherapistPageContextType = {
    // State
    currentView,
    searchQuery,
    selectedSpecialty,
    therapists,
    coaches,
    therapySessions,
    loading,
    error,

    // User data
    mbtiType,

    // Actions
    setCurrentView,
    setSearchQuery,
    setSelectedSpecialty,
    handleBookTherapist,
    handleBookCoach,
    handleStartTherapySession,
    refreshData
  };

  return (
    <TherapistPageContext.Provider value={value}>
      {children}
    </TherapistPageContext.Provider>
  );
};
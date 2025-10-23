import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { logger } from '../../utils/logger';

// Types
interface QuestionnaireAnswer {
  [key: string]: number;
}

interface CommunityLink {
  title: string;
  hashtag: string;
  url: string;
  memberCount: number;
  lastActivity: string;
  isLive: boolean;
}

interface CommunityEvent {
  title: string;
  date: string;
  location: string;
  attendees: number;
  registrationUrl: string;
}

interface CommunityData {
  links: CommunityLink[];
  events: CommunityEvent[];
}

interface Resource {
  title: string;
  type: string;
  duration: string;
  difficulty: string;
}

interface Questionnaire {
  title: string;
  questions: Array<{
    id: string;
    question: string;
    context: string;
    scale: string;
  }>;
}

interface AreaDetail {
  id: string;
  name: string;
  color: string;
  description: string;
  hashtags: string[];
  questionnaire: Questionnaire;
  resources: Resource[];
  community: CommunityData;
}

interface MBTICommunityMapping {
  [mbtiType: string]: {
    [levensgebied: string]: string[];
  };
}

// MBTI Community Mapping Data
const MBTICommunityMapping: MBTICommunityMapping = {
  INTJ: {
    psychischeGezondheid: ['strategic-mindfulness', 'visionary-wellness', 'independent-growth'],
    relaties: ['intellectual-connections', 'deep-conversations', 'autonomous-relationships'],
    carrière: ['strategic-careers', 'visionary-leadership', 'independent-achievers'],
    financiën: ['strategic-finance', 'long-term-planning', 'wealth-building'],
    gezondheid: ['precision-fitness', 'strategic-nutrition', 'mindful-movement'],
    persoonlijkeOntwikkeling: ['visionary-growth', 'strategic-learning', 'independent-mastery'],
    vrijeTijd: ['intellectual-pursuits', 'strategic-hobbies', 'solitary-adventures'],
    spiritualiteit: ['philosophical-spirituality', 'visionary-purpose', 'independent-enlightenment'],
    maatschappelijkeBijdrage: ['strategic-impact', 'visionary-change', 'independent-contribution']
  },
  INTP: {
    psychischeGezondheid: ['analytical-mindfulness', 'curious-wellness', 'independent-thinking'],
    relaties: ['intellectual-partners', 'deep-analysis', 'autonomous-connections'],
    carrière: ['research-careers', 'innovative-thinking', 'independent-experts'],
    financiën: ['analytical-finance', 'research-planning', 'wealth-analysis'],
    gezondheid: ['analytical-fitness', 'research-nutrition', 'curious-movement'],
    persoonlijkeOntwikkeling: ['curious-growth', 'analytical-learning', 'independent-discovery'],
    vrijeTijd: ['research-pursuits', 'analytical-hobbies', 'solitary-exploration'],
    spiritualiteit: ['analytical-spirituality', 'curious-purpose', 'independent-quest'],
    maatschappelijkeBijdrage: ['analytical-impact', 'innovative-change', 'independent-research']
  },
  ENTJ: {
    psychischeGezondheid: ['leadership-mindfulness', 'commanding-wellness', 'strategic-growth'],
    relaties: ['leadership-connections', 'strategic-partners', 'commanding-relationships'],
    carrière: ['executive-careers', 'leadership-development', 'strategic-achievers'],
    financiën: ['executive-finance', 'strategic-planning', 'wealth-command'],
    gezondheid: ['leadership-fitness', 'strategic-nutrition', 'commanding-movement'],
    persoonlijkeOntwikkeling: ['leadership-growth', 'strategic-learning', 'commanding-mastery'],
    vrijeTijd: ['strategic-pursuits', 'leadership-hobbies', 'commanding-adventures'],
    spiritualiteit: ['leadership-spirituality', 'strategic-purpose', 'commanding-enlightenment'],
    maatschappelijkeBijdrage: ['leadership-impact', 'strategic-change', 'commanding-contribution']
  },
  ENTP: {
    psychischeGezondheid: ['innovative-mindfulness', 'debate-wellness', 'versatile-growth'],
    relaties: ['debate-connections', 'innovative-partners', 'versatile-relationships'],
    carrière: ['innovative-careers', 'debate-development', 'versatile-achievers'],
    financiën: ['innovative-finance', 'debate-planning', 'versatile-wealth'],
    gezondheid: ['innovative-fitness', 'debate-nutrition', 'versatile-movement'],
    persoonlijkeOntwikkeling: ['debate-growth', 'innovative-learning', 'versatile-mastery'],
    vrijeTijd: ['debate-pursuits', 'innovative-hobbies', 'versatile-adventures'],
    spiritualiteit: ['debate-spirituality', 'innovative-purpose', 'versatile-enlightenment'],
    maatschappelijkeBijdrage: ['debate-impact', 'innovative-change', 'versatile-contribution']
  },
  INFJ: {
    psychischeGezondheid: ['intuitive-mindfulness', 'counselor-wellness', 'empathetic-growth'],
    relaties: ['deep-connections', 'intuitive-partners', 'empathetic-relationships'],
    carrière: ['counselor-careers', 'intuitive-development', 'empathetic-achievers'],
    financiën: ['intuitive-finance', 'counselor-planning', 'empathetic-wealth'],
    gezondheid: ['intuitive-fitness', 'counselor-nutrition', 'empathetic-movement'],
    persoonlijkeOntwikkeling: ['intuitive-growth', 'counselor-learning', 'empathetic-mastery'],
    vrijeTijd: ['intuitive-pursuits', 'counselor-hobbies', 'empathetic-adventures'],
    spiritualiteit: ['intuitive-spirituality', 'counselor-purpose', 'empathetic-enlightenment'],
    maatschappelijkeBijdrage: ['intuitive-impact', 'counselor-change', 'empathetic-contribution']
  },
  INFP: {
    psychischeGezondheid: ['idealistic-mindfulness', 'healer-wellness', 'creative-growth'],
    relaties: ['deep-emotional-connections', 'idealistic-partners', 'creative-relationships'],
    carrière: ['healer-careers', 'idealistic-development', 'creative-achievers'],
    financiën: ['idealistic-finance', 'healer-planning', 'creative-wealth'],
    gezondheid: ['idealistic-fitness', 'healer-nutrition', 'creative-movement'],
    persoonlijkeOntwikkeling: ['idealistic-growth', 'healer-learning', 'creative-mastery'],
    vrijeTijd: ['idealistic-pursuits', 'healer-hobbies', 'creative-adventures'],
    spiritualiteit: ['idealistic-spirituality', 'healer-purpose', 'creative-enlightenment'],
    maatschappelijkeBijdrage: ['idealistic-impact', 'healer-change', 'creative-contribution']
  },
  ENFJ: {
    psychischeGezondheid: ['mentor-mindfulness', 'giver-wellness', 'charismatic-growth'],
    relaties: ['mentor-connections', 'giver-partners', 'charismatic-relationships'],
    carrière: ['mentor-careers', 'giver-development', 'charismatic-achievers'],
    financiën: ['mentor-finance', 'giver-planning', 'charismatic-wealth'],
    gezondheid: ['mentor-fitness', 'giver-nutrition', 'charismatic-movement'],
    persoonlijkeOntwikkeling: ['mentor-growth', 'giver-learning', 'charismatic-mastery'],
    vrijeTijd: ['mentor-pursuits', 'giver-hobbies', 'charismatic-adventures'],
    spiritualiteit: ['mentor-spirituality', 'giver-purpose', 'charismatic-enlightenment'],
    maatschappelijkeBijdrage: ['mentor-impact', 'giver-change', 'charismatic-contribution']
  },
  ENFP: {
    psychischeGezondheid: ['enthusiastic-mindfulness', 'campaigner-wellness', 'inspirational-growth'],
    relaties: ['enthusiastic-connections', 'campaigner-partners', 'inspirational-relationships'],
    carrière: ['campaigner-careers', 'enthusiastic-development', 'inspirational-achievers'],
    financiën: ['enthusiastic-finance', 'campaigner-planning', 'inspirational-wealth'],
    gezondheid: ['enthusiastic-fitness', 'campaigner-nutrition', 'inspirational-movement'],
    persoonlijkeOntwikkeling: ['enthusiastic-growth', 'campaigner-learning', 'inspirational-mastery'],
    vrijeTijd: ['enthusiastic-pursuits', 'campaigner-hobbies', 'inspirational-adventures'],
    spiritualiteit: ['enthusiastic-spirituality', 'campaigner-purpose', 'inspirational-enlightenment'],
    maatschappelijkeBijdrage: ['enthusiastic-impact', 'campaigner-change', 'inspirational-contribution']
  },
  ISTJ: {
    psychischeGezondheid: ['responsible-mindfulness', 'logistician-wellness', 'practical-growth'],
    relaties: ['responsible-connections', 'logistician-partners', 'practical-relationships'],
    carrière: ['logistician-careers', 'responsible-development', 'practical-achievers'],
    financiën: ['responsible-finance', 'logistician-planning', 'practical-wealth'],
    gezondheid: ['responsible-fitness', 'logistician-nutrition', 'practical-movement'],
    persoonlijkeOntwikkeling: ['responsible-growth', 'logistician-learning', 'practical-mastery'],
    vrijeTijd: ['responsible-pursuits', 'logistician-hobbies', 'practical-adventures'],
    spiritualiteit: ['responsible-spirituality', 'logistician-purpose', 'practical-enlightenment'],
    maatschappelijkeBijdrage: ['responsible-impact', 'logistician-change', 'practical-contribution']
  },
  ISFJ: {
    psychischeGezondheid: ['nurturing-mindfulness', 'defender-wellness', 'supportive-growth'],
    relaties: ['nurturing-connections', 'defender-partners', 'supportive-relationships'],
    carrière: ['defender-careers', 'nurturing-development', 'supportive-achievers'],
    financiën: ['nurturing-finance', 'defender-planning', 'supportive-wealth'],
    gezondheid: ['nurturing-fitness', 'defender-nutrition', 'supportive-movement'],
    persoonlijkeOntwikkeling: ['nurturing-growth', 'defender-learning', 'supportive-mastery'],
    vrijeTijd: ['nurturing-pursuits', 'defender-hobbies', 'supportive-adventures'],
    spiritualiteit: ['nurturing-spirituality', 'defender-purpose', 'supportive-enlightenment'],
    maatschappelijkeBijdrage: ['nurturing-impact', 'defender-change', 'supportive-contribution']
  },
  ESTJ: {
    psychischeGezondheid: ['organized-mindfulness', 'executive-wellness', 'managerial-growth'],
    relaties: ['organized-connections', 'executive-partners', 'managerial-relationships'],
    carrière: ['executive-careers', 'organized-development', 'managerial-achievers'],
    financiën: ['organized-finance', 'executive-planning', 'managerial-wealth'],
    gezondheid: ['organized-fitness', 'executive-nutrition', 'managerial-movement'],
    persoonlijkeOntwikkeling: ['organized-growth', 'executive-learning', 'managerial-mastery'],
    vrijeTijd: ['organized-pursuits', 'executive-hobbies', 'managerial-adventures'],
    spiritualiteit: ['organized-spirituality', 'executive-purpose', 'managerial-enlightenment'],
    maatschappelijkeBijdrage: ['organized-impact', 'executive-change', 'managerial-contribution']
  },
  ESFJ: {
    psychischeGezondheid: ['caring-mindfulness', 'consul-wellness', 'harmonious-growth'],
    relaties: ['caring-connections', 'consul-partners', 'harmonious-relationships'],
    carrière: ['consul-careers', 'caring-development', 'harmonious-achievers'],
    financiën: ['caring-finance', 'consul-planning', 'harmonious-wealth'],
    gezondheid: ['caring-fitness', 'consul-nutrition', 'harmonious-movement'],
    persoonlijkeOntwikkeling: ['caring-growth', 'consul-learning', 'harmonious-mastery'],
    vrijeTijd: ['caring-pursuits', 'consul-hobbies', 'harmonious-adventures'],
    spiritualiteit: ['caring-spirituality', 'consul-purpose', 'harmonious-enlightenment'],
    maatschappelijkeBijdrage: ['caring-impact', 'consul-change', 'harmonious-contribution']
  },
  ISTP: {
    psychischeGezondheid: ['mechanical-mindfulness', 'virtuoso-wellness', 'hands-on-growth'],
    relaties: ['mechanical-connections', 'virtuoso-partners', 'hands-on-relationships'],
    carrière: ['virtuoso-careers', 'mechanical-development', 'hands-on-achievers'],
    financiën: ['mechanical-finance', 'virtuoso-planning', 'hands-on-wealth'],
    gezondheid: ['mechanical-fitness', 'virtuoso-nutrition', 'hands-on-movement'],
    persoonlijkeOntwikkeling: ['mechanical-growth', 'virtuoso-learning', 'hands-on-mastery'],
    vrijeTijd: ['mechanical-pursuits', 'virtuoso-hobbies', 'hands-on-adventures'],
    spiritualiteit: ['mechanical-spirituality', 'virtuoso-purpose', 'hands-on-enlightenment'],
    maatschappelijkeBijdrage: ['mechanical-impact', 'virtuoso-change', 'hands-on-contribution']
  },
  ISFP: {
    psychischeGezondheid: ['artistic-mindfulness', 'adventurer-wellness', 'gentle-growth'],
    relaties: ['artistic-connections', 'adventurer-partners', 'gentle-relationships'],
    carrière: ['adventurer-careers', 'artistic-development', 'gentle-achievers'],
    financiën: ['artistic-finance', 'adventurer-planning', 'gentle-wealth'],
    gezondheid: ['artistic-fitness', 'adventurer-nutrition', 'gentle-movement'],
    persoonlijkeOntwikkeling: ['artistic-growth', 'adventurer-learning', 'gentle-mastery'],
    vrijeTijd: ['artistic-pursuits', 'adventurer-hobbies', 'gentle-adventures'],
    spiritualiteit: ['artistic-spirituality', 'adventurer-purpose', 'gentle-enlightenment'],
    maatschappelijkeBijdrage: ['artistic-impact', 'adventurer-change', 'gentle-contribution']
  },
  ESTP: {
    psychischeGezondheid: ['action-mindfulness', 'entrepreneur-wellness', 'energetic-growth'],
    relaties: ['action-connections', 'entrepreneur-partners', 'energetic-relationships'],
    carrière: ['entrepreneur-careers', 'action-development', 'energetic-achievers'],
    financiën: ['action-finance', 'entrepreneur-planning', 'energetic-wealth'],
    gezondheid: ['action-fitness', 'entrepreneur-nutrition', 'energetic-movement'],
    persoonlijkeOntwikkeling: ['action-growth', 'entrepreneur-learning', 'energetic-mastery'],
    vrijeTijd: ['action-pursuits', 'entrepreneur-hobbies', 'energetic-adventures'],
    spiritualiteit: ['action-spirituality', 'entrepreneur-purpose', 'energetic-enlightenment'],
    maatschappelijkeBijdrage: ['action-impact', 'entrepreneur-change', 'energetic-contribution']
  },
  ESFP: {
    psychischeGezondheid: ['fun-mindfulness', 'entertainer-wellness', 'spontaneous-growth'],
    relaties: ['fun-connections', 'entertainer-partners', 'spontaneous-relationships'],
    carrière: ['entertainer-careers', 'fun-development', 'spontaneous-achievers'],
    financiën: ['fun-finance', 'entertainer-planning', 'spontaneous-wealth'],
    gezondheid: ['fun-fitness', 'entertainer-nutrition', 'spontaneous-movement'],
    persoonlijkeOntwikkeling: ['fun-growth', 'entertainer-learning', 'spontaneous-mastery'],
    vrijeTijd: ['fun-pursuits', 'entertainer-hobbies', 'spontaneous-adventures'],
    spiritualiteit: ['fun-spirituality', 'entertainer-purpose', 'spontaneous-enlightenment'],
    maatschappelijkeBijdrage: ['fun-impact', 'entertainer-change', 'spontaneous-contribution']
  }
};

// Provider Interface
interface EnhancedLevensgebiedDetailPageContextType {
  // State
  activeTab: string;
  questionnaireAnswers: QuestionnaireAnswer;
  progress: number;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  isSaving: boolean;

  // Data
  area: AreaDetail | null;
  mbtiType: string;
  areaId: string;

  // Actions
  setActiveTab: (tab: string) => void;
  setQuestionnaireAnswer: (questionId: string, value: number) => void;
  handleSaveProgress: () => Promise<void>;
  handleCommunityClick: (url: string) => void;
  navigateBack: () => void;
}

// Context
const EnhancedLevensgebiedDetailPageContext = createContext<EnhancedLevensgebiedDetailPageContextType | undefined>(undefined);

// Provider Component
interface EnhancedLevensgebiedDetailPageProviderProps {
  children: ReactNode;
}

export const EnhancedLevensgebiedDetailPageProvider: React.FC<EnhancedLevensgebiedDetailPageProviderProps> = ({ children }) => {
  const { areaId } = useParams<{ areaId: string }>();
  const navigate = useNavigate();
  const { mbtiType } = useAppStore();

  // State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<QuestionnaireAnswer>({});
  const [progress, setProgress] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Helper Functions
  const getMBTICommunities = (levensgebied: string): string[] => {
    const mbtiCommunities = MBTICommunityMapping[mbtiType as keyof typeof MBTICommunityMapping];
    if (!mbtiCommunities) return [];

    const levensgebiedCommunities = mbtiCommunities[levensgebied as keyof typeof mbtiCommunities];
    return levensgebiedCommunities || [];
  };

  // Area Details Data
  const areaDetails: { [key: string]: AreaDetail } = {
    psychischeGezondheid: {
      id: "psychischeGezondheid",
      name: "🧠 Psychische Gezondheid",
      color: "from-blue-500 to-purple-600",
      description: "Mental health coaching en tracking voor emotionele balans",
      hashtags: ["#Mindfulness", "#EmotioneleRegulatie", "#Zelfcompassie"],
      questionnaire: {
        title: "Mentale Veerkracht & Emotionele Gezondheid",
        questions: [
          {
            id: "stress_management",
            question: "Hoe goed kun je omgaan met stress?",
            context: "Stress management is cruciaal voor mentale gezondheid.",
            scale: "1-10",
          },
          {
            id: "emotional_regulation",
            question: "Hoe goed kun je je emoties reguleren?",
            context: "Emotionele regulatie helpt bij gezonde relaties.",
            scale: "1-10",
          },
          {
            id: "mindfulness_practice",
            question: "Hoe regelmatig beoefen je mindfulness?",
            context: "Mindfulness verbetert focus en welzijn.",
            scale: "1-10",
          },
        ],
      },
      resources: [
        {
          title: "Mindfulness Meditatie",
          type: "Audio",
          duration: "10 min",
          difficulty: "Easy",
        },
        {
          title: "Emotionele Regulatie Workshop",
          type: "Video",
          duration: "45 min",
          difficulty: "Medium",
        },
        {
          title: "Stress Management Gids",
          type: "PDF",
          duration: "20 min",
          difficulty: "Easy",
        },
      ],
      community: {
        links: [
          {
            title: "Mindfulness Community",
            hashtag: "#Mindfulness",
            url: `https://www.community.your-future-self.nl/${getMBTICommunities('psychischeGezondheid')[0] || 'mindfulness-community'}`,
            memberCount: 1247,
            lastActivity: "2 hours ago",
            isLive: true
          },
          {
            title: "Emotionele Balans Groep",
            hashtag: "#EmotioneleRegulatie",
            url: `https://www.community.your-future-self.nl/${getMBTICommunities('psychischeGezondheid')[1] || 'emotionele-balans'}`,
            memberCount: 892,
            lastActivity: "5 hours ago",
            isLive: true
          },
          {
            title: "Zelfcompassie Support",
            hashtag: "#Zelfcompassie",
            url: `https://www.community.your-future-self.nl/${getMBTICommunities('psychischeGezondheid')[2] || 'zelfcompassie-support'}`,
            memberCount: 634,
            lastActivity: "1 day ago",
            isLive: true
          },
        ],
        events: [
          {
            title: "Weekend Retreat: Innerlijke Vrede",
            date: "15-17 December 2024",
            location: "Ardennen, België",
            attendees: 45,
            registrationUrl: "https://www.community.your-future-self.nl/events/innerlijke-vrede-retreat"
          },
          {
            title: "Online Workshop: Stress Management",
            date: "22 November 2024",
            location: "Online",
            attendees: 120,
            registrationUrl: "https://www.community.your-future-self.nl/events/stress-management-workshop"
          },
        ],
      },
    },
    // Additional levensgebieden would be defined here with similar structure
  };

  const area = areaDetails[areaId || ''] || null;

  // Calculate progress based on questionnaire answers
  useEffect(() => {
    if (area?.questionnaire.questions) {
      const answeredQuestions = Object.keys(questionnaireAnswers).length;
      const totalQuestions = area.questionnaire.questions.length;
      const newProgress = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
      setProgress(newProgress);
    }
  }, [questionnaireAnswers, area]);

  // Actions
  const setQuestionnaireAnswer = (questionId: string, value: number) => {
    setQuestionnaireAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      // Save progress logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus("saved");
      logger.info(`Progress saved for ${area?.name}`);
    } catch (error) {
      setSaveStatus("error");
      logger.error("Failed to save progress:", undefined, error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCommunityClick = (url: string) => {
    logger.info(`Navigating to community: ${url}`);
    window.open(url, '_blank');
  };

  const navigateBack = () => {
    navigate('/back-to-basics');
  };

  const contextValue: EnhancedLevensgebiedDetailPageContextType = {
    // State
    activeTab,
    questionnaireAnswers,
    progress,
    saveStatus,
    isSaving,

    // Data
    area,
    mbtiType,
    areaId: areaId || '',

    // Actions
    setActiveTab,
    setQuestionnaireAnswer,
    handleSaveProgress,
    handleCommunityClick,
    navigateBack,
  };

  return (
    <EnhancedLevensgebiedDetailPageContext.Provider value={contextValue}>
      {children}
    </EnhancedLevensgebiedDetailPageContext.Provider>
  );
};

// Hook to use the context
export const useEnhancedLevensgebiedDetailPage = (): EnhancedLevensgebiedDetailPageContextType => {
  const context = useContext(EnhancedLevensgebiedDetailPageContext);
  if (context === undefined) {
    throw new Error('useEnhancedLevensgebiedDetailPage must be used within an EnhancedLevensgebiedDetailPageProvider');
  }
  return context;
};
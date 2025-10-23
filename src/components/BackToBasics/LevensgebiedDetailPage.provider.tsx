/**
 * LevensgebiedDetailPage Provider - BMAD Architecture
 *
 * Centralized state management and business logic for Levensgebied Detail features
 *
 * @version 14.0.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import database from '../../database';
import { useAppStore } from '../../store/useAppStore';
import { logger } from '../../utils/logger';

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  context: string;
  scale: string;
}

export interface Questionnaire {
  title: string;
  questions: QuestionnaireQuestion[];
}

export interface Exercise {
  title: string;
  duration: string;
  difficulty: string;
}

export interface CommunityLink {
  title: string;
  hashtag: string;
  url: string;
}

export interface CommunityEvent {
  title: string;
  date: string;
  location: string;
}

export interface Community {
  links: CommunityLink[];
  events: CommunityEvent[];
}

export interface LevensgebiedData {
  id: string;
  name: string;
  color: string;
  description: string;
  hashtags: string[];
  questionnaire: Questionnaire;
  exercises: Exercise[];
  community: Community;
}

interface LevensgebiedDetailContextType {
  // Route params
  areaId: string | undefined;

  // State
  activeTab: string;
  questionnaireAnswers: {[key: string]: number};
  progress: number;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';

  // Data
  areaData: LevensgebiedData | null;
  levensgebiedenData: {[key: string]: LevensgebiedData};

  // Actions
  setActiveTab: (tab: string) => void;
  handleQuestionnaireAnswer: (questionId: string, answer: number) => void;
  handleSaveQuestionnaire: () => Promise<void>;
  handleBackToBasics: () => void;
  calculateProgress: () => number;
}

const LevensgebiedDetailContext = createContext<LevensgebiedDetailContextType | undefined>(undefined);

interface LevensgebiedDetailProviderProps {
  children: ReactNode;
}

export const LevensgebiedDetailProvider: React.FC<LevensgebiedDetailProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { areaId } = useParams<{ areaId: string }>();
  const { userData } = useAppStore();

  // State
  const [activeTab, setActiveTab] = useState('overview');
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<{[key: string]: number}>({});
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Levensgebieden data - extracted from original component
  const levensgebiedenData: {[key: string]: LevensgebiedData} = {
    psychischeGezondheid: {
      id: 'psychischeGezondheid',
      name: '🧠 Psychische Gezondheid',
      color: 'from-blue-500 to-purple-600',
      description: 'Mental health coaching en tracking voor emotionele balans',
      hashtags: ['#Mindfulness', '#EmotioneleRegulatie', '#Zelfcompassie'],
      questionnaire: {
        title: 'Mentale Veerkracht & Emotionele Gezondheid',
        questions: [
          {
            id: 'emotie_regulatie',
            question: 'Hoe goed kun je je emoties reguleren in stress?',
            context: 'Direct gerelateerd aan mentale veerkracht en emotionele gezondheid.',
            scale: '1-10',
          },
          {
            id: 'zingeving',
            question: 'Hoe vaak ervaar je zingeving in dagelijkse activiteiten?',
            context: 'Zingeving is een belangrijk aspect van mentale gezondheid.',
            scale: '1-10',
          },
          {
            id: 'zelfcompassie',
            question: 'Hoe vaak ben je vriendelijk voor jezelf bij tegenslag?',
            context: 'Zelfcompassie is een kernonderdeel van psychische gezondheid.',
            scale: '1-10',
          },
          {
            id: 'stress_niveau',
            question: 'Hoe hoog is je ervaren stressniveau?',
            context: 'Stress is een centrale indicator van mentale gezondheid.',
            scale: '0-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Emotionele Regulatie Oefening',
          duration: '15 min',
          difficulty: 'Medium',
        },
        {
          title: 'Mindset Transformatie Sessie',
          duration: '20 min',
          difficulty: 'Hard',
        },
        {
          title: 'Zelfcompassie Meditatie',
          duration: '10 min',
          difficulty: 'Easy',
        },
      ],
      community: {
        links: [
          { title: 'Mindfulness Community', hashtag: '#Mindfulness', url: '#' },
          { title: 'Emotionele Balans Groep', hashtag: '#EmotioneleRegulatie', url: '#' },
          { title: 'Zelfcompassie Support', hashtag: '#Zelfcompassie', url: '#' },
        ],
        events: [
          {
            title: 'Weekend Retreat: Innerlijke Vrede',
            date: '15-17 December 2024',
            location: 'Ardennen, België',
          },
          {
            title: 'Online Workshop: Stress Management',
            date: '22 November 2024',
            location: 'Online',
          },
        ],
      },
    },
    lichamelijkeGezondheid: {
      id: 'lichamelijkeGezondheid',
      name: '💪 Lichamelijke Gezondheid',
      color: 'from-green-500 to-teal-600',
      description: 'Physical health optimization voor vitaliteit en energie',
      hashtags: ['#Gezondheidstechnologie', '#Vitaliteit', '#PreventieveZorg'],
      questionnaire: {
        title: 'Fysiek Welzijn & Vitaliteit',
        questions: [
          {
            id: 'slaap_regelmaat',
            question: 'Hoe regelmatig slaap je voldoende?',
            context: 'Slaap is essentieel voor lichamelijk herstel en gezondheid.',
            scale: '1-10',
          },
          {
            id: 'vermoeidheid',
            question: 'Hoe vaak heb je last van vermoeidheid overdag?',
            context: 'Vermoeidheid kan duiden op gezondheidsproblemen.',
            scale: '1-10',
          },
          {
            id: 'beweging',
            question: 'Hoe vaak ben je fysiek actief?',
            context: 'Regelmatige beweging is cruciaal voor fysieke gezondheid.',
            scale: '1-10',
          },
          {
            id: 'voeding',
            question: 'Hoe gezond is je voedingspatroon?',
            context: 'Voeding heeft directe invloed op fysieke gezondheid.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Vitaliteit Boost Workout',
          duration: '30 min',
          difficulty: 'Medium',
        },
        {
          title: 'Herstel & Ontspanning Routine',
          duration: '20 min',
          difficulty: 'Easy',
        },
        {
          title: 'Voedingsbewustzijn Workshop',
          duration: '45 min',
          difficulty: 'Medium',
        },
      ],
      community: {
        links: [
          { title: 'Vitaliteit Community', hashtag: '#Vitaliteit', url: '#' },
          { title: 'Gezond Leven Groep', hashtag: '#GezondLeven', url: '#' },
          { title: 'Fitness Support', hashtag: '#Fitness', url: '#' },
        ],
        events: [
          {
            title: 'Health & Wellness Retreat',
            date: '10-12 January 2025',
            location: 'Zutphen, Nederland',
          },
          {
            title: 'Online: Nutrition Masterclass',
            date: '5 December 2024',
            location: 'Online',
          },
        ],
      },
    },
    financieen: {
      id: 'financieen',
      name: '💰 Financiën',
      color: 'from-yellow-500 to-orange-600',
      description: 'Financial planning en wealth management voor financiële vrijheid',
      hashtags: ['#FinanciëleVrijheid', '#WealthManagement', '#SlimSparen'],
      questionnaire: {
        title: 'Financiële Geletterdheid & Gedrag',
        questions: [
          {
            id: 'budgettering',
            question: 'Hoe consistent houd je je aan een budget?',
            context: 'Budgetteren is de basis van financiële gezondheid.',
            scale: '1-10',
          },
          {
            id: 'sparen',
            question: 'Hoe regelmatig spaar je voor de toekomst?',
            context: 'Sparen bouwt financiële zekerheid op.',
            scale: '1-10',
          },
          {
            id: 'investeren',
            question: 'Hoeveel kennis heb je van investeren?',
            context: 'Investeren kan rijkdom opbouwen.',
            scale: '1-10',
          },
          {
            id: 'schulden',
            question: 'Hoe goed beheer je je schulden?',
            context: 'Schulden kunnen financiële vrijheid beperken.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Budget Planning Sessie',
          duration: '25 min',
          difficulty: 'Easy',
        },
        {
          title: 'Investment Strategy Workshop',
          duration: '40 min',
          difficulty: 'Hard',
        },
        {
          title: 'Debt Management Plan',
          duration: '30 min',
          difficulty: 'Medium',
        },
      ],
      community: {
        links: [
          { title: 'Financial Freedom Community', hashtag: '#FinancialFreedom', url: '#' },
          { title: 'Investment Club', hashtag: '#Investment', url: '#' },
          { title: 'Budgeting Support', hashtag: '#Budgeting', url: '#' },
        ],
        events: [
          {
            title: 'Financial Planning Seminar',
            date: '18 December 2024',
            location: 'Amsterdam, Nederland',
          },
          {
            title: 'Online: Investment Workshop',
            date: '8 January 2025',
            location: 'Online',
          },
        ],
      },
    },
    werkSamenleving: {
      id: 'werkSamenleving',
      name: '💼 Werk & Samenleving',
      color: 'from-indigo-500 to-purple-600',
      description: 'Career development en maatschappelijke bijdrage voor betekenisvol leven',
      hashtags: ['#CareerDevelopment', '#MaatschappelijkeBijdrage', '#WorkLifeBalance'],
      questionnaire: {
        title: 'Professionele Ontwikkeling & Maatschappelijke Betrokkenheid',
        questions: [
          {
            id: 'werktevredenheid',
            question: 'Hoe tevreden ben je met je huidige werk?',
            context: 'Werktevredenheid beïnvloedt algeheel welzijn.',
            scale: '1-10',
          },
          {
            id: 'vaardigheden',
            question: 'Hoe actief ontwikkel je professionele vaardigheden?',
            context: 'Continue learning is essentieel in de moderne arbeidsmarkt.',
            scale: '1-10',
          },
          {
            id: 'netwerken',
            question: 'Hoe actief bouw je professionele netwerken op?',
            context: 'Netwerken opent deuren voor nieuwe kansen.',
            scale: '1-10',
          },
          {
            id: 'maatschappelijke_bijdrage',
            question: 'Hoeveel draag je bij aan de samenleving?',
            context: 'Maatschappelijke betrokkenheid geeft zingeving.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Career Vision Workshop',
          duration: '35 min',
          difficulty: 'Medium',
        },
        {
          title: 'Networking Skills Training',
          duration: '25 min',
          difficulty: 'Easy',
        },
        {
          title: 'Work-Life Balance Assessment',
          duration: '20 min',
          difficulty: 'Easy',
        },
      ],
      community: {
        links: [
          { title: 'Career Development Hub', hashtag: '#CareerDevelopment', url: '#' },
          { title: 'Professional Networking', hashtag: '#Networking', url: '#' },
          { title: 'Work-Life Balance Group', hashtag: '#WorkLifeBalance', url: '#' },
        ],
        events: [
          {
            title: 'Career Fair 2025',
            date: '20 January 2025',
            location: 'Rotterdam, Nederland',
          },
          {
            title: 'Online: Leadership Workshop',
            date: '15 December 2024',
            location: 'Online',
          },
        ],
      },
    },
    hobbyPassies: {
      id: 'hobbyPassies',
      name: '🎨 Hobby & Passies',
      color: 'from-pink-500 to-rose-600',
      description: 'Creative expression en persoonlijke interesses voor joy en fulfillment',
      hashtags: ['#Creativiteit', '#PersoonlijkeGroei', '#Joy'],
      questionnaire: {
        title: 'Creatieve Expressie & Persoonlijke Belangstelling',
        questions: [
          {
            id: 'creativiteit',
            question: 'Hoe vaak geef je uitdrukking aan je creativiteit?',
            context: 'Creativiteit voedt de ziel en vermindert stress.',
            scale: '1-10',
          },
          {
            id: 'hobby_tijd',
            question: 'Hoeveel tijd besteed je aan hobby\'s?',
            context: 'Hobby\'s bieden balans en vreugde.',
            scale: '1-10',
          },
          {
            id: 'leren_nieuw',
            question: 'Hoe vaak leer je nieuwe dingen buiten werk om?',
            context: 'Levenslang leren houdt de geest scherp.',
            scale: '1-10',
          },
          {
            id: 'sociale_hobby',
            question: 'Hoe sociaal zijn je hobby\'s?',
            context: 'Sociale hobby\'s versterken relaties.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Creative Expression Workshop',
          duration: '30 min',
          difficulty: 'Medium',
        },
        {
          title: 'Hobby Discovery Session',
          duration: '25 min',
          difficulty: 'Easy',
        },
        {
          title: 'Art Therapy Introduction',
          duration: '40 min',
          difficulty: 'Easy',
        },
      ],
      community: {
        links: [
          { title: 'Creative Arts Community', hashtag: '#CreativeArts', url: '#' },
          { title: 'Hobby Enthusiasts', hashtag: '#Hobbies', url: '#' },
          { title: 'Learning Together', hashtag: '#LifelongLearning', url: '#' },
        ],
        events: [
          {
            title: 'Creative Arts Festival',
            date: '25-26 January 2025',
            location: 'Utrecht, Nederland',
          },
          {
            title: 'Online: Hobby Workshop Series',
            date: 'Weekly starting 1 December 2024',
            location: 'Online',
          },
        ],
      },
    },
    actieveImaginatie: {
      id: 'actieveImaginatie',
      name: '🧠 Actieve Imaginatie',
      color: 'from-purple-500 to-indigo-600',
      description: 'Jungiaanse active imagination voor innerlijke groei en zelfkennis',
      hashtags: ['#ActiveImagination', '#InnerlijkeWereld', '#Jungiaans'],
      questionnaire: {
        title: 'Imaginatie & Innerlijke Wereld',
        questions: [
          {
            id: 'imaginatie',
            question: 'Hoe actief gebruik je je verbeeldingskracht?',
            context: 'Imaginatie is een krachtig instrument voor persoonlijke groei.',
            scale: '1-10',
          },
          {
            id: 'dromen',
            question: 'Hoe vaak onthoud en interpreteer je je dromen?',
            context: 'Dromen bieden inzichten in het onbewuste.',
            scale: '1-10',
          },
          {
            id: 'introspectie',
            question: 'Hoe regelmatig reflecteer je op je innerlijke wereld?',
            context: 'Introspectie leidt tot zelfkennis.',
            scale: '1-10',
          },
          {
            id: 'symbolen',
            question: 'Hoe gevoelig ben je voor symbolen en metaforen?',
            context: 'Symbolen spreken tot het onbewuste.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Active Imagination Basic',
          duration: '20 min',
          difficulty: 'Medium',
        },
        {
          title: 'Dream Journaling Workshop',
          duration: '25 min',
          difficulty: 'Easy',
        },
        {
          title: 'Symbol Interpretation Guide',
          duration: '35 min',
          difficulty: 'Hard',
        },
      ],
      community: {
        links: [
          { title: 'Active Imagination Circle', hashtag: '#ActiveImagination', url: '#' },
          { title: 'Dream Interpretation Group', hashtag: '#Dreams', url: '#' },
          { title: 'Jungian Psychology', hashtag: '#Jungian', url: '#' },
        ],
        events: [
          {
            title: 'Active Imagination Retreat',
            date: '5-7 February 2025',
            location: 'Drenthe, Nederland',
          },
          {
            title: 'Online: Dream Workshop',
            date: '12 December 2024',
            location: 'Online',
          },
        ],
      },
    },
    professioneleOntwikkeling: {
      id: 'professioneleOntwikkeling',
      name: '📈 Professionele Ontwikkeling',
      color: 'from-cyan-500 to-blue-600',
      description: 'Professional growth en skill development voor carrière succes',
      hashtags: ['#ProfessionalGrowth', '#SkillDevelopment', '#CareerSuccess'],
      questionnaire: {
        title: 'Professionele Competenties & Ontwikkeling',
        questions: [
          {
            id: 'vaardigheden_update',
            question: 'Hoe up-to-date houd je je professionele vaardigheden?',
            context: 'Continue professionele ontwikkeling is cruciaal.',
            scale: '1-10',
          },
          {
            id: 'leiderschap',
            question: 'Hoe sterk zijn je leiderschapsvaardigheden?',
            context: 'Leiderschap opent carrière deuren.',
            scale: '1-10',
          },
          {
            id: 'communicatie',
            question: 'Hoe effectief ben je in professionele communicatie?',
            context: 'Goede communicatie is essentieel in elke rol.',
            scale: '1-10',
          },
          {
            id: 'adaptability',
            question: 'Hoe goed pas je je aan aan veranderingen?',
            context: 'Aanpassingsvermogen is key in moderne werkomgevingen.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Leadership Skills Workshop',
          duration: '45 min',
          difficulty: 'Hard',
        },
        {
          title: 'Communication Mastery Session',
          duration: '30 min',
          difficulty: 'Medium',
        },
        {
          title: 'Career Planning Intensive',
          duration: '50 min',
          difficulty: 'Hard',
        },
      ],
      community: {
        links: [
          { title: 'Professional Development Hub', hashtag: '#ProfessionalDevelopment', url: '#' },
          { title: 'Leadership Community', hashtag: '#Leadership', url: '#' },
          { title: 'Career Advancement Group', hashtag: '#CareerAdvancement', url: '#' },
        ],
        events: [
          {
            title: 'Professional Development Conference',
            date: '8-9 February 2025',
            location: 'Eindhoven, Nederland',
          },
          {
            title: 'Online: Skill Building Series',
            date: 'Monthly starting January 2025',
            location: 'Online',
          },
        ],
      },
    },
    socialeRelaties: {
      id: 'socialeRelaties',
      name: '👥 Sociale Relaties',
      color: 'from-emerald-500 to-green-600',
      description: 'Relationship building en sociale vaardigheden voor betekenisvolle connecties',
      hashtags: ['#SocialSkills', '#Relationships', '#Connection'],
      questionnaire: {
        title: 'Sociale Vaardigheden & Relatiekwaliteit',
        questions: [
          {
            id: 'empathie',
            question: 'Hoe goed begrijp je anderen emotioneel?',
            context: 'Empathie is de basis van goede relaties.',
            scale: '1-10',
          },
          {
            id: 'communicatie_relaties',
            question: 'Hoe effectief communiceer je in relaties?',
            context: 'Open communicatie versterkt banden.',
            scale: '1-10',
          },
          {
            id: 'grenzen',
            question: 'Hoe goed stel je gezonde grenzen?',
            context: 'Grenzen beschermen zowel jezelf als anderen.',
            scale: '1-10',
          },
          {
            id: 'conflict_resolutie',
            question: 'Hoe vaardig los je conflicten op?',
            context: 'Conflict resolutie behoudt relaties.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Empathy Building Workshop',
          duration: '25 min',
          difficulty: 'Medium',
        },
        {
          title: 'Communication Skills Training',
          duration: '30 min',
          difficulty: 'Easy',
        },
        {
          title: 'Boundary Setting Practice',
          duration: '20 min',
          difficulty: 'Easy',
        },
      ],
      community: {
        links: [
          { title: 'Relationship Building Community', hashtag: '#Relationships', url: '#' },
          { title: 'Social Skills Group', hashtag: '#SocialSkills', url: '#' },
          { title: 'Empathy & Understanding', hashtag: '#Empathy', url: '#' },
        ],
        events: [
          {
            title: 'Relationship Workshop Weekend',
            date: '14-16 February 2025',
            location: 'Noord-Holland, Nederland',
          },
          {
            title: 'Online: Social Skills Series',
            date: 'Bi-weekly starting December 2024',
            location: 'Online',
          },
        ],
      },
    },
    thuisOmgeving: {
      id: 'thuisOmgeving',
      name: '🏠 Thuis Omgeving',
      color: 'from-amber-500 to-yellow-600',
      description: 'Home environment optimization voor comfort en welzijn',
      hashtags: ['#HomeOptimization', '#LivingSpace', '#Wellbeing'],
      questionnaire: {
        title: 'Thuisomgeving & Leefcomfort',
        questions: [
          {
            id: 'ruimte_functie',
            question: 'Hoe functioneel is je woonruimte?',
            context: 'Een functionele ruimte ondersteunt dagelijks leven.',
            scale: '1-10',
          },
          {
            id: 'comfort',
            question: 'Hoe comfortabel voelt je thuisomgeving?',
            context: 'Comfort draagt bij aan welzijn.',
            scale: '1-10',
          },
          {
            id: 'organisatie',
            question: 'Hoe georganiseerd is je leefruimte?',
            context: 'Organisatie vermindert stress.',
            scale: '1-10',
          },
          {
            id: 'esthetiek',
            question: 'Hoe esthetisch aantrekkelijk is je omgeving?',
            context: 'Esthetiek beïnvloedt humeur en motivatie.',
            scale: '1-10',
          },
        ],
      },
      exercises: [
        {
          title: 'Space Optimization Workshop',
          duration: '35 min',
          difficulty: 'Medium',
        },
        {
          title: 'Home Organization Guide',
          duration: '25 min',
          difficulty: 'Easy',
        },
        {
          title: 'Comfort & Aesthetics Planning',
          duration: '30 min',
          difficulty: 'Easy',
        },
      ],
      community: {
        links: [
          { title: 'Home & Living Community', hashtag: '#HomeLiving', url: '#' },
          { title: 'Space Optimization Group', hashtag: '#SpaceOptimization', url: '#' },
          { title: 'Interior Design Enthusiasts', hashtag: '#InteriorDesign', url: '#' },
        ],
        events: [
          {
            title: 'Home Design & Wellness Fair',
            date: '22-23 February 2025',
            location: 'Haarlem, Nederland',
          },
          {
            title: 'Online: Space Planning Workshop',
            date: '18 December 2024',
            location: 'Online',
          },
        ],
      },
    },
  };

  // Get current area data
  const areaData = areaId ? levensgebiedenData[areaId] : null;

  // Load saved questionnaire answers on mount
  useEffect(() => {
    const loadSavedAnswers = async () => {
      if (!areaId || !userData?.id) return;

      try {
        // Load saved answers from database
        const savedAnswers = {}; // Mock - would load from database
        setQuestionnaireAnswers(savedAnswers);
      } catch (error) {
        logger.error('Failed to load questionnaire answers:', undefined, error);
      }
    };

    loadSavedAnswers();
  }, [areaId, userData?.id]);

  // Calculate progress based on questionnaire completion
  const calculateProgress = () => {
    if (!areaData?.questionnaire.questions.length) return 0;

    const answeredQuestions = Object.keys(questionnaireAnswers).length;
    const totalQuestions = areaData.questionnaire.questions.length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Update progress when answers change
  useEffect(() => {
    const newProgress = calculateProgress();
    setProgress(newProgress);
  }, [questionnaireAnswers, areaData]);

  // Actions
  const handleQuestionnaireAnswer = (questionId: string, answer: number) => {
    setQuestionnaireAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSaveQuestionnaire = async () => {
    if (!areaId || !userData?.id) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      // Save to database logic would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock save

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      logger.error('Failed to save questionnaire:', undefined, error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToBasics = () => {
    navigate('/back-to-basics');
  };

  const value: LevensgebiedDetailContextType = {
    areaId,
    activeTab,
    questionnaireAnswers,
    progress,
    isSaving,
    saveStatus,
    areaData,
    levensgebiedenData,
    setActiveTab,
    handleQuestionnaireAnswer,
    handleSaveQuestionnaire,
    handleBackToBasics,
    calculateProgress
  };

  return (
    <LevensgebiedDetailContext.Provider value={value}>
      {children}
    </LevensgebiedDetailContext.Provider>
  );
};

export const useLevensgebiedDetail = () => {
  const context = useContext(LevensgebiedDetailContext);
  if (context === undefined) {
    throw new Error('useLevensgebiedDetail must be used within a LevensgebiedDetailProvider');
  }
  return context;
};
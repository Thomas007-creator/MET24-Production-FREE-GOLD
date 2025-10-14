import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Progress, Chip, Spinner, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tabs, Tab } from '@nextui-org/react';
import { 
  Target, 
  Download, 
  FileText, 
  Clock, 
  Star, 
  CheckCircle, 
  Brain, 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  BarChart3
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { logger } from '../../utils/logger';

interface TherapyProgram {
  id: string;
  name: string;
  description: string;
  mbtiType: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  progress: number;
  sessions: TherapySession[];
  pdfContent: string;
  metadata: {
    createdBy: string;
    lastUpdated: string;
    version: string;
    tags: string[];
  };
}

interface TherapySession {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'assessment' | 'exercise' | 'reflection' | 'integration';
  content: {
    instructions: string;
    exercises: string[];
    questions: string[];
    resources: string[];
  };
  completed: boolean;
  notes?: string;
}

interface UserProgress {
  programId: string;
  currentSession: number;
  completedSessions: number;
  totalSessions: number;
  startDate: Date;
  lastAccessed: Date;
  achievements: string[];
  notes: string;
}

const IndividualTherapyPrograms: React.FC = () => {
  const { userData } = useAppStore();
  const [programs, setPrograms] = useState<TherapyProgram[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<TherapyProgram | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressAnswers, setProgressAnswers] = useState<{[key: string]: string}>({});
  const [assessmentTimePoint, setAssessmentTimePoint] = useState<string>('T0');

  const mbtiType = userData?.mbtiType || 'INTJ';

  useEffect(() => {
    loadTherapyPrograms();
    loadUserProgress();
  }, []);

  const loadTherapyPrograms = async () => {
    try {
      setLoading(true);
      
      // Mock data - later replace with WatermelonDB/PostgreSQL
      const mockPrograms: TherapyProgram[] = [
        {
          id: 'infj_visionary_structure',
          name: `${mbtiType} Therapieprotocol voor The Visionary Structure-Type binnen Psychosomatische Osteopathie 2.3`,
          description: `${mbtiType}'s vertonen introspectie, empathie en idealisme met discipline, doorzettingsvermogen en een sterke behoefte aan structuur. Hun gevoeligheid voor perfectionisme en overprikkeling vraagt om een holistische aanpak die zowel emotionele integratie als fysieke stabiliteit ondersteunt.`,
          mbtiType: mbtiType,
          duration: 480, // 8 weeks with weekly sessions
          difficulty: 'intermediate',
          status: 'available',
          progress: 0,
          sessions: [
            {
              id: 'session_1',
              title: 'Plexus Cardiale (Hartplexus) - Emotionele Integratie',
              description: 'Vanwege hun empathische natuur en behoefte aan diepe emotionele verbindingen. Deze plexus is betrokken bij het reguleren van het hart en de ademhaling.',
              duration: 60,
              type: 'assessment',
              content: {
                instructions: 'In deze sessie ga je je emotionele regulatie verkennen door parasympathische activatie via de hartplexus.',
                exercises: [
                  'Diaphragmatic breathing voor vagale stimulatie',
                  'Spierontspanning gericht op schouders, nek en onderrug',
                  'Sacrum-gericht werk voor energetische balans en gronding',
                  'Body scan en grounding oefeningen'
                ],
                questions: [
                  'Hoe uit je empathische natuur zich in dagelijks leven?',
                  'Wat zijn je grootste emotionele uitdagingen?',
                  'Hoe kun je je hartplexus beter reguleren?',
                  'Waar voel je spanning in je lichaam bij stress?'
                ],
                resources: [
                  'INFJ Emotionele Regulatie Guide',
                  'Diaphragmatic Breathing Exercises',
                  'Heart Plexus Activation Techniques',
                  'Body Scan Meditation Script'
                ]
              },
              completed: false
            },
            {
              id: 'session_2',
              title: 'Het Vijfvoudige Pad - Schoonheid: Somatische Gewaarwording',
              description: 'Lichaamsbewustzijn vergroten en fysieke spanning verminderen door somatische gewaarwording en ontspanning.',
              duration: 60,
              type: 'exercise',
              content: {
                instructions: 'Focus op het vergroten van lichaamsbewustzijn en het verminderen van fysieke spanning.',
                exercises: [
                  'Body scan meditatie',
                  'Grounding oefeningen',
                  'Ademhalingsoefeningen voor ontspanning',
                  'Progressieve spierontspanning'
                ],
                questions: [
                  'Hoe voelt je lichaam aan in verschillende situaties?',
                  'Waar houd je spanning vast?',
                  'Hoe kun je beter contact maken met je lichaam?',
                  'Wat helpt je om te ontspannen?'
                ],
                resources: [
                  'Somatic Awareness Workbook',
                  'Body Scan Meditation Guide',
                  'Progressive Muscle Relaxation Script',
                  'Grounding Techniques Manual'
                ]
              },
              completed: false
            },
            {
              id: 'session_3',
              title: 'Het Vijfvoudige Pad - Wijsheid: Gerichte Ademhaling',
              description: 'Stressregulatie en bevordering van mentale helderheid door gerichte ademhalingstechnieken.',
              duration: 60,
              type: 'reflection',
              content: {
                instructions: 'Werk aan stressregulatie en mentale helderheid door gerichte ademhaling.',
                exercises: [
                  'Diaphragmatic breathing oefeningen',
                  'Ritmische ademhaling voor stressregulatie',
                  'Ademhaling voor mentale focus',
                  'Vagale stimulatie technieken'
                ],
                questions: [
                  'Hoe reageer je op stress?',
                  'Wat helpt je om mentaal helder te blijven?',
                  'Hoe kun je je ademhaling beter reguleren?',
                  'Waar voel je stress in je lichaam?'
                ],
                resources: [
                  'Breathing Techniques Guide',
                  'Stress Regulation Workbook',
                  'Mental Clarity Exercises',
                  'Vagal Stimulation Manual'
                ]
              },
              completed: false
            },
            {
              id: 'session_4',
              title: 'Het Vijfvoudige Pad - Het Goede: Emotionele Resonantie',
              description: 'Emotionele blokkades doorbreken en innerlijke harmonie herstellen door emotionele resonantie en transformatie.',
              duration: 60,
              type: 'integration',
              content: {
                instructions: 'Werk aan het doorbreken van emotionele blokkades en het herstellen van innerlijke harmonie.',
                exercises: [
                  'Visualisatie oefeningen',
                  'Narratieve therapie gericht op perfectionisme',
                  'Actieve imaginatie technieken',
                  'Emotionele integratie oefeningen'
                ],
                questions: [
                  'Hoe uit je perfectionisme zich?',
                  'Wat zijn je grootste emotionele blokkades?',
                  'Hoe kun je innerlijke harmonie herstellen?',
                  'Wat helpt je om emoties te verwerken?'
                ],
                resources: [
                  'Emotional Integration Guide',
                  'Perfectionism Therapy Workbook',
                  'Active Imagination Techniques',
                  'Inner Harmony Exercises'
                ]
              },
              completed: false
            },
            {
              id: 'session_5',
              title: 'Het Vijfvoudige Pad - Energie: Intentioneel Bewegen',
              description: 'Lichaamsbeweging als middel voor energetische balans en fysieke vitaliteit.',
              duration: 60,
              type: 'integration',
              content: {
                instructions: 'Integreer lichaamsbeweging voor energetische balans en fysieke vitaliteit.',
                exercises: [
                  'Yoga voor structurele uitlijning en grounding',
                  'Wandelen voor energetische balans',
                  'Lichte krachttraining voor stabiliteit',
                  'Stretching voor flexibiliteit'
                ],
                questions: [
                  'Hoe voelt je lichaam aan tijdens beweging?',
                  'Wat geeft je energie?',
                  'Hoe kun je beter in balans blijven?',
                  'Welke beweging helpt je het meest?'
                ],
                resources: [
                  'Yoga for INFJ Guide',
                  'Energetic Balance Exercises',
                  'Physical Vitality Workbook',
                  'Movement Integration Manual'
                ]
              },
              completed: false
            },
            {
              id: 'session_6',
              title: 'Het Vijfvoudige Pad - Eenheid: Diepe Verbinding',
              description: 'Versterken van de verbinding tussen lichaam, ziel en geest voor complete integratie.',
              duration: 60,
              type: 'integration',
              content: {
                instructions: 'Versterk de verbinding tussen lichaam, ziel en geest voor complete integratie.',
                exercises: [
                  'Meditatieve bewegingen',
                  'Introspectie en zelfreflectie',
                  'Archetypische visualisatie',
                  'Spirituele integratie oefeningen'
                ],
                questions: [
                  'Hoe voel je de verbinding tussen lichaam en geest?',
                  'Wat betekent spiritualiteit voor jou?',
                  'Hoe kun je diepere verbinding ervaren?',
                  'Wat helpt je om geïntegreerd te blijven?'
                ],
                resources: [
                  'Spiritual Integration Guide',
                  'Archetypal Visualization Manual',
                  'Mind-Body Connection Workbook',
                  'Unity Consciousness Exercises'
                ]
              },
              completed: false
            },
            {
              id: 'session_7',
              title: 'Immune-Mediated Psychotherapy',
              description: 'Interventies gericht op ontstekingsgerelateerde mentale klachten en neuro-inflammatie vermindering.',
              duration: 60,
              type: 'integration',
              content: {
                instructions: 'Werk aan het verminderen van neuro-inflammatie en ontstekingsgerelateerde mentale klachten.',
                exercises: [
                  'Anti-inflammatoire voeding adviezen',
                  'Stressmanagement technieken',
                  'Neuro-inflammatie vermindering',
                  'Immune system ondersteuning'
                ],
                questions: [
                  'Hoe beïnvloedt voeding je mentale gezondheid?',
                  'Wat zijn je stress triggers?',
                  'Hoe kun je ontstekingen verminderen?',
                  'Wat ondersteunt je immuunsysteem?'
                ],
                resources: [
                  'Anti-Inflammatory Nutrition Guide',
                  'Neuro-Inflammation Reduction Manual',
                  'Immune System Support Workbook',
                  'Stress Management Techniques'
                ]
              },
              completed: false
            },
            {
              id: 'session_8',
              title: 'Capricorn Archetype Integratie',
              description: 'Integratie van Saturnus als symbool van wijsheid, structuur en geduld voor complete ontwikkeling.',
              duration: 60,
              type: 'integration',
              content: {
                instructions: 'Integreer het Capricorn archetype voor wijsheid, structuur en geduld.',
                exercises: [
                  'Saturnus archetype visualisatie',
                  'Structuur en discipline oefeningen',
                  'Wijsheid en geduld ontwikkeling',
                  'Archetypische integratie technieken'
                ],
                questions: [
                  'Hoe uit je behoefte aan structuur zich?',
                  'Wat betekent wijsheid voor jou?',
                  'Hoe kun je geduld ontwikkelen?',
                  'Welke archetypische invloeden herken je?'
                ],
                resources: [
                  'Capricorn Archetype Guide',
                  'Saturn Integration Manual',
                  'Wisdom Development Workbook',
                  'Archetypal Integration Techniques'
                ]
              },
              completed: false
            }
          ],
          pdfContent: `# ${mbtiType} Therapieprotocol voor The Visionary Structure-Type binnen Psychosomatische Osteopathie 2.3

## Beschrijving
${mbtiType}'s vertonen introspectie, empathie en idealisme met discipline, doorzettingsvermogen en een sterke behoefte aan structuur. Hun gevoeligheid voor perfectionisme en overprikkeling vraagt om een holistische aanpak die zowel emotionele integratie als fysieke stabiliteit ondersteunt.

## Doel van het Programma
1. Verbeteren van emotionele regulatie door parasympathische activatie
2. Verminderen van neuro-inflammatie door stressmanagement en voeding
3. Versterken van lichaamsbewustzijn en structurele stabiliteit
4. Ontwikkelen van duurzame veerkracht via cognitieve en somatische integratie
5. Stimuleren van persoonlijke groei door archetypische integratie

## Het Vijfvoudige Pad (Hoofdonderdeel)

### 1. Schoonheid: Somatische Gewaarwording en Ontspanning
- Lichaamsbewustzijn vergroten en fysieke spanning verminderen
- Technieken: Body scan, grounding en ademhalingsoefeningen

### 2. Wijsheid: Gerichte Ademhaling en Mentale Helderheid
- Stressregulatie en bevordering van mentale focus
- Technieken: Diaphragmatic breathing en ritmische ademhaling

### 3. Het Goede: Emotionele Resonantie en Transformatie
- Emotionele blokkades doorbreken en innerlijke harmonie herstellen
- Technieken: Visualisatie, narratieve therapie en actieve imaginatie

### 4. Energie: Intentioneel Bewegen en Fysieke Vitaliteit
- Lichaamsbeweging als middel voor energetische balans
- Technieken: Yoga, stretching en lichte krachttraining

### 5. Eenheid: Diepe Verbinding tussen Lichaam, Ziel en Geest
- Versterken van de verbinding tussen psyche en lichaam
- Technieken: Meditatieve bewegingen, introspectie en zelfreflectie

## Specifieke Aanvullende Literatuur voor ${mbtiType}
- The Inflamed Mind – Edward Bullmore
- Molecules of Emotion – Candace Pert
- The Body Keeps the Score – Bessel van der Kolk
- Astrology and the MBTI – Verbinding tussen archetypen en persoonlijkheid
- Quiet: The Power of Introverts in a World That Can't Stop Talking – Susan Cain

## Thuisoefeningen en Zelfzorg
- Dagelijkse ademhalingsoefeningen (5-10 min)
- Progressieve spierontspanning en mindful bewegen
- Wekelijkse journaling en archetypische visualisatie

## Monitoring en Follow-Up
- Tijdspad: 8 weken met wekelijkse sessies, gevolgd door een follow-up na 6 weken
- Evaluatie: Voortgang meten via zelfrapportage, hormoonprofielen en METx vragenlijsten`,
          metadata: {
            createdBy: 'MET2.4 AI Coach',
            lastUpdated: new Date().toISOString(),
            version: '1.0',
            tags: ['MBTI', 'INFJ', 'Psychosomatic Osteopathy', 'Fivefold Path', 'Capricorn Archetype']
          }
        },
        {
          id: 'intj_stress_management',
          name: `${mbtiType} Stress Management & Recovery`,
          description: `Specifiek programma voor ${mbtiType} om stress te beheren en veerkracht te ontwikkelen`,
          mbtiType: mbtiType,
          duration: 360, // 6 hours total
          difficulty: 'beginner',
          status: 'available',
          progress: 0,
          sessions: [
            {
              id: 'stress_session_1',
              title: 'Stress Patronen Identificatie',
              description: 'Identificeer je unieke stress patronen en triggers',
              duration: 45,
              type: 'assessment',
              content: {
                instructions: 'In deze sessie ga je je stress patronen verkennen.',
                exercises: [
                  'Stress trigger identificatie',
                  'Patroon analyse',
                  'Persoonlijke stress profiel'
                ],
                questions: [
                  'Wat zijn je grootste stress triggers?',
                  'Hoe reageer je op stress?',
                  'Wat zijn je coping mechanismen?'
                ],
                resources: [
                  'Stress Pattern Worksheet',
                  'Trigger Identification Guide',
                  'Coping Strategy List'
                ]
              },
              completed: false
            },
            {
              id: 'stress_session_2',
              title: 'Veerkracht Ontwikkeling',
              description: 'Ontwikkel veerkracht en herstelvermogen',
              duration: 45,
              type: 'exercise',
              content: {
                instructions: 'Focus op het ontwikkelen van veerkracht.',
                exercises: [
                  'Veerkracht assessment',
                  'Herstel strategieën',
                  'Preventieve maatregelen'
                ],
                questions: [
                  'Hoe veerkrachtig ben je?',
                  'Wat helpt je herstellen?',
                  'Hoe kun je veerkracht ontwikkelen?'
                ],
                resources: [
                  'Resilience Building Guide',
                  'Recovery Strategies',
                  'Prevention Techniques'
                ]
              },
              completed: false
            }
          ],
          pdfContent: `# ${mbtiType} Stress Management & Recovery Programma

## Overzicht
Dit programma helpt ${mbtiType} types om stress te beheren en veerkracht te ontwikkelen.

## Sessie 1: Stress Patronen Identificatie
- Duur: 45 minuten
- Type: Assessment
- Focus: Identificeer stress patronen

## Sessie 2: Veerkracht Ontwikkeling
- Duur: 45 minuten
- Type: Exercise
- Focus: Ontwikkel veerkracht

## Resultaten
Na voltooiing zul je:
- Je stress patronen beter begrijpen
- Effectieve coping strategieën hebben
- Meer veerkracht hebben ontwikkeld`,
          metadata: {
            createdBy: 'MET2.4 AI Coach',
            lastUpdated: new Date().toISOString(),
            version: '1.0',
            tags: ['MBTI', 'Stress Management', 'Resilience', mbtiType]
          }
        }
      ];

      setPrograms(mockPrograms);
      
      logger.info('Therapy programs loaded', { 
        count: mockPrograms.length,
        mbtiType 
      });
    } catch (error) {
      logger.error('Failed to load therapy programs', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      // Mock progress - later replace with WatermelonDB
      const mockProgress: UserProgress[] = [
        {
          programId: 'intj_cognitive_development',
          currentSession: 0,
          completedSessions: 0,
          totalSessions: 5,
          startDate: new Date(),
          lastAccessed: new Date(),
          achievements: [],
          notes: ''
        },
        {
          programId: 'intj_stress_management',
          currentSession: 0,
          completedSessions: 0,
          totalSessions: 2,
          startDate: new Date(),
          lastAccessed: new Date(),
          achievements: [],
          notes: ''
        }
      ];

      setUserProgress(mockProgress);
    } catch (error) {
      logger.error('Failed to load user progress', { 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  };

  const handleProgramClick = (program: TherapyProgram) => {
    setSelectedProgram(program);
    setModalOpen(true);
    setCurrentSessionIndex(0);
    
    logger.info('Therapy program selected', { 
      programId: program.id,
      mbtiType 
    });
  };

  const handleStartProgram = async (program: TherapyProgram) => {
    try {
      // TODO: Implement actual program start logic
      // This would integrate with WatermelonDB and PostgreSQL
      
      logger.info('Starting therapy program', { 
        programId: program.id,
        mbtiType 
      });
      
      // For now, just show success message
      alert(`🚀 Starting ${program.name} for ${mbtiType}!`);
      
      setModalOpen(false);
    } catch (error) {
      logger.error('Failed to start program', { 
        error: error instanceof Error ? error.message : String(error),
        programId: program.id 
      });
    }
  };

  const handleDownloadPDF = async (program: TherapyProgram) => {
    try {
      // Create PDF content
      const pdfContent = program.pdfContent;
      
      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${program.name.replace(/\s+/g, '_')}_Programma.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      logger.info('PDF downloaded', { 
        programId: program.id,
        mbtiType 
      });
      
      alert(`📄 ${program.name} programma gedownload!`);
    } catch (error) {
      logger.error('Failed to download PDF', { 
        error: error instanceof Error ? error.message : String(error),
        programId: program.id 
      });
    }
  };

  const handleSessionComplete = async (sessionId: string) => {
    try {
      // TODO: Implement session completion logic
      // This would update WatermelonDB and sync with PostgreSQL
      
      logger.info('Session completed', { 
        sessionId,
        programId: selectedProgram?.id,
        mbtiType 
      });
      
      // Determine assessment time point based on session progress
      const timePoint = getAssessmentTimePoint(currentSessionIndex, selectedProgram?.sessions.length || 0);
      setAssessmentTimePoint(timePoint);
      
      // Show progress evaluation modal
      setShowProgressModal(true);
      
    } catch (error) {
      logger.error('Failed to complete session', { 
        error: error instanceof Error ? error.message : String(error),
        sessionId 
      });
    }
  };

  const getAssessmentTimePoint = (currentSession: number, totalSessions: number): string => {
    // T0 = Baseline (onboarding), T1 = Eerste therapiesessie, T2 = Tweede sessie, etc.
    // Doorlopend door alle sessies en follow-ups (6 weken, 3 maanden)
    return `T${currentSession + 1}`; // T1, T2, T3, T4, T5, T6, T7, T8...
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'assessment': return <FileText className="w-5 h-5" />;
      case 'exercise': return <Target className="w-5 h-5" />;
      case 'reflection': return <Brain className="w-5 h-5" />;
      case 'integration': return <TrendingUp className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getSessionColor = (type: string) => {
    switch (type) {
      case 'assessment': return 'primary';
      case 'exercise': return 'secondary';
      case 'reflection': return 'success';
      case 'integration': return 'warning';
      default: return 'default';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'default';
    }
  };

  // Verkorte Wellness-vragenlijst voor progress tracking
  const progressQuestions = [
    {
      id: 'sleep_quality',
      question: 'Hoe regelmatig slaap je voldoende?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zeer onregelmatig', 'Onregelmatig', 'Gemiddeld', 'Regelmatig', 'Zeer regelmatig'] }
    },
    {
      id: 'daytime_fatigue',
      question: 'Hoe vaak heb je last van vermoeidheid overdag?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zeer vaak', 'Vaak', 'Gemiddeld', 'Soms', 'Zelden'] }
    },
    {
      id: 'physical_activity',
      question: 'Hoe vaak beweeg je matig/intensief per week?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zelden', '1-2x', '3-4x', '5-6x', 'Dagelijks'] }
    },
    {
      id: 'emotion_regulation',
      question: 'Hoe goed kun je je emoties reguleren in stress?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zeer slecht', 'Slecht', 'Gemiddeld', 'Goed', 'Zeer goed'] }
    },
    {
      id: 'meaning_experience',
      question: 'Hoe vaak ervaar je zingeving in dagelijkse activiteiten?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zelden', 'Soms', 'Gemiddeld', 'Vaak', 'Zeer vaak'] }
    },
    {
      id: 'social_support',
      question: 'Hoeveel sociale steun ervaar je?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zeer weinig', 'Weinig', 'Gemiddeld', 'Veel', 'Zeer veel'] }
    },
    {
      id: 'physical_symptoms',
      question: 'Hoe vaak ervaar je lichamelijke klachten die functioneren beïnvloeden?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zeer vaak', 'Vaak', 'Gemiddeld', 'Soms', 'Zelden'] }
    },
    {
      id: 'goal_directed_action',
      question: 'Hoe vaak handel je doelgericht?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zelden', 'Soms', 'Gemiddeld', 'Vaak', 'Zeer vaak'] }
    },
    {
      id: 'self_compassion',
      question: 'Hoe vaak ben je vriendelijk voor jezelf bij tegenslag?',
      type: 'likert',
      scale: { min: 1, max: 5, labels: ['Zelden', 'Soms', 'Gemiddeld', 'Vaak', 'Zeer vaak'] }
    },
    {
      id: 'stress_level',
      question: 'Hoe hoog is je ervaren stressniveau?',
      type: 'slider',
      scale: { min: 0, max: 10, labels: ['Geen stress', 'Extreme stress'] }
    }
  ];

  const handleProgressAnswer = (questionId: string, answer: string) => {
    setProgressAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateWellnessScores = (answers: {[key: string]: string}) => {
    const scores = {
      energy_index: 0,
      stress_index: 0,
      social_support_score: 0,
      self_compassion_score: 0
    };

    // Energy Index (sleep, fatigue, physical activity)
    const sleepScore = parseInt(answers.sleep_quality || '3');
    const fatigueScore = 6 - parseInt(answers.daytime_fatigue || '3'); // Inverted
    const activityScore = parseInt(answers.physical_activity || '3');
    scores.energy_index = Math.round((sleepScore + fatigueScore + activityScore) / 3 * 20); // Scale to 0-100

    // Stress Index (stress level, emotion regulation, physical symptoms)
    const stressScore = parseInt(answers.stress_level || '5');
    const emotionScore = parseInt(answers.emotion_regulation || '3');
    const symptomsScore = 6 - parseInt(answers.physical_symptoms || '3'); // Inverted
    scores.stress_index = Math.round((stressScore + (6 - emotionScore) + symptomsScore) / 3 * 10); // Scale to 0-100

    // Social Support Score
    scores.social_support_score = Math.round(parseInt(answers.social_support || '3') * 20); // Scale to 0-100

    // Self Compassion Score (self compassion, goal directed action, meaning)
    const compassionScore = parseInt(answers.self_compassion || '3');
    const goalScore = parseInt(answers.goal_directed_action || '3');
    const meaningScore = parseInt(answers.meaning_experience || '3');
    scores.self_compassion_score = Math.round((compassionScore + goalScore + meaningScore) / 3 * 20); // Scale to 0-100

    return scores;
  };

  const getWellnessTip = (scores: any) => {
    if (scores.energy_index < 40) {
      return "💤 Focus op betere slaapkwaliteit en regelmatige beweging voor meer energie.";
    } else if (scores.stress_index > 70) {
      return "🧘 Probeer stressmanagement technieken en emotieregulatie oefeningen.";
    } else if (scores.social_support_score < 40) {
      return "🤝 Investeer in sociale verbindingen en steun van anderen.";
    } else if (scores.self_compassion_score < 40) {
      return "💝 Wees vriendelijker voor jezelf en zoek meer zingeving in dagelijkse activiteiten.";
    } else {
      return "🌟 Uitstekend! Je wellness scores zijn goed in balans. Blijf zo doorgaan!";
    }
  };

  const handleProgressSubmit = async () => {
    try {
      // Calculate wellness scores
      const scores = calculateWellnessScores(progressAnswers);
      const tip = getWellnessTip(scores);
      
      logger.info('Wellness assessment completed', { 
        sessionId: selectedProgram?.sessions[currentSessionIndex]?.id,
        programId: selectedProgram?.id,
        timePoint: assessmentTimePoint,
        scores,
        mbtiType 
      });
      
      // TODO: Save to WatermelonDB wellness_assessments table
      // TODO: Encrypt raw answers and store scores_json
      // TODO: analytics.track('onboarding_wellness_assessment_completed', {scores})
      
      // Show success with scores and tip
      alert(`✅ Wellness evaluatie ${assessmentTimePoint} voltooid!\n\n📊 Scores:\n• Energie: ${scores.energy_index}/100\n• Stress: ${scores.stress_index}/100\n• Sociale Steun: ${scores.social_support_score}/100\n• Zelfcompassie: ${scores.self_compassion_score}/100\n\n${tip}`);
      
      setShowProgressModal(false);
      setProgressAnswers({});
      
      // Move to next session
      if (selectedProgram && currentSessionIndex < selectedProgram.sessions.length - 1) {
        setCurrentSessionIndex(currentSessionIndex + 1);
      } else {
        // Program completed
        alert(`🎉 Gefeliciteerd! Je hebt het ${selectedProgram?.name} programma voltooid!`);
        setModalOpen(false);
      }
      
    } catch (error) {
      logger.error('Failed to submit wellness assessment', { 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spinner size="lg" label="Loading therapy programs..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Individuele Therapieprogramma's
        </h1>
        <p className="text-gray-600">
          Gepersonaliseerde programma's speciaal ontworpen voor {mbtiType} ontwikkeling
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((program) => {
          const progress = userProgress.find(p => p.programId === program.id);
          const progressPercentage = progress ? (progress.completedSessions / progress.totalSessions) * 100 : 0;
          
          return (
            <Card
              key={program.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleProgramClick(program)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                    <p className="text-sm text-gray-600">{program.description}</p>
                  </div>
                  <Chip 
                    color={getDifficultyColor(program.difficulty)} 
                    size="sm" 
                    variant="flat"
                  >
                    {program.difficulty}
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="space-y-3">
                  {/* Progress */}
                  {progress && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{progress.completedSessions}/{progress.totalSessions} sessies</span>
                      </div>
                      <Progress 
                        value={progressPercentage} 
                        color="primary" 
                        size="sm"
                        className="mb-2"
                      />
                    </div>
                  )}

                  {/* Duration & Sessions */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{program.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{program.sessions.length} sessies</span>
                    </div>
                  </div>

                  {/* MBTI Specific */}
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <Brain className="w-4 h-4" />
                    <span>{mbtiType} optimized</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Program Detail Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        size="5xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold">{selectedProgram?.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{selectedProgram?.description}</p>
              </ModalHeader>
              <ModalBody>
                {selectedProgram && (
                  <div className="space-y-6">
                    {/* Program Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Duur: {selectedProgram.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{selectedProgram.sessions.length} sessies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{mbtiType} optimized</span>
                      </div>
                      <Chip 
                        color={getDifficultyColor(selectedProgram.difficulty)} 
                        size="sm" 
                        variant="flat"
                      >
                        {selectedProgram.difficulty}
                      </Chip>
                    </div>

                    {/* Sessions Tabs */}
                    <Tabs 
                      selectedKey={currentSessionIndex.toString()}
                      onSelectionChange={(key) => setCurrentSessionIndex(parseInt(key as string))}
                      className="w-full"
                    >
                      {selectedProgram.sessions.map((session, index) => (
                        <Tab 
                          key={index.toString()}
                          title={
                            <div className="flex items-center gap-2">
                              {getSessionIcon(session.type)}
                              <span className="text-sm">{session.title}</span>
                              {session.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                            </div>
                          }
                        >
                          <div className="space-y-4">
                            {/* Session Header */}
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-lg font-semibold">{session.title}</h4>
                                <p className="text-sm text-gray-600">{session.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{session.duration} min</span>
                                <Chip 
                                  color={getSessionColor(session.type)} 
                                  size="sm" 
                                  variant="flat"
                                >
                                  {session.type}
                                </Chip>
                              </div>
                            </div>

                            {/* Session Content */}
                            <div className="space-y-4">
                              {/* Instructions */}
                              <div>
                                <h5 className="font-semibold mb-2">Instructies:</h5>
                                <p className="text-sm text-gray-700">{session.content.instructions}</p>
                              </div>

                              {/* Exercises */}
                              <div>
                                <h5 className="font-semibold mb-2">Oefeningen:</h5>
                                <ul className="space-y-1">
                                  {session.content.exercises.map((exercise, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{exercise}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Questions */}
                              <div>
                                <h5 className="font-semibold mb-2">Reflectie Vragen:</h5>
                                <ul className="space-y-1">
                                  {session.content.questions.map((question, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <MessageCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span>{question}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Resources */}
                              <div>
                                <h5 className="font-semibold mb-2">Bronnen:</h5>
                                <ul className="space-y-1">
                                  {session.content.resources.map((resource, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <BookOpen className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                      <span>{resource}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Notes */}
                              <div>
                                <h5 className="font-semibold mb-2">Notities:</h5>
                                <textarea
                                  value={sessionNotes}
                                  onChange={(e) => setSessionNotes(e.target.value)}
                                  placeholder="Voeg je notities toe..."
                                  className="w-full p-3 border rounded-lg text-sm"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                      ))}
                    </Tabs>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Sluiten
                </Button>
                <Button 
                  color="secondary" 
                  variant="light"
                  onPress={() => selectedProgram && handleDownloadPDF(selectedProgram)}
                  startContent={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
                <Button 
                  color="primary" 
                  onPress={() => selectedProgram && handleStartProgram(selectedProgram)}
                  startContent={<Play className="w-4 h-4" />}
                >
                  Start Programma
                </Button>
                <Button 
                  color="success" 
                  onPress={() => selectedProgram && handleSessionComplete(selectedProgram.sessions[currentSessionIndex].id)}
                  startContent={<CheckCircle className="w-4 h-4" />}
                >
                  Voltooi Sessie
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Progress Evaluation Modal */}
      <Modal 
        isOpen={showProgressModal} 
        onClose={() => setShowProgressModal(false)}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-bold">Verkorte Wellness-Vragenlijst {assessmentTimePoint}</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Deze vragen helpen je energie, slaap, coping en zingeving in kaart te brengen. Duurt ~3–4 minuten.
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  📊 T0 = Baseline (onboarding) • {assessmentTimePoint} = Huidige evaluatie
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {progressQuestions.map((question, index) => (
                    <div key={question.id} className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        {index + 1}. {question.question}
                      </h4>
                      
                      {question.type === 'likert' ? (
                        <div className="space-y-2">
                          {Array.from({ length: question.scale.max - question.scale.min + 1 }, (_, i) => {
                            const value = question.scale.min + i;
                            const label = question.scale.labels[i];
                            return (
                              <label
                                key={value}
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  progressAnswers[question.id] === value.toString()
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  value={value.toString()}
                                  checked={progressAnswers[question.id] === value.toString()}
                                  onChange={(e) => handleProgressAnswer(question.id, e.target.value)}
                                  className="mt-1"
                                />
                                <span className="text-sm text-gray-700">{value}. {label}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : question.type === 'slider' ? (
                        <div className="space-y-3">
                          <input
                            type="range"
                            min={question.scale.min}
                            max={question.scale.max}
                            value={progressAnswers[question.id] || question.scale.min}
                            onChange={(e) => handleProgressAnswer(question.id, e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{question.scale.labels[0]}</span>
                            <span className="font-semibold text-blue-600">
                              {progressAnswers[question.id] || question.scale.min}
                            </span>
                            <span>{question.scale.labels[1]}</span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                  
                  {/* Progress Summary */}
                  {Object.keys(progressAnswers).length === progressQuestions.length && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">Wellness Evaluatie Voltooid!</h5>
                      <p className="text-green-800">
                        Alle 10 vragen zijn beantwoord. Klik op "Resultaat bekijken" om je scores te zien.
                      </p>
                    </div>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Overslaan
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleProgressSubmit}
                  isDisabled={Object.keys(progressAnswers).length !== progressQuestions.length}
                  startContent={<CheckCircle className="w-4 h-4" />}
                >
                  Resultaat bekijken
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default IndividualTherapyPrograms;

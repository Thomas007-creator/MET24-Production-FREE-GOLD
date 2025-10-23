/**
 * Active Imagination & Journaling Interface
 * Priority #3 Feature: Introspection & Creative Expression
 * 
 * Features:
 * - MBTI-optimized journaling interface
 * - Guided active imagination sessions
 * - Pattern recognition dashboard
 * - Creative expression tools
 * - Emotional safety monitoring
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Textarea,
  Input,
  Select,
  SelectItem,
  Chip,
  Progress,
  Badge,
  Tabs,
  Tab,
  Divider,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import {
  PenTool,
  Brain,
  Sparkles,
  Play,
  Pause,
  Square,
  Eye,
  Heart,
  Lightbulb,
  TrendingUp,
  Calendar,
  Tag,
  BookOpen,
  Feather,
  Stars,
  Target,
  Clock,
  Save,
  Download,
  Settings
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { activeImaginationChatLLMService, MBTI_JOURNALING_TECHNIQUES, MBTI_IMAGINATION_TECHNIQUES } from '../services/activeImaginationChatLLM';

// Types
interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  date: string;
  entryType: 'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise';
  mbtiTechnique: string;
  insights: string[];
  patterns: string[];
}

interface ImaginationSession {
  id: string;
  type: 'guided' | 'free-form' | 'mbti-specific';
  prompt: string;
  responses: Array<{
    timestamp: Date;
    content: string;
    guidance?: string;
  }>;
  duration: number;
  status: 'active' | 'paused' | 'completed';
  creativityScore: number;
  insights: string[];
}

interface PatternInsight {
  type: 'emotional' | 'behavioral' | 'creative' | 'growth';
  description: string;
  frequency: number;
  timeframe: string;
  actionable: string[];
}

const ActiveImaginationInterface: React.FC = () => {
  const { userData } = useAppStore();
  const [activeTab, setActiveTab] = useState('journaling');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Journaling State
  const [journalContent, setJournalContent] = useState('');
  const [journalTitle, setJournalTitle] = useState('');
  const [journalMood, setJournalMood] = useState(3);
  const [journalTags, setJournalTags] = useState<string[]>([]);
  const [entryType, setEntryType] = useState<'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise'>('free-form');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  // Active Imagination State
  const [currentSession, setCurrentSession] = useState<ImaginationSession | null>(null);
  const [sessionResponse, setSessionResponse] = useState('');
  const [imaginationType, setImaginationType] = useState<'guided' | 'free-form' | 'mbti-specific'>('guided');
  
  // Pattern Recognition State
  const [patterns, setPatterns] = useState<PatternInsight[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  
  // Modals
  const { isOpen: isSessionModalOpen, onOpen: onSessionModalOpen, onOpenChange: onSessionModalOpenChange } = useDisclosure();
  const { isOpen: isPatternsModalOpen, onOpen: onPatternsModalOpen, onOpenChange: onPatternsModalOpenChange } = useDisclosure();
  
  // Get MBTI-specific techniques
  const mbtiType = userData?.mbtiType || 'INFP';
  const mbtiPreferences = mbtiType ? {
    energy: mbtiType[0] as 'E' | 'I',
    information: mbtiType[1] as 'S' | 'N',
    decision: mbtiType[2] as 'T' | 'F',
    lifestyle: mbtiType[3] as 'J' | 'P'
  } : null;
  
  const mbtiTechniques = mbtiPreferences ? [
    MBTI_JOURNALING_TECHNIQUES[mbtiPreferences.energy.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES],
    MBTI_JOURNALING_TECHNIQUES[mbtiPreferences.information.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES],
    MBTI_JOURNALING_TECHNIQUES[mbtiPreferences.decision.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES],
    MBTI_JOURNALING_TECHNIQUES[mbtiPreferences.lifestyle.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES]
  ].filter(Boolean) : [];
  
  const imaginationTechnique = MBTI_IMAGINATION_TECHNIQUES[mbtiType as keyof typeof MBTI_IMAGINATION_TECHNIQUES];
  
  // Effects
  useEffect(() => {
    loadJournalEntries();
    loadPatterns();
  }, []);
  
  // ============================================================================
  // JOURNALING METHODS
  // ============================================================================
  
  const loadJournalEntries = async () => {
    // Mock data for now - replace with actual database query
    setJournalEntries([
      {
        id: '1',
        title: 'Reflectie op Persoonlijke Waarden',
        content: 'Vandaag dacht ik na over wat echt belangrijk voor me is. Authenticiteit staat bovenaan mijn lijst...',
        mood: 4,
        tags: ['waarden', 'authenticiteit', 'zelfreflectie'],
        date: new Date().toISOString().split('T')[0],
        entryType: 'mbti-exercise',
        mbtiTechnique: 'waarden-exploratie',
        insights: ['Sterke focus op authenticiteit', 'Behoefte aan autonomie'],
        patterns: ['Waardenconflict', 'Emotionele verwerking']
      },
      {
        id: '2',
        title: 'Creatieve Doorbraak',
        content: 'Tijdens mijn actieve imaginatie sessie kwam er een interessant beeld naar boven...',
        mood: 5,
        tags: ['creativiteit', 'imaginatie', 'doorbraak'],
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        entryType: 'active-imagination',
        mbtiTechnique: 'creatieve-exploratie',
        insights: ['Verhoogde creatieve expressie', 'Emotionele vrijheid'],
        patterns: ['Creatieve groei', 'Symbolische thinking']
      }
    ]);
  };
  
  const loadPatterns = async () => {
    if (!userData?.id) return;
    
    try {
      setIsAnalyzing(true);
      const recognizedPatterns = await activeImaginationChatLLMService.recognizePatterns(
        userData.id,
        timeframe
      );
      
      // Convert to interface format
      const formattedPatterns: PatternInsight[] = recognizedPatterns.map(pattern => ({
        type: pattern.type as any,
        description: pattern.description,
        frequency: pattern.frequency,
        timeframe: pattern.timeframe,
        actionable: ['Reflecteer op triggers', 'Ontwikkel coping strategieën']
      }));
      
      setPatterns(formattedPatterns);
    } catch (error) {
      console.error('Error loading patterns:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleCreateJournalEntry = async () => {
    if (!journalContent.trim() || !userData?.id) return;
    
    try {
      setIsAnalyzing(true);
      
      const newEntry = await activeImaginationChatLLMService.createJournalEntry(
        userData.id,
        journalContent,
        mbtiType,
        entryType
      );
      
      // Convert to interface format
      const formattedEntry: JournalEntry = {
        id: newEntry.id,
        title: journalTitle || newEntry.title,
        content: newEntry.content,
        mood: journalMood,
        tags: journalTags,
        date: newEntry.createdAt.toISOString().split('T')[0],
        entryType: newEntry.entryType,
        mbtiTechnique: newEntry.mbtiTechnique,
        insights: [],
        patterns: []
      };
      
      setJournalEntries(prev => [formattedEntry, ...prev]);
      
      // Reset form
      setJournalContent('');
      setJournalTitle('');
      setJournalMood(3);
      setJournalTags([]);
      
    } catch (error) {
      console.error('Error creating journal entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleAnalyzeEntry = async (entry: JournalEntry) => {
    if (!userData?.id) return;
    
    try {
      setIsAnalyzing(true);
      
      const insights = await activeImaginationChatLLMService.analyzeJournalEntry(
        entry.id,
        entry.content,
        mbtiType
      );
      
      // Update entry with insights
      setJournalEntries(prev => prev.map(e => 
        e.id === entry.id 
          ? { ...e, insights: insights.map(i => i.description) }
          : e
      ));
      
    } catch (error) {
      console.error('Error analyzing entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // ============================================================================
  // ACTIVE IMAGINATION METHODS
  // ============================================================================
  
  const handleStartImaginationSession = async () => {
    if (!userData?.id) return;
    
    try {
      const session = await activeImaginationChatLLMService.startImaginationSession(
        userData.id,
        mbtiType,
        imaginationType
      );
      
      setCurrentSession({
        id: session.id,
        type: session.sessionType,
        prompt: session.prompt,
        responses: [],
        duration: 0,
        status: 'active',
        creativityScore: 0,
        insights: []
      });
      
      onSessionModalOpen();
      
    } catch (error) {
      console.error('Error starting imagination session:', error);
    }
  };
  
  const handleSessionResponse = async () => {
    if (!currentSession || !sessionResponse.trim()) return;
    
    try {
      const guidance = await activeImaginationChatLLMService.processImaginationResponse(
        currentSession.id,
        sessionResponse,
        mbtiType
      );
      
      setCurrentSession(prev => prev ? {
        ...prev,
        responses: [...prev.responses, {
          timestamp: new Date(),
          content: sessionResponse,
          guidance: guidance.guidance
        }]
      } : null);
      
      setSessionResponse('');
      
    } catch (error) {
      console.error('Error processing session response:', error);
    }
  };
  
  const handleCompleteSession = async () => {
    if (!currentSession) return;
    
    try {
      const insights = await activeImaginationChatLLMService.completeImaginationSession(
        currentSession.id,
        mbtiType
      );
      
      setCurrentSession(prev => prev ? {
        ...prev,
        status: 'completed',
        insights: insights.map(i => i.description)
      } : null);
      
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  const renderMoodIndicator = (mood: number) => {
    const moodColors = ['red', 'orange', 'yellow', 'green', 'blue'];
    const moodLabels = ['Zeer laag', 'Laag', 'Neutraal', 'Goed', 'Uitstekend'];
    
    return (
      <Chip 
        color={moodColors[mood - 1] as any} 
        variant="flat" 
        size="sm"
      >
        {moodLabels[mood - 1]}
      </Chip>
    );
  };
  
  const renderMBTITechniques = () => {
    if (!mbtiTechniques.length) return null;
    
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <CardBody className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-800">
              {mbtiType} Journaling Technieken
            </h4>
          </div>
          
          <div className="space-y-2">
            {mbtiTechniques.map((technique, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium text-blue-700 mb-1">
                  {technique?.chatLLMFocus}
                </div>
                <div className="flex flex-wrap gap-1">
                  {technique?.techniques?.map((t: string, i: number) => (
                    <Chip key={i} size="sm" variant="flat" color="primary">
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  };
  
  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Feather className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Active Imagination & Journaling
                  </h1>
                  <p className="text-white/70">
                    Introspection & Creativiteit - {mbtiType} Geoptimaliseerd
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge content={journalEntries.length} color="primary">
                  <Button
                    variant="flat"
                    className="bg-white/20 text-white"
                    startContent={<BookOpen className="w-4 h-4" />}
                  >
                    Entries
                  </Button>
                </Badge>
                
                <Button
                  color="secondary"
                  variant="flat"
                  startContent={<TrendingUp className="w-4 h-4" />}
                  onPress={onPatternsModalOpen}
                >
                  Patronen
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* MBTI Techniques Overview */}
        {renderMBTITechniques()}
        
        <Spacer y={6} />
        
        {/* Main Interface */}
        <Tabs 
          selectedKey={activeTab} 
          onSelectionChange={(key) => setActiveTab(key as string)}
          classNames={{
            tabList: "bg-white/10 backdrop-blur-xl border border-white/20",
            tab: "text-white",
            tabContent: "text-white",
            cursor: "bg-white/20"
          }}
        >
          
          {/* JOURNALING TAB */}
          <Tab 
            key="journaling" 
            title={
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Journaling
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              
              {/* Writing Interface */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between w-full">
                      <h3 className="text-xl font-semibold text-white">
                        Nieuwe Journal Entry
                      </h3>
                      
                      <Select 
                        selectedKeys={[entryType]}
                        onSelectionChange={(keys) => setEntryType(Array.from(keys)[0] as any)}
                        size="sm"
                        className="w-48"
                        classNames={{
                          trigger: "bg-white/20 border-white/30 text-white",
                          value: "text-white"
                        }}
                      >
                        <SelectItem key="free-form" value="free-form">
                          Vrije Vorm
                        </SelectItem>
                        <SelectItem key="structured" value="structured">
                          Gestructureerd
                        </SelectItem>
                        <SelectItem key="active-imagination" value="active-imagination">
                          Actieve Imaginatie
                        </SelectItem>
                        <SelectItem key="mbti-exercise" value="mbti-exercise">
                          MBTI Oefening
                        </SelectItem>
                      </Select>
                    </div>
                  </CardHeader>
                  
                  <CardBody className="space-y-4">
                    <Input
                      placeholder="Titel (optioneel)"
                      value={journalTitle}
                      onValueChange={setJournalTitle}
                      variant="flat"
                      classNames={{
                        input: "text-white placeholder:text-white/50",
                        inputWrapper: "bg-white/20 border-white/30"
                      }}
                    />
                    
                    <Textarea
                      placeholder="Begin met schrijven... Laat je gedachten vrij stromen."
                      value={journalContent}
                      onValueChange={setJournalContent}
                      minRows={8}
                      variant="flat"
                      classNames={{
                        input: "text-white placeholder:text-white/50",
                        inputWrapper: "bg-white/20 border-white/30"
                      }}
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-white/70" />
                          <span className="text-white/70 text-sm">Stemming:</span>
                          <Select
                            selectedKeys={[journalMood.toString()]}
                            onSelectionChange={(keys) => setJournalMood(parseInt(Array.from(keys)[0] as string))}
                            size="sm"
                            className="w-32"
                            classNames={{
                              trigger: "bg-white/20 border-white/30 text-white",
                              value: "text-white"
                            }}
                          >
                            <SelectItem key="1" value="1">😢 Zeer laag</SelectItem>
                            <SelectItem key="2" value="2">😔 Laag</SelectItem>
                            <SelectItem key="3" value="3">😐 Neutraal</SelectItem>
                            <SelectItem key="4" value="4">😊 Goed</SelectItem>
                            <SelectItem key="5" value="5">😄 Uitstekend</SelectItem>
                          </Select>
                        </div>
                        
                        <div className="text-white/50 text-sm">
                          {journalContent.split(' ').filter(word => word.length > 0).length} woorden
                        </div>
                      </div>
                      
                      <Button
                        color="primary"
                        startContent={<Save className="w-4 h-4" />}
                        onPress={handleCreateJournalEntry}
                        isLoading={isAnalyzing}
                        isDisabled={!journalContent.trim()}
                      >
                        Opslaan & Analyseren
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
              
              {/* Journal Entries List */}
              <div className="space-y-4">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-white">
                      Recente Entries
                    </h3>
                  </CardHeader>
                  
                  <CardBody className="space-y-3 max-h-96 overflow-y-auto">
                    {journalEntries.map((entry) => (
                      <Card 
                        key={entry.id}
                        isPressable
                        onPress={() => setSelectedEntry(entry)}
                        className="bg-white/20 border border-white/30 hover:bg-white/30 transition-colors"
                      >
                        <CardBody className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-white text-sm line-clamp-1">
                              {entry.title}
                            </h4>
                            {renderMoodIndicator(entry.mood)}
                          </div>
                          
                          <p className="text-white/70 text-xs line-clamp-2 mb-2">
                            {entry.content}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {entry.tags.slice(0, 2).map((tag) => (
                                <Chip key={tag} size="sm" variant="flat" className="text-xs">
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                            
                            <div className="text-white/50 text-xs">
                              {entry.date}
                            </div>
                          </div>
                          
                          {entry.insights.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                              <div className="flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-yellow-400">
                                  {entry.insights.length} insights
                                </span>
                              </div>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </CardBody>
                </Card>
              </div>
            </div>
          </Tab>
          
          {/* ACTIVE IMAGINATION TAB */}
          <Tab 
            key="imagination" 
            title={
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Actieve Imaginatie
              </div>
            }
          >
            <div className="mt-6 space-y-6">
              
              {/* Imagination Technique Info */}
              {imaginationTechnique && (
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                  <CardBody className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Stars className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">
                        {mbtiType} Imaginatie Focus: {imaginationTechnique.primaryFocus}
                      </h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-purple-700 mb-2">Technieken:</h5>
                        <div className="flex flex-wrap gap-1">
                          {imaginationTechnique.techniques.map((technique, index) => (
                            <Chip key={index} size="sm" variant="flat" color="secondary">
                              {technique}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-purple-700 mb-2">Veiligheidsaspecten:</h5>
                        <div className="text-sm text-purple-600">
                          {imaginationTechnique.safetyConsiderations.join(', ')}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
              
              {/* Session Controls */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-semibold text-white">
                      Imaginatie Sessie
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        selectedKeys={[imaginationType]}
                        onSelectionChange={(keys) => setImaginationType(Array.from(keys)[0] as any)}
                        size="sm"
                        className="w-40"
                        classNames={{
                          trigger: "bg-white/20 border-white/30 text-white",
                          value: "text-white"
                        }}
                      >
                        <SelectItem key="guided" value="guided">
                          Begeleide Sessie
                        </SelectItem>
                        <SelectItem key="free-form" value="free-form">
                          Vrije Vorm
                        </SelectItem>
                        <SelectItem key="mbti-specific" value="mbti-specific">
                          {mbtiType} Specifiek
                        </SelectItem>
                      </Select>
                      
                      <Button
                        color="secondary"
                        startContent={<Play className="w-4 h-4" />}
                        onPress={handleStartImaginationSession}
                        isDisabled={currentSession?.status === 'active'}
                      >
                        Start Sessie
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {currentSession && (
                  <CardBody>
                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm">
                          Sessie Type: {currentSession.type}
                        </span>
                        <Badge 
                          color={currentSession.status === 'active' ? 'success' : 'default'}
                          variant="flat"
                        >
                          {currentSession.status}
                        </Badge>
                      </div>
                      
                      <p className="text-white text-sm">
                        {currentSession.prompt}
                      </p>
                    </div>
                    
                    {currentSession.responses.map((response, index) => (
                      <div key={index} className="mb-4 space-y-2">
                        <Card className="bg-blue-500/20 border border-blue-400/30">
                          <CardBody className="p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-blue-300 text-xs">
                                {response.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-white text-sm">{response.content}</p>
                          </CardBody>
                        </Card>
                        
                        {response.guidance && (
                          <Card className="bg-purple-500/20 border border-purple-400/30">
                            <CardBody className="p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <Brain className="w-3 h-3 text-purple-400" />
                                <span className="text-purple-300 text-xs">AI Begeleiding</span>
                              </div>
                              <p className="text-white text-sm">{response.guidance}</p>
                            </CardBody>
                          </Card>
                        )}
                      </div>
                    ))}
                    
                    {currentSession.status === 'active' && (
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Beschrijf wat er in je gedachten opkomt..."
                          value={sessionResponse}
                          onValueChange={setSessionResponse}
                          minRows={4}
                          variant="flat"
                          classNames={{
                            input: "text-white placeholder:text-white/50",
                            inputWrapper: "bg-white/20 border-white/30"
                          }}
                        />
                        
                        <div className="flex items-center justify-between">
                          <Button
                            variant="flat"
                            startContent={<Square className="w-4 h-4" />}
                            onPress={handleCompleteSession}
                          >
                            Afronden
                          </Button>
                          
                          <Button
                            color="primary"
                            startContent={<Eye className="w-4 h-4" />}
                            onPress={handleSessionResponse}
                            isDisabled={!sessionResponse.trim()}
                          >
                            Vervolg
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {currentSession.status === 'completed' && currentSession.insights.length > 0 && (
                      <Card className="bg-green-500/20 border border-green-400/30">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-green-400" />
                            <h4 className="text-green-300 font-medium">Sessie Inzichten</h4>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-2">
                            {currentSession.insights.map((insight, index) => (
                              <p key={index} className="text-white text-sm">
                                • {insight}
                              </p>
                            ))}
                          </div>
                        </CardBody>
                      </Card>
                    )}
                  </CardBody>
                )}
              </Card>
            </div>
          </Tab>
          
          {/* PATTERNS TAB */}
          <Tab 
            key="patterns" 
            title={
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Patronen
              </div>
            }
          >
            <div className="mt-6 space-y-6">
              
              {/* Pattern Controls */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-semibold text-white">
                      Patroon Herkenning
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <Select
                        selectedKeys={[timeframe]}
                        onSelectionChange={(keys) => setTimeframe(Array.from(keys)[0] as any)}
                        size="sm"
                        className="w-32"
                        classNames={{
                          trigger: "bg-white/20 border-white/30 text-white",
                          value: "text-white"
                        }}
                      >
                        <SelectItem key="week" value="week">Week</SelectItem>
                        <SelectItem key="month" value="month">Maand</SelectItem>
                        <SelectItem key="quarter" value="quarter">Kwartaal</SelectItem>
                      </Select>
                      
                      <Button
                        color="primary"
                        startContent={<Brain className="w-4 h-4" />}
                        onPress={loadPatterns}
                        isLoading={isAnalyzing}
                      >
                        Analyseer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardBody>
                  {patterns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patterns.map((pattern, index) => (
                        <Card key={index} className="bg-white/20 border border-white/30">
                          <CardBody className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Chip 
                                color={
                                  pattern.type === 'emotional' ? 'danger' :
                                  pattern.type === 'behavioral' ? 'warning' :
                                  pattern.type === 'creative' ? 'secondary' : 'success'
                                }
                                variant="flat"
                                size="sm"
                              >
                                {pattern.type}
                              </Chip>
                              
                              <Badge content={pattern.frequency} color="primary">
                                <TrendingUp className="w-4 h-4 text-white/70" />
                              </Badge>
                            </div>
                            
                            <h4 className="font-medium text-white mb-2">
                              {pattern.description}
                            </h4>
                            
                            <div className="text-white/70 text-sm mb-3">
                              Timeframe: {pattern.timeframe}
                            </div>
                            
                            <div className="space-y-1">
                              <div className="text-xs text-white/50 mb-1">Actionable Steps:</div>
                              {pattern.actionable.map((action, i) => (
                                <div key={i} className="text-xs text-white/70">
                                  • {action}
                                </div>
                              ))}
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-white/70">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Geen patronen gevonden. Voeg meer journal entries toe voor analyse.</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
        
        {/* Session Modal */}
        <Modal 
          isOpen={isSessionModalOpen} 
          onOpenChange={onSessionModalOpenChange}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Active Imagination Session
                  </div>
                </ModalHeader>
                <ModalBody>
                  {/* Session content would go here */}
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Sessie interface wordt geladen...
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Sluiten
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        
        {/* Patterns Modal */}
        <Modal 
          isOpen={isPatternsModalOpen} 
          onOpenChange={onPatternsModalOpenChange}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Uitgebreide Patroon Analyse
                  </div>
                </ModalHeader>
                <ModalBody>
                  {/* Detailed patterns view would go here */}
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      Uitgebreide patroon visualisatie wordt geladen...
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Sluiten
                  </Button>
                  <Button color="primary" startContent={<Download className="w-4 h-4" />}>
                    Export
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default ActiveImaginationInterface;
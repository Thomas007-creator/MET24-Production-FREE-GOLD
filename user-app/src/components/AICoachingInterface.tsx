/**
 * AI Coaching Interface Component
 * 
 * MBTI-gebaseerde coaching interface met real-time AI responses
 * Integreert met aiCoachingChatLLM service voor personalized coaching
 * 
 * Features:
 * - MBTI type selection
 * - Context-aware coaching
 * - Real-time chat interface
 * - Progress tracking
 * - Session history
 * 
 * @version 1.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Button, Textarea, Select, SelectItem, Chip, Progress, Divider, Avatar } from '@nextui-org/react';
import { Send, Brain, Heart, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import aiCoachingChatLLM, { CoachingResponse, CoachingContext } from '../services/aiCoachingChatLLM';

// Types
interface ChatMessage {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: number;
  insights?: string[];
  actionSuggestions?: string[];
  followUpQuestions?: string[];
  mbtiAlignment?: number;
  confidence?: number;
}

interface CoachingSession {
  id: string;
  messages: ChatMessage[];
  mbtiType: string;
  startTime: number;
  context: CoachingContext;
  effectiveness?: number;
}

const mbtiTypes = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const moodOptions = [
  { value: 1, label: '😫 Zeer slecht', color: 'danger' },
  { value: 2, label: '😞 Slecht', color: 'danger' },
  { value: 3, label: '😐 Neutraal', color: 'warning' },
  { value: 4, label: '😊 Goed', color: 'primary' },
  { value: 5, label: '😄 Zeer goed', color: 'success' }
] as const;

const AICoachingInterface: React.FC = () => {
  const { userData, setUserData } = useAppStore();
  
  // State
  const [currentSession, setCurrentSession] = useState<CoachingSession | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMbtiType, setSelectedMbtiType] = useState(userData?.mbtiType || 'INFP');
  const [currentMood, setCurrentMood] = useState(3);
  const [sessionHistory, setSessionHistory] = useState<CoachingSession[]>([]);
  const [showInsights, setShowInsights] = useState(true);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  useEffect(() => {
    if (userData?.mbtiType) {
      setSelectedMbtiType(userData.mbtiType);
    }
  }, [userData?.mbtiType]);

  // Helper functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Start new coaching session
  const startNewSession = () => {
    const newSession: CoachingSession = {
      id: generateSessionId(),
      messages: [],
      mbtiType: selectedMbtiType,
      startTime: Date.now(),
      context: {
        userId: userData?.id || 'demo_user',
        moodRating: currentMood,
        focusAreas,
        activeGoals: [], // TODO: Load from user data
        wellnessScores: [] // TODO: Load from wellness data
      }
    };

    setCurrentSession(newSession);
    
    // Add welcome message
    const welcomeMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'coach',
      content: getWelcomeMessage(selectedMbtiType),
      timestamp: Date.now(),
      confidence: 1.0,
      mbtiAlignment: 1.0
    };

    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [welcomeMessage]
    } : null);
  };

  const getWelcomeMessage = (mbtiType: string): string => {
    const welcomeMessages: Record<string, string> = {
      'INFP': 'Hallo! Ik ben hier om je te helpen bij je persoonlijke groei. Als INFP waardeer je authenticiteit en persoonlijke betekenis. Waar zou je graag aan willen werken?',
      'INTJ': 'Welkom! Als INTJ ben je waarschijnlijk gefocust op strategische planning en zelfverbetering. Wat is je huidige doel waar ik je mee kan helpen?',
      'ENFP': 'Hey daar! Geweldig dat je hier bent! Als ENFP heb je vast veel ideeën en mogelijkheden in je hoofd. Wat inspireert je vandaag het meest?',
      'ISTJ': 'Goedemorgen! Ik waardeer je methodische aanpak als ISTJ. Laten we stap voor stap kijken naar waar je aan wilt werken. Wat is je hoofdfocus?'
    };
    
    return welcomeMessages[mbtiType] || 
      `Hallo! Fijn dat je er bent. Als ${mbtiType} heb je unieke sterke punten. Vertel me waar je graag aan zou willen werken.`;
  };

  // Send message to AI coach
  const sendMessage = async () => {
    if (!userInput.trim() || !currentSession || isProcessing) return;

    const userMessage: ChatMessage = {
      id: generateMessageId(),
      type: 'user',
      content: userInput.trim(),
      timestamp: Date.now()
    };

    // Add user message to session
    setCurrentSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage]
    } : null);

    setUserInput('');
    setIsProcessing(true);

    try {
      // Get AI coaching response
      const response: CoachingResponse = await aiCoachingChatLLM.providePersonalizedCoaching(
        userMessage.content,
        selectedMbtiType,
        {
          ...currentSession.context,
          moodRating: currentMood,
          focusAreas,
          previousSessions: [], // TODO: Convert session format
          // sessionHistory.slice(-2) // Last 2 sessions for context
        }
      );

      // Create coach message
      const coachMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'coach',
        content: response.response,
        timestamp: Date.now(),
        insights: response.insights,
        actionSuggestions: response.actionSuggestions,
        followUpQuestions: response.followUpQuestions,
        mbtiAlignment: response.mbtiAlignment,
        confidence: response.confidence
      };

      // Add coach message to session
      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, coachMessage]
      } : null);

    } catch (error) {
      console.error('Error getting coaching response:', error);
      
      // Fallback message
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        type: 'coach',
        content: 'Sorry, ik kan momenteel niet antwoorden. Probeer het over een moment opnieuw, of vertel me meer over je situatie zodat ik je beter kan helpen.',
        timestamp: Date.now(),
        confidence: 0.5
      };

      setCurrentSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMessage]
      } : null);
    } finally {
      setIsProcessing(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Rate session effectiveness
  const rateSession = async (rating: number) => {
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      effectiveness: rating
    };

    setCurrentSession(updatedSession);
    setSessionHistory(prev => [...prev, updatedSession]);

    // Save rating to service
    const lastCoachMessage = currentSession.messages
      .filter(m => m.type === 'coach')
      .pop();
    
    if (lastCoachMessage?.id) {
      await aiCoachingChatLLM.rateSessionEffectiveness(lastCoachMessage.id, rating);
    }
  };

  // End current session
  const endSession = () => {
    if (currentSession) {
      setSessionHistory(prev => [...prev, currentSession]);
      setCurrentSession(null);
    }
  };

  // Add focus area
  const addFocusArea = (area: string) => {
    if (area && !focusAreas.includes(area)) {
      setFocusAreas(prev => [...prev, area]);
    }
  };

  const removeFocusArea = (area: string) => {
    setFocusAreas(prev => prev.filter(a => a !== area));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AI MBTI Coach</h1>
                <p className="text-gray-300">Persoonlijke coaching gebaseerd op je MBTI type</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 lg:col-span-1">
            <CardHeader>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Coaching Setup
              </h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* MBTI Type Selection */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">MBTI Type</label>
                <Select
                  placeholder="Kies je MBTI type"
                  selectedKeys={[selectedMbtiType]}
                  onSelectionChange={(keys) => {
                    const selectedType = Array.from(keys)[0] as string;
                    setSelectedMbtiType(selectedType);
                  }}
                  className="max-w-xs"
                >
                  {mbtiTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Current Mood */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Huidige Stemming</label>
                <Select
                  placeholder="Hoe voel je je nu?"
                  selectedKeys={[currentMood.toString()]}
                  onSelectionChange={(keys) => {
                    const mood = parseInt(Array.from(keys)[0] as string);
                    setCurrentMood(mood);
                  }}
                  className="max-w-xs"
                >
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value.toString()} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Focus Areas */}
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Focus Gebieden</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {focusAreas.map(area => (
                    <Chip
                      key={area}
                      onClose={() => removeFocusArea(area)}
                      color="primary"
                      variant="flat"
                      size="sm"
                    >
                      {area}
                    </Chip>
                  ))}
                </div>
                <Textarea
                  placeholder="Voeg focus gebied toe (Enter om toe te voegen)"
                  size="sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const target = e.target as HTMLTextAreaElement;
                      addFocusArea(target.value.trim());
                      target.value = '';
                    }
                  }}
                />
              </div>

              {/* Session Controls */}
              <Divider className="my-4" />
              <div className="space-y-2">
                {!currentSession ? (
                  <Button
                    color="primary"
                    className="w-full"
                    onClick={startNewSession}
                    startContent={<Heart className="w-4 h-4" />}
                  >
                    Start Coaching Sessie
                  </Button>
                ) : (
                  <Button
                    color="danger"
                    variant="flat"
                    className="w-full"
                    onClick={endSession}
                  >
                    Beëindig Sessie
                  </Button>
                )}
              </div>

              {/* Session Stats */}
              {sessionHistory.length > 0 && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Sessie Statistieken</h3>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Totaal sessies: {sessionHistory.length}</div>
                    <div>
                      Gemiddelde score: {
                        sessionHistory
                          .filter(s => s.effectiveness)
                          .reduce((acc, s) => acc + (s.effectiveness || 0), 0) / 
                        sessionHistory.filter(s => s.effectiveness).length || 0
                      }/5
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Chat Interface */}
          <div className="lg:col-span-3 space-y-4">
            {currentSession ? (
              <>
                {/* Chat Messages */}
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 h-96">
                  <CardBody className="p-0">
                    <div className="h-full overflow-y-auto p-4 space-y-4">
                      {currentSession.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-blue-600' : 'bg-gray-700'} rounded-lg p-3`}>
                            <div className="flex items-start gap-2">
                              {message.type === 'coach' && (
                                <Avatar
                                  src="/api/placeholder/32/32"
                                  className="w-6 h-6 mt-1"
                                  fallback={<Brain className="w-4 h-4" />}
                                />
                              )}
                              <div className="flex-1">
                                <p className="text-white text-sm">{message.content}</p>
                                
                                {/* Message Metadata */}
                                {message.type === 'coach' && (
                                  <div className="mt-2 space-y-2">
                                    {/* Confidence & MBTI Alignment */}
                                    {(message.confidence || message.mbtiAlignment) && (
                                      <div className="flex gap-4 text-xs text-gray-300">
                                        {message.confidence && (
                                          <div className="flex items-center gap-1">
                                            <span>Zekerheid:</span>
                                            <Progress
                                              value={message.confidence * 100}
                                              className="w-12"
                                              size="sm"
                                              color="primary"
                                            />
                                            <span>{Math.round(message.confidence * 100)}%</span>
                                          </div>
                                        )}
                                        {message.mbtiAlignment && (
                                          <div className="flex items-center gap-1">
                                            <span>MBTI Match:</span>
                                            <Progress
                                              value={message.mbtiAlignment * 100}
                                              className="w-12"
                                              size="sm"
                                              color="success"
                                            />
                                            <span>{Math.round(message.mbtiAlignment * 100)}%</span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Insights */}
                                    {showInsights && message.insights && message.insights.length > 0 && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-xs text-yellow-300">
                                          <Lightbulb className="w-3 h-3" />
                                          <span>Inzichten:</span>
                                        </div>
                                        {message.insights.map((insight, idx) => (
                                          <div key={idx} className="text-xs text-gray-300 pl-4">
                                            • {insight}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Action Suggestions */}
                                    {showInsights && message.actionSuggestions && message.actionSuggestions.length > 0 && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-xs text-green-300">
                                          <TrendingUp className="w-3 h-3" />
                                          <span>Acties:</span>
                                        </div>
                                        {message.actionSuggestions.map((action, idx) => (
                                          <div key={idx} className="text-xs text-gray-300 pl-4">
                                            • {action}
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Follow-up Questions */}
                                    {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                                      <div className="space-y-1">
                                        <div className="text-xs text-blue-300">Vervolgvragen:</div>
                                        {message.followUpQuestions.map((question, idx) => (
                                          <Button
                                            key={idx}
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            className="text-xs h-6 mr-1 mb-1"
                                            onClick={() => setUserInput(question)}
                                          >
                                            {question}
                                          </Button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                              <span className="text-gray-300 text-sm">Coach denkt na...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>
                  </CardBody>
                </Card>

                {/* Input Area */}
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardBody className="p-4">
                    <div className="flex gap-2">
                      <Textarea
                        ref={textareaRef}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type je vraag of situatie hier... (Enter om te verzenden, Shift+Enter voor nieuwe regel)"
                        className="flex-1"
                        minRows={1}
                        maxRows={4}
                        disabled={isProcessing}
                      />
                      <Button
                        color="primary"
                        isIconOnly
                        onClick={sendMessage}
                        disabled={!userInput.trim() || isProcessing}
                        className="self-end"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Session Rating */}
                    {currentSession.messages.length > 2 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Hoe helpend was dit gesprek?</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                size="sm"
                                variant={currentSession.effectiveness === rating ? "solid" : "flat"}
                                color={currentSession.effectiveness === rating ? "primary" : "default"}
                                onClick={() => rateSession(rating)}
                                className="w-8 h-8 p-0 min-w-8"
                              >
                                {rating}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </>
            ) : (
              /* No Active Session */
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 h-96">
                <CardBody className="flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-full w-fit mx-auto">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Welkom bij AI MBTI Coaching</h3>
                      <p className="text-gray-300 mb-4">
                        Start een coaching sessie om persoonlijke begeleiding te krijgen 
                        die perfect aansluit bij je {selectedMbtiType} persoonlijkheidstype.
                      </p>
                      <Button
                        color="primary"
                        size="lg"
                        onClick={startNewSession}
                        startContent={<Heart className="w-5 h-5" />}
                      >
                        Begin Coaching Sessie
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoachingInterface;
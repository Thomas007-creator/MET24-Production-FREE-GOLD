/**
 * Active Imagination & Journaling ChatLLM Service
 * Priority #3: Introspection & Creative Expression via MBTI-optimized techniques
 * 
 * Features:
 * - MBTI-specific journaling techniques & prompts
 * - Active imagination guided sessions
 * - Pattern recognition in emotional/behavioral themes
 * - Creative expression analysis & development
 * - Deep introspection insights via ChatLLM
 * 
 * @version 1.0.0
 */

import { chatLLMService } from './chatLLMService';
import { useAppStore } from '../store/useAppStore';
import database from '../database/v14/database';
import { syncTableWithSupabase } from './v14SupabaseSync';
import { Q } from '@nozbe/watermelondb';
import JournalEntryModel from '../database/v14/models/JournalEntry';
import ChatMessageModel from '../database/v14/models/ChatMessage';

// MBTI-Specific Journaling Techniques
export const MBTI_JOURNALING_TECHNIQUES = {
  // Extraversion (E) - External processing
  extraversion: {
    techniques: ['voice-to-text', 'stream-of-consciousness', 'conversation-style'],
    prompts: ['What happened today that energized me?', 'Who did I interact with and how did it feel?'],
    chatLLMFocus: 'Social interaction patterns and energy management'
  },
  
  // Introversion (I) - Internal processing
  introversion: {
    techniques: ['deep-reflection', 'structured-analysis', 'quiet-contemplation'],
    prompts: ['What am I thinking about most deeply?', 'What internal insights emerged today?'],
    chatLLMFocus: 'Internal pattern recognition and deep insight extraction'
  },
  
  // Sensing (S) - Concrete details
  sensing: {
    techniques: ['fact-logging', 'sensory-description', 'step-by-step-review'],
    prompts: ['What exactly happened today?', 'What did I see, hear, feel physically?'],
    chatLLMFocus: 'Practical lessons and concrete action items'
  },
  
  // Intuition (N) - Patterns and possibilities
  intuition: {
    techniques: ['pattern-exploration', 'future-visioning', 'metaphor-creation'],
    prompts: ['What patterns do I notice?', 'What possibilities does this open up?'],
    chatLLMFocus: 'Pattern recognition and creative possibility generation'
  },
  
  // Thinking (T) - Logical analysis
  thinking: {
    techniques: ['pros-cons-analysis', 'logical-frameworks', 'objective-review'],
    prompts: ['What can I learn objectively?', 'What worked and what didn\'t?'],
    chatLLMFocus: 'Logical insight extraction and systematic improvement'
  },
  
  // Feeling (F) - Values and emotions
  feeling: {
    techniques: ['emotion-exploration', 'value-clarification', 'empathy-development'],
    prompts: ['How do I feel about this?', 'What values were honored or violated?'],
    chatLLMFocus: 'Emotional pattern recognition and value alignment'
  },
  
  // Judging (J) - Structure and closure
  judging: {
    techniques: ['structured-templates', 'goal-review', 'planning-sessions'],
    prompts: ['What did I accomplish?', 'What are my next steps?'],
    chatLLMFocus: 'Goal tracking and systematic planning insights'
  },
  
  // Perceiving (P) - Flexibility and exploration
  perceiving: {
    techniques: ['open-exploration', 'spontaneous-reflection', 'flexible-formats'],
    prompts: ['What am I discovering?', 'What\'s emerging that I didn\'t expect?'],
    chatLLMFocus: 'Emergent pattern recognition and adaptive insights'
  }
};

// MBTI-Specific Active Imagination Techniques
export const MBTI_IMAGINATION_TECHNIQUES = {
  INFP: {
    primaryFocus: 'Emotionele expressie en waarden exploratie',
    techniques: ['value-visualization', 'emotional-landscape-mapping', 'future-self-dialogue'],
    safetyConsiderations: ['respect emotional intensity', 'honor authenticity needs', 'provide creative outlets']
  },
  
  INTJ: {
    primaryFocus: 'Strategische planning en visie ontwikkeling',
    techniques: ['future-scenario-building', 'system-visualization', 'strategic-dialogue'],
    safetyConsiderations: ['logical progression', 'respect independence', 'provide structured frameworks']
  },
  
  INFJ: {
    primaryFocus: 'Intuïtieve inzichten en persoonlijke missie',
    techniques: ['symbolic-exploration', 'mission-visualization', 'archetypal-dialogue'],
    safetyConsiderations: ['honor sensitivity', 'respect intuitive process', 'provide gentle guidance']
  },
  
  INTP: {
    primaryFocus: 'Conceptuele exploratie en begrip',
    techniques: ['concept-mapping', 'theoretical-exploration', 'idea-dialogue'],
    safetyConsiderations: ['intellectual freedom', 'logical coherence', 'respect exploration time']
  },
  
  ENFP: {
    primaryFocus: 'Creatieve mogelijkheden en menselijke connecties',
    techniques: ['possibility-exploration', 'relationship-mapping', 'inspiration-channeling'],
    safetyConsiderations: ['enthusiastic support', 'variety in approaches', 'people-centered focus']
  },
  
  ENTP: {
    primaryFocus: 'Innovatieve concepten en nieuwe perspectieven',
    techniques: ['idea-generation', 'perspective-shifting', 'innovation-visualization'],
    safetyConsiderations: ['intellectual stimulation', 'debate opportunities', 'conceptual flexibility']
  },
  
  ENFJ: {
    primaryFocus: 'Persoonlijke groei en betekenisvolle relaties',
    techniques: ['growth-visualization', 'empathy-development', 'community-building'],
    safetyConsiderations: ['people focus', 'harmony consideration', 'growth orientation']
  },
  
  ENTJ: {
    primaryFocus: 'Leiderschap en doelen bereiken',
    techniques: ['leadership-visualization', 'goal-achievement', 'influence-mapping'],
    safetyConsiderations: ['efficiency focus', 'goal orientation', 'leadership development']
  },
  
  ISFP: {
    primaryFocus: 'Artistieke expressie en persoonlijke waarden',
    techniques: ['artistic-visualization', 'value-exploration', 'sensory-imagination'],
    safetyConsiderations: ['gentle approach', 'respect for values', 'creative expression']
  },
  
  ISTP: {
    primaryFocus: 'Praktische vaardigheden en autonomie',
    techniques: ['skill-visualization', 'problem-solving', 'tool-mastery'],
    safetyConsiderations: ['practical focus', 'independence respect', 'hands-on approach']
  },
  
  ISFJ: {
    primaryFocus: 'Zorgverlening en harmonieuze relaties',
    techniques: ['service-visualization', 'harmony-building', 'care-giving'],
    safetyConsiderations: ['supportive environment', 'traditional values', 'stability focus']
  },
  
  ISTJ: {
    primaryFocus: 'Verantwoordelijkheid en gestructureerde groei',
    techniques: ['responsibility-mapping', 'tradition-honoring', 'structured-planning'],
    safetyConsiderations: ['clear structure', 'step-by-step approach', 'proven methods']
  },
  
  ESFP: {
    primaryFocus: 'Spontane expressie en interpersoonlijke vreugde',
    techniques: ['joy-visualization', 'spontaneous-expression', 'people-celebration'],
    safetyConsiderations: ['fun approach', 'social elements', 'immediate feedback']
  },
  
  ESTP: {
    primaryFocus: 'Actie-georiënteerde avontuur en praktische resultaten',
    techniques: ['action-visualization', 'adventure-planning', 'immediate-application'],
    safetyConsiderations: ['active engagement', 'quick results', 'practical focus']
  },
  
  ESFJ: {
    primaryFocus: 'Gemeenschapsharmonie en zorgzame relaties',
    techniques: ['community-building', 'relationship-nurturing', 'harmony-visualization'],
    safetyConsiderations: ['group focus', 'harmony emphasis', 'supportive environment']
  },
  
  ESTJ: {
    primaryFocus: 'Organisatorische effectiviteit en leiderschap',
    techniques: ['organization-visualization', 'efficiency-optimization', 'leadership-practice'],
    safetyConsiderations: ['structured approach', 'clear goals', 'efficiency focus']
  }
};

// Journal Entry Types
export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  entryType: 'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise';
  mbtiTechnique: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  mood: number; // 1-5
  tags: string[];
  category: 'self-awareness' | 'relationships' | 'growth' | 'creativity' | 'values';
  
  // AI Analysis
  chatLLMInsights: JournalInsight[];
  patterns: IdentifiedPattern[];
  sentimentScore: number;
  
  // Privacy
  isPrivate: boolean;
  encryptionLevel: 'basic' | 'advanced';
}

export interface ActiveImaginationSession {
  id: string;
  userId: string;
  sessionType: 'guided' | 'free-form' | 'mbti-specific';
  mbtiTechnique: string;
  
  // Session Data
  prompt: string;
  response: string;
  duration: number; // minutes
  completionLevel: number; // 0-100
  
  // AI Integration
  aiGuidance: ImaginationGuidance[];
  insights: ImaginationInsight[];
  creativityScore: number;
  
  // Metadata
  createdAt: Date;
  audioRecording?: string;
  visualElements?: string[];
}

export interface JournalInsight {
  id: string;
  type: 'pattern' | 'emotion' | 'behavior' | 'growth' | 'creative';
  confidence: number; // 0-100
  description: string;
  actionableRecommendations: string[];
  mbtiContext: string;
  createdAt: Date;
}

export interface IdentifiedPattern {
  id: string;
  type: 'emotional' | 'behavioral' | 'cognitive' | 'relational';
  frequency: number;
  description: string;
  triggers: string[];
  mbtiRelevance: string;
  timeframe: string;
}

export interface ImaginationGuidance {
  id: string;
  sessionId: string;
  step: number;
  guidance: string;
  userResponse: string;
  timestamp: Date;
  emotionalSafety: 'safe' | 'monitor' | 'caution';
}

export interface ImaginationInsight {
  id: string;
  sessionId: string;
  insightType: 'creative' | 'emotional' | 'spiritual' | 'practical';
  description: string;
  relevanceToMBTI: string;
  integrationSuggestions: string[];
}

// Emotional State Tracking
export interface EmotionalState {
  timestamp: Date;
  primary: string;
  secondary?: string;
  intensity: number; // 1-10
  triggers: string[];
  coping: string[];
  mbtiContext: string;
}

class ActiveImaginationChatLLMService {
  
  // ============================================================================
  // JOURNALING METHODS
  // ============================================================================
  
  /**
   * Create new journal entry with MBTI-optimized prompts
   */
  async createJournalEntry(
    userId: string, 
    content: string, 
    mbtiType: string,
    entryType: 'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise' = 'free-form'
  ): Promise<JournalEntry> {
    
    try {
      const journalEntries = database.collections.get('journal_entries');
      
      // Get MBTI-specific technique
      const mbtiPreferences = this.getMBTIPreferences(mbtiType);
      const selectedTechnique = this.selectOptimalTechnique(mbtiPreferences, entryType);
      
      // Create entry in WatermelonDB first (offline-first)
      const newEntry = await database.write(async () => {
        return await journalEntries.create((entry: any) => {
          entry.user_id = userId;
          entry.title = this.generateTitle(content);
          entry.content = content;
          entry.mood_rating = 3; // Default neutral
          entry.tags = JSON.stringify([]);
          entry.category = this.detectCategory(content);
          entry.mbti_type = mbtiType;
          entry.date = Date.now();
          entry.created_at = Date.now();
          entry.updated_at = Date.now();
          entry.created_by = userId;
          entry.is_private = true;
          entry.word_count = content.split(' ').length;
        });
      }) as JournalEntryModel;

      // Trigger AI analysis asynchronously
      this.analyzeJournalEntry(newEntry.id, content, mbtiType);
      
      // Sync to Supabase
      await syncTableWithSupabase('journal_entries');
      
      // Return typed interface
      return {
        id: newEntry.id,
        userId: (newEntry as any).user_id,
        title: (newEntry as any).title,
        content: (newEntry as any).content,
        entryType: entryType,
        mbtiTechnique: selectedTechnique,
        createdAt: new Date((newEntry as any).created_at),
        updatedAt: new Date((newEntry as any).updated_at),
        mood: (newEntry as any).mood_rating || 3,
        tags: JSON.parse((newEntry as any).tags || '[]'),
        category: (newEntry as any).category as any,
        chatLLMInsights: [],
        patterns: [],
        sentimentScore: 0,
        isPrivate: (newEntry as any).is_private,
        encryptionLevel: 'basic'
      };
      
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  }
  
  /**
   * Analyze journal entry with ChatLLM for deep insights
   */
  async analyzeJournalEntry(
    entryId: string, 
    content: string, 
    mbtiType: string
  ): Promise<JournalInsight[]> {
    
    try {
      const mbtiPreferences = this.getMBTIPreferences(mbtiType);
      
      const analysisPrompt = `
        Analyseer deze journal entry voor een ${mbtiType} persoon:
        
        "${content}"
        
        MBTI Context: ${JSON.stringify(mbtiPreferences)}
        
        Geef diepgaande inzichten over:
        1. Onderliggende thema's en betekenissen
        2. ${mbtiType}-specifieke ontwikkelkansen
        3. Emotionele patronen en triggers
        4. Praktische volgende stappen
        5. Creatieve expressie mogelijkheden
        
        Formateer als JSON met:
        - insights: array van insight objecten
        - patterns: array van geïdentificeerde patronen
        - recommendations: concrete acties
        - mbtiGrowthAreas: specifieke ontwikkelgebieden
        - creativePotential: creatieve ontwikkeling kansen
      `;
      
      const analysis = await chatLLMService.processJournalAnalysis(
        content,
        3, // Default mood rating
        new Date().toISOString(),
        mbtiType
      );
      
      // Parse AI response
      const insights = this.parseJournalInsights(analysis.result?.response || '', mbtiType);
      
      // Store insights in database
      await this.storeJournalInsights(entryId, insights);
      
      return insights;
      
    } catch (error) {
      console.error('Error analyzing journal entry:', error);
      return [];
    }
  }
  
  /**
   * Recognize patterns across multiple journal entries
   */
  async recognizePatterns(
    userId: string, 
    timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<IdentifiedPattern[]> {
    
    try {
      const journalEntries = database.collections.get('journal_entries');
      
      // Calculate timeframe
      const now = Date.now();
      const timeframeMs = {
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        quarter: 90 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
      };
      const startTime = now - timeframeMs[timeframe];
      
      // Get entries from timeframe
      const entries = await journalEntries
        .query(
          Q.where('user_id', userId),
          Q.where('created_at', Q.gte(startTime)),
          Q.sortBy('created_at', Q.desc)
        )
        .fetch();
      
      if (entries.length < 3) {
        return []; // Need minimum entries for pattern recognition
      }
      
      // Combine content for analysis
      const combinedContent = entries.map(entry => ({
        date: new Date(entry.created_at).toISOString(),
        content: entry.content,
        mood: entry.mood_rating,
        tags: JSON.parse(entry.tags || '[]')
      }));
      
      const userData = useAppStore.getState().userData;
      const mbtiType = userData?.mbtiType || 'INFP';
      
      const patternPrompt = `
        Analyseer deze journal entries voor een ${mbtiType} over ${timeframe}:
        
        ${JSON.stringify(combinedContent, null, 2)}
        
        Identificeer specifiek:
        1. Terugkerende emotionele patronen
        2. Gedragspatronen en gewoontes  
        3. Triggers en reacties
        4. ${mbtiType}-specifieke ontwikkelthema's
        5. Creatieve uitdrukkingen en blocks
        6. Relatie- en sociale patronen
        7. Groei en vooruitgang trends
        
        Geef concrete, actionable patterns terug in JSON format.
      `;
      
      const patternAnalysis = await chatLLMService.generateContent({
        prompt: patternPrompt,
        feature: 'pattern_recognition',
        context: {
          mbtiType,
          timeframe,
          entriesCount: entries.length
        }
      });
      
      // Parse and return patterns
      return this.parseIdentifiedPatterns(patternAnalysis.content, mbtiType, timeframe);
      
    } catch (error) {
      console.error('Error recognizing patterns:', error);
      return [];
    }
  }
  
  // ============================================================================
  // ACTIVE IMAGINATION METHODS
  // ============================================================================
  
  /**
   * Start guided active imagination session
   */
  async startImaginationSession(
    userId: string,
    mbtiType: string,
    sessionType: 'guided' | 'free-form' | 'mbti-specific',
    theme?: string
  ): Promise<ActiveImaginationSession> {
    
    try {
      const technique = MBTI_IMAGINATION_TECHNIQUES[mbtiType as keyof typeof MBTI_IMAGINATION_TECHNIQUES];
      
      // Create session in database
      const chatMessages = database.collections.get('chat_messages');
      
      const sessionId = `imagination_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initial guidance prompt
      const initialPrompt = this.generateInitialImaginationPrompt(mbtiType, technique, theme);
      
      const newSession = await database.write(async () => {
        return await chatMessages.create((message: any) => {
          message.user_id = userId;
          message.session_id = sessionId;
          message.message = initialPrompt;
          message.is_user = false;
          message.message_type = 'guidance';
          message.context_type = 'imagination';
          message.mbti_context = JSON.stringify(technique);
          message.timestamp = Date.now();
          message.created_at = Date.now();
          message.updated_at = Date.now();
          message.created_by = 'system';
        });
      });
      
      // Sync to Supabase
      await syncTableWithSupabase('chat_messages');
      
      return {
        id: sessionId,
        userId,
        sessionType,
        mbtiTechnique: technique.primaryFocus,
        prompt: initialPrompt,
        response: '',
        duration: 0,
        completionLevel: 0,
        aiGuidance: [],
        insights: [],
        creativityScore: 0,
        createdAt: new Date()
      };
      
    } catch (error) {
      console.error('Error starting imagination session:', error);
      throw error;
    }
  }
  
  /**
   * Process user response in imagination session
   */
  async processImaginationResponse(
    sessionId: string,
    userResponse: string,
    mbtiType: string
  ): Promise<ImaginationGuidance> {
    
    try {
      // Get session context
      const chatMessages = database.collections.get('chat_messages');
      const sessionMessages = await chatMessages
        .query(
          Q.where('session_id', sessionId),
          Q.sortBy('timestamp', Q.asc)
        )
        .fetch();
      
      // Store user response
      await database.write(async () => {
        await chatMessages.create((message: any) => {
          message.user_id = sessionMessages[0]?.user_id;
          message.session_id = sessionId;
          message.message = userResponse;
          message.is_user = true;
          message.message_type = 'response';
          message.context_type = 'imagination';
          message.timestamp = Date.now();
          message.created_at = Date.now();
          message.updated_at = Date.now();
          message.created_by = sessionMessages[0]?.user_id;
        });
      });
      
      // Assess emotional safety
      const emotionalState = await this.assessEmotionalSafety(userResponse, mbtiType);
      
      // Generate next guidance
      const technique = MBTI_IMAGINATION_TECHNIQUES[mbtiType as keyof typeof MBTI_IMAGINATION_TECHNIQUES];
      const sessionMemory = this.buildSessionMemory(sessionMessages);
      
      const guidancePrompt = `
        Je bent een ervaren therapeut die een ${mbtiType} begeleidt in actieve imaginatie.
        
        Sessie context: ${technique.primaryFocus}
        Veiligheidsoverwegingen: ${technique.safetyConsiderations.join(', ')}
        Previous context: ${sessionMemory.summary}
        Current response: ${userResponse}
        Emotional state: ${emotionalState.assessment}
        
        Provide guidance that:
        1. Honors their ${mbtiType} processing style
        2. Deepens the imagination experience safely
        3. Encourages authentic expression
        4. Maintains emotional safety
        5. Builds toward session goals
        
        Safety priority: Always prioritize emotional wellbeing.
        Be supportive, non-judgmental, and respectful of their MBTI preferences.
      `;
      
      const guidance = await chatLLMService.generateContent({
        prompt: guidancePrompt,
        feature: 'imagination_guidance',
        context: {
          mbtiType,
          sessionId,
          step: sessionMessages.length + 1,
          emotionalSafety: emotionalState.level
        }
      });
      
      // Store guidance response
      await database.write(async () => {
        await chatMessages.create((message: any) => {
          message.user_id = sessionMessages[0]?.user_id;
          message.session_id = sessionId;
          message.message = guidance.content;
          message.is_user = false;
          message.message_type = 'guidance';
          message.context_type = 'imagination';
          message.timestamp = Date.now();
          message.created_at = Date.now();
          message.updated_at = Date.now();
          message.created_by = 'system';
        });
      });
      
      // Sync to Supabase
      await syncTableWithSupabase('chat_messages');
      
      return {
        id: `guidance_${Date.now()}`,
        sessionId,
        step: sessionMessages.length + 1,
        guidance: guidance.content,
        userResponse,
        timestamp: new Date(),
        emotionalSafety: emotionalState.level
      };
      
    } catch (error) {
      console.error('Error processing imagination response:', error);
      throw error;
    }
  }
  
  /**
   * Complete imagination session and generate insights
   */
  async completeImaginationSession(
    sessionId: string,
    mbtiType: string
  ): Promise<ImaginationInsight[]> {
    
    try {
      // Get all session messages
      const chatMessages = database.collections.get('chat_messages');
      const sessionMessages = await chatMessages
        .query(
          Q.where('session_id', sessionId),
          Q.sortBy('timestamp', Q.asc)
        )
        .fetch();
      
      // Analyze session for insights
      const sessionContent = sessionMessages.map(msg => ({
        timestamp: new Date(msg.timestamp).toISOString(),
        role: msg.is_user ? 'user' : 'guide',
        content: msg.message
      }));
      
      const insightPrompt = `
        Analyseer deze complete actieve imaginatie sessie voor een ${mbtiType}:
        
        ${JSON.stringify(sessionContent, null, 2)}
        
        Genereer diepgaande inzichten over:
        1. Creatieve doorbraken en ontdekkingen
        2. Emotionele processen en ontwikkeling
        3. ${mbtiType}-specifieke groei gebieden
        4. Spirituele of existentiële thema's
        5. Praktische integratie mogelijkheden
        6. Volgede sessie aanbevelingen
        
        Focus op actionable insights die de persoon kan toepassen.
      `;
      
      const insightAnalysis = await chatLLMService.generateContent({
        prompt: insightPrompt,
        feature: 'imagination_insights',
        context: {
          mbtiType,
          sessionId,
          sessionLength: sessionMessages.length
        }
      });
      
      // Parse and return insights
      return this.parseImaginationInsights(insightAnalysis.content, sessionId, mbtiType);
      
    } catch (error) {
      console.error('Error completing imagination session:', error);
      return [];
    }
  }
  
  // ============================================================================
  // UTILITY METHODS
  // ============================================================================
  
  /**
   * Get MBTI preferences for personalization
   */
  private getMBTIPreferences(mbtiType: string) {
    const preferences = {
      energy: mbtiType[0], // E/I
      information: mbtiType[1], // S/N  
      decision: mbtiType[2], // T/F
      lifestyle: mbtiType[3] // J/P
    };
    
    return {
      ...preferences,
      techniques: {
        ...MBTI_JOURNALING_TECHNIQUES[preferences.energy.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES],
        ...MBTI_JOURNALING_TECHNIQUES[preferences.information.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES],
        ...MBTI_JOURNALING_TECHNIQUES[preferences.decision.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES],
        ...MBTI_JOURNALING_TECHNIQUES[preferences.lifestyle.toLowerCase() as keyof typeof MBTI_JOURNALING_TECHNIQUES]
      }
    };
  }
  
  /**
   * Select optimal journaling technique based on MBTI and entry type
   */
  private selectOptimalTechnique(mbtiPreferences: any, entryType: string): string {
    const techniques = mbtiPreferences.techniques;
    
    switch (entryType) {
      case 'structured':
        return techniques.techniques?.find((t: string) => t.includes('structured')) || 'structured-reflection';
      case 'active-imagination':
        return techniques.techniques?.find((t: string) => t.includes('exploration')) || 'guided-imagination';
      case 'mbti-exercise':
        return `${mbtiPreferences.energy}${mbtiPreferences.information}-focus`;
      default:
        return techniques.techniques?.[0] || 'free-form-reflection';
    }
  }
  
  /**
   * Generate title from content
   */
  private generateTitle(content: string): string {
    const words = content.trim().split(' ');
    if (words.length <= 6) {
      return words.join(' ');
    }
    return words.slice(0, 6).join(' ') + '...';
  }
  
  /**
   * Detect entry category from content
   */
  private detectCategory(content: string): 'self-awareness' | 'relationships' | 'growth' | 'creativity' | 'values' {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('waarden') || lowerContent.includes('authentiek')) return 'values';
    if (lowerContent.includes('relatie') || lowerContent.includes('mensen')) return 'relationships';
    if (lowerContent.includes('creatief') || lowerContent.includes('kunst')) return 'creativity';
    if (lowerContent.includes('groei') || lowerContent.includes('ontwikkel')) return 'growth';
    
    return 'self-awareness';
  }
  
  /**
   * Parse journal insights from AI response
   */
  private parseJournalInsights(aiResponse: string, mbtiType: string): JournalInsight[] {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(aiResponse);
      
      return (parsed.insights || []).map((insight: any, index: number) => ({
        id: `insight_${Date.now()}_${index}`,
        type: insight.type || 'pattern',
        confidence: insight.confidence || 80,
        description: insight.description || insight.text,
        actionableRecommendations: insight.recommendations || [],
        mbtiContext: mbtiType,
        createdAt: new Date()
      }));
    } catch (error) {
      // Fallback to text parsing
      return [{
        id: `insight_${Date.now()}`,
        type: 'pattern',
        confidence: 75,
        description: aiResponse.substring(0, 500),
        actionableRecommendations: [],
        mbtiContext: mbtiType,
        createdAt: new Date()
      }];
    }
  }
  
  /**
   * Parse identified patterns from AI response
   */
  private parseIdentifiedPatterns(aiResponse: string, mbtiType: string, timeframe: string): IdentifiedPattern[] {
    try {
      const parsed = JSON.parse(aiResponse);
      
      return (parsed.patterns || []).map((pattern: any, index: number) => ({
        id: `pattern_${Date.now()}_${index}`,
        type: pattern.type || 'emotional',
        frequency: pattern.frequency || 1,
        description: pattern.description,
        triggers: pattern.triggers || [],
        mbtiRelevance: `${mbtiType}-specific: ${pattern.mbtiRelevance || 'General pattern'}`,
        timeframe
      }));
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Parse imagination insights from AI response
   */
  private parseImaginationInsights(aiResponse: string, sessionId: string, mbtiType: string): ImaginationInsight[] {
    try {
      const parsed = JSON.parse(aiResponse);
      
      return (parsed.insights || []).map((insight: any, index: number) => ({
        id: `imagination_insight_${Date.now()}_${index}`,
        sessionId,
        insightType: insight.type || 'creative',
        description: insight.description,
        relevanceToMBTI: `${mbtiType}: ${insight.mbtiRelevance || insight.relevance}`,
        integrationSuggestions: insight.integrationSuggestions || insight.applications || []
      }));
    } catch (error) {
      return [{
        id: `imagination_insight_${Date.now()}`,
        sessionId,
        insightType: 'creative',
        description: aiResponse.substring(0, 500),
        relevanceToMBTI: mbtiType,
        integrationSuggestions: []
      }];
    }
  }
  
  /**
   * Store journal insights in database
   */
  private async storeJournalInsights(entryId: string, insights: JournalInsight[]): Promise<void> {
    try {
      // Store in ai_interactions table for cross-feature integration
      const aiInteractions = database.collections.get('ai_interactions');
      
      await database.write(async () => {
        for (const insight of insights) {
          await aiInteractions.create((interaction: any) => {
            interaction.user_id = useAppStore.getState().userData?.id;
            interaction.feature_type = 'journaling_analysis';
            interaction.interaction_type = 'insight_generation';
            interaction.prompt = `Journal entry analysis: ${entryId}`;
            interaction.response = JSON.stringify(insight);
            interaction.tokens_used = 100; // Estimate
            interaction.response_time = 2.5; // Estimate
            interaction.model_used = 'chatllm_journaling';
            interaction.session_id = entryId;
            interaction.created_at = Date.now();
            interaction.updated_at = Date.now();
            interaction.created_by = useAppStore.getState().userData?.id;
          });
        }
      });
      
      await syncTableWithSupabase('ai_interactions');
    } catch (error) {
      console.error('Error storing journal insights:', error);
    }
  }
  
  /**
   * Generate initial imagination prompt
   */
  private generateInitialImaginationPrompt(mbtiType: string, technique: any, theme?: string): string {
    const personalizedPrompt = `
      Welkom bij je actieve imaginatie sessie, speciaal aangepast voor jouw ${mbtiType} type.
      
      Focus voor vandaag: ${technique.primaryFocus}
      ${theme ? `Thema: ${theme}` : ''}
      
      Laten we beginnen met een eenvoudige oefening die past bij jouw manier van denken en ervaren.
      
      Sluit je ogen en adem een paar keer diep in. Wanneer je klaar bent, beschrijf wat er spontaan in je gedachten opkomt...
      
      Neem alle tijd die je nodig hebt. Er is geen verkeerde manier om dit te doen.
    `;
    
    return personalizedPrompt.trim();
  }
  
  /**
   * Assess emotional safety during imagination
   */
  private async assessEmotionalSafety(response: string, mbtiType: string): Promise<{level: 'safe' | 'monitor' | 'caution', assessment: string}> {
    const lowerResponse = response.toLowerCase();
    
    // Basic safety keywords
    const cautionWords = ['pijn', 'trauma', 'angst', 'paniek', 'donker', 'geweld', 'dood'];
    const monitorWords = ['verdriet', 'spanning', 'onrust', 'verwarring', 'eenzaam'];
    
    if (cautionWords.some(word => lowerResponse.includes(word))) {
      return { level: 'caution', assessment: 'Intense emotional content detected - proceed with care' };
    }
    
    if (monitorWords.some(word => lowerResponse.includes(word))) {
      return { level: 'monitor', assessment: 'Emotional processing in progress - supportive guidance needed' };
    }
    
    return { level: 'safe', assessment: 'Healthy emotional expression - continue exploration' };
  }
  
  /**
   * Build session memory for context
   */
  private buildSessionMemory(messages: any[]): {summary: string, keyThemes: string[]} {
    const userMessages = messages.filter(msg => msg.is_user).map(msg => msg.message);
    const keyThemes = ['exploration', 'self-discovery', 'creativity'];
    
    const summary = userMessages.length > 0 
      ? `Previous responses covered: ${userMessages.slice(-2).join('. ')}`
      : 'Beginning of session';
    
    return { summary, keyThemes };
  }
}

// Export service instance
export const activeImaginationChatLLMService = new ActiveImaginationChatLLMService();
export default activeImaginationChatLLMService;
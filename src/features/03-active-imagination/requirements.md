# 🧘 Actieve Imaginatie & Journaling - Product Requirements Document v1.0

## **🎯 VISION STATEMENT**
Een innovatieve journaling en actieve imaginatie platform die introspectie en creativiteit stimuleert via MBTI-geoptimaliseerde technieken. ChatLLM analyseert journal entries voor diepere inzichten en begeleidt imaginatiesessies voor holistische persoonlijke groei.

---

## **📊 BUSINESS REQUIREMENTS**

### **Primary Goals**
1. **Introspectie Verdieping**: MBTI-specific journaling techniques voor zelfkennis
2. **Creativiteit Stimulatie**: Actieve imaginatie sessies aangepast per type
3. **Patroon Herkenning**: ChatLLM analyse van journal entries voor inzichten
4. **Emotionele Intelligentie**: Ontwikkeling van EQ via reflectieve practices
5. **Offline-First Functionaliteit**: Journaling zonder internetverbinding

### **MBTI-Specific Value Propositions**
```typescript
type MBTIJournalingBenefits = {
  // Intuitive Types (N) - Pattern recognition, future visioning
  INFP: {
    primaryBenefit: 'Emotionele expressie en waarden exploratie';
    techniques: ['stream-of-consciousness', 'value-clarification', 'creative-writing'];
    chatLLMFocus: 'Pattern recognition in emotional themes';
  };
  
  INTJ: {
    primaryBenefit: 'Strategische planning en visie ontwikkeling';
    techniques: ['structured-analysis', 'goal-decomposition', 'future-scenario-planning'];
    chatLLMFocus: 'Strategic insight extraction and planning optimization';
  };
  
  // Sensing Types (S) - Concrete experiences, practical reflection
  ISTJ: {
    primaryBenefit: 'Gestructureerde reflectie en leren van ervaring';
    techniques: ['daily-review', 'lesson-extraction', 'structured-templates'];
    chatLLMFocus: 'Practical insight identification and action planning';
  };
  
  ESFP: {
    primaryBenefit: 'Emotionele verwerking en relatie reflectie';
    techniques: ['emotion-tracking', 'relationship-analysis', 'gratitude-practice'];
    chatLLMFocus: 'Emotional pattern recognition and relationship insights';
  };
  
  // ... Complete mapping voor alle 16 types
};
```

### **Success Metrics**
- **Engagement**: >75% gebruikers journalen minimaal 3x per week
- **Insight Quality**: >4.4/5 rating voor ChatLLM-generated insights
- **Creative Output**: >60% users complete actieve imaginatie sessies
- **Pattern Recognition**: >85% accuracy in emotional/behavioral pattern identification
- **MBTI Alignment**: >90% user satisfaction met type-specific techniques

---

## **🔧 TECHNICAL REQUIREMENTS**

### **Core Architecture**
```typescript
interface ActiveImaginationSystem {
  // Core Services
  journalingService: JournalingService;               // Entry creation & management
  activeImaginationService: ActiveImaginationService; // Guided imagination sessions
  chatLLMAnalyzer: ChatLLMJournalAnalyzer;          // AI-powered analysis
  mbtiOptimization: MBTIJournalingOptimizer;        // Type-specific adaptations
  
  // Data Layer
  v14Database: WatermelonDBV14;                      // Offline-first storage
  encryptionService: JournalEncryptionService;       // Privacy protection
  supabaseSync: V14SupabaseSync;                     // Secure cloud sync
  
  // AI Integration
  plotinusAI: HogerZelfAIService;                    // AI1 creative inspiration
  agentExecutor: AgentExecutorService;               // Autonomous analysis
}
```

### **Journaling Data Model**
```typescript
interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string; // Encrypted
  entryType: 'free-form' | 'structured' | 'active-imagination' | 'mbti-exercise';
  mbtiTechnique: MBTIJournalingTechnique;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  mood: EmotionalState;
  tags: string[];
  levensgebiedFocus?: LevensgebiedType;
  
  // AI Analysis
  chatLLMInsights: JournalInsight[];
  patterns: IdentifiedPattern[];
  sentiment: SentimentAnalysis;
  
  // Privacy
  isPrivate: boolean;
  encryptionLevel: 'basic' | 'advanced';
  sharedWith?: string[]; // User IDs
}

interface ActiveImaginationSession {
  id: string;
  userId: string;
  sessionType: 'guided' | 'free-form' | 'mbti-specific';
  mbtiTechnique: MBTIImaginationTechnique;
  
  // Session Data
  prompt: string;
  response: string; // User's imagination output
  duration: number; // minutes
  completionLevel: number; // 0-100
  
  // AI Integration
  aiGuidance: ImaginationGuidance[];
  insights: ImaginationInsight[];
  creativityScore: number;
  
  // Metadata
  createdAt: Date;
  audioRecording?: string; // Optional voice recording
  visualElements?: string[]; // Optional sketches/images
}
```

### **MBTI-Specific Techniques**
```typescript
// Journaling techniques per MBTI preference
const MBTI_JOURNALING_TECHNIQUES = {
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
```

---

## **🎨 USER EXPERIENCE REQUIREMENTS**

### **Journaling Interface Design**
```typescript
// MBTI-Optimized Journaling Interfaces
interface JournalingInterfaceConfig {
  // Structured types prefer templates and frameworks
  structured: {
    layout: 'template-based';
    features: ['guided-prompts', 'section-dividers', 'progress-tracking'];
    tools: ['spell-check', 'word-count', 'structure-validation'];
    colorScheme: 'clean-professional';
  };
  
  // Creative types prefer free-form expression
  creative: {
    layout: 'free-form-canvas';
    features: ['unlimited-space', 'rich-text-formatting', 'image-integration'];
    tools: ['voice-to-text', 'sketch-integration', 'mood-colors'];
    colorScheme: 'warm-inspiring';
  };
  
  // Analytical types prefer data and metrics
  analytical: {
    layout: 'data-enhanced';
    features: ['metrics-tracking', 'pattern-visualization', 'goal-correlation'];
    tools: ['sentiment-analysis', 'keyword-tracking', 'trend-charts'];
    colorScheme: 'blue-data-focused';
  };
  
  // Social types prefer sharing and feedback
  social: {
    layout: 'community-integrated';
    features: ['sharing-options', 'feedback-collection', 'group-prompts'];
    tools: ['collaboration-tools', 'comment-system', 'empathy-features'];
    colorScheme: 'warm-social';
  };
}
```

### **Active Imagination Interface**
```typescript
interface ImaginationSessionInterface {
  // Guided sessions with AI assistance
  guidedMode: {
    features: ['step-by-step-prompts', 'ai-guidance', 'progress-indicators'];
    mbtiAdaptations: {
      sensors: 'Concrete, detailed imagery prompts';
      intuitives: 'Abstract, symbolic imagery prompts';
      thinkers: 'Logical progression and analysis';
      feelers: 'Emotional resonance and values exploration';
    };
  };
  
  // Free-form creative space
  freeFormMode: {
    features: ['blank-canvas', 'voice-recording', 'sketch-integration'];
    tools: ['timer', 'background-sounds', 'inspiration-triggers'];
  };
  
  // MBTI-specific exercises
  mbtiExercises: {
    features: ['type-specific-prompts', 'targeted-development', 'growth-tracking'];
    exerciseTypes: ['shadow-work', 'function-development', 'type-integration'];
  };
}
```

---

## **🤖 CHATLLM INTEGRATION REQUIREMENTS**

### **Journal Analysis Capabilities**
```typescript
interface ChatLLMJournalAnalyzer {
  // Pattern recognition in journal entries
  analyzePatterns(entries: JournalEntry[], timeframe: string): Promise<PatternAnalysis> {
    // Analyze recurring themes, emotions, behaviors
    // MBTI-contextualized pattern recognition
    // Trend identification over time
  };
  
  // Insight generation from single entries
  generateInsights(entry: JournalEntry, mbtiContext: MBTIContext): Promise<JournalInsight[]> {
    // Deep content analysis
    // MBTI-specific insight generation
    // Actionable recommendations
  };
  
  // Emotional intelligence development
  analyzeEmotionalPatterns(entries: JournalEntry[]): Promise<EmotionalIntelligenceInsight> {
    // Emotion recognition and tracking
    // Trigger identification
    // Emotional growth recommendations
  };
  
  // Creative development tracking
  assessCreativeGrowth(sessions: ActiveImaginationSession[]): Promise<CreativeGrowthAnalysis> {
    // Creativity metrics
    // Imagination depth assessment
    // Creative block identification
  };
}

// ChatLLM Prompts voor verschillende analyses
const CHATLLM_JOURNAL_PROMPTS = {
  patternAnalysis: `
    Analyseer deze journal entries voor een {mbtiType} over de afgelopen {timeframe}:
    {journalEntries}
    
    Identificeer:
    1. Terugkerende thema's en patronen
    2. Emotionele trends en triggers
    3. Gedragspatronen en gewoontes
    4. MBTI-specifieke ontwikkelingsgebieden
    5. Groei en vooruitgang indicatoren
    
    Geef concrete inzichten met actionable recommendations.
  `,
  
  insightGeneration: `
    Analyseer deze journal entry van een {mbtiType}:
    {entryContent}
    
    Context: {mbtiPreferences}
    
    Genereer diepgaande inzichten over:
    1. Onderliggende thema's en betekenissen
    2. MBTI-specifieke ontwikkelkansen
    3. Emotionele patronen en triggers
    4. Praktische volgende stappen
    5. Verbindingen met eerdere entries
  `,
  
  imaginationGuidance: `
    Begeleid een {mbtiType} in een actieve imaginatie sessie:
    Thema: {sessionTheme}
    Huidige staat: {currentMood}
    
    Geef stap-voor-stap guidance die:
    1. Past bij hun MBTI-voorkeuren
    2. Stimuleert tot diepere exploratie
    3. Respecteert hun comfort zone
    4. Encourageert creative expression
    5. Verbindt met persoonlijke groei doelen
  `
};
```

---

## **🔐 PRIVACY & SECURITY REQUIREMENTS**

### **Journal Encryption Strategy**
```typescript
interface JournalSecurityModel {
  // Multi-layer encryption
  encryptionLayers: {
    clientSide: 'AES-256 encryption before database storage';
    transport: 'TLS 1.3 for all data transmission';
    storage: 'Encrypted at rest in Supabase';
    chatLLM: 'Temporary processing only, no permanent storage';
  };
  
  // User control over privacy
  privacyControls: {
    entryLevel: 'Per-entry privacy settings';
    shareLevel: 'Selective sharing with trusted users';
    analysisLevel: 'Opt-in/out of AI analysis';
    dataRetention: 'User-controlled retention policies';
  };
  
  // GDPR Compliance
  gdprCompliance: {
    dataPortability: 'Full export of all journal data';
    rightToDeletion: 'Complete data removal on request';
    consentManagement: 'Granular consent for different features';
    dataMinimization: 'Only necessary data processing';
  };
}
```

---

## **📱 COMPONENT REQUIREMENTS**

### **Shadcn Components Needed**
```typescript
import {
  Textarea,         // Main journaling input
  Card,             // Entry cards and session containers
  Button,           // Action triggers
  Tabs,             // Different journaling modes
  Badge,            // Entry tags and categories
  Calendar,         // Date navigation
  Dialog,           // Entry modals and settings
  Select,           // Entry type selection
  Switch,           // Privacy toggles
  Slider,           // Mood and sentiment sliders
  Progress,         // Session progress
  Alert,            // Insights and notifications
  Tooltip,          // MBTI-specific help text
  Separator,        // Content sections
  ScrollArea        // Long content areas
} from '@shadcn/ui';

// Specialized components
import {
  RichTextEditor,   // Advanced text formatting
  VoiceRecorder,    // Audio journaling
  MoodSelector,     // Emotional state input
  TagInput          // Custom tagging system
} from '@shadcn/extended';
```

### **Custom Components Needed**
```typescript
interface JournalingComponents {
  JournalingInterface: React.ComponentType<{
    mbtiType: MBTIType;
    mode: 'free-form' | 'structured' | 'guided';
    onEntryCreate: (entry: JournalEntry) => void;
  }>;
  
  EntryList: React.ComponentType<{
    entries: JournalEntry[];
    filterOptions: EntryFilter;
    onEntrySelect: (entryId: string) => void;
  }>;
  
  ActiveImaginationPlayer: React.ComponentType<{
    session: ActiveImaginationSession;
    mbtiOptimized: boolean;
    onSessionUpdate: (session: ActiveImaginationSession) => void;
  }>;
  
  InsightPanel: React.ComponentType<{
    insights: JournalInsight[];
    isGenerating: boolean;
    showMBTIContext: boolean;
  }>;
  
  PatternVisualization: React.ComponentType<{
    patterns: IdentifiedPattern[];
    timeframe: string;
    mbtiContext: MBTIContext;
  }>;
  
  EmotionalTrendChart: React.ComponentType<{
    emotionalData: EmotionalState[];
    showPredictions: boolean;
  }>;
}
```

---

## **📈 PERFORMANCE REQUIREMENTS**

### **Offline-First Performance**
- **Entry Creation**: <500ms offline save
- **Search/Filter**: <1 second voor 1000+ entries
- **Sync Performance**: <10 seconds voor complete sync
- **ChatLLM Analysis**: <7 seconds voor insight generation

### **Storage Optimization**
- **Local Storage**: Efficient compression voor journal entries
- **Incremental Sync**: Only changed entries sync to cloud
- **Cache Management**: Smart caching voor frequent patterns
- **Memory Usage**: <50MB voor 1000+ entries local storage

---

## **🧪 TESTING REQUIREMENTS**

### **Privacy & Security Testing**
- **Encryption Validation**: Verify all journal data encryption
- **Privacy Controls**: Test granular privacy settings
- **Data Leak Prevention**: Ensure no sensitive data in logs
- **ChatLLM Security**: Verify temporary processing only

### **MBTI-Specific Testing**
- **Technique Validation**: Test alle 16 types voor appropriate techniques
- **Interface Adaptation**: Verify MBTI-optimized layouts
- **Insight Quality**: Test ChatLLM output relevance per type
- **User Experience**: UAT met representatives van elk type

---

## **📋 ACCEPTANCE CRITERIA**

### **Definition of Done**
✅ **Functional Requirements**
- [ ] Journaling interface fully functional voor alle MBTI types
- [ ] Active imagination sessions working met AI guidance
- [ ] ChatLLM analysis generating quality insights
- [ ] Pattern recognition accurately identifying themes
- [ ] Privacy controls functioning correctly

✅ **Technical Requirements**
- [ ] End-to-end encryption implemented
- [ ] Offline-first functionality working
- [ ] V14 database integration complete
- [ ] Performance targets met
- [ ] GDPR compliance verified

✅ **User Experience Requirements**
- [ ] MBTI-specific interfaces validated
- [ ] Mobile journaling experience optimized
- [ ] Accessibility standards met
- [ ] User privacy respected en transparent
- [ ] Creative expression tools functional

**🎯 Ready voor Tasks Breakdown in tasks.md!**
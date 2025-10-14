# 📖 Content Discovery & Back to Basics - Product Requirements Document v1.0

## **🎯 VISION STATEMENT**
Een intelligente content discovery platform die gepersonaliseerde leer- en groeicontent levert afgestemd op MBTI-type en de 9 levensgebieden. ChatLLM cureert relevante content en genereert inzichten voor holistische Hogere Zelf ontwikkeling.

---

## **📊 BUSINESS REQUIREMENTS**

### **Primary Goals**
1. **MBTI-Matched Content Curation**: Type-specific content recommendations
2. **9 Levensgebieden Integration**: Content gekoppeld aan wellness assessment
3. **ChatLLM Content Analysis**: AI-powered insights en recommendations
4. **Personalized Learning Paths**: Adaptive content journeys based op progress
5. **"Back to Basics" Foundation**: Core principles voor elk levensgebied

### **MBTI-Specific Content Preferences**
```typescript
type MBTIContentPreferences = {
  // Analytical Types (NT, ST) - Data-driven, systematic content
  analyticalTypes: {
    contentFormats: ['research-papers', 'case-studies', 'data-visualizations', 'systematic-guides'];
    learningStyle: 'structured-progressive';
    depthPreference: 'comprehensive-deep-dives';
    presentationStyle: 'logical-framework-based';
    exampleTypes: [
      'INTJ: Strategic frameworks and long-term planning methodologies',
      'ISTJ: Step-by-step implementation guides and proven practices',
      'ENTP: Innovation case studies and creative problem-solving approaches',
      'ESTJ: Leadership principles and organizational effectiveness'
    ];
  };
  
  // People-Oriented Types (NF, SF) - Value-driven, story-based content
  peopleOrientedTypes: {
    contentFormats: ['personal-stories', 'interviews', 'community-examples', 'value-exploration'];
    learningStyle: 'narrative-experiential';
    depthPreference: 'meaningful-connections';
    presentationStyle: 'story-and-metaphor-based';
    exampleTypes: [
      'INFP: Personal growth stories and authentic self-expression guides',
      'ENFJ: Community impact stories and relationship-building strategies',
      'ISFP: Creative expression tutorials and mindful living practices',
      'ESFJ: Social harmony guides and supportive community building'
    ];
  };
  
  // Conceptual Types (NT, NF) - Big picture, innovative content
  conceptualTypes: {
    contentFormats: ['thought-leadership', 'future-trends', 'philosophical-explorations', 'innovation-insights'];
    learningStyle: 'exploratory-visionary';
    depthPreference: 'broad-connections';
    presentationStyle: 'concept-and-possibility-focused';
    exampleTypes: [
      'ENFP: Creative possibility exploration and inspiration catalogs',
      'INTP: Theoretical frameworks and conceptual model building',
      'ENTJ: Visionary leadership and transformational strategies',
      'INFJ: Holistic development and meaningful contribution paths'
    ];
  };
  
  // Practical Types (ST, SF) - Hands-on, immediate application content
  practicalTypes: {
    contentFormats: ['how-to-guides', 'practical-tutorials', 'real-examples', 'immediate-applications'];
    learningStyle: 'hands-on-experiential';
    depthPreference: 'actionable-practical';
    presentationStyle: 'concrete-application-focused';
    exampleTypes: [
      'ESTP: Action-oriented challenges and immediate skill building',
      'ISFJ: Caring service tutorials and supportive practice guides',
      'ESFP: Engaging experiences and social connection activities',
      'ISTP: Practical skill development and hands-on mastery'
    ];
  };
};
```

### **9 Levensgebieden Content Integration**
```typescript
interface LevensgebiedContentMapping {
  Gezondheid: {
    coreTopics: ['Physical Wellness', 'Mental Health', 'Energy Management', 'Preventive Care'];
    mbtiAdaptations: {
      thinkingTypes: 'Evidence-based health optimization and systematic wellness approaches';
      feelingTypes: 'Holistic wellbeing and emotional health integration';
      sensingTypes: 'Practical health habits and immediate wellness practices';
      intuitiveTypes: 'Innovative wellness approaches and future health trends';
    };
    contentTypes: ['articles', 'videos', 'podcasts', 'apps', 'books', 'courses'];
  };
  
  Werk: {
    coreTopics: ['Career Development', 'Skill Building', 'Leadership', 'Work-Life Balance'];
    mbtiAdaptations: {
      INTJ: 'Strategic career planning and leadership development';
      ESFP: 'People-centered careers and collaborative work environments';
      ISTJ: 'Professional excellence and systematic skill development';
      ENFP: 'Creative career paths and innovative work approaches';
    };
    contentTypes: ['career-guides', 'skill-courses', 'leadership-content', 'industry-insights'];
  };
  
  Financiën: {
    coreTopics: ['Financial Planning', 'Investment Strategies', 'Budgeting', 'Wealth Building'];
    mbtiAdaptations: {
      judgingTypes: 'Structured financial planning and systematic wealth building';
      perceivingTypes: 'Flexible financial strategies and adaptive money management';
      thinkingTypes: 'Analytical investment approaches and data-driven decisions';
      feelingTypes: 'Value-aligned financial choices and impact investing';
    };
    contentTypes: ['financial-guides', 'investment-courses', 'budgeting-tools', 'wealth-strategies'];
  };
  
  Relaties: {
    coreTopics: ['Communication Skills', 'Relationship Building', 'Conflict Resolution', 'Intimacy'];
    mbtiAdaptations: {
      extravertedTypes: 'Social relationship building and community connection';
      introvertedTypes: 'Deep relationship development and meaningful connections';
      feelingTypes: 'Emotional intelligence and empathetic communication';
      thinkingTypes: 'Effective communication and logical relationship frameworks';
    };
    contentTypes: ['relationship-guides', 'communication-courses', 'counseling-resources', 'social-skills'];
  };
  
  Familie: {
    coreTopics: ['Parenting', 'Family Dynamics', 'Generational Wisdom', 'Family Values'];
    mbtiAdaptations: {
      SF_types: 'Nurturing family environments and supportive parenting';
      NT_types: 'Strategic family planning and educational development';
      SJ_types: 'Traditional family values and structured family life';
      NP_types: 'Creative family experiences and flexible family dynamics';
    };
    contentTypes: ['parenting-guides', 'family-activities', 'relationship-building', 'value-development'];
  };
  
  Hobbys: {
    coreTopics: ['Creative Expression', 'Skill Development', 'Recreation', 'Personal Interests'];
    mbtiAdaptations: {
      artisticTypes: 'Creative and artistic pursuit development';
      intellectualTypes: 'Knowledge-based hobbies and intellectual pursuits';
      activeTypes: 'Physical activities and adventure-based hobbies';
      socialTypes: 'Community-based activities and group hobbies';
    };
    contentTypes: ['hobby-guides', 'skill-tutorials', 'creative-courses', 'recreation-ideas'];
  };
  
  Spiritualiteit: {
    coreTopics: ['Mindfulness', 'Meditation', 'Purpose', 'Transcendence'];
    mbtiAdaptations: {
      intuitiveTypes: 'Mystical and transcendent spiritual practices';
      sensingTypes: 'Grounded and practical spiritual approaches';
      feelingTypes: 'Heart-centered and compassionate spiritual paths';
      thinkingTypes: 'Philosophical and intellectual spiritual exploration';
    };
    contentTypes: ['meditation-guides', 'spiritual-texts', 'mindfulness-courses', 'purpose-exploration'];
  };
  
  PersoonlijkeGroei: {
    coreTopics: ['Self-Awareness', 'Skill Development', 'Goal Achievement', 'Character Building'];
    mbtiAdaptations: {
      allTypes: 'Personalized development paths based on MBTI cognitive functions';
      specificAdaptations: 'Type-specific growth challenges and development exercises';
    };
    contentTypes: ['self-help-books', 'development-courses', 'coaching-resources', 'assessment-tools'];
  };
  
  Bijdrage: {
    coreTopics: ['Community Service', 'Social Impact', 'Leadership', 'Legacy Building'];
    mbtiAdaptations: {
      feelingTypes: 'Compassionate service and people-centered contribution';
      thinkingTypes: 'Strategic impact and systematic change creation';
      extravertedTypes: 'Community leadership and public service';
      introvertedTypes: 'Behind-the-scenes contribution and specialized expertise sharing';
    };
    contentTypes: ['service-opportunities', 'leadership-development', 'impact-strategies', 'legacy-building'];
  };
}
```

### **Success Metrics**
- **Content Engagement**: >70% van recommended content wordt bekeken
- **MBTI Relevance**: >4.3/5 rating voor type-specific content matching
- **Learning Progress**: >60% users complete recommended learning paths
- **Levensgebied Integration**: >80% content consumption leads to wellness score improvements
- **Discovery Effectiveness**: >75% users find new valuable resources monthly

---

## **🔧 TECHNICAL REQUIREMENTS**

### **Core Architecture**
```typescript
interface ContentDiscoverySystem {
  // Content Management
  contentRepository: ContentRepositoryService;        // Content storage & organization
  contentCurator: ChatLLMContentCurator;             // AI-powered content curation
  mbtiContentMatcher: MBTIContentMatcher;            // Type-specific matching
  
  // Discovery & Recommendation
  recommendationEngine: ContentRecommendationEngine;  // Personalized suggestions
  searchService: IntelligentSearchService;           // MBTI-aware search
  pathwayGenerator: LearningPathwayGenerator;        // Adaptive learning journeys
  
  // Integration Services
  wellnessIntegration: WellnessContentIntegration;   // Link to levensgebieden dashboard
  progressTracking: ContentProgressService;          // Learning progress monitoring
  insightGeneration: ContentInsightService;          // ChatLLM content analysis
  
  // Data Layer
  v14Database: WatermelonDBV14;                      // Content metadata & progress
  contentCache: OfflineContentCache;                 // Offline content access
  supabaseSync: V14SupabaseSync;                     // Progress synchronization
}
```

### **Content Data Model**
```typescript
interface ContentItem {
  id: string;
  title: string;
  description: string;
  content: ContentBody;                               // Text, video, audio, interactive
  
  // Categorization
  contentType: 'article' | 'video' | 'podcast' | 'course' | 'book' | 'tool' | 'exercise';
  levensgebied: LevensgebiedType[];
  topics: string[];
  tags: string[];
  
  // MBTI Optimization
  mbtiRelevance: {
    primaryTypes: MBTIType[];                         // Most relevant types
    secondaryTypes: MBTIType[];                       // Somewhat relevant types
    adaptations: MBTIContentAdaptation[];             // Type-specific presentations
  };
  
  // Quality & Metadata
  source: ContentSource;
  author: string;
  publishedDate: Date;
  lastUpdated: Date;
  qualityScore: number;                               // 0-100 editorial quality
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedReadTime: number;                          // minutes
  
  // AI Analysis
  chatLLMAnalysis: {
    keyInsights: string[];
    practicalApplications: string[];
    mbtiConnections: string[];
    relatedConcepts: string[];
    learningObjectives: string[];
  };
  
  // User Interaction
  userRatings: ContentRating[];
  completionRate: number;                             // % of users who finish
  shareCount: number;
  bookmarkCount: number;
  
  // Learning Integration
  prerequisites: string[];                            // Required prior content
  followUpContent: string[];                          // Recommended next content
  practicalExercises: Exercise[];
  assessmentQuestions: AssessmentQuestion[];
}

interface ContentCollection {
  id: string;
  title: string;
  description: string;
  
  // Organization
  collectionType: 'back_to_basics' | 'learning_pathway' | 'mbti_series' | 'levensgebied_focus';
  contentItems: string[];                             // Content IDs in order
  
  // MBTI & Levensgebied Context
  targetMBTITypes: MBTIType[];
  primaryLevensgebied: LevensgebiedType;
  skillLevel: 'foundation' | 'intermediate' | 'advanced';
  
  // Learning Design
  estimatedCompletionTime: number;                    // hours
  learningObjectives: string[];
  progressMilestones: Milestone[];
  
  // AI Enhancement
  chatLLMCuration: {
    curatedBy: 'ai' | 'human' | 'hybrid';
    curationReasoning: string;
    customizations: MBTICustomization[];
  };
}
```

### **ChatLLM Content Curation**
```typescript
export class ChatLLMContentCurator {
  
  async curatePersonalizedContent(
    userProfile: UserProfile,
    wellnessScores: LevensgebiedScore[],
    learningHistory: ContentProgress[]
  ): Promise<PersonalizedContentRecommendations> {
    
    const curationPrompt = `
      Curate personalized content voor een ${userProfile.mbtiType} gebruiker:
      
      Profiel:
      - MBTI Type: ${userProfile.mbtiType}
      - Levensgebieden scores: ${JSON.stringify(wellnessScores)}
      - Recent content: ${learningHistory.slice(-10).map(c => c.title).join(', ')}
      - Learning preferences: ${userProfile.learningPreferences}
      - Available time: ${userProfile.availableTimePerWeek} uur/week
      
      Focus areas (laagste scores):
      ${this.identifyFocusAreas(wellnessScores)}
      
      Geef recommendations voor:
      1. Back to Basics content voor focus areas
      2. MBTI-optimized learning paths
      3. Progressive skill building content
      4. Practical application exercises
      5. Community & inspiration content
      
      Prioriteer content dat:
      - Past bij MBTI learning style
      - Addresses current wellness gaps
      - Builds on existing knowledge
      - Provides practical value
      - Motivates continued growth
    `;
    
    const recommendations = await this.chatLLM.generateRecommendations({
      prompt: curationPrompt,
      context: 'content_curation',
      outputFormat: 'structured_recommendations',
      personalization: {
        mbtiType: userProfile.mbtiType,
        levelOfDetail: this.getMBTIDetailPreference(userProfile.mbtiType),
        presentationStyle: this.getMBTIPresentationStyle(userProfile.mbtiType)
      }
    });
    
    return this.parseContentRecommendations(recommendations);
  }
  
  async generateContentInsights(
    contentItem: ContentItem,
    userMBTIType: MBTIType
  ): Promise<ContentInsights> {
    
    const insightPrompt = `
      Analyseer deze content voor een ${userMBTIType} gebruiker:
      
      Content: "${contentItem.title}"
      Beschrijving: ${contentItem.description}
      Type: ${contentItem.contentType}
      Levensgebied: ${contentItem.levensgebied.join(', ')}
      
      Genereer MBTI-specific insights:
      1. Waarom dit relevant is voor ${userMBTIType}
      2. Hoe ${userMBTIType} dit het beste kan benaderen
      3. Praktische application tips voor dit type
      4. Potentiële challenges en hoe die te overwinnen
      5. Connections met andere growth areas
      
      Maak het persoonlijk en actionable.
    `;
    
    const insights = await this.chatLLM.generateInsights({
      prompt: insightPrompt,
      context: 'content_analysis',
      mbtiOptimization: true
    });
    
    return this.parseContentInsights(insights);
  }
}
```

---

## **🎨 USER EXPERIENCE REQUIREMENTS**

### **Discovery Interface Design**
```typescript
// MBTI-Optimized Content Discovery Interfaces
interface ContentDiscoveryInterfaceConfig {
  
  // Systematic types prefer organized, searchable layouts
  systematicLayout: {
    structure: 'categorized-hierarchical';
    features: ['advanced-filtering', 'systematic-browsing', 'progress-tracking'];
    navigation: 'logical-menu-structure';
    presentation: 'detailed-metadata-display';
  };
  
  // Exploratory types prefer discovery-oriented layouts
  exploratoryLayout: {
    structure: 'discovery-focused';
    features: ['serendipitous-recommendations', 'visual-browsing', 'connection-mapping'];
    navigation: 'intuitive-exploration';
    presentation: 'visual-content-previews';
  };
  
  // Goal-oriented types prefer achievement-focused layouts
  goalOrientedLayout: {
    structure: 'pathway-and-progress';
    features: ['learning-paths', 'completion-tracking', 'skill-building-sequences'];
    navigation: 'goal-based-organization';
    presentation: 'progress-and-achievement-focused';
  };
  
  // Social types prefer community-integrated layouts
  socialLayout: {
    structure: 'community-enhanced';
    features: ['social-recommendations', 'shared-learning', 'community-feedback'];
    navigation: 'people-and-story-focused';
    presentation: 'social-proof-and-stories';
  };
}
```

### **"Back to Basics" Interface**
```typescript
interface BackToBasicsInterface {
  // Foundational content for each levensgebied
  foundationContent: {
    presentation: 'step-by-step-building-blocks';
    features: [
      'Progressive difficulty levels',
      'MBTI-adapted explanations',
      'Practical application exercises',
      'Real-world examples',
      'Assessment checkpoints'
    ];
    
    mbtiAdaptations: {
      conceptualTypes: 'Big picture overview followed by detailed exploration';
      practicalTypes: 'Immediate applications with theoretical background';
      socialTypes: 'Community examples and people-centered applications';
      individualTypes: 'Personal reflection and self-directed exploration';
    };
  };
  
  // Progress tracking through basics
  progressVisualization: {
    features: [
      'Mastery level indicators',
      'Knowledge gap identification',
      'Skill building pathways',
      'Foundation strength assessment'
    ];
  };
}
```

---

## **📱 COMPONENT REQUIREMENTS**

### **Shadcn Components Needed**
```typescript
import {
  Card,             // Content item cards
  Badge,            // Content categories and tags
  Button,           // Action buttons
  Input,            // Search functionality
  Select,           // Filtering options
  Tabs,             // Content type navigation
  Progress,         // Reading/completion progress
  Star,             // Rating system
  Bookmark,         // Save functionality
  Share,            // Social sharing
  Filter,           // Advanced filtering
  Search,           // Search interface
  Calendar,         // Scheduling and deadlines
  Clock,            // Time estimates
  Tag,              // Content tagging
  Grid,             // Content layout
  List,             // Alternative layout
  Pagination,       // Content navigation
  Tooltip,          // MBTI explanations
  Dialog,           // Content previews
  Accordion,        // Expandable sections
  Separator,        // Content dividers
  ScrollArea        // Long content lists
} from '@shadcn/ui';
```

### **Custom Components Needed**
```typescript
interface ContentDiscoveryComponents {
  ContentDiscoveryDashboard: React.ComponentType<{
    userMBTIType: MBTIType;
    wellnessScores: LevensgebiedScore[];
    onContentSelect: (contentId: string) => void;
  }>;
  
  ContentCard: React.ComponentType<{
    content: ContentItem;
    mbtiContext: MBTIContext;
    showProgress: boolean;
    onBookmark: () => void;
  }>;
  
  LearningPathway: React.ComponentType<{
    pathway: ContentCollection;
    userProgress: PathwayProgress;
    mbtiOptimized: boolean;
  }>;
  
  BackToBasicsNavigator: React.ComponentType<{
    levensgebied: LevensgebiedType;
    currentLevel: SkillLevel;
    mbtiType: MBTIType;
  }>;
  
  ContentRecommendationEngine: React.ComponentType<{
    recommendations: ContentRecommendation[];
    isGenerating: boolean;
    onRefresh: () => void;
  }>;
  
  MBTIContentFilter: React.ComponentType<{
    mbtiType: MBTIType;
    currentFilters: ContentFilter;
    onFilterChange: (filters: ContentFilter) => void;
  }>;
  
  ContentProgressTracker: React.ComponentType<{
    progress: ContentProgress[];
    goals: LearningGoal[];
    showAchievements: boolean;
  }>;
  
  IntelligentSearch: React.ComponentType<{
    searchQuery: string;
    mbtiContext: MBTIContext;
    onSearch: (query: string, filters: SearchFilter) => void;
  }>;
}
```

---

## **🔗 INTEGRATION REQUIREMENTS**

### **Wellness Dashboard Integration**
```typescript
interface WellnessContentIntegration {
  // Content recommendations based on wellness scores
  scoreBasedRecommendations: {
    lowScoreAreas: 'Prioritize foundational "Back to Basics" content';
    highScoreAreas: 'Suggest advanced and optimization content';
    balancedAreas: 'Provide maintenance and enrichment content';
    improvingAreas: 'Offer progressive and building content';
  };
  
  // Content impact on wellness tracking
  contentToWellnessTracking: {
    contentConsumption: 'Track which content correlates with score improvements';
    learningToProgress: 'Measure content effectiveness per MBTI type';
    recommendationSuccess: 'Optimize future recommendations based on outcomes';
  };
}
```

### **AI Coaching Integration**
```typescript
interface CoachingContentIntegration {
  // Content suggestions during coaching sessions
  coachingContentSuggestions: {
    sessionContext: 'Recommend relevant content based on coaching topics';
    insightSupport: 'Provide content that deepens coaching insights';
    actionSupport: 'Suggest content that supports coaching action plans';
  };
}
```

---

## **📊 PERFORMANCE & SCALABILITY**

### **Content Discovery Performance**
- **Search Results**: <2 seconds voor intelligent search results
- **Recommendations**: <3 seconds voor personalized content suggestions
- **Content Loading**: <1 second voor content preview and metadata
- **Offline Access**: Full content library browsing offline

### **Scalability Targets**
- **Content Volume**: Support voor 10,000+ content items
- **User Load**: Efficient recommendations voor 1000+ concurrent users
- **Search Performance**: Fast search across large content libraries
- **Personalization**: Real-time MBTI optimization

---

## **🧪 TESTING REQUIREMENTS**

### **Content Quality Testing**
- **MBTI Relevance**: Validate content matching accuracy per type
- **Levensgebied Alignment**: Test content categorization accuracy
- **Recommendation Quality**: Measure user satisfaction with suggestions
- **ChatLLM Insights**: Assess AI-generated content analysis quality

### **User Experience Testing**
- **Discovery Effectiveness**: Test content findability per MBTI type
- **Learning Path Completion**: Track pathway completion rates
- **"Back to Basics" Effectiveness**: Measure foundational learning success
- **Mobile Content Consumption**: Optimize mobile content experience

---

## **📋 ACCEPTANCE CRITERIA**

### **Definition of Done**
✅ **Functional Requirements**
- [ ] Content discovery system fully operational
- [ ] MBTI-optimized content matching working
- [ ] ChatLLM content curation generating quality recommendations
- [ ] "Back to Basics" pathways functional
- [ ] Learning progress tracking operational

✅ **Technical Requirements**
- [ ] Content repository integrated with V14 database
- [ ] Offline content access working
- [ ] Performance targets met
- [ ] Search functionality optimized
- [ ] Integration with wellness dashboard complete

✅ **User Experience Requirements**
- [ ] MBTI-specific discovery interfaces validated
- [ ] Content consumption experience optimized
- [ ] Learning pathway navigation intuitive
- [ ] Mobile content experience excellent
- [ ] Content quality and relevance high

**🎯 Ready voor Tasks Breakdown in tasks.md!**
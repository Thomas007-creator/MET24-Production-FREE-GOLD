# 📊 Holistisch Welzijn Dashboard - Product Requirements Document v1.0

## **🎯 VISION STATEMENT**
Een intelligente wellness dashboard die de 9 levensgebieden in real-time visualiseert met MBTI-geoptimaliseerde inzichten. Het biedt data-driven begeleiding voor holistische persoonlijke groei via ChatLLM-powered analyses en AI-3 actieplannen.

---

## **📊 BUSINESS REQUIREMENTS**

### **Primary Goals**
1. **Holistische Zelfbewustzijn**: 360° overzicht van levensgebieden met MBTI-optimization
2. **Data-Driven Groei**: Meetbare vooruitgang tracking per levensgebied
3. **MBTI-Specifieke Balancering**: Type-specifieke prioriteiten (INFP hobby's vs INTJ werk)
4. **Real-time Inzichten**: ChatLLM-generated analyses en recommendations
5. **Actieplan Integratie**: Directe verbinding met AI-3 voor concrete stappen

### **Success Metrics**
- **Engagement**: >85% gebruikers bekijken dashboard wekelijks
- **Balance Improvement**: >60% verbetering in laagst scorende levensgebieden
- **MBTI Accuracy**: >95% relevantie van type-specifieke recommendations
- **Action Conversion**: >70% ChatLLM suggestions leiden tot AI-3 plannen
- **User Satisfaction**: >4.6/5 voor dashboard usefulness

---

## **🔧 TECHNICAL REQUIREMENTS**

### **Core Architecture**
```typescript
// Integration met bestaande 9 levensgebieden systeem
interface WellnessDashboardSystem {
  levensgebiedenService: LevensgebiedenService;     // Existing V14 database
  mbtiOptimization: PersonalMBTICoachService;      // Type-specific insights
  chatLLMAnalyzer: ChatLLMService;                 // Real-time analysis
  ai3Integration: AI3ActionPlanService;            // Action plan generation
  v14Database: WatermelonDBV14;                    // Data persistence
  realTimeSync: V14SupabaseSync;                   // Live updates
}
```

### **9 Levensgebieden Integration**
```typescript
type Levensgebied = {
  id: string;
  name: 'Gezondheid' | 'Werk' | 'Financiën' | 'Relaties' | 'Familie' | 
       'Hobby\'s' | 'Spiritualiteit' | 'Persoonlijke Groei' | 'Bijdrage';
  currentScore: number; // 0-100
  mbtiRelevance: number; // MBTI-specific importance weight
  trendData: ScoreHistory[];
  lastUpdated: Date;
  chatLLMInsights: GeneratedInsight[];
  suggestedActions: ActionSuggestion[];
};

// MBTI-Specific Prioritization
type MBTILevensgebiedPriorities = {
  INFP: {
    primary: ['Hobby\'s', 'Persoonlijke Groei', 'Spiritualiteit'];
    secondary: ['Relaties', 'Familie', 'Bijdrage'];
    challenge: ['Financiën', 'Werk', 'Gezondheid'];
  };
  INTJ: {
    primary: ['Werk', 'Persoonlijke Groei', 'Financiën'];
    secondary: ['Gezondheid', 'Spiritualiteit', 'Bijdrage'];
    challenge: ['Relaties', 'Familie', 'Hobby\'s'];
  };
  // ... Complete mapping voor alle 16 types
};
```

### **ChatLLM Analysis Engine**
```typescript
interface ChatLLMWellnessAnalyzer {
  analyzePatterns(scores: LevensgebiedScore[], mbtiType: MBTIType): Promise<PatternAnalysis>;
  generateRecommendations(analysis: PatternAnalysis): Promise<WellnessRecommendation[]>;
  identifyImbalances(scores: LevensgebiedScore[], mbtiContext: MBTIContext): Promise<ImbalanceInsight[]>;
  predictGrowthOpportunities(trendData: ScoreTrend[], mbtiType: MBTIType): Promise<GrowthOpportunity[]>;
}

// Example ChatLLM prompts
const CHATLLM_WELLNESS_PROMPTS = {
  patternAnalysis: `
    Analyseer deze 9 levensgebieden scores voor een {mbtiType}:
    {scoresData}
    
    Identificeer:
    1. Sterkste gebieden (potentie voor verder uitbouwen)
    2. Zwakste gebieden (prioriteit voor verbetering)  
    3. MBTI-specifieke patronen
    4. Onbalans risico's
    5. Groei kansen
  `,
  
  recommendations: `
    Gebaseerd op deze analyse voor {mbtiType}:
    {analysisData}
    
    Genereer 3-5 concrete recommendations:
    1. Prioriteer op MBTI-strengths
    2. Address critical imbalances
    3. Leverage hoogste scores
    4. Improve laagste scores systematisch
  `
};
```

---

## **🎨 USER EXPERIENCE REQUIREMENTS**

### **Dashboard Layout Design**
```typescript
// MBTI-Optimized Dashboard Layouts
interface DashboardLayoutConfig {
  // Analytical Types (NT, ST) - Data-heavy, structured
  analytical: {
    layout: 'grid-detailed';
    charts: ['detailed-metrics', 'trend-analysis', 'correlation-charts'];
    dataDisplay: 'tables-and-numbers';
    colorScheme: 'blue-gray-professional';
  };
  
  // People-Oriented Types (NF, SF) - Visual, intuitive
  peopleOriented: {
    layout: 'radial-organic';
    charts: ['radar-chart', 'progress-circles', 'color-gradients'];
    dataDisplay: 'visual-metaphors';
    colorScheme: 'warm-earth-tones';
  };
  
  // Conceptual Types (NT, NF) - Big picture focus
  conceptual: {
    layout: 'minimal-overview';
    charts: ['summary-dashboard', 'key-insights', 'future-projections'];
    dataDisplay: 'high-level-summaries';
    colorScheme: 'vibrant-contrasts';
  };
  
  // Practical Types (ST, SF) - Action-oriented
  practical: {
    layout: 'action-focused';
    charts: ['progress-bars', 'checklist-style', 'step-indicators'];
    dataDisplay: 'actionable-items';
    colorScheme: 'green-success-focused';
  };
}
```

### **Interactive Elements**
- **Real-time Score Updates**: Live sync met V14 database
- **MBTI-Contextual Tooltips**: Type-specific explanations
- **ChatLLM Insight Cards**: Dynamic analysis results
- **AI-3 Action Integration**: Direct action plan generation
- **Progress Celebration**: Achievement notifications

---

## **📱 COMPONENT REQUIREMENTS**

### **Shadcn Components Needed**
```typescript
import {
  Card,             // Levensgebied cards
  Badge,            // Score indicators, MBTI type
  Progress,         // Score progress bars
  Tabs,             // Different dashboard views
  Button,           // Action triggers
  Tooltip,          // MBTI-specific explanations
  Alert,            // Insight notifications
  Separator,        // Section dividers
  ScrollArea,       // Long content areas
  Select,           // Time period selection
  Switch,           // View toggles
  Slider            // Score input sliders
} from '@shadcn/ui';

// Charts for data visualization
import {
  RadarChart,       // 9 levensgebieden radar
  LineChart,        // Trend over time
  BarChart,         // Score comparisons
  AreaChart,        // Progress areas
  DonutChart        // Balance overview
} from '@shadcn/charts';
```

### **Custom Components Needed**
```typescript
interface WellnessDashboardComponents {
  WellnessDashboard: React.ComponentType<{
    mbtiType: MBTIType;
    levensgebieden: Levensgebied[];
    onScoreUpdate: (gebied: string, score: number) => void;
  }>;
  
  LevensgebiedCard: React.ComponentType<{
    gebied: Levensgebied;
    mbtiContext: MBTIContext;
    showChatLLMInsights: boolean;
    onActionPlan: () => void;
  }>;
  
  RadarWellnessChart: React.ComponentType<{
    scores: LevensgebiedScore[];
    mbtiOptimized: boolean;
    showTargets: boolean;
  }>;
  
  ChatLLMInsightPanel: React.ComponentType<{
    insights: GeneratedInsight[];
    isGenerating: boolean;
    onRefresh: () => void;
  }>;
  
  BalanceAnalyzer: React.ComponentType<{
    scores: LevensgebiedScore[];
    mbtiType: MBTIType;
    showRecommendations: boolean;
  }>;
  
  ProgressTrendChart: React.ComponentType<{
    trendData: ScoreTrend[];
    timeframe: 'week' | 'month' | 'year';
    highlightMBTIRelevant: boolean;
  }>;
}
```

---

## **🔐 DATA & INTEGRATION REQUIREMENTS**

### **V14 Database Schema Extension**
```typescript
// Extend existing V14 schemas
interface WellnessDataModel {
  wellness_scores: {
    id: string;
    user_id: string;
    levensgebied: LevensgebiedType;
    score: number; // 0-100
    mbti_context: string; // JSON with MBTI-specific data
    recorded_at: Date;
    data_source: 'manual' | 'ai_generated' | 'imported';
    confidence: number; // 0-1
  };
  
  wellness_insights: {
    id: string;
    user_id: string;
    insight_type: 'pattern' | 'recommendation' | 'prediction';
    content: string;
    levensgebieden_affected: string[]; // JSON array
    chatllm_generated: boolean;
    mbti_optimized: boolean;
    confidence_score: number;
    user_feedback: 'helpful' | 'neutral' | 'not_helpful';
    created_at: Date;
  };
  
  wellness_goals: {
    id: string;
    user_id: string;
    levensgebied: LevensgebiedType;
    target_score: number;
    current_score: number;
    deadline: Date;
    mbti_aligned: boolean;
    ai3_action_plan_id?: string; // Link to AI-3 plans
    status: 'active' | 'completed' | 'paused';
  };
}
```

### **ChatLLM Integration Strategy**
```typescript
// ChatLLM Service voor Wellness Analysis
export class ChatLLMWellnessService {
  async analyzeWellnessPatterns(
    scores: LevensgebiedScore[], 
    mbtiType: MBTIType
  ): Promise<WellnessAnalysis> {
    
    const prompt = this.buildAnalysisPrompt(scores, mbtiType);
    
    const analysis = await this.chatLLM.generateAnalysis({
      prompt,
      context: 'wellness_dashboard',
      mbtiOptimization: true,
      outputFormat: 'structured_insights'
    });
    
    return this.parseWellnessAnalysis(analysis);
  }
  
  async generateBalanceRecommendations(
    imbalances: WellnessImbalance[],
    mbtiType: MBTIType
  ): Promise<BalanceRecommendation[]> {
    
    // Generate MBTI-specific recommendations
    const recommendations = await this.chatLLM.generateRecommendations({
      imbalances,
      mbtiContext: this.getMBTIContext(mbtiType),
      focusAreas: this.getMBTIPriorities(mbtiType),
      outputStyle: this.getMBTICommunicationStyle(mbtiType)
    });
    
    return recommendations;
  }
}
```

---

## **🚀 AI-3 INTEGRATION REQUIREMENTS**

### **Action Plan Generation Flow**
```typescript
// Direct integration with AI-3 Action Plans
interface WellnessToActionPlanFlow {
  triggerActionPlan(insight: WellnessInsight): Promise<AI3ActionPlan> {
    // 1. Analyze wellness insight for actionability
    const actionableElements = await this.extractActionableElements(insight);
    
    // 2. Generate AI-3 context
    const ai3Context = {
      sourceType: 'wellness_dashboard',
      levensgebied: insight.affectedAreas,
      mbtiType: insight.mbtiContext,
      currentScores: insight.relevantScores,
      targetImprovement: insight.recommendedImprovement
    };
    
    // 3. Trigger AI-3 action plan generation
    return await this.ai3Service.generateActionPlan(ai3Context);
  }
}
```

---

## **📈 PERFORMANCE & SCALABILITY**

### **Real-time Requirements**
- **Score Updates**: <1 second UI updates
- **ChatLLM Analysis**: <5 seconds voor pattern analysis
- **Chart Rendering**: <2 seconds voor complex visualizations
- **AI-3 Integration**: <3 seconds voor action plan trigger

### **Data Management**
- **Historical Data**: 2+ jaren score history per user
- **Insight Storage**: Unlimited ChatLLM insights met search
- **Offline Support**: Full dashboard functionality offline
- **Sync Performance**: <5 seconds voor complete wellness data sync

---

## **🧪 TESTING REQUIREMENTS**

### **MBTI-Specific Testing**
- **Type Validation**: Test alle 16 MBTI types voor layout optimization
- **Priority Accuracy**: Verify MBTI-specific levensgebied prioritization
- **Recommendation Quality**: Test ChatLLM output relevance per type
- **Balance Detection**: Verify imbalance identification accuracy

### **Data Accuracy Testing**
- **Score Calculations**: Verify trend analysis algorithms
- **Pattern Recognition**: Test ChatLLM pattern detection
- **Integration Testing**: Full workflow van dashboard → AI-3 plans
- **Performance Testing**: Load testing met 1000+ users simultaneous

---

## **📋 ACCEPTANCE CRITERIA**

### **Definition of Done**
✅ **Functional Requirements**
- [ ] 9 levensgebieden dashboard fully functional
- [ ] MBTI-optimized layouts voor alle types
- [ ] ChatLLM integration generating quality insights
- [ ] Real-time score updates working
- [ ] AI-3 action plan integration complete

✅ **Technical Requirements**
- [ ] V14 database schema extended
- [ ] Shadcn chart integration complete
- [ ] Performance targets met
- [ ] Offline functionality working
- [ ] Supabase sync optimized

✅ **User Experience Requirements**
- [ ] MBTI-specific design validation complete
- [ ] Mobile-responsive dashboard verified
- [ ] Accessibility standards met
- [ ] User journey flow validated
- [ ] Progress tracking functional

**🎯 Ready voor Tasks Breakdown in tasks.md!**
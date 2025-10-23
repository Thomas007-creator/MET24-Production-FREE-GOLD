# 🎯 AI-3 Persoonlijk Actieplan - Product Requirements Document v1.0

## **🎯 VISION STATEMENT**
Een intelligente actieplan generator die inzichten omzet in concrete, MBTI-geoptimaliseerde stappen via Plotinus' AI-3 (Goodness) emanatie. ChatLLM creëert dynamische plannen gebaseerd op context van coaching, wellness, en journaling voor tastbare persoonlijke groei.

---

## **📊 BUSINESS REQUIREMENTS**

### **Primary Goals**
1. **Inzicht-naar-Actie Brug**: Seamless transformatie van insights naar executable steps
2. **MBTI-Geoptimaliseerde Planning**: Type-specific action planning approaches
3. **AI-3 Plotinus Integration**: Ethical, practical goodness-focused actions
4. **Dynamic Plan Evolution**: ChatLLM-powered plan adaptation based op progress
5. **Cross-Feature Integration**: Actions van coaching, wellness, journaling unified

### **MBTI-Specific Action Planning Approaches**
```typescript
type MBTIActionPlanningStyles = {
  // Judging Types (J) - Structured, goal-oriented planning
  judgingTypes: {
    planStructure: 'hierarchical-goals';
    timeframes: 'specific-deadlines';
    progressTracking: 'milestone-based';
    actionFormat: 'detailed-step-by-step';
    motivationalApproach: 'achievement-focused';
  };
  
  // Perceiving Types (P) - Flexible, adaptive planning
  perceivingTypes: {
    planStructure: 'flexible-themes';
    timeframes: 'rough-guidelines';
    progressTracking: 'momentum-based';
    actionFormat: 'options-and-alternatives';
    motivationalApproach: 'exploration-focused';
  };
  
  // Thinking Types (T) - Logic-driven action planning
  thinkingTypes: {
    actionJustification: 'logical-reasoning';
    successMetrics: 'quantifiable-outcomes';
    problemSolving: 'systematic-analysis';
    decisionMaking: 'objective-criteria';
    feedbackStyle: 'direct-improvement-focused';
  };
  
  // Feeling Types (F) - Value-driven action planning
  feelingTypes: {
    actionJustification: 'value-alignment';
    successMetrics: 'qualitative-wellbeing';
    problemSolving: 'empathetic-approach';
    decisionMaking: 'impact-on-people';
    feedbackStyle: 'encouraging-growth-focused';
  };
  
  // Specific type examples
  INTJ: {
    preferredFormat: 'Strategic roadmap met long-term vision';
    actionScope: 'High-level initiatives met tactical steps';
    timeHorizon: '3-12 months strategic planning';
    successDefinition: 'Measurable progress toward vision';
  };
  
  INFP: {
    preferredFormat: 'Value-aligned journey met meaningful milestones';
    actionScope: 'Personal development met impact on others';
    timeHorizon: 'Organic timeline based op inner readiness';
    successDefinition: 'Authentic self-expression en growth';
  };
  
  ESTJ: {
    preferredFormat: 'Detailed project plan met clear deliverables';
    actionScope: 'Practical improvements met immediate impact';
    timeHorizon: 'Short-term goals (1-3 months) leading to bigger outcomes';
    successDefinition: 'Completed tasks en measurable results';
  };
  
  ESFP: {
    preferredFormat: 'Fun, engaging activities met social elements';
    actionScope: 'Personal experiences en relationship building';
    timeHorizon: 'Flexible timeline based op energy en interest';
    successDefinition: 'Positive experiences en meaningful connections';
  };
};
```

### **Success Metrics**
- **Action Completion**: >65% van generated actions worden completed
- **Plan Relevance**: >4.5/5 user rating voor action plan quality
- **MBTI Alignment**: >90% users find plans match their working style
- **Cross-Feature Integration**: >80% plans successfully incorporate multi-source insights
- **Progress Tracking**: >75% users actively track en update progress

---

## **🔧 TECHNICAL REQUIREMENTS**

### **Core Architecture**
```typescript
interface AI3ActionPlanSystem {
  // Core AI-3 Services
  plotinusAI3: HogerZelfAIService;                  // Existing AI-3 Goodness emanation
  actionPlanGenerator: AI3ActionPlanGenerator;      // New intelligent plan creation
  chatLLMPlanOptimizer: ChatLLMActionOptimizer;     // Dynamic plan optimization
  mbtiActionAdapter: MBTIActionPlanAdapter;         // Type-specific adaptations
  
  // Integration Services
  coachingIntegration: CoachingActionIntegration;   // From coaching insights
  wellnessIntegration: WellnessActionIntegration;   // From wellness dashboard
  journalingIntegration: JournalActionIntegration;  // From journal insights
  
  // Execution & Tracking
  actionExecutor: ActionExecutionService;           // Progress tracking & updates
  planEvolution: DynamicPlanEvolution;             // ChatLLM-powered adaptations
  
  // Data Layer
  v14Database: WatermelonDBV14;                     // Action plan persistence
  progressTracking: ProgressTrackingService;       // Execution monitoring
}
```

### **Action Plan Data Model**
```typescript
interface ActionPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  
  // Source Context
  sourceType: 'coaching' | 'wellness' | 'journaling' | 'manual' | 'ai_generated';
  sourceInsights: InsightReference[];              // Links to originating insights
  mbtiOptimized: boolean;
  
  // AI-3 Integration
  plotinusContext: {
    goodnessAlignment: number;                      // 0-1 ethical alignment score
    practicalityScore: number;                      // 0-1 actionability score
    hogerZelfContribution: string;                  // How this serves Hogere Zelf
    levensgebiedImpact: LevensgebiedImpact[];      // Which life areas this affects
  };
  
  // Plan Structure
  actions: Action[];
  timeframe: {
    startDate: Date;
    targetEndDate: Date;
    estimatedDuration: number;                      // hours
    flexibility: 'rigid' | 'moderate' | 'flexible'; // MBTI P/J preference
  };
  
  // Progress & Evolution
  currentStatus: 'draft' | 'active' | 'paused' | 'completed' | 'evolved';
  progressMetrics: ProgressMetrics;
  evolutionHistory: PlanEvolution[];               // ChatLLM adaptations over time
  
  // MBTI Context
  mbtiType: MBTIType;
  mbtiAdaptations: MBTIActionAdaptations;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt: Date;
  nextReviewDate: Date;
}

interface Action {
  id: string;
  planId: string;
  title: string;
  description: string;
  
  // Action Details
  category: ActionCategory;
  priority: 'low' | 'medium' | 'high' | 'critical';
  difficulty: 'easy' | 'moderate' | 'challenging' | 'expert';
  estimatedTime: number;                            // minutes
  
  // Dependencies & Sequencing
  prerequisites: string[];                          // Other action IDs
  dependentActions: string[];                       // Actions that depend on this
  sequencePosition: number;
  
  // Execution
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped' | 'blocked';
  actualTimeSpent?: number;
  completionDate?: Date;
  
  // MBTI Optimization
  mbtiAdaptation: {
    workingStyle: string;                           // How to approach this action
    motivationalFraming: string;                    // Why this matters for this type
    supportResources: string[];                     // Type-specific help
  };
  
  // AI-3 Context
  ethicalConsideration: string;                     // Goodness/ethics aspect
  practicalSteps: string[];                         // Concrete implementation
  expectedOutcome: string;
  
  // Feedback & Learning
  userFeedback?: ActionFeedback;
  chatLLMSuggestions: string[];
  improvementOpportunities: string[];
}
```

### **AI-3 Integration with Existing HogerZelfAIService**
```typescript
// Extend existing AI-3 functionality for action planning
export class AI3ActionPlanGenerator extends HogerZelfAIService {
  
  async generateActionPlanFromInsights(
    insights: Insight[],
    mbtiType: MBTIType,
    context: ActionPlanContext
  ): Promise<ActionPlan> {
    
    // 1. Use existing AI-3 generateAI3ActionPlan as foundation
    const baseAI3Plan = await this.generateAI3ActionPlan(
      this.synthesizeInsightsToPrompt(insights),
      {
        mbtiType,
        emanationFocus: 'goodness',
        actionContext: context
      }
    );
    
    // 2. Enhance with MBTI-specific adaptations
    const mbtiAdaptedPlan = await this.adaptPlanForMBTI(baseAI3Plan, mbtiType);
    
    // 3. Add ChatLLM optimization
    const optimizedPlan = await this.chatLLMOptimizePlan(mbtiAdaptedPlan, context);
    
    // 4. Structure into executable format
    return this.structureActionPlan(optimizedPlan, insights, mbtiType);
  }
  
  private async adaptPlanForMBTI(
    basePlan: any,
    mbtiType: MBTIType
  ): Promise<MBTIAdaptedPlan> {
    
    const mbtiStrategy = MBTIActionPlanningStyles[mbtiType.toString()];
    
    return {
      ...basePlan,
      structure: mbtiStrategy.planStructure,
      timeframes: this.adaptTimeframes(basePlan.timeframes, mbtiStrategy),
      actions: this.adaptActions(basePlan.actions, mbtiStrategy),
      motivationalFraming: this.createMBTIMotivation(basePlan, mbtiType),
      progressTracking: mbtiStrategy.progressTracking
    };
  }
  
  private async chatLLMOptimizePlan(
    plan: MBTIAdaptedPlan,
    context: ActionPlanContext
  ): Promise<OptimizedActionPlan> {
    
    const optimizationPrompt = `
      Optimaliseer dit actieplan voor een ${context.mbtiType}:
      
      Huidig plan:
      ${JSON.stringify(plan, null, 2)}
      
      Context:
      - Bron insights: ${context.sourceInsights}
      - Levensgebieden focus: ${context.levensgebiedenFocus}
      - Beschikbare tijd: ${context.availableTime}
      - Huidige omstandigheden: ${context.currentCircumstances}
      
      Verbeter het plan door:
      1. Acties te prioriteren op MBTI-strengths
      2. Realistische timing toe te voegen
      3. Potentiële obstacles te identificeren
      4. Motivational framing te optimaliseren
      5. Concrete next steps te definiëren
      
      Geef een geoptimaliseerd plan terug in JSON format.
    `;
    
    const optimizedResult = await this.chatLLM.generateStructuredResponse({
      prompt: optimizationPrompt,
      outputFormat: 'json',
      context: 'action_plan_optimization'
    });
    
    return this.parseOptimizedPlan(optimizedResult);
  }
}
```

---

## **🔄 CROSS-FEATURE INTEGRATION REQUIREMENTS**

### **Integration with Other Features**
```typescript
interface CrossFeatureActionGeneration {
  
  // From AI Coaching Sessions
  fromCoachingInsights: {
    triggerConditions: [
      'Coaching session completion',
      'Major insight generation',
      'MBTI development area identified',
      'Hogere Zelf milestone reached'
    ];
    
    actionGeneration: async (coachingSession: CoachingSession) => {
      const insights = coachingSession.insights;
      const mbtiContext = coachingSession.mbtiType;
      
      return await this.ai3Generator.generateActionPlanFromInsights(
        insights,
        mbtiContext,
        {
          sourceType: 'coaching',
          urgency: 'high', // Coaching insights are typically high-priority
          timeframe: 'immediate_to_short_term',
          focusArea: coachingSession.currentPhase.name
        }
      );
    };
  };
  
  // From Wellness Dashboard
  fromWellnessInsights: {
    triggerConditions: [
      'Levensgebied imbalance detected',
      'ChatLLM wellness recommendation generated',
      'Target score gap identified',
      'Pattern analysis suggests action needed'
    ];
    
    actionGeneration: async (wellnessInsight: WellnessInsight) => {
      return await this.ai3Generator.generateTargetedActions(
        wellnessInsight.affectedLevensgebieden,
        wellnessInsight.recommendedImprovements,
        {
          sourceType: 'wellness',
          priority: this.calculateWellnessPriority(wellnessInsight),
          timeframe: 'medium_term',
          measurableOutcomes: true
        }
      );
    };
  };
  
  // From Journaling & Active Imagination
  fromJournalingInsights: {
    triggerConditions: [
      'Pattern recognition in journal entries',
      'Emotional breakthrough identified',
      'Active imagination session completion',
      'Personal growth opportunity detected'
    ];
    
    actionGeneration: async (journalInsight: JournalInsight) => {
      return await this.ai3Generator.generateReflectiveActions(
        journalInsight.patterns,
        journalInsight.emotionalThemes,
        {
          sourceType: 'journaling',
          approach: 'gradual_integration',
          privacyLevel: 'personal',
          reflectiveComponent: true
        }
      );
    };
  };
}
```

---

## **🎨 USER EXPERIENCE REQUIREMENTS**

### **Action Plan Interface Design**
```typescript
// MBTI-Optimized Action Plan Interfaces
interface ActionPlanInterfaceConfig {
  
  // Structured types (J) prefer detailed, organized layouts
  structuredLayout: {
    format: 'hierarchical-checklist';
    features: ['progress-bars', 'milestone-tracking', 'deadline-countdown'];
    visualization: 'gantt-style-timeline';
    sorting: 'priority-and-sequence';
  };
  
  // Flexible types (P) prefer adaptable, organic layouts
  flexibleLayout: {
    format: 'card-based-kanban';
    features: ['drag-drop-reordering', 'adaptive-grouping', 'mood-based-sorting'];
    visualization: 'flow-based-connections';
    sorting: 'energy-and-interest';
  };
  
  // Thinking types (T) prefer logic-driven presentations
  analyticalPresentation: {
    dataElements: ['success-metrics', 'risk-assessment', 'resource-requirements'];
    reasoningDisplay: 'logic-chains-and-decision-trees';
    feedbackStyle: 'objective-progress-metrics';
  };
  
  // Feeling types (F) prefer value-driven presentations
  valueBasedPresentation: {
    dataElements: ['impact-on-others', 'personal-meaning', 'value-alignment'];
    reasoningDisplay: 'story-and-personal-relevance';
    feedbackStyle: 'encouragement-and-growth-celebration';
  };
}
```

### **Dynamic Plan Evolution Interface**
```typescript
interface PlanEvolutionUI {
  // ChatLLM-powered plan updates
  dynamicUpdates: {
    features: [
      'Real-time plan optimization suggestions',
      'Progress-based action adjustments',
      'Obstacle detection and alternative routes',
      'MBTI-informed adaptation recommendations'
    ];
    
    userInteraction: {
      acceptSuggestions: 'One-click plan updates';
      provideFeedback: 'Why this suggestion helps/doesn\'t help';
      customizeAdaptations: 'Manual tweaking of AI suggestions';
      rollbackChanges: 'Revert to previous plan versions';
    };
  };
  
  // Progress visualization and motivation
  progressVisualization: {
    mbtiOptimized: {
      achievementFocused: 'Progress bars, completion percentages, milestone celebrations';
      processOriented: 'Journey maps, growth curves, learning insights';
      sociallyMotivated: 'Impact on others, community contribution, shared achievements';
      personallyDriven: 'Self-reflection prompts, value alignment, authentic growth';
    };
  };
}
```

---

## **📱 COMPONENT REQUIREMENTS**

### **Shadcn Components Needed**
```typescript
import {
  Card,             // Action plan cards
  Checkbox,         // Action completion checkboxes
  Progress,         // Plan progress tracking
  Badge,            // Priority and category badges
  Button,           // Action triggers
  Calendar,         // Timeline and deadline management
  Tabs,             // Different plan views
  Select,           // Priority and category selection
  Textarea,         // Action descriptions and notes
  Dialog,           // Action editing modals
  Alert,            // Progress notifications and suggestions
  Separator,        // Section dividers
  Tooltip,          // MBTI-specific help text
  Switch,           // Feature toggles
  Slider,           // Priority and difficulty sliders
  Accordion         // Expandable action details
} from '@shadcn/ui';

// Charts for progress visualization
import {
  LineChart,        // Progress over time
  BarChart,         // Action completion rates
  RadarChart,       // Multi-dimensional progress
  GanttChart        // Timeline visualization
} from '@shadcn/charts';
```

### **Custom Components Needed**
```typescript
interface ActionPlanComponents {
  ActionPlanDashboard: React.ComponentType<{
    plans: ActionPlan[];
    mbtiType: MBTIType;
    onPlanSelect: (planId: string) => void;
  }>;
  
  ActionPlanEditor: React.ComponentType<{
    plan?: ActionPlan;
    sourceInsights: Insight[];
    mbtiOptimizations: boolean;
    onSave: (plan: ActionPlan) => void;
  }>;
  
  ActionCard: React.ComponentType<{
    action: Action;
    mbtiContext: MBTIContext;
    onStatusUpdate: (actionId: string, status: ActionStatus) => void;
  }>;
  
  PlanEvolutionSuggestions: React.ComponentType<{
    suggestions: PlanSuggestion[];
    isGenerating: boolean;
    onAcceptSuggestion: (suggestionId: string) => void;
  }>;
  
  ProgressVisualization: React.ComponentType<{
    plan: ActionPlan;
    mbtiVisualizationStyle: MBTIVisualizationStyle;
    timeframe: 'daily' | 'weekly' | 'monthly';
  }>;
  
  CrossFeatureIntegrationPanel: React.ComponentType<{
    availableInsights: Insight[];
    generatedFromSources: SourceType[];
    onGenerateActions: (insights: Insight[]) => void;
  }>;
}
```

---

## **📊 PERFORMANCE & SCALABILITY**

### **AI-3 Generation Performance**
- **Action Plan Creation**: <8 seconds van insight naar complete plan
- **ChatLLM Optimization**: <5 seconds voor plan improvements
- **Real-time Updates**: <2 seconds voor progress tracking updates
- **Cross-Feature Integration**: <3 seconds voor insight consolidation

### **Data Management**
- **Plan Storage**: Efficient V14 database integration
- **Version History**: Complete evolution tracking per plan
- **Offline Support**: Full action plan management offline
- **Sync Performance**: <5 seconds voor complete plan synchronization

---

## **🧪 TESTING REQUIREMENTS**

### **AI-3 Integration Testing**
- **Plotinus Consistency**: Verify AI-3 Goodness alignment in all generated actions
- **MBTI Accuracy**: Test action plan relevance voor alle 16 types
- **Cross-Feature Integration**: Validate smooth insight-to-action workflows
- **ChatLLM Quality**: Assess plan optimization effectiveness

### **User Experience Testing**
- **Completion Rates**: Track actual action completion vs predicted
- **Plan Evolution**: Test adaptive plan improvement over time
- **MBTI Satisfaction**: User feedback on type-specific optimizations
- **Performance**: Load testing voor real-time plan generation

---

## **📋 ACCEPTANCE CRITERIA**

### **Definition of Done**
✅ **Functional Requirements**
- [ ] AI-3 action plan generation fully functional
- [ ] MBTI-optimized planning approaches implemented
- [ ] Cross-feature integration working seamlessly
- [ ] ChatLLM plan optimization operational
- [ ] Dynamic plan evolution functioning

✅ **Technical Requirements**
- [ ] Integration with existing HogerZelfAIService AI-3
- [ ] V14 database schema extended for action plans
- [ ] Performance targets met
- [ ] Offline functionality maintained
- [ ] Data consistency across features

✅ **User Experience Requirements**
- [ ] MBTI-specific interfaces validated
- [ ] Cross-feature workflow smooth
- [ ] Progress tracking motivational
- [ ] Plan evolution intuitive
- [ ] Action completion rates satisfactory

**🎯 Ready voor Tasks Breakdown in tasks.md!**
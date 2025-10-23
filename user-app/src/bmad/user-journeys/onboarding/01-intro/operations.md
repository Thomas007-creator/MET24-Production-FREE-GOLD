# Onboarding Step 1: Intro Page - Operations

## Atomic Operations

### Core User Operations

#### 1. Page Load Operation
```typescript
interface PageLoadOperation {
  // Input: User navigation to onboarding
  trigger: 'direct_navigation' | 'redirect' | 'deep_link';
  
  // Atomic steps
  steps: [
    'initialize_component',
    'detect_user_preferences',
    'load_base_content',
    'apply_mbti_hints',
    'render_ui',
    'track_page_view'
  ];
  
  // Expected outcome
  result: {
    contentDisplayed: true;
    progressTracked: true;
    userEngaged: boolean;
  };
  
  // Error scenarios
  errors: [
    'content_load_failed',
    'render_error',
    'analytics_failure'
  ];
}

// Implementation
async function executePageLoad(trigger: LoadTrigger): Promise<PageLoadResult> {
  try {
    // 1. Initialize component state
    const initialState = initializeComponentState();
    
    // 2. Detect user preferences
    const userPrefs = await detectUserPreferences();
    
    // 3. Load content based on preferences
    const content = await loadContentForUser(userPrefs);
    
    // 4. Apply MBTI hints if available
    const adaptedContent = applyMBTIAdaptations(content, userPrefs.mbtiHint);
    
    // 5. Render UI
    renderIntroContent(adaptedContent);
    
    // 6. Track successful page view
    trackEvent('onboarding_step_1_viewed', {
      trigger,
      loadTime: performance.now(),
      userPrefs
    });
    
    return { success: true, content: adaptedContent };
  } catch (error) {
    handlePageLoadError(error);
    return { success: false, error };
  }
}
```

#### 2. Content Interaction Operation
```typescript
interface ContentInteractionOperation {
  // Input: User interacts with content
  interactionType: 'scroll' | 'hover' | 'focus' | 'click';
  target: string; // Element identifier
  
  // Atomic steps
  steps: [
    'capture_interaction',
    'validate_interaction',
    'update_engagement_metrics',
    'trigger_adaptive_response',
    'track_interaction'
  ];
  
  // Expected outcome
  result: {
    engagementUpdated: true;
    responseTriggered: boolean;
    analyticsRecorded: true;
  };
}

// Implementation
function handleContentInteraction(
  type: InteractionType,
  target: string,
  event: Event
): InteractionResult {
  // 1. Capture interaction details
  const interaction = {
    type,
    target,
    timestamp: Date.now(),
    coordinates: getEventCoordinates(event),
    duration: calculateInteractionDuration(event)
  };
  
  // 2. Validate interaction (prevent spam, bots)
  if (!validateInteraction(interaction)) {
    return { success: false, reason: 'invalid_interaction' };
  }
  
  // 3. Update engagement metrics
  updateEngagementMetrics(interaction);
  
  // 4. Trigger adaptive response
  const response = triggerAdaptiveResponse(interaction);
  
  // 5. Track for analytics
  trackEvent('content_interaction', {
    ...interaction,
    response
  });
  
  return { success: true, interaction, response };
}
```

#### 3. CTA Click Operation
```typescript
interface CTAClickOperation {
  // Input: User clicks "Get Started" button
  buttonId: string;
  userIntent: 'primary_action' | 'exploration';
  
  // Atomic steps
  steps: [
    'validate_click',
    'capture_user_state',
    'save_step_progress',
    'prepare_next_step',
    'navigate_to_step_2'
  ];
  
  // Expected outcome
  result: {
    progressSaved: true;
    navigationSuccessful: true;
    stepCompleted: true;
  };
}

// Implementation
async function handleCTAClick(
  buttonId: string,
  event: ClickEvent
): Promise<CTAClickResult> {
  try {
    // 1. Validate click (prevent double-clicks, bots)
    if (!validateCTAClick(buttonId, event)) {
      return { success: false, reason: 'invalid_click' };
    }
    
    // 2. Capture current user state
    const userState = captureUserState({
      timeSpent: getTimeSpentOnStep(),
      interactions: getInteractionHistory(),
      contentViewed: getViewedContent()
    });
    
    // 3. Save step progress
    await saveStepProgress(1, {
      completed: true,
      completedAt: new Date(),
      userState,
      nextStep: 2
    });
    
    // 4. Prepare next step data
    const nextStepData = await prepareStepData(2, userState);
    
    // 5. Navigate to step 2
    const navigation = await navigateToStep(2, nextStepData);
    
    // Track successful completion
    trackEvent('onboarding_step_1_completed', {
      buttonId,
      userState,
      navigationTime: navigation.duration
    });
    
    return {
      success: true,
      nextStep: 2,
      userData: userState
    };
  } catch (error) {
    handleCTAError(error);
    return { success: false, error };
  }
}
```

### Support Operations

#### 4. MBTI Hint Detection Operation
```typescript
interface MBTIHintOperation {
  // Input: User behavior patterns
  behaviorData: UserBehaviorData;
  
  // Atomic steps
  steps: [
    'analyze_interaction_patterns',
    'calculate_mbti_probabilities',
    'select_highest_confidence_hint',
    'apply_content_adaptation',
    'track_hint_application'
  ];
  
  // Expected outcome
  result: {
    hintDetected: boolean;
    confidenceLevel: number;
    adaptationApplied: boolean;
  };
}

// Implementation
function detectMBTIHint(behaviorData: UserBehaviorData): MBTIHintResult {
  // 1. Analyze interaction patterns
  const patterns = analyzeInteractionPatterns(behaviorData);
  
  // 2. Calculate MBTI probabilities
  const probabilities = calculateMBTIProbabilities(patterns);
  
  // 3. Select highest confidence hint (min 60% confidence)
  const hint = selectMBTIHint(probabilities, 0.6);
  
  if (!hint) {
    return { hintDetected: false };
  }
  
  // 4. Apply content adaptation
  const adaptation = applyContentAdaptation(hint.type);
  
  // 5. Track hint application
  trackEvent('mbti_hint_detected', {
    type: hint.type,
    confidence: hint.confidence,
    adaptationApplied: adaptation.success
  });
  
  return {
    hintDetected: true,
    type: hint.type,
    confidence: hint.confidence,
    adaptation
  };
}
```

#### 5. Error Recovery Operation
```typescript
interface ErrorRecoveryOperation {
  // Input: Error occurred during step
  error: OnboardingError;
  context: ErrorContext;
  
  // Atomic steps
  steps: [
    'classify_error',
    'determine_recovery_strategy',
    'execute_recovery_action',
    'validate_recovery',
    'report_error_and_recovery'
  ];
  
  // Expected outcome
  result: {
    errorResolved: boolean;
    userExperiencePreserved: boolean;
    errorReported: true;
  };
}

// Implementation
async function executeErrorRecovery(
  error: OnboardingError,
  context: ErrorContext
): Promise<ErrorRecoveryResult> {
  // 1. Classify error type and severity
  const errorClassification = classifyError(error);
  
  // 2. Determine recovery strategy
  const strategy = determineRecoveryStrategy(errorClassification, context);
  
  try {
    // 3. Execute recovery action
    const recoveryAction = await executeRecoveryAction(strategy);
    
    // 4. Validate recovery was successful
    const validationResult = await validateRecovery(recoveryAction);
    
    // 5. Report error and recovery
    reportErrorAndRecovery({
      error,
      context,
      strategy,
      recoveryAction,
      validationResult
    });
    
    return {
      success: validationResult.success,
      strategy: strategy.type,
      actionTaken: recoveryAction.description
    };
  } catch (recoveryError) {
    // Recovery failed, escalate
    escalateError({ originalError: error, recoveryError });
    return {
      success: false,
      error: recoveryError,
      escalated: true
    };
  }
}
```

## Composite Operations

### Multi-Step Workflows

#### 1. Complete Step 1 Workflow
```typescript
interface CompleteStep1Workflow {
  // Orchestrates entire step 1 experience
  operations: [
    PageLoadOperation,
    ContentInteractionOperation[],
    MBTIHintOperation,
    CTAClickOperation
  ];
  
  // Transaction boundary
  transactionScope: 'step_completion';
  
  // Rollback procedures
  rollbackActions: [
    'restore_previous_step',
    'clear_invalid_progress',
    'reset_user_state'
  ];
}

// Implementation
async function executeCompleteStep1Workflow(
  user: UserContext
): Promise<WorkflowResult> {
  const transaction = beginStepTransaction(1);
  
  try {
    // Execute workflow steps
    const pageLoad = await executePageLoad('navigation');
    const interactions = await trackUserInteractions();
    const mbtiHint = detectMBTIHint(interactions.behaviorData);
    const completion = await handleStepCompletion();
    
    // Commit transaction
    await transaction.commit({
      pageLoad,
      interactions,
      mbtiHint,
      completion
    });
    
    return { success: true, nextStep: 2 };
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    return { success: false, error };
  }
}
```

#### 2. Adaptive Content Loading Workflow
```typescript
interface AdaptiveContentWorkflow {
  // Loads and adapts content based on user context
  operations: [
    'detect_user_context',
    'load_base_content',
    'apply_mbti_adaptations',
    'apply_cultural_adaptations',
    'optimize_for_device',
    'render_adapted_content'
  ];
}

// Implementation
async function executeAdaptiveContentWorkflow(
  userContext: UserContext
): Promise<AdaptedContentResult> {
  // 1. Detect comprehensive user context
  const context = await detectUserContext({
    device: userContext.device,
    language: userContext.language,
    accessibility: userContext.accessibility,
    mbtiHint: userContext.mbtiHint
  });
  
  // 2. Load base content
  const baseContent = await loadBaseContent('step_1', context.language);
  
  // 3. Apply MBTI adaptations
  const mbtiAdapted = applyMBTIAdaptations(baseContent, context.mbtiHint);
  
  // 4. Apply cultural adaptations
  const culturallyAdapted = applyCulturalAdaptations(mbtiAdapted, context.culture);
  
  // 5. Optimize for device
  const deviceOptimized = optimizeForDevice(culturallyAdapted, context.device);
  
  // 6. Render adapted content
  const rendered = await renderAdaptedContent(deviceOptimized);
  
  return {
    success: true,
    content: rendered,
    adaptations: {
      mbti: context.mbtiHint,
      cultural: context.culture,
      device: context.device
    }
  };
}
```

## Performance Operations

### Optimization Operations

#### 1. Content Preloading Operation
```typescript
// Preload next steps for faster navigation
async function preloadNextSteps(): Promise<PreloadResult> {
  const preloadTasks = [
    preloadStepContent(2), // Next step
    preloadStepContent(3), // Step after next
    preloadMBTIAssessment(), // Important step 8
  ];
  
  const results = await Promise.allSettled(preloadTasks);
  
  return {
    preloadedSteps: results.filter(r => r.status === 'fulfilled').length,
    failedPreloads: results.filter(r => r.status === 'rejected').length
  };
}
```

#### 2. Performance Monitoring Operation
```typescript
// Monitor and report performance metrics
function monitorStepPerformance(): PerformanceMonitor {
  const metrics = {
    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
    renderTime: performance.getEntriesByType('measure')[0]?.duration || 0,
    interactionTime: calculateTimeToInteractive(),
    memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
  };
  
  // Report if metrics exceed thresholds
  if (metrics.loadTime > 3000) {
    reportPerformanceIssue('slow_load', metrics);
  }
  
  return { metrics, thresholdsExceeded: checkThresholds(metrics) };
}
```

## Error Operations

### Error Detection Operations

#### 1. Automated Error Detection
```typescript
// Continuously monitor for errors
function startErrorDetection(): ErrorDetector {
  const detector = {
    // JavaScript errors
    scriptErrors: monitorScriptErrors(),
    
    // Network failures
    networkErrors: monitorNetworkFailures(),
    
    // User interaction failures
    interactionErrors: monitorInteractionFailures(),
    
    // Performance degradation
    performanceErrors: monitorPerformanceDegradation()
  };
  
  return detector;
}
```

#### 2. User Experience Error Detection
```typescript
// Detect UX issues that don't throw errors
function detectUXIssues(): UXIssueDetector {
  return {
    // Excessive load time
    slowLoading: detectSlowLoading(),
    
    // User confusion (multiple rapid clicks)
    userConfusion: detectUserConfusion(),
    
    // Accessibility violations
    accessibilityIssues: detectAccessibilityViolations(),
    
    // Content rendering issues
    renderingProblems: detectRenderingProblems()
  };
}
```

## Analytics Operations

### Event Tracking Operations

#### 1. Engagement Analytics
```typescript
// Track detailed user engagement
function trackEngagementAnalytics(): EngagementTracker {
  return {
    // Time-based metrics
    timeMetrics: trackTimeMetrics(),
    
    // Interaction patterns
    interactionPatterns: trackInteractionPatterns(),
    
    // Content consumption
    contentConsumption: trackContentConsumption(),
    
    // Conversion indicators
    conversionIndicators: trackConversionIndicators()
  };
}
```

#### 2. MBTI Analytics
```typescript
// Track MBTI-related analytics
function trackMBTIAnalytics(type: MBTIType): MBTIAnalytics {
  return {
    // Adaptation effectiveness
    adaptationEffectiveness: measureAdaptationEffectiveness(type),
    
    // Engagement by personality type
    personalityEngagement: measurePersonalityEngagement(type),
    
    // Content preferences
    contentPreferences: analyzeContentPreferences(type),
    
    // Conversion rates by type
    conversionRates: analyzeConversionRates(type)
  };
}
```

These atomic operations provide the foundation for implementing Step 1 with complete BMAD compliance, ensuring every user interaction is tracked, optimized, and handled gracefully.
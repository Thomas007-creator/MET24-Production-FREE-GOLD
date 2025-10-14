# Onboarding Step 4: Notifications - Operations

## Atomic Operations

### Core Configuration Operations

#### 1. Notification Category Selection Operation
```typescript
interface CategorySelectionOperation {
  // Input: User's category selection
  input: {
    categoryId: string;
    action: 'enable' | 'disable' | 'update_frequency';
    frequency?: NotificationFrequency;
    userContext: UserContext;
  };
  
  // Atomic steps
  steps: [
    'validate_category_selection',
    'check_user_eligibility',
    'apply_mbti_recommendations',
    'update_category_configuration',
    'track_selection_behavior'
  ];
  
  // Expected outcome
  result: {
    categoryConfigured: boolean;
    mbtiInsightsGenerated: boolean;
    behaviorTracked: boolean;
  };
  
  // Error scenarios
  errors: [
    'invalid_category',
    'frequency_not_supported',
    'configuration_conflict',
    'storage_failure'
  ];
}

// Implementation
async function executeCategorySelection(
  categoryId: string,
  action: CategoryAction,
  frequency?: NotificationFrequency
): Promise<CategorySelectionResult> {
  try {
    // 1. Validate category selection
    const category = await validateCategory(categoryId);
    if (!category) {
      return { success: false, error: 'invalid_category' };
    }
    
    // 2. Check user eligibility
    const eligibility = await checkUserEligibility(categoryId, getCurrentUserId());
    if (!eligibility.eligible) {
      return {
        success: false,
        error: 'not_eligible',
        reason: eligibility.reason
      };
    }
    
    // 3. Apply MBTI recommendations
    const mbtiRecommendation = await getMBTIRecommendation(categoryId);
    const finalFrequency = frequency || mbtiRecommendation.suggestedFrequency;
    
    // 4. Update category configuration
    const configUpdate = await updateCategoryConfiguration({
      categoryId,
      action,
      frequency: finalFrequency,
      userId: getCurrentUserId(),
      mbtiContext: mbtiRecommendation
    });
    
    // 5. Track selection behavior for MBTI analysis
    await trackCategorySelectionBehavior({
      categoryId,
      action,
      frequency: finalFrequency,
      mbtiRecommendation,
      userDecisionTime: calculateDecisionTime(),
      selectionOrder: getSelectionOrder()
    });
    
    // Track successful configuration
    trackEvent('notification_category_configured', {
      categoryId,
      action,
      frequency: finalFrequency,
      mbtiAlignment: mbtiRecommendation.confidence,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      category,
      finalConfiguration: configUpdate,
      mbtiInsights: mbtiRecommendation
    };
  } catch (error) {
    handleCategorySelectionError(error, { categoryId, action, frequency });
    return { success: false, error };
  }
}
```

#### 2. Delivery Method Configuration Operation
```typescript
interface DeliveryMethodConfigurationOperation {
  // Input: Delivery method preferences
  input: {
    methodType: 'push' | 'email' | 'in_app' | 'sms';
    enable: boolean;
    methodSettings?: DeliveryMethodSettings;
  };
  
  // Atomic steps
  steps: [
    'validate_method_availability',
    'check_permissions_required',
    'request_permissions_if_needed',
    'configure_delivery_method',
    'test_delivery_capability'
  ];
  
  // Expected outcome
  result: {
    methodConfigured: boolean;
    permissionsGranted: boolean;
    deliveryTested: boolean;
  };
}

// Implementation
async function executeDeliveryMethodConfiguration(
  methodType: DeliveryMethodType,
  enable: boolean,
  methodSettings?: DeliveryMethodSettings
): Promise<DeliveryMethodConfigurationResult> {
  try {
    // 1. Validate method availability
    const availability = await validateMethodAvailability(methodType);
    if (!availability.available) {
      return {
        success: false,
        error: 'method_not_available',
        reason: availability.reason
      };
    }
    
    // 2. Check permissions required
    const permissionsNeeded = getRequiredPermissions(methodType);
    
    // 3. Request permissions if needed
    let permissionsGranted = true;
    if (enable && permissionsNeeded.length > 0) {
      const permissionResults = await requestPermissions(permissionsNeeded);
      permissionsGranted = permissionResults.every(p => p.granted);
      
      if (!permissionsGranted) {
        return {
          success: false,
          error: 'permissions_denied',
          deniedPermissions: permissionResults.filter(p => !p.granted)
        };
      }
    }
    
    // 4. Configure delivery method
    const configuration = await configureDeliveryMethod({
      methodType,
      enable,
      settings: methodSettings || getDefaultMethodSettings(methodType),
      userId: getCurrentUserId()
    });
    
    // 5. Test delivery capability (if enabled)
    let deliveryTest = null;
    if (enable) {
      deliveryTest = await testDeliveryCapability(methodType, configuration);
      if (!deliveryTest.success) {
        // Log warning but don't fail the operation
        console.warn('Delivery test failed:', deliveryTest.error);
      }
    }
    
    // Track method configuration
    trackEvent('delivery_method_configured', {
      methodType,
      enable,
      permissionsGranted,
      deliveryTestSuccess: deliveryTest?.success,
      settingsComplexity: methodSettings ? 'custom' : 'default'
    });
    
    return {
      success: true,
      methodType,
      configuration,
      permissionsGranted,
      deliveryTest
    };
  } catch (error) {
    handleDeliveryMethodConfigurationError(error, { methodType, enable });
    return { success: false, error };
  }
}
```

#### 3. Timing Preferences Configuration Operation
```typescript
interface TimingPreferencesOperation {
  // Input: User's timing preferences
  input: {
    quietHours: TimeRange;
    preferredTimes: PreferredTime[];
    timezone: string;
    weekendDifferent: boolean;
  };
  
  // Atomic steps
  steps: [
    'validate_timing_preferences',
    'normalize_timezone_data',
    'calculate_optimal_windows',
    'apply_mbti_timing_adaptations',
    'store_timing_configuration'
  ];
  
  // Expected outcome
  result: {
    timingConfigured: boolean;
    optimalWindowsCalculated: boolean;
    mbtiAdaptationsApplied: boolean;
  };
}

// Implementation
async function executeTimingPreferencesConfiguration(
  timingPreferences: TimingPreferences
): Promise<TimingPreferencesResult> {
  try {
    // 1. Validate timing preferences
    const validation = validateTimingPreferences(timingPreferences);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'invalid_timing_preferences',
        validationErrors: validation.errors
      };
    }
    
    // 2. Normalize timezone data
    const normalizedTimezone = await normalizeTimezoneData(timingPreferences.timezone);
    
    // 3. Calculate optimal delivery windows
    const optimalWindows = calculateOptimalDeliveryWindows({
      quietHours: timingPreferences.quietHours,
      preferredTimes: timingPreferences.preferredTimes,
      timezone: normalizedTimezone,
      weekendDifferent: timingPreferences.weekendDifferent
    });
    
    // 4. Apply MBTI timing adaptations
    const mbtiType = await getCurrentUserMBTIType();
    const mbtiAdaptations = applyMBTITimingAdaptations(optimalWindows, mbtiType);
    
    // 5. Store timing configuration
    const finalConfiguration = {
      ...timingPreferences,
      normalizedTimezone,
      optimalWindows: mbtiAdaptations.adaptedWindows,
      mbtiAdaptations: mbtiAdaptations.adaptationsApplied
    };
    
    await storeTimingConfiguration(getCurrentUserId(), finalConfiguration);
    
    // Track timing configuration
    trackEvent('timing_preferences_configured', {
      hasQuietHours: !!timingPreferences.quietHours,
      preferredTimesCount: timingPreferences.preferredTimes.length,
      weekendDifferent: timingPreferences.weekendDifferent,
      mbtiAdaptationsCount: mbtiAdaptations.adaptationsApplied.length,
      timezone: normalizedTimezone.abbreviation
    });
    
    return {
      success: true,
      configuration: finalConfiguration,
      optimalWindows: mbtiAdaptations.adaptedWindows,
      mbtiAdaptations: mbtiAdaptations.adaptationsApplied
    };
  } catch (error) {
    handleTimingPreferencesError(error, timingPreferences);
    return { success: false, error };
  }
}
```

#### 4. Permission Management Operation
```typescript
interface PermissionManagementOperation {
  // Input: Permission request details
  input: {
    permissionType: 'notifications' | 'location' | 'contacts';
    requestReason: string;
    fallbackOptions: FallbackOption[];
  };
  
  // Atomic steps
  steps: [
    'check_current_permission_status',
    'prepare_permission_request',
    'execute_permission_request',
    'handle_permission_response',
    'configure_fallback_if_needed'
  ];
  
  // Expected outcome
  result: {
    permissionGranted: boolean;
    fallbackConfigured: boolean;
    userEducated: boolean;
  };
}

// Implementation
async function executePermissionManagement(
  permissionType: PermissionType,
  requestReason: string,
  fallbackOptions: FallbackOption[]
): Promise<PermissionManagementResult> {
  try {
    // 1. Check current permission status
    const currentStatus = await checkPermissionStatus(permissionType);
    
    if (currentStatus === 'granted') {
      return {
        success: true,
        permissionGranted: true,
        currentStatus,
        action: 'no_action_needed'
      };
    }
    
    // 2. Prepare permission request
    const requestPreparation = preparePermissionRequest({
      permissionType,
      reason: requestReason,
      userContext: await getUserContext(),
      previousAttempts: await getPreviousPermissionAttempts(permissionType)
    });
    
    // 3. Execute permission request
    let permissionResult;
    if (requestPreparation.shouldRequest) {
      permissionResult = await executePermissionRequest({
        permissionType,
        requestStrategy: requestPreparation.strategy,
        educationalContent: requestPreparation.educationalContent
      });
    } else {
      permissionResult = {
        granted: false,
        reason: 'should_not_request',
        recommendation: requestPreparation.recommendation
      };
    }
    
    // 4. Handle permission response
    await handlePermissionResponse({
      permissionType,
      result: permissionResult,
      requestAttempt: requestPreparation.attemptNumber
    });
    
    // 5. Configure fallback if needed
    let fallbackConfiguration = null;
    if (!permissionResult.granted && fallbackOptions.length > 0) {
      fallbackConfiguration = await configureFallbackOptions({
        permissionType,
        availableOptions: fallbackOptions,
        userPreferences: await getUserFallbackPreferences()
      });
    }
    
    // Track permission management
    trackEvent('permission_management_completed', {
      permissionType,
      granted: permissionResult.granted,
      strategy: requestPreparation.strategy,
      fallbackUsed: !!fallbackConfiguration,
      attemptNumber: requestPreparation.attemptNumber
    });
    
    return {
      success: true,
      permissionGranted: permissionResult.granted,
      permissionResult,
      fallbackConfiguration,
      recommendation: requestPreparation.recommendation
    };
  } catch (error) {
    handlePermissionManagementError(error, { permissionType, requestReason });
    return { success: false, error };
  }
}
```

### Support Operations

#### 5. MBTI-Based Recommendation Generation Operation
```typescript
interface MBTIRecommendationOperation {
  // Input: User's MBTI data and current selections
  input: {
    mbtiType: MBTIType | null;
    confidence: number;
    currentSelections: NotificationSelection[];
    userGoals: string[];
  };
  
  // Atomic steps
  steps: [
    'analyze_mbti_notification_preferences',
    'evaluate_current_selections',
    'generate_personalized_recommendations',
    'calculate_recommendation_confidence',
    'format_recommendation_explanations'
  ];
  
  // Expected outcome
  result: {
    recommendationsGenerated: boolean;
    explanationsProvided: boolean;
    confidenceCalculated: boolean;
  };
}

// Implementation
async function executeMBTIRecommendationGeneration(
  mbtiType: MBTIType | null,
  confidence: number,
  currentSelections: NotificationSelection[],
  userGoals: string[]
): Promise<MBTIRecommendationResult> {
  try {
    // 1. Analyze MBTI notification preferences
    const mbtiPreferences = analyzeMBTINotificationPreferences(mbtiType, confidence);
    
    // 2. Evaluate current selections
    const selectionAnalysis = evaluateCurrentSelections({
      selections: currentSelections,
      mbtiPreferences,
      userGoals
    });
    
    // 3. Generate personalized recommendations
    const recommendations = generatePersonalizedRecommendations({
      mbtiType,
      preferences: mbtiPreferences,
      selectionGaps: selectionAnalysis.gaps,
      userGoals,
      confidence
    });
    
    // 4. Calculate recommendation confidence
    const recommendationConfidence = calculateRecommendationConfidence({
      mbtiConfidence: confidence,
      preferencesStrength: mbtiPreferences.strength,
      goalAlignment: selectionAnalysis.goalAlignment
    });
    
    // 5. Format recommendation explanations
    const explanations = formatRecommendationExplanations({
      recommendations,
      mbtiType,
      confidence: recommendationConfidence,
      userGoals
    });
    
    // Track recommendation generation
    trackEvent('mbti_recommendations_generated', {
      mbtiType,
      mbtiConfidence: confidence,
      recommendationsCount: recommendations.length,
      recommendationConfidence,
      goalAlignment: selectionAnalysis.goalAlignment
    });
    
    return {
      success: true,
      recommendations,
      explanations,
      confidence: recommendationConfidence,
      selectionAnalysis
    };
  } catch (error) {
    handleMBTIRecommendationError(error, { mbtiType, confidence });
    return { success: false, error };
  }
}
```

#### 6. Notification Testing Operation
```typescript
interface NotificationTestingOperation {
  // Input: Test configuration
  input: {
    deliveryMethods: DeliveryMethod[];
    testType: 'sample' | 'actual_content' | 'timing_test';
    categories: NotificationCategory[];
  };
  
  // Atomic steps
  steps: [
    'prepare_test_notifications',
    'validate_delivery_channels',
    'send_test_notifications',
    'monitor_delivery_success',
    'collect_user_feedback'
  ];
  
  // Expected outcome
  result: {
    testsCompleted: boolean;
    deliverySuccessful: boolean;
    feedbackCollected: boolean;
  };
}

// Implementation
async function executeNotificationTesting(
  deliveryMethods: DeliveryMethod[],
  testType: TestType,
  categories: NotificationCategory[]
): Promise<NotificationTestingResult> {
  try {
    // 1. Prepare test notifications
    const testNotifications = await prepareTestNotifications({
      categories,
      testType,
      userId: getCurrentUserId(),
      mbtiAdaptation: await getCurrentMBTIAdaptation()
    });
    
    // 2. Validate delivery channels
    const channelValidation = await validateDeliveryChannels(deliveryMethods);
    const validChannels = channelValidation.filter(c => c.valid);
    
    if (validChannels.length === 0) {
      return {
        success: false,
        error: 'no_valid_channels',
        channelValidation
      };
    }
    
    // 3. Send test notifications
    const deliveryResults = await Promise.allSettled(
      validChannels.map(async (channel) => {
        return await sendTestNotification({
          channel: channel.method,
          notification: testNotifications[0], // Use first test notification
          userId: getCurrentUserId()
        });
      })
    );
    
    // 4. Monitor delivery success
    const deliveryMonitoring = await monitorDeliverySuccess({
      deliveryResults,
      expectedDeliveries: validChannels.length,
      timeout: 30000 // 30 seconds
    });
    
    // 5. Collect user feedback (async)
    scheduleUserFeedbackCollection({
      testId: generateTestId(),
      deliveryMethods: validChannels.map(c => c.method),
      testType,
      deliverySuccess: deliveryMonitoring.success
    });
    
    // Track notification testing
    trackEvent('notification_testing_completed', {
      testType,
      deliveryMethodsCount: deliveryMethods.length,
      validChannelsCount: validChannels.length,
      deliverySuccessRate: deliveryMonitoring.successRate,
      categoriesTestedCount: categories.length
    });
    
    return {
      success: true,
      testNotifications,
      deliveryResults: deliveryResults.map(r => r.status === 'fulfilled' ? r.value : r.reason),
      deliveryMonitoring,
      validChannels
    };
  } catch (error) {
    handleNotificationTestingError(error, { deliveryMethods, testType, categories });
    return { success: false, error };
  }
}
```

## Composite Operations

### Multi-Step Workflows

#### 1. Complete Notification Setup Workflow
```typescript
interface CompleteNotificationSetupWorkflow {
  // Orchestrates entire notification configuration process
  operations: [
    MBTIRecommendationOperation,
    CategorySelectionOperation[],
    DeliveryMethodConfigurationOperation[],
    TimingPreferencesOperation,
    NotificationTestingOperation
  ];
  
  // Transaction boundary
  transactionScope: 'notification_setup_completion';
  
  // Rollback procedures
  rollbackActions: [
    'restore_previous_notification_settings',
    'revoke_granted_permissions',
    'clear_incomplete_configuration'
  ];
}

// Implementation
async function executeCompleteNotificationSetupWorkflow(
  setupPreferences: NotificationSetupPreferences
): Promise<WorkflowResult> {
  const transaction = beginNotificationSetupTransaction();
  
  try {
    // 1. Generate MBTI-based recommendations
    const recommendations = await executeMBTIRecommendationGeneration(
      setupPreferences.detectedMBTIType,
      setupPreferences.mbtiConfidence,
      setupPreferences.currentSelections,
      setupPreferences.userGoals
    );
    
    // 2. Configure selected categories
    const categoryResults = await Promise.allSettled(
      setupPreferences.selectedCategories.map(category =>
        executeCategorySelection(category.id, 'enable', category.frequency)
      )
    );
    
    // 3. Configure delivery methods
    const deliveryResults = await Promise.allSettled(
      setupPreferences.selectedMethods.map(method =>
        executeDeliveryMethodConfiguration(method.type, true, method.settings)
      )
    );
    
    // 4. Configure timing preferences
    const timingResult = await executeTimingPreferencesConfiguration(
      setupPreferences.timingPreferences
    );
    
    // 5. Test notification delivery
    const testingResult = await executeNotificationTesting(
      setupPreferences.selectedMethods,
      'sample',
      setupPreferences.selectedCategories
    );
    
    // Commit transaction
    await transaction.commit({
      recommendations,
      categories: categoryResults,
      deliveryMethods: deliveryResults,
      timing: timingResult,
      testing: testingResult
    });
    
    return {
      success: true,
      notificationSetupComplete: true,
      nextStep: 5,
      setupResults: {
        recommendations,
        categories: categoryResults.filter(r => r.status === 'fulfilled'),
        deliveryMethods: deliveryResults.filter(r => r.status === 'fulfilled'),
        timing: timingResult,
        testing: testingResult
      }
    };
  } catch (error) {
    // Rollback on error
    await transaction.rollback();
    return {
      success: false,
      error,
      partialResults: transaction.getPartialResults()
    };
  }
}
```

#### 2. Adaptive Notification Optimization Workflow
```typescript
interface AdaptiveNotificationOptimizationWorkflow {
  // Continuously optimizes notification settings based on user behavior
  operations: [
    'monitor_notification_engagement',
    'analyze_engagement_patterns',
    'generate_optimization_recommendations',
    'apply_automatic_optimizations',
    'track_optimization_impact'
  ];
}

// Implementation
async function executeAdaptiveNotificationOptimizationWorkflow(
  userId: string
): Promise<OptimizationWorkflowResult> {
  // 1. Monitor notification engagement
  const engagementData = await monitorNotificationEngagement(userId, {
    timeframe: '30_days',
    includeMetrics: ['open_rate', 'click_rate', 'dismiss_rate', 'time_to_action']
  });
  
  // 2. Analyze engagement patterns
  const engagementAnalysis = analyzeEngagementPatterns({
    engagementData,
    userProfile: await getUserProfile(userId),
    notificationHistory: await getNotificationHistory(userId)
  });
  
  // 3. Generate optimization recommendations
  const optimizations = generateOptimizationRecommendations({
    engagementAnalysis,
    currentSettings: await getCurrentNotificationSettings(userId),
    mbtiProfile: await getUserMBTIProfile(userId)
  });
  
  // 4. Apply automatic optimizations
  const automaticOptimizations = await applyAutomaticOptimizations({
    userId,
    optimizations: optimizations.filter(o => o.autoApplicable),
    safetyChecks: true
  });
  
  // 5. Track optimization impact
  await trackOptimizationImpact({
    userId,
    optimizations: automaticOptimizations,
    baselineMetrics: engagementData.baselineMetrics
  });
  
  return {
    success: true,
    engagementAnalyzed: true,
    optimizationsApplied: automaticOptimizations.length,
    userNotificationRequired: optimizations.some(o => o.requiresUserConsent),
    impactTracking: true,
    optimizationResults: {
      engagementAnalysis,
      optimizations,
      automaticOptimizations
    }
  };
}
```

## Performance Operations

### Notification Delivery Optimization
```typescript
// Optimize notification delivery performance
async function optimizeNotificationDelivery(): Promise<DeliveryOptimizationResult> {
  const optimizationTasks = {
    // Critical optimizations
    critical: [
      optimizeDeliveryChannels(),
      optimizeBatchProcessing(),
      optimizeFailureHandling()
    ],
    
    // Important optimizations  
    important: [
      optimizeContentPersonalization(),
      optimizeDeliveryTiming(),
      optimizeUserSegmentation()
    ],
    
    // Background optimizations
    background: [
      optimizeAnalyticsCollection(),
      optimizeDeliveryMonitoring(),
      optimizeCapacityPlanning()
    ]
  };
  
  // Execute optimizations in priority order
  const criticalResults = await Promise.all(optimizationTasks.critical);
  const importantResults = await Promise.allSettled(optimizationTasks.important);
  
  // Background optimizations run asynchronously
  Promise.allSettled(optimizationTasks.background).then(backgroundResults => {
    processBackgroundOptimizations(backgroundResults);
  });
  
  return {
    criticalOptimizations: criticalResults,
    importantOptimizations: importantResults.filter(r => r.status === 'fulfilled'),
    optimizationStrategy: 'delivery_performance_first'
  };
}
```

### Error Recovery Operations
```typescript
// Comprehensive error recovery for notification operations
async function executeNotificationErrorRecovery(
  error: NotificationError,
  context: NotificationErrorContext
): Promise<RecoveryResult> {
  const recoveryStrategies = {
    'permission_denied': async () => {
      // Configure fallback delivery methods
      return await configureFallbackDeliveryMethods(context.userId);
    },
    
    'delivery_failed': async () => {
      // Retry with different delivery channel
      return await retryWithAlternativeChannel(context.notificationId, context.originalChannel);
    },
    
    'content_generation_failed': async () => {
      // Fall back to default content templates
      return await useDefaultContentTemplates(context.categoryId, context.userId);
    },
    
    'timing_conflict': async () => {
      // Reschedule notification for next optimal window
      return await rescheduleForOptimalWindow(context.notificationId, context.userId);
    }
  };
  
  const strategy = recoveryStrategies[error.type];
  if (strategy) {
    return await strategy();
  }
  
  // Generic recovery
  return await executeGenericNotificationRecovery(error, context);
}
```

These atomic operations provide the complete foundation for implementing Step 4 (Notifications) with full BMAD compliance, ensuring systematic notification configuration, MBTI-based personalization, robust permission handling, and comprehensive error recovery while maintaining the existing notification infrastructure.
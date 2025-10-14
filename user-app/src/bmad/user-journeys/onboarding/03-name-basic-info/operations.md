# Onboarding Step 3: Name/Basic Info - Operations

## Atomic Operations

### Core Data Collection Operations

#### 1. Personal Information Collection Operation
```typescript
interface PersonalInfoCollectionOperation {
  // Input: User-provided personal data
  input: {
    displayName: string;
    pronouns?: string;
    firstName?: string;
    lastName?: string;
    ageRange: string;
  };
  
  // Atomic steps
  steps: [
    'validate_personal_data',
    'sanitize_input_data',
    'check_name_uniqueness',
    'apply_cultural_formatting',
    'store_personal_information'
  ];
  
  // Expected outcome
  result: {
    personalDataStored: boolean;
    validationPassed: boolean;
    culturalAdaptationsApplied: boolean;
  };
  
  // Error scenarios
  errors: [
    'invalid_name_format',
    'name_too_long_short',
    'cultural_formatting_failed',
    'storage_operation_failed'
  ];
}

// Implementation
async function executePersonalInfoCollection(
  personalData: PersonalData
): Promise<PersonalInfoCollectionResult> {
  try {
    // 1. Validate personal data
    const validation = validatePersonalData(personalData);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'validation_failed',
        validationErrors: validation.errors
      };
    }
    
    // 2. Sanitize input data
    const sanitizedData = sanitizePersonalData(personalData);
    
    // 3. Check name uniqueness (if required)
    const uniquenessCheck = await checkNameUniqueness(sanitizedData.displayName);
    if (!uniquenessCheck.isUnique && uniquenessCheck.required) {
      return {
        success: false,
        error: 'name_not_unique',
        suggestions: uniquenessCheck.suggestions
      };
    }
    
    // 4. Apply cultural formatting
    const culturallyFormatted = applyCulturalNameFormatting(
      sanitizedData,
      detectUserCulture()
    );
    
    // 5. Store personal information
    await storePersonalInformation(culturallyFormatted);
    
    // Track successful collection
    trackEvent('personal_info_collected', {
      fieldsProvided: Object.keys(personalData).length,
      culturalAdaptations: culturallyFormatted.adaptationsApplied,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      storedData: culturallyFormatted,
      adaptationsApplied: culturallyFormatted.adaptationsApplied
    };
  } catch (error) {
    handlePersonalInfoCollectionError(error, personalData);
    return { success: false, error };
  }
}
```

#### 2. Goals and Motivations Capture Operation
```typescript
interface GoalsMotivationsCaptureOperation {
  // Input: User's selected goals and motivations
  input: {
    primaryGoals: string[];
    motivationFactors?: string[];
    personalGrowthAreas?: string[];
  };
  
  // Atomic steps
  steps: [
    'validate_goal_selection',
    'analyze_goal_patterns',
    'extract_mbti_indicators',
    'generate_personalization_data',
    'store_goals_and_motivations'
  ];
  
  // Expected outcome
  result: {
    goalsStored: boolean;
    mbtiIndicatorsExtracted: boolean;
    personalizationDataGenerated: boolean;
  };
}

// Implementation
async function executeGoalsMotivationsCapture(
  goalsData: GoalsData
): Promise<GoalsMotivationsCaptureResult> {
  try {
    // 1. Validate goal selection
    const validation = validateGoalSelection(goalsData.primaryGoals);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'invalid_goal_selection',
        validationErrors: validation.errors
      };
    }
    
    // 2. Analyze goal patterns
    const goalPatterns = analyzeGoalPatterns(goalsData.primaryGoals);
    
    // 3. Extract MBTI indicators
    const mbtiIndicators = extractMBTIIndicatorsFromGoals({
      selectedGoals: goalsData.primaryGoals,
      goalPatterns,
      selectionOrder: getGoalSelectionOrder(),
      selectionTiming: getGoalSelectionTiming()
    });
    
    // 4. Generate personalization data
    const personalizationData = generatePersonalizationData({
      goals: goalsData.primaryGoals,
      patterns: goalPatterns,
      mbtiIndicators
    });
    
    // 5. Store goals and motivations
    await storeGoalsAndMotivations({
      ...goalsData,
      patterns: goalPatterns,
      mbtiIndicators,
      personalizationData,
      capturedAt: new Date()
    });
    
    // Track goals capture with MBTI analysis
    trackEvent('goals_motivations_captured', {
      goalsSelected: goalsData.primaryGoals.length,
      patterns: goalPatterns,
      mbtiConfidence: mbtiIndicators.confidence,
      personalizationPotential: personalizationData.score
    });
    
    return {
      success: true,
      goalPatterns,
      mbtiIndicators,
      personalizationData
    };
  } catch (error) {
    handleGoalsMotivationsCaptureError(error, goalsData);
    return { success: false, error };
  }
}
```

#### 3. Demographic Information Processing Operation
```typescript
interface DemographicProcessingOperation {
  // Input: User's demographic information
  input: {
    timezone: string;
    country?: string;
    region?: string;
    primaryLanguage: string;
    culturalBackground?: string;
  };
  
  // Atomic steps
  steps: [
    'validate_demographic_data',
    'normalize_location_data',
    'detect_cultural_context',
    'apply_localization_settings',
    'store_demographic_information'
  ];
  
  // Expected outcome
  result: {
    demographicDataStored: boolean;
    localizationApplied: boolean;
    culturalContextDetected: boolean;
  };
}

// Implementation
async function executeDemographicProcessing(
  demographicData: DemographicData
): Promise<DemographicProcessingResult> {
  try {
    // 1. Validate demographic data
    const validation = validateDemographicData(demographicData);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'validation_failed',
        validationErrors: validation.errors
      };
    }
    
    // 2. Normalize location data
    const normalizedLocation = await normalizeLocationData({
      timezone: demographicData.timezone,
      country: demographicData.country,
      region: demographicData.region
    });
    
    // 3. Detect cultural context
    const culturalContext = detectCulturalContext({
      country: normalizedLocation.country,
      language: demographicData.primaryLanguage,
      culturalBackground: demographicData.culturalBackground
    });
    
    // 4. Apply localization settings
    const localizationSettings = applyLocalizationSettings({
      language: demographicData.primaryLanguage,
      timezone: normalizedLocation.timezone,
      culturalContext
    });
    
    // 5. Store demographic information
    await storeDemographicInformation({
      ...demographicData,
      normalizedLocation,
      culturalContext,
      localizationSettings,
      processedAt: new Date()
    });
    
    // Track demographic processing
    trackEvent('demographic_info_processed', {
      locationNormalized: normalizedLocation.normalized,
      culturalContextDetected: culturalContext.detected,
      localizationApplied: localizationSettings.applied,
      dataQuality: calculateDemographicDataQuality(demographicData)
    });
    
    return {
      success: true,
      normalizedLocation,
      culturalContext,
      localizationSettings
    };
  } catch (error) {
    handleDemographicProcessingError(error, demographicData);
    return { success: false, error };
  }
}
```

#### 4. Professional Context Analysis Operation
```typescript
interface ProfessionalContextAnalysisOperation {
  // Input: User's professional information
  input: {
    currentRole: string;
    industryType?: string;
    careerStage?: string;
    educationLevel?: string;
    fieldOfStudy?: string;
  };
  
  // Atomic steps
  steps: [
    'validate_professional_data',
    'categorize_role_and_industry',
    'analyze_career_context',
    'generate_professional_insights',
    'store_professional_context'
  ];
  
  // Expected outcome
  result: {
    professionalDataStored: boolean;
    careerContextAnalyzed: boolean;
    professionalInsightsGenerated: boolean;
  };
}

// Implementation
async function executeProfessionalContextAnalysis(
  professionalData: ProfessionalData
): Promise<ProfessionalContextAnalysisResult> {
  try {
    // 1. Validate professional data
    const validation = validateProfessionalData(professionalData);
    if (!validation.isValid) {
      return {
        success: false,
        error: 'validation_failed',
        validationErrors: validation.errors
      };
    }
    
    // 2. Categorize role and industry
    const categorization = categorizeRoleAndIndustry({
      role: professionalData.currentRole,
      industry: professionalData.industryType,
      education: professionalData.educationLevel
    });
    
    // 3. Analyze career context
    const careerContext = analyzeCareerContext({
      ...professionalData,
      categorization
    });
    
    // 4. Generate professional insights
    const professionalInsights = generateProfessionalInsights({
      careerContext,
      categorization,
      personalGoals: await getUserPrimaryGoals() // From previous operation
    });
    
    // 5. Store professional context
    await storeProfessionalContext({
      ...professionalData,
      categorization,
      careerContext,
      professionalInsights,
      analyzedAt: new Date()
    });
    
    // Track professional analysis
    trackEvent('professional_context_analyzed', {
      roleCategory: categorization.roleCategory,
      industryCategory: categorization.industryCategory,
      careerStage: careerContext.stage,
      insightsGenerated: professionalInsights.length,
      dataCompleteness: calculateProfessionalDataCompleteness(professionalData)
    });
    
    return {
      success: true,
      categorization,
      careerContext,
      professionalInsights
    };
  } catch (error) {
    handleProfessionalContextAnalysisError(error, professionalData);
    return { success: false, error };
  }
}
```

### Support Operations

#### 5. Real-time Validation Operation
```typescript
interface RealTimeValidationOperation {
  // Input: Field data for validation
  input: {
    fieldName: string;
    fieldValue: any;
    formContext: FormContext;
  };
  
  // Atomic steps
  steps: [
    'apply_field_validation_rules',
    'check_cross_field_dependencies',
    'generate_validation_feedback',
    'update_form_state',
    'track_validation_event'
  ];
  
  // Expected outcome
  result: {
    validationPassed: boolean;
    feedbackGenerated: boolean;
    formStateUpdated: boolean;
  };
}

// Implementation
function executeRealTimeValidation(
  fieldName: string,
  fieldValue: any,
  formContext: FormContext
): RealTimeValidationResult {
  try {
    // 1. Apply field validation rules
    const fieldValidation = applyFieldValidationRules(fieldName, fieldValue);
    
    // 2. Check cross-field dependencies
    const crossFieldValidation = checkCrossFieldDependencies(
      fieldName,
      fieldValue,
      formContext
    );
    
    // 3. Generate validation feedback
    const feedback = generateValidationFeedback({
      fieldValidation,
      crossFieldValidation,
      fieldName,
      fieldValue
    });
    
    // 4. Update form state
    updateFormValidationState(fieldName, {
      isValid: fieldValidation.isValid && crossFieldValidation.isValid,
      errors: [...fieldValidation.errors, ...crossFieldValidation.errors],
      warnings: [...fieldValidation.warnings, ...crossFieldValidation.warnings],
      feedback
    });
    
    // 5. Track validation event for behavior analysis
    trackValidationEvent({
      fieldName,
      validationPassed: fieldValidation.isValid,
      errorTypes: fieldValidation.errors.map(e => e.type),
      correctionAttempts: getCorrectionAttempts(fieldName),
      validationSpeed: getValidationSpeed()
    });
    
    return {
      success: true,
      isValid: fieldValidation.isValid && crossFieldValidation.isValid,
      feedback,
      errors: [...fieldValidation.errors, ...crossFieldValidation.errors]
    };
  } catch (error) {
    handleValidationError(error, { fieldName, fieldValue });
    return { success: false, error };
  }
}
```

#### 6. MBTI Behavior Tracking Operation
```typescript
interface MBTIBehaviorTrackingOperation {
  // Input: User behavior event
  input: {
    behaviorType: 'form_interaction' | 'field_completion' | 'help_usage' | 'goal_selection';
    behaviorData: any;
    timestamp: Date;
  };
  
  // Atomic steps
  steps: [
    'classify_behavior_event',
    'extract_mbti_indicators',
    'update_confidence_scores',
    'store_behavior_data',
    'trigger_adaptation_updates'
  ];
  
  // Expected outcome
  result: {
    behaviorClassified: boolean;
    mbtiIndicatorsExtracted: boolean;
    confidenceUpdated: boolean;
    adaptationsTriggered: boolean;
  };
}

// Implementation
async function executeMBTIBehaviorTracking(
  behaviorType: BehaviorType,
  behaviorData: any,
  timestamp: Date
): Promise<MBTIBehaviorTrackingResult> {
  try {
    // 1. Classify behavior event
    const behaviorClassification = classifyBehaviorEvent({
      type: behaviorType,
      data: behaviorData,
      context: getCurrentFormContext(),
      timestamp
    });
    
    // 2. Extract MBTI indicators
    const mbtiIndicators = extractMBTIIndicatorsFromBehavior({
      classification: behaviorClassification,
      behaviorData,
      historicalBehavior: await getHistoricalBehavior()
    });
    
    // 3. Update confidence scores
    const updatedConfidence = updateMBTIConfidenceScores({
      newIndicators: mbtiIndicators,
      currentConfidence: await getCurrentMBTIConfidence(),
      behaviorWeight: behaviorClassification.weight
    });
    
    // 4. Store behavior data
    await storeBehaviorData({
      behaviorType,
      behaviorData,
      classification: behaviorClassification,
      mbtiIndicators,
      confidence: updatedConfidence,
      timestamp
    });
    
    // 5. Trigger adaptation updates if confidence threshold reached
    let adaptationsTriggered = false;
    if (shouldTriggerAdaptationUpdate(updatedConfidence)) {
      await triggerAdaptationUpdate(updatedConfidence);
      adaptationsTriggered = true;
    }
    
    // Track behavior analysis
    trackEvent('mbti_behavior_tracked', {
      behaviorType,
      indicatorsExtracted: Object.keys(mbtiIndicators).length,
      confidenceChange: updatedConfidence.totalChange,
      adaptationsTriggered
    });
    
    return {
      success: true,
      behaviorClassification,
      mbtiIndicators,
      updatedConfidence,
      adaptationsTriggered
    };
  } catch (error) {
    handleMBTIBehaviorTrackingError(error, { behaviorType, behaviorData });
    return { success: false, error };
  }
}
```

## Composite Operations

### Multi-Step Workflows

#### 1. Complete Form Data Collection Workflow
```typescript
interface CompleteFormDataCollectionWorkflow {
  // Orchestrates entire form data collection process
  operations: [
    PersonalInfoCollectionOperation,
    DemographicProcessingOperation,
    ProfessionalContextAnalysisOperation,
    GoalsMotivationsCaptureOperation
  ];
  
  // Transaction boundary
  transactionScope: 'complete_form_submission';
  
  // Rollback procedures
  rollbackActions: [
    'restore_previous_form_state',
    'clear_invalid_data',
    'reset_validation_state'
  ];
}

// Implementation
async function executeCompleteFormDataCollectionWorkflow(
  formData: CompleteFormData
): Promise<WorkflowResult> {
  const transaction = beginFormDataTransaction();
  
  try {
    // 1. Collect and validate personal information
    const personalInfoResult = await executePersonalInfoCollection({
      displayName: formData.displayName,
      pronouns: formData.pronouns,
      firstName: formData.firstName,
      lastName: formData.lastName,
      ageRange: formData.ageRange
    });
    
    if (!personalInfoResult.success) {
      throw new Error('Personal info collection failed');
    }
    
    // 2. Process demographic information
    const demographicResult = await executeDemographicProcessing({
      timezone: formData.timezone,
      country: formData.country,
      region: formData.region,
      primaryLanguage: formData.primaryLanguage,
      culturalBackground: formData.culturalBackground
    });
    
    // 3. Analyze professional context
    const professionalResult = await executeProfessionalContextAnalysis({
      currentRole: formData.currentRole,
      industryType: formData.industryType,
      careerStage: formData.careerStage,
      educationLevel: formData.educationLevel,
      fieldOfStudy: formData.fieldOfStudy
    });
    
    // 4. Capture goals and motivations
    const goalsResult = await executeGoalsMotivationsCapture({
      primaryGoals: formData.primaryGoals,
      motivationFactors: formData.motivationFactors
    });
    
    // 5. Generate comprehensive profile
    const comprehensiveProfile = generateComprehensiveProfile({
      personalInfo: personalInfoResult,
      demographic: demographicResult,
      professional: professionalResult,
      goals: goalsResult
    });
    
    // Commit transaction
    await transaction.commit({
      personalInfo: personalInfoResult,
      demographic: demographicResult,
      professional: professionalResult,
      goals: goalsResult,
      comprehensiveProfile
    });
    
    return {
      success: true,
      profileGenerated: true,
      nextStep: 4,
      formResults: {
        personalInfo: personalInfoResult,
        demographic: demographicResult,
        professional: professionalResult,
        goals: goalsResult,
        comprehensiveProfile
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

#### 2. Progressive Form Enhancement Workflow
```typescript
interface ProgressiveFormEnhancementWorkflow {
  // Adapts form based on user behavior and MBTI detection
  operations: [
    'monitor_user_behavior',
    'analyze_completion_patterns',
    'update_mbti_detection',
    'adapt_form_presentation',
    'optimize_user_experience'
  ];
}

// Implementation
async function executeProgressiveFormEnhancementWorkflow(
  userId: string
): Promise<EnhancementWorkflowResult> {
  // 1. Monitor user behavior
  const behaviorMonitor = startBehaviorMonitoring(userId);
  
  // 2. Analyze completion patterns
  const completionPatterns = await analyzeCompletionPatterns(
    behaviorMonitor.getBehaviorData()
  );
  
  // 3. Update MBTI detection
  const mbtiUpdate = await updateMBTIDetection({
    behaviorData: behaviorMonitor.getBehaviorData(),
    completionPatterns,
    currentConfidence: await getCurrentMBTIConfidence(userId)
  });
  
  // 4. Adapt form presentation
  const formAdaptations = await adaptFormPresentation({
    mbtiDetection: mbtiUpdate,
    behaviorPatterns: completionPatterns,
    userPreferences: await getUserPreferences(userId)
  });
  
  // 5. Optimize user experience
  const experienceOptimizations = await optimizeUserExperience({
    adaptations: formAdaptations,
    behaviorData: behaviorMonitor.getBehaviorData(),
    performanceMetrics: getFormPerformanceMetrics()
  });
  
  return {
    success: true,
    behaviorAnalyzed: true,
    mbtiUpdated: mbtiUpdate.updated,
    formAdapted: formAdaptations.applied,
    experienceOptimized: experienceOptimizations.applied,
    improvementMetrics: {
      completionSpeedImprovement: experienceOptimizations.speedImprovement,
      userSatisfactionIncrease: experienceOptimizations.satisfactionIncrease,
      dataQualityImprovement: experienceOptimizations.qualityImprovement
    }
  };
}
```

## Performance Operations

### Form Optimization Operations
```typescript
// Optimize form performance and user experience
async function optimizeFormPerformance(): Promise<FormOptimizationResult> {
  const optimizationTasks = {
    // Critical optimizations
    critical: [
      optimizeFieldRendering(),
      optimizeValidationPerformance(),
      optimizeDataPersistence()
    ],
    
    // Important optimizations
    important: [
      optimizeMBTIDetection(),
      optimizeFormAdaptation(),
      optimizeUserFeedback()
    ],
    
    // Background optimizations
    background: [
      preloadNextStepData(),
      optimizeAnalyticsTracking(),
      optimizeOfflineSupport()
    ]
  };
  
  // Execute critical optimizations first
  const criticalResults = await Promise.all(optimizationTasks.critical);
  
  // Execute important optimizations in parallel
  const importantResults = await Promise.allSettled(optimizationTasks.important);
  
  // Execute background optimizations asynchronously
  Promise.allSettled(optimizationTasks.background).then(backgroundResults => {
    processBackgroundOptimizations(backgroundResults);
  });
  
  return {
    criticalOptimizations: criticalResults,
    importantOptimizations: importantResults.filter(r => r.status === 'fulfilled'),
    optimizationStrategy: 'performance_first'
  };
}
```

### Error Recovery Operations
```typescript
// Comprehensive error recovery for form operations
async function executeFormErrorRecovery(
  error: FormError,
  context: FormErrorContext
): Promise<RecoveryResult> {
  const recoveryStrategies = {
    'validation_error': async () => {
      // Reset validation state and provide guidance
      return await resetValidationAndProvideGuidance(context.fieldName, context.fieldValue);
    },
    
    'data_persistence_error': async () => {
      // Queue data for later persistence and continue
      return await queueDataAndContinue(context.formData);
    },
    
    'mbti_detection_error': async () => {
      // Fall back to neutral form presentation
      return await fallbackToNeutralPresentation(context.userId);
    },
    
    'network_error': async () => {
      // Enable offline mode and queue operations
      return await enableOfflineModeAndQueue(context.operations);
    }
  };
  
  const strategy = recoveryStrategies[error.type];
  if (strategy) {
    return await strategy();
  }
  
  // Generic recovery
  return await executeGenericFormRecovery(error, context);
}
```

These atomic operations provide the complete foundation for implementing Step 3 (Name/Basic Info) with full BMAD compliance, ensuring systematic data collection, real-time validation, MBTI behavior tracking, and comprehensive error handling while maintaining the existing onboarding content and WatermelonDB integration.
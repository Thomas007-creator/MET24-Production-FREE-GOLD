# Onboarding Step 2: Account Created - Operations

## Atomic Operations

### Core User Operations

#### 1. Account Verification Operation
```typescript
interface AccountVerificationOperation {
  // Input: User account data from Step 1
  input: {
    userId: string;
    email: string;
    registrationData: RegistrationData;
  };
  
  // Atomic steps
  steps: [
    'validate_account_exists',
    'check_verification_status',
    'load_account_features',
    'initialize_user_preferences',
    'display_account_confirmation'
  ];
  
  // Expected outcome
  result: {
    accountConfirmed: true;
    verificationStatus: VerificationStatus;
    userPreferencesInitialized: boolean;
    featuresActivated: AccountFeatures;
  };
  
  // Error scenarios
  errors: [
    'account_not_found',
    'verification_expired',
    'database_sync_failed',
    'feature_activation_failed'
  ];
}

// Implementation
async function executeAccountVerification(
  userId: string,
  email: string
): Promise<AccountVerificationResult> {
  try {
    // 1. Validate account exists
    const account = await validateAccountExists(userId);
    if (!account) {
      throw new Error('Account not found');
    }
    
    // 2. Check verification status
    const verificationStatus = await checkEmailVerificationStatus(email);
    
    // 3. Load available account features
    const features = await loadAccountFeatures(account.type);
    
    // 4. Initialize user preferences with defaults
    const preferences = await initializeUserPreferences(userId, {
      notifications: getDefaultNotificationSettings(),
      privacy: getDefaultPrivacySettings(),
      personalization: getDefaultPersonalizationSettings()
    });
    
    // 5. Display confirmation
    const confirmationData = {
      account,
      verificationStatus,
      features,
      preferences
    };
    
    // Track successful verification
    trackEvent('account_verification_completed', {
      userId,
      verificationStatus: verificationStatus.status,
      featuresCount: Object.keys(features).length,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      data: confirmationData
    };
  } catch (error) {
    handleAccountVerificationError(error, { userId, email });
    return { success: false, error };
  }
}
```

#### 2. Email Verification Management Operation
```typescript
interface EmailVerificationOperation {
  // Input: Email verification request
  input: {
    email: string;
    action: 'check' | 'resend' | 'verify_token';
    token?: string;
  };
  
  // Atomic steps
  steps: [
    'validate_email_format',
    'check_current_status',
    'execute_verification_action',
    'update_verification_status',
    'notify_user_of_result'
  ];
  
  // Expected outcome
  result: {
    verificationUpdated: boolean;
    statusChanged: boolean;
    userNotified: boolean;
  };
}

// Implementation
async function executeEmailVerificationManagement(
  email: string,
  action: VerificationAction,
  token?: string
): Promise<EmailVerificationResult> {
  // 1. Validate email format
  if (!validateEmailFormat(email)) {
    return { success: false, error: 'invalid_email_format' };
  }
  
  // 2. Check current verification status
  const currentStatus = await getCurrentVerificationStatus(email);
  
  try {
    let result: VerificationActionResult;
    
    // 3. Execute verification action
    switch (action) {
      case 'check':
        result = await checkVerificationStatus(email);
        break;
        
      case 'resend':
        // Rate limiting check
        if (!canResendVerificationEmail(email)) {
          return { 
            success: false, 
            error: 'rate_limit_exceeded',
            retryAfter: getRateLimitRetryTime(email)
          };
        }
        result = await resendVerificationEmail(email);
        break;
        
      case 'verify_token':
        if (!token) {
          return { success: false, error: 'token_required' };
        }
        result = await verifyEmailToken(email, token);
        break;
        
      default:
        return { success: false, error: 'invalid_action' };
    }
    
    // 4. Update verification status
    if (result.statusChanged) {
      await updateVerificationStatus(email, result.newStatus);
    }
    
    // 5. Notify user of result
    await notifyUserOfVerificationResult(email, result);
    
    // Track verification activity
    trackEvent('email_verification_action', {
      email: hashEmail(email),
      action,
      success: result.success,
      previousStatus: currentStatus.status,
      newStatus: result.newStatus?.status,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      action,
      previousStatus: currentStatus,
      newStatus: result.newStatus,
      additionalData: result.data
    };
  } catch (error) {
    handleEmailVerificationError(error, { email, action, token });
    return { success: false, error };
  }
}
```

#### 3. Security Setup Initialization Operation
```typescript
interface SecuritySetupOperation {
  // Input: User security preferences
  input: {
    userId: string;
    securityLevel: 'basic' | 'enhanced' | 'maximum';
    preferences: SecurityPreferences;
  };
  
  // Atomic steps
  steps: [
    'assess_current_security',
    'recommend_security_features',
    'configure_selected_features',
    'test_security_setup',
    'save_security_configuration'
  ];
  
  // Expected outcome
  result: {
    securityConfigured: boolean;
    featuresEnabled: SecurityFeature[];
    recommendationsProvided: SecurityRecommendation[];
  };
}

// Implementation
async function executeSecuritySetupInitialization(
  userId: string,
  securityLevel: SecurityLevel,
  preferences: SecurityPreferences
): Promise<SecuritySetupResult> {
  try {
    // 1. Assess current security status
    const currentSecurity = await assessCurrentSecurity(userId);
    
    // 2. Generate security recommendations
    const recommendations = generateSecurityRecommendations({
      currentSecurity,
      desiredLevel: securityLevel,
      userPreferences: preferences
    });
    
    // 3. Configure selected security features
    const configurationResults = await Promise.allSettled(
      recommendations.map(async (rec) => {
        if (rec.autoApply) {
          return await configureSecurityFeature(userId, rec.feature);
        }
        return { feature: rec.feature, status: 'pending_user_action' };
      })
    );
    
    // 4. Test security setup
    const enabledFeatures = configurationResults
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<any>).value.feature);
    
    const testResults = await testSecurityConfiguration(userId, enabledFeatures);
    
    // 5. Save security configuration
    const securityConfig = {
      userId,
      level: securityLevel,
      enabledFeatures,
      preferences,
      testResults,
      configuredAt: new Date()
    };
    
    await saveSecurityConfiguration(securityConfig);
    
    // Track security setup
    trackEvent('security_setup_initialized', {
      userId,
      securityLevel,
      featuresEnabled: enabledFeatures.length,
      testsPassed: testResults.filter(r => r.passed).length,
      recommendations: recommendations.length
    });
    
    return {
      success: true,
      configuration: securityConfig,
      recommendations: recommendations.filter(r => !r.autoApply),
      testResults
    };
  } catch (error) {
    handleSecuritySetupError(error, { userId, securityLevel });
    return { success: false, error };
  }
}
```

#### 4. Profile Customization Operation
```typescript
interface ProfileCustomizationOperation {
  // Input: User profile preferences
  input: {
    userId: string;
    profileUpdates: ProfileUpdates;
    customizationLevel: 'minimal' | 'standard' | 'comprehensive';
  };
  
  // Atomic steps
  steps: [
    'validate_profile_data',
    'check_data_conflicts',
    'apply_profile_updates',
    'update_user_preferences',
    'sync_profile_changes'
  ];
  
  // Expected outcome
  result: {
    profileUpdated: boolean;
    conflictsResolved: boolean;
    preferencesUpdated: boolean;
    syncCompleted: boolean;
  };
}

// Implementation
async function executeProfileCustomization(
  userId: string,
  profileUpdates: ProfileUpdates,
  customizationLevel: CustomizationLevel
): Promise<ProfileCustomizationResult> {
  try {
    // 1. Validate profile data
    const validationResult = validateProfileData(profileUpdates);
    if (!validationResult.isValid) {
      return {
        success: false,
        error: 'validation_failed',
        validationErrors: validationResult.errors
      };
    }
    
    // 2. Check for data conflicts
    const existingProfile = await getUserProfile(userId);
    const conflicts = detectProfileConflicts(existingProfile, profileUpdates);
    
    if (conflicts.length > 0) {
      const resolutionStrategy = getConflictResolutionStrategy(customizationLevel);
      const resolvedUpdates = await resolveProfileConflicts(
        conflicts,
        profileUpdates,
        resolutionStrategy
      );
      profileUpdates = resolvedUpdates;
    }
    
    // 3. Apply profile updates
    const updateResult = await applyProfileUpdates(userId, profileUpdates);
    
    // 4. Update related user preferences
    const preferencesUpdated = await updateRelatedPreferences(
      userId,
      profileUpdates,
      customizationLevel
    );
    
    // 5. Sync changes across systems
    const syncResults = await syncProfileChanges(userId, {
      profileUpdates,
      preferences: preferencesUpdated,
      timestamp: new Date()
    });
    
    // Track profile customization
    trackEvent('profile_customization_completed', {
      userId,
      customizationLevel,
      fieldsUpdated: Object.keys(profileUpdates).length,
      conflictsResolved: conflicts.length,
      syncSuccessful: syncResults.success
    });
    
    return {
      success: true,
      updatedProfile: updateResult.profile,
      resolvedConflicts: conflicts,
      syncResults
    };
  } catch (error) {
    handleProfileCustomizationError(error, { userId, profileUpdates });
    return { success: false, error };
  }
}
```

### Support Operations

#### 5. MBTI Adaptation Application Operation
```typescript
interface MBTIAdaptationOperation {
  // Input: Detected or selected MBTI type
  input: {
    userId: string;
    mbtiType: MBTIType | null;
    confidence: number;
    behaviorData: BehaviorData;
  };
  
  // Atomic steps
  steps: [
    'validate_mbti_data',
    'load_type_adaptations',
    'apply_content_adaptations',
    'update_ui_preferences',
    'save_adaptation_preferences'
  ];
  
  // Expected outcome
  result: {
    adaptationApplied: boolean;
    contentAdapted: boolean;
    uiUpdated: boolean;
    preferencesStored: boolean;
  };
}

// Implementation
async function executeMBTIAdaptationApplication(
  userId: string,
  mbtiType: MBTIType | null,
  confidence: number,
  behaviorData: BehaviorData
): Promise<MBTIAdaptationResult> {
  try {
    // 1. Validate MBTI data
    if (mbtiType && confidence < 0.6) {
      // Low confidence, use subtle adaptations
      mbtiType = null;
    }
    
    // 2. Load appropriate adaptations
    const adaptations = await loadMBTIAdaptations(mbtiType, {
      step: 'account_created',
      confidence,
      behaviorData
    });
    
    // 3. Apply content adaptations
    const contentAdaptations = await applyContentAdaptations(userId, {
      welcomeMessage: adaptations.welcomeMessage,
      securityPrompt: adaptations.securityPrompt,
      nextStepsPreview: adaptations.nextStepsPreview
    });
    
    // 4. Update UI preferences
    const uiAdaptations = await applyUIAdaptations(userId, {
      colorScheme: adaptations.colorScheme,
      layout: adaptations.layout,
      interactionStyle: adaptations.interactionStyle
    });
    
    // 5. Save adaptation preferences
    const adaptationPreferences = {
      userId,
      mbtiType,
      confidence,
      appliedAdaptations: {
        content: contentAdaptations,
        ui: uiAdaptations
      },
      appliedAt: new Date(),
      step: 'account_created'
    };
    
    await saveAdaptationPreferences(adaptationPreferences);
    
    // Track MBTI adaptation
    trackEvent('mbti_adaptation_applied', {
      userId,
      mbtiType,
      confidence,
      step: 'account_created',
      adaptationsApplied: Object.keys(adaptations).length
    });
    
    return {
      success: true,
      appliedAdaptations: adaptations,
      preferences: adaptationPreferences
    };
  } catch (error) {
    handleMBTIAdaptationError(error, { userId, mbtiType, confidence });
    return { success: false, error };
  }
}
```

#### 6. Troubleshooting Support Operation
```typescript
interface TroubleshootingSupportOperation {
  // Input: User issue or help request
  input: {
    userId: string;
    issueType: 'email_verification' | 'account_access' | 'security_setup' | 'general';
    issueDetails: IssueDetails;
    userContext: UserContext;
  };
  
  // Atomic steps
  steps: [
    'categorize_issue',
    'gather_diagnostic_data',
    'provide_immediate_solutions',
    'escalate_if_needed',
    'track_resolution_outcome'
  ];
  
  // Expected outcome
  result: {
    issueResolved: boolean;
    solutionsProvided: TroubleshootingSolution[];
    escalationRequired: boolean;
  };
}

// Implementation
async function executeTroubleshootingSupport(
  userId: string,
  issueType: IssueType,
  issueDetails: IssueDetails,
  userContext: UserContext
): Promise<TroubleshootingResult> {
  try {
    // 1. Categorize and prioritize issue
    const issueCategory = categorizeIssue(issueType, issueDetails);
    const priority = determinePriority(issueCategory, userContext);
    
    // 2. Gather diagnostic data
    const diagnostics = await gatherDiagnosticData(userId, issueType, {
      browserInfo: userContext.browser,
      networkInfo: userContext.network,
      accountStatus: userContext.accountStatus,
      recentActions: userContext.recentActions
    });
    
    // 3. Provide immediate solutions
    const solutions = await generateTroubleshootingSolutions({
      issueCategory,
      diagnostics,
      userContext
    });
    
    // 4. Check if escalation is needed
    const escalationRequired = shouldEscalateIssue({
      issueCategory,
      priority,
      solutionsEffectiveness: solutions.confidence,
      userFrustrationLevel: userContext.frustrationLevel
    });
    
    if (escalationRequired) {
      await escalateToSupport({
        userId,
        issueType,
        issueDetails,
        diagnostics,
        attemptedSolutions: solutions,
        priority
      });
    }
    
    // 5. Track resolution outcome
    trackEvent('troubleshooting_support_provided', {
      userId,
      issueType,
      priority,
      solutionsProvided: solutions.solutions.length,
      escalated: escalationRequired,
      confidence: solutions.confidence
    });
    
    return {
      success: true,
      solutions: solutions.solutions,
      escalated: escalationRequired,
      supportTicketId: escalationRequired ? await createSupportTicket(userId, issueDetails) : null
    };
  } catch (error) {
    handleTroubleshootingError(error, { userId, issueType, issueDetails });
    return { success: false, error };
  }
}
```

## Composite Operations

### Multi-Step Workflows

#### 1. Complete Account Setup Workflow
```typescript
interface CompleteAccountSetupWorkflow {
  // Orchestrates entire account setup process
  operations: [
    AccountVerificationOperation,
    EmailVerificationOperation,
    SecuritySetupOperation,
    ProfileCustomizationOperation,
    MBTIAdaptationOperation
  ];
  
  // Transaction boundary
  transactionScope: 'account_setup_completion';
  
  // Rollback procedures
  rollbackActions: [
    'restore_previous_settings',
    'clear_incomplete_setup',
    'reset_verification_status'
  ];
}

// Implementation
async function executeCompleteAccountSetupWorkflow(
  userId: string,
  setupPreferences: AccountSetupPreferences
): Promise<WorkflowResult> {
  const transaction = beginAccountSetupTransaction(userId);
  
  try {
    // 1. Verify account exists and load data
    const verification = await executeAccountVerification(
      userId,
      setupPreferences.email
    );
    
    if (!verification.success) {
      throw new Error('Account verification failed');
    }
    
    // 2. Handle email verification
    const emailVerification = await executeEmailVerificationManagement(
      setupPreferences.email,
      'check'
    );
    
    // 3. Initialize security setup if requested
    let securitySetup = null;
    if (setupPreferences.setupSecurity) {
      securitySetup = await executeSecuritySetupInitialization(
        userId,
        setupPreferences.securityLevel,
        setupPreferences.securityPreferences
      );
    }
    
    // 4. Apply profile customizations
    let profileCustomization = null;
    if (setupPreferences.customizeProfile) {
      profileCustomization = await executeProfileCustomization(
        userId,
        setupPreferences.profileUpdates,
        setupPreferences.customizationLevel
      );
    }
    
    // 5. Apply MBTI adaptations
    const mbtiAdaptation = await executeMBTIAdaptationApplication(
      userId,
      setupPreferences.detectedMBTIType,
      setupPreferences.mbtiConfidence,
      setupPreferences.behaviorData
    );
    
    // Commit transaction
    await transaction.commit({
      verification,
      emailVerification,
      securitySetup,
      profileCustomization,
      mbtiAdaptation
    });
    
    return {
      success: true,
      accountSetupComplete: true,
      nextStep: 3,
      setupResults: {
        verification,
        emailVerification,
        securitySetup,
        profileCustomization,
        mbtiAdaptation
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

#### 2. Adaptive Onboarding Flow Operation
```typescript
interface AdaptiveOnboardingFlowOperation {
  // Adapts onboarding based on user behavior and preferences
  operations: [
    'analyze_user_behavior',
    'determine_optimal_path',
    'customize_experience',
    'track_engagement_metrics'
  ];
}

// Implementation
async function executeAdaptiveOnboardingFlow(
  userId: string,
  behaviorData: BehaviorData
): Promise<AdaptiveFlowResult> {
  // 1. Analyze user behavior patterns
  const behaviorAnalysis = analyzeBehaviorPatterns(behaviorData);
  
  // 2. Determine optimal onboarding path
  const optimalPath = determineOptimalOnboardingPath({
    behaviorAnalysis,
    timeConstraints: behaviorData.availableTime,
    complexity: behaviorData.preferredComplexity,
    goals: behaviorData.primaryGoals
  });
  
  // 3. Customize experience based on path
  const customizedExperience = await customizeOnboardingExperience(
    userId,
    optimalPath
  );
  
  // 4. Track engagement metrics
  trackEvent('adaptive_onboarding_applied', {
    userId,
    originalPath: 'standard',
    adaptedPath: optimalPath.pathId,
    customizations: customizedExperience.modifications.length,
    expectedImprovement: optimalPath.expectedEngagementIncrease
  });
  
  return {
    success: true,
    optimalPath,
    customizedExperience,
    engagementPrediction: optimalPath.expectedEngagementIncrease
  };
}
```

## Performance Operations

### Data Loading Optimization
```typescript
// Optimize data loading for account created step
async function optimizeAccountDataLoading(userId: string): Promise<OptimizationResult> {
  const loadingTasks = {
    // Critical data (blocking)
    critical: [
      loadUserAccount(userId),
      checkEmailVerification(userId)
    ],
    
    // Important data (parallel)
    important: [
      loadAccountFeatures(userId),
      loadUserPreferences(userId),
      loadSecuritySettings(userId)
    ],
    
    // Optional data (background)
    optional: [
      loadRecommendations(userId),
      loadCommunityData(userId),
      preloadNextStepData(userId)
    ]
  };
  
  // Load critical data first
  const criticalResults = await Promise.all(loadingTasks.critical);
  
  // Load important data in parallel
  const importantResults = await Promise.allSettled(loadingTasks.important);
  
  // Load optional data in background
  Promise.allSettled(loadingTasks.optional).then(optionalResults => {
    // Background processing of optional data
    processOptionalData(optionalResults);
  });
  
  return {
    criticalData: criticalResults,
    importantData: importantResults.filter(r => r.status === 'fulfilled'),
    loadingStrategy: 'optimized_parallel'
  };
}
```

### Error Recovery Operations
```typescript
// Comprehensive error recovery for account setup
async function executeErrorRecovery(
  error: AccountSetupError,
  context: ErrorContext
): Promise<RecoveryResult> {
  const recoveryStrategy = {
    'email_verification_failed': async () => {
      // Retry email verification with different provider
      return await retryEmailVerificationWithFallback(context.email);
    },
    
    'security_setup_failed': async () => {
      // Reset security setup and provide manual options
      return await resetAndProvideManualSecuritySetup(context.userId);
    },
    
    'profile_sync_failed': async () => {
      // Save profile locally and queue for later sync
      return await saveProfileLocallyAndQueue(context.userId, context.profileData);
    },
    
    'mbti_adaptation_failed': async () => {
      // Fall back to neutral experience
      return await applyNeutralExperience(context.userId);
    }
  };
  
  const strategy = recoveryStrategy[error.type];
  if (strategy) {
    return await strategy();
  }
  
  // Generic recovery
  return await executeGenericRecovery(error, context);
}
```

These atomic operations provide the complete foundation for implementing Step 2 (Account Created) with full BMAD compliance, ensuring every aspect of account setup is handled systematically with proper error recovery and performance optimization.
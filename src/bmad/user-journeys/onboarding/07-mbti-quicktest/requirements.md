# Onboarding Step 7: MBTI Quick Test - Requirements

## Step 7 Context - First Personality Profile Establishment

### Strategic Purpose
Step 7 represents the **pivotal personality detection moment** where theoretical onboarding transforms into personalized coaching. This step creates:
- **Initial MBTI Profile Foundation** - First scientific personality assessment with confidence scoring
- **Behavioral Data Baseline** - Rich response patterns for ongoing MBTI refinement
- **Personalization Engine Activation** - Sufficient data to begin personality-driven adaptations
- **User Investment Milestone** - Completing assessment creates psychological commitment to results

### Core Requirements Framework

#### R7.1: Rapid Assessment Efficiency
```typescript
interface QuickTestEfficiencyRequirements {
  // Time optimization requirements
  completionTimeTarget: {
    optimal: '2-3 minutes'; // Target completion time
    maximum: '5 minutes'; // Absolute maximum before abandonment risk
    perQuestionTime: '15-20 seconds'; // Average per question
  };
  
  // Cognitive load requirements
  cognitiveSimplicity: {
    readingLevel: 'grade_8_maximum'; // Accessible language level
    questionClarity: 'single_concept_per_question'; // No compound concepts
    responseSimplicity: 'likert_5_point_scale'; // Simple, familiar response format
  };
  
  // UI responsiveness requirements
  performanceStandards: {
    questionTransitionTime: '<200ms'; // Smooth question transitions
    scoringCalculationTime: '<500ms'; // Near-instant results
    databaseWriteTime: '<1000ms'; // Background persistence
  };
  
  // Abandonment prevention
  abandonmentMitigation: {
    progressIndicator: 'clear_visual_progress_bar_with_completion_percentage';
    questionCounter: 'question_x_of_10_display';
    motivationalMessaging: 'encouraging_progress_messages_at_questions_3_6_9';
    skipOption: 'visible_but_discouraged_skip_option_with_value_explanation';
  };
}
```

#### R7.2: Scientific Assessment Accuracy
```typescript
interface AssessmentAccuracyRequirements {
  // Psychometric validity requirements
  psychometricStandards: {
    dichotomyBalance: 'balanced_representation_of_all_four_MBTI_dichotomies';
    itemDistribution: 'I_E_2_items_S_N_3_items_T_F_3_items_J_P_2_items';
    questionPolarity: 'mixed_positive_and_negative_polarity_to_prevent_response_bias';
    culturalNeutrality: 'culturally_neutral_language_and_scenarios';
  };
  
  // Scoring algorithm requirements
  scoringAlgorithmSpecs: {
    responseMapping: 'likert_1_5_mapped_to_negative_2_positive_2_centered_at_3';
    dichotomyCalculation: 'sum_relevant_items_per_dichotomy_with_polarity_adjustment';
    percentageNormalization: 'percentage_equals_50_plus_sum_divided_by_max_possible_times_50';
    letterDetermination: 'positive_sum_selects_right_pole_negative_sum_selects_left_pole';
  };
  
  // Confidence calculation requirements
  confidenceCalculationSpecs: {
    baseConfidenceFormula: 'absolute_value_of_sum_divided_by_max_possible_times_100';
    maximumConfidence: '100_percent_for_completely_consistent_responses';
    minimumConfidence: '25_percent_for_completely_neutral_responses';
    mixedResponseHandling: 'lower_confidence_for_inconsistent_response_patterns';
  };
  
  // Accuracy validation requirements
  accuracyValidation: {
    testRetestReliability: '>75_percent_consistency_on_retesting_within_24_hours';
    constructValidity: 'correlates_with_full_MBTI_assessment_at_>70_percent_accuracy';
    predictiveValidity: 'predicts_user_preferences_and_behaviors_at_>65_percent_accuracy';
  };
}
```

#### R7.3: Data Security and Privacy Protection
```typescript
interface DataSecurityRequirements {
  // Response data encryption
  responseDataProtection: {
    rawAnswersEncryption: 'AES_256_encryption_of_all_raw_response_data';
    encryptionKeyManagement: 'per_user_encryption_keys_with_secure_key_derivation';
    encryptedStorageRequirement: 'raw_answers_never_stored_unencrypted';
    decryptionAccessControl: 'only_user_authenticated_sessions_can_decrypt_responses';
  };
  
  // Profile data protection
  profileDataSecurity: {
    personalityTypeStorage: 'personality_letters_stored_separately_from_raw_responses';
    confidenceScoreProtection: 'confidence_scores_treated_as_sensitive_personal_data';
    percentageDataSecurity: 'dichotomy_percentages_encrypted_in_transit_and_at_rest';
    aggregationProtection: 'no_cross_user_aggregation_without_explicit_consent';
  };
  
  // Access control requirements
  dataAccessControl: {
    userExclusiveAccess: 'only_authenticated_user_can_access_their_assessment_data';
    administrativeAccess: 'no_administrative_access_to_decrypted_assessment_responses';
    analyticsDataMinimization: 'only_aggregate_anonymous_completion_metrics_tracked';
    dataDeletionRights: 'user_can_request_complete_deletion_of_assessment_data';
  };
  
  // Compliance requirements
  privacyCompliance: {
    gdprCompliance: 'full_GDPR_compliance_for_EU_users';
    ccpaCompliance: 'California_Consumer_Privacy_Act_compliance';
    consentManagement: 'explicit_consent_for_personality_data_processing';
    dataMinimization: 'collect_only_data_necessary_for_personality_assessment';
  };
}
```

#### R7.4: User Experience and Engagement Optimization
```typescript
interface UserExperienceRequirements {
  // Modal interface requirements
  modalInterfaceSpecs: {
    modalPresentation: 'full_screen_modal_overlay_with_focused_experience';
    visualDesign: 'glassmorphism_design_consistent_with_app_aesthetic';
    responsiveLayout: 'optimized_for_mobile_and_desktop_viewing';
    accessibilityCompliance: 'WCAG_2_1_AA_compliance_for_accessibility';
  };
  
  // Question presentation requirements
  questionPresentationSpecs: {
    singleQuestionDisplay: 'one_question_visible_at_a_time_for_focus';
    clearQuestionText: 'large_readable_text_with_adequate_contrast';
    likertScaleVisual: 'visual_likert_scale_with_clear_anchor_labels';
    responseSelection: 'large_touch_friendly_response_options';
  };
  
  // Progress indication requirements
  progressIndicationSpecs: {
    visualProgressBar: 'animated_progress_bar_showing_completion_percentage';
    questionCounter: 'current_question_number_and_total_question_count';
    timeEstimate: 'remaining_time_estimate_based_on_current_pace';
    motivationalElements: 'encouraging_micro_interactions_and_positive_reinforcement';
  };
  
  // Result presentation requirements
  resultPresentationSpecs: {
    immediateResults: 'personality_type_and_confidence_displayed_immediately_upon_completion';
    visualTypeRepresentation: 'attractive_visual_representation_of_MBTI_type';
    confidenceExplanation: 'clear_explanation_of_confidence_score_meaning';
    nextStepsGuidance: 'clear_guidance_on_how_results_will_be_used_in_coaching';
  };
}
```

#### R7.5: Analytics and Learning System Integration
```typescript
interface AnalyticsRequirements {
  // Assessment completion analytics
  completionAnalytics: {
    eventTracking: 'onboarding_mbti_quicktest_completed_event_with_comprehensive_metadata';
    completionRate: 'track_completion_vs_abandonment_rates_by_question_number';
    timeAnalytics: 'per_question_response_time_and_total_completion_time';
    deviceAnalytics: 'completion_rates_and_patterns_by_device_type';
  };
  
  // Response pattern analytics
  responsePatternAnalytics: {
    dichotomyDistribution: 'aggregate_anonymous_distribution_of_dichotomy_preferences';
    confidencePatterns: 'confidence_score_distribution_and_factors_affecting_confidence';
    questionDifficulty: 'question_specific_response_time_and_confidence_impact';
    abandonmentPatterns: 'analysis_of_abandonment_points_and_contributing_factors';
  };
  
  // Quality assurance analytics
  qualityAssuranceAnalytics: {
    responseConsistency: 'detection_of_inconsistent_or_potentially_invalid_response_patterns';
    speedAnalysis: 'identification_of_suspiciously_fast_or_slow_completion_times';
    patternDetection: 'detection_of_straight_line_responding_or_other_invalid_patterns';
    outlierIdentification: 'identification_of_statistical_outliers_in_response_patterns';
  };
  
  // Continuous improvement analytics
  continuousImprovementAnalytics: {
    questionEffectiveness: 'analysis_of_individual_question_discrimination_and_validity';
    algorithmOptimization: 'tracking_of_scoring_algorithm_accuracy_and_optimization_opportunities';
    userSatisfaction: 'post_assessment_satisfaction_and_perceived_accuracy_tracking';
    longTermValidity: 'longitudinal_tracking_of_assessment_accuracy_and_stability';
  };
}
```

## Assessment Item Specifications

### Question Design Requirements
```typescript
interface QuestionDesignSpecs {
  // Item 1: Introversion/Extraversion
  item1_introversion: {
    text: "Ik laad het liefst op door alleen tijd door te brengen.";
    dichotomy: 'I/E';
    polarity: 'positive_I'; // Higher scores = more Introverted
    culturalNote: 'culturally_neutral_activity_preference_statement';
  };
  
  // Item 2: Sensing/Intuition
  item2_sensing: {
    text: "Ik let meer op feiten en details dan op patronen en mogelijkheden.";
    dichotomy: 'S/N';
    polarity: 'positive_S'; // Higher scores = more Sensing
    culturalNote: 'information_processing_preference_without_value_judgment';
  };
  
  // Item 3: Thinking/Feeling
  item3_thinking: {
    text: "Beslissingen neem ik meestal op basis van logica in plaats van gevoel.";
    dichotomy: 'T/F';
    polarity: 'positive_T'; // Higher scores = more Thinking
    culturalNote: 'decision_making_style_preference_without_gender_bias';
  };
  
  // Item 4: Judging/Perceiving
  item4_judging: {
    text: "Ik plan graag dingen en houd van structuur.";
    dichotomy: 'J/P';
    polarity: 'positive_J'; // Higher scores = more Judging
    culturalNote: 'lifestyle_preference_without_productivity_judgment';
  };
  
  // Item 5: Extraversion/Introversion
  item5_extraversion: {
    text: "Ik voel me energieker na het ontmoeten van nieuwe mensen.";
    dichotomy: 'E/I';
    polarity: 'positive_E'; // Higher scores = more Extraverted
    culturalNote: 'social_energy_preference_without_social_skill_judgment';
  };
  
  // Item 6: Intuition/Sensing
  item6_intuition: {
    text: "Ik vertrouw op intuïtie om toekomstmogelijkheden te zien.";
    dichotomy: 'N/S';
    polarity: 'positive_N'; // Higher scores = more Intuitive
    culturalNote: 'information_gathering_preference_without_mysticism';
  };
  
  // Item 7: Thinking/Feeling
  item7_thinking: {
    text: "In discussies zoek ik naar de waarheid, zelfs als het ongemakkelijk is.";
    dichotomy: 'T/F';
    polarity: 'positive_T'; // Higher scores = more Thinking
    culturalNote: 'communication_style_preference_without_confrontation_judgment';
  };
  
  // Item 8: Perceiving/Judging
  item8_perceiving: {
    text: "Ik vind flexibiliteit en ruimte belangrijker dan strakke planning.";
    dichotomy: 'P/J';
    polarity: 'positive_P'; // Higher scores = more Perceiving
    culturalNote: 'planning_preference_without_responsibility_judgment';
  };
  
  // Item 9: Sensing/Intuition
  item9_sensing: {
    text: "Ik merk vaak details op die anderen missen.";
    dichotomy: 'S/N';
    polarity: 'positive_S'; // Higher scores = more Sensing
    culturalNote: 'attention_style_preference_without_superiority_implication';
  };
  
  // Item 10: Feeling/Thinking
  item10_feeling: {
    text: "Ik stel mijn gevoelens en waarden mee laten wegen bij beslissingen.";
    dichotomy: 'F/T';
    polarity: 'positive_F'; // Higher scores = more Feeling
    culturalNote: 'decision_making_style_without_emotional_instability_implication';
  };
}
```

## Scoring Algorithm Specifications

### Comprehensive Scoring Requirements
```typescript
interface ScoringAlgorithmSpecs {
  // Response value mapping
  responseMapping: {
    likertScale: '1_completely_disagree_to_5_completely_agree';
    numericalMapping: '1_maps_to_negative_2_through_5_maps_to_positive_2';
    centerPoint: '3_maps_to_0_neutral_response';
    formula: 'mapped_value = raw_response - 3';
  };
  
  // Dichotomy calculation
  dichotomyCalculation: {
    IE_calculation: 'sum_items_1_and_5_with_item_1_reverse_scored';
    SN_calculation: 'sum_items_2_6_9_with_items_2_and_9_reverse_scored';
    TF_calculation: 'sum_items_3_7_10_with_item_10_reverse_scored';
    JP_calculation: 'sum_items_4_and_8_with_item_8_reverse_scored';
  };
  
  // Percentage normalization
  percentageNormalization: {
    maxPossibleScore: 'number_of_items_per_dichotomy_times_2';
    percentageFormula: '50_plus_dichotomy_sum_divided_by_max_possible_times_50';
    resultRange: '0_to_100_percentage_toward_positive_pole';
    interpretation: 'higher_percentage_indicates_stronger_preference_for_positive_pole';
  };
  
  // Letter determination
  letterDetermination: {
    IE_logic: 'negative_sum_yields_I_positive_sum_yields_E';
    SN_logic: 'negative_sum_yields_S_positive_sum_yields_N';
    TF_logic: 'negative_sum_yields_T_positive_sum_yields_F';
    JP_logic: 'negative_sum_yields_J_positive_sum_yields_P';
  };
  
  // Confidence calculation
  confidenceCalculation: {
    baseFormula: 'absolute_value_of_dichotomy_sum_divided_by_max_possible_times_100';
    minimumConfidence: '25_percent_for_all_neutral_responses';
    maximumConfidence: '100_percent_for_completely_consistent_responses';
    overallConfidence: 'average_of_all_four_dichotomy_confidence_scores';
  };
}
```

## Success Metrics and Validation

### Assessment Quality Metrics
```typescript
interface QualityMetrics {
  // Completion and engagement metrics
  completionMetrics: {
    completionRate: '>85_percent_of_users_who_start_complete_the_assessment';
    averageCompletionTime: '2_to_4_minutes_average_completion_time';
    abandonmentPoints: '<5_percent_abandonment_at_any_single_question';
    skipRate: '<10_percent_of_users_choose_to_skip_assessment';
  };
  
  // Accuracy and reliability metrics
  accuracyMetrics: {
    testRetestReliability: '>75_percent_consistency_on_24_hour_retest';
    constructValidity: '>70_percent_correlation_with_full_MBTI_assessment';
    predictiveValidity: '>65_percent_accuracy_in_predicting_user_preferences';
    confidenceCorrelation: 'higher_confidence_scores_correlate_with_higher_accuracy';
  };
  
  // User satisfaction metrics
  satisfactionMetrics: {
    perceivedAccuracy: '>75_percent_of_users_feel_results_are_accurate';
    assessmentExperience: '>80_percent_satisfaction_with_assessment_experience';
    timeInvestment: '>85_percent_feel_time_investment_was_worthwhile';
    resultUtility: '>75_percent_find_results_useful_for_self_understanding';
  };
  
  // Technical performance metrics
  performanceMetrics: {
    loadTime: '<2_seconds_initial_modal_load_time';
    responseTime: '<200ms_question_transition_time';
    scoringTime: '<500ms_result_calculation_time';
    errorRate: '<0_1_percent_technical_error_rate_during_assessment';
  };
}
```

## Integration Requirements

### Database Integration Specifications
```typescript
interface DatabaseIntegrationSpecs {
  // MBTI profiles table requirements
  mbtiProfilesTable: {
    tableStructure: 'user_id_letters_percentages_source_confidence_raw_answers_encrypted_created_at';
    dataTypes: 'user_id_uuid_letters_varchar_4_percentages_jsonb_confidence_integer_0_100';
    constraints: 'user_id_foreign_key_confidence_check_0_to_100_created_at_not_null';
    indexing: 'primary_key_on_id_unique_index_on_user_id_source_composite';
  };
  
  // Onboarding states integration
  onboardingStatesIntegration: {
    flagUpdate: 'set_mbti_quicktest_completed_to_true_upon_successful_completion';
    progressTracking: 'update_onboarding_progress_percentage_to_reflect_completion';
    conditionalFlow: 'enable_access_to_subsequent_onboarding_steps';
    validation: 'validate_mbti_profile_exists_before_allowing_progression';
  };
  
  // Analytics events integration
  analyticsEventsIntegration: {
    completionEvent: 'onboarding_mbti_quicktest_completed_with_metadata';
    abandonmentTracking: 'onboarding_mbti_quicktest_abandoned_with_question_number';
    timingEvents: 'question_response_timing_and_total_completion_time';
    qualityEvents: 'confidence_score_and_response_pattern_characteristics';
  };
}
```

### Security Integration Requirements
```typescript
interface SecurityIntegrationSpecs {
  // Encryption integration
  encryptionIntegration: {
    encryptionFunction: 'use_existing_encryptPayload_function_for_raw_answers';
    keyManagement: 'integrate_with_existing_user_specific_encryption_key_system';
    decryptionAccess: 'ensure_only_authenticated_user_can_decrypt_their_responses';
    secureTransmission: 'encrypt_all_assessment_data_in_transit';
  };
  
  // Authentication integration
  authenticationIntegration: {
    userVerification: 'verify_user_authentication_before_allowing_assessment_access';
    sessionValidation: 'validate_active_session_throughout_assessment_process';
    crossSessionSecurity: 'prevent_cross_user_data_leakage_in_shared_sessions';
    accessLogging: 'log_assessment_access_and_completion_for_security_auditing';
  };
}
```

This comprehensive requirements framework ensures that Step 7 delivers a scientifically valid, user-friendly, and secure MBTI quick test that establishes a reliable personality foundation for all subsequent personalization features.
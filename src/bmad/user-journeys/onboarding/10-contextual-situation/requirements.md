# Onboarding Step 10: Contextuele Situatie - Requirements

## Business Context & Strategic Importance

### Step 10 Strategic Position
The Contextuele Situatie collection in Step 10 serves as the **practical coaching foundation** for:
- **AI Coaching Effectiveness** - Providing specific context for personalized guidance and insights
- **Immediate Value Demonstration** - Allowing users to experience AI coaching with real situations
- **Coaching Preparation** - Establishing concrete scenarios for ongoing coaching sessions
- **Personalization Enhancement** - Connecting personality insights to real-world applications

### Core Business Requirements

#### 1. Contextual Data Collection Framework
```typescript
interface ContextualSituationBusinessRequirements {
  // Primary context categories
  requiredContextTypes: {
    situationDescription: {
      purpose: 'capture_specific_challenge_or_goal_user_wants_guidance_on';
      businessValue: 'enables_targeted_ai_coaching_with_relevant_advice';
      dataUsage: 'foundation_for_personalized_coaching_recommendations_and_insights';
      maxLength: 300; // characters
      encryption: true; // sensitive personal information
    };
    
    involvedPersons: {
      purpose: 'understand_interpersonal_dynamics_and_stakeholders_in_situation';
      businessValue: 'enables_relationship_aware_coaching_and_communication_strategies';
      dataUsage: 'informs_mbti_based_interpersonal_guidance_and_conflict_resolution';
      format: 'multi_select_predefined_roles_with_custom_option';
    };
    
    desiredOutcome: {
      purpose: 'clarify_user_goals_and_success_criteria_for_situation';
      businessValue: 'enables_goal_oriented_coaching_with_measurable_objectives';
      dataUsage: 'guides_ai_coaching_toward_specific_actionable_outcomes';
      maxLength: 200; // characters
      encryption: true; // personal goals may be sensitive
    };
    
    previousAttempts: {
      purpose: 'understand_what_user_has_already_tried_to_avoid_repetition';
      businessValue: 'prevents_suggesting_already_failed_approaches_improves_coaching_quality';
      dataUsage: 'informs_advanced_alternative_strategies_and_learning_from_failures';
      maxLength: 200; // characters
      encryption: true; // may contain sensitive personal details
    };
    
    currentEmotion: {
      purpose: 'capture_emotional_state_to_provide_emotionally_intelligent_coaching';
      businessValue: 'enables_empathetic_ai_responses_and_emotional_state_appropriate_guidance';
      dataUsage: 'adapts_coaching_tone_urgency_and_emotional_support_level';
      format: 'dropdown_selection_plus_optional_explanation';
    };
    
    lifePhase: {
      purpose: 'understand_life_context_and_stage_specific_challenges';
      businessValue: 'enables_life_stage_appropriate_coaching_and_relevant_examples';
      dataUsage: 'contextualizes_advice_for_age_and_life_situation_relevance';
      format: 'dropdown_predefined_life_phases';
    };
    
    communicationStyle: {
      purpose: 'tailor_ai_communication_approach_to_user_preferences';
      businessValue: 'improves_coaching_effectiveness_through_preferred_communication_style';
      dataUsage: 'customizes_ai_response_tone_structure_and_interaction_style';
      format: 'checkbox_selection_with_examples_and_explanations';
    };
    
    stressLevel: {
      purpose: 'gauge_urgency_and_emotional_intensity_of_situation';
      businessValue: 'enables_stress_appropriate_coaching_and_prioritization';
      dataUsage: 'adjusts_coaching_urgency_support_level_and_intervention_intensity';
      format: 'slider_scale_0_to_10_with_descriptive_labels';
    };
  };
  
  // Optional enrichment context
  optionalContextEnhancements: {
    timeConstraints: 'deadline_or_timing_pressures_affecting_situation';
    resourceLimitations: 'available_resources_budget_or_constraint_considerations';
    pastSuccessPatterns: 'previous_situations_where_user_found_success';
    personalValues: 'values_most_important_in_resolving_this_situation';
    supportNetwork: 'available_people_or_resources_for_assistance';
  };
}
```

#### 2. Success Metrics & Business Outcomes
```typescript
interface ContextualSituationSuccessMetrics {
  // Primary engagement metrics
  engagementMetrics: {
    contextCompletionRate: {
      target: '>78%';
      measurement: 'percentage_of_users_providing_contextual_situation_details';
      businessImpact: 'enables_immediate_coaching_value_demonstration_for_majority';
    };
    
    fieldCompletionDepth: {
      target: '>4_fields_completed_average';
      measurement: 'average_number_of_context_fields_completed_per_user';
      businessImpact: 'richer_context_enables_higher_quality_coaching_responses';
    };
    
    contextQuality: {
      target: '>85%_actionable_context';
      measurement: 'ai_assessment_of_context_richness_and_actionability';
      businessImpact: 'higher_quality_context_leads_to_more_effective_coaching';
    };
    
    immediateValuePerception: {
      target: '>80%_find_value_in_providing_context';
      measurement: 'user_feedback_on_perceived_value_of_context_collection';
      businessImpact: 'positive_experience_drives_continued_engagement_and_coaching_adoption';
    };
  };
  
  // Coaching effectiveness metrics
  coachingEffectivenessMetrics: {
    contextBasedCoachingQuality: {
      target: '>85%_relevant_coaching_responses';
      measurement: 'user_rating_of_coaching_relevance_when_context_provided';
      businessImpact: 'demonstrates_immediate_value_of_personalized_ai_coaching';
    };
    
    situationProgressTracking: {
      target: '>70%_situation_improvement_reported';
      measurement: 'user_reported_progress_on_contextual_situations_after_coaching';
      businessImpact: 'validates_coaching_effectiveness_and_drives_continued_usage';
    };
    
    contextReferenceFrequency: {
      target: '>60%_contexts_referenced_in_future_sessions';
      measurement: 'frequency_contextual_situations_referenced_in_ongoing_coaching';
      businessImpact: 'demonstrates_lasting_value_and_continuity_of_coaching_relationship';
    };
  };
  
  // Personalization enhancement metrics
  personalizationMetrics: {
    mbtiContextAlignment: {
      target: '>85%_mbti_appropriate_context_interpretation';
      measurement: 'alignment_between_user_mbti_and_context_interpretation_approach';
      businessImpact: 'personality_informed_context_analysis_improves_coaching_relevance';
    };
    
    emotionalIntelligenceAccuracy: {
      target: '>80%_emotional_state_appropriate_responses';
      measurement: 'accuracy_of_emotional_state_recognition_and_appropriate_response';
      businessImpact: 'emotionally_intelligent_coaching_builds_trust_and_effectiveness';
    };
    
    communicationStyleAdaptation: {
      target: '>90%_preferred_communication_style_adherence';
      measurement: 'adherence_to_user_specified_communication_preferences';
      businessImpact: 'communication_style_matching_improves_user_satisfaction_and_understanding';
    };
  };
}
```

#### 3. Privacy & Security Requirements
```typescript
interface ContextualSituationPrivacyRequirements {
  // Data protection principles
  privacyPrinciples: {
    optionalParticipation: {
      requirement: 'all_contextual_situation_fields_are_completely_optional';
      reasoning: 'respects_user_privacy_and_comfort_with_sharing_personal_details';
      implementation: 'clear_skip_options_and_benefit_explanations_for_each_field';
    };
    
    encryptionOfSensitiveContent: {
      requirement: 'encrypt_all_free_text_fields_containing_personal_situations';
      reasoning: 'protects_sensitive_personal_information_from_unauthorized_access';
      implementation: 'aes_256_encryption_for_situation_description_desired_outcome_previous_attempts';
    };
    
    contextualConsent: {
      requirement: 'explicit_consent_for_ai_coaching_usage_of_provided_context';
      reasoning: 'ensures_informed_consent_for_ai_analysis_and_coaching_recommendations';
      implementation: 'clear_explanation_of_how_context_will_be_used_for_coaching';
    };
    
    userControlOverContext: {
      requirement: 'users_can_edit_delete_or_update_contextual_situations_anytime';
      reasoning: 'maintains_user_control_over_sensitive_personal_information';
      implementation: 'comprehensive_context_management_interface_with_full_crud_operations';
    };
  };
  
  // Security and storage requirements
  securityRequirements: {
    encryptedStorage: 'contextual_situation_data_encrypted_at_rest_and_in_transit';
    accessControl: 'contextual_data_access_limited_to_ai_coaching_algorithms_and_user_interface';
    auditLogging: 'all_contextual_data_access_and_modifications_logged_for_security_monitoring';
    dataRetention: 'contextual_situations_retained_only_while_useful_for_coaching_with_user_deletion_rights';
    anonymization: 'contextual_data_anonymized_for_ai_model_improvement_with_explicit_consent';
  };
}
```

### Business Value Propositions

#### 1. Immediate Coaching Value Demonstration
```typescript
interface ImmediateCoachingValueDemonstration {
  // Real-world application capabilities
  realWorldApplications: {
    instantCoachingPreview: {
      capability: 'provide_immediate_coaching_insights_based_on_user_provided_context';
      businessValue: 'demonstrates_ai_coaching_value_before_user_commits_to_ongoing_coaching';
      userExperience: 'users_experience_personalized_relevant_coaching_immediately';
      conversionImpact: 'increases_likelihood_of_continued_coaching_engagement';
    };
    
    personalizedRelevance: {
      capability: 'connect_mbti_insights_to_specific_real_situations_user_faces';
      businessValue: 'bridges_gap_between_personality_theory_and_practical_application';
      userExperience: 'users_see_immediate_practical_value_of_personality_insights';
      retentionImpact: 'practical_relevance_drives_continued_platform_usage';
    };
    
    contextualizedAdvice: {
      capability: 'provide_situation_specific_advice_rather_than_generic_recommendations';
      businessValue: 'differentiates_from_generic_coaching_content_and_demonstrates_ai_sophistication';
      userExperience: 'users_receive_targeted_actionable_advice_for_their_specific_challenges';
      satisfactionImpact: 'specific_relevant_advice_increases_user_satisfaction_and_trust';
    };
  };
  
  // Coaching quality enhancement
  coachingQualityEnhancement: {
    emotionallyIntelligentResponses: {
      capability: 'adapt_coaching_tone_and_approach_based_on_user_emotional_state';
      businessValue: 'creates_more_human_like_empathetic_ai_coaching_experience';
      userExperience: 'users_feel_understood_and_emotionally_supported_by_ai_coach';
      trustImpact: 'emotional_intelligence_builds_trust_in_ai_coaching_capabilities';
    };
    
    communicationStyleMatching: {
      capability: 'deliver_coaching_in_user_preferred_communication_style';
      businessValue: 'maximizes_coaching_effectiveness_through_optimal_communication_approach';
      userExperience: 'users_receive_coaching_in_format_and_style_they_best_respond_to';
      engagementImpact: 'communication_style_matching_increases_engagement_and_comprehension';
    };
    
    stressLevelAppropriateSupport: {
      capability: 'adjust_coaching_urgency_and_support_level_based_on_user_stress';
      businessValue: 'provides_appropriate_level_of_intervention_and_support_for_user_needs';
      userExperience: 'users_receive_stress_appropriate_coaching_that_matches_their_current_state';
      wellnessImpact: 'stress_aware_coaching_supports_user_mental_health_and_wellbeing';
    };
  };
}
```

#### 2. Coaching Continuity and Relationship Building
```typescript
interface CoachingContinuityAndRelationshipBuilding {
  // Long-term coaching relationship development
  relationshipDevelopment: {
    situationMemory: {
      capability: 'remember_and_reference_user_contextual_situations_in_future_coaching';
      businessValue: 'creates_sense_of_continuous_coaching_relationship_rather_than_isolated_interactions';
      userExperience: 'users_experience_coaching_as_ongoing_relationship_with_memory_and_continuity';
      loyaltyImpact: 'relationship_continuity_increases_user_loyalty_and_long_term_engagement';
    };
    
    progressTracking: {
      capability: 'track_progress_on_specific_situations_over_time';
      businessValue: 'demonstrates_coaching_effectiveness_and_value_through_measurable_progress';
      userExperience: 'users_see_concrete_progress_on_their_real_challenges_and_goals';
      retentionImpact: 'visible_progress_drives_continued_coaching_engagement';
    };
    
    contextualLearning: {
      capability: 'learn_from_user_situation_outcomes_to_improve_future_coaching';
      businessValue: 'continuously_improves_coaching_quality_through_real_world_feedback';
      userExperience: 'users_experience_coaching_that_gets_better_and_more_accurate_over_time';
      satisfactionImpact: 'improving_coaching_quality_increases_long_term_user_satisfaction';
    };
  };
  
  // Coaching personalization enhancement
  personalizationEnhancement: {
    mbtiContextIntegration: {
      capability: 'combine_mbti_insights_with_real_situations_for_enhanced_personalization';
      businessValue: 'creates_unprecedented_level_of_personalized_coaching_combining_theory_and_practice';
      userExperience: 'users_receive_coaching_that_is_both_personality_informed_and_situation_specific';
      differentiationImpact: 'unique_personalization_approach_differentiates_from_competitors';
    };
    
    adaptiveCoachingStyles: {
      capability: 'adapt_coaching_approach_based_on_situation_type_and_user_preferences';
      businessValue: 'maximizes_coaching_effectiveness_through_situation_appropriate_approaches';
      userExperience: 'users_experience_varied_coaching_approaches_optimized_for_different_challenges';
      versatilityImpact: 'coaching_versatility_demonstrates_ai_sophistication_and_capability';
    };
  };
}
```

### Integration & Workflow Requirements

#### 1. AI Coaching Integration
```typescript
interface AICoachingIntegration {
  // Context processing for AI coaching
  contextProcessingForAI: {
    situationAnalysis: {
      requirement: 'analyze_situation_complexity_stakeholders_and_potential_approaches';
      implementation: 'ai_powered_situation_analysis_considering_interpersonal_dynamics_and_constraints';
      businessValue: 'enables_sophisticated_situation_specific_coaching_recommendations';
    };
    
    emotionalContextIntegration: {
      requirement: 'incorporate_emotional_state_and_stress_level_into_coaching_approach';
      implementation: 'emotional_intelligence_algorithms_that_adapt_coaching_tone_and_urgency';
      businessValue: 'creates_emotionally_appropriate_and_supportive_coaching_experience';
    };
    
    mbtiContextualizedGuidance: {
      requirement: 'combine_mbti_insights_with_situation_context_for_personalized_guidance';
      implementation: 'mbti_informed_situation_analysis_and_personality_appropriate_solution_generation';
      businessValue: 'delivers_unprecedented_personalization_combining_personality_and_context';
    };
    
    communicationStyleAdaptation: {
      requirement: 'deliver_coaching_recommendations_in_user_preferred_communication_style';
      implementation: 'dynamic_response_formatting_based_on_communication_preferences';
      businessValue: 'maximizes_coaching_effectiveness_through_optimal_communication_delivery';
    };
  };
  
  // Immediate coaching value demonstration
  immediateValueDemonstration: {
    onboardingCoachingPreview: {
      requirement: 'provide_immediate_coaching_insights_based_on_provided_context';
      implementation: 'real_time_ai_coaching_response_generation_during_onboarding_completion';
      businessValue: 'demonstrates_coaching_value_and_encourages_continued_engagement';
    };
    
    contextualizedPersonalityInsights: {
      requirement: 'show_how_mbti_insights_apply_to_user_specific_situation';
      implementation: 'personality_type_specific_situation_analysis_and_recommendation_generation';
      businessValue: 'bridges_personality_theory_and_practical_application_for_immediate_value';
    };
  };
}
```

#### 2. Data Persistence and Security
```typescript
interface DataPersistenceAndSecurity {
  // WatermelonDB integration
  watermelonDBIntegration: {
    contextualSituationsTable: {
      schema: {
        id: 'unique_identifier_for_contextual_situation_record';
        user_id: 'foreign_key_reference_to_user_table';
        situation_description_encrypted: 'aes_256_encrypted_situation_description';
        involved_persons: 'json_array_of_selected_person_roles';
        desired_outcome_encrypted: 'aes_256_encrypted_desired_outcome_description';
        previous_attempts_encrypted: 'aes_256_encrypted_previous_attempts_description';
        current_emotion: 'selected_emotion_from_predefined_options';
        emotion_explanation: 'optional_explanation_of_emotional_state';
        life_phase: 'selected_life_phase_from_predefined_options';
        communication_styles: 'json_array_of_selected_communication_preferences';
        stress_level: 'integer_0_to_10_stress_level_rating';
        created_at: 'timestamp_of_context_creation';
        updated_at: 'timestamp_of_last_context_update';
        is_active: 'boolean_indicating_if_situation_is_still_relevant';
        coaching_history: 'json_array_of_coaching_interactions_related_to_this_context';
      };
      
      indexes: {
        user_id_index: 'efficient_user_specific_context_retrieval';
        created_at_index: 'temporal_context_querying_and_sorting';
        is_active_index: 'filtering_for_currently_relevant_situations';
        stress_level_index: 'stress_based_context_prioritization';
      };
    };
    
    encryptionStrategy: {
      sensitiveFields: ['situation_description', 'desired_outcome', 'previous_attempts'];
      encryptionMethod: 'aes_256_encryption_with_user_specific_keys';
      keyManagement: 'secure_key_derivation_from_user_authentication_credentials';
      decryptionScope: 'decryption_only_for_ai_coaching_and_user_interface_display';
    };
  };
  
  // Supabase synchronization
  supabaseSynchronization: {
    encryptedDataSync: 'synchronize_encrypted_contextual_data_to_supabase_for_backup_and_multi_device_access';
    conflictResolution: 'handle_conflicts_between_local_and_remote_contextual_situation_updates';
    privacyPreservingSync: 'ensure_synchronization_maintains_encryption_and_privacy_protection';
    selectiveSync: 'allow_users_to_control_which_contextual_situations_are_synced_to_cloud';
  };
}
```

## Technical Requirements

### User Experience Flow Requirements
```typescript
interface ContextualSituationUXFlowRequirements {
  // Progressive disclosure and optional completion
  progressiveDisclosure: {
    coreContext: {
      order: 1;
      fields: ['situation_description'];
      reasoning: 'essential_for_basic_coaching_context_and_value_demonstration';
      completion_encouragement: 'clear_explanation_of_how_situation_description_enables_coaching';
    };
    
    interpersonalContext: {
      order: 2;
      fields: ['involved_persons', 'desired_outcome'];
      reasoning: 'enables_relationship_aware_coaching_and_goal_oriented_guidance';
      completion_encouragement: 'show_examples_of_enhanced_coaching_with_interpersonal_context';
    };
    
    emotionalAndLifeContext: {
      order: 3;
      fields: ['current_emotion', 'life_phase', 'stress_level'];
      reasoning: 'enables_emotionally_intelligent_and_life_stage_appropriate_coaching';
      completion_encouragement: 'demonstrate_value_of_emotional_and_life_context_for_personalization';
    };
    
    communicationOptimization: {
      order: 4;
      fields: ['communication_style', 'previous_attempts'];
      reasoning: 'optimizes_coaching_delivery_and_avoids_previously_failed_approaches';
      completion_encouragement: 'explain_how_communication_preferences_improve_coaching_effectiveness';
    };
  };
  
  // User control and flexibility
  userControl: {
    skipOptions: 'users_can_skip_any_or_all_contextual_situation_fields';
    savePartialProgress: 'users_can_save_partial_context_and_continue_later';
    multipleContexts: 'users_can_create_multiple_contextual_situations_if_desired';
    contextManagement: 'users_can_edit_update_or_delete_contextual_situations_after_creation';
    privacyControl: 'users_can_control_visibility_and_usage_of_contextual_situations';
  };
  
  // Immediate value demonstration
  immediateValueDemonstration: {
    realTimeTooltips: 'tooltips_explain_how_each_field_improves_coaching_quality';
    progressiveEnhancement: 'show_coaching_quality_improvement_as_more_context_provided';
    instantPreview: 'provide_coaching_preview_or_insights_as_context_is_provided';
    valueVisualization: 'visual_indicators_of_coaching_enhancement_from_context_completion';
  };
}
```

This comprehensive requirements framework for Step 10 (Contextuele Situatie) establishes the foundation for collecting rich, actionable context that enables immediate demonstration of AI coaching value while maintaining the highest standards of privacy, user control, and practical applicability.
# Onboarding Step 10: Contextuele Situatie - MBTI Adaptations

## MBTI Adaptations Overview - Personality-Informed Context Collection

### MBTI Adaptation Framework for Contextual Situation Collection

Step 10 MBTI adaptations provide **comprehensive personality-informed context collection strategies** that optimize the context gathering experience for each of the 16 MBTI types. The system adapts communication style, guidance approach, motivation strategies, and coaching value demonstration to align with each type's cognitive preferences, communication patterns, and motivational drivers.

```typescript
// MBTI adaptation framework for contextual situation collection and coaching value demonstration
interface ContextualSituationMBTIAdaptations {
  // Core MBTI adaptation dimensions
  mbtiAdaptationDimensions: {
    cognitiveFunctionAdaptations: CognitiveFunctionBasedContextCollection;
    communicationStyleAdaptations: PersonalityInformedCommunicationAdaptations;
    motivationAndEngagementAdaptations: TypeSpecificMotivationStrategies;
    contextCollectionApproachAdaptations: PersonalizedContextCollectionApproaches;
  };
  
  // Type-specific adaptation implementations
  typeSpecificImplementations: {
    analystTypes: AnalystTypeContextCollectionAdaptations; // NT
    diplomateTypes: DiplomatTypeContextCollectionAdaptations; // NF
    sentinelTypes: SentinelTypeContextCollectionAdaptations; // SJ
    explorerTypes: ExplorerTypeContextCollectionAdaptations; // SP
  };
  
  // Advanced personalization features
  advancedPersonalizationFeatures: {
    dynamicAdaptationEngine: DynamicMBTIAdaptationEngine;
    crossTypeScenarioHandling: CrossTypeInteractionOptimization;
    contextualIntelligenceIntegration: ContextualIntelligenceWithMBTI;
  };
}
```

## Cognitive Function-Based Context Collection Adaptations

### Cognitive Function Adaptation Framework
```typescript
interface CognitiveFunctionBasedContextCollection {
  // Dominant function adaptations
  dominantFunctionAdaptations: {
    extrovertedThinking_Te: {
      contextCollectionApproach: {
        information_gathering_style: 'structured_systematic_efficient_fact_based_context_collection';
        guidance_communication: 'direct_logical_goal_oriented_guidance_with_clear_implementation_steps';
        value_demonstration: 'demonstrate_coaching_effectiveness_through_logical_frameworks_and_measurable_outcomes';
        motivation_strategy: 'emphasize_efficiency_gains_goal_achievement_and_systematic_problem_solving';
      };
      
      situationDescriptionGuidance: {
        prompting_strategy: 'guide_toward_objective_factual_situation_description_with_clear_problem_definition';
        quality_metrics: 'evaluate_situation_clarity_problem_definition_and_logical_structure';
        enhancement_suggestions: 'suggest_additions_for_missing_objective_facts_and_measurable_elements';
        encouragement_approach: 'acknowledge_systematic_thinking_and_logical_problem_framing';
      };
      
      coachingValueDemonstration: {
        demonstration_style: 'present_logical_frameworks_strategic_analysis_and_implementation_roadmaps';
        effectiveness_proof: 'provide_evidence_based_coaching_effectiveness_and_outcome_predictions';
        personalization_showcase: 'demonstrate_logical_consistency_and_systematic_approach_alignment';
        engagement_optimization: 'focus_on_practical_actionability_and_measurable_progress_potential';
      };
    };
    
    extrovertedFeeling_Fe: {
      contextCollectionApproach: {
        information_gathering_style: 'relationship_focused_harmony_oriented_collaborative_context_collection';
        guidance_communication: 'supportive_encouraging_empathetic_guidance_with_relationship_consideration';
        value_demonstration: 'demonstrate_coaching_value_through_relationship_enhancement_and_interpersonal_effectiveness';
        motivation_strategy: 'emphasize_relationship_improvement_harmony_creation_and_positive_impact_on_others';
      };
      
      interpersonalContextOptimization: {
        relationship_focus: 'deep_exploration_of_interpersonal_dynamics_and_relationship_quality_factors';
        harmony_considerations: 'assess_harmony_maintenance_and_conflict_resolution_needs_in_situation';
        collaboration_opportunities: 'identify_collaboration_and_mutual_benefit_opportunities_in_context';
        impact_assessment: 'evaluate_potential_impact_of_situation_resolution_on_all_involved_parties';
      };
      
      emotionalIntelligenceIntegration: {
        empathy_demonstration: 'demonstrate_deep_empathy_and_understanding_of_emotional_context';
        supportive_guidance: 'provide_emotionally_supportive_and_validating_coaching_guidance';
        relationship_coaching: 'focus_coaching_on_relationship_enhancement_and_interpersonal_skill_development';
        harmony_optimization: 'optimize_coaching_recommendations_for_harmony_and_positive_relationships';
      };
    };
    
    extrovertedSensing_Se: {
      contextCollectionApproach: {
        information_gathering_style: 'immediate_present_focused_action_oriented_concrete_context_collection';
        guidance_communication: 'energetic_practical_flexible_guidance_with_immediate_applicability_focus';
        value_demonstration: 'demonstrate_coaching_value_through_immediate_practical_solutions_and_quick_wins';
        motivation_strategy: 'emphasize_immediate_results_practical_solutions_and_adaptable_flexible_approaches';
      };
      
      presentMomentContextOptimization: {
        immediate_focus: 'concentrate_on_immediate_present_situation_factors_and_current_realities';
        practical_considerations: 'emphasize_practical_actionable_elements_of_situation_context';
        flexibility_integration: 'incorporate_flexibility_and_adaptation_needs_into_context_analysis';
        energy_assessment: 'assess_energy_levels_and_motivation_for_immediate_action_taking';
      };
      
      actionOrientedCoachingDemonstration: {
        immediate_actionability: 'demonstrate_immediate_actionable_coaching_recommendations';
        practical_implementation: 'focus_on_practical_implementation_and_real_world_application';
        flexible_adaptation: 'show_coaching_flexibility_and_adaptation_to_changing_circumstances';
        energizing_approach: 'provide_energizing_and_motivating_coaching_experience';
      };
    };
    
    extrovertedIntuition_Ne: {
      contextCollectionApproach: {
        information_gathering_style: 'creative_exploratory_possibility_focused_innovative_context_collection';
        guidance_communication: 'inspiring_creative_open_ended_guidance_with_multiple_possibility_exploration';
        value_demonstration: 'demonstrate_coaching_value_through_creative_solutions_and_innovative_approaches';
        motivation_strategy: 'emphasize_creative_possibilities_innovative_solutions_and_personal_growth_potential';
      };
      
      possibilityExplorationOptimization: {
        creative_context_gathering: 'encourage_creative_exploration_of_situation_possibilities_and_alternatives';
        innovation_opportunities: 'identify_innovation_and_creative_solution_opportunities_in_context';
        growth_potential_assessment: 'assess_personal_growth_and_development_potential_within_situation';
        inspiration_integration: 'integrate_inspirational_and_motivating_elements_into_context_collection';
      };
      
      creativeCoachingDemonstration: {
        innovative_solutions: 'demonstrate_innovative_and_creative_coaching_solutions';
        possibility_exploration: 'explore_multiple_possibilities_and_alternative_approaches';
        inspirational_guidance: 'provide_inspirational_and_vision_focused_coaching_guidance';
        growth_orientation: 'focus_coaching_on_personal_growth_and_creative_development';
      };
    };
  };
  
  // Auxiliary function adaptations
  auxiliaryFunctionAdaptations: {
    introverted_thinking_Ti: {
      contextAnalysisOptimization: {
        logical_consistency_focus: 'ensure_logical_consistency_and_internal_coherence_in_context_analysis';
        understanding_depth: 'provide_deep_understanding_and_logical_framework_for_situation_comprehension';
        analytical_precision: 'emphasize_analytical_precision_and_accurate_problem_diagnosis';
        independent_reasoning: 'support_independent_reasoning_and_personal_logical_framework_development';
      };
    };
    
    introverted_feeling_Fi: {
      personalValueAlignment: {
        values_integration: 'integrate_personal_values_and_authenticity_considerations_into_context_collection';
        authentic_expression: 'encourage_authentic_self_expression_and_personal_truth_in_situation_description';
        individual_significance: 'assess_individual_significance_and_personal_meaning_of_situation';
        inner_harmony_consideration: 'consider_inner_harmony_and_personal_integrity_in_coaching_recommendations';
      };
    };
    
    introverted_sensing_Si: {
      experientialContextIntegration: {
        past_experience_integration: 'integrate_past_experiences_and_learned_patterns_into_context_analysis';
        stability_considerations: 'consider_stability_and_security_needs_in_situation_assessment';
        detailed_contextual_memory: 'leverage_detailed_contextual_memory_for_comprehensive_situation_understanding';
        proven_approach_emphasis: 'emphasize_proven_approaches_and_reliable_strategies_in_coaching';
      };
    };
    
    introverted_intuition_Ni: {
      insightfulPatternRecognition: {
        pattern_synthesis: 'synthesize_patterns_and_underlying_dynamics_in_situation_context';
        future_implications: 'analyze_future_implications_and_long_term_consequences_of_situation';
        holistic_understanding: 'develop_holistic_understanding_and_integrated_perspective_on_context';
        visionary_guidance: 'provide_visionary_and_forward_looking_coaching_guidance';
      };
    };
  };
}
```

## Type-Specific Context Collection Adaptations

### Analyst Types (NT) - Strategic Context Collection
```typescript
interface AnalystTypeContextCollectionAdaptations {
  // NT group characteristics and adaptations
  ntGroupCharacteristics: {
    cognitive_orientation: 'strategic_analytical_theoretical_future_focused_problem_solving';
    communication_preferences: 'logical_efficient_competence_focused_direct_communication';
    motivation_drivers: 'mastery_competence_innovation_intellectual_challenge_strategic_impact';
    coaching_value_priorities: 'strategic_frameworks_logical_analysis_competence_development_innovative_solutions';
  };
  
  // Individual NT type adaptations
  architect_INTJ: {
    contextCollectionStrategy: {
      strategic_vision_integration: {
        approach: 'integrate_long_term_strategic_vision_into_situation_context_collection';
        guidance: 'guide_toward_comprehensive_strategic_context_with_future_implications_analysis';
        value_demonstration: 'demonstrate_coaching_value_through_strategic_frameworks_and_long_term_planning';
        motivation: 'emphasize_strategic_mastery_and_comprehensive_situation_understanding';
      };
      
      systematic_complexity_analysis: {
        information_processing: 'encourage_systematic_analysis_of_situation_complexity_and_interconnections';
        pattern_recognition: 'support_pattern_recognition_and_underlying_dynamic_identification';
        holistic_synthesis: 'facilitate_holistic_synthesis_of_context_elements_into_coherent_framework';
        independent_insight: 'encourage_independent_insight_development_and_personal_strategic_thinking';
      };
    };
    
    personalizedCoachingDemonstration: {
      strategic_framework_presentation: 'present_comprehensive_strategic_frameworks_for_situation_management';
      long_term_planning_integration: 'integrate_long_term_planning_and_strategic_development_into_coaching';
      mastery_oriented_guidance: 'provide_mastery_oriented_guidance_for_competence_development';
      visionary_leadership_support: 'support_visionary_leadership_development_and_strategic_influence';
    };
  };
  
  logician_INTP: {
    contextCollectionStrategy: {
      theoretical_framework_exploration: {
        approach: 'explore_theoretical_frameworks_and_conceptual_models_for_situation_understanding';
        guidance: 'provide_conceptual_guidance_for_deep_theoretical_situation_analysis';
        value_demonstration: 'demonstrate_coaching_value_through_conceptual_clarity_and_theoretical_insight';
        motivation: 'emphasize_intellectual_curiosity_and_theoretical_understanding_development';
      };
      
      logical_precision_optimization: {
        analytical_depth: 'encourage_analytical_depth_and_logical_precision_in_context_description';
        conceptual_clarity: 'support_conceptual_clarity_and_theoretical_framework_development';
        independent_exploration: 'facilitate_independent_exploration_of_situation_complexities';
        innovative_thinking: 'encourage_innovative_thinking_and_creative_problem_solving_approaches';
      };
    };
    
    personalizedCoachingDemonstration: {
      conceptual_framework_development: 'develop_conceptual_frameworks_for_situation_understanding_and_management';
      logical_analysis_presentation: 'present_logical_analysis_and_rational_problem_solving_approaches';
      theoretical_insight_integration: 'integrate_theoretical_insights_into_practical_coaching_recommendations';
      intellectual_growth_support: 'support_intellectual_growth_and_conceptual_mastery_development';
    };
  };
  
  commander_ENTJ: {
    contextCollectionStrategy: {
      leadership_context_optimization: {
        approach: 'optimize_context_collection_for_leadership_and_organizational_effectiveness';
        guidance: 'provide_leadership_focused_guidance_for_strategic_situation_management';
        value_demonstration: 'demonstrate_coaching_value_through_leadership_effectiveness_and_strategic_impact';
        motivation: 'emphasize_leadership_mastery_and_organizational_strategic_success';
      };
      
      goal_oriented_strategic_planning: {
        objective_clarification: 'facilitate_clear_objective_definition_and_strategic_goal_articulation';
        resource_optimization: 'analyze_resource_optimization_and_strategic_resource_allocation';
        implementation_planning: 'develop_comprehensive_implementation_planning_and_execution_strategies';
        results_orientation: 'maintain_results_orientation_and_measurable_outcome_focus';
      };
    };
    
    personalizedCoachingDemonstration: {
      leadership_development_framework: 'present_leadership_development_frameworks_and_strategic_guidance';
      organizational_effectiveness_coaching: 'provide_organizational_effectiveness_and_team_leadership_coaching';
      strategic_implementation_planning: 'develop_strategic_implementation_planning_and_execution_guidance';
      executive_presence_enhancement: 'enhance_executive_presence_and_leadership_influence_capabilities';
    };
  };
  
  debater_ENTP: {
    contextCollectionStrategy: {
      innovative_possibility_exploration: {
        approach: 'explore_innovative_possibilities_and_creative_alternative_approaches_to_situation';
        guidance: 'provide_creative_guidance_for_innovative_solution_development';
        value_demonstration: 'demonstrate_coaching_value_through_creative_innovation_and_adaptive_strategies';
        motivation: 'emphasize_creative_challenge_and_innovative_solution_development';
      };
      
      debate_and_dialogue_optimization: {
        perspective_exploration: 'encourage_multiple_perspective_exploration_and_viewpoint_analysis';
        intellectual_dialogue: 'facilitate_intellectual_dialogue_and_idea_development_process';
        challenge_integration: 'integrate_intellectual_challenge_and_debate_into_context_analysis';
        adaptive_thinking: 'support_adaptive_thinking_and_flexible_approach_development';
      };
    };
    
    personalizedCoachingDemonstration: {
      innovative_solution_development: 'develop_innovative_solutions_and_creative_problem_solving_approaches';
      intellectual_stimulation_provision: 'provide_intellectual_stimulation_and_challenging_perspectives';
      adaptive_strategy_coaching: 'coach_adaptive_strategies_and_flexible_approach_implementation';
      creative_leadership_support: 'support_creative_leadership_and_innovative_influence_development';
    };
  };
}
```

### Diplomat Types (NF) - Values-Based Context Collection
```typescript
interface DiplomatTypeContextCollectionAdaptations {
  // NF group characteristics and adaptations
  nfGroupCharacteristics: {
    cognitive_orientation: 'values_based_people_focused_meaning_oriented_growth_centered_approach';
    communication_preferences: 'empathetic_supportive_authentic_inspirational_collaborative_communication';
    motivation_drivers: 'personal_growth_authentic_relationships_meaningful_impact_value_alignment';
    coaching_value_priorities: 'personal_development_relationship_enhancement_value_alignment_authentic_expression';
  };
  
  // Individual NF type adaptations
  advocate_INFJ: {
    contextCollectionStrategy: {
      meaningful_depth_exploration: {
        approach: 'explore_meaningful_depth_and_personal_significance_of_situation_context';
        guidance: 'provide_compassionate_guidance_for_deep_personal_understanding_development';
        value_demonstration: 'demonstrate_coaching_value_through_meaningful_insight_and_personal_growth';
        motivation: 'emphasize_personal_meaning_and_authentic_self_expression_development';
      };
      
      empathetic_understanding_integration: {
        emotional_depth: 'facilitate_emotional_depth_and_empathetic_understanding_in_context_collection';
        interpersonal_insight: 'develop_interpersonal_insight_and_relationship_dynamic_understanding';
        values_alignment: 'ensure_values_alignment_and_authentic_expression_in_situation_analysis';
        holistic_perspective: 'maintain_holistic_perspective_and_integrated_understanding_approach';
      };
    };
    
    personalizedCoachingDemonstration: {
      values_based_guidance: 'provide_values_based_guidance_and_authentic_self_expression_support';
      empathetic_coaching_approach: 'demonstrate_empathetic_coaching_approach_and_deep_understanding';
      personal_growth_facilitation: 'facilitate_personal_growth_and_meaningful_development_opportunities';
      relationship_harmony_optimization: 'optimize_relationship_harmony_and_interpersonal_effectiveness';
    };
  };
  
  mediator_INFP: {
    contextCollectionStrategy: {
      authentic_expression_support: {
        approach: 'support_authentic_self_expression_and_personal_truth_in_context_sharing';
        guidance: 'provide_gentle_guidance_for_authentic_personal_exploration';
        value_demonstration: 'demonstrate_coaching_value_through_authentic_self_discovery_and_personal_alignment';
        motivation: 'emphasize_authentic_self_expression_and_personal_values_alignment';
      };
      
      individual_significance_exploration: {
        personal_meaning: 'explore_personal_meaning_and_individual_significance_of_situation';
        values_integration: 'integrate_personal_values_and_beliefs_into_context_analysis';
        creative_expression: 'encourage_creative_expression_and_unique_perspective_sharing';
        inner_harmony: 'support_inner_harmony_and_personal_integrity_maintenance';
      };
    };
    
    personalizedCoachingDemonstration: {
      authentic_self_development: 'support_authentic_self_development_and_personal_truth_discovery';
      values_alignment_coaching: 'provide_values_alignment_coaching_and_integrity_support';
      creative_potential_exploration: 'explore_creative_potential_and_unique_contribution_opportunities';
      gentle_supportive_guidance: 'offer_gentle_supportive_guidance_for_personal_growth_journey';
    };
  };
  
  protagonist_ENFJ: {
    contextCollectionStrategy: {
      people_focused_situation_analysis: {
        approach: 'analyze_situation_through_people_focused_and_relationship_oriented_lens';
        guidance: 'provide_people_centered_guidance_for_interpersonal_effectiveness';
        value_demonstration: 'demonstrate_coaching_value_through_relationship_enhancement_and_positive_impact';
        motivation: 'emphasize_positive_impact_on_others_and_relationship_development';
      };
      
      growth_oriented_context_collection: {
        development_potential: 'identify_development_potential_and_growth_opportunities_in_situation';
        collaborative_solutions: 'encourage_collaborative_solutions_and_mutual_benefit_approaches';
        inspirational_perspective: 'maintain_inspirational_perspective_and_possibility_focus';
        harmony_optimization: 'optimize_for_harmony_and_positive_relationship_outcomes';
      };
    };
    
    personalizedCoachingDemonstration: {
      leadership_development_coaching: 'provide_leadership_development_coaching_with_people_focus';
      relationship_effectiveness_enhancement: 'enhance_relationship_effectiveness_and_interpersonal_skills';
      inspirational_guidance_delivery: 'deliver_inspirational_guidance_and_motivational_support';
      collaborative_success_planning: 'plan_collaborative_success_and_mutual_benefit_strategies';
    };
  };
  
  campaigner_ENFP: {
    contextCollectionStrategy: {
      enthusiastic_possibility_exploration: {
        approach: 'explore_possibilities_with_enthusiasm_and_creative_energy';
        guidance: 'provide_enthusiastic_guidance_for_creative_possibility_development';
        value_demonstration: 'demonstrate_coaching_value_through_inspiring_possibilities_and_creative_growth';
        motivation: 'emphasize_creative_potential_and_inspiring_possibility_realization';
      };
      
      people_centered_innovation: {
        relationship_innovation: 'encourage_relationship_innovation_and_interpersonal_creativity';
        collaborative_creativity: 'support_collaborative_creativity_and_shared_inspiration';
        authentic_connection: 'facilitate_authentic_connection_and_meaningful_relationship_building';
        energizing_interaction: 'maintain_energizing_interaction_and_positive_engagement';
      };
    };
    
    personalizedCoachingDemonstration: {
      inspirational_coaching_experience: 'provide_inspirational_coaching_experience_with_creative_energy';
      possibility_focused_guidance: 'offer_possibility_focused_guidance_and_creative_development_support';
      relationship_building_coaching: 'coach_relationship_building_and_authentic_connection_skills';
      energizing_personal_growth: 'facilitate_energizing_personal_growth_and_creative_self_expression';
    };
  };
}
```

### Sentinel Types (SJ) - Structured Context Collection
```typescript
interface SentinelTypeContextCollectionAdaptations {
  // SJ group characteristics and adaptations
  sjGroupCharacteristics: {
    cognitive_orientation: 'structured_systematic_detail_oriented_responsibility_focused_approach';
    communication_preferences: 'clear_direct_structured_reliable_practical_communication';
    motivation_drivers: 'security_stability_competence_responsibility_systematic_achievement';
    coaching_value_priorities: 'practical_effectiveness_systematic_improvement_reliable_outcomes_structured_development';
  };
  
  // Individual SJ type adaptations
  logistician_ISTJ: {
    contextCollectionStrategy: {
      systematic_detailed_analysis: {
        approach: 'conduct_systematic_detailed_analysis_of_situation_context_and_factors';
        guidance: 'provide_structured_guidance_for_comprehensive_situation_assessment';
        value_demonstration: 'demonstrate_coaching_value_through_systematic_analysis_and_reliable_solutions';
        motivation: 'emphasize_thorough_understanding_and_systematic_problem_resolution';
      };
      
      experience_based_context_integration: {
        past_experience_leverage: 'leverage_past_experience_and_proven_approaches_in_context_analysis';
        detailed_information_processing: 'process_detailed_information_systematically_for_comprehensive_understanding';
        stability_consideration: 'consider_stability_and_security_factors_in_situation_assessment';
        methodical_approach: 'maintain_methodical_approach_to_context_collection_and_analysis';
      };
    };
    
    personalizedCoachingDemonstration: {
      systematic_solution_development: 'develop_systematic_solutions_with_step_by_step_implementation_guidance';
      proven_strategy_application: 'apply_proven_strategies_and_reliable_approaches_to_situation_management';
      detailed_planning_support: 'provide_detailed_planning_support_and_structured_implementation_frameworks';
      stability_focused_guidance: 'offer_stability_focused_guidance_for_secure_and_reliable_outcomes';
    };
  };
  
  defender_ISFJ: {
    contextCollectionStrategy: {
      supportive_caring_context_collection: {
        approach: 'collect_context_with_supportive_caring_approach_and_interpersonal_sensitivity';
        guidance: 'provide_gentle_supportive_guidance_for_comfortable_context_sharing';
        value_demonstration: 'demonstrate_coaching_value_through_supportive_care_and_practical_helpfulness';
        motivation: 'emphasize_helpfulness_and_positive_impact_on_relationships_and_well_being';
      };
      
      harmony_preservation_focus: {
        relationship_consideration: 'consider_relationship_preservation_and_harmony_maintenance_in_context';
        supportive_environment: 'create_supportive_environment_for_comfortable_context_sharing';
        practical_helpfulness: 'focus_on_practical_helpfulness_and_tangible_support_provision';
        caring_approach: 'maintain_caring_approach_throughout_context_collection_process';
      };
    };
    
    personalizedCoachingDemonstration: {
      supportive_practical_guidance: 'provide_supportive_practical_guidance_for_situation_improvement';
      relationship_harmony_coaching: 'coach_relationship_harmony_and_interpersonal_effectiveness';
      caring_development_support: 'offer_caring_development_support_and_gentle_growth_encouragement';
      stability_enhancement_planning: 'plan_stability_enhancement_and_security_building_strategies';
    };
  };
  
  executive_ESTJ: {
    contextCollectionStrategy: {
      efficient_goal_oriented_collection: {
        approach: 'conduct_efficient_goal_oriented_context_collection_with_clear_objectives';
        guidance: 'provide_direct_practical_guidance_for_effective_situation_management';
        value_demonstration: 'demonstrate_coaching_value_through_efficient_solutions_and_measurable_results';
        motivation: 'emphasize_efficiency_achievement_and_practical_effectiveness';
      };
      
      systematic_implementation_focus: {
        organized_approach: 'maintain_organized_systematic_approach_to_context_analysis';
        practical_solutions: 'focus_on_practical_solutions_and_actionable_implementation_steps';
        measurable_outcomes: 'establish_measurable_outcomes_and_clear_success_criteria';
        leadership_effectiveness: 'consider_leadership_effectiveness_and_organizational_impact';
      };
    };
    
    personalizedCoachingDemonstration: {
      leadership_effectiveness_coaching: 'coach_leadership_effectiveness_and_organizational_management_skills';
      systematic_implementation_planning: 'plan_systematic_implementation_with_clear_milestones_and_accountability';
      efficiency_optimization_guidance: 'provide_efficiency_optimization_guidance_for_maximum_effectiveness';
      results_oriented_strategy_development: 'develop_results_oriented_strategies_with_measurable_success_metrics';
    };
  };
  
  consul_ESFJ: {
    contextCollectionStrategy: {
      people_focused_harmony_oriented_collection: {
        approach: 'collect_context_with_people_focused_harmony_oriented_collaborative_approach';
        guidance: 'provide_supportive_collaborative_guidance_for_relationship_centered_solutions';
        value_demonstration: 'demonstrate_coaching_value_through_relationship_enhancement_and_harmony_creation';
        motivation: 'emphasize_relationship_improvement_and_positive_social_impact';
      };
      
      collaborative_supportive_environment: {
        relationship_focus: 'maintain_relationship_focus_and_interpersonal_harmony_consideration';
        collaborative_approach: 'encourage_collaborative_approach_and_shared_responsibility';
        supportive_guidance: 'provide_supportive_guidance_and_encouraging_feedback';
        harmony_optimization: 'optimize_for_harmony_and_positive_relationship_outcomes';
      };
    };
    
    personalizedCoachingDemonstration: {
      relationship_building_coaching: 'coach_relationship_building_and_interpersonal_effectiveness_skills';
      collaborative_leadership_development: 'develop_collaborative_leadership_and_team_harmony_capabilities';
      supportive_communication_enhancement: 'enhance_supportive_communication_and_empathetic_interaction_skills';
      harmony_creation_strategies: 'develop_harmony_creation_strategies_and_conflict_resolution_approaches';
    };
  };
}
```

### Explorer Types (SP) - Adaptive Context Collection
```typescript
interface ExplorerTypeContextCollectionAdaptations {
  // SP group characteristics and adaptations
  spGroupCharacteristics: {
    cognitive_orientation: 'adaptive_flexible_practical_present_focused_action_oriented_approach';
    communication_preferences: 'direct_practical_flexible_energetic_immediate_communication';
    motivation_drivers: 'freedom_flexibility_immediate_results_practical_effectiveness_energizing_experiences';
    coaching_value_priorities: 'immediate_practical_solutions_flexible_approaches_energizing_guidance_adaptive_strategies';
  };
  
  // Individual SP type adaptations
  virtuoso_ISTP: {
    contextCollectionStrategy: {
      practical_hands_on_analysis: {
        approach: 'conduct_practical_hands_on_analysis_of_immediate_situation_factors';
        guidance: 'provide_direct_practical_guidance_for_immediate_action_taking';
        value_demonstration: 'demonstrate_coaching_value_through_practical_solutions_and_immediate_applicability';
        motivation: 'emphasize_practical_mastery_and_immediate_problem_solving_effectiveness';
      };
      
      independent_flexible_approach: {
        autonomy_respect: 'respect_autonomy_and_independent_problem_solving_preferences';
        flexible_adaptation: 'maintain_flexible_adaptation_to_changing_situation_circumstances';
        practical_focus: 'focus_on_practical_actionable_elements_of_situation_context';
        minimal_structure: 'provide_minimal_structure_while_maintaining_effectiveness';
      };
    };
    
    personalizedCoachingDemonstration: {
      practical_skill_development: 'develop_practical_skills_and_hands_on_problem_solving_capabilities';
      flexible_strategy_coaching: 'coach_flexible_strategies_and_adaptive_problem_solving_approaches';
      independent_mastery_support: 'support_independent_mastery_and_autonomous_skill_development';
      immediate_application_guidance: 'provide_guidance_for_immediate_practical_application_and_results';
    };
  };
  
  adventurer_ISFP: {
    contextCollectionStrategy: {
      values_aligned_gentle_collection: {
        approach: 'collect_context_through_values_aligned_gentle_supportive_approach';
        guidance: 'provide_gentle_guidance_that_respects_personal_values_and_individual_pace';
        value_demonstration: 'demonstrate_coaching_value_through_authentic_self_expression_and_personal_alignment';
        motivation: 'emphasize_authentic_self_expression_and_personal_values_alignment';
      };
      
      individual_creativity_support: {
        creative_expression: 'encourage_creative_expression_and_unique_perspective_sharing';
        personal_pace: 'respect_personal_pace_and_individual_processing_style';
        authentic_approach: 'maintain_authentic_approach_and_genuine_interpersonal_connection';
        flexible_support: 'provide_flexible_support_adapted_to_individual_needs_and_preferences';
      };
    };
    
    personalizedCoachingDemonstration: {
      authentic_self_expression_coaching: 'coach_authentic_self_expression_and_personal_truth_discovery';
      creative_development_support: 'support_creative_development_and_artistic_expression_opportunities';
      values_alignment_guidance: 'provide_values_alignment_guidance_and_personal_integrity_support';
      gentle_growth_facilitation: 'facilitate_gentle_growth_and_supportive_personal_development';
    };
  };
  
  entrepreneur_ESTP: {
    contextCollectionStrategy: {
      energetic_action_oriented_collection: {
        approach: 'conduct_energetic_action_oriented_context_collection_with_immediate_focus';
        guidance: 'provide_energetic_direct_guidance_for_immediate_action_and_results';
        value_demonstration: 'demonstrate_coaching_value_through_immediate_practical_solutions_and_quick_wins';
        motivation: 'emphasize_immediate_results_energizing_experiences_and_practical_effectiveness';
      };
      
      present_moment_optimization: {
        immediate_focus: 'focus_on_immediate_present_moment_factors_and_current_opportunities';
        practical_solutions: 'develop_practical_solutions_for_immediate_implementation';
        energizing_interaction: 'maintain_energizing_interaction_and_dynamic_engagement';
        flexibility_integration: 'integrate_flexibility_and_adaptive_responsiveness';
      };
    };
    
    personalizedCoachingDemonstration: {
      immediate_action_coaching: 'coach_immediate_action_taking_and_practical_implementation_skills';
      energizing_leadership_development: 'develop_energizing_leadership_and_dynamic_influence_capabilities';
      practical_problem_solving_enhancement: 'enhance_practical_problem_solving_and_quick_decision_making_skills';
      flexible_adaptation_strategies: 'develop_flexible_adaptation_strategies_for_changing_circumstances';
    };
  };
  
  entertainer_ESFP: {
    contextCollectionStrategy: {
      enthusiastic_people_focused_collection: {
        approach: 'collect_context_with_enthusiastic_people_focused_collaborative_energy';
        guidance: 'provide_enthusiastic_supportive_guidance_with_interpersonal_warmth';
        value_demonstration: 'demonstrate_coaching_value_through_relationship_enhancement_and_positive_energy';
        motivation: 'emphasize_positive_relationships_energizing_experiences_and_collaborative_success';
      };
      
      energizing_collaborative_approach: {
        interpersonal_focus: 'maintain_interpersonal_focus_and_relationship_centered_approach';
        energizing_interaction: 'provide_energizing_interaction_and_positive_emotional_engagement';
        collaborative_solutions: 'develop_collaborative_solutions_and_shared_success_strategies';
        immediate_positive_impact: 'focus_on_immediate_positive_impact_and_relationship_enhancement';
      };
    };
    
    personalizedCoachingDemonstration: {
      relationship_energizing_coaching: 'coach_relationship_energizing_and_positive_interpersonal_impact';
      collaborative_enthusiasm_development: 'develop_collaborative_enthusiasm_and_team_energizing_capabilities';
      positive_communication_enhancement: 'enhance_positive_communication_and_inspiring_interaction_skills';
      immediate_relationship_improvement: 'facilitate_immediate_relationship_improvement_and_connection_building';
    };
  };
}
```

## Advanced Personalization and Dynamic Adaptation

### Dynamic MBTI Adaptation Engine
```typescript
interface DynamicMBTIAdaptationEngine {
  // Real-time adaptation capabilities
  realTimeAdaptationCapabilities: {
    contextualAdaptationMonitoring: {
      engagement_level_tracking: 'track_user_engagement_level_and_adaptation_effectiveness_in_real_time';
      communication_style_adjustment: 'adjust_communication_style_based_on_user_response_and_engagement';
      motivation_strategy_optimization: 'optimize_motivation_strategy_based_on_user_feedback_and_progress';
      personalization_depth_enhancement: 'enhance_personalization_depth_based_on_context_quality_and_richness';
    };
    
    cross_type_scenario_handling: {
      multi_type_situation_adaptation: 'adapt_guidance_for_situations_involving_multiple_personality_types';
      relationship_dynamics_optimization: 'optimize_coaching_for_complex_interpersonal_dynamics_across_types';
      communication_bridge_building: 'build_communication_bridges_between_different_personality_preferences';
      collaborative_effectiveness_enhancement: 'enhance_collaborative_effectiveness_across_personality_differences';
    };
  };
  
  // Contextual intelligence integration
  contextualIntelligenceIntegration: {
    situational_mbti_adaptation: {
      context_sensitive_personalization: 'provide_context_sensitive_personalization_based_on_situation_complexity';
      stress_level_mbti_adjustment: 'adjust_mbti_approach_based_on_user_stress_level_and_emotional_state';
      life_phase_type_consideration: 'consider_life_phase_and_developmental_stage_in_type_based_adaptation';
      cultural_context_integration: 'integrate_cultural_context_considerations_with_mbti_personalization';
    };
    
    advanced_coaching_personalization: {
      multi_dimensional_adaptation: 'provide_multi_dimensional_adaptation_considering_type_context_and_goals';
      dynamic_coaching_style_evolution: 'evolve_coaching_style_dynamically_based_on_user_development_and_feedback';
      personalized_growth_pathway_creation: 'create_personalized_growth_pathways_integrating_type_and_context';
      adaptive_value_demonstration: 'adapt_value_demonstration_approach_based_on_type_specific_motivation_drivers';
    };
  };
}
```

This comprehensive MBTI adaptations framework ensures that Step 10 contextual situation collection is optimally personalized for each of the 16 personality types, providing type-specific guidance, motivation strategies, and coaching value demonstrations that resonate with each user's cognitive preferences and communication style.
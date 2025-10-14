# Onboarding Step 11: Holistisch Welzijn-assessment - Requirements

## Business Requirements Overview - Comprehensive Wellness Baseline

### Primary Objective

Step 11 establishes a **baseline holistisch welzijn score** through a scientifically-informed 10-question assessment that captures key dimensions of holistic wellbeing. This baseline assessment serves as the foundation for more detailed wellness exploration within the main application's subpages, enabling progressive refinement and deeper analysis of wellness patterns over time.

**Baseline-to-Refinement Strategy:**
- **Onboarding (Step 11)**: Quick 10-question baseline establishment (~3-4 minutes)
- **Main App Subpages**: Detailed wellness modules building on baseline scores
- **Continuous Refinement**: Regular assessment updates and deeper insights
- **Progress Tracking**: Longitudinal wellness development measurement

### Core Business Requirements

#### BR11.1: Baseline Holistisch Welzijn Assessment Framework
```yaml
requirement_id: BR11.1
title: "Baseline Holistisch Welzijn Assessment Framework"
priority: CRITICAL
status: REQUIRED

description: |
  Implement a baseline wellness assessment that establishes foundational wellness scores
  across five key dimensions, designed for rapid completion during onboarding while 
  providing sufficient depth for meaningful coaching insights and future refinement.
  
  BASELINE WELLNESS DIMENSIONS:
  - Energie & Vitaliteit (Energy & Vitality) - Foundation for physical wellness
  - Stress & Coping (Stress Management) - Foundation for emotional resilience  
  - Sociale Steun (Social Support) - Foundation for relationship wellness
  - Zelfcompassie (Self-Compassion) - Foundation for psychological wellness
  - Zingeving & Doelgerichtheid (Meaning & Purpose) - Foundation for existential wellness

baseline_assessment_principles:
  rapid_completion: "3-4 minutes maximum completion time for onboarding efficiency"
  foundational_depth: "Sufficient depth for meaningful baseline establishment"
  refinement_ready: "Designed for expansion in main application subpages"
  coaching_actionable: "Immediate coaching insights while supporting deeper exploration"
  
future_refinement_capabilities:
  main_app_expansion: "Each dimension expandable to detailed assessment modules"
  progressive_deepening: "Baseline scores refined through ongoing interaction"
  contextual_assessment: "Situation-specific wellness evaluation in subpages"
  longitudinal_tracking: "Baseline serves as reference point for progress measurement"

acceptance_criteria:
  - Baseline assessment contains exactly 10 strategically-selected questions
  - Five composite wellness scores provide comprehensive baseline coverage
  - Assessment completion supports immediate coaching value demonstration
  - Baseline scores integrate seamlessly with main app refinement modules
  - Foundation established for ongoing wellness development tracking

business_value: |
  Establishes comprehensive wellness baseline for immediate coaching value while creating
  foundation for sophisticated wellness development tracking and refinement in main application

dependencies:
  - User authentication and session management
  - Database schema supporting baseline-to-refinement progression
  - Integration architecture for main app wellness module expansion

success_metrics:
  - Baseline establishment rate: >85% of onboarding completions
  - Coaching value demonstration effectiveness from baseline insights
  - User readiness for main app wellness exploration: >75%
  - Baseline-to-refinement progression engagement: >60% within 30 days
```

#### BR11.2: Five-Dimensional Baseline Scoring System
```yaml
requirement_id: BR11.2
title: "Five-Dimensional Baseline Scoring System"
priority: CRITICAL
status: REQUIRED

description: |
  Calculate five foundational wellness baseline scores from the 10-question assessment,
  designed to provide comprehensive wellness overview while supporting future refinement
  in main application wellness modules.
  
  BASELINE SCORE DIMENSIONS:
  
  1. ENERGIE_VITALITEIT_BASELINE (Energy & Vitality Baseline)
     - Q1: Hoe regelmatig slaap je voldoende? (Sleep adequacy)
     - Q2: Hoe vaak heb je last van vermoeidheid overdag? (Daytime fatigue - REVERSED)
     - Q3: Hoe vaak beweeg je matig/intensief per week? (Physical activity)
     → Baseline for: Sleep patterns, energy management, physical activity modules
     
  2. STRESS_COPING_BASELINE (Stress Management Baseline)
     - Q4: Hoe goed kun je je emoties reguleren in stress? (Emotional regulation)
     - Q7: Hoe vaak ervaar je lichamelijke klachten die functioneren beïnvloeden? (Physical stress - REVERSED)
     - Q10: Hoe hoog is je ervaren stressniveau? (Perceived stress - REVERSED, slider 0-10)
     → Baseline for: Stress management, emotional regulation, resilience modules
     
  3. SOCIALE_STEUN_BASELINE (Social Support Baseline)
     - Q6: Hoeveel sociale steun ervaar je? (Perceived social support)
     → Baseline for: Relationship wellness, social connection, support network modules
     
  4. ZELFCOMPASSIE_BASELINE (Self-Compassion Baseline)
     - Q9: Hoe vaak ben je vriendelijk voor jezelf bij tegenslag? (Self-kindness)
     → Baseline for: Self-care, psychological wellness, mindfulness modules
     
  5. ZINGEVING_DOELGERICHTHEID_BASELINE (Meaning & Purpose Baseline)
     - Q5: Hoe vaak ervaar je zingeving in dagelijkse activiteiten? (Daily meaning)
     - Q8: Hoe vaak handel je doelgericht? (Goal-directed behavior)
     → Baseline for: Life purpose, goal setting, values alignment modules

baseline_to_refinement_architecture:
  baseline_establishment:
    - Rapid 10-question assessment for comprehensive baseline
    - 0-100 scale scores for each dimension
    - Immediate baseline interpretation and coaching insights
    
  main_app_refinement_preparation:
    - Baseline scores stored for comparison and progress tracking
    - Integration points prepared for detailed module assessments
    - Refinement pathway mapping for each wellness dimension
    
  progressive_enhancement:
    - Baseline serves as starting point for detailed exploration
    - Main app modules build depth on established baseline foundation
    - Continuous refinement updates and validates baseline accuracy

acceptance_criteria:
  - Five baseline scores calculated using validated algorithms
  - Baseline scores presented as 0-100 percentile values with clear interpretation
  - Reversed items properly handled in baseline scoring calculations
  - Baseline scores designed for seamless integration with main app modules
  - Immediate baseline insights provided while supporting future deepening

business_value: |
  Establishes comprehensive wellness baseline enabling immediate coaching value while
  creating foundation for sophisticated wellness development in main application modules

technical_requirements:
  - Robust baseline scoring algorithms with error handling
  - Baseline score storage optimized for main app module integration
  - API endpoints prepared for baseline-to-refinement progression
  - Real-time baseline calculation and insight generation capabilities
```

#### BR11.3: Baseline Insights and Future Refinement Pathway
```yaml
requirement_id: BR11.3
title: "Baseline Insights and Future Refinement Pathway"
priority: HIGH
status: REQUIRED

description: |
  Generate immediate baseline insights while establishing clear pathways for wellness
  refinement and development within the main application's specialized wellness modules.

baseline_insight_generation:
  immediate_baseline_interpretation:
    - Five-dimensional wellness baseline overview (0-100 scale visualization)
    - Strength identification (baseline scores >70) with celebration messaging
    - Development opportunity identification (baseline scores <50) with encouragement
    - Balanced wellness recognition (all scores 50-80) with optimization potential
    
  baseline_coaching_preview:
    - Preview of coaching approach based on baseline patterns
    - Introduction to main app wellness modules relevant to baseline results
    - Demonstration of how baseline will evolve through main app interaction
    - Connection between baseline insights and ongoing coaching relationship
    
future_refinement_pathway_establishment:
  main_app_module_roadmap:
    - Clear connection between baseline scores and relevant main app modules
    - Preview of deeper assessment capabilities in specialized subpages
    - Explanation of how baseline will be refined through ongoing usage
    - Progressive wellness development planning introduction
    
  refinement_motivation_building:
    - Explanation of baseline-to-refinement progression benefits
    - Preview of detailed wellness tracking and development capabilities
    - Demonstration of personalized wellness journey potential
    - Establishment of ongoing wellness development excitement

acceptance_criteria:
  - Baseline insights generated within 2 seconds of assessment completion
  - Clear explanation of baseline meaning and refinement potential
  - Effective connection established between baseline and main app capabilities
  - User motivation for continued wellness exploration generated
  - Future refinement pathway clearly communicated and appealing

business_value: |
  Demonstrates immediate baseline value while building excitement for main app wellness
  capabilities, increasing user engagement and subscription conversion likelihood

user_experience_requirements:
  - Clear, encouraging baseline interpretation presentation
  - Intuitive connection between baseline and future refinement opportunities
  - Motivating visualization of wellness development potential
  - Seamless transition pathway from baseline to main app exploration
```

#### BR11.4: Privacy-First Wellness Data Management
```yaml
requirement_id: BR11.4
title: "Privacy-First Wellness Data Management"
priority: CRITICAL
status: REQUIRED

description: |
  Implement comprehensive privacy protection for sensitive wellness assessment data
  while enabling personalized coaching and progress tracking capabilities.

privacy_protection_requirements:
  data_encryption:
    - AES-256 encryption for raw assessment responses
    - Client-side encryption before data transmission
    - Encrypted storage in WatermelonDB and Supabase
    - Secure key management and rotation
    
  user_consent_management:
    - Explicit consent for wellness data collection
    - Clear explanation of data usage for coaching
    - Granular permissions for data sharing and usage
    - Easy consent withdrawal and data deletion
    
  data_minimization:
    - Collection limited to essential wellness indicators
    - Automated data retention policy enforcement
    - Regular data usage audit and optimization
    - Purpose-limited data processing and storage

acceptance_criteria:
  - All wellness responses encrypted before storage
  - User consent explicitly obtained and documented
  - Data usage transparently communicated
  - Compliance with privacy regulations ensured
  - User control over data sharing and deletion maintained

business_value: |
  Builds user trust, ensures regulatory compliance, enables ethical data usage,
  supports long-term coaching relationship development

technical_requirements:
  - Robust encryption implementation and testing
  - Consent management system integration
  - Privacy audit trail maintenance
  - Secure data backup and recovery procedures
```

### Assessment Questions and Scoring Methodology

#### 10-Question Wellness Assessment Structure
```yaml
assessment_structure:
  title: "Korte welzijnsscan (10 vragen)"
  intro: "Deze vragen helpen je energie, slaap, coping en zingeving in kaart te brengen. Duurt ~3–4 minuten."
  completion_time: "3-4 minutes"
  
  questions:
    q1:
      text: "Hoe regelmatig slaap je voldoende?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "energie_vitaliteit"
      scoring: "direct"
      
    q2:
      text: "Hoe vaak heb je last van vermoeidheid overdag?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "energie_vitaliteit"
      scoring: "reversed"
      
    q3:
      text: "Hoe vaak beweeg je matig/intensief per week?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "energie_vitaliteit"
      scoring: "direct"
      
    q4:
      text: "Hoe goed kun je je emoties reguleren in stress?"
      scale: "Likert 1-5 (Zeer slecht → Zeer goed)"
      category: "stress_coping"
      scoring: "direct"
      
    q5:
      text: "Hoe vaak ervaar je zingeving in dagelijkse activiteiten?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "zingeving_doelgerichtheid"
      scoring: "direct"
      
    q6:
      text: "Hoeveel sociale steun ervaar je?"
      scale: "Likert 1-5 (Zeer weinig → Zeer veel)"
      category: "sociale_steun"
      scoring: "direct"
      
    q7:
      text: "Hoe vaak ervaar je lichamelijke klachten die functioneren beïnvloeden?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "stress_coping"
      scoring: "reversed"
      
    q8:
      text: "Hoe vaak handel je doelgericht?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "zingeving_doelgerichtheid"
      scoring: "direct"
      
    q9:
      text: "Hoe vaak ben je vriendelijk voor jezelf bij tegenslag?"
      scale: "Likert 1-5 (Zeer zelden → Zeer vaak)"
      category: "zelfcompassie"
      scoring: "direct"
      
    q10:
      text: "Hoe hoog is je ervaren stressniveau?"
      scale: "Slider 0-10 (Geen stress → Zeer hoge stress)"
      category: "stress_coping"
      scoring: "reversed"

composite_baseline_score_calculation:
  energie_vitaliteit_baseline:
    formula: "((Q1 + (6-Q2) + Q3) / 3) * 20"
    interpretation: "0-100 baseline for energy and vitality - foundation for sleep, energy, and activity modules"
    refinement_modules: ["Sleep Optimization", "Energy Management", "Physical Activity Tracking"]
    
  stress_coping_baseline:
    formula: "((Q4 + (6-Q7) + (11-Q10)) / 3) * 20"
    interpretation: "0-100 baseline for stress management - foundation for resilience and emotional regulation modules"
    refinement_modules: ["Stress Management", "Emotional Regulation", "Resilience Building"]
    
  sociale_steun_baseline:
    formula: "Q6 * 20"
    interpretation: "0-100 baseline for social support - foundation for relationship and connection modules"
    refinement_modules: ["Relationship Wellness", "Social Connection", "Support Network Building"]
    
  zelfcompassie_baseline:
    formula: "Q9 * 20"
    interpretation: "0-100 baseline for self-compassion - foundation for self-care and psychological wellness modules"
    refinement_modules: ["Self-Care Practices", "Mindfulness Training", "Psychological Wellness"]
    
  zingeving_doelgerichtheid_baseline:
    formula: "((Q5 + Q8) / 2) * 20"
    interpretation: "0-100 baseline for meaning and purpose - foundation for life purpose and goal achievement modules"
    refinement_modules: ["Life Purpose Exploration", "Goal Setting & Achievement", "Values Alignment"]
```

### Success Metrics and Validation

#### Baseline Success Metrics and Refinement Validation
```yaml
baseline_establishment_metrics:
  baseline_completion_rate:
    target: ">85%"
    measurement: "Users completing baseline assessment during onboarding"
    
  baseline_quality:
    target: "Internal consistency reliability >0.7 across dimensions"
    measurement: "Cronbach's alpha for baseline score reliability"
    
  time_efficiency:
    target: "3-4 minutes average completion time"
    measurement: "Time from baseline start to completion"

immediate_value_demonstration:
  baseline_insight_relevance:
    target: ">4.2/5.0 perceived baseline relevance"
    measurement: "User rating of baseline insights and interpretation"
    
  refinement_pathway_clarity:
    target: ">80% understand connection to main app modules"
    measurement: "User comprehension of baseline-to-refinement progression"
    
  continued_wellness_interest:
    target: ">75% express interest in wellness module exploration"
    measurement: "Intent to explore main app wellness capabilities"

baseline_to_refinement_progression:
  main_app_wellness_engagement:
    target: ">60% engage with wellness modules within 30 days"
    measurement: "Users accessing main app wellness features post-baseline"
    
  baseline_refinement_progression:
    target: ">40% complete detailed assessments within 60 days"
    measurement: "Users progressing from baseline to detailed wellness exploration"
    
  longitudinal_wellness_tracking:
    target: ">30% maintain regular wellness tracking beyond 90 days"
    measurement: "Sustained engagement with baseline refinement and development"
```

This comprehensive requirements framework ensures that Step 11 delivers scientifically-informed wellness assessment capabilities while immediately demonstrating coaching value and establishing a strong foundation for ongoing personalized coaching relationships.
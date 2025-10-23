# Onboarding Step 3: Name/Basic Info - Architecture

## Component Architecture

### Component Hierarchy
```typescript
// Primary component
NameBasicInfoStep {
  // Form structure components
  FormContainer {
    PersonalInfoSection {
      NameFields;
      PronounSelector;
      AgeRangeSelector;
    }
    
    DemographicSection {
      LocationFields;
      LanguageSelector;
      CulturalBackground;
    }
    
    ProfessionalSection {
      CurrentRoleSelector;
      IndustrySelector;
      CareerStageSelector;
    }
    
    GoalsSection {
      PrimaryGoalsSelector;
      MotivationIndicators;
    }
    
    PrivacySection {
      ConsentControls;
      PrivacySettings;
      DataUsageExplanation;
    }
  }
  
  // Dynamic adaptation components
  AdaptiveFormElements {
    MBTIAdaptiveFields;
    ProgressiveDisclosure;
    DynamicFieldOrdering;
    PersonalizedHelpText;
  }
  
  // Validation and feedback components
  ValidationSystem {
    RealTimeValidation;
    ErrorDisplay;
    SuccessIndicators;
    ProgressTracking;
  }
  
  // Support components
  SupportElements {
    HelpTooltips;
    FieldExplanations;
    PrivacyInformation;
    FormSaveRecovery;
  }
}
```

### Modular Design

#### 1. PersonalInfoSection Module
```typescript
interface PersonalInfoSectionProps {
  formData: PersonalFormData;
  onUpdate: (data: Partial<PersonalFormData>) => void;
  validationErrors: ValidationErrors;
  mbtiAdaptation?: MBTIAdaptation;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  formData,
  onUpdate,
  validationErrors,
  mbtiAdaptation
}) => {
  const fieldOrder = useMemo(() => {
    // Adapt field order based on MBTI type
    if (mbtiAdaptation?.type) {
      return getAdaptedFieldOrder(mbtiAdaptation.type);
    }
    return getDefaultFieldOrder();
  }, [mbtiAdaptation]);
  
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">
          {getAdaptedSectionTitle('personal_info', mbtiAdaptation)}
        </h2>
        <p className="text-white/70">
          {getAdaptedSectionDescription('personal_info', mbtiAdaptation)}
        </p>
      </CardHeader>
      
      <CardBody className="space-y-4">
        {fieldOrder.map(field => (
          <div key={field} className="space-y-2">
            {field === 'displayName' && (
              <NameField
                value={formData.displayName}
                onChange={(value) => onUpdate({ displayName: value })}
                error={validationErrors.displayName}
                adaptation={mbtiAdaptation}
                required
              />
            )}
            
            {field === 'pronouns' && (
              <PronounSelector
                value={formData.pronouns}
                onChange={(value) => onUpdate({ pronouns: value })}
                adaptation={mbtiAdaptation}
              />
            )}
            
            {field === 'ageRange' && (
              <AgeRangeSelector
                value={formData.ageRange}
                onChange={(value) => onUpdate({ ageRange: value })}
                error={validationErrors.ageRange}
                adaptation={mbtiAdaptation}
                required
              />
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
```

#### 2. NameField Component
```typescript
interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  adaptation?: MBTIAdaptation;
  required?: boolean;
}

const NameField: React.FC<NameFieldProps> = ({
  value,
  onChange,
  error,
  adaptation,
  required = false
}) => {
  const [isValid, setIsValid] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const placeholder = useMemo(() => {
    if (adaptation) {
      return getAdaptedPlaceholder('displayName', adaptation.type);
    }
    return "What would you like to be called?";
  }, [adaptation]);
  
  const helpText = useMemo(() => {
    if (adaptation) {
      return getAdaptedHelpText('displayName', adaptation.type);
    }
    return "This is how you'll appear throughout the app";
  }, [adaptation]);
  
  const handleChange = useCallback((newValue: string) => {
    // Real-time validation
    const validation = validateDisplayName(newValue);
    setIsValid(validation.isValid);
    
    // Track behavior for MBTI indicators
    trackNameFieldBehavior({
      inputLength: newValue.length,
      typingSpeed: calculateTypingSpeed(),
      correctionCount: getCorrectionCount(),
      completionStyle: getCompletionStyle()
    });
    
    onChange(newValue);
  }, [onChange]);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Display Name {required && <span className="text-red-400">*</span>}
      </label>
      
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className={`
            bg-white/5 border-white/20 text-white placeholder-white/50
            ${error ? 'border-red-400' : ''}
            ${!isValid ? 'border-yellow-400' : ''}
          `}
          maxLength={30}
          aria-describedby={`displayName-help ${error ? 'displayName-error' : ''}`}
        />
        
        {/* Character count */}
        <div className="absolute right-2 top-2 text-xs text-white/50">
          {value.length}/30
        </div>
      </div>
      
      {/* Help text */}
      <p id="displayName-help" className="text-sm text-white/60">
        {helpText}
      </p>
      
      {/* Error message */}
      {error && (
        <p id="displayName-error" className="text-sm text-red-400">
          {error}
        </p>
      )}
      
      {/* Validation feedback */}
      {!isValid && !error && (
        <p className="text-sm text-yellow-400">
          Name should be 2-30 characters, letters and numbers only
        </p>
      )}
    </div>
  );
};
```

#### 3. PrimaryGoalsSelector Component
```typescript
interface PrimaryGoalsSelectorProps {
  selectedGoals: string[];
  onChange: (goals: string[]) => void;
  adaptation?: MBTIAdaptation;
  maxSelections?: number;
}

const PrimaryGoalsSelector: React.FC<PrimaryGoalsSelectorProps> = ({
  selectedGoals,
  onChange,
  adaptation,
  maxSelections = 3
}) => {
  const goalOptions = useMemo(() => {
    const baseGoals = [
      {
        id: 'understand_myself_better',
        label: 'Understand myself better',
        description: 'Gain deeper self-awareness and insight',
        mbtiRelevance: ['all']
      },
      {
        id: 'improve_relationships',
        label: 'Improve relationships',
        description: 'Enhance communication and connection with others',
        mbtiRelevance: ['feeling', 'extraversion']
      },
      {
        id: 'career_development',
        label: 'Career development',
        description: 'Apply personality insights to professional growth',
        mbtiRelevance: ['thinking', 'judging']
      },
      {
        id: 'personal_growth',
        label: 'Personal growth',
        description: 'Develop and improve as an individual',
        mbtiRelevance: ['feeling', 'introversion']
      },
      {
        id: 'team_effectiveness',
        label: 'Team effectiveness',
        description: 'Work better with teams and groups',
        mbtiRelevance: ['extraversion', 'thinking']
      },
      {
        id: 'stress_management',
        label: 'Stress management',
        description: 'Better cope with challenges and pressure',
        mbtiRelevance: ['feeling', 'judging']
      },
      {
        id: 'decision_making',
        label: 'Decision making',
        description: 'Make better choices aligned with my personality',
        mbtiRelevance: ['thinking', 'judging']
      },
      {
        id: 'communication_skills',
        label: 'Communication skills',
        description: 'Express myself more effectively',
        mbtiRelevance: ['extraversion', 'feeling']
      }
    ];
    
    // Reorder based on MBTI adaptation
    if (adaptation?.type) {
      return reorderGoalsByMBTIRelevance(baseGoals, adaptation.type);
    }
    
    return baseGoals;
  }, [adaptation]);
  
  const handleGoalToggle = useCallback((goalId: string) => {
    const isSelected = selectedGoals.includes(goalId);
    
    if (isSelected) {
      // Remove goal
      onChange(selectedGoals.filter(id => id !== goalId));
    } else if (selectedGoals.length < maxSelections) {
      // Add goal
      onChange([...selectedGoals, goalId]);
      
      // Track goal selection for MBTI indicators
      trackGoalSelection({
        goalId,
        selectionOrder: selectedGoals.length + 1,
        totalSelected: selectedGoals.length + 1,
        mbtiIndicators: extractMBTIIndicatorsFromGoal(goalId)
      });
    }
  }, [selectedGoals, onChange, maxSelections]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-white">
          What are your primary goals? <span className="text-red-400">*</span>
        </label>
        <span className="text-sm text-white/60">
          Select up to {maxSelections} ({selectedGoals.length}/{maxSelections})
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goalOptions.map(goal => {
          const isSelected = selectedGoals.includes(goal.id);
          const isDisabled = !isSelected && selectedGoals.length >= maxSelections;
          
          return (
            <div
              key={goal.id}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-400 bg-blue-400/10' 
                  : 'border-white/20 bg-white/5 hover:border-white/40'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !isDisabled && handleGoalToggle(goal.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                  ${isSelected 
                    ? 'border-blue-400 bg-blue-400' 
                    : 'border-white/40'
                  }
                `}>
                  {isSelected && (
                    <CheckIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-white">
                    {goal.label}
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    {goal.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedGoals.length === 0 && (
        <p className="text-sm text-red-400">
          Please select at least one goal to continue
        </p>
      )}
    </div>
  );
};
```

### Data Flow Architecture

#### 1. State Management
```typescript
// Zustand store slice for Name/Basic Info step
interface NameBasicInfoState {
  // Form data
  formData: {
    // Personal information
    displayName: string;
    pronouns: string;
    firstName?: string;
    lastName?: string;
    ageRange: string;
    
    // Demographic information
    timezone: string;
    country?: string;
    region?: string;
    primaryLanguage: string;
    culturalBackground?: string;
    
    // Professional context
    currentRole: string;
    industryType?: string;
    careerStage?: string;
    educationLevel?: string;
    fieldOfStudy?: string;
    
    // Goals and motivations
    primaryGoals: string[];
    
    // Privacy settings
    consentGiven: {
      basicDataUsage: boolean;
      analyticsConsent: boolean;
      marketingConsent: boolean;
    };
    privacySettings: {
      profileVisibility: 'private' | 'friends_only' | 'community_visible';
      dataRetention: '1_year' | '2_years' | '5_years' | 'indefinite';
    };
  };
  
  // Validation state
  validationErrors: ValidationErrors;
  isFormValid: boolean;
  
  // UI state
  currentSection: 'personal' | 'demographic' | 'professional' | 'goals' | 'privacy';
  showOptionalFields: boolean;
  isSubmitting: boolean;
  
  // MBTI detection
  behaviorData: BehaviorData;
  detectedType: MBTIType | null;
  adaptationConfidence: number;
  
  // Actions
  actions: {
    updateFormData: (updates: Partial<FormData>) => void;
    validateField: (field: string, value: any) => void;
    validateForm: () => boolean;
    trackBehavior: (behavior: BehaviorEvent) => void;
    updateMBTIDetection: () => void;
    submitForm: () => Promise<void>;
    saveProgress: () => Promise<void>;
    loadSavedProgress: () => Promise<void>;
  };
}

const useNameBasicInfoStore = create<NameBasicInfoState>()((set, get) => ({
  // Initial state
  formData: {
    displayName: '',
    pronouns: '',
    ageRange: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    primaryLanguage: 'en',
    currentRole: '',
    primaryGoals: [],
    consentGiven: {
      basicDataUsage: false,
      analyticsConsent: false,
      marketingConsent: false
    },
    privacySettings: {
      profileVisibility: 'private',
      dataRetention: '2_years'
    }
  },
  validationErrors: {},
  isFormValid: false,
  currentSection: 'personal',
  showOptionalFields: false,
  isSubmitting: false,
  behaviorData: createEmptyBehaviorData(),
  detectedType: null,
  adaptationConfidence: 0,
  
  actions: {
    updateFormData: (updates) => {
      set(state => ({
        formData: { ...state.formData, ...updates }
      }));
      
      // Validate updated fields
      const { validateForm } = get().actions;
      validateForm();
    },
    
    validateField: (field, value) => {
      const validation = validateFormField(field, value);
      set(state => ({
        validationErrors: {
          ...state.validationErrors,
          [field]: validation.error
        }
      }));
    },
    
    validateForm: () => {
      const { formData } = get();
      const validation = validateCompleteForm(formData);
      
      set({
        validationErrors: validation.errors,
        isFormValid: validation.isValid
      });
      
      return validation.isValid;
    },
    
    trackBehavior: (behavior) => {
      set(state => ({
        behaviorData: {
          ...state.behaviorData,
          events: [...state.behaviorData.events, behavior]
        }
      }));
      
      // Update MBTI detection
      get().actions.updateMBTIDetection();
    },
    
    updateMBTIDetection: () => {
      const { behaviorData } = get();
      const detection = detectMBTIFromBehavior(behaviorData);
      
      set({
        detectedType: detection.type,
        adaptationConfidence: detection.confidence
      });
    },
    
    submitForm: async () => {
      const { formData, isFormValid } = get();
      
      if (!isFormValid) {
        throw new Error('Form validation failed');
      }
      
      set({ isSubmitting: true });
      
      try {
        // Save to database
        await formService.submitBasicInfo(formData);
        
        // Save MBTI detection data
        await mbtiService.saveDetectionData({
          step: 3,
          detectedType: get().detectedType,
          confidence: get().adaptationConfidence,
          behaviorData: get().behaviorData
        });
        
        // Progress to next step
        router.push('/onboarding/step-4');
      } catch (error) {
        console.error('Failed to submit form:', error);
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    }
  }
}));
```

#### 2. Data Integration Layer
```typescript
// Service integration for Name/Basic Info step
class NameBasicInfoService {
  private database = database;
  private supabase = supabaseClient;
  
  async submitBasicInfo(formData: FormData): Promise<void> {
    try {
      // Save to local database first
      await this.database.write(async () => {
        const usersCollection = this.database.collections.get('users');
        const user = await usersCollection.find(getCurrentUserId());
        
        await user.update(userData => {
          // Personal information
          userData.displayName = formData.displayName;
          userData.pronouns = formData.pronouns;
          userData.firstName = formData.firstName;
          userData.lastName = formData.lastName;
          userData.ageRange = formData.ageRange;
          
          // Demographic information
          userData.timezone = formData.timezone;
          userData.country = formData.country;
          userData.region = formData.region;
          userData.primaryLanguage = formData.primaryLanguage;
          userData.culturalBackground = formData.culturalBackground;
          
          // Professional context
          userData.currentRole = formData.currentRole;
          userData.industryType = formData.industryType;
          userData.careerStage = formData.careerStage;
          userData.educationLevel = formData.educationLevel;
          userData.fieldOfStudy = formData.fieldOfStudy;
          
          // Goals and motivations
          userData.primaryGoals = formData.primaryGoals;
          
          // Privacy settings
          userData.consentGiven = formData.consentGiven;
          userData.privacySettings = formData.privacySettings;
          
          // Progress tracking
          userData.onboardingStep = 3;
          userData.onboardingCompleted = false;
          userData.profileCompleteness = this.calculateProfileCompleteness(formData);
          
          userData.updatedAt = new Date();
        });
      });
      
      // Sync to Supabase
      await this.syncToSupabase(formData);
    } catch (error) {
      console.error('Failed to submit basic info:', error);
      throw error;
    }
  }
  
  private async syncToSupabase(formData: FormData): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({
        display_name: formData.displayName,
        pronouns: formData.pronouns,
        first_name: formData.firstName,
        last_name: formData.lastName,
        age_range: formData.ageRange,
        timezone: formData.timezone,
        country: formData.country,
        region: formData.region,
        primary_language: formData.primaryLanguage,
        cultural_background: formData.culturalBackground,
        current_role: formData.currentRole,
        industry_type: formData.industryType,
        career_stage: formData.careerStage,
        education_level: formData.educationLevel,
        field_of_study: formData.fieldOfStudy,
        primary_goals: formData.primaryGoals,
        consent_given: formData.consentGiven,
        privacy_settings: formData.privacySettings,
        onboarding_step: 3,
        profile_completeness: this.calculateProfileCompleteness(formData),
        updated_at: new Date().toISOString()
      })
      .eq('id', getCurrentUserId());
    
    if (error) {
      throw error;
    }
  }
  
  private calculateProfileCompleteness(formData: FormData): number {
    const totalFields = 15; // Total possible fields
    let completedFields = 0;
    
    // Count completed required fields
    if (formData.displayName) completedFields++;
    if (formData.ageRange) completedFields++;
    if (formData.primaryLanguage) completedFields++;
    if (formData.currentRole) completedFields++;
    if (formData.primaryGoals.length > 0) completedFields++;
    if (formData.consentGiven.basicDataUsage) completedFields++;
    
    // Count completed optional fields
    if (formData.pronouns) completedFields++;
    if (formData.firstName) completedFields++;
    if (formData.lastName) completedFields++;
    if (formData.country) completedFields++;
    if (formData.region) completedFields++;
    if (formData.culturalBackground) completedFields++;
    if (formData.industryType) completedFields++;
    if (formData.careerStage) completedFields++;
    if (formData.educationLevel) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  }
}
```

### Integration Points

#### 1. MBTI Detection Integration
```typescript
// Integration with MBTI detection system
class MBTIDetectionIntegration {
  async trackFormBehavior(behavior: FormBehavior): Promise<void> {
    const indicators = this.extractMBTIIndicators(behavior);
    
    await mbtiDetectionService.addBehaviorData({
      step: 3,
      timestamp: new Date(),
      behaviorType: 'form_interaction',
      indicators,
      confidence: this.calculateIndicatorConfidence(indicators)
    });
  }
  
  private extractMBTIIndicators(behavior: FormBehavior): MBTIIndicators {
    return {
      // Extraversion vs Introversion
      extraversion: {
        score: this.calculateExtraversionScore({
          socialGoalsSelected: behavior.socialGoalsSelected,
          teamEffectivenessSelected: behavior.teamEffectivenessSelected,
          relationshipGoalsSelected: behavior.relationshipGoalsSelected
        }),
        confidence: 0.6
      },
      
      // Sensing vs Intuition
      sensing: {
        score: this.calculateSensingScore({
          detailOrientation: behavior.detailOrientation,
          helpTextReading: behavior.helpTextReading,
          sequentialCompletion: behavior.sequentialCompletion
        }),
        confidence: 0.7
      },
      
      // Thinking vs Feeling
      thinking: {
        score: this.calculateThinkingScore({
          careerFocusedGoals: behavior.careerFocusedGoals,
          logicalFieldProgression: behavior.logicalFieldProgression,
          privacyDetailAttention: behavior.privacyDetailAttention
        }),
        confidence: 0.5
      },
      
      // Judging vs Perceiving
      judging: {
        score: this.calculateJudgingScore({
          systematicCompletion: behavior.systematicCompletion,
          planningIndicators: behavior.planningIndicators,
          structuredApproach: behavior.structuredApproach
        }),
        confidence: 0.8
      }
    };
  }
}
```

#### 2. Validation Service Integration
```typescript
// Comprehensive validation service
class ValidationService {
  validateDisplayName(name: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push('Display name is required');
    } else if (name.length < 2) {
      errors.push('Display name must be at least 2 characters');
    } else if (name.length > 30) {
      errors.push('Display name must be no more than 30 characters');
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      errors.push('Display name can only contain letters, numbers, and spaces');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  validatePrimaryGoals(goals: string[]): ValidationResult {
    const errors: string[] = [];
    
    if (goals.length === 0) {
      errors.push('Please select at least one primary goal');
    } else if (goals.length > 3) {
      errors.push('Please select no more than 3 primary goals');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  validateCompleteForm(formData: FormData): FormValidationResult {
    const fieldValidations = {
      displayName: this.validateDisplayName(formData.displayName),
      ageRange: this.validateAgeRange(formData.ageRange),
      primaryLanguage: this.validatePrimaryLanguage(formData.primaryLanguage),
      currentRole: this.validateCurrentRole(formData.currentRole),
      primaryGoals: this.validatePrimaryGoals(formData.primaryGoals),
      basicConsent: this.validateBasicConsent(formData.consentGiven.basicDataUsage)
    };
    
    const allErrors = Object.values(fieldValidations)
      .flatMap(validation => validation.errors);
    
    return {
      isValid: allErrors.length === 0,
      errors: fieldValidations,
      summary: {
        totalErrors: allErrors.length,
        criticalErrors: this.getCriticalErrors(fieldValidations),
        warningCount: this.getWarningCount(fieldValidations)
      }
    };
  }
}
```

This architecture provides a robust, scalable foundation for Step 3 (Name/Basic Info) with comprehensive data collection, real-time validation, MBTI detection integration, and adaptive user experiences based on personality indicators.
# Onboarding Step 4: Notifications - Architecture

## Component Architecture

### Component Hierarchy
```typescript
// Primary component
NotificationsSetupStep {
  // Main configuration sections
  NotificationConfiguration {
    CategorySelection {
      NotificationCategory;
      FrequencySelector;
      ImportanceLevelIndicator;
    }
    
    DeliveryMethodSetup {
      PushNotificationToggle;
      EmailPreferences;
      InAppSettings;
      TimingControls;
    }
    
    PersonalizationSettings {
      MBTIAdaptedDefaults;
      CustomTimingSetup;
      ContentPreferences;
    }
  }
  
  // Permission management
  PermissionManagement {
    BrowserPermissionRequest;
    MobilePermissionSetup;
    PermissionStatusDisplay;
    FallbackOptions;
  }
  
  // Preview and testing
  NotificationPreview {
    SampleNotifications;
    TestDelivery;
    PreviewByType;
    ImpactVisualization;
  }
  
  // Educational components
  EducationalElements {
    NotificationValueExplanation;
    PersonalityInsights;
    BestPracticesGuidance;
    PrivacyAssurance;
  }
}
```

### Modular Design

#### 1. CategorySelection Module
```typescript
interface CategorySelectionProps {
  selectedCategories: NotificationCategory[];
  onCategoryToggle: (category: NotificationCategory) => void;
  mbtiAdaptation?: MBTIAdaptation;
  userPreferences?: UserPreferences;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({
  selectedCategories,
  onCategoryToggle,
  mbtiAdaptation,
  userPreferences
}) => {
  const categoryOrder = useMemo(() => {
    // Reorder categories based on MBTI type
    if (mbtiAdaptation?.type) {
      return reorderCategoriesByMBTI(mbtiAdaptation.type);
    }
    return getDefaultCategoryOrder();
  }, [mbtiAdaptation]);
  
  const getRecommendationReason = useCallback((category: NotificationCategory) => {
    if (mbtiAdaptation?.type) {
      return getMBTIRecommendationReason(category, mbtiAdaptation.type);
    }
    return getGenericRecommendationReason(category);
  }, [mbtiAdaptation]);
  
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">
          {getAdaptedSectionTitle('notification_categories', mbtiAdaptation)}
        </h2>
        <p className="text-white/70">
          {getAdaptedSectionDescription('notification_categories', mbtiAdaptation)}
        </p>
      </CardHeader>
      
      <CardBody className="space-y-4">
        {categoryOrder.map(category => {
          const isSelected = selectedCategories.some(c => c.id === category.id);
          const isRecommended = isRecommendedForMBTI(category, mbtiAdaptation?.type);
          
          return (
            <NotificationCategoryCard
              key={category.id}
              category={category}
              isSelected={isSelected}
              isRecommended={isRecommended}
              recommendationReason={getRecommendationReason(category)}
              onToggle={() => onCategoryToggle(category)}
              adaptation={mbtiAdaptation}
            />
          );
        })}
      </CardBody>
    </Card>
  );
};
```

#### 2. NotificationCategoryCard Component
```typescript
interface NotificationCategoryCardProps {
  category: NotificationCategory;
  isSelected: boolean;
  isRecommended: boolean;
  recommendationReason?: string;
  onToggle: () => void;
  adaptation?: MBTIAdaptation;
}

const NotificationCategoryCard: React.FC<NotificationCategoryCardProps> = ({
  category,
  isSelected,
  isRecommended,
  recommendationReason,
  onToggle,
  adaptation
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [frequencyPreference, setFrequencyPreference] = useState(category.defaultFrequency);
  
  const adaptedContent = useMemo(() => {
    if (adaptation) {
      return getAdaptedCategoryContent(category, adaptation.type);
    }
    return getDefaultCategoryContent(category);
  }, [category, adaptation]);
  
  const handleFrequencyChange = useCallback((frequency: NotificationFrequency) => {
    setFrequencyPreference(frequency);
    trackEvent('notification_frequency_changed', {
      categoryId: category.id,
      frequency,
      mbtiType: adaptation?.type,
      isRecommended
    });
  }, [category.id, adaptation?.type, isRecommended]);
  
  return (
    <div className={`
      relative p-4 rounded-lg border-2 transition-all cursor-pointer
      ${isSelected 
        ? 'border-blue-400 bg-blue-400/10' 
        : 'border-white/20 bg-white/5 hover:border-white/40'
      }
    `}>
      {/* Recommendation badge */}
      {isRecommended && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-500 text-white">
            <StarIcon className="w-3 h-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}
      
      <div className="flex items-start gap-4" onClick={onToggle}>
        {/* Toggle control */}
        <div className={`
          w-6 h-6 rounded border-2 flex items-center justify-center mt-1
          ${isSelected 
            ? 'border-blue-400 bg-blue-400' 
            : 'border-white/40'
          }
        `}>
          {isSelected && (
            <CheckIcon className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Category information */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-white">
              {adaptedContent.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="text-white/60 hover:text-white p-1 h-auto"
            >
              <InfoIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-white/80 text-sm mb-3">
            {adaptedContent.description}
          </p>
          
          {/* Recommendation reason */}
          {isRecommended && recommendationReason && (
            <div className="bg-green-500/10 border border-green-500/20 rounded p-2 mb-3">
              <p className="text-green-400 text-xs">
                💡 {recommendationReason}
              </p>
            </div>
          )}
          
          {/* Frequency selector (when selected) */}
          {isSelected && (
            <div className="mt-3 p-3 bg-white/5 rounded" onClick={(e) => e.stopPropagation()}>
              <label className="block text-sm font-medium text-white mb-2">
                How often would you like these notifications?
              </label>
              
              <FrequencySelector
                selectedFrequency={frequencyPreference}
                availableFrequencies={category.availableFrequencies}
                onChange={handleFrequencyChange}
                adaptation={adaptation}
              />
            </div>
          )}
          
          {/* Detailed information (expandable) */}
          {showDetails && (
            <div className="mt-3 p-3 bg-white/5 rounded" onClick={(e) => e.stopPropagation()}>
              <h4 className="text-sm font-medium text-white mb-2">Examples:</h4>
              <ul className="text-xs text-white/70 space-y-1">
                {adaptedContent.examples.map((example, index) => (
                  <li key={index}>• {example}</li>
                ))}
              </ul>
              
              {adaptedContent.personalityInsight && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-xs text-blue-300">
                    🧠 {adaptedContent.personalityInsight}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### 3. DeliveryMethodSetup Component
```typescript
interface DeliveryMethodSetupProps {
  selectedMethods: DeliveryMethod[];
  onMethodToggle: (method: DeliveryMethod) => void;
  timingPreferences: TimingPreferences;
  onTimingUpdate: (timing: TimingPreferences) => void;
  adaptation?: MBTIAdaptation;
}

const DeliveryMethodSetup: React.FC<DeliveryMethodSetupProps> = ({
  selectedMethods,
  onMethodToggle,
  timingPreferences,
  onTimingUpdate,
  adaptation
}) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('unknown');
  const [showTimingDetails, setShowTimingDetails] = useState(false);
  
  const recommendedMethods = useMemo(() => {
    if (adaptation?.type) {
      return getRecommendedDeliveryMethods(adaptation.type);
    }
    return getDefaultRecommendedMethods();
  }, [adaptation]);
  
  useEffect(() => {
    checkNotificationPermissions().then(setPermissionStatus);
  }, []);
  
  const handlePushToggle = useCallback(async () => {
    const pushMethod = selectedMethods.find(m => m.type === 'push');
    
    if (!pushMethod) {
      // Request permission before enabling
      if (permissionStatus !== 'granted') {
        const permission = await requestNotificationPermission();
        setPermissionStatus(permission);
        
        if (permission !== 'granted') {
          showPermissionEducation();
          return;
        }
      }
    }
    
    onMethodToggle({ type: 'push', enabled: !pushMethod });
  }, [selectedMethods, permissionStatus, onMethodToggle]);
  
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">
          How would you like to receive notifications?
        </h2>
        <p className="text-white/70">
          Choose the delivery methods that work best for you
        </p>
      </CardHeader>
      
      <CardBody className="space-y-4">
        {/* Push Notifications */}
        <DeliveryMethodCard
          method={{
            type: 'push',
            title: 'Push Notifications',
            description: 'Get timely updates directly on your device',
            icon: <BellIcon className="w-5 h-5" />,
            isRecommended: recommendedMethods.includes('push')
          }}
          isSelected={selectedMethods.some(m => m.type === 'push')}
          onToggle={handlePushToggle}
          permissionStatus={permissionStatus}
          adaptation={adaptation}
        />
        
        {/* Email Notifications */}
        <DeliveryMethodCard
          method={{
            type: 'email',
            title: 'Email Notifications',
            description: 'Receive detailed updates and summaries via email',
            icon: <MailIcon className="w-5 h-5" />,
            isRecommended: recommendedMethods.includes('email')
          }}
          isSelected={selectedMethods.some(m => m.type === 'email')}
          onToggle={() => onMethodToggle({ type: 'email' })}
          adaptation={adaptation}
        />
        
        {/* In-App Notifications */}
        <DeliveryMethodCard
          method={{
            type: 'in_app',
            title: 'In-App Notifications',
            description: 'See updates when you open the app',
            icon: <DevicePhoneMobileIcon className="w-5 h-5" />,
            isRecommended: recommendedMethods.includes('in_app')
          }}
          isSelected={selectedMethods.some(m => m.type === 'in_app')}
          onToggle={() => onMethodToggle({ type: 'in_app' })}
          adaptation={adaptation}
        />
        
        {/* Timing Preferences */}
        {selectedMethods.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white">
                Timing Preferences
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTimingDetails(!showTimingDetails)}
                className="text-blue-400 hover:text-blue-300"
              >
                {showTimingDetails ? 'Simple' : 'Advanced'}
              </Button>
            </div>
            
            <TimingPreferencesSelector
              preferences={timingPreferences}
              onChange={onTimingUpdate}
              showAdvanced={showTimingDetails}
              adaptation={adaptation}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};
```

#### 4. NotificationPreview Component
```typescript
interface NotificationPreviewProps {
  selectedCategories: NotificationCategory[];
  selectedMethods: DeliveryMethod[];
  adaptation?: MBTIAdaptation;
}

const NotificationPreview: React.FC<NotificationPreviewProps> = ({
  selectedCategories,
  selectedMethods,
  adaptation
}) => {
  const [previewType, setPreviewType] = useState<'daily' | 'weekly' | 'achievement'>('daily');
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  const sampleNotifications = useMemo(() => {
    return generateSampleNotifications({
      categories: selectedCategories,
      previewType,
      mbtiAdaptation: adaptation
    });
  }, [selectedCategories, previewType, adaptation]);
  
  const handleSendTestNotification = useCallback(async () => {
    if (selectedMethods.length === 0) {
      toast.error('Please select at least one delivery method');
      return;
    }
    
    setIsSendingTest(true);
    try {
      await sendTestNotification({
        methods: selectedMethods,
        adaptation,
        previewType
      });
      
      toast.success('Test notification sent! Check your selected delivery methods.');
      
      trackEvent('test_notification_sent', {
        methods: selectedMethods.map(m => m.type),
        categories: selectedCategories.map(c => c.id),
        mbtiType: adaptation?.type,
        previewType
      });
    } catch (error) {
      toast.error('Failed to send test notification');
    } finally {
      setIsSendingTest(false);
    }
  }, [selectedMethods, selectedCategories, adaptation, previewType]);
  
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Preview Your Notifications
            </h2>
            <p className="text-white/70">
              See how your personalized notifications will look
            </p>
          </div>
          
          <Button
            onClick={handleSendTestNotification}
            disabled={isSendingTest || selectedMethods.length === 0}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isSendingTest ? (
              <><Spinner className="w-4 h-4 mr-2" /> Sending...</>
            ) : (
              <><PaperAirplaneIcon className="w-4 h-4 mr-2" /> Send Test</>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardBody>
        {/* Preview type selector */}
        <div className="flex gap-2 mb-4">
          {(['daily', 'weekly', 'achievement'] as const).map(type => (
            <Button
              key={type}
              variant={previewType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewType(type)}
              className="capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
        
        {/* Sample notifications */}
        <div className="space-y-3">
          {sampleNotifications.map((notification, index) => (
            <NotificationSample
              key={index}
              notification={notification}
              method={selectedMethods[0]} // Show primary method
              adaptation={adaptation}
            />
          ))}
        </div>
        
        {selectedCategories.length === 0 && (
          <div className="text-center py-8">
            <BellSlashIcon className="w-12 h-12 text-white/40 mx-auto mb-3" />
            <p className="text-white/60">
              Select notification categories above to see previews
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
```

### Data Flow Architecture

#### 1. State Management
```typescript
// Zustand store slice for Notifications step
interface NotificationsState {
  // Configuration state
  selectedCategories: NotificationCategory[];
  selectedMethods: DeliveryMethod[];
  timingPreferences: TimingPreferences;
  
  // Permission state
  permissionStatus: {
    push: PermissionState;
    email: PermissionState;
    inApp: PermissionState;
  };
  
  // UI state
  currentSection: 'categories' | 'methods' | 'timing' | 'preview';
  isConfiguring: boolean;
  isTesting: boolean;
  
  // MBTI adaptation
  detectedType: MBTIType | null;
  adaptationConfidence: number;
  personalizedDefaults: PersonalizedDefaults;
  
  // Actions
  actions: {
    toggleCategory: (category: NotificationCategory) => void;
    updateCategoryFrequency: (categoryId: string, frequency: NotificationFrequency) => void;
    toggleDeliveryMethod: (method: DeliveryMethod) => void;
    updateTimingPreferences: (timing: Partial<TimingPreferences>) => void;
    requestPermissions: () => Promise<void>;
    sendTestNotification: () => Promise<void>;
    saveConfiguration: () => Promise<void>;
    loadPersonalizedDefaults: () => Promise<void>;
  };
}

const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  // Initial state
  selectedCategories: [],
  selectedMethods: [],
  timingPreferences: getDefaultTimingPreferences(),
  permissionStatus: {
    push: 'unknown',
    email: 'granted', // Email doesn't require permission
    inApp: 'granted'  // In-app doesn't require permission
  },
  currentSection: 'categories',
  isConfiguring: false,
  isTesting: false,
  detectedType: null,
  adaptationConfidence: 0,
  personalizedDefaults: {},
  
  actions: {
    toggleCategory: (category) => {
      set(state => {
        const exists = state.selectedCategories.find(c => c.id === category.id);
        if (exists) {
          return {
            selectedCategories: state.selectedCategories.filter(c => c.id !== category.id)
          };
        } else {
          return {
            selectedCategories: [...state.selectedCategories, category]
          };
        }
      });
    },
    
    toggleDeliveryMethod: (method) => {
      set(state => {
        const exists = state.selectedMethods.find(m => m.type === method.type);
        if (exists) {
          return {
            selectedMethods: state.selectedMethods.filter(m => m.type !== method.type)
          };
        } else {
          return {
            selectedMethods: [...state.selectedMethods, method]
          };
        }
      });
    },
    
    saveConfiguration: async () => {
      const { selectedCategories, selectedMethods, timingPreferences } = get();
      
      set({ isConfiguring: true });
      
      try {
        await notificationService.saveConfiguration({
          categories: selectedCategories,
          methods: selectedMethods,
          timing: timingPreferences,
          userId: getCurrentUserId()
        });
        
        // Progress to next step
        router.push('/onboarding/step-5');
      } catch (error) {
        console.error('Failed to save notification configuration:', error);
        throw error;
      } finally {
        set({ isConfiguring: false });
      }
    }
  }
}));
```

This architecture provides a comprehensive foundation for Step 4 (Notifications) with MBTI-adaptive defaults, real-time permission management, personalized preview capabilities, and seamless integration with notification delivery systems.
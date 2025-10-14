# Onboarding Step 1: Intro Page - Architecture

## Component Hierarchy

### Primary Component
```typescript
OnboardingIntro {
  // Main container component
  ├── OnboardingLayout          // Common layout wrapper
  ├── ProgressIndicator         // Step 1/19 progress
  ├── IntroContent             // Main content area
  │   ├── WelcomeHeader        // Headline and branding
  │   ├── ValueProposition     // MBTI coaching explanation
  │   ├── MBTIPreview         // Brief MBTI concept intro
  │   └── BenefitsOverview    // Key benefits highlight
  ├── CTASection              // Call-to-action area
  │   ├── GetStartedButton    // Primary CTA
  │   └── ProgressHint        // "Step 1 of 19" indicator
  └── SupportElements         // Footer/help elements
      ├── LanguageSelector    // i18n language switching
      ├── ThemeToggle        // Dark/light mode
      └── AccessibilityMenu  // A11y options
}
```

### Supporting Components
```typescript
// Shared onboarding components
OnboardingLayout {
  ├── ProgressBar           // Global progress indicator
  ├── NavigationControls    // Back/Next/Skip buttons
  ├── OnboardingHeader      // Consistent header
  └── OnboardingFooter      // Help/support links
}

// Content components
IntroContent {
  ├── AnimatedWelcome      // Entrance animations
  ├── MBTIExplanation     // Interactive MBTI intro
  ├── PersonalityPreview   // Quick personality insight
  └── JourneyOverview     // What to expect
}

// Interactive elements
CTASection {
  ├── PrimaryButton       // Get Started action
  ├── SecondaryActions    // Learn More, Skip Tour
  └── ProgressMotivation  // "19 steps to your best self"
}
```

## Modular Design Principles

### Core Modules

#### 1. Content Module
```typescript
interface IntroContentModule {
  headline: string;
  subheading: string;
  benefits: BenefitItem[];
  mbtiPreview: MBTIPreviewData;
  cta: CTAConfiguration;
}

// MBTI-aware content selection
type ContentVariant = {
  [K in MBTIType]: IntroContentModule;
};
```

#### 2. Interaction Module
```typescript
interface InteractionModule {
  animations: AnimationConfig;
  transitions: TransitionConfig;
  gestures: GestureConfig;
  haptics: HapticConfig;
}

// Personality-based interaction preferences
type InteractionVariant = {
  introversion: InteractionModule;  // Calm, subtle
  extraversion: InteractionModule;  // Dynamic, engaging
};
```

#### 3. Analytics Module
```typescript
interface AnalyticsModule {
  trackPageView: () => void;
  trackEngagement: (event: EngagementEvent) => void;
  trackProgression: (step: number) => void;
  trackPersonalityAdaptation: (type: MBTIType) => void;
}
```

#### 4. Accessibility Module
```typescript
interface AccessibilityModule {
  screenReader: ScreenReaderConfig;
  keyboardNavigation: KeyboardConfig;
  focusManagement: FocusConfig;
  highContrast: ContrastConfig;
}
```

## Data Flow Architecture

### State Management
```typescript
// Onboarding state structure
interface OnboardingState {
  currentStep: number;              // 1-19
  completedSteps: number[];
  userProgress: ProgressData;
  personalityHint?: MBTIType;       // Early detection
  preferences: UserPreferences;
  sessionData: SessionInfo;
}

// Step 1 specific state
interface IntroStepState {
  contentLoaded: boolean;
  animationsPlayed: boolean;
  ctaClicked: boolean;
  timeSpent: number;
  interactionEvents: InteractionEvent[];
}
```

### Data Sources
```typescript
// External data dependencies
interface DataSources {
  // User detection
  userAgent: UserAgentInfo;
  deviceCapabilities: DeviceInfo;
  networkCondition: NetworkInfo;
  
  // Content sources
  contentCMS: ContentManagementSystem;
  translations: InternationalizationAPI;
  mbtiContent: MBTIContentAPI;
  
  // Configuration
  featureFlags: FeatureFlagService;
  abTests: ABTestingService;
  analytics: AnalyticsService;
}
```

### Component Communication
```typescript
// Event-driven architecture
interface OnboardingEvents {
  // Navigation events
  'step:start': { step: number };
  'step:complete': { step: number, data: StepData };
  'step:skip': { step: number };
  
  // Interaction events
  'content:viewed': { section: string, duration: number };
  'cta:clicked': { button: string, timestamp: number };
  'personality:detected': { type: MBTIType, confidence: number };
  
  // System events
  'error:occurred': { error: Error, context: string };
  'performance:measured': { metric: string, value: number };
}
```

## Integration Architecture

### External System Integration

#### 1. Progress Tracking Integration
```typescript
// WatermelonDB integration
interface ProgressPersistence {
  saveStepProgress(step: number, data: StepData): Promise<void>;
  loadUserProgress(): Promise<OnboardingProgress>;
  updateStepCompletion(step: number): Promise<void>;
}

// Supabase sync for cross-device
interface CloudSync {
  syncProgressToCloud(progress: OnboardingProgress): Promise<void>;
  restoreProgressFromCloud(userId: string): Promise<OnboardingProgress>;
}
```

#### 2. Analytics Integration
```typescript
// Privacy-compliant analytics
interface AnalyticsIntegration {
  trackEvent(event: AnalyticsEvent): void;
  setUserProperty(property: string, value: any): void;
  startTiming(name: string): void;
  endTiming(name: string): void;
}

// GDPR-compliant implementation
class PrivacyFirstAnalytics implements AnalyticsIntegration {
  // Only track with explicit consent
  // Anonymize all personal data
  // Respect Do Not Track headers
}
```

#### 3. Content Management Integration
```typescript
// Dynamic content loading
interface ContentIntegration {
  loadStepContent(step: number, language: string): Promise<StepContent>;
  loadMBTIVariant(type: MBTIType): Promise<MBTIContent>;
  loadABTestVariant(testId: string): Promise<TestVariant>;
}
```

## Performance Architecture

### Loading Strategy
```typescript
// Progressive loading approach
class IntroLoadingStrategy {
  // Critical path: Essential content first
  async loadCriticalContent(): Promise<CoreContent>;
  
  // Secondary: MBTI adaptations
  async loadPersonalityContent(): Promise<MBTIContent>;
  
  // Tertiary: Animations and enhancements
  async loadEnhancements(): Promise<EnhancementContent>;
  
  // Background: Preload next steps
  async preloadNextSteps(): Promise<void>;
}
```

### Caching Strategy
```typescript
// Multi-layer caching
interface CachingStrategy {
  // Browser cache for static assets
  browserCache: BrowserCacheConfig;
  
  // Service worker for offline
  serviceWorkerCache: SWCacheConfig;
  
  // Memory cache for dynamic content
  memoryCache: MemoryCacheConfig;
  
  // IndexedDB for persistent data
  persistentCache: PersistentCacheConfig;
}
```

## Error Handling Architecture

### Error Boundary Strategy
```typescript
// Hierarchical error boundaries
OnboardingIntro {
  ├── OnboardingErrorBoundary     // Top-level error handling
  │   ├── ContentErrorBoundary    // Content loading errors
  │   ├── AnalyticsErrorBoundary  // Analytics failures
  │   └── InteractionErrorBoundary // User interaction errors
}

// Error recovery mechanisms
interface ErrorRecovery {
  fallbackContent: FallbackContentStrategy;
  retryMechanisms: RetryStrategy;
  userNotification: ErrorNotificationStrategy;
  errorReporting: ErrorReportingStrategy;
}
```

### Graceful Degradation
```typescript
// Feature detection and fallbacks
interface FeatureDetection {
  // Animation support
  supportsAnimations(): boolean;
  fallbackToStaticContent(): void;
  
  // Network capabilities  
  detectConnectionSpeed(): 'slow' | 'fast';
  adaptContentToConnection(): void;
  
  // Device capabilities
  supportsHaptics(): boolean;
  fallbackToVisualFeedback(): void;
}
```

## Security Architecture

### Data Protection
```typescript
// Privacy-first design
interface DataProtection {
  // Minimal data collection
  collectOnlyNecessaryData(): void;
  
  // Anonymous analytics
  anonymizeUserData(data: UserData): AnonymizedData;
  
  // Secure storage
  encryptSensitiveData(data: SensitiveData): EncryptedData;
  
  // GDPR compliance
  handleDataDeletionRequest(userId: string): Promise<void>;
}
```

### Content Security
```typescript
// CSP and security headers
interface SecurityConfig {
  contentSecurityPolicy: CSPConfig;
  crossOriginResourceSharing: CORSConfig;
  dataIntegrityValidation: IntegrityConfig;
  userInputSanitization: SanitizationConfig;
}
```

## Deployment Architecture

### Environment Configuration
```typescript
// Environment-specific configs
interface DeploymentConfig {
  development: {
    enableDebugging: true;
    verboseLogging: true;
    mockData: true;
  };
  staging: {
    enableABTesting: true;
    performanceMonitoring: true;
    errorReporting: true;
  };
  production: {
    optimizedBuild: true;
    minimalLogging: true;
    securityHardening: true;
  };
}
```

### Feature Flag Integration
```typescript
// Progressive feature rollout
interface FeatureFlags {
  'intro-animations-v2': boolean;
  'mbti-early-detection': boolean;
  'advanced-accessibility': boolean;
  'performance-optimizations': boolean;
}
```

This architecture provides a solid foundation for implementing the Intro step with full BMAD compliance, ensuring scalability, maintainability, and optimal user experience across all personality types.
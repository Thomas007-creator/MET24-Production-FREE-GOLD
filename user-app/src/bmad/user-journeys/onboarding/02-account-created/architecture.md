# Onboarding Step 2: Account Created - Architecture

## Component Architecture

### Component Hierarchy
```typescript
// Primary component
AccountCreatedStep {
  // Core display components
  AccountConfirmationDisplay {
    WelcomeMessage;
    AccountDetails;
    VerificationStatus;
    NextStepsPreview;
  }
  
  // Action components
  AccountActions {
    EmailVerificationPanel;
    SecuritySetupPrompt;
    ProfileCustomization;
    NotificationPreferences;
  }
  
  // Navigation components
  ProgressNavigation {
    StepIndicator;
    ContinueButton;
    BackButton;
    SkipOptions;
  }
  
  // Support components
  SupportElements {
    HelpTooltips;
    ContactSupport;
    TroubleshootingGuide;
    FAQAccess;
  }
}
```

### Modular Design

#### 1. AccountConfirmationDisplay Module
```typescript
interface AccountConfirmationDisplayProps {
  user: UserData;
  verificationStatus: VerificationStatus;
  accountFeatures: AccountFeatures;
  mbtiAdaptation?: MBTIAdaptation;
}

const AccountConfirmationDisplay: React.FC<AccountConfirmationDisplayProps> = ({
  user,
  verificationStatus,
  accountFeatures,
  mbtiAdaptation
}) => {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
      <CardBody className="p-8">
        {/* Welcome Message - MBTI Adapted */}
        <WelcomeMessage 
          user={user}
          adaptation={mbtiAdaptation}
          className="mb-6"
        />
        
        {/* Account Details */}
        <AccountDetails 
          user={user}
          features={accountFeatures}
          className="mb-6"
        />
        
        {/* Verification Status */}
        <VerificationStatus 
          status={verificationStatus}
          onResendEmail={handleResendEmail}
          className="mb-6"
        />
        
        {/* Next Steps Preview */}
        <NextStepsPreview 
          adaptation={mbtiAdaptation}
          className="mb-4"
        />
      </CardBody>
    </Card>
  );
};
```

#### 2. WelcomeMessage Component
```typescript
interface WelcomeMessageProps {
  user: UserData;
  adaptation?: MBTIAdaptation;
  className?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  user, 
  adaptation, 
  className 
}) => {
  const welcomeContent = useMemo(() => {
    if (adaptation) {
      return getAdaptedWelcomeMessage(adaptation.type, user);
    }
    return getDefaultWelcomeMessage(user);
  }, [adaptation, user]);
  
  return (
    <div className={`text-center ${className}`}>
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <CheckCircleIcon className="h-16 w-16 text-green-400" />
      </div>
      
      {/* Main Welcome Message */}
      <h1 className="text-3xl font-bold text-white mb-4">
        {welcomeContent.headline}
      </h1>
      
      {/* Personalized Subheading */}
      <p className="text-xl text-white/80 mb-6">
        {welcomeContent.subheading.replace('{name}', user.displayName)}
      </p>
      
      {/* Type-specific Additional Message */}
      {adaptation && welcomeContent.additionalMessage && (
        <div className="bg-white/5 rounded-lg p-4 mt-4">
          <p className="text-white/90">
            {welcomeContent.additionalMessage}
          </p>
        </div>
      )}
    </div>
  );
};
```

#### 3. EmailVerificationPanel Component
```typescript
interface EmailVerificationPanelProps {
  email: string;
  verificationStatus: VerificationStatus;
  onResendEmail: () => Promise<void>;
  onCheckVerification: () => Promise<void>;
}

const EmailVerificationPanel: React.FC<EmailVerificationPanelProps> = ({
  email,
  verificationStatus,
  onResendEmail,
  onCheckVerification
}) => {
  const [isResending, setIsResending] = useState(false);
  const [lastResent, setLastResent] = useState<Date | null>(null);
  
  const canResend = useMemo(() => {
    if (!lastResent) return true;
    return Date.now() - lastResent.getTime() > 60000; // 1 minute cooldown
  }, [lastResent]);
  
  const handleResend = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    try {
      await onResendEmail();
      setLastResent(new Date());
      toast.success('Verification email sent!');
    } catch (error) {
      toast.error('Failed to send verification email');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <Card className="bg-white/5 border border-white/10">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Email Verification
          </h3>
          <VerificationStatusBadge status={verificationStatus.status} />
        </div>
        
        {verificationStatus.status === 'pending' && (
          <div className="space-y-4">
            <p className="text-white/80">
              We've sent a verification email to <strong>{email}</strong>
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={onCheckVerification}
                variant="ghost"
                className="text-white border-white/20"
              >
                Check Verification
              </Button>
              
              <Button
                onClick={handleResend}
                disabled={!canResend || isResending}
                variant="outline"
                className="text-white border-white/20"
              >
                {isResending ? 'Sending...' : 'Resend Email'}
              </Button>
            </div>
            
            <EmailTroubleshootingHelp email={email} />
          </div>
        )}
        
        {verificationStatus.status === 'verified' && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Email verified successfully!</span>
          </div>
        )}
        
        {verificationStatus.status === 'failed' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <XCircleIcon className="h-5 w-5" />
              <span>Verification failed</span>
            </div>
            
            <Button
              onClick={handleResend}
              disabled={isResending}
              className="bg-red-500 hover:bg-red-600"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
```

#### 4. SecuritySetupPrompt Component
```typescript
interface SecuritySetupPromptProps {
  user: UserData;
  onSetupSecurity: () => void;
  onSkipForNow: () => void;
  adaptation?: MBTIAdaptation;
}

const SecuritySetupPrompt: React.FC<SecuritySetupPromptProps> = ({
  user,
  onSetupSecurity,
  onSkipForNow,
  adaptation
}) => {
  const securityMessage = useMemo(() => {
    if (adaptation) {
      return getAdaptedSecurityMessage(adaptation.type);
    }
    return getDefaultSecurityMessage();
  }, [adaptation]);
  
  return (
    <Card className="bg-white/5 border border-white/10">
      <CardBody className="p-6">
        <div className="flex items-start gap-4">
          <ShieldCheckIcon className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              {securityMessage.headline}
            </h3>
            
            <p className="text-white/80 mb-4">
              {securityMessage.description}
            </p>
            
            <div className="space-y-2 mb-4">
              {securityMessage.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-green-400" />
                  <span className="text-white/90 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={onSetupSecurity}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {securityMessage.primaryAction}
              </Button>
              
              <Button
                onClick={onSkipForNow}
                variant="ghost"
                className="text-white/70 hover:text-white"
              >
                Skip for now
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
```

### Data Flow Architecture

#### 1. State Management
```typescript
// Zustand store slice for Account Created step
interface AccountCreatedState {
  // User account data
  user: UserData | null;
  verificationStatus: VerificationStatus;
  accountFeatures: AccountFeatures;
  
  // UI state
  isLoading: boolean;
  showSecuritySetup: boolean;
  showProfileCustomization: boolean;
  
  // MBTI adaptation
  detectedType: MBTIType | null;
  adaptationConfidence: number;
  
  // Actions
  actions: {
    setUser: (user: UserData) => void;
    updateVerificationStatus: (status: VerificationStatus) => void;
    resendVerificationEmail: () => Promise<void>;
    checkEmailVerification: () => Promise<void>;
    setupSecurity: () => Promise<void>;
    customizeProfile: (updates: ProfileUpdates) => Promise<void>;
    completeStep: () => Promise<void>;
    detectMBTIType: (behaviorData: BehaviorData) => void;
  };
}

const useAccountCreatedStore = create<AccountCreatedState>()((set, get) => ({
  // Initial state
  user: null,
  verificationStatus: { status: 'pending', email: '', sentAt: null },
  accountFeatures: { personalityAssessment: true, dataSync: true },
  isLoading: false,
  showSecuritySetup: false,
  showProfileCustomization: false,
  detectedType: null,
  adaptationConfidence: 0,
  
  actions: {
    setUser: (user) => set({ user }),
    
    updateVerificationStatus: (status) => set({ verificationStatus: status }),
    
    resendVerificationEmail: async () => {
      const { user } = get();
      if (!user) return;
      
      set({ isLoading: true });
      try {
        await authService.resendVerificationEmail(user.email);
        set({
          verificationStatus: {
            status: 'pending',
            email: user.email,
            sentAt: new Date()
          }
        });
      } catch (error) {
        console.error('Failed to resend verification email:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    
    checkEmailVerification: async () => {
      const { user } = get();
      if (!user) return;
      
      try {
        const verified = await authService.checkEmailVerification(user.id);
        if (verified) {
          set({
            verificationStatus: {
              status: 'verified',
              email: user.email,
              verifiedAt: new Date()
            }
          });
        }
      } catch (error) {
        console.error('Failed to check verification:', error);
      }
    },
    
    completeStep: async () => {
      const { user } = get();
      if (!user) return;
      
      set({ isLoading: true });
      try {
        // Save step completion
        await onboardingService.completeStep(2, {
          userId: user.id,
          completedAt: new Date(),
          verificationStatus: get().verificationStatus,
          nextStep: 3
        });
        
        // Navigate to next step
        router.push('/onboarding/step-3');
      } catch (error) {
        console.error('Failed to complete step:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    }
  }
}));
```

#### 2. Data Integration Layer
```typescript
// Service integration for Account Created step
class AccountCreatedService {
  private database = database;
  private supabase = supabaseClient;
  
  async loadUserAccount(userId: string): Promise<UserAccountData> {
    try {
      // Load from local database first (offline support)
      const localUser = await this.database.collections
        .get('users')
        .find(userId);
      
      // Sync with Supabase
      const { data: remoteUser, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && localUser) {
        // Use local data if remote fails
        return this.mapLocalUserToAccountData(localUser);
      }
      
      if (remoteUser) {
        // Update local database with remote data
        await this.syncUserToLocal(remoteUser);
        return this.mapRemoteUserToAccountData(remoteUser);
      }
      
      throw new Error('User account not found');
    } catch (error) {
      console.error('Failed to load user account:', error);
      throw error;
    }
  }
  
  async checkEmailVerification(userId: string): Promise<boolean> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        return false;
      }
      
      const isVerified = user.email_confirmed_at !== null;
      
      // Update local verification status
      if (isVerified) {
        await this.updateLocalVerificationStatus(userId, true);
      }
      
      return isVerified;
    } catch (error) {
      console.error('Failed to check email verification:', error);
      return false;
    }
  }
  
  async updateAccountSettings(
    userId: string,
    settings: AccountSettings
  ): Promise<void> {
    try {
      // Update local database
      await this.database.write(async () => {
        const user = await this.database.collections
          .get('users')
          .find(userId);
        
        await user.update(userData => {
          userData.settings = { ...userData.settings, ...settings };
          userData.updatedAt = new Date();
        });
      });
      
      // Sync to Supabase
      await this.supabase
        .from('users')
        .update({ settings, updated_at: new Date() })
        .eq('id', userId);
    } catch (error) {
      console.error('Failed to update account settings:', error);
      throw error;
    }
  }
  
  private async syncUserToLocal(remoteUser: any): Promise<void> {
    await this.database.write(async () => {
      const usersCollection = this.database.collections.get('users');
      
      try {
        const existingUser = await usersCollection.find(remoteUser.id);
        await existingUser.update(userData => {
          Object.assign(userData, this.mapRemoteToLocal(remoteUser));
        });
      } catch {
        // User doesn't exist locally, create new
        await usersCollection.create(userData => {
          Object.assign(userData, this.mapRemoteToLocal(remoteUser));
        });
      }
    });
  }
}
```

### Integration Points

#### 1. Authentication Integration
```typescript
// Integration with Supabase Auth
class AuthenticationIntegration {
  async getCurrentUser(): Promise<UserData | null> {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email!,
      displayName: user.user_metadata.display_name || user.email!.split('@')[0],
      emailVerified: user.email_confirmed_at !== null,
      createdAt: new Date(user.created_at),
      lastSignIn: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null
    };
  }
  
  async resendVerificationEmail(email: string): Promise<void> {
    const { error } = await supabaseClient.auth.resend({
      type: 'signup',
      email
    });
    
    if (error) throw error;
  }
}
```

#### 2. Email Service Integration
```typescript
// Integration with email services
class EmailServiceIntegration {
  async sendWelcomeEmail(
    user: UserData,
    adaptation?: MBTIAdaptation
  ): Promise<void> {
    const template = this.getWelcomeEmailTemplate(adaptation?.type);
    
    const emailData = {
      to: user.email,
      template: template.id,
      personalizations: {
        name: user.displayName,
        welcome_message: template.welcomeMessage,
        next_steps: template.nextSteps,
        support_contact: process.env.REACT_APP_SUPPORT_EMAIL
      }
    };
    
    await this.emailProvider.send(emailData);
  }
  
  private getWelcomeEmailTemplate(mbtiType?: MBTIType): EmailTemplate {
    if (!mbtiType) {
      return this.defaultWelcomeTemplate;
    }
    
    return this.mbtiWelcomeTemplates[mbtiType] || this.defaultWelcomeTemplate;
  }
}
```

#### 3. Analytics Integration
```typescript
// Integration with analytics services
class AnalyticsIntegration {
  async trackAccountCreatedStep(
    user: UserData,
    stepData: StepCompletionData
  ): Promise<void> {
    const event = {
      event: 'onboarding_step_completed',
      properties: {
        step_number: 2,
        step_name: 'account_created',
        user_id: user.id,
        email_verified: stepData.emailVerified,
        time_spent: stepData.timeSpent,
        security_setup_completed: stepData.securitySetupCompleted,
        profile_customized: stepData.profileCustomized,
        mbti_adaptation_applied: stepData.mbtiAdaptation?.type,
        timestamp: new Date().toISOString()
      }
    };
    
    // Send to multiple analytics services
    await Promise.allSettled([
      this.posthog.capture(event),
      this.amplitude.track(event),
      this.customAnalytics.track(event)
    ]);
  }
}
```

This architecture provides a robust, scalable foundation for the Account Created step with full MBTI adaptation support, offline capabilities, and comprehensive integration with all necessary services.
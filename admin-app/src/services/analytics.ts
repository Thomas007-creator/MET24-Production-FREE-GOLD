/**
 * Analytics Service - Privacy-First Event Tracking
 *
 * Deze service zorgt voor privacy-safe analytics tracking.
 * Alleen metadata wordt getrackt, geen gevoelige persoonlijke data.
 */

import { logger } from '../utils/logger';

// Onboarding Events - Privacy-safe metadata only
export const ONBOARDING_EVENTS = {
  WELCOME_START: 'onboarding_welcome_start',
  ACCOUNT_CREATED_START: 'onboarding_account_created_start',
  AUTH_CHOICE_SELECTED: 'onboarding_auth_choice_selected',
  PRIVACY_ACCEPT: 'onboarding_privacy_accept',
  PROFILE_BASIC_SUBMITTED: 'onboarding_profile_basic_submitted',
  MBTI_CHOICE: 'onboarding_mbti_choice',
  MBTI_QUICKTEST_COMPLETED: 'onboarding_mbti_quicktest_completed',
  MBTI_RESULT_SAVED: 'onboarding_mbti_result_saved',
  INTERESTS_SELECTED: 'onboarding_interests_selected',
  CONTEXT_SUBMITTED: 'onboarding_context_submitted',
  WELLNESS_ASSESSMENT_COMPLETED: 'onboarding_wellness_assessment_completed',
  NOTIFICATIONS_CHOICE: 'onboarding_notifications_choice',
  VERIFICATION_COMPLETED: 'onboarding_verification_completed',
  COMPLETE: 'onboarding_complete',
} as const;

export type OnboardingEventName =
  (typeof ONBOARDING_EVENTS)[keyof typeof ONBOARDING_EVENTS];

// AI Events
export const AI_EVENTS = {
  ACTION_PLAN_GENERATED: 'ai_action_plan_generated',
  ACTION_PLAN_VIEWED: 'ai_action_plan_viewed',
  COACHING_SESSION_STARTED: 'ai_coaching_session_started',
  COACHING_SESSION_COMPLETED: 'ai_coaching_session_completed',
  PROMPT_GENERATED: 'ai_prompt_generated',
  RESPONSE_RECEIVED: 'ai_response_received',
} as const;

export type AIEventName = (typeof AI_EVENTS)[keyof typeof AI_EVENTS];

// Journaling Events
export const JOURNALING_EVENTS = {
  ENTRY_CREATED: 'journaling_entry_created',
  ENTRY_UPDATED: 'journaling_entry_updated',
  ENTRY_DELETED: 'journaling_entry_deleted',
  TASK_CREATED: 'journaling_task_created',
  TASK_COMPLETED: 'journaling_task_completed',
  TASK_DELETED: 'journaling_task_deleted',
} as const;

export type JournalingEventName =
  (typeof JOURNALING_EVENTS)[keyof typeof JOURNALING_EVENTS];

// Upgrade Events
export const UPGRADE_EVENTS = {
  UPGRADE_PAGE_VIEWED: 'upgrade_page_viewed',
  SUBSCRIPTION_SELECTED: 'upgrade_subscription_selected',
  PAYMENT_METHOD_SELECTED: 'upgrade_payment_method_selected',
  PAYMENT_INITIATED: 'upgrade_payment_initiated',
  PAYMENT_COMPLETED: 'upgrade_payment_completed',
  PAYMENT_FAILED: 'upgrade_payment_failed',
} as const;

export type UpgradeEventName =
  (typeof UPGRADE_EVENTS)[keyof typeof UPGRADE_EVENTS];

// Privacy-safe properties interface
export interface PrivacySafeProperties {
  // MBTI metadata (safe)
  mbtiType?: string;
  mbtiLetters?: string[];

  // Counts and percentages (safe)
  interestCount?: number;
  wellnessScore?: number;
  stressLevel?: number;

  // Feature usage (safe)
  featuresUsed?: string[];
  timeSpent?: number;

  // Technical metadata (safe)
  step?: string;
  timestamp?: string;
  sessionId?: string;

  // User journey (safe)
  currentStep?: string;
  completedSteps?: string[];

  // Payment analytics (safe - no personal data)
  method?: string;
  bank?: string;
  status?: string;

  // NO persoonlijke data zoals:
  // - situation text
  // - raw answers
  // - personal notes
  // - context details
}

// Analytics service class
export class AnalyticsService {
  private log = logger.service('AnalyticsService');
  private static instance: AnalyticsService;
  private events: Array<{
    event: string;
    properties: PrivacySafeProperties;
    timestamp: string;
  }> = [];

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track onboarding event with privacy-safe properties
  public trackOnboardingEvent(
    eventName: OnboardingEventName,
    properties: PrivacySafeProperties = {}
  ) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    logger.info(`📊 Analytics: ${eventName}`, event.properties);
  }

  // Track AI event
  public trackAIEvent(
    eventName: AIEventName,
    properties: PrivacySafeProperties = {}
  ) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    logger.info(`🤖 AI Analytics: ${eventName}`, event.properties);
  }

  // Track journaling event
  public trackJournalingEvent(
    eventName: JournalingEventName,
    properties: PrivacySafeProperties = {}
  ) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    logger.info(`📝 Journaling Analytics: ${eventName}`, event.properties);
  }

  // Track upgrade event
  public trackUpgradeEvent(
    eventName: UpgradeEventName,
    properties: PrivacySafeProperties = {}
  ) {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    logger.info(`💎 Upgrade Analytics: ${eventName}`, event.properties);
  }

  // Get all events (for debugging)
  public getAllEvents() {
    return this.events;
  }

  // Clear events (for privacy)
  public clearEvents() {
    this.events = [];
    logger.info('🧹 Analytics events cleared');
  }

  // Get session ID
  private getSessionId(): string {
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Export events (for server sync if user opts in)
  public exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }

  // Legacy methods for backward compatibility
  public async trackMainViewNavigation(action: string): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.WELCOME_START, {
      currentStep: 'mainview',
      featuresUsed: [action],
    });
  }

  public async trackButtonClick(
    buttonName: string,
    location: string
  ): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.WELCOME_START, {
      featuresUsed: [`${buttonName}_${location}`],
    });
  }

  public async trackFeatureUsage(feature: string): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.WELCOME_START, {
      featuresUsed: [feature],
    });
  }

  // Legacy onboarding methods
  public async trackOnboardingWelcomeStart(): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.WELCOME_START);
  }

  public async trackOnboardingAuthChoice(choice: string): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.AUTH_CHOICE_SELECTED, {
      featuresUsed: [choice],
    });
  }

  public async trackOnboardingPrivacyAccept(): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.PRIVACY_ACCEPT);
  }

  public async trackOnboardingProfileBasic(age: number): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.PROFILE_BASIC_SUBMITTED, {
      wellnessScore: age,
    });
  }

  public async trackOnboardingAccountCreated(): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.ACCOUNT_CREATED_START);
  }

  public async trackOnboardingMbtiChoice(choice: string): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.MBTI_CHOICE, {
      featuresUsed: [choice],
    });
  }

  public async trackOnboardingMbtiQuicktest(
    mbtiType: string,
    score: number
  ): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.MBTI_QUICKTEST_COMPLETED, {
      mbtiType,
      wellnessScore: score,
    });
  }

  public async trackOnboardingMbtiResultSaved(
    mbtiType: string,
    score: number
  ): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.MBTI_RESULT_SAVED, {
      mbtiType,
      wellnessScore: score,
    });
  }

  public async trackOnboardingInterestsSelected(count: number): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.INTERESTS_SELECTED, {
      interestCount: count,
    });
  }

  public async trackOnboardingContextSubmitted(): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.CONTEXT_SUBMITTED);
  }

  public async trackOnboardingWellnessAssessment(scores: any): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.WELLNESS_ASSESSMENT_COMPLETED, {
      wellnessScore: (scores.overall as number) || 0,
    });
  }

  public async trackOnboardingNotificationsChoice(
    choice: string
  ): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.NOTIFICATIONS_CHOICE, {
      featuresUsed: [choice],
    });
  }

  public async trackOnboardingVerificationCompleted(): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.VERIFICATION_COMPLETED);
  }

  public async trackOnboardingComplete(data: any): Promise<void> {
    this.trackOnboardingEvent(ONBOARDING_EVENTS.COMPLETE, {
      mbtiType: data.mbtiType as string,
      interestCount: (data.interests as any[])?.length || 0,
    });
  }

  // Generic track method for custom events
  public async track(
    eventName: string,
    properties: PrivacySafeProperties = {}
  ): Promise<void> {
    const event = {
      event: eventName,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
      },
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);
    logger.info(`📊 Custom Analytics: ${eventName}`, event.properties);
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance();

// Default export for backward compatibility
export default analytics;

// Helper functions for common tracking patterns
export function trackOnboardingStep(
  step: string,
  mbtiType?: string,
  additionalProps: PrivacySafeProperties = {}
) {
  analytics.trackOnboardingEvent(ONBOARDING_EVENTS.WELCOME_START, {
    currentStep: step,
    mbtiType,
    ...additionalProps,
  });
}

export function trackAIUsage(
  feature: string,
  mbtiType?: string,
  additionalProps: PrivacySafeProperties = {}
) {
  analytics.trackAIEvent(AI_EVENTS.ACTION_PLAN_GENERATED, {
    featuresUsed: [feature],
    mbtiType,
    ...additionalProps,
  });
}

export function trackFeatureUsage(
  feature: string,
  additionalProps: PrivacySafeProperties = {}
) {
  analytics.trackOnboardingEvent(ONBOARDING_EVENTS.WELCOME_START, {
    featuresUsed: [feature],
    ...additionalProps,
  });
}

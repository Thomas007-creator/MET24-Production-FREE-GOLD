import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class OnboardingState extends Model {
  static table = 'onboarding_states'

  @field('user_id') userId!: string
  @field('current_step') currentStep!: string
  @text('step_completed_flags') stepCompletedFlags!: string
  @text('user_data') userData!: string
  @text('mbti_data') mbtiData?: string
  @text('interests') interests?: string
  @text('context_data') contextData?: string
  @text('wellness_data') wellnessData?: string
  @text('notification_preferences') notificationPreferences?: string
  @field('verification_status') verificationStatus?: string
  @field('onboarded_at') onboardedAt?: number
  @readonly @date('created_at') createdAt!: number
  @readonly @date('updated_at') updatedAt!: number
}

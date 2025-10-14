import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class WellnessAssessment extends Model {
  static table = 'wellness_assessments'

  @field('user_id') userId!: string
  @field('assessment_id') assessmentId!: string
  @field('time_point') timePoint!: string // T0, T1, T2, T3, T4...
  @field('session_id') sessionId?: string // Therapy session ID (optional)
  @field('program_id') programId?: string // Therapy program ID (optional)
  @field('answers_encrypted') answersEncrypted!: string // Encrypted raw answers
  @field('scores_json') scoresJson!: string // JSON: {energy_index, stress_index, social_support_score, self_compassion_score}
  @field('mbti_type') mbtiType!: string // User's MBTI type at time of assessment
  @field('assessment_type') assessmentType!: string // 'onboarding', 'therapy_session', 'follow_up'
  @field('completed_at') completedAt!: number
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}

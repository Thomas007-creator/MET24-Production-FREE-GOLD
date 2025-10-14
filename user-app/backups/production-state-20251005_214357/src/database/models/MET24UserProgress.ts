import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24UserProgress extends Model {
  static table = 'met24_user_progress'

  @field('user_id') userId!: string
  @field('domain_id') domainId!: string
  @field('progress_percentage') progressPercentage!: number
  @field('completed_insights') completedInsights!: string
  @field('completed_applications') completedApplications!: string
  @field('current_insight_id') currentInsightId!: string
  @field('current_application_id') currentApplicationId!: string
  @field('learning_path') learningPath!: string
  @field('achievements') achievements!: string
  @field('notes') notes!: string
  @field('last_accessed_at') lastAccessedAt!: number

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Helper methods
  get completedInsightsArray(): string[] {
    try {
      return JSON.parse(this.completedInsights || '[]')
    } catch {
      return []
    }
  }

  get completedApplicationsArray(): string[] {
    try {
      return JSON.parse(this.completedApplications || '[]')
    } catch {
      return []
    }
  }

  get learningPathArray(): any[] {
    try {
      return JSON.parse(this.learningPath || '[]')
    } catch {
      return []
    }
  }

  get achievementsArray(): any[] {
    try {
      return JSON.parse(this.achievements || '[]')
    } catch {
      return []
    }
  }

  get isCompleted(): boolean {
    return this.progressPercentage >= 100
  }

  get isInProgress(): boolean {
    return this.progressPercentage > 0 && this.progressPercentage < 100
  }

  get isNotStarted(): boolean {
    return this.progressPercentage === 0
  }

  get progressLevel(): string {
    if (this.progressPercentage >= 100) return 'Completed'
    if (this.progressPercentage >= 75) return 'Almost Done'
    if (this.progressPercentage >= 50) return 'Halfway'
    if (this.progressPercentage >= 25) return 'Getting Started'
    if (this.progressPercentage > 0) return 'Just Started'
    return 'Not Started'
  }

  get progressColor(): string {
    if (this.progressPercentage >= 100) return 'success'
    if (this.progressPercentage >= 75) return 'primary'
    if (this.progressPercentage >= 50) return 'warning'
    if (this.progressPercentage >= 25) return 'secondary'
    if (this.progressPercentage > 0) return 'default'
    return 'default'
  }

  get lastAccessedDate(): Date | null {
    return this.lastAccessedAt ? new Date(this.lastAccessedAt) : null
  }

  get hasCurrentInsight(): boolean {
    return !!this.currentInsightId
  }

  get hasCurrentApplication(): boolean {
    return !!this.currentApplicationId
  }

  get totalCompleted(): number {
    return this.completedInsightsArray.length + this.completedApplicationsArray.length
  }

  get hasAchievements(): boolean {
    return this.achievementsArray.length > 0
  }

  get hasNotes(): boolean {
    return !!this.notes && this.notes.trim().length > 0
  }
}

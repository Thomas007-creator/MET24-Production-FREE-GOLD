import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24PracticalApplication extends Model {
  static table = 'met24_practical_applications'

  @field('application_id') applicationId!: string
  @field('domain_id') domainId!: string
  @field('application_name') applicationName!: string
  @field('application_description') applicationDescription!: string
  @field('application_type') applicationType!: string
  @field('difficulty_level') difficultyLevel!: number
  @field('estimated_duration_minutes') estimatedDurationMinutes!: number
  @field('materials_needed') materialsNeeded!: string
  @field('metadata') metadata!: string
  @field('last_synced_at') lastSyncedAt!: number
  @field('sync_status') met24SyncStatus!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Helper methods
  get materialsNeededArray(): string[] {
    try {
      return JSON.parse(this.materialsNeeded || '[]')
    } catch {
      return []
    }
  }

  get metadataObject(): Record<string, any> {
    try {
      return JSON.parse(this.metadata || '{}')
    } catch {
      return {}
    }
  }

  get isSynced(): boolean {
    return this.met24SyncStatus === 'synced'
  }

  get isPending(): boolean {
    return this.met24SyncStatus === 'pending'
  }

  get hasError(): boolean {
    return this.met24SyncStatus === 'error'
  }

  get difficultyLevelText(): string {
    switch (this.difficultyLevel) {
      case 1:
      case 2: return 'Beginner'
      case 3:
      case 4: return 'Easy'
      case 5:
      case 6: return 'Intermediate'
      case 7:
      case 8: return 'Advanced'
      case 9:
      case 10: return 'Expert'
      default: return 'Unknown'
    }
  }

  get difficultyLevelColor(): string {
    switch (this.difficultyLevel) {
      case 1:
      case 2: return 'success'
      case 3:
      case 4: return 'primary'
      case 5:
      case 6: return 'warning'
      case 7:
      case 8: return 'secondary'
      case 9:
      case 10: return 'danger'
      default: return 'default'
    }
  }

  get estimatedDurationText(): string {
    if (this.estimatedDurationMinutes < 60) {
      return `${this.estimatedDurationMinutes} min`
    } else {
      const hours = Math.floor(this.estimatedDurationMinutes / 60)
      const minutes = this.estimatedDurationMinutes % 60
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
  }

  get applicationTypeIcon(): string {
    switch (this.applicationType.toLowerCase()) {
      case 'routine': return '🔄'
      case 'oefening': return '💪'
      case 'workshop': return '🎯'
      case 'planning': return '📋'
      case 'sessie': return '⏰'
      default: return '📝'
    }
  }
}

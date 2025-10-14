import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24NewInsight extends Model {
  static table = 'met24_new_insights'

  @field('insight_id') insightId!: string
  @field('domain_id') domainId!: string
  @field('insight_title') insightTitle!: string
  @field('insight_description') insightDescription!: string
  @field('insight_type') insightType!: string
  @field('evidence_level') evidenceLevel!: number
  @field('source_reference') sourceReference!: string
  @field('metadata') metadata!: string
  @field('last_synced_at') lastSyncedAt!: number
  @field('sync_status') met24SyncStatus!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Helper methods
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

  get evidenceLevelText(): string {
    switch (this.evidenceLevel) {
      case 5: return 'Very High Evidence'
      case 4: return 'High Evidence'
      case 3: return 'Moderate Evidence'
      case 2: return 'Low Evidence'
      case 1: return 'Very Low Evidence'
      default: return 'Unknown Evidence'
    }
  }

  get evidenceLevelColor(): string {
    switch (this.evidenceLevel) {
      case 5: return 'success'
      case 4: return 'primary'
      case 3: return 'warning'
      case 2: return 'secondary'
      case 1: return 'default'
      default: return 'default'
    }
  }

  get insightTypeIcon(): string {
    switch (this.insightType.toLowerCase()) {
      case 'neurowetenschappelijk': return '🧠'
      case 'sociaal-psychologisch': return '👥'
      case 'ontwikkelingspsychologisch': return '🌱'
      case 'onderwijskundig': return '📚'
      case 'cognitief-psychologisch': return '💭'
      default: return '💡'
    }
  }
}


import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24DomainRelation extends Model {
  static table = 'met24_domain_relations'

  @field('relation_id') relationId!: string
  @field('source_domain_id') sourceDomainId!: string
  @field('target_domain_id') targetDomainId!: string
  @field('relation_type') relationType!: string
  @field('relation_strength') relationStrength!: number
  @field('relation_description') relationDescription!: string
  @field('bidirectional') bidirectional!: boolean
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

  get strengthLevel(): string {
    if (this.relationStrength >= 8) return 'Very Strong'
    if (this.relationStrength >= 6) return 'Strong'
    if (this.relationStrength >= 4) return 'Moderate'
    if (this.relationStrength >= 2) return 'Weak'
    return 'Very Weak'
  }

  get strengthColor(): string {
    if (this.relationStrength >= 8) return 'danger'
    if (this.relationStrength >= 6) return 'warning'
    if (this.relationStrength >= 4) return 'primary'
    if (this.relationStrength >= 2) return 'secondary'
    return 'default'
  }
}

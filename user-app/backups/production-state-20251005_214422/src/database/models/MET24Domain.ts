import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24Domain extends Model {
  static table = 'met24_domains'

  @field('domain_id') domainId!: string
  @field('domain_number') domainNumber!: number
  @field('domain_name') domainName!: string
  @field('domain_description') domainDescription!: string
  @field('philosophical_level') philosophicalLevel!: string
  @field('practical_applications') practicalApplications!: string
  @field('theoretical_framework') theoreticalFramework!: string
  @field('metadata') metadata!: string
  @field('last_synced_at') lastSyncedAt!: number
  @field('sync_status') met24SyncStatus!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Helper methods
  get practicalApplicationsArray(): string[] {
    try {
      return JSON.parse(this.practicalApplications || '[]')
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
}

import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24ServerSyncStatus extends Model {
  static table = 'met24_server_sync_status'

  @field('user_id') userId!: string
  @field('last_full_sync') lastFullSync!: number
  @field('last_incremental_sync') lastIncrementalSync!: number
  @field('sync_frequency') syncFrequency!: string
  @field('auto_sync_enabled') autoSyncEnabled!: boolean
  @field('sync_conflicts') syncConflicts!: string
  @field('server_version') serverVersion!: string
  @field('client_version') clientVersion!: string

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Helper methods
  get syncConflictsArray(): any[] {
    try {
      return JSON.parse(this.syncConflicts || '[]')
    } catch {
      return []
    }
  }

  get hasConflicts(): boolean {
    return this.syncConflictsArray.length > 0
  }

  get lastFullSyncDate(): Date | null {
    return this.lastFullSync ? new Date(this.lastFullSync) : null
  }

  get lastIncrementalSyncDate(): Date | null {
    return this.lastIncrementalSync ? new Date(this.lastIncrementalSync) : null
  }

  get lastSyncDate(): Date | null {
    const fullSync = this.lastFullSyncDate
    const incrementalSync = this.lastIncrementalSyncDate
    
    if (!fullSync && !incrementalSync) return null
    if (!fullSync) return incrementalSync
    if (!incrementalSync) return fullSync
    
    return fullSync > incrementalSync ? fullSync : incrementalSync
  }

  get timeSinceLastSync(): number {
    const lastSync = this.lastSyncDate
    return lastSync ? Date.now() - lastSync.getTime() : Infinity
  }

  get isSyncOverdue(): boolean {
    if (!this.autoSyncEnabled) return false
    
    const timeSinceSync = this.timeSinceLastSync
    const syncInterval = this.getSyncInterval()
    
    return timeSinceSync > syncInterval
  }

  get syncInterval(): number {
    return this.getSyncInterval()
  }

  private getSyncInterval(): number {
    switch (this.syncFrequency) {
      case 'manual': return Infinity
      case 'hourly': return 60 * 60 * 1000 // 1 hour
      case 'daily': return 24 * 60 * 60 * 1000 // 24 hours
      case 'weekly': return 7 * 24 * 60 * 60 * 1000 // 7 days
      default: return 24 * 60 * 60 * 1000 // Default to daily
    }
  }

  get syncFrequencyText(): string {
    switch (this.syncFrequency) {
      case 'manual': return 'Manual'
      case 'hourly': return 'Every Hour'
      case 'daily': return 'Daily'
      case 'weekly': return 'Weekly'
      default: return 'Daily'
    }
  }

  get met24SyncStatus(): string {
    if (!this.autoSyncEnabled) return 'Disabled'
    if (this.isSyncOverdue) return 'Overdue'
    if (this.hasConflicts) return 'Conflicts'
    return 'Up to Date'
  }

  get syncStatusColor(): string {
    switch (this.met24SyncStatus) {
      case 'Disabled': return 'default'
      case 'Overdue': return 'danger'
      case 'Conflicts': return 'warning'
      case 'Up to Date': return 'success'
      default: return 'default'
    }
  }

  get needsSync(): boolean {
    return this.autoSyncEnabled && (this.isSyncOverdue || this.hasConflicts)
  }

  get canSync(): boolean {
    return this.autoSyncEnabled
  }

  get syncProgress(): number {
    if (!this.autoSyncEnabled) return 0
    if (this.isSyncOverdue) return 100
    if (this.hasConflicts) return 75
    
    const timeSinceSync = this.timeSinceLastSync
    const syncInterval = this.getSyncInterval()
    const progress = Math.min((timeSinceSync / syncInterval) * 100, 100)
    
    return Math.round(progress)
  }

  get versionInfo(): string {
    return `Client: ${this.clientVersion || 'Unknown'} | Server: ${this.serverVersion || 'Unknown'}`
  }

  get isVersionMismatch(): boolean {
    return this.clientVersion !== this.serverVersion
  }
}

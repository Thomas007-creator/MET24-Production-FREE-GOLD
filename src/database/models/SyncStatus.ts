import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class SyncStatus extends Model {
  static table = 'sync_status'

  @field('table_name') tableName!: string
  @field('record_id') recordId!: string
  @field('last_synced') lastSynced!: number | null
  @field('sync_status') status!: string
  @field('error_message') errorMessage!: string | null
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get formattedLastSynced() {
    return this.lastSynced ? new Date(this.lastSynced).toLocaleString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'Nog niet gesynchroniseerd'
  }

  get isPending() {
    return this.status === 'pending'
  }

  get isSynced() {
    return this.status === 'synced'
  }

  get hasError() {
    return this.status === 'error'
  }

  get statusIcon() {
    const icons = {
      'pending': '⏳',
      'synced': '✅',
      'error': '❌'
    }
    return icons[this.status as keyof typeof icons] || '❓'
  }

  async markAsSynced() {
    await this.update(status => {
      status.status = 'synced'
      status.lastSynced = Date.now()
      status.errorMessage = null
      status.updatedAt = new Date()
    })
  }

  async markAsError(errorMessage: string) {
    await this.update(status => {
      status.status = 'error'
      status.errorMessage = errorMessage
      status.updatedAt = new Date()
    })
  }

  async markAsPending() {
    await this.update(status => {
      status.status = 'pending'
      status.errorMessage = null
      status.updatedAt = new Date()
    })
  }
}

import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MET24SyncQueue extends Model {
  static table = 'met24_sync_queue'

  @field('sync_id') syncId!: string
  @field('user_id') userId!: string
  @field('table_name') tableName!: string
  @field('record_id') recordId!: string
  @field('operation') operation!: string
  @field('data') data!: string
  @field('status') status!: string
  @field('retry_count') retryCount!: number
  @field('error_message') errorMessage!: string
  @field('scheduled_at') scheduledAt!: number
  @field('last_attempt_at') lastAttemptAt!: number

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  // Helper methods
  get dataObject(): any {
    try {
      return JSON.parse(this.data || '{}')
    } catch {
      return {}
    }
  }

  get isPending(): boolean {
    return this.status === 'pending'
  }

  get isSyncing(): boolean {
    return this.status === 'syncing'
  }

  get isCompleted(): boolean {
    return this.status === 'completed'
  }

  get isFailed(): boolean {
    return this.status === 'failed'
  }

  get canRetry(): boolean {
    return this.isFailed && this.retryCount < 3
  }

  get shouldRetry(): boolean {
    return this.canRetry && this.isScheduledForRetry
  }

  get isScheduledForRetry(): boolean {
    return this.scheduledAt <= Date.now()
  }

  get statusColor(): string {
    switch (this.status) {
      case 'pending': return 'warning'
      case 'syncing': return 'primary'
      case 'completed': return 'success'
      case 'failed': return 'danger'
      default: return 'default'
    }
  }

  get statusText(): string {
    switch (this.status) {
      case 'pending': return 'Pending'
      case 'syncing': return 'Syncing'
      case 'completed': return 'Completed'
      case 'failed': return 'Failed'
      default: return 'Unknown'
    }
  }

  get operationText(): string {
    switch (this.operation) {
      case 'create': return 'Create'
      case 'update': return 'Update'
      case 'delete': return 'Delete'
      default: return this.operation
    }
  }

  get lastAttemptDate(): Date | null {
    return this.lastAttemptAt ? new Date(this.lastAttemptAt) : null
  }

  get scheduledDate(): Date | null {
    return this.scheduledAt ? new Date(this.scheduledAt) : null
  }

  get hasError(): boolean {
    return !!this.errorMessage && this.errorMessage.trim().length > 0
  }

  get retryDelay(): number {
    // Exponential backoff: 1min, 5min, 15min
    const delays = [60000, 300000, 900000]
    return delays[Math.min(this.retryCount, delays.length - 1)]
  }

  get nextRetryTime(): number {
    return this.lastAttemptAt + this.retryDelay
  }
}

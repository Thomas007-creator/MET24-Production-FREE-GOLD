import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MbtiContent extends Model {
  static table = 'mbti_contents';

  @field('mbti_type') mbtiType!: string;
  @field('kind') kind!: string;
  @field('order_idx') orderIdx!: number;
  @field('content') content?: string;
  @field('migration_seed') migrationSeed?: string;
  @field('seed_immutable') seedImmutable!: boolean;
  @field('local_edited') localEdited!: boolean;
  @field('edited_by') editedBy?: string;
  @field('last_synced_at') lastSyncedAt?: string;
  @field('seed_conflict') seedConflict!: boolean;
  @field('upstream_changed') upstreamChanged!: boolean;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Helper methods
  get contentData() {
    try {
      return this.content ? JSON.parse(this.content) : {};
    } catch (error) {
      console.error('Error parsing content data:', error);
      return {};
    }
  }

  set contentData(data: any) {
    this.content = JSON.stringify(data);
  }

  get hasConflict() {
    return this.seedConflict || this.upstreamChanged;
  }

  get isImmutable() {
    return this.seedImmutable;
  }

  get isLocallyEdited() {
    return this.localEdited;
  }

  get uniqueKey() {
    return `${this.mbtiType}-${this.kind}-${this.orderIdx}`;
  }

  get isSynced() {
    return !!this.lastSyncedAt && !this.hasConflict;
  }
}

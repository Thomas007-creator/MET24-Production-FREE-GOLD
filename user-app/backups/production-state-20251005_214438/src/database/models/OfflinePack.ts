import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class OfflinePack extends Model {
  static table = 'offline_packs';

  @field('user_id') userId!: string;
  @field('pack_name') packName!: string;
  @field('pack_type') packType!: string; // 'mbti_specific', 'topic_based', 'curated'
  @field('mbti_type') mbtiType!: string | null;
  @field('item_ids') itemIds!: string; // JSON array van content item IDs
  @field('pack_size') packSize!: number; // bytes
  @field('download_status') downloadStatus!: string; // 'pending', 'downloading', 'completed', 'failed'
  @field('created_at') createdAt!: number;
  @field('downloaded_at') downloadedAt!: number | null;
  @field('updated_at') updatedAt!: number;

  // Helper getters
  get itemIdsArray(): string[] {
    try {
      return JSON.parse(this.itemIds || '[]');
    } catch {
      return [];
    }
  }

  get isDownloaded(): boolean {
    return this.downloadStatus === 'completed' && this.downloadedAt !== null;
  }

  get isDownloading(): boolean {
    return this.downloadStatus === 'downloading';
  }

  get hasFailed(): boolean {
    return this.downloadStatus === 'failed';
  }

  get packSizeFormatted(): string {
    const bytes = this.packSize;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}

export default OfflinePack;

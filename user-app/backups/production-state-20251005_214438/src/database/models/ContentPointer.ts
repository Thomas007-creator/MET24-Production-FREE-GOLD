import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class ContentPointer extends Model {
  static table = 'content_pointers';

  @field('item_id') itemId!: string;
  @field('user_id') userId!: string;
  @field('downloaded_at') downloadedAt!: number | null;
  @field('last_viewed_at') lastViewedAt!: number | null;
  @field('is_favorite') isFavorite!: boolean;
  @field('progress') progress!: number; // 0-100 percentage
  @field('rating') rating!: number | null; // 1-5 stars
  @field('notes') notes!: string | null;
  @field('created_at') createdAt!: number;
  @field('updated_at') updatedAt!: number;

  // Helper getters
  get isDownloaded(): boolean {
    return this.downloadedAt !== null;
  }

  get hasBeenViewed(): boolean {
    return this.lastViewedAt !== null;
  }

  get progressPercentage(): number {
    return Math.max(0, Math.min(100, this.progress));
  }
}

export default ContentPointer;

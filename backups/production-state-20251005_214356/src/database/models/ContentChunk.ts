import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class ContentChunk extends Model {
  static table = 'content_chunks';

  @field('content_item_id') contentItemId!: string;
  @field('chunk_index') chunkIndex!: number;
  @field('text') text!: string;
  @field('chunk_type') chunkType!: string; // 'text', 'image', 'video', 'audio'
  @field('metadata') metadata!: string | null; // JSON metadata
  @field('created_at') createdAt!: number;
  @field('updated_at') updatedAt!: number;

  // Helper getters
  get metadataObject(): any {
    try {
      return JSON.parse(this.metadata || '{}');
    } catch {
      return {};
    }
  }
}

export default ContentChunk;

import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ContentChunk extends Model {
  static table = 'content_chunks';

  @field('content_item_id') contentItemId!: string;
  @field('chunk_data') chunkData!: string; // JSON string
  @field('chunk_order') chunkOrder!: number;
  @field('is_processed') isProcessed!: boolean;
  @field('processing_status') processingStatus!: string | null;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
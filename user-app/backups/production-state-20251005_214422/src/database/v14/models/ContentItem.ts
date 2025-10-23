import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ContentItem extends Model {
  static table = 'content_items';

  @field('title') title!: string;
  @field('content_type') contentType!: string;
  @field('content_data') contentData!: string; // JSON string
  @field('is_published') isPublished!: boolean;
  @field('published_at') publishedAt!: string | null; // ISO date string
  @field('tags') tags!: string | null; // JSON string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
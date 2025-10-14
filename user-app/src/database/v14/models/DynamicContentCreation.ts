import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class DynamicContentCreation extends Model {
  static table = 'dynamic_content_creations';

  @field('user_id') userId!: string;
  @field('content_type') contentType!: string;
  @field('content_data') contentData!: string; // JSON string
  @field('generation_prompt') generationPrompt!: string;
  @field('is_published') isPublished!: boolean;
  @field('generated_at') generatedAt!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
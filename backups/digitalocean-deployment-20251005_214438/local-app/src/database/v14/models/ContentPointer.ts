import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ContentPointer extends Model {
  static table = 'content_pointers';

  @field('user_id') userId!: string;
  @field('content_id') contentId!: string;
  @field('pointer_type') pointerType!: string;
  @field('position') position!: number;
  @field('last_accessed') lastAccessed!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
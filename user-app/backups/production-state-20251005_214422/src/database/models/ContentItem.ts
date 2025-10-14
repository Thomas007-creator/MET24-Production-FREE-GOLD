import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

class ContentItem extends Model {
  static table = 'content_items';

  @field('type') type!: string; // 'article', 'video', 'podcast', 'course'
  @field('title') title!: string;
  @field('url') url!: string;
  @field('summary') summary!: string;
  @field('mbti_relevance') mbtiRelevance!: string; // JSON array van MBTI types
  @field('duration') duration!: number; // seconden
  @field('tags') tags!: string; // JSON array van tags
  @field('difficulty_level') difficultyLevel!: string; // 'beginner', 'intermediate', 'advanced'
  @field('content_encrypted') contentEncrypted!: string | null;
  @field('content_encrypted_key_id') contentEncryptedKeyId!: string | null;
  @field('embedding_data') embeddingData!: string | null; // Base64 encoded vector
  @field('source_id') sourceId!: string | null;
  @field('created_at') createdAt!: number;
  @field('updated_at') updatedAt!: number;

  // Helper getters
  get mbtiRelevanceArray(): string[] {
    try {
      return JSON.parse(this.mbtiRelevance || '[]');
    } catch {
      return [];
    }
  }

  get tagsArray(): string[] {
    try {
      return JSON.parse(this.tags || '[]');
    } catch {
      return [];
    }
  }

  isRelevantForMBTI(mbtiType: string): boolean {
    return this.mbtiRelevanceArray.includes(mbtiType);
  }
}

export default ContentItem;

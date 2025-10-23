import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class OfflineAIModel extends Model {
  static table = 'offline_ai_models';

  @field('model_name') modelName!: string;
  @field('model_version') modelVersion!: string;
  @field('model_data') modelData!: string; // JSON string
  @field('is_downloaded') isDownloaded!: boolean;
  @field('file_size') fileSize!: number | null;
  @field('last_updated') lastUpdated!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
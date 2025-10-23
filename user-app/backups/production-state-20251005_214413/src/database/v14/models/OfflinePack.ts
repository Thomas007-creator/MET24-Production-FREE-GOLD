import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class OfflinePack extends Model {
  static table = 'offline_packs';

  @field('pack_name') packName!: string;
  @field('pack_data') packData!: string; // JSON string
  @field('is_downloaded') isDownloaded!: boolean;
  @field('file_size') fileSize!: number | null;
  @field('download_progress') downloadProgress!: number;
  @field('last_updated') lastUpdated!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
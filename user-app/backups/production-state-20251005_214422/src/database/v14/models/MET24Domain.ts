import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MET24Domain extends Model {
  static table = 'met24_domains';

  @field('domain_name') domainName!: string;
  @field('domain_type') domainType!: string;
  @field('domain_data') domainData!: string; // JSON string
  @field('is_active') isActive!: boolean;
  @field('last_updated') lastUpdated!: string; // ISO date string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
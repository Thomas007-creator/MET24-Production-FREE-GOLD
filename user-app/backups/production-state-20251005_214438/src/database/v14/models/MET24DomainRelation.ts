import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class MET24DomainRelation extends Model {
  static table = 'met24_domain_relations';

  @field('source_domain_id') sourceDomainId!: string;
  @field('target_domain_id') targetDomainId!: string;
  @field('relation_type') relationType!: string;
  @field('relation_data') relationData!: string; // JSON string
  @field('strength') strength!: number;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class ExternalAIService extends Model {
  static table = 'external_ai_services';

  @field('service_name') serviceName!: string;
  @field('service_type') serviceType!: string;
  @field('api_endpoint') apiEndpoint!: string;
  @field('is_active') isActive!: boolean;
  @field('last_health_check') lastHealthCheck!: string | null; // ISO date string
  @field('response_time_ms') responseTimeMs!: number | null;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
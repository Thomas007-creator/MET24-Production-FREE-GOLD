import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AIServiceHealthMonitoring extends Model {
  static table = 'ai_service_health_monitoring';

  @field('service_name') serviceName!: string;
  @field('health_status') healthStatus!: string;
  @field('response_time_ms') responseTimeMs!: number | null;
  @field('error_count') errorCount!: number;
  @field('last_check') lastCheck!: string; // ISO date string
  @field('monitoring_data') monitoringData!: string | null; // JSON string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
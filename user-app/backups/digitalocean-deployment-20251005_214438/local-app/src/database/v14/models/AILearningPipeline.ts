import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class AILearningPipeline extends Model {
  static table = 'ai_learning_pipelines';

  @field('user_id') userId!: string;
  @field('pipeline_name') pipelineName!: string;
  @field('pipeline_config') pipelineConfig!: string; // JSON string
  @field('status') status!: string;
  @field('last_run') lastRun!: string | null; // ISO date string
  @field('performance_metrics') performanceMetrics!: string | null; // JSON string
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
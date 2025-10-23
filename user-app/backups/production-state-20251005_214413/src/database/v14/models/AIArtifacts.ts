import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

/**
 * AI Artifacts Model - WatermelonDB V14
 * 
 * Model voor AI-gegenereerde content uit Supabase ai_artifacts tabel
 * 
 * @version 14.0.0
 * @author Thomas
 */
export default class AIArtifacts extends Model {
  static table = 'ai_artifacts';

  // Basis identificatie
  @field('job_id') jobId!: string;
  @field('origin') origin!: string;
  @field('agent') agent!: string;
  @field('model') model!: string;
  @field('model_version') modelVersion!: string;
  @field('prompt_hash') promptHash!: string;

  // Content data
  @field('content') content!: string; // JSON string van content object
  @field('provenance') provenance!: string; // JSON string van provenance object
  @field('moderation_status') moderationStatus!: string;

  // Metadata
  @field('mbti_type') mbtiType!: string | null;
  @field('user_id') userId!: string | null;
  @field('session_id') sessionId!: string | null;
  @field('quality_score') qualityScore!: number | null;
  @field('tokens_used') tokensUsed!: number | null;

  // Sync en status
  @field('sync_status') artifactSyncStatus!: string; // 'pending', 'synced', 'error'
  @field('last_synced_at') lastSyncedAt!: number | null;
  @field('sync_error') syncError!: string | null;

  // Auditing
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  @field('created_by') createdBy!: string;

  // Helper getters
  get contentObject(): any {
    try {
      return JSON.parse(this.content || '{}');
    } catch {
      return {};
    }
  }

  get provenanceObject(): any {
    try {
      return JSON.parse(this.provenance || '{}');
    } catch {
      return {};
    }
  }

  get isApproved(): boolean {
    return this.moderationStatus === 'approved';
  }

  get isPending(): boolean {
    return this.moderationStatus === 'pending';
  }

  get isRejected(): boolean {
    return this.moderationStatus === 'rejected';
  }

  get isSynced(): boolean {
    return this.artifactSyncStatus === 'synced';
  }

  get hasSyncError(): boolean {
    return this.artifactSyncStatus === 'error';
  }

  // Helper methods
  getContentText(): string {
    const content = this.contentObject;
    return content.text || content.content || '';
  }

  getContentTitle(): string {
    const content = this.contentObject;
    return content.title || `${this.agent} Content for ${this.mbtiType || 'Unknown'}`;
  }

  getContentSummary(): string {
    const content = this.contentObject;
    return content.summary || content.description || this.getContentText().slice(0, 200) + '...';
  }

  getMBTIRelevance(): string[] {
    if (this.mbtiType) {
      return [this.mbtiType];
    }
    
    const content = this.contentObject;
    if (content.mbti_type) {
      return Array.isArray(content.mbti_type) ? content.mbti_type : [content.mbti_type];
    }
    
    return [];
  }

  getAgentType(): string {
    // Map agent names to types
    const agentMap: Record<string, string> = {
      'ai1_esthetic': 'esthetic',
      'ai2_cognitive': 'cognitive', 
      'ai3_ethical': 'ethical',
      'summarizer': 'summarizer',
      'coach': 'coach'
    };
    
    return agentMap[this.agent] || 'unknown';
  }

  getQualityLevel(): string {
    if (!this.qualityScore) return 'unknown';
    
    if (this.qualityScore >= 0.8) return 'high';
    if (this.qualityScore >= 0.6) return 'medium';
    return 'low';
  }

  // Static helper methods
  static async findByMBTIType(database: any, mbtiType: string): Promise<AIArtifacts[]> {
    return await database.collections.get('ai_artifacts')
      .query()
      .where('mbti_type', mbtiType)
      .fetch();
  }

  static async findByAgent(database: any, agent: string): Promise<AIArtifacts[]> {
    return await database.collections.get('ai_artifacts')
      .query()
      .where('agent', agent)
      .fetch();
  }

  static async findApproved(database: any): Promise<AIArtifacts[]> {
    return await database.collections.get('ai_artifacts')
      .query()
      .where('moderation_status', 'approved')
      .fetch();
  }

  static async findPendingSync(database: any): Promise<AIArtifacts[]> {
    return await database.collections.get('ai_artifacts')
      .query()
      .where('sync_status', 'pending')
      .fetch();
  }

  static async findByJobId(database: any, jobId: string): Promise<AIArtifacts | null> {
    const results = await database.collections.get('ai_artifacts')
      .query()
      .where('job_id', jobId)
      .fetch();
    
    return results.length > 0 ? results[0] : null;
  }
}









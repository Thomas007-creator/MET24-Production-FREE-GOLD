import { Model } from '@nozbe/watermelondb'
import { field, date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class VectorEmbedding extends Model {
  static table = 'vector_embeddings'

  @field('vector_id') vectorId!: string // UUID from PostgreSQL
  @field('content') content!: string
  @field('metadata') metadata!: string // JSON string
  
  // Legacy OpenAI embedding (1536 dimensions)
  @field('embedding_data') embeddingData!: string // Base64 encoded vector data
  @field('embedding_dimension') embeddingDimension!: number // Usually 1536 for OpenAI
  
  // New MPNet L12-v2 embedding (384 dimensions)
  @text('embedding_384') embedding384!: string // JSON string of number[]
  @text('model_name') modelName!: string // 'all-MiniLM-L12-v2' or 'openai-ada-002'
  @field('inference_time_ms') inferenceTimeMs!: number
  @field('quality_score') qualityScore!: number
  
  @field('source_table') sourceTable!: string // 'mbti_profiles', 'chat_messages', etc.
  @field('source_record_id') sourceRecordId!: string // Reference to local record
  @field('user_id') userId!: string
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get parsedMetadata() {
    try {
      return this.metadata ? JSON.parse(this.metadata) : {}
    } catch {
      return {}
    }
  }

  get decodedEmbedding() {
    try {
      return atob(this.embeddingData)
    } catch {
      return null
    }
  }

  get embeddingArray() {
    const decoded = this.decodedEmbedding
    if (!decoded) return null
    
    try {
      // Convert string to ArrayBuffer first
      const buffer = new ArrayBuffer(decoded.length)
      const view = new Uint8Array(buffer)
      for (let i = 0; i < decoded.length; i++) {
        view[i] = decoded.charCodeAt(i)
      }
      return new Float32Array(buffer)
    } catch {
      return null
    }
  }

  // 🚀 New MPNet L12-v2 support methods
  get embeddingVector(): number[] | null {
    // Prefer MPNet L12-v2 embeddings (384 dims)
    if (this.embedding384) {
      try {
        return JSON.parse(this.embedding384);
      } catch (e) {
        console.error('Failed to parse 384-dim embedding:', e);
      }
    }
    
    // Fallback to legacy OpenAI (1536 dims)
    if (this.embeddingData && this.embeddingDimension) {
      try {
        const arrayBuffer = this.embeddingArray;
        return arrayBuffer ? Array.from(arrayBuffer) : null;
      } catch (e) {
        console.error('Failed to parse legacy embedding:', e);
      }
    }
    
    return null;
  }
  
  get preferredEmbedding(): {
    vector: number[];
    model: string;
    dimensions: number;
    inferenceTime?: number;
  } | null {
    if (this.embedding384) {
      try {
        return {
          vector: JSON.parse(this.embedding384),
          model: this.modelName || 'all-MiniLM-L12-v2',
          dimensions: 384,
          inferenceTime: this.inferenceTimeMs
        };
      } catch (e) {
        console.error('Failed to parse MPNet embedding:', e);
      }
    }
    
    if (this.embeddingData) {
      const arrayBuffer = this.embeddingArray;
      if (arrayBuffer) {
        return {
          vector: Array.from(arrayBuffer),
          model: 'openai-ada-002',
          dimensions: this.embeddingDimension || 1536
        };
      }
    }
    
    return null;
  }
  
  setMPNetL12Embedding(result: {
    embedding: number[];
    inferenceTime: number;
    model: string;
  }): void {
    this.embedding384 = JSON.stringify(result.embedding);
    this.modelName = result.model;
    this.inferenceTimeMs = result.inferenceTime;
  }
  
  hasL12Embedding(): boolean {
    return !!this.embedding384 && this.modelName === 'all-MiniLM-L12-v2';
  }
  
  hasMPNetEmbedding(): boolean {
    return !!this.embedding384;
  }

  get isOpenAIEmbedding() {
    return this.embeddingDimension === 1536
  }

  get sourceTableLabel() {
    const labels = {
      'mbti_profiles': 'MBTI Profiel',
      'chat_messages': 'Chat Bericht',
      'journal_entries': 'Dagboek Entry',
      'ai_interactions': 'AI Interactie',
      'ai_action_plans': 'AI Actie Plan',
      'super_insights': 'Super Insight',
      'rewind_sessions': 'Rewind Sessie'
    }
    return labels[this.sourceTable as keyof typeof labels] || 'Onbekend'
  }

  async updateEmbedding(newEmbeddingData: string, newDimension: number) {
    await this.update(embedding => {
      embedding.embeddingData = newEmbeddingData
      embedding.embeddingDimension = newDimension
      embedding.updatedAt = new Date()
    })
  }

  async updateMetadata(newMetadata: any) {
    await this.update(embedding => {
      embedding.metadata = JSON.stringify(newMetadata)
      embedding.updatedAt = new Date()
    })
  }
}
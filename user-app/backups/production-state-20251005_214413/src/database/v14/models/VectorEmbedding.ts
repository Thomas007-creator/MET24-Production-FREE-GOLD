import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class VectorEmbedding extends Model {
  static table = 'vector_embeddings'

  @field('vector_id') vectorId!: string // UUID from PostgreSQL
  @field('content') content!: string
  @field('metadata') metadata!: string // JSON string
  @field('embedding_data') embeddingData!: string // Base64 encoded vector data
  @field('embedding_dimension') embeddingDimension!: number // Usually 1536 for OpenAI
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
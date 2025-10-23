import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class AIInteraction extends Model {
  static table = 'ai_interactions'

  @field('user_id') userId!: string
  @field('prompt') prompt!: string
  @field('response') response!: string
  @field('context_type') contextType!: string
  @field('mbti_type') mbtiType!: string
  @field('session_id') sessionId!: string | null
  // Versie 2: Nieuwe velden
  @field('ai_model') aiModel!: string | null
  @field('tokens_used') tokensUsed!: number | null
  @field('vector_embedding_id') vectorEmbeddingId!: string | null
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get formattedTimestamp() {
    return new Date(this.createdAt).toLocaleString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  get contextTypeLabel() {
    const labels = {
      'imagination': 'Imaginatie Oefening',
      'chat': 'Chat Conversatie',
      'journal': 'Dagboek Reflectie',
      'goal': 'Doel Setting',
      'therapy': 'Therapie Sessie',
      'coaching': 'Coaching Sessie'
    }
    return labels[this.contextType as keyof typeof labels] || 'Onbekend'
  }

  get promptPreview() {
    return this.prompt.length > 50 
      ? this.prompt.substring(0, 50) + '...'
      : this.prompt
  }

  get responsePreview() {
    return this.response.length > 100
      ? this.response.substring(0, 100) + '...'
      : this.response
  }

  get wordCount() {
    return {
      prompt: this.prompt ? this.prompt.split(/\s+/).length : 0,
      response: this.response ? this.response.split(/\s+/).length : 0
    }
  }

  get hasVectorEmbedding() {
    return !!this.vectorEmbeddingId
  }

  get hasTokenUsage() {
    return !!this.tokensUsed
  }

  async updateInteraction(updates: Partial<{prompt: string; response: string; contextType: string; mbtiType: string; sessionId: string | null; aiModel: string | null; tokensUsed: number | null;}>) {
    await this.update(interaction => {
      Object.assign(interaction, updates)
      interaction.updatedAt = new Date()
    })
  }

  async setVectorEmbedding(vectorId: string) {
    await this.update(interaction => {
      interaction.vectorEmbeddingId = vectorId
      interaction.updatedAt = new Date()
    })
  }

  async setTokenUsage(tokens: number) {
    await this.update(interaction => {
      interaction.tokensUsed = tokens
      interaction.updatedAt = new Date()
    })
  }
}
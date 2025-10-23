
import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class ChatMessage extends Model {
  static table = 'chat_messages'

  @field('user_id') userId!: string
  @field('message') message!: string
  @field('response') response!: string
  @field('is_user') isUser!: boolean
  @field('timestamp') timestamp!: number
  @field('mbti_context') mbtiContext!: string | null
  @field('session_id') sessionId!: string | null
  @field('vector_embedding_id') vectorEmbeddingId!: string | null
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get formattedTimestamp() {
    return new Date(this.timestamp).toLocaleString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  get isFromUser() {
    return this.isUser === true
  }

  get isFromAI() {
    return this.isUser === false
  }

  get hasVectorEmbedding() {
    return !!this.vectorEmbeddingId
  }

  async markAsRead() {
    await this.update(message => {
      message.updatedAt = new Date()
    })
  }

  async setVectorEmbedding(vectorId: string) {
    await this.update(message => {
      message.vectorEmbeddingId = vectorId
      message.updatedAt = new Date()
    })
  }
}

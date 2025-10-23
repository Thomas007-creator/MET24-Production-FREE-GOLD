import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class JournalEntry extends Model {
  static table = 'journal_entries'

  @field('user_id') userId!: string
  @field('title') title!: string
  @field('content') content!: string
  @field('mood_rating') moodRating!: number
  @field('tags') tags!: string
  @field('date') date!: number
  // Versie 2: Nieuwe velden
  @field('ai_insights') aiInsights!: string | null
  @field('vector_embedding_id') vectorEmbeddingId!: string | null
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get formattedDate() {
    return new Date(this.date).toLocaleDateString('nl-NL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  get parsedTags() {
    try {
      return this.tags ? JSON.parse(this.tags) : []
    } catch {
      return []
    }
  }

  get moodEmoji() {
    const moodEmojis = {
      1: '😢',
      2: '😔',
      3: '😐',
      4: '😊',
      5: '😃'
    }
    return moodEmojis[this.moodRating as keyof typeof moodEmojis] || '😐'
  }

  get wordCount() {
    return this.content ? this.content.split(/\s+/).length : 0
  }

  get hasAIInsights() {
    return !!this.aiInsights
  }

  get hasVectorEmbedding() {
    return !!this.vectorEmbeddingId
  }

  async updateEntry(updates: Partial<{title: string; content: string; moodRating: number; tags: string; date: number; aiInsights: string | null;}>) {
    await this.update(entry => {
      Object.assign(entry, updates)
      entry.updatedAt = new Date()
    })
  }

  async addTag(tag: string) {
    const currentTags = this.parsedTags
    if (!currentTags.includes(tag)) {
      currentTags.push(tag)
      await this.update(entry => {
        entry.tags = JSON.stringify(currentTags)
        entry.updatedAt = new Date()
      })
    }
  }

  async removeTag(tag: string) {
    const currentTags = this.parsedTags
    const newTags = currentTags.filter((t: string) => t !== tag)
    await this.update(entry => {
      entry.tags = JSON.stringify(newTags)
      entry.updatedAt = new Date()
    })
  }

  async setAIInsights(insights: string) {
    await this.update(entry => {
      entry.aiInsights = insights
      entry.updatedAt = new Date()
    })
  }

  async setVectorEmbedding(vectorId: string) {
    await this.update(entry => {
      entry.vectorEmbeddingId = vectorId
      entry.updatedAt = new Date()
    })
  }
}

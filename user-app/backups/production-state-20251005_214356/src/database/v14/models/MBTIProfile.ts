import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class MBTIProfile extends Model {
  static table = 'mbti_profiles'

  @field('user_id') userId!: string
  @field('mbti_type') mbtiType!: string
  @field('profile_data') profileData!: string // JSON string met complete MBTI data
  @field('strengths') strengths!: string | null // JSON array
  @field('weaknesses') weaknesses!: string | null // JSON array
  @field('career_paths') careerPaths!: string | null // JSON array
  @field('relationship_insights') relationshipInsights!: string | null // JSON object
  @field('growth_areas') growthAreas!: string | null // JSON array
  @field('communication_style') communicationStyle!: string | null
  @field('stress_triggers') stressTriggers!: string | null // JSON array
  @field('coping_strategies') copingStrategies!: string | null // JSON array
  @field('vector_embedding_id') vectorEmbeddingId!: string | null
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods
  get parsedProfileData() {
    try {
      return this.profileData ? JSON.parse(this.profileData) : {}
    } catch {
      return {}
    }
  }

  get parsedStrengths() {
    try {
      return this.strengths ? JSON.parse(this.strengths) : []
    } catch {
      return []
    }
  }

  get parsedWeaknesses() {
    try {
      return this.weaknesses ? JSON.parse(this.weaknesses) : []
    } catch {
      return []
    }
  }

  get parsedCareerPaths() {
    try {
      return this.careerPaths ? JSON.parse(this.careerPaths) : []
    } catch {
      return []
    }
  }

  get parsedRelationshipInsights() {
    try {
      return this.relationshipInsights ? JSON.parse(this.relationshipInsights) : {}
    } catch {
      return {}
    }
  }

  get parsedGrowthAreas() {
    try {
      return this.growthAreas ? JSON.parse(this.growthAreas) : []
    } catch {
      return []
    }
  }

  get parsedStressTriggers() {
    try {
      return this.stressTriggers ? JSON.parse(this.stressTriggers) : []
    } catch {
      return []
    }
  }

  get parsedCopingStrategies() {
    try {
      return this.copingStrategies ? JSON.parse(this.copingStrategies) : []
    } catch {
      return []
    }
  }

  get hasVectorEmbedding() {
    return !!this.vectorEmbeddingId
  }

  get mbtiDescription() {
    const descriptions = {
      'INTJ': 'The Architect - Strategic and innovative thinkers',
      'INTP': 'The Thinker - Flexible and charming',
      'ENTJ': 'The Commander - Bold and imaginative leaders',
      'ENTP': 'The Debater - Smart and curious thinkers',
      'INFJ': 'The Advocate - Creative and insightful',
      'INFP': 'The Mediator - Poetic and kind souls',
      'ENFJ': 'The Protagonist - Charismatic and inspiring leaders', 
      'ENFP': 'The Campaigner - Enthusiastic and creative',
      'ISTJ': 'The Logistician - Practical and fact-minded',
      'ISFJ': 'The Protector - Warm-hearted and dedicated',
      'ESTJ': 'The Executive - Excellent administrators',
      'ESFJ': 'The Consul - Extraordinarily caring and social',
      'ISTP': 'The Virtuoso - Bold and practical experimenters',
      'ISFP': 'The Adventurer - Flexible and charming artists',
      'ESTP': 'The Entrepreneur - Smart and energetic',
      'ESFP': 'The Entertainer - Spontaneous and enthusiastic'
    }
    return descriptions[this.mbtiType as keyof typeof descriptions] || 'Unknown type'
  }

  async updateProfile(updates: Partial<{
    profileData: string;
    strengths: string | null;
    weaknesses: string | null;
    careerPaths: string | null;
    relationshipInsights: string | null;
    growthAreas: string | null;
    communicationStyle: string | null;
    stressTriggers: string | null;
    copingStrategies: string | null;
  }>) {
    await this.update(profile => {
      Object.assign(profile, updates)
      profile.updatedAt = new Date()
    })
  }

  async setVectorEmbedding(vectorId: string) {
    await this.update(profile => {
      profile.vectorEmbeddingId = vectorId
      profile.updatedAt = new Date()
    })
  }

  async addStrength(strength: string) {
    const currentStrengths = this.parsedStrengths
    if (!currentStrengths.includes(strength)) {
      currentStrengths.push(strength)
      await this.update(profile => {
        profile.strengths = JSON.stringify(currentStrengths)
        profile.updatedAt = new Date()
      })
    }
  }

  async addGrowthArea(area: string) {
    const currentAreas = this.parsedGrowthAreas
    if (!currentAreas.includes(area)) {
      currentAreas.push(area)
      await this.update(profile => {
        profile.growthAreas = JSON.stringify(currentAreas)
        profile.updatedAt = new Date()
      })
    }
  }
}
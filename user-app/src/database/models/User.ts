import { Model } from '@nozbe/watermelondb'
import { field, date, readonly } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = 'users'

  // Versie 1 velden (altijd aanwezig)
  @field('name') name!: string
  @field('mbti_type') mbtiType!: string
  @field('avatar_url') avatarUrl!: string | null
  @field('premium_status') premiumStatus!: boolean
  @field('dark_mode') darkMode!: boolean
  @field('voice_enabled') voiceEnabled!: boolean

  // Versie 2 velden (nieuwe MET2.4 Freemium - krijgen defaults)
  @field('subscription_tier') subscriptionTier!: string | null // default: 'free'
  @field('subscription_expires_at') subscriptionExpiresAt!: number | null
  @field('subscription_status') subscriptionStatus!: string | null // default: 'active'

  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  // Helper methods met backward compatibility
  get isUserPremium() {
    // Versie 1: gebruik premiumStatus
    if (this.premiumStatus === true) return true
    
    // Versie 2: gebruik subscriptionTier
    const tier = this.subscriptionTier || 'free'
    return tier === 'gold' || tier === 'developer'
  }

  get isDeveloper() {
    return this.subscriptionTier === 'developer'
  }

  get isGold() {
    return this.subscriptionTier === 'gold'
  }

  get isFree() {
    const tier = this.subscriptionTier || 'free'
    return tier === 'free'
  }

  get subscriptionIsActive() {
    const status = this.subscriptionStatus || 'active'
    if (status !== 'active') return false
    if (!this.subscriptionExpiresAt) return true
    return this.subscriptionExpiresAt > Date.now()
  }

  get fullMbtiInfo() {
    const mbtiDescriptions = {
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
    
    return {
      type: this.mbtiType,
      description: mbtiDescriptions[this.mbtiType as keyof typeof mbtiDescriptions] || 'Unknown type'
    }
  }

  async updateProfile(updates: Partial<{
    name: string;
    mbtiType: string;
    avatarUrl: string | null;
    premiumStatus: boolean;
    darkMode: boolean;
    voiceEnabled: boolean;
    subscriptionTier: string;
    subscriptionExpiresAt: number | null;
    subscriptionStatus: string;
  }>) {
    await this.update(user => {
      Object.assign(user, updates)
      user.updatedAt = new Date()
    })
  }

  async upgradeToGold() {
    await this.updateProfile({
      subscriptionTier: 'gold',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      premiumStatus: true // Backward compatibility
    })
  }

  async upgradeToDeveloper() {
    await this.updateProfile({
      subscriptionTier: 'developer',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: null, // No expiration for developer
      premiumStatus: true // Backward compatibility
    })
  }

  async downgradeToFree() {
    await this.updateProfile({
      subscriptionTier: 'free',
      subscriptionStatus: 'expired',
      subscriptionExpiresAt: null,
      premiumStatus: false // Backward compatibility
    })
  }

  // Migration helper voor versie 1 naar 2
  async migrateToVersion2() {
    if (!this.subscriptionTier) {
      await this.updateProfile({
        subscriptionTier: this.premiumStatus ? 'gold' : 'free',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: null
      })
    }
  }
}

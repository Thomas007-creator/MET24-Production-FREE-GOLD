/**
 * User Model - WatermelonDB V14
 * 
 * Model class voor users tabel
 * Bevat alle user data en helper methods
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class User extends Model {
  static table = "users";

  // Basis informatie
  @field("name") name!: string;
  @field("email") email!: string;
  @field("avatar_url") avatarUrl?: string;
  
  // MBTI informatie
  @field("mbti_type") mbtiType!: string;
  
  // Premium status
  @field("premium_status") premiumStatus!: boolean;
  @field("subscription_tier") subscriptionTier?: string;
  @field("subscription_expires_at") subscriptionExpiresAt?: number;
  @field("subscription_status") subscriptionStatus?: string;
  
  // App voorkeuren
  @field("dark_mode") darkMode!: boolean;
  @field("voice_enabled") voiceEnabled!: boolean;
  @field("language") language?: string;
  @field("timezone") timezone?: string;
  
  // Profiel informatie
  @field("bio") bio?: string;
  @field("location") location?: string;
  @field("website") website?: string;
  @field("privacy_level") privacyLevel?: string;
  
  // Auditing
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("created_by") createdBy!: string;
  
  // Toekomstige uitbreidingen
  @field("metadata") metadata?: string;

  // Helper methods
  get isPremium(): boolean {
    return this.premiumStatus || this.subscriptionTier === 'premium' || this.subscriptionTier === 'gold' || this.subscriptionTier === 'platinum';
  }

  get isGold(): boolean {
    return this.subscriptionTier === 'gold' || this.subscriptionTier === 'platinum';
  }

  get isPlatinum(): boolean {
    return this.subscriptionTier === 'platinum';
  }

  get isFree(): boolean {
    return !this.isPremium;
  }

  get subscriptionIsActive(): boolean {
    if (!this.subscriptionExpiresAt) return true;
    return this.subscriptionExpiresAt > Date.now();
  }

  get fullMbtiInfo(): { type: string; description: string } {
    const mbtiDescriptions: { [key: string]: string } = {
      'INTJ': 'The Architect - Imaginative and strategic thinkers',
      'INTP': 'The Thinker - Innovative inventors with an unquenchable thirst for knowledge',
      'ENTJ': 'The Commander - Bold, imaginative and strong-willed leaders',
      'ENTP': 'The Debater - Smart and curious thinkers who cannot resist an intellectual challenge',
      'INFJ': 'The Advocate - Creative and insightful, inspired and independent perfectionists',
      'INFP': 'The Mediator - Poetic, kind and altruistic people, always eager to help a good cause',
      'ENFJ': 'The Protagonist - Charismatic and inspiring leaders, able to mesmerize their listeners',
      'ENFP': 'The Campaigner - Enthusiastic, creative and sociable free spirits',
      'ISTJ': 'The Logistician - Practical and fact-minded, reliable and responsible',
      'ISFJ': 'The Protector - Very dedicated and warm protectors, always ready to defend their loved ones',
      'ESTJ': 'The Executive - Excellent administrators, unsurpassed at managing things or people',
      'ESFJ': 'The Consul - Extraordinarily caring, social and popular people, always eager to help',
      'ISTP': 'The Virtuoso - Bold and practical experimenters, masters of all kinds of tools',
      'ISFP': 'The Adventurer - Flexible and charming artists, always ready to explore new possibilities',
      'ESTP': 'The Entrepreneur - Smart, energetic and very perceptive people, truly enjoy living on the edge',
      'ESFP': 'The Entertainer - Spontaneous, energetic and enthusiastic people - life is never boring around them'
    };

    return {
      type: this.mbtiType,
      description: mbtiDescriptions[this.mbtiType] || 'Unknown MBTI type'
    };
  }

  get parsedMetadata(): any {
    try {
      return this.metadata ? JSON.parse(this.metadata) : {};
    } catch {
      return {};
    }
  }

  get displayName(): string {
    return this.name || 'Gebruiker';
  }

  get avatarDisplay(): string {
    return this.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.displayName)}&background=random`;
  }

  get subscriptionDisplay(): string {
    if (this.isPlatinum) return 'Platinum';
    if (this.isGold) return 'Gold';
    if (this.isPremium) return 'Premium';
    return 'Free';
  }

  get subscriptionColor(): string {
    if (this.isPlatinum) return 'purple';
    if (this.isGold) return 'gold';
    if (this.isPremium) return 'blue';
    return 'gray';
  }

  // Update methods
  async updateProfile(updates: {
    name?: string;
    bio?: string;
    location?: string;
    website?: string;
    privacyLevel?: string;
    avatarUrl?: string;
  }): Promise<void> {
    await this.update((user: any) => {
      if (updates.name !== undefined) user.name = updates.name;
      if (updates.bio !== undefined) user.bio = updates.bio;
      if (updates.location !== undefined) user.location = updates.location;
      if (updates.website !== undefined) user.website = updates.website;
      if (updates.privacyLevel !== undefined) user.privacyLevel = updates.privacyLevel;
      if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl;
      user.updatedAt = Date.now();
    });
  }

  async updatePreferences(updates: {
    darkMode?: boolean;
    voiceEnabled?: boolean;
    language?: string;
    timezone?: string;
  }): Promise<void> {
    await this.update((user: any) => {
      if (updates.darkMode !== undefined) user.darkMode = updates.darkMode;
      if (updates.voiceEnabled !== undefined) user.voiceEnabled = updates.voiceEnabled;
      if (updates.language !== undefined) user.language = updates.language;
      if (updates.timezone !== undefined) user.timezone = updates.timezone;
      user.updatedAt = Date.now();
    });
  }

  async updateSubscription(updates: {
    subscriptionTier?: string;
    subscriptionStatus?: string;
    subscriptionExpiresAt?: number;
    premiumStatus?: boolean;
  }): Promise<void> {
    await this.update((user: any) => {
      if (updates.subscriptionTier !== undefined) user.subscriptionTier = updates.subscriptionTier;
      if (updates.subscriptionStatus !== undefined) user.subscriptionStatus = updates.subscriptionStatus;
      if (updates.subscriptionExpiresAt !== undefined) user.subscriptionExpiresAt = updates.subscriptionExpiresAt;
      if (updates.premiumStatus !== undefined) user.premiumStatus = updates.premiumStatus;
      user.updatedAt = Date.now();
    });
  }

  async updateMetadata(metadata: any): Promise<void> {
    await this.update((user: any) => {
      user.metadata = JSON.stringify(metadata);
      user.updatedAt = Date.now();
    });
  }
}

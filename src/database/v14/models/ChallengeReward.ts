/**
 * Challenge Reward Model - WatermelonDB V14
 * 
 * Model voor challenge rewards met V3 features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, relation } from "@nozbe/watermelondb/decorators";
import Challenge from "./Challenge";

export default class ChallengeReward extends Model {
  static table = "challenge_rewards";

  // Relaties
  @field("challenge_id") challengeId!: string;
  @field("user_id") userId!: string;

  // Reward data
  @field("title") title!: string;
  @field("description") description!: string;
  @field("icon") icon!: string;
  @field("points") points!: number;
  @field("is_unlocked") isUnlocked!: boolean;

  // V3 Reward Types
  @field("reward_type") rewardType!: string;
  @field("rarity") rarity?: string;
  @field("category") category?: string;

  // V3 Unlock Conditions
  @field("unlock_condition") unlockCondition?: string; // JSON
  @field("unlock_date") unlockDate?: number;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // Relations
  @relation("challenges", "challenge_id") challenge!: Challenge;

  // Helper methods
  get unlockConditionObject(): any {
    try {
      return this.unlockCondition ? JSON.parse(this.unlockCondition) : null;
    } catch {
      return null;
    }
  }

  get rarityLevel(): 'common' | 'rare' | 'epic' | 'legendary' {
    return (this.rarity as 'common' | 'rare' | 'epic' | 'legendary') || 'common';
  }

  get rarityColor(): string {
    const colors: Record<string, string> = {
      'common': 'gray',
      'rare': 'blue',
      'epic': 'purple',
      'legendary': 'gold'
    };
    return colors[this.rarityLevel] || 'gray';
  }

  get isRecentlyUnlocked(): boolean {
    if (!this.unlockDate) return false;
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return this.unlockDate > oneDayAgo;
  }

  get rewardTypeIcon(): string {
    const icons: Record<string, string> = {
      'badge': '🏆',
      'xp': '⭐',
      'achievement': '🎖️',
      'unlock': '🔓',
      'points': '💎'
    };
    return icons[this.rewardType] || '🎁';
  }
}

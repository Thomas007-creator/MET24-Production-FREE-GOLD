/**
 * User Challenge Stats Model - WatermelonDB V14
 * 
 * Model voor user challenge statistics met V3 features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class UserChallengeStats extends Model {
  static table = "user_challenge_stats";

  // Relaties
  @field("user_id") userId!: string;

  // V3 User Statistics
  @field("total_challenges") totalChallenges!: number;
  @field("completed_challenges") completedChallenges!: number;
  @field("active_challenges") activeChallenges!: number;
  @field("current_streak") currentStreak!: number;
  @field("max_streak") maxStreak!: number;
  @field("total_points") totalPoints!: number;
  @field("current_level") currentLevel!: number;
  @field("total_xp") totalXp!: number;

  // V3 Achievement Stats
  @field("badges_earned") badgesEarned!: number;
  @field("achievements_unlocked") achievementsUnlocked!: number;
  @field("rare_achievements") rareAchievements!: number;

  // V3 Community Stats
  @field("community_rank") communityRank?: number;
  @field("influence_score") influenceScore?: number;
  @field("helpfulness_rating") helpfulnessRating?: number;

  // V3 MBTI Stats
  @field("mbti_type") mbtiType?: string;
  @field("mbti_success_rate") mbtiSuccessRate?: number;
  @field("preferred_difficulty") preferredDifficulty?: string;
  @field("preferred_categories") preferredCategories?: string; // JSON

  // V3 Time Stats
  @field("total_time_spent") totalTimeSpent?: number; // minutes
  @field("average_session_time") averageSessionTime?: number;
  @field("most_active_hour") mostActiveHour?: number;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // Helper methods
  get completionRate(): number {
    if (this.totalChallenges === 0) return 0;
    return (this.completedChallenges / this.totalChallenges) * 100;
  }

  get successRate(): number {
    return this.mbtiSuccessRate || 0;
  }

  get preferredCategoriesArray(): string[] {
    try {
      return this.preferredCategories ? JSON.parse(this.preferredCategories) : [];
    } catch {
      return [];
    }
  }

  get levelProgress(): number {
    // Calculate progress to next level (assuming 1000 XP per level)
    const currentLevelXP = this.currentLevel * 1000;
    const nextLevelXP = (this.currentLevel + 1) * 1000;
    const progress = ((this.totalXp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  get xpToNextLevel(): number {
    const currentLevelXP = this.currentLevel * 1000;
    const nextLevelXP = (this.currentLevel + 1) * 1000;
    return Math.max(0, nextLevelXP - this.totalXp);
  }

  get averageTimePerChallenge(): number {
    if (this.completedChallenges === 0) return 0;
    return (this.totalTimeSpent || 0) / this.completedChallenges;
  }

  get engagementLevel(): 'low' | 'medium' | 'high' | 'expert' {
    if (this.totalChallenges >= 50 && this.completionRate >= 80) return 'expert';
    if (this.totalChallenges >= 20 && this.completionRate >= 70) return 'high';
    if (this.totalChallenges >= 5 && this.completionRate >= 50) return 'medium';
    return 'low';
  }

  get topCategory(): string {
    const categories = this.preferredCategoriesArray;
    if (categories.length === 0) return 'Geen voorkeur';
    
    // This would need to be calculated based on actual challenge data
    // For now, return the first category
    return categories[0] || 'Geen voorkeur';
  }

  get streakStatus(): 'on_fire' | 'good' | 'needs_boost' | 'cold' {
    if (this.currentStreak >= 30) return 'on_fire';
    if (this.currentStreak >= 7) return 'good';
    if (this.currentStreak >= 3) return 'needs_boost';
    return 'cold';
  }

  get streakIcon(): string {
    const icons: Record<string, string> = {
      'on_fire': '🔥',
      'good': '⚡',
      'needs_boost': '💪',
      'cold': '❄️'
    };
    return icons[this.streakStatus] || '⚪';
  }

  get achievementRate(): number {
    if (this.totalChallenges === 0) return 0;
    return (this.achievementsUnlocked / this.totalChallenges) * 100;
  }

  get isTopPerformer(): boolean {
    return this.communityRank !== undefined && this.communityRank <= 10;
  }

  get isInfluencer(): boolean {
    return (this.influenceScore || 0) >= 80;
  }

  get isHelper(): boolean {
    return (this.helpfulnessRating || 0) >= 4.5;
  }
}

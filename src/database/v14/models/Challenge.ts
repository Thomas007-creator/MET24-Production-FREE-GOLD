/**
 * Challenge Model - WatermelonDB V14
 * 
 * Model voor challenges met V3 features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, children } from "@nozbe/watermelondb/decorators";
import ChallengeMilestone from "./ChallengeMilestone";
import ChallengeReward from "./ChallengeReward";
import ChallengeParticipant from "./ChallengeParticipant";

export default class Challenge extends Model {
  static table = "challenges";

  // Relaties
  @field("user_id") userId!: string;

  // Challenge data
  @field("title") title!: string;
  @field("description") description!: string;
  @field("category") category!: string;
  @field("difficulty") difficulty!: string;
  @field("type") type!: string;
  @field("status") status!: string;

  // V3 Progress Tracking
  @field("progress") progress!: number;
  @field("current_streak") currentStreak!: number;
  @field("max_streak") maxStreak!: number;
  @field("total_points") totalPoints!: number;
  @field("completion_rate") completionRate!: number;

  // V3 MBTI Integration
  @field("mbti_relevance") mbtiRelevance?: string; // JSON
  @field("mbti_optimized") mbtiOptimized?: boolean;
  @field("ai_generated") aiGenerated?: boolean;

  // V3 Community Features
  @field("participants_count") participantsCount?: number;
  @field("is_public") isPublic?: boolean;
  @field("community_rating") communityRating?: number;
  @field("likes_count") likesCount?: number;
  @field("comments_count") commentsCount?: number;

  // V3 Gamification
  @field("xp_reward") xpReward?: number;
  @field("badge_reward") badgeReward?: string;
  @field("level_requirement") levelRequirement?: number;

  // V3 Tags & Metadata
  @field("tags") tags?: string; // JSON
  @field("primary_tag") primaryTag?: string;
  @field("estimated_time") estimatedTime?: number;
  @field("frequency") frequency?: string;

  // V3 AI Integration
  @field("ai_insights") aiInsights?: string;
  @field("ai_recommendation_score") aiRecommendationScore?: number;
  @field("ai_confidence") aiConfidence?: number;

  // V3 Analytics
  @field("engagement_score") engagementScore?: number;
  @field("difficulty_rating") difficultyRating?: number;
  @field("satisfaction_rating") satisfactionRating?: number;

  // V3 Integration
  @field("journaling_integration") journalingIntegration?: boolean;
  @field("planning_integration") planningIntegration?: boolean;
  @field("wellness_integration") wellnessIntegration?: boolean;

  // Dates
  @field("start_date") startDate!: number;
  @field("end_date") endDate?: number;
  @field("last_activity") lastActivity?: number;

  // Author info
  @field("author") author?: string;
  @field("author_avatar") authorAvatar?: string;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // Relations
  @children("challenge_milestones") milestones!: ChallengeMilestone[];
  @children("challenge_rewards") rewards!: ChallengeReward[];
  @children("challenge_participants") participants!: ChallengeParticipant[];

  // Helper methods
  get mbtiRelevanceArray(): string[] {
    try {
      return this.mbtiRelevance ? JSON.parse(this.mbtiRelevance) : [];
    } catch {
      return [];
    }
  }

  get tagsArray(): string[] {
    try {
      return this.tags ? JSON.parse(this.tags) : [];
    } catch {
      return [];
    }
  }

  get isActive(): boolean {
    return this.status === 'active';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isCommunity(): boolean {
    return this.type === 'community';
  }

  get isPersonal(): boolean {
    return this.type === 'personal';
  }

  get progressPercentage(): number {
    return Math.min(100, Math.max(0, this.progress));
  }

  get daysRemaining(): number {
    if (!this.endDate) return -1;
    const now = Date.now();
    const remaining = this.endDate - now;
    return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24)));
  }

  get isOverdue(): boolean {
    if (!this.endDate) return false;
    return Date.now() > this.endDate && !this.isCompleted;
  }

  get difficultyLevel(): 'easy' | 'medium' | 'hard' {
    return this.difficulty as 'easy' | 'medium' | 'hard';
  }

  get categoryIcon(): string {
    const categoryIcons: Record<string, string> = {
      'psychischeGezondheid': '🧠',
      'lichamelijkeGezondheid': '💪',
      'financieen': '💰',
      'werkSamenleving': '💼',
      'creativiteitHobbys': '🎨',
      'actieveImaginatie': '🧘',
      'professioneleOntwikkeling': '📈',
      'socialeRelaties': '❤️',
      'basisBehoeften': '🏠'
    };
    return categoryIcons[this.category] || '🎯';
  }

  get categoryName(): string {
    const categoryNames: Record<string, string> = {
      'psychischeGezondheid': 'Psychische Gezondheid',
      'lichamelijkeGezondheid': 'Lichamelijke Gezondheid',
      'financieen': 'Financiën',
      'werkSamenleving': 'Werk & Samenleving',
      'creativiteitHobbys': 'Creativiteit & Hobby\'s',
      'actieveImaginatie': 'Actieve Imaginatie',
      'professioneleOntwikkeling': 'Professionele Ontwikkeling',
      'socialeRelaties': 'Sociale Relaties',
      'basisBehoeften': 'Basis Behoeften'
    };
    return categoryNames[this.category] || this.category;
  }
}

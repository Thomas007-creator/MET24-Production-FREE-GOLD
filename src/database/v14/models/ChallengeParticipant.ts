/**
 * Challenge Participant Model - WatermelonDB V14
 * 
 * Model voor challenge participants met V3 community features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, relation } from "@nozbe/watermelondb/decorators";
import Challenge from "./Challenge";

export default class ChallengeParticipant extends Model {
  static table = "challenge_participants";

  // Relaties
  @field("challenge_id") challengeId!: string;
  @field("user_id") userId!: string;

  // Participation data
  @field("joined_at") joinedAt!: number;
  @field("status") status!: string;
  @field("progress") progress!: number;
  @field("current_streak") currentStreak!: number;

  // V3 Community Features
  @field("is_public") isPublic?: boolean;
  @field("share_progress") shareProgress?: boolean;
  @field("last_activity") lastActivity?: number;

  // V3 Social Features
  @field("likes_given") likesGiven?: number;
  @field("comments_made") commentsMade?: number;
  @field("shares_made") sharesMade?: number;

  // V3 Analytics
  @field("engagement_score") engagementScore?: number;
  @field("completion_prediction") completionPrediction?: number;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // Relations
  @relation("challenges", "challenge_id") challenge!: Challenge;

  // Helper methods
  get isActive(): boolean {
    return this.status === 'active';
  }

  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isDropped(): boolean {
    return this.status === 'dropped';
  }

  get daysSinceJoined(): number {
    const now = Date.now();
    const daysSince = Math.floor((now - this.joinedAt) / (1000 * 60 * 60 * 24));
    return daysSince;
  }

  get daysSinceLastActivity(): number {
    if (!this.lastActivity) return 0;
    const now = Date.now();
    const daysSince = Math.floor((now - this.lastActivity) / (1000 * 60 * 60 * 24));
    return daysSince;
  }

  get isInactive(): boolean {
    return this.daysSinceLastActivity > 7; // Inactive if no activity for 7+ days
  }

  get socialEngagement(): number {
    const total = (this.likesGiven || 0) + (this.commentsMade || 0) + (this.sharesMade || 0);
    return total;
  }

  get completionProbability(): number {
    return this.completionPrediction || 0;
  }

  get statusColor(): string {
    const colors: Record<string, string> = {
      'active': 'green',
      'completed': 'blue',
      'dropped': 'red',
      'paused': 'yellow'
    };
    return colors[this.status] || 'gray';
  }

  get statusIcon(): string {
    const icons: Record<string, string> = {
      'active': '🟢',
      'completed': '✅',
      'dropped': '❌',
      'paused': '⏸️'
    };
    return icons[this.status] || '⚪';
  }
}

/**
 * Challenge Milestone Model - WatermelonDB V14
 * 
 * Model voor challenge milestones met V3 features
 * 
 * @version 14.0.0
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, relation } from "@nozbe/watermelondb/decorators";
import Challenge from "./Challenge";

export default class ChallengeMilestone extends Model {
  static table = "challenge_milestones";

  // Relaties
  @field("challenge_id") challengeId!: string;
  @field("user_id") userId!: string;

  // Milestone data
  @field("title") title!: string;
  @field("description") description!: string;
  @field("target_value") targetValue!: number;
  @field("current_value") currentValue!: number;
  @field("is_completed") isCompleted!: boolean;

  // V3 Rewards
  @field("reward_points") rewardPoints?: number;
  @field("reward_badge") rewardBadge?: string;
  @field("reward_unlocked") rewardUnlocked?: boolean;

  // V3 Progress
  @field("progress_percentage") progressPercentage?: number;
  @field("completion_date") completionDate?: number;

  // Timestamps
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;

  // Relations
  @relation("challenges", "challenge_id") challenge!: Challenge;

  // Helper methods
  get progress(): number {
    if (this.targetValue === 0) return 0;
    return Math.min(100, Math.max(0, (this.currentValue / this.targetValue) * 100));
  }

  get isOverdue(): boolean {
    if (!this.isCompleted) return false;
    // Add logic for overdue detection if needed
    return false;
  }

  get completionStatus(): 'not_started' | 'in_progress' | 'completed' {
    if (this.isCompleted) return 'completed';
    if (this.currentValue > 0) return 'in_progress';
    return 'not_started';
  }

  get remainingValue(): number {
    return Math.max(0, this.targetValue - this.currentValue);
  }

  get completionRate(): number {
    return this.progress / 100;
  }
}

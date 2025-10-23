import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class SubscriptionPlan extends Model {
  static table = 'subscription_plans';

  @field('plan_id') planId!: string;
  @field('name') name!: string;
  @field('description') description?: string;
  @field('price_weekly') priceWeekly!: number;
  @field('price_monthly') priceMonthly?: number;
  @field('duration_days') durationDays!: number;
  @field('features') features!: string; // JSON string
  @field('is_active') isActive!: boolean;
  @field('is_featured') isFeatured!: boolean;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Helper method to get features as object
  getFeaturesArray(): string[] {
    try {
      return JSON.parse(this.features);
    } catch {
      return [];
    }
  }

  // Helper method to check if plan is premium
  get isPremium(): boolean {
    return this.planId !== 'free';
  }

  // Helper method to get formatted price
  getFormattedPrice(): string {
    return `€${this.priceWeekly.toFixed(2)}/week`;
  }
}

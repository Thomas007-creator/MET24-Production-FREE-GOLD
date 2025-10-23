import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import User from './User';
import SubscriptionPlan from './SubscriptionPlan';

export default class UserSubscription extends Model {
  static table = 'user_subscriptions';

  @field('user_id') userId!: string;
  @field('plan_id') planId!: string;
  @field('subscription_id') subscriptionId!: string;
  @field('status') status!: string;
  @field('start_date') startDate!: number;
  @field('end_date') endDate!: number;
  @field('auto_renew') autoRenew!: boolean;
  @field('payment_method') paymentMethod?: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Relations
  @relation('users', 'user_id') user!: User;
  @relation('subscription_plans', 'plan_id') plan!: SubscriptionPlan;

  // Helper methods
  get isActive(): boolean {
    return this.status === 'active' && this.endDate > Date.now();
  }

  get isExpired(): boolean {
    return this.endDate <= Date.now();
  }

  get daysRemaining(): number {
    const now = Date.now();
    if (this.endDate <= now) return 0;
    return Math.ceil((this.endDate - now) / (1000 * 60 * 60 * 24));
  }

  get startDateFormatted(): string {
    return new Date(this.startDate).toLocaleDateString('nl-NL');
  }

  get endDateFormatted(): string {
    return new Date(this.endDate).toLocaleDateString('nl-NL');
  }

  // Check if subscription can be renewed
  get canRenew(): boolean {
    return this.autoRenew && this.isActive;
  }
}

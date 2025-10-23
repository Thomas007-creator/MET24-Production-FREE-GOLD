import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class UserSubscription extends Model {
  static table = 'user_subscriptions';

  @field('user_id') userId!: string;
  @field('plan_id') planId!: string;
  @field('status') status!: string;
  @field('start_date') startDate!: string; // ISO date string
  @field('end_date') endDate!: string | null; // ISO date string
  @field('auto_renew') autoRenew!: boolean;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
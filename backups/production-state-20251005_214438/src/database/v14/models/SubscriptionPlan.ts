import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class SubscriptionPlan extends Model {
  static table = 'subscription_plans';

  @field('plan_name') planName!: string;
  @field('plan_type') planType!: string;
  @field('price') price!: number;
  @field('currency') currency!: string;
  @field('features') features!: string; // JSON string
  @field('is_active') isActive!: boolean;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class PaymentTransaction extends Model {
  static table = 'payment_transactions';

  @field('user_id') userId!: string;
  @field('subscription_id') subscriptionId!: string;
  @field('amount') amount!: number;
  @field('currency') currency!: string;
  @field('status') status!: string;
  @field('transaction_id') transactionId!: string;
  
  @date('created_at') createdAt!: number;
  @date('updated_at') updatedAt!: number;
}
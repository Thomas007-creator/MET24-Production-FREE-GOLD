
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import User from './User';
import UserSubscription from './UserSubscription';

export default class PaymentTransaction extends Model {
  static table = 'payment_transactions';

  @field('user_id') userId!: string;
  @field('subscription_id') subscriptionId!: string;
  @field('transaction_id') transactionId!: string;
  @field('amount') amount!: number;
  @field('currency') currency!: string;
  @field('status') status!: string;
  @field('payment_method') paymentMethod!: string;
  @field('payment_provider') paymentProvider!: string;
  @field('receipt_url') receiptUrl?: string;
  @field('error_message') errorMessage?: string;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  // Relations
  @relation('users', 'user_id') user!: User;
  @relation('user_subscriptions', 'subscription_id') subscription!: UserSubscription;

  // Helper methods
  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get isRefunded(): boolean {
    return this.status === 'refunded';
  }

  get formattedAmount(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  get statusColor(): string {
    switch (this.status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'secondary';
      default: return 'default';
    }
  }

  get statusText(): string {
    switch (this.status) {
      case 'completed': return 'Voltooid';
      case 'pending': return 'In behandeling';
      case 'failed': return 'Mislukt';
      case 'refunded': return 'Terugbetaald';
      default: return 'Onbekend';
    }
  }
}

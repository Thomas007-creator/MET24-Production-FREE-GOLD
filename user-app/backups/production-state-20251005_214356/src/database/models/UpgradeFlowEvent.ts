import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';
import User from './User';

export default class UpgradeFlowEvent extends Model {
  static table = 'upgrade_flow_events';

  @field('user_id') userId!: string;
  @field('event_type') eventType!: string;
  @field('plan_id') planId?: string;
  @field('step') step!: string;
  @field('metadata') metadata?: string;
  @field('session_id') sessionId?: string;
  @date('created_at') createdAt!: Date;

  // Relations
  @relation('users', 'user_id') user!: User;

  // Helper methods
  getMetadataObject(): Record<string, any> {
    try {
      return this.metadata ? JSON.parse(this.metadata) : {};
    } catch {
      return {};
    }
  }

  get eventTypeText(): string {
    switch (this.eventType) {
      case 'page_view': return 'Pagina bekeken';
      case 'plan_selected': return 'Plan geselecteerd';
      case 'payment_started': return 'Betaling gestart';
      case 'payment_completed': return 'Betaling voltooid';
      case 'upgrade_completed': return 'Upgrade voltooid';
      default: return this.eventType;
    }
  }

  get stepText(): string {
    switch (this.step) {
      case 'upgrade_page': return 'Upgrade pagina';
      case 'plan_selection': return 'Plan selectie';
      case 'payment': return 'Betaling';
      case 'success': return 'Succes';
      default: return this.step;
    }
  }

  // Check if this is a conversion event
  get isConversion(): boolean {
    return ['payment_completed', 'upgrade_completed'].includes(this.eventType);
  }

  // Check if this is a funnel step
  get isFunnelStep(): boolean {
    return ['page_view', 'plan_selected', 'payment_started'].includes(this.eventType);
  }
}

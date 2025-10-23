/**
 * Contact Model - WatermelonDB V14
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class Contact extends Model {
  static table = "contacts";

  @field("user_id") userId!: string;
  @field("contact_id") contactId!: string;
  @field("name") name!: string;
  @field("avatar") avatar?: string;
  @field("mbti_type") mbtiType?: string;
  @field("is_ai") isAi!: boolean;
  @field("is_online") isOnline!: boolean;
  @field("last_message") lastMessage?: string;
  @field("last_message_time") lastMessageTime?: number;
  @field("unread_count") unreadCount!: number;
  
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("created_by") createdBy!: string;
  @field("metadata") metadata?: string;
}

/**
 * Future Extension Model - WatermelonDB V14
 */

import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class FutureExtension extends Model {
  static table = "future_extensions";

  @field("extension_id") extensionId!: string;
  @field("extension_type") extensionType!: string;
  @field("extension_name") extensionName!: string;
  @field("version") version?: string;
  @field("user_id") userId?: string;
  @field("parent_extension_id") parentExtensionId?: string;
  @field("data_json") dataJson!: string;
  @field("configuration") configuration?: string;
  @field("permissions") permissions?: string;
  @field("status") status?: string;
  @field("is_enabled") isEnabled!: boolean;
  @field("is_public") isPublic?: boolean;
  @field("is_premium") isPremium?: boolean;
  @field("description") description?: string;
  @field("author") author?: string;
  @field("category") category?: string;
  @field("tags") tags?: string;
  @field("usage_count") usageCount?: number;
  @field("last_used") lastUsed?: number;
  @field("performance_metrics") performanceMetrics?: string;
  @field("dependencies") dependencies?: string;
  @field("compatibility_version") compatibilityVersion?: string;
  @field("installed_at") installedAt?: number;
  @field("last_updated") lastUpdated?: number;
  @field("expires_at") expiresAt?: number;
  
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("created_by") createdBy!: string;
  @field("metadata") metadata?: string;
}

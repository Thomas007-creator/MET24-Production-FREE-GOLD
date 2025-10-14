/**
 * Analytics & Tracking Schema - WatermelonDB V14
 */

import { tableSchema } from "@nozbe/watermelondb";

export const analyticsTrackingSchema = [
  tableSchema({
    name: "feature_usage",
    columns: [
      { name: "user_id", type: "string", isIndexed: true },
      { name: "feature_name", type: "string" },
      { name: "usage_count", type: "number" },
      { name: "last_used", type: "number" },
      { name: "monthly_limit", type: "number" },
      { name: "current_month", type: "string" },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
  tableSchema({
    name: "mbti_contents",
    columns: [
      { name: "mbti_type", type: "string", isIndexed: true },
      { name: "kind", type: "string", isIndexed: true },
      { name: "order_idx", type: "number", isIndexed: true },
      { name: "content", type: "string", isOptional: true },
      { name: "migration_seed", type: "string", isOptional: true },
      { name: "seed_immutable", type: "boolean" },
      { name: "local_edited", type: "boolean" },
      { name: "edited_by", type: "string", isOptional: true },
      { name: "last_synced_at", type: "string", isOptional: true },
      { name: "seed_conflict", type: "boolean" },
      { name: "upstream_changed", type: "boolean" },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
];

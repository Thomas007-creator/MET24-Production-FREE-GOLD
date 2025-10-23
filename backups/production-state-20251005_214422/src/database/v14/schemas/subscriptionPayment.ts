/**
 * Subscription & Payment Schema - WatermelonDB V14
 */

import { tableSchema } from "@nozbe/watermelondb";

export const subscriptionPaymentSchema = [
  tableSchema({
    name: "subscription_plans",
    columns: [
      { name: "plan_id", type: "string", isIndexed: true },
      { name: "name", type: "string" },
      { name: "description", type: "string", isOptional: true },
      { name: "price_weekly", type: "number" },
      { name: "price_monthly", type: "number", isOptional: true },
      { name: "duration_days", type: "number" },
      { name: "features", type: "string" },
      { name: "is_active", type: "boolean" },
      { name: "is_featured", type: "boolean" },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
  tableSchema({
    name: "user_subscriptions",
    columns: [
      { name: "user_id", type: "string", isIndexed: true },
      { name: "plan_id", type: "string", isIndexed: true },
      { name: "subscription_id", type: "string", isIndexed: true },
      { name: "status", type: "string" },
      { name: "start_date", type: "number" },
      { name: "end_date", type: "number" },
      { name: "auto_renew", type: "boolean" },
      { name: "payment_method", type: "string", isOptional: true },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
  tableSchema({
    name: "payment_transactions",
    columns: [
      { name: "user_id", type: "string", isIndexed: true },
      { name: "subscription_id", type: "string", isIndexed: true },
      { name: "transaction_id", type: "string", isIndexed: true },
      { name: "amount", type: "number" },
      { name: "currency", type: "string" },
      { name: "status", type: "string" },
      { name: "payment_method", type: "string" },
      { name: "payment_provider", type: "string" },
      { name: "receipt_url", type: "string", isOptional: true },
      { name: "error_message", type: "string", isOptional: true },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
  tableSchema({
    name: "upgrade_flow_events",
    columns: [
      { name: "user_id", type: "string", isIndexed: true },
      { name: "event_type", type: "string" },
      { name: "plan_id", type: "string", isOptional: true },
      { name: "step", type: "string" },
      { name: "metadata", type: "string", isOptional: true },
      { name: "session_id", type: "string", isOptional: true },
      { name: "created_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
];

/**
 * Sync & Status Schema - WatermelonDB V14
 */

import { tableSchema } from "@nozbe/watermelondb";

export const syncStatusSchema = [
  tableSchema({
    name: "sync_status",
    columns: [
      { name: "table_name", type: "string" },
      { name: "record_id", type: "string" },
      { name: "last_synced", type: "number" },
      { name: "sync_status", type: "string" },
      { name: "error_message", type: "string", isOptional: true },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
];

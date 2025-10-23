/**
 * Tasks & Productivity Schema - WatermelonDB V14
 */

import { tableSchema } from "@nozbe/watermelondb";

export const tasksProductivitySchema = [
  tableSchema({
    name: "tasks",
    columns: [
      { name: "user_id", type: "string", isIndexed: true },
      { name: "title", type: "string" },
      { name: "description", type: "string", isOptional: true },
      { name: "completed", type: "boolean" },
      { name: "priority", type: "string" },
      { name: "due_date", type: "number", isOptional: true },
      { name: "category", type: "string", isOptional: true },
      { name: "tags", type: "string", isOptional: true },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
];

/**
 * Levensgebieden Schema - WatermelonDB V14
 */

import { tableSchema } from "@nozbe/watermelondb";

export const levensgebiedenSchema = [
  tableSchema({
    name: "levensgebieden_questionnaires",
    columns: [
      { name: "user_id", type: "string", isIndexed: true },
      { name: "levensgebied", type: "string", isIndexed: true },
      { name: "answers_json", type: "string" },
      { name: "total_score", type: "number" },
      { name: "completed_at", type: "number" },
      { name: "assessment_type", type: "string" },
      { name: "mbti_type", type: "string" },
      { name: "created_at", type: "number" },
      { name: "updated_at", type: "number" },
      { name: "created_by", type: "string" },
    ],
  }),
];

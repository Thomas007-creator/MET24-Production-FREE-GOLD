/**
 * Complete V14 Database Configuration
 * 
 * Complete database configuratie voor V14 met alle tabellen:
 * - User Management (users, mbti_profiles, settings, life_areas_progress)
 * - Onboarding (onboarding_states, wellness_assessments)
 * - Therapist Ecosystem (therapists, zoomspace_coaches, appointments, session_notes, wellness_scores, push_notifications, therapist_reviews)
 * - Core Tables (tasks, contacts, future_extensions)
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { appSchema, tableSchema } from "@nozbe/watermelondb";

// Import existing schemas
import { userManagementSchema } from "./schemas/userManagement";
import { onboardingSchema } from "./schemas/onboarding";
import { therapistEcosystemSchema } from "./schemas/therapistEcosystem";

// Complete V14 schema met alle tabellen
const completeSchemaV14 = appSchema({
  version: 14,
  tables: [
    // User Management Tables
    ...userManagementSchema,
    
    // Onboarding Tables
    ...onboardingSchema,
    
    // Therapist Ecosystem Tables
    ...therapistEcosystemSchema,
    
    // Core Tables (from simple database)
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
    tableSchema({
      name: "contacts",
      columns: [
        { name: "user_id", type: "string", isIndexed: true },
        { name: "contact_id", type: "string", isIndexed: true },
        { name: "name", type: "string" },
        { name: "avatar", type: "string", isOptional: true },
        { name: "mbti_type", type: "string", isOptional: true },
        { name: "is_ai", type: "boolean" },
        { name: "is_online", type: "boolean" },
        { name: "last_message", type: "string", isOptional: true },
        { name: "last_message_time", type: "number", isOptional: true },
        { name: "unread_count", type: "number" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "created_by", type: "string" },
        { name: "metadata", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: "future_extensions",
      columns: [
        { name: "extension_id", type: "string", isIndexed: true },
        { name: "extension_type", type: "string", isIndexed: true },
        { name: "extension_name", type: "string" },
        { name: "version", type: "string", isOptional: true },
        { name: "user_id", type: "string", isIndexed: true, isOptional: true },
        { name: "data_json", type: "string" },
        { name: "is_enabled", type: "boolean" },
        { name: "is_public", type: "boolean", isOptional: true },
        { name: "is_premium", type: "boolean", isOptional: true },
        { name: "description", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "created_by", type: "string" },
        { name: "metadata", type: "string", isOptional: true },
      ],
    }),
  ],
});

// Database adapter
const adapter = new LokiJSAdapter({
  schema: completeSchemaV14,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: "MET24DB_V14_COMPLETE",
  onSetUpError: (error) => {
    console.error("Database setup error:", error);
    throw new Error(`Database setup error: ${error}`);
  },
});

// Complete database instance
export const completeDatabaseV14 = new Database({
  adapter,
  modelClasses: [], // Geen models voor nu, alleen schema
});

// Database status helper
export const getCompleteDatabaseV14Status = async () => {
  const tables = [
    // User Management
    "users", "mbti_profiles", "settings", "life_areas_progress",
    // Onboarding
    "onboarding_states", "wellness_assessments",
    // Therapist Ecosystem
    "therapists", "zoomspace_coaches", "appointments", "session_notes", 
    "wellness_scores", "push_notifications", "therapist_reviews",
    // Core Tables
    "tasks", "contacts", "future_extensions"
  ];
  
  const status: any = {
    version: "14.0.0 (Complete)",
    schema: "MET2.4 Complete V14 - All Tables",
    status: "ready",
    tables: {},
    totalTables: tables.length,
    totalRecords: 0,
    categories: {
      userManagement: 0,
      onboarding: 0,
      therapistEcosystem: 0,
      core: 0
    }
  };

  for (const tableName of tables) {
    try {
      const collection = completeDatabaseV14.get(tableName);
      const count = await collection.query().fetchCount();
      status.tables[tableName] = count;
      status.totalRecords += count;
      
      // Categorize tables
      if (["users", "mbti_profiles", "settings", "life_areas_progress"].includes(tableName)) {
        status.categories.userManagement += count;
      } else if (["onboarding_states", "wellness_assessments"].includes(tableName)) {
        status.categories.onboarding += count;
      } else if (["therapists", "zoomspace_coaches", "appointments", "session_notes", "wellness_scores", "push_notifications", "therapist_reviews"].includes(tableName)) {
        status.categories.therapistEcosystem += count;
      } else if (["tasks", "contacts", "future_extensions"].includes(tableName)) {
        status.categories.core += count;
      }
    } catch (error) {
      status.tables[tableName] = "error";
    }
  }

  return status;
};

// Test functie
export async function testCompleteDatabaseV14(): Promise<void> {
  try {
    console.log("🚀 Testing Complete Database V14...");
    
    // Test database status
    const status = await getCompleteDatabaseV14Status();
    console.log("📊 Complete Database V14 Status:", status);
    
    // Test een eenvoudige operatie
    const usersCollection = completeDatabaseV14.get("users");
    const userCount = await usersCollection.query().fetchCount();
    console.log(`👤 Users in database: ${userCount}`);
    
    // Test therapist ecosystem tables
    const therapistsCollection = completeDatabaseV14.get("therapists");
    const therapistCount = await therapistsCollection.query().fetchCount();
    console.log(`👩‍⚕️ Therapists in database: ${therapistCount}`);
    
    console.log("✅ Complete Database V14 test completed successfully!");
    
  } catch (error) {
    console.error("❌ Complete Database V14 test failed:", error);
    throw error;
  }
}

export default completeDatabaseV14;

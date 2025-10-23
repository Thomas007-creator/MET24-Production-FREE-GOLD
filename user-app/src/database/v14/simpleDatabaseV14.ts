/**
 * Simple V14 Database Configuration
 * 
 * Vereenvoudigde database configuratie voor V14
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { appSchema, tableSchema } from "@nozbe/watermelondb";

// Simple V14 schema met alleen de belangrijkste tabellen
const simpleSchemaV14 = appSchema({
  version: 14,
  tables: [
    // Users table
    tableSchema({
      name: "users",
      columns: [
        { name: "name", type: "string" },
        { name: "email", type: "string", isIndexed: true },
        { name: "mbti_type", type: "string", isIndexed: true },
        { name: "premium_status", type: "boolean" },
        { name: "dark_mode", type: "boolean" },
        { name: "voice_enabled", type: "boolean" },
        { name: "subscription_tier", type: "string", isOptional: true },
        { name: "subscription_expires_at", type: "number", isOptional: true },
        { name: "subscription_status", type: "string", isOptional: true },
        { name: "language", type: "string", isOptional: true },
        { name: "timezone", type: "string", isOptional: true },
        { name: "bio", type: "string", isOptional: true },
        { name: "location", type: "string", isOptional: true },
        { name: "website", type: "string", isOptional: true },
        { name: "privacy_level", type: "string", isOptional: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "created_by", type: "string" },
        { name: "metadata", type: "string", isOptional: true },
      ],
    }),
    // Tasks table (nieuw in V14)
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
    // Contacts table (nieuw in V14)
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
    // Future Extensions table (nieuw in V14)
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
  schema: simpleSchemaV14,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  dbName: "MET24DB_V14_SIMPLE",
  onSetUpError: (error) => {
    console.error("Database setup error:", error);
    throw new Error(`Database setup error: ${error}`);
  },
});

// Simple database instance
export const simpleDatabaseV14 = new Database({
  adapter,
  modelClasses: [], // Geen models voor nu, alleen schema
});

// Database status helper
export const getSimpleDatabaseV14Status = async () => {
  const tables = ["users", "tasks", "contacts", "future_extensions"];
  
  const status: any = {
    version: "14.0.0 (Simple)",
    schema: "MET2.4 Simple V14 - Core Tables Only",
    status: "ready",
    tables: {},
    totalTables: tables.length,
    totalRecords: 0,
  };

  for (const tableName of tables) {
    try {
      const collection = simpleDatabaseV14.get(tableName);
      const count = await collection.query().fetchCount();
      status.tables[tableName] = count;
      status.totalRecords += count;
    } catch (error) {
      status.tables[tableName] = "error";
    }
  }

  return status;
};

// Test functie
export async function testSimpleDatabaseV14(): Promise<void> {
  try {
    console.log("🚀 Testing Simple Database V14...");
    
    // Test database status
    const status = await getSimpleDatabaseV14Status();
    console.log("📊 Database V14 Status:", status);
    
    // Test een eenvoudige operatie
    const usersCollection = simpleDatabaseV14.get("users");
    const userCount = await usersCollection.query().fetchCount();
    console.log(`👤 Users in database: ${userCount}`);
    
    console.log("✅ Simple Database V14 test completed successfully!");
    
  } catch (error) {
    console.error("❌ Simple Database V14 test failed:", error);
    throw error;
  }
}

export default simpleDatabaseV14;

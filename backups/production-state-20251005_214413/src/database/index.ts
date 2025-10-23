
/**
 * WatermelonDB V14 - Main Database Entry Point
 * 
 * Volledige V14 implementatie met alle features
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

// Import V14 schema
import { schemaV14 } from "./v14/schemaV14";

// Import alle V14 model classes
import User from "./v14/models/User";
import { TaskV14 } from "./v14/models/Task";
import Contact from "./v14/models/Contact";
import FutureExtension from "./v14/models/FutureExtension";

// Import bestaande models (voor backward compatibility)
import UserOld from "./models/User";
import ChatMessage from "./models/ChatMessage";
import JournalEntry from "./models/JournalEntry";
import AIInteraction from "./models/AIInteraction";
import Setting from "./models/Setting";
import SyncStatus from "./models/SyncStatus";
import MBTIProfile from "./models/MBTIProfile";
import MbtiContent from "./models/MbtiContent";
import VectorEmbedding from "./models/VectorEmbedding";
import FeatureUsage from "./models/FeatureUsage";
import AIActionPlan from "./models/AiActionPlan";
import SuperInsight from "./models/SuperInsight";
import RewindSession from "./models/RewindSession";
import LifeAreaProgress from "./models/LifeAreaProgress";
import OnboardingState from "./models/OnboardingState";
import WellnessAssessment from "./models/WellnessAssessment";
import ContentItem from "./models/ContentItem";
import ContentChunk from "./models/ContentChunk";
import ContentPointer from "./models/ContentPointer";
import OfflinePack from "./models/OfflinePack";
import ContentRecommendation from "./models/ContentRecommendation";
import SubscriptionPlan from "./models/SubscriptionPlan";
import UserSubscription from "./models/UserSubscription";
import PaymentTransaction from "./models/PaymentTransaction";
import UpgradeFlowEvent from "./models/UpgradeFlowEvent";
import MET24Domain from "./models/MET24Domain";
import MET24DomainRelation from "./models/MET24DomainRelation";
import MET24NewInsight from "./models/MET24NewInsight";
import MET24PracticalApplication from "./models/MET24PracticalApplication";
import MET24UserProgress from "./models/MET24UserProgress";
import MET24SyncQueue from "./models/MET24SyncQueue";
import MET24ServerSyncStatus from "./models/MET24ServerSyncStatus";
import LevensgebiedenQuestionnaires from "./models/LevensgebiedenQuestionnaires";

// Create the adapter with V14 schema
const adapter = new LokiJSAdapter({
  schema: schemaV14, // Activeer V14 schema
  useWebWorker: false, // Voor debugging
  useIncrementalIndexedDB: true,
  dbName: "MET24DB_V14_FUTURE_READY", // V14 database naam
  onSetUpError: (error) => {
    console.error("Database V14 setup error:", error);
    throw new Error(`Database V14 setup error: ${error}`);
  },
});

// Vervang oude config - Activeer V14
export const database = new Database({
  adapter,
  modelClasses: [
    // V14 nieuwe models
    User, // V14 User model
    TaskV14, // Nieuwe V14 Task model
    Contact, // Nieuwe V14 Contact model
    FutureExtension, // Nieuwe V14 FutureExtension model
    
    // Bestaande models (backward compatibility)
    ChatMessage,
    JournalEntry,
    AIInteraction,
    Setting,
    SyncStatus,
    MBTIProfile,
    MbtiContent,
    VectorEmbedding,
    FeatureUsage,
    AIActionPlan,
    SuperInsight,
    RewindSession,
    LifeAreaProgress,
    OnboardingState,
    WellnessAssessment,
    ContentItem,
    ContentChunk,
    ContentPointer,
    OfflinePack,
    ContentRecommendation,
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction,
    UpgradeFlowEvent,
    MET24Domain,
    MET24DomainRelation,
    MET24NewInsight,
    MET24PracticalApplication,
    MET24UserProgress,
    MET24SyncQueue,
    MET24ServerSyncStatus,
    LevensgebiedenQuestionnaires,
  ]
});

// Database status helper voor V14
export const getDatabaseStatus = async () => {
  const tables = [
    "users", "tasks", "contacts", "future_extensions", // V14 nieuwe tabellen
    "chat_messages", "journal_entries", "ai_interactions", "settings",
    "sync_status", "mbti_profiles", "mbti_contents", "vector_embeddings",
    "feature_usage", "ai_action_plans", "super_insights", "rewind_sessions",
    "life_areas_progress", "onboarding_states", "wellness_assessments",
    "content_items", "content_chunks", "content_pointers", "offline_packs",
    "content_recommendations", "subscription_plans", "user_subscriptions",
    "payment_transactions", "upgrade_flow_events", "met24_domains",
    "met24_domain_relations", "met24_new_insights", "met24_practical_applications",
    "met24_user_progress", "met24_sync_queue", "met24_server_sync_status",
    "levensgebieden_questionnaires"
  ];

  const status: any = {
    version: "14.0.0",
    schema: "MET2.4 Future-Ready - V14 Active",
    status: "ready",
    tables: {},
    totalTables: tables.length,
    totalRecords: 0,
    v14Features: {
      modularStructure: true,
      duplicateResolution: true,
      newTables: ["tasks", "contacts", "future_extensions"],
      improvedAuditing: true,
      futureExtensions: true,
    }
  };

  for (const tableName of tables) {
    try {
      const collection = database.get(tableName);
      const count = await collection.query().fetchCount();
      status.tables[tableName] = count;
      status.totalRecords += count;
    } catch (error) {
      status.tables[tableName] = "error";
    }
  }

  return status;
};

// V14 test functie
export const testV14Database = async () => {
  try {
    console.log("🚀 Testing V14 Database...");
    
    const status = await getDatabaseStatus();
    console.log("📊 V14 Database Status:", status);
    
    // Test nieuwe V14 tabellen
    const tasksCollection = database.get("tasks");
    const contactsCollection = database.get("contacts");
    const extensionsCollection = database.get("future_extensions");
    
    const tasksCount = await tasksCollection.query().fetchCount();
    const contactsCount = await contactsCollection.query().fetchCount();
    const extensionsCount = await extensionsCollection.query().fetchCount();
    
    console.log(`📋 Tasks: ${tasksCount}`);
    console.log(`👥 Contacts: ${contactsCount}`);
    console.log(`🔮 Future Extensions: ${extensionsCount}`);
    
    console.log("✅ V14 Database test completed successfully!");
    return status;
    
  } catch (error) {
    console.error("❌ V14 Database test failed:", error);
    throw error;
  }
};

// Export database collections for easy access
export const journalEntriesCollection = database.get('journal_entries');
export const chatMessagesCollection = database.get('chat_messages');
export const contentRecommendationsCollection = database.get('content_recommendations');
export const contentItemsCollection = database.get('content_items');
export const contentPointersCollection = database.get('content_pointers');
export const offlinePacksCollection = database.get('offline_packs');
export const subscriptionPlansCollection = database.get('subscription_plans');
export const userSubscriptionsCollection = database.get('user_subscriptions');
export const paymentTransactionsCollection = database.get('payment_transactions');
export const upgradeFlowEventsCollection = database.get('upgrade_flow_events');

// Database helpers
export const dbHelpers = {
  async getCurrentUser() {
    try {
      const usersCollection = database.get('users');
      const users = await usersCollection.query().fetch();
      return users[0] || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  getSafeUserData(user: any) {
    if (!user) {
      return {
        id: null,
        name: null,
        email: null,
        mbtiType: null,
        isOnboarded: false
      };
    }

    return {
      id: user.id || null,
      name: user.name || null,
      email: user.email || null,
      mbtiType: user.mbtiType || null,
      isOnboarded: user.isOnboarded || false
    };
  },

  async getDatabaseStatus() {
    try {
      const tables = [
        "users", "tasks", "contacts", "future_extensions",
        "chat_messages", "journal_entries", "ai_interactions", "settings",
        "sync_status", "mbti_profiles", "mbti_contents", "vector_embeddings",
        "feature_usage", "ai_action_plans", "super_insights", "rewind_sessions",
        "life_areas_progress", "onboarding_states", "wellness_assessments",
        "content_items", "content_chunks", "content_pointers", "offline_packs",
        "content_recommendations", "subscription_plans", "user_subscriptions",
        "payment_transactions", "upgrade_flow_events", "met24_domains",
        "met24_domain_relations", "met24_new_insights", "met24_practical_applications",
        "met24_user_progress", "met24_sync_queue", "met24_server_sync_status",
        "levensgebieden_questionnaires"
      ];

      const status: any = {};
      
      for (const tableName of tables) {
        try {
          const collection = database.get(tableName);
          const count = await collection.query().fetchCount();
          status[tableName] = { count, accessible: true };
        } catch (error) {
          status[tableName] = { count: 0, accessible: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }
      
      return status;
    } catch (error) {
      console.error('Error getting database status:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
};

// Export database instance
export default database;
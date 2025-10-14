/**
 * WatermelonDB V14 Database Implementation
 * 
 * Volledige V14 database met migratie van V13
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { schemaV14 } from "./schemaV14";
import { migrationsV14 } from "./migrationsV14";

// Import alle model classes
import User from "./models/User";
import MBTIProfile from "./models/MBTIProfile";
import Setting from "./models/Setting";
import LifeAreaProgress from "./models/LifeAreaProgress";
import OnboardingState from "./models/OnboardingState";
import ChatMessage from "./models/ChatMessage";
import JournalEntry from "./models/JournalEntry";
import Contact from "./models/Contact";
import AIInteraction from "./models/AIInteraction";
import AIArtifacts from "./models/AIArtifacts";
import VectorEmbedding from "./models/VectorEmbedding";
import AIActionPlan from "./models/AIActionPlan";
import SuperInsight from "./models/SuperInsight";
import RewindSession from "./models/RewindSession";
import AILearningPipeline from "./models/AILearningPipeline";
import AIPersonalizationEngine from "./models/AIPersonalizationEngine";
import OfflineAIModel from "./models/OfflineAIModel";
import UserBehaviorAnalytics from "./models/UserBehaviorAnalytics";
import ExternalAIService from "./models/ExternalAIService";
import InteractiveAISession from "./models/InteractiveAISession";
import DynamicContentCreation from "./models/DynamicContentCreation";
import AIServiceHealthMonitoring from "./models/AIServiceHealthMonitoring";
import ContentItem from "./models/ContentItem";
import ContentChunk from "./models/ContentChunk";
import ContentPointer from "./models/ContentPointer";
import OfflinePack from "./models/OfflinePack";
import ContentRecommendation from "./models/ContentRecommendation";
import ContentSource from "./models/ContentSource";
import MBTILearningPath from "./models/MBTILearningPath";
import ContentAnalytics from "./models/ContentAnalytics";
import MediaIntelligence from "./models/MediaIntelligence";
import ContentSync from "./models/ContentSyncStatus";
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
import LevensgebiedenQuestionnaire from "./models/LevensgebiedenQuestionnaire";
import { TaskV14 } from "./models/Task";
import SyncStatus from "./models/SyncStatus";
import FeatureUsage from "./models/FeatureUsage";
import MBTIContent from "./models/MBTIContent";
import FutureExtension from "./models/FutureExtension";

// Optimized database adapter configuratie voor Supabase integratie
const adapter = new LokiJSAdapter({
  schema: schemaV14,
  useWebWorker: false, // Voor debugging
  useIncrementalIndexedDB: true,
  dbName: "MET24DB_V14_OPTIMIZED",
  onSetUpError: (error) => {
    console.error("❌ Database setup error:", error);
    throw new Error(`Database setup error: ${error}`);
  }
});

// Database instance met migratie
export const databaseV14 = new Database({
  adapter,
  modelClasses: [
    // User Management
    User,
    MBTIProfile,
    Setting,
    LifeAreaProgress,
    
    // Onboarding
    OnboardingState,
    
    // Chat & Journal
    ChatMessage,
    JournalEntry,
    Contact,
    
    // AI & Machine Learning
    AIInteraction,
    AIArtifacts,
    VectorEmbedding,
    AIActionPlan,
    SuperInsight,
    RewindSession,
    AILearningPipeline,
    AIPersonalizationEngine,
    OfflineAIModel,
    UserBehaviorAnalytics,
    ExternalAIService,
    InteractiveAISession,
    DynamicContentCreation,
    AIServiceHealthMonitoring,
    
    // Content Management
    ContentItem,
    ContentChunk,
    ContentPointer,
    OfflinePack,
    ContentRecommendation,
    ContentSource,
    MBTILearningPath,
    ContentAnalytics,
    MediaIntelligence,
    ContentSync,
    
    // Subscription & Payment
    SubscriptionPlan,
    UserSubscription,
    PaymentTransaction,
    UpgradeFlowEvent,
    
    // MET2.4 Domains
    MET24Domain,
    MET24DomainRelation,
    MET24NewInsight,
    MET24PracticalApplication,
    MET24UserProgress,
    MET24SyncQueue,
    MET24ServerSyncStatus,
    
    // Levensgebieden
    LevensgebiedenQuestionnaire,
    
    // Tasks & Productivity
    TaskV14,
    
    // Sync & Status
    SyncStatus,
    
    // Analytics & Tracking
    FeatureUsage,
    MBTIContent,
    
    // Extensions
    FutureExtension,
  ]
});

// Database status helper
export const getDatabaseV14Status = async () => {
  const tables = [
    "users", "mbti_profiles", "settings", "life_areas_progress",
    "onboarding_states", "chat_messages", "journal_entries", "contacts",
    "ai_interactions", "ai_artifacts", "vector_embeddings", "ai_action_plans", "super_insights",
    "rewind_sessions", "ai_learning_pipeline", "ai_personalization_engine",
    "offline_ai_models", "user_behavior_analytics", "external_ai_services",
    "interactive_ai_sessions", "dynamic_content_creation", "ai_service_health_monitoring",
    "content_items", "content_chunks", "content_pointers", "offline_packs",
    "content_recommendations", "content_sources", "mbti_learning_paths",
    "content_analytics", "media_intelligence", "content_sync_status",
    "subscription_plans", "user_subscriptions", "payment_transactions",
    "upgrade_flow_events", "met24_domains", "met24_domain_relations",
    "met24_new_insights", "met24_practical_applications", "met24_user_progress",
    "met24_sync_queue", "met24_server_sync_status", "levensgebieden_questionnaires",
    "tasks", "sync_status", "feature_usage", "mbti_contents", "future_extensions",
    "extension_events", "extension_settings"
  ];

  const status: any = {
    version: "14.0.0",
    schema: "MET2.4 Future-Ready - Modular Structure with Extensions",
    status: "ready",
    tables: {},
    totalTables: tables.length,
    totalRecords: 0,
  };

  for (const tableName of tables) {
    try {
      const collection = databaseV14.get(tableName);
      const count = await collection.query().fetchCount();
      status.tables[tableName] = count;
      status.totalRecords += count;
    } catch (error) {
      status.tables[tableName] = "error";
    }
  }

  return status;
};

// Migratie functie
export async function migrateToV14(): Promise<void> {
  try {
    console.log("🚀 Starting migration to V14...");
    
    // Migratie wordt automatisch uitgevoerd door WatermelonDB
    
    console.log("✅ Migration to V14 completed successfully!");
    
    // Toon status
    const status = await getDatabaseV14Status();
    console.log("📊 Database V14 Status:", status);
    
  } catch (error) {
    console.error("❌ Migration to V14 failed:", error);
    throw error;
  }
}

// Enhanced database helpers voor Supabase integratie
export const dbHelpers = {
  // Encrypted write operation voor gevoelige data
  async writeEncrypted<T extends { _raw: any }>(
    modelClass: any,
    record: Partial<T>,
    encryptFields: string[] = []
  ): Promise<T> {
    return await databaseV14.write(async () => {
      const collection = databaseV14.collections.get(modelClass.table);
      
      // Encrypt gevoelige velden (implementatie volgt)
      const encryptedRecord = { ...record };
      for (const field of encryptFields) {
        if (record[field as keyof T]) {
          // TODO: Implementeer encryptie
          console.log(`🔐 Encrypting field: ${field}`);
          // encryptedRecord[`${field}_encrypted`] = await encryptPayload(record[field]);
        }
      }
      
      return await collection.create((newRecord: any) => {
        Object.assign(newRecord, encryptedRecord);
      }) as unknown as T;
    });
  },

  // Batch operations voor betere performance
  async batchWrite<T extends { _raw: any }>(
    modelClass: any,
    records: Partial<T>[]
  ): Promise<T[]> {
    return await databaseV14.write(async () => {
      const collection = databaseV14.collections.get(modelClass.table);
      const results: T[] = [];
      
      for (const record of records) {
        const created = await collection.create((newRecord: any) => {
          Object.assign(newRecord, record);
        });
        results.push(created as unknown as T);
      }
      
      return results;
    });
  },

  // Query met caching voor betere performance
  async queryWithCache<T>(
    modelClass: any,
    query: any,
    cacheKey: string,
    ttl: number = 300000 // 5 minuten
  ): Promise<T[]> {
    // Check cache eerst
    const cached = localStorage.getItem(`cache_${cacheKey}`);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data;
      }
    }
    
    // Execute query
    const collection = databaseV14.collections.get(modelClass.table);
    const results = await collection.query(query).fetch();
    
    // Cache results
    localStorage.setItem(`cache_${cacheKey}`, JSON.stringify({
      data: results,
      timestamp: Date.now()
    }));
    
    return results as unknown as T[];
  },

  // Clear cache
  clearCache(pattern?: string): void {
    if (pattern) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`cache_${pattern}`)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  },

  // Supabase sync status
  async getSyncStatus(): Promise<{
    lastSync: string | null;
    pendingChanges: number;
    syncErrors: string[];
  }> {
    try {
      const syncStatus = await databaseV14.collections
        .get('sync_status')
        .query()
        .fetch();
      
      const lastSync = syncStatus.length > 0 ? (syncStatus[0] as any).lastSync : null;
      
      // Count pending changes
      const pendingChanges = await databaseV14.collections
        .get('users')
        .query()
        .fetchCount();
      
      return {
        lastSync,
        pendingChanges,
        syncErrors: []
      };
    } catch (error) {
      return {
        lastSync: null,
        pendingChanges: 0,
        syncErrors: [`Sync status check failed: ${error}`]
      };
    }
  }
};

// Export database instance
export default databaseV14;

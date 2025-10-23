/**
 * WatermelonDB V14 - MBTI Coach PWA Database Configuration
 * 
 * Versie: 14.0.0
 * Datum: 2025-01-07
 * 
 * Verbeteringen t.o.v. V13:
 * - Opgeloste duplicate tabellen (CONTENT_ITEMS, CONTENT_CHUNKS)
 * - Modulaire structuur per categorie
 * - Toekomstbestendige uitbreidingen (EXTENSIONS categorie)
 * - Verbeterde auditing en indexing
 * - Supabase sync compatibiliteit
 * 
 * Totaal: ~50 tabellen, ~550 kolommen
 * 
 * @author Thomas
 * @version 14.0.0
 */

import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";
import { appSchema } from "@nozbe/watermelondb";

// Import modulaire schema's
import { userManagementSchema } from "./schemas/userManagement";
import { onboardingSchema } from "./schemas/onboarding";
import { chatJournalSchema } from "./schemas/chatJournal";
import { aiMachineLearningSchema } from "./schemas/aiMachineLearning";
import { contentManagementSchema } from "./schemas/contentManagement";
import { subscriptionPaymentSchema } from "./schemas/subscriptionPayment";
import { met24DomainsSchema } from "./schemas/met24Domains";
import { levensgebiedenSchema } from "./schemas/levensgebieden";
import { tasksProductivitySchema } from "./schemas/tasksProductivity";
import { syncStatusSchema } from "./schemas/syncStatus";
import { analyticsTrackingSchema } from "./schemas/analyticsTracking";
import { extensionsSchema } from "./schemas/extensions";
import { pwaFeaturesTables } from "./schemas/pwaFeatures";

// Import model classes
import User from "./models/User";
import MBTIProfile from "./models/MBTIProfile";
import Setting from "./models/Setting";
import LifeAreaProgress from "./models/LifeAreaProgress";
import OnboardingState from "./models/OnboardingState";
import ChatMessage from "./models/ChatMessage";
import JournalEntry from "./models/JournalEntry";
import Contact from "./models/Contact";
import AIInteraction from "./models/AIInteraction";
import VectorEmbedding from "./models/VectorEmbedding";
import AIActionPlan from "./models/AIActionPlan";
import SuperInsight from "./models/SuperInsight";
import PushSubscription from "./models/PushSubscription";
import TokenUsage from "./models/TokenUsage";
import OfflineQueue from "./models/OfflineQueue";
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
import AuditEvent from "./models/AuditEvent";

// Combineer alle schema's
const v14Schema = appSchema({
  version: 14,
  tables: [
    ...userManagementSchema,
    ...onboardingSchema,
    ...chatJournalSchema,
    ...aiMachineLearningSchema,
    ...contentManagementSchema,
    ...subscriptionPaymentSchema,
    ...met24DomainsSchema,
    ...levensgebiedenSchema,
    ...tasksProductivitySchema,
    ...syncStatusSchema,
    ...analyticsTrackingSchema,
    ...extensionsSchema,
    ...pwaFeaturesTables,
  ],
});

// Database adapter configuratie
const adapter = new LokiJSAdapter({
  schema: v14Schema,
  useWebWorker: false, // Voor debugging
  useIncrementalIndexedDB: true,
  dbName: "MET24DB_V14_FUTURE_READY",
  onSetUpError: (error) => {
    console.error("Database setup error:", error);
    throw new Error(`Database setup error: ${error}`);
  },
});

// Database instance
export const database = new Database({
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
    VectorEmbedding,
    AIActionPlan,
    SuperInsight,
    
    // PWA Features
    PushSubscription,
    TokenUsage,
    OfflineQueue,
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
    AuditEvent,
  ],
});

// Database status helper
export const getDatabaseStatus = async () => {
  const tables = [
    "users", "mbti_profiles", "settings", "life_areas_progress",
    "onboarding_states", "chat_messages", "journal_entries", "contacts",
    "ai_interactions", "vector_embeddings", "ai_action_plans", "super_insights",
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
    "tasks", "sync_status", "feature_usage", "mbti_contents", "future_extensions", "audit_events"
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

// Export database instance
export default database;

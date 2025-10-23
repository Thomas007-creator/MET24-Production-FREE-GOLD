/**
 * MET2.4 V14 App Configuration
 * 
 * Versie: 2.4.2
 * Datum: 2025-01-07
 * 
 * Features:
 * - Environment-specific configuratie
 * - User App (localhost:3000) settings
 * - Development App (localhost:3002) settings
 * - V14 database configuratie
 * - Sync service configuratie
 * - MCP-Bridge integratie
 * 
 * @author Thomas
 * @version 2.4.2
 */

// Environment types
export type AppEnvironment = 'user' | 'development' | 'developmentAlt' | 'production';

// App configuration interface
export interface AppConfig {
  environment: AppEnvironment;
  port: number;
  name: string;
  mcpBridgeUrl: string;
  syncInterval: number;
  batchSize: number;
  databaseConfig: {
    name: string;
    version: number;
    syncEnabled: boolean;
  };
  features: {
    syncStatus: boolean;
    realTimeSync: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
  };
}

// Environment detection
export function detectAppEnvironment(): AppEnvironment {
  if (typeof window === 'undefined') return 'production';
  
  const port = window.location.port;
  const hostname = window.location.hostname;
  
  // Development environment
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    if (port === '3000') return 'user';
    if (port === '3002') return 'development';
    if (port === '3004') return 'developmentAlt';
  }
  
  // Production environment
  return 'production';
}

// App configurations
export const APP_CONFIGS: Record<AppEnvironment, AppConfig> = {
  user: {
    environment: 'user',
    port: 3000,
    name: 'User App',
    mcpBridgeUrl: process.env.REACT_APP_MCP_BRIDGE_URL || 'http://localhost:3001',
    syncInterval: 30000, // 30 seconds
    batchSize: 20,
    databaseConfig: {
      name: 'MET24DB_V14_USER_APP',
      version: 14,
      syncEnabled: true
    },
    features: {
      syncStatus: true,
      realTimeSync: true,
      errorReporting: true,
      performanceMonitoring: true
    }
  },
  
  development: {
    environment: 'development',
    port: 3002,
    name: 'Development App',
    mcpBridgeUrl: process.env.REACT_APP_MCP_BRIDGE_URL || 'http://localhost:3001',
    syncInterval: 15000, // 15 seconds (faster for dev)
    batchSize: 10,
    databaseConfig: {
      name: 'MET24DB_V14_DEV_APP',
      version: 14,
      syncEnabled: true
    },
    features: {
      syncStatus: true,
      realTimeSync: true,
      errorReporting: true,
      performanceMonitoring: true
    }
  },
  
  developmentAlt: {
    environment: 'development',
    port: 3004,
    name: 'Development App (Alt)',
    mcpBridgeUrl: process.env.REACT_APP_MCP_BRIDGE_URL || 'http://localhost:3005',
    syncInterval: 15000, // 15 seconds (faster for dev)
    batchSize: 10,
    databaseConfig: {
      name: 'MET24DB_V14_DEV_APP_ALT',
      version: 14,
      syncEnabled: true
    },
    features: {
      syncStatus: true,
      realTimeSync: true,
      errorReporting: true,
      performanceMonitoring: true
    }
  },
  
  production: {
    environment: 'production',
    port: 80,
    name: 'Production App',
    mcpBridgeUrl: process.env.REACT_APP_MCP_BRIDGE_URL || 'https://api.met24.com',
    syncInterval: 60000, // 60 seconds
    batchSize: 50,
    databaseConfig: {
      name: 'MET24DB_V14_PRODUCTION',
      version: 14,
      syncEnabled: true
    },
    features: {
      syncStatus: true,
      realTimeSync: true,
      errorReporting: true,
      performanceMonitoring: true
    }
  }
};

// Get current app configuration
export function getCurrentAppConfig(): AppConfig {
  const environment = detectAppEnvironment();
  return APP_CONFIGS[environment];
}

// V14 Database configuration
export const V14_DATABASE_CONFIG = {
  version: 14,
  schemas: [
    'users',
    'onboarding', 
    'mbti_ai',
    'chat_journal',
    'analytics',
    'subscriptions',
    'content',
    'met24',
    'sync_status',
    'settings',
    'other'
  ],
  tables: [
    // User Management
    'users', 'mbti_profiles', 'settings', 'life_areas_progress',
    
    // Onboarding
    'onboarding_states', 'levensgebieden_questionnaires',
    
    // Chat & Journal
    'chat_messages', 'journal_entries', 'contacts',
    
    // AI & Machine Learning
    'ai_interactions', 'vector_embeddings', 'ai_action_plans', 'super_insights',
    'rewind_sessions', 'ai_learning_pipeline', 'ai_personalization_engine',
    'offline_ai_models', 'user_behavior_analytics', 'external_ai_services',
    'interactive_ai_sessions', 'dynamic_content_creation', 'ai_service_health_monitoring',
    
    // Content Management
    'content_items', 'content_chunks', 'content_pointers', 'offline_packs',
    'content_recommendations', 'content_sources', 'mbti_learning_paths',
    'content_analytics', 'media_intelligence', 'content_sync_status',
    
    // Subscription & Payment
    'subscription_plans', 'user_subscriptions', 'payment_transactions',
    'upgrade_flow_events',
    
    // MET2.4 Domains
    'met24_domains', 'met24_domain_relations', 'met24_new_insights',
    'met24_practical_applications', 'met24_user_progress', 'met24_sync_queue',
    'met24_server_sync_status',
    
    // Tasks & Productivity
    'tasks',
    
    // Sync & Status
    'sync_status',
    
    // Analytics & Tracking
    'feature_usage', 'mbti_contents',
    
    // Extensions
    'future_extensions', 'extension_events', 'extension_settings'
  ],
  syncTables: [
    'users', 'mbti_profiles', 'settings', 'life_areas_progress',
    'onboarding_states', 'chat_messages', 'journal_entries', 'contacts',
    'ai_interactions', 'vector_embeddings', 'ai_action_plans', 'super_insights',
    'rewind_sessions', 'ai_learning_pipeline', 'ai_personalization_engine',
    'offline_ai_models', 'user_behavior_analytics', 'external_ai_services',
    'interactive_ai_sessions', 'dynamic_content_creation', 'ai_service_health_monitoring',
    'content_items', 'content_chunks', 'content_pointers', 'offline_packs',
    'content_recommendations', 'content_sources', 'mbti_learning_paths',
    'content_analytics', 'media_intelligence', 'content_sync_status',
    'subscription_plans', 'user_subscriptions', 'payment_transactions',
    'upgrade_flow_events', 'met24_domains', 'met24_domain_relations',
    'met24_new_insights', 'met24_practical_applications', 'met24_user_progress',
    'met24_sync_queue', 'met24_server_sync_status', 'levensgebieden_questionnaires',
    'tasks', 'sync_status', 'feature_usage', 'mbti_contents', 'future_extensions'
  ]
};

// MCP-Bridge configuration
export const MCP_BRIDGE_CONFIG = {
  endpoints: {
    health: '/health',
    healthz: '/healthz',
    sync: '/sync',
    batchSync: '/sync/batch',
    syncAll: '/sync/all',
    status: '/status',
    info: '/api/info'
  },
  headers: {
    'Content-Type': 'application/json',
    'X-Sync-Source': 'MET24-V14-App'
  },
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000 // 1 second
};

// Export default configuration
export default getCurrentAppConfig;

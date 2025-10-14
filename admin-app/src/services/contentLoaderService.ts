/**
 * Content Loader Service - WatermelonDB V14
 * 
 * Laadt alle soorten content van Supabase naar WatermelonDB:
 * - AI Artifacts (AI-gegenereerde content)
 * - MBTI Content (MBTI-specifieke content)
 * - Content Items (Algemene content items)
 * - Vector Embeddings (Vector data)
 * - Media Intelligence (Trending content)
 * - Content Recommendations (Aanbevelingen)
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database, Q } from "@nozbe/watermelondb";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger";
import AIArtifacts from "../database/models/AIArtifacts";
import { encryptPayload } from "../utils/encryption";

export interface ContentLoaderConfig {
  supabaseUrl: string;
  supabaseKey: string;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
  enableEncryption: boolean;
}

export interface ContentLoadResult {
  tableName: string;
  recordsLoaded: number;
  recordsSkipped: number;
  recordsFailed: number;
  loadTime: number;
  errors: string[];
}

export interface ContentLoadProgress {
  currentTable: string;
  currentBatch: number;
  totalTables: number;
  completedTables: number;
  totalRecords: number;
  loadedRecords: number;
  estimatedTimeRemaining: number;
}

export class ContentLoaderService {
  private database: Database;
  private supabase: SupabaseClient;
  private config: ContentLoaderConfig;
  private progress: ContentLoadProgress;
  private isLoading: boolean = false;

  // Content tables to load
  private contentTables = [
    'ai_artifacts',
    'mbti_content', 
    'content_items',
    'content_chunks',
    'content_pointers',
    'content_recommendations',
    'content_sources',
    'mbti_learning_paths',
    'content_analytics',
    'media_intelligence',
    'vector_embeddings',
    'ai_interactions',
    'ai_action_plans',
    'super_insights',
    'rewind_sessions'
  ];

  constructor(database: Database, config: ContentLoaderConfig) {
    this.database = database;
    this.config = config;
    this.supabase = createClient(config.supabaseUrl, config.supabaseKey);
    
    this.progress = {
      currentTable: '',
      currentBatch: 1,
      totalTables: this.contentTables.length,
      completedTables: 0,
      totalRecords: 0,
      loadedRecords: 0,
      estimatedTimeRemaining: 0
    };
  }

  /**
   * Start volledige content loading
   */
  async loadAllContent(): Promise<ContentLoadResult[]> {
    try {
      console.log('🚀 Starting content loading for all tables...');
      this.isLoading = true;
      this.resetProgress();

      const results: ContentLoadResult[] = [];

      for (let i = 0; i < this.contentTables.length; i++) {
        const tableName = this.contentTables[i];
        this.progress.currentTable = tableName;
        this.progress.completedTables = i;

        console.log(`📦 Loading content from ${tableName}...`);
        
        const result = await this.loadTableContent(tableName);
        results.push(result);
        
        this.progress.loadedRecords += result.recordsLoaded;
        this.progress.completedTables = i + 1;
        
        console.log(`✅ Loaded ${result.recordsLoaded} records from ${tableName}`);
      }

      console.log('🎉 All content loading completed!');
      this.isLoading = false;

      return results;

    } catch (error) {
      console.error('❌ Content loading failed:', error);
      this.isLoading = false;
      throw error;
    }
  }

  /**
   * Load content from specific table
   */
  async loadTableContent(tableName: string): Promise<ContentLoadResult> {
    const startTime = Date.now();
    const result: ContentLoadResult = {
      tableName,
      recordsLoaded: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      loadTime: 0,
      errors: []
    };

    try {
      // Get total count
      const { count, error: countError } = await this.supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        throw new Error(`Failed to get count for ${tableName}: ${countError.message}`);
      }

      this.progress.totalRecords += count || 0;

      // Load in batches
      let offset = 0;
      let batchNumber = 1;

      while (offset < (count || 0)) {
        this.progress.currentBatch = batchNumber;

        const { data, error } = await this.supabase
          .from(tableName)
          .select('*')
          .range(offset, offset + this.config.batchSize - 1)
          .order('created_at', { ascending: false });

        if (error) {
          result.errors.push(`Batch ${batchNumber} error: ${error.message}`);
          result.recordsFailed += this.config.batchSize;
          offset += this.config.batchSize;
          batchNumber++;
          continue;
        }

        if (!data || data.length === 0) {
          break;
        }

        // Process batch
        const batchResult = await this.processBatch(tableName, data);
        result.recordsLoaded += batchResult.loaded;
        result.recordsSkipped += batchResult.skipped;
        result.recordsFailed += batchResult.failed;
        result.errors.push(...batchResult.errors);

        offset += this.config.batchSize;
        batchNumber++;

        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      result.loadTime = Date.now() - startTime;
      return result;

    } catch (error) {
      result.loadTime = Date.now() - startTime;
      result.errors.push(`Table load error: ${error instanceof Error ? error.message : String(error)}`);
      return result;
    }
  }

  /**
   * Process batch of records
   */
  private async processBatch(tableName: string, records: any[]): Promise<{
    loaded: number;
    skipped: number;
    failed: number;
    errors: string[];
  }> {
    let loaded = 0;
    let skipped = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const record of records) {
      try {
        // Check if record already exists
        const exists = await this.recordExists(tableName, record);
        if (exists) {
          skipped++;
          continue;
        }

        // Convert and store record
        await this.storeRecord(tableName, record);
        loaded++;

      } catch (error) {
        failed++;
        errors.push(`Record ${record.id} error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return { loaded, skipped, failed, errors };
  }

  /**
   * Check if record already exists
   */
  private async recordExists(tableName: string, record: any): Promise<boolean> {
    try {
      const collection = this.database.get(tableName);
      
      // Try different ID fields
      const idFields = ['id', 'job_id', 'content_id', 'vector_id'];
      
      for (const idField of idFields) {
        if (record[idField]) {
          const existing = await collection.query(
            Q.where(idField, record[idField])
          ).fetch();
          
          if (existing.length > 0) {
            return true;
          }
        }
      }
      
      return false;
    } catch (error) {
      // If we can't check, assume it doesn't exist
      return false;
    }
  }

  /**
   * Store record in WatermelonDB
   */
  private async storeRecord(tableName: string, record: any): Promise<void> {
    await this.database.write(async () => {
      const collection = this.database.get(tableName);
      
      // Convert Supabase record to WatermelonDB format
      let convertedRecord = this.convertSupabaseToWatermelonDB(record);
      
      // Encrypt sensitive fields if enabled
      if (this.config.enableEncryption) {
        convertedRecord = await this.encryptSensitiveFields(convertedRecord, tableName);
      }
      
      await collection.create((newRecord: any) => {
        // Set all fields
        for (const [key, value] of Object.entries(convertedRecord)) {
          if (key !== 'id' && value !== undefined && value !== null) {
            newRecord[key] = value;
          }
        }
      });
    });
  }

  /**
   * Convert Supabase record to WatermelonDB format
   */
  private convertSupabaseToWatermelonDB(record: any): any {
    const converted: any = {};

    for (const [key, value] of Object.entries(record)) {
      if (key === 'id') {
        converted.id = value;
      } else if (key === 'created_at' || key === 'updated_at') {
        // Convert timestamptz to number
        converted[key] = new Date(value as string | number | Date).getTime();
      } else if (key.endsWith('_at') && typeof value === 'string') {
        // Convert other timestamp fields
        converted[key] = new Date(value as string).getTime();
      } else if (key.endsWith('_json') && typeof value === 'string') {
        // Parse JSON fields
        try {
          converted[key] = JSON.parse(value);
        } catch {
          converted[key] = value;
        }
      } else if (key.endsWith('_encrypted') && typeof value === 'string') {
        // Keep encrypted fields as is
        converted[key] = value;
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }

  /**
   * Encrypt sensitive fields
   */
  private async encryptSensitiveFields(record: any, tableName: string): Promise<any> {
    const sensitiveFields = this.getSensitiveFields(tableName);
    const encrypted = { ...record };

    for (const field of sensitiveFields) {
      if (record[field] && typeof record[field] === 'string') {
        try {
          encrypted[field + '_encrypted'] = await encryptPayload(record[field]);
          encrypted[field + '_encrypted_key_id'] = 'default_key';
          // Don't store plaintext
          delete encrypted[field];
        } catch (error) {
          console.warn(`Failed to encrypt field ${field}:`, error);
        }
      }
    }

    return encrypted;
  }

  /**
   * Get sensitive fields for table
   */
  private getSensitiveFields(tableName: string): string[] {
    const sensitiveFieldsMap: Record<string, string[]> = {
      'ai_artifacts': ['content', 'provenance'],
      'mbti_content': ['content'],
      'content_items': ['content_encrypted'],
      'chat_messages': ['content'],
      'journal_entries': ['content'],
      'ai_interactions': ['prompt', 'response'],
      'super_insights': ['content'],
      'rewind_sessions': ['session_data', 'ai_analysis']
    };

    return sensitiveFieldsMap[tableName] || [];
  }

  /**
   * Load AI Artifacts specifically
   */
  async loadAIArtifacts(): Promise<ContentLoadResult> {
    console.log('🤖 Loading AI Artifacts...');
    return await this.loadTableContent('ai_artifacts');
  }

  /**
   * Load MBTI Content specifically
   */
  async loadMBTIContent(): Promise<ContentLoadResult> {
    console.log('🧠 Loading MBTI Content...');
    return await this.loadTableContent('mbti_content');
  }

  /**
   * Load Content Items specifically
   */
  async loadContentItems(): Promise<ContentLoadResult> {
    console.log('📄 Loading Content Items...');
    return await this.loadTableContent('content_items');
  }

  /**
   * Load content by MBTI type
   */
  async loadContentByMBTIType(mbtiType: string): Promise<ContentLoadResult[]> {
    console.log(`🎯 Loading content for MBTI type: ${mbtiType}`);
    
    const results: ContentLoadResult[] = [];
    
    // Load AI Artifacts for this MBTI type
    const aiArtifacts = await this.loadAIArtifactsByMBTI(mbtiType);
    results.push(aiArtifacts);
    
    // Load MBTI Content for this type
    const mbtiContent = await this.loadMBTIContentByType(mbtiType);
    results.push(mbtiContent);
    
    return results;
  }

  /**
   * Load AI Artifacts by MBTI type
   */
  private async loadAIArtifactsByMBTI(mbtiType: string): Promise<ContentLoadResult> {
    const startTime = Date.now();
    const result: ContentLoadResult = {
      tableName: 'ai_artifacts',
      recordsLoaded: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      loadTime: 0,
      errors: []
    };

    try {
      const { data, error } = await this.supabase
        .from('ai_artifacts')
        .select('*')
        .eq('mbti_type', mbtiType)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load AI artifacts for ${mbtiType}: ${error.message}`);
      }

      if (data && data.length > 0) {
        const batchResult = await this.processBatch('ai_artifacts', data);
        result.recordsLoaded = batchResult.loaded;
        result.recordsSkipped = batchResult.skipped;
        result.recordsFailed = batchResult.failed;
        result.errors = batchResult.errors;
      }

      result.loadTime = Date.now() - startTime;
      return result;

    } catch (error) {
      result.loadTime = Date.now() - startTime;
      result.errors.push(`AI Artifacts load error: ${error instanceof Error ? error.message : String(error)}`);
      return result;
    }
  }

  /**
   * Load MBTI Content by type
   */
  private async loadMBTIContentByType(mbtiType: string): Promise<ContentLoadResult> {
    const startTime = Date.now();
    const result: ContentLoadResult = {
      tableName: 'mbti_content',
      recordsLoaded: 0,
      recordsSkipped: 0,
      recordsFailed: 0,
      loadTime: 0,
      errors: []
    };

    try {
      const { data, error } = await this.supabase
        .from('mbti_content')
        .select('*')
        .eq('mbti_type', mbtiType)
        .order('order_idx', { ascending: true });

      if (error) {
        throw new Error(`Failed to load MBTI content for ${mbtiType}: ${error.message}`);
      }

      if (data && data.length > 0) {
        const batchResult = await this.processBatch('mbti_content', data);
        result.recordsLoaded = batchResult.loaded;
        result.recordsSkipped = batchResult.skipped;
        result.recordsFailed = batchResult.failed;
        result.errors = batchResult.errors;
      }

      result.loadTime = Date.now() - startTime;
      return result;

    } catch (error) {
      result.loadTime = Date.now() - startTime;
      result.errors.push(`MBTI Content load error: ${error instanceof Error ? error.message : String(error)}`);
      return result;
    }
  }

  /**
   * Get current loading progress
   */
  getProgress(): ContentLoadProgress {
    return { ...this.progress };
  }

  /**
   * Check if loading is in progress
   */
  isLoadingInProgress(): boolean {
    return this.isLoading;
  }

  /**
   * Reset progress
   */
  private resetProgress(): void {
    this.progress = {
      currentTable: '',
      currentBatch: 1,
      totalTables: this.contentTables.length,
      completedTables: 0,
      totalRecords: 0,
      loadedRecords: 0,
      estimatedTimeRemaining: 0
    };
  }

  /**
   * Test connection to Supabase
   */
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('ai_artifacts')
        .select('count')
        .limit(1);

      if (error) {
        throw error;
      }

      console.log('✅ Supabase connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection test failed:', error);
      return false;
    }
  }
}

/**
 * Factory function for ContentLoaderService
 */
export function createContentLoaderService(
  database: Database,
  config: Partial<ContentLoaderConfig> = {}
): ContentLoaderService {
  const defaultConfig: ContentLoaderConfig = {
    supabaseUrl: process.env.REACT_APP_SUPABASE_URL || '',
    supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY || '',
    batchSize: 50,
    retryAttempts: 3,
    retryDelay: 1000,
    enableEncryption: true,
    ...config
  };

  return new ContentLoaderService(database, defaultConfig);
}

// Export singleton instance
export const contentLoaderService = createContentLoaderService(
  {} as Database, // Will be injected
  {}
);



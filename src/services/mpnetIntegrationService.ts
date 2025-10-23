// 🔗 MPNet L12-v2 Integration Service for MET24
// Connects high-quality embeddings with WatermelonDB and Supabase

import { mpnetL12EmbeddingService } from './mpnetL12EmbeddingService';
import database from '../database/v14/database';
import { supabase } from '../lib/supabaseClient';
import auditEventServiceV14 from './auditEventServiceV14';
import VectorEmbedding from '../database/v14/models/VectorEmbedding';
import { Q } from '@nozbe/watermelondb';

interface EmbeddingStorageResult {
  id: string;
  embedding: number[];
  inferenceTime: number;
  similarity?: number;
}

interface SimilarContentResult {
  id: string;
  content: string;
  similarity: number;
  contentType: string;
  model: string;
  inferenceTime?: number;
}

interface SimilaritySearchOptions {
  threshold?: number;
  maxResults?: number;
  contentTypes?: string[];
  sourceTable?: string;
}

class MPNetIntegrationService {
  // 🎯 Generate and store MPNet L12-v2 embedding
  async generateAndStoreEmbedding(
    userId: string,
    content: string,
    sourceTable: string = 'general',
    sourceRecordId?: string,
    contentType: string = 'general'
  ): Promise<EmbeddingStorageResult> {
    try {
      // Generate MPNet L12-v2 embedding
      const result = await mpnetL12EmbeddingService.generateEmbedding(content);
      
      // Store in WatermelonDB
      let embeddingRecord: any;
      await database.write(async () => {
        embeddingRecord = await database.collections.get('vector_embeddings').create((embedding: any) => {
          embedding.userId = userId;
          embedding.content = content;
          embedding.sourceTable = sourceTable;
          embedding.sourceRecordId = sourceRecordId || '';
          embedding.setMPNetL12Embedding(result);
          
          // Add metadata
          const metadata = {
            contentType,
            generatedAt: new Date().toISOString(),
            modelVersion: 'all-MiniLM-L12-v2',
            privacyCompliant: true,
            qualityTier: 'high'
          };
          embedding.metadata = JSON.stringify(metadata);
        });
      });
      
      // Sync to Supabase with vector data
      await this.syncToSupabase(embeddingRecord);
      
      // Audit trail
      await auditEventServiceV14.createAuditEvent({
        traceId: `embedding_${Date.now()}`,
        userId,
        eventType: 'ai_processing',
        action: 'embedding_generated',
        dataSensitivityLevel: 'PERSONAL',
        processingMethod: 'cpu_fallback',
        sanitizationApplied: true,
        externalApiUsed: false,
        status: 'success',
        fallbackTriggered: false,
        modelUsed: 'all-MiniLM-L12-v2',
        processingTimeMs: result.inferenceTime
      });
      
      return {
        id: embeddingRecord.id,
        embedding: result.embedding,
        inferenceTime: result.inferenceTime
      };
      
    } catch (error) {
      console.error('❌ Failed to generate and store embedding:', error);
      throw error;
    }
  }
  
  // 🔄 Sync WatermelonDB embedding to Supabase
  private async syncToSupabase(embeddingRecord: any): Promise<void> {
    try {
      const preferredEmbedding = embeddingRecord.preferredEmbedding;
      if (!preferredEmbedding) {
        throw new Error('No embedding data to sync');
      }
      
      // Convert to Supabase vector format
      const vectorData = `[${preferredEmbedding.vector.join(',')}]`;
      
      const syncData: any = {
        id: embeddingRecord.id,
        user_id: embeddingRecord.userId,
        content: embeddingRecord.content,
        metadata: embeddingRecord.metadata,
        source_table: embeddingRecord.sourceTable,
        source_record_id: embeddingRecord.sourceRecordId,
        created_at: embeddingRecord.createdAt.toISOString(),
        updated_at: embeddingRecord.updatedAt.toISOString()
      };
      
      // Add MPNet L12-v2 specific fields
      if (embeddingRecord.hasL12Embedding()) {
        syncData.embedding_384 = vectorData;
        syncData.model_name = preferredEmbedding.model;
        syncData.inference_time_ms = preferredEmbedding.inferenceTime;
      }
      
      // Keep legacy fields for backward compatibility
      if (embeddingRecord.embeddingData) {
        syncData.embedding_vector = embeddingRecord.embeddingData;
        syncData.embedding_dimension = embeddingRecord.embeddingDimension;
      }
      
      const { error } = await supabase
        .from('vector_embeddings')
        .upsert(syncData);
      
      if (error) {
        console.error('❌ Supabase sync failed:', error);
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Supabase sync error:', error);
      throw error;
    }
  }
  
  // 🔍 Search similar content using MPNet L12-v2
  async searchSimilarContent(
    query: string,
    userId: string,
    options: SimilaritySearchOptions = {}
  ): Promise<SimilarContentResult[]> {
    try {
      const {
        threshold = 0.75,
        maxResults = 10,
        contentTypes,
        sourceTable
      } = options;
      
      // Generate query embedding
      const queryResult = await mpnetL12EmbeddingService.generateEmbedding(query);
      
      // Try Supabase similarity search first (if vector columns exist)
      try {
        const { data, error } = await supabase.rpc('search_similar_l12v2', {
          query_embedding: `[${queryResult.embedding.join(',')}]`,
          similarity_threshold: threshold,
          max_results: maxResults,
          target_user_id: userId,
          content_types: contentTypes || null,
          source_table: sourceTable || null
        });
        
        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            content: item.content,
            similarity: item.similarity,
            contentType: item.content_type || 'general',
            model: item.model_name || 'all-MiniLM-L12-v2',
            inferenceTime: item.inference_time_ms
          }));
        }
      } catch (supabaseError) {
        console.warn('Supabase similarity search failed, falling back to local search:', supabaseError);
      }
      
      // Fallback to local WatermelonDB search
      return await this.localSimilaritySearch(queryResult.embedding, userId, options);
      
    } catch (error) {
      console.error('❌ Search failed:', error);
      throw error;
    }
  }
  
  // 🏠 Local similarity search using WatermelonDB
  private async localSimilaritySearch(
    queryEmbedding: number[],
    userId: string,
    options: SimilaritySearchOptions
  ): Promise<SimilarContentResult[]> {
    const {
      threshold = 0.75,
      maxResults = 10,
      sourceTable
    } = options;
    
    // Get embeddings from WatermelonDB
    const embeddings = await database.collections
      .get('vector_embeddings')
      .query(
        Q.where('user_id', userId),
        sourceTable ? Q.where('source_table', sourceTable) : Q.where('user_id', Q.notEq(null))
      )
      .fetch();
    
    // Calculate similarities locally
    const similarities: SimilarContentResult[] = [];
    
    for (const embeddingModel of embeddings) {
      const embedding = embeddingModel as VectorEmbedding;
      const embeddingVector = embedding.embeddingVector;
      if (!embeddingVector) continue;
      
      try {
        const similarity = mpnetL12EmbeddingService.cosineSimilarity(
          queryEmbedding,
          embeddingVector
        );
        
        if (similarity >= threshold) {
          similarities.push({
            id: embedding.id,
            content: embedding.content,
            similarity,
            contentType: embedding.parsedMetadata?.contentType || 'general',
            model: embedding.modelName || 'unknown',
            inferenceTime: embedding.inferenceTimeMs
          });
        }
      } catch (error) {
        console.warn('Failed to calculate similarity for embedding:', embedding.id, error);
      }
    }
    
    // Sort by similarity and limit results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, maxResults);
  }
  
  // 📊 Analyze content similarity
  async analyzeContentSimilarity(content1: string, content2: string): Promise<{
    similarity: number;
    model: string;
    inferenceTime: number;
  }> {
    const [result1, result2] = await Promise.all([
      mpnetL12EmbeddingService.generateEmbedding(content1),
      mpnetL12EmbeddingService.generateEmbedding(content2)
    ]);
    
    const similarity = mpnetL12EmbeddingService.cosineSimilarity(
      result1.embedding,
      result2.embedding
    );
    
    return {
      similarity,
      model: 'all-MiniLM-L12-v2',
      inferenceTime: result1.inferenceTime + result2.inferenceTime
    };
  }
  
  // 🎯 MBTI-specific embedding operations
  async generatePersonalityEmbedding(
    userId: string,
    personalityData: {
      mbtiType?: string;
      traits?: string[];
      challenges?: string[];
      goals?: string[];
    }
  ): Promise<EmbeddingStorageResult> {
    const result = await mpnetL12EmbeddingService.generatePersonalityEmbedding(personalityData);
    
    const personalityText = [
      personalityData.mbtiType || '',
      ...(personalityData.traits || []),
      ...(personalityData.challenges || []),
      ...(personalityData.goals || [])
    ].filter(Boolean).join(' ');
    
    return this.generateAndStoreEmbedding(
      userId,
      personalityText,
      'mbti_profiles',
      undefined,
      'personality_analysis'
    );
  }
  
  async generateCoachingContextEmbedding(
    userId: string,
    context: {
      userMessage: string;
      previousContext?: string;
      emotionalState?: string;
      sessionGoals?: string[];
    },
    sessionId?: string
  ): Promise<EmbeddingStorageResult> {
    const result = await mpnetL12EmbeddingService.generateCoachingContextEmbedding(context);
    
    const contextText = [
      context.userMessage,
      context.previousContext || '',
      context.emotionalState || '',
      ...(context.sessionGoals || [])
    ].filter(Boolean).join(' ');
    
    return this.generateAndStoreEmbedding(
      userId,
      contextText,
      'ai_interactions',
      sessionId,
      'coaching_context'
    );
  }
  
  // 📈 Performance monitoring
  async getModelStatus() {
    return mpnetL12EmbeddingService.getModelInfo();
  }
  
  async runPerformanceTest(): Promise<{
    averageInferenceTime: number;
    totalTime: number;
    throughput: number;
    modelInfo: any;
  }> {
    const sampleTexts = [
      "Ik voel me gestrest en zoek balans in mijn leven als INFP persoonlijkheid",
      "MBTI coaching voor persoonlijke ontwikkeling en zelfontplooiing",
      "Stress management en wellness tips voor introverte mensen",
      "Hoe kan ik mijn emotionele intelligentie verbeteren?",
      "Persoonlijkheidsontwikkeling door AI-coaching en begeleiding"
    ];
    
    return mpnetL12EmbeddingService.runPerformanceTest(sampleTexts);
  }
  
  // 🔄 Migration helpers
  async migrateExistingEmbeddings(batchSize: number = 10): Promise<{
    processed: number;
    successful: number;
    failed: number;
  }> {
    console.log('🔄 Starting MPNet L12-v2 migration for existing embeddings...');
    
    let processed = 0;
    let successful = 0;
    let failed = 0;
    
    try {
      // Get embeddings that don't have MPNet L12-v2 yet
      const oldEmbeddings = await database.collections
        .get('vector_embeddings')
        .query(
          Q.where('embedding_384', Q.eq(null))
        )
        .fetch();
      
      console.log(`Found ${oldEmbeddings.length} embeddings to migrate`);
      
      // Process in batches
      for (let i = 0; i < oldEmbeddings.length; i += batchSize) {
        const batch = oldEmbeddings.slice(i, i + batchSize);
        
        for (const embeddingModel of batch) {
          const embedding = embeddingModel as VectorEmbedding;
          try {
            // Generate new MPNet L12-v2 embedding for existing content
            const result = await mpnetL12EmbeddingService.generateEmbedding(embedding.content);
            
            // Update the record
            await database.write(async () => {
              await embedding.update((embeddingRecord: any) => {
                embeddingRecord.setMPNetL12Embedding(result);
              });
            });
            
            // Sync to Supabase
            await this.syncToSupabase(embedding);
            
            successful++;
            console.log(`✅ Migrated embedding ${embedding.id}`);
            
          } catch (error) {
            console.error(`❌ Failed to migrate embedding ${embedding.id}:`, error);
            failed++;
          }
          
          processed++;
        }
        
        // Small delay between batches to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`🎉 Migration complete: ${successful}/${processed} successful`);
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
    
    return { processed, successful, failed };
  }
}

// Singleton instance
// Export class for TypeScript support
export { MPNetIntegrationService };

export const mpnetIntegrationService = new MPNetIntegrationService();

// Export types
export type { EmbeddingStorageResult, SimilarContentResult, SimilaritySearchOptions };
export default mpnetIntegrationService;
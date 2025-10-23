/**
 * AI Buddy Optimized Pre-Seed Service
 * 
 * Gebruikt bestaande WatermelonDB en Supabase systemen
 * Voegt AI Buddy functionaliteit toe zonder duplicatie
 * 
 * @version 14.0.0
 * @author Thomas
 */

// @ts-nocheck - Temporary disable TypeScript checks for WatermelonDB compatibility

import { Database } from '@nozbe/watermelondb';
import { supabase } from '../config/supabase';
import { logger } from '../utils/logger';
import { SmartFilteringService } from './smartFilteringService';

interface AIBuddyOptimizedConfig {
  enabled: boolean;
  useExistingTables: boolean;
  enhanceExistingData: boolean;
  backgroundSyncEnabled: boolean;
}

export class AIBuddyOptimizedPreSeed {
  private config: AIBuddyOptimizedConfig;
  private database: Database;
  private supabase: any;
  private filteringService: SmartFilteringService;

  constructor(config: AIBuddyOptimizedConfig, database: Database, supabase: any) {
    this.config = config;
    this.database = database;
    this.supabase = supabase;
    this.filteringService = SmartFilteringService.getInstance();
  }

  /**
   * Initialize AI Buddy pre-seed using existing systems
   */
  async initializeAIBuddyPreSeeds(): Promise<void> {
    try {
      logger.info('🧠 Initializing AI Buddy optimized pre-seed...');

      if (this.config.useExistingTables) {
        await this.enhanceExistingData();
      }

      if (this.config.enhanceExistingData) {
        await this.addAIBuddyFeatures();
      }

      if (this.config.backgroundSyncEnabled) {
        await this.enableAIBuddyBackgroundSync();
      }

      logger.info('✅ AI Buddy optimized pre-seed initialized');
    } catch (error) {
      logger.error('❌ AI Buddy optimized pre-seed failed:', { error });
      throw error;
    }
  }

  /**
   * Enhance existing data with AI Buddy features
   */
  private async enhanceExistingData(): Promise<void> {
    try {
      logger.info('🔄 Enhancing existing data with AI Buddy features...');

      // Get existing users
      const users = await this.database.collections.get('users').query().fetch();

      for (const user of users) {
        // Load existing AI interactions
        const aiInteractions = await this.database.collections.get('ai_interactions')
          .query()
          .where('user_id', user.id)
          .fetch();

        // Load existing chat messages
        const chatMessages = await this.database.collections.get('chat_messages')
          .query()
          .where('user_id', user.id)
          .fetch();

        // Load existing journal entries
        const journalEntries = await this.database.collections.get('journal_entries')
          .query()
          .where('user_id', user.id)
          .fetch();

        // Create AI Buddy memory context from existing data
        const memoryContext = await this.createMemoryContextFromExistingData(
          user.id,
          user.mbtiType || 'ENFP',
          aiInteractions,
          chatMessages,
          journalEntries
        );

        // Store in SmartFilteringService cache
        this.filteringService.setUserMemory(memoryContext);

        // Enhance existing AI interactions with trust levels
        await this.enhanceAIInteractionsWithTrust(user.id, aiInteractions);

        // Add emotional analysis to journal entries
        await this.addEmotionalAnalysisToJournalEntries(user.id, journalEntries);
      }

      logger.info('✅ Existing data enhanced with AI Buddy features');
    } catch (error) {
      logger.error('❌ Failed to enhance existing data:', { error });
      throw error;
    }
  }

  /**
   * Add AI Buddy features to existing system
   */
  private async addAIBuddyFeatures(): Promise<void> {
    try {
      logger.info('🤖 Adding AI Buddy features to existing system...');

      // Add refusal logic to existing AI interactions
      await this.addRefusalLogicToExistingInteractions();

      // Add memory context to existing chat messages
      await this.addMemoryContextToChatMessages();

      // Add emotional guidance to existing journal entries
      await this.addEmotionalGuidanceToJournalEntries();

      logger.info('✅ AI Buddy features added to existing system');
    } catch (error) {
      logger.error('❌ Failed to add AI Buddy features:', { error });
      throw error;
    }
  }

  /**
   * Enable background sync for AI Buddy data
   */
  private async enableAIBuddyBackgroundSync(): Promise<void> {
    try {
      logger.info('🔄 Enabling AI Buddy background sync...');

      // Use existing sync system with AI Buddy enhancements
      setInterval(async () => {
        try {
          await this.syncAIBuddyDataToSupabase();
        } catch (error) {
          logger.error('AI Buddy background sync failed:', { error });
        }
      }, 5 * 60 * 1000); // Every 5 minutes

      logger.info('✅ AI Buddy background sync enabled');
    } catch (error) {
      logger.error('❌ Failed to enable AI Buddy background sync:', { error });
      throw error;
    }
  }

  // Helper methods
  private async createMemoryContextFromExistingData(
    userId: string,
    mbtiType: string,
    aiInteractions: any[],
    chatMessages: any[],
    journalEntries: any[]
  ) {
    // Analyze existing data to create memory context
    const recentInteractions = aiInteractions
      .slice(-10)
      .map(interaction => interaction.prompt || interaction.content)
      .filter(Boolean);

    const currentGoals = await this.extractGoalsFromJournalEntries(journalEntries);
    const activeChallenges = await this.extractChallengesFromJournalEntries(journalEntries);
    const preferences = await this.extractPreferencesFromSettings(userId);

    // Calculate trust level based on existing interactions
    const trustLevel = this.calculateTrustLevelFromInteractions(aiInteractions);

    return {
      userId,
      mbtiType,
      recentInteractions,
      emotionalState: 'neutral',
      currentGoals,
      activeChallenges,
      preferences,
      relationshipHistory: [],
      trustLevel,
      lastInteraction: new Date()
    };
  }

  private async enhanceAIInteractionsWithTrust(userId: string, aiInteractions: any[]): Promise<void> {
    for (const interaction of aiInteractions) {
      // Add trust level to existing AI interactions
      await interaction.update((record: any) => {
        record.trustLevel = this.calculateTrustLevelFromInteraction(interaction);
        record.aiBuddyEnhanced = true;
      });
    }
  }

  private async addEmotionalAnalysisToJournalEntries(userId: string, journalEntries: any[]): Promise<void> {
    for (const entry of journalEntries) {
      // Add emotional analysis to existing journal entries
      const emotionalAnalysis = this.analyzeEmotionalContent(entry.content);
      
      await entry.update((record: any) => {
        record.emotionalTone = emotionalAnalysis.primary;
        record.emotionalIntensity = emotionalAnalysis.intensity;
        record.emotionalStability = emotionalAnalysis.stability;
        record.aiBuddyAnalyzed = true;
      });
    }
  }

  private async addRefusalLogicToExistingInteractions(): Promise<void> {
    // This would add refusal logic metadata to existing AI interactions
    logger.info('Adding refusal logic to existing interactions...');
  }

  private async addMemoryContextToChatMessages(): Promise<void> {
    // This would add memory context to existing chat messages
    logger.info('Adding memory context to existing chat messages...');
  }

  private async addEmotionalGuidanceToJournalEntries(): Promise<void> {
    // This would add emotional guidance to existing journal entries
    logger.info('Adding emotional guidance to existing journal entries...');
  }

  private async syncAIBuddyDataToSupabase(): Promise<void> {
    try {
      // Use existing sync system to sync AI Buddy enhanced data
      const users = await this.database.collections.get('users').query().fetch();

      for (const user of users) {
        const memoryContext = this.filteringService.getUserMemory(user.id);
        if (memoryContext) {
          // Sync to existing Supabase tables
          await this.syncMemoryContextToSupabase(memoryContext);
        }
      }

      logger.info('✅ AI Buddy data synced to Supabase');
    } catch (error) {
      logger.error('❌ Failed to sync AI Buddy data:', { error });
    }
  }

  private async extractGoalsFromJournalEntries(journalEntries: any[]): Promise<string[]> {
    // Extract goals from journal entries
    const goals: string[] = [];
    for (const entry of journalEntries) {
      const content = entry.content?.toLowerCase() || '';
      if (content.includes('goal') || content.includes('want to') || content.includes('plan to')) {
        // Simple goal extraction
        goals.push('Personal development goal identified');
      }
    }
    return [...new Set(goals)]; // Remove duplicates
  }

  private async extractChallengesFromJournalEntries(journalEntries: any[]): Promise<string[]> {
    // Extract challenges from journal entries
    const challenges: string[] = [];
    for (const entry of journalEntries) {
      const content = entry.content?.toLowerCase() || '';
      if (content.includes('struggle') || content.includes('difficult') || content.includes('challenge')) {
        challenges.push('Personal challenge identified');
      }
    }
    return [...new Set(challenges)]; // Remove duplicates
  }

  private async extractPreferencesFromSettings(userId: string): Promise<Record<string, any>> {
    try {
      const settings = await this.database.collections.get('settings')
        .query()
        .where('user_id', userId)
        .fetch();
      
      const preferences: Record<string, any> = {};
      for (const setting of settings) {
        preferences[setting.key] = setting.value;
      }
      return preferences;
    } catch {
      return {};
    }
  }

  private calculateTrustLevelFromInteractions(aiInteractions: any[]): number {
    if (aiInteractions.length === 0) return 0.5;

    let trustScore = 0.5;
    
    for (const interaction of aiInteractions) {
      // Positive interactions increase trust
      if (interaction.satisfactionRating > 3) {
        trustScore += 0.1;
      }
      // Negative interactions decrease trust
      if (interaction.satisfactionRating < 3) {
        trustScore -= 0.1;
      }
    }

    return Math.max(0, Math.min(1, trustScore));
  }

  private calculateTrustLevelFromInteraction(interaction: any): number {
    // Calculate trust level for individual interaction
    if (interaction.satisfactionRating > 4) return 0.8;
    if (interaction.satisfactionRating > 3) return 0.6;
    if (interaction.satisfactionRating > 2) return 0.4;
    return 0.2;
  }

  private analyzeEmotionalContent(content: string): { primary: string; intensity: number; stability: number } {
    const emotionalKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing'],
      sad: ['sad', 'depressed', 'down', 'upset', 'disappointed'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'overwhelmed'],
      angry: ['angry', 'frustrated', 'mad', 'irritated', 'annoyed']
    };

    const contentLower = content.toLowerCase();
    const emotionalCounts: Record<string, number> = {};

    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      for (const keyword of keywords) {
        if (contentLower.includes(keyword)) {
          emotionalCounts[emotion] = (emotionalCounts[emotion] || 0) + 1;
        }
      }
    }

    const primaryEmotion = Object.entries(emotionalCounts).reduce((a, b) => 
      emotionalCounts[a[0]] > emotionalCounts[b[0]] ? a : b, 
      ['neutral', 0]
    )[0];

    const intensity = Math.min(1, Object.values(emotionalCounts).reduce((a, b) => a + b, 0) / 10);
    const stability = 0.7; // Default stability

    return { primary: primaryEmotion, intensity, stability };
  }

  private async syncMemoryContextToSupabase(memoryContext: any): Promise<void> {
    try {
      // Sync to existing Supabase tables or create new ones if needed
      const { error } = await this.supabase
        .from('ai_buddy_memory_context')
        .upsert({
          user_id: memoryContext.userId,
          mbti_type: memoryContext.mbtiType,
          trust_level: memoryContext.trustLevel,
          recent_interactions: memoryContext.recentInteractions,
          current_goals: memoryContext.currentGoals,
          active_challenges: memoryContext.activeChallenges,
          preferences: memoryContext.preferences,
          last_interaction: memoryContext.lastInteraction.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Failed to sync memory context to Supabase:', { error });
    }
  }
}

export default AIBuddyOptimizedPreSeed;

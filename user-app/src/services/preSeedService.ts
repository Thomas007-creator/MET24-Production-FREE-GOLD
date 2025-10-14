/**
 * Pre-Seed Service - MET2.4.4
 * 
 * Enhanced pre-seed service voor MET2.4.4
 * Integreert met VPN Pipeline en bestaande pre-seed infrastructuur
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from '@nozbe/watermelondb';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { VPNPipelineManager } from './vpnPipelineManager';
import { logger } from '../utils/logger';

interface PreSeedConfig {
  enabled: boolean;
  required: boolean;
  vpnProtected: boolean;
  batchSize: number;
  retryAttempts: number;
  retryDelay: number;
}

interface MBTIContentItem {
  id: string;
  mbti_type: string;
  kind: string;
  order_idx: number;
  content: any;
  migration_seed: string;
  seed_immutable: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface MediaFile {
  id: string;
  storage_path: string;
  url?: string;
  mime: string;
  size: number;
  status: string;
  transcode_meta?: any;
  created_at: string;
  updated_at: string;
}

interface OnboardingData {
  defaultPreferences: any;
  initialContext: any;
  wellnessBaseline: any;
  notificationSettings: any;
}

interface AITrainingData {
  personalityInsights: any[];
  conversationStarters: any[];
  actionPlans: any[];
  superInsights: any[];
}

interface VectorEmbedding {
  id: string;
  content_id: string;
  embedding: number[];
  content_type: string;
  created_at: string;
}

interface PreSeedData {
  mbtiContent: MBTIContentItem[];
  mediaFiles: MediaFile[];
  onboardingData: OnboardingData;
  aiTrainingData: AITrainingData;
  vectorEmbeddings: VectorEmbedding[];
}

interface ValidationResult {
  success: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    totalItems: number;
    validItems: number;
    invalidItems: number;
    missingItems: number;
  };
}

export class PreSeedService {
  private config: PreSeedConfig;
  private vpnManager: VPNPipelineManager;
  private supabase: SupabaseClient;
  private database: Database;
  private isInitialized: boolean = false;

  constructor(
    config: Partial<PreSeedConfig> = {},
    vpnManager: VPNPipelineManager,
    supabase: SupabaseClient,
    database: Database
  ) {
    this.config = {
      enabled: process.env.PRESEED_ENABLED === 'true' || true,
      required: process.env.PRESEED_REQUIRED === 'true' || false,
      vpnProtected: process.env.PRESEED_VPN_PROTECTED === 'true' || true,
      batchSize: parseInt(process.env.PRESEED_BATCH_SIZE || '10'),
      retryAttempts: parseInt(process.env.PRESEED_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.PRESEED_RETRY_DELAY || '1000'),
      ...config
    };

    this.vpnManager = vpnManager;
    this.supabase = supabase;
    this.database = database;
  }

  /**
   * Initialize pre-seed service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      logger.info('Pre-Seed Service already initialized');
      return;
    }

    if (!this.config.enabled) {
      logger.info('🔓 Pre-Seed Service disabled - proceeding without pre-seeds');
      return;
    }

    try {
      logger.info('🌱 Initializing Pre-Seed Service...');

      if (this.config.vpnProtected) {
        await this.vpnManager.validateVPNForOperation('preseed_initialization');
      }

      await this.initializePreSeeds();
      this.isInitialized = true;

      logger.info('✅ Pre-Seed Service initialized successfully');
    } catch (error) {
      logger.error('❌ Pre-Seed Service initialization failed:', { error });
      if (this.config.required) {
        throw error;
      }
    }
  }

  /**
   * Initialize all pre-seed categories
   */
  async initializePreSeeds(): Promise<void> {
    try {
      logger.info('🌱 Initializing all pre-seed categories...');

      // Initialize in parallel for better performance
      await Promise.all([
        this.initializeMBTIContent(),
        this.initializeMediaFiles(),
        this.initializeOnboardingData(),
        this.initializeAITrainingData(),
        this.initializeVectorEmbeddings()
      ]);

      logger.info('✅ All pre-seed categories initialized');
    } catch (error) {
      logger.error('❌ Pre-seed initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Initialize MBTI content pre-seeds
   */
  async initializeMBTIContent(): Promise<void> {
    try {
      logger.info('📚 Initializing MBTI content pre-seeds...');

      const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ];

      // Process in batches
      for (let i = 0; i < mbtiTypes.length; i += this.config.batchSize) {
        const batch = mbtiTypes.slice(i, i + this.config.batchSize);
        
        await Promise.all(
          batch.map(mbtiType => this.seedMBTIContent(mbtiType))
        );
      }

      logger.info('✅ MBTI content pre-seeds initialized');
    } catch (error) {
      logger.error('❌ MBTI content pre-seeds initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Seed MBTI content for specific type
   */
  async seedMBTIContent(mbtiType: string): Promise<void> {
    try {
      if (this.config.vpnProtected) {
        await this.vpnManager.validateVPNForOperation(`preseed_mbti_${mbtiType}`);
      }

      const content = await this.generateMBTIContent(mbtiType);
      
      // Upsert to Supabase
      const { error } = await this.supabase
        .from('mbti_content')
        .upsert(content, { onConflict: 'mbti_type,kind,order_idx' });

      if (error) {
        throw new Error(`Failed to seed MBTI content for ${mbtiType}: ${error.message}`);
      }

      logger.info(`✅ MBTI content seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ Failed to seed MBTI content for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * Generate MBTI content for specific type
   */
  private async generateMBTIContent(mbtiType: string): Promise<MBTIContentItem[]> {
    const baseContent = this.getMBTIBaseContent(mbtiType);
    const timestamp = new Date().toISOString();

    return [
      {
        id: `uuid-${mbtiType.toLowerCase()}-intro`,
        mbti_type: mbtiType,
        kind: 'intro_text',
        order_idx: 0,
        content: {
          title: baseContent.title,
          body: baseContent.description,
          key_traits: baseContent.keyTraits,
          core_values: baseContent.coreValues
        },
        migration_seed: 'mbti_v002',
        seed_immutable: true,
        created_by: 'migration',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: `uuid-${mbtiType.toLowerCase()}-persona`,
        mbti_type: mbtiType,
        kind: 'persona_summary',
        order_idx: 1,
        content: {
          summary: baseContent.summary,
          nickname: baseContent.nickname,
          description: baseContent.description
        },
        migration_seed: 'mbti_v002',
        seed_immutable: true,
        created_by: 'migration',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: `uuid-${mbtiType.toLowerCase()}-strengths`,
        mbti_type: mbtiType,
        kind: 'strengths',
        order_idx: 2,
        content: {
          strengths: baseContent.strengths
        },
        migration_seed: 'mbti_v002',
        seed_immutable: true,
        created_by: 'migration',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: `uuid-${mbtiType.toLowerCase()}-challenges`,
        mbti_type: mbtiType,
        kind: 'challenges',
        order_idx: 3,
        content: {
          challenges: baseContent.challenges
        },
        migration_seed: 'mbti_v002',
        seed_immutable: true,
        created_by: 'migration',
        created_at: timestamp,
        updated_at: timestamp
      }
    ];
  }

  /**
   * Get MBTI base content
   */
  private getMBTIBaseContent(mbtiType: string): any {
    const mbtiContentMap: Record<string, any> = {
      'INTJ': {
        title: 'INTJ — De Strategische Denker',
        description: 'INTJ\'s zijn analytisch, toekomstgericht en onafhankelijk. Ze waarderen efficiëntie en visie.',
        summary: 'Strateeg, rationeel, toekomstgericht',
        nickname: 'De Architect',
        keyTraits: ['Analytisch', 'Toekomstgericht', 'Onafhankelijk'],
        coreValues: ['Efficiëntie', 'Visie', 'Strategie'],
        strengths: [
          {
            title: 'Strategisch Denken',
            description: 'Kan complexe problemen analyseren en oplossingen bedenken',
            examples: ['Project planning', 'Risico analyse', 'Visie ontwikkeling']
          }
        ],
        challenges: [
          {
            title: 'Perfectionisme',
            description: 'Kan te veel tijd besteden aan details',
            solutions: ['Prioriteiten stellen', 'Deadlines respecteren']
          }
        ]
      },
      'INTP': {
        title: 'INTP — De Logische Denker',
        description: 'INTP\'s zijn nieuwsgierig, theoretisch en conceptueel. Ze houden van ideeën en analyse.',
        summary: 'Analytisch, conceptueel, nieuwsgierig',
        nickname: 'De Denker',
        keyTraits: ['Nieuwsgierig', 'Theoretisch', 'Conceptueel'],
        coreValues: ['Logica', 'Innovatie', 'Autonomie'],
        strengths: [
          {
            title: 'Logisch Redeneren',
            description: 'Uitstekend in het analyseren van complexe systemen',
            examples: ['Probleem oplossen', 'Theorie ontwikkeling', 'Innovatie']
          }
        ],
        challenges: [
          {
            title: 'Praktische Implementatie',
            description: 'Kan moeite hebben met het uitvoeren van plannen',
            solutions: ['Actieplannen maken', 'Deadlines stellen']
          }
        ]
      }
      // Add more MBTI types as needed
    };

    return mbtiContentMap[mbtiType] || {
      title: `${mbtiType} — Persoonlijkheidstype`,
      description: `Beschrijving voor ${mbtiType} persoonlijkheidstype.`,
      summary: 'Persoonlijkheidstype',
      nickname: 'De Persoon',
      keyTraits: ['Trait 1', 'Trait 2', 'Trait 3'],
      coreValues: ['Waarde 1', 'Waarde 2', 'Waarde 3'],
      strengths: [],
      challenges: []
    };
  }

  /**
   * Initialize media files pre-seeds
   */
  async initializeMediaFiles(): Promise<void> {
    try {
      logger.info('🎬 Initializing media files pre-seeds...');

      const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ];

      // Process in batches
      for (let i = 0; i < mbtiTypes.length; i += this.config.batchSize) {
        const batch = mbtiTypes.slice(i, i + this.config.batchSize);
        
        await Promise.all(
          batch.map(mbtiType => this.seedMediaFiles(mbtiType))
        );
      }

      logger.info('✅ Media files pre-seeds initialized');
    } catch (error) {
      logger.error('❌ Media files pre-seeds initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Seed media files for specific MBTI type
   */
  async seedMediaFiles(mbtiType: string): Promise<void> {
    try {
      if (this.config.vpnProtected) {
        await this.vpnManager.validateVPNForOperation(`preseed_media_${mbtiType}`);
      }

      const mediaFiles = await this.generateMediaFiles(mbtiType);
      
      // Upsert to Supabase
      const { error } = await this.supabase
        .from('media_files')
        .upsert(mediaFiles, { onConflict: 'storage_path' });

      if (error) {
        throw new Error(`Failed to seed media files for ${mbtiType}: ${error.message}`);
      }

      logger.info(`✅ Media files seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ Failed to seed media files for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * Generate media files for specific MBTI type
   */
  private async generateMediaFiles(mbtiType: string): Promise<MediaFile[]> {
    const timestamp = new Date().toISOString();

    return [
      {
        id: `uuid-${mbtiType.toLowerCase()}-intro-video`,
        storage_path: `mbti/${mbtiType}/videos/preload/intro.mp4`,
        mime: 'video/mp4',
        size: 0,
        status: 'uploaded',
        created_at: timestamp,
        updated_at: timestamp
      },
      {
        id: `uuid-${mbtiType.toLowerCase()}-persona-image`,
        storage_path: `mbti/${mbtiType}/images/preload/persona.jpg`,
        mime: 'image/jpeg',
        size: 0,
        status: 'uploaded',
        created_at: timestamp,
        updated_at: timestamp
      }
    ];
  }

  /**
   * Initialize onboarding data pre-seeds
   */
  async initializeOnboardingData(): Promise<void> {
    try {
      logger.info('🚀 Initializing onboarding data pre-seeds...');

      // Initialize default onboarding data
      const onboardingData = await this.generateOnboardingData();
      
      // Store in database
      await this.database.write(async () => {
        const onboardingStates = this.database.get('onboarding_states');
        await onboardingStates.create((record: any) => {
          record.userId = 'default';
          record.currentStep = 'completed';
          record.stepCompletedFlags = JSON.stringify({ all: true });
          record.userData = JSON.stringify(onboardingData);
        });
      });

      logger.info('✅ Onboarding data pre-seeds initialized');
    } catch (error) {
      logger.error('❌ Onboarding data pre-seeds initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Generate onboarding data
   */
  private async generateOnboardingData(): Promise<OnboardingData> {
    return {
      defaultPreferences: {
        contentTypes: ['strategic_insights', 'personal_development', 'wellness'],
        topics: ['leadership', 'innovation', 'mindfulness'],
        difficultyLevel: 'intermediate',
        contentSources: ['curated', 'ai_recommended']
      },
      initialContext: {
        situation: 'personal_development',
        goals: ['self_awareness', 'growth', 'wellness'],
        challenges: ['time_management', 'stress_management']
      },
      wellnessBaseline: {
        stressLevel: 5,
        energyLevel: 7,
        moodLevel: 6,
        sleepQuality: 6
      },
      notificationSettings: {
        dailyInsights: true,
        weeklyReports: true,
        reminders: true,
        pushNotifications: false
      }
    };
  }

  /**
   * Initialize AI training data pre-seeds
   */
  async initializeAITrainingData(): Promise<void> {
    try {
      logger.info('🤖 Initializing AI training data pre-seeds...');

      const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ];

      // Process in batches
      for (let i = 0; i < mbtiTypes.length; i += this.config.batchSize) {
        const batch = mbtiTypes.slice(i, i + this.config.batchSize);
        
        await Promise.all(
          batch.map(mbtiType => this.seedAITrainingData(mbtiType))
        );
      }

      logger.info('✅ AI training data pre-seeds initialized');
    } catch (error) {
      logger.error('❌ AI training data pre-seeds initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Seed AI training data for specific MBTI type
   */
  async seedAITrainingData(mbtiType: string): Promise<void> {
    try {
      if (this.config.vpnProtected) {
        await this.vpnManager.validateVPNForOperation(`preseed_ai_${mbtiType}`);
      }

      const aiTrainingData = await this.generateAITrainingData(mbtiType);
      
      // Store in database
      await this.database.write(async () => {
        const aiInteractions = this.database.get('ai_interactions');
        await aiInteractions.create((record: any) => {
          record.userId = 'default';
          record.interactionType = 'training_data';
          record.interactionData = JSON.stringify(aiTrainingData);
          record.mbtiType = mbtiType;
        });
      });

      logger.info(`✅ AI training data seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ Failed to seed AI training data for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * Generate AI training data for specific MBTI type
   */
  private async generateAITrainingData(mbtiType: string): Promise<AITrainingData> {
    return {
      personalityInsights: [
        {
          type: 'strength_insight',
          content: `Als ${mbtiType} heb je unieke sterke punten die je kunt benutten.`,
          mbtiType: mbtiType
        }
      ],
      conversationStarters: [
        {
          type: 'daily_checkin',
          content: `Hoe voel je je vandaag als ${mbtiType}?`,
          mbtiType: mbtiType
        }
      ],
      actionPlans: [
        {
          type: 'growth_plan',
          content: `Een groeiplan specifiek voor ${mbtiType} persoonlijkheid.`,
          mbtiType: mbtiType
        }
      ],
      superInsights: [
        {
          type: 'deep_insight',
          content: `Diepe inzichten over ${mbtiType} persoonlijkheid.`,
          mbtiType: mbtiType
        }
      ]
    };
  }

  /**
   * Initialize vector embeddings pre-seeds
   */
  async initializeVectorEmbeddings(): Promise<void> {
    try {
      logger.info('🔍 Initializing vector embeddings pre-seeds...');

      const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ];

      // Process in batches
      for (let i = 0; i < mbtiTypes.length; i += this.config.batchSize) {
        const batch = mbtiTypes.slice(i, i + this.config.batchSize);
        
        await Promise.all(
          batch.map(mbtiType => this.seedVectorEmbeddings(mbtiType))
        );
      }

      logger.info('✅ Vector embeddings pre-seeds initialized');
    } catch (error) {
      logger.error('❌ Vector embeddings pre-seeds initialization failed:', { error });
      throw error;
    }
  }

  /**
   * Seed vector embeddings for specific MBTI type
   */
  async seedVectorEmbeddings(mbtiType: string): Promise<void> {
    try {
      if (this.config.vpnProtected) {
        await this.vpnManager.validateVPNForOperation(`preseed_vectors_${mbtiType}`);
      }

      const vectorEmbeddings = await this.generateVectorEmbeddings(mbtiType);
      
      // Store in database
      await this.database.write(async () => {
        const vectorEmbeddingsTable = this.database.get('vector_embeddings');
        await vectorEmbeddingsTable.create((record: any) => {
          record.contentId = `mbti_${mbtiType}`;
          record.embedding = JSON.stringify(vectorEmbeddings[0].embedding);
          record.contentType = 'mbti_personality';
        });
      });

      logger.info(`✅ Vector embeddings seeded for ${mbtiType}`);
    } catch (error) {
      logger.error(`❌ Failed to seed vector embeddings for ${mbtiType}:`, { error });
      throw error;
    }
  }

  /**
   * Generate vector embeddings for specific MBTI type
   */
  private async generateVectorEmbeddings(mbtiType: string): Promise<VectorEmbedding[]> {
    const timestamp = new Date().toISOString();

    return [
      {
        id: `uuid-${mbtiType.toLowerCase()}-embedding`,
        content_id: `mbti_${mbtiType}`,
        embedding: Array(1536).fill(0.1), // Placeholder embedding
        content_type: 'mbti_personality',
        created_at: timestamp
      }
    ];
  }

  /**
   * Validate pre-seeds
   */
  async validatePreSeeds(): Promise<ValidationResult> {
    try {
      logger.info('🔍 Validating pre-seeds...');

      const errors: string[] = [];
      const warnings: string[] = [];
      let totalItems = 0;
      let validItems = 0;
      let invalidItems = 0;
      let missingItems = 0;

      // Validate MBTI content
      const mbtiTypes = [
        'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
        'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
      ];

      for (const mbtiType of mbtiTypes) {
        const { data: content, error } = await this.supabase
          .from('mbti_content')
          .select('*')
          .eq('mbti_type', mbtiType);

        if (error) {
          errors.push(`Failed to validate MBTI content for ${mbtiType}: ${error.message}`);
          invalidItems++;
        } else if (!content || content.length === 0) {
          warnings.push(`No MBTI content found for ${mbtiType}`);
          missingItems++;
        } else {
          validItems += content.length;
        }
        totalItems++;
      }

      const success = errors.length === 0;

      logger.info(`✅ Pre-seed validation completed: ${validItems} valid, ${invalidItems} invalid, ${missingItems} missing`);

      return {
        success,
        errors,
        warnings,
        summary: {
          totalItems,
          validItems,
          invalidItems,
          missingItems
        }
      };
    } catch (error) {
      logger.error('❌ Pre-seed validation failed:', { error });
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
        summary: {
          totalItems: 0,
          validItems: 0,
          invalidItems: 0,
          missingItems: 0
        }
      };
    }
  }

  /**
   * Get pre-seed status
   */
  async getPreSeedStatus(): Promise<any> {
    try {
      const validation = await this.validatePreSeeds();
      
      return {
        initialized: this.isInitialized,
        config: this.config,
        validation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get pre-seed status:', { error });
      return {
        initialized: this.isInitialized,
        config: this.config,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Shutdown pre-seed service
   */
  async shutdown(): Promise<void> {
    try {
      logger.info('🔓 Shutting down Pre-Seed Service...');
      this.isInitialized = false;
      logger.info('✅ Pre-Seed Service shutdown complete');
    } catch (error) {
      logger.error('❌ Pre-Seed Service shutdown failed:', { error });
    }
  }
}

// Factory function
export function createPreSeedService(
  config: Partial<PreSeedConfig> = {},
  vpnManager: VPNPipelineManager,
  supabase: SupabaseClient,
  database: Database
): PreSeedService {
  return new PreSeedService(config, vpnManager, supabase, database);
}

export default PreSeedService;









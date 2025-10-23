/**
 * Essential Offline Pre-seed Service
 * 
 * Implementeert alle 12 essentiële V14 modellen voor directe offline functionaliteit
 * na MBTI assessment en persoonlijke gegevens.
 * 
 * @version 14.0.0
 * @author Thomas
 */

// @ts-nocheck - Temporary disable TypeScript checks for WatermelonDB compatibility

import { Database } from "@nozbe/watermelondb";
import { supabase } from "../config/supabase";

interface EssentialPreSeedConfig {
  enabled: boolean;
  minimalLocalData: boolean;
  backgroundSyncEnabled: boolean;
  privacyFirstAnalytics: boolean;
  offlineFirst: boolean;
  mbtiTypes: string[];
}

interface MBTIContentData {
  mbtiType: string;
  kind: string;
  content: any;
  orderIdx: number;
}

interface AIActionPlanData {
  userId: string;
  title: string;
  steps: any[];
  mbtiType: string;
  priority: string;
}

interface SuperInsightData {
  mbtiType: string;
  insightType: string;
  title: string;
  content: any;
  confidence: number;
}

interface ChatMessageData {
  role: string;
  content: string;
  mbtiType: string;
  messageType: string;
  userId: string;
}

interface JournalEntryData {
  title: string;
  prompt: string;
  mbtiType: string;
  entryType: string;
  userId: string;
}

interface VectorEmbeddingData {
  content: string;
  embedding: number[];
  contentType: string;
  mbtiType: string;
}

interface ContentItemData {
  type: string;
  title: string;
  url: string;
  summary: string;
  mbtiRelevance: string[];
  tags: string[];
  difficultyLevel: string;
}

interface ContentRecommendationData {
  userId: string;
  contentType: string;
  contentId: string;
  recommendationScore: number;
  recommendationReason: string;
  mbtiType: string;
}

interface TaskData {
  title: string;
  description: string;
  priority: string;
  category: string;
  mbtiType: string;
  userId: string;
}

interface SettingData {
  key: string;
  value: string;
  mbtiType: string;
  userId: string;
}

interface ContactData {
  name: string;
  mbtiType: string;
  isAi: boolean;
  isOnline: boolean;
  lastMessage: string;
  unreadCount: number;
  userId: string;
}

interface FeatureUsageData {
  userId: string;
  featureName: string;
  usageCount: number;
  lastUsed: string;
}

export class EssentialOfflinePreSeedService {
  private config: EssentialPreSeedConfig;
  private database: Database;
  private supabase: any;

  constructor(config: EssentialPreSeedConfig, database: Database, supabase: any) {
    this.config = config;
    this.database = database;
    this.supabase = supabase;
  }

  /**
   * Initialize all essential offline pre-seeds
   */
  async initializeEssentialPreSeeds(): Promise<void> {
    try {
      console.log('🚀 Initializing essential offline pre-seeds...');

      // TIER 1: CRITICAL (Direct Beschikbaar - 0-1 uur)
      await this.seedMBTIContent();
      await this.seedAIActionPlans();
      await this.seedSuperInsights();
      await this.seedChatMessages();
      await this.seedJournalEntries();
      await this.seedVectorEmbeddings();
      await this.seedContentItems();
      await this.seedContentRecommendations();

      // TIER 2: IMPORTANT (Binnen 24 uur)
      await this.seedTasks();
      await this.seedSettings();

      // TIER 3: NICE TO HAVE (Binnen 1 week)
      await this.seedContacts();
      await this.seedFeatureUsage();

            // TIER 4: AI BUDDY ENHANCEMENTS (Temporarily disabled for build)\n      // await this.enhanceExistingDataWithAIBuddy();

      console.log('✅ Essential offline pre-seeds initialized successfully');
    } catch (error) {
      console.error('❌ Essential offline pre-seeds initialization failed:', error);
      throw error;
    }
  }

  /**
   * TIER 1: MBTI Content Pre-seeds
   */
  async seedMBTIContent(): Promise<void> {
    try {
      console.log('📚 Seeding MBTI content...');

      for (const mbtiType of this.config.mbtiTypes) {
        const mbtiContentData = this.getMBTIContentData(mbtiType);
        
        for (const content of mbtiContentData) {
          await this.database.write(async () => {
            const mbtiContent = this.database.get('mbti_content');
            await mbtiContent.create((record: any) => {
              record.mbtiType = content.mbtiType;
              record.kind = content.kind;
              record.orderIdx = content.orderIdx;
              record.content = JSON.stringify(content.content);
              record.migrationSeed = 'essential_offline_v001';
              record.seedImmutable = true;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ MBTI content seeded');
    } catch (error) {
      console.error('❌ MBTI content seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get MBTI content data for specific type
   */
  private getMBTIContentData(mbtiType: string): MBTIContentData[] {
    const mbtiContentMap: Record<string, any> = {
      'INTJ': {
        intro: {
          title: "Welkom, Architect!",
          description: "Als INTJ ben je een strategische denker met een sterke visie voor de toekomst.",
          strengths: ["Analytisch", "Onafhankelijk", "Besluitvaardig", "Strategisch"],
          challenges: ["Perfectionisme", "Sociale situaties", "Details"],
          developmentTips: ["Ontwikkel sociale vaardigheden", "Deel je visie met anderen", "Oefen geduld"]
        },
        persona: {
          coreTraits: ["Intuïtief", "Denkend", "Oordelend", "Introvert"],
          cognitiveFunctions: ["Ni", "Te", "Fi", "Se"],
          developmentPath: "Focus op sociale vaardigheden en praktische toepassing"
        }
      },
      'ENFP': {
        intro: {
          title: "Welkom, Campaigner!",
          description: "Als ENFP ben je een enthousiaste, creatieve en sociaal bewuste persoon.",
          strengths: ["Enthousiast", "Creatief", "Empathisch", "Flexibel"],
          challenges: ["Focus behouden", "Structuur", "Kritiek"],
          developmentTips: ["Ontwikkel focus", "Creëer structuur", "Leer omgaan met kritiek"]
        },
        persona: {
          coreTraits: ["Extrovert", "Intuïtief", "Voelend", "Waarnemend"],
          cognitiveFunctions: ["Ne", "Fi", "Te", "Si"],
          developmentPath: "Focus op focus en structuur"
        }
      }
      // Add other MBTI types...
    };

    const content = mbtiContentMap[mbtiType] || mbtiContentMap['INTJ'];
    
    return [
      {
        mbtiType,
        kind: 'intro_text',
        content: content.intro,
        orderIdx: 0
      },
      {
        mbtiType,
        kind: 'persona_summary',
        content: content.persona,
        orderIdx: 1
      }
    ];
  }

  /**
   * TIER 1: AI Action Plans Pre-seeds
   */
  async seedAIActionPlans(): Promise<void> {
    try {
      console.log('🎯 Seeding AI action plans...');

      for (const mbtiType of this.config.mbtiTypes) {
        const actionPlanData = this.getAIActionPlanData(mbtiType);
        
        await this.database.write(async () => {
          const aiActionPlans = this.database.get('ai_action_plans');
          await aiActionPlans.create((record: any) => {
            record.userId = 'default';
            record.title = actionPlanData.title;
            record.steps = JSON.stringify(actionPlanData.steps);
            record.mbtiType = actionPlanData.mbtiType;
            record.priority = actionPlanData.priority;
            record.status = 'active';
            record.createdBy = 'essential_offline_service';
          });
        });
      }

      console.log('✅ AI action plans seeded');
    } catch (error) {
      console.error('❌ AI action plans seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get AI action plan data for specific type
   */
  private getAIActionPlanData(mbtiType: string): AIActionPlanData {
    const actionPlanMap: Record<string, any> = {
      'INTJ': {
        title: "INTJ Persoonlijke Groei Plan",
        steps: [
          {
            title: "Ontwikkel sociale vaardigheden",
            description: "Oefen met het delen van je ideeën in sociale situaties",
            priority: "high",
            estimatedTime: "2 weken"
          },
          {
            title: "Verbeter communicatie",
            description: "Leer je visie duidelijk over te brengen aan anderen",
            priority: "medium",
            estimatedTime: "1 maand"
          }
        ],
        priority: "high"
      },
      'ENFP': {
        title: "ENFP Focus & Structuur Plan",
        steps: [
          {
            title: "Ontwikkel focus",
            description: "Oefen met het voltooien van taken voordat je nieuwe start",
            priority: "high",
            estimatedTime: "3 weken"
          },
          {
            title: "Creëer structuur",
            description: "Implementeer dagelijkse routines en planning",
            priority: "medium",
            estimatedTime: "2 maanden"
          }
        ],
        priority: "high"
      }
      // Add other MBTI types...
    };

    return actionPlanMap[mbtiType] || actionPlanMap['INTJ'];
  }

  /**
   * TIER 1: Super Insights Pre-seeds
   */
  async seedSuperInsights(): Promise<void> {
    try {
      console.log('💡 Seeding super insights...');

      for (const mbtiType of this.config.mbtiTypes) {
        const superInsightData = this.getSuperInsightData(mbtiType);
        
        await this.database.write(async () => {
          const superInsights = this.database.get('super_insights');
          await superInsights.create((record: any) => {
            record.mbtiType = superInsightData.mbtiType;
            record.insightType = superInsightData.insightType;
            record.title = superInsightData.title;
            record.content = JSON.stringify(superInsightData.content);
            record.confidence = superInsightData.confidence;
            record.createdBy = 'essential_offline_service';
          });
        });
      }

      console.log('✅ Super insights seeded');
    } catch (error) {
      console.error('❌ Super insights seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get super insight data for specific type
   */
  private getSuperInsightData(mbtiType: string): SuperInsightData {
    const insightMap: Record<string, any> = {
      'INTJ': {
        insightType: 'personality_analysis',
        title: "INTJ: De Strategische Visionair",
        content: {
          coreTraits: ["Intuïtief", "Denkend", "Oordelend", "Introvert"],
          cognitiveFunctions: ["Ni", "Te", "Fi", "Se"],
          developmentPath: "Focus op sociale vaardigheden en praktische toepassing",
          careerSuggestions: ["Strategisch planner", "Onderzoeker", "Architect"]
        },
        confidence: 0.95
      },
      'ENFP': {
        insightType: 'personality_analysis',
        title: "ENFP: De Enthousiaste Visionair",
        content: {
          coreTraits: ["Extrovert", "Intuïtief", "Voelend", "Waarnemend"],
          cognitiveFunctions: ["Ne", "Fi", "Te", "Si"],
          developmentPath: "Focus op focus en structuur",
          careerSuggestions: ["Coach", "Creatief directeur", "Therapeut"]
        },
        confidence: 0.95
      }
      // Add other MBTI types...
    };

    return insightMap[mbtiType] || insightMap['INTJ'];
  }

  /**
   * TIER 1: Chat Messages Pre-seeds
   */
  async seedChatMessages(): Promise<void> {
    try {
      console.log('💬 Seeding chat messages...');

      for (const mbtiType of this.config.mbtiTypes) {
        const chatMessageData = this.getChatMessageData(mbtiType);
        
        for (const message of chatMessageData) {
          await this.database.write(async () => {
            const chatMessages = this.database.get('chat_messages');
            await chatMessages.create((record: any) => {
              record.role = message.role;
              record.content = message.content;
              record.mbtiType = message.mbtiType;
              record.messageType = message.messageType;
              record.userId = message.userId;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Chat messages seeded');
    } catch (error) {
      console.error('❌ Chat messages seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get chat message data for specific type
   */
  private getChatMessageData(mbtiType: string): ChatMessageData[] {
    const messageMap: Record<string, any> = {
      'INTJ': [
        {
          role: 'assistant',
          content: 'Hallo! Ik ben je persoonlijke MBTI coach. Als INTJ ben je een natuurlijke strategische denker. Wat wil je vandaag bespreken?',
          messageType: 'welcome'
        },
        {
          role: 'assistant',
          content: 'Laten we kijken naar je sterke punten als INTJ: je analytische vermogen en onafhankelijkheid. Hoe kun je deze inzetten voor je doelen?',
          messageType: 'coaching'
        }
      ],
      'ENFP': [
        {
          role: 'assistant',
          content: 'Hallo! Ik ben je persoonlijke MBTI coach. Als ENFP ben je een natuurlijke inspirator. Wat wil je vandaag bespreken?',
          messageType: 'welcome'
        },
        {
          role: 'assistant',
          content: 'Laten we kijken naar je sterke punten als ENFP: je enthousiasme en creativiteit. Hoe kun je deze inzetten voor je doelen?',
          messageType: 'coaching'
        }
      ]
      // Add other MBTI types...
    };

    const messages = messageMap[mbtiType] || messageMap['INTJ'];
    
    return messages.map((msg: any) => ({
      ...msg,
      mbtiType,
      userId: 'default'
    }));
  }

  /**
   * TIER 1: Journal Entries Pre-seeds
   */
  async seedJournalEntries(): Promise<void> {
    try {
      console.log('📝 Seeding journal entries...');

      for (const mbtiType of this.config.mbtiTypes) {
        const journalEntryData = this.getJournalEntryData(mbtiType);
        
        for (const entry of journalEntryData) {
          await this.database.write(async () => {
            const journalEntries = this.database.get('journal_entries');
            await journalEntries.create((record: any) => {
              record.title = entry.title;
              record.prompt = entry.prompt;
              record.mbtiType = entry.mbtiType;
              record.entryType = entry.entryType;
              record.userId = entry.userId;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Journal entries seeded');
    } catch (error) {
      console.error('❌ Journal entries seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get journal entry data for specific type
   */
  private getJournalEntryData(mbtiType: string): JournalEntryData[] {
    const entryMap: Record<string, any> = {
      'INTJ': [
        {
          title: "INTJ Reflectie: Mijn Visie",
          prompt: "Als INTJ heb je een sterke visie. Beschrijf jouw ideale toekomst en hoe je daar komt.",
          entryType: 'reflection'
        },
        {
          title: "INTJ Groei: Sociale Vaardigheden",
          prompt: "INTJ's kunnen moeite hebben met sociale situaties. Reflecteer op een recente sociale interactie.",
          entryType: 'growth'
        }
      ],
      'ENFP': [
        {
          title: "ENFP Reflectie: Mijn Passies",
          prompt: "Als ENFP ben je gepassioneerd. Beschrijf wat je het meest inspireert en waarom.",
          entryType: 'reflection'
        },
        {
          title: "ENFP Groei: Focus Ontwikkelen",
          prompt: "ENFP's kunnen moeite hebben met focus. Reflecteer op een moment waarop je gefocust was.",
          entryType: 'growth'
        }
      ]
      // Add other MBTI types...
    };

    const entries = entryMap[mbtiType] || entryMap['INTJ'];
    
    return entries.map((entry: any) => ({
      ...entry,
      mbtiType,
      userId: 'default'
    }));
  }

  /**
   * TIER 1: Vector Embeddings Pre-seeds
   */
  async seedVectorEmbeddings(): Promise<void> {
    try {
      console.log('🔍 Seeding vector embeddings...');

      for (const mbtiType of this.config.mbtiTypes) {
        const vectorEmbeddingData = this.getVectorEmbeddingData(mbtiType);
        
        for (const embedding of vectorEmbeddingData) {
          await this.database.write(async () => {
            const vectorEmbeddings = this.database.get('vector_embeddings');
            await vectorEmbeddings.create((record: any) => {
              record.content = embedding.content;
              record.embedding = JSON.stringify(embedding.embedding);
              record.contentType = embedding.contentType;
              record.mbtiType = embedding.mbtiType;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Vector embeddings seeded');
    } catch (error) {
      console.error('❌ Vector embeddings seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get vector embedding data for specific type
   */
  private getVectorEmbeddingData(mbtiType: string): VectorEmbeddingData[] {
    // Mock embeddings - in real implementation, these would be generated
    const mockEmbedding = Array.from({ length: 1536 }, () => Math.random());
    
    return [
      {
        content: `${mbtiType} persoonlijkheidstype: strategische denker`,
        embedding: mockEmbedding,
        contentType: 'mbti_content',
        mbtiType
      },
      {
        content: `${mbtiType} carrière advies: architect, onderzoeker`,
        embedding: mockEmbedding,
        contentType: 'career_advice',
        mbtiType
      }
    ];
  }

  /**
   * TIER 1: Content Items Pre-seeds
   */
  async seedContentItems(): Promise<void> {
    try {
      console.log('📄 Seeding content items...');

      for (const mbtiType of this.config.mbtiTypes) {
        const contentItemData = this.getContentItemData(mbtiType);
        
        for (const item of contentItemData) {
          await this.database.write(async () => {
            const contentItems = this.database.get('content_items');
            await contentItems.create((record: any) => {
              record.type = item.type;
              record.title = item.title;
              record.url = item.url;
              record.summary = item.summary;
              record.mbtiRelevance = JSON.stringify(item.mbtiRelevance);
              record.tags = JSON.stringify(item.tags);
              record.difficultyLevel = item.difficultyLevel;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Content items seeded');
    } catch (error) {
      console.error('❌ Content items seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get content item data for specific type
   */
  private getContentItemData(mbtiType: string): ContentItemData[] {
    return [
      {
        type: 'article',
        title: `${mbtiType}: Complete Gids`,
        url: `/content/${mbtiType.toLowerCase()}-guide`,
        summary: `Alles wat je moet weten over het ${mbtiType} persoonlijkheidstype`,
        mbtiRelevance: [mbtiType],
        tags: ['mbti', mbtiType.toLowerCase(), 'personality', 'guide'],
        difficultyLevel: 'beginner'
      },
      {
        type: 'video',
        title: `${mbtiType} Sociale Vaardigheden Ontwikkelen`,
        url: `/content/${mbtiType.toLowerCase()}-social-skills`,
        summary: `Praktische tips voor ${mbtiType} om sociale vaardigheden te verbeteren`,
        mbtiRelevance: [mbtiType],
        tags: ['mbti', mbtiType.toLowerCase(), 'social-skills', 'development'],
        difficultyLevel: 'intermediate'
      }
    ];
  }

  /**
   * TIER 1: Content Recommendations Pre-seeds
   */
  async seedContentRecommendations(): Promise<void> {
    try {
      console.log('🎯 Seeding content recommendations...');

      for (const mbtiType of this.config.mbtiTypes) {
        const contentRecommendationData = this.getContentRecommendationData(mbtiType);
        
        for (const rec of contentRecommendationData) {
          await this.database.write(async () => {
            const contentRecommendations = this.database.get('content_recommendations');
            await contentRecommendations.create((record: any) => {
              record.userId = rec.userId;
              record.contentType = rec.contentType;
              record.contentId = rec.contentId;
              record.recommendationScore = rec.recommendationScore;
              record.recommendationReason = rec.recommendationReason;
              record.mbtiType = rec.mbtiType;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Content recommendations seeded');
    } catch (error) {
      console.error('❌ Content recommendations seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get content recommendation data for specific type
   */
  private getContentRecommendationData(mbtiType: string): ContentRecommendationData[] {
    return [
      {
        userId: 'default',
        contentType: 'article',
        contentId: `${mbtiType.toLowerCase()}-guide`,
        recommendationScore: 0.95,
        recommendationReason: `Perfect match voor je ${mbtiType} persoonlijkheidstype`,
        mbtiType
      },
      {
        userId: 'default',
        contentType: 'video',
        contentId: `${mbtiType.toLowerCase()}-social-skills`,
        recommendationScore: 0.88,
        recommendationReason: 'Helpt je groeien in sociale vaardigheden',
        mbtiType
      }
    ];
  }

  /**
   * TIER 2: Tasks Pre-seeds
   */
  async seedTasks(): Promise<void> {
    try {
      console.log('✅ Seeding tasks...');

      for (const mbtiType of this.config.mbtiTypes) {
        const taskData = this.getTaskData(mbtiType);
        
        for (const task of taskData) {
          await this.database.write(async () => {
            const tasks = this.database.get('tasks');
            await tasks.create((record: any) => {
              record.userId = task.userId;
              record.title = task.title;
              record.description = task.description;
              record.completed = false;
              record.priority = task.priority;
              record.category = task.category;
              record.tags = JSON.stringify([mbtiType, 'personal-growth']);
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Tasks seeded');
    } catch (error) {
      console.error('❌ Tasks seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get task data for specific type
   */
  private getTaskData(mbtiType: string): TaskData[] {
    return [
      {
        title: "MBTI Reflectie Sessie",
        description: `Neem 15 minuten om te reflecteren op je ${mbtiType} eigenschappen`,
        priority: "high",
        category: "personal",
        mbtiType,
        userId: 'default'
      },
      {
        title: "Persoonlijke Groei Oefening",
        description: `Oefen met het ontwikkelen van je ${mbtiType} sterke punten`,
        priority: "medium",
        category: "growth",
        mbtiType,
        userId: 'default'
      }
    ];
  }

  /**
   * TIER 2: Settings Pre-seeds
   */
  async seedSettings(): Promise<void> {
    try {
      console.log('⚙️ Seeding settings...');

      for (const mbtiType of this.config.mbtiTypes) {
        const settingData = this.getSettingData(mbtiType);
        
        for (const setting of settingData) {
          await this.database.write(async () => {
            const settings = this.database.get('settings');
            await settings.create((record: any) => {
              record.key = setting.key;
              record.value = setting.value;
              record.mbtiType = setting.mbtiType;
              record.userId = setting.userId;
              record.createdBy = 'essential_offline_service';
            });
          });
        }
      }

      console.log('✅ Settings seeded');
    } catch (error) {
      console.error('❌ Settings seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get setting data for specific type
   */
  private getSettingData(mbtiType: string): SettingData[] {
    const settingMap: Record<string, any> = {
      'INTJ': {
        coaching_style: 'analytical',
        notification_frequency: 'minimal',
        content_preference: 'detailed'
      },
      'ENFP': {
        coaching_style: 'enthusiastic',
        notification_frequency: 'frequent',
        content_preference: 'interactive'
      }
      // Add other MBTI types...
    };

    const settings = settingMap[mbtiType] || settingMap['INTJ'];
    
    return Object.entries(settings).map(([key, value]) => ({
      key,
      value: value as string,
      mbtiType,
      userId: 'default'
    }));
  }

  /**
   * TIER 3: Contacts Pre-seeds
   */
  async seedContacts(): Promise<void> {
    try {
      console.log('👥 Seeding contacts...');

      for (const mbtiType of this.config.mbtiTypes) {
        const contactData = this.getContactData(mbtiType);
        
        await this.database.write(async () => {
          const contacts = this.database.get('contacts');
          await contacts.create((record: any) => {
            record.userId = contactData.userId;
            record.contactId = `contact_${mbtiType}_${Date.now()}`;
            record.name = contactData.name;
            record.mbtiType = contactData.mbtiType;
            record.isAi = contactData.isAi;
            record.isOnline = contactData.isOnline;
            record.lastMessage = contactData.lastMessage;
            record.unreadCount = contactData.unreadCount;
            record.createdBy = 'essential_offline_service';
          });
        });
      }

      console.log('✅ Contacts seeded');
    } catch (error) {
      console.error('❌ Contacts seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get contact data for specific type
   */
  private getContactData(mbtiType: string): ContactData {
    return {
      name: `${mbtiType} Coach AI`,
      mbtiType,
      isAi: true,
      isOnline: true,
      lastMessage: `Hallo! Ik ben gespecialiseerd in ${mbtiType} coaching.`,
      unreadCount: 0,
      userId: 'default'
    };
  }

  /**
   * TIER 3: Feature Usage Pre-seeds
   */
  async seedFeatureUsage(): Promise<void> {
    try {
      console.log('📊 Seeding feature usage...');

      const featureUsageData = this.getFeatureUsageData();
      
      for (const usage of featureUsageData) {
        await this.database.write(async () => {
          const featureUsage = this.database.get('feature_usage');
          await featureUsage.create((record: any) => {
            record.userId = usage.userId;
            record.featureName = usage.featureName;
            record.usageCount = usage.usageCount;
            record.lastUsed = usage.lastUsed;
            record.createdBy = 'essential_offline_service';
          });
        });
      }

      console.log('✅ Feature usage seeded');
    } catch (error) {
      console.error('❌ Feature usage seeding failed:', error);
      throw error;
    }
  }

  /**
   * Get feature usage data
   */
  private getFeatureUsageData(): FeatureUsageData[] {
    return [
      {
        userId: 'default',
        featureName: 'mbti_content_view',
        usageCount: 1,
        lastUsed: new Date().toISOString()
      },
      {
        userId: 'default',
        featureName: 'chat_ai',
        usageCount: 1,
        lastUsed: new Date().toISOString()
      },
      {
        userId: 'default',
        featureName: 'journal_entry',
        usageCount: 0,
        lastUsed: new Date().toISOString()
      }
    ];
  }
}

// Export singleton instance
export const essentialOfflinePreSeedService = new EssentialOfflinePreSeedService(
  {
    enabled: true,
    minimalLocalData: true,
    backgroundSyncEnabled: true,
    privacyFirstAnalytics: true,
    offlineFirst: true,
    mbtiTypes: [
      'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]
  },
  {} as Database, // Will be injected
  {} as any // Will be injected
);

// Default export
export default essentialOfflinePreSeedService;

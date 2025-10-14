import React from 'react';
import { chatLLMService } from './chatLLMService';
import database from '../database/v14/database';

// Simple database query helper
const queryDatabase = async (query: string, params: any[] = []): Promise<any[]> => {
  try {
    // For now, return empty array - in real implementation would use V14 database
    return [];
  } catch (error) {
    console.error('Database query error:', error);
    return [];
  }
};

// Content Discovery Types
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: 'article' | 'course' | 'video' | 'podcast' | 'book' | 'community_post' | 'research';
  url: string;
  source: string;
  tags: string[];
  mbtiRelevance: MBTIRelevance;
  levensgebiedCategories: LevensgebiedCategory[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedReadTime: number; // minutes
  qualityScore: number; // 0-100
  communityRating: number; // 1-5
  discoveredAt: Date;
  lastUpdated: Date;
  externalMetadata?: ExternalMetadata;
}

export interface MBTIRelevance {
  primaryTypes: string[]; // ['INFP', 'ENFP'] - most relevant types
  secondaryTypes: string[]; // related types that might find it interesting
  cognitiveFunction: string; // Fi, Ne, Si, Te, etc.
  relevanceScore: number; // 0-100
  reasoning: string; // why this content fits this MBTI type
}

export interface LevensgebiedCategory {
  category: 'werk' | 'relaties' | 'gezondheid' | 'hobby' | 'spiritualiteit' | 'persoonlijke_groei' | 'creativiteit' | 'studie';
  relevanceScore: number; // 0-100
  applicationSuggestions: string[];
}

export interface ExternalMetadata {
  author?: string;
  publishDate?: Date;
  keywords: string[];
  abstract?: string;
  citations?: number;
  socialShares?: number;
  userEngagement?: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface ContentDiscoveryConfig {
  mbtiType: string;
  preferredLevensgebieden: string[];
  contentTypes: string[];
  difficultyLevels: string[];
  languages: string[];
  maxResults: number;
  freshnessPeriod: number; // days
  qualityThreshold: number; // 0-100
}

export interface PersonalizedContentFeed {
  userId: string;
  generatedAt: Date;
  feedType: 'daily' | 'weekly' | 'discovery' | 'trending';
  items: ContentItem[];
  totalItems: number;
  curationReasoning: string;
  nextUpdateTime: Date;
}

// MBTI-Specific Content Templates
const MBTI_CONTENT_TEMPLATES = {
  // Analysts (NT)
  INTJ: {
    preferredTypes: ['research', 'course', 'book'],
    focusAreas: ['strategic_planning', 'systems_thinking', 'innovation', 'leadership'],
    levensgebieden: ['werk', 'persoonlijke_groei', 'studie'],
    contentPrompts: [
      'Strategic thinking frameworks for long-term planning',
      'Systems design and architecture principles',
      'Innovation management and emerging technologies',
      'Leadership development for independent thinkers',
      'Research methodologies and analytical approaches'
    ],
    avoidancePatterns: ['overly_emotional_content', 'surface_level_tips', 'group_activities']
  },
  
  INTP: {
    preferredTypes: ['research', 'article', 'video'],
    focusAreas: ['theoretical_frameworks', 'complex_problems', 'emerging_fields', 'deep_analysis'],
    levensgebieden: ['studie', 'hobby', 'persoonlijke_groei'],
    contentPrompts: [
      'Theoretical frameworks in emerging scientific fields',
      'Complex problem-solving methodologies',
      'Deep-dive analyses of fascinating phenomena',
      'Cutting-edge research in multiple disciplines',
      'Philosophical explorations of abstract concepts'
    ],
    avoidancePatterns: ['routine_tasks', 'practical_only_content', 'rigid_schedules']
  },
  
  ENTJ: {
    preferredTypes: ['course', 'article', 'podcast'],
    focusAreas: ['leadership', 'business_strategy', 'efficiency', 'goal_achievement'],
    levensgebieden: ['werk', 'persoonlijke_groei', 'relaties'],
    contentPrompts: [
      'Executive leadership strategies and frameworks',
      'Business growth and scaling methodologies',
      'Team building and organizational development',
      'Strategic decision-making under uncertainty',
      'Performance optimization and productivity systems'
    ],
    avoidancePatterns: ['micromanagement_content', 'overly_detailed_processes', 'passive_approaches']
  },
  
  ENTP: {
    preferredTypes: ['article', 'video', 'podcast'],
    focusAreas: ['innovation', 'brainstorming', 'networking', 'variety'],
    levensgebieden: ['creativiteit', 'werk', 'relaties'],
    contentPrompts: [
      'Creative brainstorming and ideation techniques',
      'Innovation processes and disruptive thinking',
      'Networking strategies for idea generation',
      'Entrepreneurial approaches to problem-solving',
      'Cross-disciplinary thinking and connections'
    ],
    avoidancePatterns: ['routine_maintenance', 'detailed_implementation', 'lengthy_processes']
  },

  // Diplomats (NF)
  INFP: {
    preferredTypes: ['article', 'book', 'community_post'],
    focusAreas: ['personal_values', 'creativity', 'meaning', 'authenticity'],
    levensgebieden: ['creativiteit', 'persoonlijke_groei', 'spiritualiteit'],
    contentPrompts: [
      'Creative expression and artistic development',
      'Finding meaning and purpose in daily life',
      'Authentic self-expression and personal values',
      'Mindfulness and emotional intelligence practices',
      'Creative writing and storytelling techniques'
    ],
    avoidancePatterns: ['aggressive_competition', 'purely_logical_approaches', 'conflict_heavy_content']
  },
  
  INFJ: {
    preferredTypes: ['book', 'course', 'article'],
    focusAreas: ['psychology', 'human_development', 'meaning', 'systems_change'],
    levensgebieden: ['persoonlijke_groei', 'spiritualiteit', 'relaties'],
    contentPrompts: [
      'Psychology and human behavior insights',
      'Personal development and growth frameworks',
      'Spiritual practices and meaning-making',
      'Social systems and positive change',
      'Intuitive development and inner wisdom'
    ],
    avoidancePatterns: ['surface_level_networking', 'purely_materialistic_content', 'aggressive_sales']
  },
  
  ENFP: {
    preferredTypes: ['video', 'podcast', 'community_post'],
    focusAreas: ['people', 'possibilities', 'inspiration', 'variety'],
    levensgebieden: ['relaties', 'creativiteit', 'persoonlijke_groei'],
    contentPrompts: [
      'Inspiring stories of personal transformation',
      'Creative collaboration and team dynamics',
      'Possibility thinking and future visioning',
      'People-centered innovation and social impact',
      'Communication skills and relationship building'
    ],
    avoidancePatterns: ['repetitive_routines', 'purely_technical_content', 'isolation_focused']
  },
  
  ENFJ: {
    preferredTypes: ['course', 'podcast', 'article'],
    focusAreas: ['teaching', 'development', 'community', 'growth'],
    levensgebieden: ['relaties', 'werk', 'persoonlijke_groei'],
    contentPrompts: [
      'Teaching and mentoring methodologies',
      'Community building and group dynamics',
      'Personal and professional development strategies',
      'Communication and influence techniques',
      'Social impact and positive change initiatives'
    ],
    avoidancePatterns: ['purely_individual_focus', 'conflict_avoidance_only', 'impersonal_systems']
  },

  // Sentinels (SJ)
  ISTJ: {
    preferredTypes: ['book', 'course', 'research'],
    focusAreas: ['proven_methods', 'systematic_approaches', 'reliability', 'expertise'],
    levensgebieden: ['werk', 'studie', 'gezondheid'],
    contentPrompts: [
      'Proven methodologies and best practices',
      'Systematic approaches to skill development',
      'Reliable frameworks for consistent results',
      'Evidence-based strategies and techniques',
      'Traditional wisdom updated for modern contexts'
    ],
    avoidancePatterns: ['unproven_trends', 'constant_change', 'overly_theoretical']
  },
  
  ISFJ: {
    preferredTypes: ['article', 'course', 'community_post'],
    focusAreas: ['helping_others', 'practical_care', 'harmony', 'service'],
    levensgebieden: ['relaties', 'gezondheid', 'persoonlijke_groei'],
    contentPrompts: [
      'Practical ways to help and support others',
      'Maintaining harmony in relationships and groups',
      'Service-oriented approaches to personal fulfillment',
      'Caring communication and emotional support',
      'Health and wellness practices for families'
    ],
    avoidancePatterns: ['aggressive_confrontation', 'purely_selfish_content', 'disruptive_change']
  },
  
  ESTJ: {
    preferredTypes: ['course', 'article', 'podcast'],
    focusAreas: ['management', 'efficiency', 'results', 'organization'],
    levensgebieden: ['werk', 'persoonlijke_groei', 'gezondheid'],
    contentPrompts: [
      'Management and organizational excellence',
      'Efficiency and productivity optimization',
      'Results-driven leadership strategies',
      'Systematic approaches to goal achievement',
      'Team coordination and project management'
    ],
    avoidancePatterns: ['unstructured_approaches', 'purely_theoretical', 'inefficient_processes']
  },
  
  ESFJ: {
    preferredTypes: ['article', 'podcast', 'community_post'],
    focusAreas: ['relationships', 'community', 'support', 'harmony'],
    levensgebieden: ['relaties', 'gezondheid', 'creativiteit'],
    contentPrompts: [
      'Building strong relationships and communities',
      'Supporting others through challenges',
      'Creating harmony in group settings',
      'Social skills and emotional intelligence',
      'Family and community wellness practices'
    ],
    avoidancePatterns: ['impersonal_systems', 'conflict_heavy_content', 'isolation_focused']
  },

  // Explorers (SP)
  ISTP: {
    preferredTypes: ['video', 'article', 'research'],
    focusAreas: ['practical_skills', 'hands_on', 'troubleshooting', 'tools'],
    levensgebieden: ['hobby', 'werk', 'gezondheid'],
    contentPrompts: [
      'Hands-on skill development and craftsmanship',
      'Practical troubleshooting and problem-solving',
      'Tool mastery and technical expertise',
      'Independent learning and skill acquisition',
      'Efficient approaches to practical challenges'
    ],
    avoidancePatterns: ['overly_theoretical', 'long_commitments', 'group_focused_only']
  },
  
  ISFP: {
    preferredTypes: ['video', 'article', 'book'],
    focusAreas: ['personal_expression', 'aesthetics', 'values', 'gentle_learning'],
    levensgebieden: ['creativiteit', 'persoonlijke_groei', 'hobby'],
    contentPrompts: [
      'Artistic expression and creative techniques',
      'Personal values exploration and alignment',
      'Gentle approaches to personal growth',
      'Aesthetic appreciation and design thinking',
      'Individual creative projects and inspiration'
    ],
    avoidancePatterns: ['high_pressure_environments', 'competitive_content', 'aggressive_approaches']
  },
  
  ESTP: {
    preferredTypes: ['video', 'podcast', 'article'],
    focusAreas: ['action_oriented', 'practical_results', 'social_engagement', 'variety'],
    levensgebieden: ['hobby', 'relaties', 'werk'],
    contentPrompts: [
      'Action-oriented approaches to challenges',
      'Practical results and immediate application',
      'Social engagement and networking strategies',
      'Variety in learning and skill development',
      'Dynamic and interactive content formats'
    ],
    avoidancePatterns: ['lengthy_theory_only', 'isolation_required', 'abstract_only_concepts']
  },
  
  ESFP: {
    preferredTypes: ['video', 'podcast', 'community_post'],
    focusAreas: ['people_focused', 'entertainment', 'positive_energy', 'social_connection'],
    levensgebieden: ['relaties', 'creativiteit', 'hobby'],
    contentPrompts: [
      'People-focused and socially engaging content',
      'Entertaining and energizing approaches',
      'Positive energy and motivation techniques',
      'Social connection and relationship building',
      'Creative expression in group settings'
    ],
    avoidancePatterns: ['heavy_criticism', 'purely_analytical', 'isolation_heavy']
  }
};

// External Content Sources Configuration
const CONTENT_SOURCES = {
  educational: {
    coursera: 'https://www.coursera.org',
    edx: 'https://www.edx.org',
    udemy: 'https://www.udemy.com',
    khan_academy: 'https://www.khanacademy.org',
    masterclass: 'https://www.masterclass.com'
  },
  research: {
    arxiv: 'https://arxiv.org',
    pubmed: 'https://pubmed.ncbi.nlm.nih.gov',
    google_scholar: 'https://scholar.google.com',
    research_gate: 'https://www.researchgate.net'
  },
  content: {
    medium: 'https://medium.com',
    substack: 'https://substack.com',
    youtube: 'https://www.youtube.com',
    ted: 'https://www.ted.com',
    spotify_podcasts: 'https://open.spotify.com'
  },
  community: {
    reddit: 'https://www.reddit.com',
    discord: 'https://discord.com',
    goodreads: 'https://www.goodreads.com',
    linkedin: 'https://www.linkedin.com'
  }
};

class ContentDiscoveryChatLLMService {
  
  // ============================================================================
  // CONTENT DISCOVERY GENERATION
  // ============================================================================
  
  /**
   * Generate personalized content recommendations based on MBTI and preferences
   */
  async generatePersonalizedFeed(
    userId: string,
    mbtiType: string,
    config: Partial<ContentDiscoveryConfig> = {}
  ): Promise<PersonalizedContentFeed> {
    
    try {
      const defaultConfig: ContentDiscoveryConfig = {
        mbtiType,
        preferredLevensgebieden: ['persoonlijke_groei', 'werk', 'relaties'],
        contentTypes: ['article', 'course', 'video'],
        difficultyLevels: ['beginner', 'intermediate'],
        languages: ['nl', 'en'],
        maxResults: 20,
        freshnessPeriod: 7,
        qualityThreshold: 70
      };
      
      const finalConfig = { ...defaultConfig, ...config };
      const template = MBTI_CONTENT_TEMPLATES[mbtiType as keyof typeof MBTI_CONTENT_TEMPLATES];
      
      if (!template) {
        throw new Error(`No content template found for MBTI type: ${mbtiType}`);
      }
      
      // Get user's content history and preferences
      const userPreferences = await this.getUserContentPreferences(userId);
      const contentHistory = await this.getUserContentHistory(userId);
      
      // Prepare content discovery prompt
      const discoveryPrompt = this.buildContentDiscoveryPrompt(
        mbtiType,
        template,
        finalConfig,
        userPreferences,
        contentHistory
      );
      
      // Generate content recommendations via ChatLLM
      const contentResponse = await chatLLMService.processContentCuration(
        template.focusAreas,
        userPreferences.difficultyPreference || 'intermediate',
        `${userPreferences.timeAvailable || 30} minutes`,
        mbtiType,
        {}
      );
      
      const recommendedContent = this.parseContentRecommendations(
        contentResponse.result?.response || '',
        mbtiType,
        template
      );
      
      // Enrich content with external metadata
      const enrichedContent = await this.enrichContentWithMetadata(recommendedContent);
      
      // Filter and rank content
      const rankedContent = this.rankContentByRelevance(
        enrichedContent,
        mbtiType,
        userPreferences,
        finalConfig
      );
      
      // Create personalized feed
      const personalizedFeed: PersonalizedContentFeed = {
        userId,
        generatedAt: new Date(),
        feedType: 'discovery',
        items: rankedContent.slice(0, finalConfig.maxResults),
        totalItems: rankedContent.length,
        curationReasoning: this.generateCurationReasoning(mbtiType, template, finalConfig),
        nextUpdateTime: new Date(Date.now() + (finalConfig.freshnessPeriod * 24 * 60 * 60 * 1000))
      };
      
      // Save feed to database
      await this.savePersonalizedFeed(personalizedFeed);
      
      return personalizedFeed;
      
    } catch (error) {
      console.error('Error generating personalized content feed:', error);
      throw error;
    }
  }
  
  /**
   * Generate content recommendations from trending community topics
   */
  async generateTrendingContentFeed(
    mbtiType: string,
    timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly'
  ): Promise<PersonalizedContentFeed> {
    
    try {
      const template = MBTI_CONTENT_TEMPLATES[mbtiType as keyof typeof MBTI_CONTENT_TEMPLATES];
      
      // Get trending topics from community
      const trendingTopics = await this.getCommunityTrendingTopics(timeframe);
      
      // Filter topics relevant to MBTI type
      const relevantTopics = this.filterTopicsForMBTI(trendingTopics, mbtiType, template);
      
      // Generate content based on trending topics
      const trendingPrompt = `
        Genereer content aanbevelingen voor ${mbtiType} gebaseerd op trending topics:
        
        Trending Topics:
        ${relevantTopics.map(topic => `- ${topic.title}: ${topic.description} (${topic.engagement} engagement)`).join('\n')}
        
        MBTI Focus Areas: ${template.focusAreas.join(', ')}
        Preferred Content Types: ${template.preferredTypes.join(', ')}
        
        Zoek naar content die:
        1. Aansluit bij trending onderwerpen
        2. Past bij ${mbtiType} cognitieve functies
        3. Praktisch toepasbaar is
        4. Hoge kwaliteit heeft
        5. Recent gepubliceerd is (< 30 dagen)
        
        Geef 15-20 specifieke content aanbevelingen met titels, beschrijvingen en bronnen.
      `;
      
      const trendingResponse = await chatLLMService.processContentCuration(
        template.focusAreas,
        'intermediate',
        '30 minutes',
        mbtiType,
        {}
      );
      
      const trendingContent = this.parseContentRecommendations(
        trendingResponse.result?.response || '',
        mbtiType,
        template
      );
      
      const feed: PersonalizedContentFeed = {
        userId: 'trending',
        generatedAt: new Date(),
        feedType: timeframe === 'daily' ? 'daily' : 'weekly',
        items: trendingContent,
        totalItems: trendingContent.length,
        curationReasoning: `Trending content gecureerd voor ${mbtiType} op basis van community engagement en relevantie`,
        nextUpdateTime: new Date(Date.now() + (timeframe === 'daily' ? 24 : 168) * 60 * 60 * 1000)
      };
      
      return feed;
      
    } catch (error) {
      console.error('Error generating trending content feed:', error);
      throw error;
    }
  }
  
  /**
   * Discover content from external sources based on user interests
   */
  async discoverExternalContent(
    searchQuery: string,
    mbtiType: string,
    sources: string[] = ['medium', 'youtube', 'coursera']
  ): Promise<ContentItem[]> {
    
    try {
      const template = MBTI_CONTENT_TEMPLATES[mbtiType as keyof typeof MBTI_CONTENT_TEMPLATES];
      const discoveredContent: ContentItem[] = [];
      
      // Search each external source
      for (const source of sources) {
        const sourceContent = await this.searchExternalSource(source, searchQuery, mbtiType);
        discoveredContent.push(...sourceContent);
      }
      
      // Analyze and rank discovered content
      const analysisPrompt = `
        Analyseer deze gevonden content voor ${mbtiType}:
        
        ${discoveredContent.map(item => `
        - ${item.title}
        - ${item.description}
        - Source: ${item.source}
        - Type: ${item.contentType}
        `).join('\n')}
        
        MBTI Profile:
        - Type: ${mbtiType}
        - Focus Areas: ${template.focusAreas.join(', ')}
        - Preferred Content: ${template.preferredTypes.join(', ')}
        - Avoidance Patterns: ${template.avoidancePatterns.join(', ')}
        
        Voor elk content item, geef:
        1. Relevantie score (0-100) voor ${mbtiType}
        2. Reden waarom het wel/niet past
        3. Welke levensgebieden het ondersteunt
        4. Aanbevolen moeilijkheidsgraad
        5. Geschatte tijd investering
      `;
      
      const analysisResponse = await chatLLMService.processContentCuration(
        [searchQuery],
        'intermediate',
        '30 minutes',
        mbtiType,
        {}
      );
      
      // Parse analysis and update content items
      const analyzedContent = this.parseContentAnalysis(
        analysisResponse.result?.response || '',
        discoveredContent,
        mbtiType
      );
      
      // Filter high-quality, relevant content
      const qualityContent = analyzedContent.filter(item => 
        item.qualityScore >= 70 && 
        item.mbtiRelevance.relevanceScore >= 60
      );
      
      return qualityContent.sort((a, b) => 
        b.mbtiRelevance.relevanceScore - a.mbtiRelevance.relevanceScore
      );
      
    } catch (error) {
      console.error('Error discovering external content:', error);
      throw error;
    }
  }
  
  // ============================================================================
  // HELPER METHODS
  // ============================================================================
  
  private buildContentDiscoveryPrompt(
    mbtiType: string,
    template: any,
    config: ContentDiscoveryConfig,
    userPreferences: any,
    contentHistory: any
  ): string {
    return `
      Genereer gepersonaliseerde content aanbevelingen voor ${mbtiType}:
      
      MBTI Profiel:
      - Type: ${mbtiType}
      - Focus Areas: ${template.focusAreas.join(', ')}
      - Preferred Content: ${template.preferredTypes.join(', ')}
      - Levensgebieden: ${template.levensgebieden.join(', ')}
      - Avoidance Patterns: ${template.avoidancePatterns.join(', ')}
      
      User Voorkeuren:
      - Preferred Levensgebieden: ${config.preferredLevensgebieden.join(', ')}
      - Content Types: ${config.contentTypes.join(', ')}
      - Difficulty Levels: ${config.difficultyLevels.join(', ')}
      - Quality Threshold: ${config.qualityThreshold}%
      
      Content Prompts voor ${mbtiType}:
      ${template.contentPrompts.map((prompt: string, i: number) => `${i + 1}. ${prompt}`).join('\n')}
      
      Vorige Content Interacties:
      ${contentHistory?.recentViews ? 
        contentHistory.recentViews.map((item: any) => `- ${item.title} (${item.rating}/5)`).join('\n') 
        : 'Geen eerdere content geschiedenis'}
      
      Zoek naar content die:
      1. Perfect aansluit bij ${mbtiType} cognitieve functies
      2. Praktisch toepasbaar is in dagelijks leven
      3. Hoge kwaliteit en betrouwbare bronnen heeft
      4. Recent en up-to-date is
      5. Varieert in format voor verschillende leervoorkeuren
      
      Geef ${config.maxResults} specifieke aanbevelingen met:
      - Exacte titel en beschrijving
      - Content type en bron
      - Waarom het perfect is voor ${mbtiType}
      - Welke levensgebieden het ondersteunt
      - Geschatte tijd en moeilijkheidsgraad
      - Directe actie die de user kan ondernemen
    `;
  }
  
  private parseContentRecommendations(
    response: string,
    mbtiType: string,
    template: any
  ): ContentItem[] {
    const contentItems: ContentItem[] = [];
    
    try {
      // Parse the ChatLLM response into structured content items
      const lines = response.split('\n');
      let currentItem: Partial<ContentItem> = {};
      
      for (const line of lines) {
        if (line.includes('Title:') || line.includes('Titel:')) {
          if (currentItem.title) {
            contentItems.push(this.finalizeContentItem(currentItem, mbtiType, template));
            currentItem = {};
          }
          currentItem.title = line.split(':').slice(1).join(':').trim();
        } else if (line.includes('Description:') || line.includes('Beschrijving:')) {
          currentItem.description = line.split(':').slice(1).join(':').trim();
        } else if (line.includes('Type:')) {
          const typeText = line.split(':')[1].trim().toLowerCase();
          currentItem.contentType = this.mapContentType(typeText);
        } else if (line.includes('Source:') || line.includes('Bron:')) {
          currentItem.source = line.split(':').slice(1).join(':').trim();
        } else if (line.includes('URL:')) {
          currentItem.url = line.split(':').slice(1).join(':').trim();
        }
      }
      
      // Add the last item
      if (currentItem.title) {
        contentItems.push(this.finalizeContentItem(currentItem, mbtiType, template));
      }
      
      return contentItems;
      
    } catch (error) {
      console.error('Error parsing content recommendations:', error);
      return [];
    }
  }
  
  private finalizeContentItem(
    item: Partial<ContentItem>,
    mbtiType: string,
    template: any
  ): ContentItem {
    return {
      id: `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: item.title || 'Untitled Content',
      description: item.description || 'No description available',
      contentType: item.contentType || 'article',
      url: item.url || '#',
      source: item.source || 'Unknown',
      tags: this.generateTags(item.title || '', item.description || '', template),
      mbtiRelevance: {
        primaryTypes: [mbtiType],
        secondaryTypes: this.getRelatedMBTITypes(mbtiType),
        cognitiveFunction: this.getPrimaryCognitiveFunction(mbtiType),
        relevanceScore: 85, // Default high relevance for generated content
        reasoning: `Specifically curated for ${mbtiType} based on cognitive functions and preferences`
      },
      levensgebiedCategories: this.mapToLevensgebieden(item.title || '', item.description || '', template),
      difficulty: this.determineDifficulty(item.description || ''),
      estimatedReadTime: this.estimateReadTime(item.description || '', item.contentType || 'article'),
      qualityScore: 85, // Default high quality for curated content
      communityRating: 0, // Will be updated based on community feedback
      discoveredAt: new Date(),
      lastUpdated: new Date()
    };
  }
  
  private mapContentType(typeText: string): ContentItem['contentType'] {
    if (typeText.includes('course') || typeText.includes('cursus')) return 'course';
    if (typeText.includes('video')) return 'video';
    if (typeText.includes('podcast')) return 'podcast';
    if (typeText.includes('book') || typeText.includes('boek')) return 'book';
    if (typeText.includes('research') || typeText.includes('onderzoek')) return 'research';
    if (typeText.includes('community') || typeText.includes('gemeenschap')) return 'community_post';
    return 'article';
  }
  
  private generateTags(title: string, description: string, template: any): string[] {
    const tags = new Set<string>();
    
    // Add MBTI-related tags
    template.focusAreas.forEach((area: string) => tags.add(area));
    template.levensgebieden.forEach((gebied: string) => tags.add(gebied));
    
    // Extract keywords from title and description
    const text = `${title} ${description}`.toLowerCase();
    const keywords = [
      'leadership', 'creativity', 'mindfulness', 'productivity', 'communication',
      'psychology', 'innovation', 'relationships', 'growth', 'learning',
      'strategy', 'development', 'wellness', 'career', 'spirituality'
    ];
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) tags.add(keyword);
    });
    
    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }
  
  private getRelatedMBTITypes(mbtiType: string): string[] {
    const typeMap: { [key: string]: string[] } = {
      'INTJ': ['INFJ', 'ENTJ', 'INTP'],
      'INTP': ['INTJ', 'ENTP', 'INFP'],
      'ENTJ': ['INTJ', 'ENFJ', 'ESTJ'],
      'ENTP': ['INTP', 'ENFP', 'ENTJ'],
      'INFP': ['ENFP', 'INFJ', 'ISFP'],
      'INFJ': ['INTJ', 'INFP', 'ENFJ'],
      'ENFP': ['INFP', 'ENTP', 'ENFJ'],
      'ENFJ': ['INFJ', 'ENFP', 'ENTJ'],
      'ISTJ': ['ISFJ', 'ESTJ', 'INTJ'],
      'ISFJ': ['ISTJ', 'ESFJ', 'INFJ'],
      'ESTJ': ['ISTJ', 'ENTJ', 'ESFJ'],
      'ESFJ': ['ISFJ', 'ESTJ', 'ENFJ'],
      'ISTP': ['ISFP', 'ESTP', 'INTP'],
      'ISFP': ['ISTP', 'ESFP', 'INFP'],
      'ESTP': ['ISTP', 'ESFP', 'ENTP'],
      'ESFP': ['ISFP', 'ESTP', 'ENFP']
    };
    
    return typeMap[mbtiType] || [];
  }
  
  private getPrimaryCognitiveFunction(mbtiType: string): string {
    const functionMap: { [key: string]: string } = {
      'INTJ': 'Ni', 'INTP': 'Ti', 'ENTJ': 'Te', 'ENTP': 'Ne',
      'INFP': 'Fi', 'INFJ': 'Ni', 'ENFP': 'Ne', 'ENFJ': 'Fe',
      'ISTJ': 'Si', 'ISFJ': 'Si', 'ESTJ': 'Te', 'ESFJ': 'Fe',
      'ISTP': 'Ti', 'ISFP': 'Fi', 'ESTP': 'Se', 'ESFP': 'Se'
    };
    
    return functionMap[mbtiType] || 'Unknown';
  }
  
  private mapToLevensgebieden(title: string, description: string, template: any): LevensgebiedCategory[] {
    const text = `${title} ${description}`.toLowerCase();
    const categories: LevensgebiedCategory[] = [];
    
    const mappings = {
      'werk': ['work', 'career', 'job', 'professional', 'business', 'leadership'],
      'relaties': ['relationship', 'communication', 'social', 'family', 'friendship'],
      'gezondheid': ['health', 'wellness', 'fitness', 'mental', 'physical', 'nutrition'],
      'hobby': ['hobby', 'interest', 'leisure', 'fun', 'entertainment', 'games'],
      'spiritualiteit': ['spiritual', 'meditation', 'mindfulness', 'philosophy', 'meaning'],
      'persoonlijke_groei': ['growth', 'development', 'learning', 'improvement', 'skills'],
      'creativiteit': ['creative', 'art', 'design', 'innovation', 'imagination'],
      'studie': ['study', 'education', 'research', 'academic', 'knowledge']
    };
    
    Object.entries(mappings).forEach(([category, keywords]) => {
      const matchCount = keywords.filter(keyword => text.includes(keyword)).length;
      if (matchCount > 0) {
        categories.push({
          category: category as LevensgebiedCategory['category'],
          relevanceScore: Math.min(100, matchCount * 25),
          applicationSuggestions: [`Apply insights to ${category} development`]
        });
      }
    });
    
    // Ensure at least one category from template
    if (categories.length === 0) {
      template.levensgebieden.forEach((gebied: string) => {
        categories.push({
          category: gebied as LevensgebiedCategory['category'],
          relevanceScore: 50,
          applicationSuggestions: [`General application to ${gebied}`]
        });
      });
    }
    
    return categories.slice(0, 3); // Limit to top 3 categories
  }
  
  private determineDifficulty(description: string): ContentItem['difficulty'] {
    const text = description.toLowerCase();
    
    if (text.includes('advanced') || text.includes('expert') || text.includes('complex')) {
      return 'advanced';
    } else if (text.includes('intermediate') || text.includes('detailed')) {
      return 'intermediate';
    } else if (text.includes('beginner') || text.includes('introduction') || text.includes('basic')) {
      return 'beginner';
    }
    
    return 'intermediate'; // Default
  }
  
  private estimateReadTime(description: string, contentType: string): number {
    const wordCount = description.split(' ').length;
    
    switch (contentType) {
      case 'article':
        return Math.max(5, Math.round(wordCount * 3)); // ~200 words per minute
      case 'video':
        return Math.max(10, Math.round(wordCount * 2)); // Longer format
      case 'course':
        return Math.max(60, Math.round(wordCount * 5)); // Much longer
      case 'podcast':
        return Math.max(20, Math.round(wordCount * 2));
      case 'book':
        return Math.max(300, Math.round(wordCount * 10)); // Substantial time investment
      default:
        return Math.max(5, Math.round(wordCount * 3));
    }
  }
  
  private async getUserContentPreferences(userId: string): Promise<any> {
    try {
      // Get user's content preferences from database
      const preferences = await queryDatabase(`
        SELECT * FROM user_content_preferences WHERE user_id = ?
      `, [userId]);
      
      return preferences[0] || {
        preferredTypes: ['article', 'video'],
        preferredTopics: [],
        difficultyPreference: 'intermediate',
        timeAvailable: 30 // minutes
      };
    } catch (error) {
      console.error('Error getting user content preferences:', error);
      return {};
    }
  }
  
  private async getUserContentHistory(userId: string): Promise<any> {
    try {
      // Get user's recent content interactions
      const history = await queryDatabase(`
        SELECT * FROM user_content_interactions 
        WHERE user_id = ? AND created_at > date('now', '-30 days')
        ORDER BY created_at DESC LIMIT 20
      `, [userId]);
      
      return {
        recentViews: history,
        totalInteractions: history.length,
        averageRating: history.reduce((sum: number, item: any) => sum + (item.rating || 0), 0) / history.length || 0
      };
    } catch (error) {
      console.error('Error getting user content history:', error);
      return { recentViews: [], totalInteractions: 0, averageRating: 0 };
    }
  }
  
  private async enrichContentWithMetadata(content: ContentItem[]): Promise<ContentItem[]> {
    // In a real implementation, this would call external APIs to get metadata
    // For now, we'll simulate enrichment
    return content.map(item => ({
      ...item,
      externalMetadata: {
        keywords: item.tags,
        abstract: item.description.substring(0, 200),
        userEngagement: {
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 1000),
          comments: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50)
        }
      }
    }));
  }
  
  private rankContentByRelevance(
    content: ContentItem[],
    mbtiType: string,
    userPreferences: any,
    config: ContentDiscoveryConfig
  ): ContentItem[] {
    return content.sort((a, b) => {
      // Multi-factor scoring
      const scoreA = this.calculateRelevanceScore(a, mbtiType, userPreferences, config);
      const scoreB = this.calculateRelevanceScore(b, mbtiType, userPreferences, config);
      
      return scoreB - scoreA;
    });
  }
  
  private calculateRelevanceScore(
    item: ContentItem,
    mbtiType: string,
    userPreferences: any,
    config: ContentDiscoveryConfig
  ): number {
    let score = 0;
    
    // MBTI relevance (40% weight)
    score += item.mbtiRelevance.relevanceScore * 0.4;
    
    // Quality score (25% weight)
    score += item.qualityScore * 0.25;
    
    // Content type preference (15% weight)
    if (config.contentTypes.includes(item.contentType)) {
      score += 100 * 0.15;
    }
    
    // Levensgebied relevance (10% weight)
    const levensgebiedMatch = item.levensgebiedCategories.some(cat => 
      config.preferredLevensgebieden.includes(cat.category)
    );
    if (levensgebiedMatch) {
      score += 100 * 0.1;
    }
    
    // Difficulty match (5% weight)
    if (config.difficultyLevels.includes(item.difficulty)) {
      score += 100 * 0.05;
    }
    
    // Community rating (5% weight)
    score += item.communityRating * 20 * 0.05;
    
    return score;
  }
  
  private generateCurationReasoning(
    mbtiType: string,
    template: any,
    config: ContentDiscoveryConfig
  ): string {
    return `
      Content gecureerd voor ${mbtiType} op basis van:
      - Cognitieve functies en natuurlijke voorkeuren
      - Focus areas: ${template.focusAreas.join(', ')}
      - Preferred content types: ${config.contentTypes.join(', ')}
      - Levensgebieden van interesse: ${config.preferredLevensgebieden.join(', ')}
      - Kwaliteitsdrempel: ${config.qualityThreshold}%
      - Vermijding van: ${template.avoidancePatterns.join(', ')}
    `;
  }
  
  private async savePersonalizedFeed(feed: PersonalizedContentFeed): Promise<void> {
    try {
      // Save feed to database for persistence
      await queryDatabase(`
        INSERT INTO user_content_feeds 
        (user_id, feed_data, generated_at, feed_type) 
        VALUES (?, ?, ?, ?)
      `, [
        feed.userId,
        JSON.stringify(feed),
        feed.generatedAt.toISOString(),
        feed.feedType
      ]);
    } catch (error) {
      console.error('Error saving personalized feed:', error);
    }
  }
  
  private async getCommunityTrendingTopics(timeframe: string): Promise<any[]> {
    // Mock implementation - in reality would query community engagement data
    return [
      {
        title: 'AI in Personal Development',
        description: 'Using AI tools for self-improvement and growth',
        engagement: 1250,
        category: 'persoonlijke_groei'
      },
      {
        title: 'Remote Work MBTI Strategies',
        description: 'MBTI-specific approaches to remote work success',
        engagement: 980,
        category: 'werk'
      },
      {
        title: 'Mindfulness for Different Personality Types',
        description: 'Tailored mindfulness practices by MBTI type',
        engagement: 875,
        category: 'spiritualiteit'
      }
    ];
  }
  
  private filterTopicsForMBTI(topics: any[], mbtiType: string, template: any): any[] {
    return topics.filter(topic => {
      const isRelevantCategory = template.levensgebieden.includes(topic.category);
      const isRelevantContent = template.focusAreas.some((area: string) => 
        topic.description.toLowerCase().includes(area.replace('_', ' '))
      );
      
      return isRelevantCategory || isRelevantContent;
    });
  }
  
  private async searchExternalSource(source: string, query: string, mbtiType: string): Promise<ContentItem[]> {
    // Mock implementation - in reality would use APIs to search external sources
    const mockContent: ContentItem[] = [
      {
        id: `external_${source}_${Date.now()}`,
        title: `${query} - ${source} result`,
        description: `High-quality content about ${query} from ${source}, tailored for ${mbtiType}`,
        contentType: 'article',
        url: `https://${source}.com/search?q=${encodeURIComponent(query)}`,
        source,
        tags: [query, mbtiType.toLowerCase()],
        mbtiRelevance: {
          primaryTypes: [mbtiType],
          secondaryTypes: [],
          cognitiveFunction: this.getPrimaryCognitiveFunction(mbtiType),
          relevanceScore: 75,
          reasoning: `External content matching search query for ${mbtiType}`
        },
        levensgebiedCategories: [],
        difficulty: 'intermediate',
        estimatedReadTime: 15,
        qualityScore: 70,
        communityRating: 0,
        discoveredAt: new Date(),
        lastUpdated: new Date()
      }
    ];
    
    return mockContent;
  }
  
  private parseContentAnalysis(response: string, content: ContentItem[], mbtiType: string): ContentItem[] {
    // Parse AI analysis and update content items with improved metadata
    // This is a simplified implementation
    return content.map(item => ({
      ...item,
      qualityScore: Math.min(100, item.qualityScore + Math.floor(Math.random() * 20)),
      mbtiRelevance: {
        ...item.mbtiRelevance,
        relevanceScore: Math.min(100, item.mbtiRelevance.relevanceScore + Math.floor(Math.random() * 15))
      }
    }));
  }
  
  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================
  
  /**
   * Get daily personalized content feed for user
   */
  async getDailyFeed(userId: string, mbtiType: string): Promise<PersonalizedContentFeed> {
    return this.generatePersonalizedFeed(userId, mbtiType, {
      maxResults: 10,
      freshnessPeriod: 1
    });
  }
  
  /**
   * Get weekly content discovery feed
   */
  async getWeeklyDiscoveryFeed(userId: string, mbtiType: string): Promise<PersonalizedContentFeed> {
    return this.generatePersonalizedFeed(userId, mbtiType, {
      maxResults: 25,
      freshnessPeriod: 7
    });
  }
  
  /**
   * Search for content on specific topic
   */
  async searchContentByTopic(
    topic: string,
    mbtiType: string,
    options: Partial<ContentDiscoveryConfig> = {}
  ): Promise<ContentItem[]> {
    return this.discoverExternalContent(topic, mbtiType, options.contentTypes);
  }
  
  /**
   * Get trending content for MBTI type
   */
  async getTrendingContent(mbtiType: string): Promise<PersonalizedContentFeed> {
    return this.generateTrendingContentFeed(mbtiType, 'weekly');
  }

  // ===================================
  // 🤖 AI ORCHESTRATION INTEGRATION
  // ===================================

  /**
   * 🧠 AI-Powered Content Discovery using Priority #6 Orchestration
   * Leverages the three-tier AI system for intelligent content recommendations
   */
  async discoverContentWithAI(
    userQuery: string,
    userId: string,
    mbtiType: string,
    preferences: {
      levensgebieden?: string[];
      contentTypes?: string[];
      difficulty?: string;
      freshness?: number; // days
    } = {}
  ): Promise<{
    success: boolean;
    content_recommendations?: ContentItem[];
    ai_reasoning?: string;
    confidence?: number;
    curation_strategy?: string;
    error?: string;
  }> {
    try {
      console.log('🤖 Starting AI-powered content discovery...');

      // Step 1: Use AI orchestration to understand user intent and generate search strategy
      const aiResponse = await chatLLMService.contentDiscovery(
        `User query: "${userQuery}". 
         MBTI Type: ${mbtiType}. 
         Preferred areas: ${preferences.levensgebieden?.join(', ') || 'all'}.
         Content types: ${preferences.contentTypes?.join(', ') || 'all'}.
         
         Please analyze this request and suggest:
         1. Specific search keywords and topics
         2. Content types that would be most valuable
         3. Difficulty level recommendations
         4. MBTI-specific considerations for this user
         5. Levensgebieden connections`,
        userId,
        mbtiType,
        {
          preferences,
          discovery_context: 'content_search',
          current_query: userQuery
        }
      );

      if (!aiResponse.success) {
        return {
          success: false,
          error: `AI orchestration failed: ${aiResponse.error}`
        };
      }

      console.log('✅ AI orchestration successful, processing recommendations...');

      // Step 2: Parse AI recommendations and extract search parameters
      const aiGuidance = aiResponse.response || '';
      const searchKeywords = this.extractSearchKeywords(aiGuidance, userQuery);
      const recommendedTypes = this.extractContentTypes(aiGuidance, preferences.contentTypes);
      const difficultyLevel = this.extractDifficultyLevel(aiGuidance, preferences.difficulty);

      // Step 3: Search for content using AI-enhanced parameters
      const discoveredContent: ContentItem[] = [];

      // Search with multiple strategies suggested by AI
      for (const keyword of searchKeywords.slice(0, 3)) { // Limit to top 3 keywords
        try {
          const keywordContent = await this.discoverExternalContent(
            keyword,
            mbtiType,
            recommendedTypes
          );
          discoveredContent.push(...keywordContent.slice(0, 5)); // Top 5 per keyword
        } catch (error) {
          console.warn(`Failed to search for keyword: ${keyword}`, error);
        }
      }

      // Step 4: Apply AI-enhanced filtering and ranking
      const filteredContent = this.applyAIFiltering(
        discoveredContent,
        mbtiType,
        aiGuidance,
        preferences
      );

      // Step 5: Enhance content items with AI insights
      const enhancedContent = await this.enhanceContentWithAI(
        filteredContent,
        mbtiType,
        aiResponse.individual_responses || []
      );

      return {
        success: true,
        content_recommendations: enhancedContent.slice(0, 10), // Top 10 recommendations
        ai_reasoning: aiResponse.reasoning || 'AI-powered content curation based on MBTI type and preferences',
        confidence: aiResponse.confidence || 0.8,
        curation_strategy: `Three-tier AI analysis: ${aiResponse.mode || 'hybrid'} mode`
      };

    } catch (error) {
      console.error('❌ AI Content Discovery Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AI content discovery failed'
      };
    }
  }

  /**
   * Extract search keywords from AI guidance
   */
  private extractSearchKeywords(aiGuidance: string, originalQuery: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP
    const keywords = [originalQuery]; // Always include original query
    
    // Look for keyword patterns in AI response
    const keywordMatches = aiGuidance.match(/keywords?:?\s*([^.]+)/gi);
    if (keywordMatches) {
      keywordMatches.forEach(match => {
        const extracted = match.replace(/keywords?:?\s*/gi, '').split(',').map(k => k.trim());
        keywords.push(...extracted);
      });
    }

    // Add domain-specific keywords based on content
    if (aiGuidance.toLowerCase().includes('personal development')) keywords.push('personal development');
    if (aiGuidance.toLowerCase().includes('leadership')) keywords.push('leadership');
    if (aiGuidance.toLowerCase().includes('creativity')) keywords.push('creativity');
    if (aiGuidance.toLowerCase().includes('mindfulness')) keywords.push('mindfulness');

    return Array.from(new Set(keywords.filter(k => k.length > 2))); // Remove duplicates and very short keywords
  }

  /**
   * Extract recommended content types from AI guidance
   */
  private extractContentTypes(aiGuidance: string, preferredTypes?: string[]): string[] {
    const defaultTypes = ['article', 'course', 'video', 'podcast', 'book'];
    
    if (preferredTypes && preferredTypes.length > 0) {
      return preferredTypes;
    }

    const recommendedTypes: string[] = [];
    
    // Extract type recommendations from AI response
    if (aiGuidance.toLowerCase().includes('video')) recommendedTypes.push('video');
    if (aiGuidance.toLowerCase().includes('course')) recommendedTypes.push('course');
    if (aiGuidance.toLowerCase().includes('article')) recommendedTypes.push('article');
    if (aiGuidance.toLowerCase().includes('podcast')) recommendedTypes.push('podcast');
    if (aiGuidance.toLowerCase().includes('book')) recommendedTypes.push('book');

    return recommendedTypes.length > 0 ? recommendedTypes : defaultTypes;
  }

  /**
   * Extract difficulty level from AI guidance
   */
  private extractDifficultyLevel(aiGuidance: string, preferredDifficulty?: string): string {
    if (preferredDifficulty) return preferredDifficulty;

    if (aiGuidance.toLowerCase().includes('beginner')) return 'beginner';
    if (aiGuidance.toLowerCase().includes('advanced')) return 'advanced';
    if (aiGuidance.toLowerCase().includes('expert')) return 'expert';
    
    return 'intermediate'; // Default
  }

  /**
   * Apply AI-enhanced filtering to content
   */
  private applyAIFiltering(
    content: ContentItem[],
    mbtiType: string,
    aiGuidance: string,
    preferences: any
  ): ContentItem[] {
    return content
      .filter(item => {
        // Basic quality filter
        if (item.qualityScore < 60) return false;
        
        // MBTI relevance filter
        if (item.mbtiRelevance && item.mbtiRelevance.relevanceScore < 50) return false;
        
        // AI guidance-based filtering
        const itemText = `${item.title} ${item.description}`.toLowerCase();
        const guidanceKeywords = this.extractSearchKeywords(aiGuidance, '').map(k => k.toLowerCase());
        
        // Check if content aligns with AI recommendations
        const hasRelevantKeywords = guidanceKeywords.some(keyword => 
          itemText.includes(keyword.toLowerCase())
        );
        
        return hasRelevantKeywords;
      })
      .sort((a, b) => {
        // Sort by AI-enhanced relevance score
        const aScore = (a.qualityScore * 0.4) + (a.mbtiRelevance?.relevanceScore || 0) * 0.6;
        const bScore = (b.qualityScore * 0.4) + (b.mbtiRelevance?.relevanceScore || 0) * 0.6;
        return bScore - aScore;
      });
  }

  /**
   * Enhance content items with AI system insights
   */
  private async enhanceContentWithAI(
    content: ContentItem[],
    mbtiType: string,
    aiResponses: Array<{ system: string; response: string; confidence: number }>
  ): Promise<ContentItem[]> {
    return content.map(item => {
      // Add AI-generated enhancement metadata
      const aiEnhancement = {
        aesthetic_appeal: this.extractAestheticInsights(item, aiResponses),
        cognitive_relevance: this.extractCognitiveInsights(item, aiResponses, mbtiType),
        ethical_consideration: this.extractEthicalInsights(item, aiResponses)
      };

      return {
        ...item,
        externalMetadata: {
          ...item.externalMetadata,
          keywords: item.externalMetadata?.keywords || [],
          ai_enhancement: aiEnhancement,
          enhanced_by: 'ai_orchestration_v1',
          enhancement_timestamp: new Date().toISOString()
        }
      } as ContentItem;
    });
  }

  private extractAestheticInsights(item: ContentItem, aiResponses: any[]): string {
    const aestheticResponse = aiResponses.find(r => r.system === 'aesthetic');
    return aestheticResponse?.response || 'Visually appealing and engaging presentation';
  }

  private extractCognitiveInsights(item: ContentItem, aiResponses: any[], mbtiType: string): string {
    const cognitiveResponse = aiResponses.find(r => r.system === 'cognitive');
    return cognitiveResponse?.response || `Cognitively aligned with ${mbtiType} thinking patterns`;
  }

  private extractEthicalInsights(item: ContentItem, aiResponses: any[]): string {
    const ethicalResponse = aiResponses.find(r => r.system === 'ethical');
    return ethicalResponse?.response || 'Ethically sound and value-aligned content';
  }
}

export const contentDiscoveryChatLLMService = new ContentDiscoveryChatLLMService();
export default contentDiscoveryChatLLMService;
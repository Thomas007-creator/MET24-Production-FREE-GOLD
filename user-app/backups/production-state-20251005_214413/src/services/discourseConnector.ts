/**
 * 🚀 DISCOURSE DIRECT CONNECTOR SERVICE
 * 
 * Naadloze integratie tussen MET24 PWA en Discourse Community
 * Directe navigatie van PWA knoppen naar specifieke Discourse pagina's
 */

import { logger } from '../utils/logger';
import { useAppStore } from '../store/useAppStore';

export interface DiscourseConfig {
  baseUrl: string;
  ssoSecret: string;
  categories: {
    [key: string]: {
      id: number;
      slug: string;
      name: string;
      description: string;
    };
  };
}

class DiscourseConnectorService {
  private config: DiscourseConfig;

  constructor() {
    this.config = {
      baseUrl: 'https://community.your-future-self.app',
      ssoSecret: process.env.REACT_APP_DISCOURSE_SSO_SECRET || '',
      categories: {
        // MBTI Type specifieke categorieën
        'INTJ': { id: 1, slug: 'intj-strategists', name: 'INTJ Strategen', description: 'Voor visionairs en planners' },
        'ENFP': { id: 2, slug: 'enfp-champions', name: 'ENFP Champions', description: 'Voor enthousiaste inspireerders' },
        'ISFJ': { id: 3, slug: 'isfj-protectors', name: 'ISFJ Beschermers', description: 'Voor zorgzame supporters' },
        'ESTP': { id: 4, slug: 'estp-entrepreneurs', name: 'ESTP Ondernemers', description: 'Voor energieke doeners' },
        
        // Algemene coaching categorieën
        'general-chat': { id: 10, slug: 'general-chat', name: 'Algemene Chat', description: 'Open discussies' },
        'coaching-support': { id: 11, slug: 'coaching-support', name: 'Coaching Support', description: 'Hulp en advies' },
        'goal-sharing': { id: 12, slug: 'goal-sharing', name: 'Doelen Delen', description: 'Deel je ambities' },
        'success-stories': { id: 13, slug: 'success-stories', name: 'Succesverhalen', description: 'Inspirerende verhalen' },
        'challenges': { id: 14, slug: 'daily-challenges', name: 'Dagelijkse Challenges', description: 'Samen groeien' },
        'wellness': { id: 15, slug: 'holistic-wellness', name: 'Holistisch Welzijn', description: 'Gezondheid en balans' },
        
        // AI en technologie
        'ai-insights': { id: 20, slug: 'ai-insights', name: 'AI Inzichten', description: 'Leer van AI coaching' },
        'feature-requests': { id: 21, slug: 'feature-requests', name: 'Feature Verzoeken', description: 'Help MET24 verbeteren' }
      }
    };
  }

  /**
   * 🎯 DIRECTE NAVIGATIE - CHAT KNOP
   * Van MainView "Chat" knop → Direct naar persoonlijke chat categorieën
   */
  navigateToChat(mbtiType?: string): void {
    try {
      logger.info('Discourse Chat Navigation', { mbtiType });
      
      // Als gebruiker een MBTI type heeft, ga naar type-specifieke chat
      if (mbtiType && this.config.categories[mbtiType]) {
        const category = this.config.categories[mbtiType];
        this.openDiscourseCategory(category.slug, {
          title: `💬 ${category.name} Chat`,
          description: `Connect met andere ${mbtiType} types`
        });
      } else {
        // Anders naar algemene chat
        this.openDiscourseCategory('general-chat', {
          title: '💬 Community Chat',
          description: 'Praat met de hele MET24 community'
        });
      }
      
    } catch (error) {
      logger.error('Discourse chat navigation error:', { error: error instanceof Error ? error.message : String(error) });
      this.fallbackToMET24Chat();
    }
  }

  /**
   * 👥 DIRECTE NAVIGATIE - COMMUNITY'S KNOP  
   * Van MainView "Community's" knop → Direct naar MBTI community overzicht
   */
  navigateToCommunities(mbtiType?: string): void {
    try {
      logger.info('Discourse Communities Navigation', { mbtiType });
      
      if (mbtiType && this.config.categories[mbtiType]) {
        // Direct naar je eigen MBTI type community
        const category = this.config.categories[mbtiType];
        this.openDiscourseCategory(category.slug, {
          title: `👥 ${category.name} Community`,
          description: `Exclusief voor ${mbtiType} types`
        });
      } else {
        // Naar community overzicht met alle MBTI types
        this.openDiscourseUrl('/categories', {
          title: '👥 Alle Community\'s',
          description: 'Ontdek alle MBTI communities'
        });
      }
      
    } catch (error) {
      logger.error('Discourse communities navigation error:', { error: error instanceof Error ? error.message : String(error) });
      this.fallbackToMET24Communities();
    }
  }

  /**
   * 🎯 DIRECTE NAVIGATIE - CHALLENGES KNOP
   * Van MainView "Challenges" knop → Direct naar dagelijkse challenges
   */
  navigateToChallenges(): void {
    try {
      logger.info('Discourse Challenges Navigation');
      
      this.openDiscourseCategory('daily-challenges', {
        title: '🎯 Dagelijkse Challenges',
        description: 'Doe mee met community challenges'
      });
      
    } catch (error) {
      logger.error('Discourse challenges navigation error:', { error: error instanceof Error ? error.message : String(error) });
      this.fallbackToMET24Route('/challenges');
    }
  }

  /**
   * 🏥 DIRECTE NAVIGATIE - WELLNESS KNOP  
   * Van Wellness features → Direct naar wellness community
   */
  navigateToWellness(): void {
    try {
      logger.info('Discourse Wellness Navigation');
      
      this.openDiscourseCategory('holistic-wellness', {
        title: '🏥 Holistisch Welzijn Community',
        description: 'Deel je wellness journey'
      });
      
    } catch (error) {
      logger.error('Discourse wellness navigation error:', { error: error instanceof Error ? error.message : String(error) });
      this.fallbackToMET24Route('/holistic-wellness');
    }
  }

  /**
   * 🤖 DIRECTE NAVIGATIE - AI INSIGHTS
   * Van AI coaching features → Direct naar AI insights community
   */
  navigateToAIInsights(): void {
    try {
      logger.info('Discourse AI Insights Navigation');
      
      this.openDiscourseCategory('ai-insights', {
        title: '🤖 AI Coaching Inzichten',
        description: 'Deel je AI coaching ervaringen'
      });
      
    } catch (error) {
      logger.error('Discourse AI insights navigation error:', { error: error instanceof Error ? error.message : String(error) });
      this.fallbackToMET24Route('/ai-buddy');
    }
  }

  /**
   * 📊 DIRECTE NAVIGATIE - SUCCESS STORIES
   * Van Analytics/Progress → Direct naar succesverhalen delen
   */
  navigateToSuccessStories(): void {
    try {
      logger.info('Discourse Success Stories Navigation');
      
      this.openDiscourseCategory('success-stories', {
        title: '📊 Succesverhalen',
        description: 'Inspireer anderen met je verhaal'
      });
      
    } catch (error) {
      logger.error('Discourse success stories navigation error:', { error: error instanceof Error ? error.message : String(error) });
      this.fallbackToMET24Route('/analytics');
    }
  }

  /**
   * 🔧 CORE DISCOURSE NAVIGATION METHODS
   */
  
  private openDiscourseCategory(categorySlug: string, metadata?: { title: string; description: string }): void {
    const url = `${this.config.baseUrl}/c/${categorySlug}`;
    this.openDiscourseUrl(`/c/${categorySlug}`, metadata);
  }

  private openDiscourseUrl(path: string, metadata?: { title: string; description: string }): void {
    const fullUrl = `${this.config.baseUrl}${path}`;
    
    // SSO parameters toevoegen als beschikbaar
    const ssoUrl = this.generateSSOUrl(path);
    
    // Open in nieuw tabblad met PWA integratie
    if (metadata) {
      logger.info('Opening Discourse:', { url: fullUrl, ...metadata });
    }
    
    // Voor nu direct navigeren - later SSO implementeren
    window.open(ssoUrl || fullUrl, '_blank', 'noopener,noreferrer');
  }

  private generateSSOUrl(path: string): string | null {
    try {
      const { userData } = useAppStore.getState();
      
      if (!userData || !this.config.ssoSecret) {
        return null;
      }

      // SSO payload maken
      const ssoPayload = {
        nonce: Date.now().toString(),
        return_sso_url: `${this.config.baseUrl}${path}`,
        external_id: userData.id,
        email: userData.email,
        username: userData.name,
        name: userData.name,
        avatar_url: userData.avatar,
        mbti_type: userData.mbtiType
      };

      // Basis SSO URL - in productie met echte signature
      const baseUrl = `${this.config.baseUrl}/session/sso_login`;
      return baseUrl; // Voor nu zonder signature
      
    } catch (error) {
      logger.error('SSO URL generation failed:', { error: error instanceof Error ? error.message : String(error) });
      return null;
    }
  }

  /**
   * 🔄 FALLBACK METHODS
   * Als Discourse niet beschikbaar is, valt terug op originele MET24 routes
   */
  
  private fallbackToMET24Chat(): void {
    logger.warn('Discourse chat niet beschikbaar, fallback naar MET24 chat');
    window.location.href = '/chat';
  }

  private fallbackToMET24Communities(): void {
    logger.warn('Discourse communities niet beschikbaar, fallback naar MET24 communities');
    window.location.href = '/communities';
  }

  private fallbackToMET24Route(route: string): void {
    logger.warn(`Discourse niet beschikbaar, fallback naar MET24 ${route}`);
    window.location.href = route;
  }

  /**
   * 🔍 UTILITY METHODS
   */
  
  public isDiscourseAvailable(): Promise<boolean> {
    return fetch(`${this.config.baseUrl}/srv/status`, { 
      method: 'HEAD',
      mode: 'no-cors'
    })
    .then(() => true)
    .catch(() => false);
  }

  public getMBTICategory(mbtiType: string): { id: number; slug: string; name: string; description: string } | null {
    return this.config.categories[mbtiType] || null;
  }

  public getAllCategories(): typeof this.config.categories {
    return this.config.categories;
  }
}

// Singleton instance exporteren
export const discourseConnector = new DiscourseConnectorService();

// Named exports voor gemakkelijk gebruik
export const {
  navigateToChat,
  navigateToCommunities, 
  navigateToChallenges,
  navigateToWellness,
  navigateToAIInsights,
  navigateToSuccessStories
} = discourseConnector;

export default discourseConnector;
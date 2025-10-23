/**
 * Content Management Service for MET24 Phase 1
 * 
 * Manages static content, templates, and responses
 * 
 * @version 3.0.0-core
 */

import { staticContentService, StaticCoachingContent, CoachingTemplate, StaticResponse } from '../data/staticContent';

export interface ContentRequest {
  category?: string;
  mbtiType?: string;
  tags?: string[];
  query?: string;
}

export interface TemplateRequest {
  category: string;
  variables: { [key: string]: string };
}

export interface ResponseRequest {
  trigger: string;
  mbtiType?: string;
  context?: any;
}

export class ContentManagementService {
  /**
   * Get coaching content based on request
   */
  async getCoachingContent(request: ContentRequest): Promise<StaticCoachingContent[]> {
    try {
      let content: StaticCoachingContent[] = [];

      // Filter by category
      if (request.category) {
        content = staticContentService.getContentByCategory(request.category);
      }

      // Filter by MBTI type
      if (request.mbtiType && content.length > 0) {
        content = content.filter(item => 
          !item.mbtiType || item.mbtiType === request.mbtiType
        );
      }

      // Filter by tags
      if (request.tags && request.tags.length > 0 && content.length > 0) {
        content = content.filter(item => 
          request.tags!.some(tag => item.tags.includes(tag))
        );
      }

      // Search by query
      if (request.query) {
        content = staticContentService.searchContent(request.query);
      }

      // If no filters applied, return all content
      if (!request.category && !request.mbtiType && !request.tags && !request.query) {
        content = staticContentService.getAllCategories()
          .flatMap(category => staticContentService.getContentByCategory(category));
      }

      return content;
    } catch (error) {
      console.error('Content Management Service: Error getting coaching content', error);
      return [];
    }
  }

  /**
   * Get random coaching content
   */
  async getRandomCoachingContent(category?: string, mbtiType?: string): Promise<StaticCoachingContent | null> {
    try {
      if (category) {
        const content = staticContentService.getContentByCategory(category);
        if (mbtiType) {
          const mbtiContent = content.filter(item => 
            !item.mbtiType || item.mbtiType === mbtiType
          );
          if (mbtiContent.length > 0) {
            return mbtiContent[Math.floor(Math.random() * mbtiContent.length)];
          }
        }
        return staticContentService.getRandomContentByCategory(category);
      }

      // Get random content from all categories
      const allCategories = staticContentService.getAllCategories();
      const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
      return staticContentService.getRandomContentByCategory(randomCategory);
    } catch (error) {
      console.error('Content Management Service: Error getting random coaching content', error);
      return null;
    }
  }

  /**
   * Get coaching template
   */
  async getCoachingTemplate(request: TemplateRequest): Promise<CoachingTemplate | null> {
    try {
      const templates = staticContentService.getTemplateByCategory(request.category);
      if (templates.length === 0) {
        return null;
      }

      // Return first template for now (could be enhanced with selection logic)
      return templates[0];
    } catch (error) {
      console.error('Content Management Service: Error getting coaching template', error);
      return null;
    }
  }

  /**
   * Fill template with variables
   */
  async fillTemplate(template: CoachingTemplate, variables: { [key: string]: string }): Promise<string> {
    try {
      let filledTemplate = template.template;

      // Replace variables in template
      template.variables.forEach(variable => {
        const value = variables[variable] || `{${variable}}`;
        filledTemplate = filledTemplate.replace(new RegExp(`{${variable}}`, 'g'), value);
      });

      return filledTemplate;
    } catch (error) {
      console.error('Content Management Service: Error filling template', error);
      return template.template;
    }
  }

  /**
   * Get static response
   */
  async getStaticResponse(request: ResponseRequest): Promise<StaticResponse | null> {
    try {
      return staticContentService.getResponseByTrigger(request.trigger, request.mbtiType);
    } catch (error) {
      console.error('Content Management Service: Error getting static response', error);
      return null;
    }
  }

  /**
   * Get personalized content for user
   */
  async getPersonalizedContent(mbtiType: string, preferences?: any): Promise<StaticCoachingContent[]> {
    try {
      // Get MBTI-specific content
      const mbtiContent = staticContentService.getContentByMBTIType(mbtiType);
      
      // Get general content
      const generalContent = staticContentService.getContentByCategory('introduction');
      
      // Combine and prioritize
      const personalizedContent = [...mbtiContent, ...generalContent];
      
      // Apply preferences if available
      if (preferences && preferences.categories) {
        return personalizedContent.filter(content => 
          preferences.categories.includes(content.category)
        );
      }
      
      return personalizedContent;
    } catch (error) {
      console.error('Content Management Service: Error getting personalized content', error);
      return [];
    }
  }

  /**
   * Get content recommendations
   */
  async getContentRecommendations(mbtiType: string, currentCategory?: string): Promise<StaticCoachingContent[]> {
    try {
      const recommendations: StaticCoachingContent[] = [];
      
      // Get MBTI-specific recommendations
      const mbtiContent = staticContentService.getContentByMBTIType(mbtiType);
      recommendations.push(...mbtiContent);
      
      // Get related content based on current category
      if (currentCategory) {
        const relatedContent = staticContentService.getContentByCategory(currentCategory);
        recommendations.push(...relatedContent);
      }
      
      // Get V3 features content
      const v3Content = staticContentService.getContentByCategory('v3-features');
      recommendations.push(...v3Content);
      
      // Remove duplicates
      const uniqueRecommendations = recommendations.filter((content, index, self) => 
        index === self.findIndex(c => c.id === content.id)
      );
      
      return uniqueRecommendations;
    } catch (error) {
      console.error('Content Management Service: Error getting content recommendations', error);
      return [];
    }
  }

  /**
   * Get content for onboarding
   */
  async getOnboardingContent(): Promise<StaticCoachingContent[]> {
    try {
      const onboardingCategories = ['introduction', 'v3-features'];
      const content: StaticCoachingContent[] = [];
      
      onboardingCategories.forEach(category => {
        content.push(...staticContentService.getContentByCategory(category));
      });
      
      return content;
    } catch (error) {
      console.error('Content Management Service: Error getting onboarding content', error);
      return [];
    }
  }

  /**
   * Get content for specific V3 feature
   */
  async getV3FeatureContent(feature: string): Promise<StaticCoachingContent[]> {
    try {
      const featureCategories: { [key: string]: string } = {
        'active-imagination': 'active-imagination',
        'enhanced-journaling': 'journaling',
        'challenges': 'challenges',
        'levensgebieden': 'levensgebieden'
      };
      
      const category = featureCategories[feature];
      if (category) {
        return staticContentService.getContentByCategory(category);
      }
      
      return [];
    } catch (error) {
      console.error('Content Management Service: Error getting V3 feature content', error);
      return [];
    }
  }

  /**
   * Get all available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      return staticContentService.getAllCategories();
    } catch (error) {
      console.error('Content Management Service: Error getting categories', error);
      return [];
    }
  }

  /**
   * Get all available tags
   */
  async getTags(): Promise<string[]> {
    try {
      return staticContentService.getAllTags();
    } catch (error) {
      console.error('Content Management Service: Error getting tags', error);
      return [];
    }
  }

  /**
   * Search content
   */
  async searchContent(query: string): Promise<StaticCoachingContent[]> {
    try {
      return staticContentService.searchContent(query);
    } catch (error) {
      console.error('Content Management Service: Error searching content', error);
      return [];
    }
  }
}

// Export singleton instance
export const contentManagementService = new ContentManagementService();

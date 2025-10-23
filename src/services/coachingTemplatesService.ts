/**
 * Coaching Templates Service for MET24 Phase 1
 * 
 * Manages coaching templates and template system
 * 
 * @version 3.0.0-core
 */

export interface CoachingTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  template: string;
  variables: string[];
  mbtiType?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateInstance {
  id: string;
  templateId: string;
  userId: string;
  variables: { [key: string]: string };
  content: string;
  completedAt: Date;
  rating?: number;
  feedback?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export class CoachingTemplatesService {
  private templates: Map<string, CoachingTemplate> = new Map();
  private instances: Map<string, TemplateInstance> = new Map();
  private categories: Map<string, TemplateCategory> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeCategories();
  }

  /**
   * Initialize coaching templates
   */
  private initializeTemplates(): void {
    const templates: CoachingTemplate[] = [
      {
        id: 'daily-reflection',
        title: 'Dagelijkse Reflectie',
        description: 'Reflecteer op je dag en plan voor morgen',
        category: 'journaling',
        template: 'Vandaag voelde ik me {mood}. De belangrijkste gebeurtenis was {event}. Ik ben dankbaar voor {gratitude}. Morgen wil ik focussen op {focus}.',
        variables: ['mood', 'event', 'gratitude', 'focus'],
        difficulty: 'beginner',
        estimatedTime: 10,
        tags: ['daily', 'reflection', 'gratitude'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'goal-setting',
        title: 'Doelstelling',
        description: 'Stel concrete doelen en maak een actieplan',
        category: 'planning',
        template: 'Mijn doel is {goal}. Ik wil dit bereiken binnen {timeframe}. De stappen die ik ga nemen zijn: {steps}. Mijn motivatie is {motivation}.',
        variables: ['goal', 'timeframe', 'steps', 'motivation'],
        difficulty: 'intermediate',
        estimatedTime: 20,
        tags: ['goals', 'planning', 'motivation'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'challenge-reflection',
        title: 'Challenge Reflectie',
        description: 'Reflecteer op een uitdaging en wat je hebt geleerd',
        category: 'challenges',
        template: 'De challenge {challenge} was {difficulty}. Ik heb geleerd {learning}. De grootste uitdaging was {obstacle}. Ik ben trots op {achievement}.',
        variables: ['challenge', 'difficulty', 'learning', 'obstacle', 'achievement'],
        difficulty: 'intermediate',
        estimatedTime: 15,
        tags: ['challenges', 'reflection', 'learning'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'imagination-session',
        title: 'Imaginatie Sessie',
        description: 'Documenteer je actieve imaginatie ervaring',
        category: 'imagination',
        template: 'Tijdens mijn imaginatie sessie zag ik {vision}. Het gevoel was {feeling}. De boodschap was {message}. Ik voel me nu {state}.',
        variables: ['vision', 'feeling', 'message', 'state'],
        difficulty: 'beginner',
        estimatedTime: 15,
        tags: ['imagination', 'creativity', 'visualization'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mbti-reflection',
        title: 'MBTI Reflectie',
        description: 'Reflecteer op je MBTI type en persoonlijkheid',
        category: 'personality',
        template: 'Als {mbtiType} herken ik me in {trait}. Ik wil werken aan {development}. Mijn kracht is {strength}. Ik kan groeien door {growth}.',
        variables: ['mbtiType', 'trait', 'development', 'strength', 'growth'],
        difficulty: 'intermediate',
        estimatedTime: 20,
        tags: ['mbti', 'personality', 'development'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'stress-management',
        title: 'Stress Management',
        description: 'Analyseer stress en ontwikkel coping strategieën',
        category: 'wellness',
        template: 'Mijn stress niveau is {stressLevel}. De oorzaak is {cause}. Mijn coping strategie is {strategy}. Ik voel me {feeling} na deze oefening.',
        variables: ['stressLevel', 'cause', 'strategy', 'feeling'],
        difficulty: 'intermediate',
        estimatedTime: 15,
        tags: ['stress', 'wellness', 'coping'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'relationship-reflection',
        title: 'Relatie Reflectie',
        description: 'Reflecteer op je relaties en communicatie',
        category: 'relationships',
        template: 'In mijn relatie met {person} voel ik me {feeling}. Ik communiceer door {communication}. Ik wil verbeteren {improvement}. Ik ben dankbaar voor {gratitude}.',
        variables: ['person', 'feeling', 'communication', 'improvement', 'gratitude'],
        difficulty: 'advanced',
        estimatedTime: 25,
        tags: ['relationships', 'communication', 'gratitude'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'career-planning',
        title: 'Carrière Planning',
        description: 'Plan je carrière en professionele ontwikkeling',
        category: 'career',
        template: 'Mijn carrière doel is {careerGoal}. Mijn huidige vaardigheden zijn {skills}. Ik wil ontwikkelen {development}. Mijn volgende stap is {nextStep}.',
        variables: ['careerGoal', 'skills', 'development', 'nextStep'],
        difficulty: 'advanced',
        estimatedTime: 30,
        tags: ['career', 'planning', 'development'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Initialize template categories
   */
  private initializeCategories(): void {
    const categories: TemplateCategory[] = [
      {
        id: 'journaling',
        name: 'Journaling',
        description: 'Reflectie en dagboek templates',
        icon: '📝',
        color: 'blue'
      },
      {
        id: 'planning',
        name: 'Planning',
        description: 'Doelstelling en planning templates',
        icon: '🎯',
        color: 'green'
      },
      {
        id: 'challenges',
        name: 'Challenges',
        description: 'Uitdaging en groei templates',
        icon: '🏆',
        color: 'purple'
      },
      {
        id: 'imagination',
        name: 'Imaginatie',
        description: 'Creativiteit en visualisatie templates',
        icon: '🎭',
        color: 'pink'
      },
      {
        id: 'personality',
        name: 'Persoonlijkheid',
        description: 'MBTI en persoonlijkheid templates',
        icon: '🧠',
        color: 'indigo'
      },
      {
        id: 'wellness',
        name: 'Wellness',
        description: 'Gezondheid en welzijn templates',
        icon: '🌱',
        color: 'green'
      },
      {
        id: 'relationships',
        name: 'Relaties',
        description: 'Relatie en communicatie templates',
        icon: '💕',
        color: 'red'
      },
      {
        id: 'career',
        name: 'Carrière',
        description: 'Professionele ontwikkeling templates',
        icon: '💼',
        color: 'gray'
      }
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  /**
   * Get all templates
   */
  getAllTemplates(): CoachingTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): CoachingTemplate | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): CoachingTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.category === category);
  }

  /**
   * Get templates by MBTI type
   */
  getTemplatesByMBTIType(mbtiType: string): CoachingTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => !template.mbtiType || template.mbtiType === mbtiType);
  }

  /**
   * Get templates by difficulty
   */
  getTemplatesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): CoachingTemplate[] {
    return Array.from(this.templates.values())
      .filter(template => template.difficulty === difficulty);
  }

  /**
   * Get all categories
   */
  getAllCategories(): TemplateCategory[] {
    return Array.from(this.categories.values());
  }

  /**
   * Get category by ID
   */
  getCategory(categoryId: string): TemplateCategory | null {
    return this.categories.get(categoryId) || null;
  }

  /**
   * Create template instance
   */
  async createTemplateInstance(
    templateId: string,
    userId: string,
    variables: { [key: string]: string }
  ): Promise<TemplateInstance> {
    try {
      const template = this.getTemplate(templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Fill template with variables
      const content = this.fillTemplate(template, variables);

      const instance: TemplateInstance = {
        id: this.generateId(),
        templateId,
        userId,
        variables,
        content,
        completedAt: new Date()
      };

      this.instances.set(instance.id, instance);
      return instance;
    } catch (error) {
      console.error('Coaching Templates Service: Error creating template instance', error);
      throw error;
    }
  }

  /**
   * Fill template with variables
   */
  fillTemplate(template: CoachingTemplate, variables: { [key: string]: string }): string {
    let content = template.template;

    template.variables.forEach(variable => {
      const value = variables[variable] || `{${variable}}`;
      content = content.replace(new RegExp(`{${variable}}`, 'g'), value);
    });

    return content;
  }

  /**
   * Get template instances by user
   */
  getTemplateInstancesByUser(userId: string): TemplateInstance[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  /**
   * Get template instances by template
   */
  getTemplateInstancesByTemplate(templateId: string): TemplateInstance[] {
    return Array.from(this.instances.values())
      .filter(instance => instance.templateId === templateId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  /**
   * Update template instance
   */
  async updateTemplateInstance(
    instanceId: string,
    updates: Partial<TemplateInstance>
  ): Promise<TemplateInstance> {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) {
        throw new Error('Template instance not found');
      }

      const updatedInstance = { ...instance, ...updates };
      this.instances.set(instanceId, updatedInstance);
      return updatedInstance;
    } catch (error) {
      console.error('Coaching Templates Service: Error updating template instance', error);
      throw error;
    }
  }

  /**
   * Delete template instance
   */
  async deleteTemplateInstance(instanceId: string): Promise<void> {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) {
        throw new Error('Template instance not found');
      }

      this.instances.delete(instanceId);
    } catch (error) {
      console.error('Coaching Templates Service: Error deleting template instance', error);
      throw error;
    }
  }

  /**
   * Get template statistics
   */
  getTemplateStatistics(templateId: string): {
    totalInstances: number;
    averageRating: number;
    completionRate: number;
    lastUsed: Date | null;
  } {
    const instances = this.getTemplateInstancesByTemplate(templateId);
    
    if (instances.length === 0) {
      return {
        totalInstances: 0,
        averageRating: 0,
        completionRate: 0,
        lastUsed: null
      };
    }

    const ratings = instances
      .filter(instance => instance.rating !== undefined)
      .map(instance => instance.rating!);

    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0;

    return {
      totalInstances: instances.length,
      averageRating,
      completionRate: 1.0, // All instances are completed
      lastUsed: instances[0].completedAt
    };
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): CoachingTemplate[] {
    const lowercaseQuery = query.toLowerCase();
    
    return Array.from(this.templates.values()).filter(template =>
      template.title.toLowerCase().includes(lowercaseQuery) ||
      template.description.toLowerCase().includes(lowercaseQuery) ||
      template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get recommended templates
   */
  getRecommendedTemplates(
    userId: string,
    mbtiType?: string,
    category?: string
  ): CoachingTemplate[] {
    let templates = this.getAllTemplates();

    // Filter by MBTI type
    if (mbtiType) {
      templates = templates.filter(template => 
        !template.mbtiType || template.mbtiType === mbtiType
      );
    }

    // Filter by category
    if (category) {
      templates = templates.filter(template => template.category === category);
    }

    // Sort by difficulty (beginner first)
    templates.sort((a, b) => {
      const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

    return templates.slice(0, 6); // Return top 6 recommendations
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const coachingTemplatesService = new CoachingTemplatesService();

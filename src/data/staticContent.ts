/**
 * Static Content for MET24 Phase 1
 * 
 * Provides static coaching content, templates, and responses
 * 
 * @version 3.0.0-core
 */

export interface StaticCoachingContent {
  id: string;
  title: string;
  content: string;
  category: string;
  mbtiType?: string;
  tags: string[];
}

export interface CoachingTemplate {
  id: string;
  title: string;
  template: string;
  variables: string[];
  category: string;
}

export interface StaticResponse {
  id: string;
  trigger: string;
  response: string;
  category: string;
  mbtiType?: string;
}

// Static coaching content
export const staticCoachingContent: StaticCoachingContent[] = [
  {
    id: 'intro-personality',
    title: 'Welkom bij je Persoonlijkheidsontwikkeling',
    content: 'Persoonlijkheidsontwikkeling is een levenslange reis van zelfontdekking en groei. Door je MBTI type te begrijpen, kun je beter begrijpen hoe je denkt, voelt en handelt. Dit helpt je om effectiever te communiceren, betere beslissingen te nemen en je doelen te bereiken.',
    category: 'introduction',
    tags: ['personality', 'development', 'mbti']
  },
  {
    id: 'intro-v3-features',
    title: 'Ontdek de V3 Features',
    content: 'MET24 V3 biedt geavanceerde tools voor persoonlijke ontwikkeling. Active Imagination helpt je om je creativiteit te verkennen, Enhanced Journaling geeft je inzicht in je gedachten en gevoelens, Challenges motiveren je om te groeien, en Levensgebieden helpen je om balans te vinden in alle aspecten van je leven.',
    category: 'v3-features',
    tags: ['v3', 'features', 'tools']
  },
  {
    id: 'mbti-intj',
    title: 'INTJ - De Architect',
    content: 'Als INTJ ben je strategisch, onafhankelijk en besluitvaardig. Je hebt een natuurlijke neiging om complexe problemen op te lossen en lange-termijn plannen te maken. Je waardeert competentie en efficiëntie, en je hebt een duidelijke visie voor de toekomst.',
    category: 'mbti-types',
    mbtiType: 'INTJ',
    tags: ['mbti', 'intj', 'architect']
  },
  {
    id: 'mbti-infj',
    title: 'INFJ - De Advocaat',
    content: 'Als INFJ ben je creatief, inspirerend en vastberaden. Je hebt een diep begrip van mensen en situaties, en je bent gedreven door je waarden. Je bent een natuurlijke mentor en helpt anderen om hun potentieel te realiseren.',
    category: 'mbti-types',
    mbtiType: 'INFJ',
    tags: ['mbti', 'infj', 'advocate']
  },
  {
    id: 'active-imagination-intro',
    title: 'Active Imagination - Je Creatieve Geest Ontwikkelen',
    content: 'Active Imagination is een krachtige techniek om je creativiteit en intuïtie te ontwikkelen. Door je verbeelding te gebruiken, kun je nieuwe perspectieven ontdekken, problemen oplossen en je persoonlijke groei versnellen. Begin met eenvoudige visualisatie-oefeningen en bouw geleidelijk op naar complexere imaginatie sessies.',
    category: 'active-imagination',
    tags: ['imagination', 'creativity', 'visualization']
  },
  {
    id: 'journaling-benefits',
    title: 'Enhanced Journaling - De Kracht van Reflectie',
    content: 'Journaling is een van de meest effectieve manieren om zelfbewustzijn te ontwikkelen. Door regelmatig te schrijven over je gedachten, gevoelens en ervaringen, krijg je inzicht in je patronen en kun je bewustere keuzes maken. Enhanced Journaling combineert traditioneel journaling met moderne technieken voor optimale resultaten.',
    category: 'journaling',
    tags: ['journaling', 'reflection', 'self-awareness']
  },
  {
    id: 'challenges-motivation',
    title: 'Challenges - Groei door Uitdaging',
    content: 'Challenges zijn een geweldige manier om jezelf te motiveren en te groeien. Of het nu gaat om persoonlijke doelen of community uitdagingen, het aangaan van uitdagingen helpt je om nieuwe vaardigheden te ontwikkelen, je comfortzone te verlaten en je zelfvertrouwen te vergroten.',
    category: 'challenges',
    tags: ['challenges', 'motivation', 'growth']
  },
  {
    'id': 'levensgebieden-balance',
    title: 'Levensgebieden - Balans in je Leven',
    content: 'Levensgebieden helpen je om balans te vinden in alle aspecten van je leven. Van psychische en lichamelijke gezondheid tot financiën en relaties, elk gebied verdient aandacht. Door bewust te werken aan alle levensgebieden, creëer je een harmonieus en vervullend leven.',
    category: 'levensgebieden',
    tags: ['life-areas', 'balance', 'wellness']
  }
];

// Coaching templates
export const coachingTemplates: CoachingTemplate[] = [
  {
    id: 'daily-reflection',
    title: 'Dagelijkse Reflectie',
    template: 'Vandaag voelde ik me {mood}. De belangrijkste gebeurtenis was {event}. Ik ben dankbaar voor {gratitude}. Morgen wil ik focussen op {focus}.',
    variables: ['mood', 'event', 'gratitude', 'focus'],
    category: 'journaling'
  },
  {
    id: 'goal-setting',
    title: 'Doelstelling',
    template: 'Mijn doel is {goal}. Ik wil dit bereiken binnen {timeframe}. De stappen die ik ga nemen zijn: {steps}. Mijn motivatie is {motivation}.',
    variables: ['goal', 'timeframe', 'steps', 'motivation'],
    category: 'planning'
  },
  {
    id: 'challenge-reflection',
    title: 'Challenge Reflectie',
    template: 'De challenge {challenge} was {difficulty}. Ik heb geleerd {learning}. De grootste uitdaging was {obstacle}. Ik ben trots op {achievement}.',
    variables: ['challenge', 'difficulty', 'learning', 'obstacle', 'achievement'],
    category: 'challenges'
  },
  {
    id: 'imagination-session',
    title: 'Imaginatie Sessie',
    template: 'Tijdens mijn imaginatie sessie zag ik {vision}. Het gevoel was {feeling}. De boodschap was {message}. Ik voel me nu {state}.',
    variables: ['vision', 'feeling', 'message', 'state'],
    category: 'imagination'
  }
];

// Static responses
export const staticResponses: StaticResponse[] = [
  {
    id: 'welcome',
    trigger: 'welcome',
    response: 'Welkom bij MET24! Ik ben hier om je te helpen bij je persoonlijke ontwikkeling. Laten we beginnen met het ontdekken van je MBTI type en het verkennen van de V3 features.',
    category: 'greeting'
  },
  {
    id: 'mbti-complete',
    trigger: 'mbti-complete',
    response: 'Gefeliciteerd! Je hebt je MBTI assessment voltooid. Je type geeft je waardevolle inzichten in je persoonlijkheid. Laten we nu kijken hoe je dit kunt gebruiken in je dagelijks leven.',
    category: 'mbti'
  },
  {
    id: 'v3-features-intro',
    trigger: 'v3-features',
    response: 'De V3 features van MET24 bieden geavanceerde tools voor persoonlijke ontwikkeling. Active Imagination, Enhanced Journaling, Challenges en Levensgebieden werken samen om je te helpen groeien en je doelen te bereiken.',
    category: 'v3-features'
  },
  {
    id: 'active-imagination-start',
    trigger: 'active-imagination-start',
    response: 'Laten we beginnen met Active Imagination. Zoek een rustige plek, sluit je ogen en laat je verbeelding de vrije loop. Begin met eenvoudige visualisaties en bouw geleidelijk op naar complexere sessies.',
    category: 'active-imagination'
  },
  {
    id: 'journaling-start',
    trigger: 'journaling-start',
    response: 'Enhanced Journaling helpt je om inzicht te krijgen in je gedachten en gevoelens. Begin met dagelijkse reflecties en gebruik de templates om structuur te geven aan je schrijven.',
    category: 'journaling'
  },
  {
    id: 'challenges-start',
    trigger: 'challenges-start',
    response: 'Challenges motiveren je om te groeien en nieuwe vaardigheden te ontwikkelen. Kies uit persoonlijke of community challenges die aansluiten bij je doelen en interesses.',
    category: 'challenges'
  },
  {
    id: 'levensgebieden-start',
    trigger: 'levensgebieden-start',
    response: 'Levensgebieden helpen je om balans te vinden in alle aspecten van je leven. Verken de verschillende gebieden en ontdek waar je aandacht aan wilt besteden.',
    category: 'levensgebieden'
  },
  {
    id: 'encouragement',
    trigger: 'encouragement',
    response: 'Je bent op de goede weg! Persoonlijke ontwikkeling is een proces, en elke stap telt. Blijf gefocust op je doelen en wees geduldig met jezelf.',
    category: 'motivation'
  },
  {
    id: 'mbti-intj-specific',
    trigger: 'mbti-intj',
    response: 'Als INTJ ben je een strategische denker met een duidelijke visie. Gebruik je natuurlijke planning vaardigheden om je doelen te bereiken. Active Imagination kan je helpen om nieuwe strategieën te ontwikkelen.',
    category: 'mbti-specific',
    mbtiType: 'INTJ'
  },
  {
    id: 'mbti-infj-specific',
    trigger: 'mbti-infj',
    response: 'Als INFJ ben je een natuurlijke mentor met diep inzicht. Enhanced Journaling kan je helpen om je intuïtie te ontwikkelen en je waarden te verduidelijken.',
    category: 'mbti-specific',
    mbtiType: 'INFJ'
  }
];

// Content management functions
export class StaticContentService {
  /**
   * Get content by category
   */
  getContentByCategory(category: string): StaticCoachingContent[] {
    return staticCoachingContent.filter(content => content.category === category);
  }

  /**
   * Get content by MBTI type
   */
  getContentByMBTIType(mbtiType: string): StaticCoachingContent[] {
    return staticCoachingContent.filter(content => content.mbtiType === mbtiType);
  }

  /**
   * Get content by tags
   */
  getContentByTags(tags: string[]): StaticCoachingContent[] {
    return staticCoachingContent.filter(content => 
      tags.some(tag => content.tags.includes(tag))
    );
  }

  /**
   * Get template by category
   */
  getTemplateByCategory(category: string): CoachingTemplate[] {
    return coachingTemplates.filter(template => template.category === category);
  }

  /**
   * Get response by trigger
   */
  getResponseByTrigger(trigger: string, mbtiType?: string): StaticResponse | null {
    // First try to find MBTI-specific response
    if (mbtiType) {
      const mbtiResponse = staticResponses.find(response => 
        response.trigger === trigger && response.mbtiType === mbtiType
      );
      if (mbtiResponse) {
        return mbtiResponse;
      }
    }

    // Fall back to general response
    return staticResponses.find(response => response.trigger === trigger) || null;
  }

  /**
   * Get random content by category
   */
  getRandomContentByCategory(category: string): StaticCoachingContent | null {
    const content = this.getContentByCategory(category);
    if (content.length === 0) {
      return null;
    }
    return content[Math.floor(Math.random() * content.length)];
  }

  /**
   * Get all categories
   */
  getAllCategories(): string[] {
    const categories = new Set(staticCoachingContent.map(content => content.category));
    return Array.from(categories);
  }

  /**
   * Get all tags
   */
  getAllTags(): string[] {
    const tags = new Set(staticCoachingContent.flatMap(content => content.tags));
    return Array.from(tags);
  }

  /**
   * Search content
   */
  searchContent(query: string): StaticCoachingContent[] {
    const lowercaseQuery = query.toLowerCase();
    return staticCoachingContent.filter(content => 
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.content.toLowerCase().includes(lowercaseQuery) ||
      content.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }
}

// Export singleton instance
export const staticContentService = new StaticContentService();

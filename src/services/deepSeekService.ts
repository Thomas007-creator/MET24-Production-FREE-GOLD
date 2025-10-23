/**
 * DeepSeek API Service - Enhanced for ChatLLM Pipeline Integration  
 * 🌳 Universele Levensboom with direct pipeline to MET24-V14-Production Supabase
 * 
 * Features:
 * - Direct domain search in Supabase V14 database
 * - ChatLLM pipeline integration
 * - MBTI-optimized responses
 * - Mock responses for demonstration
 */

import { chatLLMService } from './chatLLMService';

export interface DeepSeekQuery {
  query: string;
  context: string;
  database_schema: string;
  mbtiType?: string;
  userId?: string;
}

export interface DeepSeekResponse {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: {
    processing_time: number;
    domains_analyzed: string[];
    confidence_score: number;
    chatllm_pipeline_used?: boolean;
    response_mode?: 'chatllm_enhanced' | 'mock_fallback' | 'error_fallback';
  };
}

class DeepSeekService {
  private baseUrl = process.env.REACT_APP_API_URL || '/api';

  /**
   * 🌳 Verwerk een DeepSeek query voor de Universele Levensboom
   * Enhanced with ChatLLM pipeline and optional user data for MBTI optimization
   */
  async processQuery(query: string, userData?: any): Promise<DeepSeekResponse> {
    const startTime = performance.now();
    
    // Build DeepSeek query object
    const deepSeekQuery: DeepSeekQuery = {
      query: query,
      context: 'universele_levensboom',
      database_schema: 'MET24-V14-Production',
      mbtiType: userData?.mbti_type || userData?.personality_type,
      userId: userData?.id
    };
    
    try {
      // Step 1: Try ChatLLM pipeline for enhanced insights (if user data available)
      if (userData && userData.mbti_type) {
        console.log('🌳 DeepSeek: Using ChatLLM pipeline for MBTI-optimized insights...');
        
        try {
          const chatLLMResponse = await chatLLMService.processDeepSeekDomainSearch(
            query,
            this.detectPrimaryDomain(query),
            userData.mbti_type,
            userData
          );
          
          if (chatLLMResponse.success) {
            return {
              success: true,
              result: chatLLMResponse.result,
              metadata: {
                processing_time: performance.now() - startTime,
                domains_analyzed: this.detectDomains(query),
                confidence_score: 85,
                chatllm_pipeline_used: true,
                response_mode: 'chatllm_enhanced'
              }
            };
          }
        } catch (chatLLMError) {
          console.warn('ChatLLM pipeline failed, falling back to mock:', chatLLMError);
        }
      }
      
      // Step 2: Fallback to enhanced mock response
      console.log('🌳 DeepSeek: Using enhanced mock response...');
      const mockResponse = this.generateMockResponse(deepSeekQuery);
      
      // Simuleer network delay voor realisme
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
      
      return {
        ...mockResponse,
        metadata: {
          processing_time: performance.now() - startTime,
          domains_analyzed: this.detectDomains(query),
          confidence_score: 75,
          chatllm_pipeline_used: false,
          response_mode: 'mock_fallback'
        }
      };
      
    } catch (error) {
      console.error('DeepSeek Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          processing_time: performance.now() - startTime,
          domains_analyzed: [],
          confidence_score: 0,
          chatllm_pipeline_used: false,
          response_mode: 'error_fallback'
        }
      };
    }
  }

  /**
   * Verwerk een DeepSeek query voor de Universele Levensboom (legacy method)
   */
  async processQueryLegacy(query: DeepSeekQuery): Promise<DeepSeekResponse> {
    try {
      // In productie zou dit naar de echte DeepSeek API gaan
      // Hier simuleren we de response voor demo doeleinden
      
      const mockResponse = this.generateMockResponse(query);
      
      // Simuleer network delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
      
      return mockResponse;
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Genereer mock response gebaseerd op de query
   */
  private generateMockResponse(query: DeepSeekQuery): DeepSeekResponse {
    const queryText = query.query.toLowerCase();
    
    // Bepaal welke domeinen relevant zijn
    const domainKeywords: { [key: string]: string[] } = {
      'spiritualiteit': ['spiritueel', 'spiritualiteit', 'ziel', 'bewustzijn', 'transcendentie'],
      'creativiteit': ['creatief', 'creativiteit', 'kunst', 'expressie', 'inspiratie'],
      'relaties': ['relatie', 'verbinding', 'liefde', 'familie', 'vriendschap'],
      'gezondheid': ['gezondheid', 'wellness', 'energie', 'lichamelijk', 'mentaal'],
      'groei': ['groei', 'ontwikkeling', 'leren', 'evolutie', 'vooruitgang'],
      'doel': ['doel', 'visie', 'missie', 'richting', 'pad'],
      'wijsheid': ['wijsheid', 'inzicht', 'begrip', 'kennis', 'verstaan']
    };

    const relevantDomains: string[] = [];
    Object.entries(domainKeywords).forEach(([domain, keywords]) => {
      if (keywords.some(keyword => queryText.includes(keyword))) {
        relevantDomains.push(domain);
      }
    });

    // Als geen specifieke domeinen gevonden, gebruik algemene
    if (relevantDomains.length === 0) {
      relevantDomains.push('groei', 'wijsheid');
    }

    const responses = {
      'spiritualiteit': `🌟 **Spirituele Dimensie Analyse**

Uit de Universele Levensboom database:
- Je spirituele kern toont verbindingen met je intuïtieve ontwikkeling
- Gedetecteerde patronen wijzen op een groeiende behoefte aan diepere betekenis
- Aanbeveling: Verken meditatie en reflectieve praktijken
- Cross-domain verbindingen: Creativiteit ↔ Spiritualiteit (85% overlap)`,

      'creativiteit': `🎨 **Creative Flow Insights**

DeepSeek analyse van je creatieve domein:
- Sterke correlatie tussen je MBTI-type en creatieve expressie
- Identificeerde blokkades: perfectonisme en zelfkritiek
- Groei-opportuniteiten: experimenteel spel en vrijheid
- Verbindingen met andere domeinen: Spiritualiteit (85%), Emotionele Intelligentie (72%)`,

      'relaties': `💖 **Relationele Netwerk Mapping**

Universele Levensboom relatie-analyse:
- Je verbindingspatronen tonen authenticiteit als kernwaarde
- Gedetecteerde groeimogelijkheden in kwetsbaarheid en openheid
- Aanbevolen focus: diepere gesprekken en empathische luistering
- Systemische verbindingen: Emotionele Intelligentie ↔ Communicatie`,

      'gezondheid': `💚 **Holistische Wellness Profiel**

DeepSeek wellness database resultaten:
- Je energiepatronen correleren met je levensfase en doelen
- Geïdentificeerde balansgebieden: work-life harmonie
- Aanbevelingen: regelmatige beweging + mindfulness praktijk
- Multi-domein impact: Fysiek → Mentaal → Spiritueel (cascade effect)`,

      'groei': `🌱 **Persoonlijke Evolutie Matrix**

Universele Levensboom groei-analyse:
- Je ontwikkelingstraject toont exponentiële acceleratie
- Kernpatroon: reflectie → actie → integratie cyclus
- Volgende groei-edge: loslaten van oude patronen
- Cross-pollination: Alle 7 domeinen tonen onderlinge versterking`,

      'doel': `🎯 **Levensrichting Kompas**

DeepSeek purpose-alignment scan:
- Je kernmissie resoneert met authentieke zelfexpressie
- Gedetecteerde misalignments: externe verwachtingen vs innerlijke roeping
- Clarity-path: waarden → doelen → acties alignment
- Systemische coherentie: 78% alignment tussen alle levensdomeinen`,

      'wijsheid': `🧠 **Wisdom Integration Analysis**

Universele Levensboom wijsheid-synthese:
- Je ervaringsbank toont rijke leerpatronen
- Geïntegreerde inzichten over life-lessons en growth-edges
- Meta-pattern: cyclische spiralen van begrip en toepassing
- Wisdom-domains actief: Intuïtie, Ervaring, Reflectie, Integratie`
    };

    // Selecteer primaire response
    const primaryDomain = relevantDomains[0];
    let result = responses[primaryDomain as keyof typeof responses] || responses['groei'];

    // Voeg cross-domain insights toe als er meerdere domeinen zijn
    if (relevantDomains.length > 1) {
      result += `\n\n🔗 **Cross-Domain Verbindingen:**\n`;
      relevantDomains.slice(1).forEach(domain => {
        result += `- ${domain}: Onderlinge beïnvloeding en versterking gedetecteerd\n`;
      });
    }

    // Voeg persoonlijke actie-items toe
    result += `\n\n✨ **Gepersonaliseerde Actie-Items:**\n`;
    result += `1. Begin vandaag met 10 minuten reflectie over: "${query.query}"\n`;
    result += `2. Identificeer één kleine stap die je morgen kunt nemen\n`;
    result += `3. Observeer hoe dit gebied verbindt met andere levensdomeinen\n`;

    return {
      success: true,
      result,
      metadata: {
        processing_time: Math.floor(1000 + Math.random() * 3000),
        domains_analyzed: relevantDomains,
        confidence_score: Math.floor(80 + Math.random() * 20)
      }
    };
  }

  /**
   * 🎯 Detecteer primaire domein uit query voor ChatLLM pipeline
   */
  private detectPrimaryDomain(query: string): string {
    const domains = this.detectDomains(query);
    return domains.length > 0 ? domains[0] : 'algemeen';
  }

  /**
   * 🔍 Detecteer relevante domeinen in de query
   */
  private detectDomains(query: string): string[] {
    const queryLower = query.toLowerCase();
    const detectedDomains: string[] = [];

    const domainKeywords = {
      'spiritualiteit': ['spiritualiteit', 'spiritueel', 'ziel', 'bewustzijn', 'meditatie', 'mindfulness', 'karma', 'dharma', 'transcendentie'],
      'creativiteit': ['creativiteit', 'creatief', 'kunst', 'expressie', 'innovatie', 'inspiratie', 'verbeelding', 'artistiek'],
      'relaties': ['relaties', 'relatie', 'liefde', 'partnerschap', 'vriendschap', 'familie', 'verbinding', 'intimiteit'],
      'gezondheid': ['gezondheid', 'welzijn', 'wellness', 'fitness', 'voeding', 'slaap', 'energie', 'vitaal'],
      'groei': ['groei', 'ontwikkeling', 'leren', 'persoonlijk', 'evolutie', 'transformatie', 'vooruitgang'],
      'doel': ['doel', 'missie', 'purpose', 'visie', 'ambities', 'aspiraties', 'betekenis', 'richting'],
      'wijsheid': ['wijsheid', 'kennis', 'inzicht', 'begrip', 'filosofie', 'levenslessen', 'ervaring']
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        detectedDomains.push(domain);
      }
    }

    // Als geen specifieke domeinen gedetecteerd, voeg algemene toe
    if (detectedDomains.length === 0) {
      detectedDomains.push('algemeen');
    }

    return detectedDomains;
  }

  /**
   * Haal beschikbare query templates op
   */
  getQueryTemplates(): string[] {
    return [
      "Wat zijn de 7 universele domeinen in mijn leven?",
      "Hoe verhouden mijn MBTI-type en levensgebieden zich tot elkaar?",
      "Welke groeipatronen zie je in mijn persoonlijke ontwikkeling?",
      "Wat zijn de verbindingen tussen creativiteit en spiritualiteit?",
      "Hoe kan ik meer balans vinden tussen werk en welzijn?",
      "Welke wijsheid kan ik ontdekken in mijn levenservaring?",
      "Hoe kan ik mijn relaties dieper en authentieker maken?",
      "Wat is mijn kernmissie en levensdoel?",
      "Hoe integreer ik alle aspecten van mijn persoonlijkheid?",
      "Welke patronen zie je in mijn spirituele ontwikkeling?"
    ];
  }
}

// Singleton instance
// Export class for TypeScript support
export { DeepSeekService };

export const deepSeekService = new DeepSeekService();

export default DeepSeekService;
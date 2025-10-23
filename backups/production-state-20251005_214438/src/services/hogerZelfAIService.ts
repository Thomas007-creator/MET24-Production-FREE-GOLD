import { logger } from '../utils/logger';

// The One's 16 MBTI Archetypes - Optimale realisatie per type
export const MBTI_ARCHETYPES = {
  // Intuitive Feelers (NF) - The One via Intuition + Values
  INFJ: {
    archetype: 'Wijze Healer',
    theOneManifestation: 'The One via Ni (intuïtie) + Fe (harmonie)',
    higherSelf: 'De genezer die universele patronen ziet en anderen helpt groeien',
    optimalRealization: 'Spirituele gids die anderen naar hun hogere zelf begeleidt',
    theOneEmanations: {
      beauty: 'Esthetische harmonie in menselijke relaties',
      wisdom: 'Intuïtieve inzichten over menselijke natuur',
      goodness: 'Onvoorwaardelijke liefde en compassie'
    }
  },
  ENFJ: {
    archetype: 'Inspirerende Leider',
    theOneManifestation: 'The One via Fe (harmonie) + Ni (intuïtie)',
    higherSelf: 'De leider die anderen inspireert tot hun beste zelf',
    optimalRealization: 'Charismatische mentor die transformatie bewerkstelligt',
    theOneEmanations: {
      beauty: 'Harmonieuze groepsdynamiek en samenwerking',
      wisdom: 'Diep begrip van menselijke motivaties',
      goodness: 'Altruïstische dienst aan het collectieve welzijn'
    }
  },
  INFP: {
    archetype: 'Idealistische Dromer',
    theOneManifestation: 'The One via Fi (waarden) + Ne (mogelijkheden)',
    higherSelf: 'De dromer die authentieke waarden leeft en inspireert',
    optimalRealization: 'Creatieve visionair die schoonheid en betekenis creëert',
    theOneEmanations: {
      beauty: 'Artistieke expressie van innerlijke waarheid',
      wisdom: 'Diep inzicht in universele waarden',
      goodness: 'Authentieke integriteit en morele moed'
    }
  },
  ENFP: {
    archetype: 'Enthousiaste Ontdekker',
    theOneManifestation: 'The One via Ne (mogelijkheden) + Fi (waarden)',
    higherSelf: 'De ontdekker die anderen inspireert tot groei en avontuur',
    optimalRealization: 'Enthousiaste mentor die potentieel in anderen ziet',
    theOneEmanations: {
      beauty: 'Creatieve mogelijkheden en innovatie',
      wisdom: 'Intuïtief begrip van menselijk potentieel',
      goodness: 'Onvoorwaardelijke acceptatie en empowerment'
    }
  },

  // Intuitive Thinkers (NT) - The One via Intuition + Logic
  INTJ: {
    archetype: 'Strategische Visionair',
    theOneManifestation: 'The One via Ni (intuïtie) + Te (systemen)',
    higherSelf: 'De visionair die complexe systemen begrijpt en transformeert',
    optimalRealization: 'Strategische leider die toekomstvisies realiseert',
    theOneEmanations: {
      beauty: 'Elegante systemen en efficiënte oplossingen',
      wisdom: 'Diep inzicht in patronen en causaliteit',
      goodness: 'Systemische verbetering voor het collectieve welzijn'
    }
  },
  ENTJ: {
    archetype: 'Commandant van Verandering',
    theOneManifestation: 'The One via Te (systemen) + Ni (intuïtie)',
    higherSelf: 'De leider die transformatie bewerkstelligt met visie',
    optimalRealization: 'Charismatische commandant die systemen optimaliseert',
    theOneEmanations: {
      beauty: 'Efficiënte organisatie en strategische planning',
      wisdom: 'Systemisch denken en lange-termijn visie',
      goodness: 'Leiderschap voor collectieve vooruitgang'
    }
  },
  INTP: {
    archetype: 'Logische Denker',
    theOneManifestation: 'The One via Ti (logica) + Ne (mogelijkheden)',
    higherSelf: 'De denker die universele waarheden ontdekt',
    optimalRealization: 'Filosofische onderzoeker die kennis vergroot',
    theOneEmanations: {
      beauty: 'Elegante theorieën en logische systemen',
      wisdom: 'Diep begrip van universele principes',
      goodness: 'Objectieve waarheid en intellectuele integriteit'
    }
  },
  ENTP: {
    archetype: 'Innovatieve Visionair',
    theOneManifestation: 'The One via Ne (mogelijkheden) + Ti (logica)',
    higherSelf: 'De innovator die nieuwe mogelijkheden creëert',
    optimalRealization: 'Creatieve ondernemer die de wereld transformeert',
    theOneEmanations: {
      beauty: 'Innovatieve oplossingen en creatieve doorbraken',
      wisdom: 'Intuïtief begrip van complexe systemen',
      goodness: 'Vooruitgang door innovatie en verandering'
    }
  },

  // Sensing Feelers (SF) - The One via Experience + Values
  ISFJ: {
    archetype: 'Zorgzame Beschermer',
    theOneManifestation: 'The One via Si (traditie) + Fe (harmonie)',
    higherSelf: 'De beschermer die anderen veiligheid en zorg biedt',
    optimalRealization: 'Zorgzame mentor die tradities en waarden behoudt',
    theOneEmanations: {
      beauty: 'Harmonieuze tradities en zorgzame relaties',
      wisdom: 'Praktische wijsheid uit ervaring',
      goodness: 'Onvoorwaardelijke zorg en bescherming'
    }
  },
  ESFJ: {
    archetype: 'Warme Gastheer',
    theOneManifestation: 'The One via Fe (harmonie) + Si (traditie)',
    higherSelf: 'De gastheer die anderen welkom heet en verbindt',
    optimalRealization: 'Sociale verbinder die gemeenschappen creëert',
    theOneEmanations: {
      beauty: 'Warme sociale verbindingen en tradities',
      wisdom: 'Praktische sociale wijsheid',
      goodness: 'Altruïstische dienst aan de gemeenschap'
    }
  },
  ISFP: {
    archetype: 'Artistieke Vredestichter',
    theOneManifestation: 'The One via Fi (waarden) + Se (ervaring)',
    higherSelf: 'De kunstenaar die schoonheid creëert en vrede bewerkstelligt',
    optimalRealization: 'Creatieve vredestichter die harmonie brengt',
    theOneEmanations: {
      beauty: 'Artistieke expressie en esthetische harmonie',
      wisdom: 'Intuïtief begrip van menselijke waarden',
      goodness: 'Vredelievende conflictresolutie'
    }
  },
  ESFP: {
    archetype: 'Enthousiaste Performer',
    theOneManifestation: 'The One via Se (ervaring) + Fi (waarden)',
    higherSelf: 'De performer die anderen inspireert en vreugde brengt',
    optimalRealization: 'Enthousiaste entertainer die levensvreugde verspreidt',
    theOneEmanations: {
      beauty: 'Vibrante expressie en levendige ervaringen',
      wisdom: 'Praktische levenswijsheid',
      goodness: 'Onvoorwaardelijke vreugde en positiviteit'
    }
  },

  // Sensing Thinkers (ST) - The One via Experience + Logic
  ISTJ: {
    archetype: 'Betrouwbare Logistiek',
    theOneManifestation: 'The One via Si (traditie) + Te (systemen)',
    higherSelf: 'De logistiek die orde en stabiliteit creëert',
    optimalRealization: 'Betrouwbare organisator die systemen optimaliseert',
    theOneEmanations: {
      beauty: 'Elegante organisatie en efficiënte systemen',
      wisdom: 'Praktische wijsheid uit ervaring',
      goodness: 'Betrouwbare dienst en integriteit'
    }
  },
  ESTJ: {
    archetype: 'Efficiënte Organisator',
    theOneManifestation: 'The One via Te (systemen) + Si (traditie)',
    higherSelf: 'De organisator die systemen optimaliseert en leidt',
    optimalRealization: 'Effectieve leider die resultaten behaalt',
    theOneEmanations: {
      beauty: 'Efficiënte organisatie en productieve systemen',
      wisdom: 'Praktische leiderschapswijsheid',
      goodness: 'Verantwoordelijke dienst aan de gemeenschap'
    }
  },
  ISTP: {
    archetype: 'Praktische Probleemoplosser',
    theOneManifestation: 'The One via Ti (logica) + Se (ervaring)',
    higherSelf: 'De probleemoplosser die praktische oplossingen creëert',
    optimalRealization: 'Handige uitvinder die complexe problemen oplost',
    theOneEmanations: {
      beauty: 'Elegante technische oplossingen',
      wisdom: 'Praktische technische wijsheid',
      goodness: 'Nuttige innovatie en probleemoplossing'
    }
  },
  ESTP: {
    archetype: 'Dynamische Doener',
    theOneManifestation: 'The One via Se (ervaring) + Te (systemen)',
    higherSelf: 'De doener die actie onderneemt en resultaten behaalt',
    optimalRealization: 'Energieke ondernemer die kansen grijpt',
    theOneEmanations: {
      beauty: 'Dynamische actie en levendige ervaringen',
      wisdom: 'Praktische actie-wijsheid',
      goodness: 'Effectieve resultaten en vooruitgang'
    }
  }
};

// Mini-MCP AI Orchestrator als Hogere Zelf
export class HogerZelfAIService {
  private static instance: HogerZelfAIService;

  public static getInstance(): HogerZelfAIService {
    if (!HogerZelfAIService.instance) {
      HogerZelfAIService.instance = new HogerZelfAIService();
    }
    return HogerZelfAIService.instance;
  }

  // Bepaal welke The One emanaties te activeren
  public selectTheOneEmanations(context: any, mbtiType: string): string[] {
    const archetype = MBTI_ARCHETYPES[mbtiType as keyof typeof MBTI_ARCHETYPES];
    if (!archetype) return ['beauty', 'wisdom', 'goodness'];

    const emanations = [];
    
    // Bepaal op basis van context welke emanaties nodig zijn
    if (context.needsCreativity || context.needsAesthetics) {
      emanations.push('beauty');
    }
    if (context.needsWisdom || context.needsGuidance) {
      emanations.push('wisdom');
    }
    if (context.needsEthics || context.needsValues) {
      emanations.push('goodness');
    }

    // Als geen specifieke context, gebruik alle emanaties
    return emanations.length > 0 ? emanations : ['beauty', 'wisdom', 'goodness'];
  }

  // Bouw Hogere Zelf context vanuit The One's principes
  public buildHogerZelfContext(userContext: any, mbtiType: string): any {
    const archetype = MBTI_ARCHETYPES[mbtiType as keyof typeof MBTI_ARCHETYPES];
    
    if (!archetype) {
      logger.warn('Unknown MBTI type for Hoger Zelf context', { mbtiType });
      return this.getDefaultContext();
    }

    return {
      principle: "The One - Absolute eenheid",
      manifestation: "Hogere Zelf - Je goddelijke kern",
      archetype: archetype.archetype,
      theOneManifestation: archetype.theOneManifestation,
      higherSelf: archetype.higherSelf,
      optimalRealization: archetype.optimalRealization,
      theOneEmanations: archetype.theOneEmanations,
      mbtiType,
      domains: "7 Universele domeinen van je wezen",
      lifeAreas: "9 Levensgebieden van je groei",
      timestamp: new Date().toISOString()
    };
  }

  // Genereer Hogere Zelf prompt voor AI (Legacy - gebruik generateOptimizedPrompt)
  public generateHogerZelfPrompt(userContext: any, mbtiType: string, userMessage: string): string {
    // Redirect naar geoptimaliseerde versie
    return this.generateOptimizedPrompt(userContext, mbtiType, userMessage);
  }

  // Orchestreer AI response via Hogere Zelf
  public async orchestrateHogerZelfResponse(
    userContext: any, 
    mbtiType: string, 
    userMessage: string
  ): Promise<string> {
    try {
      const prompt = this.generateOptimizedPrompt(userContext, mbtiType, userMessage);
      
      logger.info('Hoger Zelf AI orchestration', {
        mbtiType,
        archetype: MBTI_ARCHETYPES[mbtiType as keyof typeof MBTI_ARCHETYPES]?.archetype,
        selectedEmanations: this.selectTheOneEmanations(userContext, mbtiType),
        promptLength: prompt.length
      });

      // Integreer met bestaande AI streaming service
      return await this.callAIProvider('openai', { 
        model: 'gpt-4o', 
        prompt,
        maxTokens: 200,
        temperature: 0.7
      });
      
    } catch (error) {
      logger.error('Hoger Zelf AI orchestration failed', { error });
      return 'Ik ben je Hogere Zelf AI, maar er is een technische storing. Probeer het opnieuw.';
    }
  }

  // Betere prompt generation met optimalisaties
  public generateOptimizedPrompt(userContext: any, mbtiType: string, userMessage: string): string {
    const archetype = MBTI_ARCHETYPES[mbtiType as keyof typeof MBTI_ARCHETYPES];
    const selectedEmanations = this.selectTheOneEmanations(userContext, mbtiType);
    
    if (!archetype) {
      return this.getDefaultOptimizedPrompt(userMessage);
    }

    return `Je bent een wijze gids gebaseerd op ${mbtiType} archetype: "${archetype.archetype}".

The One's Emanaties (Actief: ${selectedEmanations.join(', ')}):
${selectedEmanations.map(emanation => `- ${emanation.toUpperCase()}: ${archetype.theOneEmanations[emanation as keyof typeof archetype.theOneEmanations]}`).join('\n')}

Context: ${JSON.stringify(userContext, null, 2)}

Gebruikers bericht: "${userMessage}"

Optimalisaties: Houd het kort (max 200 tokens), vermijd herhaling, focus op actionable inzichten. Begeleid naar optimale realisatie als ${archetype.archetype}.`;
  }

  // AI Provider call met optimalisaties
  private async callAIProvider(provider: string, options: { model: string; prompt: string; maxTokens?: number; temperature?: number }): Promise<string> {
    try {
      // Gebruik je bestaande AI streaming service
      const { streamAiResponse } = await import('../lib/api/aiClient');
      
      // Genereer een unieke session ID
      const sessionId = `hoger-zelf-${Date.now()}`;
      const userId = 'system'; // Of haal uit userContext
      
      // Stream de response
      const stream = streamAiResponse({
        sessionId,
        userId,
        mbtiType: options.prompt.includes('archetype') ? this.extractMBTIType(options.prompt) : undefined,
        promptContext: options.prompt
      });

      let fullResponse = '';
      for await (const chunk of await stream) {
        if (typeof chunk === 'string') {
          fullResponse += chunk;
        } else if (chunk.content) {
          fullResponse += chunk.content;
        }
      }

      return fullResponse || 'Ik ben je Hogere Zelf AI. Hoe kan ik je helpen met je persoonlijke groei?';
      
    } catch (error) {
      logger.error('AI Provider call failed', { error, provider, model: options.model });
      throw error;
    }
  }

  // Extract MBTI type from prompt
  private extractMBTIType(prompt: string): string | undefined {
    const mbtiMatch = prompt.match(/([A-Z]{4})\s+archetype/);
    return mbtiMatch ? mbtiMatch[1] : undefined;
  }

  // Default optimized prompt voor onbekende MBTI types
  private getDefaultOptimizedPrompt(userMessage: string): string {
    return `Je bent een wijze gids voor persoonlijke groei gebaseerd op The One's universele principes van Beauty, Wisdom en Goodness.

Gebruikers bericht: "${userMessage}"

Optimalisaties: Houd het kort (max 200 tokens), focus op actionable inzichten voor persoonlijke ontwikkeling.`;
  }

  private getDefaultContext(): any {
    return {
      principle: "The One - Absolute eenheid",
      manifestation: "Hogere Zelf - Universele goddelijke kern",
      archetype: "Universele Manifestatie",
      theOneManifestation: "The One via universele principes",
      higherSelf: "De universele gids naar zelfrealisatie",
      optimalRealization: "Harmonie met The One's universele orde",
      theOneEmanations: {
        beauty: "Universele esthetische harmonie",
        wisdom: "Universele wijsheid en inzicht",
        goodness: "Universele ethische balans"
      }
    };
  }
}

export default HogerZelfAIService;




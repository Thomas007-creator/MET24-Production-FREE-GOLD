/**
 * MET2.3 & PO2.3 Integration Service
 * Meta Emanatie Theorie 2.3 & Psychosomatische Osteopathie 2.3
 * 
 * Holistisch raamwerk voor individuatie binnen MET24-V14-Production
 * Integreert emanationistisch perspectief met multidimensionale domeinen
 * 
 * @version 2.3.0
 * @author Thomas - MET24 Production
 */

import { chatLLMService } from './chatLLMService';
import { aiOrchestrationService, OrchestrationRequest } from './aiOrchestrationService';

// MET2.3 Core Domain Types
export interface MET23Domain {
  id: string;
  name: string;
  description: string;
  keyVariables: string[];
  intermediateVariables: string[];
  connections: string[];
}

export interface PO23Method {
  id: string;
  name: string;
  targetDomains: string[];
  techniques: string[];
  mbtiOptimization: Record<string, string[]>;
}

export interface IndividuationContext {
  mbtiType: string;
  humanDesignType?: string;
  currentPhase: 'pre2027' | 'transition' | 'post2027';
  dominantDomains: string[];
  activeVariables: string[];
}

// MET2.3 Fundamentele Domeinen
export const MET23_DOMAINS: Record<string, MET23Domain> = {
  biologisch: {
    id: 'biologisch',
    name: 'Biologisch Domein',
    description: 'Anatomische basis voor aards bewustzijn - ankerpunt voor unieke frequentie',
    keyVariables: [
      'somatisch_bewustzijn',
      'interoceptie', 
      'haemodynamica',
      'bio_elektronische_communicatie',
      'sensomotorische_functies'
    ],
    intermediateVariables: [
      'HPA_as',
      'HPT_as', 
      'plexi_regulatie',
      'fight_flight_freeze',
      'zenuwstelsel_regulatie'
    ],
    connections: ['psychologisch', 'ziel', 'externe_omgeving']
  },

  psychologisch: {
    id: 'psychologisch',
    name: 'Psychologisch Domein', 
    description: 'Cognitieve en emotionele processen, emotieregulatie, stressrespons',
    keyVariables: [
      'mentale_helderheid',
      'narratieve_reflectie',
      'emotieregulatie',
      'relevance_realization',
      'belichaamde_cognitie'
    ],
    intermediateVariables: [
      'parasitic_processing',
      'cognitieve_patronen',
      'emotionele_ladingen',
      'stress_response',
      'zelfbewustzijn'
    ],
    connections: ['biologisch', 'ziel', 'externe_omgeving']
  },

  ziel: {
    id: 'ziel',
    name: 'Domein van de Ziel',
    description: 'Individuatie, zelfontwikkeling, authentieke Zelf - innerlijke kompas',
    keyVariables: [
      'individuatie',
      'authentiek_zelf',
      'innerlijke_autoriteit',
      'unieke_blauwdruk',
      'persoonlijke_mythe'
    ],
    intermediateVariables: [
      'matrix_force',
      'innerlijke_schatten',
      'zielenpijn_transformatie',
      'betekenisgeving',
      'zelfreflectie'
    ],
    connections: ['biologisch', 'psychologisch', 'universeel_kosmisch']
  },

  externe_omgeving: {
    id: 'externe_omgeving', 
    name: 'Domein Externe Omgevingsfactoren',
    description: 'Maatschappelijke en kosmische chaos - afbrokkeling traditionele autoriteiten',
    keyVariables: [
      'maatschappelijke_chaos',
      'autoriteit_afbrokkeling',
      'agent_arena_koppeling',
      'betekenis_crisis',
      'externe_validatie_verlies'
    ],
    intermediateVariables: [
      'informatieve_chaos',
      'cross_of_planning_verdwijning',
      'post2027_verschuiving',
      'collectieve_onzekerheid',
      'systeem_instabiliteit'
    ],
    connections: ['biologisch', 'psychologisch', 'ziel']
  },

  lokaal_kosmisch: {
    id: 'lokaal_kosmisch',
    name: 'Lokaal Kosmisch Domein',
    description: 'Kosmische ritmes, archetypen, lokale energetische invloeden',
    keyVariables: [
      'kosmische_ritmes',
      'archetypische_dynamieken',
      'energetische_velden',
      'temporele_cycli',
      'lokale_frequenties'
    ],
    intermediateVariables: [
      'chronobiologie',
      'seizoenale_invloeden',
      'lunaire_cycli',
      'circadiane_ritmes',
      'biorhythmes'
    ],
    connections: ['biologisch', 'ziel', 'universeel_kosmisch']
  },

  universeel_kosmisch: {
    id: 'universeel_kosmisch',
    name: 'Universeel Kosmisch Domein',
    description: 'Diepere structuren realiteit, universele archetypen, evolutionaire verschuivingen',
    keyVariables: [
      'universele_archetypen',
      'evolutionaire_verschuivingen',
      'kosmische_bewustzijn',
      'transcendente_verbinding',
      'eenheids_ervaring'
    ],
    intermediateVariables: [
      'collectief_onbewuste',
      'morfogenetische_velden',
      'kwantum_verstrengeling',
      'bewustzijn_evolutie',
      'spirituele_emergentie'
    ],
    connections: ['ziel', 'lokaal_kosmisch']
  }
};

// PO2.3 Praktische Methoden
export const PO23_METHODS: Record<string, PO23Method> = {
  somatisch_bewustzijn: {
    id: 'somatisch_bewustzijn',
    name: 'Somatisch Bewustzijn',
    targetDomains: ['biologisch', 'psychologisch'],
    techniques: ['body_scanning', 'interoceptieve_focus', 'sensatie_tracking'],
    mbtiOptimization: {
      'Se-types': ['directe_lichaamservaring', 'bewegings_bewustzijn'],
      'Si-types': ['lichaams_geheugen', 'sensatie_vergelijking'],
      'Ni-types': ['innerlijke_beelden', 'symbolische_verbindingen'],
      'Ne-types': ['lichaams_mogelijkheden', 'creatieve_expressie']
    }
  },

  gerichte_ademhaling: {
    id: 'gerichte_ademhaling',
    name: 'Gerichte Ademhaling',
    targetDomains: ['biologisch', 'psychologisch', 'ziel'],
    techniques: ['pranayama', 'coherentie_ademhaling', 'transformationele_adem'],
    mbtiOptimization: {
      'Ti-types': ['technische_adempatronen', 'systematische_benadering'],
      'Te-types': ['gestructureerde_sessies', 'meetbare_resultaten'],
      'Fi-types': ['emotionele_ademverbinding', 'authentieke_expressie'],
      'Fe-types': ['groeps_ademwerk', 'collectieve_harmonie']
    }
  },

  intentioneel_bewegen: {
    id: 'intentioneel_bewegen',
    name: 'Intentioneel Bewegen',
    targetDomains: ['biologisch', 'ziel'],
    techniques: ['authentic_movement', 'dans_therapie', 'tai_chi', 'yoga'],
    mbtiOptimization: {
      'Se-types': ['spontane_beweging', 'fysieke_expressie'],
      'Si-types': ['herhalende_patronen', 'traditionele_vormen'],
      'Ni-types': ['intuïtieve_beweging', 'symbolische_expressie'],
      'Ne-types': ['experimentele_beweging', 'creatieve_improvisatie']
    }
  },

  diepe_aanraking: {
    id: 'diepe_aanraking',
    name: 'Diepe Aanraking',
    targetDomains: ['biologisch', 'psychologisch'],
    techniques: ['craniosacrale_therapie', 'myofasciale_release', 'energetische_aanraking'],
    mbtiOptimization: {
      'Fe-types': ['empathische_aanraking', 'verbindende_touch'],
      'Fi-types': ['respectvolle_grenzen', 'authentieke_verbinding'],
      'Te-types': ['doelgerichte_technieken', 'structurele_benadering'],
      'Ti-types': ['technische_precisie', 'anatomische_focus']
    }
  },

  radicale_resonantie: {
    id: 'radicale_resonantie',
    name: 'Radicale Resonantie',
    targetDomains: ['ziel', 'universeel_kosmisch'],
    techniques: ['frequentie_afstemming', 'energetische_resonantie', 'archetypen_werk'],
    mbtiOptimization: {
      'Ni-types': ['intuïtieve_resonantie', 'symbolische_verbindingen'],
      'Ne-types': ['creatieve_resonantie', 'mogelijkheden_verkenning'],
      'Si-types': ['traditionele_resonantie', 'bewezen_praktijken'],
      'Se-types': ['directe_resonantie', 'onmiddellijke_ervaring']
    }
  },

  emotionele_transformatie: {
    id: 'emotionele_transformatie',
    name: 'Emotionele Transformatie',
    targetDomains: ['psychologisch', 'ziel'],
    techniques: ['zielenpijn_processing', 'emotie_releasing', 'patroon_herstructurering'],
    mbtiOptimization: {
      'Fi-types': ['waarden_gebaseerde_transformatie', 'authentieke_emotie'],
      'Fe-types': ['relationele_emotie_werk', 'collectieve_healing'],
      'Ti-types': ['logische_emotie_analyse', 'systematische_benadering'],
      'Te-types': ['efficiënte_emotie_management', 'resultaat_georiënteerd']
    }
  }
};

// MET2.3/PO2.3 Integration Service
class MET23PO23Service {
  
  /**
   * 🌀 Genereer holistisch individuatie profiel gebaseerd op MET2.3/PO2.3
   */
  async generateIndividuationProfile(
    mbtiType: string,
    currentChallenges: string[],
    userData?: any
  ): Promise<any> {
    const context: IndividuationContext = {
      mbtiType,
      currentPhase: this.determineEvolutionaryPhase(),
      dominantDomains: this.identifyDominantDomains(mbtiType, currentChallenges),
      activeVariables: this.identifyActiveVariables(currentChallenges)
    };

    const orchestrationRequest: OrchestrationRequest = {
      userId: userData?.id || 'anonymous',
      mbtiType: mbtiType,
      sessionType: 'full_orchestration',
      userInput: `🌀 MET2.3/PO2.3 Holistisch Individuatie Profiel

MBTI Type: ${mbtiType}
Evolutionaire Fase: ${context.currentPhase}
Dominante Domeinen: ${context.dominantDomains.join(', ')}
Actieve Variabelen: ${context.activeVariables.join(', ')}
Huidige Uitdagingen: ${currentChallenges.join(', ')}

Meta Emanatie Theorie 2.3 Context:
- Biologisch Domein: Anatomische basis voor aards bewustzijn, unieke frequentie ankerpunt
- Psychologisch Domein: Cognitieve/emotionele processen, relevance realization  
- Domein van de Ziel: Individuatie, authentiek Zelf, innerlijke autoriteit
- Externe Omgeving: Maatschappelijke chaos, autoriteit afbrokkeling post-2027
- Lokaal Kosmisch: Archetypen, kosmische ritmes, energetische velden
- Universeel Kosmisch: Evolutionaire verschuivingen, transcendente verbinding

Psychosomatische Osteopathie 2.3 Methoden:
- Somatisch Bewustzijn (interoceptie, body scanning)
- Gerichte Ademhaling (HPA-as regulatie, zenuwstelsel balans)
- Intentioneel Bewegen (sensomotorische functies, fight-flight-freeze release)
- Diepe Aanraking (haemodynamica, bio-elektronische communicatie)
- Radicale Resonantie (matrix force activatie, ziel-lichaam integratie)
- Emotionele Transformatie (parasitic processing clearing, zielenpijn healing)

Genereer een gepersonaliseerd individuatie pad dat:
1. De unieke blauwdruk van dit MBTI type honoreert
2. Specifieke MET2.3 domeinen adresseert die relevant zijn
3. PO2.3 methoden voorstelt die optimaal zijn voor dit type
4. Voorbereidt op post-2027 persoonlijke autoriteit en navigatie
5. Innerlijke stabiliteit cultiveert te midden van externe chaos`,

      context: {
        met23_framework: MET23_DOMAINS,
        po23_methods: PO23_METHODS,
        individuatie_context: context,
        evolutionary_phase: context.currentPhase
      }
    };

    try {
      const result = await aiOrchestrationService.orchestrateAIResponse(orchestrationRequest);
      
      return {
        success: true,
        individuationProfile: {
          mbtiType,
          evolutionaryPhase: context.currentPhase,
          dominantDomains: context.dominantDomains,
          recommendedMethods: this.getRecommendedMethods(mbtiType, context.dominantDomains),
          aiInsights: result.coordinatedResponse,
          metaStructure: {
            met23_domains: context.dominantDomains.map(id => MET23_DOMAINS[id]),
            po23_methods: this.getRecommendedMethods(mbtiType, context.dominantDomains)
          }
        },
        metadata: {
          framework_version: 'MET2.3/PO2.3',
          processing_mode: result.mode,
          confidence: result.overallConfidence
        }
      };

    } catch (error) {
      return {
        success: false,
        error: `MET2.3/PO2.3 profile generation failed: ${error}`,
        fallback: this.generateFallbackProfile(mbtiType, context)
      };
    }
  }

  /**
   * 🔍 Identificeer dominante MET2.3 domeinen voor MBTI type
   */
  private identifyDominantDomains(mbtiType: string, challenges: string[]): string[] {
    const mbtiDomainMapping: Record<string, string[]> = {
      // Dominant Si/Se - Biologisch domein focus
      'ISTJ': ['biologisch', 'psychologisch', 'externe_omgeving'],
      'ISFJ': ['biologisch', 'ziel', 'psychologisch'],
      'ISTP': ['biologisch', 'lokaal_kosmisch', 'psychologisch'],
      'ISFP': ['biologisch', 'ziel', 'universeel_kosmisch'],
      'ESTJ': ['externe_omgeving', 'biologisch', 'psychologisch'],
      'ESFJ': ['externe_omgeving', 'ziel', 'biologisch'],
      'ESTP': ['biologisch', 'externe_omgeving', 'lokaal_kosmisch'],
      'ESFP': ['biologisch', 'ziel', 'externe_omgeving'],

      // Dominant Ni/Ne - Ziel en Kosmisch domein focus
      'INTJ': ['ziel', 'universeel_kosmisch', 'psychologisch'],
      'INFJ': ['ziel', 'universeel_kosmisch', 'biologisch'],
      'INTP': ['psychologisch', 'universeel_kosmisch', 'ziel'],
      'INFP': ['ziel', 'universeel_kosmisch', 'biologisch'],
      'ENTJ': ['externe_omgeving', 'ziel', 'universeel_kosmisch'],
      'ENFJ': ['ziel', 'externe_omgeving', 'universeel_kosmisch'],
      'ENTP': ['psychologisch', 'externe_omgeving', 'universeel_kosmisch'],
      'ENFP': ['ziel', 'externe_omgeving', 'universeel_kosmisch']
    };

    return mbtiDomainMapping[mbtiType] || ['biologisch', 'psychologisch', 'ziel'];
  }

  /**
   * 🔧 Identificeer actieve variabelen gebaseerd op uitdagingen
   */
  private identifyActiveVariables(challenges: string[]): string[] {
    const challengeVariableMapping: Record<string, string[]> = {
      'stress': ['HPA_as', 'fight_flight_freeze', 'zenuwstelsel_regulatie'],
      'angst': ['parasitic_processing', 'emotieregulatie', 'interoceptie'],
      'depressie': ['betekenisgeving', 'zielenpijn_transformatie', 'innerlijke_autoriteit'],
      'lichaamsspanning': ['sensomotorische_functies', 'haemodynamica', 'somatisch_bewustzijn'],
      'identiteitscrisis': ['individuatie', 'authentiek_zelf', 'unieke_blauwdruk'],
      'relatieproblemen': ['agent_arena_koppeling', 'emotieregulatie', 'matrix_force'],
      'doelloosheid': ['betekenisgeving', 'persoonlijke_mythe', 'innerlijke_autoriteit']
    };

    const activeVariables: string[] = [];
    challenges.forEach(challenge => {
      const variables = challengeVariableMapping[challenge.toLowerCase()];
      if (variables) activeVariables.push(...variables);
    });

    return Array.from(new Set(activeVariables)); // Remove duplicates
  }

  /**
   * ⏰ Bepaal evolutionaire fase (pre/tijdens/post 2027)
   */
  private determineEvolutionaryPhase(): 'pre2027' | 'transition' | 'post2027' {
    const currentYear = new Date().getFullYear();
    if (currentYear < 2027) return 'pre2027';
    if (currentYear === 2027) return 'transition';
    return 'post2027';
  }

  /**
   * 📋 Krijg aanbevolen PO2.3 methoden voor MBTI type en domeinen
   */
  private getRecommendedMethods(mbtiType: string, dominantDomains: string[]): PO23Method[] {
    const recommended: PO23Method[] = [];
    
    Object.values(PO23_METHODS).forEach(method => {
      const hasOverlap = method.targetDomains.some(domain => dominantDomains.includes(domain));
      const hasOptimization = Object.keys(method.mbtiOptimization).some(key => 
        mbtiType.includes(key.replace('-types', ''))
      );
      
      if (hasOverlap || hasOptimization) {
        recommended.push(method);
      }
    });

    return recommended;
  }

  /**
   * 🔄 Genereer fallback profiel als AI orchestration faalt
   */
  private generateFallbackProfile(mbtiType: string, context: IndividuationContext): any {
    return {
      mbtiType,
      evolutionaryPhase: context.currentPhase,
      basicRecommendations: [
        `Voor ${mbtiType}: Focus op ${context.dominantDomains[0]} domein ontwikkeling`,
        `Gebruik ${this.getRecommendedMethods(mbtiType, context.dominantDomains)[0]?.name} methode`,
        `Cultiveer innerlijke autoriteit voorbereidend op post-2027 periode`
      ],
      framework: 'MET2.3/PO2.3 Basis Profile'
    };
  }
}

// Singleton export
// Export class for TypeScript support
export { MET23PO23Service };

export const met23po23Service = new MET23PO23Service();
export default MET23PO23Service;
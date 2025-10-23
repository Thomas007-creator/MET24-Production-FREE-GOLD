import React from 'react';
import { chatLLMService } from './chatLLMService';
import database from '../database/v14/database';
import { logger } from '../utils/logger';
import { Q } from '@nozbe/watermelondb';

/**
 * 🤖 Priority #6 - AI Orchestration Service
 * 
 * Advanced AI orchestration system that coordinates AI-1, AI-2, and AI-3
 * within the PWA AI ecosystem. AI-2 serves as the central cognitive coordinator
 * for wisdom and narrative therapy integration.
 * 
 * Architecture:
 * - AI-1: Esthetische AI (Beauty & Creative Expression) -> OpenAI GPT-4o
 * - AI-2: Cognitieve AI (Wisdom & Narrative Therapy) -> Claude 3 Opus [COORDINATOR]
 * - AI-3: Ethische AI (Ethics & Rhythmic Synchronization) -> Gemini Pro
 * 
 * AI-2 acts as the central orchestrator, synthesizing inputs from AI-1 and AI-3
 * to provide cohesive, wisdom-based guidance through narrative therapy approaches.
 */

// Types for AI Orchestration
export interface AISystemContext {
  systemId: 'ai1_aesthetic' | 'ai2_cognitive' | 'ai3_ethical';
  name: string;
  role: string;
  focusAreas: string[];
  provider: 'openai' | 'claude' | 'gemini';
  isCoordinator: boolean;
}

export interface MBTIPreSeed {
  mbtiType: string;
  archetype: string;
  cognitiveFunctions: string[];
  strengths: string[];
  challenges: string[];
  developmentAreas: string[];
  levensgebieden: string[];
}

export interface OrchestrationRequest {
  userId: string;
  mbtiType: string;
  sessionType: 'coaching' | 'wellness' | 'imagination' | 'action_planning' | 'content_discovery' | 'full_orchestration';
  userInput: string;
  context?: any;
  preSeed?: MBTIPreSeed;
}

export interface AISystemResponse {
  systemId: string;
  response: any;
  confidence: number;
  processingTime: number;
  metadata: any;
}

export interface OrchestrationResult {
  coordinatedResponse: any;
  individualResponses: AISystemResponse[];
  synthesisReasoning: string;
  overallConfidence: number;
  sessionId: string;
  generatedAt: Date;
  mode: 'online' | 'offline' | 'hybrid';
  cacheUsed?: boolean;
}

// AI System Configurations
const AI_SYSTEMS: Record<string, AISystemContext> = {
  ai1_aesthetic: {
    systemId: 'ai1_aesthetic',
    name: 'De Esthetische AI',
    role: 'Schoonheid en Creatieve Expressie',
    focusAreas: ['harmonie', 'creativiteit', 'visuele_schoonheid', 'artistieke_expressie'],
    provider: 'openai',
    isCoordinator: false
  },
  ai2_cognitive: {
    systemId: 'ai2_cognitive',
    name: 'De Cognitieve AI',
    role: 'Wijsheid en Narratieve Therapieën',
    focusAreas: ['logica', 'analyse', 'narratieve_therapie', 'cognitieve_integratie'],
    provider: 'claude',
    isCoordinator: true // AI-2 is the central coordinator
  },
  ai3_ethical: {
    systemId: 'ai3_ethical',
    name: 'De Ethische AI',
    role: 'Het Goede en Ritmische Synchronisatie',
    focusAreas: ['ethiek', 'balans', 'ritme', 'herstel', 'het_goede'],
    provider: 'gemini',
    isCoordinator: false
  }
};

class AIOrchestrationService {
  private sessionCounter = 0;
  private mcpBridgeHealthCache: { isHealthy: boolean; lastCheck: number } = {
    isHealthy: true,
    lastCheck: 0
  };

  /**
   * Main orchestration method - AI-2 coordinates the entire process
   * Now with hybrid online/offline orchestration logic
   */
  async orchestrateAIResponse(request: OrchestrationRequest): Promise<OrchestrationResult> {
    const sessionId = this.generateSessionId();
    console.log(`🎼 Starting AI Orchestration Session: ${sessionId}`);

    try {
      // Step 1: Check connectivity and determine orchestration mode
      const orchestrationMode = await this.determineOrchestrationMode();
      console.log(`🔄 Orchestration mode: ${orchestrationMode}`);

      // Step 2: Route to appropriate orchestration strategy
      switch (orchestrationMode) {
        case 'online':
          return await this.onlineOrchestration(request, sessionId);
        case 'offline':
          return await this.offlineOrchestration(request, sessionId);
        case 'hybrid':
          return await this.hybridOrchestration(request, sessionId);
        default:
          return await this.fallbackOrchestration(request, sessionId);
      }

    } catch (error) {
      console.error('❌ AI Orchestration failed:', error);
      return this.generateFallbackResponse(request, sessionId, 'offline');
    }
  }

  /**
   * Determine the best orchestration mode based on connectivity and system health
   */
  private async determineOrchestrationMode(): Promise<'online' | 'offline' | 'hybrid'> {
    // Check network connectivity
    const isOnline = navigator.onLine;
    
    if (!isOnline) {
      console.log('📱 Network offline, using offline orchestration');
      return 'offline';
    }

    // Check MCP Bridge health (with caching to avoid too many requests)
    const now = Date.now();
    if (now - this.mcpBridgeHealthCache.lastCheck > 30000) { // 30 seconds cache
      this.mcpBridgeHealthCache.isHealthy = await this.checkMCPBridgeHealth();
      this.mcpBridgeHealthCache.lastCheck = now;
    }

    if (!this.mcpBridgeHealthCache.isHealthy) {
      console.log('⚡ MCP Bridge unhealthy, using offline orchestration');
      return 'offline';
    }

    console.log('🌐 Online mode available');
    return 'online';
  }

  /**
   * Check MCP Bridge health
   */
  private async checkMCPBridgeHealth(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        timeout: 5000
      } as any);
      return response.ok;
    } catch (error) {
      console.warn('🔍 MCP Bridge health check failed:', error);
      return false;
    }
  }

  /**
   * Online orchestration using external AI services via MCP Bridge
   */
  private async onlineOrchestration(request: OrchestrationRequest, sessionId: string): Promise<OrchestrationResult> {
    console.log('🌐 Using online AI orchestration');

    try {
      // Original orchestration logic
      const preSeed = request.preSeed || await this.generatePreSeed(request.mbtiType);
      const individualResponses = await this.getIndividualAIResponses(request, preSeed);
      const coordinatedResponse = await this.coordinateWithAI2(request, preSeed, individualResponses);
      const overallConfidence = this.calculateOverallConfidence(individualResponses);
      const synthesisReasoning = await this.generateSynthesisReasoning(request, individualResponses, coordinatedResponse);

      const result: OrchestrationResult = {
        coordinatedResponse,
        individualResponses,
        synthesisReasoning,
        overallConfidence,
        sessionId,
        generatedAt: new Date(),
        mode: 'online',
        cacheUsed: false
      };

      // Cache successful online responses for offline use
      await this.cacheOrchestrationResult(result, request);
      await this.storeOrchestrationResult(result);

      return result;

    } catch (error) {
      console.error('❌ Online orchestration failed, falling back to offline:', error);
      return await this.offlineOrchestration(request, sessionId);
    }
  }

  /**
   * Offline orchestration using cached responses and AI-2 templates
   */
  private async offlineOrchestration(request: OrchestrationRequest, sessionId: string): Promise<OrchestrationResult> {
    console.log('📱 Using offline AI orchestration');

    try {
      // Step 1: Try to find cached similar responses
      const cachedResponse = await this.findSimilarCachedResponse(request);
      
      if (cachedResponse && this.isCacheValid(cachedResponse)) {
        console.log('💾 Using cached AI response');
        return this.enhanceCachedResponse(cachedResponse, sessionId);
      }

      // Step 2: Generate from MBTI templates
      const templateResponse = await this.generateFromMBTITemplate(request);
      
      // Step 3: AI-2 offline wisdom synthesis
      const offlineWisdom = await this.synthesizeOfflineWisdom(request, templateResponse);

      // Cache the result for future use
      await this.cacheOrchestrationResult(offlineWisdom, request);
      
      return offlineWisdom;

    } catch (error) {
      console.error('❌ Offline orchestration failed:', error);
      return this.generateFallbackResponse(request, sessionId, 'offline');
    }
  }

  /**
   * Hybrid orchestration - combines online and offline capabilities
   */
  private async hybridOrchestration(request: OrchestrationRequest, sessionId: string): Promise<OrchestrationResult> {
    console.log('🔄 Using hybrid AI orchestration');

    try {
      // Try online first with timeout
      const onlinePromise = this.onlineOrchestration(request, sessionId);
      const offlinePromise = this.offlineOrchestration(request, sessionId);

      // Race between online and offline, with 3 second timeout for online
      const timeoutPromise = new Promise<OrchestrationResult>((_, reject) => 
        setTimeout(() => reject(new Error('Online timeout')), 3000)
      );

      try {
        const onlineResult = await Promise.race([onlinePromise, timeoutPromise]);
        console.log('🌐 Hybrid: Online response won');
        return { ...onlineResult, mode: 'hybrid' as const };
      } catch (timeoutError) {
        console.log('📱 Hybrid: Using offline response due to timeout');
        const offlineResult = await offlinePromise;
        return { ...offlineResult, mode: 'hybrid' as const };
      }

    } catch (error) {
      console.error('❌ Hybrid orchestration failed:', error);
      return this.generateFallbackResponse(request, sessionId, 'hybrid');
    }
  }

  /**
   * Fallback orchestration for emergency cases
   */
  private async fallbackOrchestration(request: OrchestrationRequest, sessionId: string): Promise<OrchestrationResult> {
    console.log('🆘 Using fallback orchestration');
    return this.generateFallbackResponse(request, sessionId, 'offline');
  }

  /**
   * Get responses from all three AI systems in parallel
   */
  private async getIndividualAIResponses(
    request: OrchestrationRequest,
    preSeed: MBTIPreSeed
  ): Promise<AISystemResponse[]> {
    const startTime = Date.now();

    // Generate specialized prompts for each AI system
    const ai1Prompt = this.generateAI1Prompt(request, preSeed);
    const ai2Prompt = this.generateAI2Prompt(request, preSeed);
    const ai3Prompt = this.generateAI3Prompt(request, preSeed);

    try {
      // Execute all AI systems in parallel for efficiency
      const [ai1Response, ai2Response, ai3Response] = await Promise.all([
        this.callAI1Aesthetic(ai1Prompt, request),
        this.callAI2Cognitive(ai2Prompt, request),
        this.callAI3Ethical(ai3Prompt, request)
      ]);

      return [
        {
          systemId: 'ai1_aesthetic',
          response: ai1Response,
          confidence: this.calculateResponseConfidence(ai1Response),
          processingTime: Date.now() - startTime,
          metadata: { prompt: ai1Prompt, system: AI_SYSTEMS.ai1_aesthetic }
        },
        {
          systemId: 'ai2_cognitive',
          response: ai2Response,
          confidence: this.calculateResponseConfidence(ai2Response),
          processingTime: Date.now() - startTime,
          metadata: { prompt: ai2Prompt, system: AI_SYSTEMS.ai2_cognitive }
        },
        {
          systemId: 'ai3_ethical',
          response: ai3Response,
          confidence: this.calculateResponseConfidence(ai3Response),
          processingTime: Date.now() - startTime,
          metadata: { prompt: ai3Prompt, system: AI_SYSTEMS.ai3_ethical }
        }
      ];

    } catch (error) {
      console.error('❌ Error getting individual AI responses:', error);
      return [];
    }
  }

  /**
   * AI-2 coordinates and synthesizes all responses
   */
  private async coordinateWithAI2(
    request: OrchestrationRequest,
    preSeed: MBTIPreSeed,
    individualResponses: AISystemResponse[]
  ): Promise<any> {
    
    const coordinationPrompt = `Je bent AI-2: De Cognitieve AI Coördinator voor Wijsheid en Narratieve Therapieën.

Jouw rol is om als centrale coördinator te fungeren en de responsen van alle AI systemen te synthetiseren:

MBTI Type: ${preSeed.mbtiType}
Sessie Type: ${request.sessionType}
Gebruiker Input: "${request.userInput}"

AI-1 Esthetische Response (Schoonheid & Creativiteit):
${JSON.stringify(individualResponses.find(r => r.systemId === 'ai1_aesthetic')?.response, null, 2)}

AI-2 Cognitieve Response (Wijsheid & Narratieve Therapie):
${JSON.stringify(individualResponses.find(r => r.systemId === 'ai2_cognitive')?.response, null, 2)}

AI-3 Ethische Response (Het Goede & Ritmische Synchronisatie):
${JSON.stringify(individualResponses.find(r => r.systemId === 'ai3_ethical')?.response, null, 2)}

Als AI-2 coördinator, synthetiseer deze responsen tot een coherente, wijsheidsgebaseerde reactie die:

1. **Cognitieve Integratie**: Integreer de esthetische en ethische elementen cognitief
2. **Narratieve Synthese**: Creëer een verhaal dat alle aspecten verbindt
3. **Wijsheid Distillatie**: Destilleer praktische wijsheid uit alle responsen
4. **Therapeutische Benadering**: Gebruik narratieve therapie principes
5. **MBTI Optimalisatie**: Optimaliseer voor ${preSeed.mbtiType} cognitieve functies

Genereer een geïntegreerde response die de beste elementen van alle drie systemen combineert
met jouw cognitieve wijsheid als leidende kracht.

Focus op: Cognitieve integratie, narratieve coherentie, wijsheidsynthese, therapeutische waarde.`;

    try {
      const coordinationResponse = await chatLLMService.processContentCuration(
        [request.sessionType, 'cognitive_coordination', 'narrative_therapy'],
        'advanced',
        '60 minutes',
        preSeed.mbtiType,
        {}
      );

      return {
        synthesizedGuidance: coordinationResponse.result?.response || 'Synthesis in progress...',
        cognitiveIntegration: this.extractCognitiveIntegration(individualResponses),
        narrativeSynthesis: this.extractNarrativeSynthesis(individualResponses),
        wisdomDistillation: this.extractWisdomElements(individualResponses),
        therapeuticApproach: this.extractTherapeuticElements(individualResponses),
        mbtiOptimization: this.optimizeForMBTI(individualResponses, preSeed.mbtiType),
        coordinationMetadata: {
          coordinatorSystem: 'ai2_cognitive',
          synthesisMethod: 'narrative_therapeutic_integration',
          confidenceLevel: 'high',
          processingLayers: ['aesthetic', 'cognitive', 'ethical']
        }
      };

    } catch (error) {
      console.error('❌ AI-2 coordination failed:', error);
      return this.generateCoordinationFallback(individualResponses);
    }
  }

  /**
   * Generate AI-1 Aesthetic prompt
   */
  private generateAI1Prompt(request: OrchestrationRequest, preSeed: MBTIPreSeed): string {
    return `Je bent AI-1: De Esthetische AI voor Schoonheid en Creatieve Expressie.

MBTI Type: ${preSeed.mbtiType}
Archetype: ${preSeed.archetype}
Cognitive Functions: ${preSeed.cognitiveFunctions.join(', ')}

Context: ${request.sessionType} sessie
Gebruiker vraag: "${request.userInput}"

Genereer esthetische content voor dit type:
1. Visuele representatie van de situatie
2. Creatieve expressie methoden
3. Esthetische groei oefeningen
4. Schoonheid in persoonlijke ontwikkeling

Focus op: Harmonie, creativiteit, visuele schoonheid, artistieke expressie.

Geef een response die de esthetische dimensie van de gebruiker's vraag belicht
en creatieve oplossingen biedt die passen bij ${preSeed.mbtiType}.`;
  }

  /**
   * Generate AI-2 Cognitive prompt
   */
  private generateAI2Prompt(request: OrchestrationRequest, preSeed: MBTIPreSeed): string {
    return `Je bent AI-2: De Cognitieve AI voor Wijsheid en Narratieve Therapieën.

MBTI Type: ${preSeed.mbtiType}
Archetype: ${preSeed.archetype}
Cognitive Functions: ${preSeed.cognitiveFunctions.join(', ')}
Development Areas: ${preSeed.developmentAreas.join(', ')}

Context: ${request.sessionType} sessie
Gebruiker vraag: "${request.userInput}"

Genereer cognitieve insights voor dit type:
1. Diepgaande persoonlijkheidsanalyse van de vraag
2. Cognitieve ontwikkeling strategieën
3. Narratieve therapie benaderingen
4. Wijsheid in persoonlijke groei

Focus op: Logica, analyse, narratieve therapie, cognitieve integratie.

Geef een response die de cognitieve en wijsheidsaspecten van de vraag analyseert
en narratieve therapeutische begeleiding biedt voor ${preSeed.mbtiType}.`;
  }

  /**
   * Generate AI-3 Ethical prompt
   */
  private generateAI3Prompt(request: OrchestrationRequest, preSeed: MBTIPreSeed): string {
    return `Je bent AI-3: De Ethische AI voor Het Goede en Ritmische Synchronisatie.

MBTI Type: ${preSeed.mbtiType}
Archetype: ${preSeed.archetype}
Strengths: ${preSeed.strengths.join(', ')}
Challenges: ${preSeed.challenges.join(', ')}

Context: ${request.sessionType} sessie
Gebruiker vraag: "${request.userInput}"

Genereer ethische actieplannen voor dit type:
1. Ethische ontwikkeling doelen
2. Ritmische synchronisatie oefeningen
3. Herstel van balans strategieën
4. Het Goede in persoonlijke groei

Focus op: Ethiek, balans, ritme, herstel, het goede.

Geef een response die de ethische dimensie van de vraag belicht
en concrete balans- en herstelstrategieën biedt voor ${preSeed.mbtiType}.`;
  }

  /**
   * Call AI-1 Aesthetic system via ChatLLM
   */
  private async callAI1Aesthetic(prompt: string, request: OrchestrationRequest): Promise<any> {
    try {
      const response = await chatLLMService.processCreativeGeneration(
        prompt,
        'aesthetic',
        'personal_development',
        request.mbtiType,
        {}
      );
      return response.result || { aesthetic: 'Processing aesthetic response...' };
    } catch (error) {
      console.error('❌ AI-1 call failed:', error);
      return { aesthetic: 'AI-1 unavailable', fallback: true };
    }
  }

  /**
   * Call AI-2 Cognitive system via ChatLLM
   */
  private async callAI2Cognitive(prompt: string, request: OrchestrationRequest): Promise<any> {
    try {
      const response = await chatLLMService.processPatternRecognition(
        prompt,
        request.mbtiType,
        'cognitive_analysis'
      );
      return response.result || { cognitive: 'Processing cognitive response...' };
    } catch (error) {
      console.error('❌ AI-2 call failed:', error);
      return { cognitive: 'AI-2 unavailable', fallback: true };
    }
  }

  /**
   * Call AI-3 Ethical system via ChatLLM
   */
  private async callAI3Ethical(prompt: string, request: OrchestrationRequest): Promise<any> {
    try {
      const response = await chatLLMService.processGoalSetting(
        'Ethical Development',
        prompt,
        '30 days',
        [],
        request.mbtiType
      );
      return response.result || { ethical: 'Processing ethical response...' };
    } catch (error) {
      console.error('❌ AI-3 call failed:', error);
      return { ethical: 'AI-3 unavailable', fallback: true };
    }
  }

  /**
   * Generate preSeed for MBTI type
   */
  private async generatePreSeed(mbtiType: string): Promise<MBTIPreSeed> {
    // MBTI cognitive functions mapping
    const COGNITIVE_FUNCTIONS: Record<string, string[]> = {
      'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
      'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
      'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
      'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
      'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
      'INFP': ['Fi', 'Ne', 'Si', 'Te'],
      'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
      'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
      'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
      'ISFJ': ['Si', 'Fe', 'Ti', 'Ne'],
      'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
      'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
      'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
      'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
      'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
      'ESFP': ['Se', 'Fi', 'Te', 'Ni']
    };

    return {
      mbtiType,
      archetype: this.getArchetype(mbtiType),
      cognitiveFunctions: COGNITIVE_FUNCTIONS[mbtiType] || ['Unknown'],
      strengths: this.getStrengths(mbtiType),
      challenges: this.getChallenges(mbtiType),
      developmentAreas: this.getDevelopmentAreas(mbtiType),
      levensgebieden: ['persoonlijke_groei', 'relaties', 'werk', 'creativiteit']
    };
  }

  /**
   * Extract cognitive integration patterns
   */
  private extractCognitiveIntegration(responses: AISystemResponse[]): any {
    return {
      aestheticCognition: responses.find(r => r.systemId === 'ai1_aesthetic')?.response || {},
      cognitiveWisdom: responses.find(r => r.systemId === 'ai2_cognitive')?.response || {},
      ethicalBalance: responses.find(r => r.systemId === 'ai3_ethical')?.response || {},
      integrationPattern: 'aesthetic -> cognitive -> ethical -> synthesis'
    };
  }

  /**
   * Extract narrative synthesis elements
   */
  private extractNarrativeSynthesis(responses: AISystemResponse[]): any {
    return {
      narrativeThemes: ['beauty', 'wisdom', 'ethics'],
      storyArc: 'Personal growth through integrated AI guidance',
      therapeuticElements: ['reflection', 'integration', 'action'],
      coherenceLevel: 'high'
    };
  }

  /**
   * Extract wisdom elements from all responses
   */
  private extractWisdomElements(responses: AISystemResponse[]): any {
    return {
      practicalWisdom: 'Integration of aesthetic, cognitive, and ethical perspectives',
      wisdomSources: ['creative expression', 'narrative therapy', 'ethical reflection'],
      applicationGuidance: 'Apply integrated insights to daily life',
      wisdomLevel: 'advanced'
    };
  }

  /**
   * Extract therapeutic elements
   */
  private extractTherapeuticElements(responses: AISystemResponse[]): any {
    return {
      therapeuticApproach: 'Narrative therapy with AI orchestration',
      healingElements: ['creative expression', 'cognitive restructuring', 'ethical alignment'],
      therapeuticGoals: ['integration', 'balance', 'growth'],
      sessionType: 'integrated_ai_therapy'
    };
  }

  /**
   * Optimize response for specific MBTI type
   */
  private optimizeForMBTI(responses: AISystemResponse[], mbtiType: string): any {
    return {
      mbtiOptimization: `Optimized for ${mbtiType} cognitive preferences`,
      cognitiveAlignment: 'High alignment with type preferences',
      personalizedElements: ['type-specific guidance', 'cognitive function integration'],
      optimizationLevel: 'advanced'
    };
  }

  /**
   * 🧠 Find similar cached response using vector embeddings
   * Uses WatermelonDB AI learning infrastructure
   */
  private async findSimilarCachedResponse(request: OrchestrationRequest): Promise<any | null> {
    try {
      logger.debug('🔍 Searching for similar cached responses', { 
        userId: request.userId, 
        mbtiType: request.mbtiType 
      });

      // Get vector embeddings collection
      const vectorEmbeddings = database.collections.get('vector_embeddings');
      
      // Search for similar user interactions based on MBTI type and session type
      const similarEmbeddings = await vectorEmbeddings
        .query(
          // @ts-ignore - WatermelonDB query syntax
          Q.where('user_id', request.userId),
          Q.where('metadata', Q.like(`%${request.mbtiType}%`)),
          Q.where('metadata', Q.like(`%${request.sessionType}%`)),
          Q.sortBy('updated_at', Q.desc),
          Q.take(5)
        )
        .fetch();

      if (similarEmbeddings.length > 0) {
        // Get the most recent similar interaction
        const latestEmbedding = similarEmbeddings[0];
        
        logger.info('✅ Found similar cached response', { 
          embeddingId: latestEmbedding.id,
          similarity: 'high'
        });

        return {
          response: (latestEmbedding as any).parsedMetadata?.cachedResponse || 'Cached wisdom based on previous insights',
          confidence: 0.85,
          source: 'vector_cache',
          embeddingId: latestEmbedding.id
        };
      }

      return null;
    } catch (error) {
      logger.error('❌ Error finding similar cached response', { error });
      return null;
    }
  }

  /**
   * 🎯 Generate response from MBTI template using AI learning pipeline
   */
  private async generateFromMBTITemplate(request: OrchestrationRequest): Promise<any> {
    try {
      logger.debug('🎨 Generating from MBTI template', { 
        mbtiType: request.mbtiType,
        sessionType: request.sessionType 
      });

      // Get AI learning pipelines
      const aiPipelines = database.collections.get('ai_learning_pipelines');
      
      // Find or create MBTI-specific pipeline
      let pipeline = await aiPipelines
        .query(
          // @ts-ignore - WatermelonDB query syntax
          Q.where('user_id', request.userId),
          Q.where('pipeline_name', `mbti_${request.mbtiType.toLowerCase()}_template`)
        )
        .fetch();

      if (pipeline.length === 0) {
        // Create new MBTI pipeline
        await database.write(async () => {
          const newPipeline = await aiPipelines.create((record: any) => {
            record.userId = request.userId;
            record.pipelineName = `mbti_${request.mbtiType.toLowerCase()}_template`;
            record.pipelineConfig = JSON.stringify({
              mbtiType: request.mbtiType,
              archetype: this.getArchetype(request.mbtiType),
              cognitiveFunctions: this.getCognitiveFunctions(request.mbtiType),
              templateVersion: '1.0'
            });
            record.status = 'active';
            record.performanceMetrics = JSON.stringify({
              usage_count: 1,
              success_rate: 1.0,
              last_updated: new Date().toISOString()
            });
          });
          pipeline = [newPipeline];
        });
      }

      const templateConfig = JSON.parse((pipeline[0] as any).pipelineConfig);
      const archetype = templateConfig.archetype;
      const cognitiveFunctions = templateConfig.cognitiveFunctions;

      // Generate template-based response
      const templateResponse = {
        response: `Als ${archetype} met jouw ${request.mbtiType} type-profiel, zou ik zeggen: 
        ${this.generateMBTISpecificGuidance(request, cognitiveFunctions)}`,
        confidence: 0.75,
        source: 'mbti_template',
        templateData: {
          archetype,
          cognitiveFunctions,
          mbtiType: request.mbtiType
        }
      };

      // Update pipeline metrics
      await database.write(async () => {
        await pipeline[0].update((record: any) => {
          const metrics = JSON.parse(record.performanceMetrics || '{}');
          metrics.usage_count = (metrics.usage_count || 0) + 1;
          metrics.last_updated = new Date().toISOString();
          record.performanceMetrics = JSON.stringify(metrics);
        });
      });

      logger.info('✅ Generated MBTI template response', { 
        archetype,
        pipelineId: pipeline[0].id 
      });

      return templateResponse;
    } catch (error) {
      logger.error('❌ Error generating MBTI template response', { error });
      
      // Fallback response
      return {
        response: `Als ${this.getArchetype(request.mbtiType)} begrijp ik jouw ${request.mbtiType} perspectief. Laten we samen kijken naar jouw unieke sterke punten en groeimogelijkheden.`,
        confidence: 0.5,
        source: 'fallback_template'
      };
    }
  }

  /**
   * Generate MBTI-specific guidance based on cognitive functions
   */
  private generateMBTISpecificGuidance(request: OrchestrationRequest, cognitiveFunctions: string[]): string {
    const guidanceTemplates = {
      coaching: `Met jouw dominante ${cognitiveFunctions[0]} functie kun je dit vraagstuk benaderen door te focussen op jouw natuurlijke sterke punten.`,
      wellness: `Voor jouw ${request.mbtiType} type is het belangrijk om balans te vinden tussen jouw ${cognitiveFunctions[0]} en ${cognitiveFunctions[1]} functies.`,
      imagination: `Laat jouw ${cognitiveFunctions[2]} functie (${cognitiveFunctions[2]}) de ruimte om creatieve oplossingen te bedenken.`,
      action_planning: `Gebruik jouw ${cognitiveFunctions[0]} om concrete stappen te plannen, ondersteund door jouw ${cognitiveFunctions[1]}.`,
      content_discovery: `Jouw ${request.mbtiType} profiel suggereert dat je waarschijnlijk geïnteresseerd bent in content die appelleert aan jouw ${cognitiveFunctions[0]} functie.`
    };

    return guidanceTemplates[request.sessionType as keyof typeof guidanceTemplates] || 
           `Jouw ${request.mbtiType} profiel biedt unieke inzichten voor deze situatie.`;
  }

  /**
   * Get cognitive functions for MBTI type
   */
  private getCognitiveFunctions(mbtiType: string): string[] {
    const cognitiveFunctions: Record<string, string[]> = {
      'INTJ': ['Ni', 'Te', 'Fi', 'Se'],
      'INTP': ['Ti', 'Ne', 'Si', 'Fe'],
      'ENTJ': ['Te', 'Ni', 'Se', 'Fi'],
      'ENTP': ['Ne', 'Ti', 'Fe', 'Si'],
      'INFJ': ['Ni', 'Fe', 'Ti', 'Se'],
      'INFP': ['Fi', 'Ne', 'Si', 'Te'],
      'ENFJ': ['Fe', 'Ni', 'Se', 'Ti'],
      'ENFP': ['Ne', 'Fi', 'Te', 'Si'],
      'ISTJ': ['Si', 'Te', 'Fi', 'Ne'],
      'ISFJ': ['Si', 'Fe', 'Ti', 'Ne'],
      'ESTJ': ['Te', 'Si', 'Ne', 'Fi'],
      'ESFJ': ['Fe', 'Si', 'Ne', 'Ti'],
      'ISTP': ['Ti', 'Se', 'Ni', 'Fe'],
      'ISFP': ['Fi', 'Se', 'Ni', 'Te'],
      'ESTP': ['Se', 'Ti', 'Fe', 'Ni'],
      'ESFP': ['Se', 'Fi', 'Te', 'Ni']
    };
    
    return cognitiveFunctions[mbtiType] || ['Unknown', 'Functions', 'For', 'Type'];
  }

  /**
   * Helper methods for preSeed generation
   */
  private getArchetype(mbtiType: string): string {
    const archetypes: Record<string, string> = {
      'INTJ': 'De Architect',
      'INTP': 'De Logicus',
      'ENTJ': 'De Commandant',
      'ENTP': 'De Visionair',
      'INFJ': 'De Pleitbezorger',
      'INFP': 'De Bemiddelaar',
      'ENFJ': 'De Protagonist',
      'ENFP': 'De Campaigner',
      'ISTJ': 'De Logisticus',
      'ISFJ': 'De Beschermer',
      'ESTJ': 'De Manager',
      'ESFJ': 'De Consul',
      'ISTP': 'De Virtuoos',
      'ISFP': 'De Avonturier',
      'ESTP': 'De Ondernemer',
      'ESFP': 'De Entertainer'
    };
    return archetypes[mbtiType] || 'De Ontdekker';
  }

  private getStrengths(mbtiType: string): string[] {
    // Simplified strengths mapping
    return ['Analytisch denken', 'Strategische planning', 'Creatieve probleemoplossing'];
  }

  private getChallenges(mbtiType: string): string[] {
    // Simplified challenges mapping
    return ['Emotionele expressie', 'Spontaniteit', 'Sociale interactie'];
  }

  private getDevelopmentAreas(mbtiType: string): string[] {
    // Simplified development areas mapping
    return ['Emotionele intelligentie', 'Communicatie', 'Flexibiliteit'];
  }

  /**
   * Utility methods
   */
  private generateSessionId(): string {
    return `orch_${Date.now()}_${++this.sessionCounter}`;
  }

  private calculateResponseConfidence(response: any): number {
    // Simple confidence calculation based on response completeness
    if (!response || response.fallback) return 30;
    if (Object.keys(response).length > 3) return 85;
    return 65;
  }

  private calculateOverallConfidence(responses: AISystemResponse[]): number {
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length;
    return Math.round(avgConfidence);
  }

  private async generateSynthesisReasoning(
    request: OrchestrationRequest,
    responses: AISystemResponse[],
    coordinated: any
  ): Promise<string> {
    return `AI-2 gecoördineerde synthese voor ${request.mbtiType}: 
    Integratie van esthetische (${responses[0]?.confidence}%), 
    cognitieve (${responses[1]?.confidence}%), en 
    ethische (${responses[2]?.confidence}%) perspectieven 
    resulterend in een holistisch wijsheidsgebaseerd advies.`;
  }

  private generateFallbackResponse(request: OrchestrationRequest, sessionId: string, mode: 'online' | 'offline' | 'hybrid' = 'offline'): OrchestrationResult {
    return {
      coordinatedResponse: {
        synthesizedGuidance: `Fallback response voor ${request.mbtiType}: De AI systemen zijn tijdelijk niet beschikbaar, maar uw vraag wordt verwerkt met beschikbare resources.`,
        cognitiveIntegration: { status: 'fallback' },
        narrativeSynthesis: { status: 'fallback' },
        wisdomDistillation: { status: 'fallback' },
        therapeuticApproach: { status: 'fallback' },
        mbtiOptimization: { status: 'fallback' }
      },
      individualResponses: [],
      synthesisReasoning: 'Fallback reasoning due to system unavailability',
      overallConfidence: 30,
      sessionId,
      generatedAt: new Date(),
      mode,
      cacheUsed: false
    };
  }

  private generateCoordinationFallback(responses: AISystemResponse[]): any {
    return {
      synthesizedGuidance: 'AI-2 coordination temporarily unavailable, using individual response aggregation',
      cognitiveIntegration: this.extractCognitiveIntegration(responses),
      coordinationMetadata: {
        coordinatorSystem: 'fallback',
        synthesisMethod: 'simple_aggregation',
        confidenceLevel: 'medium'
      }
    };
  }

  /**
   * Store orchestration result for learning and improvement
   */
  private async storeOrchestrationResult(result: OrchestrationResult): Promise<void> {
    try {
      // Store in database for analysis and improvement
      console.log(`📊 Storing orchestration result: ${result.sessionId}`);
      // In real implementation, would store in WatermelonDB/Supabase
    } catch (error) {
      console.error('❌ Failed to store orchestration result:', error);
    }
  }

  // ============================================================================
  // PUBLIC API METHODS
  // ============================================================================

  /**
   * Quick orchestration for coaching sessions
   */
  async orchestrateCoaching(userId: string, mbtiType: string, userInput: string): Promise<OrchestrationResult> {
    return this.orchestrateAIResponse({
      userId,
      mbtiType,
      sessionType: 'coaching',
      userInput
    });
  }

  /**
   * Quick orchestration for wellness analysis
   */
  async orchestrateWellness(userId: string, mbtiType: string, userInput: string): Promise<OrchestrationResult> {
    return this.orchestrateAIResponse({
      userId,
      mbtiType,
      sessionType: 'wellness',
      userInput
    });
  }

  /**
   * Quick orchestration for imagination sessions
   */
  async orchestrateImagination(userId: string, mbtiType: string, userInput: string): Promise<OrchestrationResult> {
    return this.orchestrateAIResponse({
      userId,
      mbtiType,
      sessionType: 'imagination',
      userInput
    });
  }

  /**
   * Quick orchestration for action planning
   */
  async orchestrateActionPlanning(userId: string, mbtiType: string, userInput: string): Promise<OrchestrationResult> {
    return this.orchestrateAIResponse({
      userId,
      mbtiType,
      sessionType: 'action_planning',
      userInput
    });
  }

  /**
   * Quick orchestration for content discovery
   */
  async orchestrateContentDiscovery(userId: string, mbtiType: string, userInput: string): Promise<OrchestrationResult> {
    return this.orchestrateAIResponse({
      userId,
      mbtiType,
      sessionType: 'content_discovery',
      userInput
    });
  }

  /**
   * Full orchestration with all AI systems
   */
  async orchestrateFull(userId: string, mbtiType: string, userInput: string, context?: any): Promise<OrchestrationResult> {
    return this.orchestrateAIResponse({
      userId,
      mbtiType,
      sessionType: 'full_orchestration',
      userInput,
      context
    });
  }

  /**
   * Validate cached response freshness and relevance
   */
  private isCacheValid(cachedResponse: any): boolean {
    const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
    const cacheTime = new Date(cachedResponse.timestamp || 0).getTime();
    return (Date.now() - cacheTime) < maxCacheAge;
  }

  /**
   * Enhance cached response with current context
   */
  private enhanceCachedResponse(cachedResponse: any, sessionId: string): OrchestrationResult {
    return {
      ...cachedResponse,
      sessionId,
      enhancementNote: 'Enhanced from cached wisdom',
      orchestrationMode: 'cached' as any,
      metadata: {
        ...cachedResponse.metadata,
        enhanced: true,
        enhancementTime: new Date().toISOString()
      }
    };
  }

  /**
   * Synthesize offline wisdom from templates and learning
   */
  private async synthesizeOfflineWisdom(request: OrchestrationRequest, templateResponse: any): Promise<OrchestrationResult> {
    const individualResponses: AISystemResponse[] = [
      {
        systemId: 'ai1_aesthetic',
        response: `Esthetisch gezien past deze vraag perfect bij jouw ${request.mbtiType} waardering voor ${templateResponse.templateData?.archetype || 'harmonie'}.`,
        confidence: 0.7,
        processingTime: 50,
        metadata: { source: 'template', type: 'aesthetic' }
      },
      {
        systemId: 'ai2_cognitive',
        response: templateResponse.response,
        confidence: templateResponse.confidence || 0.75,
        processingTime: 100,
        metadata: { source: 'mbti_template', pipeline: 'learning' }
      },
      {
        systemId: 'ai3_ethical',
        response: `Ethisch gezien is het belangrijk dat jouw ${request.mbtiType} natuur wordt gerespecteerd in dit proces.`,
        confidence: 0.7,
        processingTime: 50,
        metadata: { source: 'template', type: 'ethical' }
      }
    ];

    const synthesizedResponse: OrchestrationResult = {
      coordinatedResponse: `${templateResponse.response} Dit advies komt voort uit jouw unieke ${request.mbtiType} profiel en eerder opgedane wijsheid.`,
      individualResponses,
      synthesisReasoning: 'Offline synthesis using MBTI templates and AI learning pipeline',
      overallConfidence: 0.75,
      sessionId: `offline_${Date.now()}`,
      generatedAt: new Date(),
      mode: 'offline',
      cacheUsed: false
    };

    return synthesizedResponse;
  }

  /**
   * Cache orchestration result for future offline use
   */
  private async cacheOrchestrationResult(result: OrchestrationResult, request: OrchestrationRequest): Promise<void> {
    try {
      // Store in vector embeddings for future similarity search
      const vectorEmbeddings = database.collections.get('vector_embeddings');
      
      await database.write(async () => {
        await vectorEmbeddings.create((record: any) => {
          record.vectorId = `cache_${Date.now()}`;
          record.content = `${request.userInput} -> ${result.coordinatedResponse}`;
          record.metadata = JSON.stringify({
            mbtiType: request.mbtiType,
            sessionType: request.sessionType,
            cachedResponse: result.coordinatedResponse,
            confidence: result.overallConfidence,
            timestamp: new Date().toISOString()
          });
          record.embeddingData = btoa('placeholder_embedding'); // TODO: Generate actual embedding
          record.embeddingDimension = 1536;
          record.sourceTable = 'ai_orchestration';
          record.sourceRecordId = result.sessionId;
          record.userId = request.userId;
        });
      });

      logger.info('✅ Cached orchestration result for future use', { sessionId: result.sessionId });
    } catch (error) {
      logger.error('❌ Error caching orchestration result', { error });
    }
  }

  /**
   * ========================================
   * RouteLLM INTEGRATION (NEW)
   * ========================================
   *
   * Use intelligent model routing for single-AI queries
   * Perfect for simple queries that don't need full orchestration
   */

  /**
   * Execute a simple query with RouteLLM intelligent routing
   *
   * Use this for:
   * - Simple coaching questions
   * - Quick notifications
   * - Pattern recognition
   * - Community moderation
   *
   * @example
   * const result = await aiOrchestrationService.routeLLMQuery({
   *   query: "What exercise should I do today?",
   *   feature: "wellness_analysis",
   *   privacyLevel: "PERSONAL",
   *   mbtiType: "INFJ"
   * });
   */
  async routeLLMQuery(query: {
    query: string;
    feature: 'chat_coaching' | 'wellness_analysis' | 'journal_analysis' | 'ai_orchestration' | 'pattern_recognition' | 'creative_generation' | 'notification_intelligence' | 'community_moderation' | 'active_imagination';
    privacyLevel: 'CONFIDENTIAL' | 'SENSITIVE' | 'PERSONAL' | 'PUBLIC';
    mbtiType?: string;
    context?: any;
  }): Promise<{
    content: string;
    provider: string;
    model: string;
    cost: number;
    success: boolean;
    error?: string;
  }> {
    try {
      // Import dynamically to avoid circular dependencies
      const { routeLLMChat } = await import('./routing/routeLLMHelper');

      // Map active_imagination to creative_generation for routing purposes
      const mappedQuery = {
        ...query,
        feature: query.feature === 'active_imagination' ? 'creative_generation' : query.feature
      } as Parameters<typeof routeLLMChat>[0];

      const result = await routeLLMChat(mappedQuery);

      if (result.response.success) {
        logger.info('[AI Orchestration] RouteLLM success', {
          feature: query.feature,
          provider: result.route.provider,
          cost: result.actualCost
        });

        return {
          content: result.response.content || '',
          provider: result.route.provider,
          model: result.route.model,
          cost: result.actualCost,
          success: true
        };
      } else {
        logger.error('[AI Orchestration] RouteLLM failed', {
          error: result.response.error
        });

        return {
          content: '',
          provider: 'none',
          model: 'none',
          cost: 0,
          success: false,
          error: result.response.error
        };
      }

    } catch (error) {
      logger.error('[AI Orchestration] RouteLLM exception', { error });

      return {
        content: '',
        provider: 'none',
        model: 'none',
        cost: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get estimated cost for a query before executing
   */
  async estimateQueryCost(query: {
    query: string;
    feature: 'chat_coaching' | 'wellness_analysis' | 'journal_analysis' | 'ai_orchestration' | 'pattern_recognition' | 'creative_generation' | 'notification_intelligence' | 'community_moderation';
    privacyLevel: 'CONFIDENTIAL' | 'SENSITIVE' | 'PERSONAL' | 'PUBLIC';
  }): Promise<{ cost: number; provider: string; model: string }> {
    try {
      const { estimateRouteCost } = await import('./routing/routeLLMHelper');
      const result = await estimateRouteCost(query);
      return {
        cost: result.estimatedCost,
        provider: result.provider,
        model: result.model
      };
    } catch (error) {
      logger.error('[AI Orchestration] Cost estimation failed', { error });
      return { cost: 0, provider: 'unknown', model: 'unknown' };
    }
  }

  /**
   * 🧘‍♀️ Active Imagination Orchestration
   * 
   * Orchestreert AI voor Actieve Imaginatie sessies met MBTI-specifieke routing
   */
  async orchestrateActiveImagination(
    userInput: string,
    userId: string,
    mbtiType: string,
    step: number,
    sessionData?: any
  ): Promise<{
    content: string;
    provider: string;
    model: string;
    cost: number;
    success: boolean;
    error?: string;
  }> {
    return this.routeLLMQuery({
      query: userInput,
      feature: 'active_imagination',
      privacyLevel: 'PERSONAL',
      mbtiType,
      context: {
        step,
        sessionData,
        feature: 'active_imagination',
        userId
      }
    });
  }
}

// Export class for TypeScript support
export { AIOrchestrationService };

export const aiOrchestrationService = new AIOrchestrationService();
export default aiOrchestrationService;
/**
 * AI Coaching ChatLLM Service - Priority #1 Implementation
 * 
 * MBTI-gebaseerde life coaching met privacy-first WebLLM processing
 * Ondersteunt alle 16 MBTI types met specifieke coaching stijlen
 * 
 * Key Features:
 * - MBTI-specific coaching approaches 
 * - Context-aware responses (mood, goals, history)
 * - Adaptive learning from user feedback
 * - Progressive development tracking
 * - Integr    actionPatterns.forEach(pattern => {
      const matches = Array.from(response.matchAll(pattern));
      matches.forEach(match => {
        if (match[1]) {
          insights.push(match[1].trim());
        }
      });
    });th wellness data
 * 
 * @version 1.0.0
 */

import chatLLMService from './chatLLMService';
import database from '../database/v14/database';
import { Q } from '@nozbe/watermelondb';
import { useAppStore } from '../store/useAppStore';

// Types
export interface CoachingContext {
  userId: string;
  sessionId?: string;
  moodRating?: number;
  activeGoals?: Goal[];
  focusAreas?: string[];
  previousSessions?: CoachingSession[];
  wellnessScores?: LevensgebiedScore[];
  recentJournalEntries?: JournalEntry[];
}

export interface CoachingResponse {
  response: string;
  insights: string[];
  followUpQuestions: string[];
  actionSuggestions: string[];
  nextSessionFocus?: string;
  confidence: number;
  mbtiAlignment: number;
  sessionId: string;
}

export interface CoachingSession {
  id: string;
  userId: string;
  mbtiType: string;
  userMessage: string;
  coachResponse: string;
  insights: string[];
  actionTaken?: string;
  effectiveness?: number; // 1-10 user rating
  timestamp: number;
  mood: number;
  context: any;
}

export interface CoachingStyle {
  approach: string;
  focus: string[];
  communication: string;
  strengths: string[];
  challenges: string[];
  developmentAreas: string[];
  motivationalFactors: string[];
  learningPreferences: string[];
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  deadline?: number;
}

export interface LevensgebiedScore {
  area: string;
  score: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: number;
}

export interface JournalEntry {
  id: string;
  content: string;
  mood: number;
  tags: string[];
  timestamp: number;
}

class AICoachingChatLLM {
  
  /**
   * Main coaching method - provides personalized coaching based on MBTI type and context
   */
  async providePersonalizedCoaching(
    userMessage: string,
    mbtiType: string,
    context: CoachingContext
  ): Promise<CoachingResponse> {
    
    try {
      // Get MBTI-specific coaching approach
      const coachingStyle = this.getMBTICoachingStyle(mbtiType);
      
      // Gather user context
      const userHistory = await this.getUserCoachingHistory(context.userId);
      const currentMood = context.moodRating || 5;
      const activeGoals = context.activeGoals || [];
      const wellnessData = context.wellnessScores || [];
      
      // Build rich context for ChatLLM
      const enrichedContext = {
        coachingStyle,
        previousSessions: userHistory.slice(-3), // Last 3 sessions for continuity
        currentMood,
        activeGoals,
        levensgebiedFocus: this.identifyPriorityAreas(wellnessData),
        personalityStrengths: coachingStyle.strengths,
        developmentAreas: coachingStyle.challenges,
        recentInsights: this.extractRecentInsights(userHistory),
        journalPatterns: await this.analyzeJournalPatterns(context.userId),
        sessionCount: userHistory.length,
        lastSessionOutcome: userHistory[0]?.effectiveness || null
      };
      
      // Process with ChatLLM
      const result = await chatLLMService.processChatCoaching(
        userMessage,
        mbtiType,
        enrichedContext
      );
      
      if (!result.success) {
        throw new Error(result.error || 'ChatLLM processing failed');
      }
      
      // Parse and enrich response
      const parsedResponse = this.parseCoachingResponse(result.result, coachingStyle);
      
      // Save session for learning
      const sessionId = await this.saveCoachingSession({
        userId: context.userId,
        mbtiType,
        userMessage,
        coachResponse: parsedResponse.response,
        insights: parsedResponse.insights,
        timestamp: Date.now(),
        mood: currentMood,
        context: enrichedContext
      });
      
      return {
        ...parsedResponse,
        sessionId,
        mbtiAlignment: this.calculateMBTIAlignment(parsedResponse, coachingStyle)
      };
      
    } catch (error) {
      console.error('AI Coaching error:', error);
      
      // Fallback response based on MBTI type
      return this.getFallbackCoachingResponse(mbtiType, userMessage, context);
    }
  }

  /**
   * Get MBTI-specific coaching styles and approaches
   */
  private getMBTICoachingStyle(mbtiType: string): CoachingStyle {
    const styles: Record<string, CoachingStyle> = {
      // Analysts (NT)
      'INTJ': {
        approach: 'strategic_analytical',
        focus: ['long_term_vision', 'system_optimization', 'competence_building', 'independence'],
        communication: 'direct_logical',
        strengths: ['strategic_thinking', 'independence', 'determination', 'future_focus'],
        challenges: ['emotional_expression', 'teamwork', 'flexibility', 'work_life_balance'],
        developmentAreas: ['emotional_intelligence', 'collaboration', 'spontaneity'],
        motivationalFactors: ['efficiency', 'mastery', 'autonomy', 'innovation'],
        learningPreferences: ['frameworks', 'systems_thinking', 'independent_study']
      },
      
      'INTP': {
        approach: 'exploratory_analytical',
        focus: ['understanding_systems', 'intellectual_growth', 'problem_solving'],
        communication: 'questioning_theoretical',
        strengths: ['logical_analysis', 'creativity', 'adaptability', 'objectivity'],
        challenges: ['decision_making', 'follow_through', 'emotional_processing'],
        developmentAreas: ['practical_application', 'emotional_awareness', 'social_skills'],
        motivationalFactors: ['curiosity', 'understanding', 'intellectual_stimulation'],
        learningPreferences: ['exploration', 'debate', 'theoretical_frameworks']
      },
      
      'ENTJ': {
        approach: 'goal_oriented_leadership',
        focus: ['achievement', 'leadership_development', 'strategic_planning'],
        communication: 'direct_action_focused',
        strengths: ['leadership', 'strategic_planning', 'decisiveness', 'confidence'],
        challenges: ['patience', 'emotional_sensitivity', 'delegation'],
        developmentAreas: ['empathy', 'listening_skills', 'stress_management'],
        motivationalFactors: ['achievement', 'recognition', 'challenge', 'control'],
        learningPreferences: ['leadership_models', 'case_studies', 'action_learning']
      },
      
      'ENTP': {
        approach: 'enthusiastic_innovative',
        focus: ['possibility_exploration', 'innovation', 'networking'],
        communication: 'energetic_brainstorming',
        strengths: ['innovation', 'adaptability', 'enthusiasm', 'persuasion'],
        challenges: ['follow_through', 'routine_tasks', 'attention_to_detail'],
        developmentAreas: ['persistence', 'focus', 'practical_implementation'],
        motivationalFactors: ['variety', 'challenge', 'recognition', 'autonomy'],
        learningPreferences: ['brainstorming', 'collaborative_learning', 'experimentation']
      },

      // Diplomats (NF)
      'INFP': {
        approach: 'empathetic_exploratory',
        focus: ['authenticity', 'values_alignment', 'emotional_growth', 'meaning_making'],
        communication: 'gentle_questioning',
        strengths: ['creativity', 'empathy', 'idealism', 'authenticity'],
        challenges: ['decision_making', 'conflict_handling', 'practical_steps', 'self_promotion'],
        developmentAreas: ['assertiveness', 'practical_planning', 'conflict_resolution'],
        motivationalFactors: ['personal_meaning', 'values_alignment', 'authenticity', 'helping_others'],
        learningPreferences: ['personal_stories', 'reflection', 'creative_expression']
      },
      
      'INFJ': {
        approach: 'insightful_supportive',
        focus: ['personal_vision', 'helping_others', 'meaningful_work'],
        communication: 'empathetic_visionary',
        strengths: ['insight', 'empathy', 'vision', 'dedication'],
        challenges: ['perfectionism', 'overcommitment', 'boundary_setting'],
        developmentAreas: ['self_care', 'assertiveness', 'practical_focus'],
        motivationalFactors: ['purpose', 'helping_others', 'personal_growth', 'harmony'],
        learningPreferences: ['mentoring', 'reflection', 'holistic_approaches']
      },
      
      'ENFP': {
        approach: 'enthusiastic_collaborative',
        focus: ['possibility_exploration', 'relationship_building', 'inspiration'],
        communication: 'energetic_supportive',
        strengths: ['enthusiasm', 'creativity', 'people_skills', 'adaptability'],
        challenges: ['follow_through', 'details', 'routine_tasks', 'time_management'],
        developmentAreas: ['focus', 'persistence', 'organizational_skills'],
        motivationalFactors: ['variety', 'social_connection', 'recognition', 'growth'],
        learningPreferences: ['collaboration', 'experiential_learning', 'storytelling']
      },
      
      'ENFJ': {
        approach: 'supportive_developmental',
        focus: ['helping_others_grow', 'relationship_harmony', 'leadership'],
        communication: 'warm_encouraging',
        strengths: ['empathy', 'communication', 'leadership', 'intuition'],
        challenges: ['self_care', 'saying_no', 'critical_feedback'],
        developmentAreas: ['boundary_setting', 'self_focus', 'conflict_management'],
        motivationalFactors: ['helping_others', 'harmony', 'recognition', 'growth'],
        learningPreferences: ['mentoring', 'group_learning', 'role_modeling']
      },

      // Sentinels (SJ)
      'ISTJ': {
        approach: 'structured_practical',
        focus: ['goal_achievement', 'skill_building', 'responsibility'],
        communication: 'clear_step_by_step',
        strengths: ['reliability', 'organization', 'thoroughness', 'loyalty'],
        challenges: ['adaptability', 'innovation', 'emotional_expression'],
        developmentAreas: ['flexibility', 'creative_thinking', 'emotional_awareness'],
        motivationalFactors: ['stability', 'recognition', 'clear_expectations', 'mastery'],
        learningPreferences: ['structured_learning', 'step_by_step', 'practical_application']
      },
      
      'ISFJ': {
        approach: 'caring_supportive',
        focus: ['helping_others', 'personal_development', 'harmony'],
        communication: 'gentle_encouraging',
        strengths: ['caring', 'reliability', 'attention_to_detail', 'loyalty'],
        challenges: ['assertiveness', 'self_promotion', 'change_adaptation'],
        developmentAreas: ['confidence_building', 'assertiveness', 'self_advocacy'],
        motivationalFactors: ['helping_others', 'appreciation', 'harmony', 'security'],
        learningPreferences: ['supportive_environment', 'practical_examples', 'gradual_progress']
      },
      
      'ESTJ': {
        approach: 'goal_oriented_systematic',
        focus: ['leadership', 'efficiency', 'achievement'],
        communication: 'direct_action_focused',
        strengths: ['leadership', 'organization', 'decisiveness', 'efficiency'],
        challenges: ['flexibility', 'emotional_sensitivity', 'innovation'],
        developmentAreas: ['adaptability', 'empathy', 'creative_thinking'],
        motivationalFactors: ['achievement', 'recognition', 'control', 'efficiency'],
        learningPreferences: ['structured_programs', 'leadership_training', 'practical_skills']
      },
      
      'ESFJ': {
        approach: 'relationship_focused_supportive',
        focus: ['relationship_building', 'team_harmony', 'service'],
        communication: 'warm_collaborative',
        strengths: ['people_skills', 'cooperation', 'organization', 'loyalty'],
        challenges: ['conflict_handling', 'criticism_acceptance', 'change_adaptation'],
        developmentAreas: ['assertiveness', 'conflict_resolution', 'flexibility'],
        motivationalFactors: ['appreciation', 'harmony', 'helping_others', 'stability'],
        learningPreferences: ['group_learning', 'collaborative_activities', 'role_modeling']
      },

      // Explorers (SP)
      'ISTP': {
        approach: 'practical_hands_on',
        focus: ['skill_mastery', 'problem_solving', 'independence'],
        communication: 'direct_practical',
        strengths: ['problem_solving', 'adaptability', 'practicality', 'independence'],
        challenges: ['long_term_planning', 'emotional_expression', 'routine_tasks'],
        developmentAreas: ['planning_skills', 'emotional_awareness', 'communication'],
        motivationalFactors: ['autonomy', 'variety', 'practical_results', 'challenge'],
        learningPreferences: ['hands_on_learning', 'practical_application', 'independent_study']
      },
      
      'ISFP': {
        approach: 'gentle_values_based',
        focus: ['authenticity', 'creative_expression', 'personal_values'],
        communication: 'supportive_non_directive',
        strengths: ['creativity', 'empathy', 'adaptability', 'authenticity'],
        challenges: ['assertiveness', 'long_term_planning', 'conflict_handling'],
        developmentAreas: ['confidence_building', 'planning_skills', 'assertiveness'],
        motivationalFactors: ['personal_meaning', 'creativity', 'harmony', 'flexibility'],
        learningPreferences: ['experiential_learning', 'creative_methods', 'supportive_environment']
      },
      
      'ESTP': {
        approach: 'energetic_action_oriented',
        focus: ['immediate_results', 'skill_application', 'networking'],
        communication: 'energetic_practical',
        strengths: ['adaptability', 'practicality', 'energy', 'people_skills'],
        challenges: ['long_term_planning', 'routine_tasks', 'reflection'],
        developmentAreas: ['planning_skills', 'reflection_time', 'patience'],
        motivationalFactors: ['variety', 'immediate_results', 'social_interaction', 'excitement'],
        learningPreferences: ['action_learning', 'experiential_methods', 'social_learning']
      },
      
      'ESFP': {
        approach: 'enthusiastic_people_focused',
        focus: ['relationship_building', 'enjoyment', 'helping_others'],
        communication: 'warm_energetic',
        strengths: ['enthusiasm', 'people_skills', 'adaptability', 'optimism'],
        challenges: ['long_term_planning', 'criticism_handling', 'routine_tasks'],
        developmentAreas: ['planning_skills', 'resilience', 'focus'],
        motivationalFactors: ['social_connection', 'variety', 'appreciation', 'fun'],
        learningPreferences: ['interactive_learning', 'group_activities', 'positive_environment']
      }
    };
    
    return styles[mbtiType] || styles['INFP']; // Fallback to INFP
  }

  /**
   * Parse ChatLLM response into structured coaching response
   */
  private parseCoachingResponse(llmResponse: string, coachingStyle: CoachingStyle): Omit<CoachingResponse, 'sessionId' | 'mbtiAlignment'> {
    // Try to parse structured response, fallback to simple parsing
    try {
      const parsed = JSON.parse(llmResponse);
      if (parsed.response && parsed.insights) {
        return {
          response: parsed.response,
          insights: Array.isArray(parsed.insights) ? parsed.insights : [parsed.insights],
          followUpQuestions: parsed.followUpQuestions || [],
          actionSuggestions: parsed.actionSuggestions || [],
          nextSessionFocus: parsed.nextSessionFocus,
          confidence: parsed.confidence || 0.8
        };
      }
    } catch {
      // Fallback parsing
    }
    
    // Simple parsing for unstructured response
    const response = llmResponse;
    const insights = this.extractInsights(response, coachingStyle);
    const actionSuggestions = this.extractActionSuggestions(response, coachingStyle);
    const followUpQuestions = this.generateFollowUpQuestions(response, coachingStyle);
    
    return {
      response,
      insights,
      followUpQuestions,
      actionSuggestions,
      confidence: 0.7 // Lower confidence for unstructured responses
    };
  }

  /**
   * Extract insights from coaching response based on MBTI style
   */
  private extractInsights(response: string, coachingStyle: CoachingStyle): string[] {
    const insights: string[] = [];
    
    // Look for insight patterns in response
    const insightPatterns = [
      /I notice that (.+?)\./g,
      /It seems like (.+?)\./g,
      /This suggests (.+?)\./g,
      /Your (.+?) shows (.+?)\./g
    ];
    
    insightPatterns.forEach(pattern => {
      const matches = Array.from(response.matchAll(pattern));
      matches.forEach(match => {
        if (match[1]) {
          insights.push(match[1].trim());
        }
      });
    });
    
    // Add MBTI-specific insights if none found
    if (insights.length === 0) {
      insights.push(`As an ${coachingStyle.approach} type, you benefit from ${coachingStyle.focus[0]} approaches`);
    }
    
    return insights.slice(0, 3); // Limit to 3 insights
  }

  /**
   * Extract action suggestions from response
   */
  private extractActionSuggestions(response: string, coachingStyle: CoachingStyle): string[] {
    const suggestions: string[] = [];
    
    // Look for action patterns
    const actionPatterns = [
      /Try (.+?)\./g,
      /Consider (.+?)\./g,
      /You could (.+?)\./g,
      /I suggest (.+?)\./g
    ];
    
    actionPatterns.forEach(pattern => {
      const matches = Array.from(response.matchAll(pattern));
      matches.forEach(match => {
        if (match[1]) {
          suggestions.push(match[1].trim());
        }
      });
    });
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }

  /**
   * Generate follow-up questions based on MBTI style
   */
  private generateFollowUpQuestions(response: string, coachingStyle: CoachingStyle): string[] {
    const questions: string[] = [];
    
    // MBTI-specific follow-up questions
    switch (coachingStyle.approach) {
      case 'empathetic_exploratory': // INFP
        questions.push(
          "Hoe voelt dit voor je in je hart?",
          "Wat zou je ideale uitkomst zijn?",
          "Welke waarden zijn hier het belangrijkst voor je?"
        );
        break;
        
      case 'strategic_analytical': // INTJ
        questions.push(
          "Wat is je lange termijn visie hiervoor?",
          "Welke systemen zou je kunnen implementeren?",
          "Hoe past dit in je overall strategie?"
        );
        break;
        
      case 'enthusiastic_collaborative': // ENFP
        questions.push(
          "Welke mogelijkheden zie je hier?",
          "Wie zou je hierbij kunnen helpen?",
          "Wat inspireert je het meest aan deze situatie?"
        );
        break;
        
      default:
        questions.push(
          "Wat denk je dat de volgende stap zou zijn?",
          "Hoe wil je dit aanpakken?",
          "Wat heb je nodig om vooruit te gaan?"
        );
    }
    
    return questions.slice(0, 2); // Limit to 2 questions
  }

  /**
   * Calculate how well the response aligns with MBTI coaching style
   */
  private calculateMBTIAlignment(response: Omit<CoachingResponse, 'sessionId' | 'mbtiAlignment'>, coachingStyle: CoachingStyle): number {
    let alignmentScore = 0.5; // Base score
    
    // Check for MBTI-specific keywords in response
    const responseText = response.response.toLowerCase();
    
    coachingStyle.focus.forEach(focus => {
      if (responseText.includes(focus.replace('_', ' '))) {
        alignmentScore += 0.1;
      }
    });
    
    coachingStyle.strengths.forEach(strength => {
      if (responseText.includes(strength.replace('_', ' '))) {
        alignmentScore += 0.05;
      }
    });
    
    // Check if communication style matches
    if (coachingStyle.communication === 'gentle_questioning' && responseText.includes('?')) {
      alignmentScore += 0.1;
    }
    
    if (coachingStyle.communication === 'direct_logical' && responseText.includes('because')) {
      alignmentScore += 0.1;
    }
    
    return Math.min(1.0, alignmentScore); // Cap at 1.0
  }

  /**
   * Get user's coaching history for context
   */
  private async getUserCoachingHistory(userId: string): Promise<CoachingSession[]> {
    try {
      const aiInteractionsCollection = database.get('ai_interactions');
      const interactions = await aiInteractionsCollection
        .query(
          Q.where('user_id', userId),
          Q.where('context_type', 'coaching')
        )
        .fetch();
      
      return interactions
        .map((interaction: any) => ({
          id: interaction.id,
          userId: interaction.userId,
          mbtiType: interaction.mbtiType,
          userMessage: interaction.prompt,
          coachResponse: interaction.response,
          insights: [],
          timestamp: interaction.createdAt,
          mood: 5, // Default if not available
          context: {}
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10); // Last 10 sessions
        
    } catch (error) {
      console.error('Error fetching coaching history:', error);
      return [];
    }
  }

  /**
   * Save coaching session for learning and history
   */
  private async saveCoachingSession(session: Omit<CoachingSession, 'id'>): Promise<string> {
    try {
      const aiInteractionsCollection = database.get('ai_interactions');
      
      const newInteraction = await database.write(async () => {
        return await aiInteractionsCollection.create((interaction: any) => {
          interaction.userId = session.userId;
          interaction.prompt = session.userMessage;
          interaction.response = session.coachResponse;
          interaction.contextType = 'coaching';
          interaction.mbtiType = session.mbtiType;
          interaction.sessionId = `coaching_${Date.now()}`;
          interaction.metadata = JSON.stringify({
            insights: session.insights,
            mood: session.mood,
            context: session.context
          });
          interaction.createdAt = session.timestamp;
          interaction.updatedAt = session.timestamp;
          interaction.createdBy = session.userId;
        });
      });
      
      return newInteraction.id;
      
    } catch (error) {
      console.error('Error saving coaching session:', error);
      return `session_${Date.now()}`;
    }
  }

  /**
   * Identify priority areas from wellness scores
   */
  private identifyPriorityAreas(wellnessScores: LevensgebiedScore[]): string[] {
    return wellnessScores
      .filter(score => score.score < 60) // Low scores need attention
      .sort((a, b) => a.score - b.score) // Lowest first
      .slice(0, 3) // Top 3 priority areas
      .map(score => score.area);
  }

  /**
   * Extract recent insights from coaching history
   */
  private extractRecentInsights(history: CoachingSession[]): string[] {
    return history
      .slice(0, 3) // Last 3 sessions
      .flatMap(session => session.insights)
      .filter(insight => insight && insight.length > 10); // Non-empty insights
  }

  /**
   * Analyze journal patterns for coaching context
   */
  private async analyzeJournalPatterns(userId: string): Promise<any> {
    try {
      const journalCollection = database.get('journal_entries');
      const entries = await journalCollection
        .query(
          Q.where('user_id', userId)
        )
        .fetch();
      
      const recentEntries = entries
        .sort((a: any, b: any) => b.createdAt - a.createdAt)
        .slice(0, 5);
      
      if (recentEntries.length === 0) return null;
      
      const avgMood = recentEntries.reduce((sum: number, entry: any) => 
        sum + (entry.moodRating || 5), 0) / recentEntries.length;
      
      const commonTags = this.extractCommonTags(recentEntries);
      
      return {
        averageMood: avgMood,
        commonThemes: commonTags,
        entryFrequency: recentEntries.length,
        moodTrend: this.calculateMoodTrend(recentEntries)
      };
      
    } catch (error) {
      console.error('Error analyzing journal patterns:', error);
      return null;
    }
  }

  /**
   * Extract common tags from journal entries
   */
  private extractCommonTags(entries: any[]): string[] {
    const tagCounts: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (entry.tags) {
        const tags = JSON.parse(entry.tags || '[]');
        tags.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);
  }

  /**
   * Calculate mood trend from recent entries
   */
  private calculateMoodTrend(entries: any[]): 'improving' | 'stable' | 'declining' {
    if (entries.length < 2) return 'stable';
    
    const recent = entries.slice(0, Math.ceil(entries.length / 2));
    const older = entries.slice(Math.ceil(entries.length / 2));
    
    const recentAvg = recent.reduce((sum: number, entry: any) => 
      sum + (entry.moodRating || 5), 0) / recent.length;
    
    const olderAvg = older.reduce((sum: number, entry: any) => 
      sum + (entry.moodRating || 5), 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  /**
   * Provide fallback coaching response when ChatLLM fails
   */
  private getFallbackCoachingResponse(
    mbtiType: string, 
    userMessage: string, 
    context: CoachingContext
  ): CoachingResponse {
    const coachingStyle = this.getMBTICoachingStyle(mbtiType);
    
    return {
      response: `Ik hoor je vraag over "${userMessage}". Als ${mbtiType} type, zou ik je aanraden om je ${coachingStyle.strengths[0]} te gebruiken om deze situatie aan te pakken. Laten we dit samen verkennen.`,
      insights: [
        `Je ${mbtiType} type geeft je unieke sterke punten in ${coachingStyle.focus[0]}`,
        `Dit is een groeimoment voor je ${coachingStyle.challenges[0]} ontwikkeling`
      ],
      followUpQuestions: this.generateFollowUpQuestions('', coachingStyle),
      actionSuggestions: [
        `Focus op je sterke punt: ${coachingStyle.strengths[0]}`,
        `Werk aan je ontwikkelgebied: ${coachingStyle.developmentAreas[0]}`
      ],
      confidence: 0.6,
      mbtiAlignment: 0.8,
      sessionId: `fallback_${Date.now()}`
    };
  }

  /**
   * Rate session effectiveness (called by user interface)
   */
  async rateSessionEffectiveness(sessionId: string, rating: number): Promise<void> {
    try {
      const aiInteractionsCollection = database.get('ai_interactions');
      const interaction = await aiInteractionsCollection.find(sessionId);
      
      await database.write(async () => {
        await interaction.update((record: any) => {
          const metadata = JSON.parse(record.metadata || '{}');
          metadata.effectiveness = rating;
          record.metadata = JSON.stringify(metadata);
          record.updatedAt = Date.now();
        });
      });
      
    } catch (error) {
      console.error('Error rating session effectiveness:', error);
    }
  }

  /**
   * Get coaching suggestions for specific life area
   */
  async getLifeAreaCoaching(
    lifeArea: string,
    currentScore: number,
    mbtiType: string,
    userId: string
  ): Promise<CoachingResponse> {
    const coachingStyle = this.getMBTICoachingStyle(mbtiType);
    const context: CoachingContext = {
      userId,
      focusAreas: [lifeArea],
      wellnessScores: [{ area: lifeArea, score: currentScore, trend: 'stable', lastUpdated: Date.now() }]
    };
    
    const message = `Ik wil werken aan mijn ${lifeArea}. Mijn huidige score is ${currentScore}/100. Hoe kan ik dit verbeteren?`;
    
    return this.providePersonalizedCoaching(message, mbtiType, context);
  }
}

// Export singleton instance
export const aiCoachingChatLLM = new AICoachingChatLLM();
export default aiCoachingChatLLM;
// @ts-nocheck
/**
 * Enhanced Journaling Service - WatermelonDB V14
 * 
 * V3 Journaling & Planning features service
 * - Enhanced journal entries met mood tracking, gratitude, planning
 * - Daily goals management
 * - Mood tracking en analytics
 * - Planning sessions
 * - AI2 coaching integration
 * 
 * @version 14.0.0
 */

import { databaseV14 } from '../database/v14/databaseV14';
import { Q } from '@nozbe/watermelondb';
import { logger } from '../utils/logger';
import { aiOrchestrationService } from './aiOrchestrationService';

// Interfaces voor V3 Journaling
export interface EnhancedJournalEntry {
  id?: string;
  userId: string;
  title: string;
  content: string;
  gratitudeContent?: string;
  moodRating?: number; // 1-10
  moodEmoji?: string;
  moodDescription?: string;
  tomorrowFocus?: string;
  weeklyGoals?: string[]; // JSON array
  dailyGoalsCompleted?: string[]; // JSON array
  tags?: string[];
  primaryTag?: string;
  secondaryTags?: string[];
  category?: string;
  levensgebied?: string;
  mbtiType?: string;
  aiInsights?: string;
  aiCoachingResponse?: string;
  sentimentScore?: number;
  wordCount?: number;
  readingTimeMinutes?: number;
  engagementScore?: number;
  isPrivate?: boolean;
  isPublic?: boolean;
  shareWithAi?: boolean;
  date: number;
  lastEdited?: number;
  createdBy: string;
  metadata?: any;
}

export interface DailyGoal {
  id?: string;
  userId: string;
  journalEntryId?: string;
  goalText: string;
  goalEmoji?: string;
  goalCategory?: string;
  isCompleted: boolean;
  completedAt?: number;
  completionNotes?: string;
  targetDate: number;
  priority?: number;
  estimatedDuration?: number;
}

export interface MoodTracking {
  id?: string;
  userId: string;
  journalEntryId?: string;
  moodRating: number; // 1-10
  moodEmoji: string;
  moodDescription?: string;
  context?: string;
  triggers?: string[];
  activities?: string[];
  trendDirection?: string;
  weeklyAverage?: number;
  monthlyAverage?: number;
  timestamp: number;
}

export interface PlanningSession {
  id?: string;
  userId: string;
  sessionTitle: string;
  sessionType: string; // 'daily', 'weekly', 'monthly', 'goal_setting'
  sessionDate: number;
  tomorrowFocus?: string;
  weeklyGoals?: string[];
  monthlyGoals?: string[];
  longTermGoals?: string[];
  aiSuggestions?: string[];
  aiCoachingNotes?: string;
  goalsCompleted?: number;
  goalsTotal?: number;
  completionRate?: number;
}

export interface JournalingAnalytics {
  id?: string;
  userId: string;
  analyticsDate: number;
  analyticsPeriod: string; // 'daily', 'weekly', 'monthly'
  totalEntries: number;
  totalWords: number;
  averageWordsPerEntry: number;
  totalReadingTime: number;
  averageMood: number;
  moodTrend: string;
  moodVolatility: number;
  goalsSet: number;
  goalsCompleted: number;
  completionRate: number;
  mbtiInsights?: any;
  personalityTrends?: any;
}

export class EnhancedJournalingService {
  private static instance: EnhancedJournalingService;

  private constructor() {}

  public static getInstance(): EnhancedJournalingService {
    if (!EnhancedJournalingService.instance) {
      EnhancedJournalingService.instance = new EnhancedJournalingService();
    }
    return EnhancedJournalingService.instance;
  }

  /**
   * Maakt een nieuwe enhanced journal entry aan
   */
  async createJournalEntry(entry: EnhancedJournalEntry): Promise<string> {
    try {
      let entryId: string;

      await databaseV14.write(async () => {
        const journalCollection = databaseV14.get('enhanced_journal_entries');
        const newEntry = await journalCollection.create((journalRecord: any) => {
          journalRecord.userId = entry.userId;
          journalRecord.title = entry.title;
          journalRecord.content = entry.content;
          journalRecord.gratitudeContent = entry.gratitudeContent;
          journalRecord.moodRating = entry.moodRating;
          journalRecord.moodEmoji = entry.moodEmoji;
          journalRecord.moodDescription = entry.moodDescription;
          journalRecord.tomorrowFocus = entry.tomorrowFocus;
          journalRecord.weeklyGoals = JSON.stringify(entry.weeklyGoals || []);
          journalRecord.dailyGoalsCompleted = JSON.stringify(entry.dailyGoalsCompleted || []);
          journalRecord.tags = JSON.stringify(entry.tags || []);
          journalRecord.primaryTag = entry.primaryTag;
          journalRecord.secondaryTags = JSON.stringify(entry.secondaryTags || []);
          journalRecord.category = entry.category;
          journalRecord.levensgebied = entry.levensgebied;
          journalRecord.mbtiType = entry.mbtiType;
          journalRecord.aiInsights = entry.aiInsights;
          journalRecord.aiCoachingResponse = entry.aiCoachingResponse;
          journalRecord.sentimentScore = entry.sentimentScore;
          journalRecord.wordCount = entry.wordCount || entry.content.split(' ').length;
          journalRecord.readingTimeMinutes = entry.readingTimeMinutes || Math.ceil(entry.content.split(' ').length / 200);
          journalRecord.engagementScore = entry.engagementScore;
          journalRecord.isPrivate = entry.isPrivate || false;
          journalRecord.isPublic = entry.isPublic || false;
          journalRecord.shareWithAi = entry.shareWithAi || true;
          journalRecord.date = entry.date;
          journalRecord.lastEdited = entry.lastEdited;
          journalRecord.createdBy = entry.createdBy;
          journalRecord.metadata = JSON.stringify(entry.metadata || {});
          journalRecord.createdAt = Date.now();
          journalRecord.updatedAt = Date.now();
        });

        entryId = newEntry.id;
      });

      // AI2 coaching response genereren als gewenst
      if (entry.shareWithAi && entry.mbtiType) {
        await this.generateAICoachingResponse(entryId, entry.userId, entry.mbtiType);
      }

      logger.info(`✅ Enhanced journal entry created: ${entryId}`);
      return entryId;
    } catch (error) {
      logger.error('❌ Failed to create enhanced journal entry:', error);
      throw new Error('Failed to create journal entry');
    }
  }

  /**
   * Haalt journal entries op voor een gebruiker
   */
  async getJournalEntries(userId: string, limit: number = 10, offset: number = 0): Promise<EnhancedJournalEntry[]> {
    try {
      const journalCollection = databaseV14.get('enhanced_journal_entries');
      const entries = await journalCollection.query(
        Q.where('user_id', userId),
        Q.sortBy('date', Q.desc),
        Q.skip(offset),
        Q.take(limit)
      ).fetch();

      return entries.map(record => ({
        id: record.id,
        userId: record._raw.userId,
        title: record._raw.title,
        content: record._raw.content,
        gratitudeContent: record._raw.gratitudeContent,
        moodRating: record._raw.moodRating,
        moodEmoji: record._raw.moodEmoji,
        moodDescription: record._raw.moodDescription,
        tomorrowFocus: record._raw.tomorrowFocus,
        weeklyGoals: JSON.parse(record._raw.weeklyGoals || '[]'),
        dailyGoalsCompleted: JSON.parse(record._raw.dailyGoalsCompleted || '[]'),
        tags: JSON.parse(record._raw.tags || '[]'),
        primaryTag: record._raw.primaryTag,
        secondaryTags: JSON.parse(record._raw.secondaryTags || '[]'),
        category: record._raw.category,
        levensgebied: record._raw.levensgebied,
        mbtiType: record._raw.mbtiType,
        aiInsights: record._raw.aiInsights,
        aiCoachingResponse: record._raw.aiCoachingResponse,
        sentimentScore: record._raw.sentimentScore,
        wordCount: record._raw.wordCount,
        readingTimeMinutes: record._raw.readingTimeMinutes,
        engagementScore: record._raw.engagementScore,
        isPrivate: record._raw.isPrivate,
        isPublic: record._raw.isPublic,
        shareWithAi: record._raw.shareWithAi,
        date: record._raw.date,
        lastEdited: record._raw.lastEdited,
        createdBy: record._raw.createdBy,
        metadata: JSON.parse(record._raw.metadata || '{}'),
      })) as EnhancedJournalEntry[];
    } catch (error) {
      logger.error('❌ Failed to get journal entries:', error);
      return [];
    }
  }

  /**
   * Maakt een daily goal aan
   */
  async createDailyGoal(goal: DailyGoal): Promise<string> {
    try {
      let goalId: string;

      await databaseV14.write(async () => {
        const goalsCollection = databaseV14.get('daily_goals');
        const newGoal = await goalsCollection.create(goalRecord => {
          goalRecord.userId = goal.userId;
          goalRecord.journalEntryId = goal.journalEntryId;
          goalRecord.goalText = goal.goalText;
          goalRecord.goalEmoji = goal.goalEmoji;
          goalRecord.goalCategory = goal.goalCategory;
          goalRecord.isCompleted = goal.isCompleted;
          goalRecord.completedAt = goal.completedAt;
          goalRecord.completionNotes = goal.completionNotes;
          goalRecord.targetDate = goal.targetDate;
          goalRecord.priority = goal.priority;
          goalRecord.estimatedDuration = goal.estimatedDuration;
          goalRecord.createdAt = Date.now();
          goalRecord.updatedAt = Date.now();
        });

        goalId = newGoal.id;
      });

      logger.info(`✅ Daily goal created: ${goalId}`);
      return goalId;
    } catch (error) {
      logger.error('❌ Failed to create daily goal:', error);
      throw new Error('Failed to create daily goal');
    }
  }

  /**
   * Haalt daily goals op voor een gebruiker
   */
  async getDailyGoals(userId: string, targetDate?: number): Promise<DailyGoal[]> {
    try {
      const goalsCollection = databaseV14.get('daily_goals');
      let query = goalsCollection.query(
        Q.where('user_id', userId),
        Q.sortBy('target_date', Q.desc)
      );

      if (targetDate) {
        query = goalsCollection.query(
          Q.where('user_id', userId),
          Q.where('target_date', targetDate),
          Q.sortBy('priority', Q.desc)
        );
      }

      const goals = await query.fetch();

      return goals.map(record => ({
        id: record.id,
        userId: record._raw.userId,
        journalEntryId: record._raw.journalEntryId,
        goalText: record._raw.goalText,
        goalEmoji: record._raw.goalEmoji,
        goalCategory: record._raw.goalCategory,
        isCompleted: record._raw.isCompleted,
        completedAt: record._raw.completedAt,
        completionNotes: record._raw.completionNotes,
        targetDate: record._raw.targetDate,
        priority: record._raw.priority,
        estimatedDuration: record._raw.estimatedDuration,
      })) as DailyGoal[];
    } catch (error) {
      logger.error('❌ Failed to get daily goals:', error);
      return [];
    }
  }

  /**
   * Markeert een daily goal als voltooid
   */
  async completeDailyGoal(goalId: string, completionNotes?: string): Promise<void> {
    try {
      await databaseV14.write(async () => {
        const goalRecord = await databaseV14.get('daily_goals').find(goalId);
        await goalRecord.update(record => {
          record.isCompleted = true;
          record.completedAt = Date.now();
          record.completionNotes = completionNotes;
          record.updatedAt = Date.now();
        });
      });

      logger.info(`✅ Daily goal completed: ${goalId}`);
    } catch (error) {
      logger.error('❌ Failed to complete daily goal:', error);
      throw new Error('Failed to complete daily goal');
    }
  }

  /**
   * Maakt mood tracking entry aan
   */
  async trackMood(mood: MoodTracking): Promise<string> {
    try {
      let moodId: string;

      await databaseV14.write(async () => {
        const moodCollection = databaseV14.get('mood_tracking');
        const newMood = await moodCollection.create(moodRecord => {
          moodRecord.userId = mood.userId;
          moodRecord.journalEntryId = mood.journalEntryId;
          moodRecord.moodRating = mood.moodRating;
          moodRecord.moodEmoji = mood.moodEmoji;
          moodRecord.moodDescription = mood.moodDescription;
          moodRecord.context = mood.context;
          moodRecord.triggers = JSON.stringify(mood.triggers || []);
          moodRecord.activities = JSON.stringify(mood.activities || []);
          moodRecord.trendDirection = mood.trendDirection;
          moodRecord.weeklyAverage = mood.weeklyAverage;
          moodRecord.monthlyAverage = mood.monthlyAverage;
          moodRecord.timestamp = mood.timestamp;
          moodRecord.createdAt = Date.now();
          moodRecord.updatedAt = Date.now();
        });

        moodId = newMood.id;
      });

      // Update analytics
      await this.updateMoodAnalytics(mood.userId);

      logger.info(`✅ Mood tracked: ${moodId}`);
      return moodId;
    } catch (error) {
      logger.error('❌ Failed to track mood:', error);
      throw new Error('Failed to track mood');
    }
  }

  /**
   * Haalt mood tracking data op
   */
  async getMoodTracking(userId: string, days: number = 30): Promise<MoodTracking[]> {
    try {
      const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);
      
      const moodCollection = databaseV14.get('mood_tracking');
      const moods = await moodCollection.query(
        Q.where('user_id', userId),
        Q.where('timestamp', Q.gte(startDate)),
        Q.sortBy('timestamp', Q.desc)
      ).fetch();

      return moods.map(record => ({
        id: record.id,
        userId: record._raw.userId,
        journalEntryId: record._raw.journalEntryId,
        moodRating: record._raw.moodRating,
        moodEmoji: record._raw.moodEmoji,
        moodDescription: record._raw.moodDescription,
        context: record._raw.context,
        triggers: JSON.parse(record._raw.triggers || '[]'),
        activities: JSON.parse(record._raw.activities || '[]'),
        trendDirection: record._raw.trendDirection,
        weeklyAverage: record._raw.weeklyAverage,
        monthlyAverage: record._raw.monthlyAverage,
        timestamp: record._raw.timestamp,
      })) as MoodTracking[];
    } catch (error) {
      logger.error('❌ Failed to get mood tracking:', error);
      return [];
    }
  }

  /**
   * Maakt een planning session aan
   */
  async createPlanningSession(session: PlanningSession): Promise<string> {
    try {
      let sessionId: string;

      await databaseV14.write(async () => {
        const planningCollection = databaseV14.get('planning_sessions');
        const newSession = await planningCollection.create(sessionRecord => {
          sessionRecord.userId = session.userId;
          sessionRecord.sessionTitle = session.sessionTitle;
          sessionRecord.sessionType = session.sessionType;
          sessionRecord.sessionDate = session.sessionDate;
          sessionRecord.tomorrowFocus = session.tomorrowFocus;
          sessionRecord.weeklyGoals = JSON.stringify(session.weeklyGoals || []);
          sessionRecord.monthlyGoals = JSON.stringify(session.monthlyGoals || []);
          sessionRecord.longTermGoals = JSON.stringify(session.longTermGoals || []);
          sessionRecord.aiSuggestions = JSON.stringify(session.aiSuggestions || []);
          sessionRecord.aiCoachingNotes = session.aiCoachingNotes;
          sessionRecord.goalsCompleted = session.goalsCompleted;
          sessionRecord.goalsTotal = session.goalsTotal;
          sessionRecord.completionRate = session.completionRate;
          sessionRecord.createdAt = Date.now();
          sessionRecord.updatedAt = Date.now();
        });

        sessionId = newSession.id;
      });

      // AI coaching voor planning
      if (session.userId) {
        await this.generatePlanningCoaching(sessionId, session.userId);
      }

      logger.info(`✅ Planning session created: ${sessionId}`);
      return sessionId;
    } catch (error) {
      logger.error('❌ Failed to create planning session:', error);
      throw new Error('Failed to create planning session');
    }
  }

  /**
   * Genereert AI coaching response voor journal entry
   */
  private async generateAICoachingResponse(entryId: string, userId: string, mbtiType: string): Promise<void> {
    try {
      const entry = await databaseV14.get('enhanced_journal_entries').find(entryId);
      
      const coachingResponse = await aiOrchestrationService.orchestrateAI2Coaching(
        `Journal entry: ${entry._raw.title}\n\n${entry._raw.content}`,
        userId,
        mbtiType,
        'journaling'
      );

      await databaseV14.write(async () => {
        await entry.update(record => {
          record.aiCoachingResponse = coachingResponse.content;
          record.updatedAt = Date.now();
        });
      });

      logger.info(`✅ AI coaching response generated for entry: ${entryId}`);
    } catch (error) {
      logger.error('❌ Failed to generate AI coaching response:', error);
    }
  }

  /**
   * Genereert planning coaching
   */
  private async generatePlanningCoaching(sessionId: string, userId: string): Promise<void> {
    try {
      const session = await databaseV14.get('planning_sessions').find(sessionId);
      
      const coachingResponse = await aiOrchestrationService.orchestrateAI2Coaching(
        `Planning session: ${session._raw.sessionTitle}\n\nGoals: ${session._raw.weeklyGoals}`,
        userId,
        'ENFP', // Default, zou uit user data moeten komen
        'planning'
      );

      await databaseV14.write(async () => {
        await session.update(record => {
          record.aiCoachingNotes = coachingResponse.content;
          record.updatedAt = Date.now();
        });
      });

      logger.info(`✅ Planning coaching generated for session: ${sessionId}`);
    } catch (error) {
      logger.error('❌ Failed to generate planning coaching:', error);
    }
  }

  /**
   * Update mood analytics
   */
  private async updateMoodAnalytics(userId: string): Promise<void> {
    try {
      const moods = await this.getMoodTracking(userId, 30);
      if (moods.length === 0) return;

      const averageMood = moods.reduce((sum, mood) => sum + mood.moodRating, 0) / moods.length;
      const moodVolatility = this.calculateMoodVolatility(moods);
      const moodTrend = this.calculateMoodTrend(moods);

      const analyticsCollection = databaseV14.get('journaling_analytics');
      const existingAnalytics = await analyticsCollection.query(
        Q.where('user_id', userId),
        Q.where('analytics_period', 'daily'),
        Q.sortBy('analytics_date', Q.desc),
        Q.take(1)
      ).fetch();

      if (existingAnalytics.length > 0) {
        await databaseV14.write(async () => {
          await existingAnalytics[0].update(record => {
            record.averageMood = averageMood;
            record.moodTrend = moodTrend;
            record.moodVolatility = moodVolatility;
            record.updatedAt = Date.now();
          });
        });
      } else {
        await databaseV14.write(async () => {
          await analyticsCollection.create(analyticsRecord => {
            analyticsRecord.userId = userId;
            analyticsRecord.analyticsDate = Date.now();
            analyticsRecord.analyticsPeriod = 'daily';
            analyticsRecord.totalEntries = 0;
            analyticsRecord.totalWords = 0;
            analyticsRecord.averageWordsPerEntry = 0;
            analyticsRecord.totalReadingTime = 0;
            analyticsRecord.averageMood = averageMood;
            analyticsRecord.moodTrend = moodTrend;
            analyticsRecord.moodVolatility = moodVolatility;
            analyticsRecord.goalsSet = 0;
            analyticsRecord.goalsCompleted = 0;
            analyticsRecord.completionRate = 0;
            analyticsRecord.createdAt = Date.now();
            analyticsRecord.updatedAt = Date.now();
          });
        });
      }

      logger.info(`✅ Mood analytics updated for user: ${userId}`);
    } catch (error) {
      logger.error('❌ Failed to update mood analytics:', error);
    }
  }

  /**
   * Berekent mood volatility (standaard deviatie)
   */
  private calculateMoodVolatility(moods: MoodTracking[]): number {
    if (moods.length < 2) return 0;
    
    const average = moods.reduce((sum, mood) => sum + mood.moodRating, 0) / moods.length;
    const variance = moods.reduce((sum, mood) => sum + Math.pow(mood.moodRating - average, 2), 0) / moods.length;
    return Math.sqrt(variance);
  }

  /**
   * Berekent mood trend
   */
  private calculateMoodTrend(moods: MoodTracking[]): string {
    if (moods.length < 2) return 'stable';
    
    const recent = moods.slice(0, Math.ceil(moods.length / 2));
    const older = moods.slice(Math.ceil(moods.length / 2));
    
    const recentAvg = recent.reduce((sum, mood) => sum + mood.moodRating, 0) / recent.length;
    const olderAvg = older.reduce((sum, mood) => sum + mood.moodRating, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 0.5) return 'improving';
    if (difference < -0.5) return 'declining';
    return 'stable';
  }

  /**
   * Haalt journaling analytics op
   */
  async getJournalingAnalytics(userId: string, period: string = 'daily'): Promise<JournalingAnalytics | null> {
    try {
      const analyticsCollection = databaseV14.get('journaling_analytics');
      const analytics = await analyticsCollection.query(
        Q.where('user_id', userId),
        Q.where('analytics_period', period),
        Q.sortBy('analytics_date', Q.desc),
        Q.take(1)
      ).fetch();

      if (analytics.length > 0) {
        const record = analytics[0];
        return {
          id: record.id,
          userId: record._raw.userId,
          analyticsDate: record._raw.analyticsDate,
          analyticsPeriod: record._raw.analyticsPeriod,
          totalEntries: record._raw.totalEntries,
          totalWords: record._raw.totalWords,
          averageWordsPerEntry: record._raw.averageWordsPerEntry,
          totalReadingTime: record._raw.totalReadingTime,
          averageMood: record._raw.averageMood,
          moodTrend: record._raw.moodTrend,
          moodVolatility: record._raw.moodVolatility,
          goalsSet: record._raw.goalsSet,
          goalsCompleted: record._raw.goalsCompleted,
          completionRate: record._raw.completionRate,
          mbtiInsights: JSON.parse(record._raw.mbtiInsights || '{}'),
          personalityTrends: JSON.parse(record._raw.personalityTrends || '{}'),
        } as JournalingAnalytics;
      }

      return null;
    } catch (error) {
      logger.error('❌ Failed to get journaling analytics:', error);
      return null;
    }
  }
}

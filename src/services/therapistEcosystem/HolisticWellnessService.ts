// @ts-nocheck
/**
 * Holistic Wellness Service voor Therapist Ecosystem
 * 
 * Bevat alle functionaliteiten voor holistische welzijn score tracking:
 * - Integratie met bestaande wellness_assessments
 * - Pre/post session tracking
 * - Trend analysis
 * - Encryption en privacy
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { completeDatabaseV14 } from '../../database/v14/completeDatabaseV14';
import { EncryptionService, WellnessScores } from './EncryptionService';

export interface WellnessTrend {
  direction: 'improving' | 'stable' | 'declining';
  changePercentage: number;
  period: string;
  insights: string[];
}

export interface WellnessAssessment {
  userId: string;
  sessionId?: string;
  appointmentId?: string;
  scores: WellnessScores;
  assessmentType: 'pre_session' | 'post_session' | 'weekly' | 'monthly' | 'therapy_session';
  timePoint?: string; // T0, T1, T2, T3, T4... (matches existing wellness_assessments)
  notes?: string;
}

export class HolisticWellnessService {
  private static instance: HolisticWellnessService;
  private encryptionService: EncryptionService;

  private constructor() {
    this.encryptionService = EncryptionService.getInstance();
  }

  public static getInstance(): HolisticWellnessService {
    if (!HolisticWellnessService.instance) {
      HolisticWellnessService.instance = new HolisticWellnessService();
    }
    return HolisticWellnessService.instance;
  }

  /**
   * Track wellness score voor een sessie
   */
  public async trackWellnessScore(assessment: WellnessAssessment): Promise<void> {
    try {
      console.log('📊 Tracking wellness score:', assessment);

      // Encrypt detailed scores
      const encryptedScores = await this.encryptionService.encryptWellnessScores(assessment.scores);
      
      // Encrypt notes if provided
      let encryptedNotes: string | null = null;
      if (assessment.notes) {
        const notesEncrypted = await this.encryptionService.encryptSessionNotes(assessment.notes);
        encryptedNotes = notesEncrypted.ciphertext;
      }

      // Save to WatermelonDB
      await completeDatabaseV14.write(async () => {
        const wellnessCollection = completeDatabaseV14.get('wellness_scores');
        await wellnessCollection.create(wellnessRecord => {
          wellnessRecord.userId = assessment.userId;
          wellnessRecord.sessionId = assessment.sessionId;
          wellnessRecord.appointmentId = assessment.appointmentId;
          wellnessRecord.overallScore = assessment.scores.overall;
          wellnessRecord.physicalWellness = assessment.scores.physical;
          wellnessRecord.mentalWellness = assessment.scores.mental;
          wellnessRecord.emotionalWellness = assessment.scores.emotional;
          wellnessRecord.socialWellness = assessment.scores.social;
          wellnessRecord.spiritualWellness = assessment.scores.spiritual;
          wellnessRecord.detailedScoresEncrypted = encryptedScores.ciphertext;
          wellnessRecord.wellnessNotesEncrypted = encryptedNotes;
          wellnessRecord.assessmentDate = Date.now();
          wellnessRecord.assessmentType = assessment.assessmentType;
          wellnessRecord.timePoint = assessment.timePoint;
          wellnessRecord.isEncrypted = true;
          wellnessRecord.syncToServer = false; // Privacy-first
          wellnessRecord.createdAt = Date.now();
          wellnessRecord.updatedAt = Date.now();
        });
      });

      // Also save to existing wellness_assessments table for compatibility
      await this.saveToWellnessAssessments(assessment, encryptedScores);

      console.log('✅ Wellness score tracked successfully');
    } catch (error) {
      console.error('❌ Failed to track wellness score:', error);
      throw error;
    }
  }

  /**
   * Save to existing wellness_assessments table for compatibility
   */
  private async saveToWellnessAssessments(
    assessment: WellnessAssessment, 
    encryptedScores: any
  ): Promise<void> {
    try {
      await completeDatabaseV14.write(async () => {
        const wellnessAssessmentsCollection = completeDatabaseV14.get('wellness_assessments');
        await wellnessAssessmentsCollection.create(assessmentRecord => {
          assessmentRecord.userId = assessment.userId;
          assessmentRecord.assessmentId = `wellness_${Date.now()}`;
          assessmentRecord.sessionId = assessment.sessionId;
          assessmentRecord.timePoint = assessment.timePoint || 'T0';
          assessmentRecord.answersEncrypted = encryptedScores.ciphertext;
          assessmentRecord.scoresJson = JSON.stringify({
            energy_index: assessment.scores.overall,
            stress_index: 10 - assessment.scores.mental, // Inverse for stress
            social_support_score: assessment.scores.social,
            self_compassion_score: assessment.scores.emotional
          });
          assessmentRecord.mbtiType = 'UNKNOWN'; // Will be updated from user profile
          assessmentRecord.assessmentType = assessment.assessmentType;
          assessmentRecord.completedAt = Date.now();
          assessmentRecord.createdAt = Date.now();
          assessmentRecord.updatedAt = Date.now();
          assessmentRecord.createdBy = 'system';
        });
      });
    } catch (error) {
      console.error('❌ Failed to save to wellness_assessments:', error);
      throw error;
    }
  }

  /**
   * Get wellness trend analysis
   */
  public async getWellnessTrend(userId: string, period: string = '30d'): Promise<WellnessTrend> {
    try {
      console.log(`📈 Analyzing wellness trend for user ${userId} over ${period}`);

      const wellnessCollection = completeDatabaseV14.get('wellness_scores');
      const wellnessRecords = await wellnessCollection
        .query()
        .where('user_id', userId)
        .fetch();

      if (wellnessRecords.length < 2) {
        return {
          direction: 'stable',
          changePercentage: 0,
          period,
          insights: ['Insufficient data for trend analysis']
        };
      }

      // Calculate trend
      const latest = wellnessRecords[wellnessRecords.length - 1];
      const previous = wellnessRecords[wellnessRecords.length - 2];
      
      const changePercentage = ((latest.overallScore - previous.overallScore) / previous.overallScore) * 100;
      
      let direction: 'improving' | 'stable' | 'declining' = 'stable';
      if (changePercentage > 5) direction = 'improving';
      else if (changePercentage < -5) direction = 'declining';

      const insights = this.generateWellnessInsights(wellnessRecords, direction, changePercentage);

      return {
        direction,
        changePercentage: Math.round(changePercentage * 100) / 100,
        period,
        insights
      };
    } catch (error) {
      console.error('❌ Failed to get wellness trend:', error);
      throw error;
    }
  }

  /**
   * Generate wellness insights
   */
  private generateWellnessInsights(
    records: any[], 
    direction: string, 
    changePercentage: number
  ): string[] {
    const insights: string[] = [];

    if (direction === 'improving') {
      insights.push(`Welzijn is met ${Math.abs(changePercentage)}% verbeterd`);
      insights.push('Positieve trend in alle levensgebieden');
    } else if (direction === 'declining') {
      insights.push(`Welzijn is met ${Math.abs(changePercentage)}% gedaald`);
      insights.push('Aandacht nodig voor specifieke levensgebieden');
    } else {
      insights.push('Welzijn blijft stabiel');
      insights.push('Consistente scores over tijd');
    }

    // Add specific insights based on latest scores
    const latest = records[records.length - 1];
    if (latest.physicalWellness < 6) {
      insights.push('Fysiek welzijn heeft aandacht nodig');
    }
    if (latest.mentalWellness < 6) {
      insights.push('Mentaal welzijn kan verbetering gebruiken');
    }
    if (latest.emotionalWellness < 6) {
      insights.push('Emotioneel welzijn verdient focus');
    }

    return insights;
  }

  /**
   * Get latest wellness score
   */
  public async getLatestWellnessScore(userId: string): Promise<WellnessScores | null> {
    try {
      const wellnessCollection = completeDatabaseV14.get('wellness_scores');
      const latestRecord = await wellnessCollection
        .query()
        .where('user_id', userId)
        .sortBy('assessment_date', 'desc')
        .fetchCount();

      if (latestRecord === 0) {
        return null;
      }

      const records = await wellnessCollection
        .query()
        .where('user_id', userId)
        .sortBy('assessment_date', 'desc')
        .fetch();

      const latest = records[0];
      
      return {
        overall: latest.overallScore,
        physical: latest.physicalWellness,
        mental: latest.mentalWellness,
        emotional: latest.emotionalWellness,
        social: latest.socialWellness,
        spiritual: latest.spiritualWellness
      };
    } catch (error) {
      console.error('❌ Failed to get latest wellness score:', error);
      return null;
    }
  }

  /**
   * Get wellness history
   */
  public async getWellnessHistory(userId: string, limit: number = 10): Promise<WellnessScores[]> {
    try {
      const wellnessCollection = completeDatabaseV14.get('wellness_scores');
      const records = await wellnessCollection
        .query()
        .where('user_id', userId)
        .sortBy('assessment_date', 'desc')
        .take(limit)
        .fetch();

      return records.map(record => ({
        overall: record.overallScore,
        physical: record.physicalWellness,
        mental: record.mentalWellness,
        emotional: record.emotionalWellness,
        social: record.socialWellness,
        spiritual: record.spiritualWellness
      }));
    } catch (error) {
      console.error('❌ Failed to get wellness history:', error);
      return [];
    }
  }

  /**
   * Get wellness service status
   */
  public async getServiceStatus(): Promise<{
    isAvailable: boolean;
    totalAssessments: number;
    encryptionStatus: any;
  }> {
    try {
      const wellnessCollection = completeDatabaseV14.get('wellness_scores');
      const totalAssessments = await wellnessCollection.query().fetchCount();
      const encryptionStatus = await this.encryptionService.getEncryptionStatus();

      return {
        isAvailable: true,
        totalAssessments,
        encryptionStatus
      };
    } catch (error) {
      console.error('❌ Failed to get service status:', error);
      return {
        isAvailable: false,
        totalAssessments: 0,
        encryptionStatus: { isAvailable: false }
      };
    }
  }
}

export default HolisticWellnessService;

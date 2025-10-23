/**
 * MBTI Storage Service for MET24 Phase 1
 * 
 * Handles MBTI data storage and retrieval
 * 
 * @version 3.0.0-core
 */

import { databaseV14 } from '../database/v14/databaseV14';
import { MBTIResult, MBTIAnswer, MBTIScore } from './mbtiService';

export interface MBTIStorageData {
  id: string;
  userId: string;
  answers: MBTIAnswer[];
  score: MBTIScore;
  result: MBTIResult;
  completedAt: Date;
  version: string;
}

export interface MBTIHistoryEntry {
  id: string;
  userId: string;
  type: string;
  score: MBTIScore;
  completedAt: Date;
  version: string;
}

export class MBTIStorageService {
  private readonly STORAGE_KEY = 'met24_mbti_data';
  private readonly HISTORY_KEY = 'met24_mbti_history';
  private readonly VERSION = '3.0.0-core';

  /**
   * Save MBTI assessment data
   */
  async saveAssessmentData(data: Omit<MBTIStorageData, 'id' | 'version'>): Promise<MBTIStorageData> {
    try {
      const storageData: MBTIStorageData = {
        ...data,
        id: this.generateId(),
        version: this.VERSION
      };

      // Save to local storage
      await this.saveToLocalStorage(storageData);

      // Save to database
      await this.saveToDatabase(storageData);

      // Add to history
      await this.addToHistory({
        id: storageData.id,
        userId: storageData.userId,
        type: storageData.result.type,
        score: storageData.score,
        completedAt: storageData.completedAt,
        version: storageData.version
      });

      console.log('MBTI Storage Service: Assessment data saved successfully');
      return storageData;
    } catch (error) {
      console.error('MBTI Storage Service: Error saving assessment data', error);
      throw error;
    }
  }

  /**
   * Get MBTI assessment data
   */
  async getAssessmentData(userId: string): Promise<MBTIStorageData | null> {
    try {
      // Try to get from local storage first
      const localData = await this.getFromLocalStorage(userId);
      if (localData) {
        return localData;
      }

      // Fall back to database
      const dbData = await this.getFromDatabase(userId);
      if (dbData) {
        // Cache in local storage
        await this.saveToLocalStorage(dbData);
        return dbData;
      }

      return null;
    } catch (error) {
      console.error('MBTI Storage Service: Error getting assessment data', error);
      return null;
    }
  }

  /**
   * Get MBTI history
   */
  async getMBTIHistory(userId: string): Promise<MBTIHistoryEntry[]> {
    try {
      const history = await this.getHistoryFromLocalStorage(userId);
      return history.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
    } catch (error) {
      console.error('MBTI Storage Service: Error getting MBTI history', error);
      return [];
    }
  }

  /**
   * Update MBTI result
   */
  async updateMBTIResult(userId: string, newResult: MBTIResult): Promise<void> {
    try {
      const existingData = await this.getAssessmentData(userId);
      if (!existingData) {
        throw new Error('No existing MBTI data found');
      }

      const updatedData: MBTIStorageData = {
        ...existingData,
        result: newResult,
        completedAt: new Date()
      };

      await this.saveAssessmentData(updatedData);
      console.log('MBTI Storage Service: MBTI result updated successfully');
    } catch (error) {
      console.error('MBTI Storage Service: Error updating MBTI result', error);
      throw error;
    }
  }

  /**
   * Delete MBTI data
   */
  async deleteMBTIData(userId: string): Promise<void> {
    try {
      // Delete from local storage
      await this.deleteFromLocalStorage(userId);

      // Delete from database
      await this.deleteFromDatabase(userId);

      // Delete from history
      await this.deleteFromHistory(userId);

      console.log('MBTI Storage Service: MBTI data deleted successfully');
    } catch (error) {
      console.error('MBTI Storage Service: Error deleting MBTI data', error);
      throw error;
    }
  }

  /**
   * Export MBTI data
   */
  async exportMBTIData(userId: string): Promise<string> {
    try {
      const data = await this.getAssessmentData(userId);
      const history = await this.getMBTIHistory(userId);

      const exportData = {
        assessment: data,
        history: history,
        exportedAt: new Date().toISOString(),
        version: this.VERSION
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('MBTI Storage Service: Error exporting MBTI data', error);
      throw error;
    }
  }

  /**
   * Import MBTI data
   */
  async importMBTIData(userId: string, jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);

      if (importData.assessment) {
        await this.saveAssessmentData({
          ...importData.assessment,
          userId: userId,
          completedAt: new Date(importData.assessment.completedAt)
        });
      }

      if (importData.history && Array.isArray(importData.history)) {
        for (const entry of importData.history) {
          await this.addToHistory({
            ...entry,
            userId: userId,
            completedAt: new Date(entry.completedAt)
          });
        }
      }

      console.log('MBTI Storage Service: MBTI data imported successfully');
    } catch (error) {
      console.error('MBTI Storage Service: Error importing MBTI data', error);
      throw error;
    }
  }

  /**
   * Get MBTI statistics
   */
  async getMBTIStatistics(userId: string): Promise<{
    totalAssessments: number;
    firstAssessment: Date | null;
    lastAssessment: Date | null;
    mostCommonType: string | null;
    typeDistribution: { [key: string]: number };
  }> {
    try {
      const history = await this.getMBTIHistory(userId);

      if (history.length === 0) {
        return {
          totalAssessments: 0,
          firstAssessment: null,
          lastAssessment: null,
          mostCommonType: null,
          typeDistribution: {}
        };
      }

      const typeDistribution: { [key: string]: number } = {};
      history.forEach(entry => {
        typeDistribution[entry.type] = (typeDistribution[entry.type] || 0) + 1;
      });

      const mostCommonType = Object.keys(typeDistribution).reduce((a, b) =>
        typeDistribution[a] > typeDistribution[b] ? a : b
      );

      return {
        totalAssessments: history.length,
        firstAssessment: history[history.length - 1].completedAt,
        lastAssessment: history[0].completedAt,
        mostCommonType,
        typeDistribution
      };
    } catch (error) {
      console.error('MBTI Storage Service: Error getting MBTI statistics', error);
      return {
        totalAssessments: 0,
        firstAssessment: null,
        lastAssessment: null,
        mostCommonType: null,
        typeDistribution: {}
      };
    }
  }

  /**
   * Save to local storage
   */
  private async saveToLocalStorage(data: MBTIStorageData): Promise<void> {
    try {
      const key = `${this.STORAGE_KEY}_${data.userId}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('MBTI Storage Service: Error saving to local storage', error);
    }
  }

  /**
   * Get from local storage
   */
  private async getFromLocalStorage(userId: string): Promise<MBTIStorageData | null> {
    try {
      const key = `${this.STORAGE_KEY}_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('MBTI Storage Service: Error getting from local storage', error);
      return null;
    }
  }

  /**
   * Delete from local storage
   */
  private async deleteFromLocalStorage(userId: string): Promise<void> {
    try {
      const key = `${this.STORAGE_KEY}_${userId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('MBTI Storage Service: Error deleting from local storage', error);
    }
  }

  /**
   * Save to database
   */
  private async saveToDatabase(data: MBTIStorageData): Promise<void> {
    try {
      await databaseV14.write(async () => {
        // This would save to your MBTI results table
        // For now, just log it
        console.log('MBTI Storage Service: Saving to database', data);
      });
    } catch (error) {
      console.error('MBTI Storage Service: Error saving to database', error);
    }
  }

  /**
   * Get from database
   */
  private async getFromDatabase(userId: string): Promise<MBTIStorageData | null> {
    try {
      // This would fetch from your database
      // For now, return null
      return null;
    } catch (error) {
      console.error('MBTI Storage Service: Error getting from database', error);
      return null;
    }
  }

  /**
   * Delete from database
   */
  private async deleteFromDatabase(userId: string): Promise<void> {
    try {
      await databaseV14.write(async () => {
        // This would delete from your database
        // For now, just log it
        console.log('MBTI Storage Service: Deleting from database', userId);
      });
    } catch (error) {
      console.error('MBTI Storage Service: Error deleting from database', error);
    }
  }

  /**
   * Add to history
   */
  private async addToHistory(entry: MBTIHistoryEntry): Promise<void> {
    try {
      const history = await this.getHistoryFromLocalStorage(entry.userId);
      history.push(entry);
      
      const key = `${this.HISTORY_KEY}_${entry.userId}`;
      localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
      console.error('MBTI Storage Service: Error adding to history', error);
    }
  }

  /**
   * Get history from local storage
   */
  private async getHistoryFromLocalStorage(userId: string): Promise<MBTIHistoryEntry[]> {
    try {
      const key = `${this.HISTORY_KEY}_${userId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('MBTI Storage Service: Error getting history from local storage', error);
      return [];
    }
  }

  /**
   * Delete from history
   */
  private async deleteFromHistory(userId: string): Promise<void> {
    try {
      const key = `${this.HISTORY_KEY}_${userId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('MBTI Storage Service: Error deleting from history', error);
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `mbti_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const mbtiStorageService = new MBTIStorageService();

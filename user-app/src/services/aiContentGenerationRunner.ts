/**
 * AI Content Generation Runner
 * 
 * Start de AI content generatie voor alle 16 MBTI types
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Database } from "@nozbe/watermelondb";
import { supabase } from "../config/supabase";
import { AIContentGenerationService } from "./aiContentGenerationService";

export class AIContentGenerationRunner {
  private service: AIContentGenerationService;
  private isRunning: boolean = false;

  constructor(database: Database) {
    this.service = new AIContentGenerationService(database, supabase);
  }

  /**
   * Start AI content generatie
   */
  async startGeneration(): Promise<void> {
    try {
      console.log('🚀 Starting AI content generation...');
      this.isRunning = true;

      // Start generatie
      await this.service.startAIContentGeneration();

      console.log('✅ AI content generation completed!');
      this.isRunning = false;

    } catch (error) {
      console.error('❌ AI content generation failed:', error);
      this.isRunning = false;
      throw error;
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    return this.service.getProgress();
  }

  /**
   * Check if running
   */
  isGenerationRunning(): boolean {
    return this.isRunning;
  }
}

// Export singleton instance
export const aiContentGenerationRunner = new AIContentGenerationRunner(
  {} as Database // Will be injected
);









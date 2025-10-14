/**
 * AI Content Generation API Endpoint
 * 
 * POST /api/ai/generate-content
 * Start AI content generatie voor alle 16 MBTI types
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { Request, Response } from 'express';
import { aiContentGenerationRunner } from '../../services/aiContentGenerationRunner';

export async function generateAIContent(req: Request, res: Response) {
  try {
    console.log('🚀 Starting AI content generation via API...');

    // Start generatie
    await aiContentGenerationRunner.startGeneration();

    res.status(200).json({
      success: true,
      message: 'AI content generation completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI content generation failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}

export async function getGenerationProgress(req: Request, res: Response) {
  try {
    const progress = aiContentGenerationRunner.getProgress();
    const isRunning = aiContentGenerationRunner.isGenerationRunning();

    res.status(200).json({
      success: true,
      progress,
      isRunning,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Failed to get generation progress:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}









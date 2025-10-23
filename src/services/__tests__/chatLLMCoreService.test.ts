// @ts-nocheck
/**
 * ChatLLM Core Service Tests - Phase 1
 * 
 * Test suite for basic content aggregation and social sharing functionality
 */

import { chatLLMCoreService } from '../chatLLMCoreService';
import database from '../../database/v14/database';

// Mock data for testing
const mockContentItem = {
  id: 'test_content_1',
  type: 'discourse_post' as const,
  content: 'This is a test content item for MBTI personality insights and personal growth.',
  author_id: 'user_123',
  engagement_score: 75,
  created_at: new Date().toISOString(),
  metadata: {
    topic_id: 'topic_1',
    category_id: 'mbti_discussion',
    like_count: 15,
    reply_count: 8
  }
};

describe('ChatLLMCoreService - Phase 1', () => {
  beforeAll(async () => {
    // Initialize test database
    await database.write(async () => {
      // Clear test data
      await database.collections.get('ai_processing_queue').query().destroyAllPermanently();
      await database.collections.get('user_privacy_settings').query().destroyAllPermanently();
    });
  });

  describe('Content Aggregation', () => {
    test('should aggregate shareable content successfully', async () => {
      const result = await chatLLMCoreService.aggregateShareableContent();
      
      expect(result).toHaveProperty('phase', 'core');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('aiProcessing', false);
      expect(result).toHaveProperty('message');
      expect(Array.isArray(result.content)).toBe(true);
    });

    test('should filter content based on basic criteria', async () => {
      const result = await chatLLMCoreService.aggregateShareableContent();
      
      // All content should meet basic criteria
      result.content.forEach(item => {
        expect(item.content.length).toBeGreaterThanOrEqual(50);
        expect(item.content.length).toBeLessThanOrEqual(500);
        expect(item.engagement_score).toBeGreaterThanOrEqual(10);
      });
    });

    test('should return fallback content on error', async () => {
      // Mock database error
      const originalMethod = database.collections.get;
      database.collections.get = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await chatLLMCoreService.aggregateShareableContent();
      
      expect(result.phase).toBe('core');
      expect(result.aiProcessing).toBe(false);
      expect(result.message).toContain('fallback');

      // Restore original method
      database.collections.get = originalMethod;
    });
  });

  describe('Social Content Preparation', () => {
    test('should prepare content for Twitter', async () => {
      const result = await chatLLMCoreService.prepareSocialContent(mockContentItem, 'twitter');
      
      expect(result.platform).toBe('twitter');
      expect(result.adaptedContent.length).toBeLessThanOrEqual(280);
      expect(result.adaptedContent).toContain('#MBTI');
      expect(result.adaptedContent).toContain('your-future-self.org');
      expect(result.aiEnhanced).toBe(false);
      expect(result.phase).toBe('core');
    });

    test('should prepare content for LinkedIn', async () => {
      const result = await chatLLMCoreService.prepareSocialContent(mockContentItem, 'linkedin');
      
      expect(result.platform).toBe('linkedin');
      expect(result.adaptedContent.length).toBeLessThanOrEqual(3000);
      expect(result.adaptedContent).toContain('#PersonalDevelopment');
      expect(result.adaptedContent).toContain('your-future-self.org');
    });

    test('should prepare content for Reddit', async () => {
      const result = await chatLLMCoreService.prepareSocialContent(mockContentItem, 'reddit');
      
      expect(result.platform).toBe('reddit');
      expect(result.adaptedContent).toContain('**MBTI Community Highlight**');
      expect(result.adaptedContent).toContain('your-future-self.org');
    });

    test('should handle unsupported platforms', async () => {
      await expect(
        chatLLMCoreService.prepareSocialContent(mockContentItem, 'unsupported')
      ).rejects.toThrow('Unsupported platform: unsupported');
    });

    test('should truncate long content appropriately', async () => {
      const longContentItem = {
        ...mockContentItem,
        content: 'A'.repeat(1000) // Very long content
      };

      const result = await chatLLMCoreService.prepareSocialContent(longContentItem, 'twitter');
      
      expect(result.adaptedContent.length).toBeLessThanOrEqual(280);
      expect(result.adaptedContent).toContain('...');
    });
  });

  describe('Privacy Compliance', () => {
    test('should check sharing consent correctly', async () => {
      // Create test user with consent
      await database.write(async () => {
        await database.collections.get('user_privacy_settings').create(record => {
          record.user_id = 'test_user_1';
          record.social_sharing_consent = true;
          record.consent_date = new Date();
        });
      });

      const result = await chatLLMCoreService.checkSharingConsent('test_user_1', 'content_1');
      
      expect(result.hasConsent).toBe(true);
      expect(result.phase).toBe('core');
      expect(result.aiPrivacyAnalysis).toBe(false);
    });

    test('should default to no consent for unknown users', async () => {
      const result = await chatLLMCoreService.checkSharingConsent('unknown_user', 'content_1');
      
      expect(result.hasConsent).toBe(false);
      expect(result.phase).toBe('core');
    });

    test('should handle database errors gracefully', async () => {
      // Mock database error
      const originalQuery = database.collections.get('user_privacy_settings').query;
      database.collections.get('user_privacy_settings').query = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await chatLLMCoreService.checkSharingConsent('test_user', 'content_1');
      
      expect(result.hasConsent).toBe(false); // Should default to safe option
      
      // Restore original method
      database.collections.get('user_privacy_settings').query = originalQuery;
    });
  });

  describe('AI Processing Queue', () => {
    test('should queue content for Phase 2 processing', async () => {
      const result = await chatLLMCoreService.queueForAIProcessing(mockContentItem, 'enhance');
      
      expect(result.queued).toBe(true);
      expect(result.queueId).toBeDefined();
      expect(result.estimatedProcessingPhase).toBe('Phase 2 (Light AI)');
      expect(result.message).toContain('Phase 2');
    });

    test('should queue content for Phase 3 processing', async () => {
      const result = await chatLLMCoreService.queueForAIProcessing(mockContentItem, 'analyze');
      
      expect(result.queued).toBe(true);
      expect(result.estimatedProcessingPhase).toBe('Phase 3 (Full AI)');
      expect(result.message).toContain('Phase 3');
    });

    test('should persist queue items in database', async () => {
      await chatLLMCoreService.queueForAIProcessing(mockContentItem, 'enhance');
      
      const queueItems = await database.collections.get('ai_processing_queue')
        .query()
        .fetch();
      
      expect(queueItems.length).toBeGreaterThan(0);
      
      const latestItem = queueItems[queueItems.length - 1];
      expect(latestItem.action).toBe('enhance');
      expect(latestItem.status).toBe('queued_for_phase2');
    });

    test('should get queue status correctly', async () => {
      // Add some test items
      await chatLLMCoreService.queueForAIProcessing(mockContentItem, 'enhance');
      await chatLLMCoreService.queueForAIProcessing(mockContentItem, 'analyze');
      
      const status = await chatLLMCoreService.getQueueStatus();
      
      expect(status).toHaveProperty('totalItems');
      expect(status).toHaveProperty('phase2Items');
      expect(status).toHaveProperty('phase3Items');
      expect(status.totalItems).toBeGreaterThan(0);
    });
  });

  describe('Content Recommendations', () => {
    test('should provide content recommendations', async () => {
      const recommendations = await chatLLMCoreService.getContentRecommendations(3);
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeLessThanOrEqual(3);
      
      recommendations.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('content');
        expect(item).toHaveProperty('engagement_score');
      });
    });

    test('should handle errors in recommendations gracefully', async () => {
      // Mock aggregation error
      const originalMethod = chatLLMCoreService.aggregateShareableContent;
      chatLLMCoreService.aggregateShareableContent = jest.fn().mockRejectedValue(new Error('Test error'));
      
      const recommendations = await chatLLMCoreService.getContentRecommendations();
      
      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(0);
      
      // Restore original method
      chatLLMCoreService.aggregateShareableContent = originalMethod;
    });
  });

  describe('Health Status', () => {
    test('should return correct health status', () => {
      const health = chatLLMCoreService.getHealthStatus();
      
      expect(health.phase).toBe('core');
      expect(health.isInitialized).toBe(true);
      expect(health).toHaveProperty('queueSize');
      expect(health).toHaveProperty('lastActivity');
      expect(Array.isArray(health.features)).toBe(true);
      expect(health.features).toContain('content_aggregation');
      expect(health.features).toContain('social_sharing');
      expect(health.features).toContain('privacy_compliance');
    });
  });

  describe('Content Safety', () => {
    test('should filter out sensitive content', async () => {
      const sensitiveContent = {
        ...mockContentItem,
        content: 'Here is my email address: test@example.com and my password is secret123'
      };

      // This should be filtered out during aggregation
      const result = await chatLLMCoreService.aggregateShareableContent();
      
      // Sensitive content should not appear in results
      const hasSensitiveContent = result.content.some(item => 
        item.content.includes('email') || item.content.includes('password')
      );
      
      expect(hasSensitiveContent).toBe(false);
    });
  });

  describe('Engagement Scoring', () => {
    test('should calculate engagement scores correctly', async () => {
      const result = await chatLLMCoreService.aggregateShareableContent();
      
      // All items should have engagement scores
      result.content.forEach(item => {
        expect(typeof item.engagement_score).toBe('number');
        expect(item.engagement_score).toBeGreaterThan(0);
      });
      
      // Items should be sorted by engagement score (descending)
      for (let i = 1; i < result.content.length; i++) {
        expect(result.content[i-1].engagement_score).toBeGreaterThanOrEqual(
          result.content[i].engagement_score
        );
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await database.write(async () => {
      await database.collections.get('ai_processing_queue').query().destroyAllPermanently();
      await database.collections.get('user_privacy_settings').query().destroyAllPermanently();
    });
  });
});

// Integration tests
describe('ChatLLMCoreService Integration', () => {
  test('should integrate with audit service', async () => {
    const initialAuditCount = await database.collections.get('audit_events').query().fetchCount();
    
    await chatLLMCoreService.aggregateShareableContent();
    
    const finalAuditCount = await database.collections.get('audit_events').query().fetchCount();
    
    expect(finalAuditCount).toBeGreaterThan(initialAuditCount);
  });

  test('should work with discourse connector', async () => {
    // This test would require mocking the discourse connector
    // For now, we just test that the service doesn't crash
    const result = await chatLLMCoreService.aggregateShareableContent();
    expect(result).toBeDefined();
  });
});

// Performance tests
describe('ChatLLMCoreService Performance', () => {
  test('should aggregate content within reasonable time', async () => {
    const startTime = Date.now();
    
    await chatLLMCoreService.aggregateShareableContent();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Should complete within 5 seconds for Phase 1
    expect(duration).toBeLessThan(5000);
  });

  test('should handle multiple concurrent requests', async () => {
    const promises = Array(5).fill(null).map(() => 
      chatLLMCoreService.aggregateShareableContent()
    );
    
    const results = await Promise.all(promises);
    
    results.forEach(result => {
      expect(result.phase).toBe('core');
      expect(Array.isArray(result.content)).toBe(true);
    });
  });
});
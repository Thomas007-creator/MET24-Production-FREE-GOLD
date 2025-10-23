/**
 * Database Schema Extensions for ChatLLM Core Service
 * Phase 1 Implementation - Basic tables for content aggregation and AI processing queue
 * 
 * Tables:
 * - user_privacy_settings: User consent and privacy preferences
 * - ai_processing_queue: Queue for future AI processing in Phase 2+
 * - mbti_insights: Static MBTI content for sharing
 * - content_engagement_metrics: Basic engagement tracking
 */

import { Database } from '@nozbe/watermelondb';
import { Model, Q } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

// User Privacy Settings Model
export class UserPrivacySettings extends Model {
  static table = 'user_privacy_settings';

  @field('user_id') userId!: string;
  @field('social_sharing_consent') socialSharingConsent!: boolean;
  @field('data_processing_consent') dataProcessingConsent!: boolean;
  @field('marketing_consent') marketingConsent!: boolean;
  @field('analytics_consent') analyticsConsent!: boolean;
  @date('consent_date') consentDate!: Date;
  @date('last_updated') lastUpdated!: Date;
  @field('consent_version') consentVersion!: string;
  @field('ip_address') ipAddress?: string;
  @field('user_agent') userAgent?: string;
}

// AI Processing Queue Model
export class AIProcessingQueue extends Model {
  static table = 'ai_processing_queue';

  @field('content') content!: string; // JSON stringified ContentItem
  @field('action') action!: string; // 'enhance' | 'analyze' | 'personalize' | 'moderate'
  @field('phase') phase!: string;
  @field('status') status!: string; // 'queued_for_phase2' | 'queued_for_phase3' | 'processing' | 'completed'
  @field('priority') priority!: string; // 'low' | 'medium' | 'high'
  @date('created_at') createdAt!: Date;
  @date('scheduled_for') scheduledFor?: Date;
  @date('processed_at') processedAt?: Date;
  @field('processing_result') processingResult?: string; // JSON stringified result
  @field('error_message') errorMessage?: string;
  @field('retry_count') retryCount!: number;
}

// MBTI Insights Model
export class MBTIInsights extends Model {
  static table = 'mbti_insights';

  @field('content') content!: string;
  @field('mbti_type') mbtiType!: string; // 'INTJ', 'ENFP', etc. or 'all'
  @field('category') category!: string; // 'general', 'career', 'relationships', etc.
  @field('popularity_score') popularityScore!: number;
  @field('source') source!: string; // 'static', 'community', 'expert'
  @field('tags') tags?: string; // JSON array of tags
  @date('created_at') createdAt!: Date;
  @date('last_shared') lastShared?: Date;
  @field('share_count') shareCount!: number;
  @field('engagement_metrics') engagementMetrics?: string; // JSON object
}

// Content Engagement Metrics Model
export class ContentEngagementMetrics extends Model {
  static table = 'content_engagement_metrics';

  @field('content_id') contentId!: string;
  @field('content_type') contentType!: string; // 'discourse_post' | 'user_journal' | 'mbti_insight'
  @field('view_count') viewCount!: number;
  @field('like_count') likeCount!: number;
  @field('share_count') shareCount!: number;
  @field('comment_count') commentCount!: number;
  @field('engagement_score') engagementScore!: number;
  @date('last_updated') lastUpdated!: Date;
  @field('platform_metrics') platformMetrics?: string; // JSON object with platform-specific metrics
}

// Database Schema Definition
export const chatLLMCoreSchema = [
  {
    name: 'user_privacy_settings',
    columns: [
      { name: 'user_id', type: 'string', isIndexed: true },
      { name: 'social_sharing_consent', type: 'boolean' },
      { name: 'data_processing_consent', type: 'boolean' },
      { name: 'marketing_consent', type: 'boolean' },
      { name: 'analytics_consent', type: 'boolean' },
      { name: 'consent_date', type: 'number' },
      { name: 'last_updated', type: 'number' },
      { name: 'consent_version', type: 'string' },
      { name: 'ip_address', type: 'string', isOptional: true },
      { name: 'user_agent', type: 'string', isOptional: true },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' }
    ]
  },
  {
    name: 'ai_processing_queue',
    columns: [
      { name: 'content', type: 'string' },
      { name: 'action', type: 'string', isIndexed: true },
      { name: 'phase', type: 'string', isIndexed: true },
      { name: 'status', type: 'string', isIndexed: true },
      { name: 'priority', type: 'string', isIndexed: true },
      { name: 'created_at', type: 'number', isIndexed: true },
      { name: 'scheduled_for', type: 'number', isOptional: true },
      { name: 'processed_at', type: 'number', isOptional: true },
      { name: 'processing_result', type: 'string', isOptional: true },
      { name: 'error_message', type: 'string', isOptional: true },
      { name: 'retry_count', type: 'number' },
      { name: 'updated_at', type: 'number' }
    ]
  },
  {
    name: 'mbti_insights',
    columns: [
      { name: 'content', type: 'string' },
      { name: 'mbti_type', type: 'string', isIndexed: true },
      { name: 'category', type: 'string', isIndexed: true },
      { name: 'popularity_score', type: 'number', isIndexed: true },
      { name: 'source', type: 'string' },
      { name: 'tags', type: 'string', isOptional: true },
      { name: 'created_at', type: 'number', isIndexed: true },
      { name: 'last_shared', type: 'number', isOptional: true },
      { name: 'share_count', type: 'number' },
      { name: 'engagement_metrics', type: 'string', isOptional: true },
      { name: 'updated_at', type: 'number' }
    ]
  },
  {
    name: 'content_engagement_metrics',
    columns: [
      { name: 'content_id', type: 'string', isIndexed: true },
      { name: 'content_type', type: 'string', isIndexed: true },
      { name: 'view_count', type: 'number' },
      { name: 'like_count', type: 'number' },
      { name: 'share_count', type: 'number' },
      { name: 'comment_count', type: 'number' },
      { name: 'engagement_score', type: 'number', isIndexed: true },
      { name: 'last_updated', type: 'number' },
      { name: 'platform_metrics', type: 'string', isOptional: true },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' }
    ]
  }
];

// Migration script for Phase 1
export const chatLLMCoreMigration = {
  toVersion: 15, // Assuming current is v14
  steps: [
    {
      type: 'create_table',
      schema: chatLLMCoreSchema[0] // user_privacy_settings
    },
    {
      type: 'create_table', 
      schema: chatLLMCoreSchema[1] // ai_processing_queue
    },
    {
      type: 'create_table',
      schema: chatLLMCoreSchema[2] // mbti_insights
    },
    {
      type: 'create_table',
      schema: chatLLMCoreSchema[3] // content_engagement_metrics
    }
  ]
};

// Seed data for MBTI insights (Phase 1 static content)
export const mbtiInsightsSeedData = [
  {
    content: "Understanding your MBTI type is the first step towards personal growth and better relationships.",
    mbti_type: "all",
    category: "general",
    popularity_score: 85,
    source: "static",
    tags: JSON.stringify(["personal-growth", "relationships", "self-awareness"]),
    share_count: 0,
    engagement_metrics: JSON.stringify({ views: 0, likes: 0, shares: 0 })
  },
  {
    content: "INTJs thrive when they can work independently on complex problems that align with their long-term vision.",
    mbti_type: "INTJ",
    category: "career",
    popularity_score: 78,
    source: "static",
    tags: JSON.stringify(["INTJ", "career", "independence", "vision"]),
    share_count: 0,
    engagement_metrics: JSON.stringify({ views: 0, likes: 0, shares: 0 })
  },
  {
    content: "ENFPs bring enthusiasm and creativity to every project, inspiring others with their boundless energy.",
    mbti_type: "ENFP",
    category: "strengths",
    popularity_score: 82,
    source: "static",
    tags: JSON.stringify(["ENFP", "creativity", "enthusiasm", "inspiration"]),
    share_count: 0,
    engagement_metrics: JSON.stringify({ views: 0, likes: 0, shares: 0 })
  },
  {
    content: "ISTJs excel at creating structure and stability, making them invaluable in organizational settings.",
    mbti_type: "ISTJ",
    category: "strengths",
    popularity_score: 75,
    source: "static",
    tags: JSON.stringify(["ISTJ", "structure", "stability", "organization"]),
    share_count: 0,
    engagement_metrics: JSON.stringify({ views: 0, likes: 0, shares: 0 })
  },
  {
    content: "ESFPs have a natural gift for connecting with others and creating positive, energetic environments.",
    mbti_type: "ESFP",
    category: "relationships",
    popularity_score: 80,
    source: "static",
    tags: JSON.stringify(["ESFP", "connection", "positive-energy", "relationships"]),
    share_count: 0,
    engagement_metrics: JSON.stringify({ views: 0, likes: 0, shares: 0 })
  }
];

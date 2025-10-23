/**
 * V14 Database Migrations
 * 
 * Migrations voor WatermelonDB V14
 * 
 * @version 14.0.0
 * @author Thomas
 */

import { schemaMigrations, createTable, addColumns } from "@nozbe/watermelondb/Schema/migrations";

export const migrationsV14 = schemaMigrations({
  migrations: [
    {
      toVersion: 14,
      steps: [
        // 1. Nieuwe tabellen toevoegen
        createTable({
          name: 'contacts',
          columns: [
            { name: 'user_id', type: 'string', isIndexed: true },
            { name: 'contact_id', type: 'string', isIndexed: true },
            { name: 'name', type: 'string' },
            { name: 'avatar', type: 'string', isOptional: true },
            { name: 'mbti_type', type: 'string', isOptional: true },
            { name: 'is_ai', type: 'boolean' },
            { name: 'is_online', type: 'boolean' },
            { name: 'last_message', type: 'string', isOptional: true },
            { name: 'last_message_time', type: 'number', isOptional: true },
            { name: 'unread_count', type: 'number' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        createTable({
          name: 'tasks',
          columns: [
            { name: 'user_id', type: 'string', isIndexed: true },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string', isOptional: true },
            { name: 'completed', type: 'boolean' },
            { name: 'priority', type: 'string' },
            { name: 'due_date', type: 'number', isOptional: true },
            { name: 'category', type: 'string', isOptional: true },
            { name: 'tags', type: 'string', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'created_by', type: 'string' },
          ],
        }),

        createTable({
          name: 'future_extensions',
          columns: [
            { name: 'extension_id', type: 'string', isIndexed: true },
            { name: 'extension_type', type: 'string', isIndexed: true },
            { name: 'extension_name', type: 'string' },
            { name: 'version', type: 'string', isOptional: true },
            { name: 'user_id', type: 'string', isIndexed: true, isOptional: true },
            { name: 'parent_extension_id', type: 'string', isIndexed: true, isOptional: true },
            { name: 'data_json', type: 'string' },
            { name: 'configuration', type: 'string', isOptional: true },
            { name: 'permissions', type: 'string', isOptional: true },
            { name: 'status', type: 'string', isOptional: true },
            { name: 'is_enabled', type: 'boolean' },
            { name: 'is_public', type: 'boolean', isOptional: true },
            { name: 'is_premium', type: 'boolean', isOptional: true },
            { name: 'description', type: 'string', isOptional: true },
            { name: 'author', type: 'string', isOptional: true },
            { name: 'category', type: 'string', isOptional: true },
            { name: 'tags', type: 'string', isOptional: true },
            { name: 'usage_count', type: 'number', isOptional: true },
            { name: 'last_used', type: 'number', isOptional: true },
            { name: 'performance_metrics', type: 'string', isOptional: true },
            { name: 'dependencies', type: 'string', isOptional: true },
            { name: 'compatibility_version', type: 'string', isOptional: true },
            { name: 'installed_at', type: 'number', isOptional: true },
            { name: 'last_updated', type: 'number', isOptional: true },
            { name: 'expires_at', type: 'number', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        createTable({
          name: 'extension_events',
          columns: [
            { name: 'extension_id', type: 'string', isIndexed: true },
            { name: 'user_id', type: 'string', isIndexed: true, isOptional: true },
            { name: 'event_type', type: 'string', isIndexed: true },
            { name: 'event_data', type: 'string', isOptional: true },
            { name: 'severity', type: 'string', isOptional: true },
            { name: 'session_id', type: 'string', isOptional: true },
            { name: 'device_info', type: 'string', isOptional: true },
            { name: 'app_version', type: 'string', isOptional: true },
            { name: 'event_timestamp', type: 'number' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        createTable({
          name: 'extension_settings',
          columns: [
            { name: 'extension_id', type: 'string', isIndexed: true },
            { name: 'user_id', type: 'string', isIndexed: true, isOptional: true },
            { name: 'setting_key', type: 'string', isIndexed: true },
            { name: 'setting_value', type: 'string' },
            { name: 'setting_type', type: 'string', isOptional: true },
            { name: 'is_encrypted', type: 'boolean', isOptional: true },
            { name: 'description', type: 'string', isOptional: true },
            { name: 'default_value', type: 'string', isOptional: true },
            { name: 'validation_rules', type: 'string', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        // 2. Nieuwe kolommen toevoegen aan bestaande tabellen
        addColumns({
          table: 'users',
          columns: [
            { name: 'language', type: 'string', isOptional: true },
            { name: 'timezone', type: 'string', isOptional: true },
            { name: 'bio', type: 'string', isOptional: true },
            { name: 'location', type: 'string', isOptional: true },
            { name: 'website', type: 'string', isOptional: true },
            { name: 'privacy_level', type: 'string', isOptional: true },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        addColumns({
          table: 'settings',
          columns: [
            { name: 'category', type: 'string', isOptional: true },
            { name: 'data_type', type: 'string', isOptional: true },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        addColumns({
          table: 'mbti_profiles',
          columns: [
            { name: 'confidence_score', type: 'number', isOptional: true },
            { name: 'test_version', type: 'string', isOptional: true },
            { name: 'ai_insights', type: 'string', isOptional: true },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        addColumns({
          table: 'life_areas_progress',
          columns: [
            { name: 'milestones', type: 'string', isOptional: true },
            { name: 'last_updated', type: 'number', isOptional: true },
            { name: 'update_frequency', type: 'string', isOptional: true },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        addColumns({
          table: 'chat_messages',
          columns: [
            { name: 'contact_id', type: 'string', isIndexed: true, isOptional: true },
            { name: 'message_type', type: 'string', isOptional: true },
            { name: 'context_type', type: 'string', isOptional: true },
            { name: 'ai_model', type: 'string', isOptional: true },
            { name: 'tokens_used', type: 'number', isOptional: true },
            { name: 'is_read', type: 'boolean', isOptional: true },
            { name: 'is_edited', type: 'boolean', isOptional: true },
            { name: 'edit_count', type: 'number', isOptional: true },
            { name: 'read_at', type: 'number', isOptional: true },
            { name: 'edited_at', type: 'number', isOptional: true },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        addColumns({
          table: 'journal_entries',
          columns: [
            { name: 'category', type: 'string', isOptional: true },
            { name: 'prompt_id', type: 'string', isOptional: true },
            { name: 'mbti_type', type: 'string', isOptional: true },
            { name: 'ai_insights', type: 'string', isOptional: true },
            { name: 'sentiment_score', type: 'number', isOptional: true },
            { name: 'content_reflections', type: 'string', isOptional: true },
            { name: 'insights', type: 'string', isOptional: true },
            { name: 'last_edited', type: 'number', isOptional: true },
            { name: 'is_private', type: 'boolean', isOptional: true },
            { name: 'is_favorite', type: 'boolean', isOptional: true },
            { name: 'word_count', type: 'number', isOptional: true },
            { name: 'created_by', type: 'string' },
            { name: 'metadata', type: 'string', isOptional: true },
          ],
        }),

        // 3. Indexes worden automatisch toegevoegd door WatermelonDB
      ],
    },
  ],
});

export default migrationsV14;

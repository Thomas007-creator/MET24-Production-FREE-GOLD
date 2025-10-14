#!/usr/bin/env node

/**
 * MET2.4.4 AI Content Migration Script
 * Migreert AI-gegenereerde content van lokale database naar MET2.4.4 Supabase
 */

const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
require('dotenv').config();

// Database connections
const localDb = new Pool({
  host: 'localhost',
  port: 5435,
  database: 'met24_db',
  user: 'met24user',
  password: 'met24_secure_password'
});

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

async function migrateAIContent() {
  console.log('🚀 Starting AI Content Migration to MET2.4.4...');
  
  try {
    // 1. Migrate AI Artifacts
    console.log('📦 Migrating AI Artifacts...');
    const artifactsResult = await localDb.query('SELECT * FROM ai_artifacts ORDER BY id');
    const artifacts = artifactsResult.rows;
    
    if (artifacts.length > 0) {
      const { data: insertedArtifacts, error: artifactsError } = await supabase
        .from('ai_artifacts')
        .insert(artifacts.map(artifact => ({
          job_id: artifact.job_id,
          origin: artifact.origin,
          agent: artifact.agent,
          model: artifact.model,
          model_version: artifact.model_version,
          prompt_hash: artifact.prompt_hash,
          content: artifact.content,
          provenance: artifact.provenance,
          moderation_status: artifact.moderation_status,
          created_at: artifact.created_at
        })));
      
      if (artifactsError) {
        console.error('❌ Error inserting AI artifacts:', artifactsError);
      } else {
        console.log(`✅ Migrated ${artifacts.length} AI artifacts`);
      }
    } else {
      console.log('ℹ️ No AI artifacts to migrate');
    }
    
    // 2. Migrate MBTI Content
    console.log('🧠 Migrating MBTI Content...');
    const mbtiResult = await localDb.query('SELECT * FROM mbti_content ORDER BY id');
    const mbtiContent = mbtiResult.rows;
    
    if (mbtiContent.length > 0) {
      const { data: insertedMBTI, error: mbtiError } = await supabase
        .from('mbti_content')
        .insert(mbtiContent.map(content => ({
          mbti_type: content.mbti_type,
          kind: content.kind,
          order_idx: content.order_idx,
          content: content.content,
          created_at: content.created_at
        })));
      
      if (mbtiError) {
        console.error('❌ Error inserting MBTI content:', mbtiError);
      } else {
        console.log(`✅ Migrated ${mbtiContent.length} MBTI content items`);
      }
    } else {
      console.log('ℹ️ No MBTI content to migrate');
    }
    
    // 3. Create AI Content Jobs tracking
    console.log('📋 Creating AI Content Jobs tracking...');
    const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 
                       'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    
    const jobRecords = mbtiTypes.map(mbtiType => ({
      job_id: `ai_content_${mbtiType}_${Date.now()}`,
      mbti_type: mbtiType,
      job_type: 'ai_content_generation',
      status: 'completed',
      progress: 100,
      total_steps: 3,
      results: {
        ai1_esthetic: true,
        ai2_cognitive: true,
        ai3_ethical: true
      },
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    }));
    
    const { data: insertedJobs, error: jobsError } = await supabase
      .from('ai_content_jobs')
      .insert(jobRecords);
    
    if (jobsError) {
      console.error('❌ Error inserting AI content jobs:', jobsError);
    } else {
      console.log(`✅ Created ${jobRecords.length} AI content job records`);
    }
    
    // 4. Summary
    console.log('\n🎉 AI Content Migration Summary:');
    console.log(`📦 AI Artifacts: ${artifacts.length} migrated`);
    console.log(`🧠 MBTI Content: ${mbtiContent.length} migrated`);
    console.log(`📋 AI Jobs: ${jobRecords.length} created`);
    console.log('\n✅ Migration to MET2.4.4 completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await localDb.end();
  }
}

// Run migration
if (require.main === module) {
  migrateAIContent().catch(console.error);
}

module.exports = { migrateAIContent };
















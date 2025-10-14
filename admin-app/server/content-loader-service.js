/**
 * Content Loader Service - Docker Container
 * 
 * Standalone service voor Content Loading in Docker container
 * Integreert met MCP Bridge en Development App
 * 
 * @version 14.0.0
 * @author Thomas
 */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase configuratie
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuratie ontbreekt!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Content Loader configuratie
const config = {
  batchSize: parseInt(process.env.CONTENT_LOADER_BATCH_SIZE) || 50,
  retryAttempts: parseInt(process.env.CONTENT_LOADER_RETRY_ATTEMPTS) || 3,
  retryDelay: parseInt(process.env.CONTENT_LOADER_RETRY_DELAY) || 1000,
  encryption: process.env.CONTENT_LOADER_ENCRYPTION === 'true'
};

// Content tables
const contentTables = [
  'ai_artifacts',
  'mbti_content', 
  'content_items',
  'content_chunks',
  'content_pointers',
  'content_recommendations',
  'content_sources',
  'mbti_learning_paths',
  'content_analytics',
  'media_intelligence',
  'vector_embeddings',
  'ai_interactions',
  'ai_action_plans',
  'super_insights',
  'rewind_sessions'
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'content-loader',
    version: '14.0.0',
    timestamp: new Date().toISOString(),
    config: {
      batchSize: config.batchSize,
      retryAttempts: config.retryAttempts,
      encryption: config.encryption
    }
  });
});

// Test Supabase connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_artifacts')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Supabase verbinding succesvol',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Supabase verbinding mislukt',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get content statistics
app.get('/api/content-stats', async (req, res) => {
  try {
    const stats = {};
    
    for (const table of contentTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          stats[table] = { error: error.message };
        } else {
          stats[table] = { count: count || 0 };
        }
      } catch (error) {
        stats[table] = { error: error.message };
      }
    }

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get content statistics',
      error: error.message
    });
  }
});

// Load content from specific table
app.post('/api/load-table/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const { mbtiType, limit } = req.body;

  if (!contentTables.includes(tableName)) {
    return res.status(400).json({
      success: false,
      message: `Table ${tableName} not supported`
    });
  }

  try {
    console.log(`🔄 Loading content from ${tableName}...`);
    
    let query = supabase.from(tableName).select('*');
    
    if (mbtiType) {
      query = query.eq('mbti_type', mbtiType);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    console.log(`✅ Loaded ${data?.length || 0} records from ${tableName}`);

    res.json({
      success: true,
      tableName,
      recordsLoaded: data?.length || 0,
      records: data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Failed to load ${tableName}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to load ${tableName}`,
      error: error.message
    });
  }
});

// Load AI Artifacts
app.post('/api/load-ai-artifacts', async (req, res) => {
  const { mbtiType, agent, limit } = req.body;

  try {
    console.log('🤖 Loading AI Artifacts...');
    
    let query = supabase.from('ai_artifacts').select('*');
    
    if (mbtiType) {
      query = query.eq('mbti_type', mbtiType);
    }
    
    if (agent) {
      query = query.eq('agent', agent);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    console.log(`✅ Loaded ${data?.length || 0} AI artifacts`);

    res.json({
      success: true,
      tableName: 'ai_artifacts',
      recordsLoaded: data?.length || 0,
      records: data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to load AI artifacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load AI artifacts',
      error: error.message
    });
  }
});

// Load MBTI Content
app.post('/api/load-mbti-content', async (req, res) => {
  const { mbtiType, kind, limit } = req.body;

  try {
    console.log('🧠 Loading MBTI Content...');
    
    let query = supabase.from('mbti_content').select('*');
    
    if (mbtiType) {
      query = query.eq('mbti_type', mbtiType);
    }
    
    if (kind) {
      query = query.eq('kind', kind);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    query = query.order('order_idx', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    console.log(`✅ Loaded ${data?.length || 0} MBTI content items`);

    res.json({
      success: true,
      tableName: 'mbti_content',
      recordsLoaded: data?.length || 0,
      records: data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to load MBTI content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load MBTI content',
      error: error.message
    });
  }
});

// Load content by MBTI type
app.post('/api/load-content-by-mbti/:mbtiType', async (req, res) => {
  const { mbtiType } = req.params;
  const { limit } = req.body;

  try {
    console.log(`🎯 Loading content for MBTI type: ${mbtiType}`);
    
    const results = [];
    
    // Load AI Artifacts for this MBTI type
    const { data: aiArtifacts, error: aiError } = await supabase
      .from('ai_artifacts')
      .select('*')
      .eq('mbti_type', mbtiType)
      .order('created_at', { ascending: false })
      .limit(limit || 100);

    if (!aiError && aiArtifacts) {
      results.push({
        tableName: 'ai_artifacts',
        recordsLoaded: aiArtifacts.length,
        records: aiArtifacts
      });
    }
    
    // Load MBTI Content for this type
    const { data: mbtiContent, error: mbtiError } = await supabase
      .from('mbti_content')
      .select('*')
      .eq('mbti_type', mbtiType)
      .order('order_idx', { ascending: true })
      .limit(limit || 100);

    if (!mbtiError && mbtiContent) {
      results.push({
        tableName: 'mbti_content',
        recordsLoaded: mbtiContent.length,
        records: mbtiContent
      });
    }

    const totalLoaded = results.reduce((sum, r) => sum + r.recordsLoaded, 0);
    console.log(`✅ Loaded ${totalLoaded} records for ${mbtiType}`);

    res.json({
      success: true,
      mbtiType,
      totalLoaded,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Failed to load content for ${mbtiType}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to load content for ${mbtiType}`,
      error: error.message
    });
  }
});

// Get agent distribution
app.get('/api/agent-distribution', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_artifacts')
      .select('agent')
      .not('agent', 'is', null);

    if (error) {
      throw error;
    }

    const agentCounts = data.reduce((acc, item) => {
      acc[item.agent] = (acc[item.agent] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      agentDistribution: agentCounts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get agent distribution',
      error: error.message
    });
  }
});

// Get MBTI type distribution
app.get('/api/mbti-distribution', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_artifacts')
      .select('mbti_type')
      .not('mbti_type', 'is', null);

    if (error) {
      throw error;
    }

    const mbtiCounts = data.reduce((acc, item) => {
      acc[item.mbti_type] = (acc[item.mbti_type] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      mbtiDistribution: mbtiCounts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get MBTI distribution',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Content Loader Service started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Content stats: http://localhost:${PORT}/api/content-stats`);
  console.log(`🤖 AI artifacts: http://localhost:${PORT}/api/load-ai-artifacts`);
  console.log(`🧠 MBTI content: http://localhost:${PORT}/api/load-mbti-content`);
  console.log('');
  console.log('📋 Available endpoints:');
  console.log('  GET  /health - Health check');
  console.log('  GET  /api/test-connection - Test Supabase connection');
  console.log('  GET  /api/content-stats - Get content statistics');
  console.log('  POST /api/load-table/:tableName - Load specific table');
  console.log('  POST /api/load-ai-artifacts - Load AI artifacts');
  console.log('  POST /api/load-mbti-content - Load MBTI content');
  console.log('  POST /api/load-content-by-mbti/:mbtiType - Load content by MBTI type');
  console.log('  GET  /api/agent-distribution - Get agent distribution');
  console.log('  GET  /api/mbti-distribution - Get MBTI distribution');
  console.log('');
  console.log('🐳 Docker container ready for Content Loading!');
});

module.exports = app;















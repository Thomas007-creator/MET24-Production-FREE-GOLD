/**
 * Agent Executor API Route
 * 
 * Proxy route voor Supabase Edge Function agent-executor
 * Integreert met bestaande Express server architectuur
 * 
 * @version 1.0.0
 * @author Thomas
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials for agent executor');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Execute agent task
 * POST /api/agent-executor
 */
router.post('/', async (req, res) => {
  try {
    const { action, ...requestData } = req.body;
    
    console.log('🤖 Agent Executor API called:', { action, userId: requestData.userId });

    // Validate request
    if (!action) {
      return res.status(400).json({ 
        error: 'Missing action parameter',
        availableActions: ['execute', 'get_tools']
      });
    }

    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('agent-executor', {
      body: {
        action,
        ...requestData
      }
    });

    if (error) {
      console.error('❌ Agent executor function error:', error);
      return res.status(500).json({
        error: 'Agent executor function failed',
        details: error.message
      });
    }

    console.log('✅ Agent executor completed:', { 
      status: data?.status,
      executionId: data?.executionId 
    });

    res.json(data);

  } catch (error) {
    console.error('❌ Agent executor API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Get available tools
 * GET /api/agent-executor/tools
 */
router.get('/tools', async (req, res) => {
  try {
    console.log('🔧 Getting available agent tools');

    const { data, error } = await supabase.functions.invoke('agent-executor', {
      body: { action: 'get_tools' }
    });

    if (error) {
      console.error('❌ Failed to get tools:', error);
      return res.status(500).json({
        error: 'Failed to get tools',
        details: error.message
      });
    }

    res.json(data);

  } catch (error) {
    console.error('❌ Tools API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Health check for agent executor
 * GET /api/agent-executor/health
 */
router.get('/health', async (req, res) => {
  try {
    // Test connection to agent executor function
    const { data, error } = await supabase.functions.invoke('agent-executor', {
      body: { action: 'get_tools' }
    });

    if (error) {
      return res.status(503).json({
        status: 'unhealthy',
        error: error.message
      });
    }

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      availableTools: data?.availableTools?.length || 0
    });

  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
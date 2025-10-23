/**
 * Token Monitor Routes for MET24 PWA
 * Handles token usage monitoring and notifications
 * 
 * SECURITY FIX: Migrated from in-memory Map() to Supabase database
 */

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Supabase client for database operations
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables for token monitoring!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * POST /api/token-monitor/update
 * Update token usage for a provider
 */
router.post('/update', async (req, res) => {
  try {
    const { provider, model, tokensUsed, tokenLimit, userId } = req.body;

    if (!provider || !model || tokensUsed === undefined || !tokenLimit) {
      return res.status(400).json({
        error: 'provider, model, tokensUsed, and tokenLimit are required'
      });
    }

    const percentage = (tokensUsed / tokenLimit) * 100;

    // Insert or update token usage in Supabase
    const { data, error } = await supabase
      .from('token_usage')
      .upsert({
        provider,
        model,
        tokens_used: tokensUsed,
        token_limit: tokenLimit,
        percentage: percentage,
        user_id: userId || null,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'provider,user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error updating token usage:', error);
      return res.status(500).json({
        error: 'Failed to update token usage in database'
      });
    }

    const usage = {
      provider: data.provider,
      model: data.model,
      tokensUsed: data.tokens_used,
      tokenLimit: data.token_limit,
      percentage: data.percentage,
      userId: data.user_id,
      lastUpdated: data.last_updated
    };

    // Check thresholds and send notifications (handled by database trigger)
    console.log(`📊 Token usage updated for ${provider}: ${percentage.toFixed(1)}%`);

    res.json({
      success: true,
      usage,
      message: 'Token usage updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating token usage:', error);
    res.status(500).json({
      error: 'Failed to update token usage'
    });
  }
});

/**
 * GET /api/token-monitor/usage/:provider
 * Get token usage for a specific provider
 */
router.get('/usage/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const { userId } = req.query;

    // Query token usage from Supabase
    let query = supabase
      .from('token_usage')
      .select('*')
      .eq('provider', provider);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return res.status(404).json({
        error: 'Token usage not found for provider'
      });
    }

    const usage = {
      provider: data.provider,
      model: data.model,
      tokensUsed: data.tokens_used,
      tokenLimit: data.token_limit,
      percentage: data.percentage,
      userId: data.user_id,
      lastUpdated: data.last_updated
    };

    res.json({
      success: true,
      usage
    });

  } catch (error) {
    console.error('❌ Error getting token usage:', error);
    res.status(500).json({
      error: 'Failed to get token usage'
    });
  }
});

/**
 * GET /api/token-monitor/usage
 * Get all token usage
 */
router.get('/usage', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Query all token usage from Supabase
    let query = supabase
      .from('token_usage')
      .select('*')
      .order('last_updated', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: allUsage, error } = await query;

    if (error) {
      console.error('❌ Database error getting token usage:', error);
      return res.status(500).json({
        error: 'Failed to get token usage from database'
      });
    }

    // Transform data to match expected format
    const usageData = allUsage.map(usage => ({
      provider: usage.provider,
      model: usage.model,
      tokensUsed: usage.tokens_used,
      tokenLimit: usage.token_limit,
      percentage: usage.percentage,
      userId: usage.user_id,
      lastUpdated: usage.last_updated
    }));

    // Calculate summary
    const summary = {
      totalProviders: usageData.length,
      providersNearLimit: usageData.filter(u => u.percentage >= 80 && u.percentage < 95).length,
      providersAtLimit: usageData.filter(u => u.percentage >= 95).length,
      summary: usageData.map(usage => ({
        provider: usage.provider,
        percentage: usage.percentage,
        status: usage.percentage >= 95 ? 'critical' : 
                usage.percentage >= 80 ? 'warning' : 'ok'
      }))
    };

    res.json({
      success: true,
      usage: usageData,
      summary
    });

  } catch (error) {
    console.error('❌ Error getting all token usage:', error);
    res.status(500).json({
      error: 'Failed to get token usage'
    });
  }
});

/**
 * POST /api/token-monitor/simulate
 * Simulate token usage for testing
 */
router.post('/simulate', async (req, res) => {
  try {
    const { provider, percentage, userId } = req.body;

    if (!provider || percentage === undefined) {
      return res.status(400).json({
        error: 'provider and percentage are required'
      });
    }

    const tokenLimit = 100000; // Example limit
    const tokensUsed = (percentage / 100) * tokenLimit;

    // Update token usage
    const usageKey = `${provider}_${userId || 'default'}`;
    const usage = {
      provider,
      model: 'grok-3',
      tokensUsed,
      tokenLimit,
      percentage,
      userId: userId || 'default',
      lastUpdated: new Date()
    };

    tokenUsage.set(usageKey, usage);

    // Check thresholds and send notifications
    await checkTokenThresholds(usage, userId);

    console.log(`🧪 Simulated token usage for ${provider}: ${percentage}%`);

    res.json({
      success: true,
      usage,
      message: 'Token usage simulated successfully'
    });

  } catch (error) {
    console.error('❌ Error simulating token usage:', error);
    res.status(500).json({
      error: 'Failed to simulate token usage'
    });
  }
});

/**
 * Check token thresholds and send notifications
 * NOTE: This is now handled by database triggers, but kept for backward compatibility
 */
async function checkTokenThresholds(usage, userId) {
  // This function is now handled by the database trigger
  // The trigger automatically checks thresholds and creates notification_history records
  console.log(`📊 Token threshold check for ${usage.provider}: ${usage.percentage}%`);
}

/**
 * Send token limit notification
 */
async function sendTokenLimitNotification(provider, percentage, type, userId) {
  try {
    const isGrok3 = provider === 'grok-3';
    const isCritical = type === 'critical';
    
    let title = '';
    let body = '';
    let actions = [];

    if (isGrok3) {
      if (isCritical) {
        title = '🚨 Grok-3 Tokens Bijna Op!';
        body = `Je hebt ${percentage.toFixed(0)}% van je gratis Grok-3 tokens gebruikt. Voeg je eigen API key toe om door te gaan!`;
        actions = [
          { action: 'setup-api', title: 'API Key Toevoegen' },
          { action: 'learn-more', title: 'Meer Info' }
        ];
      } else {
        title = '⚠️ Grok-3 Tokens Waarschuwing';
        body = `Je hebt ${percentage.toFixed(0)}% van je gratis Grok-3 tokens gebruikt. Overweeg je eigen API key toe te voegen.`;
        actions = [
          { action: 'setup-api', title: 'API Key Toevoegen' },
          { action: 'dismiss', title: 'Later' }
        ];
      }
    } else {
      title = `⚠️ ${provider.toUpperCase()} Token Waarschuwing`;
      body = `Je hebt ${percentage.toFixed(0)}% van je ${provider} tokens gebruikt.`;
      actions = [
        { action: 'view-usage', title: 'Gebruik Bekijken' },
        { action: 'dismiss', title: 'Later' }
      ];
    }

    // Send push notification
    const pushResponse = await fetch(`${req.protocol}://${req.get('host')}/api/push/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId || null, // Send to specific user or all users
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: `token-limit-${provider}`,
        data: {
          type: 'token_limit',
          provider,
          percentage,
          severity: type,
          timestamp: Date.now()
        },
        actions,
        requireInteraction: isCritical,
        silent: false
      })
    });

    if (pushResponse.ok) {
      console.log(`✅ Token limit notification sent for ${provider} (${type})`);
    } else {
      console.error(`❌ Failed to send token limit notification for ${provider}`);
    }

  } catch (error) {
    console.error('❌ Error sending token limit notification:', error);
  }
}

/**
 * GET /api/token-monitor/status
 * Get monitoring status
 */
router.get('/status', async (req, res) => {
  try {
    // Get token usage summary from database
    const { data: allUsage, error: usageError } = await supabase
      .from('token_usage')
      .select('*');

    if (usageError) {
      console.error('❌ Database error getting token usage:', usageError);
      return res.status(500).json({
        error: 'Failed to get token usage from database'
      });
    }

    // Get notification count from database
    const { count: notificationCount, error: notificationError } = await supabase
      .from('notification_history')
      .select('*', { count: 'exact', head: true });

    if (notificationError) {
      console.error('❌ Database error getting notification count:', notificationError);
    }

    const summary = {
      totalProviders: allUsage.length,
      providersNearLimit: allUsage.filter(u => u.percentage >= 80 && u.percentage < 95).length,
      providersAtLimit: allUsage.filter(u => u.percentage >= 95).length,
      lastChecked: new Date()
    };

    res.json({
      success: true,
      monitoring: {
        isActive: true,
        lastChecked: new Date(),
        totalNotifications: notificationCount || 0,
        databaseConnected: true
      },
      summary
    });

  } catch (error) {
    console.error('❌ Error getting monitoring status:', error);
    res.status(500).json({
      error: 'Failed to get monitoring status'
    });
  }
});

module.exports = router;

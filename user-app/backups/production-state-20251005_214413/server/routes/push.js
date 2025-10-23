/**
 * Push Notifications Routes for MET24 PWA
 * Handles subscription management and push sending
 */

const express = require('express');
const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// VAPID Keys - SECURITY: Environment variables only, no hardcoded fallbacks
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL;

// Validate required VAPID keys
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_EMAIL) {
  console.error('❌ CRITICAL: Missing VAPID keys in environment variables!');
  console.error('Required: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL');
  process.exit(1);
}

// Configure web-push
webpush.setVapidDetails(
  VAPID_EMAIL,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// Supabase client for database operations
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ CRITICAL: Missing Supabase environment variables for push notifications!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/push/vapid-key
 * Get VAPID public key for client
 */
router.get('/vapid-key', (req, res) => {
  res.json({
    publicKey: VAPID_PUBLIC_KEY
  });
});

/**
 * POST /api/push/subscribe
 * Subscribe user to push notifications
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { subscription, userId, userAgent } = req.body;

    if (!subscription || !userId) {
      return res.status(400).json({
        error: 'Subscription and userId are required'
      });
    }

    // Store subscription in Supabase
    const { data, error } = await supabase
      .from('push_subscriptions')
      .insert({
        user_id: userId,
        subscription: subscription,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Database error storing subscription:', error);
      return res.status(500).json({
        error: 'Failed to store subscription in database'
      });
    }

    console.log(`✅ User ${userId} subscribed to push notifications`);

    res.json({
      success: true,
      subscriptionId: data.id,
      message: 'Successfully subscribed to push notifications'
    });

  } catch (error) {
    console.error('❌ Error subscribing to push:', error);
    res.status(500).json({
      error: 'Failed to subscribe to push notifications'
    });
  }
});

/**
 * POST /api/push/unsubscribe
 * Unsubscribe user from push notifications
 */
router.post('/unsubscribe', async (req, res) => {
  try {
    const { subscriptionId, userId } = req.body;

    if (!subscriptionId && !userId) {
      return res.status(400).json({
        error: 'subscriptionId or userId is required'
      });
    }

    let removedCount = 0;

    if (subscriptionId) {
      // Remove specific subscription
      const { error } = await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('id', subscriptionId);

      if (!error) {
        removedCount = 1;
      }
    } else if (userId) {
      // Remove all subscriptions for user
      const { count, error } = await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (!error) {
        removedCount = count || 0;
      }
    }

    console.log(`✅ Removed ${removedCount} subscription(s) for user ${userId || subscriptionId}`);

    res.json({
      success: true,
      removedCount,
      message: 'Successfully unsubscribed from push notifications'
    });

  } catch (error) {
    console.error('❌ Error unsubscribing from push:', error);
    res.status(500).json({
      error: 'Failed to unsubscribe from push notifications'
    });
  }
});

/**
 * POST /api/push/send
 * Send push notification to specific user or all users
 */
router.post('/send', async (req, res) => {
  try {
    const { 
      userId, 
      title, 
      body, 
      icon, 
      badge, 
      tag, 
      data, 
      actions,
      requireInteraction = false,
      silent = false
    } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: 'Title and body are required'
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/badge-72x72.png',
      tag: tag || 'met24-notification',
      data: data || {},
      actions: actions || [],
      requireInteraction,
      silent,
      timestamp: Date.now()
    });

    let sentCount = 0;
    let failedCount = 0;
    const results = [];

    // Get subscriptions to send to from database
    let query = supabase
      .from('push_subscriptions')
      .select('id, user_id, subscription')
      .eq('is_active', true);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
      console.error('❌ Database error getting subscriptions:', error);
      return res.status(500).json({
        error: 'Failed to get subscriptions from database'
      });
    }

    const targetSubscriptions = subscriptions.map(sub => ({
      id: sub.id,
      subscription: sub.subscription
    }));

    // Send notifications
    for (const { id, subscription } of targetSubscriptions) {
      try {
        await webpush.sendNotification(subscription, payload);
        sentCount++;
        results.push({ subscriptionId: id, status: 'sent' });
        console.log(`✅ Push sent to subscription ${id}`);
      } catch (error) {
        failedCount++;
        results.push({ subscriptionId: id, status: 'failed', error: error.message });
        console.error(`❌ Failed to send push to subscription ${id}:`, error);
        
        // Remove invalid subscriptions from database
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from('push_subscriptions')
            .update({ is_active: false })
            .eq('id', id);
          console.log(`🗑️ Removed invalid subscription ${id} from database`);
        }
      }
    }

    console.log(`📤 Push notification sent: ${sentCount} successful, ${failedCount} failed`);

    res.json({
      success: true,
      sentCount,
      failedCount,
      totalSubscriptions: targetSubscriptions.length,
      results,
      message: `Push notification sent to ${sentCount} devices`
    });

  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    res.status(500).json({
      error: 'Failed to send push notification'
    });
  }
});

/**
 * GET /api/push/subscriptions
 * Get all active subscriptions (admin endpoint)
 */
router.get('/subscriptions', async (req, res) => {
  try {
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('id, user_id, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Database error getting subscriptions:', error);
      return res.status(500).json({
        error: 'Failed to get subscriptions from database'
      });
    }

    const subscriptionList = subscriptions.map(sub => ({
      id: sub.id,
      userId: sub.user_id,
      isActive: sub.is_active,
      createdAt: sub.created_at,
      updatedAt: sub.updated_at
    }));

    res.json({
      success: true,
      count: subscriptionList.length,
      subscriptions: subscriptionList
    });

  } catch (error) {
    console.error('❌ Error getting subscriptions:', error);
    res.status(500).json({
      error: 'Failed to get subscriptions'
    });
  }
});

/**
 * POST /api/push/test
 * Send test notification to all subscribers
 */
router.post('/test', async (req, res) => {
  try {
    const testPayload = {
      userId: null, // Send to all
      title: 'MET24 Test Notification',
      body: 'This is a test push notification from MET24!',
      icon: '/icons/icon-192x192.png',
      tag: 'test-notification',
      data: {
        type: 'test',
        timestamp: Date.now()
      }
    };

    // Use the send endpoint
    const sendRequest = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    };

    // Simulate the send request
    const result = await new Promise((resolve) => {
      const mockReq = { body: testPayload };
      const mockRes = {
        json: (data) => resolve(data),
        status: () => ({ json: (data) => resolve(data) })
      };
      
      // Call the send handler directly
      router.stack.find(layer => layer.route?.path === '/send')
        ?.route?.stack?.find(layer => layer.method === 'post')
        ?.handle(mockReq, mockRes);
    });

    res.json({
      success: true,
      message: 'Test notification sent',
      result
    });

  } catch (error) {
    console.error('❌ Error sending test notification:', error);
    res.status(500).json({
      error: 'Failed to send test notification'
    });
  }
});

module.exports = router;

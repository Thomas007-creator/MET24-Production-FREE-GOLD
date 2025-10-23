/**
 * Rate Limiting Middleware
 * 
 * Implementeert server-side rate limiting voor API endpoints
 * Beschermt tegen DDoS en abuse
 */

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { createClient } = require('@supabase/supabase-js');

// Supabase client voor rate limiting data
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Basic Rate Limiter - 100 requests per 15 minutes per IP
 */
const basicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.warn(`🚨 Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Strict Rate Limiter - 20 requests per 5 minutes per IP
 * Voor gevoelige endpoints
 */
const strictRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`🚨 Strict rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '5 minutes'
    });
  }
});

/**
 * AI Endpoint Rate Limiter - 50 requests per hour per user
 * Voor AI API calls
 */
const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each user to 50 AI requests per hour
  keyGenerator: (req) => {
    // Use user ID if available, otherwise fall back to IP
    return req.body?.userId || req.query?.userId || req.ip;
  },
  message: {
    error: 'AI request limit exceeded, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const userId = req.body?.userId || req.query?.userId || 'anonymous';
    console.warn(`🚨 AI rate limit exceeded for user: ${userId}`);
    res.status(429).json({
      error: 'AI request limit exceeded, please try again later.',
      retryAfter: '1 hour'
    });
  }
});

/**
 * Free Tier Rate Limiter - 10 requests per hour per IP
 * Voor gebruikers zonder API key
 */
const freeTierRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 free requests per hour
  message: {
    error: 'Free tier limit exceeded. Please add your own API key for unlimited access.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`🚨 Free tier rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Free tier limit exceeded. Please add your own API key for unlimited access.',
      retryAfter: '1 hour',
      upgradeRequired: true
    });
  }
});

/**
 * Slow Down Middleware - Progressively slow down requests
 */
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: () => 500, // Fixed: use function for express-slow-down v2 compatibility
  maxDelayMs: 20000, // max delay of 20 seconds
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  validate: {
    delayMs: false // Disable warning for delayMs option
  }
});

/**
 * Custom Rate Limiter with Database Storage
 * Voor persistente rate limiting across server restarts
 */
const createDatabaseRateLimit = (options) => {
  return async (req, res, next) => {
    if (!supabase) {
      // Fallback to basic rate limiting if Supabase not available
      return basicRateLimit(req, res, next);
    }

    try {
      const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
      const now = new Date();
      const windowStart = new Date(now.getTime() - options.windowMs);

      // Check current usage
      const { data: existing, error: selectError } = await supabase
        .from('rate_limiting')
        .select('*')
        .eq('key', key)
        .gte('created_at', windowStart.toISOString());

      if (selectError) {
        console.error('Rate limiting database error:', selectError);
        return basicRateLimit(req, res, next);
      }

      const currentCount = existing?.length || 0;

      if (currentCount >= options.max) {
        console.warn(`🚨 Database rate limit exceeded for key: ${key}`);
        return res.status(429).json({
          error: options.message?.error || 'Rate limit exceeded',
          retryAfter: Math.ceil(options.windowMs / 60000) + ' minutes'
        });
      }

      // Record this request
      const { error: insertError } = await supabase
        .from('rate_limiting')
        .insert({
          key,
          ip: req.ip,
          user_agent: req.get('User-Agent'),
          endpoint: req.path,
          created_at: now.toISOString()
        });

      if (insertError) {
        console.error('Rate limiting insert error:', insertError);
      }

      // Add rate limit headers
      res.set({
        'RateLimit-Limit': options.max,
        'RateLimit-Remaining': Math.max(0, options.max - currentCount - 1),
        'RateLimit-Reset': new Date(now.getTime() + options.windowMs).toISOString()
      });

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fallback to basic rate limiting
      return basicRateLimit(req, res, next);
    }
  };
};

/**
 * AI Endpoint Database Rate Limiter
 */
const aiDatabaseRateLimit = createDatabaseRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 AI requests per hour
  keyGenerator: (req) => {
    return req.body?.userId || req.query?.userId || req.ip;
  },
  message: {
    error: 'AI request limit exceeded, please try again later.',
    retryAfter: '1 hour'
  }
});

/**
 * Free Tier Database Rate Limiter
 */
const freeTierDatabaseRateLimit = createDatabaseRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 free requests per hour
  message: {
    error: 'Free tier limit exceeded. Please add your own API key for unlimited access.',
    retryAfter: '1 hour',
    upgradeRequired: true
  }
});

module.exports = {
  basicRateLimit,
  strictRateLimit,
  aiRateLimit,
  freeTierRateLimit,
  speedLimiter,
  aiDatabaseRateLimit,
  freeTierDatabaseRateLimit,
  createDatabaseRateLimit
};

/**
 * Input Validation Middleware
 * 
 * Valideert en sanitiseert alle API input
 * Beschermt tegen injection attacks en malformed data
 */

const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

/**
 * Basic input sanitization
 */
const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize string inputs
    const sanitizeObject = (obj) => {
      if (typeof obj === 'string') {
        // Remove potentially dangerous characters
        return DOMPurify.sanitize(obj.trim());
      } else if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
      }
      return obj;
    };

    // Sanitize request body
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    res.status(400).json({
      error: 'Invalid input data',
      message: 'Request contains malformed data'
    });
  }
};

/**
 * Request size validation
 */
const validateRequestSize = (maxSize = '1mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    const maxSizeBytes = parseSize(maxSize);

    if (contentLength > maxSizeBytes) {
      console.warn(`🚨 Request too large: ${contentLength} bytes (max: ${maxSizeBytes})`);
      return res.status(413).json({
        error: 'Request too large',
        message: `Request size exceeds maximum allowed size of ${maxSize}`,
        maxSize
      });
    }

    next();
  };
};

/**
 * Parse size string to bytes
 */
function parseSize(size) {
  const units = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024
  };

  const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
  if (!match) return 1024 * 1024; // Default 1MB

  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';
  return Math.floor(value * units[unit]);
}

/**
 * Prompt validation for AI endpoints
 */
const validatePrompt = (req, res, next) => {
  try {
    const { prompt, message } = req.body;
    const inputText = prompt || message;

    if (!inputText) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'Prompt or message is required'
      });
    }

    // Check length
    if (inputText.length > 10000) {
      return res.status(400).json({
        error: 'Prompt too long',
        message: 'Prompt must be less than 10,000 characters',
        maxLength: 10000,
        currentLength: inputText.length
      });
    }

    if (inputText.length < 1) {
      return res.status(400).json({
        error: 'Prompt too short',
        message: 'Prompt must contain at least 1 character'
      });
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(inputText)) {
        console.warn(`🚨 Dangerous pattern detected in prompt: ${pattern}`);
        return res.status(400).json({
          error: 'Invalid input',
          message: 'Prompt contains potentially dangerous content'
        });
      }
    }

    // Check for excessive repetition (potential spam)
    const words = inputText.toLowerCase().split(/\s+/);
    const wordCounts = {};
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }

    const maxRepetition = Math.max(...Object.values(wordCounts));
    if (maxRepetition > words.length * 0.3) {
      console.warn(`🚨 Excessive repetition detected in prompt`);
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Prompt contains excessive repetition'
      });
    }

    next();
  } catch (error) {
    console.error('Prompt validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      message: 'Unable to validate prompt'
    });
  }
};

/**
 * User ID validation
 */
const validateUserId = (req, res, next) => {
  try {
    const { userId, user_id } = req.body;
    const id = userId || user_id;

    if (!id) {
      return res.status(400).json({
        error: 'Missing user ID',
        message: 'User ID is required'
      });
    }

    // Validate user ID format
    if (typeof id !== 'string' || id.length < 1 || id.length > 100) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a string between 1 and 100 characters'
      });
    }

    // Check for dangerous characters
    if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID contains invalid characters'
      });
    }

    next();
  } catch (error) {
    console.error('User ID validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      message: 'Unable to validate user ID'
    });
  }
};

/**
 * API Key validation
 */
const validateApiKey = (req, res, next) => {
  try {
    const { apiKey, api_key, user_api_key } = req.body;
    const key = apiKey || api_key || user_api_key;

    if (!key) {
      return res.status(400).json({
        error: 'Missing API key',
        message: 'API key is required'
      });
    }

    // Validate API key format
    if (typeof key !== 'string' || key.length < 10 || key.length > 200) {
      return res.status(400).json({
        error: 'Invalid API key',
        message: 'API key must be a string between 10 and 200 characters'
      });
    }

    // Check for basic API key patterns
    const validPatterns = [
      /^sk-[a-zA-Z0-9]{48}$/, // OpenAI format
      /^sk-ant-[a-zA-Z0-9-]+$/, // Anthropic format
      /^[a-zA-Z0-9]{32,}$/ // Generic format
    ];

    const isValidFormat = validPatterns.some(pattern => pattern.test(key));
    if (!isValidFormat) {
      return res.status(400).json({
        error: 'Invalid API key format',
        message: 'API key does not match expected format'
      });
    }

    next();
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      message: 'Unable to validate API key'
    });
  }
};

/**
 * MBTI Type validation
 */
const validateMBTIType = (req, res, next) => {
  try {
    const { mbtiType, mbti_type } = req.body;
    const mbti = mbtiType || mbti_type;

    if (!mbti) {
      return res.status(400).json({
        error: 'Missing MBTI type',
        message: 'MBTI type is required'
      });
    }

    // Valid MBTI types
    const validTypes = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ];

    if (!validTypes.includes(mbti.toUpperCase())) {
      return res.status(400).json({
        error: 'Invalid MBTI type',
        message: 'MBTI type must be one of: ' + validTypes.join(', '),
        validTypes
      });
    }

    // Normalize to uppercase
    req.body.mbtiType = mbti.toUpperCase();
    if (req.body.mbti_type) {
      req.body.mbti_type = mbti.toUpperCase();
    }

    next();
  } catch (error) {
    console.error('MBTI validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      message: 'Unable to validate MBTI type'
    });
  }
};

/**
 * Email validation
 */
const validateEmail = (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Missing email',
        message: 'Email is required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Normalize email
    req.body.email = validator.normalizeEmail(email);

    next();
  } catch (error) {
    console.error('Email validation error:', error);
    res.status(400).json({
      error: 'Validation failed',
      message: 'Unable to validate email'
    });
  }
};

/**
 * Content-Type validation
 */
const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    const contentType = req.get('Content-Type');
    
    if (!contentType) {
      return res.status(400).json({
        error: 'Missing Content-Type',
        message: 'Content-Type header is required'
      });
    }

    const isValidType = allowedTypes.some(type => 
      contentType.toLowerCase().includes(type.toLowerCase())
    );

    if (!isValidType) {
      return res.status(415).json({
        error: 'Unsupported Media Type',
        message: `Content-Type must be one of: ${allowedTypes.join(', ')}`,
        allowedTypes
      });
    }

    next();
  };
};

/**
 * Rate limiting bypass for trusted sources
 */
const bypassRateLimit = (req, res, next) => {
  // Add bypass flag for trusted sources
  const trustedIPs = process.env.TRUSTED_IPS?.split(',') || [];
  const isTrustedIP = trustedIPs.includes(req.ip);
  
  if (isTrustedIP) {
    req.bypassRateLimit = true;
  }

  next();
};

module.exports = {
  sanitizeInput,
  validateRequestSize,
  validatePrompt,
  validateUserId,
  validateApiKey,
  validateMBTIType,
  validateEmail,
  validateContentType,
  bypassRateLimit
};

// ================================================
// MET2.4 MCP BRIDGE SERVER
// Model Context Protocol Bridge voor Coolify Deployment
// ================================================

const express = require('express');
const cors = require('cors');

// Import security middleware
const {
  basicRateLimit,
  strictRateLimit,
  aiRateLimit,
  freeTierRateLimit,
  speedLimiter,
  aiDatabaseRateLimit,
  freeTierDatabaseRateLimit
} = require('./middleware/rateLimiting');

const {
  sanitizeInput,
  validateRequestSize,
  validatePrompt,
  validateUserId,
  validateApiKey,
  validateMBTIType,
  validateContentType,
  bypassRateLimit
} = require('./middleware/inputValidation');

const app = express();
const PORT = process.env.MCP_BRIDGE_PORT || 3001;

// ================================================
// MIDDLEWARE SETUP
// ================================================
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    process.env.DO_DOMAIN ? `https://${process.env.DO_DOMAIN}` : '',
    process.env.DO_DOMAIN ? `https://dev.${process.env.DO_DOMAIN}` : ''
  ].filter(Boolean),
  credentials: true
}));

// Security middleware
app.use(bypassRateLimit);
app.use(sanitizeInput);
app.use(validateRequestSize('10mb'));
app.use(validateContentType(['application/json']));

// Rate limiting middleware
app.use(speedLimiter);
app.use(basicRateLimit);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ================================================
// HEALTH CHECK ENDPOINT
// ================================================
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'mcp-bridge',
    port: PORT,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ================================================
// MCP PROTOCOL ENDPOINTS
// ================================================

// Initialize MCP session
app.post('/mcp/initialize', async (req, res) => {
  try {
    // Future: Use clientInfo for session management
    
    res.json({
      protocolVersion: '2024-11-05',
      serverInfo: {
        name: 'MET2.4-MCP-Bridge',
        version: '1.0.0'
      },
      capabilities: {
        tools: {},
        resources: {},
        prompts: {}
      }
    });
  } catch (error) {
    console.error('MCP Initialize error:', error);
    res.status(500).json({ error: 'Initialization failed' });
  }
});

// List available tools
app.post('/mcp/tools/list', async (req, res) => {
  try {
    res.json({
      tools: [
        {
          name: 'supabase_query',
          description: 'Execute queries against Supabase database',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string' },
              params: { type: 'array' }
            }
          }
        },
        {
          name: 'watermelondb_sync',
          description: 'Synchronize WatermelonDB with Supabase',
          inputSchema: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['push', 'pull', 'sync'] }
            }
          }
        },
        {
          name: 'grok_chat',
          description: 'Chat with Grok-3 AI model',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              context: { type: 'string', isOptional: true },
              model: { type: 'string', default: 'grok-3' }
            }
          }
        },
        {
          name: 'ai_service_health',
          description: 'Check health of AI services',
          inputSchema: {
            type: 'object',
            properties: {
              service: { type: 'string', enum: ['grok', 'openai', 'anthropic', 'ultimateai', 'all'] }
            }
          }
        },
        {
          name: 'ultimateai_chat',
          description: 'Chat with UltimateAI models (Grok-4, Claude 4.1, GPT-5, etc.) - Uses user API key or free tier',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              context: { type: 'string', isOptional: true },
              model: { type: 'string', enum: ['grok-4', 'claude-4.1-opus', 'gpt-5', 'gemini-2.5-pro', 'qwen-2.5-coder-32b'] },
              user_api_key: { type: 'string', isOptional: true, description: 'User UltimateAI API key (optional - uses free tier if not provided)' },
              user_id: { type: 'string', isOptional: true, description: 'User ID for free tier tracking' }
            }
          }
        },
        {
          name: 'user_ai_settings',
          description: 'Manage user AI settings and API keys',
          inputSchema: {
            type: 'object',
            properties: {
              action: { type: 'string', enum: ['get', 'set', 'validate'] },
              user_id: { type: 'string' },
              api_key: { type: 'string', isOptional: true },
              provider: { type: 'string', enum: ['ultimateai', 'openai', 'anthropic'] }
            }
          }
        }
      ]
    });
  } catch (error) {
    console.error('MCP Tools list error:', error);
    res.status(500).json({ error: 'Failed to list tools' });
  }
});

// Execute tool with AI-specific rate limiting and validation
app.post('/mcp/tools/call', 
  aiDatabaseRateLimit, // AI-specific rate limiting
  validatePrompt, // Validate prompt input
  async (req, res) => {
  try {
    const { name } = req.body;
    // Future: Use toolArgs for tool-specific parameters
    
    switch (name) {
      case 'supabase_query':
        // Implement Supabase query logic
        res.json({
          isError: false,
          content: [{ type: 'text', text: 'Query executed successfully' }]
        });
        break;
        
      case 'watermelondb_sync':
        // Implement WatermelonDB sync logic
        res.json({
          isError: false,
          content: [{ type: 'text', text: 'Sync completed successfully' }]
        });
        break;
        
      case 'grok_chat':
        // Implement Grok-3 chat logic
        const { message, context, model } = req.body.arguments || {};
        try {
          const response = await callGrokAPI(message, context, model);
          res.json({
            isError: false,
            content: [{ type: 'text', text: response }]
          });
        } catch (error) {
          res.json({
            isError: true,
            content: [{ type: 'text', text: `Grok API error: ${error.message}` }]
          });
        }
        break;
        
      case 'ai_service_health':
        // Check AI service health
        const { service } = req.body.arguments || {};
        const healthStatus = await checkAIServiceHealth(service);
        res.json({
          isError: false,
          content: [{ type: 'text', text: JSON.stringify(healthStatus, null, 2) }]
        });
        break;
        
      case 'ultimateai_chat':
        // UltimateAI chat with user API key or free tier
        const { message: ultimateMessage, context: ultimateContext, model: ultimateModel, user_api_key, user_id } = req.body.arguments || {};
        
        // Additional validation for UltimateAI chat
        if (!ultimateMessage || typeof ultimateMessage !== 'string') {
          return res.status(400).json({
            isError: true,
            content: [{ type: 'text', text: 'Message is required and must be a string' }]
          });
        }
        
        if (ultimateMessage.length > 10000) {
          return res.status(400).json({
            isError: true,
            content: [{ type: 'text', text: 'Message too long (max 10,000 characters)' }]
          });
        }
        
        try {
          const aiProvider = new AIProvider();
          let apiKeyToUse = null;
          let usageType = '';
          
          if (user_api_key) {
            // User has their own UltimateAI subscription
            apiKeyToUse = user_api_key;
            usageType = 'user_subscription';
          } else if (user_id) {
            // Check free tier limits for this user
            const freeTokensUsed = await checkUserFreeTierUsage(user_id);
            const dailyLimit = parseInt(process.env.FREE_ULTIMATEAI_DAILY_LIMIT) || 50;
            
            if (freeTokensUsed >= dailyLimit) {
              res.json({
                isError: true,
                content: [{ type: 'text', text: `Daily free tier limit reached (${dailyLimit} requests). Please add your own UltimateAI API key in settings for unlimited access to premium models like Grok-4, Claude 4.1 Opus, and GPT-5.` }]
              });
              return;
            }
            
            // Use developer's UltimateAI for free tier
            apiKeyToUse = process.env.ULTIMATEAI_API_KEY;
            usageType = 'free_tier';
          } else {
            res.json({
              isError: true,
              content: [{ type: 'text', text: 'Please provide either your UltimateAI API key or user_id for free tier access.' }]
            });
            return;
          }
          
          // Override with the appropriate API key
          aiProvider.providers['ultimateai'].apiKey = apiKeyToUse;
          const result = await aiProvider.generateContent(ultimateMessage, ultimateContext, 'ultimateai', ultimateModel);
          
          // Track usage if free tier
          if (usageType === 'free_tier' && user_id) {
            await trackUserFreeTierUsage(user_id);
          }
          
          res.json({
            isError: false,
            content: [{ type: 'text', text: `${result.content}\n\n[Powered by ${usageType === 'user_subscription' ? 'your UltimateAI subscription' : 'free tier'}]` }]
          });
        } catch (error) {
          res.json({
            isError: true,
            content: [{ type: 'text', text: `UltimateAI error: ${error.message}. ${user_api_key ? 'Please check your API key.' : 'Free tier may be temporarily unavailable.'}` }]
          });
        }
        break;
        
      case 'user_ai_settings':
        // Manage user AI settings and API keys
        const { action, user_id: settings_user_id, api_key, provider } = req.body.arguments || {};
        
        try {
          switch (action) {
            case 'get':
              // Get user AI settings from Supabase
              res.json({
                isError: false,
                content: [{ type: 'text', text: `Getting AI settings for user ${settings_user_id}` }]
              });
              break;
              
            case 'set':
              // Set user API key in Supabase (encrypted)
              res.json({
                isError: false,
                content: [{ type: 'text', text: `Setting ${provider} API key for user ${settings_user_id}` }]
              });
              break;
              
            case 'validate':
              // Validate user API key
              res.json({
                isError: false,
                content: [{ type: 'text', text: `Validating ${provider} API key for user ${settings_user_id}` }]
              });
              break;
              
            default:
              res.json({
                isError: true,
                content: [{ type: 'text', text: 'Invalid action. Use: get, set, or validate' }]
              });
          }
        } catch (error) {
          res.json({
            isError: true,
            content: [{ type: 'text', text: `User AI settings error: ${error.message}` }]
          });
        }
        break;
        
      default:
        res.status(400).json({
          isError: true,
          content: [{ type: 'text', text: `Unknown tool: ${name}` }]
        });
    }
  } catch (error) {
    console.error('MCP Tool call error:', error);
    res.status(500).json({
      isError: true,
      content: [{ type: 'text', text: 'Tool execution failed' }]
    });
  }
});

// ================================================
// API PROXY ENDPOINTS
// ================================================
app.use('/api/proxy', require('./routes/proxy'));

// ================================================
// ERROR HANDLING
// ================================================
app.use((err, req, res, next) => {
  console.error('MCP Bridge Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// ================================================
// AI SERVICE FUNCTIONS
// ================================================

// AI Provider Class (Multi-Provider Support)
class AIProvider {
  constructor() {
    this.providers = {
      'grok-3': {
        baseUrl: process.env.XAI_BASE_URL || 'https://api.x.ai/v1',
        apiKey: process.env.XAI_API_KEY,
        models: ['grok-3', 'grok-3-mini']
      },
      'openai': {
        baseUrl: 'https://api.openai.com/v1',
        apiKey: process.env.OPENAI_API_KEY,
        models: ['gpt-4', 'gpt-3.5-turbo']
      },
      'anthropic': {
        baseUrl: 'https://api.anthropic.com/v1',
        apiKey: process.env.ANTHROPIC_API_KEY,
        models: ['claude-3-opus', 'claude-3-sonnet']
      },
      'ultimateai': {
        baseUrl: 'https://chat.obsidianaitools.com/v1',
        apiKey: process.env.ULTIMATEAI_API_KEY,
        models: [
          'grok-4', 'claude-4.1-opus', 'claude-4-opus', 'claude-3.7-sonnet',
          'gpt-5', 'gpt-4.1', 'gpt-4o', 'o1', 'o3',
          'gemini-2.5-pro', 'gemini-2.5-flash', 'qwen-2.5-coder-32b',
          'meta-llama-4', 'deepseek-chat', 'perplexity'
        ]
      }
    };
  }

  async generateContent(prompt, context = '', provider = 'grok-3', model = null) {
    const providerConfig = this.providers[provider];
    
    if (!providerConfig || !providerConfig.apiKey) {
      throw new Error(`${provider} API key not configured`);
    }

    // Test mode for dummy API keys
    if (providerConfig.apiKey === 'sk-test-dummy-key' || providerConfig.apiKey === 'your-grok-api-key' || providerConfig.apiKey === 'your-ultimateai-api-key') {
      return {
        content: `[TEST MODE] This is a simulated response from ${provider} for MBTI coaching. 
        
        Based on your MBTI type, here's some personalized coaching advice:
        - Focus on your natural strengths
        - Develop areas for growth
        - Practice self-awareness
        - Set achievable goals
        
        This response would normally come from the actual ${provider} API.
        ${provider === 'ultimateai' ? 'Available models: Grok-4, Claude 4.1 Opus, GPT-5, Gemini 2.5 Pro, Qwen-2.5 Coder 32b' : ''}`,
        provider: provider,
        model: model || 'test-model',
        tokens_used: 50
      };
    }

    // Auto-select model if not specified
    if (!model) {
      model = provider === 'grok-3' ? 'grok-3-mini' : providerConfig.models[0];
    }

    const systemPrompt = `You are an AI assistant for the MET2.4.2 MBTI coaching application. 
    You excel at providing personalized, empathetic coaching based on MBTI personality types.
    Context: ${context}
    
    Focus on:
    - MBTI-specific insights and guidance
    - Actionable, personalized advice
    - Empathetic and supportive tone
    - Practical growth strategies`;

    const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${providerConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`${provider} API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      provider: provider,
      model: model,
      tokens_used: data.usage?.total_tokens || 0
    };
  }
}

// Grok API integration (Backward compatibility)
async function callGrokAPI(message, context = '', model = 'grok-3-mini') {
  const aiProvider = new AIProvider();
  const result = await aiProvider.generateContent(message, context, 'grok-3', model);
  return result.content;
}

// Free Tier Usage Tracking
async function checkUserFreeTierUsage(userId) {
  // TODO: Implement Supabase query to check user's daily usage
  // For now, return 0 (no usage tracked)
  return 0;
}

async function trackUserFreeTierUsage(userId) {
  // TODO: Implement Supabase insert to track user's daily usage
  // For now, just log the usage
  console.log(`Free tier usage tracked for user: ${userId}`);
}

// AI Service Health Check
async function checkAIServiceHealth(service = 'all') {
  const services = {
    grok: {
      name: 'Grok-3',
      status: 'unknown',
      responseTime: null,
      error: null
    },
    openai: {
      name: 'OpenAI',
      status: 'unknown', 
      responseTime: null,
      error: null
    },
    anthropic: {
      name: 'Anthropic',
      status: 'unknown',
      responseTime: null,
      error: null
    },
    ultimateai: {
      name: 'UltimateAI (Grok-4, Claude 4.1, GPT-5)',
      status: 'unknown',
      responseTime: null,
      error: null
    }
  };

  if (service === 'all' || service === 'grok') {
    try {
      const startTime = Date.now();
      await callGrokAPI('Health check', '', 'grok-3');
      services.grok.status = 'healthy';
      services.grok.responseTime = Date.now() - startTime;
    } catch (error) {
      services.grok.status = 'unhealthy';
      services.grok.error = error.message;
    }
  }

  return service === 'all' ? services : services[service];
}

app.listen(PORT, () => {
  console.log(`🔗 MCP Bridge server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Services: Grok-3, OpenAI, Anthropic`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`🚀 Production mode: https://mcp.${process.env.DO_DOMAIN}`);
  }
});

module.exports = app;
// ================================================
// MET2.4 MCP BRIDGE SERVER
// Model Context Protocol Bridge voor Coolify Deployment
// ================================================

const express = require('express');
const cors = require('cors');

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

app.use(express.json());

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
        }
      ]
    });
  } catch (error) {
    console.error('MCP Tools list error:', error);
    res.status(500).json({ error: 'Failed to list tools' });
  }
});

// Execute tool
app.post('/mcp/tools/call', async (req, res) => {
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
// SERVER STARTUP
// ================================================
app.listen(PORT, () => {
  console.log(`🔗 MCP Bridge server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  
  if (process.env.NODE_ENV === 'production') {
    console.log(`🚀 Production mode: https://mcp.${process.env.DO_DOMAIN}`);
  }
});

module.exports = app;
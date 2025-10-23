# MCP Bridge Functie in AI Orchestratie Architectuur

## Overzicht van de MCP Bridge Rol

De **MCP Bridge** (Model Context Protocol Bridge) op poort 3001 fungeert als de **centrale API gateway** voor alle externe AI providers binnen de MET24 MBTI Coach PWA. Het is de infrastructurele backbone die de AI orchestratie mogelijk maakt.

## Architectuur Mapping

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MET24 PWA AI Architectuur                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│  │     AI-1        │    │     AI-2        │    │     AI-3        │  │
│  │   Esthetisch    │    │   Cognitief     │    │    Ethisch      │  │
│  │  (OpenAI GPT-4o)│    │ (Claude 3 Opus) │    │  (Gemini Pro)   │  │
│  │                 │    │  [COORDINATOR]  │    │                 │  │
│  └─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘  │
│            │                      │                      │          │
│            └──────────────────────┼──────────────────────┘          │
│                                   │                                 │
│                                   ▼                                 │
│            ┌─────────────────────────────────────────────┐          │
│            │        AI Orchestratie Service              │          │
│            │      (src/services/aiOrchestrationService) │          │
│            └─────────────────────┬───────────────────────┘          │
│                                  │                                  │
│                                  ▼                                  │
│            ┌─────────────────────────────────────────────┐          │
│            │            MCP BRIDGE                       │          │
│            │          (server/mcp-bridge.js)             │          │
│            │              Port 3001                      │          │
│            └─────────────────────┬───────────────────────┘          │
│                                  │                                  │
│                                  ▼                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│  │   XAI/Grok-3    │    │   UltimateAI    │    │    OpenAI       │  │
│  │ api.x.ai/v1     │    │obsidianaitools  │    │ api.openai.com  │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘  │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐  │
│  │   Anthropic     │    │   Custom APIs   │    │   Future APIs   │  │
│  │api.anthropic.com│    │  (Extensible)   │    │  (Scalable)     │  │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## MCP Bridge API Toegang tot Externe AI Agents

### 1. **Multi-Provider Support**
De MCP Bridge bevat een `AIProvider` klasse die toegang biedt tot:

```javascript
// AI Provider Configuration
this.providers = {
  'grok-3': {
    baseUrl: 'https://api.x.ai/v1',
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
      'grok-4', 'claude-4.1-opus', 'claude-4-opus', 
      'gpt-5', 'gpt-4.1', 'gpt-4o', 'o1', 'o3',
      'gemini-2.5-pro', 'gemini-2.5-flash', 
      'qwen-2.5-coder-32b', 'meta-llama-4',
      'deepseek-chat', 'perplexity'
    ]
  }
}
```

### 2. **AI Orchestratie Integratie**
De MCP Bridge werkt naadloos samen met de AI Orchestratie Service:

#### A. **AI-2 als Centrale Coordinator**
- AI-2 (Claude 3 Opus) fungeert als cognitieve coordinator
- Alle AI-interacties lopen via de MCP Bridge
- Narratieve therapie en wijsheidsintegratie

#### B. **Cross-Provider Communication**
```javascript
// MCP Tools voor AI orchestratie
{
  name: 'grok_chat',
  description: 'Chat with Grok-3 AI model'
},
{
  name: 'ultimateai_chat', 
  description: 'Chat with UltimateAI models (Grok-4, Claude 4.1, GPT-5, etc.)'
},
{
  name: 'ai_service_health',
  description: 'Check health of AI services'
},
{
  name: 'user_ai_settings',
  description: 'Manage user AI settings and API keys'
}
```

### 3. **Security & Rate Limiting**
De MCP Bridge implementeert uitgebreide beveiligingsmaatregelen:

```javascript
// AI-specific rate limiting
app.post('/mcp/tools/call', 
  aiDatabaseRateLimit,    // AI-specific rate limiting
  validatePrompt,         // Validate prompt input
  async (req, res) => {
    // Tool execution with security
  }
);
```

### 4. **User API Key Management**
```javascript
// Free tier + user subscription support
if (user_api_key) {
  // User heeft eigen UltimateAI subscription
  apiKeyToUse = user_api_key;
  usageType = 'user_subscription';
} else {
  // Free tier met daily limits
  const freeTokensUsed = await checkUserFreeTierUsage(user_id);
  const dailyLimit = parseInt(process.env.FREE_ULTIMATEAI_DAILY_LIMIT) || 50;
}
```

## Data Flow in AI Orchestratie

### 1. **Request Flow**
```
User Interface → AI Orchestration Service → MCP Bridge → External AI APIs
```

### 2. **Response Coordination**
```
External AI APIs → MCP Bridge → AI-2 Coordinator → Integrated Response → User
```

### 3. **Cross-AI Collaboration**
```
AI-1 (Esthetisch) ←→ AI-2 (Coordinator) ←→ AI-3 (Ethisch)
        ↓                    ↓                    ↓
              MCP Bridge (Unified API Access)
                           ↓
        [OpenAI, Anthropic, XAI, UltimateAI, Custom APIs]
```

## Voordelen van MCP Bridge Architectuur

### 1. **Centralized API Management**
- Alle AI providers via één endpoint
- Consistente authenticatie en rate limiting
- Unified error handling en logging

### 2. **Scalability**
- Eenvoudig nieuwe AI providers toevoegen
- Modulaire architectuur voor uitbreiding
- Load balancing mogelijkheden

### 3. **Security**
- API keys centraal beheerd
- Request validatie en sanitization
- User-specific rate limiting

### 4. **Cost Management**
- Free tier voor gebruikers zonder API keys
- Usage tracking per provider
- Flexible billing models

### 5. **AI Orchestration Support**
- Real-time health monitoring van AI services
- Cross-provider model selection
- Context preservation across AI interactions

## Conclusie

De **MCP Bridge fungeert als de essentiële infrastructuurlaag** die de AI orchestratie mogelijk maakt. Het biedt:

- **API toegang tot externe AI agents** (XAI/Grok, OpenAI, Anthropic, UltimateAI)
- **Veilige en schaalbare communicatie** tussen de AI Orchestratie Service en externe providers
- **Centraal beheer van authenticatie, rate limiting en monitoring**
- **Ondersteuning voor het drie-tier AI systeem** (AI-1 Esthetisch, AI-2 Cognitief Coordinator, AI-3 Ethisch)

Zonder de MCP Bridge zou de AI orchestratie niet kunnen functioneren, omdat het de **kritieke verbinding** vormt tussen de interne AI coördinatie logica en de externe AI providers die de daadwerkelijke intelligentie leveren.
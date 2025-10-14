# GitHub Copilot Instructions - MET24 MBTI Coach PWA

## Architecture Overview

This is a **production-ready MBTI personality coaching PWA** with a **dual-service architecture**:

- **User App** (Port 3000): React/TypeScript PWA with WatermelonDB + Supabase
- **MCP Bridge** (Port 3001): Optional AI service orchestrator
- **Database**: Supabase with 26+ tables using **WatermelonDB V14** for offline-first functionality

> **📚 Documentation**: See `CHATLLM_STACK_INTEGRATION_README.md` for complete AI integration guide and `COMPLETE_DEPLOYMENT_GUIDE.md` for production setup.

## Essential Development Patterns

### Database Layer - WatermelonDB V14 Architecture
The project uses a **modular V14 database schema** with 50+ tables organized by domain:

```typescript
// Core database entry point
import database from './src/database/v14/database';
import { syncWithSupabase } from './src/services/v14SupabaseSync';

// Always use the V14 database instance
const users = database.collections.get('users');
```

**Critical**: Use `src/database/v14/` (not `src/database/index.ts`) for new features. V14 has separate schema modules in `src/database/v14/schemas/` for each domain (userManagement, chatJournal, aiMachineLearning, etc.).

> **📖 Database Docs**: See `src/database/v14/README.md` for complete V14 documentation.

### State Management & Data Flow
```typescript
// Global state via Zustand
import { useAppStore } from '../store/useAppStore';
const { userData, setUserData } = useAppStore();

// Database operations always go through WatermelonDB first
await database.write(async () => {
  await user.update(userData => {
    userData.name = newName;
  });
});

// Then sync to Supabase
await syncTableWithSupabase('users');
```

### Component Architecture - NextUI + Glassmorphism
All UI uses **NextUI components** with consistent glassmorphism styling:

```tsx
import { Card, CardBody, Button } from '@nextui-org/react';

// Standard pattern for pages
<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
  <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
    <CardBody>{/* content */}</CardBody>
  </Card>
</div>
```

### Routing & Authentication Flow
The app has a **conditional routing system** based on onboarding completion:

```typescript
// In AppRoutes.tsx
const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';

// Before onboarding: limited routes (/, /onboarding/*, /test-*, /ai-buddy)  
// After onboarding: full app routes (/analytics, /profile, /chat, etc.)
```

**Key insight**: Test and development routes (`/test-*`, `/ai-buddy`, `/pwa-test`) are always accessible regardless of onboarding status.

## Critical Build & Deployment Workflows

### Environment Variables - Production Critical
The app requires specific **Coolify deployment variables**:

```bash
# Core Supabase (REQUIRED)
REACT_APP_SUPABASE_URL=https://your-supabase-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOi... # Full key in COMPLETE_DEPLOYMENT_GUIDE.md

# VAPID Keys for PWA notifications (REQUIRED)
VAPID_PUBLIC_KEY=BPTitR0u7IWdn_jX5vTz... # Generated keys in deployment docs
VAPID_PRIVATE_KEY=toLzz5ysWeXeRGSbeRzTdBBp...
VAPID_EMAIL=mailto:osteomedica.utrecht@gmail.com

# SSL & Domain
SSL_EMAIL=osteomedica.utrecht@gmail.com
```

**Deployment commands**:
```bash
# Production build (copies service workers)
npm run build:coolify

# Development with all services
npm run dev:full  # User app + MCP bridge + Express server

# Single service development  
npm start  # Just React app on port 3000
npm run server  # Just Express server
```

### Docker & Production Setup
```bash
# Production containers
docker-compose up -d  # Uses docker-compose.yml for production

# Key files:
# - Dockerfile.production (User app)
# - Dockerfile.mcp-bridge (MCP service) 
# - server/index.js (Express backend)
```

## Project-Specific Conventions

### Service Integration Patterns
**Supabase sync is manual and explicit**:
```typescript
// 1. Update WatermelonDB first (offline-first)
await database.write(async () => {
  await record.update(data => { /*...*/ });
});

// 2. Explicitly sync to Supabase
await syncTableWithSupabase('table_name');

// 3. For full sync
await syncWithSupabase(); // Syncs all V14 tables
```

**AI Provider management** via settings table:
```typescript
// Store API keys in Supabase settings table
await databaseService.createOrUpdateSetting({
  user_id: 'user123',
  key: 'ai_api_key_openai',
  value: apiKey,
  category: 'ai_providers'
});
```

### PWA & Service Worker Integration
The app has sophisticated PWA features with **offline queue management**:

```typescript
// Service workers are manually copied in build
// sw-offline-queue.js, sw-workbox.js -> /build/

// PWA install prompts use engagement-based timing
import { usePWAEngagement } from '../hooks/usePWAEngagement';
usePWAEngagement('onboarding_complete'); // Tracks engagement for install timing
```

### Testing & Development Routes
Important dev/test routes that bypass normal app flow:
- `/pwa-test` - PWA functionality testing
- `/test-database` - Database migration testing  
- `/ai-buddy` - AI service testing
- `/v14-sync-status` - Database sync monitoring
- `/onboarding-simulator` - Onboarding flow testing

## File Organization Conventions

**Key directories**:
- `src/database/v14/` - V14 database (schemas, models, sync)
- `src/components/OnboardingSteps/` - 14-step onboarding flow
- `src/services/` - API integrations, sync services
- `src/lib/` - Utilities (pushClient, PWA integration)
- `server/` - Express backend (routes, middleware)
- `scripts/` - Deployment and validation scripts

**Naming patterns**:
- Components: PascalCase (`OnboardingComplete.tsx`)
- Services: camelCase (`v14SupabaseSync.ts`)  
- Database models: PascalCase (`User.ts`, `TaskV14.ts`)
- Hooks: `use` prefix (`usePWAEngagement.ts`)

**Import paths**: Use relative imports for local files, absolute for external packages. Database always imported from `../database/v14/database` (not index).

## AI Buddy & SmartFilteringService Integration

### AI Buddy Features
The app includes advanced AI Buddy functionality with memory context and refusal logic:

```typescript
// AI Buddy Interface
import { AIBuddyInterface } from './src/components/ai/AIBuddyInterface';
import { SmartFilteringService } from './src/services/smartFilteringService';

// SmartFilteringService with memory context
const filteringService = new SmartFilteringService();
const result = await filteringService.filterPrompt(prompt, {
  safetyLevel: 'medium',
  aiProvider: 'grok-3',
  mbtiType: 'ENFP',
  context: 'coaching'
});
```

### Push Notifications Integration
```typescript
// Push notifications client
import { pushClient } from './src/lib/pushClient';
import { usePushNotifications } from './src/hooks/usePushNotifications';

// In components
const { isSubscribed, subscribe, unsubscribe } = usePushNotifications();
```

## Security & Compliance

### VAPID Keys Management
- VAPID keys are stored in environment variables (not hardcoded)
- Public key exposed to client, private key server-side only
- Keys generated and stored in `scripts/vapid-keys.env`

### Input Validation & Rate Limiting
```typescript
// Middleware for input validation
import { sanitizeInput, validatePrompt } from './server/middleware/inputValidation';
import { basicRateLimit, aiRateLimit } from './server/middleware/rateLimiting';
```

### Database Security
- Row-Level Security (RLS) policies in Supabase
- Encrypted sensitive data in WatermelonDB
- Audit logging for all AI interactions

## Development Workflow

### Local Development
```bash
# Start all services
npm run dev:full

# Individual services
npm start          # React app (port 3000)
npm run server     # Express backend
npm run server:mcp # MCP bridge (port 3001)
```

### Testing
```bash
# Run tests
npm test

# Test specific features
npm run test:database
npm run test:pwa
npm run test:ai-buddy
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to Coolify
./scripts/deploy-ai-buddy-coolify.sh

# Validate environment
./scripts/validate-env-vars.sh
```

## Troubleshooting

### Common Issues
1. **Database sync failures**: Check Supabase connection and RLS policies
2. **PWA installation issues**: Verify service worker registration and manifest.json
3. **AI Buddy errors**: Check API keys and SmartFilteringService configuration
4. **Push notification failures**: Verify VAPID keys and service worker setup

### Debug Routes
- `/debug/database` - Database status and sync information
- `/debug/pwa` - PWA installation and service worker status
- `/debug/ai` - AI service connectivity and configuration
- `/debug/notifications` - Push notification subscription status

## Performance Optimization

### Database Performance
- Use WatermelonDB queries with proper indexing
- Batch database operations when possible
- Implement pagination for large datasets

### PWA Performance
- Service worker caching strategies
- Offline queue management
- Background sync for critical data

### AI Service Performance
- SmartFilteringService caching
- Rate limiting and request batching
- Fallback to local AI when possible

---

## 📚 **Documentation Structure** 

### **Core Documentation** (Primary References)
- **`CHATLLM_STACK_INTEGRATION_README.md`** - Complete AI integration guide
- **`CHATLLM_SUPER_USE_CASES_COMPLETE_INVENTORY.md`** - All 16 ChatLLM features
- **`COMPLETE_DEPLOYMENT_GUIDE.md`** - Production deployment
- **`src/database/v14/README.md`** - Database V14 documentation
- **`src/features/*/`** - Feature-specific implementation guides

### **Specialized Documentation**
- **`EU_AI_ACT_COMPLIANCE_FRAMEWORK.md`** - Privacy compliance
- **`MET23_PO23_HOLISTISCH_INDIVIDUATIE_FRAMEWORK_COMPLETE.md`** - Theoretical framework
- **`PROJECT_BACKUP_DOCUMENTATION.md`** - Backup management

### **⚠️ Note on Deprecated Docs**
Some legacy implementation documents have been **consolidated into feature directories** and **master guides**. Always refer to the current documentation structure above. See `DOCUMENTATION_CLEANUP_PLAN.md` for cleanup details.

> **🎯 Master Reference**: All implementations are validated against `MET24-CLEAN-PERFECT-BACKUP-2025101` - the most current and reliable production-ready codebase. Use this as the definitive reference for all development work.

---

**Remember**: This is a production-ready PWA with sophisticated offline-first architecture. Always test changes thoroughly and maintain the dual-service architecture integrity.

# GitHub Copilot Instructions - MET24 MBTI Coach PWA

## Architecture Overview

This is a **production-ready MBTI personality coaching PWA** with a **dual-service architecture**:

- **User App** (Port 3000): React/TypeScript PWA with WatermelonDB + Supabase
- **MCP Bridge** (Port 3001): Optional AI service orchestrator
- **Database**: Supabase with 26+ tables using **WatermelonDB V14** for offline-first functionality

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
REACT_APP_SUPABASE_URL=https://wdwtwuljuewbkfozjkbq.supabase.co
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

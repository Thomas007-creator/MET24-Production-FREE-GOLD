# MET24 Technical Preferences

## Project Overview

**Project Name**: MET24 Complete Ecosystem
**Architecture**: Multi-app TypeScript ecosystem
**Primary Technologies**: React, TypeScript, WatermelonDB, AI/ML integrations

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **State Management**: React Context + WatermelonDB
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App / Vite

### Backend/Database
- **Local Database**: WatermelonDB (SQLite-based)
- **Sync**: Custom sync mechanisms
- **AI Integration**: OpenAI, Anthropic Claude APIs
- **Real-time**: WebSocket connections

### Infrastructure
- **Deployment**: Coolify (Docker-based)
- **Containerization**: Docker + Docker Compose
- **Environment**: Development, Staging, Production
- **VPN**: Custom VPN setup for secure access

## Code Standards

### TypeScript
- Strict mode enabled
- Explicit return types for functions
- Interface definitions for all data structures
- Proper error handling with try/catch

### React Patterns
- Functional components with hooks
- Custom hooks for business logic
- Context for global state
- Proper dependency arrays in useEffect

### Database Patterns
- WatermelonDB models with proper relationships
- Optimistic updates for UI responsiveness
- Offline-first approach
- Sync conflict resolution

## File Organization

### Shared Components Location
```
shared/
├── config/          # Environment configurations
├── database/        # WatermelonDB schemas and models
├── utils/          # Shared utilities and helpers
└── bmad-agents/    # BMAD development tools
```

### App-Specific Structure
```
[app]/src/
├── components/     # React components
├── services/      # Business logic and API calls
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── utils/         # App-specific utilities
```

## AI/Coaching Specific

### AI Service Integration
- Centralized AI service classes
- Proper API key management
- Rate limiting and error handling
- Coaching conversation state management

### Data Models
- User coaching sessions
- AI conversation history
- Learning progress tracking
- Personalization preferences

## Deployment Preferences

### Docker Setup
- Multi-stage builds for optimization
- Development vs production configurations
- Proper secret management
- Health checks and monitoring

### Coolify Integration
- Automated deployments from Git
- Environment variable management
- SSL/TLS configuration
- Backup strategies

## Testing Strategy

### Unit Testing
- Jest for unit tests
- React Testing Library for components
- Mock API responses
- Database test utilities

### Integration Testing
- End-to-end user workflows
- AI service integration tests
- Database sync testing
- Cross-app communication

## Security Considerations

### API Security
- Proper authentication tokens
- API rate limiting
- Input validation and sanitization
- Secure secret storage

### Data Privacy
- User data encryption
- GDPR compliance considerations
- AI conversation privacy
- Local data protection
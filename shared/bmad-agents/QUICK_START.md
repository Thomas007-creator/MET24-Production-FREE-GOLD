# MET24 BMAD Quick Start Guide

## 🚀 Snel aan de slag met BMAD voor MET24

### Voor Nieuwe Features

#### 1. Documenteer Huidige Systeem
```bash
# In Claude/ChatGPT/Gemini
@met24-analyst
*document-project user-app
# of
*document-project admin-app
```

#### 2. Plan de Feature
```bash
@met24-pm
*create-brownfield-prd
# Volg de interactive prompts voor feature definitie
```

#### 3. Technische Architectuur
```bash
@architect
*create-brownfield-architecture
# Gebaseerd op de PRD van stap 2
```

#### 4. Development Stories
```bash
@sm
*create-story
# Creëert gedetailleerde user stories voor implementatie
```

#### 5. Implementatie
```bash
@met24-dev
*implement-story [story-naam]
# Implementeert de story met TypeScript/React best practices
```

### Voor AI Coaching Features

#### Speciale Workflow
```bash
# 1. AI Architecture Analysis
@met24-analyst
*assess-ai-architecture

# 2. AI Coaching Requirements
@met24-pm
*ai-coaching-requirements

# 3. AI Service Implementation
@met24-dev
*implement-ai-service
```

### Voor WatermelonDB Changes

#### Database Workflow
```bash
# 1. Schema Analysis
@met24-analyst
*analyze-codebase shared/database

# 2. Migration Planning
@architect
*plan-database-migration

# 3. Model Implementation
@met24-dev
*setup-watermelon-model
```

## 📁 Belangrijke Locaties

```
shared/bmad-agents/
├── agents/           # MET24-specifieke agents
├── workflows/        # Development workflows
├── data/            # Technical preferences
└── docs/            # Gegenereerde documentatie
```

## 🎯 Gebruik Cases

### Feature Enhancement
- Nieuwe AI coaching capabilities
- User interface improvements
- Cross-app functionality
- Performance optimizations

### System Maintenance
- Database schema updates
- API integration changes
- Deployment improvements
- Code refactoring

### AI Integration
- New coaching conversation flows
- AI service optimizations
- Recommendation algorithm updates
- Personalization features

## ⚡ Pro Tips

1. **Start altijd met @met24-analyst** voor bestaande code impact
2. **Gebruik @met24-pm** voor feature definition en requirements
3. **@met24-dev** kent de TypeScript/React patterns van het project
4. **Test AI features thoroughly** - gebruik de AI integration checklists
5. **Coordinate cross-app changes** via de brownfield workflow

## 🔧 Configuratie

De agents zijn pre-configured met:
- MET24 technical preferences
- TypeScript/React best practices
- WatermelonDB patterns
- AI integration standards
- Coolify deployment knowledge

## 📞 Hulp Nodig?

- Check `shared/bmad-agents/README.md` voor uitgebreide documentatie
- Bekijk `workflows/met24-brownfield-enhancement.yaml` voor complete proces
- Lees `data/met24-technical-preferences.md` voor technical context
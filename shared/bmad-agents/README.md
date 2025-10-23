# BMAD Agents voor MET24 Ecosysteem

Dit is de centrale locatie voor BMAD-METHOD™ agents die gebruikt worden voor het MET24 Complete Ecosystem development proces.

## 📁 Structuur

```
shared/bmad-agents/
├── agents/           # Gespecialiseerde AI agents
├── templates/        # Document templates (PRD, Architecture, etc.)
├── tasks/           # Herbruikbare taken
├── workflows/       # Development workflows
├── data/           # Knowledge base en configuratie
├── checklists/     # QA en validatie checklists
└── docs/           # Gegenereerde documentatie
```

## 🎯 Doel

Deze BMAD implementatie is specifiek ontworpen voor:

- **MET24 Admin App**: React-based administratie interface
- **MET24 User App**: User-facing mobile/web applicatie
- **Shared Components**: Gedeelde utilities, database schemas, en configuratie
- **AI Coaching Features**: Coaching systemen en AI integrations

## 🚀 Gebruik

### Voor Nieuwe Features (Brownfield)
```bash
# 1. Documenteer huidige systeem
@analyst → *document-project

# 2. Creëer enhancement PRD
@pm → *create-brownfield-prd

# 3. Plan architectuur
@architect → *create-brownfield-architecture

# 4. Development cyclus
@sm → *create-story
@dev → implementatie
```

### Voor Systeem Wijzigingen
```bash
# Voor kleine wijzigingen
@pm → *create-brownfield-story

# Voor grotere features
@pm → *create-brownfield-epic
```

## 🔗 Ecosysteem Integratie

Deze agents zijn geoptimaliseerd voor:
- **TypeScript/React** development
- **WatermelonDB** database patterns
- **AI/ML** integrations
- **Coolify** deployment workflows
- **Docker** containerization

## 📋 Agent Rollen

- **@analyst**: Systeem documentatie, codebase analyse
- **@pm**: Requirements, PRD's, feature planning
- **@architect**: Technische architectuur, API design
- **@sm**: User stories, development planning
- **@dev**: Code implementatie, testing
- **@qa**: Code review, risico analyse
- **@po**: Validatie, workflow management

## 🎛️ Configuratie

Zie `data/met24-technical-preferences.md` voor project-specifieke instellingen.
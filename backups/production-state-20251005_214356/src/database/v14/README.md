# WatermelonDB V14 - MBTI Coach PWA Database

## 🚀 **OVERZICHT**

WatermelonDB V14 is een volledig herziene, modulaire database configuratie voor de MBTI Coach PWA. Deze versie lost alle problemen uit V13 op en voegt toekomstbestendige uitbreidingen toe.

## 📊 **STATISTIEKEN**

- **Versie:** 14.0.0
- **Totaal tabellen:** ~50
- **Totaal kolommen:** ~550
- **Geïndexeerde kolommen:** ~60
- **Optionele kolommen:** ~110

## 🔧 **VERBETERINGEN T.O.V. V13**

### ✅ **Opgeloste Problemen**
- **Duplicate tabellen:** CONTENT_ITEMS en CONTENT_CHUNKS geconsolideerd
- **Modulaire structuur:** Schema's opgesplitst per categorie
- **Toekomstbestendig:** EXTENSIONS categorie voor nieuwe features
- **Verbeterde auditing:** Consistente created_at, updated_at, created_by velden
- **Betere indexing:** Geoptimaliseerde indexes voor prestaties

### 🆕 **Nieuwe Features**
- **EXTENSIONS categorie:** Voor toekomstige uitbreidingen
- **Verbeterde TASKS tabel:** Uitgebreide task management
- **Verbeterde CONTACTS tabel:** Uitgebreide contact management
- **Supabase sync:** Volledige sync configuratie
- **Migratie scripts:** Automatische migratie van V13 naar V14

## 📁 **BESTANDSSTRUCTUUR**

```
src/database/v14/
├── database.ts                 # Hoofdbestand met database configuratie
├── migrations/
│   └── v13-to-v14.ts          # Migratie script V13 naar V14
├── models/                     # Model classes per tabel
│   ├── User.ts
│   ├── Task.ts
│   ├── Contact.ts
│   └── ... (alle andere modellen)
├── schemas/                    # Modulaire schema's per categorie
│   ├── userManagement.ts
│   ├── chatJournal.ts
│   ├── contentManagement.ts
│   ├── extensions.ts
│   └── ... (alle andere schema's)
├── sync/
│   └── SupabaseSyncProvider.ts # Supabase sync configuratie
└── README.md                   # Deze documentatie
```

## 🗂️ **CATEGORIEËN EN TABELLEN**

### 👤 **User Management (4 tabellen)**
- `users` - Basis user data
- `mbti_profiles` - MBTI profielen en insights
- `settings` - User instellingen
- `life_areas_progress` - Progress tracking voor levensgebieden

### 🚀 **Onboarding (1 tabel)**
- `onboarding_states` - Onboarding progress

### 💬 **Chat & Journal (3 tabellen)**
- `chat_messages` - Chat berichten
- `journal_entries` - Journal entries
- `contacts` - Chat contacts

### 🤖 **AI & Machine Learning (12 tabellen)**
- `ai_interactions` - AI interacties
- `vector_embeddings` - Vector embeddings
- `ai_action_plans` - AI actieplannen
- `super_insights` - Super inzichten
- `rewind_sessions` - Rewind sessies
- `ai_learning_pipeline` - AI learning
- `ai_personalization_engine` - Personalization
- `offline_ai_models` - Offline AI modellen
- `user_behavior_analytics` - Gedrag analytics
- `external_ai_services` - Externe AI services
- `interactive_ai_sessions` - Interactieve AI sessies
- `dynamic_content_creation` - Dynamische content

### 📦 **Content Management (10 tabellen)**
- `content_items` - Geconsolideerde content items
- `content_chunks` - Geconsolideerde content chunks
- `content_pointers` - User-specific content tracking
- `offline_packs` - Pre-downloaded content packs
- `content_recommendations` - MBTI-based recommendations
- `content_sources` - Content source management
- `mbti_learning_paths` - Predefined learning paths per MBTI
- `content_analytics` - User interaction analytics
- `media_intelligence` - Trending topics and MBTI relevance
- `content_sync_status` - Offline sync tracking

### 💳 **Subscription & Payment (4 tabellen)**
- `subscription_plans` - Subscription plannen
- `user_subscriptions` - User subscriptions
- `payment_transactions` - Payment transactions
- `upgrade_flow_events` - Upgrade flow events

### 🌐 **MET2.4 Domains (7 tabellen)**
- `met24_domains` - MET2.4 domeinen
- `met24_domain_relations` - Domein relaties
- `met24_new_insights` - Nieuwe inzichten
- `met24_practical_applications` - Praktische toepassingen
- `met24_user_progress` - User progress
- `met24_sync_queue` - Sync queue
- `met24_server_sync_status` - Server sync status

### 🏠 **Levensgebieden (1 tabel)**
- `levensgebieden_questionnaires` - Levensgebieden questionnaires

### 📋 **Tasks & Productivity (1 tabel)**
- `tasks` - Tasks/to-do items

### 🔄 **Sync & Status (2 tabellen)**
- `sync_status` - Sync status
- `ai_service_health_monitoring` - AI service health

### 📊 **Analytics & Tracking (2 tabellen)**
- `feature_usage` - Feature usage
- `mbti_contents` - MBTI content

### 🔮 **Extensions (3 tabellen)**
- `future_extensions` - Voor toekomstige features
- `extension_events` - Extension event tracking
- `extension_settings` - Extension-specifieke instellingen

## 🚀 **GEBRUIK**

### **Database Initialisatie**

```typescript
import { database } from './database/v14/database';

// Database is automatisch geïnitialiseerd
console.log('Database ready!');
```

### **Model Gebruik**

```typescript
import { User } from './database/v14/models/User';

// Haal user op
const user = await database.get('users').find(userId);

// Update user
await user.update((userRecord: any) => {
  userRecord.name = 'Nieuwe naam';
  userRecord.updatedAt = Date.now();
});
```

### **Sync met Supabase**

```typescript
import { createSupabaseSyncProvider } from './database/v14/sync/SupabaseSyncProvider';

const syncProvider = createSupabaseSyncProvider(database);

// Start auto sync
syncProvider.startAutoSync();

// Manual sync
await syncProvider.sync();
```

### **Migratie van V13 naar V14**

```typescript
import { runV13ToV14Migration } from './database/v14/migrations/v13-to-v14';

// Voer migratie uit
await runV13ToV14Migration(database);
```

## 🔧 **CONFIGURATIE**

### **Environment Variables**

```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Sync Configuratie**

```typescript
const syncConfig = {
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  batchSize: 50,
  retryAttempts: 3,
  retryDelay: 1000
};
```

## 📈 **PRESTATIES**

### **Indexing**
- Alle foreign keys zijn geïndexeerd
- Veelgebruikte query velden zijn geïndexeerd
- Composite indexes voor complexe queries

### **Sync Optimalisatie**
- Batch processing voor grote datasets
- Retry logic voor failed syncs
- Conflict resolution voor concurrent updates

### **Memory Management**
- Efficient data structures
- Lazy loading voor grote datasets
- Automatic cleanup van oude data

## 🔒 **SECURITY**

### **Encryption**
- Sensitive data wordt encrypted met `encryptPayload()`
- Encryption keys worden opgeslagen in device keychain
- Optional server backups met user opt-in

### **Row Level Security (RLS)**
- Strikte RLS policies in Supabase
- User-specific data access
- Audit trails voor alle wijzigingen

## 🧪 **TESTING**

### **Unit Tests**
```bash
npm test -- --testPathPattern=database/v14
```

### **Integration Tests**
```bash
npm test -- --testPathPattern=integration
```

### **Sync Tests**
```bash
npm test -- --testPathPattern=sync
```

## 📚 **DOCUMENTATIE**

### **API Reference**
- [WatermelonDB Documentation](https://watermelondb.dev/)
- [Supabase Documentation](https://supabase.com/docs)

### **Model Classes**
- Elke model class heeft uitgebreide JSDoc comments
- Helper methods voor veelgebruikte operaties
- Type safety met TypeScript

### **Schema Definitions**
- Modulaire schema's per categorie
- Uitgebreide comments voor elke tabel
- Toekomstbestendige uitbreidingen

## 🐛 **TROUBLESHOOTING**

### **Veelvoorkomende Problemen**

1. **Sync Errors**
   - Check Supabase credentials
   - Verify network connectivity
   - Check RLS policies

2. **Migration Issues**
   - Backup data before migration
   - Check for duplicate records
   - Verify schema compatibility

3. **Performance Issues**
   - Check indexes
   - Optimize queries
   - Monitor memory usage

### **Debug Mode**

```typescript
// Enable debug logging
import { logger } from '../utils/logger';
logger.setLevel('debug');
```

## 🔮 **TOEKOMSTPLANNEN**

### **V15 Features**
- Advanced AI integration
- Real-time collaboration
- Enhanced analytics
- Mobile app support

### **Extensibility**
- Plugin system
- Custom extensions
- Third-party integrations
- API extensions

## 📞 **SUPPORT**

Voor vragen of problemen:
- Check de troubleshooting sectie
- Raadpleeg de API documentation
- Contact de development team

---

**Versie:** 14.0.0  
**Laatste update:** 2025-01-07  
**Auteur:** Thomas  
**Status:** Production Ready

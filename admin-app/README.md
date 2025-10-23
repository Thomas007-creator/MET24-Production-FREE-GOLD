# 🛠️ MET2.4 Development - Admin Tools

> **Development deployment voor Development App (3002) - Admin Tools**

## 📋 **Services**

### **Development App (Port 3002)**
- **Doel**: Onderhoud en beheer van de User App
- **Flow**: Direct MainView (geen onboarding)
- **Gebruikers**: Ontwikkelaars/beheerders voor:
  - Database beheer
  - Content management
  - User data monitoring
  - System maintenance
  - Analytics en rapportage

### **Development Database (Port 5433)**
- **Doel**: Lokale development database
- **Type**: PostgreSQL 15
- **Database**: met24_dev

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Development deployment
docker-compose -f docker-compose.development.yml up -d

# Check status
docker-compose -f docker-compose.development.yml ps

# View logs
docker-compose -f docker-compose.development.yml logs -f
```

### **Environment Variables**
```env
# Supabase
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Development
DEV_API_KEY=your_dev_api_key
DEV_DB_PASSWORD=your_dev_db_password

# API Keys
REACT_APP_OPENAI_API_KEY=your_openai_key
```

## 🔧 **Health Checks**

- **Development App**: http://localhost:3002/health
- **Database**: localhost:5433

## 📱 **Access URLs**

- **Development App**: http://localhost:3002
- **Database**: localhost:5433

## 🛠️ **Development Features**

- **Hot Reload**: Live code updates
- **Database Access**: Direct PostgreSQL access
- **Admin Tools**: Content management interface
- **Analytics**: User behavior tracking
- **Debug Tools**: Development utilities

## 📊 **Admin Tools**

- User management
- Content curation
- System monitoring
- Performance analytics
- Error tracking
- Database administration

---

**Status**: Development Ready  
**Version**: 2.4.0  
**Last Updated**: September 2025
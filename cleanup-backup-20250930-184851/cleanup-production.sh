#!/bin/bash

# =====================================================
# MET2.4.2 PRODUCTION CLEANUP SCRIPT
# Grote schoonmaak van onnodige bestanden
# =====================================================

echo "🧹 Starting MET2.4.2 Production Cleanup..."
echo "=============================================="

# Backup directory
BACKUP_DIR="/Users/thomasmpfaff/Desktop/MET24_PRODUCTION_CLEAN_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Copy current working directory to backup
echo "📋 Copying current working directory to backup..."
cp -r . "$BACKUP_DIR/"

echo "🗑️  Starting cleanup of unnecessary files..."

# Remove old Dockerfiles (keep only the working ones)
echo "🐳 Cleaning up old Dockerfiles..."
rm -f "Dockerfile.simple"
rm -f "Dockerfile 2.production" 
rm -f "Dockerfile.user-app"
echo "✅ Removed old Dockerfiles"

# Remove old docker-compose files
echo "🐳 Cleaning up old docker-compose files..."
rm -f "docker-compose.old.yml"
rm -f "docker-compose.production.yml"
echo "✅ Removed old docker-compose files"

# Remove old environment templates (keep only the ones we use)
echo "🌍 Cleaning up old environment templates..."
rm -f "env.development.template"
rm -f "env.vpn-production.template"
rm -f "env.vpn.example"
echo "✅ Removed old environment templates"

# Remove test scripts (keep only essential ones)
echo "🧪 Cleaning up test scripts..."
rm -f "test-database-connections.js"
rm -f "test-production-connections.js"
rm -f "test-supabase-connection.js"
echo "✅ Removed test scripts"

# Remove old backup files
echo "📦 Cleaning up old backup files..."
rm -f "add-missing-tables-final.sql"
rm -f "node-installer.pkg"
echo "✅ Removed old backup files"

# Remove old documentation (keep only essential)
echo "📚 Cleaning up old documentation..."
rm -f "BACKUP_REPORT.md"
rm -f "BACKUP_SUMMARY.md"
rm -f "CHANGES_LOG.md"
rm -f "COMPLETE_DEPLOYMENT_GUIDE.md"
rm -f "COOLIFY_DEPLOYMENT_README.md"
rm -f "DEPLOYMENT_CHECKLIST.md"
rm -f "DEVELOPMENT_ENVIRONMENT_GUIDE.md"
echo "✅ Removed old documentation"

# Remove old scripts (keep only essential ones)
echo "📜 Cleaning up old scripts..."
rm -f "setup-github-actions.sh"
rm -f "setup-new-computer.sh"
rm -f "start-app.sh"
echo "✅ Removed old scripts"

# Clean up scripts directory (remove unused scripts)
echo "📜 Cleaning up scripts directory..."
cd scripts
rm -f "backup-database.sh"
rm -f "configure-mini-mcp-met244.js"
rm -f "create-complete-backup.sh"
rm -f "create-production-deployment.sh"
rm -f "deploy-digitalocean.sh"
rm -f "deploy-met244-ai-content.sh"
rm -f "deploy-to-cloud.sh"
rm -f "deploy-vercel-vpn-secured.sh"
rm -f "implement-enhanced-ai-system.js"
rm -f "migrate-ai-content-to-met244.js"
rm -f "migration-config.env"
rm -f "pre-deployment-workflow.sh"
rm -f "provision-dual-droplets.sh"
rm -f "restore-database.sh"
rm -f "run_migrations.sh"
rm -f "safety-checks.sh"
rm -f "setup-basic-droplet.sh"
rm -f "setup-mullvad-vpn.sh"
rm -f "setup-vpn.sh"
rm -f "start-docker-with-vpn.sh"
rm -f "start-mini-mcp.sh"
rm -f "start-supabase-with-vpn.sh"
rm -f "tailscale-manager.sh"
rm -f "update-docker-schema.sh"
rm -f "upload-to-droplet.sh"
rm -f "vpn-manager.sh"
rm -f "vpn-validator.sh"
cd ..
echo "✅ Cleaned up scripts directory"

# Create new clean README
echo "📝 Creating new clean README..."
cat > README.md << 'EOF'
# MET2.4.2 Production - Clean Version

## 🚀 Production Ready Application

This is the clean, production-ready version of MET2.4.2 MBTI Coach PWA.

### ✅ What's Working:
- **User App**: Port 3000 with direct Supabase connection
- **MCP Bridge**: Port 3001 (optional for future features)
- **Database**: 26 tables fully implemented in Supabase
- **Infrastructure**: GitHub → Coolify → DigitalOcean pipeline

### 🏗️ Architecture:
```
User App (Port 3000) ──► Supabase Database
     │
     └──► MCP Bridge (Port 3001) [Optional]
```

### 📁 Essential Files:
- `docker-compose.yml` - Production Docker setup
- `Dockerfile.production` - User App container
- `Dockerfile.mcp-bridge` - MCP Bridge container
- `package.json` - Dependencies and scripts
- `src/` - Application source code
- `server/` - Server-side code

### 🌐 Production URLs:
- **User App**: http://165.227.136.245:3000
- **MCP Bridge**: http://165.227.136.245:3001
- **Domain**: www.your-future-self.app (DNS pending)

### 🔧 Environment Variables:
- `REACT_APP_SUPABASE_URL` - Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Supabase anonymous key
- `MCP_API_KEY` - MCP Bridge API key

### 📊 Database:
- **Supabase**: 26 tables fully implemented
- **Connection**: Direct from User App (faster than MCP Bridge)
- **Schema**: WatermelonDB V14 compatible

### 🚀 Deployment:
- **Platform**: Coolify
- **Server**: DigitalOcean (4GB RAM, 80GB SSD)
- **Location**: FRA1 (Frankfurt)
- **OS**: Ubuntu 22.04 LTS

### 📝 Notes:
- Cleaned up on: $(date)
- All unnecessary files removed
- Only production-ready components remain
- Ready for DNS configuration

---
**Status**: ✅ Production Ready
**Last Updated**: $(date)
EOF

echo "✅ Created new clean README"

# Create production status file
echo "📊 Creating production status file..."
cat > PRODUCTION_STATUS.md << 'EOF'
# MET2.4.2 Production Status

## ✅ Working Components:
- [x] User App (Port 3000)
- [x] MCP Bridge (Port 3001) 
- [x] Supabase Database (26 tables)
- [x] Docker Compose setup
- [x] Coolify deployment
- [x] DigitalOcean infrastructure

## 🔄 Pending:
- [ ] DNS configuration (www.your-future-self.app)
- [ ] SSL certificates
- [ ] Domain testing

## 🧹 Cleanup Completed:
- [x] Removed old Dockerfiles
- [x] Removed old docker-compose files
- [x] Removed test scripts
- [x] Removed old documentation
- [x] Removed unused scripts
- [x] Created clean README

## 📦 Backup Created:
- Location: /Users/thomasmpfaff/Desktop/MET24_PRODUCTION_CLEAN_$(date +%Y%m%d_%H%M%S)
- Contains: Complete working version before cleanup

---
**Cleanup Date**: $(date)
**Status**: ✅ Clean and Production Ready
EOF

echo "✅ Created production status file"

echo ""
echo "🎉 CLEANUP COMPLETED!"
echo "===================="
echo "📦 Backup created: $BACKUP_DIR"
echo "🧹 Unnecessary files removed"
echo "📝 Clean documentation created"
echo "✅ Production ready!"
echo ""
echo "Next steps:"
echo "1. Test the cleaned version"
echo "2. Configure DNS for www.your-future-self.app"
echo "3. Set up SSL certificates"
echo ""

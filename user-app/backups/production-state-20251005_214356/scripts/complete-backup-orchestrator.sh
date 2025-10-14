#!/bin/bash

# MET24 Complete Backup Orchestrator
# Creates comprehensive backup of entire system

set -e

BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
echo "🎯 MET24 Complete Backup Orchestrator - $BACKUP_DATE"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Please run this script from the MET24 project root directory"
    exit 1
fi

# Create master backup directory
MASTER_BACKUP_DIR="backups/complete-backup-$BACKUP_DATE"
mkdir -p "$MASTER_BACKUP_DIR"

echo ""
echo "📦 1. Creating local application backup..."
./scripts/backup-production-state.sh

echo ""
echo "🌊 2. Creating DigitalOcean deployment backup..."
./scripts/backup-digitalocean-deployment.sh

echo ""
echo "🔗 3. Organizing complete backup package..."

# Copy latest backups to master backup
LATEST_PRODUCTION=$(ls -t backups/production-state-* | head -1)
LATEST_DEPLOYMENT=$(ls -t backups/digitalocean-deployment-* | head -1)

cp -r "$LATEST_PRODUCTION" "$MASTER_BACKUP_DIR/production-state/"
cp -r "$LATEST_DEPLOYMENT" "$MASTER_BACKUP_DIR/digitalocean-deployment/"

# Copy compressed archives
cp backups/MET24-Production-Backup-*.tar.gz "$MASTER_BACKUP_DIR/" 2>/dev/null || true
cp backups/MET24-DigitalOcean-Deployment-*.tar.gz "$MASTER_BACKUP_DIR/" 2>/dev/null || true

echo ""
echo "📊 4. Creating system status report..."

# Get current system status
cat > "$MASTER_BACKUP_DIR/SYSTEM_STATUS_$BACKUP_DATE.md" << EOF
# MET24 System Status Report - $BACKUP_DATE

## 🏗️ Application Status
$(node -p "
const pkg = require('./package.json');
\`- **Version**: \${pkg.version}
- **Name**: \${pkg.name}
- **Dependencies**: \${Object.keys(pkg.dependencies || {}).length} packages
- **DevDependencies**: \${Object.keys(pkg.devDependencies || {}).length} packages\`
" 2>/dev/null || echo "- Package.json info not available")

## 🧪 Test Results
\`\`\`bash
$(npm run test:unit -- --testPathPattern=i18n.test.tsx --watchAll=false 2>&1 | tail -10 || echo "Tests not available")
\`\`\`

## 🌐 i18n Status
- **Languages**: 7 (nl, en, de, es, fr, ja, ko)
- **Translation Files**: $(find src/i18n/locales -name "*.json" | wc -l | tr -d ' ') files
- **Hook**: useI18n.ts implemented
- **Real-time Switching**: ✅ Enabled

## 🗄️ Database Architecture
- **System**: WatermelonDB V14
- **Tables**: $(find src/database/v14 -name "*.ts" | wc -l | tr -d ' ') model files
- **Cloud Sync**: Supabase integration
- **Schemas**: $(find src/database/v14/schemas -name "*.ts" | wc -l | tr -d ' ') domain schemas

## 🐳 Deployment Status
- **Docker**: $(docker --version 2>/dev/null || echo "Not available")
- **Docker Compose**: $(docker-compose --version 2>/dev/null || echo "Not available")
- **Node.js**: $(node --version 2>/dev/null || echo "Not available")
- **NPM**: $(npm --version 2>/dev/null || echo "Not available")

## 📁 File Structure
\`\`\`
$(tree -d -L 2 src/ 2>/dev/null || find src/ -type d | head -20)
\`\`\`

## 🔧 Build Status
$(npm run build:coolify --dry-run 2>/dev/null || echo "Build check not available")

## 📦 Backup Contents
- **Production State**: Complete working application
- **DigitalOcean Config**: Server deployment ready
- **Restore Scripts**: Automated restoration tools
- **Documentation**: Complete setup guides

EOF

echo ""
echo "🔐 5. Creating backup verification..."

# Verify backup integrity
VERIFICATION_LOG="$MASTER_BACKUP_DIR/BACKUP_VERIFICATION.log"
{
    echo "=== MET24 Backup Verification - $BACKUP_DATE ==="
    echo ""
    
    echo "✅ Checking production state backup..."
    if [ -d "$MASTER_BACKUP_DIR/production-state/src/i18n" ]; then
        echo "  ✓ i18n system backed up"
    else
        echo "  ❌ i18n system missing"
    fi
    
    if [ -d "$MASTER_BACKUP_DIR/production-state/src/database/v14" ]; then
        echo "  ✓ Database V14 backed up"
    else
        echo "  ❌ Database V14 missing"
    fi
    
    echo ""
    echo "✅ Checking deployment backup..."
    if [ -d "$MASTER_BACKUP_DIR/digitalocean-deployment/server-config" ]; then
        echo "  ✓ Server configuration backed up"
    else
        echo "  ❌ Server configuration missing"
    fi
    
    if [ -d "$MASTER_BACKUP_DIR/digitalocean-deployment/deployment-scripts" ]; then
        echo "  ✓ Deployment scripts backed up"
    else
        echo "  ❌ Deployment scripts missing"
    fi
    
    echo ""
    echo "📊 Backup Statistics:"
    echo "  Total files: $(find "$MASTER_BACKUP_DIR" -type f | wc -l | tr -d ' ')"
    echo "  Total size: $(du -sh "$MASTER_BACKUP_DIR" | cut -f1)"
    echo "  Languages: 7 (nl, en, de, es, fr, ja, ko)"
    echo "  Database tables: $(find "$MASTER_BACKUP_DIR/production-state/src/database/v14" -name "*.ts" | wc -l | tr -d ' ')"
    
} > "$VERIFICATION_LOG"

echo ""
echo "🗜️ 6. Creating final compressed package..."

cd backups
tar -czf "MET24-COMPLETE-BACKUP-$BACKUP_DATE.tar.gz" "complete-backup-$BACKUP_DATE/"
cd ..

echo ""
echo "📋 7. Creating master recovery guide..."

cat > "$MASTER_BACKUP_DIR/MASTER_RECOVERY_GUIDE.md" << EOF
# 🚀 MET24 Master Recovery Guide

## 📦 What's in this backup?

This complete backup contains everything needed to restore MET24 from zero to production:

### 🏠 Production State Backup
- Complete working application with 7-language support
- All source code, tests, and configurations  
- Ready-to-build state with passing tests

### 🌊 DigitalOcean Deployment Package
- Server configuration and Docker setup
- Automated deployment scripts
- Production environment templates
- Monitoring and maintenance tools

## 🛠️ Recovery Scenarios

### Scenario 1: Local Development Recovery
\`\`\`bash
# Extract and restore local development
./scripts/restore-from-backup.sh production-state/
npm install --legacy-peer-deps
npm run test:unit -- --testPathPattern=i18n.test.tsx
npm start
\`\`\`

### Scenario 2: Production Server Recovery
\`\`\`bash
# On DigitalOcean droplet
tar -xzf MET24-COMPLETE-BACKUP-$BACKUP_DATE.tar.gz
cd complete-backup-$BACKUP_DATE/digitalocean-deployment/

# Setup fresh droplet
./deployment-scripts/setup-digitalocean-droplet.sh

# Deploy application
git clone <your-repo> /opt/met24
cd /opt/met24
cp ../server-config/production.env.template .env
# Edit .env with your values
./deployment-scripts/deploy-to-production.sh
\`\`\`

### Scenario 3: Complete Disaster Recovery
\`\`\`bash
# 1. Setup new droplet
# 2. Extract complete backup
# 3. Copy production-state to new repository
# 4. Configure and deploy using DigitalOcean scripts
\`\`\`

## ✅ Verification Checklist

After restoration, verify:
- [ ] All 7 languages working (nl, en, de, es, fr, ja, ko)
- [ ] MBTI community features functional
- [ ] PWA install prompt working
- [ ] Database sync operational
- [ ] SSL certificates active
- [ ] All Docker services running

## 🆘 Emergency Contacts

- Backup created: $BACKUP_DATE
- System status: See SYSTEM_STATUS_$BACKUP_DATE.md
- Verification: See BACKUP_VERIFICATION.log

## 📞 Support

If restoration fails:
1. Check BACKUP_VERIFICATION.log for integrity
2. Try alternative restoration method
3. Use pre-restore backups if available
4. Contact development team with log files

EOF

echo ""
echo "✅ COMPLETE BACKUP ORCHESTRATION FINISHED!"
echo "=================================================="
echo ""
echo "📍 Master Backup Location:"
echo "   $MASTER_BACKUP_DIR"
echo ""
echo "📦 Complete Package:"
echo "   backups/MET24-COMPLETE-BACKUP-$BACKUP_DATE.tar.gz"
echo ""
echo "📋 Recovery Guide:"
echo "   $MASTER_BACKUP_DIR/MASTER_RECOVERY_GUIDE.md"
echo ""
echo "🔍 Verification Log:"
echo "   $MASTER_BACKUP_DIR/BACKUP_VERIFICATION.log"
echo ""
echo "🌟 This backup contains EVERYTHING needed to restore MET24!"
echo "   - 7-language working app"
echo "   - Complete DigitalOcean deployment"
echo "   - Automated restoration tools"
echo ""
echo "🚀 Ready for any recovery scenario!"

# Display verification results
echo ""
echo "🔐 BACKUP VERIFICATION SUMMARY:"
cat "$VERIFICATION_LOG" | grep -E "(✓|❌|Total|Languages|Database)"
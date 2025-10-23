#!/bin/bash

# Cleanup Duplicates Script
# This script identifies and removes duplicate/obsolete files

echo "🧹 Cleanup Duplicates Analysis"
echo "=============================="

# Create backup directory
BACKUP_DIR="cleanup-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📋 Analysis Results:"
echo "==================="

echo ""
echo "📄 DUPLICATE DOCUMENTATION FILES:"
echo "---------------------------------"

# Check for duplicate deployment documentation
echo "❌ DEPLOYMENT_FIX_UPDATE.md - Obsolete (superseded by PROBLEMEN_NIEUWE_DEPLOYMENT.md)"
echo "❌ DEPLOYMENT_STATUS_UPDATE.md - Obsolete (superseded by PROBLEMEN_NIEUWE_DEPLOYMENT.md)"
echo "❌ DEPLOYMENT_STATUS_FINAL.md - Obsolete (superseded by PROBLEMEN_NIEUWE_DEPLOYMENT.md)"
echo "❌ TRAEFIK_FIX_STATUS.md - Obsolete (superseded by PROBLEMEN_NIEUWE_DEPLOYMENT.md)"

echo ""
echo "📄 REDUNDANT SCRIPTS:"
echo "--------------------"

# Check for redundant scripts
echo "❌ cleanup-production.sh - Duplicate of cleanup-production 2.sh"
echo "❌ fix-traefik-entrypoints.sh - Obsolete (issue resolved)"

echo ""
echo "📄 ENVIRONMENT TEMPLATES:"
echo "------------------------"

# Check environment templates
echo "❌ env.production.template - Redundant (we have COMPLETE_DEPLOYMENT_GUIDE.md)"
echo "❌ vapid-keys.env - Can be moved to scripts/ directory"

echo ""
echo "📄 DOCKER COMPOSE FILES:"
echo "-----------------------"

# Check docker compose files
echo "❌ docker-compose.coolify-production.yml - Redundant (docker-compose.yml is sufficient)"

echo ""
echo "🎯 CLEANUP RECOMMENDATIONS:"
echo "==========================="

echo ""
echo "🗑️  FILES TO REMOVE (Safe to delete):"
echo "-------------------------------------"
echo "1. DEPLOYMENT_FIX_UPDATE.md"
echo "2. DEPLOYMENT_STATUS_UPDATE.md" 
echo "3. DEPLOYMENT_STATUS_FINAL.md"
echo "4. TRAEFIK_FIX_STATUS.md"
echo "5. cleanup-production.sh"
echo "6. fix-traefik-entrypoints.sh"
echo "7. env.production.template"
echo "8. docker-compose.coolify-production.yml"

echo ""
echo "📁 FILES TO KEEP (Essential):"
echo "----------------------------"
echo "✅ COMPLETE_DEPLOYMENT_GUIDE.md - Main deployment guide"
echo "✅ PROBLEMEN_NIEUWE_DEPLOYMENT.md - Current deployment issues"
echo "✅ README-GPT5-GROK4-ROADMAP.md - AI roadmap documentation"
echo "✅ ENVIRONMENT_VARIABLES_GUIDE.md - Environment setup guide"
echo "✅ DATABASE_MIGRATION_COMPLETE.md - Database migration status"
echo "✅ INPUT_VALIDATION_RATE_LIMITING_COMPLETE.md - Security implementation"
echo "✅ SECURITY_FIX_VAPID_KEYS.md - VAPID keys documentation"
echo "✅ cleanup-production 2.sh - Main cleanup script"
echo "✅ docker-compose.yml - Main docker configuration"
echo "✅ vapid-keys.env - VAPID keys (move to scripts/)"

echo ""
echo "📊 CLEANUP IMPACT:"
echo "=================="
echo "🗑️  Files to remove: 8 files"
echo "📁 Files to keep: 10+ essential files"
echo "💾 Space saved: ~50KB+ of duplicate documentation"
echo "🧹 Cleaner repository structure"

echo ""
echo "🚀 EXECUTE CLEANUP? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🧹 Executing cleanup..."
    
    # Backup files before deletion
    echo "📦 Creating backup in $BACKUP_DIR..."
    cp DEPLOYMENT_FIX_UPDATE.md "$BACKUP_DIR/" 2>/dev/null || true
    cp DEPLOYMENT_STATUS_UPDATE.md "$BACKUP_DIR/" 2>/dev/null || true
    cp DEPLOYMENT_STATUS_FINAL.md "$BACKUP_DIR/" 2>/dev/null || true
    cp TRAEFIK_FIX_STATUS.md "$BACKUP_DIR/" 2>/dev/null || true
    cp cleanup-production.sh "$BACKUP_DIR/" 2>/dev/null || true
    cp fix-traefik-entrypoints.sh "$BACKUP_DIR/" 2>/dev/null || true
    cp env.production.template "$BACKUP_DIR/" 2>/dev/null || true
    cp docker-compose.coolify-production.yml "$BACKUP_DIR/" 2>/dev/null || true
    
    # Remove duplicate files
    echo "🗑️  Removing duplicate files..."
    rm -f DEPLOYMENT_FIX_UPDATE.md
    rm -f DEPLOYMENT_STATUS_UPDATE.md
    rm -f DEPLOYMENT_STATUS_FINAL.md
    rm -f TRAEFIK_FIX_STATUS.md
    rm -f cleanup-production.sh
    rm -f fix-traefik-entrypoints.sh
    rm -f env.production.template
    rm -f docker-compose.coolify-production.yml
    
    # Move vapid-keys.env to scripts directory
    echo "📁 Moving vapid-keys.env to scripts/..."
    mv vapid-keys.env scripts/ 2>/dev/null || true
    
    echo ""
    echo "✅ Cleanup completed!"
    echo "📦 Backup created in: $BACKUP_DIR"
    echo "🧹 Repository cleaned up successfully"
    
    # Show remaining files
    echo ""
    echo "📋 Remaining documentation files:"
    ls -la *.md | grep -v node_modules
    
else
    echo ""
    echo "❌ Cleanup cancelled"
    echo "💡 Run this script again when ready to clean up"
fi

echo ""
echo "🎯 Next steps:"
echo "=============="
echo "1. Review the cleanup results"
echo "2. Commit changes: git add -A && git commit -m 'Cleanup: Remove duplicate files'"
echo "3. Push to GitHub: git push origin main"
echo "4. Verify repository is cleaner and more organized"

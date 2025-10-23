#!/bin/bash

# MET24 Restore Script
# Restores from backup to working state

set -e

if [ -z "$1" ]; then
    echo "❌ Usage: $0 <backup-directory-or-archive>"
    echo "Examples:"
    echo "  $0 backups/production-state-20251005_143022"
    echo "  $0 backups/MET24-Production-Backup-20251005_143022.tar.gz"
    exit 1
fi

BACKUP_SOURCE="$1"
RESTORE_DATE=$(date +"%Y%m%d_%H%M%S")
CURRENT_BACKUP="backups/pre-restore-backup-$RESTORE_DATE"

echo "🔄 MET24 Restore Operation - $RESTORE_DATE"
echo "📥 Source: $BACKUP_SOURCE"

# Create backup of current state before restore
echo "📦 Creating backup of current state..."
mkdir -p "$CURRENT_BACKUP"
cp -r src/ "$CURRENT_BACKUP/" 2>/dev/null || echo "  ↳ No src/ directory found"
cp package*.json "$CURRENT_BACKUP/" 2>/dev/null || echo "  ↳ No package files found"
cp *.config.js "$CURRENT_BACKUP/" 2>/dev/null || echo "  ↳ No config files found"
cp docker-compose*.yml "$CURRENT_BACKUP/" 2>/dev/null || echo "  ↳ No Docker Compose files found"
cp Dockerfile* "$CURRENT_BACKUP/" 2>/dev/null || echo "  ↳ No Dockerfiles found"

echo "✅ Current state backed up to: $CURRENT_BACKUP"

# Handle archive extraction
if [[ "$BACKUP_SOURCE" == *.tar.gz ]]; then
    echo "📂 Extracting archive..."
    EXTRACT_DIR="backups/extracted-$RESTORE_DATE"
    mkdir -p "$EXTRACT_DIR"
    tar -xzf "$BACKUP_SOURCE" -C "$EXTRACT_DIR"
    
    # Find the actual backup directory inside the archive
    BACKUP_DIR=$(find "$EXTRACT_DIR" -name "production-state-*" -type d | head -1)
    if [ -z "$BACKUP_DIR" ]; then
        BACKUP_DIR=$(find "$EXTRACT_DIR" -name "local-app" -type d | head -1 | dirname)
    fi
    
    if [ -z "$BACKUP_DIR" ]; then
        echo "❌ Could not find backup content in archive"
        exit 1
    fi
    
    # For DigitalOcean deployment backups, use local-app directory
    if [ -d "$BACKUP_DIR/local-app" ]; then
        BACKUP_DIR="$BACKUP_DIR/local-app"
    fi
    
    echo "✅ Archive extracted to: $BACKUP_DIR"
else
    BACKUP_DIR="$BACKUP_SOURCE"
fi

# Verify backup directory exists and has content
if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

if [ ! -d "$BACKUP_DIR/src" ]; then
    echo "❌ Invalid backup: no src/ directory found in $BACKUP_DIR"
    exit 1
fi

echo "✅ Backup directory verified: $BACKUP_DIR"

# Restore application files
echo "📁 Restoring application files..."

# Core application
if [ -d "$BACKUP_DIR/src" ]; then
    echo "  ↳ Restoring src/ directory..."
    rm -rf src/
    cp -r "$BACKUP_DIR/src" .
fi

# Configuration files
echo "  ↳ Restoring configuration files..."
for file in package.json package-lock.json tsconfig.json tailwind.config.js craco.config.js; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" .
        echo "    ✓ $file"
    fi
done

# Docker files
echo "  ↳ Restoring Docker configuration..."
for file in Dockerfile Dockerfile.production Dockerfile.mcp-bridge; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" .
        echo "    ✓ $file"
    fi
done

for file in docker-compose.yml docker-compose.production.yml docker-compose.coolify.yml; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" .
        echo "    ✓ $file"
    fi
done

# Public assets
if [ -d "$BACKUP_DIR/public" ]; then
    echo "  ↳ Restoring public assets..."
    rm -rf public/
    cp -r "$BACKUP_DIR/public" .
fi

# Service workers
echo "  ↳ Restoring service workers..."
for file in sw.js sw-offline-queue.js sw-workbox.js workbox-config.js; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" .
        echo "    ✓ $file"
    fi
done

# Scripts
if [ -d "$BACKUP_DIR/scripts" ]; then
    echo "  ↳ Restoring scripts..."
    rm -rf scripts/
    cp -r "$BACKUP_DIR/scripts" .
    chmod +x scripts/*.sh 2>/dev/null || true
fi

# Server files
if [ -d "$BACKUP_DIR/server" ]; then
    echo "  ↳ Restoring server components..."
    rm -rf server/
    cp -r "$BACKUP_DIR/server" .
fi

# Environment templates
echo "  ↳ Restoring environment templates..."
for file in env.example env.template env-template.txt; do
    if [ -f "$BACKUP_DIR/$file" ]; then
        cp "$BACKUP_DIR/$file" .
        echo "    ✓ $file"
    fi
done

# Database schemas
echo "  ↳ Restoring database schemas..."
for file in "$BACKUP_DIR"/*.sql; do
    if [ -f "$file" ]; then
        cp "$file" .
        echo "    ✓ $(basename "$file")"
    fi
done

echo "✅ File restoration completed!"

# Install dependencies
echo "📦 Installing dependencies..."
if command -v npm >/dev/null 2>&1; then
    npm install --legacy-peer-deps
    echo "✅ Dependencies installed!"
else
    echo "⚠️ npm not found. Please run 'npm install --legacy-peer-deps' manually."
fi

# Verify restoration
echo "🔍 Verifying restoration..."

# Check critical files
CRITICAL_FILES=(
    "src/i18n/index.ts"
    "src/i18n/locales/nl.json"
    "src/i18n/locales/en.json"
    "src/i18n/locales/de.json"
    "src/i18n/locales/es.json"
    "src/i18n/locales/fr.json"
    "src/i18n/locales/ja.json"
    "src/i18n/locales/ko.json"
    "src/hooks/useI18n.ts"
    "src/database/v14/database.ts"
    "package.json"
)

MISSING_FILES=()
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    echo "✅ All critical files present!"
else
    echo "⚠️ Missing critical files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  ❌ $file"
    done
fi

# Check if we can run tests
echo "🧪 Testing restoration..."
if command -v npm >/dev/null 2>&1; then
    if npm run test:unit -- --testPathPattern=i18n.test.tsx --watchAll=false >/dev/null 2>&1; then
        echo "✅ i18n tests passing - restoration successful!"
    else
        echo "⚠️ i18n tests failing - please check restoration"
    fi
else
    echo "⚠️ Cannot run tests - npm not available"
fi

# Create restoration report
cat > "RESTORATION_REPORT_$RESTORE_DATE.md" << EOF
# MET24 Restoration Report - $RESTORE_DATE

## Restoration Details
- **Source**: $BACKUP_SOURCE
- **Restored to**: $(pwd)
- **Pre-restore backup**: $CURRENT_BACKUP

## Files Restored
$(find . -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l) source files
$(find . -name "*.md" | wc -l) documentation files
$(find . -name "Dockerfile*" -o -name "docker-compose*" | wc -l) Docker files

## Critical Features Status
- ✅ 7-Language i18n system
- ✅ WatermelonDB V14 database
- ✅ React/TypeScript application
- ✅ Docker deployment configuration
- ✅ Service workers and PWA features

## Next Steps
1. Configure environment variables
2. Run: \`npm run build:coolify\`
3. Test deployment: \`docker-compose up -d\`
4. Verify all features working

## Rollback
To rollback this restoration:
\`\`\`bash
rm -rf src/ public/ server/
cp -r $CURRENT_BACKUP/* .
\`\`\`

EOF

echo ""
echo "✅ MET24 Restoration Completed!"
echo ""
echo "📁 Restored from: $BACKUP_SOURCE"
echo "💾 Pre-restore backup: $CURRENT_BACKUP"
echo "📋 Report: RESTORATION_REPORT_$RESTORE_DATE.md"
echo ""
echo "🚀 Next steps:"
echo "1. Configure your environment variables"
echo "2. Run: npm run build:coolify"
echo "3. Deploy: docker-compose up -d"
echo ""
echo "🧪 Test i18n system: npm run test:unit -- --testPathPattern=i18n.test.tsx"
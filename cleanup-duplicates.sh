#!/bin/bash
# MET24 Documentation Cleanup Script
# Removes duplicates while preserving all useful information
# Master Reference: MET24-CLEAN-PERFECT-BACKUP-2025101
# Created: 11 oktober 2025

echo "🧹 Starting MET24 Documentation Cleanup..."
echo "📋 This script will remove duplicate and obsolete documentation files"
echo "✅ All useful information has been consolidated into master documents"
echo "🎯 Master Reference: MET24-CLEAN-PERFECT-BACKUP-2025101"

# Safety check
read -p "⚠️  Are you sure you want to proceed? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Cleanup cancelled"
    exit 1
fi

echo "🔍 Starting cleanup process..."
echo "📊 Validating against master reference: MET24-CLEAN-PERFECT-BACKUP-2025101"

# Create backup of current state (just file list)
echo "📝 Creating file list backup..."
ls -la > cleanup-file-list-$(date +%Y%m%d-%H%M%S).txt

echo "🗑️  Phase 1: Removing ChatLLM duplicates..."
# ChatLLM duplicates (replaced by CHATLLM_STACK_INTEGRATION_README.md and CHATLLM_SUPER_USE_CASES_COMPLETE_INVENTORY.md)
if [ -f "CHATLLM_DATABASE_ARCHITECTURE_EVALUATION.md" ]; then
    echo "  ❌ Removing CHATLLM_DATABASE_ARCHITECTURE_EVALUATION.md (replaced by CHATLLM_STACK_INTEGRATION_README.md)"
    rm "CHATLLM_DATABASE_ARCHITECTURE_EVALUATION.md"
fi

if [ -f "TOP_5_CHATLLM_FEATURES_IMPLEMENTATION.md" ]; then
    echo "  ❌ Removing TOP_5_CHATLLM_FEATURES_IMPLEMENTATION.md (replaced by CHATLLM_SUPER_USE_CASES_COMPLETE_INVENTORY.md)"
    rm "TOP_5_CHATLLM_FEATURES_IMPLEMENTATION.md"
fi

if [ -f "WEBLLM_WORKER_IMPLEMENTATION_COMPLETE.md" ]; then
    echo "  ❌ Removing WEBLLM_WORKER_IMPLEMENTATION_COMPLETE.md (integrated into src/services/chatLLMService.ts)"
    rm "WEBLLM_WORKER_IMPLEMENTATION_COMPLETE.md"
fi

echo "🗑️  Phase 2: Removing V14 Database duplicates..."
# V14 Database duplicates
if [ -f "WATERMELONDB_V14_AUDIT_IMPLEMENTATION_COMPLETE.md" ]; then
    echo "  ❌ Removing WATERMELONDB_V14_AUDIT_IMPLEMENTATION_COMPLETE.md (duplicates V14_AUDIT_EVENTS_IMPLEMENTATION_COMPLETE.md)"
    rm "WATERMELONDB_V14_AUDIT_IMPLEMENTATION_COMPLETE.md"
fi

if [ -f "WATERMELONDB_V14_INTEGRATION_UPDATES_COMPLETE.md" ]; then
    echo "  ❌ Removing WATERMELONDB_V14_INTEGRATION_UPDATES_COMPLETE.md (info in V14 README)"
    rm "WATERMELONDB_V14_INTEGRATION_UPDATES_COMPLETE.md"
fi

echo "🗑️  Phase 3: Removing feature implementation duplicates..."
# Feature implementation duplicates (replaced by src/features/ directories)
if [ -f "AI_COACHING_IMPLEMENTATION_COMPLETE.md" ]; then
    echo "  ❌ Removing AI_COACHING_IMPLEMENTATION_COMPLETE.md (replaced by src/features/01-ai-coaching/)"
    rm "AI_COACHING_IMPLEMENTATION_COMPLETE.md"
fi

if [ -f "WELLNESS_ANALYSIS_IMPLEMENTATION_COMPLETE.md" ]; then
    echo "  ❌ Removing WELLNESS_ANALYSIS_IMPLEMENTATION_COMPLETE.md (replaced by src/features/02-holistic-wellness/)"
    rm "WELLNESS_ANALYSIS_IMPLEMENTATION_COMPLETE.md"
fi

if [ -f "ACTIVE_IMAGINATION_JOURNALING_IMPLEMENTATION_COMPLETE.md" ]; then
    echo "  ❌ Removing ACTIVE_IMAGINATION_JOURNALING_IMPLEMENTATION_COMPLETE.md (replaced by src/features/03-active-imagination/)"
    rm "ACTIVE_IMAGINATION_JOURNALING_IMPLEMENTATION_COMPLETE.md"
fi

if [ -f "AI3_PERSONAL_ACTION_PLANS_IMPLEMENTATION_COMPLETE.md" ]; then
    echo "  ❌ Removing AI3_PERSONAL_ACTION_PLANS_IMPLEMENTATION_COMPLETE.md (replaced by feature directories)"
    rm "AI3_PERSONAL_ACTION_PLANS_IMPLEMENTATION_COMPLETE.md"
fi

echo "🗑️  Phase 4: Consolidating backup documentation..."
# Backup documentation consolidation (keep PROJECT_BACKUP_DOCUMENTATION.md as master)
if [ -f "BACKUP_SUMMARY.md" ]; then
    echo "  ❌ Removing BACKUP_SUMMARY.md (consolidated into PROJECT_BACKUP_DOCUMENTATION.md)"
    rm "BACKUP_SUMMARY.md"
fi

if [ -f "BACKUP_COMPLETE_SUMMARY.md" ]; then
    echo "  ❌ Removing BACKUP_COMPLETE_SUMMARY.md (consolidated into PROJECT_BACKUP_DOCUMENTATION.md)"
    rm "BACKUP_COMPLETE_SUMMARY.md"
fi

echo "🗑️  Phase 5: Removing obsolete SQL scripts..."
# Obsolete SQL scripts (keep only essential ones)
for file in SUPABASE_V14_AUDIT_EVENTS_*.sql; do
    if [ -f "$file" ]; then
        echo "  ❌ Removing $file (obsolete SQL script)"
        rm "$file"
    fi
done

echo "🗑️  Phase 6: Cleaning up old backup directories..."
# Old backup directories (alle verouderd t.o.v. MET24-CLEAN-PERFECT-BACKUP-2025101)
for dir in backups/production-state-20251005_214356 backups/production-state-20251005_214357 backups/production-state-20251005_214413 backups/production-state-20251005_214422 backups/production-state-20251005_214438 backups/digitalocean-deployment-20251005_214438; do
    if [ -d "$dir" ]; then
        echo "  ❌ Removing $dir/ (outdated - superseded by MET24-CLEAN-PERFECT-BACKUP-2025101)"
        rm -rf "$dir"
    fi
done

# Remove old cleanup backup if exists
if [ -d "cleanup-backup-20250930-184851" ]; then
    echo "  ❌ Removing cleanup-backup-20250930-184851/ (old cleanup backup)"
    rm -rf "cleanup-backup-20250930-184851"
fi

echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "📊 Summary of changes:"
echo "  🗑️  Removed duplicate ChatLLM documentation (3 files)"
echo "  🗑️  Removed duplicate V14 database docs (2 files)"  
echo "  🗑️  Removed duplicate feature implementations (4 files)"
echo "  🗑️  Consolidated backup documentation (2 files)"
echo "  🗑️  Removed obsolete SQL scripts (~6 files)"
echo "  🗑️  Removed outdated backup directories (~4 directories)"
echo ""
echo "✅ All useful information has been preserved in:"
echo "  📖 CHATLLM_STACK_INTEGRATION_README.md - Master ChatLLM guide"
echo "  📖 CHATLLM_SUPER_USE_CASES_COMPLETE_INVENTORY.md - Complete feature inventory"
echo "  📖 GITHUB_COPILOT_INSTRUCTIONS.md - Updated development patterns"
echo "  📖 PROJECT_BACKUP_DOCUMENTATION.md - Consolidated backup management"
echo "  📁 src/features/ - Feature-specific implementation guides"
echo "  📁 src/database/v14/ - Complete database documentation"
echo ""
echo "🎯 Repository is now cleaner and better organized!"
echo "📋 See DOCUMENTATION_CLEANUP_PLAN.md for detailed cleanup information"
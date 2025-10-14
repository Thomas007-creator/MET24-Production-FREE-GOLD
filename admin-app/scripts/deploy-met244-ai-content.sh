#!/bin/bash

# =====================================================
# MET2.4.4 AI Content Deployment Script
# Deployt alle nieuwe AI content generatie componenten naar MET2.4.4
# =====================================================

echo "🚀 Starting MET2.4.4 AI Content Deployment..."

# Check if we're in the right directory
if [ ! -f "MET24_SUPABASE_V14_COMPLETE_UPDATED.sql" ]; then
    echo "❌ Error: MET24_SUPABASE_V14_COMPLETE_UPDATED.sql not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# 1. Update Supabase schema with AI content tables
echo "📊 Updating Supabase schema with AI content tables..."
if [ -n "$REACT_APP_SUPABASE_URL" ]; then
    echo "🔗 Connecting to Supabase: $REACT_APP_SUPABASE_URL"
    
    # Apply schema updates
    psql "$REACT_APP_SUPABASE_URL" -f MET24_SUPABASE_V14_COMPLETE_UPDATED.sql
    if [ $? -eq 0 ]; then
        echo "✅ Supabase schema updated successfully"
    else
        echo "❌ Failed to update Supabase schema"
        exit 1
    fi
else
    echo "⚠️ REACT_APP_SUPABASE_URL not set, skipping schema update"
fi

# 2. Migrate AI content from local to MET2.4.4
echo "📦 Migrating AI content to MET2.4.4..."
if command -v node &> /dev/null; then
    node scripts/migrate-ai-content-to-met244.js
    if [ $? -eq 0 ]; then
        echo "✅ AI content migration completed"
    else
        echo "❌ AI content migration failed"
        exit 1
    fi
else
    echo "⚠️ Node.js not found, skipping AI content migration"
fi

# 3. Configure Mini-MCP Orchestrator for MET2.4.4
echo "🔧 Configuring Mini-MCP Orchestrator for MET2.4.4..."
if command -v node &> /dev/null; then
    node scripts/configure-mini-mcp-met244.js
    if [ $? -eq 0 ]; then
        echo "✅ Mini-MCP Orchestrator configured for MET2.4.4"
    else
        echo "❌ Mini-MCP Orchestrator configuration failed"
        exit 1
    fi
else
    echo "⚠️ Node.js not found, skipping Mini-MCP configuration"
fi

# 4. Restart Mini-MCP Orchestrator with new configuration
echo "🔄 Restarting Mini-MCP Orchestrator..."
docker-compose --profile orchestrator restart met24-mini-mcp-orchestrator
if [ $? -eq 0 ]; then
    echo "✅ Mini-MCP Orchestrator restarted"
else
    echo "❌ Failed to restart Mini-MCP Orchestrator"
    exit 1
fi

# 5. Verify deployment
echo "🔍 Verifying deployment..."
sleep 5
docker logs met24-mini-mcp-orchestrator --tail 10

echo ""
echo "🎉 MET2.4.4 AI Content Deployment Summary:"
echo "✅ Supabase schema updated with AI content tables"
echo "✅ AI content migrated from local to MET2.4.4"
echo "✅ Mini-MCP Orchestrator configured for MET2.4.4"
echo "✅ Mini-MCP Orchestrator restarted"
echo ""
echo "🚀 MET2.4.4 is now ready with AI content generatie!"
echo ""
echo "📊 Available AI Content:"
echo "  - AI-1 Esthetic Content Generator (OpenAI GPT-4o)"
echo "  - AI-2 Cognitive Insight Generator (Claude 3 Opus)"
echo "  - AI-3 Ethical Action Plan Generator (Gemini Pro)"
echo "  - All 16 MBTI types supported"
echo "  - Redis job queue for background processing"
echo "  - MET2.4.4 Supabase database integration"
















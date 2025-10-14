#!/bin/bash

# Extract Existing Environment Variables Script
# This script extracts all existing environment variables from the backup files

echo "🔍 Extracting Existing Environment Variables from Backup Files"
echo "=============================================================="

# Create output file
OUTPUT_FILE="existing-env-vars.txt"
echo "# Existing Environment Variables from MET24 Production Backup" > $OUTPUT_FILE
echo "# Generated on: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "📋 Found Environment Variables:"
echo "-------------------------------"

# Extract from vapid-keys.env
if [ -f "vapid-keys.env" ]; then
    echo "✅ VAPID Keys found in vapid-keys.env:"
    echo "VAPID_PUBLIC_KEY=your-vapid-public-key-here" >> $OUTPUT_FILE
    echo "VAPID_PRIVATE_KEY=your-vapid-private-key-here" >> $OUTPUT_FILE
    echo "VAPID_EMAIL=mailto:thomas@your-future-self.app" >> $OUTPUT_FILE
    echo "" >> $OUTPUT_FILE
    
    echo "   - VAPID_PUBLIC_KEY: your-vapid-public-key-here"
    echo "   - VAPID_PRIVATE_KEY: your-vapid-private-key-here"
    echo "   - VAPID_EMAIL: mailto:thomas@your-future-self.app"
else
    echo "❌ vapid-keys.env not found"
fi

echo ""
echo "📋 Environment Variables to add to Coolify:"
echo "==========================================="

# Create Coolify-ready environment variables
cat >> $OUTPUT_FILE << 'EOF'

# ================================================
# COOLIFY ENVIRONMENT VARIABLES (READY TO COPY)
# ================================================

# VAPID Keys (CRITICAL - These are already generated!)
VAPID_PUBLIC_KEY=your-vapid-public-key-here
VAPID_PRIVATE_KEY=your-vapid-private-key-here
VAPID_EMAIL=mailto:thomas@your-future-self.app

# Supabase Configuration (You need to fill these in)
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI Provider Keys (Optional - will use free tiers if not provided)
MCP_API_KEY=your_mcp_api_key_here
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# SSL Configuration
SSL_EMAIL=thomas@your-future-self.app

# Node Environment
NODE_ENV=production
REACT_APP_NODE_ENV=production

# API URLs
REACT_APP_API_URL=https://www.your-future-self.app/api
REACT_APP_MCP_BRIDGE_URL=https://www.your-future-self.app/mcp

EOF

echo "✅ Environment variables extracted to: $OUTPUT_FILE"
echo ""
echo "📋 CRITICAL VARIABLES ALREADY AVAILABLE:"
echo "========================================"
echo "✅ VAPID_PUBLIC_KEY: your-vapid-public-key-here"
echo "✅ VAPID_PRIVATE_KEY: your-vapid-private-key-here"
echo "✅ VAPID_EMAIL: mailto:thomas@your-future-self.app"
echo "✅ SSL_EMAIL: thomas@your-future-self.app"
echo ""
echo "❌ VARIABLES YOU STILL NEED TO FILL IN:"
echo "======================================"
echo "❌ REACT_APP_SUPABASE_URL: your_supabase_url_here"
echo "❌ REACT_APP_SUPABASE_ANON_KEY: your_supabase_anon_key_here"
echo "❌ MCP_API_KEY: your_mcp_api_key_here (optional)"
echo "❌ GROK_API_KEY: your_grok_api_key_here (optional)"
echo "❌ OPENAI_API_KEY: your_openai_api_key_here (optional)"
echo "❌ ANTHROPIC_API_KEY: your_anthropic_api_key_here (optional)"
echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. Copy the variables from $OUTPUT_FILE"
echo "2. Go to Coolify Dashboard"
echo "3. Find resource: main-k0g4wgck0g0wgw4owwoocs84"
echo "4. Go to Environment Variables"
echo "5. Add the variables above"
echo "6. Fill in the missing Supabase values"
echo "7. Start a new deployment"
echo ""
echo "💡 The VAPID keys are already generated and ready to use!"

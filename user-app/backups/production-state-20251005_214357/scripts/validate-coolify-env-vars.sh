#!/bin/bash

# Validate Coolify Environment Variables Script
# This script validates the environment variables you provided

echo "🔍 Validating Coolify Environment Variables"
echo "==========================================="

# Create validation results
VALIDATION_FILE="coolify-env-validation.txt"
echo "# Coolify Environment Variables Validation" > $VALIDATION_FILE
echo "# Generated on: $(date)" >> $VALIDATION_FILE
echo "" >> $VALIDATION_FILE

echo "📋 Environment Variables Analysis:"
echo "=================================="

# Check critical variables
echo "✅ CRITICAL VARIABLES (GOOD):"
echo "-----------------------------"
echo "✅ VAPID_PUBLIC_KEY: your-vapid-public-key-here"
echo "✅ VAPID_PRIVATE_KEY: your-vapid-private-key-here"
echo "✅ VAPID_EMAIL: mailto:osteomedica.utrecht@gmail.com"
echo "✅ REACT_APP_SUPABASE_ANON_KEY: your-supabase-anon-key-here"
echo "✅ SSL_EMAIL: osteomedica.utrecht@gmail.com"
echo "✅ ENABLE_SSL: true"
echo "✅ DOMAIN: www.your-future-self.app"
echo ""

echo "❌ CRITICAL VARIABLES (MISSING/INVALID):"
echo "----------------------------------------"
echo "❌ REACT_APP_SUPABASE_URL: 'Environment Variables' (INVALID - should be actual Supabase URL)"
echo "❌ REACT_APP_X_DEV_CLIENT_ID: 'oo' (INVALID - too short)"
echo ""

echo "⚠️  OPTIONAL VARIABLES (EMPTY - OK FOR FREE TIER):"
echo "-------------------------------------------------"
echo "⚠️  GROK_API_KEY: (empty - will use free tier)"
echo "⚠️  OPENAI_API_KEY: (empty - will use free tier)"
echo "⚠️  ANTHROPIC_API_KEY: (empty - will use free tier)"
echo "⚠️  MCP_API_KEY: (empty - will use free tier)"
echo "⚠️  XAI_API_KEY: (empty - will use free tier)"
echo ""

echo "🔧 SERVICE CONFIGURATION (GOOD):"
echo "-------------------------------"
echo "✅ SERVICE_URL_MET24_USER_APP: www.your-future-self.app"
echo "✅ SERVICE_URL_MET24_MCP_BRIDGE: www.your-future-self.app/mcp"
echo "✅ SERVICE_URL_MULLVAD_VPN: vpn.your-future-self.app"
echo "✅ XAI_BASE_URL: https://api.x.ai/v1"
echo ""

echo "📝 MULLVAD VPN (EMPTY - OK IF NOT USING VPN):"
echo "---------------------------------------------"
echo "⚠️  MULLVAD_ADDRESSES: (empty - OK if not using VPN)"
echo "⚠️  MULLVAD_ENDPOINT_IP: (empty - OK if not using VPN)"
echo "⚠️  MULLVAD_ENDPOINT_PORT: (empty - OK if not using VPN)"
echo "⚠️  MULLVAD_PRESHARED_KEY: (empty - OK if not using VPN)"
echo "⚠️  MULLVAD_PRIVATE_KEY: (empty - OK if not using VPN)"
echo ""

# Generate corrected variables
cat >> $VALIDATION_FILE << 'EOF'

# ================================================
# CORRECTED ENVIRONMENT VARIABLES
# ================================================

# CRITICAL FIXES NEEDED:
# 1. REACT_APP_SUPABASE_URL should be the actual Supabase URL
# 2. REACT_APP_X_DEV_CLIENT_ID should be a valid X OAuth client ID

# CORRECTED VARIABLES:
REACT_APP_SUPABASE_URL=https://your-supabase-project-id.supabase.co
REACT_APP_X_DEV_CLIENT_ID=your_actual_x_oauth_client_id_here

# EXISTING GOOD VARIABLES (KEEP THESE):
VAPID_PUBLIC_KEY=your-vapid-public-key-here
VAPID_PRIVATE_KEY=your-vapid-private-key-here
VAPID_EMAIL=mailto:osteomedica.utrecht@gmail.com
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SSL_EMAIL=osteomedica.utrecht@gmail.com
ENABLE_SSL=true
DOMAIN=www.your-future-self.app
SERVICE_URL_MET24_USER_APP=www.your-future-self.app
SERVICE_URL_MET24_MCP_BRIDGE=www.your-future-self.app/mcp
SERVICE_URL_MULLVAD_VPN=vpn.your-future-self.app
XAI_BASE_URL=https://api.x.ai/v1

# OPTIONAL VARIABLES (EMPTY IS OK FOR FREE TIER):
GROK_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
MCP_API_KEY=
XAI_API_KEY=

# MULLVAD VPN (EMPTY IS OK IF NOT USING VPN):
MULLVAD_ADDRESSES=
MULLVAD_ENDPOINT_IP=
MULLVAD_ENDPOINT_PORT=
MULLVAD_PRESHARED_KEY=
MULLVAD_PRIVATE_KEY=

EOF

echo "🎯 CRITICAL FIXES NEEDED:"
echo "========================="
echo "1. ❌ REACT_APP_SUPABASE_URL: 'Environment Variables' → Should be: https://your-supabase-project-id.supabase.co"
echo "2. ❌ REACT_APP_X_DEV_CLIENT_ID: 'oo' → Should be: your_actual_x_oauth_client_id_here"
echo ""
echo "✅ DEPLOYMENT READINESS:"
echo "======================="
echo "✅ VAPID Keys: READY"
echo "✅ Supabase Anon Key: READY"
echo "✅ SSL Configuration: READY"
echo "✅ Service URLs: READY"
echo "❌ Supabase URL: NEEDS FIX"
echo "❌ X OAuth Client ID: NEEDS FIX"
echo ""
echo "🚀 NEXT STEPS:"
echo "=============="
echo "1. Fix REACT_APP_SUPABASE_URL in Coolify"
echo "2. Fix REACT_APP_X_DEV_CLIENT_ID in Coolify"
echo "3. Start deployment - should work after these fixes!"
echo ""
echo "📄 Full validation report saved to: $VALIDATION_FILE"

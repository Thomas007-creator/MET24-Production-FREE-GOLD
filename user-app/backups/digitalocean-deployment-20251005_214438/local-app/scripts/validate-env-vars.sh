#!/bin/bash

# Environment Variables Validation Script for Coolify Deployment
# This script helps validate that all required environment variables are set

echo "🔍 Validating Environment Variables for MET24 Production Deployment"
echo "=================================================================="

# Required environment variables
REQUIRED_VARS=(
    "REACT_APP_SUPABASE_URL"
    "REACT_APP_SUPABASE_ANON_KEY"
    "VAPID_PUBLIC_KEY"
    "VAPID_PRIVATE_KEY"
    "VAPID_EMAIL"
    "MCP_API_KEY"
    "GROK_API_KEY"
    "OPENAI_API_KEY"
    "ANTHROPIC_API_KEY"
    "SSL_EMAIL"
)

# Optional but recommended variables
OPTIONAL_VARS=(
    "NODE_ENV"
    "REACT_APP_NODE_ENV"
    "REACT_APP_API_URL"
    "REACT_APP_MCP_BRIDGE_URL"
)

echo ""
echo "📋 Checking Required Environment Variables:"
echo "-------------------------------------------"

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ $var - MISSING"
        MISSING_VARS+=("$var")
    else
        echo "✅ $var - SET"
    fi
done

echo ""
echo "📋 Checking Optional Environment Variables:"
echo "-------------------------------------------"

for var in "${OPTIONAL_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "⚠️  $var - NOT SET (optional)"
    else
        echo "✅ $var - SET"
    fi
done

echo ""
echo "📊 Summary:"
echo "-----------"

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "🎉 All required environment variables are set!"
    echo "✅ Ready for deployment"
    exit 0
else
    echo "❌ Missing ${#MISSING_VARS[@]} required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "🔧 Please set these variables in Coolify before deploying:"
    echo "   1. Go to Coolify Dashboard"
    echo "   2. Find resource: main-k0g4wgck0g0wgw4owwoocs84"
    echo "   3. Go to Environment Variables"
    echo "   4. Add the missing variables above"
    echo ""
    echo "📝 Use the env-template.txt file as reference for values"
    exit 1
fi

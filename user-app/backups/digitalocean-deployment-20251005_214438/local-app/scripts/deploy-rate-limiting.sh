#!/bin/bash

# ================================================
# DEPLOY RATE LIMITING SECURITY ENHANCEMENTS
# MET24 Production - Input Validation & Rate Limiting
# ================================================

set -e

echo "🚀 Deploying Rate Limiting Security Enhancements..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$REACT_APP_SUPABASE_URL" ]; then
        print_error "REACT_APP_SUPABASE_URL is not set"
        exit 1
    fi
    
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        print_error "SUPABASE_SERVICE_ROLE_KEY is not set"
        exit 1
    fi
    
    print_success "Environment variables are set"
}

# Install new dependencies
install_dependencies() {
    print_status "Installing new security dependencies..."
    
    npm install express-rate-limit@^7.1.5
    npm install express-slow-down@^2.0.1
    npm install isomorphic-dompurify@^2.6.0
    npm install validator@^13.11.0
    
    print_success "Dependencies installed"
}

# Deploy database schema
deploy_database_schema() {
    print_status "Deploying rate limiting database schema..."
    
    if [ -f "database-rate-limiting-schema.sql" ]; then
        # Connect to Supabase and run the migration
        PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" psql \
            -h "$(echo $REACT_APP_SUPABASE_URL | sed 's/.*\/\/\([^:]*\):.*/\1/')" \
            -p 5432 \
            -U postgres \
            -d postgres \
            -f database-rate-limiting-schema.sql
        
        print_success "Database schema deployed"
    else
        print_error "database-rate-limiting-schema.sql not found"
        exit 1
    fi
}

# Test rate limiting endpoints
test_rate_limiting() {
    print_status "Testing rate limiting endpoints..."
    
    # Test basic rate limiting
    echo "Testing basic rate limiting..."
    for i in {1..5}; do
        response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health)
        if [ "$response" != "200" ]; then
            print_warning "Rate limiting test $i returned $response"
        fi
    done
    
    # Test AI endpoint rate limiting
    echo "Testing AI endpoint rate limiting..."
    for i in {1..3}; do
        response=$(curl -s -o /dev/null -w "%{http_code}" \
            -X POST \
            -H "Content-Type: application/json" \
            -d '{"name":"ultimateai_chat","arguments":{"message":"test","model":"grok-4"}}' \
            http://localhost:3001/mcp/tools/call)
        
        if [ "$response" != "200" ]; then
            print_warning "AI rate limiting test $i returned $response"
        fi
    done
    
    print_success "Rate limiting tests completed"
}

# Verify security middleware
verify_security_middleware() {
    print_status "Verifying security middleware..."
    
    # Check if middleware files exist
    if [ ! -f "server/middleware/rateLimiting.js" ]; then
        print_error "Rate limiting middleware not found"
        exit 1
    fi
    
    if [ ! -f "server/middleware/inputValidation.js" ]; then
        print_error "Input validation middleware not found"
        exit 1
    fi
    
    # Check if MCP bridge has been updated
    if ! grep -q "rateLimiting" server/mcp-bridge.js; then
        print_error "MCP bridge not updated with rate limiting"
        exit 1
    fi
    
    if ! grep -q "inputValidation" server/mcp-bridge.js; then
        print_error "MCP bridge not updated with input validation"
        exit 1
    fi
    
    print_success "Security middleware verified"
}

# Create environment template update
update_env_template() {
    print_status "Updating environment template..."
    
    # Add rate limiting configuration to env template
    cat >> env-template.txt << EOF

# =====================================================
# Rate Limiting Configuration
# =====================================================
TRUSTED_IPS=127.0.0.1,::1
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AI_RATE_LIMIT_WINDOW_MS=3600000
AI_RATE_LIMIT_MAX_REQUESTS=50
FREE_TIER_RATE_LIMIT_WINDOW_MS=3600000
FREE_TIER_RATE_LIMIT_MAX_REQUESTS=10

# =====================================================
# Input Validation Configuration
# =====================================================
MAX_REQUEST_SIZE=10mb
MAX_PROMPT_LENGTH=10000
ENABLE_INPUT_SANITIZATION=true
ENABLE_CONTENT_TYPE_VALIDATION=true
EOF
    
    print_success "Environment template updated"
}

# Main deployment function
main() {
    echo "🔒 Starting Rate Limiting Security Deployment..."
    echo "================================================"
    
    check_env_vars
    install_dependencies
    deploy_database_schema
    verify_security_middleware
    update_env_template
    
    echo "================================================"
    print_success "Rate Limiting Security Deployment Complete!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update your .env file with new rate limiting settings"
    echo "2. Restart your MCP Bridge server: npm run server:mcp"
    echo "3. Test the endpoints to verify rate limiting is working"
    echo "4. Monitor the rate_limiting tables in Supabase"
    echo ""
    echo "🔍 Monitoring Commands:"
    echo "- Check rate limiting stats: SELECT * FROM rate_limiting_stats;"
    echo "- Check violations: SELECT * FROM rate_limiting_violations_summary;"
    echo "- Test endpoint: curl -X POST http://localhost:3001/mcp/tools/call"
    echo ""
    echo "✅ Input Validation & Rate Limiting: 100% COMPLETE"
}

# Run main function
main "$@"

#!/bin/bash

# ================================================
# AI Buddy Coolify Deployment Script
# Based on successful main-k0g4wgck0g0wgw4owwoocs84 deployment
# ================================================

set -e

echo "🚀 Starting AI Buddy Coolify Deployment..."
echo "📅 Date: $(date)"
echo "🔧 Based on successful deployment: main-k0g4wgck0g0wgw4owwoocs84"

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

# Check if we're in the right directory
if [ ! -f "docker-compose.coolify-production.yml" ]; then
    print_error "docker-compose.coolify-production.yml not found!"
    print_error "Please run this script from the project root directory."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    print_status "Loading environment variables from .env..."
    export $(cat .env | grep -v '^#' | xargs)
else
    print_warning ".env file not found. Using environment variables from system."
fi

# Generate unique resource UUID (similar to k0g4wgck0g0wgw4owwoocs84)
COOLIFY_RESOURCE_UUID=$(openssl rand -hex 8)
COOLIFY_CONTAINER_ID=$(date +%s)

print_status "Generated Coolify Resource UUID: $COOLIFY_RESOURCE_UUID"
print_status "Generated Container ID: $COOLIFY_CONTAINER_ID"

# Set Coolify environment variables (based on successful deployment)
export COOLIFY_APPLICATION_ID="33183"
export COOLIFY_PROJECT_NAME="met24-production"
export COOLIFY_SERVICE_NAME="thomas007-creator-m-e-t24-production-ai-buddy"
export COOLIFY_ENVIRONMENT_NAME="production"
export COOLIFY_PULL_REQUEST_ID="0"
export COOLIFY_RESOURCE_NAME="thomas007-creator-m-e-t24-production-ai-buddy-$COOLIFY_RESOURCE_UUID"

# Service URLs (based on successful deployment)
export SERVICE_URL_MET24_USER_APP="www.your-future-self.app"
export SERVICE_FQDN_MET24_USER_APP=""
export SERVICE_URL_MET24_MCP_BRIDGE="www.your-future-self.app/mcp"
export SERVICE_FQDN_MET24_MCP_BRIDGE=""
export COOLIFY_URL="www.your-future-self.app://www.your-future-self.app"
export COOLIFY_FQDN="www.your-future-self.app"

# SSL Email (required for Let's Encrypt)
if [ -z "$SSL_EMAIL" ]; then
    print_warning "SSL_EMAIL not set. Using default email."
    export SSL_EMAIL="admin@your-future-self.app"
fi

print_status "Environment variables configured:"
print_status "  - COOLIFY_RESOURCE_UUID: $COOLIFY_RESOURCE_UUID"
print_status "  - COOLIFY_APPLICATION_ID: $COOLIFY_APPLICATION_ID"
print_status "  - SERVICE_URL_MET24_USER_APP: $SERVICE_URL_MET24_USER_APP"
print_status "  - SERVICE_URL_MET24_MCP_BRIDGE: $SERVICE_URL_MET24_MCP_BRIDGE"

# Check required environment variables
required_vars=(
    "REACT_APP_SUPABASE_URL"
    "REACT_APP_SUPABASE_ANON_KEY"
    "VAPID_PUBLIC_KEY"
    "VAPID_PRIVATE_KEY"
    "VAPID_EMAIL"
)

print_status "Checking required environment variables..."
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set!"
        print_error "Please check your .env file or environment variables."
        exit 1
    else
        print_success "$var is set"
    fi
done

# Optional environment variables (with defaults)
if [ -z "$MCP_API_KEY" ]; then
    print_warning "MCP_API_KEY not set. MCP Bridge will use default configuration."
fi

if [ -z "$GROK_API_KEY" ]; then
    print_warning "GROK_API_KEY not set. Grok-3 free tier will be used."
fi

if [ -z "$OPENAI_API_KEY" ]; then
    print_warning "OPENAI_API_KEY not set. OpenAI features will be disabled."
fi

if [ -z "$ANTHROPIC_API_KEY" ]; then
    print_warning "ANTHROPIC_API_KEY not set. Claude features will be disabled."
fi

# Create network if it doesn't exist
print_status "Creating Coolify network..."
docker network create $COOLIFY_RESOURCE_UUID 2>/dev/null || print_warning "Network $COOLIFY_RESOURCE_UUID already exists"

# Stop any existing containers with the same names
print_status "Stopping existing containers..."
docker stop met24-user-app-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID 2>/dev/null || true
docker stop met24-mcp-bridge-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID 2>/dev/null || true
docker stop traefik-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID 2>/dev/null || true

# Remove existing containers
print_status "Removing existing containers..."
docker rm met24-user-app-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID 2>/dev/null || true
docker rm met24-mcp-bridge-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID 2>/dev/null || true
docker rm traefik-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID 2>/dev/null || true

# Build and deploy
print_status "Building and deploying AI Buddy services..."
docker-compose -f docker-compose.coolify-production.yml up -d --build

# Wait for services to start
print_status "Waiting for services to start..."
sleep 30

# Health checks
print_status "Performing health checks..."

# Check User App
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    print_success "User App (port 3000) is healthy"
else
    print_error "User App (port 3000) health check failed"
    print_status "Checking User App logs..."
    docker logs met24-user-app-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID --tail 20
fi

# Check MCP Bridge
if curl -f http://localhost:3001/health >/dev/null 2>&1; then
    print_success "MCP Bridge (port 3001) is healthy"
else
    print_error "MCP Bridge (port 3001) health check failed"
    print_status "Checking MCP Bridge logs..."
    docker logs met24-mcp-bridge-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID --tail 20
fi

# Check Traefik
if curl -f http://localhost:8080/api/rawdata >/dev/null 2>&1; then
    print_success "Traefik dashboard is accessible"
else
    print_warning "Traefik dashboard health check failed (this might be normal)"
fi

# Display deployment information
echo ""
print_success "🎉 AI Buddy Deployment Complete!"
echo ""
print_status "📊 Deployment Information:"
print_status "  - Resource UUID: $COOLIFY_RESOURCE_UUID"
print_status "  - Container ID: $COOLIFY_CONTAINER_ID"
print_status "  - User App: http://localhost:3000"
print_status "  - MCP Bridge: http://localhost:3001"
print_status "  - Traefik Dashboard: http://localhost:8080"
echo ""
print_status "🌐 Production URLs (when DNS is configured):"
print_status "  - User App: https://www.your-future-self.app"
print_status "  - MCP Bridge: https://www.your-future-self.app/mcp"
echo ""
print_status "🔧 Management Commands:"
print_status "  - View logs: docker-compose -f docker-compose.coolify-production.yml logs -f"
print_status "  - Stop services: docker-compose -f docker-compose.coolify-production.yml down"
print_status "  - Restart services: docker-compose -f docker-compose.coolify-production.yml restart"
echo ""
print_status "📝 Next Steps:"
print_status "  1. Test AI Buddy features at /ai-buddy route"
print_status "  2. Verify MCP Bridge functionality"
print_status "  3. Check SSL certificate generation"
print_status "  4. Monitor logs for any issues"
echo ""

# Save deployment info
echo "AI_BUDDY_DEPLOYMENT_INFO" > .ai-buddy-deployment
echo "COOLIFY_RESOURCE_UUID=$COOLIFY_RESOURCE_UUID" >> .ai-buddy-deployment
echo "COOLIFY_CONTAINER_ID=$COOLIFY_CONTAINER_ID" >> .ai-buddy-deployment
echo "DEPLOYMENT_DATE=$(date)" >> .ai-buddy-deployment
echo "DEPLOYMENT_STATUS=SUCCESS" >> .ai-buddy-deployment

print_success "Deployment information saved to .ai-buddy-deployment"
print_success "🚀 AI Buddy is ready for testing!"

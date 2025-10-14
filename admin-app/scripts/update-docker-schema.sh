#!/bin/bash

# =====================================================
# MET2.4 Docker Schema Update Script
# Updates Docker containers with new V14 Safe Cast Schema
# =====================================================

set -e

echo "🚀 MET2.4 Docker Schema Update Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# VPN Validation
print_status "Validating VPN connection before starting containers..."
if ! ./scripts/vpn-validator.sh validate; then
    print_error "VPN validation failed. Script stopped for security."
    print_warning "Please connect to your VPN and try again."
    exit 1
fi
print_success "VPN validation passed. Proceeding with container startup."
echo ""

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if the new schema file exists
if [ ! -f "MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql" ]; then
    print_error "New schema file not found: MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql"
    exit 1
fi

print_status "New schema file found: MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql"

# Stop existing containers
print_status "Stopping existing MET2.4 containers..."
docker-compose down --remove-orphans

# Remove old database volume to ensure clean schema
print_warning "Removing old database volume to ensure clean schema..."
docker volume rm met24_db_data 2>/dev/null || true
docker volume rm met24_prod_db_data 2>/dev/null || true

# Build and start containers with new schema
print_status "Building and starting containers with new schema..."

# Start database first
print_status "Starting database with new schema..."
docker-compose --profile database up -d met24-db

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check database health
print_status "Checking database health..."
if docker-compose exec met24-db pg_isready -U met24user -d met24_mbti_coach; then
    print_success "Database is ready!"
else
    print_error "Database failed to start properly"
    exit 1
fi

# Start development environment
print_status "Starting development environment..."
docker-compose --profile dev up -d met24-dev

# Start MCP bridge
print_status "Starting MCP bridge..."
docker-compose --profile mcp up -d met24-mcp-bridge

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Check service health
print_status "Checking service health..."

# Check development app
if curl -f http://localhost:3002/health > /dev/null 2>&1; then
    print_success "Development app is running on http://localhost:3002"
else
    print_warning "Development app health check failed"
fi

# Check MCP bridge
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_success "MCP bridge is running on http://localhost:3001"
else
    print_warning "MCP bridge health check failed"
fi

# Check database connection
if docker-compose exec met24-db psql -U met24user -d met24_mbti_coach -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Verify schema was applied
print_status "Verifying new schema was applied..."
SCHEMA_CHECK=$(docker-compose exec -T met24-db psql -U met24user -d met24_mbti_coach -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('content','mbti_ai','met24','users','other','onboarding','chat_journal','analytics','subscriptions','sync_status','settings');" -t)

if [ "$SCHEMA_CHECK" -gt 50 ]; then
    print_success "Schema verification successful: $SCHEMA_CHECK tables found"
else
    print_warning "Schema verification: Only $SCHEMA_CHECK tables found (expected >50)"
fi

# Check extensions
print_status "Checking extensions..."
docker-compose exec -T met24-db psql -U met24user -d met24_mbti_coach -c "SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto','vector','pgvector');"

print_success "Docker schema update completed!"
echo ""
echo "🌐 Services available:"
echo "  - Development App: http://localhost:3002"
echo "  - MCP Bridge: http://localhost:3001"
echo "  - Database: localhost:5434"
echo ""
echo "📋 Next steps:"
echo "  1. Test the application functionality"
echo "  2. Verify RLS policies are working"
echo "  3. Check sync functionality"
echo "  4. Run your test suite"
echo ""
echo "🔧 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop all: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Database shell: docker-compose exec met24-db psql -U met24user -d met24_mbti_coach"

# =====================================================
# MET2.4 Docker Schema Update Script
# Updates Docker containers with new V14 Safe Cast Schema
# =====================================================

set -e

echo "🚀 MET2.4 Docker Schema Update Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# VPN Validation
print_status "Validating VPN connection before starting containers..."
if ! ./scripts/vpn-validator.sh validate; then
    print_error "VPN validation failed. Script stopped for security."
    print_warning "Please connect to your VPN and try again."
    exit 1
fi
print_success "VPN validation passed. Proceeding with container startup."
echo ""

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if the new schema file exists
if [ ! -f "MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql" ]; then
    print_error "New schema file not found: MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql"
    exit 1
fi

print_status "New schema file found: MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql"

# Stop existing containers
print_status "Stopping existing MET2.4 containers..."
docker-compose down --remove-orphans

# Remove old database volume to ensure clean schema
print_warning "Removing old database volume to ensure clean schema..."
docker volume rm met24_db_data 2>/dev/null || true
docker volume rm met24_prod_db_data 2>/dev/null || true

# Build and start containers with new schema
print_status "Building and starting containers with new schema..."

# Start database first
print_status "Starting database with new schema..."
docker-compose --profile database up -d met24-db

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check database health
print_status "Checking database health..."
if docker-compose exec met24-db pg_isready -U met24user -d met24_mbti_coach; then
    print_success "Database is ready!"
else
    print_error "Database failed to start properly"
    exit 1
fi

# Start development environment
print_status "Starting development environment..."
docker-compose --profile dev up -d met24-dev

# Start MCP bridge
print_status "Starting MCP bridge..."
docker-compose --profile mcp up -d met24-mcp-bridge

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Check service health
print_status "Checking service health..."

# Check development app
if curl -f http://localhost:3002/health > /dev/null 2>&1; then
    print_success "Development app is running on http://localhost:3002"
else
    print_warning "Development app health check failed"
fi

# Check MCP bridge
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_success "MCP bridge is running on http://localhost:3001"
else
    print_warning "MCP bridge health check failed"
fi

# Check database connection
if docker-compose exec met24-db psql -U met24user -d met24_mbti_coach -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Verify schema was applied
print_status "Verifying new schema was applied..."
SCHEMA_CHECK=$(docker-compose exec -T met24-db psql -U met24user -d met24_mbti_coach -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('content','mbti_ai','met24','users','other','onboarding','chat_journal','analytics','subscriptions','sync_status','settings');" -t)

if [ "$SCHEMA_CHECK" -gt 50 ]; then
    print_success "Schema verification successful: $SCHEMA_CHECK tables found"
else
    print_warning "Schema verification: Only $SCHEMA_CHECK tables found (expected >50)"
fi

# Check extensions
print_status "Checking extensions..."
docker-compose exec -T met24-db psql -U met24user -d met24_mbti_coach -c "SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto','vector','pgvector');"

print_success "Docker schema update completed!"
echo ""
echo "🌐 Services available:"
echo "  - Development App: http://localhost:3002"
echo "  - MCP Bridge: http://localhost:3001"
echo "  - Database: localhost:5434"
echo ""
echo "📋 Next steps:"
echo "  1. Test the application functionality"
echo "  2. Verify RLS policies are working"
echo "  3. Check sync functionality"
echo "  4. Run your test suite"
echo ""
echo "🔧 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop all: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Database shell: docker-compose exec met24-db psql -U met24user -d met24_mbti_coach"

# =====================================================
# MET2.4 Docker Schema Update Script
# Updates Docker containers with new V14 Safe Cast Schema
# =====================================================

set -e

echo "🚀 MET2.4 Docker Schema Update Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# VPN Validation
print_status "Validating VPN connection before starting containers..."
if ! ./scripts/vpn-validator.sh validate; then
    print_error "VPN validation failed. Script stopped for security."
    print_warning "Please connect to your VPN and try again."
    exit 1
fi
print_success "VPN validation passed. Proceeding with container startup."
echo ""

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if the new schema file exists
if [ ! -f "MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql" ]; then
    print_error "New schema file not found: MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql"
    exit 1
fi

print_status "New schema file found: MET24_SUPABASE_V14_SAFE_CAST_FULL_FIXED.sql"

# Stop existing containers
print_status "Stopping existing MET2.4 containers..."
docker-compose down --remove-orphans

# Remove old database volume to ensure clean schema
print_warning "Removing old database volume to ensure clean schema..."
docker volume rm met24_db_data 2>/dev/null || true
docker volume rm met24_prod_db_data 2>/dev/null || true

# Build and start containers with new schema
print_status "Building and starting containers with new schema..."

# Start database first
print_status "Starting database with new schema..."
docker-compose --profile database up -d met24-db

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check database health
print_status "Checking database health..."
if docker-compose exec met24-db pg_isready -U met24user -d met24_mbti_coach; then
    print_success "Database is ready!"
else
    print_error "Database failed to start properly"
    exit 1
fi

# Start development environment
print_status "Starting development environment..."
docker-compose --profile dev up -d met24-dev

# Start MCP bridge
print_status "Starting MCP bridge..."
docker-compose --profile mcp up -d met24-mcp-bridge

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 15

# Check service health
print_status "Checking service health..."

# Check development app
if curl -f http://localhost:3002/health > /dev/null 2>&1; then
    print_success "Development app is running on http://localhost:3002"
else
    print_warning "Development app health check failed"
fi

# Check MCP bridge
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    print_success "MCP bridge is running on http://localhost:3001"
else
    print_warning "MCP bridge health check failed"
fi

# Check database connection
if docker-compose exec met24-db psql -U met24user -d met24_mbti_coach -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Verify schema was applied
print_status "Verifying new schema was applied..."
SCHEMA_CHECK=$(docker-compose exec -T met24-db psql -U met24user -d met24_mbti_coach -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema IN ('content','mbti_ai','met24','users','other','onboarding','chat_journal','analytics','subscriptions','sync_status','settings');" -t)

if [ "$SCHEMA_CHECK" -gt 50 ]; then
    print_success "Schema verification successful: $SCHEMA_CHECK tables found"
else
    print_warning "Schema verification: Only $SCHEMA_CHECK tables found (expected >50)"
fi

# Check extensions
print_status "Checking extensions..."
docker-compose exec -T met24-db psql -U met24user -d met24_mbti_coach -c "SELECT extname FROM pg_extension WHERE extname IN ('pgcrypto','vector','pgvector');"

print_success "Docker schema update completed!"
echo ""
echo "🌐 Services available:"
echo "  - Development App: http://localhost:3002"
echo "  - MCP Bridge: http://localhost:3001"
echo "  - Database: localhost:5434"
echo ""
echo "📋 Next steps:"
echo "  1. Test the application functionality"
echo "  2. Verify RLS policies are working"
echo "  3. Check sync functionality"
echo "  4. Run your test suite"
echo ""
echo "🔧 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop all: docker-compose down"
echo "  - Restart: docker-compose restart"
echo "  - Database shell: docker-compose exec met24-db psql -U met24user -d met24_mbti_coach"





#!/bin/bash

# =====================================================
# MET2.4 Mini-MCP Orchestrator Startup Script
# For DigitalOcean Containerized Environment
# =====================================================

echo "🚀 Starting MET2.4 Mini-MCP Orchestrator..."

# Check if we're in a Docker environment
if [ -f /.dockerenv ]; then
    echo "🐳 Running in Docker container"
    export DOCKER_ENV=true
else
    echo "💻 Running in local environment"
fi

# Set environment variables for containerized setup
export NODE_ENV=development
export REDIS_URL=${REDIS_URL:-redis://met24-redis:6379}
export REDIS_CONNECTION_STRING=${REDIS_CONNECTION_STRING:-redis://met24-redis:6379}
export DATABASE_URL=${DATABASE_URL:-postgresql://met24user:met24password@met24-db:5432/met24_mbti_coach}

echo "🔗 Redis URL: $REDIS_URL"
echo "🗄️ Database URL: ${DATABASE_URL/\/\/.*@/\/\/***@}"

# Start the Mini-MCP Orchestrator
echo "🎯 Starting Mini-MCP Orchestrator..."
node server/mini-mcp/orchestrator.js

echo "✅ Mini-MCP Orchestrator startup completed"
















#!/bin/bash

# ========================================
# MET2.4 NO-REDIS START SCRIPT
# Start alle services zonder Redis
# ========================================

echo "🚀 Starting MET2.4 App (No Redis Version)..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node.*3000" 2>/dev/null || true
pkill -f "node.*3001" 2>/dev/null || true
pkill -f "node.*3002" 2>/dev/null || true

# Wait for cleanup
sleep 2

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start User App (localhost:3000)
echo "📱 Starting User App on port 3000..."
DISABLE_ESLINT_PLUGIN=true PORT=3000 npm start &
USER_APP_PID=$!

# Wait for User App to start
sleep 5

# Start Mini-MCP (localhost:3001)
echo "🔗 Starting Mini-MCP on port 3001..."
PORT=3001 node server/index.js &
MCP_PID=$!

# Wait for Mini-MCP to start
sleep 3

# Start Development App (localhost:3002) - Optional
echo "🛠️  Starting Development App on port 3002..."
DISABLE_ESLINT_PLUGIN=true PORT=3002 npm start &
DEV_APP_PID=$!

# Wait for all services to start
sleep 5

echo "✅ All services started!"
echo "📱 User App: http://localhost:3000"
echo "🔗 Mini-MCP: http://localhost:3001"
echo "🛠️  Development App: http://localhost:3002"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $USER_APP_PID 2>/dev/null || true
    kill $MCP_PID 2>/dev/null || true
    kill $DEV_APP_PID 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Keep script running
echo "Press Ctrl+C to stop all services"
wait

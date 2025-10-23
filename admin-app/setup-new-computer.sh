#!/bin/bash

# ========================================
# MET2.4 SETUP SCRIPT FOR NEW COMPUTER
# Complete setup voor nieuwe computer
# ========================================

echo "🚀 Setting up MET2.4 AI Persoonlijkheidscoach on new computer..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Recommended version: Node.js 18 or higher"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Recommended: 18 or higher"
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ .env created from env.example"
        echo "📝 Please edit .env file with your configuration"
    else
        echo "❌ env.example not found!"
        exit 1
    fi
fi

# Make start script executable
chmod +x start-app.sh

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your configuration (if needed)"
echo "2. Run: ./start-app.sh"
echo ""
echo "📱 Services will be available at:"
echo "   - User App: http://localhost:3000"
echo "   - Mini-MCP: http://localhost:3001"
echo "   - Development App: http://localhost:3002"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Quick start guide"
echo "   - BACKUP_REPORT.md - Complete documentation"
echo "   - CHANGES_LOG.md - Changes log"
echo ""
echo "🚀 Ready to start! Run: ./start-app.sh"

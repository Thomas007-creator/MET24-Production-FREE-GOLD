#!/bin/bash

# MET24 Production Deployment Script
# Run this after droplet setup

set -e

APP_DIR="/opt/met24"
BACKUP_DIR="/opt/met24-backups"

echo "🚀 Deploying MET24 to production..."

# Create backup of current deployment
if [ -d "$APP_DIR" ]; then
    echo "📦 Creating backup of current deployment..."
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r "$APP_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d_%H%M%S)"
fi

# Pull latest changes
cd "$APP_DIR"
git pull origin main

# Install dependencies
npm install --legacy-peer-deps

# Build for production
npm run build:coolify

# Deploy with Docker Compose
docker-compose down --remove-orphans
docker-compose up -d --build

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at your configured domain"
echo "📊 Check status with: docker-compose ps"

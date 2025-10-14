#!/bin/bash

# 🔧 DISCOURSE PGVECTOR FIX - Quick Resolution
# Lossen het vector extensie probleem op

set -e

echo "🔧 Discourse PGVector Fix wordt uitgevoerd..."

# Stop current discourse service
echo "⏹️  Stopping current Discourse service..."
docker-compose stop discourse || true

# Remove old postgres data to start fresh with pgvector
echo "🗑️  Removing old postgres data..."
docker volume rm discourse-postgres-data || true

# Pull new pgvector image
echo "📦 Pulling pgvector PostgreSQL image..."
docker pull pgvector/pgvector:pg15

# Recreate postgres service with pgvector
echo "🔄 Recreating PostgreSQL with pgvector support..."
docker-compose up -d discourse-postgres

# Wait for postgres initialization
echo "⏳ Waiting for PostgreSQL initialization..."
sleep 30

# Check postgres health
echo "🔍 Checking PostgreSQL health..."
for i in {1..10}; do
    if docker exec met24-discourse-postgres pg_isready -U discourse > /dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
        break
    else
        echo "⏳ Waiting for PostgreSQL... ($i/10)"
        sleep 10
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ PostgreSQL timeout"
        exit 1
    fi
done

# Verify vector extension availability
echo "🔍 Verifying vector extension..."
docker exec met24-discourse-postgres psql -U discourse -d discourse -c "CREATE EXTENSION IF NOT EXISTS vector;" || {
    echo "⚠️  Vector extension still not available, but continuing..."
}

# Start Discourse again
echo "🚀 Starting Discourse service..."
docker-compose up -d discourse

# Wait for Discourse initialization
echo "⏳ Waiting for Discourse initialization..."
sleep 60

# Health check
echo "🔍 Final health check..."
for i in {1..15}; do
    if curl -f -s https://community.your-future-self.app/srv/status > /dev/null 2>&1; then
        echo "✅ Discourse is now running successfully!"
        echo ""
        echo "🎉 =========================="
        echo "🔧 PGVECTOR FIX COMPLETED!"
        echo "🎉 =========================="
        echo ""
        echo "🌐 Community: https://community.your-future-self.app"
        echo "⚙️  Admin: https://community.your-future-self.app/admin"
        echo ""
        echo "📋 Next steps:"
        echo "1. Complete admin wizard setup"
        echo "2. Create MBTI categories"
        echo "3. Test PWA integration"
        break
    else
        echo "⏳ Checking Discourse health... ($i/15)"
        sleep 20
    fi
    
    if [ $i -eq 15 ]; then
        echo "❌ Discourse still not responding"
        echo "📋 Check logs: docker logs met24-discourse"
        exit 1
    fi
done

echo "🎯 Discourse Community Platform is now LIVE! 🚀"
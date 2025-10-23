#!/bin/bash

# 🚀 DISCOURSE COMMUNITY SETUP SCRIPT
# Automated deployment van MET24 Discourse Community Platform

set -e

echo "🌐 MET24 Discourse Community Setup wordt gestart..."

# Environment check
if [ -z "$DISCOURSE_SSO_SECRET" ]; then
    echo "⚠️  DISCOURSE_SSO_SECRET environment variable niet gevonden"
    echo "📋 Voeg deze toe in Coolify environment variables:"
    echo "   DISCOURSE_SSO_SECRET=met24_discourse_sso_secret_2024_secure_token"
    exit 1
fi

echo "✅ Environment variables controleren..."

# Check DNS record
echo "🔍 DNS check voor community.your-future-self.app..."
if nslookup community.your-future-self.app > /dev/null 2>&1; then
    echo "✅ DNS record gevonden voor community.your-future-self.app"
else
    echo "❌ DNS record niet gevonden!"
    echo "📋 Voeg A record toe: community -> 165.227.136.245"
    exit 1
fi

# Docker Compose check
echo "🐳 Docker Compose configuratie controleren..."
if [ -f "docker-compose.yml" ]; then
    if grep -q "discourse:" docker-compose.yml; then
        echo "✅ Discourse service gevonden in docker-compose.yml"
    else
        echo "❌ Discourse service niet gevonden in docker-compose.yml"
        exit 1
    fi
else
    echo "❌ docker-compose.yml niet gevonden"
    exit 1
fi

# Pull Discourse images
echo "📦 Discourse Docker images downloaden..."
docker pull discourse/discourse:stable
docker pull postgres:15-alpine
docker pull redis:7-alpine

# Create volumes
echo "💾 Docker volumes aanmaken..."
docker volume create discourse-data || true
docker volume create discourse-postgres-data || true
docker volume create discourse-redis-data || true

# Start services
echo "🚀 Discourse services starten..."
docker-compose up -d discourse-postgres discourse-redis

# Wait for database
echo "⏳ Wachten op database initialisatie..."
sleep 30

# Start Discourse
echo "🌐 Discourse platform starten..."
docker-compose up -d discourse

# Wait for Discourse initialization
echo "⏳ Wachten op Discourse initialisatie (dit kan 2-3 minuten duren)..."
sleep 120

# Health check
echo "🔍 Health check uitvoeren..."
for i in {1..10}; do
    if curl -f -s https://community.your-future-self.app/srv/status > /dev/null; then
        echo "✅ Discourse is succesvol gestart!"
        break
    else
        echo "⏳ Poging $i/10 - Discourse nog niet klaar..."
        sleep 30
    fi
    
    if [ $i -eq 10 ]; then
        echo "❌ Discourse start timeout"
        echo "📋 Check logs: docker logs met24-discourse"
        exit 1
    fi
done

# Setup admin user (via API call later)
echo "👤 Admin gebruiker configuratie..."
echo "📋 Ga naar https://community.your-future-self.app/admin/wizard"
echo "📧 Gebruik: $DISCOURSE_ADMIN_EMAIL als admin email"

# Create MBTI categories
echo "🎯 MBTI categorieën voorbereiden..."
cat > discourse-categories.json << EOF
{
  "categories": [
    {
      "name": "INTJ Strategists",
      "slug": "intj-strategists", 
      "color": "3F51B5",
      "description": "Voor visionairs en strategische planners"
    },
    {
      "name": "ENFP Champions",
      "slug": "enfp-champions",
      "color": "E91E63", 
      "description": "Voor enthousiaste inspireerders"
    },
    {
      "name": "ISFJ Protectors", 
      "slug": "isfj-protectors",
      "color": "4CAF50",
      "description": "Voor zorgzame supporters"
    },
    {
      "name": "ESTP Entrepreneurs",
      "slug": "estp-entrepreneurs", 
      "color": "FF9800",
      "description": "Voor energieke doeners"
    },
    {
      "name": "General Chat",
      "slug": "general-chat",
      "color": "9C27B0",
      "description": "Open discussies voor iedereen"
    },
    {
      "name": "Coaching Support", 
      "slug": "coaching-support",
      "color": "2196F3",
      "description": "Hulp en advies van de community"
    },
    {
      "name": "Success Stories",
      "slug": "success-stories", 
      "color": "4CAF50",
      "description": "Deel je inspirerende verhalen"
    },
    {
      "name": "Daily Challenges",
      "slug": "daily-challenges",
      "color": "FF5722", 
      "description": "Samen groeien met dagelijkse uitdagingen"
    },
    {
      "name": "Holistic Wellness",
      "slug": "holistic-wellness",
      "color": "009688",
      "description": "Gezondheid en balans delen"
    },
    {
      "name": "AI Insights",
      "slug": "ai-insights", 
      "color": "607D8B",
      "description": "Leer van AI coaching ervaringen"
    }
  ]
}
EOF

echo "📋 Categorieën configuratie opgeslagen in discourse-categories.json"

# Success message
echo ""
echo "🎉 =========================="
echo "🚀 DISCOURSE SETUP COMPLEET!"
echo "🎉 =========================="
echo ""
echo "🌐 Community Platform: https://community.your-future-self.app"
echo "⚙️  Admin Panel: https://community.your-future-self.app/admin"
echo ""
echo "📋 VOLGENDE STAPPEN:"
echo "1. Ga naar de admin wizard en voltooi de setup"
echo "2. Import discourse-categories.json voor MBTI categorieën"
echo "3. Configure SSO settings voor MET24 integratie"
echo "4. Test de directe connectie vanuit de PWA"
echo ""
echo "🔗 PWA knoppen wijzen nu automatisch naar:"
echo "   💬 Chat → https://community.your-future-self.app/c/intj-strategists"
echo "   👥 Communities → https://community.your-future-self.app/categories"
echo "   🎯 Challenges → https://community.your-future-self.app/c/daily-challenges"
echo ""
echo "🎯 Community is LIVE! Happy connecting! 🚀"
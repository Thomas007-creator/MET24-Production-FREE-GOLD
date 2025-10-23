#!/bin/bash

# DigitalOcean Server Backup Script for MET24
# Backs up both local state and server configuration

set -e

BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/digitalocean-deployment-$BACKUP_DATE"

echo "🌊 DigitalOcean MET24 Backup Pipeline - $BACKUP_DATE"

# Create backup structure
mkdir -p "$BACKUP_DIR"/{local-app,server-config,database-schemas,deployment-scripts}

echo "📁 1. Backing up local application state..."
# Use existing backup script for local app
./scripts/backup-production-state.sh

# Copy the latest local backup to deployment backup
LATEST_LOCAL_BACKUP=$(find backups -name "production-state-*" -type d | sort | tail -1)
if [ -d "$LATEST_LOCAL_BACKUP" ]; then
    cp -r "$LATEST_LOCAL_BACKUP"/* "$BACKUP_DIR/local-app/"
    echo "✅ Local backup copied to deployment package"
else
    echo "⚠️ Warning: No local backup found to include"
fi

echo "🖥️ 2. Creating server configuration backup..."

# Coolify deployment configuration
cat > "$BACKUP_DIR/server-config/coolify-deployment.yml" << 'EOF'
# Coolify Deployment Configuration for MET24
# Updated: 2025-10-05

version: '3.8'

services:
  met24-user-app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL}
      - REACT_APP_SUPABASE_ANON_KEY=${REACT_APP_SUPABASE_ANON_KEY}
      - VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
      - VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}
      - VAPID_EMAIL=${VAPID_EMAIL}
    volumes:
      - app-data:/app/data
    networks:
      - met24-network
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.met24.rule=Host(\`your-domain.com\`)"
      - "traefik.http.routers.met24.tls=true"
      - "traefik.http.routers.met24.tls.certresolver=letsencrypt"

  met24-mcp-bridge:
    build:
      context: .
      dockerfile: Dockerfile.mcp-bridge
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    networks:
      - met24-network
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mcp.rule=Host(\`mcp.your-domain.com\`)"
      - "traefik.http.routers.mcp.tls=true"

  discourse:
    image: discourse/discourse:latest
    environment:
      - DISCOURSE_HOSTNAME=community.your-domain.com
      - DISCOURSE_DB_HOST=postgres
      - DISCOURSE_REDIS_HOST=redis
    volumes:
      - discourse-data:/var/www/discourse
    networks:
      - met24-network
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=discourse
      - POSTGRES_USER=discourse
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - met24-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    networks:
      - met24-network
    restart: unless-stopped

volumes:
  app-data:
  discourse-data:
  postgres-data:
  redis-data:

networks:
  met24-network:
    driver: bridge
EOF

# Environment variables template for production
cat > "$BACKUP_DIR/server-config/production.env.template" << 'EOF'
# MET24 Production Environment Variables
# Copy to .env and fill in actual values

# Core Supabase Configuration (REQUIRED)
REACT_APP_SUPABASE_URL=https://wdwtwuljuewbkfozjkbq.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# PWA Push Notifications (REQUIRED)
VAPID_PUBLIC_KEY=your_vapid_public_key_here
VAPID_PRIVATE_KEY=your_vapid_private_key_here
VAPID_EMAIL=mailto:your-email@domain.com

# SSL & Domain Configuration
SSL_EMAIL=your-email@domain.com
DOMAIN=your-domain.com

# Database Configuration
POSTGRES_PASSWORD=secure_postgres_password_here

# Optional: Development/Debug
NODE_ENV=production
DEBUG=false
EOF

echo "🗄️ 3. Backing up database schemas..."
cp -r src/database/v14/schemas/ "$BACKUP_DIR/database-schemas/"
cp *.sql "$BACKUP_DIR/database-schemas/" 2>/dev/null || true

echo "🚀 4. Creating deployment scripts..."

# DigitalOcean droplet setup script
cat > "$BACKUP_DIR/deployment-scripts/setup-digitalocean-droplet.sh" << 'EOF'
#!/bin/bash

# DigitalOcean Droplet Setup for MET24
# Run this on a fresh Ubuntu 22.04 droplet

set -e

echo "🌊 Setting up DigitalOcean droplet for MET24..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Create app directory
sudo mkdir -p /opt/met24
sudo chown $USER:$USER /opt/met24

echo "✅ Droplet setup completed!"
echo "Next steps:"
echo "1. Clone your repository to /opt/met24"
echo "2. Copy environment variables"
echo "3. Run deployment script"
EOF

# Deployment automation script
cat > "$BACKUP_DIR/deployment-scripts/deploy-to-production.sh" << 'EOF'
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
EOF

# Monitoring and maintenance script
cat > "$BACKUP_DIR/deployment-scripts/monitor-production.sh" << 'EOF'
#!/bin/bash

# MET24 Production Monitoring Script

echo "📊 MET24 Production Status Check"
echo "================================"

# Check Docker containers
echo "🐳 Docker Containers:"
docker-compose ps

echo ""

# Check disk usage
echo "💾 Disk Usage:"
df -h

echo ""

# Check memory usage
echo "🧠 Memory Usage:"
free -h

echo ""

# Check logs (last 50 lines)
echo "📝 Recent Logs:"
docker-compose logs --tail=50 met24-user-app

echo ""

# Check SSL certificate status
echo "🔒 SSL Certificate Status:"
echo | openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates

echo ""
echo "✅ Status check completed!"
EOF

# Make scripts executable
chmod +x "$BACKUP_DIR/deployment-scripts"/*.sh

echo "📋 5. Creating deployment manifest..."
cat > "$BACKUP_DIR/DEPLOYMENT_MANIFEST.md" << EOF
# MET24 DigitalOcean Deployment Backup - $BACKUP_DATE

## 📦 Backup Contents

### 🏠 Local Application
- Complete working app state (7 languages)
- All source code and configurations
- Build-ready state with passing tests

### 🖥️ Server Configuration
- Coolify deployment configuration
- Docker Compose multi-service setup
- Production environment template
- SSL/Traefik configuration

### 🗄️ Database Schemas
- WatermelonDB V14 schema files
- SQL migration scripts
- Database structure documentation

### 🚀 Deployment Scripts
- DigitalOcean droplet setup
- Automated deployment pipeline
- Production monitoring tools
- Maintenance utilities

## 🛠️ Deployment Pipeline

### 1. Droplet Setup
\`\`\`bash
# On fresh Ubuntu 22.04 droplet
./deployment-scripts/setup-digitalocean-droplet.sh
\`\`\`

### 2. Application Deployment
\`\`\`bash
# Clone repository
git clone https://github.com/Thomas007-creator/MET24-Production.git /opt/met24
cd /opt/met24

# Copy environment variables
cp server-config/production.env.template .env
# Edit .env with actual values

# Deploy
./deployment-scripts/deploy-to-production.sh
\`\`\`

### 3. Monitoring
\`\`\`bash
# Check production status
./deployment-scripts/monitor-production.sh
\`\`\`

## 🌐 Domain Configuration

Configure these DNS records:
- \`A\` record: \`your-domain.com\` → Droplet IP
- \`A\` record: \`mcp.your-domain.com\` → Droplet IP  
- \`A\` record: \`community.your-domain.com\` → Droplet IP

## ✅ Verification Checklist

- [ ] Droplet created and configured
- [ ] Domain DNS configured
- [ ] Environment variables set
- [ ] SSL certificates issued
- [ ] All services running
- [ ] 7-language switching tested
- [ ] Community integration working
- [ ] PWA install prompt functional

## 🆘 Rollback Procedure

1. Stop current deployment: \`docker-compose down\`
2. Restore from backup: \`cp -r /opt/met24-backups/backup-YYYYMMDD_HHMMSS/* /opt/met24/\`
3. Restart services: \`docker-compose up -d\`

EOF

echo "🗜️ 6. Creating deployment package..."
cd backups
tar -czf "MET24-DigitalOcean-Deployment-$BACKUP_DATE.tar.gz" "digitalocean-deployment-$BACKUP_DATE/"
cd ..

echo ""
echo "✅ DigitalOcean Deployment Backup Completed!"
echo ""
echo "📦 Backup Location: $BACKUP_DIR"
echo "🗜️ Deployment Package: backups/MET24-DigitalOcean-Deployment-$BACKUP_DATE.tar.gz"
echo "📋 Deployment Guide: $BACKUP_DIR/DEPLOYMENT_MANIFEST.md"
echo ""
echo "🚀 Ready for DigitalOcean deployment!"
echo "📝 Next: Extract package on your droplet and follow DEPLOYMENT_MANIFEST.md"
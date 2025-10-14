# 🚀 MET2.4 Coolify Deployment Guide
## Complete Setup for GitHub → Coolify → DigitalOcean

> **Status:** ✅ Ready for production deployment with Coolify
> **Architecture:** Dual-droplet setup with VPN protection for production

---

## 📋 Quick Start

### 1. **GitHub Repository Setup**
```bash
# Clone the backup to your repository
git clone <your-repo-url>
cd met24-mbti-coach

# Copy all files from backup
cp -r /path/to/MET24_COMPLETE_COOLIFY_BACKUP_*/* .

# Initial commit
git add .
git commit -m "Initial MET2.4 deployment setup"
git push origin main
```

### 2. **GitHub Secrets Configuration**
Add these secrets to your GitHub repository (`Settings > Secrets and variables > Actions`):

```bash
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Domain Configuration
DO_DOMAIN=your-domain.com
DEV_DOMAIN=dev.your-domain.com

# Coolify Configuration
COOLIFY_WEBHOOK_URL=https://your-coolify.com/api/v1/projects/your-project/deploy
COOLIFY_DEV_WEBHOOK_URL=https://your-coolify.com/api/v1/projects/your-dev-project/deploy
COOLIFY_API_TOKEN=your_coolify_api_token

# DigitalOcean Configuration
DIGITALOCEAN_ACCESS_TOKEN=your_do_token
PRODUCTION_DROPLET_ID=your_prod_droplet_id
DEVELOPMENT_DROPLET_ID=your_dev_droplet_id

# API Keys
MCP_API_KEY=your_mcp_api_key
```

### 3. **Coolify Project Setup**

#### **Production Project (VPN Protected)**
- **Name:** `met24-production`
- **Repository:** Your GitHub repo
- **Branch:** `main`
- **Dockerfile:** `Dockerfile.production`
- **Environment Variables:**
  ```env
  NODE_ENV=production
  REACT_APP_SUPABASE_URL=https://your-project.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=your_anon_key
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  DO_DOMAIN=your-domain.com
  MCP_API_KEY=your_mcp_api_key
  VPN_ENABLED=true
  ```

#### **Development Project (Open Access)**
- **Name:** `met24-development`
- **Repository:** Your GitHub repo
- **Branch:** `develop`
- **Dockerfile:** `Dockerfile.dev`
- **Environment Variables:**
  ```env
  NODE_ENV=development
  REACT_APP_SUPABASE_URL=https://your-project.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=your_anon_key
  DEV_DOMAIN=dev.your-domain.com
  ```

---

## 🏗️ Architecture Overview

### **Dual-Droplet Setup**
```
┌─────────────────────────────────────────────────────────────┐
│                    Internet                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              DigitalOcean Droplets                          │
├─────────────────────────────────────────────────────────────┤
│  Production Droplet (VPN Protected)                        │
│  ├── User App (Port 3000)                                  │
│  ├── MCP Bridge (Port 3001)                                │
│  └── Mullvad VPN + WireGuard                               │
├─────────────────────────────────────────────────────────────┤
│  Development Droplet (Open Access)                         │
│  └── Development App (Port 3002)                           │
└─────────────────────────────────────────────────────────────┘
```

### **Deployment Flow**
```
GitHub Push → GitHub Actions → Coolify → DigitalOcean Droplets
     │              │              │              │
     │              │              │              ├── Production (VPN)
     │              │              │              └── Development (Open)
     │              │              │
     │              │              ├── Build Docker Image
     │              │              ├── Run Tests
     │              │              └── Security Scan
     │              │
     │              ├── Lint & Type Check
     │              ├── Unit Tests
     │              └── Build Application
     │
     └── Code Changes
```

---

## 🚀 Deployment Process

### **Production Deployment**
```bash
# Push to main branch
git checkout main
git add .
git commit -m "Production update"
git push origin main

# GitHub Actions will:
# 1. Run tests and security scans
# 2. Build Docker image
# 3. Deploy to production droplet via Coolify
# 4. Verify VPN protection
# 5. Run health checks
```

### **Development Deployment**
```bash
# Push to develop branch
git checkout develop
git add .
git commit -m "Feature update"
git push origin develop

# GitHub Actions will:
# 1. Run tests and security scans
# 2. Build Docker image
# 3. Deploy to development droplet via Coolify
# 4. Run health checks
```

---

## 🔧 Configuration Files

### **GitHub Actions Workflows**
- `.github/workflows/deploy-coolify.yml` - Coolify deployment
- `.github/workflows/deploy-dual-droplets.yml` - Dual-droplet deployment

### **Docker Configuration**
- `Dockerfile.production` - Production optimized image
- `Dockerfile.dev` - Development image
- `docker-compose.yml` - Local development setup

### **Environment Templates**
- `env.production.template` - Production environment variables
- `env.development.template` - Development environment variables
- `env.vpn-production.template` - VPN production setup

---

## 📊 Monitoring & Health Checks

### **Health Check Endpoints**
- **Production:** `https://your-domain.com/health`
- **MCP Bridge:** `https://mcp.your-domain.com/health`
- **Development:** `https://dev.your-domain.com/health`

### **Monitoring Commands**
```bash
# Check production services
curl -f https://your-domain.com/health
curl -f https://mcp.your-domain.com/health

# Check development services
curl -f https://dev.your-domain.com/health

# Check GitHub Actions status
gh run list --repo your-username/your-repo

# Check Coolify deployment status
curl -H "Authorization: Bearer $COOLIFY_API_TOKEN" \
  https://your-coolify.com/api/v1/projects/your-project/status
```

---

## 🛠️ Troubleshooting

### **Common Issues**

#### **1. GitHub Actions Failing**
```bash
# Check workflow logs
gh run view --repo your-username/your-repo

# Common fixes:
# - Verify all secrets are set correctly
# - Check branch names match workflow triggers
# - Ensure Dockerfile exists and is valid
```

#### **2. Coolify Deployment Issues**
```bash
# Check Coolify logs
# - Go to Coolify dashboard
# - Navigate to your project
# - Check deployment logs

# Common fixes:
# - Verify webhook URL is correct
# - Check environment variables
# - Ensure repository access permissions
```

#### **3. Health Check Failures**
```bash
# Check if services are running
curl -v https://your-domain.com/health

# Common fixes:
# - Verify domain DNS settings
# - Check if droplets are running
# - Ensure VPN is configured correctly
```

---

## 🔒 Security Considerations

### **Production Security**
- ✅ **VPN Protection** - All production traffic via Mullvad VPN
- ✅ **WireGuard** - Additional encryption layer
- ✅ **Kill Switch** - Automatic shutdown if VPN fails
- ✅ **Environment Variables** - Sensitive data in GitHub Secrets

### **Development Security**
- ✅ **Separate Environment** - Isolated from production
- ✅ **Limited Access** - No sensitive production data
- ✅ **Regular Updates** - Automated security patches

---

## 📈 Performance Optimization

### **Production Optimizations**
- ✅ **Docker Multi-stage Build** - Optimized image size
- ✅ **CDN Integration** - Static asset delivery
- ✅ **Database Connection Pooling** - Efficient database usage
- ✅ **Caching Strategy** - Redis for session management

### **Development Optimizations**
- ✅ **Hot Reload** - Fast development iteration
- ✅ **Source Maps** - Easy debugging
- ✅ **Development Tools** - Enhanced debugging capabilities

---

## 🎯 Next Steps

1. **Set up GitHub repository** with all secrets
2. **Configure Coolify projects** for production and development
3. **Set up DigitalOcean droplets** with VPN protection
4. **Test deployment pipeline** with a small change
5. **Monitor and optimize** based on usage patterns

---

## 📞 Support

For issues or questions:
- **GitHub Issues:** Create an issue in your repository
- **Coolify Documentation:** https://coolify.io/docs
- **DigitalOcean Support:** https://cloud.digitalocean.com/support

---

**🚀 Ready to deploy your MET2.4 AI Persoonlijkheidscoach!**

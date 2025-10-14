# 🚀 AI Buddy Coolify Deployment Guide

## 📋 **Overview**

This guide explains how to deploy the new AI Buddy features using the successful Coolify configuration from `main-k0g4wgck0g0wgw4owwoocs84`.

## 🎯 **Deployment Strategy**

### **Current Situation:**
- **Old Stable PWA**: Running via `thomas007-creator/-m-e-t24--production:main-k0g4wgck0g0wgw4owwoocs84`
- **New AI Buddy Code**: Pushed to GitHub main branch
- **Deployment Conflict**: Port 3000 conflict between old and new deployments

### **Solution:**
Deploy AI Buddy as a **separate Coolify application** with unique resource UUID to avoid conflicts.

## 🛠️ **Deployment Files**

### **1. Docker Compose Configuration**
- **File**: `docker-compose.coolify-production.yml`
- **Based on**: Successful `main-k0g4wgck0g0wgw4owwoocs84` deployment
- **Features**: Coolify-specific labels, environment variables, and network configuration

### **2. Deployment Script**
- **File**: `scripts/deploy-ai-buddy-coolify.sh`
- **Features**: 
  - Automatic resource UUID generation
  - Environment variable validation
  - Health checks
  - Deployment status monitoring

### **3. Environment Template**
- **File**: `env-ai-buddy-template.txt`
- **Features**: All required environment variables with documentation

## 🚀 **Deployment Steps**

### **Step 1: Prepare Environment**
```bash
# Copy environment template
cp env-ai-buddy-template.txt .env

# Edit .env with your actual values
nano .env
```

### **Step 2: Required Environment Variables**
```bash
# Core Application
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VAPID_PUBLIC_KEY=your_vapid_public_key_here
VAPID_PRIVATE_KEY=your_vapid_private_key_here
VAPID_EMAIL=mailto:your-email@domain.com

# SSL Configuration
SSL_EMAIL=admin@your-future-self.app

# AI Provider Keys (Optional)
GROK_API_KEY=your_grok_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### **Step 3: Deploy AI Buddy**
```bash
# Make script executable (if not already)
chmod +x scripts/deploy-ai-buddy-coolify.sh

# Run deployment
./scripts/deploy-ai-buddy-coolify.sh
```

### **Step 4: Verify Deployment**
```bash
# Check User App
curl -f http://localhost:3000/health

# Check MCP Bridge
curl -f http://localhost:3001/health

# Check Traefik Dashboard
curl -f http://localhost:8080/api/rawdata
```

## 🔧 **Deployment Features**

### **Coolify Integration**
- **Resource UUID**: Automatically generated unique identifier
- **Container Names**: Unique names to avoid conflicts
- **Network Configuration**: Proper Coolify network setup
- **Labels**: Coolify-specific labels for management

### **SSL & Security**
- **Let's Encrypt**: Automatic SSL certificate generation
- **Traefik**: Reverse proxy with SSL termination
- **VAPID Keys**: Secure push notification configuration
- **Environment Variables**: All secrets externalized

### **Health Monitoring**
- **Health Checks**: Built-in health check endpoints
- **Logging**: Comprehensive logging for troubleshooting
- **Status Monitoring**: Real-time deployment status

## 📊 **Expected Results**

### **After Successful Deployment:**
```
✅ User App: http://localhost:3000 (AI Buddy features)
✅ MCP Bridge: http://localhost:3001 (Enhanced with new features)
✅ Traefik Dashboard: http://localhost:8080
✅ SSL Certificates: Automatically generated
✅ Health Checks: All services healthy
```

### **AI Buddy Features Available:**
- **Route**: `/ai-buddy` - AI Buddy Interface
- **Route**: `/test-ai-buddy` - AI Buddy Testing
- **Features**: Memory context, refusal logic, trust system
- **Providers**: Grok-3 free, OpenAI, Claude, UltimateAI

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **1. Port Conflicts**
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Stop conflicting services
docker stop $(docker ps -q --filter "publish=3000")
```

#### **2. Environment Variables**
```bash
# Check if all required variables are set
./scripts/deploy-ai-buddy-coolify.sh
# Script will validate all required variables
```

#### **3. Docker Network Issues**
```bash
# Remove old networks
docker network prune -f

# Recreate network
docker network create $COOLIFY_RESOURCE_UUID
```

#### **4. SSL Certificate Issues**
```bash
# Check Traefik logs
docker logs traefik-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID

# Verify SSL email is set
echo $SSL_EMAIL
```

## 📝 **Deployment Logs**

### **View Logs:**
```bash
# All services
docker-compose -f docker-compose.coolify-production.yml logs -f

# Specific service
docker logs met24-user-app-ai-buddy-$COOLIFY_RESOURCE_UUID-$COOLIFY_CONTAINER_ID -f
```

### **Deployment Information:**
```bash
# View deployment info
cat .ai-buddy-deployment
```

## 🎯 **Next Steps After Deployment**

### **1. Test AI Buddy Features**
- Navigate to `/ai-buddy` route
- Test memory context functionality
- Verify refusal logic
- Check trust system

### **2. Verify MCP Bridge**
- Test AI provider switching
- Verify rate limiting
- Check input validation

### **3. Monitor Performance**
- Check health endpoints
- Monitor logs for errors
- Verify SSL certificates

### **4. Production Readiness**
- Configure DNS (www.your-future-self.app)
- Set up monitoring
- Configure backups

## 🔄 **Migration Strategy**

### **Option A: Parallel Deployment (Recommended)**
- Keep old PWA running on different port
- Deploy AI Buddy on port 3000
- Gradual user migration

### **Option B: Staged Replacement**
- Test AI Buddy thoroughly
- Replace old PWA when ready
- Zero-downtime migration

### **Option C: Feature Flag Approach**
- Deploy behind feature flags
- A/B testing capability
- Gradual rollout

## 📞 **Support**

### **Deployment Issues:**
1. Check deployment logs
2. Verify environment variables
3. Check Docker container status
4. Review Coolify dashboard

### **Feature Issues:**
1. Test AI Buddy interface
2. Check MCP Bridge functionality
3. Verify database connectivity
4. Review error logs

---

**Status**: 🟢 **Ready for Deployment**  
**Last Updated**: 30 September 2025  
**Based on**: Successful `main-k0g4wgck0g0wgw4owwoocs84` deployment

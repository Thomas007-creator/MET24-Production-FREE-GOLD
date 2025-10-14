# ✅ MET2.4 Deployment Checklist
## Complete Setup Guide for GitHub → Coolify → DigitalOcean

> **Status:** Ready for production deployment
> **Estimated Setup Time:** 2-3 hours
> **Difficulty:** Intermediate

---

## 📋 Pre-Deployment Checklist

### ✅ **1. GitHub Repository Setup**
- [ ] Repository created on GitHub
- [ ] Code pushed to repository
- [ ] GitHub Actions enabled
- [ ] Branch protection rules configured (optional)

### ✅ **2. GitHub Secrets Configuration**
- [ ] `REACT_APP_SUPABASE_URL` - Supabase project URL
- [ ] `REACT_APP_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- [ ] `DO_DOMAIN` - Production domain (e.g., your-domain.com)
- [ ] `DEV_DOMAIN` - Development domain (e.g., dev.your-domain.com)
- [ ] `COOLIFY_WEBHOOK_URL` - Production Coolify webhook
- [ ] `COOLIFY_DEV_WEBHOOK_URL` - Development Coolify webhook
- [ ] `COOLIFY_API_TOKEN` - Coolify API token
- [ ] `DIGITALOCEAN_ACCESS_TOKEN` - DigitalOcean API token
- [ ] `PRODUCTION_DROPLET_ID` - Production droplet ID
- [ ] `DEVELOPMENT_DROPLET_ID` - Development droplet ID
- [ ] `MCP_API_KEY` - MCP API key

### ✅ **3. DigitalOcean Setup**
- [ ] DigitalOcean account created
- [ ] API token generated
- [ ] Production droplet created (4GB RAM recommended)
- [ ] Development droplet created (2GB RAM recommended)
- [ ] Domain configured with DNS records
- [ ] SSH keys configured

### ✅ **4. Coolify Setup**
- [ ] Coolify instance running (self-hosted or cloud)
- [ ] Production project created
- [ ] Development project created
- [ ] GitHub integration configured
- [ ] Webhook URLs obtained
- [ ] API token generated

### ✅ **5. Supabase Setup**
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] API keys obtained
- [ ] RLS policies configured
- [ ] Environment variables configured

---

## 🚀 Deployment Process

### **Step 1: Initial Setup**
```bash
# 1. Clone repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Copy backup files
cp -r /path/to/MET24_COMPLETE_COOLIFY_BACKUP_*/* .

# 3. Run setup script
./setup-github-actions.sh

# 4. Initial commit
git add .
git commit -m "Initial deployment setup"
git push origin main
```

### **Step 2: Verify GitHub Actions**
- [ ] Go to GitHub Actions tab
- [ ] Verify workflow runs successfully
- [ ] Check all tests pass
- [ ] Verify security scans complete
- [ ] Confirm Docker image builds

### **Step 3: Test Deployment**
```bash
# Test production deployment
git checkout main
git commit --allow-empty -m "Test production deployment"
git push origin main

# Test development deployment
git checkout develop
git commit --allow-empty -m "Test development deployment"
git push origin develop
```

### **Step 4: Verify Services**
- [ ] Production app accessible at `https://your-domain.com`
- [ ] MCP Bridge accessible at `https://mcp.your-domain.com`
- [ ] Development app accessible at `https://dev.your-domain.com`
- [ ] Health checks pass
- [ ] All services respond correctly

---

## 🔧 Configuration Files

### **Required Files**
- [ ] `.github/workflows/deploy-coolify.yml`
- [ ] `.github/workflows/deploy-dual-droplets.yml`
- [ ] `Dockerfile.production`
- [ ] `Dockerfile.dev`
- [ ] `docker-compose.yml`
- [ ] `COOLIFY_DEPLOYMENT_README.md`
- [ ] `setup-github-actions.sh`

### **Environment Templates**
- [ ] `env.production.template`
- [ ] `env.development.template`
- [ ] `env.vpn-production.template`
- [ ] `env.example`

---

## 🛠️ Troubleshooting

### **Common Issues & Solutions**

#### **GitHub Actions Failing**
- [ ] Check all secrets are set correctly
- [ ] Verify branch names match workflow triggers
- [ ] Ensure Dockerfile exists and is valid
- [ ] Check repository permissions

#### **Coolify Deployment Issues**
- [ ] Verify webhook URLs are correct
- [ ] Check environment variables in Coolify
- [ ] Ensure repository access permissions
- [ ] Verify Coolify API token

#### **Health Check Failures**
- [ ] Check domain DNS settings
- [ ] Verify droplets are running
- [ ] Ensure VPN is configured correctly
- [ ] Check firewall settings

#### **Database Connection Issues**
- [ ] Verify Supabase credentials
- [ ] Check database schema is deployed
- [ ] Ensure RLS policies are correct
- [ ] Verify network connectivity

---

## 📊 Monitoring Setup

### **Health Monitoring**
- [ ] Set up uptime monitoring
- [ ] Configure alert notifications
- [ ] Monitor resource usage
- [ ] Track deployment success rates

### **Log Monitoring**
- [ ] Configure log aggregation
- [ ] Set up error tracking
- [ ] Monitor performance metrics
- [ ] Track user analytics

---

## 🔒 Security Checklist

### **Production Security**
- [ ] VPN protection configured
- [ ] WireGuard encryption enabled
- [ ] Kill switch protection active
- [ ] Environment variables secured
- [ ] SSL certificates configured
- [ ] Firewall rules applied

### **Development Security**
- [ ] Separate environment isolated
- [ ] Limited access permissions
- [ ] No sensitive production data
- [ ] Regular security updates

---

## 📈 Performance Optimization

### **Production Optimizations**
- [ ] Docker multi-stage builds
- [ ] CDN integration configured
- [ ] Database connection pooling
- [ ] Caching strategy implemented
- [ ] Resource monitoring active

### **Development Optimizations**
- [ ] Hot reload enabled
- [ ] Source maps configured
- [ ] Development tools available
- [ ] Fast iteration cycles

---

## 🎯 Post-Deployment

### **Verification Steps**
- [ ] All services responding
- [ ] Health checks passing
- [ ] Performance metrics acceptable
- [ ] Security scans clean
- [ ] User acceptance testing complete

### **Documentation**
- [ ] Deployment guide updated
- [ ] Troubleshooting guide created
- [ ] Monitoring procedures documented
- [ ] Backup procedures established

### **Maintenance**
- [ ] Regular update schedule
- [ ] Security patch procedures
- [ ] Performance monitoring
- [ ] User feedback collection

---

## 📞 Support Resources

### **Documentation**
- [ ] `COOLIFY_DEPLOYMENT_README.md` - Complete deployment guide
- [ ] `COMPLETE_DEPLOYMENT_GUIDE.md` - Detailed architecture guide
- [ ] `DEVELOPMENT_ENVIRONMENT_GUIDE.md` - Development setup

### **External Resources**
- [ ] [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ ] [Coolify Documentation](https://coolify.io/docs)
- [ ] [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [ ] [Supabase Documentation](https://supabase.com/docs)

---

## 🎉 Success Criteria

### **Deployment Success**
- ✅ All services deployed successfully
- ✅ Health checks passing
- ✅ Performance metrics acceptable
- ✅ Security requirements met
- ✅ User acceptance testing passed

### **Operational Success**
- ✅ Monitoring systems active
- ✅ Backup procedures working
- ✅ Update procedures tested
- ✅ Support documentation complete
- ✅ Team trained on procedures

---

**🚀 Ready for production deployment!**

*Complete this checklist before going live to ensure a smooth deployment experience.*

#!/bin/bash

# ========================================
# MET2.4 GITHUB ACTIONS SETUP SCRIPT
# Complete setup voor GitHub Actions + Coolify
# ========================================

echo "🚀 Setting up GitHub Actions for MET2.4 deployment..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository!"
    echo "Please run: git init && git remote add origin <your-repo-url>"
    exit 1
fi

echo "✅ Git repository detected"

# Check if GitHub Actions directory exists
if [ ! -d ".github/workflows" ]; then
    echo "❌ GitHub Actions workflows not found!"
    echo "Please ensure .github/workflows/ directory exists with workflow files"
    exit 1
fi

echo "✅ GitHub Actions workflows found"

# Display required secrets
echo ""
echo "📋 REQUIRED GITHUB SECRETS:"
echo "=========================="
echo ""
echo "Go to: https://github.com/your-username/your-repo/settings/secrets/actions"
echo ""
echo "Add these secrets:"
echo ""
echo "🔐 SUPABASE CONFIGURATION:"
echo "  REACT_APP_SUPABASE_URL=https://your-project.supabase.co"
echo "  REACT_APP_SUPABASE_ANON_KEY=your_anon_key"
echo "  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
echo ""
echo "🌐 DOMAIN CONFIGURATION:"
echo "  DO_DOMAIN=your-domain.com"
echo "  DEV_DOMAIN=dev.your-domain.com"
echo ""
echo "🚀 COOLIFY CONFIGURATION:"
echo "  COOLIFY_WEBHOOK_URL=https://your-coolify.com/api/v1/projects/your-project/deploy"
echo "  COOLIFY_DEV_WEBHOOK_URL=https://your-coolify.com/api/v1/projects/your-dev-project/deploy"
echo "  COOLIFY_API_TOKEN=your_coolify_api_token"
echo ""
echo "☁️ DIGITALOCEAN CONFIGURATION:"
echo "  DIGITALOCEAN_ACCESS_TOKEN=your_do_token"
echo "  PRODUCTION_DROPLET_ID=your_prod_droplet_id"
echo "  DEVELOPMENT_DROPLET_ID=your_dev_droplet_id"
echo ""
echo "🔑 API KEYS:"
echo "  MCP_API_KEY=your_mcp_api_key"
echo ""

# Check if secrets are already configured (if running in GitHub Actions)
if [ "$GITHUB_ACTIONS" = "true" ]; then
    echo "🔍 Checking GitHub secrets..."
    
    # List of required secrets
    REQUIRED_SECRETS=(
        "REACT_APP_SUPABASE_URL"
        "REACT_APP_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "DO_DOMAIN"
        "DEV_DOMAIN"
        "COOLIFY_WEBHOOK_URL"
        "COOLIFY_DEV_WEBHOOK_URL"
        "COOLIFY_API_TOKEN"
        "DIGITALOCEAN_ACCESS_TOKEN"
        "PRODUCTION_DROPLET_ID"
        "DEVELOPMENT_DROPLET_ID"
        "MCP_API_KEY"
    )
    
    MISSING_SECRETS=()
    
    for secret in "${REQUIRED_SECRETS[@]}"; do
        if [ -z "${!secret}" ]; then
            MISSING_SECRETS+=("$secret")
        fi
    done
    
    if [ ${#MISSING_SECRETS[@]} -eq 0 ]; then
        echo "✅ All required secrets are configured!"
    else
        echo "❌ Missing secrets:"
        for secret in "${MISSING_SECRETS[@]}"; do
            echo "  - $secret"
        done
        echo ""
        echo "Please add these secrets to your GitHub repository settings."
        exit 1
    fi
fi

# Display workflow information
echo ""
echo "📋 WORKFLOW INFORMATION:"
echo "======================="
echo ""
echo "Available workflows:"
echo "  - deploy-coolify.yml (Coolify deployment)"
echo "  - deploy-dual-droplets.yml (Dual-droplet deployment)"
echo ""
echo "Trigger conditions:"
echo "  - Push to 'main' branch → Production deployment"
echo "  - Push to 'develop' branch → Development deployment"
echo "  - Pull requests → Test and build only"
echo ""

# Display next steps
echo "🎯 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Add all required secrets to GitHub repository"
echo "2. Set up Coolify projects:"
echo "   - Production project (main branch)"
echo "   - Development project (develop branch)"
echo "3. Configure DigitalOcean droplets"
echo "4. Test deployment with a small change:"
echo ""
echo "   git add ."
echo "   git commit -m 'Test deployment'"
echo "   git push origin main"
echo ""
echo "5. Monitor deployment in GitHub Actions tab"
echo ""

# Check if this is a fresh setup
if [ ! -f ".github/workflows/.setup-complete" ]; then
    echo "🎉 First time setup detected!"
    echo "Creating setup completion marker..."
    touch .github/workflows/.setup-complete
    echo "✅ Setup completion marker created"
fi

echo ""
echo "🚀 GitHub Actions setup complete!"
echo ""
echo "📚 Documentation:"
echo "  - COOLIFY_DEPLOYMENT_README.md - Complete deployment guide"
echo "  - COMPLETE_DEPLOYMENT_GUIDE.md - Detailed architecture guide"
echo "  - DEVELOPMENT_ENVIRONMENT_GUIDE.md - Development setup"
echo ""
echo "🔗 Useful links:"
echo "  - GitHub Actions: https://github.com/your-username/your-repo/actions"
echo "  - Repository Secrets: https://github.com/your-username/your-repo/settings/secrets/actions"
echo "  - Coolify Dashboard: https://your-coolify.com"
echo ""
echo "Happy deploying! 🚀"

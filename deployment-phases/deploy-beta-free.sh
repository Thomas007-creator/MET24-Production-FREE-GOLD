#!/bin/bash

# Deploy Beta Free Version (FREE + GOLD with payment disabled)
# This script deploys the beta version with all features visible but payment disabled

set -e

echo "🚀 Deploying Beta Free Version (FREE + GOLD with payment disabled)"
echo "================================================================"

# Configuration
BUILD_TARGET="beta"
VERSION="0.0.1-beta.1"
ENVIRONMENT="staging"
DOMAIN="beta.your-future-self.app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the user-app directory."
    exit 1
fi

print_status "Starting Beta Free deployment..."

# Step 1: Set environment variables
print_status "Setting environment variables..."
export REACT_APP_BUILD_TARGET=$BUILD_TARGET
export REACT_APP_BUILD_VERSION=$VERSION
export REACT_APP_DEPLOYMENT_PHASE="beta"
export REACT_APP_ENABLE_TRACKING="true"
export REACT_APP_DISABLE_PAYMENT="true"
export NODE_ENV="production"

print_success "Environment variables set"

# Step 2: Install dependencies
print_status "Installing dependencies..."
npm ci --silent
print_success "Dependencies installed"

# Step 3: Run beta build
print_status "Building beta version (accepts 95% TypeScript quality)..."
npm run build:beta

if [ $? -eq 0 ]; then
    print_success "Beta build completed successfully"
else
    print_error "Beta build failed"
    exit 1
fi

# Step 4: Verify build output
print_status "Verifying build output..."
if [ -d "build" ]; then
    print_success "Build directory created"
    
    # Check for key files
    if [ -f "build/index.html" ]; then
        print_success "index.html found"
    else
        print_error "index.html not found in build directory"
        exit 1
    fi
    
    # Check for service worker files
    if [ -f "build/sw-offline-queue.js" ] && [ -f "build/sw-workbox.js" ]; then
        print_success "Service worker files copied"
    else
        print_warning "Service worker files not found (this is OK for beta)"
    fi
else
    print_error "Build directory not created"
    exit 1
fi

# Step 5: Create deployment package
print_status "Creating deployment package..."
DEPLOY_PACKAGE="met24-beta-free-${VERSION}.tar.gz"
tar -czf $DEPLOY_PACKAGE build/
print_success "Deployment package created: $DEPLOY_PACKAGE"

# Step 6: Display deployment information
echo ""
echo "🎯 Beta Free Deployment Ready!"
echo "=============================="
echo "Version: $VERSION"
echo "Build Target: $BUILD_TARGET"
echo "Features: ALL FREE + GOLD features visible"
echo "Payment: DISABLED (safe for testing)"
echo "Tracking: ENABLED (conversion data collection)"
echo "Domain: $DOMAIN"
echo "Package: $DEPLOY_PACKAGE"
echo ""

# Step 7: Display next steps
print_status "Next steps:"
echo "1. Upload $DEPLOY_PACKAGE to your server"
echo "2. Extract in your deployment directory"
echo "3. Configure your web server to serve the build directory"
echo "4. Set up domain $DOMAIN to point to your server"
echo "5. Test the beta version at https://$DOMAIN"
echo ""

# Step 8: Display testing checklist
print_status "Beta Testing Checklist:"
echo "✅ All FREE features accessible"
echo "✅ All GOLD features accessible (but not purchasable)"
echo "✅ '🧪 BETA' badge visible in header"
echo "✅ '📊 Beta Mode' banner visible"
echo "✅ Upgrade buttons show 'Explore Plan' instead of 'Continue with Payment'"
echo "✅ Clicking upgrade shows beta message"
echo "✅ Conversion tracking active (check localStorage)"
echo ""

# Step 9: Display monitoring commands
print_status "Monitoring commands:"
echo "# Check if beta is running:"
echo "curl -s https://$DOMAIN/health"
echo ""
echo "# Check conversion tracking (in browser console):"
echo "localStorage.getItem('met24_conversion_events')"
echo ""
echo "# View conversion metrics:"
echo "getConversionMetrics()"
echo ""

print_success "Beta Free deployment script completed!"
print_status "Ready to deploy to $DOMAIN"



#!/bin/bash

# ================================================
# MET2.4 DIGITALOCEAN DROPLET PROVISIONING
# Automated dual-droplet setup with VPN protection
# ================================================

set -euo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="met24"
REGION="ams3"  # Amsterdam - close to Netherlands
PRODUCTION_SIZE="s-2vcpu-4gb"    # Production: 4GB RAM, 2vCPUs
DEVELOPMENT_SIZE="s-1vcpu-2gb"   # Development: 2GB RAM, 1vCPU
SSH_KEY_NAME="met24-deployment"

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  MET2.4 DIGITALOCEAN DROPLET PROVISIONING${NC}"
echo -e "${BLUE}================================================${NC}"

# ================================================
# PREREQUISITES CHECK
# ================================================
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check doctl installation
    if ! command -v doctl &> /dev/null; then
        echo -e "${RED}❌ doctl CLI not found. Please install:${NC}"
        echo "  brew install doctl"
        exit 1
    fi
    
    # Check authentication
    if ! doctl account get &> /dev/null; then
        echo -e "${RED}❌ DigitalOcean authentication required:${NC}"
        echo "  doctl auth init"
        exit 1
    fi
    
    # Check SSH key
    if ! doctl compute ssh-key list | grep -q "$SSH_KEY_NAME"; then
        echo -e "${YELLOW}⚠️ SSH key '$SSH_KEY_NAME' not found.${NC}"
        echo "Creating SSH key for deployment..."
        
        # Generate SSH key if not exists
        if [[ ! -f ~/.ssh/id_rsa_met24 ]]; then
            ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_met24 -N "" -C "met24-deployment"
        fi
        
        # Upload SSH key
        doctl compute ssh-key import "$SSH_KEY_NAME" --public-key-file ~/.ssh/id_rsa_met24.pub
    fi
    
    echo -e "${GREEN}✅ Prerequisites checked${NC}"
}

# ================================================
# PRODUCTION DROPLET (VPN Protected)
# ================================================
create_production_droplet() {
    echo -e "${YELLOW}Creating production droplet...${NC}"
    
    PROD_NAME="${PROJECT_NAME}-production"
    
    # Check if droplet already exists
    if doctl compute droplet list | grep -q "$PROD_NAME"; then
        echo -e "${YELLOW}⚠️ Production droplet already exists${NC}"
        PROD_IP=$(doctl compute droplet list | grep "$PROD_NAME" | awk '{print $3}')
        echo -e "${BLUE}Production IP: $PROD_IP${NC}"
        return 0
    fi
    
    # Create production droplet
    echo "Creating $PROD_NAME with VPN protection..."
    doctl compute droplet create "$PROD_NAME" \
        --image ubuntu-22-04-x64 \
        --size "$PRODUCTION_SIZE" \
        --region "$REGION" \
        --ssh-keys "$(doctl compute ssh-key list | grep "$SSH_KEY_NAME" | awk '{print $1}')" \
        --enable-monitoring \
        --enable-ipv6 \
        --tag-names production,vpn-protected,met24 \
        --user-data-file <(cat << 'EOF'
#!/bin/bash
# Production droplet initialization with security hardening

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install WireGuard
apt-get install -y wireguard wireguard-tools

# Security: Disable SSH password authentication
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/#PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh

# Firewall configuration
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 51820/udp  # WireGuard

# Install Coolify agent (will be configured later)
mkdir -p /opt/coolify

echo "Production droplet initialized with security hardening"
EOF
        )
    
    # Wait for droplet creation
    echo "Waiting for production droplet creation..."
    sleep 30
    
    PROD_IP=$(doctl compute droplet list | grep "$PROD_NAME" | awk '{print $3}')
    echo -e "${GREEN}✅ Production droplet created: $PROD_IP${NC}"
    
    # Wait for SSH availability
    echo "Waiting for SSH availability..."
    while ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa_met24 root@"$PROD_IP" "echo 'SSH ready'" 2>/dev/null; do
        echo "  Waiting for SSH..."
        sleep 10
    done
    
    echo -e "${GREEN}✅ Production droplet ready for deployment${NC}"
}

# ================================================
# DEVELOPMENT DROPLET (Open Access)
# ================================================
create_development_droplet() {
    echo -e "${YELLOW}Creating development droplet...${NC}"
    
    DEV_NAME="${PROJECT_NAME}-development"
    
    # Check if droplet already exists
    if doctl compute droplet list | grep -q "$DEV_NAME"; then
        echo -e "${YELLOW}⚠️ Development droplet already exists${NC}"
        DEV_IP=$(doctl compute droplet list | grep "$DEV_NAME" | awk '{print $3}')
        echo -e "${BLUE}Development IP: $DEV_IP${NC}"
        return 0
    fi
    
    # Create development droplet
    echo "Creating $DEV_NAME for open development..."
    doctl compute droplet create "$DEV_NAME" \
        --image ubuntu-22-04-x64 \
        --size "$DEVELOPMENT_SIZE" \
        --region "$REGION" \
        --ssh-keys "$(doctl compute ssh-key list | grep "$SSH_KEY_NAME" | awk '{print $1}')" \
        --enable-monitoring \
        --enable-ipv6 \
        --tag-names development,open-access,met24 \
        --user-data-file <(cat << 'EOF'
#!/bin/bash
# Development droplet initialization with development tools

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install development tools
apt-get install -y git htop tree nano curl wget

# Basic firewall (more permissive for development)
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000:3010/tcp  # Development ports

# Install Coolify agent (will be configured later)
mkdir -p /opt/coolify

echo "Development droplet initialized with development tools"
EOF
        )
    
    # Wait for droplet creation
    echo "Waiting for development droplet creation..."
    sleep 30
    
    DEV_IP=$(doctl compute droplet list | grep "$DEV_NAME" | awk '{print $3}')
    echo -e "${GREEN}✅ Development droplet created: $DEV_IP${NC}"
    
    # Wait for SSH availability
    echo "Waiting for SSH availability..."
    while ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa_met24 root@"$DEV_IP" "echo 'SSH ready'" 2>/dev/null; do
        echo "  Waiting for SSH..."
        sleep 10
    done
    
    echo -e "${GREEN}✅ Development droplet ready for deployment${NC}"
}

# ================================================
# DNS CONFIGURATION
# ================================================
configure_dns() {
    echo -e "${YELLOW}Configuring DNS records...${NC}"
    
    DOMAIN="${1:-met24.nl}"  # Default domain, can be overridden
    PROD_IP=$(doctl compute droplet list | grep "${PROJECT_NAME}-production" | awk '{print $3}')
    DEV_IP=$(doctl compute droplet list | grep "${PROJECT_NAME}-development" | awk '{print $3}')
    
    if [[ -z "$PROD_IP" || -z "$DEV_IP" ]]; then
        echo -e "${RED}❌ Could not get droplet IPs${NC}"
        return 1
    fi
    
    echo "Domain: $DOMAIN"
    echo "Production IP: $PROD_IP"
    echo "Development IP: $DEV_IP"
    
    # Note: DNS configuration depends on your domain provider
    # This is a template for common setups
    
    echo -e "${BLUE}DNS Configuration Required:${NC}"
    echo "Please configure these DNS records with your domain provider:"
    echo ""
    echo "Production (VPN Protected):"
    echo "  A     $DOMAIN                 -> $PROD_IP"
    echo "  A     mcp.$DOMAIN             -> $PROD_IP"
    echo ""
    echo "Development (Open Access):"
    echo "  A     dev.$DOMAIN             -> $DEV_IP"
    echo ""
    echo -e "${YELLOW}⚠️ Wait for DNS propagation before deploying applications${NC}"
}

# ================================================
# COOLIFY AGENT INSTALLATION
# ================================================
install_coolify_agents() {
    echo -e "${YELLOW}Installing Coolify agents...${NC}"
    
    PROD_IP=$(doctl compute droplet list | grep "${PROJECT_NAME}-production" | awk '{print $3}')
    DEV_IP=$(doctl compute droplet list | grep "${PROJECT_NAME}-development" | awk '{print $3}')
    
    # Production agent
    echo "Installing Coolify agent on production droplet..."
    ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa_met24 root@"$PROD_IP" << 'EOF'
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
EOF
    
    # Development agent
    echo "Installing Coolify agent on development droplet..."
    ssh -o StrictHostKeyChecking=no -i ~/.ssh/id_rsa_met24 root@"$DEV_IP" << 'EOF'
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
EOF
    
    echo -e "${GREEN}✅ Coolify agents installed${NC}"
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Add servers to your Coolify dashboard"
    echo "2. Configure deployment projects"
    echo "3. Set up webhook URLs for GitHub Actions"
}

# ================================================
# SUMMARY & NEXT STEPS
# ================================================
show_summary() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${GREEN}  DUAL-DROPLET DEPLOYMENT READY${NC}"
    echo -e "${BLUE}================================================${NC}"
    
    PROD_IP=$(doctl compute droplet list | grep "${PROJECT_NAME}-production" | awk '{print $3}')
    DEV_IP=$(doctl compute droplet list | grep "${PROJECT_NAME}-development" | awk '{print $3}')
    
    echo ""
    echo -e "${GREEN}Production Droplet (VPN Protected):${NC}"
    echo "  IP: $PROD_IP"
    echo "  Size: $PRODUCTION_SIZE"
    echo "  Services: User App (3000) + MCP Bridge (3001)"
    echo "  Security: Mullvad VPN + WireGuard"
    echo ""
    echo -e "${GREEN}Development Droplet (Open Access):${NC}"
    echo "  IP: $DEV_IP"
    echo "  Size: $DEVELOPMENT_SIZE"
    echo "  Services: Development App (3002)"
    echo "  Security: Standard firewall"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Configure DNS records (see output above)"
    echo "2. Set up Coolify projects for both droplets"
    echo "3. Configure Mullvad VPN on production droplet"
    echo "4. Update GitHub secrets with webhook URLs"
    echo "5. Deploy using GitHub Actions"
    echo ""
    echo -e "${BLUE}SSH Access:${NC}"
    echo "  Production: ssh -i ~/.ssh/id_rsa_met24 root@$PROD_IP"
    echo "  Development: ssh -i ~/.ssh/id_rsa_met24 root@$DEV_IP"
}

# ================================================
# MAIN EXECUTION
# ================================================
main() {
    echo "Starting MET2.4 dual-droplet provisioning..."
    echo ""
    
    check_prerequisites
    echo ""
    
    create_production_droplet
    echo ""
    
    create_development_droplet
    echo ""
    
    configure_dns "$1"
    echo ""
    
    install_coolify_agents
    echo ""
    
    show_summary
}

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
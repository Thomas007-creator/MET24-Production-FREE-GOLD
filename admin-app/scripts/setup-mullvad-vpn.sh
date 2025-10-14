#!/bin/bash

# ================================================
# MULLVAD VPN + WIREGUARD CONFIGURATION
# For MET2.4 Production Droplet Security
# ================================================

set -euo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  MULLVAD VPN CONFIGURATION FOR PRODUCTION${NC}"
echo -e "${BLUE}================================================${NC}"

# ================================================
# PREREQUISITES CHECK
# ================================================
check_mullvad_account() {
    echo -e "${YELLOW}Checking Mullvad account...${NC}"
    
    if [[ -z "${MULLVAD_ACCOUNT:-}" ]]; then
        echo -e "${RED}❌ MULLVAD_ACCOUNT environment variable required${NC}"
        echo "Please set your Mullvad account number:"
        echo "  export MULLVAD_ACCOUNT='your-account-number'"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Mullvad account: $MULLVAD_ACCOUNT${NC}"
}

# ================================================
# WIREGUARD KEY GENERATION
# ================================================
generate_wireguard_keys() {
    echo -e "${YELLOW}Generating WireGuard keys...${NC}"
    
    # Generate private key
    PRIVATE_KEY=$(wg genkey)
    PUBLIC_KEY=$(echo "$PRIVATE_KEY" | wg pubkey)
    
    echo -e "${GREEN}✅ WireGuard keys generated${NC}"
    echo -e "${BLUE}Private Key: $PRIVATE_KEY${NC}"
    echo -e "${BLUE}Public Key: $PUBLIC_KEY${NC}"
    
    # Save keys securely
    mkdir -p /etc/wireguard
    echo "$PRIVATE_KEY" > /etc/wireguard/privatekey
    echo "$PUBLIC_KEY" > /etc/wireguard/publickey
    chmod 600 /etc/wireguard/privatekey
    chmod 644 /etc/wireguard/publickey
    
    export WG_PRIVATE_KEY="$PRIVATE_KEY"
    export WG_PUBLIC_KEY="$PUBLIC_KEY"
}

# ================================================
# MULLVAD API INTEGRATION
# ================================================
register_with_mullvad() {
    echo -e "${YELLOW}Registering device with Mullvad...${NC}"
    
    # Create device on Mullvad
    DEVICE_RESPONSE=$(curl -s -X POST \
        "https://api.mullvad.net/www/accounts/$MULLVAD_ACCOUNT/devices" \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"met24-production-$(date +%s)\",
            \"pubkey\": \"$WG_PUBLIC_KEY\"
        }")
    
    if echo "$DEVICE_RESPONSE" | grep -q "error"; then
        echo -e "${RED}❌ Failed to register device with Mullvad${NC}"
        echo "$DEVICE_RESPONSE"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Device registered with Mullvad${NC}"
    
    # Get server configuration
    SERVER_CONFIG=$(curl -s "https://api.mullvad.net/www/relays/wireguard/")
    
    # Select Amsterdam server (closest to Netherlands)
    AMSTERDAM_SERVER=$(echo "$SERVER_CONFIG" | jq -r '.countries[] | select(.name=="Netherlands") | .cities[0].relays[0]')
    SERVER_IP=$(echo "$AMSTERDAM_SERVER" | jq -r '.ipv4_addr_in')
    SERVER_PUBKEY=$(echo "$AMSTERDAM_SERVER" | jq -r '.public_key')
    
    echo -e "${BLUE}Selected server: Amsterdam, Netherlands${NC}"
    echo -e "${BLUE}Server IP: $SERVER_IP${NC}"
    
    export MULLVAD_SERVER_IP="$SERVER_IP"
    export MULLVAD_SERVER_PUBKEY="$SERVER_PUBKEY"
}

# ================================================
# WIREGUARD CONFIGURATION
# ================================================
create_wireguard_config() {
    echo -e "${YELLOW}Creating WireGuard configuration...${NC}"
    
    # Get client IP from Mullvad
    CLIENT_IP=$(curl -s "https://api.mullvad.net/www/accounts/$MULLVAD_ACCOUNT/devices" | \
        jq -r --arg pubkey "$WG_PUBLIC_KEY" '.[] | select(.pubkey==$pubkey) | .ipv4_address')
    
    if [[ -z "$CLIENT_IP" || "$CLIENT_IP" == "null" ]]; then
        echo -e "${RED}❌ Could not get client IP from Mullvad${NC}"
        exit 1
    fi
    
    # Create WireGuard config
    cat > /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = $WG_PRIVATE_KEY
Address = $CLIENT_IP/32
DNS = 193.138.218.74

# Kill switch - block all traffic if VPN is down
PostUp = iptables -I OUTPUT ! -o %i -m mark ! --mark \$(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT
PreDown = iptables -D OUTPUT ! -o %i -m mark ! --mark \$(wg show %i fwmark) -m addrtype ! --dst-type LOCAL -j REJECT

[Peer]
PublicKey = $MULLVAD_SERVER_PUBKEY
Endpoint = $MULLVAD_SERVER_IP:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
EOF

    chmod 600 /etc/wireguard/wg0.conf
    echo -e "${GREEN}✅ WireGuard configuration created${NC}"
}

# ================================================
# DOCKER INTEGRATION
# ================================================
create_docker_vpn_config() {
    echo -e "${YELLOW}Creating Docker VPN configuration...${NC}"
    
    # Create Docker VPN service config
    cat > /opt/met24/docker-compose.vpn.yml << EOF
version: '3.8'

services:
  vpn:
    image: qmcgaw/gluetun:latest
    container_name: met24-vpn
    cap_add:
      - NET_ADMIN
    environment:
      - VPN_SERVICE_PROVIDER=mullvad
      - VPN_TYPE=wireguard
      - WIREGUARD_PRIVATE_KEY=$WG_PRIVATE_KEY
      - WIREGUARD_ADDRESSES=$CLIENT_IP
      - SERVER_COUNTRIES=Netherlands
      - FIREWALL_OUTBOUND_SUBNETS=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
      - HEALTH_VPN_DURATION_INITIAL=30s
    ports:
      - "3000:3000"  # User App
      - "3001:3001"  # MCP Bridge
    volumes:
      - /etc/wireguard:/gluetun/wireguard:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://ip-api.com/json"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - vpn-network

  user-app:
    image: ghcr.io/your-username/met24-user-app:latest
    container_name: met24-user-app
    depends_on:
      vpn:
        condition: service_healthy
    network_mode: "service:vpn"
    environment:
      - NODE_ENV=production
      - REACT_APP_SUPABASE_URL=\${REACT_APP_SUPABASE_URL}
      - REACT_APP_SUPABASE_ANON_KEY=\${REACT_APP_SUPABASE_ANON_KEY}
    restart: unless-stopped

  mcp-bridge:
    image: ghcr.io/your-username/met24-mcp-bridge:latest
    container_name: met24-mcp-bridge
    depends_on:
      vpn:
        condition: service_healthy
    network_mode: "service:vpn"
    environment:
      - NODE_ENV=production
      - MCP_API_KEY=\${MCP_API_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=\${SUPABASE_SERVICE_ROLE_KEY}
    restart: unless-stopped

networks:
  vpn-network:
    driver: bridge
EOF

    echo -e "${GREEN}✅ Docker VPN configuration created${NC}"
}

# ================================================
# SYSTEM SERVICE
# ================================================
setup_vpn_service() {
    echo -e "${YELLOW}Setting up VPN system service...${NC}"
    
    # Enable WireGuard service
    systemctl enable wg-quick@wg0
    
    # Create VPN monitor script
    cat > /usr/local/bin/vpn-monitor.sh << 'EOF'
#!/bin/bash
# VPN Connection Monitor for MET2.4 Production

LOG_FILE="/var/log/vpn-monitor.log"
VPN_INTERFACE="wg0"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

check_vpn() {
    if ip link show "$VPN_INTERFACE" &>/dev/null && [[ $(wg show "$VPN_INTERFACE") ]]; then
        return 0
    else
        return 1
    fi
}

check_internet() {
    if curl -s --max-time 10 "https://api.mullvad.net/www/am-i-mullvad/" | grep -q "You are connected"; then
        return 0
    else
        return 1
    fi
}

main() {
    if ! check_vpn; then
        log "VPN interface down - attempting restart"
        systemctl restart wg-quick@wg0
        sleep 10
    fi
    
    if ! check_internet; then
        log "VPN connectivity issue - restarting VPN"
        systemctl restart wg-quick@wg0
        sleep 10
        
        if ! check_internet; then
            log "VPN restart failed - stopping Docker services for security"
            docker-compose -f /opt/met24/docker-compose.production.yml down
        fi
    else
        log "VPN connection healthy"
    fi
}

main "$@"
EOF

    chmod +x /usr/local/bin/vpn-monitor.sh
    
    # Create systemd timer for monitoring
    cat > /etc/systemd/system/vpn-monitor.service << EOF
[Unit]
Description=VPN Monitor for MET2.4
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/vpn-monitor.sh
EOF

    cat > /etc/systemd/system/vpn-monitor.timer << EOF
[Unit]
Description=Run VPN Monitor every 2 minutes
Requires=vpn-monitor.service

[Timer]
OnCalendar=*:0/2

[Install]
WantedBy=timers.target
EOF

    systemctl daemon-reload
    systemctl enable vpn-monitor.timer
    systemctl start vpn-monitor.timer
    
    echo -e "${GREEN}✅ VPN monitoring service configured${NC}"
}

# ================================================
# FIREWALL CONFIGURATION
# ================================================
configure_firewall() {
    echo -e "${YELLOW}Configuring firewall for VPN...${NC}"
    
    # Reset firewall
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default deny outgoing
    ufw default deny forward
    
    # Allow essential services
    ufw allow in on lo
    ufw allow out on lo
    ufw allow out 22/tcp  # SSH
    ufw allow out 53      # DNS
    ufw allow out 80/tcp  # HTTP
    ufw allow out 443/tcp # HTTPS
    
    # Allow VPN
    ufw allow out 51820/udp  # WireGuard
    ufw allow in on wg0
    ufw allow out on wg0
    
    # Allow Docker networks
    ufw allow in on docker0
    ufw allow out on docker0
    
    # Enable firewall
    ufw --force enable
    
    echo -e "${GREEN}✅ Firewall configured for VPN${NC}"
}

# ================================================
# VERIFICATION
# ================================================
verify_vpn_setup() {
    echo -e "${YELLOW}Verifying VPN setup...${NC}"
    
    # Start VPN
    systemctl start wg-quick@wg0
    sleep 5
    
    # Check VPN interface
    if ip link show wg0 &>/dev/null; then
        echo -e "${GREEN}✅ VPN interface active${NC}"
    else
        echo -e "${RED}❌ VPN interface failed${NC}"
        return 1
    fi
    
    # Check Mullvad connection
    EXTERNAL_IP=$(curl -s --max-time 10 "https://api.mullvad.net/www/am-i-mullvad/")
    if echo "$EXTERNAL_IP" | grep -q "You are connected"; then
        echo -e "${GREEN}✅ Mullvad VPN connection verified${NC}"
        echo "External IP check: $EXTERNAL_IP"
    else
        echo -e "${RED}❌ Mullvad VPN connection failed${NC}"
        echo "Response: $EXTERNAL_IP"
        return 1
    fi
    
    echo -e "${GREEN}✅ VPN setup verification complete${NC}"
}

# ================================================
# MAIN EXECUTION
# ================================================
main() {
    echo "Configuring Mullvad VPN for MET2.4 production..."
    echo ""
    
    check_mullvad_account
    echo ""
    
    generate_wireguard_keys
    echo ""
    
    register_with_mullvad
    echo ""
    
    create_wireguard_config
    echo ""
    
    create_docker_vpn_config
    echo ""
    
    setup_vpn_service
    echo ""
    
    configure_firewall
    echo ""
    
    verify_vpn_setup
    echo ""
    
    echo -e "${BLUE}================================================${NC}"
    echo -e "${GREEN}  MULLVAD VPN CONFIGURATION COMPLETE${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    echo -e "${YELLOW}Important Information:${NC}"
    echo "• VPN Private Key: $WG_PRIVATE_KEY"
    echo "• Client IP: $CLIENT_IP"
    echo "• Server: Amsterdam, Netherlands"
    echo "• Monitoring: Every 2 minutes via systemd timer"
    echo "• Kill Switch: Enabled (blocks all traffic if VPN fails)"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Add VPN secrets to GitHub repository"
    echo "2. Update docker-compose.production.yml to use VPN"
    echo "3. Deploy via Coolify with VPN protection"
    echo ""
    echo -e "${BLUE}GitHub Secrets to Add:${NC}"
    echo "  MULLVAD_ACCOUNT: $MULLVAD_ACCOUNT"
    echo "  WG_PRIVATE_KEY: $WG_PRIVATE_KEY"
}

# Run if called directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
#!/bin/bash

# =====================================================
# Tailscale VPN Manager for MET2.4 MBTI Coach PWA
# =====================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="met24-tailscale"
COMPOSE_FILE="docker-compose.yml"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Check if Tailscale auth key is set
check_auth_key() {
    if [ -z "$TAILSCALE_AUTHKEY" ]; then
        log_error "TAILSCALE_AUTHKEY environment variable is not set."
        log_info "Please set it in your .env file or export it:"
        log_info "export TAILSCALE_AUTHKEY=tskey-auth-your-key-here"
        exit 1
    fi
}

# Start Tailscale service
start_tailscale() {
    log_info "Starting Tailscale VPN service..."
    check_docker
    check_auth_key
    
    docker-compose --profile tailscale up -d
    log_success "Tailscale service started successfully"
    
    # Wait for service to initialize
    log_info "Waiting for Tailscale to initialize..."
    sleep 10
    
    # Show status
    status_tailscale
}

# Stop Tailscale service
stop_tailscale() {
    log_info "Stopping Tailscale VPN service..."
    check_docker
    
    docker-compose --profile tailscale down
    log_success "Tailscale service stopped successfully"
}

# Show Tailscale status
status_tailscale() {
    log_info "Checking Tailscale status..."
    check_docker
    
    if docker ps | grep -q "$CONTAINER_NAME"; then
        log_success "Tailscale container is running"
        
        # Show Tailscale status
        log_info "Tailscale network status:"
        docker exec "$CONTAINER_NAME" tailscale status 2>/dev/null || log_warning "Tailscale not fully initialized yet"
        
        # Show network info
        log_info "Network configuration:"
        docker network ls | grep vpn
    else
        log_warning "Tailscale container is not running"
    fi
}

# Show Tailscale logs
logs_tailscale() {
    log_info "Showing Tailscale logs..."
    check_docker
    
    docker logs "$CONTAINER_NAME" -f
}

# Restart Tailscale service
restart_tailscale() {
    log_info "Restarting Tailscale VPN service..."
    stop_tailscale
    sleep 2
    start_tailscale
}

# Start development environment with VPN
start_dev_with_vpn() {
    log_info "Starting development environment with VPN protection..."
    check_docker
    check_auth_key
    
    docker-compose --profile dev --profile tailscale up -d
    log_success "Development environment with VPN started successfully"
    
    # Show access information
    log_info "Development app is now accessible only via VPN"
    log_info "Check Tailscale status for the assigned IP address"
    status_tailscale
}

# Show help
show_help() {
    echo "Tailscale VPN Manager for MET2.4 MBTI Coach PWA"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start Tailscale VPN service"
    echo "  stop        Stop Tailscale VPN service"
    echo "  restart     Restart Tailscale VPN service"
    echo "  status      Show Tailscale status and network info"
    echo "  logs        Show Tailscale logs"
    echo "  dev         Start development environment with VPN"
    echo "  help        Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  TAILSCALE_AUTHKEY    Tailscale authentication key (required)"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Start Tailscale service"
    echo "  $0 dev                      # Start dev environment with VPN"
    echo "  TAILSCALE_AUTHKEY=key $0 start  # Start with auth key"
}

# Main script logic
case "${1:-help}" in
    start)
        start_tailscale
        ;;
    stop)
        stop_tailscale
        ;;
    restart)
        restart_tailscale
        ;;
    status)
        status_tailscale
        ;;
    logs)
        logs_tailscale
        ;;
    dev)
        start_dev_with_vpn
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac



















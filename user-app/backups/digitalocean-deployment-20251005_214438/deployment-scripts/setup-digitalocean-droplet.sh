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

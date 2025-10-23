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

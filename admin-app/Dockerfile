# =====================================================
# MET2.4 MBTI Coach PWA - Production Dockerfile V14
# Version: 2.4.1 V14 - Future-Ready Production
# Features: PWA, WatermelonDB V14, AI Integration, Extension System, V14 Sync
# =====================================================

# Multi-stage build for MET2.4 MBTI Coach PWA
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++ curl

# Copy package files
COPY package*.json ./

# Install all dependencies with legacy peer deps for compatibility
RUN npm ci --legacy-peer-deps --silent

# Copy source code
COPY . .

# Build the application for production
ENV NODE_ENV=production
ENV REACT_APP_NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true

# Build the PWA
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration for PWA
COPY nginx.conf /etc/nginx/nginx.conf

# Create health check endpoint
RUN echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body><h1>MET2.4 MBTI Coach V14 - Healthy</h1><p>WatermelonDB V14 Active</p></body></html>' > /usr/share/nginx/html/health

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
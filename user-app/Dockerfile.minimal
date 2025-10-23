# Minimal test Dockerfile
FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source code
COPY . .

# Build arguments
ARG NODE_ENV=production
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY

# Environment variables
ENV NODE_ENV=$NODE_ENV
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY
ENV GENERATE_SOURCEMAP=false
ENV CI=true

# Build application (use simple build without cross-env)
RUN GENERATE_SOURCEMAP=false NODE_ENV=production npm run build

# Install serve
RUN npm install -g serve

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start application
CMD ["serve", "-s", "build", "-l", "80"]

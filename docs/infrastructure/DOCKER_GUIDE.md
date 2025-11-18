# 🐳 ZOE Solar Docker Containerization Guide

## 📋 Overview

Dieser Guide etabliert eine umfassende Docker-Strategie für die ZOE Solar React-Anwendung mit Multi-Stage Builds, Optimization, Security Best Practices und Production-Ready Konfigurationen.

---

## 🏗️ Container Architecture

### Multi-Stage Build Strategy
```dockerfile
# Dockerfile
# Stage 1: Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine AS production

# Install additional tools
RUN apk add --no-cache \
    curl \
    jq \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy security headers
COPY nginx/security.conf /etc/nginx/includes/security.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set permissions
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Expose port
EXPOSE 8080

# Start nginx with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
```

### Development Dockerfile
```dockerfile
# Dockerfile.dev
FROM node:20-alpine AS development

WORKDIR /app

# Install development dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Create volumes for hot reload
VOLUME ["/app/src", "/app/public"]

# Expose development port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

---

## ⚙️ Nginx Configuration

### Main Nginx Configuration
```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

# Load dynamic modules
include /etc/nginx/modules/*.conf;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging format
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Brotli compression (if module available)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    include /etc/nginx/includes/security.conf;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # Include configurations
    include /etc/nginx/conf.d/*.conf;
}
```

### Site Configuration
```nginx
# nginx/default.conf
# Upstream API server
upstream api_backend {
    server api:3000;
    keepalive 32;
}

# HTTP server (redirect to HTTPS)
server {
    listen 80;
    server_name zoe-solar.de www.zoe-solar.de;

    # Security headers for HTTP
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name zoe-solar.de www.zoe-solar.de;

    # SSL configuration
    ssl_certificate /etc/ssl/certs/zoe-solar.de.crt;
    ssl_certificate_key /etc/ssl/private/zoe-solar.de.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # OCSP stapling
    ssl_stapling on;
    ssl_stapling_verify on;

    # Root directory
    root /usr/share/nginx/html;
    index index.html index.htm;

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;

    # Security headers
    include /etc/nginx/includes/security.conf;

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;

        # Try files first, then 404
        try_files $uri =404;
    }

    # HTML files (shorter cache)
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";

        # Try files first, then 404
        try_files $uri =404;
    }

    # API endpoints
    location /api/ {
        # Rate limiting
        limit_req zone=api burst=20 nodelay;

        # Proxy settings
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Rate limiting for general requests
    limit_req zone=general burst=50 nodelay;

    # SPA routing (fallback to index.html)
    location / {
        try_files $uri $uri/ /index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }

    # Security: Hide nginx version
    server_tokens off;

    # Custom error pages
    location = /404.html {
        internal;
    }

    location = /50x.html {
        internal;
    }
}
```

### Security Headers Configuration
```nginx
# nginx/includes/security.conf
# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.zoe-solar.de https://www.google-analytics.com; media-src 'self' https: blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self';" always;

# Strict-Transport-Security
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# X-Frame-Options
add_header X-Frame-Options "SAMEORIGIN" always;

# X-Content-Type-Options
add_header X-Content-Type-Options "nosniff" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions Policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), autoplay=(), encrypted-media=(), fullscreen=(), picture-in-picture=()" always;

# Cross-Origin Embedder Policy
add_header Cross-Origin-Embedder-Policy "require-corp" always;

# Cross-Origin-Opener-Policy
add_header Cross-Origin-Opener-Policy "same-origin" always;

# Cross-Origin-Resource-Policy
add_header Cross-Origin-Resource-Policy "same-origin" always;

# Remove Server header
proxy_hide_header Server;
more_clear_headers Server;
```

---

## 🔐 Security Configuration

### Docker Security Best Practices

#### Base Image Security
```dockerfile
# Use minimal base image
FROM node:20-alpine AS builder

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory with proper permissions
WORKDIR /app
COPY --chown=nextjs:nodejs . .

# Remove unnecessary packages
RUN apk del --purge \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*
```

#### Multi-Stage Security
```dockerfile
# Final production stage with minimal attack surface
FROM scratch AS production

# Copy only necessary files
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /usr/share/nginx/html /usr/share/nginx/html
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Use non-root user
USER nextjs

# Minimal runtime
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
```

### Security Scanning

#### Trivy Configuration
```yaml
# .trivy.yaml
scan:
  security-checks:
    - vuln
    - config
    - secret
  scanners:
    - vuln
    - config
    - secret
  skip-dirs:
    - node_modules
    - .git
  skip-files:
    - "**/*.test.js"
    - "**/*.spec.js"

vulnerability:
  type:
    - os
    - library
  ignore-unfixed: false
  skip-update: false

secret:
  skip-dirs:
    - docs
    - examples
```

---

## 🚀 Build & Deployment Scripts

### Build Scripts
```bash
#!/bin/bash
# scripts/build.sh

set -euo pipefail

# Configuration
REGISTRY="ghcr.io/zoe-solar"
IMAGE_NAME="zoe-solar-web"
VERSION=${1:-latest}
ENVIRONMENT=${2:-production}

echo "🏗️ Building ZOE Solar Docker image..."
echo "Registry: $REGISTRY"
echo "Image: $IMAGE_NAME"
echo "Version: $VERSION"
echo "Environment: $ENVIRONMENT"

# Build arguments
BUILD_ARGS="--build-arg VERSION=$VERSION --build-arg ENVIRONMENT=$ENVIRONMENT"

# Multi-platform build
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --push \
  $BUILD_ARGS \
  --tag $REGISTRY/$IMAGE_NAME:$VERSION \
  --tag $REGISTRY/$IMAGE_NAME:latest \
  .

echo "✅ Build completed successfully!"
```

### Development Scripts
```bash
#!/bin/bash
# scripts/dev.sh

set -euo pipefail

echo "🛠️ Starting development environment..."

# Start development containers
docker-compose -f docker-compose.dev.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
if curl -f http://localhost:3000/health; then
    echo "✅ Development environment is ready!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 API: http://localhost:3001"
else
    echo "❌ Services failed to start"
    docker-compose -f docker-compose.dev.yml logs
    exit 1
fi
```

### Production Scripts
```bash
#!/bin/bash
# scripts/deploy.sh

set -euo pipefail

# Configuration
REGISTRY="ghcr.io/zoe-solar"
IMAGE_NAME="zoe-solar-web"
VERSION=${1:-latest}
ENVIRONMENT=${2:-production}

echo "🚀 Deploying to $ENVIRONMENT..."

# Pull latest image
docker pull $REGISTRY/$IMAGE_NAME:$VERSION

# Tag for environment
docker tag $REGISTRY/$IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:$ENVIRONMENT

# Push environment tag
docker push $REGISTRY/$IMAGE_NAME:$ENVIRONMENT

# Deploy to production (Kubernetes or Docker Swarm)
if command -v kubectl &> /dev/null; then
    kubectl set image deployment/zoe-solar-web zoe-solar-web=$REGISTRY/$IMAGE_NAME:$VERSION -n $ENVIRONMENT
    kubectl rollout status deployment/zoe-solar-web -n $ENVIRONMENT
else
    docker service update --image $REGISTRY/$IMAGE_NAME:$VERSION zoe-solar-web
fi

echo "✅ Deployment completed successfully!"
```

---

## 📊 Docker Compose Configuration

### Development Environment
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - REACT_APP_API_URL=http://localhost:3001
      - REACT_APP_ENV=development
    depends_on:
      - api
    networks:
      - zoe-solar-network

  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./api/src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/zoe_solar_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    networks:
      - zoe-solar-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=zoe_solar_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - zoe-solar-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - zoe-solar-network

  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - api
    networks:
      - zoe-solar-network

volumes:
  postgres_data:
  redis_data:

networks:
  zoe-solar-network:
    driver: bridge
```

### Production Environment
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    image: ghcr.io/zoe-solar/zoe-solar-web:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - zoe-solar-network
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
        interval: 30s
        timeout: 10s
        retries: 3

  nginx:
    image: ghcr.io/zoe-solar/zoe-solar-nginx:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/ssl/certs:/etc/ssl/certs:ro
      - /var/log/nginx:/var/log/nginx
    networks:
      - zoe-solar-network
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
      healthcheck:
        test: ["CMD", "curl", "-f", "http://localhost:80/health"]
        interval: 30s
        timeout: 10s
        retries: 3

networks:
  zoe-solar-network:
    external: true
```

---

## 🔍 Monitoring & Logging

### Health Check Configuration
```dockerfile
# In Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1
```

### Custom Health Check Script
```bash
#!/bin/bash
# scripts/health-check.sh

# Check application health
check_frontend() {
    curl -f -s http://localhost:8080/health > /dev/null
    return $?
}

# Check database connectivity
check_database() {
    PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 1" > /dev/null 2>&1
    return $?
}

# Check Redis connectivity
check_redis() {
    redis-cli -h $REDIS_HOST ping > /dev/null 2>&1
    return $?
}

# Main health check
main() {
    if check_frontend && check_database && check_redis; then
        echo "✅ All services healthy"
        exit 0
    else
        echo "❌ Health check failed"
        exit 1
    fi
}

main "$@"
```

### Log Management
```yaml
# docker-compose.logging.yml
version: '3.8'

x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

services:
  frontend:
    logging: *default-logging
    labels:
      - "logging.prometheus.enabled=true"

  nginx:
    logging: *default-logging
    volumes:
      - ./logrotate.conf:/etc/logrotate.conf
      - ./nginx/logrotate.d:/etc/logrotate.d

  fluentd:
    image: fluent/fluentd:v1.16-debian
    volumes:
      - ./fluentd/conf:/fluentd/etc
      - /var/log:/var/log:ro
    environment:
      - FLUENTD_CONF=fluent.conf
    networks:
      - zoe-solar-network
```

---

## ⚡ Performance Optimization

### Build Optimization
```dockerfile
# Optimized multi-stage build
FROM node:20-alpine AS deps
WORKDIR /app

# Copy only dependency files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with optimizations
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production stage with optimization
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy optimized artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Nginx Performance Tuning
```nginx
# Performance optimizations in nginx.conf
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Keep-alive connections
    keepalive_timeout 65;
    keepalive_requests 1000;

    # TCP optimizations
    tcp_nopush on;
    tcp_nodelay on;

    # Buffer sizes
    client_body_buffer_size 128k;
    client_max_body_size 20m;
    client_header_buffer_size 3m;
    large_client_header_buffers 4 256k;

    # Output buffering
    output_buffers 4 32k;
    postpone_output 1460;

    # File descriptors
    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
}
```

---

## 🔧 Development Tools

### Docker Development Scripts
```bash
#!/bin/bash
# scripts/docker-dev.sh

# Start development environment
dev-up() {
    echo "🚀 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up --build -d

    # Show logs
    docker-compose -f docker-compose.dev.yml logs -f
}

# Stop development environment
dev-down() {
    echo "🛑 Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down -v
}

# Clean development environment
dev-clean() {
    echo "🧹 Cleaning development environment..."
    docker-compose -f docker-compose.dev.yml down -v --rmi all
    docker system prune -f
}

# Shell into container
dev-shell() {
    local service=${1:-frontend}
    echo "🐚 Opening shell in $service..."
    docker-compose -f docker-compose.dev.yml exec $service sh
}

# Show logs
dev-logs() {
    local service=${1:-}
    if [ -z "$service" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose -f docker-compose.dev.yml logs -f "$service"
    fi
}

# Show status
dev-status() {
    echo "📊 Development environment status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Main command handling
case "${1:-}" in
    up) dev-up ;;
    down) dev-down ;;
    clean) dev-clean ;;
    shell) dev-shell "${2:-}" ;;
    logs) dev-logs "${2:-}" ;;
    status) dev-status ;;
    *)
        echo "Usage: $0 {up|down|clean|shell [service]|logs [service]|status}"
        exit 1
        ;;
esac
```

### Production Deployment Script
```bash
#!/bin/bash
# scripts/deploy-prod.sh

set -euo pipefail

# Configuration
REGISTRY="ghcr.io/zoe-solar"
IMAGE_NAME="zoe-solar-web"
VERSION=${1:-latest}
ENVIRONMENT=${2:-production}

echo "🚀 Deploying ZOE Solar Web Application"
echo "Version: $VERSION"
echo "Environment: $ENVIRONMENT"

# Pre-deployment checks
pre-deploy-check() {
    echo "🔍 Running pre-deployment checks..."

    # Check if image exists
    if ! docker manifest inspect $REGISTRY/$IMAGE_NAME:$VERSION > /dev/null 2>&1; then
        echo "❌ Image $REGISTRY/$IMAGE_NAME:$VERSION not found"
        exit 1
    fi

    # Run security scan
    echo "🔒 Running security scan..."
    trivy image --severity HIGH,CRITICAL $REGISTRY/$IMAGE_NAME:$VERSION

    echo "✅ Pre-deployment checks passed"
}

# Deployment
deploy() {
    echo "🚀 Starting deployment..."

    # Pull image
    docker pull $REGISTRY/$IMAGE_NAME:$VERSION

    # Update running service
    if command -v kubectl &> /dev/null; then
        echo "☸️ Deploying to Kubernetes..."
        kubectl set image deployment/zoe-solar-web zoe-solar-web=$REGISTRY/$IMAGE_NAME:$VERSION -n $ENVIRONMENT
        kubectl rollout status deployment/zoe-solar-web -n $ENVIRONMENT --timeout=600s
    else
        echo "🐳 Deploying to Docker Swarm..."
        docker service update --image $REGISTRY/$IMAGE_NAME:$VERSION zoe-solar-web
    fi

    echo "✅ Deployment completed"
}

# Post-deployment verification
post-deploy-check() {
    echo "🔍 Running post-deployment verification..."

    # Health check
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s https://zoe-solar.de/health > /dev/null; then
            echo "✅ Health check passed"
            break
        fi

        if [ $attempt -eq $max_attempts ]; then
            echo "❌ Health check failed after $max_attempts attempts"
            exit 1
        fi

        echo "⏳ Attempt $attempt/$max_attempts..."
        sleep 10
        ((attempt++))
    done

    # Performance check
    echo "⚡ Running performance check..."
    lighthouse https://zoe-solar.de --output=json --output-path=./lighthouse-report.json

    # Security scan
    echo "🔒 Running production security scan..."
    trivy web --severity HIGH,CRITICAL https://zoe-solar.de

    echo "✅ Post-deployment verification completed"
}

# Rollback function
rollback() {
    echo "🔄 Rolling back deployment..."

    if command -v kubectl &> /dev/null; then
        kubectl rollout undo deployment/zoe-solar-web -n $ENVIRONMENT
        kubectl rollout status deployment/zoe-solar-web -n $ENVIRONMENT
    else
        echo "❌ Rollback not implemented for current environment"
        exit 1
    fi

    echo "✅ Rollback completed"
}

# Main deployment flow
main() {
    case "${1:-deploy}" in
        "deploy")
            pre-deploy-check
            deploy
            post-deploy-check
            ;;
        "rollback")
            rollback
            ;;
        *)
            echo "Usage: $0 [deploy|rollback] [version] [environment]"
            exit 1
            ;;
    esac
}

main "$@"
```

---

## 📚 Best Practices

### Docker Best Practices
1. **Use Multi-Stage Builds** - Minimize final image size
2. **Non-Root User** - Run containers with non-privileged user
3. **Minimal Base Images** - Use alpine or scratch images for production
4. **Health Checks** - Implement proper health checking
5. **Resource Limits** - Set memory and CPU limits
6. **Security Scanning** - Regular vulnerability scanning
7. **Environment Variables** - Use environment-specific configuration
8. **Logging** - Structured logging with appropriate levels

### Production Checklist
- [ ] Multi-stage build implemented
- [ ] Non-root user configured
- [ ] Health checks configured
- [ ] Resource limits set
- [ ] Security scanning passed
- [ ] SSL/TLS configured
- [ ] Rate limiting implemented
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback procedure tested

---

**🐳 Docker Guide Version:** 1.0.0
**🏗️ Architecture:** Multi-Stage Builds
**🔒 Security:** Container Security Best Practices
**⚡ Performance:** Production Optimized
**📊 Monitoring:** Health Checks & Metrics
**📅 Last Update:** 17. November 2025
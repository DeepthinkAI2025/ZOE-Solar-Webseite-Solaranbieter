# 🐳 Docker Compose Examples - ZOE Solar

## 📋 Overview

Beispielhafte Docker Compose Konfigurationen für verschiedene Anwendungsfälle der ZOE Solar Plattform - von lokaler Entwicklung über Testing bis hin zu Production-Bereitstellungen.

---

## 🛠️ Development Environment

### Full Stack Development Setup
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Frontend Application
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
      - REACT_APP_WS_URL=ws://localhost:3001
      - REACT_APP_ENV=development
      - REACT_APP_SENTRY_DSN=${SENTRY_DSN}
      - REACT_APP_GA_ID=${GA_ID}
    depends_on:
      - api
      - postgres
      - redis
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # API Backend
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "3001:3001"
    volumes:
      - ./api/src:/app/src
      - ./api/prisma:/app/prisma
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/zoe_solar_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - NOTION_TOKEN=${NOTION_TOKEN}
      - NOTION_DATABASE_ID=${NOTION_DATABASE_ID}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - GOOGLE_CLOUD_PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID}
      - GOOGLE_CLOUD_CREDENTIALS=${GOOGLE_CLOUD_CREDENTIALS}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=zoe_solar_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
      - ./scripts/init-test-data.sql:/docker-entrypoint-initdb.d/test-data.sql
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
      - ./redis/redis.conf:/usr/local/etc/redis/redis.conf
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/ssl/certs
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - frontend
      - api
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Elasticsearch for Search
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  # Kibana for Elasticsearch
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:5601/api/status || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 60s

  # MinIO for Object Storage
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ROOT_USER}
      - MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    networks:
      - zoe-solar-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  # Mailhog for Email Testing
  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - zoe-solar-network
    restart: unless-stopped

  # Redis Commander
  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379:0:${REDIS_PASSWORD}
    ports:
      - "8081:8081"
    depends_on:
      - redis
    networks:
      - zoe-solar-network
    restart: unless-stopped

  # pgAdmin for Database Management
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_DEFAULT_EMAIL}
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_DEFAULT_PASSWORD}
      - PGADMIN_CONFIG_SERVER_MODE=False
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    networks:
      - zoe-solar-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
  minio_data:
  pgadmin_data:

networks:
  zoe-solar-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

---

## 🧪 Testing Environment

### Automated Testing Setup
```yaml
# docker-compose.test.yml
version: '3.8'

services:
  # Test Frontend
  test-frontend:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      - NODE_ENV=test
      - CYPRESS_baseUrl=http://test-app:3000
      - CI=true
    volumes:
      - ./cypress:/app/cypress
      - ./cypress.config.js:/app/cypress.config.js
      - ./test-results:/app/test-results
    depends_on:
      - test-app
    networks:
      - test-network
    command: ["npx", "cypress", "run", "--browser", "chrome", "--headless"]

  # Test Application
  test-app:
    build:
      context: .
      dockerfile: Dockerfile.test
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=test
      - REACT_APP_API_URL=http://test-api:3001
      - REACT_APP_ENV=test
    depends_on:
      - test-api
      - test-postgres
      - test-redis
    networks:
      - test-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Test API
  test-api:
    build:
      context: ./api
      dockerfile: Dockerfile.test
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://postgres:password@test-postgres:5432/zoe_solar_test
      - REDIS_URL=redis://test-redis:6379
      - JWT_SECRET=test-jwt-secret
    depends_on:
      - test-postgres
      - test-redis
    networks:
      - test-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Test Database
  test-postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=zoe_solar_test
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    tmpfs:
      - /var/lib/postgresql/data
    networks:
      - test-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Test Redis
  test-redis:
    image: redis:7-alpine
    tmpfs:
      - /data
    networks:
      - test-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s

  # Playwright Testing
  playwright:
    build:
      context: .
      dockerfile: Dockerfile.playwright
    environment:
      - CI=true
    volumes:
      - ./tests/e2e:/app/tests/e2e
      - ./playwright.config.ts:/app/playwright.config.ts
      - ./test-results:/app/test-results
    depends_on:
      - test-app
    networks:
      - test-network
    command: ["npx", "playwright", "test"]

  # Performance Testing
  k6:
    image: loadimpact/k6:latest
    volumes:
      - ./tests/performance:/scripts
    depends_on:
      - test-app
    networks:
      - test-network
    command: ["k6", "run", "--out", "json=/results/k6-results.json", "/scripts/load-test.js"]

  # Security Testing
  zap:
    image: owasp/zap2docker-stable
    volumes:
      - ./test-results:/zap/wrk
    depends_on:
      - test-app
    networks:
      - test-network
    command: ["zap-baseline.py", "-t", "http://test-app:3000", "-J", "-r", "/zap/wrk/zap-report.html"]

networks:
  test-network:
    driver: bridge
```

### Load Testing Environment
```yaml
# docker-compose.load-test.yml
version: '3.8'

services:
  # Application Under Test
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - API_URL=http://api:3001
    ports:
      - "8080:80"
    depends_on:
      - api
      - postgres
      - redis
    networks:
      - load-test-network
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'

  # API Backend
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/zoe_solar_load
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=load-test-secret
    depends_on:
      - postgres
      - redis
    networks:
      - load-test-network
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'

  # PostgreSQL
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=zoe_solar_load
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    tmpfs:
      - /var/lib/postgresql/data
    networks:
      - load-test-network
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'

  # Redis
  redis:
    image: redis:7-alpine
    tmpfs:
      - /data
    networks:
      - load-test-network

  # Load Generator 1 - K6
  k6-generator-1:
    image: loadimpact/k6:latest
    volumes:
      - ./tests/performance:/scripts
      - ./results:/results
    depends_on:
      - app
    networks:
      - load-test-network
    command: ["k6", "run", "--out", "json=/results/k6-1.json", "/scripts/load-test-scenario-1.js"]
    environment:
      - TARGET_URL=http://app

  # Load Generator 2 - K6
  k6-generator-2:
    image: loadimpact/k6:latest
    volumes:
      - ./tests/performance:/scripts
      - ./results:/results
    depends_on:
      - app
    networks:
      - load-test-network
    command: ["k6", "run", "--out", "json=/results/k6-2.json", "/scripts/load-test-scenario-2.js"]
    environment:
      - TARGET_URL=http://app

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./results:/prometheus-data
    networks:
      - load-test-network
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus-data'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./monitoring/grafana/datasources:/etc/grafana/provisioning/datasources
    depends_on:
      - prometheus
    networks:
      - load-test-network

networks:
  load-test-network:
    driver: bridge
```

---

## 🚀 Production Environment

### Kubernetes-Ready Setup
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Production Frontend (Multi-stage build)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - API_URL=https://api.zoe-solar.de
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        monitor: 60s
        max_failure_ratio: 0.3
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Production API
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.prod
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/zoe_solar_prod
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - NOTION_TOKEN=${NOTION_TOKEN}
      - NOTION_DATABASE_ID=${NOTION_DATABASE_ID}
      - SENDGRID_API_KEY=${SENDGRID_API_KEY}
      - SENTRY_DSN=${SENTRY_DSN}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 1G
          cpus: '1.0'
        reservations:
          memory: 512M
          cpus: '0.5'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Production Database (Persistent)
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=zoe_solar_prod
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_INITDB_ARGS=--encoding=UTF-8 --lc-collate=C --lc-ctype=C
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./backups:/backups
      - ./scripts/postgres-backup.sh:/docker-entrypoint-initdb.d/backup.sh
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 60s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"

  # Production Redis (Persistent)
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD} --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_prod_data:/data
      - ./redis/redis-prod.conf:/usr/local/etc/redis/redis.conf
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
      start_period: 30s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Production Nginx with SSL
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/prod.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/ssl/certs:ro
      - ./logs/nginx:/var/log/nginx
      - static_content:/usr/share/nginx/html/static:ro
    depends_on:
      - frontend
      - api
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.25'
        reservations:
          memory: 128M
          cpus: '0.1'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"

  # Monitoring - Prometheus
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'

  # Monitoring - Grafana
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/var/lib/grafana/dashboards
    depends_on:
      - prometheus
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.25'
        reservations:
          memory: 256M
          cpus: '0.1'

  # Monitoring - AlertManager
  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    networks:
      - production-network
    restart: unless-stopped

  # Log Aggregation - ELK Stack
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.0'
        reservations:
          memory: 1G
          cpus: '0.5'

  # Log Aggregation - Logstash
  logstash:
    image: docker.elastic.co/logstash/logstash:8.11.0
    volumes:
      - ./logstash/logstash.yml:/usr/share/logstash/pipeline/logstash.yml
      - ./logstash/logstash.conf:/usr/share/logstash/config/logstash.yml
      - ./logs:/var/log/app
    depends_on:
      - elasticsearch
    networks:
      - production-network
    restart: unless-stopped

  # Log Aggregation - Kibana
  kibana:
    image: docker.elastic.co/kibana/kibana:8.11.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - production-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'

  # Backup Service
  backup:
    image: postgres:15-alpine
    environment:
      - PGPASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - ./backups:/backups
      - ./scripts/backup.sh:/backup.sh
    depends_on:
      - postgres
    networks:
      - production-network
    command: ["sh", "/backup.sh"]
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.1'

volumes:
  postgres_prod_data:
    driver: local
  redis_prod_data:
    driver: local
  prometheus_data:
    driver: local
  grafana_data:
    driver: local
  alertmanager_data:
    driver: local
  elasticsearch_data:
    driver: local
  static_content:
    driver: local

networks:
  production-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

---

## 📊 Monitoring & Observability

### Complete Monitoring Stack
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  # Metrics Collection
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - monitoring-network

  # Container Metrics
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:rw
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    privileged: true
    devices:
      - /dev/kmsg
    networks:
      - monitoring-network

  # Nginx Metrics Exporter
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:latest
    ports:
      - "9113:9113"
    command:
      - '-nginx.scrape-uri=http://nginx:8080/nginx_status'
    depends_on:
      - nginx
    networks:
      - monitoring-network

  # PostgreSQL Metrics Exporter
  postgres-exporter:
    image: prometheuscommunity/postgres-exporter:latest
    environment:
      - DATA_SOURCE_NAME=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/zoe_solar_prod?sslmode=disable
    ports:
      - "9187:9187"
    depends_on:
      - postgres
    networks:
      - monitoring-network

  # Redis Metrics Exporter
  redis-exporter:
    image: oliver006/redis_exporter:latest
    environment:
      - REDIS_ADDR=redis://redis:6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    ports:
      - "9121:9121"
    depends_on:
      - redis
    networks:
      - monitoring-network

  # Custom Application Metrics
  app-metrics:
    build:
      context: .
      dockerfile: Dockerfile.metrics
    environment:
      - METRICS_PORT=9090
    ports:
      - "9090:9090"
    networks:
      - monitoring-network

  # Alert Management
  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - ./monitoring/alert_templates:/etc/alertmanager/templates
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
      - '--web.external-url=http://alertmanager:9093'
    networks:
      - monitoring-network

  # Visualization
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=${GRAFANA_ADMIN_USER}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_ADMIN_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_INSTALL_PLUGINS=grafana-piechart-panel,grafana-worldmap-panel,grafana-clock-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
      - ./monitoring/grafana/dashboards:/etc/grafana/dashboards
    depends_on:
      - prometheus
    networks:
      - monitoring-network

  # Time Series Database
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
      - '--web.enable-admin-api'
    networks:
      - monitoring-network

  # Log Collection
  fluentd:
    build:
      context: ./monitoring/fluentd
    volumes:
      - ./monitoring/fluentd/conf:/fluentd/etc
      - ./logs:/var/log/app
    ports:
      - "24224:24224"
      - "24224:24224/udp"
    environment:
      - FLUENTD_CONF=fluent.conf
    networks:
      - monitoring-network

  # Distributed Tracing
  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686"
      - "14268:14268"
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    networks:
      - monitoring-network

  # Service Mesh Visualization
  kiali:
    image: kiali/kiali:latest
    ports:
      - "20001:20001"
    environment:
      - KIALI_CONFIGURATION=/kiali/configuration
    volumes:
      - ./monitoring/kiali/config:/kiali/configuration
    networks:
      - monitoring-network

volumes:
  grafana_data:
  prometheus_data:

networks:
  monitoring-network:
    driver: bridge
```

---

## 🔧 Environment-Specific Scripts

### Development Management Script
```bash
#!/bin/bash
# scripts/dev-manager.sh

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
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

# Service management functions
start_dev() {
    log_info "Starting development environment..."

    # Create .env file if not exists
    if [[ ! -f .env ]]; then
        log_warning ".env file not found, creating from template..."
        cp .env.example .env
        log_warning "Please edit .env file with your configuration"
    fi

    # Start services
    docker-compose -f docker-compose.dev.yml up --build -d

    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30

    # Check health
    if docker-compose -f docker-compose.dev.yml ps | grep -q "Up (healthy)"; then
        log_success "Development environment started successfully!"
        echo ""
        echo "🌐 Available services:"
        echo "   Frontend: http://localhost:3000"
        echo "   API: http://localhost:3001"
        echo "   Database: localhost:5432"
        echo "   Redis: localhost:6379"
        echo "   Kibana: http://localhost:5601"
        echo "   MinIO: http://localhost:9001"
        echo "   MailHog: http://localhost:8025"
        echo "   Redis Commander: http://localhost:8081"
        echo "   pgAdmin: http://localhost:5050"
    else
        log_error "Some services failed to start properly"
        docker-compose -f docker-compose.dev.yml logs
        exit 1
    fi
}

stop_dev() {
    log_info "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down -v
    log_success "Development environment stopped"
}

restart_dev() {
    log_info "Restarting development environment..."
    stop_dev
    start_dev
}

reset_dev() {
    log_warning "This will remove all containers, volumes, and data. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Resetting development environment..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        docker volume prune -f
        log_success "Development environment reset completed"
    else
        log_info "Reset cancelled"
    fi
}

# Development tools
logs() {
    local service=${1:-}
    if [[ -z "$service" ]]; then
        log_info "Showing logs for all services..."
        docker-compose -f docker-compose.dev.yml logs -f
    else
        log_info "Showing logs for service: $service"
        docker-compose -f docker-compose.dev.yml logs -f "$service"
    fi
}

shell() {
    local service=${1:-frontend}
    log_info "Opening shell in service: $service"
    docker-compose -f docker-compose.dev.yml exec "$service" sh
}

db_reset() {
    log_warning "This will reset the database. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        log_info "Resetting database..."
        docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d zoe_solar_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
        docker-compose -f docker-compose.dev.yml exec api npm run prisma:migrate:deploy
        docker-compose -f docker-compose.dev.yml exec api npm run prisma:seed
        log_success "Database reset completed"
    else
        log_info "Database reset cancelled"
    fi
}

# Backup functions
backup() {
    log_info "Creating backup..."
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local backup_dir="./backups"

    mkdir -p "$backup_dir"

    # Database backup
    docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U postgres zoe_solar_dev > "$backup_dir/database-$timestamp.sql"

    # Redis backup
    docker-compose -f docker-compose.dev.yml exec redis redis-cli BGSAVE

    log_success "Backup created: $backup_dir/database-$timestamp.sql"
}

# Status and monitoring
status() {
    log_info "Development environment status:"
    echo ""
    docker-compose -f docker-compose.dev.yml ps
    echo ""

    log_info "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
}

health_check() {
    log_info "Running health checks..."

    local services=("frontend" "api" "postgres" "redis")
    local failed_services=()

    for service in "${services[@]}"; do
        if docker-compose -f docker-compose.dev.yml ps "$service" | grep -q "Up (healthy)"; then
            log_success "$service: ✅ Healthy"
        else
            log_error "$service: ❌ Unhealthy"
            failed_services+=("$service")
        fi
    done

    if [[ ${#failed_services[@]} -eq 0 ]]; then
        log_success "All services are healthy"
    else
        log_error "Unhealthy services: ${failed_services[*]}"
        exit 1
    fi
}

# Help function
help() {
    echo "Development Environment Manager"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start development environment"
    echo "  stop        Stop development environment"
    echo "  restart     Restart development environment"
    echo "  reset       Reset development environment (removes all data)"
    echo "  logs [svc]  Show logs for all or specific service"
    echo "  shell [svc] Open shell in service"
    echo "  db-reset    Reset database"
    echo "  backup      Create backup"
    echo "  status      Show status and resource usage"
    echo "  health      Run health checks"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 logs api"
    echo "  $0 shell postgres"
}

# Main command handling
case "${1:-help}" in
    "start")
        start_dev
        ;;
    "stop")
        stop_dev
        ;;
    "restart")
        restart_dev
        ;;
    "reset")
        reset_dev
        ;;
    "logs")
        logs "${2:-}"
        ;;
    "shell")
        shell "${2:-frontend}"
        ;;
    "db-reset")
        db_reset
        ;;
    "backup")
        backup
        ;;
    "status")
        status
        ;;
    "health")
        health_check
        ;;
    "help"|*)
        help
        ;;
esac
```

### Production Deployment Script
```bash
#!/bin/bash
# scripts/prod-deploy.sh

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
REGISTRY="ghcr.io/zoe-solar"

echo "🚀 Deploying ZOE Solar to $ENVIRONMENT"
echo "Version: $VERSION"

# Pre-deployment validation
validate_deployment() {
    echo "🔍 Validating deployment..."

    # Check if image exists
    if ! docker manifest inspect "$REGISTRY/zoe-solar-web:$VERSION" > /dev/null 2>&1; then
        echo "❌ Image not found: $REGISTRY/zoe-solar-web:$VERSION"
        exit 1
    fi

    # Security scan
    echo "🔒 Running security scan..."
    trivy image --severity HIGH,CRITICAL "$REGISTRY/zoe-solar-web:$VERSION"

    echo "✅ Validation completed"
}

# Blue-green deployment
blue_green_deploy() {
    local current_blue=true
    local target_service="zoe-solar-web-green"

    # Determine current active service
    if kubectl get service zoe-solar-web-lb -n $ENVIRONMENT -o jsonpath='{.spec.selector.color}' | grep -q "blue"; then
        current_blue=true
        target_service="zoe-solar-web-green"
    else
        current_blue=false
        target_service="zoe-solar-web-blue"
    fi

    echo "🔄 Current active: $([ "$current_blue" = true ] && echo "blue" || echo "green")"
    echo "🚀 Deploying to: $([ "$current_blue" = true ] && echo "green" || echo "blue")"

    # Deploy to target environment
    kubectl set image deployment/$target_service zoe-solar-web="$REGISTRY/zoe-solar-web:$VERSION" -n $ENVIRONMENT
    kubectl rollout status deployment/$target_service -n $ENVIRONMENT --timeout=600s

    # Scale up target environment
    kubectl scale deployment $target_service --replicas=3 -n $ENVIRONMENT

    # Wait for readiness
    echo "⏳ Waiting for deployment to be ready..."
    sleep 60

    # Health checks
    echo "🏥 Running health checks..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if kubectl get pods -n $ENVIRONMENT -l color=$([ "$current_blue" = true ] && echo "green" || echo "blue") -o jsonpath='{.items[*].status.phase}' | grep -q "Running"; then
            echo "✅ Health checks passed"
            break
        fi

        if [ $attempt -eq $max_attempts ]; then
            echo "❌ Health checks failed"
            rollback
            exit 1
        fi

        echo "⏳ Attempt $attempt/$max_attempts..."
        sleep 10
        ((attempt++))
    done

    # Switch traffic
    echo "🔄 Switching traffic..."
    kubectl patch service zoe-solar-web-lb -n $ENVIRONMENT -p '{"spec":{"selector":{"color":"'$([ "$current_blue" = true ] && echo "green" || echo "blue")'"}}}'

    # Wait for traffic switch
    sleep 30

    echo "✅ Deployment completed successfully"
}

# Rollback function
rollback() {
    echo "🔄 Rolling back deployment..."

    local current_service=$(kubectl get service zoe-solar-web-lb -n $ENVIRONMENT -o jsonpath='{.spec.selector.color}')
    local rollback_service="blue"

    if [[ $current_service == "blue" ]]; then
        rollback_service="green"
    fi

    kubectl patch service zoe-solar-web-lb -n $ENVIRONMENT -p '{"spec":{"selector":{"color":"'$rollback_service'"}}}'
    kubectl rollout status deployment/zoe-solar-web-$rollback_service -n $ENVIRONMENT

    echo "✅ Rollback completed"
}

# Post-deployment verification
verify_deployment() {
    echo "🔍 Verifying deployment..."

    # Smoke tests
    ./scripts/smoke-tests.sh "https://$ENVIRONMENT.zoe-solar.de"

    # Performance check
    lighthouse "https://$ENVIRONMENT.zoe-solar.de" --output=json --output-path="./lighthouse-$ENVIRONMENT.json" --quiet

    # Security scan
    zap-baseline.py -t "https://$ENVIRONMENT.zoe-solar.de" -J

    echo "✅ Verification completed"
}

# Main deployment flow
main() {
    case "${1:-deploy}" in
        "deploy")
            validate_deployment
            blue_green_deploy
            verify_deployment
            ;;
        "rollback")
            rollback
            ;;
        *)
            echo "Usage: $0 {deploy|rollback} [environment] [version]"
            exit 1
            ;;
    esac
}

main "$@"
```

---

## 📚 Usage Examples

### Quick Start Development
```bash
# Start development environment
./scripts/dev-manager.sh start

# View logs
./scripts/dev-manager.sh logs

# Open shell in frontend
./scripts/dev-manager.sh shell frontend

# Reset database
./scripts/dev-manager.sh db-reset

# Create backup
./scripts/dev-manager.sh backup

# Stop environment
./scripts/dev-manager.sh stop
```

### Run Tests
```bash
# Run all tests
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Run only E2E tests
docker-compose -f docker-compose.test.yml up test-frontend

# Run performance tests
docker-compose -f docker-compose.load-test.yml up --build

# View test results
ls -la test-results/
```

### Deploy to Production
```bash
# Deploy to production
./scripts/prod-deploy.sh production v1.2.3

# Deploy to staging
./scripts/prod-deploy.sh staging latest

# Rollback deployment
./scripts/prod-deploy.sh rollback production
```

### Monitoring Setup
```bash
# Start monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# Access Grafana
echo "Grafana: http://localhost:3000 (admin/admin)"

# Access Prometheus
echo "Prometheus: http://localhost:9090"

# Access AlertManager
echo "AlertManager: http://localhost:9093"
```

---

**🐳 Docker Compose Examples Version:** 1.0.0
**🛠️ Environments:** Development, Testing, Production
**📊 Monitoring:** Full Stack Observability
**🚀 Deployment:** Blue-Green & Canary
**🔧 Automation:** Scripts & Management Tools
**📅 Last Update:** 17. November 2025
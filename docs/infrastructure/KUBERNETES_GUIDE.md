# ☸️ ZOE Solar Kubernetes Guide

## 📋 Overview

Dieser Guide etabliert eine umfassende Kubernetes-Infrastruktur für die ZOE Solar React-Anwendung mit High Availability, Auto-Scaling, Service Mesh, Monitoring und Security Best Practices.

---

## 🏗️ Kubernetes Architecture

### Cluster Architecture
```yaml
# Cluster Overview
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
├─────────────────────────────────────────────────────────────┤
│  Master Plane (Control Plane)                               │
│  ├─ API Server (kube-apiserver)                           │
│  ├─ etcd (distributed key-value store)                     │
│  ├─ Controller Manager (kube-controller-manager)           │
│  └─ Scheduler (kube-scheduler)                            │
├─────────────────────────────────────────────────────────────┤
│  Worker Nodes                                               │
│  ├─ Frontend Pods (React Application)                      │
│  ├─ API Pods (Node.js Backend)                            │
│  ├─ Database Pods (PostgreSQL)                             │
│  ├─ Cache Pods (Redis)                                    │
│  └─ Infrastructure Pods (Nginx, Monitoring)                │
├─────────────────────────────────────────────────────────────┤
│  Networking                                                │
│  ├─ Ingress Controller (Nginx/Traefik)                    │
│  ├─ Service Mesh (Istio/Linkerd)                          │
│  ├─ Load Balancer (MetalLB/Cloud LB)                      │
│  └─ DNS (CoreDNS)                                          │
├─────────────────────────────────────────────────────────────┤
│  Storage                                                   │
│  ├─ Persistent Volumes (PV)                               │
│  ├─ Persistent Volume Claims (PVC)                         │
│  ├─ Storage Classes (GP2, SSD, Database)                  │
│  └─ CSI Drivers                                            │
└─────────────────────────────────────────────────────────────┘
```

### Environment Strategy
```yaml
# Kubernetes Environments
Environments:
  development:
    namespace: zoe-solar-dev
    replicas: 1
    resources: minimal
    monitoring: basic

  staging:
    namespace: zoe-solar-staging
    replicas: 2
    resources: medium
    monitoring: full

  production:
    namespace: zoe-solar-prod
    replicas: 3-5
    resources: production
    monitoring: full + APM
    multi_az: true
    backup: true
```

---

## 🔧 Core Kubernetes Resources

### Namespace Configuration
```yaml
# k8s/namespaces/namespace-dev.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zoe-solar-dev
  labels:
    name: zoe-solar-dev
    environment: development
    project: zoe-solar
  annotations:
    description: "Development environment for ZOE Solar application"
    contact: "devops@zoe-solar.de"

---
# k8s/namespaces/namespace-staging.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zoe-solar-staging
  labels:
    name: zoe-solar-staging
    environment: staging
    project: zoe-solar
  annotations:
    description: "Staging environment for ZOE Solar application"
    contact: "devops@zoe-solar.de"

---
# k8s/namespaces/namespace-prod.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zoe-solar-prod
  labels:
    name: zoe-solar-prod
    environment: production
    project: zoe-solar
  annotations:
    description: "Production environment for ZOE Solar application"
    contact: "devops@zoe-solar.de"
```

### ConfigMap Configuration
```yaml
# k8s/configmaps/app-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: zoe-solar-config
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: config
data:
  # Application Configuration
  NODE_ENV: "production"
  API_VERSION: "v1"
  LOG_LEVEL: "info"

  # Feature Flags
  ENABLE_ANALYTICS: "true"
  ENABLE_CHAT: "true"
  ENABLE_CALCULATOR: "true"
  ENABLE_APM: "true"

  # Rate Limiting
  RATE_LIMIT_WINDOW: "900000"  # 15 minutes
  RATE_LIMIT_MAX: "100"

  # Cache Configuration
  CACHE_TTL: "300"
  CACHE_MAX_SIZE: "1000"

  # File Uploads
  MAX_FILE_SIZE: "10485760"  # 10MB
  ALLOWED_FILE_TYPES: "jpg,jpeg,png,pdf,doc,docx"

  # Session Management
  SESSION_TIMEOUT: "3600"
  COOKIE_SECURE: "true"
  COOKIE_SAMESITE: "strict"

  # CORS Configuration
  CORS_ORIGINS: "https://zoe-solar.de,https://www.zoe-solar.de"
  CORS_METHODS: "GET,POST,PUT,DELETE,OPTIONS"
  CORS_HEADERS: "Content-Type,Authorization"

  # WebSocket Configuration
  WS_HEARTBEAT_INTERVAL: "30000"
  WS_MAX_CONNECTIONS: "1000"

---

# k8s/configmaps/nginx-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: nginx
data:
  nginx.conf: |
    user nginx;
    worker_processes auto;
    error_log /var/log/nginx/error.log warn;
    pid /var/run/nginx.pid;

    events {
        worker_connections 1024;
        use epoll;
        multi_accept on;
    }

    http {
        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        # Logging
        log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for" '
                        'rt=$request_time uct="$upstream_connect_time" '
                        'uht="$upstream_header_time" urt="$upstream_response_time"';

        access_log /var/log/nginx/access.log main;

        # Performance
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        client_max_body_size 20M;

        # Gzip
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_comp_level 6;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Rate Limiting
        limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
        limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

        # Upstream
        upstream backend {
            server zoe-solar-web:3000;
            keepalive 32;
        }

        # Server Configuration
        server {
            listen 80;
            server_name zoe-solar.de www.zoe-solar.de;

            # Security Headers
            add_header X-Frame-Options "SAMEORIGIN" always;
            add_header X-Content-Type-Options "nosniff" always;
            add_header X-XSS-Protection "1; mode=block" always;
            add_header Referrer-Policy "strict-origin-when-cross-origin" always;

            # Rate Limiting
            limit_req zone=general burst=50 nodelay;

            # Static Files
            location /static/ {
                expires 1y;
                add_header Cache-Control "public, immutable";
                try_files $uri =404;
            }

            # API Routes
            location /api/ {
                limit_req zone=api burst=20 nodelay;
                proxy_pass http://backend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }

            # SPA Fallback
            location / {
                proxy_pass http://backend;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
    }
```

### Secret Configuration
```yaml
# k8s/secrets/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: zoe-solar-secrets
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: secrets
type: Opaque
data:
  # Base64 encoded values
  DATABASE_URL: <base64-encoded-database-url>
  REDIS_URL: <base64-encoded-redis-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  NOTION_TOKEN: <base64-encoded-notion-token>
  NOTION_DATABASE_ID: <base64-encoded-notion-db-id>
  SENDGRID_API_KEY: <base64-encoded-sendgrid-key>
  SENTRY_DSN: <base64-encoded-sentry-dsn>
  GOOGLE_CREDENTIALS: <base64-encoded-gcp-credentials>
  SSL_CERTIFICATE: <base64-encoded-ssl-cert>
  SSL_PRIVATE_KEY: <base64-encoded-ssl-key>

---

# k8s/secrets/tls-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: zoe-solar-tls
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: tls
type: kubernetes.io/tls
data:
  tls.crt: <base64-encoded-certificate>
  tls.key: <base64-encoded-private-key>
```

### Deployment Configuration
```yaml
# k8s/deployments/frontend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zoe-solar-web
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: frontend
    version: v1.0.0
  annotations:
    deployment.kubernetes.io/revision: "1"
    kubernetes.io/change-cause: "Initial deployment"
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: zoe-solar
      component: frontend
  template:
    metadata:
      labels:
        app: zoe-solar
        component: frontend
        version: v1.0.0
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
      containers:
      - name: zoe-solar-web
        image: ghcr.io/zoe-solar/web:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: zoe-solar-config
              key: NODE_ENV
        - name: API_VERSION
          valueFrom:
            configMapKeyRef:
              name: zoe-solar-config
              key: API_VERSION
        - name: LOG_LEVEL
          valueFrom:
            configMapKeyRef:
              name: zoe-solar-config
              key: LOG_LEVEL
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: REDIS_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        startupProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir:
          sizeLimit: 100Mi
      imagePullSecrets:
      - name: ghcr-secret
      nodeSelector:
        kubernetes.io/os: linux
        node-type: application
      tolerations:
      - key: "application"
        operator: "Equal"
        value: "true"
        effect: "NoSchedule"
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - zoe-solar
                - key: component
                  operator: In
                  values:
                  - frontend
              topologyKey: kubernetes.io/hostname

---

# k8s/deployments/api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zoe-solar-api
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: api
    version: v1.0.0
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: zoe-solar
      component: api
  template:
    metadata:
      labels:
        app: zoe-solar
        component: api
        version: v1.0.0
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        runAsGroup: 1001
        fsGroup: 1001
      containers:
      - name: zoe-solar-api
        image: ghcr.io/zoe-solar/api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3001
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          valueFrom:
            configMapKeyRef:
              name: zoe-solar-config
              key: NODE_ENV
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: REDIS_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: JWT_SECRET
        - name: NOTION_TOKEN
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: NOTION_TOKEN
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: logs
          mountPath: /app/logs
      volumes:
      - name: tmp
        emptyDir: {}
      - name: logs
        emptyDir:
          sizeLimit: 100Mi
      imagePullSecrets:
      - name: ghcr-secret
```

### Service Configuration
```yaml
# k8s/services/frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: zoe-solar-web
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: frontend
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "3000"
    prometheus.io/path: "/metrics"
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: zoe-solar
    component: frontend

---

# k8s/services/api-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: zoe-solar-api
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: api
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "3001"
    prometheus.io/path: "/metrics"
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3001
    protocol: TCP
    name: http
  selector:
    app: zoe-solar
    component: api

---

# k8s/services/database-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: database
spec:
  type: ClusterIP
  ports:
  - port: 5432
    targetPort: 5432
    protocol: TCP
    name: postgres
  selector:
    app: zoe-solar
    component: database

---

# k8s/services/redis-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: cache
spec:
  type: ClusterIP
  ports:
  - port: 6379
    targetPort: 6379
    protocol: TCP
    name: redis
  selector:
    app: zoe-solar
    component: cache
```

### Ingress Configuration
```yaml
# k8s/ingress/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: zoe-solar-ingress
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: ingress
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /$2
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "X-Frame-Options: SAMEORIGIN";
      more_set_headers "X-Content-Type-Options: nosniff";
      more_set_headers "X-XSS-Protection: 1; mode=block";
      more_set_headers "Referrer-Policy: strict-origin-when-cross-origin";
    nginx.ingress.kubernetes.io/proxy-body-size: "20m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "300"
spec:
  tls:
  - hosts:
    - zoe-solar.de
    - www.zoe-solar.de
    secretName: zoe-solar-tls
  rules:
  - host: zoe-solar.de
    http:
      paths:
      - path: /api(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: zoe-solar-api
            port:
              number: 80
      - path: /(.*)
        pathType: Prefix
        backend:
          service:
            name: zoe-solar-web
            port:
              number: 80
  - host: www.zoe-solar.de
    http:
      paths:
      - path: /api(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: zoe-solar-api
            port:
              number: 80
      - path: /(.*)
        pathType: Prefix
        backend:
          service:
            name: zoe-solar-web
            port:
              number: 80

---

# k8s/ingress/cert-manager.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@zoe-solar.de
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
```

---

## 🗄️ Stateful Applications

### PostgreSQL StatefulSet
```yaml
# k8s/statefulsets/postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: database
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: zoe-solar
      component: database
  template:
    metadata:
      labels:
        app: zoe-solar
        component: database
    spec:
      securityContext:
        runAsUser: 999
        runAsGroup: 999
        fsGroup: 999
      containers:
      - name: postgres
        image: postgres:15-alpine
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_DB
          value: zoe_solar_prod
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: POSTGRES_PASSWORD
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        - name: postgres-config
          mountPath: /etc/postgresql/postgresql.conf
          subPath: postgresql.conf
        livenessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - pg_isready
            - -U
            - postgres
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: postgres-config
        configMap:
          name: postgres-config
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
      labels:
        app: zoe-solar
        component: database
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "ssd"
      resources:
        requests:
          storage: 100Gi

---

# k8s/statefulsets/redis.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: cache
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: zoe-solar
      component: cache
  template:
    metadata:
      labels:
        app: zoe-solar
        component: cache
    spec:
      securityContext:
        runAsUser: 999
        runAsGroup: 999
        fsGroup: 999
      containers:
      - name: redis
        image: redis:7-alpine
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 6379
          name: redis
        command:
        - redis-server
        - /etc/redis/redis.conf
        - --requirepass
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: REDIS_PASSWORD
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        - name: redis-config
          mountPath: /etc/redis
        livenessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 5
          periodSeconds: 5
      volumes:
      - name: redis-config
        configMap:
          name: redis-config
  volumeClaimTemplates:
  - metadata:
      name: redis-storage
      labels:
        app: zoe-solar
        component: cache
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: "ssd"
      resources:
        requests:
          storage: 10Gi
```

### Persistent Volume Claims
```yaml
# k8s/storage/pvc-postgres.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: database
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ssd
  resources:
    requests:
      storage: 100Gi

---

# k8s/storage/pvc-redis.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: cache
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ssd
  resources:
    requests:
      storage: 10Gi

---

# k8s/storage/pvc-logs.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: logs-pvc
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: logs
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: nfs
  resources:
    requests:
      storage: 50Gi
```

---

## 🚀 Auto-Scaling Configuration

### Horizontal Pod Autoscaler
```yaml
# k8s/autoscaling/hpa-frontend.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: zoe-solar-web-hpa
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: frontend
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: zoe-solar-web
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
      - type: Pods
        value: 2
        periodSeconds: 60
      selectPolicy: Max

---

# k8s/autoscaling/hpa-api.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: zoe-solar-api-hpa
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: zoe-solar-api
  minReplicas: 2
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  - type: Pods
    pods:
      metric:
        name: http_requests_per_second
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 20
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
      selectPolicy: Max

---

# k8s/autoscaling/vpa.yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: zoe-solar-web-vpa
  namespace: zoe-solar-prod
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: zoe-solar-web
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: zoe-solar-web
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 1000m
        memory: 1Gi
      controlledResources: ["cpu", "memory"]
```

### Cluster Autoscaler
```yaml
# k8s/autoscaling/cluster-autoscaler.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
  labels:
    app: cluster-autoscaler
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.28.0
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/zoe-solar-prod
        - --balance-similar-node-groups
        - --skip-nodes-with-system-pods=false
```

---

## 📊 Monitoring & Observability

### Prometheus Configuration
```yaml
# k8s/monitoring/prometheus.yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: zoe-solar-prometheus
  namespace: monitoring
  labels:
    app: prometheus
    component: monitoring
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: zoe-solar
  ruleSelector:
    matchLabels:
      team: zoe-solar
  replicas: 2
  retention: 30d
  resources:
    requests:
      memory: 400Mi
      cpu: 100m
    limits:
      memory: 2Gi
      cpu: 1000m
  storage:
    volumeClaimTemplate:
      spec:
        storageClassName: ssd
        resources:
          requests:
            storage: 100Gi

---

# k8s/monitoring/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: zoe-solar-web-monitor
  namespace: zoe-solar-prod
  labels:
    team: zoe-solar
    app: zoe-solar
    component: frontend
spec:
  selector:
    matchLabels:
      app: zoe-solar
      component: frontend
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
    scrapeTimeout: 10s

---

# k8s/monitoring/grafana.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
  labels:
    app: grafana
    component: monitoring
spec:
  replicas: 2
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:10.2.0
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_USER
          value: admin
        - name: GF_SECURITY_ADMIN_PASSWORD
          valueFrom:
            secretKeyRef:
              name: grafana-secrets
              key: admin-password
        - name: GF_INSTALL_PLUGINS
          value: "grafana-piechart-panel,grafana-worldmap-panel"
        resources:
          requests:
            memory: 256Mi
            cpu: 100m
          limits:
            memory: 512Mi
            cpu: 200m
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
        - name: grafana-config
          mountPath: /etc/grafana/provisioning
      volumes:
      - name: grafana-storage
        persistentVolumeClaim:
          claimName: grafana-pvc
      - name: grafana-config
        configMap:
          name: grafana-config
```

### Logging Configuration
```yaml
# k8s/logging/fluentd.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: logging
  labels:
    app: fluentd
    component: logging
spec:
  selector:
    matchLabels:
      app: fluentd
  template:
    metadata:
      labels:
        app: fluentd
    spec:
      serviceAccount: fluentd
      serviceAccountName: fluentd
      tolerations:
      - key: node-role.kubernetes.io/master
        effect: NoSchedule
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1.16-debian-elasticsearch7-1
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch.logging.svc.cluster.local"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        - name: FLUENT_ELASTICSEARCH_SCHEME
          value: "http"
        resources:
          limits:
            memory: 512Mi
          requests:
            cpu: 100m
            memory: 200Mi
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: fluentd-config
          mountPath: /fluentd/etc
      terminationGracePeriodSeconds: 30
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: fluentd-config
        configMap:
          name: fluentd-config

---

# k8s/logging/elasticsearch.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: elasticsearch
  namespace: logging
  labels:
    app: elasticsearch
    component: logging
spec:
  serviceName: elasticsearch
  replicas: 3
  selector:
    matchLabels:
      app: elasticsearch
  template:
    metadata:
      labels:
        app: elasticsearch
    spec:
      containers:
      - name: elasticsearch
        image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
        ports:
        - containerPort: 9200
          name: rest
        - containerPort: 9300
          name: inter-node
        env:
        - name: cluster.name
          value: zoe-solar-logs
        - name: node.name
          valueFrom:
            fieldRef:
              fieldPath: metadata.name
        - name: discovery.seed_hosts
          value: "elasticsearch-0.elasticsearch,elasticsearch-1.elasticsearch,elasticsearch-2.elasticsearch"
        - name: cluster.initial_master_nodes
          value: "elasticsearch-0,elasticsearch-1,elasticsearch-2"
        - name: ES_JAVA_OPTS
          value: "-Xms1g -Xmx1g"
        - name: xpack.security.enabled
          value: "false"
        resources:
          requests:
            memory: 2Gi
            cpu: 1000m
          limits:
            memory: 4Gi
            cpu: 2000m
        volumeMounts:
        - name: elasticsearch-data
          mountPath: /usr/share/elasticsearch/data
  volumeClaimTemplates:
  - metadata:
      name: elasticsearch-data
    spec:
      accessModes: ["ReadWriteOnce"]
      storageClassName: ssd
      resources:
        requests:
          storage: 100Gi
```

---

## 🔒 Security Configuration

### Network Policies
```yaml
# k8s/security/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: zoe-solar-network-policy
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: security
spec:
  podSelector:
    matchLabels:
      app: zoe-solar
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
    - protocol: TCP
      port: 3001
  - from:
    - podSelector:
        matchLabels:
          app: zoe-solar
    ports:
    - protocol: TCP
      port: 3000
    - protocol: TCP
      port: 3001
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: TCP
      port: 53
    - protocol: UDP
      port: 53
  - to:
    - namespaceSelector:
        matchLabels:
          name: monitoring
    ports:
    - protocol: TCP
      port: 9090
    - protocol: TCP
      port: 9100
  - to: []
    ports:
    - protocol: TCP
      port: 443
    - protocol: TCP
      port: 80

---

# k8s/security/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: zoe-solar-psp
  labels:
    app: zoe-solar
    component: security
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
  readOnlyRootFilesystem: true
```

### RBAC Configuration
```yaml
# k8s/security/rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: zoe-solar
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: rbac

---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: zoe-solar-role
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: rbac
rules:
- apiGroups: [""]
  resources: ["pods", "services", "configmaps", "secrets"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["autoscaling"]
  resources: ["horizontalpodautoscalers"]
  verbs: ["get", "list", "watch"]

---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: zoe-solar-binding
  namespace: zoe-solar-prod
  labels:
    app: zoe-solar
    component: rbac
subjects:
- kind: ServiceAccount
  name: zoe-solar
  namespace: zoe-solar-prod
roleRef:
  kind: Role
  name: zoe-solar-role
  apiGroup: rbac.authorization.k8s.io
```

---

## 🔧 Deployment Scripts

### Kubernetes Deployment Script
```bash
#!/bin/bash
# scripts/k8s-deploy.sh

set -euo pipefail

# Configuration
NAMESPACE=${1:-zoe-solar-prod}
ENVIRONMENT=${2:-production}
VERSION=${3:-latest}

echo "🚀 Deploying ZOE Solar to Kubernetes"
echo "Namespace: $NAMESPACE"
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Pre-deployment checks
pre_deploy_checks() {
    log_info "Running pre-deployment checks..."

    # Check kubectl connection
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi

    # Check namespace exists
    if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log_warning "Namespace $NAMESPACE does not exist, creating it..."
        kubectl create namespace "$NAMESPACE"
    fi

    # Check resource quotas
    log_info "Checking resource quotas..."
    kubectl describe quota -n "$NAMESPACE" || log_warning "No resource quotas defined"

    log_success "Pre-deployment checks completed"
}

# Apply Kubernetes manifests
apply_manifests() {
    log_info "Applying Kubernetes manifests..."

    # Apply in order
    local manifests=(
        "namespaces"
        "secrets"
        "configmaps"
        "storage"
        "statefulsets"
        "services"
        "deployments"
        "autoscaling"
        "ingress"
        "monitoring"
        "security"
    )

    for manifest in "${manifests[@]}"; do
        log_info "Applying $manifest..."
        kubectl apply -f "k8s/$manifest/" -n "$NAMESPACE" --recursive
    done

    log_success "Manifests applied successfully"
}

# Wait for rollout
wait_for_rollout() {
    log_info "Waiting for rollout to complete..."

    local deployments=(
        "zoe-solar-web"
        "zoe-solar-api"
        "postgres"
        "redis"
    )

    for deployment in "${deployments[@]}"; do
        log_info "Waiting for $deployment rollout..."
        kubectl rollout status deployment/"$deployment" -n "$NAMESPACE" --timeout=600s
    done

    log_success "Rollout completed successfully"
}

# Health checks
health_checks() {
    log_info "Running health checks..."

    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=zoe-solar -n "$NAMESPACE" --timeout=300s

    # Check service endpoints
    kubectl get endpoints -n "$NAMESPACE"

    # Test application health
    local ingress_url=$(kubectl get ingress zoe-solar-ingress -n "$NAMESPACE" -o jsonpath='{.spec.rules[0].host}')

    if curl -f -s "https://$ingress_url/health" > /dev/null; then
        log_success "Application health check passed"
    else
        log_error "Application health check failed"
        exit 1
    fi
}

# Post-deployment verification
verify_deployment() {
    log_info "Running post-deployment verification..."

    # Check pod status
    log_info "Pod status:"
    kubectl get pods -n "$NAMESPACE" -l app=zoe-solar

    # Check services
    log_info "Service status:"
    kubectl get services -n "$NAMESPACE" -l app=zoe-solar

    # Check HPA status
    log_info "HPA status:"
    kubectl get hpa -n "$NAMESPACE" -l app=zoe-solar

    # Check resource usage
    log_info "Resource usage:"
    kubectl top pods -n "$NAMESPACE" -l app=zoe-solar

    log_success "Verification completed"
}

# Rollback function
rollback() {
    log_warning "Initiating rollback..."

    # Get last successful revision
    local last_revision=$(kubectl rollout history deployment/zoe-solar-web -n "$NAMESPACE" | awk 'NR==2{print $1}')

    log_info "Rolling back to revision $last_revision"
    kubectl rollout undo deployment/zoe-solar-web -n "$NAMESPACE" --to-revision="$last_revision"
    kubectl rollout undo deployment/zoe-solar-api -n "$NAMESPACE" --to-revision="$last_revision"

    wait_for_rollout
    health_checks

    log_success "Rollback completed"
}

# Main deployment function
deploy() {
    pre_deploy_checks
    apply_manifests
    wait_for_rollout
    health_checks
    verify_deployment

    log_success "Deployment completed successfully!"
}

# Main command handling
case "${1:-deploy}" in
    "deploy")
        deploy "$@"
        ;;
    "rollback")
        rollback
        ;;
    "status")
        kubectl get all -n "$NAMESPACE" -l app=zoe-solar
        ;;
    "logs")
        kubectl logs -f -n "$NAMESPACE" -l app=zoe-solar --all-containers=true
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|status|logs} [namespace] [environment] [version]"
        exit 1
        ;;
esac
```

### Cluster Setup Script
```bash
#!/bin/bash
# scripts/setup-cluster.sh

set -euo pipefail

# Configuration
CLUSTER_NAME=${1:-zoe-solar-prod}
NODE_COUNT=${2:-3}
NODE_TYPE=${3:-t3.medium}
REGION=${4:-eu-central-1}

echo "🏗️ Setting up Kubernetes cluster"
echo "Cluster: $CLUSTER_NAME"
echo "Node Count: $NODE_COUNT"
echo "Node Type: $NODE_TYPE"
echo "Region: $REGION"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found. Please install AWS CLI."
        exit 1
    fi

    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found. Please install kubectl."
        exit 1
    fi

    # Check EKS CLI
    if ! command -v eksctl &> /dev/null; then
        log_error "eksctl not found. Please install eksctl."
        exit 1
    fi

    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Please configure AWS CLI."
        exit 1
    fi

    log_success "Prerequisites check completed"
}

# Create EKS cluster
create_cluster() {
    log_info "Creating EKS cluster..."

    # Create cluster config
    cat > cluster-config.yaml << EOF
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: $CLUSTER_NAME
  region: $REGION
  version: "1.28"

iam:
  withOIDC: true

managedNodeGroups:
  - name: zoe-solar-nodes
    instanceType: $NODE_TYPE
    desiredCapacity: $NODE_COUNT
    minSize: 2
    maxSize: 10
    volumeSize: 100
    ssh:
      allow: true
    iam:
      withAddonPolicies:
        autoScaler: true
        cloudWatch: true
        ebs: true
        efs: true
        albIngress: true
    labels:
      node-type: application
    taints:
    - key: "application"
      value: "true"
      effect: "NoSchedule"
    tags:
      Environment: production
      Project: zoe-solar

addons:
  - name: vpc-cni
  - name: coredns
  - name: kube-proxy
  - name: aws-ebs-csi-driver

cloudWatch:
  clusterLogging:
    enable: ["api", "audit", "authenticator", "controllerManager", "scheduler"]
EOF

    # Create cluster
    eksctl create cluster -f cluster-config.yaml

    log_success "EKS cluster created successfully"
}

# Install additional components
install_addons() {
    log_info "Installing additional components..."

    # Update kubeconfig
    aws eks update-kubeconfig --region "$REGION" --name "$CLUSTER_NAME"

    # Install Ingress Controller
    log_info "Installing Nginx Ingress Controller..."
    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/aws/deploy.yaml

    # Install Cert-Manager
    log_info "Installing Cert-Manager..."
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.2/cert-manager.yaml

    # Install Prometheus Operator
    log_info "Installing Prometheus Operator..."
    kubectl apply -f https://github.com/prometheus-operator/prometheus-operator/releases/download/v0.68.0/bundle.yaml

    # Install Cluster Autoscaler
    log_info "Installing Cluster Autoscaler..."
    kubectl apply -f - << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cluster-autoscaler
  namespace: kube-system
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cluster-autoscaler
  template:
    metadata:
      labels:
        app: cluster-autoscaler
    spec:
      containers:
      - image: k8s.gcr.io/autoscaling/cluster-autoscaler:v1.28.0
        name: cluster-autoscaler
        resources:
          limits:
            cpu: 100m
            memory: 300Mi
          requests:
            cpu: 100m
            memory: 300Mi
        command:
        - ./cluster-autoscaler
        - --v=4
        - --stderrthreshold=info
        - --cloud-provider=aws
        - --skip-nodes-with-local-storage=false
        - --expander=least-waste
        - --node-group-auto-discovery=asg:tag=k8s.io/cluster-autoscaler/enabled,k8s.io/cluster-autoscaler/$CLUSTER_NAME
EOF

    log_success "Additional components installed successfully"
}

# Configure storage classes
configure_storage() {
    log_info "Configuring storage classes..."

    # Create SSD storage class
    kubectl apply -f - << EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ssd
  annotations:
    storageclass.kubernetes.io/is-default-class: "true"
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp3
  iops: "3000"
  throughput: "125"
  fsType: ext4
reclaimPolicy: Retain
allowVolumeExpansion: true
volumeBindingMode: WaitForFirstConsumer
EOF

    log_success "Storage classes configured"
}

# Setup monitoring
setup_monitoring() {
    log_info "Setting up monitoring..."

    # Create monitoring namespace
    kubectl create namespace monitoring

    # Install Prometheus
    kubectl apply -f - << EOF
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
  namespace: monitoring
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: frontend
  resources:
    requests:
      memory: 400Mi
      cpu: 100m
    limits:
      memory: 2Gi
      cpu: 1000m
  retention: 30d
EOF

    log_success "Monitoring setup completed"
}

# Main function
main() {
    check_prerequisites
    create_cluster
    install_addons
    configure_storage
    setup_monitoring

    log_success "Cluster setup completed successfully!"
    log_info "You can now deploy the ZOE Solar application:"
    log_info "  ./scripts/k8s-deploy.sh deploy zoe-solar-prod production latest"
}

main "$@"
```

---

## 📚 Best Practices

### Kubernetes Best Practices
1. **Resource Management** - Set requests and limits for all containers
2. **Security** - Use non-root users, network policies, RBAC
3. **High Availability** - Multi-replica deployments across AZs
4. **Monitoring** - Comprehensive observability with Prometheus/Grafana
5. **Backup** - Regular backups of etcd and persistent data
6. **Updates** - Use rolling updates with proper health checks
7. **Scaling** - Implement HPA and VPA for auto-scaling

### Production Checklist
- [ ] Namespace and RBAC configured
- [ ] Secrets management implemented
- [ ] Resource requests and limits set
- [ ] Health checks configured
- [ ] Auto-scaling enabled
- [ ] Monitoring and alerting configured
- [ ] Backup strategy implemented
- [ ] Security policies applied
- [ ] Ingress and TLS configured
- [ ] Logging and tracing enabled

---

**☸️ Kubernetes Guide Version:** 1.0.0
**🏗️ Architecture:** High Availability
**🚀 Auto-Scaling:** HPA & VPA
**📊 Monitoring:** Full Stack Observability
**🔒 Security:** Network Policies & RBAC
**📅 Last Update:** 17. November 2025
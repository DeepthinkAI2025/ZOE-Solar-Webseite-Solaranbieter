# 🚀 Advanced Infrastructure Guide

## 📋 Overview

Dieser Guide etabliert fortgeschrittene Infrastruktur-Konzepte für die ZOE Solar Plattform inklusive Service Mesh, Multi-Cloud-Strategien, Disaster Recovery, GitOps und Cloud-Native Best Practices.

---

## 🔗 Service Mesh Implementation

### Istio Service Mesh Configuration
```yaml
# istio/istio-install.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: zoe-solar-istio
  namespace: istio-system
spec:
  profile: production
  values:
    global:
      meshID: mesh1
      network: network1
    pilot:
      autoscaleEnabled: true
      autoscaleMin: 2
      autoscaleMax: 5
    gateways:
      istio-ingressgateway:
        autoscaleEnabled: true
        autoscaleMin: 2
        autoscaleMax: 5
    components:
      ingressGateways:
        name: istio-ingressgateway
        enabled: true
      egressGateways:
        name: istio-egressgateway
        enabled: true

---

# istio/gateway.yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: zoe-solar-gateway
  namespace: zoe-solar-prod
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: zoe-solar-tls
    hosts:
    - zoe-solar.de
    - www.zoe-solar.de
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - zoe-solar.de
    - www.zoe-solar.de
    tls:
      httpsRedirect: true

---

# istio/virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: zoe-solar-vs
  namespace: zoe-solar-prod
spec:
  hosts:
  - zoe-solar.de
  - www.zoe-solar.de
  gateways:
  - zoe-solar-gateway
  http:
  - match:
    - uri:
        prefix: /api
    route:
    - destination:
        host: zoe-solar-api
        port:
          number: 3001
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
    fault:
      delay:
        percentage:
          value: 0.1
        fixedDelay: 5s
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: zoe-solar-web
        port:
          number: 3000
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s

---

# istio/destination-rule.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: zoe-solar-dr
  namespace: zoe-solar-prod
spec:
  host: zoe-solar-web
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        maxRequestsPerConnection: 10
    circuitBreaker:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
      minHealthPercent: 50
    outlierDetection:
      consecutiveErrors: 3
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 100
      minHealthPercent: 50
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2

---

# istio/authorization-policy.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: zoe-solar-authz
  namespace: zoe-solar-prod
spec:
  selector:
    matchLabels:
      app: zoe-solar
  action: ALLOW
  rules:
  - from:
    - source:
        principals: ["cluster.local/ns/istio-system/sa/istio-ingressgateway-service-account"]
  - to:
    - operation:
        methods: ["GET", "POST", "PUT", "DELETE"]
        paths: ["/api/*"]
  - when:
    - key: request.auth.claims[role]
      values: ["admin", "user"]
```

### Linkerd Service Mesh
```yaml
# linkerd/linkerd-install.yaml
apiVersion: linkerd.io/v1alpha1
kind: Linkerd
metadata:
  name: linkerd-config
spec:
  identity:
    issuer:
      tls:
        crtPEM: |
          -----BEGIN CERTIFICATE-----
          ... certificate data ...
          -----END CERTIFICATE-----
        keyPEM: |
          -----BEGIN RSA PRIVATE KEY-----
          ... private key data ...
          -----END RSA PRIVATE KEY-----

---

# linkerd/proxy-injection.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: zoe-solar-prod
  annotations:
    linkerd.io/inject: enabled
    config.linkerd.io/proxy-await: "enabled"

---

# linkerd/service-profile.yaml
apiVersion: linkerd.io/v1alpha2
kind: ServiceProfile
metadata:
  name: zoe-solar-api
  namespace: zoe-solar-prod
spec:
  routes:
  - name: health
    condition:
      method: GET
      pathRegex: /health
    isRetryable: true
    timeout: 10s
  - name: api
    condition:
      method: GET
      pathRegex: /api/.*
    isRetryable: true
    timeout: 30s
    retries:
      budget:
        retryRatio: 0.2
        minRetriesPerSecond: 10
        percentile: 0.9
      timeout: 5s
  - name: heavy-api
    condition:
      method: POST
      pathRegex: /api/calculate
    isRetryable: false
    timeout: 60s
    responseClasses:
      - condition:
          status:
            min: 500
            max: 599
        isFailure: true
```

---

## 🌐 Multi-Cloud Strategy

### Multi-Cluster Configuration
```yaml
# multi-cluster/cluster-registry.yaml
apiVersion: registry.k8s.io/v1alpha1
kind: Cluster
metadata:
  name: cluster-prod-eu-central
  labels:
    region: eu-central-1
    environment: production
spec:
  apiEndpoint: https://E1A93B92C33234106A43.gr7.eu-central-1.eks.amazonaws.com
  caBundle: |
    -----BEGIN CERTIFICATE-----
    ... CA bundle data ...
    -----END CERTIFICATE-----

---
apiVersion: registry.k8s.io/v1alpha1
kind: Cluster
metadata:
  name: cluster-prod-us-west
  labels:
    region: us-west-2
    environment: production
spec:
  apiEndpoint: https://ABC123DEF4567890AB.gr7.us-west-2.eks.amazonaws.com
  caBundle: |
    -----BEGIN CERTIFICATE-----
    ... CA bundle data ...
    -----END CERTIFICATE-----

---

# multi-cluster/federation.yaml
apiVersion: core.kubefed.io/v1beta1
kind: KubeFedCluster
metadata:
  name: cluster-prod-eu-central
  namespace: kube-federation-system
spec:
  apiEndpoint: https://E1A93B92C33234106A43.gr7.eu-central-1.eks.amazonaws.com
  caBundle: |
    -----BEGIN CERTIFICATE-----
    ... CA bundle data ...
    -----END CERTIFICATE-----
  secretRef:
    name: cluster-prod-eu-central-secret
---
apiVersion: core.kubefed.io/v1beta1
kind: KubeFedCluster
metadata:
  name: cluster-prod-us-west
  namespace: kube-federation-system
spec:
  apiEndpoint: https://ABC123DEF4567890AB.gr7.us-west-2.eks.amazonaws.com
  caBundle: |
    -----BEGIN CERTIFICATE-----
    ... CA bundle data ...
    -----END CERTIFICATE-----
  secretRef:
    name: cluster-prod-us-west-secret
```

### Global Load Balancing
```yaml
# multi-cluster/global-ingress.yaml
apiVersion: networking.gke.io/v1beta1
kind: MultiClusterIngress
metadata:
  name: zoe-solar-mci
  namespace: zoe-solar-prod
  annotations:
    networking.gke.io/static-ip: "zoe-solar-global-ip"
    networking.gke.io/pre-shared-cert: "zoe-solar-ssl-cert"
spec:
  template:
    spec:
      rules:
      - host: zoe-solar.de
        http:
          paths:
          - path: /api
            backend:
              serviceName: zoe-solar-api
              servicePort: 80
          - path: /*
            backend:
              serviceName: zoe-solar-web
              servicePort: 80

---

# multi-cluster/global-service.yaml
apiVersion: networking.gke.io/v1beta1
kind: MultiClusterService
metadata:
  name: zoe-solar-web-mcs
  namespace: zoe-solar-prod
  annotations:
    alpha.cloud.google.com/load-balancing-type: "Internal"
spec:
  template:
    spec:
      selector:
        app: zoe-solar
        component: frontend
      ports:
      - name: http
        protocol: TCP
        port: 80
        targetPort: 3000
      clusters:
      - name: cluster-prod-eu-central
      - name: cluster-prod-us-west
```

### Disaster Recovery Setup
```yaml
# disaster-recovery/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: zoe-solar-backup
  namespace: zoe-solar-prod
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - /bin/bash
            - -c
            - |
              # Database backup
              pg_dump -h postgres -U postgres zoe_solar_prod | gzip > /backup/db-$(date +%Y%m%d-%H%M%S).sql.gz

              # Application data backup
              tar -czf /backup/app-data-$(date +%Y%m%d-%H%M%S).tar.gz /app/data

              # Upload to S3
              aws s3 sync /backup/ s3://zoe-solar-backups/$(date +%Y-%m-%d)/

              # Cleanup old backups (keep 30 days)
              aws s3 ls s3://zoe-solar-backups/ --recursive | while read -r line; do
                createDate=$(echo $line | awk '{print $1" "$2}')
                createDate=$(date -d "$createDate" +%s)
                olderThan=$(date -d "30 days ago" +%s)
                if [[ $createDate -lt $olderThan ]]; then
                  fileName=$(echo $line | awk '{print $4}')
                  if [[ $fileName != "" ]]; then
                    aws s3 rm s3://zoe-solar-backups/$fileName
                  fi
                fi
              done
            env:
            - name: PGPASSWORD
              valueFrom:
                secretKeyRef:
                  name: zoe-solar-secrets
                  key: POSTGRES_PASSWORD
            - name: AWS_ACCESS_KEY_ID
              valueFrom:
                secretKeyRef:
                  name: aws-credentials
                  key: access-key-id
            - name: AWS_SECRET_ACCESS_KEY
              valueFrom:
                secretKeyRef:
                  name: aws-credentials
                  key: secret-access-key
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            emptyDir: {}
          restartPolicy: OnFailure
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1

---

# disaster-recovery/restore-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: zoe-solar-restore
  namespace: zoe-solar-prod
spec:
  template:
    spec:
      containers:
      - name: restore
        image: postgres:15-alpine
        command:
        - /bin/bash
        - -c
        - |
          # Download backup from S3
          aws s3 cp s3://zoe-solar-backups/$BACKUP_DATE/db-$BACKUP_DATE.sql.gz /tmp/backup.sql.gz

          # Restore database
          gunzip -c /tmp/backup.sql.gz | psql -h postgres -U postgres -d zoe_solar_prod

          echo "Database restore completed successfully"
        env:
        - name: BACKUP_DATE
          value: "2024-01-15"
        - name: PGPASSWORD
          valueFrom:
            secretKeyRef:
              name: zoe-solar-secrets
              key: POSTGRES_PASSWORD
        - name: AWS_ACCESS_KEY_ID
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: access-key-id
        - name: AWS_SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: aws-credentials
              key: secret-access-key
      restartPolicy: Never
```

---

## 🔁 GitOps Implementation

### ArgoCD Configuration
```yaml
# argocd/argocd-install.yaml
apiVersion: argoproj.io/v1alpha1
kind: ArgoCD
metadata:
  name: argocd
  namespace: argocd
spec:
  server:
    route:
      enabled: true
    tls:
      selfSigned: true
  controller:
    processors: {}
    resourceTrackingMethod: label
  notifications:
    enabled: true

---

# argocd/application.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: zoe-solar-prod
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: https://github.com/zoe-solar/infrastructure.git
    targetRevision: main
    path: k8s/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: zoe-solar-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
    - CreateNamespace=true
    - PrunePropagationPolicy=foreground
    - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  revisionHistoryLimit: 3
  ignoreDifferences:
  - group: apps
    kind: Deployment
    jsonPointers:
    - /spec/replicas

---

# argocd/appset.yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: zoe-solar-env-appset
  namespace: argocd
spec:
  generators:
  - git:
      repoURL: https://github.com/zoe-solar/infrastructure.git
      revision: HEAD
      directories:
      - path: environments/*
  template:
    metadata:
      name: 'zoe-solar-{{path.basename}}'
      namespace: argocd
    spec:
      project: default
      source:
        repoURL: https://github.com/zoe-solar/infrastructure.git
        targetRevision: HEAD
        path: '{{path}}'
      destination:
        server: https://kubernetes.default.svc
        namespace: 'zoe-solar-{{path.basename}}'
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
```

### Flux CD Configuration
```yaml
# fluxcd/gitrepository.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: GitRepository
metadata:
  name: zoe-solar-infrastructure
  namespace: flux-system
spec:
  interval: 30s
  ref:
    branch: main
  secretRef:
    name: flux-system
  url: ssh://git@github.com/zoe-solar/infrastructure.git

---

# fluxcd/kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: zoe-solar-prod
  namespace: flux-system
spec:
  interval: 5m
  path: ./k8s/overlays/production
  prune: true
  wait: true
  sourceRef:
    kind: GitRepository
    name: zoe-solar-infrastructure
  healthChecks:
  - apiVersion: apps/v1
    kind: Deployment
    name: zoe-solar-web
    namespace: zoe-solar-prod
  - apiVersion: apps/v1
    kind: Deployment
    name: zoe-solar-api
    namespace: zoe-solar-prod
  postBuild:
    substitute:
      CLUSTER_NAME: "zoe-solar-prod"
      ENVIRONMENT: "production"
    substituteFrom:
    - kind: ConfigMap
      name: cluster-vars
```

---

## 🚀 Advanced Deployment Strategies

### Blue-Green Deployment with Istio
```yaml
# blue-green/blue-green-virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: zoe-solar-blue-green
  namespace: zoe-solar-prod
spec:
  hosts:
  - zoe-solar.de
  gateways:
  - zoe-solar-gateway
  http:
  - match:
    - headers:
        x-destination:
          exact: blue
    route:
    - destination:
        host: zoe-solar-web
        subset: blue
  - match:
    - headers:
        x-destination:
          exact: green
    route:
    - destination:
        host: zoe-solar-web
        subset: green
  - route:
    - destination:
        host: zoe-solar-web
        subset: blue
      weight: 100

---

# blue-green/canary-virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: zoe-solar-canary
  namespace: zoe-solar-prod
spec:
  hosts:
  - zoe-solar.de
  gateways:
  - zoe-solar-gateway
  http:
  - match:
    - headers:
        x-destination:
          exact: canary
    route:
    - destination:
        host: zoe-solar-web
        subset: canary
  - route:
    - destination:
        host: zoe-solar-web
        subset: stable
      weight: 90
    - destination:
        host: zoe-solar-web
        subset: canary
      weight: 10
```

### A/B Testing Configuration
```yaml
# ab-testing/ab-virtual-service.yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: zoe-solar-ab-test
  namespace: zoe-solar-prod
spec:
  hosts:
  - zoe-solar.de
  gateways:
  - zoe-solar-gateway
  http:
  - match:
    - headers:
        x-user-group:
          exact: beta
    route:
    - destination:
        host: zoe-solar-web
        subset: beta
  - match:
    - headers:
        x-user-group:
          exact: control
    route:
    - destination:
        host: zoe-solar-web
        subset: control
  - route:
    - destination:
        host: zoe-solar-web
        subset: control
      weight: 50
    - destination:
        host: zoe-solar-web
        subset: beta
      weight: 50

---

# ab-testing/destination-rule.yaml
apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: zoe-solar-ab-dr
  namespace: zoe-solar-prod
spec:
  host: zoe-solar-web
  subsets:
  - name: control
    labels:
      version: control
  - name: beta
    labels:
      version: beta
  trafficPolicy:
    loadBalancer:
      consistentHash:
        httpHeaderName: user-id
```

---

## 📊 Advanced Monitoring

### Distributed Tracing with Jaeger
```yaml
# tracing/jaeger.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: tracing
  labels:
    app: jaeger
    component: tracing
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 16686
          name: ui
        - containerPort: 14268
          name: http-collector
        env:
        - name: COLLECTOR_ZIPKIN_HOST_PORT
          value: ":9411"
        - name: SPAN_STORAGE_TYPE
          value: elasticsearch
        - name: ES_SERVER_URLS
          value: http://elasticsearch:9200
        resources:
          requests:
            memory: 256Mi
            cpu: 100m
          limits:
            memory: 512Mi
            cpu: 200m

---

# tracing/jaeger-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: jaeger
  namespace: tracing
  labels:
    app: jaeger
    component: tracing
spec:
  type: ClusterIP
  ports:
  - port: 16686
    targetPort: 16686
    name: ui
  - port: 14268
    targetPort: 14268
    name: http-collector
  selector:
    app: jaeger

---

# tracing/jaeger-istio.yaml
apiVersion: install.istio.io/v1alpha1
kind: IstioOperator
metadata:
  name: zoe-solar-tracing
  namespace: istio-system
spec:
  values:
    telemetry:
      v2:
        enabled: true
      prometheus:
        enabled: true
      tracing:
        sampling: 100
        jaeger:
          # Enable Jaeger tracing
          # For production, use a dedicated Jaeger deployment
          enabled: false
```

### OpenTelemetry Configuration
```yaml
# tracing/opentelemetry.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: opentelemetry-config
  namespace: zoe-solar-prod
data:
  config.yaml: |
    receiver:
      otlp:
        protocols:
          grpc:
            endpoint: 0.0.0.0:4317
          http:
            endpoint: 0.0.0.0:4318
    processor:
      batch:
        timeout: 1s
        send_batch_size: 1024
      memory_limiter:
        limit_mib: 512
    exporter:
      jaeger:
        endpoint: jaeger:14250
        tls:
          insecure: true
      prometheus:
        endpoint: "0.0.0.0:8889"
    extensions:
      health_check:
      pprof:
        endpoint: 0.0.0.0:1777
    service:
      extensions: [health_check, pprof]
      pipelines:
        traces:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [jaeger]
        metrics:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [prometheus]
        logs:
          receivers: [otlp]
          processors: [memory_limiter, batch]
          exporters: [jaeger]

---

# tracing/opentelemetry-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: opentelemetry-collector
  namespace: tracing
  labels:
    app: opentelemetry-collector
    component: tracing
spec:
  replicas: 2
  selector:
    matchLabels:
      app: opentelemetry-collector
  template:
    metadata:
      labels:
        app: opentelemetry-collector
    spec:
      containers:
      - name: otel-collector
        image: otel/opentelemetry-collector-contrib:latest
        command:
        - "/otelcol-contrib"
        - "--config=/conf/config.yaml"
        volumeMounts:
        - name: config
          mountPath: /conf
        resources:
          requests:
            memory: 256Mi
            cpu: 100m
          limits:
            memory: 512Mi
            cpu: 200m
      volumes:
      - name: config
        configMap:
          name: opentelemetry-config
```

---

## 🛡️ Advanced Security

### Policy as Code with OPA
```yaml
# security/opa-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: opa-policy
  namespace: zoe-solar-prod
data:
  policy.rego: |
    package zoe.solar.policy

    default allow = false

    allow {
        input.method == "GET"
        input.path = ["api", "projects"]
        is_authenticated(input.user)
        has_permission(input.user, "read:projects")
    }

    allow {
        input.method == "POST"
        input.path = ["api", "projects"]
        is_authenticated(input.user)
        has_permission(input.user, "create:projects")
    }

    is_authenticated(user) {
        user != null
        user.authenticated == true
    }

    has_permission(user, permission) {
        user.permissions[_] == permission
    }

---

# security/opa-sidecar.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zoe-solar-api-with-opa
  namespace: zoe-solar-prod
spec:
  template:
    spec:
      containers:
      - name: zoe-solar-api
        image: ghcr.io/zoe-solar/api:latest
        ports:
        - containerPort: 3001
      - name: opa
        image: openpolicyagent/opa:latest
        args:
        - "run"
        - "--server"
        - "--addr=localhost:8181"
        - "/policy/policy.rego"
        volumeMounts:
        - name: opa-policy
          mountPath: /policy
        ports:
        - containerPort: 8181
      volumes:
      - name: opa-policy
        configMap:
          name: opa-policy
```

### Secrets Management with Sealed Secrets
```yaml
# security/sealed-secrets.yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: zoe-solar-secrets
  namespace: zoe-solar-prod
spec:
  encryptedData:
    DATABASE_URL: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEQAx...
    REDIS_URL: AgAjKD8Lqo4K9ylKw349DqK43cGDEQAx...
    JWT_SECRET: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEQAx...
    NOTION_TOKEN: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEQAx...
```

### Pod Security Policies
```yaml
# security/pod-security-policy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: zoe-solar-restricted
  annotations:
    seccomp.security.alpha.kubernetes.io/allowedProfileNames: 'runtime/default'
    seccomp.security.alpha.kubernetes.io/defaultProfileName: 'runtime/default'
    apparmor.security.beta.kubernetes.io/allowedProfileNames: 'runtime/default'
    apparmor.security.beta.kubernetes.io/defaultProfileName: 'runtime/default'
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
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    fsGroup: 1001
    capabilities:
      drop:
        - ALL
```

---

## 🔧 Automation Scripts

### Advanced Deployment Script
```bash
#!/bin/bash
# scripts/advanced-deploy.sh

set -euo pipefail

# Configuration
NAMESPACE=${1:-zoe-solar-prod}
STRATEGY=${2:-rolling}
VERSION=${3:-latest}

echo "🚀 Advanced Deployment with Strategy: $STRATEGY"
echo "Namespace: $NAMESPACE"
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

# Pre-deployment validation
validate_deployment() {
    log_info "Validating deployment configuration..."

    # Check cluster health
    if ! kubectl get nodes | grep -q "Ready"; then
        log_error "Cluster nodes not ready"
        exit 1
    fi

    # Check resource availability
    local available_memory=$(kubectl top nodes --no-headers | awk '{sum+=$3} END {print sum}')
    if [[ $available_memory -lt 8000 ]]; then
        log_warning "Low memory availability: ${available_memory}Mi"
    fi

    # Check service mesh status
    if command -v istioctl &> /dev/null; then
        if ! istioctl verify-install &> /dev/null; then
            log_error "Istio installation corrupted"
            exit 1
        fi
    fi

    log_success "Deployment validation completed"
}

# Rolling deployment
rolling_deploy() {
    log_info "Executing rolling deployment..."

    # Update deployment with new image
    kubectl set image deployment/zoe-solar-web zoe-solar-web=ghcr.io/zoe-solar/web:$VERSION -n "$NAMESPACE"
    kubectl set image deployment/zoe-solar-api zoe-solar-api=ghcr.io/zoe-solar/api:$VERSION -n "$NAMESPACE"

    # Wait for rollout
    kubectl rollout status deployment/zoe-solar-web -n "$NAMESPACE" --timeout=600s
    kubectl rollout status deployment/zoe-solar-api -n "$NAMESPACE" --timeout=600s

    log_success "Rolling deployment completed"
}

# Blue-Green deployment
blue_green_deploy() {
    log_info "Executing blue-green deployment..."

    # Determine current active color
    local current_color=$(kubectl get service zoe-solar-web -n "$NAMESPACE" -o jsonpath='{.spec.selector.color}' || echo "blue")
    local target_color="green"

    if [[ $current_color == "green" ]]; then
        target_color="blue"
    fi

    log_info "Current active: $current_color, Target: $target_color"

    # Deploy to target environment
    kubectl apply -f - << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zoe-solar-web-$target_color
  namespace: $NAMESPACE
  labels:
    app: zoe-solar
    component: frontend
    color: $target_color
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zoe-solar
      component: frontend
      color: $target_color
  template:
    metadata:
      labels:
        app: zoe-solar
        component: frontend
        color: $target_color
    spec:
      containers:
      - name: zoe-solar-web
        image: ghcr.io/zoe-solar/web:$VERSION
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: 256Mi
            cpu: 250m
          limits:
            memory: 512Mi
            cpu: 500m
EOF

    # Wait for deployment
    kubectl rollout status deployment/zoe-solar-web-$target_color -n "$NAMESPACE" --timeout=600s

    # Health check
    log_info "Running health checks on target environment..."
    sleep 30

    local max_attempts=30
    local attempt=1
    while [ $attempt -le $max_attempts ]; do
        if kubectl get pods -n "$NAMESPACE" -l color=$target_color -o jsonpath='{.items[*].status.phase}' | grep -q "Running"; then
            log_success "Health checks passed"
            break
        fi

        if [ $attempt -eq $max_attempts ]; then
            log_error "Health checks failed"
            return 1
        fi

        sleep 10
        ((attempt++))
    done

    # Switch traffic
    log_info "Switching traffic to $target_color environment..."
    kubectl patch service zoe-solar-web -n "$NAMESPACE" -p '{"spec":{"selector":{"color":"'$target_color'"}}}'

    log_success "Blue-green deployment completed"
}

# Canary deployment
canary_deploy() {
    log_info "Executing canary deployment..."

    # Create canary deployment
    kubectl apply -f - << EOF
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: zoe-solar-web
  namespace: $NAMESPACE
spec:
  replicas: 5
  strategy:
    canary:
      steps:
      - setWeight: 10
      - pause: {duration: 2m}
      - setWeight: 25
      - pause: {duration: 5m}
      - setWeight: 50
      - pause: {duration: 5m}
      - setWeight: 75
      - pause: {duration: 5m}
      canaryService: zoe-solar-web-canary
      stableService: zoe-solar-web-stable
      trafficRouting:
        istio:
          virtualService:
            name: zoe-solar-vs
            routes:
            - primary
      analysis:
        templates:
        - templateName: success-rate
        args:
        - name: service-name
          value: zoe-solar-web-canary
        startingStep: 2
        interval: 30s
  selector:
    matchLabels:
      app: zoe-solar
      component: frontend
  template:
    metadata:
      labels:
        app: zoe-solar
        component: frontend
    spec:
      containers:
      - name: zoe-solar-web
        image: ghcr.io/zoe-solar/web:$VERSION
        ports:
        - containerPort: 3000
EOF

    log_success "Canary deployment initiated"
}

# A/B Testing deployment
ab_test_deploy() {
    log_info "Executing A/B testing deployment..."

    # Create A/B testing configuration
    kubectl apply -f - << EOF
apiVersion: argoproj.io/v1alpha1
kind: Experiment
metadata:
  name: zoe-solar-ab-test
  namespace: $NAMESPACE
spec:
  analyses:
  - name: success-rate
    templates:
    - templateName: success-rate
    args:
    - name: service-name
      value: zoe-solar-web
  templates:
  - name: baseline
    selector:
      matchLabels:
        app: zoe-solar
        component: frontend
        version: control
  - name: treatment
    selector:
      matchLabels:
        app: zoe-solar
        component: frontend
        version: beta
  duration: 2h
  progressDeadlineSeconds: 3600
EOF

    log_success "A/B testing deployment initiated"
}

# Post-deployment verification
verify_deployment() {
    log_info "Running post-deployment verification..."

    # Check pod status
    kubectl get pods -n "$NAMESPACE" -l app=zoe-solar

    # Check services
    kubectl get services -n "$NAMESPACE" -l app=zoe-solar

    # Check ingress
    kubectl get ingress -n "$NAMESPACE" -l app=zoe-solar

    # Run smoke tests
    local ingress_url=$(kubectl get ingress zoe-solar-ingress -n "$NAMESPACE" -o jsonpath='{.spec.rules[0].host}' 2>/dev/null || echo "localhost")

    if curl -f -s "https://$ingress_url/health" > /dev/null; then
        log_success "Application health check passed"
    else
        log_error "Application health check failed"
        return 1
    fi

    # Check metrics
    if command -v istioctl &> /dev/null; then
        log_info "Service mesh metrics:"
        istioctl proxy-status --namespace "$NAMESPACE"
    fi

    log_success "Verification completed"
}

# Rollback function
rollback() {
    log_warning "Initiating rollback..."

    # Rollback deployments
    kubectl rollout undo deployment/zoe-solar-web -n "$NAMESPACE"
    kubectl rollout undo deployment/zoe-solar-api -n "$NAMESPACE"

    # Wait for rollback completion
    kubectl rollout status deployment/zoe-solar-web -n "$NAMESPACE" --timeout=600s
    kubectl rollout status deployment/zoe-solar-api -n "$NAMESPACE" --timeout=600s

    verify_deployment
    log_success "Rollback completed"
}

# Main function
main() {
    validate_deployment

    case "$STRATEGY" in
        "rolling")
            rolling_deploy
            ;;
        "blue-green")
            blue_green_deploy
            ;;
        "canary")
            canary_deploy
            ;;
        "ab-test")
            ab_test_deploy
            ;;
        "rollback")
            rollback
            ;;
        *)
            log_error "Unknown strategy: $STRATEGY"
            echo "Available strategies: rolling, blue-green, canary, ab-test, rollback"
            exit 1
            ;;
    esac

    verify_deployment
    log_success "Deployment completed successfully!"
}

main "$@"
```

### Multi-Cluster Sync Script
```bash
#!/bin/bash
# scripts/multi-cluster-sync.sh

set -euo pipefail

# Configuration
PRIMARY_CLUSTER=${1:-zoe-solar-prod-eu-central}
SECONDARY_CLUSTERS=("zoe-solar-prod-us-west" "zoe-solar-prod-ap-southeast")
NAMESPACE=${2:-zoe-solar-prod}

echo "🔄 Multi-Cluster Synchronization"
echo "Primary Cluster: $PRIMARY_CLUSTER"
echo "Secondary Clusters: ${SECONDARY_CLUSTERS[*]}"
echo "Namespace: $NAMESPACE"

# Sync function
sync_cluster() {
    local source_cluster=$1
    local target_cluster=$2
    local namespace=$3

    echo "🔄 Syncing from $source_cluster to $target_cluster..."

    # Get deployment configurations
    kubectl get deployment -n "$namespace" --context="$source_cluster" -o yaml | \
        kubectl apply --context="$target_cluster" -f -

    # Get service configurations
    kubectl get service -n "$namespace" --context="$source_cluster" -o yaml | \
        kubectl apply --context="$target_cluster" -f -

    # Get configmaps
    kubectl get configmap -n "$namespace" --context="$source_cluster" -o yaml | \
        kubectl apply --context="$target_cluster" -f -

    echo "✅ Sync to $target_cluster completed"
}

# Sync all secondary clusters
for cluster in "${SECONDARY_CLUSTERS[@]}"; do
    sync_cluster "$PRIMARY_CLUSTER" "$cluster" "$NAMESPACE"
done

echo "🎉 Multi-cluster synchronization completed!"
```

---

## 📚 Best Practices

### Advanced Infrastructure Best Practices
1. **Multi-Cluster Strategy** - Geographic distribution for resilience
2. **Service Mesh** - Advanced traffic management and security
3. **GitOps** - Infrastructure as Code with automated deployments
4. **Observability** - Full stack monitoring, tracing, and logging
5. **Security** - Zero-trust network with policy enforcement
6. **Automation** - Comprehensive CI/CD with advanced deployment strategies
7. **Disaster Recovery** - Automated backups and failover procedures

### Production Checklist
- [ ] Service mesh deployed and configured
- [ ] Multi-cluster federation setup
- [ ] GitOps pipelines implemented
- [ ] Advanced monitoring and alerting
- [ ] Security policies enforced
- [ ] Backup and disaster recovery tested
- [ ] Performance tuning completed
- [ ] Load testing performed
- [ ] Documentation maintained
- [ ] Incident response procedures defined

---

**🚀 Advanced Infrastructure Guide Version:** 1.0.0
**🔗 Service Mesh:** Istio & Linkerd
**🌐 Multi-Cloud:** Distributed Architecture
**🔁 GitOps:** ArgoCD & Flux CD
**📊 Observability:** Full Stack Monitoring
**🛡️ Security:** Policy as Code
**📅 Last Update:** 17. November 2025
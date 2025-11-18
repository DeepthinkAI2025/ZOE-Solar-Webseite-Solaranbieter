# 🔄 ZOE Solar CI/CD Pipeline Guide

## 📋 Overview

Dieser Guide etabliert eine umfassende CI/CD-Pipeline für die ZOE Solar React-Anwendung mit GitHub Actions, Automated Testing, Security Scanning, Performance Monitoring und Production Deployment.

---

## 🏗️ Pipeline Architecture

### CI/CD Flow Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │    │   GitHub Actions │    │  Production     │
│                 │    │                  │    │                 │
│ Code Changes    ├───►│   Build & Test   ├───►│   Deployment    │
│ Push to Branch  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   Quality Gates   │
                       │                  │
                       │ • Test Coverage  │
                       │ • Security Scan  │
                       │ • Performance    │
                       │ • Linting        │
                       └──────────────────┘
```

### Environment Strategy
```yaml
Environments:
  - Development:
      Branch: develop
      URL: dev.zoe-solar.de
      Database: PostgreSQL (Dev)
      Monitoring: Basic

  - Staging:
      Branch: main
      URL: staging.zoe-solar.de
      Database: PostgreSQL (Staging)
      Monitoring: Full Stack

  - Production:
      Branch: main (after manual approval)
      URL: zoe-solar.de
      Database: PostgreSQL (Prod)
      Monitoring: Full Stack + APM
```

---

## 🔄 GitHub Actions Workflows

### Main CI/CD Workflow
```yaml
# .github/workflows/main.yml
name: 🚀 CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: zoe-solar/web

jobs:
  # Code Quality & Testing
  quality-check:
    name: 🔍 Quality Checks
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔍 Lint code
      run: npm run lint:check

    - name: 🔍 Type check
      run: npm run type-check

    - name: 🧪 Run unit tests
      run: npm run test:coverage

    - name: 🧪 Run integration tests
      run: npm run test:integration

    - name: 📊 Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

    - name: 🔒 Security audit
      run: npm audit --audit-level moderate

  # Build & Security Scan
  build-and-scan:
    name: 🏗️ Build & Security
    runs-on: ubuntu-latest
    needs: quality-check
    timeout-minutes: 30

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔑 Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: 🔍 Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: 🏗️ Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: 🔒 Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: 📊 Upload Trivy scan results to GitHub Security tab
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'

  # End-to-End Testing
  e2e-tests:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    needs: build-and-scan
    timeout-minutes: 45

    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🌐 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🏗️ Install Playwright
      run: npx playwright install --with-deps ${{ matrix.browser }}

    - name: 🚀 Start application
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30

    - name: 🎭 Run E2E tests
      run: npx playwright test --project=${{ matrix.browser }}

    - name: 📊 Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report-${{ matrix.browser }}
        path: playwright-report/
        retention-days: 30

    - name: 📊 Upload test videos
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-videos-${{ matrix.browser }}
        path: test-results/
        retention-days: 7

    - name: 🧹 Cleanup
      run: docker-compose -f docker-compose.test.yml down -v

  # Performance Testing
  performance-tests:
    name: ⚡ Performance Tests
    runs-on: ubuntu-latest
    needs: build-and-scan
    timeout-minutes: 30

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🚀 Start application
      run: |
        docker-compose -f docker-compose.test.yml up -d
        sleep 30

    - name: 🔍 Lighthouse CI
      run: |
        npm install -g @lhci/cli@0.12.x
        lhci autorun
      env:
        LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

    - name: 📊 Upload Lighthouse results
      uses: actions/upload-artifact@v3
      with:
        name: lighthouse-results
        path: .lighthouseci/
        retention-days: 30

    - name: 🧹 Cleanup
      run: docker-compose -f docker-compose.test.yml down -v

  # Deploy to Development
  deploy-dev:
    name: 🚀 Deploy to Development
    runs-on: ubuntu-latest
    needs: [build-and-scan, e2e-tests, performance-tests]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: development
      url: https://dev.zoe-solar.de

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🔑 Login to production registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: 🚀 Deploy to development
      run: |
        ./scripts/deploy.sh development ${GITHUB_SHA}

    - name: ✅ Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        text: '🚀 Development deployment completed'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Deploy to Staging
  deploy-staging:
    name: 🚀 Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build-and-scan, e2e-tests, performance-tests]
    if: github.ref == 'refs/heads/main'
    environment:
      name: staging
      url: https://staging.zoe-solar.de

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🔑 Login to production registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: 🚀 Deploy to staging
      run: |
        ./scripts/deploy.sh staging ${GITHUB_SHA}

    - name: 🧪 Run staging smoke tests
      run: |
        ./scripts/smoke-tests.sh https://staging.zoe-solar.de

    - name: ✅ Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        text: '🚀 Staging deployment completed'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Deploy to Production
  deploy-production:
    name: 🚀 Deploy to Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://zoe-solar.de

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🔑 Login to production registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: 🚀 Deploy to production
      run: |
        ./scripts/deploy.sh production ${GITHUB_SHA}

    - name: 🧪 Run production smoke tests
      run: |
        ./scripts/smoke-tests.sh https://zoe-solar.de

    - name: 🔍 Run production health checks
      run: |
        ./scripts/health-checks.sh production

    - name: ✅ Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        text: '🚀 Production deployment completed'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        SLACK_WEBHOOK_URL_SUCCESS: ${{ secrets.SLACK_WEBHOOK_URL_SUCCESS }}
```

### Security Scanning Workflow
```yaml
# .github/workflows/security.yml
name: 🔒 Security Scanning

on:
  schedule:
    - cron: '0 2 * * 1'  # Monday 2 AM
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  dependency-audit:
    name: 🔍 Dependency Audit
    runs-on: ubuntu-latest

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🔍 npm audit
      run: npm audit --audit-level moderate

    - name: 🔍 Snyk security scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  container-security:
    name: 🐳 Container Security
    runs-on: ubuntu-latest

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🔑 Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ghcr.io
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: 🏗️ Build Docker image
      run: |
        docker build -t zoe-solar:test .

    - name: 🔍 Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'zoe-solar:test'
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: 📊 Upload Trivy results
      uses: github/codeql-action/upload-sarif@v2
      if: always()
      with:
        sarif_file: 'trivy-results.sarif'

  codeql-analysis:
    name: 🔍 CodeQL Analysis
    runs-on: ubuntu-latest
    permissions:
      actions: read
      contents: read
      security-events: write

    strategy:
      fail-fast: false
      matrix:
        language: [ 'javascript', 'typescript' ]

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Initialize CodeQL
      uses: github/codeql-action/init@v2
      with:
        languages: ${{ matrix.language }}

    - name: 🔍 Autobuild
      uses: github/codeql-action/autobuild@v2

    - name: 🔍 Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v2
```

### Performance Monitoring Workflow
```yaml
# .github/workflows/performance.yml
name: ⚡ Performance Monitoring

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM
  workflow_dispatch:

jobs:
  lighthouse-monitoring:
    name: 🔍 Lighthouse CI
    runs-on: ubuntu-latest

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🔍 Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        urls: |
          https://zoe-solar.de
          https://zoe-solar.de/kontakt
          https://zoe-solar.de/rechner
        configPath: '.lighthouserc.json'
        uploadArtifacts: true
        temporaryPublicStorage: true

  web-vitals-monitoring:
    name: 📊 Web Vitals
    runs-on: ubuntu-latest

    steps:
    - name: 🔍 Run Web Vitals test
      uses: jakepartus/web-vitals-action@v1
      with:
        url: https://zoe-solar.de
        threshold: 90
      env:
        WEB_VITALS_API_KEY: ${{ secrets.WEB_VITALS_API_KEY }}

  bundle-size-monitoring:
    name: 📦 Bundle Size Analysis
    runs-on: ubuntu-latest

    steps:
    - name: 📥 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🏗️ Build application
      run: npm run build

    - name: 📊 Analyze bundle size
      uses: preactjs/compressed-size-action@v2
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
        pattern: "./dist/**/*.{js,css,html}"
        exclude: "{./dist/**/*.map,./dist/**/service-worker.js}"
```

---

## 🛠️ Configuration Files

### Lighthouse CI Configuration
```json
// .lighthouserc.json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "https://zoe-solar.de",
        "https://zoe-solar.de/kontakt",
        "https://zoe-solar.de/rechner",
        "https://zoe-solar.de/leistungen"
      ],
      "startServerCommand": "npm run start:test",
      "startServerReadyPattern": "ready on",
      "startServerReadyTimeout": 30000
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["warn", {"minScore": 0.9}],
        "categories:seo": ["warn", {"minScore": 0.9}],
        "categories:pwa": "off"
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    },
    "server": {
      "port": 9009,
      "storage": {
        "storageMethod": "sql",
        "sqlDatabasePath": "./lhci.db"
      }
    }
  }
}
```

### Bundle Size Configuration
```json
// .size-snapshot.json
{
  "files": [
    {
      "path": "dist/assets/index-*.js",
      "maxSize": "250kb",
      "compression": "gzip"
    },
    {
      "path": "dist/assets/index-*.css",
      "maxSize": "50kb",
      "compression": "gzip"
    },
    {
      "path": "dist/assets/vendor-*.js",
      "maxSize": "200kb",
      "compression": "gzip"
    }
  ]
}
```

### Test Configuration
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup/jest.setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__tests__/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/components/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
  ]
};
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  webServer: {
    command: 'npm run start:test',
    port: 3000,
    reuseExistingServer: !process.env.CI
  }
});
```

---

## 🔧 Deployment Scripts

### Production Deployment Script
```bash
#!/bin/bash
# scripts/deploy.sh

set -euo pipefail

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
REGISTRY="ghcr.io/zoe-solar"
IMAGE_NAME="zoe-solar/web"

echo "🚀 Deploying ZOE Solar Web Application"
echo "Environment: $ENVIRONMENT"
echo "Version: $VERSION"
echo "Registry: $REGISTRY"
echo "Image: $IMAGE_NAME"

# Pre-deployment checks
pre-deploy-check() {
    echo "🔍 Running pre-deployment checks..."

    # Check if image exists
    if ! docker manifest inspect $REGISTRY/$IMAGE_NAME:$VERSION > /dev/null 2>&1; then
        echo "❌ Image $REGISTRY/$IMAGE_NAME:$VERSION not found"
        exit 1
    fi

    # Security scan
    echo "🔒 Running security scan..."
    trivy image --severity HIGH,CRITICAL $REGISTRY/$IMAGE_NAME:$VERSION

    echo "✅ Pre-deployment checks passed"
}

# Deploy function
deploy() {
    echo "🚀 Starting deployment to $ENVIRONMENT..."

    case $ENVIRONMENT in
        "development")
            # Deploy to development environment
            docker pull $REGISTRY/$IMAGE_NAME:$VERSION
            docker tag $REGISTRY/$IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:development
            docker push $REGISTRY/$IMAGE_NAME:development

            # Update Kubernetes deployment
            kubectl set image deployment/zoe-solar-web zoe-solar-web=$REGISTRY/$IMAGE_NAME:$VERSION -n development
            kubectl rollout status deployment/zoe-solar-web -n development --timeout=600s
            ;;

        "staging")
            # Deploy to staging environment
            docker pull $REGISTRY/$IMAGE_NAME:$VERSION
            docker tag $REGISTRY/$IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:staging
            docker push $REGISTRY/$IMAGE_NAME:staging

            # Update Kubernetes deployment
            kubectl set image deployment/zoe-solar-web zoe-solar-web=$REGISTRY/$IMAGE_NAME:$VERSION -n staging
            kubectl rollout status deployment/zoe-solar-web -n staging --timeout=600s
            ;;

        "production")
            # Deploy to production environment
            docker pull $REGISTRY/$IMAGE_NAME:$VERSION
            docker tag $REGISTRY/$IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:production
            docker push $REGISTRY/$IMAGE_NAME:production

            # Blue-green deployment
            ./scripts/blue-green-deploy.sh production $VERSION
            ;;

        *)
            echo "❌ Unknown environment: $ENVIRONMENT"
            exit 1
            ;;
    esac

    echo "✅ Deployment completed successfully"
}

# Post-deployment verification
post-deploy-check() {
    echo "🔍 Running post-deployment verification..."

    local URL
    case $ENVIRONMENT in
        "development")
            URL="https://dev.zoe-solar.de"
            ;;
        "staging")
            URL="https://staging.zoe-solar.de"
            ;;
        "production")
            URL="https://zoe-solar.de"
            ;;
    esac

    # Health check
    echo "🏥 Checking application health..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$URL/health" > /dev/null; then
            echo "✅ Health check passed"
            break
        fi

        if [ $attempt -eq $max_attempts ]; then
            echo "❌ Health check failed after $max_attempts attempts"
            echo "🔄 Initiating rollback..."
            rollback
            exit 1
        fi

        echo "⏳ Attempt $attempt/$max_attempts..."
        sleep 10
        ((attempt++))
    done

    # Smoke tests
    echo "💨 Running smoke tests..."
    ./scripts/smoke-tests.sh "$URL"

    # Performance check
    echo "⚡ Running performance check..."
    lighthouse "$URL" --output=json --output-path="./lighthouse-$ENVIRONMENT.json" --quiet

    echo "✅ Post-deployment verification completed"
}

# Rollback function
rollback() {
    echo "🔄 Rolling back deployment..."

    case $ENVIRONMENT in
        "development"|"staging")
            kubectl rollout undo deployment/zoe-solar-web -n $ENVIRONMENT
            kubectl rollout status deployment/zoe-solar-web -n $ENVIRONMENT --timeout=600s
            ;;
        "production")
            ./scripts/blue-green-rollback.sh production
            ;;
    esac

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
            echo "Usage: $0 {deploy|rollback} [environment] [version]"
            exit 1
            ;;
    esac
}

main "$@"
```

### Smoke Tests Script
```bash
#!/bin/bash
# scripts/smoke-tests.sh

set -euo pipefail

URL=${1:-http://localhost:3000}
TIMEOUT=30

echo "💨 Running smoke tests for $URL"

# Test functions
test_homepage() {
    echo "🏠 Testing homepage..."
    if curl -f -s --max-time $TIMEOUT "$URL" | grep -q "ZOE Solar"; then
        echo "✅ Homepage test passed"
    else
        echo "❌ Homepage test failed"
        return 1
    fi
}

test_api_endpoints() {
    echo "🔌 Testing API endpoints..."

    # Health endpoint
    if curl -f -s --max-time $TIMEOUT "$URL/api/health" | grep -q "healthy"; then
        echo "✅ API health endpoint test passed"
    else
        echo "❌ API health endpoint test failed"
        return 1
    fi

    # Products endpoint
    if curl -f -s --max-time $TIMEOUT "$URL/api/products" | grep -q "products"; then
        echo "✅ API products endpoint test passed"
    else
        echo "❌ API products endpoint test failed"
        return 1
    fi
}

test_static_assets() {
    echo "📁 Testing static assets..."

    # CSS files
    if curl -f -s --max-time $TIMEOUT "$URL/assets/main.css" | grep -q "zoe-solar"; then
        echo "✅ CSS assets test passed"
    else
        echo "❌ CSS assets test failed"
        return 1
    fi

    # JS files
    if curl -f -s --max-time $TIMEOUT "$URL/assets/main.js" | grep -q "zoe-solar"; then
        echo "✅ JS assets test passed"
    else
        echo "❌ JS assets test failed"
        return 1
    fi
}

test_security_headers() {
    echo "🔒 Testing security headers..."

    # Check CSP header
    local csp_header=$(curl -I -s --max-time $TIMEOUT "$URL" | grep -i "content-security-policy" || echo "")
    if [[ $csp_header == *"default-src 'self'"* ]]; then
        echo "✅ CSP header test passed"
    else
        echo "❌ CSP header test failed"
        return 1
    fi

    # Check HSTS header
    local hsts_header=$(curl -I -s --max-time $TIMEOUT "$URL" | grep -i "strict-transport-security" || echo "")
    if [[ $hsts_header == *"max-age"* ]]; then
        echo "✅ HSTS header test passed"
    else
        echo "❌ HSTS header test failed"
        return 1
    fi
}

test_performance() {
    echo "⚡ Testing performance..."

    # Test load time
    local load_time=$(curl -o /dev/null -s -w '%{time_total}' --max-time $TIMEOUT "$URL")
    if (( $(echo "$load_time < 3.0" | bc -l) )); then
        echo "✅ Load time test passed (${load_time}s)"
    else
        echo "❌ Load time test failed (${load_time}s)"
        return 1
    fi

    # Test response size
    local response_size=$(curl -o /dev/null -s -w '%{size_download}' --max-time $TIMEOUT "$URL")
    if [[ $response_size -lt 1048576 ]]; then  # Less than 1MB
        echo "✅ Response size test passed (${response_size} bytes)"
    else
        echo "❌ Response size test failed (${response_size} bytes)"
        return 1
    fi
}

# Run all tests
main() {
    local failed_tests=0

    test_homepage || ((failed_tests++))
    test_api_endpoints || ((failed_tests++))
    test_static_assets || ((failed_tests++))
    test_security_headers || ((failed_tests++))
    test_performance || ((failed_tests++))

    if [[ $failed_tests -eq 0 ]]; then
        echo "✅ All smoke tests passed"
        exit 0
    else
        echo "❌ $failed_tests smoke tests failed"
        exit 1
    fi
}

main
```

### Blue-Green Deployment Script
```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -euo pipefail

ENVIRONMENT=${1:-production}
VERSION=${2:-latest}
REGISTRY="ghcr.io/zoe-solar"
IMAGE_NAME="zoe-solar/web"

echo "🔄 Starting blue-green deployment to $ENVIRONMENT"
echo "Version: $VERSION"

# Configuration
BLUE_SERVICE="zoe-solar-web-blue"
GREEN_SERVICE="zoe-solar-web-green"
LOAD_BALANCER="zoe-solar-web-lb"
NAMESPACE=$ENVIRONMENT

# Get current active service
get_active_service() {
    local active=$(kubectl get service $LOAD_BALANCER -n $NAMESPACE -o jsonpath='{.spec.selector.color}')
    if [[ $active == "blue" ]]; then
        echo "blue"
    else
        echo "green"
    fi
}

# Deploy to inactive environment
deploy() {
    local active=$(get_active_service)
    local inactive="green"
    if [[ $active == "green" ]]; then
        inactive="blue"
    fi

    echo "🟦 Active: $active, 🟩 Inactive: $inactive"
    echo "🚀 Deploying to $inactive environment..."

    # Update inactive service
    kubectl set image deployment/$inactive-service zoe-solar-web=$REGISTRY/$IMAGE_NAME:$VERSION -n $NAMESPACE
    kubectl rollout status deployment/$inactive-service -n $NAMESPACE --timeout=600s

    # Scale up inactive service
    kubectl scale deployment $inactive-service --replicas=3 -n $NAMESPACE

    echo "✅ Deployment to $inactive environment completed"
}

# Switch traffic
switch_traffic() {
    local active=$(get_active_service)
    local inactive="green"
    if [[ $active == "green" ]]; then
        inactive="blue"
    fi

    echo "🔄 Switching traffic from $active to $inactive..."

    # Update load balancer selector
    kubectl patch service $LOAD_BALANCER -n $NAMESPACE -p '{"spec":{"selector":{"color":"'$inactive'"}}}'

    # Wait for traffic switch
    sleep 30

    # Verify traffic switch
    local current_active=$(get_active_service)
    if [[ $current_active == $inactive ]]; then
        echo "✅ Traffic switch completed successfully"
    else
        echo "❌ Traffic switch failed"
        exit 1
    fi
}

# Cleanup old environment
cleanup() {
    local active=$(get_active_service)
    local old_active="green"
    if [[ $active == "green" ]]; then
        old_active="blue"
    fi

    echo "🧹 Cleaning up $old_active environment..."

    # Scale down old environment
    kubectl scale deployment $old_active-service --replicas=0 -n $NAMESPACE

    echo "✅ Cleanup completed"
}

# Main deployment flow
main() {
    deploy
    switch_traffic
    cleanup

    echo "✅ Blue-green deployment completed successfully"
}

main
```

---

## 📊 Monitoring & Alerting

### Monitoring Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'zoe-solar-web'
    static_configs:
      - targets: ['zoe-solar-web:8080']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'nginx'
    static_configs:
      - targets: ['nginx-exporter:9113']
    scrape_interval: 30s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
    scrape_interval: 30s
```

### Alerting Rules
```yaml
# monitoring/alert_rules.yml
groups:
  - name: zoe-solar-web
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is above 90%"

      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is above 80%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) * 100 < 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Low disk space detected"
          description: "Disk space is below 10%"

      - alert: ServiceDown
        expr: up{job="zoe-solar-web"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "{{ $labels.instance }} service is down"
```

---

## 🔧 Development Tools

### Local Development Scripts
```bash
#!/bin/bash
# scripts/dev.sh

set -euo pipefail

# Development environment functions
dev-up() {
    echo "🚀 Starting development environment..."
    docker-compose -f docker-compose.dev.yml up --build -d
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 API: http://localhost:3001"
    echo "🗄️ Database: localhost:5432"
    echo "📦 Redis: localhost:6379"
}

dev-down() {
    echo "🛑 Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down -v
}

dev-logs() {
    local service=${1:-}
    if [ -z "$service" ]; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        docker-compose -f docker-compose.dev.yml logs -f "$service"
    fi
}

dev-shell() {
    local service=${1:-frontend}
    echo "🐚 Opening shell in $service..."
    docker-compose -f docker-compose.dev.yml exec "$service" sh
}

dev-test() {
    echo "🧪 Running tests..."
    docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
}

dev-clean() {
    echo "🧹 Cleaning development environment..."
    docker-compose -f docker-compose.dev.yml down -v --rmi all
    docker system prune -f
}

# Main command handling
case "${1:-}" in
    up) dev-up ;;
    down) dev-down ;;
    logs) dev-logs "${2:-}" ;;
    shell) dev-shell "${2:-}" ;;
    test) dev-test ;;
    clean) dev-clean ;;
    *)
        echo "Usage: $0 {up|down|logs [service]|shell [service]|test|clean}"
        exit 1
        ;;
esac
```

### Production Tools
```bash
#!/bin/bash
# scripts/production.sh

set -euo pipefail

# Production environment functions
prod-status() {
    echo "📊 Production environment status:"
    kubectl get pods -n production
    kubectl get services -n production
    kubectl get deployments -n production
}

prod-logs() {
    local pod=${1:-}
    if [ -z "$pod" ]; then
        echo "📋 Available pods:"
        kubectl get pods -n production
    else
        echo "📋 Logs for pod: $pod"
        kubectl logs -f "$pod" -n production
    fi
}

prod-scale() {
    local service=${1:-zoe-solar-web}
    local replicas=${2:-3}
    echo "📈 Scaling $service to $replicas replicas..."
    kubectl scale deployment "$service" --replicas="$replicas" -n production
    kubectl rollout status deployment "$service" -n production
}

prod-restart() {
    local service=${1:-zoe-solar-web}
    echo "🔄 Restarting $service..."
    kubectl rollout restart deployment "$service" -n production
    kubectl rollout status deployment "$service" -n production
}

prod-backup() {
    echo "💾 Creating database backup..."
    kubectl exec -n production deployment/postgres -- pg_dump zoe_solar_prod > "backup-$(date +%Y%m%d-%H%M%S).sql"
    echo "✅ Backup completed"
}

# Main command handling
case "${1:-}" in
    status) prod-status ;;
    logs) prod-logs "${2:-}" ;;
    scale) prod-scale "${2:-}" "${3:-}" ;;
    restart) prod-restart "${2:-}" ;;
    backup) prod-backup ;;
    *)
        echo "Usage: $0 {status|logs [pod]|scale [service] [replicas]|restart [service]|backup}"
        exit 1
        ;;
esac
```

---

## 📚 Best Practices

### CI/CD Best Practices
1. **Fast Feedback** - Keep pipelines under 10 minutes when possible
2. **Fail Fast** - Run expensive tests only after cheap ones pass
3. **Parallel Execution** - Run tests in parallel when possible
4. **Security First** - Include security scanning in all pipelines
5. **Monitoring** - Always include health checks and monitoring
6. **Rollback** - Always have a rollback strategy
7. **Documentation** - Keep pipeline documentation up to date

### Security Best Practices
1. **Secret Management** - Use environment variables and secret managers
2. **Vulnerability Scanning** - Scan dependencies and containers
3. **Access Control** - Use least privilege access for all services
4. **Network Security** - Use network policies and firewalls
5. **Image Security** - Use minimal base images and non-root users
6. **Supply Chain Security** - Sign and verify all images

### Performance Best Practices
1. **Build Optimization** - Use multi-stage builds and caching
2. **Image Size** - Keep images as small as possible
3. **Resource Limits** - Set appropriate resource limits
4. **Monitoring** - Monitor performance metrics continuously
5. **Load Testing** - Include load testing in CI/CD
6. **Caching** - Use appropriate caching strategies

---

**🔄 CI/CD Pipeline Guide Version:** 1.0.0
**⚡ Performance:** Automated Testing & Monitoring
**🔒 Security:** Scanning & Best Practices
**🚀 Deployment:** Blue-Green & Canary
**📊 Monitoring:** Full Stack Observability
**📅 Last Update:** 17. November 2025
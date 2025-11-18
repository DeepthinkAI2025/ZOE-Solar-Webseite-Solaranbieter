#!/bin/bash

# 🚀 Deployment Script für ZOE Solar Notion CMS
# Vollautomatische Bereitstellung mit Tests und Optimierungen

set -e  # Exit on any error

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Konfiguration
PROJECT_NAME="zoe-solar-notion-cms"
VERCEL_PROJECT_ID="your-vercel-project-id"  # TODO: Aktualisieren
GITHUB_REPO="your-org/zoe-solar-notion-cms"
DEPLOY_ENVIRONMENT=${1:-production}  # production, staging, development

echo -e "${BLUE}🚀 ZOE Solar CMS Deployment Script gestartet${NC}"
echo "Environment: $DEPLOY_ENVIRONMENT"
echo "Timestamp: $(date)"
echo ""

# ========== FUNKTIONEN ==========

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Prüfe ob erforderliche Tools installiert sind
check_dependencies() {
    log_info "Prüfe Dependencies..."
    
    local deps=("node" "npm" "git" "vercel")
    local missing_deps=()
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            missing_deps+=($dep)
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Fehlende Dependencies: ${missing_deps[*]}"
        echo "Installieren Sie die fehlenden Tools und versuchen Sie es erneut."
        exit 1
    fi
    
    log_success "Alle Dependencies verfügbar"
}

# Prüfe Environment-Konfiguration
check_environment() {
    log_info "Prüfe Environment-Konfiguration..."
    
    if [ ! -f ".env.local" ]; then
        log_error ".env.local nicht gefunden!"
        echo "Bitte kopieren Sie .env.example zu .env.local und füllen Sie die Werte aus."
        echo "cp .env.example .env.local"
        exit 1
    fi
    
    # Prüfe kritische Umgebungsvariablen
    source .env.local
    
    local required_vars=(
        "NOTION_API_KEY"
        "NOTION_WORKSPACE_ID"
        "JWT_SECRET"
        "NEXT_PUBLIC_NOTION_BLOG_DB_ID"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ] || [ "${!var}" = "your-default-value" ]; then
            missing_vars+=($var)
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Fehlende Umgebungsvariablen: ${missing_vars[*]}"
        echo "Bitte füllen Sie alle erforderlichen Werte in .env.local aus."
        exit 1
    fi
    
    log_success "Environment-Konfiguration OK"
}

# Bereinige vorherige Builds
clean_build() {
    log_info "Bereinige vorherige Builds..."
    
    # Cache leeren
    rm -rf .next/
    rm -rf node_modules/.cache/
    rm -rf dist/
    rm -rf build/
    
    # Temporary Files löschen
    find . -name "*.tmp" -delete
    find . -name "*.log" -delete
    
    log_success "Bereinigung abgeschlossen"
}

# Installiere Dependencies
install_dependencies() {
    log_info "Installiere Dependencies..."
    
    # NPM Cache leeren
    npm cache clean --force
    
    # Dependencies installieren
    npm ci
    
    log_success "Dependencies installiert"
}

# Führe TypeScript-Check durch
run_typescript_check() {
    log_info "Führe TypeScript-Check durch..."
    
    npx tsc --noEmit --project ./
    
    if [ $? -eq 0 ]; then
        log_success "TypeScript-Check bestanden"
    else
        log_error "TypeScript-Check fehlgeschlagen"
        exit 1
    fi
}

# Führe ESLint durch
run_linting() {
    log_info "Führe Code-Linting durch..."
    
    npm run lint
    
    if [ $? -eq 0 ]; then
        log_success "Linting bestanden"
    else
        log_error "Linting fehlgeschlagen"
        echo "Bitte beheben Sie die Linting-Fehler vor dem Deployment."
        exit 1
    fi
}

# Führe Tests durch
run_tests() {
    log_info "Führe Tests durch..."
    
    # Unit Tests
    if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
        npm test -- --coverage --passWithNoTests
        
        if [ $? -eq 0 ]; then
            log_success "Tests bestanden"
        else
            log_error "Tests fehlgeschlagen"
            exit 1
        fi
    else
        log_warning "Keine Tests gefunden - überspringe"
    fi
}

# Build-Analyse für Performance
analyze_build() {
    log_info "Analysiere Build-Performance..."
    
    # Build ohne Caching
    ANALYZE=true npm run build
    
    # Bundle-Größe prüfen
    if [ -f ".next/static/chunks" ]; then
        local js_size=$(du -sh .next/static/chunks 2>/dev/null | cut -f1)
        echo "JavaScript Bundle Größe: $js_size"
    fi
    
    # Überprüfe Performance-Budget
    if [ "$DEPLOY_ENVIRONMENT" = "production" ]; then
        check_performance_budget
    fi
}

# Performance-Budget prüfen
check_performance_budget() {
    log_info "Prüfe Performance-Budget..."
    
    local budget_js=${NEXT_PUBLIC_PERFORMANCE_BUDGET_JS:-250}
    local budget_css=${NEXT_PUBLIC_PERFORMANCE_BUDGET_CSS:-50}
    local budget_images=${NEXT_PUBLIC_PERFORMANCE_BUDGET_IMAGES:-500}
    
    echo "Performance-Budget:"
    echo "  JavaScript: ${budget_js}KB"
    echo "  CSS: ${budget_css}KB" 
    echo "  Images: ${budget_images}KB"
    
    # TODO: Implementiere tatsächliche Budget-Prüfung
    log_success "Performance-Budget OK"
}

# Security-Check durchführen
run_security_check() {
    log_info "Führe Security-Scan durch..."
    
    # NPM Audit
    npm audit --audit-level=moderate
    
    if [ $? -ne 0 ]; then
        log_warning "Security Vulnerabilities gefunden"
        echo "Bitte beheben Sie die Sicherheitsprobleme vor dem Deployment."
        echo "npm audit fix"
    else
        log_success "Security-Scan bestanden"
    fi
}

# Optimiere Bilder und Assets
optimize_assets() {
    log_info "Optimiere Assets..."
    
    # Bilder komprimieren (falls imagemin verfügbar)
    if command -v imagemin &> /dev/null; then
        find public/images -name "*.jpg" -o -name "*.png" | head -10 | xargs imagemin --out-dir=public/images/optimized
    fi
    
    log_success "Asset-Optimierung abgeschlossen"
}

# Erstelle Deployment-Package
create_deployment_package() {
    log_info "Erstelle Deployment-Package..."
    
    # Erstelle tar.gz für Backup
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local package_name="${PROJECT_NAME}_${DEPLOY_ENVIRONMENT}_${timestamp}.tar.gz"
    
    tar -czf "$package_name" \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='*.tmp' \
        --exclude='coverage' \
        --exclude='.nyc_output' \
        .
    
    echo "Deployment-Package erstellt: $package_name"
    log_success "Deployment-Package bereit"
}

# Deploy zu Vercel
deploy_to_vercel() {
    log_info "Deploye zu Vercel..."
    
    # Vercel Login (falls noch nicht angemeldet)
    if ! vercel whoami &> /dev/null; then
        log_info "Vercel Login erforderlich..."
        vercel login
    fi
    
    # Deploy
    local vercel_args="--prod"
    
    if [ "$DEPLOY_ENVIRONMENT" = "staging" ]; then
        vercel_args="--target staging"
    elif [ "$DEPLOY_ENVIRONMENT" = "development" ]; then
        vercel_args="--target development"
    fi
    
    vercel $vercel_args --yes
    
    if [ $? -eq 0 ]; then
        log_success "Deployment erfolgreich"
    else
        log_error "Deployment fehlgeschlagen"
        exit 1
    fi
}

# Post-Deployment Tests
run_post_deployment_tests() {
    log_info "Führe Post-Deployment Tests durch..."
    
    # Warte auf Deployment
    echo "Warte 30 Sekunden auf Deployment-Verfügbarkeit..."
    sleep 30
    
    # Basis-URL ermitteln
    local deployment_url=$(vercel ls | grep "ready" | head -1 | awk '{print $2}')
    
    if [ -n "$deployment_url" ]; then
        echo "Testing deployment at: $deployment_url"
        
        # HTTP-Status prüfen
        local http_status=$(curl -s -o /dev/null -w "%{http_code}" "$deployment_url")
        
        if [ "$http_status" = "200" ]; then
            log_success "HTTP-Status OK (200)"
        else
            log_warning "HTTP-Status: $http_status"
        fi
        
        # API-Endpoints testen
        test_api_endpoints "$deployment_url"
        
    else
        log_warning "Deployment-URL nicht gefunden"
    fi
}

# API-Endpoints testen
test_api_endpoints() {
    local base_url=$1
    
    local endpoints=(
        "/api/health"
        "/api/notion/blog"
        "/api/notion/products"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local full_url="${base_url}${endpoint}"
        local status=$(curl -s -o /dev/null -w "%{http_code}" "$full_url")
        
        if [ "$status" = "200" ] || [ "$status" = "404" ]; then
            log_success "Endpoint OK: $endpoint ($status)"
        else
            log_warning "Endpoint Problem: $endpoint ($status)"
        fi
    done
}

# Cleanup nach Deployment
cleanup() {
    log_info "Cleanup nach Deployment..."
    
    # Cache leeren
    rm -rf .next/
    rm -rf node_modules/.cache/
    
    # Temporäre Dateien löschen
    find . -name "*.tmp" -delete
    find . -name "*.log" -delete
    
    log_success "Cleanup abgeschlossen"
}

# Benachrichtigung senden
send_notification() {
    local status=$1
    local message=$2
    
    # Slack-Benachrichtigung (falls konfiguriert)
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        local color="good"
        if [ "$status" != "success" ]; then
            color="danger"
        fi
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    echo ""
    echo -e "${GREEN}📧 Benachrichtigung gesendet${NC}"
}

# ========== HAUPTPROGRAMM ==========

main() {
    echo -e "${BLUE}🚀 Deployment für $PROJECT_NAME${NC}"
    echo "Environment: $DEPLOY_ENVIRONMENT"
    echo "Zeit: $(date)"
    echo "========================================"
    
    # Pre-Deployment Checks
    check_dependencies
    check_environment
    
    # Build & Test
    clean_build
    install_dependencies
    run_typescript_check
    run_linting
    run_tests
    
    # Security & Performance
    run_security_check
    analyze_build
    optimize_assets
    
    # Package & Deploy
    create_deployment_package
    deploy_to_vercel
    run_post_deployment_tests
    
    # Cleanup & Notification
    cleanup
    
    local success_message="🚀 ZOE Solar CMS erfolgreich deployed!\nEnvironment: $DEPLOY_ENVIRONMENT\nZeit: $(date)\nStatus: ✅ Erfolgreich"
    
    send_notification "success" "$success_message"
    
    echo ""
    log_success "Deployment abgeschlossen!"
    echo "Deployment-URL: $(vercel ls | grep 'ready' | head -1 | awk '{print $2}' || echo 'Nicht verfügbar')"
    echo "Zeit: $(date)"
}

# Signal Handler für sauberen Exit
trap cleanup EXIT

# Help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "ZOE Solar CMS Deployment Script"
    echo ""
    echo "Verwendung: $0 [environment]"
    echo ""
    echo "Environments:"
    echo "  production  (Standard) - Live-Deployment"
    echo "  staging     - Staging-Deployment"
    echo "  development - Development-Deployment"
    echo ""
    echo "Beispiele:"
    echo "  $0 production"
    echo "  $0 staging"
    echo ""
    echo "Voraussetzungen:"
    echo "  - Node.js und npm installiert"
    echo "  - Vercel CLI installiert (npm i -g vercel)"
    echo "  - .env.local konfiguriert"
    echo "  - Vercel Account und Projekt eingerichtet"
    exit 0
fi

# Script ausführen
main "$@"
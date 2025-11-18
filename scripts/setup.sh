#!/bin/bash

# 🛠️ Setup-Script für ZOE Solar Notion CMS
# Vollautomatische Installation und Konfiguration

set -e  # Exit on any error

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ASCII Art Banner
print_banner() {
    echo -e "${CYAN}"
    cat << 'EOF'
    ╔══════════════════════════════════════════════════════════════╗
    ║                    🚀 ZOE SOLAR CMS SETUP                    ║
    ║                  Vollautomatische Installation               ║
    ╚══════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

# Logging-Funktionen
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

log_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

# Benutzereingabe
ask_user() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " result
        result=${result:-$default}
    else
        read -p "$prompt: " result
    fi
    
    echo "$result"
}

# Passwort-Eingabe (versteckt)
ask_password() {
    local prompt="$1"
    local result
    
    read -s -p "$prompt: " result
    echo
    echo "$result"
}

# Validierung
validate_email() {
    local email="$1"
    if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

validate_url() {
    local url="$1"
    if [[ $url =~ ^https?://[a-zA-Z0-9.-]+ ]]; then
        return 0
    else
        return 1
    fi
}

generate_random_string() {
    local length="$1"
    openssl rand -base64 $length | tr -d "=+/" | cut -c1-$length
}

# System-Checks
check_system() {
    log_step "System-Anforderungen prüfen..."
    
    # OS prüfen
    local os=$(uname -s)
    case $os in
        Darwin*)
            log_info "macOS erkannt ✓"
            ;;
        Linux*)
            log_info "Linux erkannt ✓"
            ;;
        *)
            log_warning "Unbekanntes Betriebssystem: $os"
            ;;
    esac
    
    # Node.js prüfen
    if ! command -v node &> /dev/null; then
        log_error "Node.js nicht gefunden!"
        echo "Bitte installieren Sie Node.js von https://nodejs.org/"
        exit 1
    fi
    
    local node_version=$(node --version)
    log_success "Node.js gefunden: $node_version"
    
    # NPM prüfen
    if ! command -v npm &> /dev/null; then
        log_error "npm nicht gefunden!"
        exit 1
    fi
    
    local npm_version=$(npm --version)
    log_success "npm gefunden: $npm_version"
    
    # Git prüfen
    if ! command -v git &> /dev/null; then
        log_warning "Git nicht gefunden - einige Features könnten nicht verfügbar sein"
    else
        log_success "Git gefunden"
    fi
}

# Dependencies installieren
install_dependencies() {
    log_step "Projekt-Dependencies installieren..."
    
    # NPM-Pakete installieren
    npm install
    
    # Vercel CLI installieren (falls nicht vorhanden)
    if ! command -v vercel &> /dev/null; then
        log_info "Vercel CLI wird installiert..."
        npm install -g vercel
        log_success "Vercel CLI installiert"
    else
        log_success "Vercel CLI bereits verfügbar"
    fi
    
    # TypeScript prüfen
    if ! npx tsc --version &> /dev/null; then
        log_warning "TypeScript nicht verfügbar - wird installiert..."
        npm install -D typescript
    fi
}

# Notion-Konfiguration
setup_notion() {
    log_step "Notion-Integration konfigurieren..."
    
    echo ""
    echo -e "${CYAN}📋 Notion-Setup${NC}"
    echo "Bevor Sie fortfahren, müssen Sie:"
    echo "1. Eine Notion-Integration erstellen: https://developers.notion.com/"
    echo "2. Ihren Workspace-Zugangsschlüssel kopieren"
    echo "3. Ihre Datenbanken mit der Integration teilen"
    echo ""
    
    local notion_api_key=""
    while [ -z "$notion_api_key" ] || [ "$notion_api_key" = "secret_" ]; do
        notion_api_key=$(ask_user "Notion API-Schlüssel (secret_...)" "")
        if [ -z "$notion_api_key" ] || [ "$notion_api_key" = "secret_" ]; then
            log_error "Ungültiger API-Schlüssel"
        fi
    done
    
    local workspace_id=""
    while [ -z "$workspace_id" ]; do
        workspace_id=$(ask_user "Notion Workspace-ID" "")
        if [ -z "$workspace_id" ]; then
            log_error "Workspace-ID ist erforderlich"
        fi
    done
    
    # Datenbank-IDs sammeln
    local databases=(
        "Blog-Artikel:Blog-Datenbank-ID"
        "Produkte:Produkte-Datenbank-ID"
        "FAQ:FAQ-Datenbank-ID"
        "Team:Team-Datenbank-ID"
        "Standorte:Standorte-Datenbank-ID"
        "Galerie:Galerie-Datenbank-ID"
        "Kunden:Kunden-Datenbank-ID"
        "Artikel:Artikel-Datenbank-ID"
    )
    
    echo ""
    echo -e "${YELLOW}📁 Datenbank-IDs eingeben:${NC}"
    echo "Finden Sie die IDs in den Notion-Datenbank-URLs (32-stellige Hex-Codes)"
    echo ""
    
    for db_info in "${databases[@]}"; do
        IFS=':' read -r name field <<< "$db_info"
        eval "$field=$(ask_user "$name-Datenbank-ID" "")"
    done
    
    # .env.local erstellen
    create_env_file "$notion_api_key" "$workspace_id"
    
    log_success "Notion-Konfiguration abgeschlossen"
}

# Environment-Datei erstellen
create_env_file() {
    local notion_api_key="$1"
    local workspace_id="$2"
    
    log_step "Environment-Datei erstellen..."
    
    # Sichere Secrets generieren
    local jwt_secret=$(generate_random_string 32)
    local encryption_key=$(generate_random_string 32)
    local revalidate_token=$(generate_random_string 16)
    local revalidate_secret=$(generate_random_string 16)
    
    cat > .env.local << EOF
# =============================================================================
# NOTION INTEGRATION
# =============================================================================
NOTION_API_KEY=$notion_api_key
NOTION_WORKSPACE_ID=$workspace_id
NEXT_PUBLIC_NOTION_BLOG_DB_ID=$Blog_DB_ID
NEXT_PUBLIC_NOTION_PRODUCTS_DB_ID=$Produkte_DB_ID
NEXT_PUBLIC_NOTION_FAQ_DB_ID=$FAQ_DB_ID
NEXT_PUBLIC_NOTION_TEAM_DB_ID=$Team_DB_ID
NEXT_PUBLIC_NOTION_LOCATIONS_DB_ID=$Standorte_DB_ID
NEXT_PUBLIC_NOTION_GALLERY_DB_ID=$Galerie_DB_ID
NEXT_PUBLIC_NOTION_CUSTOMERS_DB_ID=$Kunden_DB_ID
NEXT_PUBLIC_NOTION_ARTICLES_DB_ID=$Artikel_DB_ID
NOTION_WEBHOOK_SECRET=whsec_$(generate_random_string 24)

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================
JWT_SECRET=$jwt_secret
API_KEY_ENCRYPTION_KEY=$encryption_key
REVALIDATE_TOKEN=$revalidate_token
REVALIDATE_SECRET=$revalidate_secret

# =============================================================================
# DATABASE & CACHING
# =============================================================================
# Vercel KV (wird später konfiguriert)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# =============================================================================
# DOMAINS & URLS
# =============================================================================
NEXT_PUBLIC_SITE_URL=https://zoe-solar.de
NEXT_PUBLIC_ALT_DOMAIN=https://www.zoe-solar.de
NEXT_PUBLIC_API_URL=https://api.zoe-solar.de
NEXT_PUBLIC_CDN_URL=https://cdn.zoe-solar.de
NEXT_PUBLIC_WS_URL=wss://ws.zoe-solar.de

# =============================================================================
# ANALYTICS & MONITORING (optional - später konfigurierbar)
# =============================================================================
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
# GOOGLE_SEARCH_CONSOLE_VERIFICATION=

# =============================================================================
# THIRD-PARTY INTEGRATIONS (optional - später konfigurierbar)
# =============================================================================
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
# NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
# RECAPTCHA_SECRET_KEY=

# =============================================================================
# EMAIL & NOTIFICATIONS (optional - später konfigurierbar)
# =============================================================================
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=ZOE Solar <noreply@zoe-solar.de>

# =============================================================================
# DEVELOPMENT & DEBUGGING
# =============================================================================
NODE_ENV=production
DEBUG_LEVEL=info

# =============================================================================
# PERFORMANCE & OPTIMIZATION
# =============================================================================
NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_USE_CDN=true
NEXT_PUBLIC_CDN_PROVIDER=vercel
NEXT_PUBLIC_PERFORMANCE_BUDGET_JS=250
NEXT_PUBLIC_PERFORMANCE_BUDGET_CSS=50
NEXT_PUBLIC_PERFORMANCE_BUDGET_IMAGES=500

# =============================================================================
# SEO & SOCIAL
# =============================================================================
NEXT_PUBLIC_SITE_NAME=ZOE Solar GmbH
NEXT_PUBLIC_SITE_DESCRIPTION=Ihr Partner für nachhaltige Solarlösungen
NEXT_PUBLIC_SITE_KEYWORDS=Photovoltaik, Solarenergie, Solaranlagen, nachhaltige Energie
NEXT_PUBLIC_TWITTER_HANDLE=@zoesolar
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/zoesolar
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/zoesolar
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/zoe-solar

# =============================================================================
# INTERNATIONALIZATION (i18n)
# =============================================================================
NEXT_PUBLIC_DEFAULT_LOCALE=de
NEXT_PUBLIC_AVAILABLE_LOCALES=de,en,fr

# =============================================================================
# FEATURE FLAGS
# =============================================================================
NEXT_PUBLIC_ENABLE_BLOG=true
NEXT_PUBLIC_ENABLE_PRODUCTS=true
NEXT_PUBLIC_ENABLE_FAQ=true
NEXT_PUBLIC_ENABLE_TEAM=true
NEXT_PUBLIC_ENABLE_LOCATIONS=true
NEXT_PUBLIC_ENABLE_GALLERY=true
NEXT_PUBLIC_ENABLE_SEARCH=true
NEXT_PUBLIC_ENABLE_FORMS=true
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
NEXT_PUBLIC_ENABLE_AI_CHAT=false
NEXT_PUBLIC_ENABLE_VOICE_SEARCH=false
NEXT_PUBLIC_ENABLE_PWA=true

# =============================================================================
# LEGAL & COMPLIANCE
# =============================================================================
NEXT_PUBLIC_COOKIE_CONSENT_REQUIRED=true
NEXT_PUBLIC_PRIVACY_POLICY_URL=/datenschutz
NEXT_PUBLIC_TERMS_URL=/agb
NEXT_PUBLIC_IMPRESSUM_URL=/impressum

# =============================================================================
# ERROR TRACKING & MONITORING (optional - später konfigurierbar)
# =============================================================================
# SENTRY_DSN=
# NEXT_PUBLIC_LOGROCKET_APP_ID=

# =============================================================================
# BACKUP & MAINTENANCE
# =============================================================================
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_MAINTENANCE_MESSAGE=Die Webseite wird gerade aktualisiert. Bitte versuchen Sie es später erneut.
EOF
    
    log_success "Environment-Datei (.env.local) erstellt"
    log_warning "WICHTIG: Bewahren Sie .env.local sicher auf - enthält sensible Daten!"
}

# Vercel-Konfiguration
setup_vercel() {
    log_step "Vercel-Konfiguration..."
    
    echo ""
    echo -e "${CYAN}🚀 Vercel-Setup${NC}"
    echo "Für das Deployment benötigen Sie:"
    echo "1. Einen Vercel-Account (https://vercel.com/)"
    echo "2. Vercel CLI (wird automatisch installiert)"
    echo ""
    
    local setup_vercel=$(ask_user "Vercel-Setup jetzt durchführen? (j/n)" "j")
    
    if [ "$setup_vercel" = "j" ] || [ "$setup_vercel" = "J" ]; then
        # Vercel Login
        echo "Führe Vercel Login durch..."
        vercel login
        
        # Projekt verknüpfen
        echo "Verknüpfe Projekt mit Vercel..."
        vercel link --yes
        
        log_success "Vercel-Konfiguration abgeschlossen"
    else
        log_info "Vercel-Setup übersprungen - kann später mit 'vercel link' durchgeführt werden"
    fi
    
    # Optional: KV Store einrichten
    local setup_kv=$(ask_user "Vercel KV Store einrichten? (j/n)" "j")
    
    if [ "$setup_kv" = "j" ] || [ "$setup_kv" = "J" ]; then
        echo "Erstelle KV Store..."
        vercel kv create --name=zoe-solar-cache --yes
        
        log_success "KV Store eingerichtet"
        log_info "KV Credentials werden automatisch zu Vercel Environment hinzugefügt"
    fi
}

# Notion-Datenbanken validieren
validate_notion_databases() {
    log_step "Notion-Datenbanken validieren..."
    
    echo "Teste Verbindung zu Notion..."
    
    # Test API-Verbindung
    local test_result=$(curl -s \
        -H "Authorization: Bearer $NOTION_API_KEY" \
        -H "Notion-Version: 2022-06-28" \
        "https://api.notion.com/v1/users/me" 2>/dev/null || echo "FAILED")
    
    if [[ "$test_result" == *"FAILED"* ]] || [[ "$test_result" == *"error"* ]]; then
        log_error "Notion API-Verbindung fehlgeschlagen!"
        echo "Bitte prüfen Sie:"
        echo "- API-Schlüssel ist korrekt"
        echo "- Integration hat Zugriff auf den Workspace"
        echo "- Internetverbindung ist aktiv"
        return 1
    fi
    
    log_success "Notion API-Verbindung OK"
    
    # Test Datenbanken
    local database_fields=(
        "NEXT_PUBLIC_NOTION_BLOG_DB_ID:Blog"
        "NEXT_PUBLIC_NOTION_PRODUCTS_DB_ID:Produkte"
        "NEXT_PUBLIC_NOTION_FAQ_DB_ID:FAQ"
        "NEXT_PUBLIC_NOTION_TEAM_DB_ID:Team"
    )
    
    for field_info in "${database_fields[@]}"; do
        IFS=':' read -r field_name display_name <<< "$field_info"
        local db_id="${!field_name}"
        
        if [ -n "$db_id" ]; then
            echo "Teste $display_name-Datenbank..."
            
            local db_result=$(curl -s \
                -H "Authorization: Bearer $NOTION_API_KEY" \
                -H "Notion-Version: 2022-06-28" \
                "https://api.notion.com/v1/databases/$db_id" 2>/dev/null || echo "FAILED")
            
            if [[ "$db_result" == *"object"* ]] && [[ "$db_result" != *"error"* ]]; then
                log_success "$display_name-Datenbank erreichbar"
            else
                log_warning "$display_name-Datenbank nicht erreichbar oder ungültige ID"
            fi
        fi
    done
}

# Test-Build durchführen
run_test_build() {
    log_step "Test-Build durchführen..."
    
    # Build durchführen
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Build erfolgreich"
    else
        log_error "Build fehlgeschlagen"
        echo "Bitte prüfen Sie die TypeScript-Errors und starten Sie das Setup erneut"
        exit 1
    fi
}

# Git-Repository initialisieren
init_git() {
    log_step "Git-Repository initialisieren..."
    
    if [ -d ".git" ]; then
        log_info "Git-Repository bereits initialisiert"
        return
    fi
    
    # Git initialisieren
    git init
    
    # .gitignore erstellen (falls nicht vorhanden)
    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Coverage
coverage/
.nyc_output

# Temporary
*.tmp
*.temp

# Cache
.cache/
.parcel-cache/

# Vercel
.vercel

# Deployment
deployment-*.tar.gz
EOF
    fi
    
    # Initial Commit
    git add .
    git commit -m "Initial commit: ZOE Solar Notion CMS Setup"
    
    log_success "Git-Repository initialisiert"
}

# README erstellen
create_readme() {
    log_step "README-Dokumentation erstellen..."
    
    cat > README.md << 'EOF'
# 🚀 ZOE Solar Notion CMS

Ein produktionsreifes CMS-System basierend auf Notion für die ZOE Solar Webseite.

## ✨ Features

- 🔗 Vollständige Notion-Integration
- ⚡ Vercel Edge-Optimierungen mit ISR
- 🔐 Sicherheitskomponenten (RBAC, Audit-Logging, API-Key-Manager)
- 🎯 Performance-optimiert (Core Web Vitals, Image Optimization)
- 🔄 Real-time Updates via Webhooks
- 📱 Mobile-first Design mit PWA-Support
- 🔍 SEO-optimiert mit strukturierter Daten
- 📊 Analytics und Monitoring integriert

## 🛠️ Installation

1. Repository klonen:
```bash
git clone <repository-url>
cd zoe-solar-notion-cms
```

2. Setup-Script ausführen:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

3. Notion-Integration erstellen:
   - https://developers.notion.com/
   - API-Schlüssel kopieren
   - Datenbanken mit Integration teilen

4. Vercel-Setup:
   - Account erstellen: https://vercel.com/
   - CLI installieren: `npm i -g vercel`
   - Projekt verknüpfen: `vercel link`

5. Deployen:
```bash
./scripts/deploy.sh production
```

## 📁 Struktur

```
├── api/                    # Vercel Edge Functions
├── src/
│   ├── components/         # React Komponenten
│   ├── hooks/             # Custom Hooks
│   ├── lib/               # Bibliotheken
│   │   ├── cache/         # Cache-Management
│   │   ├── notion/        # Notion-Client
│   │   ├── performance/   # Performance-Optimierungen
│   │   └── security/      # Sicherheitskomponenten
│   └── pages/             # Next.js Pages
├── scripts/               # Deployment-Scripts
├── public/                # Statische Assets
└── docs/                  # Dokumentation
```

## 🔧 Konfiguration

### Environment-Variablen

Kopieren Sie `.env.example` zu `.env.local` und füllen Sie die Werte aus:

```bash
cp .env.example .env.local
```

### Notion-Datenbanken

Erstellen Sie folgende Datenbanken in Notion und fügen Sie diese Eigenschaften hinzu:

#### Blog-Artikel
- **Title** (Title)
- **Category** (Select)
- **Featured** (Checkbox)
- **Published** (Checkbox)
- **Published Date** (Date)

#### Produkte
- **Name** (Title)
- **Description** (Rich Text)
- **Price** (Number)
- **Category** (Select)
- **Featured** (Checkbox)
- **Active** (Checkbox)

#### FAQ
- **Question** (Title)
- **Answer** (Rich Text)
- **Category** (Select)
- **Order** (Number)
- **Published** (Checkbox)

## 🚀 Deployment

### Automatisches Deployment

```bash
# Production
./scripts/deploy.sh production

# Staging
./scripts/deploy.sh staging

# Development
./scripts/deploy.sh development
```

### Manuelles Deployment

```bash
# Build
npm run build

# Deploy
vercel --prod
```

## 📊 Monitoring

- **Performance**: Core Web Vitals Monitoring
- **Analytics**: Google Analytics 4 Integration
- **Error Tracking**: Sentry (optional)
- **Uptime**: Vercel Analytics

## 🔒 Sicherheit

- **API-Schlüssel**: AES-256-GCM Verschlüsselung
- **Rate Limiting**: Per-Endpoint Beschränkungen
- **CORS**: Konfiguriert für sichere Requests
- **Headers**: Security-Headers (CSP, HSTS, etc.)
- **Audit Logging**: Alle Aktionen werden protokolliert

## 🔄 Webhooks

Notion-Webhooks für automatische Cache-Invalidierung:

```javascript
// Webhook-URL
https://your-app.vercel.app/api/webhooks/notion
```

## 🛡️ Performance

- **ISR**: Incremental Static Regeneration
- **Edge CDN**: Globale Verteilung
- **Image Optimization**: Automatische Optimierung
- **Code Splitting**: Route-basiertes Splitting
- **Preloading**: Kritische Resources vorgeladen

## 📖 Dokumentation

- [Setup-Guide](./docs/SETUP_GUIDE.md)
- [API-Dokumentation](./docs/API_DOCS.md)
- [Deployment-Guide](./docs/DEPLOYMENT_GUIDE.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Support

- **Issues**: GitHub Issues
- **Email**: support@zoe-solar.de
- **Dokumentation**: [docs/](./docs/)

## 📄 Lizenz

Proprietary - Alle Rechte vorbehalten.

---

**ZOE Solar GmbH** - Ihr Partner für nachhaltige Solarlösungen 🌞
EOF
    
    log_success "README.md erstellt"
}

# Finales Setup
final_setup() {
    log_step "Finales Setup..."
    
    # Berechtigungen setzen
    chmod +x scripts/*.sh
    
    # Package.json Scripts erweitern
    update_package_json_scripts
    
    log_success "Setup abgeschlossen!"
}

# Package.json Scripts aktualisieren
update_package_json_scripts() {
    if [ -f "package.json" ]; then
        # Backup erstellen
        cp package.json package.json.backup
        
        # jq verwenden um Scripts hinzuzufügen (falls verfügbar)
        if command -v jq &> /dev/null; then
            jq '.scripts.setup = "chmod +x scripts/*.sh && echo Setup abgeschlossen!"' package.json > temp.json
            mv temp.json package.json
        fi
    fi
}

# Nach-Setup-Check
post_setup_check() {
    log_step "Nach-Setup-Validierung..."
    
    # Teste kritische Komponenten
    echo ""
    echo -e "${CYAN}🧪 Führe System-Tests durch...${NC}"
    
    # Node.js Test
    if node --version &> /dev/null; then
        log_success "Node.js funktioniert"
    else
        log_error "Node.js Problem"
    fi
    
    # NPM Test
    if npm --version &> /dev/null; then
        log_success "npm funktioniert"
    else
        log_error "npm Problem"
    fi
    
    # Environment-Datei prüfen
    if [ -f ".env.local" ]; then
        log_success "Environment-Datei vorhanden"
    else
        log_error "Environment-Datei fehlt!"
    fi
    
    # Build-Test
    echo ""
    echo "Führe Build-Test durch..."
    npm run build &> /dev/null
    
    if [ $? -eq 0 ]; then
        log_success "Build-Test bestanden"
    else
        log_warning "Build-Test fehlgeschlagen - prüfen Sie die Konfiguration"
    fi
    
    # Berechtigungen prüfen
    if [ -x "scripts/deploy.sh" ]; then
        log_success "Deployment-Script ausführbar"
    else
        chmod +x scripts/deploy.sh
        log_success "Deployment-Script-Berechtigungen gesetzt"
    fi
}

# Nächste Schritte anzeigen
show_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Setup erfolgreich abgeschlossen!${NC}"
    echo ""
    echo -e "${CYAN}📋 Nächste Schritte:${NC}"
    echo ""
    echo "1. 🔗 Notion-Datenbanken erstellen:"
    echo "   - Blog-Artikel mit erforderlichen Eigenschaften"
    echo "   - Produkte-Datenbank"
    echo "   - FAQ-Datenbank"
    echo "   - Weitere Datenbanken nach Bedarf"
    echo ""
    echo "2. 🏗️ Lokaler Test:"
    echo "   npm run dev"
    echo ""
    echo "3. 🚀 Deployment:"
    echo "   ./scripts/deploy.sh production"
    echo ""
    echo "4. 📊 Monitoring einrichten:"
    echo "   - Google Analytics"
    echo "   - Google Search Console"
    echo "   - Vercel Analytics"
    echo ""
    echo -e "${YELLOW}⚠️ Wichtige Hinweise:${NC}"
    echo "- Bewahren Sie .env.local sicher auf"
    echo "- Teilen Sie Notion-Datenbanken mit der Integration"
    echo "- Testen Sie alle Funktionen vor dem Live-Deployment"
    echo ""
    echo -e "${BLUE}📖 Dokumentation:${NC}"
    echo "- README.md für Übersicht"
    echo "- ./docs/ für detaillierte Anleitungen"
    echo ""
}

# Hauptfunktion
main() {
    clear
    print_banner
    
    echo -e "${CYAN}Willkommen zum ZOE Solar CMS Setup!${NC}"
    echo "Dieses Script installiert und konfiguriert Ihr komplettes CMS-System."
    echo ""
    
    # Bestätigung
    local confirm=$(ask_user "Möchten Sie mit dem Setup fortfahren? (j/n)" "j")
    if [ "$confirm" != "j" ] && [ "$confirm" != "J" ]; then
        log_info "Setup abgebrochen"
        exit 0
    fi
    
    # Setup-Schritte ausführen
    check_system
    install_dependencies
    setup_notion
    setup_vercel
    validate_notion_databases
    init_git
    create_readme
    run_test_build
    final_setup
    post_setup_check
    show_next_steps
    
    echo ""
    log_success "🎉 ZOE Solar CMS ist bereit für den Einsatz!"
    echo "Zeit: $(date)"
}

# Help
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "ZOE Solar CMS Setup-Script"
    echo ""
    echo "Verwendung: $0 [optionen]"
    echo ""
    echo "Optionen:"
    echo "  --help, -h       Diese Hilfe anzeigen"
    echo "  --version        Version anzeigen"
    echo "  --check-only     Nur System-Checks durchführen"
    echo ""
    echo "Das Script führt durch:"
    echo "  ✓ System-Anforderungen prüfen"
    echo "  ✓ Dependencies installieren"
    echo "  ✓ Notion-Integration konfigurieren"
    echo "  ✓ Vercel-Setup"
    echo "  ✓ Environment-Datei erstellen"
    echo "  ✓ Git-Repository initialisieren"
    echo "  ✓ Build-Test durchführen"
    echo ""
    echo "Voraussetzungen:"
    echo "  - Node.js (Version 16+)"
    echo "  - npm"
    echo "  - Internetverbindung"
    echo "  - Notion-Account"
    echo "  - Vercel-Account (optional)"
    exit 0
fi

# Version
if [ "$1" = "--version" ]; then
    echo "ZOE Solar CMS Setup Script v1.0.0"
    exit 0
fi

# Check-only Mode
if [ "$1" = "--check-only" ]; then
    check_system
    exit 0
fi

# Script ausführen
main "$@"
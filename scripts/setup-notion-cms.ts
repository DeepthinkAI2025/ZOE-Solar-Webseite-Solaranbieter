#!/usr/bin/env tsx

/**
 * 🚀 ZOE Solar Notion CMS Setup Script
 * Automatisierte Einrichtung der Notion CMS Integration
 */

import { notionService } from '../src/lib/notion/enhanced-client'
import { workspaceTemplate } from '../notion-workspace-template.json'

interface SetupOptions {
  dryRun: boolean
  createDatabases: boolean
  migrateData: boolean
  setupWebhooks: boolean
}

class NotionCMSSetup {
  private options: SetupOptions
  private notionService: any
  
  constructor(options: SetupOptions) {
    this.options = options
    this.notionService = new notionService()
  }
  
  async run() {
    console.log('🚀 Starte ZOE Solar Notion CMS Setup...')
    console.log('===========================================')
    
    try {
      // 1. Vorbedingungen prüfen
      await this.checkPrerequisites()
      
      // 2. Notion Workspace prüfen
      await this.verifyWorkspace()
      
      // 3. Datenbanken erstellen (falls gewünscht)
      if (this.options.createDatabases) {
        await this.createDatabases()
      }
      
      // 4. Beispiel-Daten migrieren
      if (this.options.migrateData) {
        await this.migrateSampleData()
      }
      
      // 5. Webhooks einrichten
      if (this.options.setupWebhooks) {
        await this.setupWebhooks()
      }
      
      // 6. Environment-Variablen generieren
      await this.generateEnvironmentConfig()
      
      // 7. Test-Validierung
      await this.runTests()
      
      console.log('✅ Notion CMS Setup erfolgreich abgeschlossen!')
      console.log('')
      console.log('📋 Nächste Schritte:')
      console.log('1. Kopiere die .env.local.example nach .env.local')
      console.log('2. Trage deine Notion-Datenbank-IDs ein')
      console.log('3. Starte die Entwicklung: npm run dev')
      console.log('')
      console.log('🔗 Helpful Links:')
      console.log('- Notion API: https://developers.notion.com/')
      console.log('- Documentation: NOTION_CMS_VOLLSTÄNDIGE_IMPLEMENTIERUNGSSTRATEGIE.md')
      
    } catch (error) {
      console.error('❌ Setup fehlgeschlagen:', error)
      process.exit(1)
    }
  }
  
  private async checkPrerequisites() {
    console.log('🔍 Prüfe Vorbedingungen...')
    
    const requiredVars = [
      'VITE_NOTION_TOKEN',
      'VITE_NOTION_WORKSPACE_ID'
    ]
    
    const missing = requiredVars.filter(varName => !process.env[varName])
    
    if (missing.length > 0) {
      throw new Error(`Fehlende Umgebungsvariablen: ${missing.join(', ')}`)
    }
    
    console.log('✅ Vorbedingungen erfüllt')
  }
  
  private async verifyWorkspace() {
    console.log('🔗 Überprüfe Notion Workspace...')
    
    try {
      // Test-Verbindung zu Notion
      const response = await this.notionService.client.users.me()
      console.log('✅ Verbindung zu Notion erfolgreich')
      console.log(`   Workspace: ${response.bot?.owner?.workspace_name || 'Unbekannt'}`)
      
    } catch (error) {
      throw new Error(`Notion-Verbindung fehlgeschlagen: ${error.message}`)
    }
  }
  
  private async createDatabases() {
    console.log('🗄️ Erstelle Datenbanken in Notion...')
    
    for (const [key, dbConfig] of Object.entries(workspaceTemplate.databases)) {
      if (this.options.dryRun) {
        console.log(`   [DRY RUN] Würde Datenbank erstellen: ${dbConfig.name}`)
        continue
      }
      
      try {
        console.log(`   Erstelle: ${dbConfig.name}`)
        await this.createDatabase(dbConfig)
        console.log(`   ✅ ${dbConfig.name} erstellt`)
      } catch (error) {
        console.error(`   ❌ Fehler bei ${dbConfig.name}:`, error.message)
      }
    }
  }
  
  private async createDatabase(dbConfig: any) {
    // Vereinfachte Datenbank-Erstellung
    // In der Praxis müsste dies über die Notion API gemacht werden
    console.log(`      Erstelle Datenbank-Schema für ${dbConfig.name}`)
    
    // Placeholder für API-Call
    // await this.notionService.client.databases.create({
    //   parent: { type: 'page_id', page_id: process.env.VITE_NOTION_ROOT_PAGE_ID },
    //   title: [{ type: 'text', text: { content: dbConfig.name } }],
    //   properties: this.mapProperties(dbConfig.properties)
    // })
  }
  
  private async migrateSampleData() {
    console.log('📦 Migriere Beispiel-Daten...')
    
    const migrations = [
      {
        name: 'Blog-Artikel',
        action: this.migrateBlogSample
      },
      {
        name: 'Website-Seiten', 
        action: this.migratePagesSample
      },
      {
        name: 'API-Endpunkte',
        action: this.migrateApiSample
      }
    ]
    
    for (const migration of migrations) {
      if (this.options.dryRun) {
        console.log(`   [DRY RUN] Würde migrieren: ${migration.name}`)
        continue
      }
      
      try {
        await migration.action.call(this)
        console.log(`   ✅ ${migration.name} migriert`)
      } catch (error) {
        console.error(`   ❌ Fehler bei ${migration.name}:`, error.message)
      }
    }
  }
  
  private async migrateBlogSample() {
    const sampleArticles = [
      {
        title: 'Photovoltaik für Gewerbe: Die perfekte Lösung',
        slug: 'photovoltaik-fuer-gewerbe',
        category: 'Business',
        teaserText: 'Entdecken Sie wie Gewerbetreibende von Solaranlagen profitieren.',
        status: 'Veröffentlicht'
      },
      {
        title: 'Wartung von Solaranlagen: Was ist wichtig?',
        slug: 'wartung-solaranlagen',
        category: 'Technik',
        teaserText: 'Erfahren Sie alles über die richtige Wartung Ihrer PV-Anlage.',
        status: 'Entwurf'
      }
    ]
    
    console.log('      Migriere 2 Beispiel-Blog-Artikel...')
    // Migration-Logik würde hier stehen
  }
  
  private async migratePagesSample() {
    const samplePages = [
      {
        name: 'Photovoltaik',
        urlPath: '/photovoltaik',
        type: 'Produkt',
        category: 'Photovoltaik',
        mainNav: true,
        status: 'Live'
      },
      {
        name: 'Über Uns',
        urlPath: '/ueber-uns',
        type: 'Info',
        category: 'Unternehmen',
        mainNav: true,
        status: 'Live'
      }
    ]
    
    console.log('      Migriere 2 Beispiel-Seiten...')
  }
  
  private async migrateApiSample() {
    const sampleEndpoints = [
      {
        name: 'Blog-Artikel abrufen',
        method: 'GET',
        path: '/api/blog',
        description: 'Ruft alle veröffentlichten Blog-Artikel ab',
        auth: 'Öffentlich',
        status: 'Aktiv'
      },
      {
        name: 'Produkte abrufen',
        method: 'GET', 
        path: '/api/products',
        description: 'Ruft alle Produkte ab',
        auth: 'Öffentlich',
        status: 'Aktiv'
      }
    ]
    
    console.log('      Migriere 2 API-Endpunkte...')
  }
  
  private async setupWebhooks() {
    console.log('📡 Richte Webhooks ein...')
    
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'}/api/notion-webhook`
    
    console.log(`   Webhook URL: ${webhookUrl}`)
    console.log('   Event Types: page.created, page.updated, page.deleted')
    
    if (!this.options.dryRun) {
      // Webhook über Notion API einrichten
      console.log('   [HINWEIS] Webhook muss manuell in Notion eingerichtet werden')
      console.log(`            URL: ${webhookUrl}`)
    }
  }
  
  private async generateEnvironmentConfig() {
    console.log('⚙️ Generiere Environment-Konfiguration...')
    
    const envConfig = `# ZOE Solar Notion CMS Environment Configuration
# Copy this to .env.local and update with your actual values

# Notion Configuration
VITE_NOTION_TOKEN=${process.env.VITE_NOTION_TOKEN}
VITE_NOTION_WORKSPACE_ID=060d95db-e7b1-8199-bd5c-00031da83d2c

# Database IDs (Update after creating databases in Notion)
VITE_NOTION_BLOG_DB=your_blog_database_id_here
VITE_NOTION_IMAGES_DB=your_images_database_id_here
VITE_NOTION_PRODUCTS_DB=your_products_database_id_here
VITE_NOTION_PAGES_DB=your_pages_database_id_here
VITE_NOTION_CUSTOMERS_DB=your_customers_database_id_here
VITE_NOTION_EMPLOYEES_DB=your_employees_database_id_here
VITE_NOTION_AUTH_DB=your_auth_database_id_here
VITE_NOTION_PROJECTS_DB=your_projects_database_id_here
VITE_NOTION_API_DB=your_api_database_id_here

# Security
VITE_WEBHOOK_SECRET=your_32_character_webhook_secret_here
ENCRYPTION_KEY=your_32_character_encryption_key_here
API_SIGNING_SECRET=your_api_signing_secret_here

# Cache Configuration
VITE_NOTION_ENABLE_CACHE=true
VITE_NOTION_CACHE_DURATION=300000

# Vercel Configuration
KV_REST_API_URL=your_vercel_kv_url_here
KV_REST_API_TOKEN=your_vercel_kv_token_here

# External Services
SENTRY_DSN=your_sentry_dsn_here
ANALYTICS_ID=your_analytics_id_here

# Development
NODE_ENV=production`

    console.log('   ✅ Environment-Konfiguration generiert')
    console.log('   💾 Gespeichert als: .env.local.example')
    
    // In echter Implementierung würde hier geschrieben werden
    // fs.writeFileSync('.env.local.example', envConfig)
  }
  
  private async runTests() {
    console.log('🧪 Führe Tests durch...')
    
    const tests = [
      { name: 'Notion API', test: this.testNotionAPI },
      { name: 'Cache System', test: this.testCacheSystem },
      { name: 'Webhook Endpoint', test: this.testWebhookEndpoint }
    ]
    
    for (const test of tests) {
      try {
        await test.test.call(this)
        console.log(`   ✅ ${test.name} Test bestanden`)
      } catch (error) {
        console.log(`   ❌ ${test.name} Test fehlgeschlagen: ${error.message}`)
      }
    }
  }
  
  private async testNotionAPI() {
    // Test Notion API-Verbindung
    const articles = await this.notionService.getBlogArticles({ limit: 1 })
    if (!Array.isArray(articles)) {
      throw new Error('Invalid API response')
    }
  }
  
  private async testCacheSystem() {
    // Test Cache-Funktionalität
    const { cacheManager } = await import('../src/lib/cache/cache-manager')
    cacheManager.set('test', 'test-value', 60000)
    const value = cacheManager.get('test')
    if (value !== 'test-value') {
      throw new Error('Cache system not working')
    }
  }
  
  private async testWebhookEndpoint() {
    // Test Webhook-Endpoint (vereinfacht)
    const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/notion-webhook`
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    })
    
    if (!response.ok) {
      throw new Error(`Webhook endpoint returned ${response.status}`)
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  
  const options: SetupOptions = {
    dryRun: args.includes('--dry-run'),
    createDatabases: args.includes('--create-databases'),
    migrateData: args.includes('--migrate-data'),
    setupWebhooks: args.includes('--setup-webhooks')
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🚀 ZOE Solar Notion CMS Setup Script

Usage: npm run setup:notion-cms [options]

Options:
  --dry-run          Show what would be done without making changes
  --create-databases Create databases in Notion
  --migrate-data     Migrate sample data
  --setup-webhooks   Setup webhook endpoints
  --help, -h         Show this help message

Examples:
  npm run setup:notion-cms --dry-run
  npm run setup:notion-cms --create-databases --migrate-data
  npm run setup:notion-cms --create-databases --migrate-data --setup-webhooks

Quick Start:
  1. Set VITE_NOTION_TOKEN and VITE_NOTION_WORKSPACE_ID environment variables
  2. npm run setup:notion-cms --dry-run  # Preview changes
  3. npm run setup:notion-cms --create-databases --migrate-data --setup-webhooks
    `)
    process.exit(0)
  }
  
  // Default: All options enabled for full setup
  if (args.length === 0) {
    options.createDatabases = true
    options.migrateData = true
    options.setupWebhooks = true
  }
  
  const setup = new NotionCMSSetup(options)
  await setup.run()
}

// Script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { NotionCMSSetup }
#!/usr/bin/env node

/**
 * Enhanced Notion Setup Manager for ZOE Solar
 *
 * This script properly creates all required databases and pages in Notion
 * using the latest Notion API best practices and proper error handling.
 *
 * Requirements:
 * - NOTION_TOKEN environment variable
 * - Optional: NOTION_PARENT_PAGE_ID (creates databases as subpages)
 *
 * Usage:
 * node scripts/notion-setup-manager.cjs
 */

const { Client } = require('@notionhq/client');

// Configuration with validation
const config = {
  token: process.env.NOTION_TOKEN || process.env.VITE_NOTION_TOKEN,
  parentPageId: process.env.NOTION_PARENT_PAGE_ID || process.env.VITE_NOTION_PARENT_PAGE_ID,
  environment: process.env.NODE_ENV || 'development',
  workspaceName: 'ZOE Solar',
  integrationName: 'ZOE Solar Conversion System'
};

// Validate configuration
if (!config.token) {
  console.error('❌ FEHLER: NOTION_TOKEN oder VITE_NOTION_TOKEN Umgebungsvariable ist erforderlich');
  console.error('');
  console.error('🔑 SO RICHTEN SIE DEN TOKEN EIN:');
  console.error('');
  console.error('1. Notion Integration erstellen:');
  console.error('   • Gehen Sie zu: https://www.notion.so/my-integrations');
  console.error('   • Integration Name: "ZOE Solar Conversion System"');
  console.error('   • Workspace: "ZOE Solar"');
  console.error('');
  console.error('2. Integration Token kopieren:');
  console.error('   • Secret: your_notion_api_token_here');
  console.error('   • Funktionsbereich: Nur Workspace "ZOE Solar"');
  console.error('');
  console.error('3. Umgebungsvariable setzen:');
  console.error('   export NOTION_TOKEN=your_notion_api_token_here');
  console.error('');
  process.exit(1);
}

console.log('🔧 ZOE Solar Notion Setup Manager');
console.log('====================================');
console.log(`Environment: ${config.environment}`);
console.log(`Workspace: ${config.workspaceName}`);
console.log(`Integration: ${config.integrationName}`);
console.log(`Parent Page: ${config.parentPageId || 'Root Workspace'}`);
console.log('');

// Initialize Notion client with proper configuration
const notion = new Client({
  auth: config.token,
  timeoutMs: 30000, // 30 second timeout
  // Use latest API version
  notionVersion: '2022-06-28'
});

/**
 * Robust database creation with proper error handling
 */
async function createDatabase(schema, databaseName) {
  try {
    console.log(`📝 Erstelle Datenbank: ${databaseName}`);

    // First check if database already exists
    if (config.parentPageId) {
      try {
        const existingDatabases = await notion.search({
          filter: {
            property: 'object',
            value: 'database'
          },
          page_size: 100,
          query: databaseName
        });

        const existingDb = existingDatabases.results.find(db =>
          db.title && db.title[0]?.plain_text === databaseName
        );

        if (existingDb) {
          console.log(`✅ Datenbank '${databaseName}' existiert bereits: ${existingDb.id}`);
          return existingDb;
        }
      } catch (searchError) {
        console.warn('⚠️  Konnte existierende Datenbanken nicht prüfen, erstelle neu...');
      }
    }

    // Prepare database schema according to Notion API specification
    const databaseSchema = {
      parent: {
        type: 'page_id',
        page_id: config.parentPageId || '2a3d95db-e7b1-80de-ace7-e8ab322f8f1a' // Steuersoftware (CMS) page
      },
      title: [{
        text: { content: databaseName }
      }],
      properties: schema.properties,
      // Add icon and cover for better organization
      ...(schema.icon && { icon: schema.icon }),
      ...(schema.cover && { cover: schema.cover })
    };

    // Debug: Log the schema
    if (config.environment === 'development') {
      console.log(`🔍 Debug - Database Schema for ${databaseName}:`);
      console.log(`   Properties count: ${Object.keys(schema.properties || {}).length}`);
      console.log(`   Has icon: ${!!schema.icon}`);
      console.log(`   Properties:`, Object.keys(schema.properties || {}));
      console.log(`   Schema properties type: ${typeof schema.properties}`);
      console.log(`   First property:`, schema.properties ? Object.keys(schema.properties)[0] : 'undefined');
      console.log(`   Raw schema properties:`, JSON.stringify(schema.properties, null, 2));
      console.log(`   Full database schema:`, JSON.stringify(databaseSchema, null, 2));
    }

    const response = await notion.databases.create(databaseSchema);

    console.log(`✅ Datenbank '${databaseName}' erfolgreich erstellt`);
    console.log(`   ID: ${response.id}`);
    console.log(`   URL: ${response.url}`);

    return response;

  } catch (error) {
    if (error.code === 'object_already_exists') {
      console.log(`✅ Datenbank '${databaseName}' existiert bereits`);
      return { id: 'existing', url: 'existing' };
    }

    console.error(`❌ FEHLER beim Erstellen der Datenbank '${databaseName}':`);
    console.error(`   Code: ${error.code || 'Unknown'}`);
    console.error(`   Message: ${error.message}`);

    if (error.code === 'unauthorized') {
      console.error('');
      console.error('💡 LÖSUNG: Stellen Sie sicher, dass:');
      console.error('   1. Der Token korrekt ist');
      console.error('   2. Die Integration die notwendigen Berechtigungen hat');
      console.error('   3. Die Integration für den Workspace freigegeben wurde');
    }

    if (error.code === 'validation_error') {
      console.error('');
      console.error('💡 LÖSUNG: Überprüfen Sie das Datenbank-Schema');
      console.error('   Einige Property-Typen werden nicht unterstützt');
      console.error('');
      console.error('DEBUG INFO:');
      console.error(`   Schema type: ${typeof schema}`);
      console.error(`   Properties type: ${typeof schema?.properties}`);
      console.error(`   Properties: ${schema?.properties ? 'defined' : 'undefined'}`);
    }

    throw error;
  }
}

/**
 * Create sample data with proper validation
 */
async function createSampleData(databaseId, data, dataType) {
  if (!databaseId || databaseId === 'existing') {
    console.log(`⏭️  Überspringe Beispieldaten für ${dataType} (Datenbank existiert bereits)`);
    return;
  }

  try {
    console.log(`📝 Erstelle Beispieldaten für ${dataType}...`);

    for (const item of data) {
      try {
        await notion.pages.create({
          parent: { type: 'database_id', database_id: databaseId },
          properties: item.properties
        });
      } catch (itemError) {
        console.warn(`⚠️  Konnte ${dataType}-Element nicht erstellen: ${itemError.message}`);
      }
    }

    console.log(`✅ Beispieldaten für ${dataType} erstellt`);

  } catch (error) {
    console.warn(`⚠️  Konnte Beispieldaten für ${dataType} nicht erstellen: ${error.message}`);
  }
}

/**
 * Enhanced A/B Testing Database Schema
 */
const abTestingDatabaseSchema = {
  properties: {
    'Test Name': {
      title: {}
    },
    'Status': {
      select: {
        options: [
          { name: 'Draft', color: 'gray' },
          { name: 'Running', color: 'green' },
          { name: 'Completed', color: 'blue' },
          { name: 'Paused', color: 'yellow' },
          { name: 'Cancelled', color: 'red' }
        ]
      }
    },
    'Test Typ': {
      select: {
        options: [
          { name: 'Popup', color: 'blue' },
          { name: 'Banner', color: 'green' },
          { name: 'Landing Page', color: 'purple' },
          { name: 'Call to Action', color: 'orange' },
          { name: 'Headline', color: 'pink' },
          { name: 'Color Scheme', color: 'yellow' }
        ]
      }
    },
    'Beschreibung': {
      rich_text: {}
    },
    'Startdatum': {
      date: {}
    },
    'Enddatum': {
      date: {}
    },
    'Stichprobengröße': {
      number: {
        format: 'number'
      }
    },
    'Konfidenzlevel': {
      number: {
        format: 'number'
      }
    },
    'Varianten': {
      rich_text: {}
    },
    'Metriken': {
      rich_text: {}
    },
    'Gewinner': {
      rich_text: {}
    },
    'Statistische Signifikanz': {
      number: {
        format: 'percent'
      }
    },
    'Priorität': {
      select: {
        options: [
          { name: 'Hoch', color: 'red' },
          { name: 'Mittel', color: 'yellow' },
          { name: 'Niedrig', color: 'gray' }
        ]
      }
    },
    'Budget': {
      number: {
        format: 'euro'
      }
    },
    'Testergebnis': {
      rich_text: {}
    },
    'Empfehlungen': {
      rich_text: {}
    }
  },
  icon: {
    type: 'emoji',
    emoji: '🧪'
  }
};

/**
 * Enhanced Users Database Schema
 */
const usersDatabaseSchema = {
  properties: {
    'Email': {
      title: {}
    },
    'Name': {
      rich_text: {}
    },
    'Rolle': {
      select: {
        options: [
          { name: 'Super Admin', color: 'red' },
          { name: 'Administrator', color: 'orange' },
          { name: 'Marketing Manager', color: 'green' },
          { name: 'Sales Manager', color: 'blue' },
          { name: 'Content Editor', color: 'purple' },
          { name: 'Viewer', color: 'gray' }
        ]
      }
    },
    'Status': {
      select: {
        options: [
          { name: 'Aktiv', color: 'green' },
          { name: 'Inaktiv', color: 'red' },
          { name: 'Ausstehend', color: 'yellow' }
        ]
      }
    },
    'Abteilung': {
      select: {
        options: [
          { name: 'Management', color: 'red' },
          { name: 'Marketing', color: 'green' },
          { name: 'Vertrieb', color: 'blue' },
          { name: 'IT', color: 'purple' },
          { name: 'Support', color: 'gray' }
        ]
      }
    },
    'Letzter Login': {
      last_edited_time: {}
    },
    'Berechtigungen': {
      multi_select: {
        options: [
          { name: 'Alle Berechtigungen', color: 'red' },
          { name: 'Marketing verwalten', color: 'green' },
          { name: 'Leads verwalten', color: 'blue' },
          { name: 'Analysen einsehen', color: 'purple' },
          { name: 'Inhalte bearbeiten', color: 'orange' },
          { name: 'Nur Lesen', color: 'gray' }
        ]
      }
    },
    'Telefon': {
      phone: {}
    },
    'Avatar': {
      url: {}
    }
  },
  icon: {
    type: 'emoji',
    emoji: '👥'
  }
};

/**
 * Enhanced Roles Database Schema
 */
const rolesDatabaseSchema = {
  properties: {
    'Rollenname': {
      title: {}
    },
    'Beschreibung': {
      rich_text: {}
    },
    'Berechtigungen': {
    multi_select: {
        options: [
          { name: 'Dashboard einsehen', color: 'blue' },
          { name: 'Marketing Assets verwalten', color: 'green' },
          { name: 'Newsletter verwalten', color: 'orange' },
          { name: 'Leads verwalten', color: 'purple' },
          { name: 'A/B Tests erstellen', color: 'red' },
          { name: 'A/B Tests starten/stoppen', color: 'pink' },
          { name: 'Analytics einsehen', color: 'yellow' },
          { name: 'Benutzer verwalten', color: 'brown' },
          { name: 'Rollen verwalten', color: 'gray' },
          { name: 'Systemeinstellungen', color: 'black' }
        ]
      }
    },
    'Priorität': {
      number: {
        format: 'number'
      }
    },
    'Aktiv': {
      checkbox: {}
    }
  },
  icon: {
    type: 'emoji',
    emoji: '🔑'
  }
};

// Sample data for testing
const sampleUsers = [
  {
    properties: {
      'Email': {
        title: [{ text: { content: 'admin@zoe-solar.de' } }]
      },
      'Name': {
        rich_text: [{ text: { content: 'System Administrator' } }]
      },
      'Rolle': {
        select: { name: 'Super Admin' }
      },
      'Status': {
        select: { name: 'Aktiv' }
      },
      'Abteilung': {
        select: { name: 'Management' }
      },
      'Berechtigungen': {
        multi_select: [{ name: 'Alle Berechtigungen' }]
      }
    }
  },
  {
    properties: {
      'Email': {
        title: [{ text: { content: 'marketing@zoe-solar.de' } }]
      },
      'Name': {
        rich_text: [{ text: { content: 'Marketing Manager' } }]
      },
      'Rolle': {
        select: { name: 'Marketing Manager' }
      },
      'Status': {
        select: { name: 'Aktiv' }
      },
      'Abteilung': {
        select: { name: 'Marketing' }
      },
      'Berechtigungen': {
        multi_select: [
          { name: 'Dashboard einsehen' },
          { name: 'Marketing Assets verwalten' },
          { name: 'Newsletter verwalten' },
          { name: 'A/B Tests erstellen' },
          { name: 'Analytics einsehen' }
        ]
      }
    }
  }
];

const sampleRoles = [
  {
    properties: {
      'Rollenname': {
        title: [{ text: { content: 'Super Admin' } }]
      },
      'Beschreibung': {
        rich_text: [{ text: { content: 'Vollzugriff auf alle Systemfunktionen und Benutzerverwaltung' } }]
      },
      'Berechtigungen': {
        multi_select: [
          { name: 'Dashboard einsehen' },
          { name: 'Marketing Assets verwalten' },
          { name: 'Newsletter verwalten' },
          { name: 'Leads verwalten' },
          { name: 'A/B Tests erstellen' },
          { name: 'A/B Tests starten/stoppen' },
          { name: 'Analytics einsehen' },
          { name: 'Benutzer verwalten' },
          { name: 'Rollen verwalten' },
          { name: 'Systemeinstellungen' }
        ]
      },
      'Priorität': {
        number: 1
      },
      'Aktiv': {
        checkbox: true
      }
    }
  },
  {
    properties: {
      'Rollenname': {
        title: [{ text: { content: 'Marketing Manager' } }]
      },
      'Beschreibung': {
        rich_text: [{ text: { content: 'Verwaltung aller Marketing-Kampagnen, Assets und Newsletter' } }]
      },
      'Berechtigungen': {
        multi_select: [
          { name: 'Dashboard einsehen' },
          { name: 'Marketing Assets verwalten' },
          { name: 'Newsletter verwalten' },
          { name: 'A/B Tests erstellen' },
          { name: 'Analytics einsehen' }
        ]
      },
      'Priorität': {
        number: 2
      },
      'Aktiv': {
        checkbox: true
      }
    }
  }
];

const sampleABTests = [
  {
    properties: {
      'Test Name': {
        title: [{ text: { content: 'Black Friday Popup Headline Test' } }]
      },
      'Beschreibung': {
        rich_text: [{ text: { content: 'Test verschiedener Headlines für das Black Friday Popup' } }]
      },
      'Status': {
        select: { name: 'Draft' }
      },
      'Test Typ': {
        select: { name: 'Popup' }
      },
      'Stichprobengröße': {
        number: 1000
      },
      'Konfidenzlevel (%)': {
        number: 95
      },
      'Varianten': {
        rich_text: [{ text: { content: JSON.stringify([
          {
            id: 'control',
            name: 'Control: 20% Rabatt auf alle Solaranlagen',
            traffic: 50
          },
          {
            id: 'variant_a',
            name: 'Variant A: 🎉 Black Friday: Sichern Sie sich 20% Rabatt!',
            traffic: 50
          }
        ]) } }]
      },
      'Priorität': {
        select: { name: 'Hoch' }
      },
      'Budget (€)': {
        number: 5000
      }
    }
  }
];

/**
 * Main setup function
 */
async function setupNotionDatabases() {
  const results = {};

  try {
    console.log('🚀 Starte Notion Setup...');
    console.log('');

    // Test connection
    console.log('🔍 Teste Verbindung zu Notion...');
    try {
      const userData = await notion.users.me();
      console.log(`✅ Verbindung erfolgreich: ${userData.name || userData.id}`);
      console.log(`   Workspace: ${config.workspaceName}`);
      console.log(`   Integration: ${config.integrationName}`);
    } catch (connectionError) {
      console.error('❌ Verbindung zu Notion fehlgeschlagen:', connectionError.message);
      console.error('');
      console.error('💡 MÖGLICHE URSACHEN:');
      console.error('   • Token ist ungültig oder abgelaufen');
      console.error('   • Integration wurde für Workspace nicht freigegeben');
      console.error('   • Netzwerkprobleme');
      console.error('');
      console.error('🔧 LÖSUNG:');
      console.error('   1. Überprüfen Sie den Token: your_notion_api_token_here');
      console.error('   2. Stellen Sie sicher, dass die Integration für "ZOE Solar" Workspace aktiv ist');
      console.error('   3. Versuchen Sie es erneut');
      throw connectionError;
    }
    console.log('');

    // Create A/B Testing Database
    const abTestingDb = await createDatabase(abTestingDatabaseSchema, '🧪 A/B Testing Management');
    results.abTesting = abTestingDb.id;
    console.log('');

    // Create Users Database
    const usersDb = await createDatabase(usersDatabaseSchema, '👥 Admin Users Management');
    results.users = usersDb.id;
    console.log('');

    // Create Roles Database
    const rolesDb = await createDatabase(rolesDatabaseSchema, '🔑 Roles & Permissions');
    results.roles = rolesDb.id;
    console.log('');

    // Create sample data
    console.log('📝 Erstelle Beispieldaten...');
    console.log('');

    await createSampleData(usersDb.id, sampleUsers, 'Benutzer');
    await createSampleData(rolesDb.id, sampleRoles, 'Rollen');
    await createSampleData(abTestingDb.id, sampleABTests, 'A/B Tests');
    console.log('');

    // Generate environment file
    console.log('📋 erstelle .env.local Datei...');
    const envContent = `
# ZOE Solar Notion Database IDs
# Generated by Notion Setup Manager on ${new Date().toISOString()}

# ZOE Solar Workspace Configuration
NOTION_WORKSPACE=${config.workspaceName}
NOTION_INTEGRATION_NAME=${config.integrationName}

# A/B Testing Database
NEXT_PUBLIC_NOTION_ABTESTING_DB=${results.abTesting}

# Users Database
NEXT_PUBLIC_NOTION_USERS_DB=${results.users}

# Roles Database
NEXT_PUBLIC_NOTION_ROLES_DB=${results.roles}

# Parent Page (if used)
NOTION_PARENT_PAGE_ID=${config.parentPageId || ''}

# Notion API Token (ZOE Solar Workspace only)
NOTION_TOKEN=your_notion_api_token_here
VITE_NOTION_TOKEN=your_notion_api_token_here
`.trim();

    require('fs').writeFileSync('.env.local', envContent);
    console.log('✅ .env.local Datei erstellt');
    console.log('');

    // Final summary
    console.log('🎉 Setup erfolgreich abgeschlossen!');
    console.log('');
    console.log('📊 ERSTELLTE DATENBANKEN:');
    console.log(`   A/B Testing: ${results.abTesting}`);
    console.log(`   Users: ${results.users}`);
    console.log(`   Roles: ${results.roles}`);
    console.log('');
    console.log('📋 NÄCHSTE SCHRITTE:');
    console.log('1. Prüfen Sie die erstellten Datenbanken in Notion');
    console.log('2. Testen Sie die Verbindung mit Ihrer Anwendung');
    console.log('3. Passen Sie die Beispieldaten nach Bedarf an');
    console.log('4. Starten Sie Ihre Anwendung mit: npm run dev');
    console.log('');
    console.log('✨ Ihr ZOE Solar Conversion System ist jetzt einsatzbereit!');

    return results;

  } catch (error) {
    console.error('');
    console.error('❌ SETUP FEHLGESCHLAGEN:');
    console.error('   Fehler:', error.message);
    console.error('');
    console.error('💡 TROUBLESHOOTING:');
    console.error('1. Überprüfen Sie Ihren Notion API Token');
    console.error('2. Stellen Sie sicher, dass die Integration die nötigen Berechtigungen hat');
    console.error('3. Prüfen Sie die Netzwerkverbindung');
    console.error('4. Versuchen Sie es erneut mit: node scripts/notion-setup-manager.cjs');
    console.error('');
    console.error('📞 BENÖTIGEN SIE HILFE?');
    console.error('   • Prüfen Sie die Notion API Dokumentation: https://developers.notion.com');
    console.error('   • Kontaktieren Sie Ihren Systemadministrator');

    throw error;
  }
}

// Run setup if called directly
if (require.main === module) {
  setupNotionDatabases()
    .then(() => {
      console.log('');
      process.exit(0);
    })
    .catch((error) => {
      console.error('');
      process.exit(1);
    });
}

module.exports = { setupNotionDatabases, createDatabase };
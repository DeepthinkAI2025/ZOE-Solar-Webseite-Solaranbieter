#!/usr/bin/env node

/**
 * Notion Connection Test
 * Testet alle möglichen Probleme mit der Notion-Integration
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'white') {
    console.log(colors[color] + message + colors.reset);
}

async function testNotionConnection() {
    console.log('\n' + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + '  🔍 NOTION CONNECTION DIAGNOSE' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset + '\n');

    try {
        // 1. Prüfe Dependencies
        log('📦 Prüfe Dependencies...', 'yellow');
        try {
            const { Client } = require('@notionhq/client');
            log('✅ @notionhq/client installiert', 'green');
        } catch (error) {
            log('❌ @notionhq/client NICHT installiert', 'red');
            log('💡 Installiere mit: npm install @notionhq/client', 'yellow');
            return;
        }

        // 2. Prüfe Environment-Variablen
        log('\\n🔐 Prüfe Environment-Variablen...', 'yellow');
        if (!process.env.NOTION_API_TOKEN) {
            log('❌ NOTION_API_TOKEN nicht gefunden', 'red');
            log('💡 Führen Sie ./scripts/notion-setup-assistant.js aus', 'yellow');
            return;
        }
        log(`✅ NOTION_API_TOKEN gefunden (${process.env.NOTION_API_TOKEN.substring(0, 20)}...)`, 'green');

        if (!process.env.NOTION_WORKSPACE_ID) {
            log('⚠️  NOTION_WORKSPACE_ID nicht gefunden', 'yellow');
            log('💡 Versuche automatisch zu ermitteln...', 'cyan');
        } else {
            log(`✅ NOTION_WORKSPACE_ID: ${process.env.NOTION_WORKSPACE_ID}`, 'green');
        }

        // 3. Initialisiere Notion Client
        log('\\n🔌 Initialisiere Notion Client...', 'yellow');
        const notion = new Client({
            auth: process.env.NOTION_API_TOKEN,
        });

        // 4. Test User-Info (Grundverbindung)
        log('\\n👤 Teste User-Info (Grundverbindung)...', 'yellow');
        try {
            const userResponse = await notion.users.me({});
            log('✅ User-Info erfolgreich abgerufen', 'green');
            log(`👤 Nutzer: ${userResponse.name || 'Unbekannt'}`, 'blue');
            log(`🏢 Workspace: ${userResponse.bot?.owner?.workspace_name || 'Unbekannt'}`, 'blue');
        } catch (error) {
            log(`❌ User-Info Fehler: ${error.message}`, 'red');
            log('💡 Prüfen Sie Ihren API-Token', 'yellow');
            return;
        }

        // 5. Test Search (Datenbanken lesen)
        log('\\n🔍 Teste Datenbank-Zugriff...', 'yellow');
        try {
            const searchResponse = await notion.search({
                query: '',
                page_size: 10,
            });

            log(`✅ ${searchResponse.results.length} Datenbanken gefunden`, 'green');
            
            if (searchResponse.results.length > 0) {
                searchResponse.results.forEach((db, index) => {
                    log(`  ${index + 1}. ${db.title[0]?.plain_text || 'Unbenannt'} (${db.id})`, 'cyan');
                });
            }
        } catch (error) {
            log(`❌ Search Fehler: ${error.message}`, 'red');
            if (error.status === 401) {
                log('💡 Unauthorisiert - Token hat keine Leserechte', 'yellow');
            }
        }

        // 6. Test Workspace Info
        log('\\n🏢 Teste Workspace-Info...', 'yellow');
        try {
            const workspaces = await notion.users.list({
                page_size: 1,
            });
            log('✅ Workspace-Zugriff erfolgreich', 'green');
        } catch (error) {
            log(`❌ Workspace Fehler: ${error.message}`, 'red');
        }

        // 7. Test Create Permission (Datenbank erstellen)
        log('\\n🛠️  Teste Datenbank-Erstellungs-Berechtigung...', 'yellow');
        try {
            const testDb = await notion.databases.create({
                parent: { type: 'workspace', workspace: true },
                title: [{ type: 'text', text: { content: 'Test-Datenbank' } }],
                properties: {
                    'Name': { title: {} }
                }
            });
            log('✅ Datenbank-Erstellung ERFOLGREICH!', 'green');
            log(`🆔 Test-Datenbank ID: ${testDb.id}`, 'cyan');
            
            // Lösche Test-Datenbank sofort wieder
            try {
                await notion.pages.archive({ page_id: testDb.id });
                log('🧹 Test-Datenbank wieder gelöscht', 'yellow');
            } catch (deleteError) {
                log(`⚠️  Test-Datenbank konnte nicht gelöscht werden: ${deleteError.message}`, 'yellow');
            }
            
        } catch (error) {
            log(`❌ Datenbank-Erstellung FEHLGESCHLAGEN: ${error.message}`, 'red');
            
            if (error.status === 400) {
                log('💡 Bad Request - Mögliche Ursachen:', 'yellow');
                log('   - Workspace-Berechtigung fehlt', 'yellow');
                log('   - Ungültiges Parent-Objekt', 'yellow');
                log('   - API-Version-Problem', 'yellow');
            } else if (error.status === 401) {
                log('💡 Unauthorized - Token hat keine Schreibrechte', 'yellow');
            } else if (error.status === 403) {
                log('💡 Forbidden - Zugriff auf Workspace verweigert', 'yellow');
            } else if (error.status === 409) {
                log('💡 Conflict - Datenbank existiert bereits', 'yellow');
            }
        }

        // 8. Empfehlungen
        log('\\n💡 EMPFEHLUNGEN:', 'bright');
        log('1. Stellen Sie sicher, dass der API-Token "Create databases" Berechtigung hat', 'cyan');
        log('2. Überprüfen Sie, dass der Token dem korrekten Workspace zugeordnet ist', 'cyan');
        log('3. Stellen Sie sicher, dass Sie Integration "Owner" sind', 'cyan');
        log('4. Prüfen Sie die Notion API-Version (sollte 2022-06-28 sein)', 'cyan');

    } catch (error) {
        log(`❌ Unerwarteter Fehler: ${error.message}`, 'red');
    }
}

// Starte Test
if (require.main === module) {
    testNotionConnection().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { testNotionConnection };
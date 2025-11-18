#!/usr/bin/env node

/**
 * Sichere Notion Datenbank-Erstellung für ZOE Solar
 * Erstellt zuerst eine Testseite und dann Datenbanken als Unterseiten
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

async function createSafeDatabases() {
    console.log('\n' + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + '  🔧 SICHERE DATENBANK-ERSTELLUNG' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset + '\n');
    
    try {
        if (!process.env.NOTION_API_TOKEN) {
            log('❌ NOTION_API_TOKEN nicht gefunden', 'red');
            return;
        }

        const notion = new Client({
            auth: process.env.NOTION_API_TOKEN,
        });

        log('✅ Notion-Client initialisiert', 'green');

        // 1. Testseite erstellen (für parent.page_id)
        log('\n📄 Erstelle Testseite für Datenbank-Erstellung...', 'yellow');
        let parentPageId = null;

        try {
            const testPage = await notion.pages.create({
                parent: { type: 'workspace', workspace: true },
                properties: {
                    title: {
                        title: [{
                            text: { content: 'ZOE Solar CMS Test Page (kann gelöscht werden)' }
                        }]
                    }
                }
            });
            parentPageId = testPage.id;
            log(`✅ Testseite erstellt - ID: ${parentPageId}`, 'green');
        } catch (error) {
            log(`❌ Testseite-Erstellung fehlgeschlagen: ${error.message}`, 'red');
            log('💡 Möglicherweise haben Sie bereits eine Testseite. Fortfahren...', 'yellow');
            
            // Versuche, eine existierende Seite zu finden
            try {
                const searchResponse = await notion.search({ query: 'ZOE Solar CMS Test Page' });
                if (searchResponse.results.length > 0) {
                    parentPageId = searchResponse.results[0].id;
                    log(`✅ Existierende Testseite gefunden - ID: ${parentPageId}`, 'green');
                }
            } catch (searchError) {
                log('❌ Konnte keine geeignete Elternseite finden', 'red');
                return;
            }
        }

        // 2. Datenbanken erstellen (mit parent.page_id)
        const createdDatabases = {};
        const databaseConfigs = [
            { key: 'products', name: 'ZOE Solar Produkte', icon: '⚡' },
            { key: 'articles', name: 'ZOE Solar Blog', icon: '📝' },
            { key: 'faq', name: 'ZOE Solar FAQ', icon: '❓' },
            { key: 'team', name: 'ZOE Solar Team', icon: '👥' },
            { key: 'gallery', name: 'ZOE Solar Galerie', icon: '🖼️' },
            { key: 'customers', name: 'ZOE Solar Kunden', icon: '🏢' },
            { key: 'locations', name: 'ZOE Solar Standorte', icon: '📍' },
            { key: 'knowledge', name: 'ZOE Solar Wissen', icon: '📚' }
        ];

        for (const dbConfig of databaseConfigs) {
            try {
                log(`\n🔄 Erstelle Datenbank: ${dbConfig.name}...`, 'cyan');

                const database = await notion.databases.create({
                    parent: { type: 'page_id', page_id: parentPageId },
                    title: [{
                        type: 'text',
                        text: { content: dbConfig.name }
                    }],
                    properties: {
                        'Name': { title: {} }
                    },
                    icon: { emoji: dbConfig.icon },
                    is_inline: false
                });

                createdDatabases[dbConfig.key] = database.id;
                log(`✅ ${dbConfig.name} erstellt - ID: ${database.id}`, 'green');
                
                // Pause zwischen Erstellungen
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                log(`❌ Fehler bei ${dbConfig.name}: ${error.message}`, 'red');
                if (error.status === 409) {
                    log(`💡 Datenbank "${dbConfig.name}" existiert bereits`, 'yellow');
                }
            }
        }

        // 3. IDs speichern
        if (Object.keys(createdDatabases).length > 0) {
            log('\n💾 Speichere Datenbank-IDs...', 'cyan');
            
            const idMapping = {
                timestamp: new Date().toISOString(),
                workspace_id: process.env.NOTION_WORKSPACE_ID || 'not-provided',
                parent_page_id: parentPageId,
                databases: createdDatabases
            };

            fs.writeFileSync('notion-database-ids.json', JSON.stringify(idMapping, null, 2));
            log('✅ IDs gespeichert in notion-database-ids.json', 'green');

            // .env.local mit IDs aktualisieren
            const envUpdates = [];
            for (const [key, id] of Object.entries(createdDatabases)) {
                envUpdates.push(`NOTION_DATABASE_${key.toUpperCase()}_ID=${id}`);
            }

            log('\n📝 Fügen Sie diese Zeilen zu .env.local hinzu:', 'bright');
            envUpdates.forEach(update => log(`   ${update}`, 'cyan'));
        }

        // Zusammenfassung
        log('\n' + colors.green + '='.repeat(70) + colors.reset);
        log(colors.bright + colors.green + '  ✅ DATENBANK-ERSTELLUNG ABGESCHLOSSEN' + colors.reset);
        log(colors.green + '='.repeat(70) + colors.reset + '\n');

        const total = databaseConfigs.length;
        const created = Object.keys(createdDatabases).length;
        log(`📊 Erfolgreich: ${created}/${total} Datenbanken erstellt`, created === total ? 'green' : 'yellow');

        if (created > 0) {
            log('\n🎯 NÄCHSTE SCHRITTE:', 'bright');
            log('1. ✅ Testdaten hinzufügen: node scripts/add-notion-test-data.cjs', 'cyan');
            log('2. ✅ System testen: npm run dev', 'cyan');
        }

    } catch (error) {
        log(`❌ Schwerwiegender Fehler: ${error.message}`, 'red');
    }
}

// Script starten
if (require.main === module) {
    createSafeDatabases().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { createSafeDatabases };
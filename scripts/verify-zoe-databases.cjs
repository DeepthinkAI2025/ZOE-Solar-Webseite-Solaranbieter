#!/usr/bin/env node

/**
 * Verifiziert spezifisch die ZOE Solar Datenbanken
 */

const { Client } = require('@notionhq/client');
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

// Erwartete ZOE Solar Datenbanken
const expectedDatabases = [
    { id: '536c24d7-b67a-422e-8e96-a0e125d39636', name: 'ZOE Solar Produkte', type: 'products' },
    { id: '47a1eb90-bd19-4740-8a83-0d256123c9a9', name: 'ZOE Solar Blog', type: 'articles' },
    { id: '3db1eae2-6cf6-479b-a0be-3a7913334376', name: 'ZOE Solar FAQ', type: 'faq' },
    { id: '46c5252f-6b27-4440-943e-cf8568c3c2c2', name: 'ZOE Solar Team', type: 'team' },
    { id: '2b3890cd-f161-4e34-a9c1-36c4cd23ec47', name: 'ZOE Solar Galerie', type: 'gallery' },
    { id: 'a691cdbc-66ea-49e6-84ce-4dda6031e3a2', name: 'ZOE Solar Kunden', type: 'customers' },
    { id: 'e442524d-ae01-45a0-9351-4f1cc7766778', name: 'ZOE Solar Standorte', type: 'locations' },
    { id: 'a5475a07-239f-4103-ad1d-f75fc24e1ff0', name: 'ZOE Solar Wissen', type: 'knowledge' }
];

async function verifyZOEDatabases() {
    console.log('\n' + colors.cyan + '='.repeat(80) + colors.reset);
    console.log(colors.bright + colors.cyan + '  🔍 ZOE SOLAR DATENBANKEN VERIFIKATION' + colors.reset);
    console.log(colors.cyan + '='.repeat(80) + colors.reset + '\n');

    const notion = new Client({
        auth: process.env.NOTION_API_TOKEN,
    });

    let foundCount = 0;
    let errors = [];

    for (const db of expectedDatabases) {
        try {
            log(`🔍 Prüfe ${db.name}...`, 'yellow');
            
            // Versuche Datenbank direkt abzurufen
            const database = await notion.databases.retrieve({
                database_id: db.id
            });

            // Titel extrahieren
            let title = 'Unbekannt';
            if (database.title && database.title[0] && database.title[0].plain_text) {
                title = database.title[0].plain_text;
            }

            // Prüfe Datenbank-Eigenschaften
            const properties = Object.keys(database.properties || {});
            
            log(`✅ GEFUNDEN: ${title}`, 'green');
            log(`   🆔 ID: ${db.id}`, 'cyan');
            log(`   📝 Eigenschaften: ${properties.length}`, 'blue');
            
            // Versuche Inhalt zu zählen
            try {
                const query = await notion.databases.query({
                    database_id: db.id,
                    page_size: 1
                });
                
                const totalCount = query.results.length > 0 ? '>0' : '0';
                log(`   📊 Testdaten: ${totalCount}`, 'blue');
            } catch (contentError) {
                log(`   ⚠️  Inhalt nicht abrufbar: ${contentError.message}`, 'yellow');
            }

            foundCount++;
            console.log();

        } catch (error) {
            log(`❌ FEHLER bei ${db.name}: ${error.message}`, 'red');
            errors.push({ database: db.name, error: error.message });
            console.log();
        }
    }

    // Zusammenfassung
    console.log(colors.cyan + '='.repeat(80) + colors.reset);
    log('📊 VERIFIKATION ZUSAMMENFASSUNG:', 'bright');
    log(`✅ Erfolgreich verifiziert: ${foundCount}/${expectedDatabases.length} Datenbanken`, 
         foundCount === expectedDatabases.length ? 'green' : 'yellow');
    
    if (errors.length > 0) {
        log('❌ Fehlerhafte Datenbanken:', 'red');
        errors.forEach(err => {
            log(`   - ${err.database}: ${err.error}`, 'red');
        });
    }

    if (foundCount === expectedDatabases.length) {
        log('🎉 ALLE ZOE SOLAR DATENBANKEN ERFOLGREICH ERSTELLT!', 'green');
        log('🔗 Alle Datenbanken sind über die direkten Notion-Links zugänglich', 'cyan');
    } else {
        log('⚠️  Nicht alle Datenbanken konnten verifiziert werden', 'yellow');
    }
}

// Starte Verifikation
verifyZOEDatabases().catch(error => {
    console.error(colors.red + 'Fataler Fehler: ' + error.message + colors.reset);
    process.exit(1);
});
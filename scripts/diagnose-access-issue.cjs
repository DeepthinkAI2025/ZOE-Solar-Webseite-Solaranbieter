#!/usr/bin/env node

/**
 * Diagnostiziert das Notion-Zugriffsproblem
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
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(message, color = 'white') {
    console.log(colors[color] + message + colors.reset);
}

async function diagnoseNotionAccess() {
    console.log('\n' + colors.red + '🚨 NOTION ZUGRIFFS-PROBLEM DIAGNOSE' + colors.reset);
    console.log(colors.red + '='.repeat(80) + colors.reset + '\n');

    const notion = new Client({
        auth: process.env.NOTION_API_TOKEN,
    });

    try {
        // 1. User-Info prüfen
        log('👤 1. USER-INFORMATIONEN:', 'bright');
        const userInfo = await notion.users.me({});
        log(`   Name: ${userInfo.name}`, 'cyan');
        log(`   Typ: ${userInfo.type}`, 'cyan');
        log(`   Bot-Name: ${userInfo.bot?.name || 'Kein Bot'}`, 'cyan');
        
        if (userInfo.bot?.owner) {
            log(`   Workspace: ${userInfo.bot.owner.workspace_name}`, 'cyan');
            log(`   Workspace-Typ: ${userInfo.bot.owner.type}`, 'cyan');
        }
        console.log();

        // 2. Capabilities prüfen
        log('🔐 2. BERECHTIGUNGEN:', 'bright');
        if (userInfo.bot) {
            const capabilities = userInfo.bot.owner?.capabilities || {};
            log(`   Lesen: ${capabilities.read ? '✅' : '❌'}`, capabilities.read ? 'green' : 'red');
            log(`   Schreiben: ${capabilities.write ? '✅' : '❌'}`, capabilities.write ? 'green' : 'red');
            log(`   Aktualisieren: ${capabilities.update ? '✅' : '❌'}`, capabilities.update ? 'green' : 'red');
            log(`   Private Datenbanken: ${capabilities.insert_content ? '✅' : '❌'}`, capabilities.insert_content ? 'green' : 'red');
        }
        console.log();

        // 3. Erste Datenbank genauer prüfen
        log('🔍 3. BEISPIEL-DATENBANK ANALYSE:', 'bright');
        const testDbId = '536c24d7-b67a-422e-8e96-a0e125d39636';
        
        try {
            const database = await notion.databases.retrieve({
                database_id: testDbId
            });

            log('   ✅ Datenbank API-Zugriff: ERFOLGREICH', 'green');
            log(`   Titel: ${database.title?.[0]?.plain_text || 'Kein Titel'}`, 'cyan');
            log(`   URL-Format: https://notion.so/${testDbId}`, 'cyan');
            log(`   ID-Format: ${testDbId}`, 'cyan');
            
            // Berechtigungen prüfen
            log('   🔐 DATENBANK-BERECHTIGUNGEN:', 'yellow');
            if (database.parent) {
                log(`   Parent-Typ: ${database.parent.type}`, 'cyan');
                log(`   Workspace-ID: ${database.parent.workspace_id || 'Keine'}`, 'cyan');
                log(`   Seite-ID: ${database.parent.page_id || 'Keine'}`, 'cyan');
            }

            // Versuche echten Zugriff über Pages API
            log('   📄 VERSUCHE SEITEN-ZUGRIFF:', 'yellow');
            try {
                const search = await notion.search({
                    query: 'ZOE Solar',
                    filter: { value: 'database', property: 'object' },
                    page_size: 1
                });
                
                if (search.results.length > 0) {
                    log('   ✅ Datenbanken über Search gefunden', 'green');
                    const db = search.results[0];
                    log(`   Search-Titel: ${db.title?.[0]?.plain_text || 'Kein Titel'}`, 'cyan');
                }
            } catch (searchError) {
                log(`   ❌ Search-Fehler: ${searchError.message}`, 'red');
            }

        } catch (dbError) {
            log(`   ❌ DATENBANK-FEHLER: ${dbError.message}`, 'red');
            if (dbError.status === 401) {
                log('   💡 Lösung: Integration-Berechtigung prüfen', 'yellow');
            } else if (dbError.status === 403) {
                log('   💡 Lösung: Zugriff auf Datenbank autorisieren', 'yellow');
            }
        }

        console.log();
        log('💡 LÖSUNGSEMPFEHLUNGEN:', 'bright');
        log('1. Notion-Integration in Einstellungen prüfen', 'yellow');
        log('2. Datenbank-Berechtigungen manuell teilen', 'yellow');
        log('3. Workspace-Berechtigung überprüfen', 'yellow');
        log('4. Integration-Modus: "Internal" vs "Public"', 'yellow');

    } catch (error) {
        log(`❌ FATAL ERROR: ${error.message}`, 'red');
        
        if (error.message.includes('unauthorized')) {
            log('💡 Problem: API-Token ungültig oder abgelaufen', 'yellow');
        } else if (error.message.includes('forbidden')) {
            log('💡 Problem: Workspace-Zugriff verweigert', 'yellow');
        }
    }
}

diagnoseNotionAccess().catch(error => {
    console.error('Fataler Fehler:', error);
    process.exit(1);
});
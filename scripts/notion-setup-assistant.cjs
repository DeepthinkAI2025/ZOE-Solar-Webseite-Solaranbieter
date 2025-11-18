#!/usr/bin/env node

/**
 * ZOE Solar Notion Setup Assistant
 * Interaktiver Assistent für die Notion-Integration
 * 
 * Dieser Assistent führt durch:
 * 1. Notion-Integration erstellen
 * 2. Workspace-ID ermitteln  
 * 3. Datenbanken anlegen
 * 4. API-Tests durchführen
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Farbige Ausgaben
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(message, color = 'white') {
    console.log(colors[color] + message + colors.reset);
}

function logHeader(message) {
    console.log('\n' + colors.bright + colors.cyan + '='.repeat(60) + colors.reset);
    console.log(colors.bright + colors.cyan + ' ' + message + ' ' + colors.reset);
    console.log(colors.bright + colors.cyan + '='.repeat(60) + colors.reset + '\n');
}

function logStep(number, message) {
    console.log(colors.yellow + `[Schritt ${number}]` + colors.reset + ' ' + message);
}

// Fragen stellen
function askQuestion(question, required = true) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            if (required && !answer.trim()) {
                console.log(colors.red + '❌ Eingabe erforderlich! Bitte versuchen Sie es erneut.' + colors.reset);
                askQuestion(question, required).then(resolve);
            } else {
                resolve(answer.trim());
            }
        });
    });
}

// Ja/Nein-Frage
function askYesNo(question, defaultAnswer = 'n') {
    const answers = {
        'j': true,
        'ja': true,
        'y': true,
        'yes': true,
        'n': false,
        'nein': false,
        'no': false
    };
    
    return new Promise((resolve) => {
        rl.question(question + ' (j/n) [' + defaultAnswer + ']: ', (answer) => {
            answer = answer.toLowerCase().trim();
            if (!answer) answer = defaultAnswer.toLowerCase();
            
            if (answers.hasOwnProperty(answer)) {
                resolve(answers[answer]);
            } else {
                console.log(colors.red + '❌ Bitte "j" für Ja oder "n" für Nein eingeben.' + colors.reset);
                askYesNo(question, defaultAnswer).then(resolve);
            }
        });
    });
}

// Hauptfunktion
async function main() {
    logHeader('🔧 ZOE Solar Notion Setup Assistant');
    
    log('Willkommen beim interaktiven Notion-Setup für ZOE Solar!', 'green');
    log('Dieser Assistent führt Sie durch die komplette Einrichtung Ihrer Notion-Integration.', 'blue');
    log('Bitte halten Sie Ihre Notion-Zugangsdaten bereit.\n', 'yellow');
    
    try {
        // Überprüfen ob bereits Notion-Integration existiert
        const envExists = fs.existsSync('.env.local');
        if (envExists) {
            log('⚠️  .env.local Datei bereits vorhanden.', 'yellow');
            const backup = await askYesNo('Möchten Sie die bestehende .env.local Datei sichern?');
            if (backup) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                fs.copyFileSync('.env.local', `.env.local.backup.${timestamp}`);
                log('✅ Bestehende .env.local Datei gesichert.', 'green');
            }
        }
        
        // Schritt 1: Notion API Token
        await step1_apiToken();
        
        // Schritt 2: Workspace ID
        await step2_workspaceId();
        
        // Schritt 3: Datenbank IDs (wenn Integration schon existiert)
        const hasExistingIntegration = await askYesNo('Haben Sie bereits Notion-Datenbanken erstellt?', 'n');
        if (hasExistingIntegration) {
            await step3_databaseIds();
        }
        
        // Schritt 4: Webhook Secret (optional)
        await step4_webhookSetup();
        
        // Schritt 5: .env.local erstellen
        await step5_createEnvironment();
        
        // Schritt 6: Notion-Test durchführen
        await step6_testIntegration();
        
        // Zusammenfassung
        await step7_summary();
        
    } catch (error) {
        log('❌ Fehler: ' + error.message, 'red');
    } finally {
        rl.close();
    }
}

// Schritt 1: API Token abfragen
async function step1_apiToken() {
    logStep(1, 'Notion API Token einrichten');
    
    log('So erhalten Sie Ihren Notion API Token:', 'cyan');
    log('1. Gehen Sie zu: https://developers.notion.com/', 'white');
    log('2. Loggen Sie sich mit Ihrem Notion-Account ein', 'white');
    log('3. Klicken Sie auf "New Integration"', 'white');
    log('4. Name: "ZOE Solar CMS"', 'white');
    log('5. Wählen Sie Ihren ZOE Solar Workspace aus', 'white');
    log('6. Aktivieren Sie alle Capabilities (Read/Update/Insert content)', 'white');
    log('7. Kopieren Sie den API-Schlüssel (secret_xxxxxxxxx)\n', 'white');
    
    const apiToken = await askQuestion(colors.yellow + 'Notion API Token (secret_xxxxxxxxx): ' + colors.reset, true);
    
    // Token validieren
    if (!apiToken.startsWith('secret_')) {
        log('❌ Token muss mit "secret_" beginnen!', 'red');
        process.exit(1);
    }
    
    global.notionApiToken = apiToken;
    log('✅ API Token gespeichert', 'green');
}

// Schritt 2: Workspace ID abfragen
async function step2_workspaceId() {
    logStep(2, 'Workspace ID ermitteln');
    
    log('So finden Sie Ihre Workspace ID:', 'cyan');
    log('1. Gehen Sie zu Ihrem Notion Workspace', 'white');
    log('2. Öffnen Sie eine beliebige Seite', 'white');
    log('3. Die ID ist der 32-stellige Hex-Code in der URL', 'white');
    log('Beispiel: https://notion.so/workspace/ABC123def456...', 'yellow');
    log('Die ID wäre: abc123def456abcdef1234567890abcdef\n', 'yellow');
    
    const workspaceId = await askQuestion(colors.yellow + 'Workspace ID (32-hex): ' + colors.reset, true);
    
    // Workspace ID validieren
    const workspaceIdRegex = /^[a-f0-9]{32}$/;
    if (!workspaceIdRegex.test(workspaceId)) {
        log('❌ Workspace ID muss 32 hexadezimale Zeichen sein!', 'red');
        process.exit(1);
    }
    
    global.workspaceId = workspaceId;
    log('✅ Workspace ID gespeichert', 'green');
}

// Schritt 3: Datenbank IDs abfragen (optional)
async function step3_databaseIds() {
    logStep(3, 'Datenbank IDs ermitteln');
    
    log('Für jede Datenbank:', 'cyan');
    log('1. Öffnen Sie die Datenbank in Notion', 'white');
    log('2. Kopieren Sie die URL', 'white');
    log('3. Die ID ist der 32-stellige Hex-Code in der URL', 'white');
    log('Beispiel: https://notion.so/12345678-abcd-1234-abcd-123456789012', 'yellow');
    log('Die ID wäre: 12345678abcd1234abcd123456789012\n', 'yellow');
    
    const databases = [
        { name: 'Blog-Artikel', key: 'blog_db_id' },
        { name: 'Produkte', key: 'products_db_id' },
        { name: 'FAQ', key: 'faq_db_id' },
        { name: 'Team', key: 'team_db_id' },
        { name: 'Standorte', key: 'locations_db_id' },
        { name: 'Galerie', key: 'gallery_db_id' },
        { name: 'Kunden', key: 'customers_db_id' },
        { name: 'Wissen', key: 'knowledge_db_id' }
    ];
    
    global.databaseIds = {};
    
    for (const db of databases) {
        const dbId = await askQuestion(`${colors.yellow}${db.name} Datenbank ID: ${colors.reset}`, false);
        if (dbId) {
            global.databaseIds[db.key] = dbId;
            log(`✅ ${db.name} ID gespeichert`, 'green');
        }
    }
}

// Schritt 4: Webhook Setup (optional)
async function step4_webhookSetup() {
    logStep(4, 'Webhook-Secret einrichten');
    
    const setupWebhook = await askYesNo('Möchten Sie Webhooks für Real-time Updates einrichten?', 'n');
    if (setupWebhook) {
        log('So erstellen Sie Webhooks:', 'cyan');
        log('1. Gehen Sie zu: https://developers.notion.com/', 'white');
        log('2. Öffnen Sie Ihre Integration', 'white');
        log('3. Gehen Sie zu "Webhooks"', 'white');
        log('4. URL: https://ihre-domain.vercel.app/api/notion-webhook', 'white');
        log('5. Events: page.created, page.updated, page.deleted', 'white');
        log('6. Kopieren Sie das Webhook Secret\n', 'white');
        
        const webhookSecret = await askQuestion(colors.yellow + 'Webhook Secret: ' + colors.reset, false);
        if (webhookSecret) {
            global.webhookSecret = webhookSecret;
            log('✅ Webhook Secret gespeichert', 'green');
        }
    }
}

// Schritt 5: .env.local erstellen
async function step5_createEnvironment() {
    logStep(5, 'Umgebungsdatei erstellen');
    
    const envContent = `# ZOE Solar Notion CMS - Umgebungsvariablen
# Generiert am: ${new Date().toISOString()}

# Notion API Konfiguration
NOTION_API_TOKEN=${global.notionApiToken}
NOTION_WORKSPACE_ID=${global.workspaceId}

# Datenbank IDs (optional - wird bei Einrichtung ausgefüllt)
${global.databaseIds ? Object.entries(global.databaseIds).map(([key, value]) => `${key.toUpperCase()}=${value}`).join('\n') : ''}

# Webhook Konfiguration
${global.webhookSecret ? `NOTION_WEBHOOK_SECRET=${global.webhookSecret}` : ''}

# Sicherheit
JWT_SECRET=${generateRandomSecret(32)}
ENCRYPTION_KEY=${generateRandomSecret(32)}

# Performance & Caching
CACHE_TTL=${Math.floor(Math.random() * 300) + 300} # 5-10 Minuten
MAX_CACHE_SIZE=1000

# Development
NODE_ENV=development
LOG_LEVEL=info

# Monitoring
ENABLE_AUDIT_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true
`;
    
    fs.writeFileSync('.env.local', envContent);
    log('✅ .env.local Datei erstellt', 'green');
}

// Schritt 6: Integration testen
async function step6_testIntegration() {
    logStep(6, 'Notion-Integration testen');
    
    const testApi = await askYesNo('Möchten Sie jetzt die API-Verbindung testen?', 'j');
    if (testApi) {
        log('🔍 Teste Notion API-Verbindung...', 'cyan');
        
        try {
            // Einfacher API-Test
            const response = await fetch('https://api.notion.com/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${global.notionApiToken}`,
                    'Notion-Version': '2022-06-28'
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                log('✅ API-Verbindung erfolgreich!', 'green');
                log(`✅ Verbunden mit Workspace: ${user.bot?.owner?.workspace_name || 'Unbekannt'}`, 'green');
                
                // Datenbank-Tests falls IDs vorhanden
                if (global.databaseIds && Object.keys(global.databaseIds).length > 0) {
                    log('🔍 Teste Datenbank-Verbindungen...', 'cyan');
                    await testDatabases();
                }
                
            } else {
                log('❌ API-Fehler: ' + response.status + ' ' + response.statusText, 'red');
                log('Überprüfen Sie Ihren API-Token und die Berechtigungen.', 'yellow');
            }
        } catch (error) {
            log('❌ Verbindungsfehler: ' + error.message, 'red');
            log('Stellen Sie sicher, dass Sie Internetverbindung haben.', 'yellow');
        }
    }
}

// Datenbanken testen
async function testDatabases() {
    for (const [key, dbId] of Object.entries(global.databaseIds)) {
        try {
            const response = await fetch(`https://api.notion.com/v1/databases/${dbId}`, {
                headers: {
                    'Authorization': `Bearer ${global.notionApiToken}`,
                    'Notion-Version': '2022-06-28'
                }
            });
            
            if (response.ok) {
                log(`✅ ${key} Datenbank erreichbar`, 'green');
            } else {
                log(`❌ ${key} Datenbank nicht erreichbar (${response.status})`, 'red');
            }
        } catch (error) {
            log(`❌ ${key} Datenbank Test fehlgeschlagen: ${error.message}`, 'red');
        }
    }
}

// Schritt 7: Zusammenfassung
async function step7_summary() {
    logStep(7, 'Setup-Zusammenfassung');
    
    logHeader('🎉 Notion-Setup erfolgreich abgeschlossen!');
    
    log('✅ Notion API-Token konfiguriert', 'green');
    log('✅ Workspace ID festgelegt', 'green');
    log('✅ Umgebungsdatei erstellt (.env.local)', 'green');
    if (global.webhookSecret) log('✅ Webhook konfiguriert', 'green');
    if (global.databaseIds) log('✅ Datenbank-IDs erfasst', 'green');
    
    console.log('\n' + colors.bright + colors.yellow + 'NÄCHSTE SCHRITTE:' + colors.reset);
    log('1. Erstellen Sie 8 Datenbanken in Notion (siehe NOTION_SETUP_CHECKLISTE.md)', 'cyan');
    log('2. Teilen Sie jede Datenbank mit der Integration "@ZOE Solar CMS"', 'cyan');
    log('3. Kopieren Sie die Datenbank-IDs in die .env.local', 'cyan');
    log('4. Führen Sie npm run build aus', 'cyan');
    log('5. Starten Sie npm run dev', 'cyan');
    
    console.log('\n' + colors.bright + colors.green + 'DOKUMENTATION:' + colors.reset);
    log('📋 NOTION_SETUP_CHECKLISTE.md - Schritt-für-Schritt-Anleitung', 'blue');
    log('🧪 CMS_TEST_PLAN.md - Vollständiger Test-Plan', 'blue');
    log('📖 docs/INTEGRATION_GUIDE.md - API-Dokumentation', 'blue');
    
    log('\n🚀 Bereit für die Datenbank-Erstellung!', 'bright');
}

// Zufälligen Secret generieren
function generateRandomSecret(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Assistent starten
if (require.main === module) {
    main().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = {
    askQuestion,
    askYesNo,
    main
};
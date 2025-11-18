#!/usr/bin/env node

/**
 * Fügt einfache Testdaten zu den vorhandenen Notion-Datenbanken hinzu
 * Verwendet nur die Standard-Eigenschaft "Name"
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

function getEnvVar(key, fallback = null) {
    return process.env[key] || fallback;
}

const databaseIds = {
    products: getEnvVar('NOTION_DATABASE_PRODUCTS_ID'),
    articles: getEnvVar('NOTION_DATABASE_ARTICLES_ID'),
    faq: getEnvVar('NOTION_DATABASE_FAQ_ID'),
    team: getEnvVar('NOTION_DATABASE_TEAM_ID'),
    gallery: getEnvVar('NOTION_DATABASE_GALLERY_ID'),
    customers: getEnvVar('NOTION_DATABASE_CUSTOMERS_ID'),
    locations: getEnvVar('NOTION_DATABASE_LOCATIONS_ID'),
    knowledge: getEnvVar('NOTION_DATABASE_KNOWLEDGE_ID')
};

// Einfache Testdaten (nur mit "Name" Eigenschaft)
const simpleTestData = {
    products: [
        'Solarauswahl Pro 400W - Hochleistung PV-Modul',
        'SolarWechsel 5000XL - Intelligenter Wechselrichter', 
        'SolarPower Speicher 10kWh - Lithium-Ionen Speicher'
    ],
    articles: [
        'Photovoltaik Trends 2025 - Was ist neu?',
        'Balkonkraftwerke: Der ultimative Guide',
        'EEG 2025: Neue Förderungen für Solar'
    ],
    faq: [
        'Wie lange dauert die Installation?',
        'Welche Förderungen gibt es?',
        'Wie lange hält eine PV-Anlage?'
    ],
    team: [
        'Maria Schmidt - Geschäftsführung',
        'Thomas Müller - Projektleitung', 
        'Anna Weber - Vertrieb'
    ],
    gallery: [
        'Freiland-Anlage Berlin 500kW',
        'Gewerbeanlage München 1.2MW',
        'Balkonkraftwerk Hamburg'
    ],
    customers: [
        'Müller GmbH & Co. KG - Gewerbeanlage',
        'Schmidt Privat - Einfamilienhaus',
        'Weber AG - Industrieanlage'
    ],
    locations: [
        'Berlin Hauptsitz',
        'Hamburg Niederlassung',
        'München Vertriebspartner'
    ],
    knowledge: [
        'Photovoltaik Grundlagen',
        'Rechtliche Aspekte Solar',
        'Förderungen und Finanzierung'
    ]
};

async function addSimpleTestData() {
    console.log('\n' + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + '  📋 EINFACHE TESTDATEN HINZUFÜGEN' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset + '\n');
    
    try {
        const notion = new Client({
            auth: process.env.NOTION_API_TOKEN,
        });

        if (!process.env.NOTION_API_TOKEN) {
            log('❌ NOTION_API_TOKEN nicht gefunden', 'red');
            return;
        }

        log('✅ Notion-Client initialisiert', 'green');

        // Prüfe alle Datenbank-IDs
        for (const [key, id] of Object.entries(databaseIds)) {
            if (!id) {
                log(`❌ ${key} Datenbank-ID fehlt in .env.local`, 'red');
                return;
            }
        }

        log('✅ Alle Datenbank-IDs gefunden', 'green');

        let totalAdded = 0;

        // Füge Testdaten zu jeder Datenbank hinzu
        for (const [databaseKey, items] of Object.entries(simpleTestData)) {
            const databaseId = databaseIds[databaseKey];
            
            log(`\n📊 Füge Testdaten zu ${databaseKey} hinzu...`, 'cyan');
            
            for (const item of items) {
                try {
                    await notion.pages.create({
                        parent: { database_id: databaseId },
                        properties: {
                            'Name': { title: [{ text: { content: item } }] }
                        }
                    });
                    log(`✅ Hinzugefügt: ${item}`, 'green');
                    totalAdded++;
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (error) {
                    if (error.message.includes('already exists')) {
                        log(`⚠️  Existiert bereits: ${item}`, 'yellow');
                    } else {
                        log(`❌ Fehler bei "${item}": ${error.message}`, 'red');
                    }
                }
            }
        }

        // Zusammenfassung
        log('\n' + colors.green + '='.repeat(70) + colors.reset);
        log(colors.bright + colors.green + '  ✅ EINFACHE TESTDATEN HINZUGEFÜGT!' + colors.reset);
        log(colors.green + '='.repeat(70) + colors.reset + '\n');

        log(`📊 Gesamt: ${totalAdded} Einträge hinzugefügt`, 'bright');

        // Zeige die Datenbanken in Notion an
        log('\n🔗 Prüfen Sie die Testdaten in Notion:', 'bright');
        for (const [key, id] of Object.entries(databaseIds)) {
            log(`• ${key}: https://notion.so/${id}`, 'cyan');
        }

        log('\n🚀 FINALER SCHRITT: End-to-End System Test', 'bright');
        log('✅ Testen Sie das System: npm run dev', 'cyan');

        log('\n💡 Hinweis: Für vollständige Funktionalität erweitern Sie die Datenbanken manuell in Notion:', 'yellow');
        log('   1. Öffnen Sie jede Datenbank in Notion', 'yellow');
        log('   2. Klicken Sie auf "Add a property"', 'yellow');
        log('   3. Fügen Sie die benötigten Eigenschaften hinzu', 'yellow');
        log('   4. Dann können Sie das erweiterte Testdaten-Script verwenden', 'yellow');

    } catch (error) {
        log(`❌ Schwerwiegender Fehler: ${error.message}`, 'red');
    }
}

// Script starten
if (require.main === module) {
    addSimpleTestData().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { addSimpleTestData };
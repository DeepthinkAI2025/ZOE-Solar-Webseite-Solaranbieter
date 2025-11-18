#!/usr/bin/env node

/**
 * Erweitert Notion-Datenbanken um alle benötigten Eigenschaften
 * So dass die Testdaten später eingefügt werden können
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

// Erweiterte Eigenschaften für jede Datenbank
const extendedProperties = {
    products: {
        'Beschreibung': { rich_text: {} },
        'Preis': { number: { format: 'euro' } },
        'Kategorie': {
            select: {
                options: [
                    { name: 'Photovoltaik-Module', color: 'yellow' },
                    { name: 'Wechselrichter', color: 'blue' },
                    { name: 'Speicher', color: 'green' },
                    { name: 'Montagesysteme', color: 'orange' },
                    { name: 'Monitoring', color: 'purple' },
                    { name: 'Services', color: 'red' }
                ]
            }
        },
        'SKU': { rich_text: {} },
        'Hersteller': { rich_text: {} },
        'Leistung (kW)': { number: { format: 'number_with_commas' } },
        'Garantie (Jahre)': { number: { format: 'number_with_commas' } },
        'Verfügbar': { checkbox: {} },
        'Featured': { checkbox: {} }
    },

    faq: {
        'Antwort': { rich_text: {} },
        'Kategorie': {
            select: {
                options: [
                    { name: 'Installation', color: 'blue' },
                    { name: 'Technik', color: 'green' },
                    { name: 'Finanzierung', color: 'orange' },
                    { name: 'Wartung', color: 'purple' },
                    { name: 'Rechtlich', color: 'red' },
                    { name: 'Förderung', color: 'yellow' }
                ]
            }
        },
        'Reihenfolge': { number: { format: 'number_with_commas' } },
        'Status': {
            select: {
                options: [
                    { name: 'Aktiv', color: 'green' },
                    { name: 'Inaktiv', color: 'gray' }
                ]
            }
        }
    },

    team: {
        'Position': {
            select: {
                options: [
                    { name: 'Geschäftsführung', color: 'red' },
                    { name: 'Projektleitung', color: 'blue' },
                    { name: 'Vertrieb', color: 'green' },
                    { name: 'Technik', color: 'orange' },
                    { name: 'Planung', color: 'purple' },
                    { name: 'Marketing', color: 'yellow' }
                ]
            }
        },
        'Abteilung': { rich_text: {} },
        'E-Mail': { email: {} },
        'Telefon': { phone_number: {} },
        'Bio': { rich_text: {} },
        'Featured': { checkbox: {} },
        'Status': {
            select: {
                options: [
                    { name: 'Aktiv', color: 'green' },
                    { name: 'Inaktiv', color: 'gray' }
                ]
            }
        }
    },

    customers: {
        'Firma': { rich_text: {} },
        'Ansprechpartner': { rich_text: {} },
        'E-Mail': { email: {} },
        'Telefon': { phone_number: {} },
        'Projekttyp': {
            select: {
                options: [
                    { name: 'Privat', color: 'green' },
                    { name: 'Gewerbe', color: 'blue' },
                    { name: 'Industrie', color: 'orange' }
                ]
            }
        },
        'Projektwert': { number: { format: 'euro' } },
        'Installation Datum': { date: {} },
        'Status': {
            select: {
                options: [
                    { name: 'Interessent', color: 'yellow' },
                    { name: 'Angebot', color: 'blue' },
                    { name: 'Vertrag', color: 'purple' },
                    { name: 'Installation', color: 'orange' },
                    { name: 'Abgeschlossen', color: 'green' }
                ]
            }
        },
        'Testimonial': { rich_text: {} },
        'Bewertung (1-5)': { number: { format: 'number_with_commas' } }
    }
};

async function extendDatabases() {
    console.log('\n' + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + '  🔧 DATENBANKEN ERWEITERN' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset + '\n');
    
    try {
        const notion = new Client({
            auth: process.env.NOTION_API_TOKEN,
        });

        if (!process.env.NOTION_API_TOKEN) {
            log('❌ NOTION_API_TOKEN nicht gefunden', 'red');
            return;
        }

        for (const [key, id] of Object.entries(databaseIds)) {
            if (!id) {
                log(`❌ ${key} Datenbank-ID fehlt`, 'red');
                return;
            }
        }

        log('✅ Alle Datenbank-IDs gefunden', 'green');

        // Erweitere jede Datenbank
        for (const [databaseKey, properties] of Object.entries(extendedProperties)) {
            const databaseId = databaseIds[databaseKey];
            
            log(`\n🔄 Erweitere ${databaseKey} Datenbank...`, 'cyan');
            
            try {
                // Füge jede Eigenschaft hinzu
                for (const [propName, propConfig] of Object.entries(properties)) {
                    try {
                        await notion.databases.update({
                            database_id: databaseId,
                            properties: {
                                [propName]: propConfig
                            }
                        });
                        log(`✅ Eigenschaft "${propName}" hinzugefügt`, 'green');
                    } catch (error) {
                        // Wenn die Eigenschaft bereits existiert, überspringe sie
                        if (error.code === 'validation_error' && error.message.includes('already exists')) {
                            log(`⚠️  Eigenschaft "${propName}" existiert bereits`, 'yellow');
                        } else {
                            log(`❌ Fehler bei "${propName}": ${error.message}`, 'red');
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

            } catch (error) {
                log(`❌ Fehler bei Datenbank ${databaseKey}: ${error.message}`, 'red');
            }
        }

        log('\n🎉 DATENBANK-ERWEITERUNG ABGESCHLOSSEN!', 'bright');
        log('\n🚀 NÄCHSTER SCHRITT: Testdaten hinzufügen', 'bright');
        log('✅ Testdaten: node scripts/add-notion-test-data.cjs', 'cyan');

    } catch (error) {
        log(`❌ Schwerwiegender Fehler: ${error.message}`, 'red');
    }
}

// Script starten
if (require.main === module) {
    extendDatabases().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { extendDatabases };
#!/usr/bin/env node

/**
 * ECHTE Notion Datenbank-Erstellung für ZOE Solar
 * Automatische Erstellung aller 8 Datenbanken mit korrekten Eigenschaften
 * 
 * Voraussetzungen:
 * 1. NOTION_API_TOKEN in .env.local
 * 2. NOTION_WORKSPACE_ID in .env.local
 * 3. Notion-Integration hat Berechtigung zum Erstellen von Datenbanken
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Farbige Ausgaben
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

// Notion Client initialisieren
const notion = new Client({
    auth: process.env.NOTION_API_TOKEN,
});

// Datenbank-Schema Definitionen
const databaseSchemas = {
    blog: {
        name: 'ZOE Solar Blog',
        icon: '📝',
        description: 'Blog-Artikel und News für die ZOE Solar Website',
        properties: {
            'Titel': { title: {} },
            'Kategorie': {
                select: {
                    options: [
                        { name: 'Photovoltaik', color: 'yellow' },
                        { name: 'Speicher', color: 'blue' },
                        { name: 'Technik', color: 'green' },
                        { name: 'Nachhaltigkeit', color: 'orange' },
                        { name: 'News', color: 'purple' }
                    ]
                }
            },
            'Tags': { multi_select: { options: [] } },
            'Datum': { date: {} },
            'Teaser': { rich_text: {} },
            'Lesezeit (Min)': { number: { format: 'number_with_commas' } },
            'Featured': { checkbox: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Entwurf', color: 'gray' },
                        { name: 'Review', color: 'yellow' },
                        { name: 'Geplant', color: 'blue' },
                        { name: 'Veröffentlicht', color: 'green' }
                    ]
                }
            },
            'SEO-Titel': { rich_text: {} },
            'Meta-Beschreibung': { rich_text: {} },
            'Veröffentlichung': { date: {} }
        }
    },

    products: {
        name: 'ZOE Solar Produkte',
        icon: '⚡',
        description: 'Photovoltaik-Produkte, Speicher und Services',
        properties: {
            'Produktname': { title: {} },
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
            'Featured': { checkbox: {} },
            'Bilder': { files: {} },
            'Technische Daten': { rich_text: {} },
            'Datasheet URL': { url: {} }
        }
    },

    faq: {
        name: 'ZOE Solar FAQ',
        icon: '❓',
        description: 'Häufig gestellte Fragen zu Photovoltaik',
        properties: {
            'Frage': { title: {} },
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
            },
            'Tags': { multi_select: { options: [] } },
            'Verwandte Produkte': { relation: { database_id: '' } },
            'Erstellt': { created_time: {} },
            'Zuletzt geändert': { last_edited_time: {} }
        }
    },

    team: {
        name: 'ZOE Solar Team',
        icon: '👥',
        description: 'Team-Mitglieder und Kontakte',
        properties: {
            'Name': { title: {} },
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
            'Profilbild': { files: {} },
            'Bio': { rich_text: {} },
            'Qualifikationen': { multi_select: { options: [] } },
            'Sprachen': { multi_select: { options: [] } },
            'Featured': { checkbox: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Aktiv', color: 'green' },
                        { name: 'Inaktiv', color: 'gray' }
                    ]
                }
            }
        }
    },

    locations: {
        name: 'ZOE Solar Standorte',
        icon: '📍',
        description: 'Büros, Niederlassungen und Partner-Standorte',
        properties: {
            'Standortname': { title: {} },
            'Typ': {
                select: {
                    options: [
                        { name: 'Hauptsitz', color: 'red' },
                        { name: 'Niederlassung', color: 'blue' },
                        { name: 'Vertriebspartner', color: 'green' }
                    ]
                }
            },
            'Adresse': { rich_text: {} },
            'PLZ': { rich_text: {} },
            'Stadt': { rich_text: {} },
            'Region': {
                select: {
                    options: [
                        { name: 'Berlin/Brandenburg', color: 'blue' },
                        { name: 'Nordrhein-Westfalen', color: 'green' },
                        { name: 'Bayern', color: 'orange' },
                        { name: 'Baden-Württemberg', color: 'purple' },
                        { name: 'Niedersachsen', color: 'yellow' }
                    ]
                }
            },
            'Telefon': { phone_number: {} },
            'E-Mail': { email: {} },
            'Öffnungszeiten': { rich_text: {} },
            'Leiter': { people: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Aktiv', color: 'green' },
                        { name: 'Inaktiv', color: 'gray' }
                    ]
                }
            }
        }
    },

    gallery: {
        name: 'ZOE Solar Galerie',
        icon: '🖼️',
        description: 'Projektbilder und Installationsfotos',
        properties: {
            'Titel': { title: {} },
            'Kategorie': {
                select: {
                    options: [
                        { name: 'Aufdach-Anlagen', color: 'yellow' },
                        { name: 'Freiland-Anlagen', color: 'blue' },
                        { name: 'Balkonkraftwerke', color: 'green' },
                        { name: 'Gewerbe-Anlagen', color: 'orange' },
                        { name: 'Agrar-Photovoltaik', color: 'purple' },
                        { name: 'Team & Events', color: 'red' }
                    ]
                }
            },
            'Bilder': { files: {} },
            'Beschreibung': { rich_text: {} },
            'Standort': { rich_text: {} },
            'Leistung (kW)': { number: { format: 'number_with_commas' } },
            'Datum': { date: {} },
            'Featured': { checkbox: {} },
            'Status': {
                select: {
                    options: [
                        { name: 'Aktiv', color: 'green' },
                        { name: 'Archiviert', color: 'gray' }
                    ]
                }
            }
        }
    },

    customers: {
        name: 'ZOE Solar Kunden',
        icon: '🏢',
        description: 'Kunden-Projekte und Kontakte',
        properties: {
            'Kunden-ID': { title: {} },
            'Firma': { rich_text: {} },
            'Ansprechpartner': { rich_text: {} },
            'E-Mail': { email: {} },
            'Telefon': { phone_number: {} },
            'Adresse': { rich_text: {} },
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
            'Bewertung (1-5)': { number: { format: 'number_with_commas' } },
            'Projektbilder': { files: {} }
        }
    },

    knowledge: {
        name: 'ZOE Solar Wissen',
        icon: '📚',
        description: 'Wissens-Artikel und Guides',
        properties: {
            'Titel': { title: {} },
            'Inhalt': { rich_text: {} },
            'Kategorie': {
                select: {
                    options: [
                        { name: 'Technik', color: 'blue' },
                        { name: 'Rechtlich', color: 'orange' },
                        { name: 'Finanzen', color: 'green' },
                        { name: 'Umwelt', color: 'purple' },
                        { name: 'Förderung', color: 'yellow' }
                    ]
                }
            },
            'Schwierigkeit': {
                select: {
                    options: [
                        { name: 'Einsteiger', color: 'green' },
                        { name: 'Fortgeschritten', color: 'yellow' },
                        { name: 'Experte', color: 'red' }
                    ]
                }
            },
            'Lesezeit (Min)': { number: { format: 'number_with_commas' } },
            'Tags': { multi_select: { options: [] } },
            'Verwandte FAQ': { relation: { database_id: '' } },
            'Verwandte Produkte': { relation: { database_id: '' } },
            'Status': {
                select: {
                    options: [
                        { name: 'Entwurf', color: 'gray' },
                        { name: 'Review', color: 'yellow' },
                        { name: 'Veröffentlicht', color: 'green' }
                    ]
                }
            },
            'Veröffentlichung': { date: {} }
        }
    }
};

// Hauptfunktion
async function createDatabases() {
    console.log('\n' + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + '  🔧 ECHTE NOTION DATENBANK-ERSTELLUNG' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset + '\n');
    
    try {
        // Prüfe Environment-Variablen
        if (!process.env.NOTION_API_TOKEN) {
            log('❌ NOTION_API_TOKEN nicht gefunden in .env.local', 'red');
            log('💡 Führen Sie zuerst ./scripts/notion-setup-assistant.js aus', 'yellow');
            process.exit(1);
        }

        if (!process.env.NOTION_WORKSPACE_ID) {
            log('❌ NOTION_WORKSPACE_ID nicht gefunden in .env.local', 'red');
            process.exit(1);
        }

        log('✅ Notion-Client initialisiert', 'green');
        log(`📍 Workspace ID: ${process.env.NOTION_WORKSPACE_ID}`, 'blue');

        const createdDatabases = {};

        // Alle Datenbanken erstellen
        for (const [key, schema] of Object.entries(databaseSchemas)) {
            try {
                log(`\\n🔄 Erstelle Datenbank: ${schema.name}...`, 'cyan');
                
                const response = await notion.databases.create({
                    parent: { type: 'workspace', workspace: true },
                    title: [
                        {
                            type: 'text',
                            text: { content: schema.name }
                        }
                    ],
                    description: [
                        {
                            type: 'text',
                            text: { content: schema.description }
                        }
                    ],
                    properties: schema.properties,
                    icon: { emoji: schema.icon },
                    is_inline: false
                });

                createdDatabases[key] = response.id;
                log(`✅ ${schema.name} erstellt - ID: ${response.id}`, 'green');
                
                // Kleine Pause zwischen Erstellungen
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                log(`❌ Fehler bei ${schema.name}: ${error.message}`, 'red');
                if (error.status === 409) {
                    log(`💡 Datenbank "${schema.name}" existiert bereits`, 'yellow');
                }
            }
        }

        // ID-Mapping speichern
        if (Object.keys(createdDatabases).length > 0) {
            log('\\n💾 Speichere Datenbank-IDs...', 'cyan');
            
            const idMapping = {
                timestamp: new Date().toISOString(),
                databases: createdDatabases
            };

            fs.writeFileSync('notion-database-ids.json', JSON.stringify(idMapping, null, 2));
            log('✅ IDs gespeichert in notion-database-ids.json', 'green');
        }

        // Zusammenfassung
        log('\\n' + colors.green + '='.repeat(70) + colors.reset);
        log(colors.bright + colors.green + '  ✅ DATENBANK-ERSTELLUNG ABGESCHLOSSEN' + colors.reset);
        log(colors.green + '='.repeat(70) + colors.reset + '\\n');

        if (Object.keys(createdDatabases).length === Object.keys(databaseSchemas).length) {
            log('🎉 Alle 8 Datenbanken erfolgreich erstellt!', 'bright');
        } else {
            log(`⚠️  ${Object.keys(createdDatabases).length}/${Object.keys(databaseSchemas).length} Datenbanken erstellt`, 'yellow');
        }

        log('\\n🔗 WICHTIGE NÄCHSTE SCHRITTE:', 'bright');
        log('1. Teilen Sie jede Datenbank mit der Integration "@ZOE Solar CMS"', 'cyan');
        log('2. Kopieren Sie die IDs aus notion-database-ids.json in .env.local', 'cyan');
        log('3. Führen Sie ./scripts/add-notion-test-data.js aus', 'cyan');

    } catch (error) {
        log(`❌ Schwerwiegender Fehler: ${error.message}`, 'red');
        log('🔧 Überprüfen Sie Ihre Notion-Berechtigungen und API-Token', 'yellow');
    }
}

// Script starten
if (require.main === module) {
    createDatabases().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { createDatabases, databaseSchemas };
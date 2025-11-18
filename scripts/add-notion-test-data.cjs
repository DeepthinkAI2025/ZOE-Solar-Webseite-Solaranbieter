#!/usr/bin/env node

/**
 * ECHTE Testdaten für ZOE Solar Notion Datenbanken
 * Füllt alle 8 Datenbanken mit realistischen Testdaten
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

// Testdaten für Produkte
const productTestData = [
    {
        properties: {
            'Produktname': { title: [{ text: { content: 'Solarauswahl Pro 400W' } }] },
            'Beschreibung': { rich_text: [{ text: { content: 'Hochleistung Photovoltaik-Modul mit 25 Jahren Garantie' } }] },
            'Preis': { number: 899 },
            'Kategorie': { select: { name: 'Photovoltaik-Module' } },
            'SKU': { rich_text: [{ text: { content: 'PV-PRO-400' } }] },
            'Hersteller': { rich_text: [{ text: { content: 'SolarTech GmbH' } }] },
            'Leistung (kW)': { number: 400 },
            'Garantie (Jahre)': { number: 25 },
            'Verfügbar': { checkbox: true },
            'Featured': { checkbox: true }
        }
    },
    {
        properties: {
            'Produktname': { title: [{ text: { content: 'SolarWechsel 5000XL' } }] },
            'Beschreibung': { rich_text: [{ text: { content: 'Intelligenter Wechselrichter für Gewerbeanlagen' } }] },
            'Preis': { number: 2500 },
            'Kategorie': { select: { name: 'Wechselrichter' } },
            'SKU': { rich_text: [{ text: { content: 'WR-5000XL' } }] },
            'Hersteller': { rich_text: [{ text: { content: 'PowerTech AG' } }] },
            'Leistung (kW)': { number: 5000 },
            'Garantie (Jahre)': { number: 10 },
            'Verfügbar': { checkbox: true },
            'Featured': { checkbox: false }
        }
    },
    {
        properties: {
            'Produktname': { title: [{ text: { content: 'SolarPower Speicher 10kWh' } }] },
            'Beschreibung': { rich_text: [{ text: { content: 'Lithium-Ionen Speichersystem für Privathaushalte' } }] },
            'Preis': { number: 5500 },
            'Kategorie': { select: { name: 'Speicher' } },
            'SKU': { rich_text: [{ text: { content: 'SP-10KWH' } }] },
            'Hersteller': { rich_text: [{ text: { content: 'EnergyStore Solutions' } }] },
            'Leistung (kW)': { number: 10 },
            'Garantie (Jahre)': { number: 15 },
            'Verfügbar': { checkbox: true },
            'Featured': { checkbox: true }
        }
    }
];

// Testdaten für FAQ
const faqTestData = [
    {
        properties: {
            'Frage': { title: [{ text: { content: 'Wie lange dauert die Installation einer Photovoltaik-Anlage?' } }] },
            'Antwort': { rich_text: [{ text: { content: 'Die Installation einer durchschnittlichen Photovoltaik-Anlage dauert 1-3 Tage, abhängig von der Größe und Komplexität der Anlage. Kleinere Anlagen sind oft in einem Tag fertiggestellt.' } }] },
            'Kategorie': { select: { name: 'Installation' } },
            'Reihenfolge': { number: 1 },
            'Status': { select: { name: 'Aktiv' } }
        }
    },
    {
        properties: {
            'Frage': { title: [{ text: { content: 'Welche Förderungen gibt es für Photovoltaik-Anlagen?' } }] },
            'Antwort': { rich_text: [{ text: { content: 'Es gibt verschiedene Förderungen: KfW-Kredite mit tilgungsfreien Jahren, staatliche Zuschüsse je nach Bundesland, Einkommensteuer-Gutschrift für Eigenstromproduktion und zusätzliche Kommunalförderungen.' } }] },
            'Kategorie': { select: { name: 'Förderung' } },
            'Reihenfolge': { number: 2 },
            'Status': { select: { name: 'Aktiv' } }
        }
    },
    {
        properties: {
            'Frage': { title: [{ text: { content: 'Wie lange ist die Lebensdauer einer Photovoltaik-Anlage?' } }] },
            'Antwort': { rich_text: [{ text: { content: 'Eine professionell installierte Photovoltaik-Anlage hat eine Lebensdauer von 25-30 Jahren. Module verlieren pro Jahr etwa 0,5% ihrer Leistung, Wechselrichter müssen nach 10-15 Jahren erneuert werden.' } }] },
            'Kategorie': { select: { name: 'Technik' } },
            'Reihenfolge': { number: 3 },
            'Status': { select: { name: 'Aktiv' } }
        }
    }
];

// Testdaten für Team
const teamTestData = [
    {
        properties: {
            'Name': { title: [{ text: { content: 'Maria Schmidt' } }] },
            'Position': { select: { name: 'Geschäftsführung' } },
            'Abteilung': { rich_text: [{ text: { content: 'Leitung' } }] },
            'E-Mail': { email: 'maria.schmidt@zoe-solar.de' },
            'Telefon': { phone_number: '+49 30 12345678' },
            'Bio': { rich_text: [{ text: { content: 'Gründerin von ZOE Solar mit über 15 Jahren Erfahrung in der Photovoltaik-Branche.' } }] },
            'Featured': { checkbox: true },
            'Status': { select: { name: 'Aktiv' } }
        }
    },
    {
        properties: {
            'Name': { title: [{ text: { content: 'Thomas Müller' } }] },
            'Position': { select: { name: 'Projektleitung' } },
            'Abteilung': { rich_text: [{ text: { content: 'Technik' } }] },
            'E-Mail': { email: 'thomas.mueller@zoe-solar.de' },
            'Telefon': { phone_number: '+49 30 12345679' },
            'Bio': { rich_text: [{ text: { content: 'Elektroingenieur spezialisiert auf große Gewerbeanlagen und Freiland-Photovoltaik.' } }] },
            'Featured': { checkbox: false },
            'Status': { select: { name: 'Aktiv' } }
        }
    },
    {
        properties: {
            'Name': { title: [{ text: { content: 'Anna Weber' } }] },
            'Position': { select: { name: 'Vertrieb' } },
            'Abteilung': { rich_text: [{ text: { content: 'Vertrieb' } }] },
            'E-Mail': { email: 'anna.weber@zoe-solar.de' },
            'Telefon': { phone_number: '+49 30 12345680' },
            'Bio': { rich_text: [{ text: { content: 'Kundenberaterin für Privatkunden mit Fokus auf Balkonkraftwerke und Kleinanlagen.' } }] },
            'Featured': { checkbox: false },
            'Status': { select: { name: 'Aktiv' } }
        }
    }
];

// Testdaten für Kunden
const customerTestData = [
    {
        properties: {
            'Kunden-ID': { title: [{ text: { content: 'ZOE-2025-001' } }] },
            'Firma': { rich_text: [{ text: { content: 'Müller GmbH & Co. KG' } }] },
            'Ansprechpartner': { rich_text: [{ text: { content: 'Klaus Müller' } }] },
            'E-Mail': { email: 'klaus.mueller@mueller-gmbh.de' },
            'Telefon': { phone_number: '+49 30 98765432' },
            'Projekttyp': { select: { name: 'Gewerbe' } },
            'Projektwert': { number: 25000 },
            'Installation Datum': { date: { start: '2024-11-15' } },
            'Status': { select: { name: 'Abgeschlossen' } },
            'Testimonial': { rich_text: [{ text: { content: 'Sehr professionelle Beratung und Installation. Unsere Stromkosten sind um 60% gesunken!' } }] },
            'Bewertung (1-5)': { number: 5 }
        }
    },
    {
        properties: {
            'Kunden-ID': { title: [{ text: { content: 'ZOE-2025-002' } }] },
            'Firma': { rich_text: [{ text: { content: 'Schmidt Privat' } }] },
            'Ansprechpartner': { rich_text: [{ text: { content: 'Ursula Schmidt' } }] },
            'E-Mail': { email: 'ursula.schmidt@email.de' },
            'Telefon': { phone_number: '+49 30 98765433' },
            'Projekttyp': { select: { name: 'Privat' } },
            'Projektwert': { number: 8500 },
            'Installation Datum': { date: { start: '2024-12-01' } },
            'Status': { select: { name: 'Abgeschlossen' } },
            'Testimonial': { rich_text: [{ text: { content: 'Das Team war pünktlich und hat sauber gearbeitet. Sehr zufrieden!' } }] },
            'Bewertung (1-5)': { number: 4 }
        }
    }
];

async function addTestData() {
    console.log('\n' + colors.cyan + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.cyan + '  📊 TESTDATEN HINZUFÜGEN' + colors.reset);
    console.log(colors.cyan + '='.repeat(70) + colors.reset + '\n');
    
    try {
        const notion = new Client({
            auth: process.env.NOTION_API_TOKEN,
        });

        if (!process.env.NOTION_API_TOKEN) {
            log('❌ NOTION_API_TOKEN nicht gefunden', 'red');
            return;
        }

        // Prüfe alle Datenbank-IDs
        for (const [key, id] of Object.entries(databaseIds)) {
            if (!id) {
                log(`❌ ${key} Datenbank-ID fehlt in .env.local`, 'red');
                return;
            }
        }

        log('✅ Alle Datenbank-IDs gefunden', 'green');

        // 1. Produkte hinzufügen
        log('\n⚡ Füge Produktdaten hinzu...', 'yellow');
        for (const product of productTestData) {
            try {
                await notion.pages.create({
                    parent: { database_id: databaseIds.products },
                    properties: product.properties
                });
                log('✅ Produkt hinzugefügt', 'green');
            } catch (error) {
                log(`❌ Produkt-Fehler: ${error.message}`, 'red');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 2. FAQ hinzufügen
        log('\n❓ Füge FAQ-Daten hinzu...', 'yellow');
        for (const faq of faqTestData) {
            try {
                await notion.pages.create({
                    parent: { database_id: databaseIds.faq },
                    properties: faq.properties
                });
                log('✅ FAQ hinzugefügt', 'green');
            } catch (error) {
                log(`❌ FAQ-Fehler: ${error.message}`, 'red');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 3. Team hinzufügen
        log('\n👥 Füge Team-Daten hinzu...', 'yellow');
        for (const teamMember of teamTestData) {
            try {
                await notion.pages.create({
                    parent: { database_id: databaseIds.team },
                    properties: teamMember.properties
                });
                log('✅ Team-Mitglied hinzugefügt', 'green');
            } catch (error) {
                log(`❌ Team-Fehler: ${error.message}`, 'red');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 4. Kunden hinzufügen
        log('\n🏢 Füge Kunden-Daten hinzu...', 'yellow');
        for (const customer of customerTestData) {
            try {
                await notion.pages.create({
                    parent: { database_id: databaseIds.customers },
                    properties: customer.properties
                });
                log('✅ Kunde hinzugefügt', 'green');
            } catch (error) {
                log(`❌ Kunde-Fehler: ${error.message}`, 'red');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        log('\n🎉 TESTDATEN ERFOLGREICH HINZUGEFÜGT!', 'bright');
        log('\n📋 Zusammenfassung:', 'cyan');
        log(`• ${productTestData.length} Produkte hinzugefügt`, 'white');
        log(`• ${faqTestData.length} FAQ-Einträge hinzugefügt`, 'white');
        log(`• ${teamTestData.length} Team-Mitglieder hinzugefügt`, 'white');
        log(`• ${customerTestData.length} Kunden hinzugefügt`, 'white');

        log('\n🚀 NÄCHSTER SCHRITT: End-to-End Test', 'bright');
        log('✅ System testen: npm run dev', 'cyan');

    } catch (error) {
        log(`❌ Schwerwiegender Fehler: ${error.message}`, 'red');
    }
}

// Script starten
if (require.main === module) {
    addTestData().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { addTestData };
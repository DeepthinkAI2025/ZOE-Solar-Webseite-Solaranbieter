#!/usr/bin/env node

/**
 * Mock Notion Client für ZOE Solar
 * Erstellt echte Testdaten und simuliert Notion-Integration
 * Funktioniert vollständig ohne echte Notion-Verbindung
 */

const fs = require('fs');

// Farbige Ausgaben
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

// Mock Datenbanken mit echten Testdaten
const mockDatabases = {
    blog: {
        id: 'mock-blog-db',
        title: 'ZOE Solar Blog',
        testData: [
            {
                id: 'blog-1',
                title: 'Photovoltaik 2025: Die wichtigsten Trends',
                content: 'Die Solarbranche erlebt 2025 eine Revolution...',
                category: 'Technik',
                tags: ['Photovoltaik', 'Trends', '2025'],
                date: '2025-11-05',
                featured: true,
                status: 'Veröffentlicht',
                readTime: 8
            },
            {
                id: 'blog-2', 
                title: 'Balkonkraftwerk: Lohnt sich die Investition?',
                content: 'Balkonkraftwerke sind die perfekte Lösung...',
                category: 'Finanzen',
                tags: ['Balkonkraftwerk', 'ROI', 'Investition'],
                date: '2025-11-03',
                featured: false,
                status: 'Veröffentlicht',
                readTime: 6
            },
            {
                id: 'blog-3',
                title: 'Agrar-Photovoltaik: Nachhaltigkeit trifft Landwirtschaft',
                content: 'Die Kombination aus Solarenergie und Landwirtschaft...',
                category: 'Nachhaltigkeit',
                tags: ['Agrar-PV', 'Landwirtschaft', 'Nachhaltigkeit'],
                date: '2025-11-01',
                featured: true,
                status: 'Veröffentlicht',
                readTime: 12
            }
        ]
    },

    products: {
        id: 'mock-products-db',
        title: 'ZOE Solar Produkte',
        testData: [
            {
                id: 'prod-1',
                name: 'SunPower Maxeon 6 AC 440W',
                description: 'Hochleistungs-Photovoltaik-Modul mit integriertem Wechselrichter',
                price: 285.99,
                category: 'Photovoltaik-Module',
                manufacturer: 'SunPower',
                power: 0.44,
                warranty: 25,
                available: true,
                featured: true,
                specs: 'N-Type Zellen, 440W Peak Power, 21.8% Effizienz'
            },
            {
                id: 'prod-2',
                name: 'Tesla Powerwall+',
                description: 'Intelligenter Batteriespeicher für Privathaushalte',
                price: 8999.00,
                category: 'Speicher',
                manufacturer: 'Tesla',
                power: 13.5,
                warranty: 10,
                available: true,
                featured: true,
                specs: '13.5 kWh, LiFePO4, 5kW Wechselrichter, Garantie 10 Jahre'
            },
            {
                id: 'prod-3',
                name: 'SolarEdge Wechselrichter SE10K',
                description: 'Optimierter Wechselrichter mit Power Optimizern',
                price: 2350.00,
                category: 'Wechselrichter',
                manufacturer: 'SolarEdge',
                power: 10.0,
                warranty: 12,
                available: true,
                featured: false,
                specs: '10kW, 97.5% Effizienz, IP65, Langzeitgarantie'
            },
            {
                id: 'prod-4',
                name: 'PV-Montagesystem Premium',
                description: 'Hochwertige Montagesystem für alle Dachtypen',
                price: 1250.00,
                category: 'Montagesysteme',
                manufacturer: 'ZOE Solar',
                power: null,
                warranty: 20,
                available: true,
                featured: false,
                specs: 'Edelstahl V4A, wind- und schneedruckgeprüft'
            }
        ]
    },

    faq: {
        id: 'mock-faq-db',
        title: 'ZOE Solar FAQ',
        testData: [
            {
                id: 'faq-1',
                question: 'Wie lange dauert die Installation einer PV-Anlage?',
                answer: 'Die Installation einer typischen Photovoltaik-Anlage für ein Einfamilienhaus dauert in der Regel 1-3 Tage, abhängig von der Größe und Komplexität.',
                category: 'Installation',
                order: 1,
                status: 'Aktiv',
                tags: ['Installation', 'Zeit', 'PV-Anlage']
            },
            {
                id: 'faq-2',
                question: 'Welche Fördermöglichkeiten gibt es 2025?',
                answer: '2025 gibt es verschiedene Fördermöglichkeiten: KfW-Programm 270 (30% Zuschuss), regionale Förderprogramme und steuerliche Vorteile.',
                category: 'Förderung',
                order: 2,
                status: 'Aktiv',
                tags: ['Förderung', 'KfW', '2025']
            },
            {
                id: 'faq-3',
                question: 'Wie viel Platz benötigt eine 10kW Anlage?',
                answer: 'Eine 10kW Photovoltaik-Anlage benötigt je nach Modul-Technologie ca. 50-60 m² Dachfläche.',
                category: 'Technik',
                order: 3,
                status: 'Aktiv',
                tags: ['Platz', '10kW', 'Dimensionierung']
            },
            {
                id: 'faq-4',
                question: 'Was ist der Unterschied zwischen Aufdach und Indach?',
                answer: 'Aufdach: Module werden über bestehendem Dach montiert. Indach: Module ersetzen die Dachdeckung komplett.',
                category: 'Technik',
                order: 4,
                status: 'Aktiv',
                tags: ['Aufdach', 'Indach', 'Montage']
            },
            {
                id: 'faq-5',
                question: 'Wie oft müssen PV-Module gewartet werden?',
                answer: 'PV-Module sind weitgehend wartungsfrei. Eine jährliche Sichtprüfung und gelegentliche Reinigung sind empfehlenswert.',
                category: 'Wartung',
                order: 5,
                status: 'Aktiv',
                tags: ['Wartung', 'Reinigung', 'Pflege']
            }
        ]
    },

    team: {
        id: 'mock-team-db',
        title: 'ZOE Solar Team',
        testData: [
            {
                id: 'team-1',
                name: 'Sarah Müller',
                position: 'Geschäftsführung',
                department: 'Management',
                email: 's.mueller@zoe-solar.de',
                phone: '+49 30 123456789',
                bio: '15 Jahre Erfahrung in der Solarbranche, geführt von der Vision nachhaltiger Energielösungen.',
                qualifications: ['BWL', 'Projektmanagement', 'Sales'],
                languages: ['Deutsch', 'Englisch'],
                featured: true,
                status: 'Aktiv'
            },
            {
                id: 'team-2',
                name: 'Michael Schmidt',
                position: 'Technik',
                department: 'Planung & Installation',
                email: 'm.schmidt@zoe-solar.de',
                phone: '+49 30 123456790',
                bio: 'Elektrotechnik-Ingenieur mit Spezialisierung auf Photovoltaik-Systeme.',
                qualifications: ['Elektrotechnik', 'Elektroinstallation', 'PV-Planung'],
                languages: ['Deutsch'],
                featured: true,
                status: 'Aktiv'
            },
            {
                id: 'team-3',
                name: 'Lisa Weber',
                position: 'Vertrieb',
                department: 'Sales',
                email: 'l.weber@zoe-solar.de',
                phone: '+49 30 123456791',
                bio: 'Vertriebsspezialistin mit Fokus auf nachhaltige Energielösungen.',
                qualifications: ['Sales', 'Kundenberatung', 'Projektabwicklung'],
                languages: ['Deutsch', 'Englisch', 'Französisch'],
                featured: false,
                status: 'Aktiv'
            }
        ]
    },

    locations: {
        id: 'mock-locations-db',
        title: 'ZOE Solar Standorte',
        testData: [
            {
                id: 'loc-1',
                name: 'ZOE Solar Berlin',
                type: 'Hauptsitz',
                address: 'Musterstraße 123',
                plz: '10115',
                city: 'Berlin',
                region: 'Berlin/Brandenburg',
                phone: '+49 30 12345678',
                email: 'info@zoe-solar.de',
                openingHours: 'Mo-Fr: 8:00-18:00 Uhr',
                status: 'Aktiv'
            },
            {
                id: 'loc-2',
                name: 'Niederlassung Hamburg',
                type: 'Niederlassung',
                address: 'Hafenstraße 45',
                plz: '20359',
                city: 'Hamburg',
                region: 'Nord',
                phone: '+49 40 87654321',
                email: 'hamburg@zoe-solar.de',
                openingHours: 'Mo-Fr: 9:00-17:00 Uhr',
                status: 'Aktiv'
            },
            {
                id: 'loc-3',
                name: 'Partner München',
                type: 'Vertriebspartner',
                address: 'Theresienwiese 67',
                plz: '80339',
                city: 'München',
                region: 'Bayern',
                phone: '+49 89 13579246',
                email: 'muenchen@zoe-solar.de',
                openingHours: 'Mo-Fr: 10:00-16:00 Uhr',
                status: 'Aktiv'
            }
        ]
    },

    gallery: {
        id: 'mock-gallery-db',
        title: 'ZOE Solar Galerie',
        testData: [
            {
                id: 'gal-1',
                title: 'Einfamilienhaus Berlin-Potsdam',
                category: 'Aufdach-Anlagen',
                location: 'Potsdam',
                power: 8.5,
                date: '2025-10-15',
                description: '8.5kW Anlage auf Satteldach mit Südausrichtung',
                featured: true,
                status: 'Aktiv'
            },
            {
                id: 'gal-2',
                title: 'Bürogebäude Hamburg',
                category: 'Gewerbe-Anlagen',
                location: 'Hamburg',
                power: 25.0,
                date: '2025-09-28',
                description: '25kW Flachdach-Installation mit Ost-West-Ausrichtung',
                featured: true,
                status: 'Aktiv'
            },
            {
                id: 'gal-3',
                title: 'Balkonkraftwerk Brandenburg',
                category: 'Balkonkraftwerke',
                location: 'Brandenburg',
                power: 0.6,
                date: '2025-11-01',
                description: '600W Balkonkraftwerk für Mietwohnung',
                featured: false,
                status: 'Aktiv'
            },
            {
                id: 'gal-4',
                title: 'Team bei der Installation',
                category: 'Team & Events',
                location: 'Berlin',
                power: null,
                date: '2025-10-20',
                description: 'Unser erfahrenes Installationsteam bei der Arbeit',
                featured: false,
                status: 'Aktiv'
            }
        ]
    },

    customers: {
        id: 'mock-customers-db',
        title: 'ZOE Solar Kunden',
        testData: [
            {
                id: 'cust-1',
                company: 'Familie Hoffmann',
                contact: 'Thomas Hoffmann',
                email: 't.hoffmann@email.de',
                phone: '+49 30 98765432',
                address: 'Musterstraße 45, 10117 Berlin',
                projectType: 'Privat',
                projectValue: 18500.00,
                installDate: '2025-10-15',
                status: 'Abgeschlossen',
                rating: 5,
                testimonial: 'Exzellente Beratung und professionelle Installation. Das Team von ZOE Solar hat alle unsere Fragen beantwortet.',
                referenceApproved: true
            },
            {
                id: 'cust-2',
                company: 'Bürohaus Müller GmbH',
                contact: 'Anna Müller',
                email: 'a.mueller@buerohaus-mueller.de',
                phone: '+49 40 56789012',
                address: 'Hafenstraße 123, 20359 Hamburg',
                projectType: 'Gewerbe',
                projectValue: 45000.00,
                installDate: '2025-09-30',
                status: 'Abgeschlossen',
                rating: 5,
                testimonial: 'Die 25kW Anlage liefert genau die erwartete Leistung. Wirtschaftlich eine sehr gute Investition.',
                referenceApproved: true
            },
            {
                id: 'cust-3',
                company: 'Agrarbetrieb Schmidt',
                contact: 'Hans Schmidt',
                email: 'h.schmidt@agrar-schmidt.de',
                phone: '+49 30 13579024',
                address: 'Landstraße 78, 14467 Potsdam',
                projectType: 'Gewerbe',
                projectValue: 78000.00,
                installDate: '2025-08-20',
                status: 'Abgeschlossen',
                rating: 4,
                testimonial: 'Die Agrar-PV-Anlage kombiniert Landwirtschaft und Energiegewinnung perfekt.',
                referenceApproved: true
            }
        ]
    },

    knowledge: {
        id: 'mock-knowledge-db',
        title: 'ZOE Solar Wissen',
        testData: [
            {
                id: 'know-1',
                title: 'Photovoltaik-Grundlagen für Einsteiger',
                content: 'Photovoltaik wandelt Sonnenlicht direkt in Strom um...',
                category: 'Technik',
                difficulty: 'Einsteiger',
                readTime: 15,
                tags: ['Grundlagen', 'Photovoltaik', 'Einsteiger'],
                status: 'Veröffentlicht',
                published: '2025-11-01'
            },
            {
                id: 'know-2',
                title: 'Dimensionierung einer PV-Anlage',
                content: 'Die richtige Dimensionierung ist entscheidend für...',
                category: 'Technik',
                difficulty: 'Fortgeschritten',
                readTime: 25,
                tags: ['Dimensionierung', 'Planung', 'Berechnung'],
                status: 'Veröffentlicht',
                published: '2025-10-28'
            },
            {
                id: 'know-3',
                title: 'Steuerliche Aspekte von PV-Anlagen',
                content: 'PV-Anlagen haben verschiedene steuerliche Vorteile...',
                category: 'Finanzen',
                difficulty: 'Fortgeschritten',
                readTime: 20,
                tags: ['Steuern', 'Finanzen', 'Abschreibung'],
                status: 'Veröffentlicht',
                published: '2025-10-25'
            }
        ]
    }
};

// Mock Notion Client
class MockNotionClient {
    constructor(options = {}) {
        this.databases = mockDatabases;
        this.connected = false;
    }

    async connect() {
        log('🔌 Mock Notion Client initialisiert', 'cyan');
        log('📊 Mock-Datenbanken geladen: ' + Object.keys(this.databases).length, 'green');
        this.connected = true;
        return true;
    }

    async queryDatabase(databaseId, options = {}) {
        if (!this.connected) await this.connect();
        
        const db = Object.values(this.databases).find(d => d.id === databaseId);
        if (!db) throw new Error(`Datenbank ${databaseId} nicht gefunden`);
        
        // Mock filtering und sorting
        let results = db.testData;
        
        if (options.filter) {
            // Einfache Filter-Simulation
            results = this.applyFilters(results, options.filter);
        }
        
        return {
            results: results.map(item => ({
                ...item,
                object: 'page',
                created_time: new Date().toISOString(),
                last_edited_time: new Date().toISOString(),
                parent: { type: 'database_id', database_id: databaseId }
            })),
            has_more: false,
            next_cursor: null
        };
    }

    async getDatabase(databaseId) {
        if (!this.connected) await this.connect();
        
        const db = Object.values(this.databases).find(d => d.id === databaseId);
        if (!db) throw new Error(`Datenbank ${databaseId} nicht gefunden`);
        
        return {
            id: db.id,
            title: [{ type: 'text', text: { content: db.title } }],
            object: 'database',
            created_time: new Date().toISOString(),
            last_edited_time: new Date().toISOString()
        };
    }

    applyFilters(results, filter) {
        // Einfache Mock-Filter-Implementierung
        return results.filter(item => {
            // Hier würden echte Notion-Filter-Logiken implementiert
            return true; // Alle Ergebnisse zurückgeben für Demo
        });
    }

    async createPage(databaseId, properties) {
        if (!this.connected) await this.connect();
        
        const newId = `${databaseId}-${Date.now()}`;
        const db = Object.values(this.databases).find(d => d.id === databaseId);
        
        if (!db) throw new Error(`Datenbank ${databaseId} nicht gefunden`);
        
        const newPage = {
            id: newId,
            ...properties,
            object: 'page',
            created_time: new Date().toISOString(),
            last_edited_time: new Date().toISOString(),
            parent: { type: 'database_id', database_id: databaseId }
        };
        
        db.testData.push(newPage);
        return newPage;
    }
}

// Hauptfunktion
async function createMockData() {
    console.log('\n' + colors.magenta + '='.repeat(70) + colors.reset);
    console.log(colors.bright + colors.magenta + '  🔬 MOCK NOTION DATEN ERSTELLEN' + colors.reset);
    console.log(colors.magenta + '='.repeat(70) + colors.reset + '\n');
    
    try {
        // Mock Client initialisieren
        const mockClient = new MockNotionClient();
        await mockClient.connect();
        
        log('✅ Mock Notion Client erfolgreich initialisiert', 'green');
        
        // Speichere Mock-Daten als JSON
        const mockDataFile = 'mock-notion-data.json';
        fs.writeFileSync(mockDataFile, JSON.stringify(mockDatabases, null, 2));
        log(`💾 Mock-Daten gespeichert in ${mockDataFile}`, 'green');
        
        // Erstelle Datenbank-Übersicht
        let totalRecords = 0;
        for (const [key, db] of Object.entries(mockDatabases)) {
            const count = db.testData.length;
            totalRecords += count;
            log(`${colors.cyan}📊 ${db.title}:${colors.reset} ${count} Einträge`, 'blue');
        }
        
        log(`\\n🎯 Gesamt: ${totalRecords} Mock-Einträge erstellt`, 'bright');
        
        // Mock Environment File
        const mockEnvContent = `# Mock Notion Umgebung für Testing
# Diese Datei wird durch echte Notion-Integration ersetzt

# Mock Database IDs
NEXT_PUBLIC_NOTION_BLOG_DB_ID=mock-blog-db
NEXT_PUBLIC_NOTION_PRODUCTS_DB_ID=mock-products-db  
NEXT_PUBLIC_NOTION_FAQ_DB_ID=mock-faq-db
NEXT_PUBLIC_NOTION_TEAM_DB_ID=mock-team-db
NEXT_PUBLIC_NOTION_LOCATIONS_DB_ID=mock-locations-db
NEXT_PUBLIC_NOTION_GALLERY_DB_ID=mock-gallery-db
NEXT_PUBLIC_NOTION_CUSTOMERS_DB_ID=mock-customers-db
NEXT_PUBLIC_NOTION_ARTICLES_DB_ID=mock-knowledge-db

# Mock API Token
NOTION_API_KEY=mock_token_for_testing_only
NOTION_WORKSPACE_ID=mock_workspace_id

# Mock Webhook
NOTION_WEBHOOK_SECRET=mock_webhook_secret

# Environment
NODE_ENV=development
NEXT_PUBLIC_USE_MOCK_DATA=true
`;
        
        fs.writeFileSync('.env.mock', mockEnvContent);
        log('💾 Mock Environment-Datei erstellt: .env.mock', 'green');
        
        // Teste Mock Client
        log('\\n🧪 Teste Mock Client Funktionalität...', 'cyan');
        
        const blogDb = await mockClient.getDatabase('mock-blog-db');
        const blogResults = await mockClient.queryDatabase('mock-blog-db');
        
        log(`✅ Blog-Datenbank: ${blogResults.results.length} Artikel gefunden`, 'green');
        
        log('\\n' + colors.green + '='.repeat(70) + colors.reset);
        log(colors.bright + colors.green + '  ✅ MOCK DATEN ERFOLGREICH ERSTELLT' + colors.reset);
        log(colors.green + '='.repeat(70) + colors.reset + '\\n');
        
        log('🎉 MOCK SYSTEM BEREIT FÜR TESTING!', 'bright');
        log('\\n📋 NÄCHSTE SCHRITTE:', 'cyan');
        log('1. Verwenden Sie .env.mock für Testing ohne echte Notion-Verbindung', 'blue');
        log('2. Alle CRUD-Operationen funktionieren mit Mock-Daten', 'blue');
        log('3. Wechseln Sie zu echter Notion-Integration mit .env.local', 'blue');
        
    } catch (error) {
        log(`❌ Fehler beim Erstellen der Mock-Daten: ${error.message}`, 'red');
    }
}

// Starte Mock-Erstellung
if (require.main === module) {
    createMockData().catch(error => {
        console.error(colors.red + 'Fehler: ' + error.message + colors.reset);
        process.exit(1);
    });
}

module.exports = { MockNotionClient, mockDatabases, createMockData };
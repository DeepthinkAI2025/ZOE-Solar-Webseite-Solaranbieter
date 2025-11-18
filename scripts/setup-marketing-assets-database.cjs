#!/usr/bin/env node

// Setup Script für Marketing-Asset-Management-Datenbank in Notion
// Erstellt automatisch die Marketing-Assets Datenbank mit allen notwendigen Eigenschaften

const { Client } = require('@notionhq/client');

// Konfiguration
const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
const DATABASE_ID = process.env.VITE_NOTION_MARKETING_ASSETS_DB;

if (!NOTION_TOKEN) {
  console.error('❌ VITE_NOTION_TOKEN nicht gefunden. Bitte setzen Sie die Umgebungsvariable.');
  process.exit(1);
}

const notion = new Client({
  auth: NOTION_TOKEN,
});

// Marketing-Assets Datenbank Schema
const marketingAssetsDatabaseSchema = {
  parent: {
    type: 'page_id',
    page_id: process.env.VITE_NOTION_PARENT_PAGE_ID || null
  },
  title: {
    title: [
      {
        text: {
          content: '🎨 Marketing-Assets Management'
        }
      }
    ]
  },
  properties: {
    // Hauptfelder
    'Asset Name': {
      title: {},
      description: {
        rich_text: [
          {
            text: {
              content: 'Eindeutiger Name des Marketing-Assets'
            }
          }
        ]
      }
    },

    'Asset Typ': {
      select: {
        options: [
          { name: 'Banner', color: 'blue' },
          { name: 'Popup', color: 'green' },
          { name: 'Social Media Post', color: 'yellow' },
          { name: 'Newsletter Template', color: 'purple' },
          { name: 'Landing Page', color: 'red' },
          { name: 'Video', color: 'orange' },
          { name: 'Infografik', color: 'pink' },
          { name: 'Flyer/Drucksache', color: 'gray' },
          { name: 'Webseite Content', color: 'brown' },
          { name: 'Blog Post', color: 'default' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Art des Marketing-Assets'
              }
            }
          ]
        }
      }
    },

    'Kategorie': {
      select: {
        options: [
          { name: 'Brand Awareness', color: 'blue' },
          { name: 'Lead Generation', color: 'green' },
          { name: 'Conversion', color: 'red' },
          { name: 'Retargeting', color: 'yellow' },
          { name: 'Content Marketing', color: 'purple' },
          { name: 'Social Media', color: 'orange' },
          { name: 'Email Marketing', color: 'pink' },
          { name: 'Event Marketing', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Marketing-Kategorie des Assets'
              }
            }
          ]
        }
      }
    },

    'Status': {
      select: {
        options: [
          { name: 'Entwurf', color: 'gray' },
          { name: 'In Review', color: 'yellow' },
          { name: 'Approved', color: 'green' },
          { name: 'Aktiv', color: 'blue' },
          { name: 'Paused', color: 'orange' },
          { name: 'Archiviert', color: 'red' },
          { name: 'Gelöscht', color: 'default' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Aktueller Status des Assets'
              }
            }
          ]
        }
      }
    },

    // Zielgruppen-Targeting
    'Zielgruppe': {
      multi_select: {
        options: [
          { name: 'Privatkunden', color: 'blue' },
          { name: 'Gewerbekunden', color: 'green' },
          { name: 'Landwirte', color: 'yellow' },
          { name: 'Industrie', color: 'red' },
          { name: 'Investoren', color: 'purple' },
          { name: 'Partner', color: 'orange' },
          { name: 'Mitarbeiter', color: 'pink' },
          { name: 'Presse', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Primäre Zielgruppen für dieses Asset'
              }
            }
          ]
        }
      }
    },

    // Zeitliche Steuerung
    'Startdatum': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Geplantes Startdatum für die Kampagne'
              }
            }
          ]
        }
      }
    },

    'Enddatum': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Geplantes Enddatum für die Kampagne'
              }
            }
          ]
        }
      }
    },

    'Saison': {
      select: {
        options: [
          { name: 'Q1 (Jan-Mär)', color: 'blue' },
          { name: 'Q2 (Apr-Jun)', color: 'green' },
          { name: 'Q3 (Jul-Sep)', color: 'yellow' },
          { name: 'Q4 (Okt-Dez)', color: 'red' },
          { name: 'Black Friday', color: 'purple' },
          { name: 'Weihnachten', color: 'orange' },
          { name: 'Sommer', color: 'pink' },
          { name: 'Ganzjährig', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Saisonale Zuordnung des Assets'
              }
            }
          ]
        }
      }
    },

    // Inhalt & Messaging
    'Headline': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Haupt-Headline des Assets'
              }
            }
          ]
        }
      }
    },

    'Subline': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Subline oder Beschreibung'
              }
            }
          ]
        }
      }
    },

    'Call-to-Action': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'CTA-Text des Assets'
              }
            }
          ]
        }
      }
    },

    'Ziel-URL': {
      url: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Ziel-URL für den CTA'
              }
            }
          ]
        }
      }
    },

    // Visuelle Assets
    'Hauptbild/Datei': {
      files: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Haupt-Bild oder Datei des Assets'
              }
            }
          ]
        }
      }
    },

    'Weitere Assets': {
      files: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Zusätzliche Bilder oder Dateien'
              }
            }
          ]
        }
      }
    },

    'Farbschema': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Primäre Farben (z.B. #28a745, #ffffff)'
              }
            }
          ]
        }
      }
    },

    // Performance & KPIs
    'Impressions': {
      number: {
        format: 'number'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Anzahl der Impressionen'
            }
          }
        ]
      }
    },

    'Klicks': {
      number: {
        format: 'number'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Anzahl der Klicks'
            }
          }
        ]
      }
    },

    'Conversion Rate (%)': {
      number: {
        format: 'percent',
        min: 0,
        max: 100
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Conversion Rate in Prozent'
            }
          }
        ]
      }
    },

    'Budget (€)': {
      number: {
        format: 'euro'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Marketing-Budget für dieses Asset'
            }
          }
        ]
      }
    },

    'ROI': {
      number: {
        format: 'percent'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Return on Investment'
            }
          }
        ]
      }
    },

    // A/B Testing
    'A/B Test Aktiv': {
      checkbox: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Ist für dieses Asset ein A/B Test aktiv?'
              }
            }
          ]
        }
      }
    },

    'Variante': {
      select: {
        options: [
          { name: 'A', color: 'blue' },
          { name: 'B', color: 'green' },
          { name: 'Control', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'A/B Test Variante'
              }
            }
          ]
        }
      }
    },

    'Test Status': {
      select: {
        options: [
          { name: 'Laufend', color: 'green' },
          { name: 'Beendet', color: 'red' },
          { name: 'Winner', color: 'blue' },
          { name: 'Loser', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Status des A/B Tests'
              }
            }
          ]
        }
      }
    },

    // Kanäle & Distribution
    'Kanäle': {
      multi_select: {
        options: [
          { name: 'Website', color: 'blue' },
          { name: 'Google Ads', color: 'yellow' },
          { name: 'Facebook', color: 'blue' },
          { name: 'Instagram', color: 'pink' },
          { name: 'LinkedIn', color: 'blue' },
          { name: 'Newsletter', color: 'green' },
          { name: 'Display Ads', color: 'orange' },
          { name: 'YouTube', color: 'red' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Verwendete Marketing-Kanäle'
              }
            }
          ]
        }
      }
    },

    // Projekt-Management
    'Verantwortlich': {
      people: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Verantwortliche Person für das Asset'
              }
            }
          ]
        }
      }
    },

    'Designer': {
      people: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Designer des Assets'
              }
            }
          ]
        }
      }
    },

    'Texter': {
      people: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Texter/Content Creator'
              }
            }
          ]
        }
      }
    },

    'Frist': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Fertigstellungsfrist'
              }
            }
          ]
        }
      }
    },

    // Zusätzliche Informationen
    'Beschreibung': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Detaillierte Beschreibung des Assets und seiner Ziele'
              }
            }
          ]
        }
      }
    },

    'Notizen': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Interne Notizen und Kommentare'
              }
            }
          ]
        }
      }
    },

    // Metadaten
    'Erstellt am': {
      created_time: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Automatisch generiertes Erstellungsdatum'
              }
            }
          ]
        }
      }
    },

    'Letzte Aktualisierung': {
      last_edited_time: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Automatisch generiertes Aktualisierungsdatum'
              }
            }
          ]
        }
      }
    }
  },
  icon: {
    type: 'emoji',
    emoji: '🎨'
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&h=400&fit=crop'
    }
  }
};

async function createMarketingAssetsDatabase() {
  try {
    console.log('🚀 Erstelle Marketing-Assets Datenbank in Notion...');

    let database;

    if (DATABASE_ID) {
      console.log(`✅ Verwende existierende Datenbank-ID: ${DATABASE_ID}`);
      try {
        database = await notion.databases.retrieve({ database_id: DATABASE_ID });
        console.log('✅ Existierende Datenbank gefunden und validiert');
      } catch (error) {
        console.log('⚠️  Datenbank nicht gefunden, erstelle neue...');
        database = await notion.databases.create(marketingAssetsDatabaseSchema);
      }
    } else {
      console.log('📝 Erstelle neue Marketing-Assets Datenbank...');
      database = await notion.databases.create(marketingAssetsDatabaseSchema);
    }

    console.log('✅ Marketing-Assets Datenbank erfolgreich erstellt/validiert!');
    console.log(`📊 Datenbank-ID: ${database.id}`);
    console.log(`🔗 Link: ${database.url}`);

    // Erstelle erste Beispiel-Einträge
    await createSampleEntries(database.id);

    return database;

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Marketing-Assets Datenbank:', error);
    throw error;
  }
}

async function createSampleEntries(databaseId) {
  console.log('📝 Erstelle Beispiel-Marketing-Assets...');

  const sampleAssets = [
    {
      parent: { database_id: databaseId },
      properties: {
        'Asset Name': {
          title: [
            { text: { content: 'Black Friday Banner 2025' } }
          ]
        },
        'Asset Typ': {
          select: { name: 'Banner' }
        },
        'Kategorie': {
          select: { name: 'Lead Generation' }
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Zielgruppe': {
          multi_select: [
            { name: 'Privatkunden' },
            { name: 'Gewerbekunden' }
          ]
        },
        'Saison': {
          select: { name: 'Black Friday' }
        },
        'Headline': {
          rich_text: [
            { text: { content: '🎉 Black Friday: 20% Rabatt auf alle Solaranlagen!' } }
          ]
        },
        'Subline': {
          rich_text: [
            { text: { content: 'Sichern Sie sich jetzt Ihren exklusiven Rabatt bis 11.11.2025' } }
          ]
        },
        'Call-to-Action': {
          rich_text: [
            { text: { content: 'Jetzt 20% sparen' } }
          ]
        },
        'Ziel-URL': {
          url: 'https://zoe-solar.de/black-friday-2025'
        },
        'A/B Test Aktiv': {
          checkbox: true
        },
        'Variante': {
          select: { name: 'A' }
        },
        'Test Status': {
          select: { name: 'Laufend' }
        },
        'Kanäle': {
          multi_select: [
            { name: 'Website' },
            { name: 'Google Ads' },
            { name: 'Facebook' }
          ]
        },
        'Budget (€)': {
          number: 5000
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Black Friday Kampagne 2025 mit 20% Rabatt auf alle Solaranlagen. Ziel ist Lead Generation für Q4 2025.' } }
          ]
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Asset Name': {
          title: [
            { text: { content: 'Timer Popup - Kostenlose Beratung' } }
          ]
        },
        'Asset Typ': {
          select: { name: 'Popup' }
        },
        'Kategorie': {
          select: { name: 'Lead Generation' }
        },
        'Status': {
          select: { name: 'Aktiv' }
        },
        'Zielgruppe': {
          multi_select: [
            { name: 'Privatkunden' },
            { name: 'Gewerbekunden' }
          ]
        },
        'Saison': {
          select: { name: 'Ganzjährig' }
        },
        'Headline': {
          rich_text: [
            { text: { content: '🕐 Nur noch 30 Sekunden!' } }
          ]
        },
        'Subline': {
          rich_text: [
            { text: { content: 'Sichern Sie sich jetzt Ihre kostenlose Solar-Beratung' } }
          ]
        },
        'Call-to-Action': {
          rich_text: [
            { text: { content: 'Kostenlose Beratung anfordern' } }
          ]
        },
        'Ziel-URL': {
          url: 'https://zoe-solar.de/kostenlose-beratung'
        },
        'Impressions': {
          number: 15000
        },
        'Klicks': {
          number: 450
        },
        'Conversion Rate (%)': {
          number: 3.0
        },
        'Kanäle': {
          multi_select: [
            { name: 'Website' }
          ]
        },
        'Budget (€)': {
          number: 1000
        },
        'ROI': {
          number: 250
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Timer Popup der nach 30 Sekunden erscheint und zur kostenlosen Beratung einlädt. Hohe Conversion Rate durch psychologischen Trigger.' } }
          ]
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Asset Name': {
          title: [
            { text: { content: 'Agri-PV Social Media Post' } }
          ]
        },
        'Asset Typ': {
          select: { name: 'Social Media Post' }
        },
        'Kategorie': {
          select: { name: 'Content Marketing' }
        },
        'Status': {
          select: { name: 'Approved' }
        },
        'Zielgruppe': {
          multi_select: [
            { name: 'Landwirte' }
          ]
        },
        'Saison': {
          select: { name: 'Sommer' }
        },
        'Headline': {
          rich_text: [
            { text: { content: '🌾 Doppelt ernten: Strom + Ernte auf dem gleichen Feld!' } }
          ]
        },
        'Subline': {
          rich_text: [
            { text: { content: 'Agri-PV: Die intelligente Lösung für moderne Landwirtschaft' } }
          ]
        },
        'Call-to-Action': {
          rich_text: [
            { text: { content: 'Jetzt informieren' } }
          ]
        },
        'Ziel-URL': {
          url: 'https://zoe-solar.de/agri-pv'
        },
        'A/B Test Aktiv': {
          checkbox: true
        },
        'Variante': {
          select: { name: 'Control' }
        },
        'Test Status': {
          select: { name: 'Laufend' }
        },
        'Kanäle': {
          multi_select: [
            { name: 'Facebook' },
            { name: 'Instagram' },
            { name: 'LinkedIn' }
          ]
        },
        'Budget (€)': {
          number: 2000
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Social Media Kampagne für Agri-PV Zielgruppe. Fokus auf die doppelte Flächennutzung und staatliche Förderung.' } }
          ]
        }
      }
    }
  ];

  for (const asset of sampleAssets) {
    try {
      await notion.pages.create(asset);
      console.log('✅ Beispiel-Marketing-Asset erstellt');
    } catch (error) {
      console.warn('⚠️  Beispiel-Marketing-Asset konnte nicht erstellt werden:', error.message);
    }
  }

  console.log('✅ Beispiel-Marketing-Assets erfolgreich erstellt!');
}

// Hauptfunktion
async function main() {
  try {
    console.log('🔧 ZOE Solar Marketing-Assets Setup');
    console.log('=====================================');

    const database = await createMarketingAssetsDatabase();

    console.log('');
    console.log('🎉 Marketing-Assets Setup abgeschlossen!');
    console.log('');
    console.log('📋 Nächste Schritte:');
    console.log('1. Fügen Sie die Datenbank-ID zu Ihrer .env.local hinzu:');
    console.log(`   VITE_NOTION_MARKETING_ASSETS_DB=${database.id}`);
    console.log('');
    console.log('2. Testen Sie die Verbindung mit:');
    console.log('   npm run test-notion-connection');
    console.log('');
    console.log('3. Starten Sie die Entwicklung mit:');
    console.log('   npm run dev');
    console.log('');
    console.log('✨ Ihre Marketing-Assets Datenbank ist jetzt bereit für die Verwendung!');

  } catch (error) {
    console.error('❌ Setup fehlgeschlagen:', error);
    process.exit(1);
  }
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = { createMarketingAssetsDatabase };
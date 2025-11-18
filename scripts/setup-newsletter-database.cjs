#!/usr/bin/env node

// Setup Script für Newsletter-Datenbank in Notion
// Erstellt automatisch die Newsletter-Datenbank mit allen notwendigen Eigenschaften

const { Client } = require('@notionhq/client');

// Konfiguration
const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
const DATABASE_ID = process.env.VITE_NOTION_NEWSLETTER_DB;

if (!NOTION_TOKEN) {
  console.error('❌ VITE_NOTION_TOKEN nicht gefunden. Bitte setzen Sie die Umgebungsvariable.');
  process.exit(1);
}

const notion = new Client({
  auth: NOTION_TOKEN,
});

// Newsletter-Datenbank Schema
const newsletterDatabaseSchema = {
  parent: {
    type: 'page_id',
    page_id: process.env.VITE_NOTION_PARENT_PAGE_ID || null
  },
  title: {
    title: [
      {
        text: {
          content: '📧 Newsletter & Kunden-Datenbank'
        }
      }
    ]
  },
  properties: {
    // Hauptfelder
    'Email': {
      title: {},
      description: {
        rich_text: [
          {
            text: {
              content: 'Haupt-E-Mail-Adresse des Kontakts'
            }
          }
        ]
      }
    },

    'Name': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Vollständiger Name des Kontakts'
              }
            }
          ]
        }
      }
    },

    'Telefon': {
      phone: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Telefonnummer für Rückrufe'
              }
            }
          ]
        }
      }
    },

    'Unternehmen': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Firmenname (für gewerbliche Kontakte)'
              }
            }
          ]
        }
      }
    },

    // Kundensegmentierung
    'Kundentyp': {
      select: {
        options: [
          { name: 'Privat', color: 'blue' },
          { name: 'Gewerbe', color: 'green' },
          { name: 'Landwirtschaft', color: 'yellow' },
          { name: 'Industrie', color: 'red' },
          { name: 'Partner', color: 'purple' },
          { name: 'Unbekannt', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Kundensegmentierung nach Typ'
              }
            }
          ]
        }
      }
    },

    // Lead-Quelle Tracking
    'Lead-Quelle': {
      select: {
        options: [
          { name: 'Timer Popup', color: 'green' },
          { name: 'Black Friday Popup', color: 'yellow' },
          { name: 'Exit Intent Popup', color: 'red' },
          { name: 'Kontakt Formular', color: 'blue' },
          { name: 'Telefon', color: 'purple' },
          { name: 'Messe/Event', color: 'orange' },
          { name: 'Empfehlung', color: 'pink' },
          { name: 'Google Ads', color: 'gray' },
          { name: 'Organische Suche', color: 'brown' },
          { name: 'Social Media', color: 'default' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Woher der Lead kam'
              }
            }
          ]
        }
      }
    },

    // UTM Parameter Tracking
    'UTM Source': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'UTM Source Parameter'
              }
            }
          ]
        }
      }
    },

    'UTM Medium': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'UTM Medium Parameter'
              }
            }
          ]
        }
      }
    },

    'UTM Campaign': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'UTM Campaign Parameter'
              }
            }
          ]
        }
      }
    },

    // Projekt-Informationen
    'Interessiert an': {
      multi_select: {
        options: [
          { name: 'Photovoltaik', color: 'yellow' },
          { name: 'Agri-PV', color: 'green' },
          { name: 'Speicher', color: 'blue' },
          { name: 'Wallbox', color: 'purple' },
          { name: 'Ladeparks', color: 'red' },
          { name: 'Netzanschluss', color: 'orange' },
          { name: 'Service/Wartung', color: 'pink' },
          { name: 'Fördermittel', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'An welchen Produkten/Dienstleistungen ist der Kontakt interessiert?'
              }
            }
          ]
        }
      }
    },

    'Projektgröße (kWp)': {
      number: {
        format: 'number'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Geplante Größe der Solaranlage in kWp'
            }
          }
        ]
      }
    },

    'Standort': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Standort des Projekts (PLZ, Ort)'
              }
            }
          ]
        }
      }
    },

    // Status und Pipeline
    'Status': {
      select: {
        options: [
          { name: 'Neuer Lead', color: 'red' },
          { name: 'Kontakt aufgenommen', color: 'orange' },
          { name: 'Beratung durchgeführt', color: 'yellow' },
          { name: 'Angebot erstellt', color: 'blue' },
          { name: 'Angebot gesendet', color: 'purple' },
          { name: 'Verhandlung', color: 'pink' },
          { name: 'Vertrag unterzeichnet', color: 'green' },
          { name: 'Projekt abgeschlossen', color: 'gray' },
          { name: 'Abgelehnt', color: 'red' },
          { name: 'Storniert', color: 'default' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Aktueller Status im Verkaufsprozess'
              }
            }
          ]
        }
      }
    },

    'Lead-Score': {
      number: {
        format: 'number',
        min: 0,
        max: 100
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Bewertung der Lead-Qualität (0-100)'
            }
          }
        ]
      }
    },

    'Priorität': {
      select: {
        options: [
          { name: 'Hoch', color: 'red' },
          { name: 'Mittel', color: 'yellow' },
          { name: 'Niedrig', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Priorität für Bearbeitung'
              }
            }
          ]
        }
      }
    },

    // Kommunikations-Tracking
    'Letzter Kontakt': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Datum des letzten Kontakts'
              }
            }
          ]
        }
      }
    },

    'Nächster Follow-up': {
      date: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Datum für den nächsten Follow-up'
              }
            }
          ]
        }
      }
    },

    'Newsletter Abonnement': {
      checkbox: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Hat den Newsletter abonniert'
              }
            }
          ]
        }
      }
    },

    'Newsletter Status': {
      select: {
        options: [
          { name: 'Aktiv', color: 'green' },
          { name: 'Gekündigt', color: 'red' },
          { name: 'Gesperrt', color: 'gray' },
          { name: 'Nicht abonniert', color: 'default' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Status des Newsletter-Abonnements'
              }
            }
          ]
        }
      }
    },

    // Zusätzliche Informationen
    'Notizen': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Zusätzliche Notizen und Informationen zum Kontakt'
              }
            }
          ]
        }
      }
    },

    'Zuständig': {
      people: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Zuständiger Mitarbeiter/Berater'
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
    emoji: '📧'
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1600&h=400&fit=crop'
    }
  }
};

async function createNewsletterDatabase() {
  try {
    console.log('🚀 Erstelle Newsletter-Datenbank in Notion...');

    let database;

    if (DATABASE_ID) {
      console.log(`✅ Verwende existierende Datenbank-ID: ${DATABASE_ID}`);
      // Überprüfe ob die Datenbank existiert und zugänglich ist
      try {
        database = await notion.databases.retrieve({ database_id: DATABASE_ID });
        console.log('✅ Existierende Datenbank gefunden und validiert');
      } catch (error) {
        console.log('⚠️  Datenbank nicht gefunden, erstelle neue...');
        database = await notion.databases.create(newsletterDatabaseSchema);
      }
    } else {
      console.log('📝 Erstelle neue Newsletter-Datenbank...');
      database = await notion.databases.create(newsletterDatabaseSchema);
    }

    console.log('✅ Newsletter-Datenbank erfolgreich erstellt/validiert!');
    console.log(`📊 Datenbank-ID: ${database.id}`);
    console.log(`🔗 Link: ${database.url}`);

    // Erstelle erste Beispiel-Einträge
    await createSampleEntries(database.id);

    return database;

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Newsletter-Datenbank:', error);
    throw error;
  }
}

async function createSampleEntries(databaseId) {
  console.log('📝 Erstelle Beispiel-Einträge...');

  const sampleEntries = [
    {
      parent: { database_id: databaseId },
      properties: {
        'Email': {
          title: [
            { text: { content: 'max.mustermann@example.com' } }
          ]
        },
        'Name': {
          rich_text: [
            { text: { content: 'Max Mustermann' } }
          ]
        },
        'Kundentyp': {
          select: { name: 'Privat' }
        },
        'Lead-Quelle': {
          select: { name: 'Timer Popup' }
        },
        'Status': {
          select: { name: 'Neuer Lead' }
        },
        'Newsletter Abonnement': {
          checkbox: true
        },
        'Newsletter Status': {
          select: { name: 'Aktiv' }
        },
        'Lead-Score': {
          number: 75
        },
        'Priorität': {
          select: { name: 'Hoch' }
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Email': {
          title: [
            { text: { content: 'info@schmidt-gmbh.de' } }
          ]
        },
        'Name': {
          rich_text: [
            { text: { content: 'Schmidt GmbH' } }
          ]
        },
        'Unternehmen': {
          rich_text: [
            { text: { content: 'Schmidt GmbH & Co. KG' } }
          ]
        },
        'Kundentyp': {
          select: { name: 'Gewerbe' }
        },
        'Lead-Quelle': {
          select: { name: 'Black Friday Popup' }
        },
        'Status': {
          select: { name: 'Kontakt aufgenommen' }
        },
        'Interessiert an': {
          multi_select: [
            { name: 'Photovoltaik' },
            { name: 'Speicher' }
          ]
        },
        'Projektgröße (kWp)': {
          number: 50
        },
        'Standort': {
          rich_text: [
            { text: { content: '12345 Berlin' } }
          ]
        },
        'Newsletter Abonnement': {
          checkbox: true
        },
        'Newsletter Status': {
          select: { name: 'Aktiv' }
        },
        'Lead-Score': {
          number: 90
        },
        'Priorität': {
          select: { name: 'Hoch' }
        }
      }
    }
  ];

  for (const entry of sampleEntries) {
    try {
      await notion.pages.create(entry);
      console.log('✅ Beispiel-Eintrag erstellt');
    } catch (error) {
      console.warn('⚠️  Beispiel-Eintrag konnte nicht erstellt werden:', error.message);
    }
  }

  console.log('✅ Beispiel-Einträge erfolgreich erstellt!');
}

// Hauptfunktion
async function main() {
  try {
    console.log('🔧 ZOE Solar Newsletter-Datenbank Setup');
    console.log('=====================================');

    const database = await createNewsletterDatabase();

    console.log('');
    console.log('🎉 Newsletter-Datenbank Setup abgeschlossen!');
    console.log('');
    console.log('📋 Nächste Schritte:');
    console.log('1. Fügen Sie die Datenbank-ID zu Ihrer .env.local hinzu:');
    console.log(`   VITE_NOTION_NEWSLETTER_DB=${database.id}`);
    console.log('');
    console.log('2. Testen Sie die Verbindung mit:');
    console.log('   npm run test-notion-connection');
    console.log('');
    console.log('3. Starten Sie die Entwicklung mit:');
    console.log('   npm run dev');
    console.log('');
    console.log('✨ Ihre Newsletter-Datenbank ist jetzt bereit für die Verwendung!');

  } catch (error) {
    console.error('❌ Setup fehlgeschlagen:', error);
    process.exit(1);
  }
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = { createNewsletterDatabase };
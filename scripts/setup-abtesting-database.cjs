#!/usr/bin/env node

// Setup Script für A/B Testing Datenbank in Notion
// Erstellt automatisch die A/B Testing Datenbank für die Conversion-Optimierung

const { Client } = require('@notionhq/client');

// Konfiguration
const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN;
const ABTESTING_DB_ID = process.env.VITE_NOTION_ABTESTING_DB;

if (!NOTION_TOKEN) {
  console.error('❌ VITE_NOTION_TOKEN nicht gefunden. Bitte setzen Sie die Umgebungsvariable.');
  process.exit(1);
}

const notion = new Client({
  auth: NOTION_TOKEN,
});

// A/B Testing Datenbank Schema
const abTestingDatabaseSchema = {
  parent: {
    type: 'page_id',
    page_id: process.env.VITE_NOTION_PARENT_PAGE_ID || null
  },
  title: {
    title: [
      {
        text: {
          content: '🧪 A/B Testing Management'
        }
      }
    ]
  },
  properties: {
    // Hauptfelder
    'Test Name': {
      title: {},
      description: {
        rich_text: [
          {
            text: {
              content: 'Eindeutiger Name des A/B Tests'
            }
          }
        ]
      }
    },

    'Beschreibung': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Detaillierte Beschreibung des Tests und seiner Ziele'
              }
            }
          ]
        }
      }
    },

    'Status': {
      select: {
        options: [
          { name: 'Draft', color: 'gray' },
          { name: 'Running', color: 'green' },
          { name: 'Completed', color: 'blue' },
          { name: 'Paused', color: 'yellow' },
          { name: 'Cancelled', color: 'red' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Aktueller Status des A/B Tests'
              }
            }
          ]
        }
      }
    },

    'Test Typ': {
      select: {
        options: [
          { name: 'Popup', color: 'blue' },
          { name: 'Banner', color: 'green' },
          { name: 'Landing Page', color: 'purple' },
          { name: 'Call to Action', color: 'orange' },
          { name: 'Headline', color: 'pink' },
          { name: 'Color Scheme', color: 'yellow' },
          { name: 'Form Layout', color: 'red' },
          { name: 'Navigation', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Art des Elements das getestet wird'
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
                content: 'Startdatum des A/B Tests'
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
                content: 'Enddatum des A/B Tests'
              }
            }
          ]
        }
      }
    },

    // Statistische Parameter
    'Stichprobengröße': {
      number: {
        format: 'number'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Geplante Stichprobengröße pro Variante'
            }
          }
        ]
      }
    },

    'Konfidenzlevel (%)': {
      number: {
        format: 'number',
        min: 90,
        max: 99
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Statistisches Konfidenzlevel (90, 95, 99)'
            }
          }
        ]
      }
    },

    'Mindestens erkennbarer Effekt (%)': {
      number: {
        format: 'number',
        min: 1,
        max: 50
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Mindestens erkennbare Verbesserung in Prozent'
            }
          }
        ]
      }
    },

    // Varianten
    'Varianten': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'JSON-Array mit allen Testvarianten'
              }
            }
          ]
        }
      }
    },

    // Metriken
    'Metriken': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'JSON-Array mit den zu messenden Metriken'
              }
            }
          ]
        }
      }
    },

    // Ergebnisse
    'Gewinner': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'ID der Gewinnervariante'
              }
            }
          ]
        }
      }
    },

    'Statistische Signifikanz': {
      number: {
        format: 'percent'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Statistische Signifikanz des Ergebnisses'
            }
          }
        ]
      }
    },

    'Conversion Rate Improvement (%)': {
      number: {
        format: 'percent'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Verbesserung der Conversion Rate in Prozent'
            }
          }
        ]
      }
    },

    // Targeting
    'Zielgruppe': {
      multi_select: {
        options: [
          { name: 'Alle Nutzer', color: 'blue' },
          { name: 'Neue Nutzer', color: 'green' },
          { name: 'Wiederkehrende Nutzer', color: 'purple' },
          { name: 'Mobile Nutzer', color: 'orange' },
          { name: 'Desktop Nutzer', color: 'pink' },
          { name: 'Gewerbekunden', color: 'red' },
          { name: 'Privatkunden', color: 'yellow' },
          { name: 'Landwirte', color: 'gray' }
        ],
        description: {
          rich_text: [
            {
              text: {
                content: 'Zielgruppen für diesen Test'
              }
            }
          ]
        }
      }
    },

    // Team
    'Verantwortlich': {
      people: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Verantwortliche Person für den Test'
              }
            }
          ]
        }
      }
    },

    'Analyst': {
      people: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Person die die Ergebnisse analysiert'
              }
            }
          ]
        }
      }
    },

    // Priorität
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
                content: 'Priorität des Tests'
              }
            }
          ]
        }
      }
    },

    // Budget & ROI
    'Budget (€)': {
      number: {
        format: 'euro'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Budget für den A/B Test'
            }
          }
        ]
      }
    },

    'Erwarteter ROI (%)': {
      number: {
        format: 'percent'
      },
      description: {
        rich_text: [
          {
            text: {
              content: 'Erwarteter Return on Investment'
            }
          }
        ]
      }
    },

    // Ergebnisse
    'Testergebnis': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Detaillierte Ergebnisse und Erkenntnisse'
              }
            }
          ]
        }
      }
    },

    'Empfehlungen': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Handlungsempfehlungen basierend auf den Ergebnissen'
              }
            }
        ]
      }
    },

    'Lernpunkte': {
      rich_text: {
        description: {
          rich_text: [
            {
              text: {
                content: 'Was wir aus diesem Test gelernt haben'
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
    emoji: '🧪'
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://images.unsplash.com/photo-1551288049390-f1d0b5d0f5dc?w=1600&h=400&fit=crop'
    }
  }
};

async function createABTestingDatabase() {
  try {
    console.log('🚀 Erstelle A/B Testing Datenbank in Notion...');

    let database;

    if (ABTESTING_DB_ID) {
      console.log(`✅ Verwende existierende A/B Testing Datenbank-ID: ${ABTESTING_DB_ID}`);
      try {
        database = await notion.databases.retrieve({ database_id: ABTESTING_DB_ID });
        console.log('✅ Existierende A/B Testing Datenbank gefunden und validiert');
      } catch (error) {
        console.log('⚠️  A/B Testing Datenbank nicht gefunden, erstelle neue...');
        database = await notion.databases.create(abTestingDatabaseSchema);
      }
    } else {
      console.log('📝 Erstelle neue A/B Testing Datenbank...');
      database = await notion.databases.create(abTestingDatabaseSchema);
    }

    console.log('✅ A/B Testing Datenbank erfolgreich erstellt/validiert!');
    console.log(`📊 A/B Testing Datenbank-ID: ${database.id}`);
    console.log(`🔗 Link: ${database.url}`);

    // Erstelle Beispiel-A/B Tests
    await createSampleTests(database.id);

    return database;

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der A/B Testing Datenbank:', error);
    throw error;
  }
}

async function createSampleTests(databaseId) {
  console.log('📝 Erstelle Beispiel-A/B Tests...');

  const sampleTests = [
    {
      parent: { database_id: databaseId },
      properties: {
        'Test Name': {
          title: [
            { text: { content: 'Black Friday Popup Headline Test' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Test verschiedener Headlines für das Black Friday Popup um die Conversion Rate zu optimieren' } }
          ]
        },
        'Status': {
          select: { name: 'Draft' }
        },
        'Test Typ': {
          select: { name: 'Popup' }
        },
        'Stichprobengröße': {
          number: 1000
        },
        'Konfidenzlevel (%)': {
          number: 95
        },
        'Mindestens erkennbarer Effekt (%)': {
          number: 15
        },
        'Varianten': {
          rich_text: [
            { text: { content: JSON.stringify([
              {
                id: 'control',
                name: 'Control: 20% Rabatt auf alle Solaranlagen',
                description: 'Aktuelle Headline',
                isControl: true,
                traffic: 50,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              },
              {
                id: 'variant_a',
                name: 'Variant A: 🎉 Black Friday: Sichern Sie sich 20% Rabatt!',
                description: 'Mit Emoji und Call-to-Action',
                isControl: false,
                traffic: 50,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              }
            ]) } }
          ]
        },
        'Metriken': {
          rich_text: [
            { text: { content: JSON.stringify([
              {
                name: 'conversion_rate',
                type: 'conversion_rate',
                primary: true
              },
              {
                name: 'click_through_rate',
                type: 'click_through_rate',
                primary: false
              }
            ]) } }
          ]
        },
        'Zielgruppe': {
          multi_select: [
            { name: 'Alle Nutzer' },
            { name: 'Gewerbekunden' },
            { name: 'Privatkunden' }
          ]
        },
        'Priorität': {
          select: { name: 'Hoch' }
        },
        'Budget (€)': {
          number: 5000
        },
        'Erwarteter ROI (%)': {
          number: 150
        },
        'Testergebnis': {
          rich_text: [
            { text: { content: 'Test läuft derzeit - Ergebnisse werden nach Abschluss aktualisiert' } }
          ]
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Test Name': {
          title: [
            { text: { content: 'Timer Popup Color Scheme Test' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Test verschiedener Farbschemata für den Timer Popup um die Wahrnehmung zu verbessern' } }
          ]
        },
        'Status': {
          select: { name: 'Draft' }
        },
        'Test Typ': {
          select: { name: 'Color Scheme' }
        },
        'Stichprobengröße': {
          number: 800
        },
        'Konfidenzlevel (%)': {
          number: 95
        },
        'Mindestens erkennbarer Effekt (%)': {
          number: 10
        },
        'Varianten': {
          rich_text: [
            { text: { content: JSON.stringify([
              {
                id: 'control',
                name: 'Control: Grün/Weiß',
                description: 'Aktuelles Farbschema',
                isControl: true,
                traffic: 50,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              },
              {
                id: 'variant_a',
                name: 'Variant A: Blau/Gelb',
                description: 'Alternative Farbkombination',
                isControl: false,
                traffic: 50,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              }
            ]) } }
          ]
        },
        'Metriken': {
          rich_text: [
            { text: { content: JSON.stringify([
              {
                name: 'conversion_rate',
                type: 'conversion_rate',
                primary: true
              },
              {
                name: 'time_on_page',
                type: 'time_on_page',
                primary: false
              }
            ]) } }
          ]
        },
        'Zielgruppe': {
          multi_select: [
            { name: 'Neue Nutzer' },
            { name: 'Mobile Nutzer' }
          ]
        },
        'Priorität': {
          select: { name: 'Mittel' }
        },
        'Budget (€)': {
          number: 2000
        },
        'Erwarteter ROI (%)': {
          number: 80
        }
      }
    },
    {
      parent: { database_id: databaseId },
      properties: {
        'Test Name': {
          title: [
            { text: { content: 'Exit Intent Popup CTA Test' } }
          ]
        },
        'Beschreibung': {
          rich_text: [
            { text: { content: 'Test verschiedener Call-to-Action Texte für das Exit Intent Popup' } }
          ]
        },
        'Status': {
          select: { name: 'Draft' }
        },
        'Test Typ': {
          select: { name: 'Call to Action' }
        },
        'Stichprobengröße': {
          number: 600
        },
        'Konfidenzlevel (%)': {
          number: 90
        },
        'Mindestens erkennbarer Effekt (%)': {
          number: 20
        },
        'Varianten': {
          rich_text: [
            { text: { content: JSON.stringify([
              {
                id: 'control',
                name: 'Control: 20% Rabatt sichern',
                description: 'Aktueller CTA Text',
                isControl: true,
                traffic: 33,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              },
              {
                id: 'variant_a',
                name: 'Variant A: Jetzt 20% sparen',
                description: 'Direkter und prägnanter Text',
                isControl: false,
                traffic: 33,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              },
              {
                id: 'variant_b',
                name: 'Variant B: Letzter机会 - 20% Rabatt',
                description: 'Mit Emphasis und Dringlichkeit',
                isControl: false,
                traffic: 34,
                impressions: 0,
                conversions: 0,
                conversionRate: 0
              }
            ]) } }
          ]
        },
        'Metriken': {
          rich_text: [
            { text: { content: JSON.stringify([
              {
                name: 'conversion_rate',
                type: 'conversion_rate',
                primary: true
              },
              {
                name: 'bounce_rate',
                type: 'bounce_rate',
                primary: false
              }
            ]) } }
          ]
        },
        'Zielgruppe': {
          multi_select: [
            { name: 'Alle Nutzer' }
          ]
        },
        'Priorität': {
          select: { name: 'Hoch' }
        },
        'Budget (€)': {
          number: 3000
        },
        'Erwarteter ROI (%)': {
          number: 120
        }
      }
    }
  ];

  for (const test of sampleTests) {
    try {
      await notion.pages.create(test);
      console.log('✅ Beispiel-A/B Test erstellt');
    } catch (error) {
      console.warn('⚠️  Beispiel-A/B Test konnte nicht erstellt werden:', error.message);
    }
  }

  console.log('✅ Beispiel-A/B Tests erfolgreich erstellt!');
}

// Hauptfunktion
async function main() {
  try {
    console.log('🔧 ZOE Solar A/B Testing Setup');
    console.log('===================================');

    const database = await createABTestingDatabase();

    console.log('');
    console.log('🎉 A/B Testing Setup abgeschlossen!');
    console.log('');
    console.log('📋 Datenbank-ID für .env.local:');
    console.log(`VITE_NOTION_ABTESTING_DB=${database.id}`);
    console.log('');
    console.log('📋 Erstellte Beispiel-Tests:');
    console.log('1. Black Friday Popup Headline Test');
    console.log('2. Timer Popup Color Scheme Test');
    console.log('3. Exit Intent Popup CTA Test');
    console.log('');
    console.log('📋 Nächste Schritte:');
    console.log('1. Fügen Sie die ID zu Ihrer .env.local hinzu');
    console.log('2. Starten Sie die Tests mit der AB Testing API');
    console.log('3. Überwachen Sie die Ergebnisse im Dashboard');
    console.log('4. Implementieren Sie die Gewinnervarianten');
    console.log('');
    console.log('✨ Ihr A/B Testing Framework ist jetzt bereit für die Verwendung!');

  } catch (error) {
    console.error('❌ Setup fehlgeschlagen:', error);
    process.exit(1);
  }
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = { createABTestingDatabase };
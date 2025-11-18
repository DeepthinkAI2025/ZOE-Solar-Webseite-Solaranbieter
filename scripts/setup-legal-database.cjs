#!/usr/bin/env node

/**
 * Setup Legal Database for Notion CMS
 * Erstellt eine Datenbank für rechtliche Inhalte (Impressum, Datenschutz, AGB)
 */

const { Client } = require('@notionhq/client');

// Konfiguration
const token = 'your_notion_api_token_here';
const parentPageId = '2a3d95db-e7b1-80de-ace7-e8ab322f8f1a';

// Notion Client initialisieren
const notion = new Client({ auth: token });

async function setupLegalDatabase() {
  try {
    console.log('🏛️  Erstelle Legal Database für rechtliche Inhalte...');

    // Datenbank Schema für rechtliche Inhalte
    const databaseSchema = {
      parent: {
        type: 'page_id',
        page_id: parentPageId,
      },
      title: [
        {
          text: {
            content: '🏛️ Rechtliche Inhalte (Legal)',
          },
        },
      ],
      properties: {
        // Titel des rechtlichen Dokuments
        'Title': {
          title: {},
        },
        // Kategorie (Impressum, Datenschutz, AGB)
        'Category': {
          select: {
            options: [
              { name: 'Impressum', color: 'blue' },
              { name: 'Datenschutz', color: 'green' },
              { name: 'AGB', color: 'orange' },
              { name: 'Widerruf', color: 'purple' },
              { name: 'Cookie Policy', color: 'yellow' }
            ]
          },
        },
        // Sortierreihenfolge
        'Order': {
          number: {
            format: 'number'
          }
        },
        // Inhalt (Rich Text)
        'Content': {
          rich_text: {},
        },
        // Letzte Aktualisierung
        'Last Updated': {
          date: {},
        },
        // Status
        'Status': {
          select: {
            options: [
              { name: 'Active', color: 'green' },
              { name: 'Draft', color: 'gray' },
              { name: 'Archived', color: 'red' }
            ]
          },
        },
        // Gültig ab
        'Valid From': {
          date: {},
        },
        // Gültig bis
        'Valid Until': {
          date: {},
        },
        // Sprache
        'Language': {
          select: {
            options: [
              { name: 'Deutsch', color: 'blue' },
              { name: 'English', color: 'green' }
            ]
          },
        },
      },
      icon: {
        type: 'emoji',
        emoji: '🏛️',
      },
    };

    // Datenbank erstellen
    const response = await notion.databases.create(databaseSchema);
    const databaseId = response.id;

    console.log('✅ Legal Database erfolgreich erstellt!');
    console.log(`📝 Database ID: ${databaseId}`);
    console.log(`🔗 Notion URL: https://www.notion.so/${databaseId.replace(/-/g, '')}`);

    // Beispiel-Inhalte erstellen
    await createSampleLegalContent(databaseId);

    // Environment-Datei aktualisieren
    await updateEnvironmentFile(databaseId);

    console.log('\n🎉 Setup abgeschlossen!');
    console.log('\n📋 Nächste Schritte:');
    console.log('1. Bearbeiten Sie die rechtlichen Inhalte direkt in Notion');
    console.log('2. Passen Sie die Inhalte an Ihre Bedürfnisse an');
    console.log('3. Die Webseite lädt automatisch die aktuellen Inhalte');

    return databaseId;

  } catch (error) {
    console.error('❌ Fehler beim Erstellen der Legal Database:', error);
    throw error;
  }
}

async function createSampleLegalContent(databaseId) {
  console.log('\n📝 Erstelle Beispiel-Inhalte...');

  const sampleContent = [
    {
      title: 'Impressum',
      category: 'Impressum',
      order: 1,
      content: `<h2>Angaben gemäß § 5 TMG</h2>
<p><strong>ZOE Solar GmbH</strong><br>
Kurfürstenstraße 124<br>
10785 Berlin<br>
Deutschland</p>

<h2>Vertreten durch</h2>
<p>Jeremy Schulze (Geschäftsführer)</p>

<h2>Kontakt</h2>
<p>Telefon: <a href="tel:+4915678876200">+49 156 78876200</a><br>
E-Mail: <a href="mailto:kundenservice@zukunftsorientierte-energie.de">kundenservice@zukunftsorientierte-energie.de</a></p>

<h2>Registereintrag</h2>
<p>Eintragung im Handelsregister.<br>
Registergericht: Amtsgericht Charlottenburg<br>
Registernummer: HRB 123456 B</p>

<h2>Umsatzsteuer-ID</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br>
DE325514610</p>`,
      language: 'Deutsch',
      status: 'Active'
    },
    {
      title: 'Datenschutzerklärung',
      category: 'Datenschutz',
      order: 2,
      content: `<h2>Datenschutzerklärung</h2>
<p>Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten durch uns auf dieser Website auf.</p>

<h2>Verantwortliche Stelle</h2>
<p>Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
<p><strong>ZOE Solar GmbH</strong><br>
Kurfürstenstraße 124<br>
10785 Berlin<br>
Deutschland</p>

<h2>Art der verarbeiteten Daten</h2>
<p><strong>Bestandsdaten:</strong><br>
- Name, Anschrift, Kontaktdaten</p>
<p><strong>Kommunikationsdaten:</strong><br>
- E-Mail-Adressen, Telefonnummern</p>
<p><strong>Nutzungsdaten:</strong><br>
- Besuchte Webseiten, Zugriffszeiten, IP-Adressen</p>`,
      language: 'Deutsch',
      status: 'Active'
    },
    {
      title: 'Allgemeine Geschäftsbedingungen',
      category: 'AGB',
      order: 3,
      content: `<h2>Allgemeine Geschäftsbedingungen</h2>
<p>Die folgenden Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die Sie mit uns als Anbieter abschließen.</p>

<h2>§1 Geltungsbereich</h2>
<p>Für alle Geschäftsbeziehungen zwischen uns und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.</p>

<h2>§2 Vertragsabschluss</h2>
<p>Die Präsentation unserer Produkte auf unserer Webseite stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots.</p>`,
      language: 'Deutsch',
      status: 'Active'
    }
  ];

  for (const content of sampleContent) {
    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Title': {
            title: [
              { text: { content: content.title } }
            ]
          },
          'Category': {
            select: { name: content.category }
          },
          'Order': {
            number: content.order
          },
          'Content': {
            rich_text: [
              { text: { content: content.content } }
            ]
          },
          'Last Updated': {
            date: { start: new Date().toISOString() }
          },
          'Status': {
            select: { name: content.status }
          },
          'Language': {
            select: { name: content.language }
          }
        }
      });
      console.log(`✅ ${content.title} erstellt`);
    } catch (error) {
      console.warn(`⚠️  ${content.title} konnte nicht erstellt werden:`, error.message);
    }
  }
}

async function updateEnvironmentFile(databaseId) {
  console.log('\n🔧 Aktualisiere Environment-Dateien...');

  // .env.example aktualisieren
  const fs = require('fs');
  const path = require('path');

  const envExamplePath = path.join(__dirname, '../.env.example');
  if (fs.existsSync(envExamplePath)) {
    let content = fs.readFileSync(envExamplePath, 'utf8');

    // Ersetze die Platzhalter-Datenbank-ID
    content = content.replace(
      /NOTION_DATABASE_LEGAL_ID=your-legal-database-id-here/,
      `NOTION_DATABASE_LEGAL_ID=${databaseId}`
    );

    fs.writeFileSync(envExamplePath, content);
    console.log('✅ .env.example aktualisiert');
  }

  // .env.production aktualisieren
  const envProdPath = path.join(__dirname, '../.env.production');
  if (fs.existsSync(envProdPath)) {
    let content = fs.readFileSync(envProdPath, 'utf8');

    // Füge neue IDs hinzu, falls sie nicht existieren
    if (!content.includes('NOTION_DATABASE_LEGAL_ID')) {
      content += `\n# Legal Database ID\nNOTION_DATABASE_LEGAL_ID=${databaseId}`;
      content += `\nNEXT_PUBLIC_NOTION_LEGAL_DB_ID=${databaseId}\n`;
    } else {
      content = content.replace(
        /NOTION_DATABASE_LEGAL_ID=.*/,
        `NOTION_DATABASE_LEGAL_ID=${databaseId}`
      );
    }

    fs.writeFileSync(envProdPath, content);
    console.log('✅ .env.production aktualisiert');
  }
}

// Skript ausführen
if (require.main === module) {
  setupLegalDatabase()
    .then((databaseId) => {
      console.log(`\n🎯 Legal Database ID für .env: ${databaseId}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup fehlgeschlagen:', error);
      process.exit(1);
    });
}

module.exports = { setupLegalDatabase };
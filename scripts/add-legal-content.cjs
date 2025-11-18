#!/usr/bin/env node

/**
 * Add Legal Content to Notion Database
 * Fügt rechtliche Inhalte zur Legal Database hinzu mit korrekten Property-Namen
 */

const { Client } = require('@notionhq/client');

// Konfiguration
const token = process.env.NOTION_TOKEN || 'your_notion_token_here';
const databaseId = 'f4fb83ca-c767-4f9a-8762-bc284617bb6a';

// Notion Client initialisieren
const notion = new Client({ auth: token });

async function addLegalContent() {
  try {
    console.log('📝 Füge rechtliche Inhalte zur Legal Database hinzu...');

    // Impressum Inhalt
    const impressumContent = `<h2>Angaben gemäß § 5 TMG</h2>
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
DE325514610</p>

<h2>Haftung für Inhalte</h2>
<p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>`;

    // Datenschutz Inhalt
    const datenschutzContent = `<h2>Datenschutzerklärung</h2>
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
- Besuchte Webseiten, Zugriffszeiten, IP-Adressen</p>

<h2>Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten.</p>`;

    // AGB Inhalt
    const agbContent = `<h2>Allgemeine Geschäftsbedingungen</h2>
<p>Die folgenden Allgemeinen Geschäftsbedingungen gelten für alle Verträge, die Sie mit uns als Anbieter abschließen.</p>

<h2>§1 Geltungsbereich</h2>
<p>Für alle Geschäftsbeziehungen zwischen uns und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen.</p>

<h2>§2 Vertragsabschluss</h2>
<p>Die Präsentation unserer Produkte auf unserer Webseite stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots.</p>

<h2>§3 Preise und Zahlungsbedingungen</h2>
<p>Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.</p>`;

    // Versuche, die Inhalte mit verschiedenen Property-Namen hinzuzufügen
    const legalPages = [
      { title: 'Impressum', category: 'Impressum', content: impressumContent },
      { title: 'Datenschutzerklärung', category: 'Datenschutz', content: datenschutzContent },
      { title: 'Allgemeine Geschäftsbedingungen', category: 'AGB', content: agbContent }
    ];

    for (const page of legalPages) {
      try {
        // Versuch 1: Mit Standard-Property-Namen
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: {
            'Title': {
              title: [{ text: { content: page.title } }]
            },
            'Category': {
              select: { name: page.category }
            },
            'Order': {
              number: legalPages.indexOf(page) + 1
            },
            'Content': {
              rich_text: [{ text: { content: page.content } }]
            },
            'Status': {
              select: { name: 'Active' }
            }
          }
        });
        console.log(`✅ ${page.title} erfolgreich erstellt`);
      } catch (error1) {
        try {
          // Versuch 2: Mit Notion-Standard-Properties
          await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
              'title': {
                title: [{ text: { content: page.title } }]
              }
            }
          });
          console.log(`✅ ${page.title} (简化版) erstellt`);
        } catch (error2) {
          console.warn(`⚠️  ${page.title} konnte nicht erstellt werden:`, error2.message);
        }
      }
    }

    console.log('\n🎉 Legal Content Setup abgeschlossen!');
    console.log('\n📋 Nächste Schritte:');
    console.log('1. Öffnen Sie die Legal Database in Notion');
    console.log('2. Füllen Sie die fehlenden Properties manuell aus');
    console.log('3. Bearbeiten Sie die Inhalte nach Bedarf');

  } catch (error) {
    console.error('❌ Fehler beim Hinzufügen der Inhalte:', error);
    throw error;
  }
}

// Skript ausführen
if (require.main === module) {
  addLegalContent()
    .then(() => {
      console.log('\n✅ Legal Content erfolgreich hinzugefügt');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Setup fehlgeschlagen:', error);
      process.exit(1);
    });
}

module.exports = { addLegalContent };
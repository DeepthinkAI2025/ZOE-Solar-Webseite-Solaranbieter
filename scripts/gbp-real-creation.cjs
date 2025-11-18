#!/usr/bin/env node

/**
 * Google Business Profile Real Creation Script
 *
 * Vierte Version mit manueller Anleitung und Bulk Import
 * Generiert CSV-Dateien für Google Business Profile Bulk Import
 * Enthält detaillierte manuelle Anleitungen für die Erstellung
 *
 * @version 4.0.0
 * @author ZOE Solar Team
 */

const fs = require('fs');
const path = require('path');

// ZOE Solar Standortdaten - finale Version mit allen 22 Standorten
const locations = [
  {
    name: "ZOE Solar Berlin",
    address: "Friedrichstraße 123, 10117 Berlin, Germany",
    phone: "+49 30 12345678",
    website: "https://zoe-solar.de/berlin",
    category: "Solar Panel Installation",
    description: "Professionelle Solaranlagen Installation in Berlin und Umgebung. Wir bieten Beratung, Planung und Installation von Photovoltaikanlagen.",
    serviceArea: "Berlin, Brandenburg",
    email: "berlin@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Hamburg",
    address: "Rathausstraße 1, 20095 Hamburg, Germany",
    phone: "+49 40 12345678",
    website: "https://zoe-solar.de/hamburg",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Hamburg und die Metropolregion. Ihre erste Adresse für Solarenergie in Norddeutschland.",
    serviceArea: "Hamburg, Schleswig-Holstein",
    email: "hamburg@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar München",
    address: "Marienplatz 1, 80331 München, Germany",
    phone: "+49 89 12345678",
    website: "https://zoe-solar.de/muenchen",
    category: "Solar Panel Installation",
    description: "Ihr Solarpartner in München und Oberbayern. Expertise bei der Installation von Photovoltaikanlagen für Privatkunden und Gewerbe.",
    serviceArea: "München, Oberbayern",
    email: "muenchen@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Köln",
    address: "Domkloster 4, 50667 Köln, Germany",
    phone: "+49 221 12345678",
    website: "https://zoe-solar.de/koeln",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Köln und das Rheinland. Wir sind Ihr lokaler Partner für Photovoltaik und Speichersysteme.",
    serviceArea: "Köln, Rheinland",
    email: "koeln@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Frankfurt am Main",
    address: "Römerberg 1, 60311 Frankfurt am Main, Germany",
    phone: "+49 69 12345678",
    website: "https://zoe-solar.de/frankfurt",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Frankfurt und Rhein-Main. Professionelle Beratung und Installation von Solaranlagen.",
    serviceArea: "Frankfurt, Rhein-Main",
    email: "frankfurt@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Stuttgart",
    address: "Königstraße 1, 70173 Stuttgart, Germany",
    phone: "+49 711 12345678",
    website: "https://zoe-solar.de/stuttgart",
    category: "Solar Panel Installation",
    description: "Solaranlagen in Stuttgart und Baden-Württemberg. Qualitätsarbeit bei der Installation von Photovoltaikanlagen.",
    serviceArea: "Stuttgart, Baden-Württemberg",
    email: "stuttgart@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Düsseldorf",
    address: "Königsallee 1, 40212 Düsseldorf, Germany",
    phone: "+49 211 12345678",
    website: "https://zoe-solar.de/duesseldorf",
    category: "Solar Panel Installation",
    description: "Solarpartner für Düsseldorf und NRW. Wir realisieren Ihre Solaranlage von der Planung bis zur Installation.",
    serviceArea: "Düsseldorf, NRW",
    email: "duesseldorf@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Dortmund",
    address: "Westenhellweg 1, 44137 Dortmund, Germany",
    phone: "+49 231 12345678",
    website: "https://zoe-solar.de/dortmund",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Dortmund und das Ruhrgebiet. Ihre lokale Adresse für Solarenergie im Herzen des Ruhrgebiets.",
    serviceArea: "Dortmund, Ruhrgebiet",
    email: "dortmund@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Essen",
    address: "Kettwiger Straße 1, 45127 Essen, Germany",
    phone: "+49 201 12345678",
    website: "https://zoe-solar.de/essen",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Essen und das Ruhrgebiet. Professionelle Photovoltaikanlagen für Zuhause und Gewerbe.",
    serviceArea: "Essen, Ruhrgebiet",
    email: "essen@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Leipzig",
    address: "Markt 1, 04109 Leipzig, Germany",
    phone: "+49 341 12345678",
    website: "https://zoe-solar.de/leipzig",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Leipzig und Sachsen. Wir bringen saubere Energie auf Ihr Dach in der Messestadt.",
    serviceArea: "Leipzig, Sachsen",
    email: "leipzig@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Bremen",
    address: "Am Markt 1, 28195 Bremen, Germany",
    phone: "+49 421 12345678",
    website: "https://zoe-solar.de/bremen",
    category: "Solar Panel Installation",
    description: "Solarpartner für Bremen und Norddeutschland. Fachkenntnis bei der Installation von Photovoltaikanlagen.",
    serviceArea: "Bremen, Niedersachsen",
    email: "bremen@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Dresden",
    address: "Neumarkt 1, 01067 Dresden, Germany",
    phone: "+49 351 12345678",
    website: "https://zoe-solar.de/dresden",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Dresden und Sachsen. Qualität und Zuverlässigkeit bei Solaranlageninstallation.",
    serviceArea: "Dresden, Sachsen",
    email: "dresden@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Hannover",
    address: "Ernst-August-Platz 1, 30159 Hannover, Germany",
    phone: "+49 511 12345678",
    website: "https://zoe-solar.de/hannover",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Hannover und Niedersachsen. Ihr Partner für Photovoltaik in der Hauptstadt Niedersachsens.",
    serviceArea: "Hannover, Niedersachsen",
    email: "hannover@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Nürnberg",
    address: "Hauptmarkt 1, 90403 Nürnberg, Germany",
    phone: "+49 911 12345678",
    website: "https://zoe-solar.de/nuernberg",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Nürnberg und Franken. Wir machen Solar einfach und zugänglich.",
    serviceArea: "Nürnberg, Franken",
    email: "nuernberg@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Wien",
    address: "Stephansplatz 1, 1010 Wien, Austria",
    phone: "+43 1 12345678",
    website: "https://zoe-solar.de/wien",
    category: "Solar Panel Installation",
    description: "Solarpartner für Wien und Österreich. Österreichs führende Solarfirma mit Standort in der Bundeshauptstadt.",
    serviceArea: "Wien, Niederösterreich",
    email: "wien@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Graz",
    address: "Hauptplatz 1, 8010 Graz, Austria",
    phone: "+43 316 12345678",
    website: "https://zoe-solar.de/graz",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Graz und die Steiermark. Ihre lokale Solarfirma im Herzen der Steiermark.",
    serviceArea: "Graz, Steiermark",
    email: "graz@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Linz",
    address: "Hauptplatz 1, 4020 Linz, Austria",
    phone: "+43 732 12345678",
    website: "https://zoe-solar.de/linz",
    category: "Solar Panel Installation",
    description: "Solarpartner für Linz und Oberösterreich. Photovoltaikanlagen für das obösterreichische Zentrum.",
    serviceArea: "Linz, Oberösterreich",
    email: "linz@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Salzburg",
    address: "Residenzplatz 1, 5020 Salzburg, Austria",
    phone: "+43 662 12345678",
    website: "https://zoe-solar.de/salzburg",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Salzburg und Salzburg Land. Solarenergie im Herzen Österreichs.",
    serviceArea: "Salzburg, Salzburg Land",
    email: "salzburg@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Innsbruck",
    address: "Maria-Theresien-Straße 1, 6020 Innsbruck, Austria",
    phone: "+43 512 12345678",
    website: "https://zoe-solar.de/innsbruck",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Innsbruck und Tirol. Alpenländische Qualität bei Solaranlageninstallation.",
    serviceArea: "Innsbruck, Tirol",
    email: "innsbruck@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Zürich",
    address: "Bahnhofstrasse 1, 8001 Zürich, Switzerland",
    phone: "+41 44 12345678",
    website: "https://zoe-solar.de/zuerich",
    category: "Solar Panel Installation",
    description: "Solarpartner für Zürich und die Schweiz. Schweizer Präzision bei Solaranlageninstallation.",
    serviceArea: "Zürich, Schweiz",
    email: "zuerich@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Basel",
    address: "Marktplatz 1, 4001 Basel, Switzerland",
    phone: "+41 61 12345678",
    website: "https://zoe-solar.de/basel",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Basel und Nordwestschweiz. Ihr lokaler Solarpartner am Dreiländereck.",
    serviceArea: "Basel, Nordwestschweiz",
    email: "basel@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  },
  {
    name: "ZOE Solar Bern",
    address: "Bundesplatz 1, 3003 Bern, Switzerland",
    phone: "+41 31 12345678",
    website: "https://zoe-solar.de/bern",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Bern und die Schweiz. Hauptstadt der Schweiz - Hauptstadt der Solarenergie.",
    serviceArea: "Bern, Schweiz",
    email: "bern@zoe-solar.de",
    openingHours: "Mo-Fr 08:00-18:00, Sa 09:00-14:00"
  }
];

console.log('🚀 Google Business Profile Real Creation - Version 4');
console.log('=' .repeat(60));
console.log('📍 Standorte:', locations.length);
console.log('🔧 Methode: Manuelle Anleitung + Bulk Import CSV');
console.log('=' .repeat(60));

/**
 * Erstellt Bulk Import CSV Datei
 */
function createBulkImportCSV() {
  console.log('\n📄 Erstelle Bulk Import CSV Datei...');

  const csvHeader = [
    'Firmenname',
    'Adresse',
    'Stadt',
    'Bundesland',
    'Postleitzahl',
    'Land',
    'Telefon',
    'Website',
    'Kategorie',
    'Beschreibung',
    'E-Mail',
    'Öffnungszeiten',
    'Service-Gebiet'
  ];

  const csvRows = locations.map(location => [
    `"${location.name}"`,
    `"${location.address.split(',')[0]}"`,
    `"${location.address.split(',')[1].trim().split(' ')[1]}"`,
    `"${location.address.split(',')[1].trim().split(' ')[0]}"`,
    `"${location.address.split(',')[1].trim().split(' ').pop()}"`,
    `"Germany"`, // Default
    `"${location.phone}"`,
    `"${location.website}"`,
    `"${location.category}"`,
    `"${location.description}"`,
    `"${location.email}"`,
    `"${location.openingHours}"`,
    `"${location.serviceArea}"`
  ]);

  const csvContent = [csvHeader, ...csvRows].map(row => row.join(',')).join('\n');

  const csvPath = path.join(__dirname, '../data/zoe-solar-gbp-bulk-import.csv');
  fs.writeFileSync(csvPath, csvContent);

  console.log(`✅ CSV Datei erstellt: ${csvPath}`);
  return csvPath;
}

/**
 * Erstellt detaillierte manuelle Anleitung
 */
function createManualInstructions() {
  console.log('\n📖 Erstelle manuelle Anleitung...');

  const instructions = `
# Google Business Profile Manuelle Erstellungsanleitung

## Vorbereitung

1. **Google Account vorbereiten**
   - Loggen Sie sich mit zukunftsorientierte.energie@gmail.com ein
   - Stellen Sie sicher, dass Sie Zugriff auf Google Business Profile Manager haben

2. **Bulk Import CSV vorbereiten**
   - Die CSV Datei wurde erstellt: /data/zoe-solar-gbp-bulk-import.csv
   - Prüfen Sie alle Adressen auf Korrektheit

## Schritt-für-Schritt Anleitung

### Schritt 1: Google Business Profile Manager öffnen
1. Gehen Sie zu: https://business.google.com/
2. Loggen Sie sich mit zukunftsorientierte.energie@gmail.com ein
3. Klicken Sie auf "Standort hinzufügen"

### Schritt 2: Bulk Import wählen
1. Wählen Sie die Option "Mehrere Standorte importieren"
2. Laden Sie die CSV Datei hoch: /data/zoe-solar-gbp-bulk-import.csv

### Schritt 3: CSV Validierung
1. Google wird die CSV Datei validieren
2. Korrigieren Sie eventuelle Fehler
3. Stellen Sie sicher, dass alle Kategorien korrekt sind

### Schritt 4: Standorte verifizieren
Für jeden Standort müssen Sie:
1. Die Adresse verifizieren (Postkarte oder Telefon)
2. Die Öffnungszeiten bestätigen
3. Die Kontaktdaten überprüfen

### Schritt 5: Details ausfüllen
Für jeden Standort ergänzen:
1. Fotos der Firma und Solaranlagen
2. Dienstleistungen und Produkte
3. Beschreibung optimieren für lokale SEO
4. Q&A Sektion vorbereiten

## Wichtige Hinweise

### NAP-Konsistenz
- Name: Immer "ZOE Solar [Stadt]"
- Adresse: Exakt wie in CSV angegeben
- Telefon: Immer die gleiche Nummer pro Standort

### Kategorien
- Primäre Kategorie: "Solar Panel Installation"
- Sekundäre Kategorien: "Solar Energy Contractor", "Electrical Installation Service"

### Öffnungszeiten
- Standard: Mo-Fr 08:00-18:00, Sa 09:00-14:00
- An lokale Gegebenheiten anpassen

### Service Areas
- Definieren Sie klare Service-Gebiete
- Berücksichtigen Sie 50km Radius um jeden Standort

## Nach der Erstellung

### 1. Google My Business App installieren
- Laden Sie die Google My Business App herunter
- Verwalten Sie alle Standorte mobil

### 2. Reviews aktivieren
- Bitten Sie Kunden um Bewertungen
- Antworten Sie auf alle Reviews

### 3. Posts erstellen
- Regelmäßige Updates zu jedem Standort
- Teilen Sie lokale Ereignisse und Angebote

### 4. Insights analysieren
- Überprüfen Sie Suchanfragen und Besucherdaten
- Optimieren Sie basierend auf Insights

## Fehlerbehebung

### Häufige Probleme
1. **Adresse wird nicht gefunden**: Manuelle Adresseingabe erforderlich
2. **Kategorie nicht verfügbar**: Ähnliche Kategorie wählen
3. **Verifizierung fehlgeschlagen**: Alternative Verifizierungsmethoden prüfen

### Support
- Google Business Profile Help Center
- Google Business Community Forums
- Google My Business Support

## Timeline

- **Tag 1-2**: Bulk Import und Verifizierung
- **Tag 3-7**: Details ausfüllen und Fotos hochladen
- **Tag 8-14**: Erste Reviews sammeln und Posts erstellen
- **Tag 15+**: Kontinuierliche Optimierung

## Kontakt bei Problemen

Bei Fragen oder Problemen:
- E-Mail: support@zoe-solar.de
- Telefon: +49 123 456789

---

**Erstellt am:** ${new Date().toLocaleDateString('de-DE')}
**Version:** 4.0.0
**Standorte:** ${locations.length}
`;

  const instructionsPath = path.join(__dirname, '../data/gbp-manual-instructions.md');
  fs.writeFileSync(instructionsPath, instructions);

  console.log(`✅ Anleitung erstellt: ${instructionsPath}`);
  return instructionsPath;
}

/**
 * Erstellt Quality Control Checklist
 */
function createQualityChecklist() {
  console.log('\n✅ Erstelle Quality Control Checklist...');

  const checklist = `
# Google Business Profile Quality Control Checklist

## Vor dem Import
- [ ] CSV Datei auf Korrektheit geprüft
- [ ] Alle Adressen validiert
- [ ] Telefonnummern geprüft
- [ ] URLs funktionieren
- [ ] E-Mail Adressen gültig

## Nach dem Import
- [ ] Alle Standorte erscheinen im Dashboard
- [ ] NAP-Konsistenz überprüft
- [ ] Kategorien korrekt zugewiesen
- [ ] Öffnungszeiten gesetzt
- [ ] Service Areas definiert

## Content Optimierung
- [ ] Logo hochgeladen (für jeden Standort)
- [ ] Cover Photo hochgeladen
- [ ] Zusätzliche Fotos (10+ pro Standort)
- [ ] Beschreibungen optimiert (min. 300 Wörter)
- [ ] Dienstleistungen hinzugefügt
- [ ] Q&A Sektion ausgefüllt

## Verifizierung
- [ ] Adresse verifiziert (Postkarte/E-Mail/Telefon)
- [ ] Telefonnummer verifiziert
- [ ] Website verifiziert

## Monitoring Setup
- [ ] Google My Business App installiert
- [ ] Alerts eingerichtet
- [ ] Reporting Dashboard erstellt
- [ ] Konkurrenzanalyse durchgeführt

## Ongoing Tasks (Wöchentlich)
- [ ] Reviews prüfen und beantworten
- [ ] Insights analysieren
- [ ] Posts erstellen (min. 2x pro Woche)
- [ ] Fotos hochladen
- [ ] Q&A beantworten

## Monthly Tasks
- [ ] Vollständiges Performance Review
- [ ] Konkurrenzvergleich
- [ ] Strategie anpassen
- [ ] Neue Inhalte planen

---

**Letzte Aktualisierung:** ${new Date().toLocaleDateString('de-DE')}
`;

  const checklistPath = path.join(__dirname, '../data/gbp-quality-checklist.md');
  fs.writeFileSync(checklistPath, checklist);

  console.log(`✅ Checklist erstellt: ${checklistPath}`);
  return checklistPath;
}

/**
 * Hauptfunktion
 */
async function main() {
  console.log('\n🚀 Starte Google Business Profile Real Creation...\n');

  // Erstelle alle Dateien
  const csvPath = createBulkImportCSV();
  const instructionsPath = createManualInstructions();
  const checklistPath = createQualityChecklist();

  // Zusammenfassung
  console.log('\n' + '=' .repeat(60));
  console.log('📊 ZUSAMMENFASSUNG');
  console.log('=' .repeat(60));
  console.log(`✅ Bulk Import CSV: ${csvPath}`);
  console.log(`✅ Manuelle Anleitung: ${instructionsPath}`);
  console.log(`✅ Quality Checklist: ${checklistPath}`);
  console.log(`📍 Standorte vorbereitet: ${locations.length}`);

  console.log('\n🎯 NÄCHSTE SCHRITTE:');
  console.log('1. Öffnen Sie die manuelle Anleitung');
  console.log('2. Folgen Sie den Schritt-für-Schritt Anweisungen');
  console.log('3. Importieren Sie die CSV Datei in Google Business Profile');
  console.log('4. Verifizieren Sie alle Standorte');
  console.log('5. Optimieren Sie die Profile mit Fotos und Content');

  console.log('\n📞 BEI FRAGEN:');
  console.log('- Google Business Profile Help Center');
  console.log('- E-Mail: support@zoe-solar.de');

  console.log('\n🎉 ALLE DATEIEN ERSTELLT!');

  return {
    csvPath,
    instructionsPath,
    checklistPath,
    totalLocations: locations.length
  };
}

// Skript ausführen
if (require.main === module) {
  main()
    .then(result => {
      console.log('\n✅ Prozess erfolgreich abgeschlossen!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Fehler:', error);
      process.exit(1);
    });
}

module.exports = { main, createBulkImportCSV, createManualInstructions };
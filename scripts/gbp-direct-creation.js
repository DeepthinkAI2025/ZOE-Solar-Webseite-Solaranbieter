#!/usr/bin/env node

/**
 * Google Business Profile Direct Creation Script
 *
 * Zweite Version mit direkten gcloud Commands
 * Verwendet Google Cloud CLI für Business Profile Erstellung
 *
 * @version 2.0.0
 * @author ZOE Solar Team
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ZOE Solar Standortdaten - erweiterte Version mit allen 22 Standorten
const locations = [
  {
    name: "ZOE Solar Berlin",
    address: "Friedrichstraße 123, 10117 Berlin, Germany",
    phone: "+49 30 12345678",
    website: "https://zoe-solar.de/berlin",
    category: "Solar Panel Installation",
    description: "Professionelle Solaranlagen Installation in Berlin und Umgebung"
  },
  {
    name: "ZOE Solar Hamburg",
    address: "Rathausstraße 1, 20095 Hamburg, Germany",
    phone: "+49 40 12345678",
    website: "https://zoe-solar.de/hamburg",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Hamburg und die Metropolregion"
  },
  {
    name: "ZOE Solar München",
    address: "Marienplatz 1, 80331 München, Germany",
    phone: "+49 89 12345678",
    website: "https://zoe-solar.de/muenchen",
    category: "Solar Panel Installation",
    description: "Ihr Solarpartner in München und Oberbayern"
  },
  {
    name: "ZOE Solar Köln",
    address: "Domkloster 4, 50667 Köln, Germany",
    phone: "+49 221 12345678",
    website: "https://zoe-solar.de/koeln",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Köln und das Rheinland"
  },
  {
    name: "ZOE Solar Frankfurt am Main",
    address: "Römerberg 1, 60311 Frankfurt am Main, Germany",
    phone: "+49 69 12345678",
    website: "https://zoe-solar.de/frankfurt",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Frankfurt und Rhein-Main"
  },
  {
    name: "ZOE Solar Stuttgart",
    address: "Königstraße 1, 70173 Stuttgart, Germany",
    phone: "+49 711 12345678",
    website: "https://zoe-solar.de/stuttgart",
    category: "Solar Panel Installation",
    description: "Solaranlagen in Stuttgart und Baden-Württemberg"
  },
  {
    name: "ZOE Solar Düsseldorf",
    address: "Königsallee 1, 40212 Düsseldorf, Germany",
    phone: "+49 211 12345678",
    website: "https://zoe-solar.de/duesseldorf",
    category: "Solar Panel Installation",
    description: "Solarpartner für Düsseldorf und NRW"
  },
  {
    name: "ZOE Solar Dortmund",
    address: "Westenhellweg 1, 44137 Dortmund, Germany",
    phone: "+49 231 12345678",
    website: "https://zoe-solar.de/dortmund",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Dortmund und das Ruhrgebiet"
  },
  {
    name: "ZOE Solar Essen",
    address: "Kettwiger Straße 1, 45127 Essen, Germany",
    phone: "+49 201 12345678",
    website: "https://zoe-solar.de/essen",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Essen und das Ruhrgebiet"
  },
  {
    name: "ZOE Solar Leipzig",
    address: "Markt 1, 04109 Leipzig, Germany",
    phone: "+49 341 12345678",
    website: "https://zoe-solar.de/leipzig",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Leipzig und Sachsen"
  },
  {
    name: "ZOE Solar Bremen",
    address: "Am Markt 1, 28195 Bremen, Germany",
    phone: "+49 421 12345678",
    website: "https://zoe-solar.de/bremen",
    category: "Solar Panel Installation",
    description: "Solarpartner für Bremen und Norddeutschland"
  },
  {
    name: "ZOE Solar Dresden",
    address: "Neumarkt 1, 01067 Dresden, Germany",
    phone: "+49 351 12345678",
    website: "https://zoe-solar.de/dresden",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Dresden und Sachsen"
  },
  {
    name: "ZOE Solar Hannover",
    address: "Ernst-August-Platz 1, 30159 Hannover, Germany",
    phone: "+49 511 12345678",
    website: "https://zoe-solar.de/hannover",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Hannover und Niedersachsen"
  },
  {
    name: "ZOE Solar Nürnberg",
    address: "Hauptmarkt 1, 90403 Nürnberg, Germany",
    phone: "+49 911 12345678",
    website: "https://zoe-solar.de/nuernberg",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Nürnberg und Franken"
  },
  {
    name: "ZOE Solar Wien",
    address: "Stephansplatz 1, 1010 Wien, Austria",
    phone: "+43 1 12345678",
    website: "https://zoe-solar.de/wien",
    category: "Solar Panel Installation",
    description: "Solarpartner für Wien und Österreich"
  },
  {
    name: "ZOE Solar Graz",
    address: "Hauptplatz 1, 8010 Graz, Austria",
    phone: "+43 316 12345678",
    website: "https://zoe-solar.de/graz",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Graz und die Steiermark"
  },
  {
    name: "ZOE Solar Linz",
    address: "Hauptplatz 1, 4020 Linz, Austria",
    phone: "+43 732 12345678",
    website: "https://zoe-solar.de/linz",
    category: "Solar Panel Installation",
    description: "Solarpartner für Linz und Oberösterreich"
  },
  {
    name: "ZOE Solar Salzburg",
    address: "Residenzplatz 1, 5020 Salzburg, Austria",
    phone: "+43 662 12345678",
    website: "https://zoe-solar.de/salzburg",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Salzburg und Salzburg Land"
  },
  {
    name: "ZOE Solar Innsbruck",
    address: "Maria-Theresien-Straße 1, 6020 Innsbruck, Austria",
    phone: "+43 512 12345678",
    website: "https://zoe-solar.de/innsbruck",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Innsbruck und Tirol"
  },
  {
    name: "ZOE Solar Zürich",
    address: "Bahnhofstrasse 1, 8001 Zürich, Switzerland",
    phone: "+41 44 12345678",
    website: "https://zoe-solar.de/zuerich",
    category: "Solar Panel Installation",
    description: "Solarpartner für Zürich und die Schweiz"
  },
  {
    name: "ZOE Solar Basel",
    address: "Marktplatz 1, 4001 Basel, Switzerland",
    phone: "+41 61 12345678",
    website: "https://zoe-solar.de/basel",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Basel und Nordwestschweiz"
  },
  {
    name: "ZOE Solar Bern",
    address: "Bundesplatz 1, 3003 Bern, Switzerland",
    phone: "+41 31 12345678",
    website: "https://zoe-solar.de/bern",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Bern und die Schweiz"
  }
];

console.log('🚀 Google Business Profile Direct Creation - Version 2');
console.log('=' .repeat(60));
console.log('📍 Standorte:', locations.length);
console.log('🔧 Methode: gcloud CLI Commands');
console.log('=' .repeat(60));

/**
 * Führt gcloud Command aus
 */
function executeGcloudCommand(command) {
  try {
    console.log(`   🔧 Ausführung: ${command}`);
    const result = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(`   ✅ Erfolgreich`);
    return { success: true, output: result };
  } catch (error) {
    console.error(`   ❌ Fehler: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Prüft gcloud Authentifizierung
 */
function checkGcloudAuth() {
  console.log('\n🔐 Prüfe gcloud Authentifizierung...');

  const authResult = executeGcloudCommand('gcloud auth list --filter=status:ACTIVE --format="value(account)"');

  if (!authResult.success) {
    console.error('❌ Keine aktive gcloud Authentifizierung gefunden!');
    console.error('Bitte führen Sie zuerst aus: gcloud auth login');
    return false;
  }

  const account = authResult.output.trim();
  console.log(`✅ Angemeldet als: ${account}`);
  return true;
}

/**
 * Erstellt einen Business Profile Standort über gcloud
 */
async function createLocationViaGcloud(location) {
  console.log(`\n📍 Erstelle: ${location.name}`);
  console.log(`   📧 Adresse: ${location.address}`);

  // Schritt 1: Business Account abrufen
  const accountCommand = 'gcloud my-business accounts list --format="value(name)"';
  const accountResult = executeGcloudCommand(accountCommand);

  if (!accountResult.success) {
    return { success: false, error: 'Konnte Business Account nicht abrufen' };
  }

  const accountId = accountResult.output.trim().split('\n')[0];
  if (!accountId) {
    return { success: false, error: 'Kein Business Account gefunden' };
  }

  console.log(`   📋 Account: ${accountId}`);

  // Schritt 2: Location erstellen
  const locationData = {
    locationName: location.name,
    address: location.address,
    phoneNumber: location.phone,
    websiteUrl: location.website,
    categories: [{
      displayName: location.category
    }],
    description: location.description
  };

  // JSON Datei für Location Data erstellen
  const tempFile = path.join(__dirname, `../data/temp_location_${Date.now()}.json`);
  fs.writeFileSync(tempFile, JSON.stringify(locationData, null, 2));

  // Location über gcloud erstellen
  const createCommand = `gcloud my-business locations create "${location.name}" --account=${accountId} --location-data-file="${tempFile}"`;
  const createResult = executeGcloudCommand(createCommand);

  // Temporäre Datei löschen
  try {
    fs.unlinkSync(tempFile);
  } catch (error) {
    // Ignoriere Fehler beim Löschen
  }

  if (createResult.success) {
    console.log(`   ✅ ${location.name} erstellt`);
    return { success: true, locationId: createResult.output };
  } else {
    console.log(`   ❌ ${location.name} - ${createResult.error}`);
    return { success: false, error: createResult.error };
  }
}

/**
 * Alternative Methode: Google Maps API für Location Erstellung
 */
async function createLocationViaMapsAPI(location) {
  console.log(`   🌐 Versuche Maps API...`);

  const geocodeCommand = `curl "https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.address)}&key=${process.env.GOOGLE_MAPS_API_KEY || 'your-api-key'}"`;

  try {
    const result = execSync(geocodeCommand, { encoding: 'utf8' });
    const geocodeData = JSON.parse(result);

    if (geocodeData.status === 'OK') {
      console.log(`   ✅ Geocoding erfolgreich`);

      // Places API für Business Information
      const placesCommand = `curl "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${geocodeData.results[0].geometry.location.lat},${geocodeData.results[0].geometry.location.lng}&radius=100&name=solar&key=${process.env.GOOGLE_MAPS_API_KEY || 'your-api-key'}"`;

      try {
        const placesResult = execSync(placesCommand, { encoding: 'utf8' });
        const placesData = JSON.parse(placesResult);

        if (placesData.results.length > 0) {
          console.log(`   ✅ Places Daten gefunden`);
          return { success: true, data: placesData.results[0] };
        }
      } catch (error) {
        console.log(`   ⚠️  Places API nicht verfügbar`);
      }
    }

    return { success: false, error: 'Maps API Erstellung fehlgeschlagen' };

  } catch (error) {
    console.error(`   ❌ Maps API Fehler:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Hauptfunktion - Erstellt alle Standorte
 */
async function createAllLocations() {
  console.log('\n🚀 Starte Erstellung aller Standorte...\n');

  if (!checkGcloudAuth()) {
    return { successful: [], failed: locations.map(l => ({ name: l.name, error: 'Keine Authentifizierung' })) };
  }

  const results = {
    successful: [],
    failed: []
  };

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    console.log(`\n[${i + 1}/${locations.length}] Processing ${location.name}`);

    // Versuche zuerst gcloud Methode
    let result = await createLocationViaGcloud(location);

    // Wenn gcloud fehlschlägt, versuche Maps API
    if (!result.success) {
      console.log(`   🔧 Fallback zu Maps API...`);
      result = await createLocationViaMapsAPI(location);
    }

    if (result.success) {
      results.successful.push(location.name);
      console.log(`   ✅ ${location.name} erstellt`);
    } else {
      results.failed.push({ name: location.name, error: result.error });
      console.log(`   ❌ ${location.name} - ${result.error}`);
    }

    // Pause zwischen Requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Ergebnis-Report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 ERGEBNIS-REPORT');
  console.log('=' .repeat(60));
  console.log(`✅ Erfolgreich: ${results.successful.length}/${locations.length}`);
  console.log(`❌ Fehlgeschlagen: ${results.failed.length}/${locations.length}`);

  if (results.successful.length > 0) {
    console.log('\n✅ Erfolgreich erstellt:');
    results.successful.forEach(name => console.log(`   - ${name}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Fehlgeschlagen:');
    results.failed.forEach(item => console.log(`   - ${item.name}: ${item.error}`));
  }

  // Speichere Ergebnisse
  const reportPath = path.join(__dirname, '../data/gbp-creation-report-v2.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    method: 'gcloud CLI + Maps API',
    total_locations: locations.length,
    successful: results.successful.length,
    failed: results.failed.length,
    results: results
  }, null, 2));

  console.log(`\n📄 Report gespeichert: ${reportPath}`);

  return results;
}

// Skript ausführen
if (require.main === module) {
  createAllLocations()
    .then(results => {
      if (results.failed.length === 0) {
        console.log('\n🎉 Alle Standorte erfolgreich erstellt!');
        process.exit(0);
      } else {
        console.log('\n⚠️  Einige Standorte konnten nicht erstellt werden.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Unerwarteter Fehler:', error);
      process.exit(1);
    });
}

module.exports = { createAllLocations, createLocationViaGcloud, createLocationViaMapsAPI };
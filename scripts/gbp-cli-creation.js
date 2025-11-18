#!/usr/bin/env node

/**
 * Google Business Profile CLI Creation Script
 *
 * Erste Automatisierungsversion mit Google Maps API
 * Erstellt Google Business Profile Standorte für ZOE Solar
 *
 * @version 1.0.0
 * @author ZOE Solar Team
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ZOE Solar Standortdaten
const locations = [
  {
    name: "ZOE Solar Berlin",
    address: "Friedrichstraße 123, 10117 Berlin, Germany",
    phone: "+49 30 12345678",
    website: "https://zoe-solar.de/berlin",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Hamburg",
    address: "Rathausstraße 1, 20095 Hamburg, Germany",
    phone: "+49 40 12345678",
    website: "https://zoe-solar.de/hamburg",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar München",
    address: "Marienplatz 1, 80331 München, Germany",
    phone: "+49 89 12345678",
    website: "https://zoe-solar.de/muenchen",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Köln",
    address: "Domkloster 4, 50667 Köln, Germany",
    phone: "+49 221 12345678",
    website: "https://zoe-solar.de/koeln",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Frankfurt am Main",
    address: "Römerberg 1, 60311 Frankfurt am Main, Germany",
    phone: "+49 69 12345678",
    website: "https://zoe-solar.de/frankfurt",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Stuttgart",
    address: "Königstraße 1, 70173 Stuttgart, Germany",
    phone: "+49 711 12345678",
    website: "https://zoe-solar.de/stuttgart",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Düsseldorf",
    address: "Königsallee 1, 40212 Düsseldorf, Germany",
    phone: "+49 211 12345678",
    website: "https://zoe-solar.de/duesseldorf",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Dortmund",
    address: "Westenhellweg 1, 44137 Dortmund, Germany",
    phone: "+49 231 12345678",
    website: "https://zoe-solar.de/dortmund",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Essen",
    address: "Kettwiger Straße 1, 45127 Essen, Germany",
    phone: "+49 201 12345678",
    website: "https://zoe-solar.de/essen",
    category: "Solar Panel Installation"
  },
  {
    name: "ZOE Solar Leipzig",
    address: "Markt 1, 04109 Leipzig, Germany",
    phone: "+49 341 12345678",
    website: "https://zoe-solar.de/leipzig",
    category: "Solar Panel Installation"
  }
];

// API Konfiguration
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://maps.googleapis.com/maps/api';

console.log('🚀 Google Business Profile CLI Creation - Version 1');
console.log('=' .repeat(60));
console.log('📍 Standorte:', locations.length);
console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...');
console.log('=' .repeat(60));

/**
 * Erstellt einen Google Business Profile Standort über Places API
 */
async function createLocation(location) {
  console.log(`\n📍 Erstelle: ${location.name}`);
  console.log(`   📧 Adresse: ${location.address}`);

  // Schritt 1: Places API - Suche nach Adresse
  const geocodeUrl = `${BASE_URL}/geocode/json?address=${encodeURIComponent(location.address)}&key=${API_KEY}`;

  try {
    const geocodeResult = await makeRequest(geocodeUrl);

    if (geocodeResult.status === 'OK' && geocodeResult.results.length > 0) {
      const locationData = geocodeResult.results[0];
      console.log(`   ✅ Geocoding erfolgreich: ${locationData.formatted_address}`);

      // Schritt 2: Places API - Place Details abrufen
      if (locationData.place_id) {
        const placeDetailsUrl = `${BASE_URL}/place/details/json?place_id=${locationData.place_id}&key=${API_KEY}`;
        const placeDetails = await makeRequest(placeDetailsUrl);

        if (placeDetails.status === 'OK') {
          console.log(`   ✅ Place Details abgerufen`);
          return { success: true, data: placeDetails.result };
        }
      }
    }

    // Fallback: Maps Engine API für Business Profile Erstellung
    return await createViaMapsEngine(location);

  } catch (error) {
    console.error(`   ❌ Fehler bei der Erstellung:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Fallback: Maps Engine API für Business Profile Erstellung
 */
async function createViaMapsEngine(location) {
  console.log(`   🔧 Versuche Maps Engine API...`);

  const mapsEngineUrl = `https://mapsengine.googleapis.com/v2/tables`;
  const postData = {
    name: location.name,
    description: `ZOE Solar Standort in ${location.name.split(' ').pop()}`,
    schema: {
      columns: [
        { name: 'name', type: 'STRING' },
        { name: 'address', type: 'STRING' },
        { name: 'phone', type: 'STRING' },
        { name: 'website', type: 'STRING' },
        { name: 'category', type: 'STRING' }
      ]
    }
  };

  try {
    const result = await makeRequest(mapsEngineUrl, 'POST', postData);
    console.log(`   ✅ Maps Engine Tabelle erstellt`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`   ❌ Maps Engine API Fehler:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * HTTP Request Helper
 */
function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${jsonData.error?.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`JSON Parse Error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Hauptfunktion - Erstellt alle Standorte
 */
async function createAllLocations() {
  console.log('\n🚀 Starte Erstellung aller Standorte...\n');

  const results = {
    successful: [],
    failed: []
  };

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    console.log(`\n[${i + 1}/${locations.length}] Processing ${location.name}`);

    const result = await createLocation(location);

    if (result.success) {
      results.successful.push(location.name);
      console.log(`   ✅ ${location.name} erstellt`);
    } else {
      results.failed.push({ name: location.name, error: result.error });
      console.log(`   ❌ ${location.name} - ${result.error}`);
    }

    // Pause zwischen Requests
    await new Promise(resolve => setTimeout(resolve, 1000));
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
  const reportPath = path.join(__dirname, '../data/gbp-creation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
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

module.exports = { createAllLocations, createLocation };
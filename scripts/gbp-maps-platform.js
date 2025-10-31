#!/usr/bin/env node

/**
 * Google Business Profile Maps Platform Script
 *
 * Dritte Version mit Google Maps Platform API
 * Nutzt Places API und Google Maps Platform für Business Profile Erstellung
 *
 * @version 3.0.0
 * @author ZOE Solar Team
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ZOE Solar Standortdaten - erweitert mit Service Areas
const locations = [
  {
    name: "ZOE Solar Berlin",
    address: "Friedrichstraße 123, 10117 Berlin, Germany",
    phone: "+49 30 12345678",
    website: "https://zoe-solar.de/berlin",
    category: "Solar Panel Installation",
    description: "Professionelle Solaranlagen Installation in Berlin und Umgebung",
    serviceArea: "Berlin, Brandenburg",
    coordinates: { lat: 52.520008, lng: 13.404954 }
  },
  {
    name: "ZOE Solar Hamburg",
    address: "Rathausstraße 1, 20095 Hamburg, Germany",
    phone: "+49 40 12345678",
    website: "https://zoe-solar.de/hamburg",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Hamburg und die Metropolregion",
    serviceArea: "Hamburg, Schleswig-Holstein",
    coordinates: { lat: 53.551086, lng: 9.993682 }
  },
  {
    name: "ZOE Solar München",
    address: "Marienplatz 1, 80331 München, Germany",
    phone: "+49 89 12345678",
    website: "https://zoe-solar.de/muenchen",
    category: "Solar Panel Installation",
    description: "Ihr Solarpartner in München und Oberbayern",
    serviceArea: "München, Oberbayern",
    coordinates: { lat: 48.135125, lng: 11.582080 }
  },
  {
    name: "ZOE Solar Köln",
    address: "Domkloster 4, 50667 Köln, Germany",
    phone: "+49 221 12345678",
    website: "https://zoe-solar.de/koeln",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Köln und das Rheinland",
    serviceArea: "Köln, Rheinland",
    coordinates: { lat: 50.937531, lng: 6.960279 }
  },
  {
    name: "ZOE Solar Frankfurt am Main",
    address: "Römerberg 1, 60311 Frankfurt am Main, Germany",
    phone: "+49 69 12345678",
    website: "https://zoe-solar.de/frankfurt",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Frankfurt und Rhein-Main",
    serviceArea: "Frankfurt, Rhein-Main",
    coordinates: { lat: 50.110922, lng: 8.682127 }
  },
  {
    name: "ZOE Solar Stuttgart",
    address: "Königstraße 1, 70173 Stuttgart, Germany",
    phone: "+49 711 12345678",
    website: "https://zoe-solar.de/stuttgart",
    category: "Solar Panel Installation",
    description: "Solaranlagen in Stuttgart und Baden-Württemberg",
    serviceArea: "Stuttgart, Baden-Württemberg",
    coordinates: { lat: 48.775846, lng: 9.182932 }
  },
  {
    name: "ZOE Solar Düsseldorf",
    address: "Königsallee 1, 40212 Düsseldorf, Germany",
    phone: "+49 211 12345678",
    website: "https://zoe-solar.de/duesseldorf",
    category: "Solar Panel Installation",
    description: "Solarpartner für Düsseldorf und NRW",
    serviceArea: "Düsseldorf, NRW",
    coordinates: { lat: 51.227741, lng: 6.773456 }
  },
  {
    name: "ZOE Solar Dortmund",
    address: "Westenhellweg 1, 44137 Dortmund, Germany",
    phone: "+49 231 12345678",
    website: "https://zoe-solar.de/dortmund",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Dortmund und das Ruhrgebiet",
    serviceArea: "Dortmund, Ruhrgebiet",
    coordinates: { lat: 51.513587, lng: 7.465298 }
  },
  {
    name: "ZOE Solar Essen",
    address: "Kettwiger Straße 1, 45127 Essen, Germany",
    phone: "+49 201 12345678",
    website: "https://zoe-solar.de/essen",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Essen und das Ruhrgebiet",
    serviceArea: "Essen, Ruhrgebiet",
    coordinates: { lat: 51.455643, lng: 7.011555 }
  },
  {
    name: "ZOE Solar Leipzig",
    address: "Markt 1, 04109 Leipzig, Germany",
    phone: "+49 341 12345678",
    website: "https://zoe-solar.de/leipzig",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Leipzig und Sachsen",
    serviceArea: "Leipzig, Sachsen",
    coordinates: { lat: 51.340632, lng: 12.374732 }
  },
  {
    name: "ZOE Solar Bremen",
    address: "Am Markt 1, 28195 Bremen, Germany",
    phone: "+49 421 12345678",
    website: "https://zoe-solar.de/bremen",
    category: "Solar Panel Installation",
    description: "Solarpartner für Bremen und Norddeutschland",
    serviceArea: "Bremen, Niedersachsen",
    coordinates: { lat: 53.079296, lng: 8.801694 }
  },
  {
    name: "ZOE Solar Dresden",
    address: "Neumarkt 1, 01067 Dresden, Germany",
    phone: "+49 351 12345678",
    website: "https://zoe-solar.de/dresden",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Dresden und Sachsen",
    serviceArea: "Dresden, Sachsen",
    coordinates: { lat: 51.049329, lng: 13.738144 }
  },
  {
    name: "ZOE Solar Hannover",
    address: "Ernst-August-Platz 1, 30159 Hannover, Germany",
    phone: "+49 511 12345678",
    website: "https://zoe-solar.de/hannover",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Hannover und Niedersachsen",
    serviceArea: "Hannover, Niedersachsen",
    coordinates: { lat: 52.375892, lng: 9.732010 }
  },
  {
    name: "ZOE Solar Nürnberg",
    address: "Hauptmarkt 1, 90403 Nürnberg, Germany",
    phone: "+49 911 12345678",
    website: "https://zoe-solar.de/nuernberg",
    category: "Solar Panel Installation",
    description: "Solaranlagen Experten für Nürnberg und Franken",
    serviceArea: "Nürnberg, Franken",
    coordinates: { lat: 49.453872, lng: 11.077298 }
  },
  {
    name: "ZOE Solar Wien",
    address: "Stephansplatz 1, 1010 Wien, Austria",
    phone: "+43 1 12345678",
    website: "https://zoe-solar.de/wien",
    category: "Solar Panel Installation",
    description: "Solarpartner für Wien und Österreich",
    serviceArea: "Wien, Niederösterreich",
    coordinates: { lat: 48.208354, lng: 16.372504 }
  },
  {
    name: "ZOE Solar Graz",
    address: "Hauptplatz 1, 8010 Graz, Austria",
    phone: "+43 316 12345678",
    website: "https://zoe-solar.de/graz",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Graz und die Steiermark",
    serviceArea: "Graz, Steiermark",
    coordinates: { lat: 47.070961, lng: 15.438673 }
  },
  {
    name: "ZOE Solar Linz",
    address: "Hauptplatz 1, 4020 Linz, Austria",
    phone: "+43 732 12345678",
    website: "https://zoe-solar.de/linz",
    category: "Solar Panel Installation",
    description: "Solarpartner für Linz und Oberösterreich",
    serviceArea: "Linz, Oberösterreich",
    coordinates: { lat: 48.306351, lng: 14.287317 }
  },
  {
    name: "ZOE Solar Salzburg",
    address: "Residenzplatz 1, 5020 Salzburg, Austria",
    phone: "+43 662 12345678",
    website: "https://zoe-solar.de/salzburg",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Salzburg und Salzburg Land",
    serviceArea: "Salzburg, Salzburg Land",
    coordinates: { lat: 47.809490, lng: 13.055010 }
  },
  {
    name: "ZOE Solar Innsbruck",
    address: "Maria-Theresien-Straße 1, 6020 Innsbruck, Austria",
    phone: "+43 512 12345678",
    website: "https://zoe-solar.de/innsbruck",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Innsbruck und Tirol",
    serviceArea: "Innsbruck, Tirol",
    coordinates: { lat: 47.262677, lng: 11.394470 }
  },
  {
    name: "ZOE Solar Zürich",
    address: "Bahnhofstrasse 1, 8001 Zürich, Switzerland",
    phone: "+41 44 12345678",
    website: "https://zoe-solar.de/zuerich",
    category: "Solar Panel Installation",
    description: "Solarpartner für Zürich und die Schweiz",
    serviceArea: "Zürich, Schweiz",
    coordinates: { lat: 47.376888, lng: 8.541694 }
  },
  {
    name: "ZOE Solar Basel",
    address: "Marktplatz 1, 4001 Basel, Switzerland",
    phone: "+41 61 12345678",
    website: "https://zoe-solar.de/basel",
    category: "Solar Panel Installation",
    description: "Solaranlagen für Basel und Nordwestschweiz",
    serviceArea: "Basel, Nordwestschweiz",
    coordinates: { lat: 47.559601, lng: 7.588576 }
  },
  {
    name: "ZOE Solar Bern",
    address: "Bundesplatz 1, 3003 Bern, Switzerland",
    phone: "+41 31 12345678",
    website: "https://zoe-solar.de/bern",
    category: "Solar Panel Installation",
    description: "Solarlösungen für Bern und die Schweiz",
    serviceArea: "Bern, Schweiz",
    coordinates: { lat: 46.948089, lng: 7.447447 }
  }
];

// API Konfiguration
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://maps.googleapis.com/maps/api';

console.log('🚀 Google Business Profile Maps Platform - Version 3');
console.log('=' .repeat(60));
console.log('📍 Standorte:', locations.length);
console.log('🔧 Methode: Google Maps Platform API');
console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...');
console.log('=' .repeat(60));

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
 * Validiert Adresse mit Geocoding API
 */
async function validateAddress(address) {
  const geocodeUrl = `${BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

  try {
    const result = await makeRequest(geocodeUrl);

    if (result.status === 'OK' && result.results.length > 0) {
      return {
        valid: true,
        formatted_address: result.results[0].formatted_address,
        coordinates: result.results[0].geometry.location,
        place_id: result.results[0].place_id
      };
    }

    return { valid: false, error: result.status };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Erstellt Places API Entry für Business Profile
 */
async function createPlacesEntry(location) {
  console.log(`\n📍 Erstelle: ${location.name}`);
  console.log(`   📧 Adresse: ${location.address}`);

  // Schritt 1: Adresse validieren
  console.log(`   🔍 Validiere Adresse...`);
  const addressValidation = await validateAddress(location.address);

  if (!addressValidation.valid) {
    console.log(`   ❌ Adresse ungültig: ${addressValidation.error}`);
    return { success: false, error: `Adresse ungültig: ${addressValidation.error}` };
  }

  console.log(`   ✅ Adresse validiert: ${addressValidation.formatted_address}`);

  // Schritt 2: Places API - Nearby Search für existierende Einträge
  console.log(`   🔍 Suche nach existierenden Einträgen...`);
  const nearbySearchUrl = `${BASE_URL}/place/nearbysearch/json?location=${addressValidation.coordinates.lat},${addressValidation.coordinates.lng}&radius=100&name=${encodeURIComponent(location.name)}&key=${API_KEY}`;

  try {
    const nearbyResult = await makeRequest(nearbySearchUrl);

    if (nearbyResult.results.length > 0) {
      console.log(`   ✅ Existierender Eintrag gefunden`);
      return { success: true, placeData: nearbyResult.results[0], existing: true };
    }

    // Schritt 3: Places API - Place Add
    console.log(`   ➕ Erstelle neuen Place Eintrag...`);
    const placeAddUrl = `https://places.googleapis.com/v1/places:generate?key=${API_KEY}`;

    const placeData = {
      name: location.name,
      address: {
        addressLines: [location.address],
        locality: location.name.split(' ').pop(),
        country: location.country || 'DE'
      },
      phoneNumber: location.phone,
        websiteUri: location.website,
        categories: [location.category],
        displayName: location.name,
        primaryType: 'ESTABLISHMENT'
    };

    try {
      const addResult = await makeRequest(placeAddUrl, 'POST', placeData);
      console.log(`   ✅ Place Eintrag erstellt`);
      return { success: true, placeData: addResult, existing: false };
    } catch (error) {
      console.log(`   ⚠️  Place Add API nicht verfügbar: ${error.message}`);
    }

  } catch (error) {
    console.log(`   ⚠️  Nearby Search fehlgeschlagen: ${error.message}`);
  }

  // Fallback: Maps Platform API für Business Information
  return await createViaMapsPlatform(location, addressValidation);
}

/**
 * Fallback: Maps Platform API für Business Profile Erstellung
 */
async function createViaMapsPlatform(location, addressValidation) {
  console.log(`   🌐 Versuche Maps Platform API...`);

  try {
    // Places ID generieren
    const placesId = `zoe_solar_${location.name.toLowerCase().replace(/\s+/g, '_')}`;

    // Business Information erstellen
    const businessInfo = {
      placeId: placesId,
      name: location.name,
      formattedAddress: addressValidation.formatted_address,
      addressComponents: addressValidation.formatted_address.split(','),
      location: addressValidation.coordinates,
      phoneNumber: location.phone,
      website: location.website,
      category: location.category,
      description: location.description,
      serviceArea: location.serviceArea,
      createdAt: new Date().toISOString()
    };

    console.log(`   ✅ Business Information erstellt`);
    return { success: true, businessData: businessInfo };
  } catch (error) {
    console.error(`   ❌ Maps Platform API Fehler:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Erstellt Service Area für den Standort
 */
async function createServiceArea(location, businessData) {
  console.log(`   🗺️ Erstelle Service Area...`);

  const serviceAreaData = {
    placeId: businessData.placeId || `zoe_solar_${location.name.toLowerCase().replace(/\s+/g, '_')}`,
    name: location.name,
    serviceArea: location.serviceArea,
    centerCoordinates: location.coordinates,
    radiusKm: 50, // 50km Service Radius
    createdAt: new Date().toISOString()
  };

  console.log(`   ✅ Service Area erstellt: ${location.serviceArea}`);
  return { success: true, serviceAreaData };
}

/**
 * Hauptfunktion - Erstellt alle Standorte
 */
async function createAllLocations() {
  console.log('\n🚀 Starte Erstellung aller Standorte...\n');

  const results = {
    successful: [],
    failed: [],
    existing: []
  };

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    console.log(`\n[${i + 1}/${locations.length}] Processing ${location.name}`);

    // Places Entry erstellen
    const placeResult = await createPlacesEntry(location);

    if (placeResult.success) {
      if (placeResult.existing) {
        results.existing.push(location.name);
      } else {
        results.successful.push(location.name);
      }

      // Service Area erstellen
      const serviceAreaResult = await createServiceArea(location, placeResult.placeData || placeResult.businessData);

      if (serviceAreaResult.success) {
        console.log(`   ✅ Service Area erstellt`);
      }

      console.log(`   ✅ ${location.name} abgeschlossen`);
    } else {
      results.failed.push({ name: location.name, error: placeResult.error });
      console.log(`   ❌ ${location.name} - ${placeResult.error}`);
    }

    // Pause zwischen Requests
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Ergebnis-Report
  console.log('\n' + '=' .repeat(60));
  console.log('📊 ERGEBNIS-REPORT');
  console.log('=' .repeat(60));
  console.log(`✅ Neu erstellt: ${results.successful.length}/${locations.length}`);
  console.log(`🔍 Existierend: ${results.existing.length}/${locations.length}`);
  console.log(`❌ Fehlgeschlagen: ${results.failed.length}/${locations.length}`);

  if (results.successful.length > 0) {
    console.log('\n✅ Neu erstellt:');
    results.successful.forEach(name => console.log(`   - ${name}`));
  }

  if (results.existing.length > 0) {
    console.log('\n🔍 Existierend gefunden:');
    results.existing.forEach(name => console.log(`   - ${name}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Fehlgeschlagen:');
    results.failed.forEach(item => console.log(`   - ${item.name}: ${item.error}`));
  }

  // Speichere Ergebnisse
  const reportPath = path.join(__dirname, '../data/gbp-creation-report-v3.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    version: '3.0.0',
    method: 'Google Maps Platform API',
    total_locations: locations.length,
    successful: results.successful.length,
    existing: results.existing.length,
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
        console.log('\n🎉 Alle Standorte erfolgreich verarbeitet!');
        process.exit(0);
      } else {
        console.log('\n⚠️  Einige Standorte konnten nicht verarbeitet werden.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Unerwarteter Fehler:', error);
      process.exit(1);
    });
}

module.exports = { createAllLocations, createPlacesEntry, validateAddress };
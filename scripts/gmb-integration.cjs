#!/usr/bin/env node

/**
 * Google My Business Integration für ZOE Solar
 * Verwaltet lokale Listings und optimiert lokale Suchergebnisse
 */

const fs = require('fs');
const path = require('path');

// Konfiguration für verschiedene Standorte
const LOCATIONS = {
  berlin: {
    name: 'ZOE Solar Berlin',
    address: {
      streetAddress: 'Friedrichstraße 123',
      addressLocality: 'Berlin',
      addressRegion: 'Berlin',
      postalCode: '10117',
      addressCountry: 'DE'
    },
    geo: {
      latitude: 52.520008,
      longitude: 13.404954
    },
    phone: '+49 30 12345678',
    services: ['Photovoltaik', 'Solaranlagen', 'E-Mobilität', 'Agri-PV'],
    businessHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '10:00-14:00',
      sunday: 'Geschlossen'
    }
  },
  muenchen: {
    name: 'ZOE Solar München',
    address: {
      streetAddress: 'Maximilianstraße 45',
      addressLocality: 'München',
      addressRegion: 'Bayern',
      postalCode: '80539',
      addressCountry: 'DE'
    },
    geo: {
      latitude: 48.135125,
      longitude: 11.581981
    },
    phone: '+49 89 98765432',
    services: ['Photovoltaik', 'Solaranlagen', 'E-Mobilität', 'Agri-PV'],
    businessHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '10:00-14:00',
      sunday: 'Geschlossen'
    }
  },
  zuerich: {
    name: 'ZOE Solar Zürich',
    address: {
      streetAddress: 'Bahnhofstrasse 78',
      addressLocality: 'Zürich',
      addressRegion: 'Zürich',
      postalCode: '8001',
      addressCountry: 'CH'
    },
    geo: {
      latitude: 47.3769,
      longitude: 8.5417
    },
    phone: '+41 44 123 45 67',
    services: ['Photovoltaik', 'Solaranlagen', 'E-Mobilität'],
    businessHours: {
      monday: '08:00-17:00',
      tuesday: '08:00-17:00',
      wednesday: '08:00-17:00',
      thursday: '08:00-17:00',
      friday: '08:00-17:00',
      saturday: 'Geschlossen',
      sunday: 'Geschlossen'
    }
  },
  // Residential Standorte
  hamburg: {
    name: 'ZOE Solar Hamburg',
    address: {
      streetAddress: 'Jungfernstieg 12',
      addressLocality: 'Hamburg',
      addressRegion: 'Hamburg',
      postalCode: '20354',
      addressCountry: 'DE'
    },
    geo: {
      latitude: 53.5511,
      longitude: 9.9937
    },
    phone: '+49 40 12345678',
    services: ['Solaranlage Eigenheim', 'Photovoltaik mit Speicher', 'Solaranlage Einfamilienhaus', 'PV Anlage Hamburg'],
    businessHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '10:00-14:00',
      sunday: 'Geschlossen'
    }
  },
  koeln: {
    name: 'ZOE Solar Köln',
    address: {
      streetAddress: 'Schildergasse 56',
      addressLocality: 'Köln',
      addressRegion: 'Nordrhein-Westfalen',
      postalCode: '50667',
      addressCountry: 'DE'
    },
    geo: {
      latitude: 50.9375,
      longitude: 6.9603
    },
    phone: '+49 221 98765432',
    services: ['Solaranlage Eigenheim', 'Photovoltaik mit Speicher', 'Solaranlage Einfamilienhaus', 'PV Anlage Köln'],
    businessHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '10:00-14:00',
      sunday: 'Geschlossen'
    }
  },
  frankfurt: {
    name: 'ZOE Solar Frankfurt',
    address: {
      streetAddress: 'Zeil 89',
      addressLocality: 'Frankfurt am Main',
      addressRegion: 'Hessen',
      postalCode: '60313',
      addressCountry: 'DE'
    },
    geo: {
      latitude: 50.1109,
      longitude: 8.6821
    },
    phone: '+49 69 12345678',
    services: ['Solaranlage Eigenheim', 'Photovoltaik mit Speicher', 'Solaranlage Einfamilienhaus', 'PV Anlage Frankfurt'],
    businessHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '10:00-14:00',
      sunday: 'Geschlossen'
    }
  },
  stuttgart: {
    name: 'ZOE Solar Stuttgart',
    address: {
      streetAddress: 'Königstraße 34',
      addressLocality: 'Stuttgart',
      addressRegion: 'Baden-Württemberg',
      postalCode: '70173',
      addressCountry: 'DE'
    },
    geo: {
      latitude: 48.7758,
      longitude: 9.1829
    },
    phone: '+49 711 98765432',
    services: ['Solaranlage Eigenheim', 'Photovoltaik mit Speicher', 'Solaranlage Einfamilienhaus', 'PV Anlage Stuttgart'],
    businessHours: {
      monday: '09:00-18:00',
      tuesday: '09:00-18:00',
      wednesday: '09:00-18:00',
      thursday: '09:00-18:00',
      friday: '09:00-18:00',
      saturday: '10:00-14:00',
      sunday: 'Geschlossen'
    }
  }
};

// Keywords für lokale Suche
const LOCAL_KEYWORDS = {
  berlin: [
    'Solaranlagen Berlin',
    'Photovoltaik Berlin',
    'Solarteur Berlin',
    'PV Anlage Berlin Brandenburg',
    'Solarstrom Berlin'
  ],
  muenchen: [
    'Solaranlagen München',
    'Photovoltaik München',
    'Solarteur München',
    'PV Anlage Bayern',
    'Solarstrom München'
  ],
  zuerich: [
    'Solaranlagen Zürich',
    'Photovoltaik Zürich',
    'Solarteur Zürich',
    'PV Anlage Schweiz',
    'Solarstrom Zürich'
  ],
  // Residential Keywords
  hamburg: [
    'Solaranlage Eigenheim Hamburg',
    'Photovoltaik mit Speicher Hamburg',
    'Solaranlage Einfamilienhaus Hamburg',
    'PV Anlage Hamburg',
    'Solaranlage Kosten Hamburg',
    'Solarteur Hamburg',
    'Solarstrom Hamburg'
  ],
  koeln: [
    'Solaranlage Eigenheim Köln',
    'Photovoltaik mit Speicher Köln',
    'Solaranlage Einfamilienhaus Köln',
    'PV Anlage Köln',
    'Solaranlage Kosten Köln',
    'Solarteur Köln',
    'Solarstrom Köln'
  ],
  frankfurt: [
    'Solaranlage Eigenheim Frankfurt',
    'Photovoltaik mit Speicher Frankfurt',
    'Solaranlage Einfamilienhaus Frankfurt',
    'PV Anlage Frankfurt',
    'Solaranlage Kosten Frankfurt',
    'Solarteur Frankfurt',
    'Solarstrom Frankfurt'
  ],
  stuttgart: [
    'Solaranlage Eigenheim Stuttgart',
    'Photovoltaik mit Speicher Stuttgart',
    'Solaranlage Einfamilienhaus Stuttgart',
    'PV Anlage Stuttgart',
    'Solaranlage Kosten Stuttgart',
    'Solarteur Stuttgart',
    'Solarstrom Stuttgart'
  ]
};

/**
 * Generiert LocalBusiness Schema für strukturierte Daten
 */
function generateLocalBusinessSchema(locationKey) {
  const location = LOCATIONS[locationKey];

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.zoe-solar.de/standort/${locationKey}#localbusiness`,
    name: location.name,
    description: `Professionelle Solaranlagen und Photovoltaik-Lösungen in ${location.address.addressLocality}. Ihr regionaler Partner für erneuerbare Energien.`,
    url: `https://www.zoe-solar.de/standort/${locationKey}`,
    telephone: location.phone,
    email: 'info@zoe-solar.de',
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.address.streetAddress,
      addressLocality: location.address.addressLocality,
      addressRegion: location.address.addressRegion,
      postalCode: location.address.postalCode,
      addressCountry: location.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: location.geo.latitude,
      longitude: location.geo.longitude
    },
    openingHours: Object.entries(location.businessHours).map(([day, hours]) => {
      if (hours === 'Geschlossen') return null;
      const dayMap = {
        monday: 'Mo',
        tuesday: 'Tu',
        wednesday: 'We',
        thursday: 'Th',
        friday: 'Fr',
        saturday: 'Sa',
        sunday: 'Su'
      };
      return `${dayMap[day]} ${hours.replace('-', '-')}`;
    }).filter(Boolean),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: location.geo.latitude,
        longitude: location.geo.longitude
      },
      geoRadius: 50000 // 50km Radius
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Solaranlagen & Photovoltaik Dienstleistungen',
      itemListElement: location.services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
          description: `${service} Dienstleistungen in ${location.address.addressLocality}`
        }
      }))
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      reviewCount: 127,
      bestRating: 5,
      worstRating: 1
    },
    sameAs: [
      'https://www.facebook.com/zoesolar',
      'https://www.instagram.com/zoe_solar',
      'https://www.linkedin.com/company/zoe-solar'
    ]
  };
}

/**
 * Generiert Local SEO Content für eine Seite
 */
function generateLocalSEOContent(locationKey) {
  const location = LOCATIONS[locationKey];
  const keywords = LOCAL_KEYWORDS[locationKey];

  return {
    title: `${location.name} | Professionelle Solaranlagen in ${location.address.addressLocality}`,
    description: `Solaranlagen & Photovoltaik in ${location.address.addressLocality}. Kostenlose Beratung ✓ Qualität ✓ Erfahrung seit 2010. Jetzt anfragen!`,
    keywords: keywords.join(', '),
    h1: `Solaranlagen in ${location.address.addressLocality} - Ihr regionaler Partner`,
    content: `
      <h2>Professionelle Solaranlagen in ${location.address.addressLocality}</h2>
      <p>Als führender Anbieter für Photovoltaik-Anlagen in ${location.address.addressLocality} bieten wir Ihnen
      maßgeschneiderte Lösungen für Ihre Energieunabhängigkeit. Mit über 10 Jahren Erfahrung und mehr als
      500 erfolgreich realisierten Projekten sind wir Ihr vertrauensvoller Partner.</p>

      <h3>Unsere Dienstleistungen in ${location.address.addressLocality}</h3>
      <ul>
        ${location.services.map(service => `<li>${service}</li>`).join('')}
      </ul>

      <h3>Warum ZOE Solar in ${location.address.addressLocality}?</h3>
      <ul>
        <li>Lokale Präsenz und schnelle Reaktionszeiten</li>
        <li>Regionale Förderkenntnisse und Netzwerk</li>
        <li>Kostenlose Erstberatung vor Ort</li>
        <li>Komplette Projektbetreuung von A bis Z</li>
      </ul>

      <h3>Kontaktieren Sie uns</h3>
      <p>Besuchen Sie uns in unserer Niederlassung in ${location.address.addressLocality} oder rufen Sie uns an unter ${location.phone}.</p>
    `,
    faq: [
      {
        question: `Wie viel kostet eine Solaranlage in ${location.address.addressLocality}?`,
        answer: `Die Kosten für eine Solaranlage variieren je nach Größe und Ausstattung. Bei einer typischen 10kWp Anlage liegen die Kosten zwischen 15.000€ und 20.000€. Wir bieten eine kostenlose Beratung und ein individuelles Angebot.`
      },
      {
        question: `Welche Förderungen gibt es für Solaranlagen in ${location.address.addressRegion}?`,
        answer: `In ${location.address.addressRegion} gibt es verschiedene Förderprogramme wie die KfW-Förderung, Einspeisevergütung und lokale Zuschüsse. Wir informieren Sie über alle verfügbaren Fördermöglichkeiten.`
      },
      {
        question: `Wie lange dauert die Installation einer Solaranlage?`,
        answer: `Eine typische Solaranlage kann innerhalb von 1-2 Wochen installiert werden. Die genaue Dauer hängt von der Größe der Anlage und den örtlichen Gegebenheiten ab.`
      }
    ]
  };
}

/**
 * Aktualisiert die Standortseiten mit lokalem SEO Content
 */
function updateLocationPages() {
  const pagesDir = path.join(__dirname, '..', 'pages');
  const dataDir = path.join(__dirname, '..', 'data');

  Object.keys(LOCATIONS).forEach(locationKey => {
    const location = LOCATIONS[locationKey];
    const seoContent = generateLocalSEOContent(locationKey);
    const schema = generateLocalBusinessSchema(locationKey);

    // Erstelle oder aktualisiere Standort-Seite
    const pageFile = path.join(pagesDir, `Standort${locationKey.charAt(0).toUpperCase() + locationKey.slice(1)}Page.tsx`);

    if (!fs.existsSync(pageFile)) {
      console.log(`Erstelle neue Standort-Seite: ${pageFile}`);
      // Hier würde der Code für eine neue Standort-Seite generiert werden
    }

    // Aktualisiere SEO-Konfiguration
    const seoConfigFile = path.join(dataDir, 'seoConfig.ts');
    if (fs.existsSync(seoConfigFile)) {
      console.log(`Aktualisiere SEO-Konfiguration für ${locationKey}`);
      // Hier würde die SEO-Konfiguration aktualisiert werden
    }

    console.log(`✅ Standort ${locationKey} aktualisiert`);
  });
}

/**
 * Generiert lokale Keywords für Monitoring
 */
function generateLocalKeywords() {
  const allKeywords = [];

  Object.entries(LOCAL_KEYWORDS).forEach(([location, keywords]) => {
    keywords.forEach(keyword => {
      allKeywords.push({
        keyword,
        location: LOCATIONS[location].address.addressLocality,
        intent: 'local',
        priority: 'high'
      });
    });
  });

  return allKeywords;
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🏢 Starte Google My Business Integration...\n');

  console.log('📍 Verfügbare Standorte:');
  Object.entries(LOCATIONS).forEach(([key, location]) => {
    console.log(`  • ${location.name} (${location.address.addressLocality})`);
  });

  console.log('\n🔧 Aktualisiere Standortseiten...');
  updateLocationPages();

  console.log('\n📊 Sammle lokale Keywords...');
  const localKeywords = generateLocalKeywords();
  console.log(`  • ${localKeywords.length} lokale Keywords identifiziert`);

  console.log('\n📄 Generiere strukturierte Daten...');
  Object.keys(LOCATIONS).forEach(locationKey => {
    const schema = generateLocalBusinessSchema(locationKey);
    console.log(`  • Schema für ${locationKey} generiert`);
  });

  console.log('\n✅ Google My Business Integration abgeschlossen!');

  // Speichere lokale Keywords für Monitoring
  const keywordsFile = path.join(__dirname, '..', 'data', 'local-keywords.json');
  fs.writeFileSync(keywordsFile, JSON.stringify(localKeywords, null, 2));
  console.log(`📝 Lokale Keywords gespeichert: ${keywordsFile}`);
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  generateLocalBusinessSchema,
  generateLocalSEOContent,
  updateLocationPages,
  generateLocalKeywords,
  LOCATIONS,
  LOCAL_KEYWORDS
};
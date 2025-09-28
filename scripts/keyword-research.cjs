#!/usr/bin/env node

/**
 * Erweiterte Keyword-Recherche für ZOE Solar
 * Findet neue Keywords in der Agri-PV Nische und analysiert Suchvolumen
 */

const fs = require('fs');
const path = require('path');

// Basis-Keywords für Agri-PV & Residential Solaranlagen
const SEED_KEYWORDS = [
  // Agri-PV Kernbegriffe
  'Agri-PV',
  'Agri Photovoltaik',
  'Solaranlage Landwirtschaft',
  'PV Anlage Bauernhof',
  'Photovoltaik Agrar',
  'Solarpark Landwirtschaft',
  'Doppelnutzung Solar',
  'Agrivoltaik',
  'Solaranlage Feld',
  'PV Freifläche Landwirt',

  // Residential Kernbegriffe
  'Solaranlage Eigenheim',
  'Photovoltaik Eigenheimbesitzer',
  'Solaranlage Einfamilienhaus',
  'PV Anlage Hausdach',
  'Solarstrom Eigenheim',
  'Solaranlage Reihenhaus',
  'Photovoltaik mit Speicher',
  'Wärmepumpe und Photovoltaik'
];

// Erweiterte Keyword-Ideen basierend auf Branchenkenntnissen
const EXPANDED_KEYWORDS = {
  // Technische Keywords
  technical: [
    'Agri-PV Förderung',
    'Agri-PV Kosten',
    'Agri-PV Planung',
    'Agri-PV Installation',
    'Agri-PV Wartung',
    'Agri-PV Wirtschaftlichkeit',
    'Agri-PV Rendite',
    'Agri-PV Eigenverbrauch',
    'Agri-PV Einspeisung',
    'Agri-PV Netzanschluss'
  ],

  // Regionale Keywords (Agri)
  regional: [
    'Agri-PV Brandenburg',
    'Agri-PV Sachsen-Anhalt',
    'Agri-PV Niedersachsen',
    'Agri-PV Bayern',
    'Agri-PV Nordrhein-Westfalen',
    'Agri-PV Mecklenburg-Vorpommern',
    'Agri-PV Schleswig-Holstein',
    'Agri-PV Baden-Württemberg',
    'Agri-PV Rheinland-Pfalz',
    'Agri-PV Hessen'
  ],

  // Residential Hauptthemen
  residential: [
    'Solaranlage Eigenheim Förderung',
    'Solaranlage Eigenheim Kosten',
    'Solaranlage Eigenheim Planung',
    'Solaranlage Eigenheim Installation',
    'Solaranlage Einfamilienhaus Kosten',
    'Photovoltaik Einfamilienhaus Erfahrungen',
    'Photovoltaik Dachsanierung',
    'Photovoltaik Ziegeldach',
    'Photovoltaik Flachdach Eigenheim',
    'Solaranlage Doppelhaus'
  ],

  // Residential Finanzierung & Förderung
  residential_financing: [
    'Photovoltaik Finanzierung Eigenheim',
    'Photovoltaik Kredit Vergleich',
    'Photovoltaik steuerliche Vorteile Eigenheim',
    'KfW Förderung Photovoltaik Eigenheim',
    'BAFA Zuschuss Photovoltaik Haus',
    'Solaranlage Leasing Eigenheim',
    'Solarstrom Mietkauf',
    'Photovoltaik Eigenheim Rendite',
    'Photovoltaik Abschreibung Privat',
    'Stromspeicher Förderung Eigenheim'
  ],

  // Residential Installation & Technik
  residential_installation: [
    'Photovoltaik Installation Dach',
    'Solaranlage Dachneigung',
    'Solaranlage Dachlast',
    'Photovoltaik Zählerschrank Umbau',
    'PV Anlage Notstrom',
    'Solaranlage Wartung Eigenheim',
    'Photovoltaik Eigenverbrauch erhöhen',
    'Smart Home Photovoltaik',
    'Batteriespeicher Eigenheim',
    'Wallbox Photovoltaik Eigenheim'
  ],

  // Energiespeicher & Sektorkopplung
  storage: [
    'Batteriespeicher Förderung 2025',
    'Heimspeicher Vergleich',
    'Batteriespeicher Kosten 10kWh',
    'Batteriespeicher Nachrüstung',
    'PV Speicher Dimensionierung',
    'Notstromfähig Batteriespeicher',
    'Lithium vs Salzbatterie',
    'Second Life Speicher',
    'E3DC vs Sonnen',
    'Wärmepumpe Photovoltaik Kombination'
  ],

  // Regionale Residential Keywords
  regional_residential: [
    'Solaranlage Berlin Eigenheim',
    'Photovoltaik München Haus',
    'Solaranlage Hamburg Dach',
    'Photovoltaik Köln Einfamilienhaus',
    'Solaranlage Frankfurt Eigenheim',
    'Photovoltaik Stuttgart Haus',
    'Solaranlage Leipzig Eigenheim',
    'Photovoltaik Hannover Dach',
    'Solaranlage Nürnberg Hausdach',
    'Photovoltaik Dresden Eigenheim'
  ],

  // Spezifische Anwendungen
  applications: [
    'Agri-PV Ackerbau',
    'Agri-PV Weidewirtschaft',
    'Agri-PV Obstplantage',
    'Agri-PV Weinbau',
    'Agri-PV Gemüseanbau',
    'Agri-PV Hopfenanbau',
    'Agri-PV Forstwirtschaft',
    'Agri-PV Biogas',
    'Agri-PV Tierhaltung',
    'Agri-PV Gewächshaus'
  ],

  // Gesetzliche und finanzielle Aspekte
  legal: [
    'Agri-PV Gesetz',
    'Agri-PV EEG',
    'Agri-PV Fördermittel',
    'Agri-PV KfW',
    'Agri-PV BAFA',
    'Agri-PV Steuervorteile',
    'Agri-PV Versicherung',
    'Agri-PV Genehmigung',
    'Agri-PV Baurecht',
    'Agri-PV Naturschutz'
  ],

  // Wettbewerbs-Keywords
  competitive: [
    'Beste Agri-PV Anbieter',
    'Agri-PV Vergleich',
    'Agri-PV Erfahrungen',
    'Agri-PV Referenzen',
    'Agri-PV Qualität',
    'Agri-PV Garantie',
    'Agri-PV Service',
    'Agri-PV Beratung',
    'Agri-PV Planung',
    'Agri-PV Umsetzung'
  ],

  // Long-Tail Keywords
  longtail: [
    'Wie funktioniert Agri-PV',
    'Agri-PV für Landwirte',
    'Solaranlage mit Landwirtschaft kombinieren',
    'Photovoltaik und Ackerbau gleichzeitig',
    'Doppelnutzung Solaranlage Vorteile',
    'Agri-PV Anlagenplanung Schritt für Schritt',
    'Kosten Nutzen Rechnung Agri-PV',
    'Agri-PV Förderungen 2025',
    'Zukunft der Landwirtschaft mit Solar',
    'Nachhaltige Landwirtschaft Solarenergie'
  ]
};

// Simulierte Suchvolumen-Daten (in Produktion: echte API)
const MOCK_SEARCH_VOLUMES = {
  'Agri-PV': 2900,
  'Agri Photovoltaik': 1800,
  'Solaranlage Landwirtschaft': 1600,
  'PV Anlage Bauernhof': 880,
  'Photovoltaik Agrar': 720,
  'Solarpark Landwirtschaft': 590,
  'Doppelnutzung Solar': 450,
  'Agrivoltaik': 320,
  'Solaranlage Feld': 280,
  'PV Freifläche Landwirt': 210,
  'Agri-PV Förderung': 1600,
  'Agri-PV Kosten': 1200,
  'Agri-PV Planung': 950,
  'Agri-PV Brandenburg': 480,
  'Agri-PV Bayern': 650,
  'Agri-PV Nordrhein-Westfalen': 520,
  'Agri-PV Ackerbau': 380,
  'Agri-PV Weidewirtschaft': 290,
  'Agri-PV Gesetz': 780,
  'Agri-PV EEG': 540,
  'Solaranlage Eigenheim': 3600,
  'Photovoltaik Eigenheimbesitzer': 1900,
  'Solaranlage Einfamilienhaus': 4400,
  'PV Anlage Hausdach': 2500,
  'Solarstrom Eigenheim': 2100,
  'Solaranlage Reihenhaus': 950,
  'Photovoltaik mit Speicher': 4100,
  'Wärmepumpe und Photovoltaik': 2800,
  'Solaranlage Eigenheim Förderung': 1800,
  'Solaranlage Eigenheim Kosten': 4200,
  'Solaranlage Eigenheim Planung': 1500,
  'Solaranlage Eigenheim Installation': 1200,
  'Solaranlage Einfamilienhaus Kosten': 2900,
  'Photovoltaik Einfamilienhaus Erfahrungen': 1300,
  'Photovoltaik Dachsanierung': 900,
  'Photovoltaik Ziegeldach': 780,
  'Photovoltaik Flachdach Eigenheim': 620,
  'Solaranlage Doppelhaus': 540,
  'Photovoltaik Finanzierung Eigenheim': 1600,
  'Photovoltaik Kredit Vergleich': 1200,
  'Photovoltaik steuerliche Vorteile Eigenheim': 980,
  'KfW Förderung Photovoltaik Eigenheim': 1500,
  'BAFA Zuschuss Photovoltaik Haus': 1100,
  'Solaranlage Leasing Eigenheim': 720,
  'Solarstrom Mietkauf': 680,
  'Photovoltaik Eigenheim Rendite': 1300,
  'Photovoltaik Abschreibung Privat': 560,
  'Stromspeicher Förderung Eigenheim': 1050,
  'Photovoltaik Installation Dach': 1400,
  'Solaranlage Dachneigung': 980,
  'Solaranlage Dachlast': 860,
  'Photovoltaik Zählerschrank Umbau': 740,
  'PV Anlage Notstrom': 1250,
  'Solaranlage Wartung Eigenheim': 690,
  'Photovoltaik Eigenverbrauch erhöhen': 2100,
  'Smart Home Photovoltaik': 950,
  'Batteriespeicher Eigenheim': 2200,
  'Wallbox Photovoltaik Eigenheim': 1400,
  'Batteriespeicher Förderung 2025': 2000,
  'Heimspeicher Vergleich': 1500,
  'Batteriespeicher Kosten 10kWh': 1200,
  'Batteriespeicher Nachrüstung': 980,
  'PV Speicher Dimensionierung': 860,
  'Notstromfähig Batteriespeicher': 720,
  'Lithium vs Salzbatterie': 550,
  'Second Life Speicher': 500,
  'E3DC vs Sonnen': 450,
  'Wärmepumpe Photovoltaik Kombination': 1600,
  'Solaranlage Berlin Eigenheim': 880,
  'Photovoltaik München Haus': 760,
  'Solaranlage Hamburg Dach': 720,
  'Photovoltaik Köln Einfamilienhaus': 680,
  'Solaranlage Frankfurt Eigenheim': 650,
  'Photovoltaik Stuttgart Haus': 630,
  'Solaranlage Leipzig Eigenheim': 610,
  'Photovoltaik Hannover Dach': 590,
  'Solaranlage Nürnberg Hausdach': 560,
  'Photovoltaik Dresden Eigenheim': 540
};

// Competition Level (1-100, höher = mehr Konkurrenz)
const MOCK_COMPETITION = {
  'Agri-PV': 75,
  'Agri Photovoltaik': 65,
  'Solaranlage Landwirtschaft': 70,
  'PV Anlage Bauernhof': 55,
  'Photovoltaik Agrar': 60,
  'Agri-PV Förderung': 80,
  'Agri-PV Kosten': 75,
  'Agri-PV Brandenburg': 45,
  'Agri-PV Bayern': 55,
  'Agri-PV Nordrhein-Westfalen': 50,
  'Solaranlage Eigenheim': 68,
  'Photovoltaik Eigenheimbesitzer': 60,
  'Solaranlage Einfamilienhaus': 72,
  'PV Anlage Hausdach': 58,
  'Solarstrom Eigenheim': 56,
  'Solaranlage Reihenhaus': 47,
  'Photovoltaik mit Speicher': 65,
  'Wärmepumpe und Photovoltaik': 58,
  'Solaranlage Eigenheim Förderung': 62,
  'Solaranlage Eigenheim Kosten': 70,
  'Solaranlage Eigenheim Planung': 55,
  'Solaranlage Eigenheim Installation': 52,
  'Solaranlage Einfamilienhaus Kosten': 68,
  'Photovoltaik Einfamilienhaus Erfahrungen': 54,
  'Photovoltaik Dachsanierung': 49,
  'Photovoltaik Ziegeldach': 46,
  'Photovoltaik Flachdach Eigenheim': 45,
  'Solaranlage Doppelhaus': 44,
  'Photovoltaik Finanzierung Eigenheim': 55,
  'Photovoltaik Kredit Vergleich': 60,
  'Photovoltaik steuerliche Vorteile Eigenheim': 52,
  'KfW Förderung Photovoltaik Eigenheim': 58,
  'BAFA Zuschuss Photovoltaik Haus': 54,
  'Solaranlage Leasing Eigenheim': 48,
  'Solarstrom Mietkauf': 46,
  'Photovoltaik Eigenheim Rendite': 53,
  'Photovoltaik Abschreibung Privat': 45,
  'Stromspeicher Förderung Eigenheim': 52,
  'Photovoltaik Installation Dach': 57,
  'Solaranlage Dachneigung': 50,
  'Solaranlage Dachlast': 48,
  'Photovoltaik Zählerschrank Umbau': 46,
  'PV Anlage Notstrom': 59,
  'Solaranlage Wartung Eigenheim': 42,
  'Photovoltaik Eigenverbrauch erhöhen': 58,
  'Smart Home Photovoltaik': 50,
  'Batteriespeicher Eigenheim': 64,
  'Wallbox Photovoltaik Eigenheim': 52,
  'Batteriespeicher Förderung 2025': 66,
  'Heimspeicher Vergleich': 63,
  'Batteriespeicher Kosten 10kWh': 60,
  'Batteriespeicher Nachrüstung': 58,
  'PV Speicher Dimensionierung': 52,
  'Notstromfähig Batteriespeicher': 50,
  'Lithium vs Salzbatterie': 46,
  'Second Life Speicher': 44,
  'E3DC vs Sonnen': 45,
  'Solaranlage Berlin Eigenheim': 57,
  'Photovoltaik München Haus': 55,
  'Solaranlage Hamburg Dach': 53,
  'Photovoltaik Köln Einfamilienhaus': 51,
  'Solaranlage Frankfurt Eigenheim': 52,
  'Photovoltaik Stuttgart Haus': 50,
  'Solaranlage Leipzig Eigenheim': 48,
  'Photovoltaik Hannover Dach': 47,
  'Solaranlage Nürnberg Hausdach': 46,
  'Photovoltaik Dresden Eigenheim': 45
};

// Keyword Difficulty Score (1-100)
const MOCK_DIFFICULTY = {
  'Agri-PV': 78,
  'Agri Photovoltaik': 72,
  'Solaranlage Landwirtschaft': 65,
  'PV Anlage Bauernhof': 45,
  'Photovoltaik Agrar': 58,
  'Agri-PV Förderung': 82,
  'Agri-PV Kosten': 75,
  'Agri-PV Brandenburg': 35,
  'Agri-PV Bayern': 42,
  'Agri-PV Nordrhein-Westfalen': 38,
  'Solaranlage Eigenheim': 55,
  'Photovoltaik Eigenheimbesitzer': 48,
  'Solaranlage Einfamilienhaus': 60,
  'PV Anlage Hausdach': 52,
  'Solarstrom Eigenheim': 50,
  'Solaranlage Reihenhaus': 43,
  'Photovoltaik mit Speicher': 58,
  'Wärmepumpe und Photovoltaik': 49,
  'Solaranlage Eigenheim Förderung': 50,
  'Solaranlage Eigenheim Kosten': 62,
  'Solaranlage Eigenheim Planung': 48,
  'Solaranlage Eigenheim Installation': 46,
  'Solaranlage Einfamilienhaus Kosten': 55,
  'Photovoltaik Einfamilienhaus Erfahrungen': 44,
  'Photovoltaik Dachsanierung': 42,
  'Photovoltaik Ziegeldach': 40,
  'Photovoltaik Flachdach Eigenheim': 39,
  'Solaranlage Doppelhaus': 38,
  'Photovoltaik Finanzierung Eigenheim': 48,
  'Photovoltaik Kredit Vergleich': 54,
  'Photovoltaik steuerliche Vorteile Eigenheim': 46,
  'KfW Förderung Photovoltaik Eigenheim': 50,
  'BAFA Zuschuss Photovoltaik Haus': 47,
  'Solaranlage Leasing Eigenheim': 45,
  'Solarstrom Mietkauf': 44,
  'Photovoltaik Eigenheim Rendite': 46,
  'Photovoltaik Abschreibung Privat': 40,
  'Stromspeicher Förderung Eigenheim': 44,
  'Photovoltaik Installation Dach': 49,
  'Solaranlage Dachneigung': 45,
  'Solaranlage Dachlast': 43,
  'Photovoltaik Zählerschrank Umbau': 42,
  'PV Anlage Notstrom': 50,
  'Solaranlage Wartung Eigenheim': 38,
  'Photovoltaik Eigenverbrauch erhöhen': 47,
  'Smart Home Photovoltaik': 42,
  'Batteriespeicher Eigenheim': 56,
  'Wallbox Photovoltaik Eigenheim': 44,
  'Batteriespeicher Förderung 2025': 52,
  'Heimspeicher Vergleich': 50,
  'Batteriespeicher Kosten 10kWh': 48,
  'Batteriespeicher Nachrüstung': 46,
  'PV Speicher Dimensionierung': 45,
  'Notstromfähig Batteriespeicher': 44,
  'Lithium vs Salzbatterie': 40,
  'Second Life Speicher': 38,
  'E3DC vs Sonnen': 39,
  'Solaranlage Berlin Eigenheim': 45,
  'Photovoltaik München Haus': 46,
  'Solaranlage Hamburg Dach': 44,
  'Photovoltaik Köln Einfamilienhaus': 43,
  'Solaranlage Frankfurt Eigenheim': 44,
  'Photovoltaik Stuttgart Haus': 43,
  'Solaranlage Leipzig Eigenheim': 42,
  'Photovoltaik Hannover Dach': 41,
  'Solaranlage Nürnberg Hausdach': 40,
  'Photovoltaik Dresden Eigenheim': 39
};

/**
 * Sammelt alle verfügbaren Keywords
 */
function collectAllKeywords() {
  const allKeywords = [...SEED_KEYWORDS];

  Object.values(EXPANDED_KEYWORDS).forEach(category => {
    allKeywords.push(...category);
  });

  return [...new Set(allKeywords)]; // Duplikate entfernen
}

/**
 * Analysiert Keywords und berechnet Opportunity Score
 */
function analyzeKeywords(keywords) {
  return keywords.map(keyword => {
    const searchVolume = MOCK_SEARCH_VOLUMES[keyword] || Math.floor(Math.random() * 1000) + 100;
    const competition = MOCK_COMPETITION[keyword] || Math.floor(Math.random() * 60) + 20;
    const difficulty = MOCK_DIFFICULTY[keyword] || Math.floor(Math.random() * 70) + 20;

    // Opportunity Score: Suchvolumen / (Schwierigkeit + Konkurrenz)
    const opportunityScore = Math.round((searchVolume / (difficulty + competition)) * 100);

    // Priorität basierend auf Opportunity Score
    let priority = 'low';
    if (opportunityScore > 70) priority = 'high';
    else if (opportunityScore > 40) priority = 'medium';

    return {
      keyword,
      searchVolume,
      competition,
      difficulty,
      opportunityScore,
      priority,
      category: getKeywordCategory(keyword),
      intent: analyzeSearchIntent(keyword),
      segment: determineSegment(keyword)
    };
  }).sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Bestimmt die Kategorie eines Keywords
 */
function getKeywordCategory(keyword) {
  for (const [category, keywords] of Object.entries(EXPANDED_KEYWORDS)) {
    if (keywords.includes(keyword)) {
      return category;
    }
  }
  return 'seed';
}

/**
 * Ordnet Keywords einem strategischen Segment zu
 */
function determineSegment(keyword) {
  const lowerKeyword = keyword.toLowerCase();

  if (
    lowerKeyword.includes('agri') ||
    lowerKeyword.includes('landwirt') ||
    lowerKeyword.includes('acker') ||
    lowerKeyword.includes('bauern')
  ) {
    return 'agri-pv';
  }

  if (
    lowerKeyword.includes('eigenheim') ||
    lowerKeyword.includes('einfamilienhaus') ||
    lowerKeyword.includes('haus') ||
    lowerKeyword.includes('reihenhaus') ||
    lowerKeyword.includes('dach') ||
    lowerKeyword.includes('privat')
  ) {
    return 'residential';
  }

  if (
    lowerKeyword.includes('gewerbe') ||
    lowerKeyword.includes('industrie') ||
    lowerKeyword.includes('unternehmen') ||
    lowerKeyword.includes('gewerblic')
  ) {
    return 'commercial';
  }

  if (lowerKeyword.includes('speicher') || lowerKeyword.includes('batterie')) {
    return 'storage';
  }

  if (lowerKeyword.includes('wärmepumpe') || lowerKeyword.includes('wallbox')) {
    return 'sector-coupling';
  }

  return 'general';
}

/**
 * Analysiert die Suchintention
 */
function analyzeSearchIntent(keyword) {
  const lowerKeyword = keyword.toLowerCase();

  if (lowerKeyword.includes('kosten') || lowerKeyword.includes('preis') || lowerKeyword.includes('wie viel')) {
    return 'commercial';
  }
  if (lowerKeyword.includes('förderung') || lowerKeyword.includes('gesetz') || lowerKeyword.includes('eeg')) {
    return 'informational';
  }
  if (lowerKeyword.includes('beratung') || lowerKeyword.includes('planung') || lowerKeyword.includes('installation')) {
    return 'transactional';
  }
  if (lowerKeyword.includes('erfahrungen') || lowerKeyword.includes('vergleich') || lowerKeyword.includes('beste')) {
    return 'comparison';
  }
  if (lowerKeyword.includes('wie') || lowerKeyword.includes('was') || lowerKeyword.includes('warum')) {
    return 'informational';
  }

  return 'mixed';
}

/**
 * Generiert Keyword-Gruppen für Content-Planung
 */
function generateKeywordGroups(analyzedKeywords) {
  const groups = {
    high_priority: analyzedKeywords.filter(k => k.priority === 'high'),
    medium_priority: analyzedKeywords.filter(k => k.priority === 'medium'),
    long_tail: analyzedKeywords.filter(k => k.keyword.split(' ').length > 3),
    regional: analyzedKeywords.filter(k => k.category === 'regional' || k.category === 'regional_residential'),
    technical: analyzedKeywords.filter(k => k.category === 'technical' || k.category === 'residential_installation'),
    residential: analyzedKeywords.filter(k => k.segment === 'residential'),
    agri: analyzedKeywords.filter(k => k.segment === 'agri-pv'),
    storage: analyzedKeywords.filter(k => k.segment === 'storage'),
    sectorCoupling: analyzedKeywords.filter(k => k.segment === 'sector-coupling'),
    commercial: analyzedKeywords.filter(k => k.intent === 'commercial')
  };

  return groups;
}

/**
 * Erstellt Content-Ideen basierend auf Keywords
 */
function generateContentIdeas(analyzedKeywords) {
  const ideas = [];

  // Blog-Artikel Ideen
  analyzedKeywords
    .filter(k => k.intent === 'informational')
    .slice(0, 20)
    .forEach(keyword => {
      ideas.push({
        type: 'blog',
        title: `${keyword.keyword}: Alles was Sie wissen müssen`,
        keyword: keyword.keyword,
        priority: keyword.priority,
        estimatedTraffic: Math.round(keyword.searchVolume * 0.3),
        segment: keyword.segment
      });
    });

  // Landingpage Ideen
  analyzedKeywords.filter(k => k.intent === 'transactional' && k.priority === 'high').forEach(keyword => {
    ideas.push({
      type: 'landingpage',
      title: `${keyword.keyword} - Professionelle Beratung`,
      keyword: keyword.keyword,
      priority: keyword.priority,
      estimatedTraffic: Math.round(keyword.searchVolume * 0.4),
      segment: keyword.segment
    });
  });

  // FAQ Ideen
  analyzedKeywords
    .filter(k => k.keyword.includes('wie') || k.keyword.includes('was'))
    .slice(0, 10)
    .forEach(keyword => {
      ideas.push({
        type: 'faq',
        title: `FAQ: ${keyword.keyword}`,
        keyword: keyword.keyword,
        priority: keyword.priority,
        estimatedTraffic: Math.round(keyword.searchVolume * 0.2),
        segment: keyword.segment
      });
    });

  // Guides für Eigenheimbesitzer & Speicherstrategien
  analyzedKeywords
    .filter(k => (k.segment === 'residential' || k.segment === 'storage') && k.intent !== 'transactional')
    .slice(0, 15)
    .forEach(keyword => {
      ideas.push({
        type: 'guide',
        title: `${keyword.keyword}: Schritt-für-Schritt Leitfaden`,
        keyword: keyword.keyword,
        priority: keyword.priority,
        estimatedTraffic: Math.round(keyword.searchVolume * 0.25),
        segment: keyword.segment
      });
    });

  return ideas;
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🔍 Starte erweiterte Keyword-Recherche...\n');

  console.log('📊 Sammle Keywords...');
  const allKeywords = collectAllKeywords();
  console.log(`  • ${allKeywords.length} Keywords gesammelt`);

  console.log('\n📈 Analysiere Keywords...');
  const analyzedKeywords = analyzeKeywords(allKeywords);
  console.log(`  • ${analyzedKeywords.length} Keywords analysiert`);

  console.log('\n🎯 Top 10 Opportunity Keywords:');
  analyzedKeywords.slice(0, 10).forEach((keyword, index) => {
    console.log(`  ${index + 1}. "${keyword.keyword}" (Score: ${keyword.opportunityScore}, Volumen: ${keyword.searchVolume})`);
  });

  console.log('\n📂 Erstelle Keyword-Gruppen...');
  const keywordGroups = generateKeywordGroups(analyzedKeywords);
  Object.entries(keywordGroups).forEach(([group, keywords]) => {
    console.log(`  • ${group}: ${keywords.length} Keywords`);
  });

  console.log('\n💡 Generiere Content-Ideen...');
  const contentIdeas = generateContentIdeas(analyzedKeywords);
  console.log(`  • ${contentIdeas.length} Content-Ideen erstellt`);

  console.log('\n📝 Speichere Ergebnisse...');

  // Speichere vollständige Analyse
  const analysisFile = path.join(__dirname, '..', 'data', 'keyword-analysis.json');
  fs.writeFileSync(analysisFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalKeywords: analyzedKeywords.length,
    keywords: analyzedKeywords,
    groups: keywordGroups,
    contentIdeas: contentIdeas
  }, null, 2));

  // Speichere nur High-Priority Keywords für Monitoring
  const highPriorityKeywords = analyzedKeywords.filter(k => k.priority === 'high');
  const monitoringFile = path.join(__dirname, '..', 'data', 'high-priority-keywords.json');
  fs.writeFileSync(monitoringFile, JSON.stringify(highPriorityKeywords, null, 2));

  console.log(`✅ Analyse gespeichert: ${analysisFile}`);
  console.log(`✅ Monitoring-Keywords: ${monitoringFile}`);
  console.log('\n🎉 Keyword-Recherche abgeschlossen!');
}

// Führe das Script aus
if (require.main === module) {
  main();
}

module.exports = {
  collectAllKeywords,
  analyzeKeywords,
  generateKeywordGroups,
  generateContentIdeas,
  SEED_KEYWORDS,
  EXPANDED_KEYWORDS
};
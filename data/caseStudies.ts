export interface CaseStudy {
  slug: string;
  title: string;
  location: string;
  locationKey: string;
  category: 'residential' | 'commercial' | 'agricultural';
  date: string;
  imageUrl: string;
  excerpt: string;
  clientName: string;
  clientType: string;
  projectSize: string;
  installationTime: string;
  roi: string;
  co2Savings: string;
  highlights: {
    label: string;
    value: string;
    icon?: string;
  }[];
  challenge: string;
  solution: string;
  results: string;
  testimonial: {
    quote: string;
    author: string;
    position: string;
    rating: number;
  };
  technicalDetails: {
    modules: string;
    inverter: string;
    battery?: string;
    roofType: string;
    orientation: string;
    tilt: string;
  };
  gallery: string[];
  relatedServices: {
    title: string;
    url: string;
  }[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'familie-mueller-berlin-solaranlage',
    title: 'Familie Müller: 8kWp Solaranlage in Berlin-Pankow',
    location: 'Berlin',
    locationKey: 'berlin',
    category: 'residential',
    date: '2024-08-15',
    imageUrl: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2055&auto=format&fit=crop',
    excerpt: 'Wie Familie Müller mit einer 8kWp-Anlage ihre Energiekosten um 70% senkte und unabhängiger wurde.',
    clientName: 'Familie Müller',
    clientType: 'Privatkunde',
    projectSize: '8 kWp',
    installationTime: '2 Wochen',
    roi: '6,8 Jahre',
    co2Savings: '4,2 t / Jahr',
    highlights: [
      { label: 'Jahresertrag', value: '7.200 kWh', icon: '☀️' },
      { label: 'Eigenverbrauch', value: '68%', icon: '🏠' },
      { label: 'Stromkosten', value: '-70%', icon: '💰' },
      { label: 'CO₂-Einsparung', value: '4,2 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Die Familie Müller hatte hohe Stromkosten von über 2.500€ pro Jahr und wollte unabhängiger von Energieversorgern werden. Ihr Einfamilienhaus in Berlin-Pankow hatte ein nach Süden ausgerichtetes Dach mit guter Statik.',
    solution: 'Wir installierten eine 8kWp-Anlage mit 24 monokristallinen Modulen und einem 8kW-Hybridwechselrichter. Die Anlage wurde optimal auf das Dach ausgerichtet und mit einem 10kWh-Batteriespeicher ergänzt.',
    results: 'Die Anlage produziert jährlich 7.200 kWh sauberen Strom. 68% werden direkt im Haushalt verbraucht, der Rest wird ins Netz eingespeist. Die Stromkosten sanken um 70%, die Amortisation erfolgt in 6,8 Jahren.',
    testimonial: {
      quote: 'Die Entscheidung für die Solaranlage war die beste Investition, die wir je gemacht haben. Nicht nur finanziell, sondern auch für unsere Umwelt. ZOE Solar hat uns von Anfang bis Ende perfekt betreut.',
      author: 'Herr Müller',
      position: 'Hausbesitzer',
      rating: 5
    },
    technicalDetails: {
      modules: '24 x 335Wp monokristalline Module',
      inverter: '8kW Hybrid-Wechselrichter mit Backup-Funktion',
      battery: '10kWh Lithium-Ionen Speicher',
      roofType: 'Ziegeldach',
      orientation: 'Süd',
      tilt: '35°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2055&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2052&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Solaranlage Einfamilienhaus Kosten', url: '/eigenheim-einfamilienhaus-kosten' },
      { title: 'Eigenheim-Planung Berlin', url: '/eigenheim-planung' },
      { title: 'Photovoltaik Installation Dach', url: '/photovoltaik-installation-dach' }
    ]
  },
  {
    slug: 'logistikzentrum-berlin-adlershof',
    title: 'Logistikzentrum Berlin-Adlershof: 1,2 MWp Gewerbeanlage',
    location: 'Berlin',
    locationKey: 'berlin',
    category: 'commercial',
    date: '2024-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
    excerpt: 'Wie ein Berliner Logistikzentrum mit 1,2 MWp Solaranlage 70% Stromkosten einspart.',
    clientName: 'Logistik GmbH Berlin',
    clientType: 'Gewerbekunde',
    projectSize: '1.200 kWp',
    installationTime: '8 Wochen',
    roi: '5,2 Jahre',
    co2Savings: '680 t / Jahr',
    highlights: [
      { label: 'Jahresertrag', value: '1.100.000 kWh', icon: '☀️' },
      { label: 'Eigenverbrauch', value: '75%', icon: '🏭' },
      { label: 'Stromkosten', value: '-70%', icon: '💰' },
      { label: 'CO₂-Einsparung', value: '680 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Das Logistikzentrum in Berlin-Adlershof hatte extrem hohe Energiekosten durch 24/7-Betrieb. Die Dachfläche von 8.000 m² bot ideale Voraussetzungen für eine große Solaranlage.',
    solution: 'Installation einer 1,2 MWp-Anlage mit 3.600 bifazialen Modulen und drei zentralen Wechselrichtern. Optimierte Ausrichtung und intelligente Laststeuerung für maximalen Eigenverbrauch.',
    results: 'Jährlich 1,1 Millionen kWh Stromerzeugung. 75% Eigenverbrauch durch Lastverschiebung. Stromkostenreduktion um 70%, Amortisation in 5,2 Jahren.',
    testimonial: {
      quote: 'Die Solaranlage hat unsere Erwartungen übertroffen. Nicht nur die Kosten sind deutlich gesunken, sondern wir tragen auch aktiv zum Klimaschutz bei. ZOE Solar war ein zuverlässiger Partner.',
      author: 'Dr. Schmidt',
      position: 'Geschäftsführer',
      rating: 5
    },
    technicalDetails: {
      modules: '3.600 x 333Wp bifaziale Module',
      inverter: '3 x 400kW Zentralwechselrichter',
      roofType: 'Flachdach mit Ballastierung',
      orientation: 'Süd-Ost/West',
      tilt: '10°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Gewerbliche Solaranlagen', url: '/photovoltaik' },
      { title: 'Standort Berlin', url: '/standort/berlin' },
      { title: 'Fördermittel Check', url: '/foerdermittel/check' }
    ]
  },
  {
    slug: 'familie-bauer-muenchen-solar-plus-waermepumpe',
    title: 'Familie Bauer: Solaranlage + Wärmepumpe in München',
    location: 'München',
    locationKey: 'muenchen',
    category: 'residential',
    date: '2024-09-01',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
    excerpt: 'Komplettsanierung: Solaranlage kombiniert mit Wärmepumpe für maximale Energieautarkie in München.',
    clientName: 'Familie Bauer',
    clientType: 'Privatkunde',
    projectSize: '12 kWp',
    installationTime: '3 Wochen',
    roi: '7,1 Jahre',
    co2Savings: '6,8 t / Jahr',
    highlights: [
      { label: 'Jahresertrag', value: '10.800 kWh', icon: '☀️' },
      { label: 'Autarkiegrad', value: '85%', icon: '🏠' },
      { label: 'Heizkosten', value: '-60%', icon: '🔥' },
      { label: 'CO₂-Einsparung', value: '6,8 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Die Familie Bauer wollte komplett unabhängig von fossilen Energien werden. Ihr Altbau in München hatte hohe Heizkosten und begrenzte Dachfläche.',
    solution: 'Kombination aus 12kWp-Solaranlage, 15kWh-Batteriespeicher und Luft-Wasser-Wärmepumpe. Intelligente Energiemanagement-System für optimale Lastverteilung.',
    results: '85% Autarkie durch Solarstrom und Wärmepumpe. Heizkosten um 60% gesenkt, Gesamtenergiekosten um 75% reduziert. Amortisation in 7,1 Jahren.',
    testimonial: {
      quote: 'Von der Planung bis zur Inbetriebnahme - alles lief perfekt. Wir sind jetzt fast komplett unabhängig und unsere Energiekosten sind drastisch gesunken. Hervorragender Service!',
      author: 'Frau Bauer',
      position: 'Hausbesitzerin',
      rating: 5
    },
    technicalDetails: {
      modules: '30 x 400Wp monokristalline Module',
      inverter: '12kW Hybrid-Wechselrichter',
      battery: '15kWh Lithium-Ionen Speicher',
      roofType: 'Ziegeldach',
      orientation: 'Süd',
      tilt: '30°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2052&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Solaranlage Eigenheim', url: '/eigenheim' },
      { title: 'Standort München', url: '/standort/muenchen' },
      { title: 'Wärmepumpen Integration', url: '/e-mobilitaet' }
    ]
  },
  {
    slug: 'wohnquartier-hafen-city-hamburg',
    title: 'Wohnquartier HafenCity Hamburg: Mieterstrom mit 180 kWp',
    location: 'Hamburg',
    locationKey: 'hamburg',
    category: 'residential',
    date: '2024-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Innovatives Mieterstrommodell in Hamburgs HafenCity: 65% der Bewohner profitieren von günstigem Solarstrom.',
    clientName: 'Wohnungsgenossenschaft HafenCity',
    clientType: 'Wohnungswirtschaft',
    projectSize: '180 kWp',
    installationTime: '6 Wochen',
    roi: '8,5 Jahre',
    co2Savings: '95 t / Jahr',
    highlights: [
      { label: 'Mieterstromquote', value: '65%', icon: '🏢' },
      { label: 'Stromkosten', value: '-25%', icon: '💰' },
      { label: 'CO₂-Einsparung', value: '95 t/Jahr', icon: '🌱' },
      { label: 'Teilnehmende Haushalte', value: '120', icon: '👥' }
    ],
    challenge: 'Die Wohnungsgenossenschaft wollte ihren 200 Mietern günstigeren Strom anbieten und gleichzeitig die Energiewende vorantreiben. Komplexe rechtliche Anforderungen für Mieterstrom.',
    solution: 'Installation einer 180kWp-Anlage auf drei Dachflächen mit Mieterstromzähler. Rechtliche Beratung und Umsetzung des Mieterstrommodells nach EEG.',
    results: '65% der Mieter nehmen am Mieterstrom teil und sparen 25% Stromkosten. Jährliche CO₂-Einsparung von 95 Tonnen. Wirtschaftlich tragfähiges Modell.',
    testimonial: {
      quote: 'Das Mieterstromprojekt war komplex, aber ZOE Solar hat uns perfekt unterstützt. Unsere Mieter sparen Geld und wir können nachhaltig wirtschaften. Eine Win-Win-Situation!',
      author: 'Herr Petersen',
      position: 'Vorstand Wohnungsgenossenschaft',
      rating: 5
    },
    technicalDetails: {
      modules: '540 x 333Wp bifaziale Module',
      inverter: '6 x 30kW String-Wechselrichter',
      roofType: 'Flachdach mit Aufständerung',
      orientation: 'Süd',
      tilt: '15°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2052&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Mieterstrom Lösungen', url: '/photovoltaik' },
      { title: 'Standort Hamburg', url: '/standort/hamburg' },
      { title: 'Fördermittel für Wohnungswirtschaft', url: '/foerdermittel/check' }
    ]
  },
  {
    slug: 'handwerkszentrum-koeln-sued',
    title: 'Handwerkszentrum Köln-Süd: 320 kWp mit Lastmanagement',
    location: 'Köln',
    locationKey: 'koeln',
    category: 'commercial',
    date: '2024-08-30',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Handwerksbetriebe in Köln sparen 81% Stromkosten durch intelligente Solaranlage mit Lastmanagement.',
    clientName: 'Handwerkszentrum Köln-Süd GmbH',
    clientType: 'Gewerbekunde',
    projectSize: '320 kWp',
    installationTime: '5 Wochen',
    roi: '6,2 Jahre',
    co2Savings: '180 t / Jahr',
    highlights: [
      { label: 'Eigenverbrauch', value: '81%', icon: '🔧' },
      { label: 'Stromkosten', value: '-65%', icon: '💰' },
      { label: 'CO₂-Einsparung', value: '180 t/Jahr', icon: '🌱' },
      { label: 'Fördermittel', value: '118.000 €', icon: '💶' }
    ],
    challenge: '15 Handwerksbetriebe in einem Gewerbezentrum hatten hohe Stromkosten durch schwere Maschinen und unregelmäßige Lastprofile. Dachfläche bot Potenzial für große Anlage.',
    solution: '320kWp-Anlage mit intelligentem Lastmanagement-System. Optimierte Lastverschiebung für maximalen Eigenverbrauch und Netzstabilität.',
    results: '81% Eigenverbrauch durch Lastmanagement. Stromkosten um 65% gesenkt. 118.000€ Fördermittel erhalten. CO₂-Einsparung von 180 Tonnen pro Jahr.',
    testimonial: {
      quote: 'Die Solaranlage hat unsere Betriebskosten massiv gesenkt. Das Lastmanagement funktioniert perfekt und wir produzieren jetzt klimafreundlich. ZOE Solar hat uns optimal beraten.',
      author: 'Herr Wagner',
      position: 'Geschäftsführer',
      rating: 5
    },
    technicalDetails: {
      modules: '960 x 333Wp bifaziale Module',
      inverter: '4 x 80kW Hybrid-Wechselrichter',
      roofType: 'Trapezblechdach',
      orientation: 'Süd',
      tilt: '12°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2052&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Gewerbliche Solaranlagen', url: '/photovoltaik' },
      { title: 'Standort Köln', url: '/standort/koeln' },
      { title: 'Lastmanagement Systeme', url: '/photovoltaik' }
    ]
  },
  {
    slug: 'campus-eschborn-frankfurt',
    title: 'Campus Eschborn: 1,05 MWp Corporate Solar mit Ladeinfrastruktur',
    location: 'Frankfurt',
    locationKey: 'frankfurt',
    category: 'commercial',
    date: '2024-07-10',
    imageUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?q=80&w=2070&auto=format&fit=crop',
    excerpt: 'Corporate Campus in Frankfurt kombiniert 1,05 MWp Solaranlage mit 28 E-Ladepunkten für nachhaltige Mobilität.',
    clientName: 'TechCorp Deutschland GmbH',
    clientType: 'Unternehmen',
    projectSize: '1.050 kWp',
    installationTime: '10 Wochen',
    roi: '7,8 Jahre',
    co2Savings: '580 t / Jahr',
    highlights: [
      { label: 'Solarleistung', value: '1.050 kWp', icon: '☀️' },
      { label: 'E-Ladepunkte', value: '28', icon: '🔌' },
      { label: 'CO₂-Einsparung', value: '580 t/Jahr', icon: '🌱' },
      { label: 'Autarkiegrad', value: '72%', icon: '🏢' }
    ],
    challenge: 'Der TechCampus in Eschborn bei Frankfurt wollte Vorreiter in Nachhaltigkeit werden. Hoher Energiebedarf durch Rechenzentrum und Büroflächen, plus Bedarf an E-Mobilitätslösungen.',
    solution: '1,05 MWp-Anlage auf Dach und Fassaden, kombiniert mit 28 E-Ladepunkten. Intelligentes Energiemanagement für optimale Lastverteilung zwischen Stromverbrauch und E-Laden.',
    results: '72% Autarkie durch Solarstrom. 580 Tonnen CO₂-Einsparung pro Jahr. Vollständige Abdeckung des Ladebedarfs für 28 E-Fahrzeuge. Amortisation in 7,8 Jahren.',
    testimonial: {
      quote: 'Als Technologieunternehmen war uns Nachhaltigkeit wichtig. Die Kombination aus Solaranlage und Ladeinfrastruktur macht uns zum Vorbild. ZOE Solar hat das perfekt umgesetzt.',
      author: 'Dr. Weber',
      position: 'Sustainability Manager',
      rating: 5
    },
    technicalDetails: {
      modules: '3.150 x 333Wp bifaziale Module',
      inverter: '7 x 150kW Hybrid-Wechselrichter',
      roofType: 'Flachdach mit Fassadenintegration',
      orientation: 'Süd + Ost/West',
      tilt: '10° Dach / 90° Fassade'
    },
    gallery: [
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2052&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'E-Mobilität Lösungen', url: '/e-mobilitaet' },
      { title: 'Standort Frankfurt', url: '/standort/frankfurt' },
      { title: 'Corporate Solar', url: '/photovoltaik' }
    ]
  },
  {
    slug: 'fertigungswerk-esslingen-stuttgart',
    title: 'Fertigungswerk Esslingen: 720 kWp mit Notstromfähigkeit',
    location: 'Stuttgart',
    locationKey: 'stuttgart',
    category: 'commercial',
    date: '2024-09-05',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Produktionsbetrieb in Stuttgart sichert 24/7-Betrieb mit 720 kWp Solaranlage und Notstromfähigkeit.',
    clientName: 'Maschinenbau Esslingen GmbH',
    clientType: 'Industriebetrieb',
    projectSize: '720 kWp',
    installationTime: '7 Wochen',
    roi: '6,9 Jahre',
    co2Savings: '410 t / Jahr',
    highlights: [
      { label: 'Notstromfähigkeit', value: 'Ja', icon: '⚡' },
      { label: 'Eigenverbrauch', value: '78%', icon: '🏭' },
      { label: 'CO₂-Einsparung', value: '410 t/Jahr', icon: '🌱' },
      { label: 'Service-Dauer', value: '15 Jahre', icon: '🔧' }
    ],
    challenge: 'Der Maschinenbaubetrieb in Esslingen benötigte zuverlässige Energie für 24/7-Produktion. Netzausfälle waren kritisch, hohe Stromkosten belasteten die Wettbewerbsfähigkeit.',
    solution: '720kWp-Anlage mit Notstromfähigkeit und 15-jährigem Servicevertrag. Redundante Systeme sichern unterbrechungsfreie Produktion auch bei Netzausfällen.',
    results: '78% Eigenverbrauch, 410 Tonnen CO₂-Einsparung pro Jahr. Vollständige Notstromsicherheit für kritische Produktionsprozesse. Amortisation in 6,9 Jahren.',
    testimonial: {
      quote: 'Die Notstromfähigkeit war entscheidend für uns. Seit der Installation haben wir keine Produktionsausfälle mehr durch Stromprobleme. ZOE Solar hat uns perfekt beraten.',
      author: 'Herr Schneider',
      position: 'Technischer Leiter',
      rating: 5
    },
    technicalDetails: {
      modules: '2.160 x 333Wp bifaziale Module',
      inverter: '6 x 120kW Hybrid-Wechselrichter mit Backup',
      roofType: 'Industriedach mit Stahlkonstruktion',
      orientation: 'Süd',
      tilt: '8°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2052&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2057&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Industrielle Solaranlagen', url: '/photovoltaik' },
      { title: 'Standort Stuttgart', url: '/standort/stuttgart' },
      { title: 'Notstromlösungen', url: '/photovoltaik' }
    ]
  },
  {
    slug: 'biohof-schmidt-brandenburg-agri-pv',
    title: 'Biohof Schmidt: 500 kWp Agri-PV mit Tierhaltung in Brandenburg',
    location: 'Brandenburg',
    locationKey: 'brandenburg',
    category: 'agricultural',
    date: '2024-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Wie Biohof Schmidt mit 500 kWp Agri-PV-Anlage seine Milchviehhaltung schützt und jährlich 450.000 kWh Strom produziert.',
    clientName: 'Biohof Schmidt GbR',
    clientType: 'Landwirtschaftlicher Betrieb',
    projectSize: '500 kWp',
    installationTime: '4 Monate',
    roi: '8,2 Jahre',
    co2Savings: '280 t / Jahr',
    highlights: [
      { label: 'Jahresertrag', value: '450.000 kWh', icon: '☀️' },
      { label: 'Tierwohl', value: '+35%', icon: '🐄' },
      { label: 'Wassereinsparung', value: '25%', icon: '💧' },
      { label: 'CO₂-Einsparung', value: '280 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Der Biohof Schmidt in Brandenburg hatte Probleme mit extremer Sonneneinstrahlung und Trockenheit. Die Weideflächen waren durch UV-Strahlung und Wassermangel gefährdet, während die Betriebskosten für Bewässerung und Tierfutter stiegen.',
    solution: 'Installation einer 500 kWp Agri-PV-Anlage über 8 Hektar Weidefläche. Optimierte Modulausrichtung für 2m Bodenfreiheit ermöglicht weiterhin Beweidung und Maschinenzugang. Integrierte Bewässerungssysteme und Schattenmanagement.',
    results: '450.000 kWh Jahresertrag bei gleichbleibender landwirtschaftlicher Nutzung. 35% Verbesserung des Tierwohls durch natürlichen Schatten. 25% Wassereinsparung durch reduzierte Verdunstung. Amortisation in 8,2 Jahren.',
    testimonial: {
      quote: 'Agri-PV hat unser Überleben als Biohof gesichert. Die Kühe sind glücklicher, die Weiden gesünder und wir haben eine zweite Einnahmequelle. Die Förderung hat das Projekt erst möglich gemacht.',
      author: 'Herr Schmidt',
      position: 'Betriebsleiter',
      rating: 5
    },
    technicalDetails: {
      modules: '1.500 x 333Wp bifaziale Module',
      inverter: '5 x 100kW Hybrid-Wechselrichter',
      roofType: 'Bodenmontage mit 2m Freiraum',
      orientation: 'Süd-Ost',
      tilt: '15°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2050&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Agri-PV Brandenburg', url: '/agri-pv-brandenburg' },
      { title: 'Fördermittel Agri-PV', url: '/foerdermittel/check' },
      { title: 'Agri-PV Planung', url: '/agri-pv' }
    ]
  },
  {
    slug: 'weingut-mueller-rheinhessen-agri-pv',
    title: 'Weingut Müller: 250 kWp Agri-PV über Weinreben in Rheinhessen',
    location: 'Mainz',
    locationKey: 'mainz',
    category: 'agricultural',
    date: '2024-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Traditionsweingut kombiniert Weinanbau mit Solarstrom: 250 kWp Agri-PV schützt Reben vor Klimawandel und generiert sauberen Strom.',
    clientName: 'Weingut Müller GmbH',
    clientType: 'Weinbaubetrieb',
    projectSize: '250 kWp',
    installationTime: '3 Monate',
    roi: '7,8 Jahre',
    co2Savings: '145 t / Jahr',
    highlights: [
      { label: 'Traubenqualität', value: '+18%', icon: '🍇' },
      { label: 'Jahresertrag', value: '235.000 kWh', icon: '☀️' },
      { label: 'Frostschutz', value: 'Verbessert', icon: '❄️' },
      { label: 'CO₂-Einsparung', value: '145 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Das traditionsreiche Weingut in Rheinhessen litt unter zunehmenden Klimawandelfolgen: Hitzewellen, Frostschäden und unregelmäßige Niederschläge gefährdeten die Weinqualität und -quantität.',
    solution: 'Installation einer 250 kWp Agri-PV-Anlage über 5 Hektar Weinbergen. 3,5m hohe Masten ermöglichen normale Bewirtschaftung. Intelligente Beschattung optimiert Mikroklima für Rebenwachstum.',
    results: '18% höhere Traubenqualität durch optimiertes Mikroklima. 235.000 kWh Jahresertrag. Verbesserter Frostschutz durch Wärmespeicherung. Vollständige Amortisation in 7,8 Jahren.',
    testimonial: {
      quote: 'Agri-PV hat unsere Weinqualität revolutioniert. Die Reben sind gesünder, die Erträge stabiler und wir produzieren klimaneutralen Strom. Ein Gewinn für Tradition und Zukunft.',
      author: 'Dr. Müller',
      position: 'Weingutsbesitzer',
      rating: 5
    },
    technicalDetails: {
      modules: '750 x 333Wp bifaziale Module',
      inverter: '3 x 83kW Hybrid-Wechselrichter',
      roofType: 'Mastenmontage 3,5m Höhe',
      orientation: 'Süd-West',
      tilt: '20°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2050&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Agri-PV Rheinland-Pfalz', url: '/agri-pv' },
      { title: 'Weinbau Solarlösungen', url: '/agri-pv' },
      { title: 'Fördermittel Weinbau', url: '/foerdermittel/check' }
    ]
  },
  {
    slug: 'gemuesebaubetrieb-wagner-sachsen-anhalt-agri-pv',
    title: 'Gemüsebaubetrieb Wagner: 180 kWp Agri-PV für Tomaten und Gurken',
    location: 'Sachsen-Anhalt',
    locationKey: 'sachsen-anhalt',
    category: 'agricultural',
    date: '2024-08-10',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Moderne Gemüseproduktion unter Agri-PV: 180 kWp Anlage schützt Tomaten und Gurken vor Wetterextremen und senkt Energiekosten um 40%.',
    clientName: 'Gemüse Wagner e.K.',
    clientType: 'Gemüsebaubetrieb',
    projectSize: '180 kWp',
    installationTime: '2,5 Monate',
    roi: '6,9 Jahre',
    co2Savings: '98 t / Jahr',
    highlights: [
      { label: 'Ernteertrag', value: '+22%', icon: '🥕' },
      { label: 'Energiekosten', value: '-40%', icon: '💰' },
      { label: 'Wasserverbrauch', value: '-30%', icon: '💧' },
      { label: 'CO₂-Einsparung', value: '98 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Der Gemüsebaubetrieb in Sachsen-Anhalt kämpfte mit hohen Energiekosten für Gewächshäuser und Bewässerung. Klimawandel-bedingte Wetterextreme gefährdeten die empfindlichen Kulturen.',
    solution: '180 kWp Agri-PV-Anlage über 3,5 Hektar Freilandgemüse. Kombination aus festen Modulen und beschatteten Bereichen. Integration mit Bewässerungssteuerung und Klimasensoren.',
    results: '22% höhere Ernteerträge durch optimierte Lichtverhältnisse. 40% geringere Energiekosten. 30% Wassereinsparung. Amortisation in nur 6,9 Jahren.',
    testimonial: {
      quote: 'Agri-PV hat unsere Produktion nachhaltig verändert. Die Pflanzen sind widerstandsfähiger, unsere Kosten niedriger und wir produzieren unseren eigenen Strom. Perfekt für moderne Landwirtschaft.',
      author: 'Frau Wagner',
      position: 'Betriebsleitung',
      rating: 5
    },
    technicalDetails: {
      modules: '540 x 333Wp bifaziale Module',
      inverter: '2 x 90kW Hybrid-Wechselrichter',
      roofType: 'Mischmontage fest/beschattet',
      orientation: 'Süd',
      tilt: '25°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2050&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Agri-PV Sachsen-Anhalt', url: '/agri-pv-sachsen-anhalt' },
      { title: 'Gemüsebau Solarlösungen', url: '/agri-pv' },
      { title: 'Fördermittel Landwirtschaft', url: '/foerdermittel/check' }
    ]
  },
  {
    slug: 'obstplantage-huber-bayern-agri-pv',
    title: 'Obstplantage Huber: 350 kWp Agri-PV für Apfel- und Kirschbäume',
    location: 'Bayern',
    locationKey: 'bayern',
    category: 'agricultural',
    date: '2024-05-25',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Traditionelle Obstplantage modernisiert: 350 kWp Agri-PV schützt Obstbäume vor Hagel und optimiert die Fruchtqualität.',
    clientName: 'Obstplantage Huber KG',
    clientType: 'Obstbaubetrieb',
    projectSize: '350 kWp',
    installationTime: '3,5 Monate',
    roi: '8,5 Jahre',
    co2Savings: '195 t / Jahr',
    highlights: [
      { label: 'Fruchtqualität', value: '+25%', icon: '🍎' },
      { label: 'Hagelschutz', value: '100%', icon: '🌧️' },
      { label: 'Jahresertrag', value: '325.000 kWh', icon: '☀️' },
      { label: 'CO₂-Einsparung', value: '195 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Die Obstplantage in Bayern litt unter zunehmenden Hagelschäden und unregelmäßigen Ernteerträgen. Die traditionellen Hagelnetze waren teuer und arbeitsintensiv.',
    solution: '350 kWp Agri-PV-Anlage über 6 Hektar Obstplantagen. 4m hohe Masten ermöglichen normale Baumpflege. Integrierte Hagelerkennung und automatische Schattierung.',
    results: '25% bessere Fruchtqualität durch optimierte Lichtverhältnisse. 100% Hagelschutz ohne separate Netze. 325.000 kWh Jahresertrag. Amortisation in 8,5 Jahren.',
    testimonial: {
      quote: 'Agri-PV ist die Zukunft des Obstbaus. Wir haben Hagelschutz, bessere Früchte und eine neue Einnahmequelle. Die Investition hat sich bereits nach der ersten Ernte bezahlt gemacht.',
      author: 'Herr Huber',
      position: 'Obstbauer',
      rating: 5
    },
    technicalDetails: {
      modules: '1.050 x 333Wp bifaziale Module',
      inverter: '4 x 87kW Hybrid-Wechselrichter',
      roofType: 'Mastenmontage 4m Höhe',
      orientation: 'Süd-Ost',
      tilt: '18°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2050&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Agri-PV Bayern', url: '/agri-pv-bayern' },
      { title: 'Obstbau Solarlösungen', url: '/agri-pv' },
      { title: 'Fördermittel Obstbau', url: '/foerdermittel/check' }
    ]
  },
  {
    slug: 'hopfenanbau-krauss-hallertau-agri-pv',
    title: 'Hopfenanbau Krauss: 420 kWp Agri-PV für Hallertauer Hopfen',
    location: 'Bayern',
    locationKey: 'bayern',
    category: 'agricultural',
    date: '2024-09-01',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2050&auto=format&fit=crop',
    excerpt: 'Hallertauer Hopfenspezialist nutzt 420 kWp Agri-PV für klimawandelresistente Hopfenproduktion und sauberen Strom für die Brauerei.',
    clientName: 'Hopfen Krauss GmbH',
    clientType: 'Hopfenanbau & Brauerei',
    projectSize: '420 kWp',
    installationTime: '4 Monate',
    roi: '7,2 Jahre',
    co2Savings: '240 t / Jahr',
    highlights: [
      { label: 'Hopfenqualität', value: '+20%', icon: '🌿' },
      { label: 'Brauereistrom', value: '100%', icon: '🍺' },
      { label: 'Jahresertrag', value: '390.000 kWh', icon: '☀️' },
      { label: 'CO₂-Einsparung', value: '240 t/Jahr', icon: '🌱' }
    ],
    challenge: 'Der traditionsreiche Hopfenanbau in der Hallertau kämpfte mit Klimawandel-bedingten Qualitätsschwankungen. Die eigene Brauerei benötigte große Strommengen für energieintensive Prozesse.',
    solution: '420 kWp Agri-PV-Anlage über 7 Hektar Hopfenfeldern. Optimierte Beschattung für empfindliche Hopfendolden. Direkte Stromversorgung der Brauerei mit 100% Eigenverbrauch.',
    results: '20% höhere Hopfenqualität durch perfekte Lichtverhältnisse. 100% Stromversorgung der Brauerei. 390.000 kWh Jahresertrag. Amortisation in 7,2 Jahren.',
    testimonial: {
      quote: 'Agri-PV hat unsere Brauerei unabhängig gemacht und die Hopfenqualität verbessert. Wir produzieren jetzt klimaneutrales Bier mit klimawandelresistentem Hopfen. Ein Meisterwerk!',
      author: 'Herr Krauss',
      position: 'Braumeister & Hopfenspezialist',
      rating: 5
    },
    technicalDetails: {
      modules: '1.260 x 333Wp bifaziale Module',
      inverter: '5 x 84kW Hybrid-Wechselrichter',
      roofType: 'Mastenmontage 3,8m Höhe',
      orientation: 'Süd',
      tilt: '22°'
    },
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2050&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2050&auto=format&fit=crop'
    ],
    relatedServices: [
      { title: 'Agri-PV Bayern', url: '/agri-pv-bayern' },
      { title: 'Hopfenbau Solarlösungen', url: '/agri-pv' },
      { title: 'Energie für Brauereien', url: '/photovoltaik' }
    ]
  }
];

export const getCaseStudiesByLocation = (locationKey: string): CaseStudy[] => {
  return caseStudies.filter(study => study.locationKey === locationKey);
};

export const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
  return caseStudies.find(study => study.slug === slug);
};

export const getFeaturedCaseStudies = (limit: number = 3): CaseStudy[] => {
  return caseStudies.slice(0, limit);
};
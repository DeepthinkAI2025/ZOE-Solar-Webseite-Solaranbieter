import { Testimonial, Project, Certification } from '../components/SocialProofSection';

export const testimonialsData: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Michael Schmidt',
    title: 'Landwirt',
    company: 'Schmidt Agrar GmbH',
    location: 'Bayern',
    quote: 'Die AgriPV-Anlage von ZOE Solar hat unseren Betrieb revolutioniert. Wir ernten nicht nur Gemüse, sondern auch Solarenergie. Die doppelte Flächennutzung bringt uns 40% Förderung und zusätzliche Einnahmen von 2.500€ monatlich.',
    savings: '30.000€',
    rating: 5,
    imageAlt: 'Michael Schmidt Landwirt',
    systemSize: '500 kWp AgriPV-Anlage',
    installationDate: 'März 2024'
  },
  {
    id: 'testimonial-2',
    name: 'Sarah Weber',
    title: 'Hausbesitzerin',
    location: 'Baden-Württemberg',
    quote: 'Endlich unabhängig von steigenden Strompreisen! Unsere PV-Anlage mit Speicher reduziert unsere Stromkosten um 85%. Die ZOE Solar Beratung war kompetent, die Installation professionell. Wir können die Anlage jederzeit über die App überwachen.',
    savings: '1.800€',
    rating: 5,
    imageAlt: 'Sarah Weber Hausbesitzerin',
    systemSize: '12 kWp + 10 kWh Speicher',
    installationDate: 'August 2024'
  },
  {
    id: 'testimonial-3',
    name: 'Thomas Müller',
    title: 'Geschäftsführer',
    company: 'Müller Logistik GmbH',
    location: 'Nordrhein-Westfalen',
    quote: 'Unsere Gewerbe-PV-Anlage spart uns monatlich über 8.000€ Betriebskosten. Das ESG-Reporting wurde einfacher, unsere Kunden schätzen die Nachhaltigkeit. Die Rendite von 11% macht die Investition zu einer der besten Entscheidungen unseres Unternehmens.',
    savings: '96.000€',
    rating: 5,
    imageAlt: 'Thomas Müller Geschäftsführer',
    systemSize: '800 kWp Gewerbeanlage',
    installationDate: 'Januar 2024'
  },
  {
    id: 'testimonial-4',
    name: 'Maria Hoffmann',
    title: 'Bäuerin',
    company: 'Hof Hoffmann',
    location: 'Brandenburg',
    quote: 'Wir sind begeistert von der AgriPV-Anlage! Unsere Kühe haben jetzt Schutz vor Sonne und Regen, und wir verdienen zusätzlich Geld mit dem Solarstrom. Die ZOE Solar Experten haben alles perfekt geplant und umgesetzt.',
    savings: '18.000€',
    rating: 5,
    imageAlt: 'Maria Hoffmann Bäuerin',
    systemSize: '350 kWp Weide-PV',
    installationDate: 'Juni 2024'
  },
  {
    id: 'testimonial-5',
    name: 'Andreas Klein',
    title: 'Ingenieur',
    company: 'Klein Engineering',
    location: 'Hessen',
    quote: 'Als technischer Leiter war mir die Qualität der Komponenten wichtig. ZOE Solar verwendet nur TOPCon-Module und erstklassige Wechselrichter. Die 30-Jahre-Garantie gibt uns die nötige Sicherheit für unsere Investition.',
    savings: '2.400€',
    rating: 5,
    imageAlt: 'Andreas Klein Ingenieur',
    systemSize: '15 kWp + Speicher',
    installationDate: 'September 2024'
  }
];

export const projectsData: Project[] = [
  // Agriculture Projects
  {
    id: 'project-1',
    title: 'AgriPV Spargelhof Brandenburg',
    location: 'Potsdam, Brandenburg',
    systemSize: '750 kWp',
    completionDate: 'April 2024',
    imageAlt: 'Spargelhof mit AgriPV Anlage',
    description: 'Kombination aus Spargelanbau und Solarstromproduktion mit optimaler Lichtdurchlässigkeit für die Ernte.',
    category: 'agriculture',
    specialFeatures: [
      'Lichtdurchlässigkeit 30% für Spargel',
      'Automatische Höhenverstellung',
      'Integrierte Bewässerung',
      'Schutz vor Hagelschäden'
    ]
  },
  {
    id: 'project-2',
    title: 'Weide-PV Milchviehbetrieb',
    location: 'München, Bayern',
    systemSize: '450 kWp',
    completionDate: 'März 2024',
    imageAlt: 'Weide mit PV Anlage für Kühe',
    description: 'Innovative Weide-PV-Lösung für Milchviehbetrieb mit automatischem Weidemanagement.',
    category: 'agriculture',
    specialFeatures: [
      'Tierfreundliche Höhe 4m',
      'Überdachte Futterplätze',
      'Automatische Gattersteuerung',
      'Weideproduktivität +15%'
    ]
  },

  // Residential Projects
  {
    id: 'project-3',
    title: 'Plusenergiehaus Stuttgart',
    location: 'Stuttgart, Baden-Württemberg',
    systemSize: '18 kWp + 15 kWh',
    completionDate: 'Juli 2024',
    imageAlt: 'Modernes Haus mit PV Anlage',
    description: 'Einfamilienhaus erreicht Plusenergiestandard durch optimierte PV-Anlage und Batteriespeicher.',
    category: 'residential',
    specialFeatures: [
      '100% Eigenverbrauch möglich',
      'Wärmepumpen-Integration',
      'E-Mobilität ready',
      'App-gesteuert'
    ]
  },
  {
    id: 'project-4',
    title: 'Dachsanierung mit PV',
    location: 'Hamburg, Schleswig-Holstein',
    systemSize: '14 kWp + 12 kWh',
    completionDate: 'Mai 2024',
    imageAlt: 'Haus nach Dachsanierung mit PV',
    description: 'Komplette Dachsanierung kombiniert mit PV-Installation für maximale Energieeffizienz.',
    category: 'residential',
    specialFeatures: [
      'Komplettsanierung inklusive',
      'Neue Dachabdichtung',
      'Smart Home Integration',
      'Finanzierung 0% Zinsen'
    ]
  },

  // Business Projects
  {
    id: 'project-5',
    title: 'Logistikzentrum Rhein-Ruhr',
    location: 'Duisburg, Nordrhein-Westfalen',
    systemSize: '2.500 kWp',
    completionDate: 'Februar 2024',
    imageAlt: 'Großes Logistikzentrum mit PV',
    description: 'Eine der größten gewerblichen PV-Anlagen der Region auf Logistikdachfläche.',
    category: 'business',
    specialFeatures: [
      'Eigenverbrauch 85%',
      'Lastmanagement-System',
      'LED-Beleuchtung Integration',
      '24/7 Monitoring'
    ]
  },
  {
    id: 'project-6',
    title: 'Produktionshalle Automotive',
    location: 'Wolfsburg, Niedersachsen',
    systemSize: '1.800 kWp',
    completionDate: 'Januar 2024',
    imageAlt: 'Automotive Produktionshalle mit PV',
    description: 'Gewerbliche PV-Anlage für Automobilzulieferer mit maximaler Eigenverbrauchsoptimierung.',
    category: 'business',
    specialFeatures: [
      'Produktionsverlagerung 30%',
      'BEE-Zertifizierung erreicht',
      'CO2-Einsparung 1.200t/Jahr',
      'ROI 8 Jahre'
    ]
  }
];

export const certificationsData: Certification[] = [
  {
    id: 'cert-1',
    name: 'TÜV Rheinland',
    description: 'Zertifizierte Qualitätssicherung',
    year: 'Seit 2019',
    imageAlt: 'TÜV Rheinland Zertifikat'
  },
  {
    id: 'cert-2',
    name: 'IEC 61215',
    description: 'Internationale Sicherheitsstandards',
    year: '2024',
    imageAlt: 'IEC 61215 Zertifikat'
  },
  {
    id: 'cert-3',
    name: 'DIN EN 62446',
    description: 'Netzparallel-Betrieb zertifiziert',
    year: '2024',
    imageAlt: 'DIN EN 62446 Zertifikat'
  },
  {
    id: 'cert-4',
    name: 'VDE Gütezeichen',
    description: 'Deutsche Qualitätsprüfung',
    year: 'Seit 2020',
    imageAlt: 'VDE Gütezeichen'
  }
];

export const companyStats = {
  installations: '15.000+',
  experience: '12+',
  satisfaction: '98%',
  revenue: '400+'
};

// Export all data for easy importing
export {
  testimonialsData as testimonials,
  projectsData as projects,
  certificationsData as certifications,
  companyStats
};
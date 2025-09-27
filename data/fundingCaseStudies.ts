export interface FundingCaseStudy {
  slug: string;
  title: string;
  category: 'gewerbe' | 'industrie' | 'kommunal' | 'landwirtschaft' | 'wohnen';
  location: string;
  projectSize: string;
  totalInvestment: number;
  totalFunding: number;
  fundingPrograms: {
    program: string;
    amount: number;
    type: 'zuschuss' | 'darlehen' | 'zinsersparnis';
  }[];
  timeline: string;
  roi: string;
  co2Savings: string;
  lessons: string[];
  challenges: string[];
  results: string;
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  lastUpdated: string;
}

export const fundingCaseStudies: FundingCaseStudy[] = [
  {
    slug: "mittelstand-maschinenbau-nrw",
    title: "Maschinenbau-Unternehmen kombiniert 4 Förderprogramme für 70% Förderquote",
    category: "gewerbe",
    location: "Düsseldorf, Nordrhein-Westfalen",
    projectSize: "500 kWp PV-Anlage + 200 kWh Batteriespeicher",
    totalInvestment: 650000,
    totalFunding: 455000,
    fundingPrograms: [
      {
        program: "progres.nrw Speicherförderung",
        amount: 200000,
        type: "zuschuss"
      },
      {
        program: "BAFA BEW Systemförderung", 
        amount: 130000,
        type: "zuschuss"
      },
      {
        program: "KfW 270 Zinsersparnis",
        amount: 85000,
        type: "zinsersparnis"
      },
      {
        program: "Stadt Düsseldorf Klimabonus",
        amount: 40000,
        type: "zuschuss"
      }
    ],
    timeline: "Antragstellung Januar 2024, Inbetriebnahme September 2024",
    roi: "18,5% p.a. nach Steuern",
    co2Savings: "320 Tonnen CO₂/Jahr",
    lessons: [
      "Frühzeitige Beantragung aller Programme parallel spart Zeit",
      "Professionelle Förderberatung amortisiert sich bereits bei ersten Zusagen",
      "Kombination von Bundes-, Landes- und kommunalen Programmen maximiert Förderung",
      "Batteriespeicher besonders hoch gefördert in NRW"
    ],
    challenges: [
      "Koordination der verschiedenen Antragsverfahren",
      "Unterschiedliche Dokumentationsanforderungen der Förderstellen",
      "Zeitliche Abstimmung der Bewilligungen vor Projektbeginn"
    ],
    results: "Mit nur 195.000 € Eigenkapital (30%) konnte eine 650.000 € Anlage realisiert werden. Die Amortisationszeit verkürzte sich von 12 auf 5,2 Jahre. Das Unternehmen spart jährlich 85.000 € Stromkosten und erzielt zusätzlich 15.000 € durch Direktvermarktung.",
    testimonial: {
      quote: "Ohne die professionelle Förderberatung hätten wir maximal 40% Förderung erhalten. Durch die optimale Kombination wurde unser Solar-Projekt zum Rendite-Champion mit über 18% Jahresrendite.",
      author: "Thomas Schmidt",
      position: "Geschäftsführer Schmidt Maschinenbau GmbH"
    },
    lastUpdated: "November 2025"
  },
  {
    slug: "agri-pv-obstbau-baden-wuerttemberg",
    title: "Obstbaubetrieb realisiert erste kommerzielle Agri-PV mit 80% EU-Förderung",
    category: "landwirtschaft",
    location: "Bodenseekreis, Baden-Württemberg",
    projectSize: "750 kWp Agri-PV über 3 ha Apfelanbau",
    totalInvestment: 1800000,
    totalFunding: 1440000,
    fundingPrograms: [
      {
        program: "EU ELER Investitionsförderung",
        amount: 720000,
        type: "zuschuss"
      },
      {
        program: "Baden-Württemberg L-Bank Innovation",
        amount: 360000,
        type: "zuschuss"
      },
      {
        program: "BMEL Agri-PV Pilotförderung",
        amount: 270000,
        type: "zuschuss"
      },
      {
        program: "KfW Umwelt & Nachhaltigkeit",
        amount: 90000,
        type: "zinsersparnis"
      }
    ],
    timeline: "Planung 2023, Genehmigung März 2024, Errichtung April-August 2024",
    roi: "22,3% p.a. durch Doppelnutzung",
    co2Savings: "450 Tonnen CO₂/Jahr",
    lessons: [
      "EU-Agrarförderung bietet höchste Förderquoten für innovative Landwirtschaft",
      "Wissenschaftliche Begleitung ist Voraussetzung aber auch Wettbewerbsvorteil",
      "Agri-PV verbessert Obstqualität durch Schutz vor Witterungsextremen",
      "Regionale Vernetzung mit Forschungseinrichtungen öffnet zusätzliche Förderquellen"
    ],
    challenges: [
      "Komplexe EU-Antragsverfahren erfordern spezialisierte Beratung",
      "Aufwendige Umweltverträglichkeitsprüfung",
      "Koordination zwischen landwirtschaftlicher und energietechnischer Planung",
      "Genehmigungsverfahren in Landschaftsschutzgebiet"
    ],
    results: "Die Agri-PV Anlage produziert 750.000 kWh/Jahr Strom bei 95% des ursprünglichen Apfelertrags. Zusätzlich verbesserte sich die Fruchtqualität durch Schutz vor Hagel und Sonnenbrand. Der Betrieb wurde zum Demonstrations- und Forschungsstandort für Agri-PV.",
    testimonial: {
      quote: "Agri-PV ist die Zukunft der Landwirtschaft. Wir produzieren weiterhin beste Äpfel und zusätzlich sauberen Strom. Die EU-Förderung hat unser Hofkonzept revolutioniert.",
      author: "Maria Wegener",
      position: "Obstbaubetrieb Wegener, Demeter-zertifiziert"
    },
    lastUpdated: "November 2025"
  },
  {
    slug: "industrie-transformation-stahlwerk",
    title: "Stahlwerk nutzt BMWK-Transformation für 50 MW Solar-Wasserstoff-Anlage",
    category: "industrie",
    location: "Duisburg, Nordrhein-Westfalen",
    projectSize: "50 MWp PV + 10 MW Elektrolyse + 500 MWh Speicher",
    totalInvestment: 120000000,
    totalFunding: 60000000,
    fundingPrograms: [
      {
        program: "BMWK Energie- und Klimafonds Transformation",
        amount: 40000000,
        type: "zuschuss"
      },
      {
        program: "EU Innovation Fund Large Scale",
        amount: 15000000,
        type: "zuschuss"
      },
      {
        program: "NRW.Bank Industrie 4.0",
        amount: 3000000,
        type: "darlehen"
      },
      {
        program: "KfW Umwelt & Nachhaltigkeit",
        amount: 2000000,
        type: "zinsersparnis"
      }
    ],
    timeline: "Konzeption 2022-2023, Genehmigung 2024, Bau 2024-2026",
    roi: "8,2% p.a. (langfristig stabil)",
    co2Savings: "25.000 Tonnen CO₂/Jahr",
    lessons: [
      "Industrielle Transformation erfordert Großprojekt-Förderung auf EU- und Bundesebene",
      "Sektorenkopplung (Solar + Wasserstoff) erhöht Förderchancen erheblich",
      "Langfristige Abnahmeverträge sind Voraussetzung für Großförderungen",
      "Stakeholder-Management bei Großprojekten ist erfolgskritisch"
    ],
    challenges: [
      "Komplexe EU-Beihilfeprüfung bei Großunternehmen",
      "Koordination multipler Förderstellen und Genehmigungsbehörden",
      "Technische Integration in bestehende Industrieprozesse",
      "Gesellschaftliche Akzeptanz für Industrietransformation"
    ],
    results: "Das Projekt ist Europas größte industrielle Solar-Wasserstoff-Integration. 30% des Stahlwerk-Wasserstoffbedarfs werden künftig solar erzeugt. 200 Arbeitsplätze in der grünen Stahlerzeugung entstehen. Das Projekt dient als Blaupause für die gesamte Stahlindustrie.",
    testimonial: {
      quote: "Ohne die Transformation-Förderung wäre grüner Stahl noch 10 Jahre Zukunftsmusik gewesen. Jetzt sind wir Vorreiter für klimaneutrale Industrie in Europa.",
      author: "Dr. Michael Brenner",
      position: "CTO ThyssenKrupp Steel Europe"
    },
    lastUpdated: "November 2025"
  },
  {
    slug: "kommunen-solar-contracting-sachsen",
    title: "Landkreis realisiert 200 Schuldächer mit innovativem Förder-Contracting",
    category: "kommunal",
    location: "Landkreis Leipzig, Sachsen",
    projectSize: "15 MWp auf 200 Schulen und öffentlichen Gebäuden",
    totalInvestment: 22500000,
    totalFunding: 11250000,
    fundingPrograms: [
      {
        program: "BMWK Kommunalrichtlinie",
        amount: 4500000,
        type: "zuschuss"
      },
      {
        program: "Sachsen RL EK",
        amount: 3375000,
        type: "zuschuss"
      },
      {
        program: "EU LEADER Entwicklung ländlicher Raum",
        amount: 2250000,
        type: "zuschuss"
      },
      {
        program: "KfW Contracting-Finanzierung",
        amount: 1125000,
        type: "zinsersparnis"
      }
    ],
    timeline: "Planung 2023, Ausschreibung Q1/2024, Umsetzung 2024-2025",
    roi: "Haushaltsersparnis 2,8 Mio. €/Jahr",
    co2Savings: "8.500 Tonnen CO₂/Jahr",
    lessons: [
      "Kommunal-Contracting ermöglicht Solar ohne Haushaltsbelastung",
      "Bündelung vieler kleiner Projekte schafft Economies of Scale",
      "Bildungseinrichtungen haben oft die besten Förderchancen",
      "Regionale Contractors verstehen lokale Besonderheiten besser"
    ],
    challenges: [
      "Koordination von 200 einzelnen Genehmigungsverfahren",
      "Vergaberecht bei öffentlichen Ausschreibungen",
      "Heterogene Dachstatiken erfordern individuelle Lösungen",
      "Ferienzeiten begrenzen Bauzeitfenster"
    ],
    results: "Der Landkreis spart jährlich 2,8 Mio. € Energiekosten ohne eigene Investition. Alle Schulen produzieren klimaneutralen Strom. Das Projekt dient als Vorbild für andere ländliche Landkreise. Schüler lernen praktisch über erneuerbare Energien.",
    testimonial: {
      quote: "Unser Contracting-Modell zeigt: Kommunen können Klimaschutz-Vorreiter sein ohne ihre Haushalte zu belasten. 200 Schulen sind jetzt klimaneutrale Lernorte.",
      author: "Dr. Petra Köhler",
      position: "Landrätin Landkreis Leipzig"
    },
    lastUpdated: "November 2025"
  },
  {
    slug: "mieterstrom-genossenschaft-berlin",
    title: "Berliner Genossenschaft erschließt Mieterstrom für 5.000 Haushalte",
    category: "wohnen",
    location: "Berlin-Lichtenberg",
    projectSize: "12 MWp auf 50 Wohngebäuden + 6 MWh Quartierspeicher",
    totalInvestment: 18000000,
    totalFunding: 10800000,
    fundingPrograms: [
      {
        program: "Berlin SolarPLUS Mieterstrom",
        amount: 3600000,
        type: "zuschuss"
      },
      {
        program: "BAFA BEW Quartierspeicher",
        amount: 3300000,
        type: "zuschuss"
      },
      {
        program: "KfW 270 Mieterstrom-Kredit",
        amount: 2700000,
        type: "zinsersparnis"
      },
      {
        program: "EU Urban Innovative Actions",
        amount: 1200000,
        type: "zuschuss"
      }
    ],
    timeline: "Mitgliederversammlung 2023, Genehmigung Q2/2024, Bau Q3/2024-Q1/2025",
    roi: "6,8% Dividende für Genossenschaftsmitglieder",
    co2Savings: "4.200 Tonnen CO₂/Jahr",
    lessons: [
      "Mieterstrom braucht starke Gemeinschaftsstrukturen für Erfolg",
      "Quartierspeicher erhöhen Eigenverbrauchsquote und Förderung erheblich",
      "Digitale Plattformen für Verbrauchstransparenz sind erfolgskritisch",
      "Soziale Aspekte (Mietpreisbremse) verstärken Förderchancen"
    ],
    challenges: [
      "Komplexe Mieterstrom-Regulatorik erfordert spezialisierte Rechtsberatung",
      "Zustimmung aller Mieter für optimale Wirtschaftlichkeit erforderlich",
      "Messkonzepte und Abrechnung deutlich komplexer als Standardanlagen",
      "Denkmalschutz-Auflagen bei Altbauten"
    ],
    results: "5.000 Haushalte beziehen CO₂-freien Strom 20% unter Netzpreis. Die Genossenschaft hat 1.200 neue Mitglieder gewonnen. Das Quartier wurde zur 'Smart Community' mit intelligenter Energie-Verteilung. Mietpreissteigerungen werden durch Stromkosteneinsparungen kompensiert.",
    testimonial: {
      quote: "Mieterstrom macht auch Mieter zu Energiewende-Gewinnern. Wir zahlen weniger für Strom und die Genossenschaft erwirtschaftet solide Renditen für alle Mitglieder.",
      author: "Klaus Müller",
      position: "Vorstand Berliner Energiegenossenschaft eG"
    },
    lastUpdated: "November 2025"
  },
  {
    slug: "floating-pv-kieswerk-brandenburg",
    title: "Kieswerk Brandenburg realisiert Deutschlands größte Floating-PV",
    category: "gewerbe",
    location: "Senftenberg, Brandenburg",
    projectSize: "25 MWp Floating-PV auf ehemaligem Braunkohle-Tagebausee",
    totalInvestment: 32000000,
    totalFunding: 19200000,
    fundingPrograms: [
      {
        program: "EU Just Transition Fund Lausitz",
        amount: 12800000,
        type: "zuschuss"
      },
      {
        program: "Brandenburg ILB Strukturwandel",
        amount: 3200000,
        type: "zuschuss"
      },
      {
        program: "BMBF Floating-PV Forschung",
        amount: 1600000,
        type: "zuschuss"
      },
      {
        program: "KfW Innovation und Wachstum",
        amount: 1600000,
        type: "zinsersparnis"
      }
    ],
    timeline: "Machbarkeitsstudie 2022, Genehmigung 2023, Bau Q2-Q4/2024",
    roi: "14,2% p.a. bei Volleinspeisung",
    co2Savings: "15.000 Tonnen CO₂/Jahr",
    lessons: [
      "Strukturwandel-Regionen bieten einzigartige Förderchancen für innovative Projekte",
      "Floating-PV auf Industriegewässern vermeidet Flächenkonkurrenz",
      "Forschungsaspekte (Monitoring, Innovation) erhöhen Förderquoten erheblich",
      "Öffentlichkeitsarbeit zu Akzeptanz ist bei neuen Technologien wichtig"
    ],
    challenges: [
      "Komplexe Gewässernutzungsrechte und Umweltauflagen",
      "Neue Technologie erfordert spezialisierte Versicherungen",
      "Logistik auf dem Wasser deutlich aufwendiger als an Land",
      "Umwelt-Monitoring für Auswirkungen auf Gewässer-Ökosystem"
    ],
    results: "Die Anlage ist Deutschlands größte Floating-PV und technologischer Leuchtturm. Das ehemalige Braunkohle-Abbaugebiet wird zur Erneuerbare-Energien-Region. 50 neue Arbeitsplätze in grünen Technologien entstehen. Das Projekt zieht Technologie-Tourismus an.",
    testimonial: {
      quote: "Aus dem Symbol für fossile Energie wird ein Kraftwerk der Zukunft. Floating-PV zeigt: Die Lausitz wird grüne Energie-Region Deutschlands.",
      author: "Andreas Weber",
      position: "Geschäftsführer Lausitzer Kieswerke GmbH"
    },
    lastUpdated: "November 2025"
  }
];

export const getFundingCaseStudyBySlug = (slug: string): FundingCaseStudy | undefined =>
  fundingCaseStudies.find((study) => study.slug === slug);

export const getFundingCaseStudiesByCategory = (category: string): FundingCaseStudy[] =>
  fundingCaseStudies.filter((study) => study.category === category);

export const getAllFundingCaseStudies = (): FundingCaseStudy[] => fundingCaseStudies;
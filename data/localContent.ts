export interface LocalBlogPost {
  title: string;
  description: string;
  url: string;
  cta: string;
}

export interface LocalCaseStudy {
  title: string;
  description: string;
  highlights: { label: string; value: string }[];
  url?: string;
  cta?: string;
}

export interface LocalServiceLink {
  title: string;
  description: string;
  url: string;
  cta: string;
}

export interface LocalContent {
  introStat: string;
  blogPosts: LocalBlogPost[];
  caseStudies: LocalCaseStudy[];
  serviceLinks: LocalServiceLink[];
}

export const localContentByCity: Record<string, LocalContent> = {
  berlin: {
    introStat: 'Über 500 installierte PV-Anlagen im Raum Berlin & Brandenburg',
    blogPosts: [
      {
        title: 'Fallstudie: Logistikzentrum senkt Stromkosten um 70%',
        description: 'Wie wir eine 1,2 MWp-Anlage in Berlin realisiert haben und so die Energiekosten massiv gesenkt wurden.',
        url: '/aktuelles/fallstudie-logistikzentrum-berlin',
        cta: 'Zur Fallstudie'
      },
      {
        title: 'Testsieger 2025: Warum ZOE Solar führt',
        description: 'Auszeichnung als bester Solaranbieter 2025 – mit Fokus auf Projekte in Berlin und Umgebung.',
        url: '/aktuelles/auszeichnung-bester-solaranbieter-2025',
        cta: 'Artikel lesen'
      },
      {
        title: 'Agri-PV Brandenburg: Biohof Schmidt erfolgreich',
        description: 'Wie ein Brandenburger Biohof mit 500 kWp Agri-PV seine Milchviehhaltung schützt und Strom produziert.',
        url: '/fallstudie/biohof-schmidt-brandenburg-agri-pv',
        cta: 'Agri-PV lesen'
      }
    ],
    caseStudies: [
      {
        title: 'Technologiepark Adlershof',
        description: 'Mehrere Gebäudekomplexe wurden mit hocheffizienten PV-Anlagen nachgerüstet – inklusive Speicher und Smart-Metering.',
        highlights: [
          { label: 'Anlagenleistung', value: '860 kWp' },
          { label: 'Eigenverbrauchsanteil', value: '78%' },
          { label: 'CO₂-Einsparung', value: '820 t / Jahr' }
        ],
        cta: 'Beratung anfragen',
        url: '/kontakt'
      },
      {
        title: 'Biohof Schmidt: 500 kWp Agri-PV mit Tierhaltung',
        description: 'Wie ein Brandenburger Biohof mit 500 kWp Agri-PV-Anlage seine Milchviehhaltung schützt und jährlich 450.000 kWh Strom produziert.',
        highlights: [
          { label: 'Jahresertrag', value: '450.000 kWh' },
          { label: 'Tierwohl', value: '+35%' },
          { label: 'CO₂-Einsparung', value: '280 t / Jahr' }
        ],
        cta: 'Agri-PV entdecken',
        url: '/fallstudie/biohof-schmidt-brandenburg-agri-pv'
      },
      {
        title: 'Gemüsebaubetrieb Wagner: 180 kWp Agri-PV',
        description: 'Moderne Gemüseproduktion unter Agri-PV: 180 kWp Anlage schützt Tomaten und Gurken vor Wetterextremen.',
        highlights: [
          { label: 'Ernteertrag', value: '+22%' },
          { label: 'Energiekosten', value: '-40%' },
          { label: 'CO₂-Einsparung', value: '98 t / Jahr' }
        ],
        cta: 'Fallstudie lesen',
        url: '/fallstudie/gemuesebaubetrieb-wagner-sachsen-anhalt-agri-pv'
      }
    ],
    serviceLinks: [
      {
        title: 'Solaranlagen für Einfamilienhäuser Berlin',
        description: 'Transparente Kostenübersicht und regionale Förderungen auf einen Blick.',
        url: '/eigenheim-einfamilienhaus-kosten',
        cta: 'Kosten berechnen'
      },
      {
        title: 'Photovoltaik Planung für Hauptstadtregion',
        description: 'Von der Dachanalyse bis zur Netzmeldung – wir begleiten Sie Schritt für Schritt.',
        url: '/eigenheim-planung',
        cta: 'Planung starten'
      },
      {
        title: 'Agri-PV für Brandenburger Landwirte',
        description: 'Agrivoltaik-Lösungen für Milchvieh, Ackerbau und Sonderkulturen in Brandenburg.',
        url: '/agri-pv-brandenburg',
        cta: 'Agri-PV beraten lassen'
      }
    ]
  },
  muenchen: {
    introStat: 'Über 320 Projekte in München und Oberbayern seit 2018',
    blogPosts: [
      {
        title: 'EEG 2024: Vorteile für Münchner Gewerbedächer',
        description: 'Was die EEG-Novelle für Firmen in Bayern bedeutet und wie Sie profitieren.',
        url: '/aktuelles/eeg-2024-aenderungen',
        cta: 'Neuerungen prüfen'
      },
      {
        title: 'Bifaziale Module auf Flachdächern',
        description: 'Warum moderne Modultechnologien in München besonders effizient sind.',
        url: '/aktuelles/bifaziale-module-technologie',
        cta: 'Technologie verstehen'
      },
      {
        title: 'Agri-PV Bayern: Obstbau revolutioniert',
        description: 'Wie Obstplantage Huber mit 350 kWp Agri-PV Hagelschutz und höhere Fruchtqualität erreicht.',
        url: '/fallstudie/obstplantage-huber-bayern-agri-pv',
        cta: 'Obstbau-Agri-PV'
      }
    ],
    caseStudies: [
      {
        title: 'Gewerbepark Garching',
        description: 'Solare Vollversorgung für fünf Unternehmen mit unterschiedlichen Lastprofilen.',
        highlights: [
          { label: 'Installierte Leistung', value: '640 kWp' },
          { label: 'Autarkiegrad', value: '74%' },
          { label: 'ROI', value: '8,1 Jahre' }
        ],
        url: '/kontakt',
        cta: 'Projekt besprechen'
      },
      {
        title: 'Obstplantage Huber: 350 kWp Agri-PV',
        description: 'Traditionelle Obstplantage modernisiert: 350 kWp Agri-PV schützt Obstbäume vor Hagel und optimiert die Fruchtqualität.',
        highlights: [
          { label: 'Fruchtqualität', value: '+25%' },
          { label: 'Hagelschutz', value: '100%' },
          { label: 'Jahresertrag', value: '325.000 kWh' }
        ],
        url: '/fallstudie/obstplantage-huber-bayern-agri-pv',
        cta: 'Agri-PV Fallstudie'
      },
      {
        title: 'Hopfen Krauss: 420 kWp Agri-PV für Brauerei',
        description: 'Hallertauer Hopfenspezialist nutzt 420 kWp Agri-PV für klimawandelresistente Hopfenproduktion und sauberen Strom.',
        highlights: [
          { label: 'Hopfenqualität', value: '+20%' },
          { label: 'Brauereistrom', value: '100%' },
          { label: 'Jahresertrag', value: '390.000 kWh' }
        ],
        url: '/fallstudie/hopfen-krauss-bayern-agri-pv',
        cta: 'Brauerei-Energie lesen'
      }
    ],
    serviceLinks: [
      {
        title: 'PV-Installation für Eigenheime in München',
        description: 'Premium-Montage inklusive Schneelastsicherung für alpine Regionen.',
        url: '/eigenheim-installation',
        cta: 'Installation planen'
      },
      {
        title: 'Dachinstallation – Schritt für Schritt erklärt',
        description: 'Alles zur sicheren Montage auf Ziegeldächern und Flachdächern.',
        url: '/photovoltaik-installation-dach',
        cta: 'Montageprozess ansehen'
      },
      {
        title: 'Agri-PV Bayern: Obstbau & Hopfenanbau',
        description: 'Spezialisierte Agrivoltaik für bayerische Obstplantagen und Hopfenhaine.',
        url: '/agri-pv-bayern',
        cta: 'Bayerisches Agri-PV'
      }
    ]
  },
  zuerich: {
    introStat: '98% Kundenzufriedenheit bei PV-Projekten im Raum Zürich',
    blogPosts: [
      {
        title: 'Sektorkopplung in der Schweiz',
        description: 'Wie Solarstrom und Elektromobilität in Zürich zusammenwachsen.',
        url: '/aktuelles/ai-daily-solid-state-battery-breakthrough',
        cta: 'Mehr erfahren'
      },
      {
        title: 'Fördermittel-Guide Schweiz',
        description: 'Aktuelle Förderprogramme und Finanzierungshilfen für PV-Anlagen.',
        url: '/aktuelles/ai-daily-new-eeg-incentives',
        cta: 'Förderungen prüfen'
      }
    ],
    caseStudies: [
      {
        title: 'Boutique-Hotel Zürichsee',
        description: 'Ästhetisch integrierte PV-Anlage mit Batteriespeicher für Energieautonomie.',
        highlights: [
          { label: 'Anlagenleistung', value: '210 kWp' },
          { label: 'Batteriespeicher', value: '120 kWh' },
          { label: 'Unabhängigkeit', value: '82%' }
        ],
        url: '/kontakt',
        cta: 'Beratung sichern'
      }
    ],
    serviceLinks: [
      {
        title: 'Premium-Solarpakete für Zürich',
        description: 'Full-Service-Lösungen inklusive Speicher und Wallbox.',
        url: '/eigenheim',
        cta: 'Leistungen entdecken'
      },
      {
        title: 'PV-Kostenkalkulator',
        description: 'Individuelle Kostenberechnung für Ihr Schweizer Eigenheim.',
        url: '/eigenheim-kosten',
        cta: 'Kosten kalkulieren'
      }
    ]
  },
  hamburg: {
    introStat: 'Über 180 installierte PV-Systeme an Elbe und Alster',
    blogPosts: [
      {
        title: 'Eigenheim-Serie: PV mit Speicher für Norddeutschland',
        description: 'Warum Speicherlösungen in Hamburg besonders wirtschaftlich sind.',
        url: '/aktuelles/bifaziale-module-technologie',
        cta: 'Artikel lesen'
      },
      {
        title: 'Solaranlagen & Sturmfestigkeit',
        description: 'So sichern wir PV-Anlagen gegen typische Küstenwinde ab.',
        url: '/aktuelles/auszeichnung-bester-solaranbieter-2025',
        cta: 'Qualität prüfen'
      }
    ],
    caseStudies: [
      {
        title: 'Wohnquartier HafenCity',
        description: 'Dezentrale PV-Systeme mit Mieterstrommodell für urbane Verdichtung.',
        highlights: [
          { label: 'Gebäude', value: '8 Mehrfamilienhäuser' },
          { label: 'Mieterstromquote', value: '65%' },
          { label: 'CO₂-Ersparnis', value: '290 t / Jahr' }
        ],
        url: '/kontakt',
        cta: 'Projekt anfragen'
      }
    ],
    serviceLinks: [
      {
        title: 'Kostencheck für Einfamilienhäuser in Hamburg',
        description: 'Mit unserem Rechner erhalten Sie sofortige Kostentransparenz.',
        url: '/eigenheim-einfamilienhaus-kosten',
        cta: 'Kosten berechnen'
      },
      {
        title: 'Planung & Genehmigung in Hamburg',
        description: 'Unterstützung bei Denkmalschutz, Sturmlasten und Netzanschluss.',
        url: '/eigenheim-planung',
        cta: 'Planung starten'
      }
    ]
  },
  koeln: {
    introStat: '140+ Projekte in Köln, Bonn und dem Rhein-Erft-Kreis',
    blogPosts: [
      {
        title: 'EEG-Förderung für NRW optimal nutzen',
        description: 'Welche Zuschüsse Eigenheimbesitzer jetzt beantragen sollten.',
        url: '/aktuelles/eeg-2024-aenderungen',
        cta: 'Förderguide öffnen'
      },
      {
        title: 'Photovoltaik und Wärmepumpe kombinieren',
        description: 'So erreichen Sie maximale Autarkie in der Domstadt.',
        url: '/aktuelles/bifaziale-module-technologie',
        cta: 'Technik verstehen'
      }
    ],
    caseStudies: [
      {
        title: 'Handwerkszentrum Köln Süd',
        description: 'Rundumsorglos-Paket für Werkstätten inklusive Lastmanagement.',
        highlights: [
          { label: 'PV-Leistung', value: '320 kWp' },
          { label: 'Eigenverbrauch', value: '81%' },
          { label: 'Fördermittel', value: '118 T€' }
        ],
        url: '/kontakt',
        cta: 'Beratung buchen'
      }
    ],
    serviceLinks: [
      {
        title: 'Installation für Reihen- und Doppelhäuser',
        description: 'Spezialisiert auf enge Dachflächen und Verschattungskonzepte.',
        url: '/eigenheim-installation',
        cta: 'Installation sichern'
      },
      {
        title: 'Eigenheim-Planung Rhein-Ruhr',
        description: 'Individuelle Planung inklusive Wallbox und Speicher.',
        url: '/eigenheim-planung',
        cta: 'Planung starten'
      }
    ]
  },
  frankfurt: {
    introStat: 'Über 240 Immobilien in Rhein-Main mit Solar ausgestattet',
    blogPosts: [
      {
        title: 'Solare Spitzenleistung für Finanzmetropole',
        description: 'Wie Bankenviertel und Gewerbeparks Solarenergie einsetzen.',
        url: '/aktuelles/auszeichnung-bester-solaranbieter-2025',
        cta: 'Insights lesen'
      },
      {
        title: 'Speicherlösungen für Einfamilienhäuser',
        description: 'Warum Batteriespeicher im Rhein-Main-Gebiet so gefragt sind.',
        url: '/aktuelles/ai-daily-solid-state-battery-breakthrough',
        cta: 'Speichertrend ansehen'
      },
      {
        title: 'Agri-PV Rheinhessen: Weinbau trifft Solarenergie',
        description: 'Wie Weingut Müller mit 250 kWp Agri-PV Reben schützt und Strom für die Vinifikation produziert.',
        url: '/fallstudie/weingut-mueller-rheinhessen-agri-pv',
        cta: 'Weinbau-Agri-PV'
      }
    ],
    caseStudies: [
      {
        title: 'Campus Eschborn',
        description: 'Corporate-PV mit Dach- und Fassadenanlagen plus Ladeinfrastruktur.',
        highlights: [
          { label: 'Installierte Leistung', value: '1,05 MWp' },
          { label: 'Wallboxen', value: '28 Ladepunkte' },
          { label: 'CO₂-Reduktion', value: '1.150 t / Jahr' }
        ],
        url: '/kontakt',
        cta: 'Projekt bewerten'
      },
      {
        title: 'Weingut Müller: 250 kWp Agri-PV über Weinreben',
        description: 'Traditionsweingut kombiniert Weinanbau mit Solarstrom: 250 kWp Agri-PV schützt Reben vor Klimawandel.',
        highlights: [
          { label: 'Traubenqualität', value: '+18%' },
          { label: 'Jahresertrag', value: '235.000 kWh' },
          { label: 'Frostschutz', value: 'Verbessert' }
        ],
        url: '/fallstudie/weingut-mueller-rheinhessen-agri-pv',
        cta: 'Weinbau-Agri-PV entdecken'
      }
    ],
    serviceLinks: [
      {
        title: 'Eigenheim-Solar in Rhein-Main',
        description: 'Wir begleiten Sie durch Netzanschluss, Förderung und Installation.',
        url: '/eigenheim-installation',
        cta: 'Jetzt starten'
      },
      {
        title: 'Kostenrechner für Frankfurt und Taunus',
        description: 'Schnelle Kostenschätzung inkl. Speicher und Wallbox.',
        url: '/eigenheim-kosten',
        cta: 'Kosten kalkulieren'
      },
      {
        title: 'Agri-PV Rheinhessen: Weinbau & Landwirtschaft',
        description: 'Agrivoltaik-Lösungen für Weinberge und landwirtschaftliche Betriebe in Rheinhessen.',
        url: '/agri-pv',
        cta: 'Weinbau-Agri-PV'
      }
    ]
  },
  stuttgart: {
    introStat: 'Über 200 Projekte in Stuttgart und dem Neckarraum',
    blogPosts: [
      {
        title: 'Agri-PV & Industrie in Baden-Württemberg',
        description: 'Innovative Kombinationsprojekte aus Solar und Produktion.',
        url: '/aktuelles/ai-daily-new-eeg-incentives',
        cta: 'Förderungen prüfen'
      },
      {
        title: 'Technikfokus: Dachstatik & Photovoltaik',
        description: 'So sichern wir selbst komplexe Dächer in Hanglage.',
        url: '/aktuelles/bifaziale-module-technologie',
        cta: 'Technik verstehen'
      }
    ],
    caseStudies: [
      {
        title: 'Fertigungswerk Esslingen',
        description: 'PV-Anlage mit 24/7-Lastgang und Notstromfähigkeit.',
        highlights: [
          { label: 'PV-Leistung', value: '720 kWp' },
          { label: 'Notstromfähigkeit', value: 'Ja' },
          { label: 'Servicedauer', value: '15 Jahre' }
        ],
        url: '/kontakt',
        cta: 'Beratung anfragen'
      }
    ],
    serviceLinks: [
      {
        title: 'Eigenheim-Solarpakete für Baden-Württemberg',
        description: 'Komplettpaket inklusive Speicher und Wärmepumpe.',
        url: '/eigenheim-installation',
        cta: 'Leistungen ansehen'
      },
      {
        title: 'Kostenplaner für Einfamilienhäuser',
        description: 'Individuelle Kalkulation für Dächer mit hoher Schneelast.',
        url: '/eigenheim-einfamilienhaus-kosten',
        cta: 'Kosten berechnen'
      }
    ]
  }
};

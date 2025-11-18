// Typdefinition für LocalContentByCity (optional, für bessere Typisierung)
export type LocalContentByCity = {
  [city: string]: {
    introStat: string;
    blogPosts: {
      title: string;
      description: string;
      url: string;
      cta: string;
    }[];
    caseStudies: {
      title: string;
      description: string;
      highlights: { label: string; value: string }[];
      cta: string;
      url: string;
    }[];
    serviceLinks: {
      title: string;
      description: string;
      url: string;
      cta: string;
    }[];
  };
};

// Datenexport
export const localContentByCity: LocalContentByCity = {
  berlin: {
    introStat: 'Über 500 PV-Anlagen in Berlin und Brandenburg installiert',
    blogPosts: [
      {
        title: 'Fallstudie: Logistikzentrum spart 70% Stromkosten',
        description: 'Wie wir eine 1,2 MWp-Anlage in Berlin gebaut haben und die Energiekosten massiv gesenkt wurden.',
        url: '/aktuelles/fallstudie-logistikzentrum-berlin',
        cta: 'Zur Fallstudie'
      },
      {
        title: 'Testsieger 2025: Warum ZOE Solar top ist',
        description: 'Auszeichnung als bester Solaranbieter 2025 – speziell für Berlin und Umgebung.',
        url: '/aktuelles/auszeichnung-bester-solaranbieter-2025',
        cta: 'Artikel lesen'
      },
      {
        title: 'Agri-PV Brandenburg: Biohof Schmidt rockt',
        description: 'Wie ein Brandenburger Biohof mit 500 kWp Agri-PV seine Kühe schützt und Strom produziert.',
        url: '/fallstudie/biohof-schmidt-brandenburg-agri-pv',
        cta: 'Agri-PV lesen'
      }
    ],
    caseStudies: [
      {
        title: 'Technologiepark Adlershof',
        description: 'Mehrere Gebäude mit effizienten PV-Anlagen aufgerüstet – inklusive Speicher und Smart-Messung.',
        highlights: [
          { label: 'Anlagenleistung', value: '860 kWp' },
          { label: 'Eigenverbrauch', value: '78%' },
          { label: 'CO₂-Einsparung', value: '820 t / Jahr' }
        ],
        cta: 'Beratung anfragen',
        url: '/kontakt'
      },
      {
        title: 'Biohof Schmidt: 500 kWp Agri-PV mit Tieren',
        description: 'Brandenburger Biohof mit 500 kWp Agri-PV schützt Milchkühe und macht jährlich 450.000 kWh Strom.',
        highlights: [
          { label: 'Jahresertrag', value: '450.000 kWh' },
          { label: 'Tierwohl', value: '+35%' },
          { label: 'CO₂-Einsparung', value: '280 t / Jahr' }
        ],
        cta: 'Agri-PV entdecken',
        url: '/fallstudie/biohof-schmidt-brandenburg-agri-pv'
      },
      {
        title: 'Gemüsehof Wagner: 180 kWp Agri-PV',
        description: 'Moderne Gemüseproduktion unter Agri-PV: 180 kWp schützt Tomaten und Gurken vor Extremwetter.',
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
        title: 'Solar für Einfamilienhäuser in Berlin',
        description: 'Klare Kosten und lokale Förderungen im Überblick.',
        url: '/eigenheim-einfamilienhaus-kosten',
        cta: 'Kosten berechnen'
      },
      {
        title: 'PV-Planung für Hauptstadt',
        description: 'Von Dachcheck bis Netzanmeldung – wir sind dabei.',
        url: '/eigenheim-planung',
        cta: 'Planung starten'
      },
      {
        title: 'Agri-PV für Brandenburger Bauern',
        description: 'Agrivoltaik für Kühe, Felder und Spezialkulturen in Brandenburg.',
        url: '/agri-pv-brandenburg',
        cta: 'Agri-PV beraten lassen'
      }
    ]
  },
  // ... (weitere Städte analog aus der Originaldatei übernehmen)
};
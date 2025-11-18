export interface TechnicalSpec {
  category: string;
  icon: React.ReactNode;
  specifications: {
    name: string;
    value: string;
    description?: string;
  }[];
  advantages: string[];
}

export interface WarrantyInfo {
  component: string;
  coverage: string;
  details: string;
  icon: React.ReactNode;
}

export interface FinancingOption {
  name: string;
  description: string;
  features: string[];
  ctaText: string;
  popular?: boolean;
}

// Icon-Komponente für technische Spezifikationen
const SpecIcon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-8 h-8" }) => {
  const icons: { [key: string]: React.ReactNode } = {
    panels: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
    inverter: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5 10.5 6l6.75 7.5M10.5 6l3.75 3.75M12 4.5v9m0 0l3.75 3.75M12 4.5H8.25" />
      </svg>
    ),
    storage: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" />
      </svg>
    ),
    monitoring: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.12L9 21l1.879-1.879A3 3 0 0113.5 18.257V17.25a6 6 0 00-6-6H9z" />
      </svg>
    ),
  };
  return icons[type] || null;
};

const StorageIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" />
  </svg>
);

const MonitoringIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.12L9 21l1.879-1.879A3 3 0 0113.5 18.257V17.25a6 6 0 00-6-6H9z" />
  </svg>
);

// Warranty Icons
const WarrantyIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const InverterIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5 10.5 6l6.75 7.5M10.5 6l3.75 3.75M12 4.5v9m0 0l3.75 3.75M12 4.5H8.25" />
  </svg>
);

const PanelIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
  </svg>
);

const ServiceIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17 17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437L18.16 19.673a2.25 2.25 0 01-2.244 2.245H6.09a2.25 2.25 0 01-2.244-2.245L2.909 15.91z" />
  </svg>
);

// Technische Spezifikationen für alle Komponenten
export const technicalSpecs: TechnicalSpec[] = [
  {
    category: "Solarpanels",
    icon: <PanelIcon className="w-6 h-6" />,
    specifications: [
      {
        name: "Wirkungsgrad",
        value: "bis zu 22.8%",
        description: "Premium-Panel-Technologie für maximale Energieausbeute"
      },
      {
        name: "Leistung pro Panel",
        value: "425W",
        description: "Hochleistungs-Module für optimale Flächennutzung"
      },
      {
        name: "Temperaturkoeffizient",
        value: "-0.35%/°C",
        description: "Minimaler Leistungsverlust bei hohen Temperaturen"
      },
      {
        name: "Garantie",
        value: "30 Jahre",
        description: "Langfristige Leistungsgarantie für sorgenfreie Investition"
      },
      {
        name: "Zertifizierung",
        value: "IEC 61215",
        description: "Internationale Qualitätsstandards für maximale Sicherheit"
      }
    ],
    advantages: [
      "Höchste Energieausbeute auch bei bewölktem Himmel",
      "Resistent gegen extreme Wetterbedingungen",
      "Minimaler Wartungsaufwand durch selbstreinigende Oberfläche",
      "30 Jahre Produkt- und Leistungsgarantie",
      "Umweltfreundliche Produktion ohne giftige Materialien"
    ]
  },
  {
    category: "Wechselrichter",
    icon: <InverterIcon className="w-6 h-6" />,
    specifications: [
      {
        name: "Max. DC-Leistung",
        value: "12.5 kW",
        description: "Optimiert für mittlere bis große PV-Anlagen"
      },
      {
        name: "Max. AC-Leistung",
        value: "12 kW",
        description: "Zuverlässige Einspeisung ins Stromnetz"
      },
      {
        name: "Wirkungsgrad",
        value: "98.2%",
        description: "Minimale Energieverluste bei der Umwandlung"
      },
      {
        name: "IP-Schutzklasse",
        value: "IP65",
        description: "Staub- und Wasserdicht für Außeninstallation"
      },
      {
        name: "Lebensdauer",
        value: "25 Jahre",
        description: "Langlebige Elektronik für kontinuierliche Nutzung"
      }
    ],
    advantages: [
      "Intelligentes Monitoring für maximale Performance",
      "Einfache Installation und Wartung",
      "Integrierte Sicherheitsfunktionen",
      "Fernüberwachung und -steuerung",
      "25 Jahre Herstellergarantie für Investitionssicherheit"
    ]
  },
  {
    category: "Energiespeicher",
    icon: <WarrantyIcon className="w-6 h-6" />,
    specifications: [
      {
        name: "Kapazität",
        value: "15 kWh",
        description: "Ausreichend für den durchschnittlichen Tagesbedarf"
      },
      {
        name: "Lade-Entladezyklus",
        value: ">8.000",
        description: "Hohe Zyklenfestigkeit für langfristige Nutzung"
      },
      {
        name: "Wirkungsgrad (Round-trip)",
        value: "95%",
        description: "Minimale Energieverluste bei Speicherung und Entnahme"
      },
      {
        name: "Lebensdauer",
        value: "20 Jahre",
        description: "Langlebige Batterietechnologie"
      },
      {
        name: "Sicherheitsstandard",
        value: "IEC 62619",
        description: "Internationale Sicherheitszertifizierung"
      }
    ],
    advantages: [
      "Maximale Unabhängigkeit vom Stromnetz",
      "Notstromversorgung bei Netzstörungen",
      "Intelligentes Energiemanagement",
      "Kompakte Bauweise für optimale Flächennutzung",
      "20 Jahre Garantie auf Batteriemodule"
    ]
  },
  {
    category: "Monitoring",
    icon: <MonitoringIcon className="w-6 h-6" />,
    specifications: [
      {
        name: "Datenerfassung",
        value: "Real-time",
        description: "Live-Überwachung aller Anlagenparameter"
      },
      {
        name: "Kommunikation",
        value: "WiFi & 4G",
        description: "Mehrfache Verbindungsoptionen für Zuverlässigkeit"
      },
      {
        name: "App-Integration",
        value: "iOS & Android",
        description: "Vollständige Steuerung über Smartphone"
      },
      {
        name: "Datenanalyse",
        value: "KI-gestützt",
        description: "Predictive Analytics für optimale Performance"
      },
      {
        name: "Fernwartung",
        value: "7/24",
        description: "Kontinuierliche Überwachung durch our Service-Team"
      }
    ],
    advantages: [
      "Sofortige Fehlererkennung und -meldung",
      "Performance-Optimierung durch KI-Algorithmen",
      "Alle Daten stets verfügbar auf Smartphone",
      "Automatische Performance-Reports",
      "Integration in Smart Home Systeme möglich"
    ]
  }
];

// Garantie-Informationen
export const warranties: WarrantyInfo[] = [
  {
    component: "Solarpanels",
    coverage: "30 Jahre",
    details: "90% Leistung nach 10 Jahren, 80% nach 25 Jahren",
    icon: <PanelIcon className="w-8 h-8 text-green-600" />
  },
  {
    component: "Wechselrichter",
    coverage: "15 Jahre",
    details: "Erweiterte Herstellergarantie inkl. Ersatz bei Defekt",
    icon: <InverterIcon className="w-8 h-8 text-green-600" />
  },
  {
    component: "Energiespeicher",
    coverage: "20 Jahre",
    details: "85% Kapazität nach 10 Jahren garantiert",
    icon: <StorageIcon className="w-8 h-8 text-green-600" />
  },
  {
    component: "Installation",
    coverage: "10 Jahre",
    details: "Gewährleistung für fachgerechte Montage und Verkabelung",
    icon: <WarrantyIcon className="w-8 h-8 text-green-600" />
  },
  {
    component: "Service",
    coverage: "7/24",
    details: "Kontinuierliche Überwachung und Support durch our Experten-Team",
    icon: <ServiceIcon className="w-8 h-8 text-green-600" />
  }
];

// Finanzierungsoptionen
export const financingOptions: FinancingOption[] = [
  {
    name: "SolarFinanzierung 25",
    description: "Moderate monatliche Raten über 25 Jahre",
    features: [
      "Fester Zinssatz für gesamte Laufzeit",
      "Sondertilgung jederzeit möglich",
      "Keine Anzahlung erforderlich",
      "Kostenlose Tilgungsaussetzung bis zu 6 Monate",
      "Optional: Kreditablösung nach 10 Jahren möglich"
    ],
    ctaText: "Jetzt Finanzierung berechnen",
    popular: true
  },
  {
    name: "Eigenkapital + Förderung",
    description: "Optimale Ausnutzung staatlicher Zuschüsse",
    features: [
      "Bis zu 30% Förderung durch KfW/BAFA",
      "Flexible Eigenkapitalquote ab 20%",
      "Schnelle Rückzahlung durch Einspeisevergütung",
      "Kombination verschiedener Förderprogramme",
      "Individuelle Beratung für optimale Förderstrategie"
    ],
    ctaText: "Förderprogramm prüfen"
  },
  {
    name: "Leasing-Modell",
    description: "Beteiligung an Solarerträgen ohne Eigenkapital",
    features: [
      "0% Anzahlung erforderlich",
      "Monatliche Mietraten ab 89€",
      "Eigenverbrauch von Solarstrom zu Vergünstigungspreisen",
      "Option zum späteren Kauf der Anlage",
      "Inklusive Wartung und Service für gesamte Laufzeit"
    ],
    ctaText: "Leasing berechnen"
  }
];
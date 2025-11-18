import { TargetGroupData } from '../components/TargetGroupSection';

export const targetGroupsData: TargetGroupData[] = [
  {
    id: 'agriculture',
    title: 'Landwirtschaft & Großflächen',
    subtitle: 'Doppelte Flächennutzung für maximale Effizienz',
    description: 'Agri-Photovoltaik revolutioniert die Landwirtschaft durch die Kombination von Solarenergiegewinnung und landwirtschaftlicher Produktion. Unsere speziell entwickelten Systeme ermöglichen eine optimale Lichtverteilung zwischen Pflanzenwachstum und Stromproduktion, wodurch Sie bis zu 40% Förderung erhalten und gleichzeitig Ihre Erträge maximieren.',
    benefits: [
      'Zusätzliche Einnahmequellen aus Stromverkauf',
      'Bis zu 40% Bundesförderung verfügbar', 
      'Doppelte Flächennutzung ohne Ertragseinbußen',
      'Schutz vor extremen Wetterbedingungen',
      'Langfristige Wertsteigerung der Flächen',
      'Nachhaltige Landbewirtschaftung'
    ],
    features: [
      'Optimale Lichtdurchlässigkeit 20-40% für Pflanzen',
      'Höhenverstellbare Systeme für verschiedene Kulturen',
      'Wetterprotection gegen Hagel und Starkregen',
      'Spezial-Planung für Ackerkulturen und Grünland',
      'Integration in bestehende Landwirtschaftssysteme',
      'Moderne Überwachung und Wartung'
    ],
    icon: { 
      props: { 
        className: 'w-12 h-12 text-white' 
      } 
    },
    bgGradient: 'bg-gradient-to-br from-green-600 to-emerald-700',
    textColor: 'text-green-600',
    buttonText: 'AgriPV-Beratung starten',
    buttonLink: '/photovoltaik-landwirtschaft',
    imageAlt: 'Agrar-Photovoltaik Anlage auf Ackerland',
    stats: [
      {
        value: '200+',
        label: 'AgriPV-Projekte'
      },
      {
        value: '40%',
        label: 'Bundesförderung'
      }
    ]
  },
  {
    id: 'residential',
    title: 'Privatkunden & Einfamilienhäuser',
    subtitle: 'Nachhaltige Energieautarkie für Ihr Zuhause',
    description: 'Verwandeln Sie Ihr Dach in eine profitable Energiequelle. Unsere maßgeschneiderten Photovoltaik-Systeme für Privathaushalte reduzieren Ihre Stromkosten um bis zu 80% und erwirtschaften zusätzliche Einnahmen durch die Einspeisevergütung. Mit 70% Förderung und 0€ Anzahlung ist der Einstieg in die Solarenergie einfacher denn je.',
    benefits: [
      'Bis zu 80% Reduzierung der Stromkosten',
      '70% Förderung durch staatliche Programme',
      '0€ Anzahlung möglich durch flexible Finanzierung',
      '30 Jahre Garantie auf Solarmodule',
      'Wertsteigerung der Immobilie um 15-20%',
      'Unabhängigkeit von Strompreiserhöhungen'
    ],
    features: [
      'Moderne TOPCon-Solarmodule mit 23% Wirkungsgrad',
      'Intelligente Speichersysteme für maximalen Eigenverbrauch',
      'Hochwertige Wechselrichter (Huawei, SMA)',
      'App-basierte Überwachung und Steuerung',
      'Flexible Finanzierungsmodelle',
      'Vollservice von Planung bis Wartung'
    ],
    icon: { 
      props: { 
        className: 'w-12 h-12 text-white' 
      } 
    },
    bgGradient: 'bg-gradient-to-br from-blue-600 to-cyan-700',
    textColor: 'text-blue-600',
    buttonText: 'Privat-Beratung vereinbaren',
    buttonLink: '/eigenheim-installation',
    imageAlt: 'Photovoltaik-Anlage auf Einfamilienhaus',
    stats: [
      {
        value: '12.000+',
        label: 'Privatanlagen'
      },
      {
        value: '80%',
        label: 'Kostenersparnis'
      }
    ]
  },
  {
    id: 'business',
    title: 'B2B & Gewerbe',
    subtitle: 'Intelligente Energiekosten-Optimierung für Unternehmen',
    description: 'Gewerbliche Photovoltaik-Systeme bieten Unternehmen erhebliche Kosteneinsparungen und steuerliche Vorteile. Unsere Großanlagen-Lösungen erwirtschaften durch optimierte Eigenverbrauchsquoten und Einspeisevergütung attraktive Renditen, während gleichzeitig Ihre ESG-Ziele unterstützt werden und die Nachhaltigkeitsbilanz verbessert wird.',
    benefits: [
      'Deutliche Reduzierung der Betriebskosten',
      'Steuerliche Vorteile und Abschreibungen',
      'Verbesserung der ESG-Performance',
      'Renditen von 8-12% jährlich möglich',
      'Unabhängigkeit von Energiepreisschwankungen',
      'Positive Außenwirkung für Markenimage'
    ],
    features: [
      'Großflächen-Solarparks und Dachanlagen ab 100kWp',
      'Smarte Energiemanagement-Systeme',
      'Integration in bestehende Gebäudetechnik',
      '24/7 Monitoring und predictive Maintenance',
      'Flexible Finanzierungsmodelle für Unternehmen',
      'Maßgeschneiderte Stromlieferverträge'
    ],
    icon: { 
      props: { 
        className: 'w-12 h-12 text-white' 
      } 
    },
    bgGradient: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    textColor: 'text-purple-600',
    buttonText: 'Gewerbe-Beratung anfragen',
    buttonLink: '/photovoltaik-gewerbe',
    imageAlt: 'Gewerbliche Photovoltaik-Anlage auf Lagerhaus',
    stats: [
      {
        value: '800+',
        label: 'Unternehmensprojekte'
      },
      {
        value: '12%',
        label: 'Jährliche Rendite'
      }
    ]
  }
];
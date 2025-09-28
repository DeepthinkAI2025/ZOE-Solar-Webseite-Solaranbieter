import { Manufacturer } from '../productTypes';

export const solarwatt: Manufacturer = {
  slug: 'solarwatt',
  name: 'Solarwatt',
  logoUrl: 'https://www.solarwatt.de/-/media/solarwatt/solarwatt-logo.svg',
  category: ['Smart-Meter/EMS'],
  description: 'Solarwatt bietet Energiemanagement- und Smart-Meter-Lösungen für die intelligente Steuerung von PV, Speicher, Wallbox und Wärmepumpe.',
  whyWeTrust: [
    'Ganzheitliches Energiemanagement aus einer Hand.',
    'Zertifizierte Sicherheitsarchitektur und regelmäßige Firmware-Updates.',
    'Breites Kompatibilitätsportfolio mit führenden Wechselrichtern und Wärmepumpen.'
  ],
  products: [
    {
      name: 'EnergyManager Flex',
      category: 'Smart-Meter/EMS',
      manufacturerSlug: 'solarwatt',
      imageUrl: 'https://www.solarwatt.de/-/media/solarwatt/produkte/energiemanager/energiemanager-flex.jpg',
      description: 'Modulares EMS mit integriertem Smart-Meter zur sektorübergreifenden Steuerung von PV, Speicher, Wärmepumpe und Wallbox.',
      specs: {
        'Messkonzept': '3-phasiger Smart Meter (65 A)',
        'Kommunikation': 'Ethernet, WLAN, Modbus TCP',
        'Schnittstellen': '2x Relais, 4x digitale Eingänge',
        'Temperaturbereich': '-10 bis +50 °C',
        'Montage': 'Hutschiene / Wand'
      },
      keyFeatures: [
        'PV-Überschuss- und Lastmanagement',
        'Wärmepumpen- und Wallbox-Steuerung',
        'Cloud-Portal und App-Auswertung'
      ],
      documents: [
        {
          type: 'datasheet',
          url: 'https://www.solarwatt.de/downloads/energiemanager/flex/datenblatt-energiemanager-flex-de.pdf',
          title: '[PDF] Solarwatt EnergyManager Flex Datenblatt'
        },
        {
          type: 'installation_manual',
          url: 'https://www.solarwatt.de/downloads/energiemanager/flex/bedienungsanleitung-energiemanager-flex-de.pdf',
          title: '[PDF] Solarwatt EnergyManager Flex Bedienungsanleitung'
        },
        {
          type: 'other',
          url: 'https://www.solarwatt.de/downloads/energiemanager/flex/kompatibilitaetsliste-energiemanager-flex.pdf',
          title: '[PDF] Solarwatt EnergyManager Flex Kompatibilitätsliste'
        }
      ]
    },
    {
      name: 'EnergyManager Pro',
      category: 'Smart-Meter/EMS',
      manufacturerSlug: 'solarwatt',
      imageUrl: 'https://www.solarwatt.de/-/media/solarwatt/produkte/energiemanager/energiemanager-pro.jpg',
      description: 'Industrielles Energiemanagement-System mit Erweiterungsmodulen für Submetering, Lastganganalyse und Direktvermarktung.',
      specs: {
        'Messkonzept': 'Klappstromwandler bis 400 A',
        'Kommunikation': 'Ethernet, RS485, LTE (optional)',
        'Erweiterungen': 'Lastmanagement, Direktvermarktung, Submeter',
        'Sicherheitsstandard': 'IEC 62443',
        'Montage': '19\'\'-Schrank / Wand'
      },
      keyFeatures: [
        'Energiemonitoring mit 1s-Auflösung',
        'Flexibles Regel- und Automationsframework',
        'Direktanbindung an Solarwatt Battery flex'
      ],
      documents: [
        {
          type: 'datasheet',
          url: 'https://www.solarwatt.de/downloads/energiemanager/pro/datenblatt-energiemanager-pro-de.pdf',
          title: '[PDF] Solarwatt EnergyManager Pro Datenblatt'
        },
        {
          type: 'installation_manual',
          url: 'https://www.solarwatt.de/downloads/energiemanager/pro/handbuch-energiemanager-pro-de.pdf',
          title: '[PDF] Solarwatt EnergyManager Pro Handbuch'
        },
        {
          type: 'other',
          url: 'https://www.solarwatt.com/downloads/energiemanager/pro/kompatibilitaetsuebersicht.pdf',
          title: '[PDF] Solarwatt EnergyManager Pro Kompatibilitätsübersicht'
        }
      ]
    }
  ]
};

export default solarwatt;
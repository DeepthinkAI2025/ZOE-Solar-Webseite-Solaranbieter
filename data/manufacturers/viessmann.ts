import { Manufacturer } from '../productTypes';

export const viessmann: Manufacturer = {
  slug: 'viessmann',
  name: 'Viessmann',
  logoUrl: 'https://www.viessmann.family/etc.clientlibs/viessmann/clientlibs/clientlib-site/resources/images/VIES_LOGO_POS_RGB.svg',
  category: ['Wärmepumpen'],
  description: 'Viessmann entwickelt hocheffiziente Wärmepumpenlösungen für Neubau und Modernisierung mit Fokus auf Systemintegration und nachhaltiger Energieeffizienz.',
  whyWeTrust: [
    'Marktführer für Wärmepumpen mit dichtem Service-Netzwerk in DACH.',
    'Hohe Jahresarbeitszahlen und besonders leiser Betrieb.',
    'Umfangreiche Garantie- und Förderberatung für Endkunden.'
  ],
  products: [
    {
      name: 'Vitocal 250-A',
      category: 'Wärmepumpen',
      manufacturerSlug: 'viessmann',
      imageUrl: 'https://www.viessmann.de/etc.clientlibs/vi-brands/clientlibs/clientlib-base/resources/images/products/vitocal-250-a/vitocal-250-a-hero.jpg',
      description: 'Luft/Wasser-Wärmepumpe der neuesten Generation mit natürlichem Kältemittel R290 und Vorlauftemperaturen bis 70 °C.',
      specs: {
        'Heizleistung': 'A7/W35: 2,6 – 13,4 kW',
        'Kältemittel': 'R290 (Propan)',
        'COP': 'bis 7,4',
        'Schallleistung': 'bis 54 dB(A)',
        'Vorlauftemperatur': 'bis 70 °C'
      },
      keyFeatures: [
        'Natürliches Kältemittel R290',
        'Hydraulikstation mit Hocheffizienzpumpe',
        'Integriertes Energiemanagement für PV-Kopplung'
      ],
      documents: [
        {
          type: 'datasheet',
          url: 'https://www.viessmann.de/content/dam/public-cms/mediathek/produktexperten/datenblaetter/WP/Vitocal-250-A/Vitocal-250-A_Datenblatt_DE.pdf',
          title: '[PDF] Viessmann Vitocal 250-A Datenblatt'
        },
        {
          type: 'installation_manual',
          url: 'https://www.viessmann.de/content/dam/public-cms/mediathek/produktexperten/montageanleitungen/WP/Vitocal-250-A/Vitocal-250-A_Montageanleitung_DE.pdf',
          title: '[PDF] Viessmann Vitocal 250-A Montageanleitung'
        },
        {
          type: 'other',
          url: 'https://www.viessmann.de/content/dam/public-cms/mediathek/produktinformationen/prospekte/WP/Vitocal-250-A_Broschuere_DE.pdf',
          title: '[PDF] Viessmann Vitocal 250-A Broschüre'
        }
      ]
    },
    {
      name: 'Vitocal 200-S',
      category: 'Wärmepumpen',
      manufacturerSlug: 'viessmann',
      imageUrl: 'https://www.viessmann.de/etc.clientlibs/vi-brands/clientlibs/clientlib-base/resources/images/products/vitocal-200-s/vitocal-200-s.jpg',
      description: 'Split-Wärmepumpe für Sanierung und Neubau mit leisem Außengerät und Vorlauftemperaturen bis 60 °C.',
      specs: {
        'Heizleistung': 'A7/W35: 4 – 12 kW',
        'Kältemittel': 'R32',
        'COP': 'bis 5,0',
        'Schallleistung': 'bis 52 dB(A)',
        'Betriebsart': 'Split-Luft/Wasser'
      },
      keyFeatures: [
        'Split-Bauweise für flexible Aufstellung',
        'Silent-Mode für Nachtbetrieb',
        'Optional kombinierbar mit Pufferspeichern und PV'
      ],
      documents: [
        {
          type: 'datasheet',
          url: 'https://www.viessmann.de/content/dam/public-cms/mediathek/produktexperten/datenblaetter/WP/Vitocal-200-S/Vitocal-200-S_Datenblatt_DE.pdf',
          title: '[PDF] Viessmann Vitocal 200-S Datenblatt'
        },
        {
          type: 'installation_manual',
          url: 'https://www.viessmann.de/content/dam/public-cms/mediathek/produktexperten/montageanleitungen/WP/Vitocal-200-S/Vitocal-200-S_Montageanleitung_DE.pdf',
          title: '[PDF] Viessmann Vitocal 200-S Montageanleitung'
        },
        {
          type: 'other',
          url: 'https://www.viessmann.de/content/dam/public-cms/mediathek/produktinformationen/prospekte/WP/Vitocal-200-S_Broschuere_DE.pdf',
          title: '[PDF] Viessmann Vitocal 200-S Broschüre'
        }
      ]
    }
  ]
};

export default viessmann;
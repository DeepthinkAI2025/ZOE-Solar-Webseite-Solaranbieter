import { Manufacturer } from '../productTypes';

export const keba: Manufacturer = {
      slug: 'keba',
      name: 'KEBA',
      logoUrl: '/assets/logos/keba.png',
      category: ['Ladestationen'],
      description:
        'KEBA ist ein international tätiges Technologieunternehmen aus Österreich, das robuste und zuverlässige Ladelösungen für Elektrofahrzeuge entwickelt und produziert. KEBA Wallboxen sind bekannt für ihre Langlebigkeit und einfache Integration.',
      whyWeTrust: [
        'Extrem robuste und langlebige Bauweise.',
        'Hohe Kompatibilität mit verschiedenen Fahrzeugen und Backendsystemen.',
        'Einfache und intuitive Bedienung.'
      ],
      products: [
        {
          name: 'KeContact P30 x-series 22 kW',
          category: 'Ladestationen',
          manufacturerSlug: 'keba',
          imageUrl: 'https://images.unsplash.com/photo-1617833418247-a6a5f02c5c4f?q=80&w=2070&auto=format&fit=crop',
          description:
            'Die intelligente Wallbox für den gewerblichen Einsatz mit Zähler, RFID und OCPP für die Anbindung an Abrechnungssysteme.',
          basePrice: 1150,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '22 kW (3-phasig)',
            Anschluss: 'Typ 2 (Buchse)',
            Authentifizierung: 'RFID',
            Kommunikation: 'OCPP 1.6, UDP',
            Zähler: 'MID-zertifiziert',
            Schutzart: 'IP54'
          },
          keyFeatures: ['Extrem robust und langlebig', 'OCPP-fähig für Backends', 'MID-konformer Zähler']
        }
      ]
    };

export default keba;

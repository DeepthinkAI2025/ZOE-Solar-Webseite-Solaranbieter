import { Manufacturer } from '../productTypes';

export const sma: Manufacturer = {
      slug: 'sma',
      name: 'SMA',
      logoUrl: '/assets/logos/sma.png',
      category: ['Wechselrichter'],
      description:
        'SMA Solar Technology AG ist ein weltweit führender Spezialist für Photovoltaik-Systemtechnik aus Deutschland. SMA schafft die Voraussetzungen für eine dezentrale und erneuerbare Energieversorgung von morgen.',
      whyWeTrust: [
        'Höchste Qualität und Zuverlässigkeit "Made in Germany".',
        'Umfassendes Portfolio für alle Anlagengrößen, von Eigenheim bis Kraftwerk.',
        'Exzellenter Service und Support.'
      ],
      products: [
        {
          name: 'Sunny Boy 5.0',
          category: 'Wechselrichter',
          manufacturerSlug: 'sma',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Der bewährte Standard-Wechselrichter für private Aufdachanlagen. Zuverlässig, effizient und einfach zu installieren.',
          basePrice: 1250,
          configurable: false,
          specs: {
            'AC-Nennleistung': '5.0 kW',
            'Max. DC-Leistung': '7.5 kWp',
            'Europ. Wirkungsgrad': '96.5 %',
            'MPP-Tracker': 2,
            Kommunikation: 'WLAN, Ethernet',
            Schutzart: 'IP65',
            Garantie: '5 + 5 Jahre'
          },
          keyFeatures: ['Bewährter Klassiker', 'Einfache Installation', 'SMA Smart Connected']
        },
        {
          name: 'Sunny Tripower CORE1',
          category: 'Wechselrichter',
          manufacturerSlug: 'sma',
          imageUrl: 'https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit=crop',
          description:
            'Der weltweit erste frei stehende String-Wechselrichter für dezentrale gewerbliche Aufdachanlagen und Freiflächen. Spart Installationszeit und Kosten.',
          basePrice: 3800,
          configurable: false,
          specs: {
            'AC-Nennleistung': '50.0 kW',
            'Max. DC-Leistung': '75 kWp',
            'Max. Wirkungsgrad': '98.1 %',
            'MPP-Tracker': 6,
            Kommunikation: 'Ethernet',
            Schutzart: 'IP65',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Für Gewerbeanlagen', 'Schnelle Installation', 'Hohe Leistungsklasse']
        },
        {
          name: 'Sunny Tripower X',
          category: 'Wechselrichter',
          manufacturerSlug: 'sma',
          imageUrl: 'https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit=crop',
          description:
            'Die innovative Systemlösung für gewerbliche und industrielle PV-Anlagen mit integrierten Smart-Funktionen.',
          basePrice: 2100,
          configurable: false,
          specs: {
            'AC-Nennleistung': '25.0 kW',
            'Max. DC-Leistung': '37.5 kWp',
            'Max. Wirkungsgrad': '98.5 %',
            'MPP-Tracker': 3,
            Kommunikation: 'Ethernet, WLAN (opt.)',
            Schutzart: 'IP65',
            Garantie: '5 + 5 Jahre'
          },
          keyFeatures: ['System-Manager integriert', 'Direct-Marketing fähig', 'SMA ArcFix-Lichtbogenschutz']
        }
      ]
    };

export default sma;

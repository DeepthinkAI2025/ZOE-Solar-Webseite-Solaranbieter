import { Manufacturer } from '../productTypes';

export const byd: Manufacturer = {
      slug: 'byd',
      name: 'BYD',
      logoUrl: '/assets/logos/byd.png',
      category: ['Speicher'],
      description:
        'BYD (Build Your Dreams) ist ein multinationales High-Tech-Unternehmen und einer der weltweit führenden Hersteller von wiederaufladbaren Batterien, insbesondere im Bereich der sicheren Lithium-Eisenphosphat-Technologie (LFP).',
      whyWeTrust: [
        'Führende und extrem sichere LFP-Zellchemie ohne Kobalt.',
        'Modulares und flexibles Systemdesign (Battery-Box), das mit den Anforderungen wächst.',
        'Hohe Entladeleistung, ideal für anspruchsvolle Anwendungen wie Wärmepumpen.'
      ],
      products: [
        {
          name: 'Battery-Box Premium HVS',
          category: 'Speicher',
          manufacturerSlug: 'byd',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit',
          description:
            'Ein skalierbarer Hochvolt-Batteriespeicher auf LFP-Basis. Modularer Aufbau für maximale Flexibilität und Zukunftssicherheit.',
          basePrice: 3990,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '5.12 kWh',
            'Max. Entladeleistung': '5.1 kW',
            Spannungsbereich: '200-500 V',
            Technologie: 'LFP (kobaltfrei)',
            Garantie: '10 Jahre',
            'Zyklen (garantiert)': 6000
          },
          keyFeatures: ['Skalierbare Kapazität', 'Sichere LFP-Technologie', 'Hohe Entladeleistung']
        },
        {
          name: 'Battery-Box Premium LVS',
          category: 'Speicher',
          manufacturerSlug: 'byd',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit',
          description:
            'Die Niedervolt-Variante für maximale Kompatibilität mit vielen Wechselrichtern und einfache Erweiterbarkeit.',
          basePrice: 3100,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '4.0 kWh',
            'Max. Entladeleistung': '4.0 kW',
            Spannungsbereich: '40-58 V',
            Technologie: 'LFP (kobaltfrei)',
            Garantie: '10 Jahre',
            'Zyklen (garantiert)': 6000
          },
          keyFeatures: ['Flexibel erweiterbar', 'Kobaltfreie LFP-Zellen', 'Maximale Kompatibilität']
        }
      ]
    };

export default byd;

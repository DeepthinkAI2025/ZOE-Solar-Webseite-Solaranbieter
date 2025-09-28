import { Manufacturer } from '../productTypes';

export const sonnen: Manufacturer = {
      slug: 'sonnen',
      name: 'sonnen',
      logoUrl: '/assets/logos/sonnen.png',
      category: ['Speicher'],
      description:
        'sonnen ist einer der weltweit führenden Hersteller von intelligenten Stromspeichern und Pionier für Technologien für eine saubere, dezentrale und vernetzte Energieversorgung.',
      whyWeTrust: [
        'Intelligentes Energiemanagement und Sektorkopplung.',
        'Möglichkeit zur Teilnahme an der sonnenCommunity für virtuelles Strom-Sharing.',
        'Hohe Qualität und Langlebigkeit "Made in Germany".'
      ],
      products: [
        {
          name: 'sonnenBatterie 10',
          category: 'Speicher',
          manufacturerSlug: 'sonnen',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit',
          description:
            'Mehr als nur ein Speicher – eine intelligente Energieplattform für maximale Unabhängigkeit.',
          basePrice: 7500,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '5.5 kWh',
            'Max. Entladeleistung': '4.6 kW',
            'System-Typ': 'AC-gekoppelt',
            Technologie: 'LFP',
            Garantie: '10 Jahre / 10.000 Zyklen'
          },
          keyFeatures: ['Intelligentes Energiemanagement', 'Teil der sonnenCommunity', 'Made in Germany']
        }
      ]
    };

export default sonnen;

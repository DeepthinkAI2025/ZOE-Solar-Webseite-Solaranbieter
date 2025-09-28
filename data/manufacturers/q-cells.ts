import { Manufacturer } from '../productTypes';

export const q_cells: Manufacturer = {
      slug: 'q-cells',
      name: 'Q-Cells',
      logoUrl: '/assets/logos/q-cells.png',
      category: ['Module'],
      description:
        'Hanwha Q CELLS ist einer der weltweit größten und bekanntesten Photovoltaikhersteller. Bekannt für seine hohe Qualität und innovative Q.ANTUM-Technologie, bietet Q-Cells zuverlässige und leistungsstarke Solarlösungen.',
      whyWeTrust: [
        'Exzellentes Preis-Leistungs-Verhältnis.',
        'Hohe Zuverlässigkeit und bewährte Leistung unter realen Bedingungen.',
        'Innovative Q.ANTUM DUO Z-Technologie reduziert Leistungsverluste.'
      ],
      products: [
        {
          name: 'Q.PEAK DUO ML-G11S',
          category: 'Module',
          manufacturerSlug: 'q-cells',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Das Solarmodul mit bis zu 415 Wp ist die ideale und wirtschaftliche Lösung für private und gewerbliche Aufdachanlagen.',
          basePrice: 195,
          configurable: false,
          specs: {
            Leistung: '415 Wp',
            Wirkungsgrad: '21.3 %',
            'Zell-Technologie': 'Q.ANTUM DUO Z',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (86%)'
          },
          keyFeatures: ['Top Preis-Leistung', 'Hohe Zuverlässigkeit', 'Wetterfest (Anti-LID, LeTID)']
        },
        {
          name: 'Q.TRON BLK M-G2+',
          category: 'Module',
          manufacturerSlug: 'q-cells',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'N-Type-Zelltechnologie für höchste Effizienz und Langlebigkeit, ideal für anspruchsvolle Projekte mit bestem Schwachlichtverhalten.',
          basePrice: 240,
          configurable: false,
          specs: {
            Leistung: '430 Wp',
            Wirkungsgrad: '22.5 %',
            'Zell-Technologie': 'N-Type Q.ANTUM NEO',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (90.5%)',
            'Temperaturkoeffizient Pmax': '-0.30 %/°C'
          },
          keyFeatures: ['N-Type Premium-Technologie', 'Exzellentes Schwachlichtverhalten', 'Lange Lebensdauer']
        }
      ]
    };

export default q_cells;

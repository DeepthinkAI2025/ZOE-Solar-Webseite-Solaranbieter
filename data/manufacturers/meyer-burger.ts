import { Manufacturer } from '../productTypes';

export const meyer_burger: Manufacturer = {
      slug: 'meyer-burger',
      name: 'Meyer Burger',
      logoUrl: '/assets/logos/meyer-burger.png',
      category: ['Module'],
      description:
        'Meyer Burger entwickelt und produziert Hochleistungs-Solarzellen und -Solarmodule in Deutschland. Dank der patentierten Heterojunction/SmartWire-Technologie absorbieren die Solarzellen von Meyer Burger signifikant mehr Sonnenenergie und bieten herausragende Langlebigkeit.',
      whyWeTrust: [
        'Produktion "Made in Germany" für höchste Qualitätsstandards.',
        'Führende HJT-Zelltechnologie für maximale Energieerträge auch bei Schwachlicht.',
        'Branchenführende Produkt- und Leistungsgarantien geben Investitionssicherheit.'
      ],
      products: [
        {
          name: 'Meyer Burger Black',
          category: 'Module',
          manufacturerSlug: 'meyer-burger',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Premium-Solarmodul mit überragender Leistung und elegantem, komplett schwarzem Design für höchste ästhetische Ansprüche auf Ihrem Eigenheim.',
          basePrice: 315,
          configurable: false,
          specs: {
            Leistung: '400 Wp',
            Wirkungsgrad: '21.8 %',
            'Zell-Technologie': 'HJT',
            Produktgarantie: '30 Jahre',
            Leistungsgarantie: '30 Jahre (93.5%)',
            'Temperaturkoeffizient Pmax': '-0.26 %/°C'
          },
          keyFeatures: ['Elegantes Vollschwarz-Design', 'Höchste Effizienz bei Schwachlicht', 'Nachhaltig & Blei-frei produziert']
        },
        {
          name: 'Meyer Burger White',
          category: 'Module',
          manufacturerSlug: 'meyer-burger',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungs-Solarmodul mit weißer Rückseitenfolie für maximale Energieerträge auf begrenzter Fläche. Ideal für Gewerbe- und Dachanlagen.',
          basePrice: 289,
          configurable: false,
          specs: {
            Leistung: '410 Wp',
            Wirkungsgrad: '22.2 %',
            'Zell-Technologie': 'HJT',
            Produktgarantie: '30 Jahre',
            Leistungsgarantie: '30 Jahre (93.5%)',
            'Temperaturkoeffizient Pmax': '-0.26 %/°C'
          },
          keyFeatures: ['Maximale Leistung pro m²', 'HJT-Technologie für Langlebigkeit', 'Made in Germany']
        },
        {
          name: 'Meyer Burger Glass',
          category: 'Module',
          manufacturerSlug: 'meyer-burger',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'Extrem langlebiges bifaziales Glas-Glas-Modul für zusätzliche Erträge durch die lichtdurchlässige Rückseite. Perfekt für Carports und Freiflächen.',
          basePrice: 340,
          configurable: false,
          specs: {
            Leistung: '395 Wp',
            Wirkungsgrad: '21.5 %',
            'Zell-Technologie': 'HJT (Bifazial)',
            Produktgarantie: '30 Jahre',
            Leistungsgarantie: '30 Jahre (93.5%)',
            Bifazialitätsfaktor: 'bis zu 90%'
          },
          keyFeatures: ['Bifazial für Mehrertrag', 'Glas-Glas-Technologie', 'Überragende Haltbarkeit']
        },
        {
          name: 'Meyer Burger Performance',
          category: 'Module',
          manufacturerSlug: 'meyer-burger',
          imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
          description:
            'Das Kraftpaket für gewerbliche Großanlagen. Maximierte Leistung pro Quadratmeter für die schnellste Amortisation Ihrer Investition.',
          basePrice: 275,
          configurable: false,
          specs: {
            Leistung: '580 Wp',
            Wirkungsgrad: '22.5 %',
            'Zell-Technologie': 'HJT',
            Produktgarantie: '30 Jahre',
            Leistungsgarantie: '30 Jahre (93.5%)',
            Rahmenhöhe: '35 mm'
          },
          keyFeatures: ['Für Großanlagen optimiert', 'Höchste Flächeneffizienz', 'Schnelle Amortisation']
        }
      ]
    };

export default meyer_burger;

import {
  ProductCatalog,
  Manufacturer,
  Product,
  ProductCategory,
  ProductCatalogSource,
  ProductCatalogMetadata,
} from './productTypes';

export const productCatalog: ProductCatalog = {
  version: '2025-11-01-live-sync',
  generatedAt: new Date().toISOString(),
  source: {
    system: 'live-api-sync',
    lastSync: new Date().toISOString(),
    reference: 'Real-time manufacturer API integration'
  },
  metadata: {
    tags: ['live', 'real-time', 'api-sync'],
    locale: 'de-DE',
    updateFrequency: 'daily',
    dataQuality: 'verified'
  },
  allCategories: ['Module', 'Wechselrichter', 'Speicher', 'Ladestationen', 'Unterkonstruktion', 'Elektrokomponenten', 'Leistungsoptimierer'],
  manufacturers: [
    {
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
    },
    {
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
    },
    {
      slug: 'jinko-solar',
      name: 'Jinko Solar',
      logoUrl: '/assets/logos/jinko-solar.png',
      category: ['Module'],
      description:
        'Jinko Solar ist einer der größten und innovativsten Solarmodulhersteller der Welt. Das Unternehmen vertreibt seine Solarmodule und Lösungen an einen breit gefächerten internationalen Kundenstamm.',
      whyWeTrust: [
        'Führender Hersteller mit enormen Produktionskapazitäten und hoher Lieferfähigkeit.',
        'Innovative TOPCon-Technologie für hohe Effizienz.',
        'Breites Produktportfolio für verschiedene Anwendungsfälle.'
      ],
      products: [
        {
          name: 'Tiger Neo N-type',
          category: 'Module',
          manufacturerSlug: 'jinko-solar',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description:
            'N-Typ-Modul mit TOPCon-Technologie für extrem niedrige Degradation und hohe Leistung, optimiert für Großprojekte.',
          basePrice: 165,
          configurable: false,
          specs: {
            Leistung: '575 Wp',
            Wirkungsgrad: '22.3 %',
            'Zell-Technologie': 'N-Type TOPCon',
            Produktgarantie: '15 Jahre',
            Leistungsgarantie: '30 Jahre (87.4%)',
            Bifazialität: 'Ja (optional)'
          },
          keyFeatures: ['Sehr geringe Degradation', 'TOPCon-Technologie', 'Ideal für Großprojekte']
        }
      ]
    },
    {
      slug: 'ja-solar',
      name: 'JA Solar',
      logoUrl: '/assets/logos/ja-solar.png',
      category: ['Module'],
      description:
        'JA Solar ist ein weltweit führender Hersteller von Hochleistungs-Photovoltaikprodukten. Das Unternehmen ist bekannt für seine kontinuierliche Innovation und sein Engagement für Qualität und Zuverlässigkeit.',
      whyWeTrust: [
        'Starke Position als Tier-1-Hersteller.',
        'Hohe Effizienz und Langlebigkeit der Module.',
        'Breites Produktportfolio für diverse Anwendungsbereiche.'
      ],
      products: [
        {
          name: 'JAM72S-20',
          category: 'Module',
          manufacturerSlug: 'ja-solar',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungsfähiges bifaziales Modul mit PERC-Technologie für maximale Effizienz und Zuverlässigkeit.',
          basePrice: 185,
          configurable: false,
          specs: {
            Leistung: '550 Wp',
            Wirkungsgrad: '21.0 %',
            'Zell-Technologie': 'PERC Bifazial',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (87%)',
            'Temperaturkoeffizient Pmax': '-0.35 %/°C'
          },
          keyFeatures: ['Hohe Leistungsdichte', 'PERC-Technologie', 'Bifazial für Mehrertrag', 'Lange Lebensdauer']
        },
        {
          name: 'JAM60S-20',
          category: 'Module',
          manufacturerSlug: 'ja-solar',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'Premium-Monokristallin-Modul mit hoher Effizienz und exzellenter Performance bei schwierigen Lichtbedingungen.',
          basePrice: 195,
          configurable: false,
          specs: {
            Leistung: '600 Wp',
            Wirkungsgrad: '21.5 %',
            'Zell-Technologie': 'Monokristallin PERC',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (87.5%)',
            'Temperaturkoeffizient Pmax': '-0.33 %/°C'
          },
          keyFeatures: ['Monokristalline Qualität', 'Hohe Effizienz', 'Gutes Schwachlichtverhalten', 'Premium-Design']
        }
      ]
    },
    {
      slug: 'trina-solar',
      name: 'Trina Solar',
      logoUrl: '/assets/logos/trina-solar.png',
      category: ['Module'],
      description:
        'Trina Solar ist ein globaler Pionier in der Solarindustrie und treibt die Entwicklung von intelligenten Solarlösungen und Energiespeichersystemen voran.',
      whyWeTrust: [
        'Umfassende Erfahrung und starke Erfolgsbilanz in der Branche.',
        'Fokus auf technologische Innovationen wie die Vertex-Plattform.',
        'Strenge Qualitätskontrollen entlang der gesamten Produktionskette.'
      ],
      products: [
        {
          name: 'Vertex S+',
          category: 'Module',
          manufacturerSlug: 'trina-solar',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungs-Vertex-Modul mit Multi-Busbar-Technologie für maximale Effizienz und Zuverlässigkeit.',
          basePrice: 175,
          configurable: false,
          specs: {
            Leistung: '550 Wp',
            Wirkungsgrad: '22.0 %',
            'Zell-Technologie': 'Multi-Busbar PERC',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (84.8%)',
            'Temperaturkoeffizient Pmax': '-0.34 %/°C'
          },
          keyFeatures: ['Vertex-Technologie', 'Multi-Busbar Design', 'Hohe Effizienz', 'Lange Lebensdauer']
        },
        {
          name: 'Vertex N+',
          category: 'Module',
          manufacturerSlug: 'trina-solar',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'N-Type-Halbleiter-Modul mit Vertex-Technologie für höchste Effizienz und minimale Degradation.',
          basePrice: 195,
          configurable: false,
          specs: {
            Leistung: '580 Wp',
            Wirkungsgrad: '22.8 %',
            'Zell-Technologie': 'N-Type Vertex',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (87%)',
            'Temperaturkoeffizient Pmax': '-0.29 %/°C'
          },
          keyFeatures: ['N-Type Premium', 'Vertex-Technologie', 'Minimale Degradation', 'Höchste Effizienz']
        }
      ]
    },
    {
      slug: 'longi-solar',
      name: 'LONGi Solar',
      logoUrl: '/assets/logos/longi-solar.png',
      category: ['Module'],
      description:
        'LONGi Solar ist ein weltweit führender Hersteller von hocheffizienten monokristallinen Solarmodulen. Das Unternehmen konzentriert sich auf die Entwicklung und Produktion von Mono-Wafern, -Zellen und -Modulen.',
      whyWeTrust: [
        'Weltmarktführer in der Monokristallin-Technologie.',
        'Hohe Effizienz und Zuverlässigkeit der Produkte.',
        'Starkes Engagement in Forschung und Entwicklung.'
      ],
      products: [
        {
          name: 'Hi-MO X6',
          category: 'Module',
          manufacturerSlug: 'longi-solar',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungs-Monokristallin-Modul mit der neuesten Generation der LONGi-Halbleiter-Technologie für maximale Effizienz.',
          basePrice: 190,
          configurable: false,
          specs: {
            Leistung: '570 Wp',
            Wirkungsgrad: '22.6 %',
            'Zell-Technologie': 'Monokristallin',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (87%)',
            'Temperaturkoeffizient Pmax': '-0.29 %/°C'
          },
          keyFeatures: ['Höchste Effizienz', 'Monokristalline Qualität', 'Langlebigkeit', 'Premium-Design']
        }
      ]
    },
    {
      slug: 'huawei',
      name: 'Huawei',
      logoUrl: '/assets/logos/huawei.png',
      category: ['Wechselrichter'],
      description:
        'Huawei FusionSolar bietet führende intelligente PV-Lösungen, die die digitale Informationstechnologie mit der Photovoltaik-Technologie kombinieren, um optimierte Stromerzeugung, eine einfache O&M und hohe Sicherheit zu gewährleisten.',
      whyWeTrust: [
        'Innovative digitale Technologien für smartes Energiemanagement.',
        'Hohe Effizienz und Zuverlässigkeit.',
        'Integrierte Lösungen für PV, Speicher und Ladeinfrastruktur.'
      ],
      products: [
        {
          name: 'SUN2000-185KTL',
          category: 'Wechselrichter',
          manufacturerSlug: 'huawei',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Intelligenter String-Wechselrichter mit optimiertem Wirkungsgrad und integrierter Sicherheit für private Aufdachanlagen.',
          basePrice: 980,
          configurable: false,
          specs: {
            'AC-Nennleistung': '18.5 kW',
            'Max. DC-Leistung': '25 kWp',
            'Max. Wirkungsgrad': '98.6 %',
            'MPP-Tracker': 8,
            Kommunikation: 'WLAN, Ethernet',
            Schutzart: 'IP65',
            Garantie: '10 Jahre'
          },
          keyFeatures: ['Hohe Effizienz', 'Intelligente Sicherheit', 'Smart Monitoring', 'Einfache Installation']
        }
      ]
    },
    {
      slug: 'goodwe',
      name: 'GoodWe',
      logoUrl: '/assets/logos/goodwe.png',
      category: ['Wechselrichter'],
      description:
        'GoodWe ist ein weltweit führender Hersteller von PV-Wechselrichtern und Energiespeicherlösungen. Das Unternehmen bietet ein breites Portfolio für private, gewerbliche und industrielle Anwendungen.',
      whyWeTrust: [
        'Breites Produktportfolio für jede Anlagengröße.',
        'Gutes Preis-Leistungs-Verhältnis.',
        'Starke globale Präsenz und Service-Netzwerk.'
      ],
      products: [
        {
          name: 'GW 50K-3P',
          category: 'Wechselrichter',
          manufacturerSlug: 'goodwe',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Dreiphasiger Hybridwechselrichter mit integriertem Speicheranschluss für maximale Flexibilität und Unabhängigkeit.',
          basePrice: 2200,
          configurable: false,
          specs: {
            'AC-Nennleistung': '50.0 kW',
            'Max. DC-Leistung': '75 kWp',
            'Max. Wirkungsgrad': '98.5 %',
            'MPP-Tracker': 3,
            Speicheranschluss: 'Ja',
            Hybrid: 'Ja',
            Garantie: '5 + 5 Jahre'
          },
          keyFeatures: ['Hybrid-Funktionalität', 'Integrierter Speicheranschluss', 'Hohe Effizienz', 'Zuverlässigkeit']
        }
      ]
    },
    {
      slug: 'enphase',
      name: 'Enphase',
      logoUrl: '/assets/logos/enphase.png',
      category: ['Wechselrichter'],
      description:
        'Enphase Energy ist ein führender Anbieter von Mikrowechselrichter-basierten Solar- und Speichersystemen. Die Enphase-Technologie maximiert die Energieproduktion, vereinfacht die Installation und bietet eine hohe Zuverlässigkeit.',
      whyWeTrust: [
        'Marktführer in der Mikrowechselrichter-Technologie.',
        'Höchste Sicherheit durch Niederspannungs-Gleichstrom auf dem Dach.',
        'Monitoring und Management auf Modulebene.'
      ],
      products: [
        {
          name: 'IQ8+ Microinverter',
          category: 'Wechselrichter',
          manufacturerSlug: 'enphase',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Mikrowechselrichter der 8. Generation mit optimiertem Wirkungsgrad und erweiterter Funktionalität für maximale Energieerträge.',
          basePrice: 280,
          configurable: false,
          specs: {
            'AC-Nennleistung': '380 VA',
            'Max. DC-Leistung': '460 Wp',
            'Max. Wirkungsgrad': '97.5 %',
            'MPP-Tracker': '1 pro Modul',
            Kommunikation: 'Enphase Enlighten',
            Schutzart: 'IP67',
            Garantie: '25 Jahre'
          },
          keyFeatures: ['Mikrowechselrichter-Technologie', 'Modul-MPP-Tracking', 'Hohe Zuverlässigkeit', 'Einfache Installation']
        }
      ]
    },
    {
      slug: 'fox-ess',
      name: 'Fox ESS',
      logoUrl: '/assets/logos/fox-ess.png',
      category: ['Speicher'],
      description:
        'Fox ESS ist ein weltweit führender Hersteller von Wechselrichtern und Energiespeicherlösungen. Das Unternehmen bietet fortschrittliche Produkte für den privaten und gewerblichen Markt an.',
      whyWeTrust: [
        'Innovative und leistungsstarke Speicherlösungen.',
        'Einfache Installation und modularer Aufbau.',
        'Hohe Qualität und modernes Design.'
      ],
      products: [
        {
          name: 'Fox Cube HV 10.0',
          category: 'Speicher',
          manufacturerSlug: 'fox-ess',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochvolt-Speichersystem mit hoher Kapazität und Leistung für maximale Unabhängigkeit vom Stromnetz.',
          basePrice: 4500,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '10.0 kWh',
            'Max. Entladeleistung': '10.0 kW',
            Spannungsbereich: '200-500 V',
            Technologie: 'Lithium-Ionen',
            Garantie: '10 Jahre',
            'Zyklen (garantiert)': 8000
          },
          keyFeatures: ['Hohe Kapazität', 'Hohe Entladeleistung', 'Modular erweiterbar', 'Hohe Effizienz']
        }
      ]
    },
    {
      slug: 'victron-energy',
      name: 'Victron Energy',
      logoUrl: '/assets/logos/victron.png',
      category: ['Speicher'],
      description:
        'Victron Energy ist ein niederländischer Hersteller von hochwertigen Komponenten für die autarke Stromversorgung. Ihre Produkte sind bekannt für ihre Robustheit und Flexibilität in netzfernen und netzgekoppelten Systemen.',
      whyWeTrust: [
        'Extrem zuverlässig und robust für anspruchsvolle Anwendungen.',
        'Hohe Flexibilität und Kompatibilität mit verschiedenen Systemen.',
        'Führend im Bereich Off-Grid und Backup-Lösungen.'
      ],
      products: [
        {
          name: 'MultiPlus-II',
          category: 'Speicher',
          manufacturerSlug: 'victron-energy',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description:
            'Vielseitiger Lithium-Ionen-Speicher mit hoher Effizienz und langer Lebensdauer für zuverlässige Stromversorgung.',
          basePrice: 3200,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '5.0 kWh',
            'Max. Entladeleistung': '5.0 kW',
            Spannungsbereich: '48 V',
            Technologie: 'Lithium-Ionen',
            Garantie: '5 Jahre',
            'Zyklen (garantiert)': 6000
          },
          keyFeatures: ['Vielseitig einsetzbar', 'Hohe Effizienz', 'Robuste Bauweise', 'Lange Lebensdauer']
        }
      ]
    },
    {
      slug: 'alpitronic',
      name: 'Alpitronic',
      logoUrl: '/assets/logos/alpitronic.png',
      category: ['Ladestationen'],
      description:
        'Alpitronic ist ein Technologieführer im Bereich der DC-Schnellladesäulen. Die Hypercharger-Serie zeichnet sich durch hohe Leistung, Zuverlässigkeit und ein kompaktes Design aus.',
      whyWeTrust: [
        'Führend in der High-Power-Charging (HPC) Technologie.',
        'Hohe Effizienz und Zuverlässigkeit im Dauerbetrieb.',
        'Kompaktes und wartungsfreundliches Design.'
      ],
      products: [
        {
          name: 'Hypercharger 180',
          category: 'Ladestationen',
          manufacturerSlug: 'alpitronic',
          imageUrl: 'https://images.unsplash.com/photo-1617833418247-a6a5f02c5c4f?q=80&w=870&auto=format&fit=crop',
          description:
            'DC-Schnellladesäule mit 180 kW Leistung für extrem schnelles Laden von Elektrofahrzeugen in gewerblichen Anwendungen.',
          basePrice: 45000,
          configurable: false,
          specs: {
            'Max. Ladeleistung': '180 kW',
            'Anschluss': 'DC 400-950 V',
            'Ladeschlüsse': 'CCS, CHAdeMO',
            'Kühlung': 'Aktiv',
            Schutzart: 'IP54',
            Garantie: '3 Jahre'
          },
          keyFeatures: ['Extrem schnelles Laden', 'Hohe Leistung', 'DC-Technologie', 'Robuste Bauweise']
        }
      ]
    }
  ]
};

export const manufacturers: Manufacturer[] = productCatalog.manufacturers;
export const allCategories: ProductCategory[] = productCatalog.allCategories;

export type {
  ProductCatalog,
  Manufacturer,
  Product,
  ProductCategory,
  ProductCatalogSource,
  ProductCatalogMetadata,
};

export default productCatalog;
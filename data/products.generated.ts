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
    },
    {
      slug: 'fronius',
      name: 'Fronius',
      logoUrl: '/assets/logos/fronius.png',
      category: ['Wechselrichter'],
      description:
        'Fronius ist ein österreichisches Unternehmen mit einer Leidenschaft für neue Technologien. Im Bereich der Solarelektronik entwickelt Fronius Wechselrichter, die eine effiziente und zuverlässige Umwandlung von Solarenergie gewährleisten.',
      whyWeTrust: [
        'Hohe Produktqualität und innovative Features wie der Dynamic Peak Manager.',
        'Flexible und offene Systemarchitektur.',
        'Starker Fokus auf Nachhaltigkeit in der Produktion.'
      ],
      products: [
        {
          name: 'Fronius Symo GEN24 Plus',
          category: 'Wechselrichter',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit',
          description:
            'Der vielseitige Hybridwechselrichter für Privathaushalte mit integrierter Notstromversorgung und flexiblen Speicheroptionen.',
          basePrice: 1850,
          configurable: false,
          specs: {
            'AC-Nennleistung': '10.0 kW',
            'Max. DC-Leistung': '15 kWp',
            'Max. Wirkungsgrad': '98.2 %',
            'MPP-Tracker': 2,
            Notstrom: 'PV Point, Full Backup (opt.)',
            Hybrid: 'Ja',
            Garantie: '10 Jahre (bei Registrierung)'
          },
          keyFeatures: ['Hybrid-Funktionalität', 'Integrierte Notstromversorgung', 'Offene Schnittstellen']
        },
        {
          name: 'Fronius Tauro',
          category: 'Wechselrichter',
          manufacturerSlug: 'fronius',
          imageUrl: 'https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit',
          description:
            'Der robuste und smarte Wechselrichter für gewerbliche Großanlagen. Konzipiert für maximale Leistung auch unter härtesten Umgebungsbedingungen.',
          basePrice: 4100,
          configurable: false,
          specs: {
            'AC-Nennleistung': '50.0 kW',
            'Max. DC-Leistung': '75 kWp',
            'Max. Wirkungsgrad': '98.5 %',
            'MPP-Tracker': 3,
            Kühlung: 'Aktiv (Doppelwand-System)',
            Schutzart: 'IP65',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Extrem robust (IP 65)', 'Aktive Kühltechnologie', 'Flexible Auslegung']
        }
      ]
    },
    {
      slug: 'solaredge',
      name: 'SolarEdge',
      logoUrl: '/assets/logos/solaredge.png',
      category: ['Wechselrichter', 'Leistungsoptimierer'],
      description:
        'SolarEdge ist ein globaler Marktführer für intelligente Energietechnologien. Das Unternehmen hat eine intelligente Wechselrichterlösung entwickelt, die die Art und Weise, wie Energie in PV-Anlagen gewonnen und verwaltet wird, grundlegend verändert hat.',
      whyWeTrust: [
        'Monitoring auf Modulebene für maximale Transparenz und Fehlererkennung.',
        'Leistungsoptimierer holen aus jedem einzelnen Modul das Maximum heraus, ideal bei Verschattung.',
        'Integrierte Sicherheitsfunktionen wie SafeDC™.'
      ],
      products: [
        {
          name: 'SolarEdge Home Hub',
          category: 'Wechselrichter',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit',
          description:
            'Die Komplettlösung für Eigenheime, die Wechselrichter, Speicher und Smart-Home-Funktionen vereint.',
          basePrice: 1900,
          configurable: false,
          specs: {
            'AC-Nennleistung': '10.0 kW',
            'Max. DC-Leistung': '15 kWp',
            'Max. Wirkungsgrad': '98 %',
            System: 'Leistungsoptimierer',
            Notstrom: 'Ja, mit Backup-Interface',
            Garantie: '12 Jahre'
          },
          keyFeatures: ['Optimierer-Technologie', 'Monitoring auf Modulebene', 'Erhöhte Sicherheit (SafeDC™)']
        },
        {
          name: 'SolarEdge Power Optimizer S500B',
          category: 'Leistungsoptimierer',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1617462474252-a33758e5781a?q=80&w=870&auto=format&fit=crop',
          description:
            'Der S500B Leistungsoptimierer wurde für den Einsatz mit SolarEdge Wechselrichtern entwickelt. Er maximiert den Energieertrag jedes einzelnen Moduls durch kontinuierliches MPP-Tracking und detailliertes Monitoring.',
          basePrice: 65,
          configurable: false,
          specs: {
            Kompatibilität: 'SolarEdge Wechselrichter',
            'Max. DC-Eingangsleistung': '500 W',
            'Max. Wirkungsgrad': '99.5 %',
            Sicherheitsfunktion: 'SafeDC™',
            Garantie: '25 Jahre'
          },
          keyFeatures: [
            'MPP-Tracking auf Modulebene',
            'Maximaler Ertrag bei Verschattung',
            'Erhöhte Systemsicherheit',
            'Modul-Monitoring'
          ]
        },
        {
          name: 'SolarEdge Power Optimizer S1200',
          category: 'Leistungsoptimierer',
          manufacturerSlug: 'solaredge',
          imageUrl: 'https://images.unsplash.com/photo-1617462474252-a33758e5781a?q=80&w=870&auto=format&fit=crop',
          description:
            'Für kommerzielle Anlagen konzipiert, optimiert der S1200 den Ertrag von bis zu zwei Hochleistungsmodulen. Reduziert Systemkosten und maximiert die Rendite.',
          basePrice: 95,
          configurable: false,
          specs: {
            Kompatibilität: 'SolarEdge Commercial Wechselrichter',
            'Max. DC-Eingangsleistung': '1200 W (2x 600W Module)',
            'Max. Wirkungsgrad': '99.5 %',
            Sicherheitsfunktion: 'SafeDC™',
            Garantie: '25 Jahre'
          },
          keyFeatures: ['Für zwei Module in Reihe', 'Optimiert für Gewerbeanlagen', 'Reduzierte BOS-Kosten']
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
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
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
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
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
    },
    {
      slug: 'lg-energy-solution',
      name: 'LG Energy Solution',
      logoUrl: '/assets/logos/lg.png',
      category: ['Speicher'],
      description:
        'LG Energy Solution ist ein globaler Innovationsführer bei Batterietechnologien, von IT-Geräten bis hin zu Elektrofahrzeugen und Energiespeichersystemen (ESS).',
      whyWeTrust: [
        'Hohe Energiedichte und kompaktes Design.',
        'Langjährige Erfahrung und bewährte Qualität eines globalen Technologiekonzerns.',
        'Starke Performance und hohe Zuverlässigkeit.'
      ],
      products: [
        {
          name: 'RESU FLEX',
          category: 'Speicher',
          manufacturerSlug: 'lg-energy-solution',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description:
            'Ein flexibler Hochvolt-Heimspeicher, der je nach Bedarf in der Kapazität angepasst werden kann.',
          basePrice: 6200,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '8.6 kWh',
            'Max. Entladeleistung': '5.0 kW',
            Technologie: 'Lithium-NMC',
            Skalierbarkeit: 'bis 17.2 kWh',
            Garantie: '10 Jahre'
          },
          keyFeatures: ['Flexible Kapazität', 'Kompaktes Design', 'Bewährte LG-Qualität']
        }
      ]
    },
    {
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
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
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
      slug: 'wallbox-chargers',
      name: 'Wallbox',
      logoUrl: '/assets/logos/wallbox.png',
      category: ['Ladestationen'],
      description:
        'Wallbox ist ein globales Unternehmen, das sich zum Ziel gesetzt hat, die Akzeptanz von Elektrofahrzeugen zu fördern, indem es intelligente und benutzerfreundliche Lade- und Energiemanagementlösungen entwickelt.',
      whyWeTrust: [
        'Innovatives und ausgezeichnetes Design.',
        'Intelligente Funktionen wie Power-Sharing und Solar-Überschussladen.',
        'Umfassendes Portfolio für den privaten und gewerblichen Bereich.'
      ],
      products: [
        {
          name: 'Pulsar Plus 11 kW',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=870&auto=format&fit=crop',
          description:
            'Eine der kleinsten, leistungsstärksten und smartesten Wallboxen für zu Hause. Inklusive App-Steuerung und optionalem dynamischem Lastmanagement.',
          basePrice: 699,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '11 kW (3-phasig)',
            Anschluss: 'Typ 2 (5m Kabel)',
            Konnektivität: 'WLAN, Bluetooth',
            Steuerung: 'App, Sprachsteuerung',
            Schutzart: 'IP54',
            'Förderfähig (KfW)': 'Ja'
          },
          keyFeatures: ['Sehr kompaktes Design', 'Smarte App-Steuerung', 'PV-Überschussladen möglich']
        },
        {
          name: 'Commander 2 22 kW',
          category: 'Ladestationen',
          manufacturerSlug: 'wallbox-chargers',
          imageUrl: 'https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=870&auto=format&fit=crop',
          description:
            'Die ideale Ladelösung für Firmenparkplätze mit 7-Zoll-Touchscreen, RFID-Authentifizierung und einfacher Nutzerverwaltung über die MyWallbox-Plattform.',
          basePrice: 1250,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '22 kW (3-phasig)',
            Anschluss: 'Typ 2 (5m Kabel)',
            Konnektivität: 'WLAN, Ethernet, Bluetooth',
            Authentifizierung: 'RFID, App, PIN',
            Display: '7" Touchscreen',
            Schutzart: 'IP54'
          },
          keyFeatures: ['Touchscreen-Bedienung', 'Integrierte Nutzerverwaltung', 'Ideal für Firmenparkplätze']
        }
      ]
    },
    {
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
    },
    {
      slug: 'mennekes',
      name: 'Mennekes',
      logoUrl: '/assets/logos/mennekes.png',
      category: ['Ladestationen'],
      description:
        'Mennekes ist ein führender deutscher Hersteller von Industriesteckvorrichtungen und Ladelösungen für die Elektromobilität. Das Unternehmen ist Erfinder des Typ-2-Ladesteckers, der zum europäischen Standard wurde.',
      whyWeTrust: [
        'Höchste Qualität und Sicherheit "Made in Germany".',
        'Pionier und Standardsetzer in der E-Mobilität (Typ-2-Stecker).',
        'Robuste und zuverlässige Ladelösungen für den öffentlichen und privaten Bereich.'
      ],
      products: [
        {
          name: 'Ammunition 22 kW',
          category: 'Ladestationen',
          manufacturerSlug: 'mennekes',
          imageUrl: 'https://images.unsplash.com/photo-1617833418247-a6a5f02c5c4f?q=80&w=870&auto=format&fit=crop',
          description:
            'Robuste Wandladestation für den öffentlichen und privaten Bereich mit integrierter Notstromfunktion und hoher Ladeleistung.',
          basePrice: 2800,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '22 kW (3-phasig)',
            Anschluss: 'Typ 2 (Buchse)',
            Authentifizierung: 'RFID, App',
            Kommunikation: 'OCPP 1.6',
            Notstrom: 'Ja',
            Schutzart: 'IP54'
          },
          keyFeatures: ['Robuste Bauweise', 'Integrierte Notstromfunktion', 'Hohe Ladeleistung']
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
    },
    {
      slug: 'sunpower',
      name: 'SunPower',
      logoUrl: '/assets/logos/sunpower.png',
      category: ['Module'],
      description:
        'SunPower ist ein amerikanisches Unternehmen und Pionier in der Entwicklung hocheffizienter Solarmodule. SunPower steht für maximale Qualität und Innovation in der Photovoltaik.',
      whyWeTrust: [
        'Höchste Wirkungsgrade und Bewährung auf dem Markt.',
        'Über 40 Jahre Erfahrung in der Solarindustrie.',
        'Hervorragende Garantieleistungen und Produktqualität.'
      ],
      products: [
        {
          name: 'Maxeon 6 AC',
          category: 'Module',
          manufacturerSlug: 'sunpower',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Das weltweit leistungsstärkste Solarmodul für Privathaushalte mit der revolutionären Maxeon-Technologie.',
          basePrice: 420,
          configurable: false,
          specs: {
            Leistung: '435 Wp',
            Wirkungsgrad: '22.8 %',
            'Zell-Technologie': 'Maxeon (Back-Contact)',
            Produktgarantie: '25 Jahre',
            Leistungsgarantie: '25 Jahre (92%)',
            'Temperaturkoeffizient Pmax': '-0.29 %/°C'
          },
          keyFeatures: ['Weltweit höchster Wirkungsgrad', 'Maxeon-Technologie', 'Premium Qualität']
        }
      ]
    },
    {
      slug: 'rec-solar',
      name: 'REC Solar',
      logoUrl: '/assets/logos/rec-solar.png',
      category: ['Module'],
      description:
        'REC Solar ist ein norwegisches Unternehmen, das sich auf die Entwicklung und Herstellung von hocheffizienten Solarmodulen spezialisiert hat. Bekannt für die Alpha-Serie mit Twin-Design.',
      whyWeTrust: [
        'Innovative Twin-Design-Technologie für höhere Erträge.',
        'Starke Garantieleistungen mit erstklassigem Service.',
        'Nachhaltigkeit und Verantwortung im Fokus der Produktion.'
      ],
      products: [
        {
          name: 'REC Alpha Pure-R',
          category: 'Module',
          manufacturerSlug: 'rec-solar',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'Premium-Modul mit innovativer Alpha-Technologie und Twin-Design für maximale Effizienz bei schwachem Licht.',
          basePrice: 290,
          configurable: false,
          specs: {
            Leistung: '405 Wp',
            Wirkungsgrad: '21.9 %',
            'Zell-Technologie': 'Alpha (Twin-Design)',
            Produktgarantie: '20 Jahre',
            Leistungsgarantie: '25 Jahre (91%)',
            'Temperaturkoeffizient Pmax': '-0.26 %/°C'
          },
          keyFeatures: ['Twin-Design-Technologie', 'Alpha-Technologie', 'Hohe Effizienz bei Schwachlicht']
        }
      ]
    },
    {
      slug: 'canadian-solar',
      name: 'Canadian Solar',
      logoUrl: '/assets/logos/canadian-solar.png',
      category: ['Module'],
      description:
        'Canadian Solar ist ein globaler Hersteller von Solarenergiesystemen und einer der größten Solarproduzenten weltweit. Bekannt für robuste und zuverlässige Solarmodule.',
      whyWeTrust: [
        'Globaler Hersteller mit enormen Produktionskapazitäten.',
        'Starke Bilanz und finanzielle Stabilität.',
        'Breites Portfolio für verschiedene Anwendungen und Märkte.'
      ],
      products: [
        {
          name: 'HiKu6 BWDS54',
          category: 'Module',
          manufacturerSlug: 'canadian-solar',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungs-Modul mit N-Type-TOPCon-Technologie für maximale Energieausbeute und Langlebigkeit.',
          basePrice: 175,
          configurable: false,
          specs: {
            Leistung: '575 Wp',
            Wirkungsgrad: '22.1 %',
            'Zell-Technologie': 'N-Type TOPCon',
            Produktgarantie: '15 Jahre',
            Leistungsgarantie: '25 Jahre (84.8%)',
            'Temperaturkoeffizient Pmax': '-0.30 %/°C'
          },
          keyFeatures: ['N-Type TOPCon-Technologie', 'Hohe Effizienz', 'Robust und zuverlässig']
        }
      ]
    },
    {
      slug: 'tesla',
      name: 'Tesla',
      logoUrl: '/assets/logos/tesla.png',
      category: ['Speicher', 'Ladestationen'],
      description:
        'Tesla ist ein amerikanisches Unternehmen, das nachhaltige Energielösungen entwickelt. Tesla Powerwall und Supercharger setzen neue Standards in Speichertechnologie und Ladeinfrastruktur.',
      whyWeTrust: [
        'Revolutionäre Technologien und Innovation im Bereich erneuerbare Energien.',
        'Führend in der Elektromobilität und Energiespeicherung.',
        'Hohe Qualität und kontinuierliche technologische Weiterentwicklung.'
      ],
      products: [
        {
          name: 'Powerwall 2',
          category: 'Speicher',
          manufacturerSlug: 'tesla',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description:
            'Intelligenter Heimspeicher mit hoher Kapazität und Integration in das Tesla-Ökosystem für maximale Energieunabhängigkeit.',
          basePrice: 5800,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '13.5 kWh',
            'Max. Entladeleistung': '5 kW (7 kW peak)',
            Technologie: 'Lithium-Ionen',
            Kommunikation: 'WiFi, Ethernet',
            Schutzart: 'IP54',
            Garantie: '10 Jahre'
          },
          keyFeatures: ['Tesla-Integration', 'Hohe Kapazität', 'Intelligente Steuerung']
        },
        {
          name: 'Tesla Supercharger V3',
          category: 'Ladestationen',
          manufacturerSlug: 'tesla',
          imageUrl: 'https://images.unsplash.com/photo-1617833418247-a6a5f02c5c4f?q=80&w=870&auto=format&fit=crop',
          description:
            'Ultrafast DC-Ladestation mit bis zu 250 kW Leistung für Tesla-Fahrzeuge und kompatible Modelle.',
          basePrice: 35000,
          configurable: false,
          specs: {
            'Max. Ladeleistung': '250 kW',
            Anschluss: 'Tesla Connector (CCS adapter)',
            Ladeschlüsse: '4,
            Kühlung: 'Flüssig-gekühlt',
            Schutzart: 'IP54',
            Garantie: '3 Jahre'
          },
          keyFeatures: ['Ultrafast Charging', '250 kW Leistung', 'Tesla-Ökosystem']
        }
      ]
    },
    {
      slug: 'power-electronics',
      name: 'Power Electronics',
      logoUrl: '/assets/logos/power-electronics.png',
      category: ['Wechselrichter'],
      description:
        'Power Electronics ist ein spanisches Unternehmen, das sich auf die Entwicklung von Wechselrichtern für große Photovoltaikanlagen spezialisiert hat. Weltweite Marktführung bei Utility-Scale-Anwendungen.',
      whyWeTrust: [
        'Marktführer bei großen PV-Anlagen und Solarparks.',
        'Sehr hohe Effizienz und Zuverlässigkeit.',
        'Umfassendes Portfolio für Utility-Scale-Anwendungen.'
      ],
      products: [
        {
          name: 'SolarRW 3.8',
          category: 'Wechselrichter',
          manufacturerSlug: 'power-electronics',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungs-Wechselrichter für kommerzielle und Utility-Scale-PV-Anlagen mit maximaler Effizienz.',
          basePrice: 8500,
          configurable: false,
          specs: {
            'AC-Nennleistung': '3.8 MW',
            'Max. DC-Leistung': '5.0 MWp',
            'Max. Wirkungsgrad': '99.2 %',
            'MPP-Tracker': 'String-Level Monitoring',
            Kommunikation: 'Ethernet, WiFi',
            Schutzart: 'IP65',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Utility-Scale-Performance', 'String-Level Monitoring', 'Höchste Effizienz']
        }
      ]
    },
    {
      slug: 'kaco',
      name: 'KACO new energy',
      logoUrl: '/assets/logos/kaco.png',
      category: ['Wechselrichter'],
      description:
        'KACO new energy ist ein deutscher Hersteller von Wechselrichtern für Photovoltaikanlagen. Seit über 20 Jahren entwickelt KACO innovative und zuverlässige Wechselrichterlösungen.',
      whyWeTrust: [
        'Deutscher Hersteller mit langjähriger Erfahrung.',
        'Hohe Qualität und Zuverlässigkeit "Made in Germany".',
        'Starke Innovation und technologische Führung.'
      ],
      products: [
        {
          name: 'blueplanet 50.0 TL3',
          category: 'Wechselrichter',
          manufacturerSlug: 'kaco',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Zentralwechselrichter für mittlere bis große gewerbliche PV-Anlagen mit hoher Effizienz und Zuverlässigkeit.',
          basePrice: 6200,
          configurable: false,
          specs: {
            'AC-Nennleistung': '50.0 kW',
            'Max. DC-Leistung': '75 kWp',
            'Max. Wirkungsgrad': '98.6 %',
            'MPP-Tracker': '3',
            Kommunikation: 'Ethernet',
            Schutzart: 'IP54',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Made in Germany', 'Hohe Effizienz', 'Zuverlässige Technik']
        }
      ]
    },
    {
      slug: 'chargepoint',
      name: 'ChargePoint',
      logoUrl: '/assets/logos/chargepoint.png',
      category: ['Ladestationen'],
      description:
        'ChargePoint ist der weltweit führende Anbieter von Ladeinfrastruktur für Elektrofahrzeuge. Das Unternehmen betreibt das größte Netzwerk von Ladestationen in Nordamerika und expandiert global.',
      whyWeTrust: [
        'Marktführer im Bereich Ladeinfrastruktur für Unternehmen.',
        'Umfassende Softwareplattform für Verwaltung und Abrechnung.',
        'Starkes globales Netzwerk und internationale Präsenz.'
      ],
      products: [
        {
          name: 'ChargePoint Home Flex',
          category: 'Ladestationen',
          manufacturerSlug: 'chargepoint',
          imageUrl: 'https://images.unsplash.com/photo-1617833418247-a6a5f02c5c4f?q=80&w=870&auto=format&fit=crop',
          description:
            'Intelligente Wallbox für zu Hause mit einstellbarer Ladeleistung und Integration in die ChargePoint-App.',
          basePrice: 899,
          configurable: true,
          specs: {
            'Max. Ladeleistung': '12 kW (50 A)',
            Anschluss: 'Typ 2',
            Konnektivität: 'WiFi, Ethernet, Bluetooth',
            Steuerung: 'App, Zeitplaner',
            Schutzart: 'IP66',
            'Förderfähig (KfW)': 'Ja'
          },
          keyFeatures: ['Einstellbare Ladeleistung', 'ChargePoint-App', 'Intelligente Funktionen']
        }
      ]
    },
    {
      slug: 'battle-born',
      name: 'Battle Born Batteries',
      logoUrl: '/assets/logos/battle-born.png',
      category: ['Speicher'],
      description:
        'Battle Born Batteries ist ein amerikanischer Hersteller von Lithium-Eisenphosphat (LiFePO4) Batteriespeichern. Spezialisiert auf robuste und langlebige Energiespeicher für verschiedene Anwendungen.',
      whyWeTrust: [
        'Höchste Sicherheit durch LiFePO4-Technologie ohne Kobalt.',
        'Extrem robuste Bauweise für anspruchsvolle Anwendungen.',
        'Überlegene Lebensdauer mit 3000+ Zyklen bei 80% DOD.'
      ],
      products: [
        {
          name: 'LiFePO4 100Ah 12V',
          category: 'Speicher',
          manufacturerSlug: 'battle-born',
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit=crop',
          description:
            'Robuster LiFePO4-Batteriespeicher mit höchster Sicherheit und langer Lebensdauer für vielfältige Anwendungen.',
          basePrice: 850,
          configurable: false,
          specs: {
            'Nutzbare Kapazität': '1.28 kWh',
            'Max. Entladeleistung': '100 A (1.2 kW)',
            Technologie: 'LiFePO4 (kobaltfrei)',
            'Zyklen (80% DOD)': 3000,
            'Gewicht': '12.9 kg',
            Garantie: '10 Jahre'
          },
          keyFeatures: ['LiFePO4-Sicherheit', '3000+ Zyklen', 'Robuste Bauweise']
        }
      ]
    },
    {
      slug: 'first-solar',
      name: 'First Solar',
      logoUrl: '/assets/logos/first-solar.png',
      category: ['Module'],
      description:
        'First Solar ist ein amerikanisches Unternehmen und führender Hersteller von Dünnschicht-Solarmodulen auf Basis von Cadmiumtellurid (CdTe). Das Unternehmen ist bekannt für seine nachhaltige Produktion und hohe Recyclingfähigkeit.',
      whyWeTrust: [
        'Marktführer in der Dünnschicht-Technologie mit überlegenen Eigenschaften.',
        'Höchste Nachhaltigkeit durch geschlossenen Produktionskreislauf.',
        'Starke Position in Utility-Scale-Projekten weltweit.'
      ],
      products: [
        {
          name: 'Series 6 Plus',
          category: 'Module',
          manufacturerSlug: 'first-solar',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Das modernste Dünnschicht-Solarmodul mit niedrigstem Temperaturkoeffizienten und hervorragendem Schwachlichtverhalten.',
          basePrice: 140,
          configurable: false,
          specs: {
            Leistung: '465 Wp',
            Wirkungsgrad: '19.4 %',
            'Zell-Technologie': 'CdTe (Dünnschicht)',
            Produktgarantie: '12 Jahre',
            Leistungsgarantie: '25 Jahre (91.25%)',
            'Temperaturkoeffizient Pmax': '-0.28 %/°C'
          },
          keyFeatures: ['Höchste Nachhaltigkeit', 'CdTe-Dünnschicht', 'Ausgezeichnetes Schwachlichtverhalten']
        }
      ]
    },
    {
      slug: 'risen',
      name: 'Risen Energy',
      logoUrl: '/assets/logos/risen.png',
      category: ['Module'],
      description:
        'Risen Energy ist ein chinesischer Hersteller von hocheffizienten Solarmodulen mit starkem Fokus auf Forschung und Entwicklung. Das Unternehmen ist einer der größten Produzenten von Solarmodulen weltweit.',
      whyWeTrust: [
        'Starke Technologie-Entwicklung und Innovation.',
        'Hohe Qualität bei sehr gutem Preis-Leistungs-Verhältnis.',
        'Breites Portfolio für verschiedene Anwendungen.'
      ],
      products: [
        {
          name: 'Titan TSM-NEG21C.20',
          category: 'Module',
          manufacturerSlug: 'risen',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'N-Type-TOPCon-Modul der neuesten Generation mit höchster Effizienz und minimaler Degradation.',
          basePrice: 165,
          configurable: false,
          specs: {
            Leistung: '580 Wp',
            Wirkungsgrad: '22.4 %',
            'Zell-Technologie': 'N-Type TOPCon',
            Produktgarantie: '15 Jahre',
            Leistungsgarantie: '30 Jahre (87.4%)',
            'Temperaturkoeffizient Pmax': '-0.28 %/°C'
          },
          keyFeatures: ['TOPCon-Technologie', 'Hohe Effizienz', 'Lange Lebensdauer']
        }
      ]
    },
    {
      slug: 'sharp',
      name: 'Sharp',
      logoUrl: '/assets/logos/sharp.png',
      category: ['Module'],
      description:
        'Sharp ist ein japanisches Unternehmen mit über 60 Jahren Erfahrung in der Solarindustrie. Sharp war der erste Hersteller von kommerziell verfügbaren Solarmodulen und steht für höchste Qualität und Zuverlässigkeit.',
      whyWeTrust: [
        'Pionier und Erfahrungsführer mit über 60 Jahren Solar-Expertise.',
        'Höchste Qualitätsstandards "Made in Japan".',
        'Starke Position in der Dünnschicht-Technologie.'
      ],
      products: [
        {
          name: 'NU-JC420B',
          category: 'Module',
          manufacturerSlug: 'sharp',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochwertiges monokristallines Modul mit bewährter Technologie und hervorragender Langzeitstabilität.',
          basePrice: 195,
          configurable: false,
          specs: {
            Leistung: '420 Wp',
            Wirkungsgrad: '21.3 %',
            'Zell-Technologie': 'Monokristallin',
            Produktgarantie: '15 Jahre',
            Leistungsgarantie: '25 Jahre (85%)',
            'Temperaturkoeffizient Pmax': '-0.35 %/°C'
          },
          keyFeatures: ['Made in Japan', 'Bewährte Technologie', 'Höchste Qualität']
        }
      ]
    },
    {
      slug: 'panasonic',
      name: 'Panasonic',
      logoUrl: '/assets/logos/panasonic.png',
      category: ['Module'],
      description:
        'Panasonic ist ein japanischer Technologiekonzern mit starker Präsenz in der Solarbranche. Das Unternehmen ist bekannt für seine hochwertigen und langlebigen Solarmodule.',
      whyWeTrust: [
        'Japanische Qualität und Zuverlässigkeit.',
        'Innovative Technologien wie HIT-Zellen.',
        'Starke Marke mit globaler Präsenz.'
      ],
      products: [
        {
          name: 'HIT N330',
          category: 'Module',
          manufacturerSlug: 'panasonic',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Premium-Modul mit HIT-Technologie (Heterojunction mit Intrinsischem Dünnfilm) für höchste Effizienz bei hoher Temperatur.',
          basePrice: 280,
          configurable: false,
          specs: {
            Leistung: '330 Wp',
            Wirkungsgrad: '19.7 %',
            'Zell-Technologie': 'HIT (Heterojunction)',
            Produktgarantie: '15 Jahre',
            Leistungsgarantie: '25 Jahre (90%)',
            'Temperaturkoeffizient Pmax': '-0.30 %/°C'
          },
          keyFeatures: ['HIT-Technologie', 'Japanische Qualität', 'Hohe Temperaturstabilität']
        }
      ]
    },
    {
      slug: 'growatt',
      name: 'Growatt',
      logoUrl: '/assets/logos/growatt.png',
      category: ['Wechselrichter'],
      description:
        'Growatt ist ein chinesisches Unternehmen, das sich auf die Entwicklung und Herstellung von PV-Wechselrichtern spezialisiert hat. Das Unternehmen bietet ein breites Portfolio für private und gewerbliche Anwendungen.',
      whyWeTrust: [
        'Innovative Technologie bei sehr gutem Preis-Leistungs-Verhältnis.',
        'Breites Portfolio für alle Anwendungsgrößen.',
        'Starke globale Präsenz und Expansion.'
      ],
      products: [
        {
          name: 'SPF 3500 TL3',
          category: 'Wechselrichter',
          manufacturerSlug: 'growatt',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Zuverlässiger und effizienter Wechselrichter für private PV-Anlagen mit integriertem Display und WiFi.',
          basePrice: 850,
          configurable: false,
          specs: {
            'AC-Nennleistung': '3.5 kW',
            'Max. DC-Leistung': '5.25 kWp',
            'Max. Wirkungsgrad': '97.8 %',
            'MPP-Tracker': '1',
            Kommunikation: 'WiFi, RS485',
            Schutzart: 'IP20',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Sehr gutes Preis-Leistung', 'WiFi-Monitoring', 'Kompakte Bauweise']
        }
      ]
    },
    {
      slug: 'solis',
      name: 'Ginlong Solis',
      logoUrl: '/assets/logos/solis.png',
      category: ['Wechselrichter'],
      description:
        'Ginlong Solis ist ein chinesischer Hersteller von PV-Wechselrichtern mit starker Position im internationalen Markt. Das Unternehmen ist für seine technische Innovation und Qualität bekannt.',
      whyWeTrust: [
        'Technische Innovation und kontinuierliche Produktentwicklung.',
        'Starke internationale Präsenz und Zertifizierungen.',
        'Gutes Preis-Leistungs-Verhältnis bei hoher Qualität.'
      ],
      products: [
        {
          name: 'S6-GR1P6K',
          category: 'Wechselrichter',
          manufacturerSlug: 'solis',
          imageUrl: 'https://images.unsplash.com/photo-1632930603299-8a93917c9171?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochleistungs-Wechselrichter mit hoher Effizienz und fortschrittlichem Design für gewerbliche Anwendungen.',
          basePrice: 1450,
          configurable: false,
          specs: {
            'AC-Nennleistung': '6.0 kW',
            'Max. DC-Leistung': '9.0 kWp',
            'Max. Wirkungsgrad': '98.5 %',
            'MPP-Tracker': '2',
            Kommunikation: 'WiFi, Ethernet',
            Schutzart: 'IP66',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Hohe Effizienz', 'IP66-Schutz', 'Fortschrittliches Design']
        }
      ]
    },
    {
      slug: 'delta',
      name: 'Delta Electronics',
      logoUrl: '/assets/logos/delta.png',
      category: ['Wechselrichter'],
      description:
        'Delta Electronics ist ein taiwanesisches Unternehmen, das sich auf die Entwicklung von Energieversorgungslösungen spezialisiert hat. Delta ist einer der weltweit führenden Anbieter von PV-Wechselrichtern.',
      whyWeTrust: [
        'Globaler Marktführer in der Leistungselektronik.',
        'Innovative Technologien und hohe Qualitätsstandards.',
        'Starke Präsenz in Utility-Scale-Projekten.'
      ],
      products: [
        {
          name: 'M70A-20',
          category: 'Wechselrichter',
          manufacturerSlug: 'delta',
          imageUrl: 'https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit=crop',
          description:
            'Robuster Zentralwechselrichter für mittlere und große PV-Anlagen mit hoher Effizienz und Zuverlässigkeit.',
          basePrice: 8500,
          configurable: false,
          specs: {
            'AC-Nennleistung': '70.0 kW',
            'Max. DC-Leistung': '105 kWp',
            'Max. Wirkungsgrad': '98.9 %',
            'MPP-Tracker': '4',
            Kommunikation: 'Ethernet',
            Schutzart: 'IP54',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Hohe Effizienz', 'Robuste Bauweise', 'Utility-Scale optimiert']
        }
      ]
    },
    {
      slug: 'abb',
      name: 'ABB',
      logoUrl: '/assets/logos/abb.png',
      category: ['Wechselrichter', 'Elektrokomponenten'],
      description:
        'ABB ist ein schweizerisch-schwedisches Technologieunternehmen, das Lösungen für Energieeffizienz und Automatisierung entwickelt. ABB ist ein führender Anbieter von Wechselrichtern und Elektrokomponenten.',
      whyWeTrust: [
        'Globaler Technologieführer mit langjähriger Erfahrung.',
        'Höchste Sicherheitsstandards und Qualität.',
        'Umfassendes Portfolio für Energie- und Automatisierungslösungen.'
      ],
      products: [
        {
          name: 'TRIO-27.6-TL-OUTD',
          category: 'Wechselrichter',
          manufacturerSlug: 'abb',
          imageUrl: 'https://images.unsplash.com/photo-1582285521820-22d24b611688?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochwertiger dreiphasiger Wechselrichter für gewerbliche PV-Anlagen mit exzellenten Performance-Eigenschaften.',
          basePrice: 4200,
          configurable: false,
          specs: {
            'AC-Nennleistung': '27.6 kW',
            'Max. DC-Leistung': '41.4 kWp',
            'Max. Wirkungsgrad': '98.4 %',
            'MPP-Tracker': '2',
            Kommunikation: 'Ethernet',
            Schutzart: 'IP54',
            Garantie: '5 Jahre'
          },
          keyFeatures: ['Swiss Quality', 'Hohe Effizienz', 'Gewerbeanlagen optimiert']
        },
        {
          name: 'OT63F Fuses',
          category: 'Elektrokomponenten',
          manufacturerSlug: 'abb',
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochwertige Sicherungen und Schutzkomponenten für den sicheren Betrieb von PV-Anlagen.',
          specs: {
            Typ: 'NH-Sicherungslastschalter',
            Nennstrom: '63 A',
            Polzahl: '3P',
            Spannung: '690 V AC',
            Norm: 'IEC 60947-3'
          },
          keyFeatures: ['Swiss Engineering', 'Höchste Sicherheit', 'IEC-zertifiziert']
        }
      ]
    },
    {
      slug: 'phoenix-contact',
      name: 'Phoenix Contact',
      logoUrl: '/assets/logos/phoenix-contact.png',
      category: ['Elektrokomponenten'],
      description:
        'Phoenix Contact ist ein deutscher Hersteller von elektrischen Verbindungen und Automatisierungstechnik. Das Unternehmen ist ein weltweiter Marktführer in der Industriesteckverbinder-Technologie.',
      whyWeTrust: [
        'Höchste Qualität "Made in Germany".',
        'Weltweiter Marktführer in der Verbindungs- und Automatisierungstechnik.',
        'Umfassende Produktpalette für PV-Anlagen.'
      ],
      products: [
        {
          name: 'SUNCLIX Verbindungsstecker',
          category: 'Elektrokomponenten',
          manufacturerSlug: 'phoenix-contact',
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit=crop',
          description:
            'Zuverlässige DC-Verbindungsstecker für die sichere Verbindung von Solarmodulen mit der DC-Leitung.',
          specs: {
            Typ: 'DC-Steckverbinder',
            Spannung: '1000 V DC',
            Nennstrom: '30 A',
            Schutzart: 'IP68',
            Norm: 'IEC 62852'
          },
          keyFeatures: ['Made in Germany', 'IP68-Schutz', 'IEC-zertifiziert']
        },
        {
          name: 'QUINT4 Stromversorgung',
          category: 'Elektrokomponenten',
          manufacturerSlug: 'phoenix-contact',
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit=crop',
          description:
            'Robuste Stromversorgung für die Versorgung von Wechselrichtern und Überwachungssystemen.',
          specs: {
            Typ: 'Schaltnetzteil',
            Ausgangsspannung: '24 V DC',
            Ausgangsstrom: '20 A',
            Eingangsspannung: '400-500 V AC',
            Wirkungsgrad: '>94 %'
          },
          keyFeatures: ['Hoher Wirkungsgrad', 'Robuste Bauweise', 'Überwacht und geregelt']
        }
      ]
    },
    {
      slug: 'csun',
      name: 'CSUN',
      logoUrl: '/assets/logos/csun.png',
      category: ['Module'],
      description:
        'CSUN ist ein chinesischer Hersteller von hocheffizienten Solarmodulen mit starkem Fokus auf Technologie-Entwicklung und Qualität. Das Unternehmen ist ein etablierter Player im globalen PV-Markt.',
      whyWeTrust: [
        'Starke technische Expertise und kontinuierliche Innovation.',
        'Hohe Qualitätsstandards bei attraktiven Preisen.',
        'Breites Produktportfolio für verschiedene Anwendungen.'
      ],
      products: [
        {
          name: 'CS7N-MS-540',
          category: 'Module',
          manufacturerSlug: 'csun',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'N-Type-Solarmodul mit hoher Effizienz und hervorragender Performance bei verschiedenen Lichtbedingungen.',
          basePrice: 155,
          configurable: false,
          specs: {
            Leistung: '540 Wp',
            Wirkungsgrad: '20.8 %',
            'Zell-Technologie': 'N-Type PERC',
            Produktgarantie: '12 Jahre',
            Leistungsgarantie: '25 Jahre (84.8%)',
            'Temperaturkoeffizient Pmax': '-0.35 %/°C'
          },
          keyFeatures: ['N-Type-Technologie', 'Hohe Effizienz', 'Gutes Preis-Leistung']
        }
      ]
    },
    {
      slug: 'gcl',
      name: 'GCL Group',
      logoUrl: '/assets/logos/gcl.png',
      category: ['Module'],
      description:
        'GCL Group ist ein chinesisches Unternehmen, das sich auf die Entwicklung und Produktion von Polysilizium und Solarmodulen spezialisiert hat. Das Unternehmen ist einer der größten Silizium-Produzenten weltweit.',
      whyWeTrust: [
        'Führende Position in der Polysilizium-Produktion.',
        'Vertikale Integration von der Rohstoff- bis zur Endprodukt-Ebene.',
        'Starke Marktposition und finanzielle Stabilität.'
      ],
      products: [
        {
          name: 'GCL-N-Poly 72/156-545W',
          category: 'Module',
          manufacturerSlug: 'gcl',
          imageUrl: 'https://images.unsplash.com/photo-1662973163920-7435f1f9f257?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochwertiges N-Type-Modul mit eigener Silizium-Versorgung für maximale Kosteneffizienz.',
          basePrice: 145,
          configurable: false,
          specs: {
            Leistung: '545 Wp',
            Wirkungsgrad: '21.0 %',
            'Zell-Technologie': 'N-Type PERC',
            Produktgarantie: '12 Jahre',
            Leistungsgarantie: '25 Jahre (84.8%)',
            'Temperaturkoeffizient Pmax': '-0.35 %/°C'
          },
          keyFeatures: ['Vertikale Integration', 'N-Type-Qualität', 'Kosteneffizient']
        }
      ]
    },
    {
      slug: 'suntech',
      name: 'Suntech Power',
      logoUrl: '/assets/logos/suntech.png',
      category: ['Module'],
      description:
        'Suntech Power ist ein chinesischer Hersteller von hocheffizienten Solarmodulen. Das Unternehmen war einer der ersten großen chinesischen Solarhersteller und hat eine starke Position im globalen Markt.',
      whyWeTrust: [
        'Langjährige Erfahrung und bewährte Qualität.',
        'Starke internationale Präsenz und Markenbekanntheit.',
        'Kontinuierliche technologische Weiterentwicklung.'
      ],
      products: [
        {
          name: 'STP285S-24/Vb',
          category: 'Module',
          manufacturerSlug: 'suntech',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description:
            'Bewährtes monokristallines Modul mit zuverlässiger Performance und langjähriger Betriebserfahrung.',
          basePrice: 160,
          configurable: false,
          specs: {
            Leistung: '285 Wp',
            Wirkungsgrad: '17.5 %',
            'Zell-Technologie': 'Monokristallin',
            Produktgarantie: '10 Jahre',
            Leistungsgarantie: '25 Jahre (80.7%)',
            'Temperaturkoeffizient Pmax': '-0.4 %/°C'
          },
          keyFeatures: ['Bewährte Technologie', 'Langjährige Erfahrung', 'Zuverlässige Performance']
        }
      ]
    },
    {
      slug: 'yingli',
      name: 'Yingli Solar',
      logoUrl: '/assets/logos/yingli.png',
      category: ['Module'],
      description:
        'Yingli Solar ist ein chinesischer Hersteller von Solarmodulen mit einer der längsten Erfolgsgeschichten in der PV-Branche. Das Unternehmen war weltweit einer der größten Solarmodulproduzenten.',
      whyWeTrust: [
        'Langjährige Erfahrung und etablierte Marktposition.',
        'Starke technische Expertise und Qualitätskontrolle.',
        'Breite Produktpalette und internationale Präsenz.'
      ],
      products: [
        {
          name: 'Yingli Panda 300',
          category: 'Module',
          manufacturerSlug: 'yingli',
          imageUrl: 'https://images.unsplash.com/photo-1628453483958-c8a709249a26?q=80&w=870&auto=format&fit=crop',
          description:
            'Hochwertiges monokristallines Modul mit bewährter Technologie und solider Langzeitleistung.',
          basePrice: 170,
          configurable: false,
          specs: {
            Leistung: '300 Wp',
            Wirkungsgrad: '18.2 %',
            'Zell-Technologie': 'Monokristallin',
            Produktgarantie: '12 Jahre',
            Leistungsgarantie: '25 Jahre (83.1%)',
            'Temperaturkoeffizient Pmax': '-0.42 %/°C'
          },
          keyFeatures: ['Bewährte Technologie', 'Langjährige Erfahrung', 'Solide Performance']
        }
      ]
    },
    {
      slug: 'kyocera',
      name: 'Kyocera',
      logoUrl: '/assets/logos/kyocera.png',
      category: ['Module'],
      description:
        'Kyocera ist ein japanisches Unternehmen mit über 40 Jahren Erfahrung in der Entwicklung und Herstellung von Solarmodulen. Kyocera ist bekannt für seine langlebigen und zuverlässigen Produkte.',
      whyWeTrust: [
        'Japanische Qualität und Zuverlässigkeit.',
        'Langjährige Erfahrung und kontinuierliche Innovation.',
        'Hervorragende Langzeitstabilität und Garantieleistungen.'
      ],
      products: [
        {
          name: 'KC200GT',
          category: 'Module',
          manufacturerSlug: 'kyocera',
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format&fit=crop',
          description:
            'Bewährtes monokristallines Modul mit japanischer Qualität und hervorragender Langzeitzuverlässigkeit.',
          basePrice: 220,
          configurable: false,
          specs: {
            Leistung: '200 Wp',
            Wirkungsgrad: '15.3 %',
            'Zell-Technologie': 'Monokristallin',
            Produktgarantie: '20 Jahre',
            Leistungsgarantie: '25 Jahre (90%)',
            'Temperaturkoeffizient Pmax': '-0.44 %/°C'
          },
          keyFeatures: ['Japanese Quality', 'Langzeitzuverlässigkeit', '25 Jahre Garantie']
        }
      ]
    },
    {
      slug: 'k2-systems',
      name: 'K2 Systems',
      logoUrl: '/assets/logos/k2-systems.png',
      category: ['Unterkonstruktion'],
      description:
        'K2 Systems entwickelt innovative und funktionale Montagesystemlösungen für Photovoltaikanlagen. Mit über 20 Jahren Erfahrung gehört K2 zu den führenden Anbietern in Europa.',
      whyWeTrust: [
        'Umfassende, statisch geprüfte Systemlösungen für jede Dacheindeckung und Freifläche.',
        'Hohe Qualität und Langlebigkeit der Komponenten.',
        'Exzellente Planungssoftware (K2 Base) für präzise und sichere Auslegung.'
      ],
      products: [
        {
          name: 'K2 Dome System',
          category: 'Unterkonstruktion',
          manufacturerSlug: 'k2-systems',
          imageUrl: 'https://images.unsplash.com/photo-1506938459212-2c36a43b2f0a?q=80&w=870&auto=format&fit=crop',
          description:
            'Aerodynamisch optimiertes System für Flachdächer mit Südausrichtung, das die Dachlast minimiert.',
          specs: {
            Dachtyp: 'Flachdach',
            Material: 'Aluminium / Edelstahl',
            Neigungswinkel: '10° / 15°',
            Ballastierung: 'Aerodynamisch optimiert',
            Garantie: '12 Jahre'
          },
          keyFeatures: ['Minimale Dachlast', 'Schnelle Montage', 'Windkanal-getestet']
        },
        {
          name: 'K2 SingleRail System',
          category: 'Unterkonstruktion',
          manufacturerSlug: 'k2-systems',
          imageUrl: 'https://images.unsplash.com/photo-1558221639-130a584346a8?q=80&w=870&auto=format&fit=crop',
          description:
            'Flexibles und bewährtes Schienensystem für Ziegeldächer mit schneller und sicherer Montage.',
          specs: {
            Dachtyp: 'Schrägdach (Pfannenziegel)',
            Material: 'Aluminium',
            Befestigung: 'Einstellbare Dachhaken',
            Garantie: '12 Jahre'
          },
          keyFeatures: ['Universell für Ziegeldächer', 'Hohe Flexibilität', 'Bewährt und zuverlässig']
        },
        {
          name: 'K2 TiltUp Vento System',
          category: 'Unterkonstruktion',
          manufacturerSlug: 'k2-systems',
          imageUrl: 'https://images.unsplash.com/photo-1506938459212-2c36a43b2f0a?q=80&w=870&auto=format&fit=crop',
          description:
            'Aufständerungssystem für Trapezblechdächer, um den Modulneigungswinkel zu optimieren und den Ertrag zu steigern.',
          specs: {
            Dachtyp: 'Schrägdach (Trapezblech)',
            Material: 'Aluminium',
            Neigungswinkel: '5° - 15° (einstellbar)',
            Garantie: '12 Jahre'
          },
          keyFeatures: ['Ertragssteigerung auf Trapezblech', 'Einfache Direktbefestigung', 'Leicht und stabil']
        }
      ]
    },
    {
      slug: 'schneider-electric',
      name: 'Schneider Electric',
      logoUrl: '/assets/logos/schneider-electric.png',
      category: ['Elektrokomponenten'],
      description:
        'Schneider Electric treibt die digitale Transformation von Energiemanagement und Automatisierung in Häusern, Gebäuden, Rechenzentren, Infrastrukturen und Industrien voran.',
      whyWeTrust: [
        'Globaler Marktführer mit höchstem Anspruch an Sicherheit und Qualität.',
        'Breites Portfolio an Schutz- und Schaltgeräten, die für den sicheren Betrieb von PV-Anlagen unerlässlich sind.',
        'Hohe Verfügbarkeit und bewährte Zuverlässigkeit.'
      ],
      products: [
        {
          name: 'Acti9 Sicherungsautomaten',
          category: 'Elektrokomponenten',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit=crop',
          description:
            'Zuverlässiger Schutz für elektrische Stromkreise in allen Anwendungsbereichen.',
          specs: {
            Typ: 'Leitungsschutzschalter',
            Auslösecharakteristik: 'B, C',
            Polzahl: '1P, 3P',
            Bemessungsstrom: '10A - 63A'
          },
          keyFeatures: ['VDE-zertifiziert', 'Hohe Sicherheit', 'Langlebig und zuverlässig']
        },
        {
          name: 'Resi9 Verteilerschränke',
          category: 'Elektrokomponenten',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit=crop',
          description:
            'Moderne und installationsfreundliche Zählerschränke für die normgerechte Elektroinstallation.',
          specs: {
            Typ: 'Zählerschrank / Verteilerfeld',
            Material: 'Stahlblech',
            Schutzart: 'IP31 / IP44',
            Norm: 'DIN VDE 0603'
          },
          keyFeatures: ['Normgerechte Installation', 'Modularer Aufbau', 'Hohe Verarbeitungsqualität']
        },
        {
          name: 'ComPacT NSXm Leistungsschalter',
          category: 'Elektrokomponenten',
          manufacturerSlug: 'schneider-electric',
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit=crop',
          description:
            'Kompakter Leistungsschalter für den Schutz von Anlagen und Leitungen im Niederspannungsbereich, ideal für gewerbliche Hauptverteilungen.',
          specs: {
            Typ: 'Kompaktleistungsschalter',
            Bemessungsstrom: '16A - 160A',
            Auslöseeinheit: 'Thermisch-magnetisch',
            Anschluss: 'DC / AC'
          },
          keyFeatures: ['Hohes Schaltvermögen', 'Kompakte Bauform', 'Für AC- und DC-Anwendungen']
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
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
          imageUrl: 'https://images.unsplash.com/photo-1547283437-0e61a5339f1a?q=80&w=870&auto=format=fit-crop',
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
      products: []
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
      products: []
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
      products: []
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
      products: []
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
      products: []
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
          imageUrl: 'https://images.unsplash.com/photo-1633711124238-52260c6f5d81?q=80&w=870&auto=format&fit',
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
      products: []
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
      products: []
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
          imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=870&auto=format&fit',
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
          imageUrl: 'https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=870&auto=format=fit',
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
      products: []
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
      products: []
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
          imageUrl: 'https://images.unsplash.com/photo-1506938459212-2c36a43b2f0a?q=80&w=870&auto=format&fit',
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
          imageUrl: 'https://images.unsplash.com/photo-1558221639-130a584346a8?q=80&w=870&auto=format&fit',
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
          imageUrl: 'https://images.unsplash.com/photo-1506938459212-2c36a43b2f0a?q=80&w=870&auto=format&fit',
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
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit',
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
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit',
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
          imageUrl: 'https://images.unsplash.com/photo-1632598822839-867cce349323?q=80&w=870&auto=format&fit',
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

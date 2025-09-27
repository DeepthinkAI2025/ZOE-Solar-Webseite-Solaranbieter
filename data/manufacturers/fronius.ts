import { Manufacturer } from '../productTypes';

export const fronius: Manufacturer = {
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
    };

export default fronius;

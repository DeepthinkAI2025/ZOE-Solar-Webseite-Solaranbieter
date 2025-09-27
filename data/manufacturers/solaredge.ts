import { Manufacturer } from '../productTypes';

export const solaredge: Manufacturer = {
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
    };

export default solaredge;

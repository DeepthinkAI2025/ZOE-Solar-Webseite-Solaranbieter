import { Manufacturer } from '../productTypes';

export const schneider_electric: Manufacturer = {
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
    };

export default schneider_electric;

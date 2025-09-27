import { Manufacturer } from '../productTypes';

export const k2_systems: Manufacturer = {
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
    };

export default k2_systems;

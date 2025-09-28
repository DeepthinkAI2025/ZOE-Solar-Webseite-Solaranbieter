import { Manufacturer } from '../productTypes';

export const jinko_solar: Manufacturer = {
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
    };

export default jinko_solar;

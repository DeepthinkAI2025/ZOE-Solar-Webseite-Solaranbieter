import { Manufacturer } from '../productTypes';

export const lg_energy_solution: Manufacturer = {
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
    };

export default lg_energy_solution;

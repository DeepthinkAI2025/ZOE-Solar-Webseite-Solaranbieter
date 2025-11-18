import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

interface ProjectGalleryProps {
  customerType?: 'private' | 'business';
  setPage: (page: Page) => void;
}

// Professionelle Solar-Stockfotos - realistisch und hochwertig
const professionalSolarImages = {
  // Balkonkraftwerke - moderne, authentische Aufnahmen
  balconyKits: [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554469384-e58e16c9b4bc?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop'
  ],
  // Dachanlagen - professionelle Montageaufnahmen
  rooftopSolar: [
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop'
  ],
  // Carports - moderne Überdachungen mit Solar
  carports: [
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554469384-e58e16c9b4bc?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop'
  ],
  // Gewerbe - große Solaranlagen
  commercial: [
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop'
  ],
  // Speicher & Smart Home
  storage: [
    'https://images.unsplash.com/photo-1581093458791-9d3a6ea6b8ac?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554469384-e58e16c9b4bc?q=80&w=2070&auto=format&fit=crop'
  ]
};

const projectData = {
  private: {
    badge: 'Privatkunden Projekte',
    title: 'Ihre Solarzukunft',
    subtitle: 'Entdecken Sie erfolgreiche Solarprojekte für Privathaushalte – von der Balkonanlage bis zur kompletten Dachsanierung.',
    categories: [
      {
        name: 'Balkonkraftwerke',
        icon: '🏠',
        projects: [
          {
            title: 'Einfamilienhaus Potsdam',
            location: 'Potsdam, Brandenburg',
            power: '800 Wp',
            savings: '€ 180/Jahr',
            imageUrl: professionalSolarImages.balconyKits[0],
            description: 'Moderne Balkonanlage mit optimierter Süd-Ausrichtung für maximale Energiegewinnung in der brandenburgischen Landeshauptstadt.'
          },
          {
            title: 'Mehrfamilienhaus Cottbus',
            location: 'Cottbus, Brandenburg',
            power: '2.4 kWp Gesamt',
            savings: '€ 480/Jahr',
            imageUrl: professionalSolarImages.balconyKits[1],
            description: 'Gemeinschaftliches Mieterstromprojekt mit fairer Kostenverteilung für 8 Wohneinheiten in der Energiestadt Cottbus.'
          },
          {
            title: 'Stadthaus Brandenburg/Havel',
            location: 'Brandenburg an der Havel',
            power: '600 Wp + 3 kWh Speicher',
            savings: '€ 220/Jahr',
            imageUrl: professionalSolarImages.balconyKits[2],
            description: 'Modulare Lösung mit Batteriespeicher für autarke Stromversorgung in der ältesten Stadt Brandenburgs.'
          }
        ]
      },
      {
        name: 'Dachsanierungen',
        icon: '🏠',
        projects: [
          {
            title: 'Komplette Dachsanierung Oranienburg',
            location: 'Oranienburg, Brandenburg',
            power: '12 kWp',
            savings: '€ 2.400/Jahr',
            imageUrl: professionalSolarImages.rooftopSolar[0],
            description: 'Vollständige Dachsanierung eines Einfamilienhauses mit integrierter Photovoltaik-Anlage und Optimierung der Statik.'
          },
          {
            title: 'Aufdachanlage Falkensee',
            location: 'Falkensee, Brandenburg',
            power: '8 kWp',
            savings: '€ 1.600/Jahr',
            imageUrl: professionalSolarImages.rooftopSolar[1],
            description: 'Professionelle Montage auf bestehender Dachkonstruktion ohne statische Veränderungen in der Havelseestadt.'
          },
          {
            title: 'Dachmodernisierung Bernau',
            location: 'Bernau bei Berlin, Brandenburg',
            power: '15 kWp',
            savings: '€ 3.000/Jahr',
            imageUrl: professionalSolarImages.rooftopSolar[2],
            description: 'Kombinierte Dachsanierung mit Photovoltaik und verbesserter Wärmedämmung nahe der Bundeshauptstadt.'
          }
        ]
      },
      {
        name: 'Solar-Carports',
        icon: '🏠',
        projects: [
          {
            title: 'Einfamilienhaus Carport Neuruppin',
            location: 'Neuruppin, Brandenburg',
            power: '6 kWp',
            savings: '€ 1.200/Jahr',
            imageUrl: professionalSolarImages.carports[0],
            description: 'Überdachter Stellplatz mit integrierter Photovoltaik für Elektroauto und Haushalt in der Fontanestadt.'
          },
          {
            title: 'Doppel-Carport mit Speicher Eberswalde',
            location: 'Eberswalde, Brandenburg',
            power: '12 kWp + 10 kWh Speicher',
            savings: '€ 2.800/Jahr',
            imageUrl: professionalSolarImages.carports[1],
            description: 'Premium-Lösung mit Batteriespeicher für maximale Autarkie und zwei Fahrzeuge in der Klimastadt Eberswalde.'
          },
          {
            title: 'Urbaner Carport Frankfurt/Oder',
            location: 'Frankfurt (Oder), Brandenburg',
            power: '8 kWp',
            savings: '€ 1.800/Jahr',
            imageUrl: professionalSolarImages.carports[2],
            description: 'Raumsparende Lösung für städtische Grundstücke mit intelligenter Ladetechnologie und Stromspeicherung.'
          }
        ]
      }
    ]
  },
  business: {
    badge: 'Gewerbekunden Projekte',
    title: 'Unternehmenslösungen',
    subtitle: 'Professionelle Solaranlagen für Gewerbe, Landwirtschaft und Industrie – maßgeschneidert für maximale Rentabilität.',
    categories: [
      {
        name: 'Gewerbegebäude',
        icon: '🏢',
        projects: [
          {
            title: 'Produktionshalle Königs Wusterhausen',
            location: 'Königs Wusterhausen, Brandenburg',
            power: '250 kWp',
            savings: '€ 45.000/Jahr',
            imageUrl: professionalSolarImages.commercial[0],
            description: 'Großflächige Dachinstallation für Metallverarbeitungsbetrieb mit 30% Eigenverbrauch und Netzdienlichkeit.'
          },
          {
            title: 'Logistikzentrum Ludwigsfelde',
            location: 'Ludwigsfelde, Brandenburg',
            power: '180 kWp',
            savings: '€ 32.000/Jahr',
            imageUrl: professionalSolarImages.commercial[1],
            description: 'Industrielle Dachsanierung mit Photovoltaik für Speditionsunternehmen am Autobahnkreuz.'
          },
          {
            title: 'Bürokomplex Potsdam',
            location: 'Potsdam, Brandenburg',
            power: '120 kWp + 50 kWh Speicher',
            savings: '€ 22.000/Jahr',
            imageUrl: professionalSolarImages.commercial[2],
            description: 'Premium-Lösung für moderne Büroarchitektur mit intelligenter Energiesteuerung und Notstromfunktion.'
          }
        ]
      },
      {
        name: 'Landwirtschaft',
        icon: '🌾',
        projects: [
          {
            title: 'Milchviehbetrieb Prignitz',
            location: 'Perleberg, Brandenburg',
            power: '450 kWp',
            savings: '€ 85.000/Jahr',
            imageUrl: professionalSolarImages.commercial[0],
            description: 'Freiflächenanlage auf Agrarfläche mit Agri-PV-Technologie und Doppelnutzung für Landwirtschaft.'
          },
          {
            title: 'Obstgut Oder-Spree',
            location: 'Bad Saarow, Brandenburg',
            power: '320 kWp',
            savings: '€ 58.000/Jahr',
            imageUrl: professionalSolarImages.commercial[1],
            description: 'Dachinstallation auf Lager- und Verkaufsflächen mit Direktverbrauch für Kühlung und Sortieranlagen.'
          },
          {
            title: 'Ackerbaubetrieb Uckermark',
            location: 'Prenzlau, Brandenburg',
            power: '680 kWp',
            savings: '€ 125.000/Jahr',
            imageUrl: professionalSolarImages.commercial[2],
            description: 'Freiflächenanlage mit 1.200 Module auf 3,5 Hektar für maximalen Ertrag und Landwirtschaftsflächen-Optimierung.'
          }
        ]
      },
      {
        name: 'Industrie & Handwerk',
        icon: '🏭',
        projects: [
          {
            title: 'Metallbau-Firma Brandenburg',
            location: 'Brandenburg an der Havel',
            power: '380 kWp',
            savings: '€ 68.000/Jahr',
            imageUrl: professionalSolarImages.storage[0],
            description: 'Großanlage mit intelligenter Lastverschiebung für energieintensive Produktion und Überbrückung von Spitzenlasten.'
          },
          {
            title: 'Schreinerei Eberswalde',
            location: 'Eberswalde, Brandenburg',
            power: '95 kWp + 40 kWh Speicher',
            savings: '€ 18.000/Jahr',
            imageUrl: professionalSolarImages.storage[1],
            description: 'Holzverarbeitungsbetrieb mit hoher Eigenverbrauchsquote und batteriegestützter Notstromversorgung.'
          },
          {
            title: 'Baugruppe Cottbus',
            location: 'Cottbus, Brandenburg',
            power: '220 kWp',
            savings: '€ 38.000/Jahr',
            imageUrl: professionalSolarImages.storage[2],
            description: 'Handwerksbetrieb mit bedarfsgerechter Dimensionierung und Integration von E-Mobilität für Firmenflotte.'
          }
        ]
      }
    ]
  }
};

const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  customerType = 'private',
  setPage
}) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentData = projectData[customerType];
  const currentCategory = currentData.categories[selectedCategory];

  // Smooth scroll functionality
  const scrollToProjects = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Width of project card + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll on category change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    setSelectedProject(null);
  }, [selectedCategory]);

  return (
    <section id="projects" className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full text-green-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            {currentData.badge}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {currentData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {currentData.subtitle}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {currentData.categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(index)}
                className={`
                  px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 whitespace-nowrap
                  ${selectedCategory === index
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="mr-3 text-xl">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Container */}
        <div className="relative group">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 rounded-l-2xl opacity-90 pointer-events-none transition-opacity duration-300 group-hover:opacity-100"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 rounded-r-2xl opacity-90 pointer-events-none transition-opacity duration-300 group-hover:opacity-100"></div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scrollToProjects('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 text-gray-400 hover:text-green-600 hover:border-green-300 hover:bg-green-50 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollToProjects('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-4 text-gray-400 hover:text-green-600 hover:border-green-300 hover:bg-green-50 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Projects Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentCategory.projects.map((project, index) => (
              <div
                key={`${currentCategory.name}-${index}`}
                className={`
                  relative flex-none w-80 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform
                  ${selectedProject === index ? 'ring-4 ring-green-500 scale-[1.02] translate-y-[-4px]' : 'hover:scale-[1.01] hover:translate-y-[-2px]'}
                `}
                onClick={() => setSelectedProject(index)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-700"
                  />

                  {/* Power Badge */}
                  <div className="absolute top-6 right-6 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {project.power}
                  </div>

                  {/* Location */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center space-x-2 text-base">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-green-800 text-base font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Ersparnis</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900 mt-2">{project.savings}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2 text-blue-800 text-base font-semibold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Leistung</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900 mt-2">{project.power}</div>
                    </div>
                  </div>

                  {/* Project Link */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                      Projekt Details →
                    </button>
                  </div>
                </div>

                {/* Selected Indicator */}
                {selectedProject === index && (
                  <div className="absolute top-6 left-6">
                    <div className="bg-green-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      <span>Ausgewählt</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Ihr Projekt, unsere Expertise
            </h3>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Jedes Projekt ist einzigartig – wie unsere Kunden. Erhalten Sie eine
              professionelle Analyse und maßgeschneiderte Lösung für Ihre Solaranlagen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setPage('contact')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-[1.05]"
              >
                Beratung vereinbaren
              </button>
              <button
                onClick={() => setPage('photovoltaik')}
                className="bg-white border-2 border-gray-300 text-gray-800 px-10 py-5 rounded-2xl font-bold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mehr erfahren
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
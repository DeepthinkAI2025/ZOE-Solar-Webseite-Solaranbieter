import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';

interface ProjectGalleryProps {
  customerType?: 'private' | 'business';
  setPage: (page: Page) => void;
}

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
            imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Moderne Balkonanlage mit optimierter Süd-Ausrichtung für maximale Energiegewinnung in der brandenburgischen Landeshauptstadt.'
          },
          {
            title: 'Mehrfamilienhaus Cottbus',
            location: 'Cottbus, Brandenburg',
            power: '2.4 kWp Gesamt',
            savings: '€ 480/Jahr',
            imageUrl: 'https://images.pexels.com/photos/356049/pexels-photo-356049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Gemeinschaftliches Mieterstromprojekt mit fairer Kostenverteilung für 8 Wohneinheiten in der Energiestadt Cottbus.'
          },
          {
            title: 'Stadthaus Brandenburg/Havel',
            location: 'Brandenburg an der Havel',
            power: '600 Wp + 3 kWh Speicher',
            savings: '€ 220/Jahr',
            imageUrl: 'https://images.pexels.com/photos/371917/pexels-photo-371917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
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
            imageUrl: 'https://images.pexels.com/photos/137602/pexels-photo-137602.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Vollständige Dachsanierung eines Einfamilienhauses mit integrierter Photovoltaik-Anlage und Optimierung der Statik.'
          },
          {
            title: 'Aufdachanlage Falkensee',
            location: 'Falkensee, Brandenburg',
            power: '8 kWp',
            savings: '€ 1.600/Jahr',
            imageUrl: 'https://images.pexels.com/photos/2800845/pexels-photo-2800845.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Professionelle Montage auf bestehender Dachkonstruktion ohne statische Veränderungen in der Havelseestadt.'
          },
          {
            title: 'Dachmodernisierung Bernau',
            location: 'Bernau bei Berlin, Brandenburg',
            power: '15 kWp',
            savings: '€ 3.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/159243/pexels-photo-159243.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
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
            imageUrl: 'https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Überdachter Stellplatz mit integrierter Photovoltaik für Elektroauto und Haushalt in der Fontanestadt.'
          },
          {
            title: 'Doppel-Carport mit Speicher Eberswalde',
            location: 'Eberswalde, Brandenburg',
            power: '12 kWp + 10 kWh Speicher',
            savings: '€ 2.800/Jahr',
            imageUrl: 'https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Premium-Lösung mit Batteriespeicher für maximale Autarkie und zwei Fahrzeuge in der Klimastadt Eberswalde.'
          },
          {
            title: 'Urbaner Carport Frankfurt/Oder',
            location: 'Frankfurt (Oder), Brandenburg',
            power: '8 kWp',
            savings: '€ 1.800/Jahr',
            imageUrl: 'https://images.pexels.com/photos/4148472/pexels-photo-4148472.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            description: 'Architektonisch anspruchsvolle Lösung für städtische Einfamilienhäuser in der Universitätsstadt an der Oder.'
          }
        ]
      }
    ]
  },
  business: {
    badge: 'Gewerbliche Referenzen',
    title: 'Branchenführende Lösungen',
    subtitle: 'Erfolgreiche Großprojekte für Unternehmen – von der Produktionshalle bis zum Solarpark. Maßgeschneiderte Lösungen für maximale Wirtschaftlichkeit.',
    categories: [
      {
        name: 'Industrie & Produktion',
        icon: '🏭',
        projects: [
          {
            title: 'Logistikzentrum Dachsanierung Schwedt',
            location: 'Schwedt/Oder, Brandenburg',
            power: '1.2 MWp',
            savings: '€ 250.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/4320449/pexels-photo-4320449.jpeg',
            description: 'Komplette Dachsanierung eines 15.000 m² Logistikzentrums mit integrierter Photovoltaik-Anlage im Industriepark Schwedt.'
          },
          {
            title: 'Produktionshalle Erweiterung Eisenhüttenstadt',
            location: 'Eisenhüttenstadt, Brandenburg',
            power: '950 kWp',
            savings: '€ 240.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/4320480/pexels-photo-4320480.jpeg',
            description: 'Erweiterung der Produktionskapazitäten mit gleichzeitiger Dachbegrünung und Photovoltaik im Stahl- und Industriezentrum.'
          },
          {
            title: 'Kühlhaus Energieoptimierung Luckenwalde',
            location: 'Luckenwalde, Brandenburg',
            power: '1.5 MWp',
            savings: '€ 330.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/15751124/pexels-photo-15751124.jpeg',
            description: 'Spezialisierte Lösung für energieintensive Kühlhäuser mit optimierter Lastverteilung in der Zossener Stadt.'
          }
        ]
      },
      {
        name: 'Solarparks & Freiflächen',
        icon: '🌾',
        projects: [
          {
            title: 'Solarpark Lieberose',
            location: 'Lieberose, Brandenburg',
            power: '71 MWp',
            savings: '€ 8.500.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/6572421/pexels-photo-6572421.jpeg',
            description: 'Einer der größten Solarparks Brandenburgs mit innovativer Agri-PV-Technologie und regionaler Wertschöpfung.'
          },
          {
            title: 'Solarpark Finowfurt',
            location: 'Finowfurt, Brandenburg',
            power: '17 MWp',
            savings: '€ 2.000.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/11679511/pexels-photo-11679511.jpeg',
            description: 'Moderne Freiflächenanlage mit optimierter Ausrichtung und minimaler Flächeninanspruchnahme nahe Eberswalde.'
          },
          {
            title: 'Solarpark Schönefeld',
            location: 'Schönefeld, Brandenburg',
            power: '25 MWp',
            savings: '€ 3.200.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/15751124/pexels-photo-15751124.jpeg',
            description: 'Großflächige Anlage mit Bürgerbeteiligung und regionaler Wertschöpfung im Berliner Umland.'
          }
        ]
      },
      {
        name: 'Handel & Dienstleistung',
        icon: '🏪',
        projects: [
          {
            title: 'Einkaufszentrum Carport Fürstenwalde',
            location: 'Fürstenwalde/Spree, Brandenburg',
            power: '750 kWp',
            savings: '€ 175.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/4460686/pexels-photo-4460686.jpeg',
            description: 'Überdachung von 200 Parkplätzen mit integrierter Photovoltaik für Kundenbindung im Spreestadion.'
          },
          {
            title: 'Hotelkomplex Dachsanierung Bad Saarow',
            location: 'Bad Saarow, Brandenburg',
            power: '300 kWp',
            savings: '€ 72.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/2098782/pexels-photo-2098782.jpeg',
            description: 'Nachhaltige Modernisierung mit Fokus auf Energieeffizienz und Gästezufriedenheit am Scharmützelsee.'
          },
          {
            title: 'Bürogebäude Sanierung Königs Wusterhausen',
            location: 'Königs Wusterhausen, Brandenburg',
            power: '1.1 MWp',
            savings: '€ 290.000/Jahr',
            imageUrl: 'https://images.pexels.com/photos/256148/pexels-photo-256148.jpeg',
            description: 'Komplette Gebäudesanierung mit Photovoltaik und optimierter Energiemanagement in der Dahlwitzer Stadt.'
          }
        ]
      }
    ]
  }
};

// Professional Metric Component
const ProjectMetric: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/60">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Professional Category Card
const CategoryCard: React.FC<{
  category: typeof projectData.private.categories[0];
  isActive: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}> = ({ category, isActive, onClick, onMouseEnter, onMouseLeave }) => (
  <button
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 text-left border-2 ${
      isActive
        ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
        : 'border-gray-200 bg-white hover:border-green-200 hover:shadow-md'
    }`}
  >
    <div className="relative">
      <div className={`text-2xl mb-3 transition-colors ${
        isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'
      }`}>
        {category.icon}
      </div>
      <h3 className={`text-lg font-bold mb-2 transition-colors ${
        isActive ? 'text-green-800' : 'text-gray-900 group-hover:text-green-700'
      }`}>
        {category.name}
      </h3>
      <p className={`text-sm transition-colors ${
        isActive ? 'text-green-600' : 'text-gray-600 group-hover:text-green-500'
      }`}>
        {category.projects.length} Projekte
      </p>
    </div>
  </button>
);

// Professional Project Card
const ProjectCard: React.FC<{
  project: typeof projectData.private.categories[0]['projects'][0];
  onClick: () => void;
}> = ({ project, onClick }) => (
  <div
    onClick={onClick}
    className="group cursor-pointer bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={project.imageUrl}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>

    <div className="p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-gray-600 font-medium">{project.location}</p>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-6 line-clamp-2">
        {project.description}
      </p>

      <div className="space-y-3">
        <ProjectMetric
          label="Installierte Leistung"
          value={project.power}
          icon={
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <ProjectMetric
          label="Jährliche Einsparung"
          value={project.savings}
          icon={
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" />
            </svg>
          }
        />
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Details ansehen</span>
          <svg className="w-5 h-5 text-green-600 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ customerType = 'private', setPage }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentData = projectData[customerType] || projectData.private;
  const currentCategory = currentData.categories[activeCategory];

  const handleProjectClick = () => {
    setPage('projekte');
  };

  // Auto-advance functionality
  useEffect(() => {
    const startAutoAdvance = () => {
      intervalRef.current = setInterval(() => {
        setActiveCategory((prev) => (prev + 1) % currentData.categories.length);
      }, 4000); // 4 seconds
    };

    const stopAutoAdvance = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isHovered) {
      startAutoAdvance();
    } else {
      stopAutoAdvance();
    }

    return () => stopAutoAdvance();
  }, [isHovered, currentData.categories.length]);

  // Start auto-advance on mount
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setActiveCategory((prev) => (prev + 1) % currentData.categories.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentData.categories.length]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-green-200/8 to-emerald-200/5 blur-[200px]" />
        <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-200/6 to-indigo-200/3 blur-[180px]" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-200/4 to-pink-200/2 blur-[160px]" />
        <div className="absolute top-3/4 left-1/4 h-[300px] w-[300px] rounded-full bg-white/20 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Professional Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 mb-8 shadow-sm">
            <div className="p-1.5 rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              {currentData.badge}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 leading-tight mb-6">
            {currentData.title}
          </h2>

          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
            {currentData.subtitle}
          </p>
        </div>

        {/* Professional Category Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {currentData.categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              category={category}
              isActive={activeCategory === index}
              onClick={() => setActiveCategory(index)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}
        </div>

        {/* Professional Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {currentCategory.projects.map((project, index) => (
            <ProjectCard
              key={`${currentCategory.name}-${index}`}
              project={project}
              onClick={handleProjectClick}
            />
          ))}
        </div>

        {/* Professional CTA Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/60">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ihr Projekt wartet auf Sie
            </h3>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Lassen Sie uns gemeinsam Ihre Solarlösung planen. Von der ersten Beratung bis zur schlüsselfertigen Übergabe – wir begleiten Sie durch jeden Schritt.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setPage('kontakt')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Projekt anfragen
              </button>

              <button
                onClick={() => setPage('projekte')}
                className="border-2 border-gray-300 text-gray-700 font-bold py-4 px-8 rounded-2xl hover:border-green-300 hover:text-green-700 transition-all duration-300"
              >
                Alle Projekte ansehen
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
                  <div className="text-sm text-gray-600">Abgeschlossene Projekte</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Kundenzufriedenheit</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 mb-1">10+</div>
                  <div className="text-sm text-gray-600">Jahre Erfahrung</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectGallery;
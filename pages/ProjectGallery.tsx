import React, { useState, useMemo } from 'react';
import { Page } from '../types';

interface ProjectGalleryProps {
  setPage: (page: Page) => void;
}

const projects = [
  // Dachanlagen
  {
    title: 'Großflächige Dachanlage für Logistik-Hub',
    category: 'Dachanlage',
    imageUrl: 'https://images.unsplash.com/photo-1599454100913-b903e12a4459?q=80&w=1932&auto=format&fit=crop',
    power: '1.2 MWp',
    benefit: 'ca. 250.000 € Ersparnis/Jahr',
  },
  {
    title: 'Energieintensive Kühlhaus-Versorgung',
    category: 'Dachanlage',
    imageUrl: 'https://images.unsplash.com/photo-1665431168114-7225b2e04e7b?q=80&w=2070&auto=format&fit=crop',
    power: '950 kWp',
    benefit: 'ca. 240.000 € Ersparnis/Jahr',
  },
  {
    title: 'Hochleistungsanlage für Produktionshalle',
    category: 'Dachanlage',
    imageUrl: 'https://images.unsplash.com/photo-1558221639-130a584346a8?q=80&w=2070&auto=format&fit=crop',
    power: '1.5 MWp',
    benefit: 'ca. 330.000 € Ersparnis/Jahr',
  },
  // Freiflächenanlagen
  {
    title: 'Flächenoptimierung für Agrarbetrieb',
    category: 'Agri-PV & Landwirtschaft',
    imageUrl: 'https://images.unsplash.com/photo-1621243804936-775306a8f2e3?q=80&w=2070&auto=format&fit=crop',
    power: '800 kWp',
    benefit: 'ca. 120.000 € Einnahmen/Jahr',
  },
  {
    title: 'Multi-Megawatt Solarpark auf Konversionsfläche',
    category: 'Kommunen & Industrie',
    imageUrl: 'https://images.unsplash.com/photo-1508235281165-a88981b2484a?q=80&w=2071&auto=format&fit=crop',
    power: '5 MWp',
    benefit: 'ca. 475.000 € Einnahmen/Jahr',
  },
  {
    title: 'Regionaler Energiepark',
    category: 'Kommunen & Industrie',
    imageUrl: 'https://images.unsplash.com/photo-1596371801258-a833216b251a?q=80&w=2070&auto=format&fit=crop',
    power: '2.5 MWp',
    benefit: 'ca. 240.000 € Einnahmen/Jahr',
  },
  // Solar-Carports
  {
    title: 'Solar-Carport für Handelsfiliale',
    category: 'Solar-Carport',
    imageUrl: 'https://images.unsplash.com/photo-1666209593430-349f7a778b7b?q=80&w=1974&auto=format&fit=crop',
    power: '300 kWp',
    benefit: 'ca. 72.000 € Ersparnis/Jahr',
  },
  {
    title: 'Umfassende Parkplatz-Überdachung für Firmenzentrale',
    category: 'Solar-Carport',
    imageUrl: 'https://images.unsplash.com/photo-1695425251109-c454e1a17686?q=80&w=2070&auto=format&fit=crop',
    power: '750 kWp',
    benefit: 'ca. 175.000 € Ersparnis/Jahr',
  },
  {
    title: 'Parkhaus-Überdachung im urbanen Raum',
    category: 'Solar-Carport',
    imageUrl: 'https://images.unsplash.com/photo-1647551003669-1e35dd05b63a?q=80&w=2070&auto=format&fit=crop',
    power: '1.1 MWp',
    benefit: 'ca. 290.000 € Ersparnis/Jahr',
  },
  // Ladestationen
  {
    title: 'High-Power-Charging Hub an Verkehrsknotenpunkt',
    category: 'Ladestationen',
    imageUrl: 'https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=1974&auto=format&fit=crop',
    power: '16 HPC-Ladepunkte',
    benefit: 'Fördert E-Mobilität & Kundenbindung',
  },
  {
    title: 'Ladeinfrastruktur für Wohnquartier',
    category: 'Ladestationen',
    imageUrl: 'https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=2070&auto=format&fit=crop',
    power: '40 AC-Ladepunkte',
    benefit: 'Steigert Immobilienwert & Komfort',
  },
  {
    title: 'Betriebshof-Elektrifizierung für E-Flotte',
    category: 'Ladestationen',
    imageUrl: 'https://images.unsplash.com/photo-1632833252069-e325239a7a6c?q=80&w=2070&auto=format&fit=crop',
    power: '32 DC-Ladepunkte',
    benefit: 'Senkt Betriebskosten der Flotte',
  },
  // Balkonkraftwerke
  {
    title: 'Mieterstrom-Lösung für Wohnanlage',
    category: 'Balkonkraftwerke',
    imageUrl: 'https://images.unsplash.com/photo-1690553128039-382901700b0e?q=80&w=1964&auto=format&fit=crop',
    power: '800 Wp pro Einheit',
    benefit: 'Reduziert Stromrechnung der Mieter',
  },
  {
    title: 'Ästhetische Lösung für Stadthaus',
    category: 'Balkonkraftwerke',
    imageUrl: 'https://images.unsplash.com/photo-1684572993881-c423bb0b40a3?q=80&w=1974&auto=format&fit=crop',
    power: '600 Wp mit Speicher',
    benefit: 'Direkte Ersparnis für Eigentümer',
  },
  {
    title: 'Genossenschaftliches Energie-Projekt',
    category: 'Balkonkraftwerke',
    imageUrl: 'https://images.unsplash.com/photo-1687891244439-93a84b06bd9c?q=80&w=1974&auto=format&fit=crop',
    power: 'Mieterstrom-Modell',
    benefit: 'Stärkt Gemeinschaft & Nachhaltigkeit',
  },
];


const StatIcon: React.FC<{ type: 'power' | 'benefit' }> = ({ type }) => {
    const className = "w-5 h-5 text-green-300";
    if (type === 'power') {
        return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;
};

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ setPage }) => {
    const categories = useMemo(() => [...new Set(projects.map(p => p.category))], []);
    const [activeFilter, setActiveFilter] = useState(categories[0]);
    
    const filteredProjects = useMemo(() => {
        return projects.filter(p => p.category === activeFilter);
    }, [activeFilter]);

    return (
        <section id="projekte" className="py-20 bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 max-w-4xl mx-auto">
                    <p className="font-bold text-green-400 uppercase tracking-wider">Referenzen</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mt-2">Aus Visionen werden Kraftwerke.</h2>
                    <p className="text-lg text-slate-300 mt-4">
                        Einblicke in unsere Referenzprojekte – von der Logistikhalle bis zum Solarpark. Jedes Projekt ein Beleg für Qualität, Effizienz und nachhaltige Rendite.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                                activeFilter === category
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div key={activeFilter} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                         <div key={`${project.title}-${index}`} className="group project-card-stagger relative rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 aspect-[4/5] cursor-pointer" onClick={() => setPage('projekte')}>
                            <img src={project.imageUrl} alt={project.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500 ease-in-out translate-y-36 group-hover:translate-y-0">
                                <p className="font-semibold text-green-300 mb-1 text-sm">{project.category}</p>
                                <h3 className="text-2xl font-bold leading-tight group-hover:text-green-300 transition-colors">{project.title}</h3>
                                
                                <div className="mt-4 pt-4 border-t border-white/20">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <StatIcon type="power" />
                                            <div>
                                                <p className="text-xs text-slate-300">Leistung</p>
                                                <p className="font-bold text-white">{project.power}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <StatIcon type="benefit" />
                                            <div>
                                                <p className="text-xs text-slate-300">Nutzen</p>
                                                <p className="font-bold text-white">{project.benefit}</p>
                                            </div>
                                        </div>
                                    </div>
                                     <div className="mt-4 font-bold text-white">
                                        Mehr erfahren <span className="inline-block transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <button onClick={() => setPage('projekte')} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1 cursor-pointer">
                        Entdecken Sie alle Projekte
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProjectGallery;

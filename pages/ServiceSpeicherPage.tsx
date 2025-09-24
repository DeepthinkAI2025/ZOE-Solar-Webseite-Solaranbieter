import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import { services } from '../data/services';

interface ServiceSpeicherPageProps {
  setPage: (page: Page) => void;
  currentPage: Page;
  bannerHeight: number;
  headerHeight: number;
}

const applications = [
    { title: 'Lastspitzenkappung (Peak Shaving)', description: 'Vermeiden Sie teure Leistungsspitzen, indem Sie kurzfristig hohen Energiebedarf aus Ihrem Speicher decken, anstatt aus dem teuren öffentlichen Netz.', icon: 'peak' },
    { title: 'Eigenverbrauchsoptimierung', description: 'Speichern Sie tagsüber produzierte Solarenergie und nutzen Sie diese, wenn die Sonne nicht scheint, z.B. für Nachtschichten oder Kühlprozesse.', icon: 'consumption' },
    { title: 'Notstromversorgung', description: 'Sichern Sie kritische Unternehmensbereiche gegen Stromausfälle ab und gewährleisten Sie einen unterbrechungsfreien Betrieb.', icon: 'backup' },
    { title: 'Netzdienstleistungen', description: 'Stellen Sie Ihre Speicherkapazität dem Energiemarkt zur Verfügung (Regelenergie) und erschließen Sie sich so eine zusätzliche Einnahmequelle.', icon: 'grid' },
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = 'w-12 h-12 text-green-600';
    switch(name) {
        case 'peak': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0012 3 8.25 8.25 0 006.038 7.048 8.287 8.287 0 019 9.6a8.983 8.983 0 003.362-3.797z" /></svg>;
        case 'consumption': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6.375A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25v6.375A2.25 2.25 0 005.25 18h-1.5z" /></svg>;
        case 'backup': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
        case 'grid': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C4.204 3 3 10.193 3 12c0 1.807 1.204 9 9 9s9-7.193 9-9c0-1.807-1.204-9-9-9z" /></svg>;
    }
    return null;
}

const SpeicherHero: React.FC = () => {
    return (
        <section className="speicher-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
                            Industrielle Speicher
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                           Maximieren Sie Ihre Unabhängigkeit, kappen Sie teure Lastspitzen und sichern Sie Ihre Produktion mit intelligenten Speichersystemen ab.
                        </p>
                    </div>
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1630045623827-73b3202058c1?q=80&w=800&auto=format&fit=crop" alt="Speichercontainer" className="floating-hero-img speicher-hero img-1" />
                            <img src="https://images.unsplash.com/photo-1665431168114-7225b2e04e7b?q=80&w=800&auto=format&fit=crop" alt="Kühlhaus" className="floating-hero-img speicher-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1630045623827-73b3202058c1?q=80&w=800&auto=format&fit=crop" alt="Batteriezellen" className="floating-hero-img speicher-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ServiceSpeicherPage: React.FC<ServiceSpeicherPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChatWithContext = () => {
        const service = services.find(s => s.id === 'solar-speicher-industrie');
        if (service) {
            document.dispatchEvent(new CustomEvent('start-chat-with-service', { detail: service }));
        }
    };
    
    const navItems = [
      { id: 'service-photovoltaik', title: 'Photovoltaik Gewerbe', page: 'service-photovoltaik' as Page },
      { id: 'service-ladeparks', title: 'Ladeparks & E-Mobilität', page: 'service-ladeparks' as Page },
      { id: 'service-speicher', title: 'Industrielle Speicher', page: 'service-speicher' as Page },
    ];

    return (
        <div className="bg-slate-50">
            <div style={{ paddingTop: `${bannerHeight + headerHeight}px` }}>
                <SpeicherHero />
            </div>
            <SubHeader
                navItems={navItems}
                activeItemId={currentPage}
                // FIX: Cast page to Page type to match setPage function signature.
                onItemClick={(id, page) => setPage(page as Page)}
                bannerHeight={bannerHeight}
                headerHeight={headerHeight}
            />
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <main className="max-w-4xl mx-auto space-y-16">
                        {/* Intro */}
                        <section className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Die intelligente Ergänzung zu Ihrer PV-Anlage.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                                Ein industrieller Batteriespeicher ist der Schlüssel zur vollen Ausschöpfung Ihres Solarpotenzials. Er wandelt Ihre PV-Anlage von einem reinen Stromerzeuger in ein intelligentes Kraftwerk um, das Ihnen die Kontrolle über Ihre Energie gibt – wann immer Sie sie brauchen.
                            </p>
                        </section>
                        
                        {/* Applications Section */}
                        <section>
                             <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-slate-900">Vielseitige Anwendungsmöglichkeiten</h2>
                                <p className="text-lg text-slate-600 mt-2">Ein Speicher, viele Vorteile.</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {applications.map(app => (
                                    <div key={app.title} className="bg-white p-8 rounded-lg border border-slate-200 flex items-start gap-6 shadow-md">
                                        <div className="flex-shrink-0 pt-1">
                                            <Icon name={app.icon}/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-1">{app.title}</h3>
                                            <p className="text-slate-600">{app.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Technology Section */}
                        <section className="bg-slate-800 text-white py-16 rounded-lg shadow-lg">
                            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                                <div>
                                     <h2 className="text-3xl font-bold mb-4">Modulare und langlebige Technologie</h2>
                                     <p className="text-slate-300 mb-6">
                                         Wir setzen auf bewährte und sichere Lithium-Eisenphosphat-Technologie (LFP), die für ihre hohe Zyklenfestigkeit und thermische Stabilität bekannt ist. Unsere Speichersysteme sind modular aufgebaut und können jederzeit an Ihren wachsenden Energiebedarf angepasst werden – eine flexible Investition in die Zukunft.
                                     </p>
                                     <ul className="space-y-3">
                                        <li className="flex items-center gap-3"><svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Sichere LFP-Zellchemie</li>
                                        <li className="flex items-center gap-3"><svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Hohe Zyklenlebensdauer</li>
                                        <li className="flex items-center gap-3"><svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>Skalierbar von kWh bis MWh</li>
                                     </ul>
                                </div>
                                <div>
                                    <img src="https://images.unsplash.com/photo-1665431168114-7225b2e04e7b?q=80&w=2070&auto=format&fit=crop" alt="Industrieller Batteriespeicher" loading="lazy" decoding="async" className="rounded-lg shadow-2xl w-full h-auto object-cover aspect-video"/>
                                </div>
                            </div>
                        </section>
                        
                        {/* Intelligent Funnel CTA */}
                        <section className="text-center pt-12 border-t border-slate-200">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Starten Sie Ihre intelligente Bedarfsanalyse</h2>
                            <p className="text-lg text-slate-600 my-4 max-w-3xl mx-auto">
                                Unser KI-Assistent stellt Ihnen einige gezielte Fragen zu Ihrem Stromverbrauch, um die perfekte Speicherlösung für Sie zu finden. Unverbindlich und in nur 2 Minuten.
                            </p>
                            <button onClick={openChatWithContext} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 shadow-xl cta-button-glow transform hover:-translate-y-1">
                                KI-Analyse starten
                            </button>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ServiceSpeicherPage;
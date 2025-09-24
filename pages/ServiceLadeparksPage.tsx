import React from 'react';
import { Page } from '../types';
import SubHeader from '../components/SubHeader';
import { services } from '../data/services';

interface ServiceLadeparksPageProps {
  setPage: (page: Page) => void;
  currentPage: Page;
  bannerHeight: number;
  headerHeight: number;
}

const keyFeatures = [
    { title: 'AC- & DC-Ladelösungen', description: 'Von der Normalladung für Mitarbeiter bis zum High-Power-Charging für Kunden – wir planen die passende Technologie.', icon: 'charging' },
    { title: 'Intelligentes Lastmanagement', description: 'Vermeiden Sie teure Lastspitzen. Unser System verteilt die verfügbare Leistung dynamisch und intelligent auf alle ladebereiten Fahrzeuge.', icon: 'management' },
    { title: 'Skalierbare Infrastruktur', description: 'Unsere Ladelösungen wachsen mit Ihrem Bedarf. Beginnen Sie klein und erweitern Sie Ihren Ladepark jederzeit modular.', icon: 'scalable' },
    { title: 'Backend & Abrechnung', description: 'Wir integrieren professionelle Backend-Systeme für Monitoring, Nutzerverwaltung und flexible Abrechnungsmodelle (z.B. per App, Ladekarte).', icon: 'billing' },
];

const Icon: React.FC<{ name: string }> = ({ name }) => {
    const className = 'w-8 h-8 text-green-600';
    switch(name) {
        case 'charging': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
        case 'management': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>;
        case 'scalable': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;
        case 'billing': return <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m-6 2.25h6M12 9.75l.487.042a1.125 1.125 0 011.013 1.014l.042.487m0 0l-.487-.042a1.125 1.125 0 01-1.013-1.014l-.042-.487m0 0l.487.042a1.125 1.125 0 001.013-1.014l.042-.487m0 0l-.487.042a1.125 1.125 0 00-1.013 1.014l-.042.487m-3.375 9.75c0-1.244 1.006-2.25 2.25-2.25s2.25 1.006 2.25 2.25" /></svg>;
    }
    return null;
}

const LadeparksHero: React.FC = () => {
    return (
        <section className="ladeparks-hero bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6 py-20 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left relative z-10">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tighter">
                            Ladeparks & E-Mobilität
                        </h1>
                        <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                           Positionieren Sie sich als Vorreiter und schaffen Sie eine moderne Ladeinfrastruktur für Fuhrpark, Mitarbeiter und Kunden.
                        </p>
                    </div>
                    <div className="hidden lg:block relative h-96">
                        <div className="absolute inset-0">
                            <img src="https://images.unsplash.com/photo-1675883196884-35805ac51268?q=80&w=800&auto=format&fit=crop" alt="HPC Ladesäule" className="floating-hero-img ladeparks-hero glowing-img img-1" />
                            <img src="https://images.unsplash.com/photo-1633333393122-2c63e2f5b80a?q=80&w=800&auto=format&fit=crop" alt="Wohnquartier Ladepark" className="floating-hero-img ladeparks-hero img-2" />
                            <img src="https://images.unsplash.com/photo-1632833252069-e325239a7a6c?q=80&w=800&auto=format&fit=crop" alt="Betriebshof" className="floating-hero-img ladeparks-hero img-3" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ServiceLadeparksPage: React.FC<ServiceLadeparksPageProps> = ({ setPage, currentPage, bannerHeight, headerHeight }) => {
    const openChatWithContext = () => {
        const service = services.find(s => s.id === 'emob-ladepark-hpc');
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
                <LadeparksHero />
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
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Mehr als nur tanken: Ein Service für die Zukunft.</h2>
                            <p className="text-lg text-slate-600 mt-4">
                                Die Elektromobilität ist keine Zukunftsvision mehr, sie ist Realität. Bieten Sie Ihrem Fuhrpark, Ihren Mitarbeitern und Kunden eine moderne Ladeinfrastruktur und positionieren Sie sich als zukunftsorientiertes Unternehmen. In Kombination mit einer Photovoltaikanlage wird Ihr Ladepark zur profitablen Investition in saubere Energie.
                            </p>
                        </section>

                        {/* Features Section */}
                        <section className="grid md:grid-cols-2 gap-10 items-center">
                            <div>
                                <img src="https://images.unsplash.com/photo-1666209593430-349f7a778b7b?q=80&w=1974&auto=format&fit=crop" alt="Moderner Ladepark" loading="lazy" decoding="async" className="rounded-lg shadow-xl w-full object-cover aspect-video" />
                            </div>
                            <div className="space-y-6">
                                {keyFeatures.map(feature => (
                                    <div key={feature.title} className="flex items-start gap-4">
                                        <div className="flex-shrink-0 bg-green-100 p-3 rounded-full mt-1">
                                            <Icon name={feature.icon}/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800">{feature.title}</h3>
                                            <p className="text-slate-600">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Synergy Section */}
                        <section className="bg-white p-12 rounded-lg border border-slate-200 shadow-md">
                            <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
                               <div className="md:col-span-1 flex justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                               </div>
                               <div className="md:col-span-2">
                                    <h2 className="text-3xl font-bold text-slate-800">Die perfekte Synergie: PV-Anlage + Ladepark</h2>
                                    <p className="text-slate-600 mt-2">
                                        Laden Sie Ihre E-Fahrzeuge direkt mit Ihrem eigenen, sauberen Solarstrom. Das senkt nicht nur Ihre Betriebskosten dramatisch, sondern maximiert auch den Eigenverbrauch Ihrer PV-Anlage und beschleunigt deren Amortisation. Eine Win-Win-Situation für Ökologie und Ökonomie.
                                    </p>
                               </div>
                            </div>
                        </section>

                        {/* Intelligent Funnel CTA */}
                        <section className="text-center pt-12 border-t border-slate-200">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Starten Sie Ihre intelligente Bedarfsanalyse</h2>
                            <p className="text-lg text-slate-600 my-4 max-w-3xl mx-auto">
                                Unser KI-Assistent stellt Ihnen einige gezielte Fragen zu Ihrem Ladebedarf, um die perfekte Lösung für Sie zu finden. Unverbindlich und in nur 2 Minuten.
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

export default ServiceLadeparksPage;